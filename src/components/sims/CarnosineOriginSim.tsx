import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { ORIGIN_STEPS } from './ato4/originContent';
import { AnimalsVisual, CenturyVisual, HumanVisual, LowerVisual } from './ato4/OriginVisuals';
import { Narration, Shell, Takeaway } from './ato4/shell';
import { Tabs, Tag } from './ato4/ui';

/**
 * Slide 60 "Uma Molécula que Veio da Carne". Passos: 1900 → 2010 (descoberta e enzima) · os animais ricos em
 * dipeptídeos de histidina · o humano "pobre" (Mannion 1992) · quem tem menos (dieta, sexo, idade).
 */

const TAGS = ['história', 'fisiologia comparada', 'biópsia · n = 50', 'observacional · ¹H-ERM'] as const;

const CarnosineOriginSim = () => {
    const { step, setStep } = useSlideSteps(ORIGIN_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = ORIGIN_STEPS[step];

    return (
        <Shell>
            <div className="flex items-center justify-between gap-4">
                <Tabs labels={ORIGIN_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato4-origin-tab" />
                <Tag color={step === 3 ? C.caveat : C.carnoSoft}>{step === 3 ? 'Bianca: caso fictício' : TAGS[step]}</Tag>
            </div>
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '640px minmax(0,1fr)' }}>
                <Panel state="active" glow={C.carno} className="p-4">
                    <motion.div key={step} className="h-full" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                        {step === 0 && <CenturyVisual reduce={reduce} />}
                        {step === 1 && <AnimalsVisual reduce={reduce} />}
                        {step === 2 && <HumanVisual reduce={reduce} />}
                        {step === 3 && <LowerVisual reduce={reduce} />}
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

export default CarnosineOriginSim;
