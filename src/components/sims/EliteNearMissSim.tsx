import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { ELITE_STEPS } from './ato4/eliteContent';
import { RowingCi, SprintersVisual } from './ato4/EliteVisuals';
import { SpinVisual } from './ato4/EliteSpinVisual';
import { Narration, Shell, Takeaway } from './ato4/shell';
import { Tabs, Tag } from './ato4/ui';

/**
 * Slide 66 "Os 'Quases' da Elite". Passos: 400 m (carnosina sobe, tempo não) · remo 2.000 m (4,3 s, P = 0,07)
 * · significância × relevância (mesmo efeito, outro n: cálculo ilustrativo) · o "spin" de Kern & Robinson.
 */

const N_PRESET = 10;
const N_MIN = 8;
const N_MAX = 30;
const TAGS = ['ECR · elite', 'ECR · elite', 'cálculo ilustrativo · DP do P = 0,07', 'resumo × resultados'] as const;

const EliteNearMissSim = () => {
    const { step, setStep } = useSlideSteps(ELITE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = ELITE_STEPS[step];
    const [n, setN] = useState(N_PRESET);

    return (
        <Shell>
            <div className="flex items-center justify-between gap-4">
                <Tabs labels={ELITE_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato4-elite-tab" />
                <Tag color={step === 2 ? C.lactate : C.carnoSoft}>{TAGS[step]}</Tag>
            </div>
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '700px minmax(0,1fr)' }}>
                <Panel state="active" glow={step === 3 ? C.risk : C.carno} className="p-4">
                    <motion.div key={step <= 2 && step >= 1 ? 'row' : step} className="h-full flex flex-col justify-center gap-3"
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        {step === 0 && <SprintersVisual reduce={reduce} />}
                        {(step === 1 || step === 2) && <RowingCi n={step === 2 ? n : null} />}
                        {step === 2 && (
                            <label className="flex flex-col gap-1 px-2">
                                <span className="flex justify-between text-[16px] text-gray-200">
                                    remadores por grupo (hipotético)
                                    <span className="font-mono font-semibold" style={{ color: C.lactate }}>{n}</span>
                                </span>
                                <input type="range" min={N_MIN} max={N_MAX} step={1} value={n} onChange={e => setN(Number(e.target.value))}
                                    className="w-full cursor-pointer" style={{ accentColor: C.lactate }} />
                            </label>
                        )}
                        {step === 3 && <SpinVisual reduce={reduce} />}
                    </motion.div>
                </Panel>
                <Panel className="p-4 flex flex-col gap-3">
                    <Narration stepKey={step} kicker={plan.kicker} title={plan.title} text={plan.text} reduce={reduce} />
                    <div className="mt-auto"><Takeaway stepKey={step} reduce={reduce}>{plan.takeaway}</Takeaway></div>
                </Panel>
            </div>
        </Shell>
    );
};

export default EliteNearMissSim;
