import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { useTween } from './kit/useTween';
import { br } from './kit/format';
import { CHEM_STEPS, PKA_IMIDAZOLE, protonatedFraction } from './ato4/chemContent';
import { CarnosineMolecule } from './ato4/CarnosineMolecule';
import { HalfLifeChart, HarrisBars } from './ato4/ChemCharts';
import { Narration, Shell, Takeaway } from './ato4/shell';
import { Tabs, Tag } from './ato4/ui';

/**
 * Slide 61 "β-alanina + Histidina = Carnosina". Passos: síntese pela CARNS1 · o imidazol captura H⁺ (slider de pH)
 * · a carnosinase do soro corta a carnosina oral · carnosina oral = fonte cara de β-alanina.
 */

const PH_REST = 7.1;
const PH_FATIGUE = 6.5;

interface PhControlProps {
    pH: number;
    onChange: (v: number) => void;
}

/** Slider de pH com a fração de anéis protonados (cálculo por Henderson–Hasselbalch). */
const PhControl = ({ pH, onChange }: PhControlProps) => {
    const frac = protonatedFraction(pH);
    return (
        <div className="grid items-center gap-6 px-3" style={{ gridTemplateColumns: 'minmax(0,1fr) 230px' }}>
            <label className="flex flex-col gap-1">
                <span className="flex justify-between text-[16px] text-gray-200">
                    pH dentro da fibra <span className="font-mono font-semibold" style={{ color: C.acidSoft }}>{br(pH, 2)}</span>
                </span>
                <input type="range" min={PH_FATIGUE} max={PH_REST} step={0.01} value={pH} onChange={e => onChange(Number(e.target.value))}
                    className="w-full cursor-pointer" style={{ accentColor: C.acid, direction: 'rtl' }} />
                <span className="flex justify-between font-mono text-[16px] text-gray-300">
                    <span>7,10 repouso</span><span>pKa {br(PKA_IMIDAZOLE, 2)}</span><span>6,50 exaustão</span>
                </span>
            </label>
            <div className="flex flex-col gap-1">
                <span className="text-[16px] text-gray-300">anéis com H⁺ (cálculo)</span>
                <span className="font-display text-[2rem] leading-none font-semibold" style={{ color: C.acid }}>{Math.round(frac * 100)}%</span>
                <span className="h-[10px] rounded-full bg-white/10 overflow-hidden">
                    <span className="block h-full w-full rounded-full transition-[clip-path] duration-300 ease-(--ease-out)" style={{ clipPath: `inset(0 ${100 - frac * 100}% 0 0 round 5px)`, background: C.acid }} />
                </span>
            </div>
        </div>
    );
};

const CarnosineChemSim = () => {
    const { step, setStep } = useSlideSteps(CHEM_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = CHEM_STEPS[step];
    // Ao entrar no passo 2 o pH desce sozinho de 7,1 a 6,5; arrastar o slider assume o controle.
    const [userPh, setUserPh] = useState<{ step: number; pH: number } | null>(null);
    const manual = userPh?.step === step ? userPh.pH : null;
    const target = step === 1 ? manual ?? PH_FATIGUE : PH_REST;
    const pH = useTween(target, reduce, manual === null ? 2400 : 120);
    const setPh = (v: number) => setUserPh({ step, pH: v });
    const showMolecule = step <= 1;

    return (
        <Shell>
            <div className="flex items-center justify-between gap-4">
                <Tabs labels={CHEM_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato4-chem-tab" />
                <Tag color={C.carnoSoft}>estrutura esquemática</Tag>
            </div>
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '700px minmax(0,1fr)' }}>
                <Panel state="active" glow={step === 1 ? C.acid : C.carno} className="p-3 flex flex-col justify-center gap-2">
                    {showMolecule && (
                        <>
                            <CarnosineMolecule key={step} assemble={step === 0} protonated={step === 1 ? protonatedFraction(pH) : 0} reduce={reduce} />
                            {step === 1 && <PhControl pH={pH} onChange={setPh} />}
                        </>
                    )}
                    {step === 2 && <HalfLifeChart reduce={reduce} />}
                    {step === 3 && <HarrisBars reduce={reduce} />}
                </Panel>
                <Panel className="p-4 flex flex-col gap-3">
                    <Narration stepKey={step} kicker={plan.kicker} title={plan.title} text={plan.text} reduce={reduce} />
                    <div className="mt-auto"><Takeaway stepKey={step} reduce={reduce}>{plan.takeaway}</Takeaway></div>
                </Panel>
            </div>
        </Shell>
    );
};

export default CarnosineChemSim;
