import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { HALF_LIFE_MIN, SHUTTLE_STEPS, remaining } from './ato2/shuttle.content';
import { ShuttleScene } from './ato2/ShuttleScene';
import { SimShell, SourceLine, StepText, Tag } from './ato2/ui';

/**
 * Slide 25 — "Lactato: Combustível, não Lixo". A cena mostra o lactato nascendo na fibra rápida,
 * saindo pelo MCT4, entrando pelo MCT1 e sendo oxidado (ou virando glicose); no último passo,
 * a fibra esvazia e o gráfico da meia-vida mostra que ele some em minutos.
 */

const DW = 330;
const DH = 150;
const decayX = (t: number) => 40 + (t / 60) * (DW - 56);
const decayY = (f: number) => 20 + (1 - f) * (DH - 56);

const DecayChart = () => {
    const d = Array.from({ length: 61 }, (_, t) => `${t === 0 ? 'M' : 'L'}${decayX(t).toFixed(1)} ${decayY(remaining(t)).toFixed(1)}`).join(' ');
    return (
        <svg viewBox={`0 0 ${DW} ${DH}`} width={DW} height={DH} role="img" aria-label="Lactato muscular na recuperação, meia-vida de 9,5 minutos">
            <line x1={40} x2={DW - 16} y1={decayY(0)} y2={decayY(0)} stroke="rgba(255,255,255,0.3)" />
            <path d={d} fill="none" stroke={C.lactate} strokeWidth={3} />
            {[0, 30, 60].map(t => <SvgText key={t} x={decayX(t)} y={DH - 12} text={`${t} min`} anchor="middle" size={16} color="#CBD5E1" weight={500} />)}
            <circle cx={decayX(HALF_LIFE_MIN)} cy={decayY(0.5)} r={5} fill="#fff" />
            <SvgText x={decayX(HALF_LIFE_MIN) + 10} y={decayY(0.5) - 6} text="metade: 9,5 min" size={16} color="#fff" />
            <circle cx={decayX(30)} cy={decayY(remaining(30))} r={5} fill={C.lactate} />
            <SvgText x={decayX(30) + 8} y={decayY(remaining(30)) - 10} text="~11%" size={16} color={C.lactate} />
        </svg>
    );
};

const Big = ({ value, label, color }: { value: string; label: string; color: string }) => (
    <div className="flex items-baseline gap-3">
        <span className="font-display text-[2.6rem] font-semibold leading-none" style={{ color }}>{value}</span>
        <span className="text-[16px] leading-snug text-gray-200">{label}</span>
    </div>
);

const StepVisual = ({ step }: { step: number }) => {
    if (step === 0) return <Big value="2–3×" label="mais lactato no músculo que no sangue, logo após o esforço" color={C.lactate} />;
    if (step === 1) return (
        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-[15px] text-gray-200">
            <span /><span className="font-semibold text-yellow-300">MCT4</span><span className="font-semibold text-yellow-300">MCT1</span>
            <span className="text-gray-400">afinidade</span><span>baixa · Km ~20 mM</span><span>alta · Km ~5 mM</span>
            <span className="text-gray-400">onde</span><span>fibras tipo II</span><span>fibras oxidativas</span>
            <span className="text-gray-400">papel</span><span>exportar</span><span>captar</span>
        </div>
    );
    if (step === 2) return (
        <div className="flex flex-col gap-2">
            <Big value="≥75%" label="oxidado durante o próprio exercício" color={C.base} />
            <Big value="~20%" label="vira glicose" color={C.co2} />
        </div>
    );
    return <DecayChart />;
};

const LactateShuttleSim = () => {
    const { step, setStep } = useSlideSteps(SHUTTLE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = SHUTTLE_STEPS[step];
    return (
        <SimShell tabs={SHUTTLE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="shuttle-tabs"
            chips={<><Tag kind={plan.kind}>{plan.kindLabel}</Tag><Tag kind="ilustrativo">partículas ilustrativas</Tag></>}>
            <Panel className="shrink-0" glow={C.lactate}>
                <ShuttleScene step={step} reduce={reduce} />
            </Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                <StepText step={step} headline={plan.headline} text={plan.text} accent={C.lactate} />
                <motion.div key={step} className="mt-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.2 }}>
                    <StepVisual step={step} />
                </motion.div>
                <SourceLine>{plan.source}</SourceLine>
            </Panel>
        </SimShell>
    );
};

export default LactateShuttleSim;
