import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { HARRIS_STEPS } from './ato4/harrisContent';
import { ChichesterVisual, DisclosureVisual, PatentVisual, TanksVisual } from './ato4/HarrisVisuals';
import { Narration, Shell, Takeaway } from './ato4/shell';

/**
 * Slide 63 "O Homem da Creatina". Linha do tempo de Roger Harris: creatina (1992) → cavalos e patente (1997–1999)
 * → Chichester (2006–2007) → conflitos declarados (2012). Cada nó é um passo do passador.
 */

const Timeline = ({ step, onSelect }: { step: number; onSelect: (i: number) => void }) => {
    const n = HARRIS_STEPS.length;
    const edge = 100 / (2 * n);
    return (
        <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }} role="tablist" aria-label="Linha do tempo">
            <div className="absolute top-[17px] h-[2px] bg-white/15" style={{ left: `${edge}%`, right: `${edge}%` }} />
            <motion.div className="absolute top-[17px] h-[2px]" style={{ left: `${edge}%`, background: C.carno }}
                animate={{ width: `${(step / (n - 1)) * (100 - 2 * edge)}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            {HARRIS_STEPS.map((s, i) => {
                const active = i === step;
                const done = i < step;
                return (
                    <button key={s.tab} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                        className="relative flex flex-col items-center gap-1 cursor-pointer">
                        <span className="w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center font-mono text-[16px] transition-colors"
                            style={{
                                borderColor: active || done ? C.carno : 'rgba(255,255,255,0.3)',
                                background: active ? '#5B21B6' : done ? 'rgba(91,33,182,0.4)' : '#0b0b14',
                            }}>
                            {i + 1}
                        </span>
                        <span className="font-mono text-[16px]" style={{ color: active ? C.carnoSoft : '#D1D5DB' }}>{s.date}</span>
                        <span className={`text-[16px] font-semibold leading-tight ${active ? 'text-white' : 'text-gray-300'}`}>{s.tab}</span>
                    </button>
                );
            })}
        </div>
    );
};

const HarrisStorySim = () => {
    const { step, setStep } = useSlideSteps(HARRIS_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = HARRIS_STEPS[step];

    return (
        <Shell>
            <Timeline step={step} onSelect={setStep} />
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '600px minmax(0,1fr)' }}>
                <Panel state="active" glow={step === 0 ? C.base : step === 3 ? C.lactate : C.carno} className="p-4">
                    <motion.div key={step} className="h-full" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        {step === 0 && <TanksVisual reduce={reduce} />}
                        {step === 1 && <PatentVisual />}
                        {step === 2 && <ChichesterVisual />}
                        {step === 3 && <DisclosureVisual reduce={reduce} />}
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

export default HarrisStorySim;
