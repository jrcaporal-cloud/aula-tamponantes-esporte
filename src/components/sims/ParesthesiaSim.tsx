import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { PARESTHESIA_STEPS } from './ato4/paresthesiaContent';
import { PlasmaCurve } from './ato4/PlasmaCurve';
import { ItchNeuron } from './ato4/ItchNeuron';
import { OddsRatio } from './ato4/OddsRatio';
import { Narration, Shell, Takeaway } from './ato4/shell';
import { Tabs, Tag } from './ato4/ui';

/**
 * Slide 64 "O Formigamento". Passos: curva plasmática pura × liberação lenta com o limiar · receptor MrgprD
 * (sem histamina) · OR 8,9 · o que fazer (fracionar, liberação lenta, mesma área sob a curva).
 */

const TAGS = ['picos medidos · forma ilustrativa', 'esquema', 'meta-análise bayesiana', 'picos medidos · forma ilustrativa'] as const;

const ParesthesiaSim = () => {
    const { step, setStep } = useSlideSteps(PARESTHESIA_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = PARESTHESIA_STEPS[step];
    const curveStep = step === 0 || step === 3;

    return (
        <Shell>
            <div className="flex items-center justify-between gap-4">
                <Tabs labels={PARESTHESIA_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato4-itch-tab" />
                <Tag color={C.carnoSoft}>{TAGS[step]}</Tag>
            </div>
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '700px minmax(0,1fr)' }}>
                <Panel state="active" glow={step === 3 ? C.carno : C.risk} className="p-3 flex items-center justify-center">
                    <motion.div key={curveStep ? 'curve' : step} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                        className="h-full w-full flex items-center justify-center">
                        {curveStep && <PlasmaCurve showArea={step === 3} reduce={reduce} />}
                        {step === 1 && <ItchNeuron reduce={reduce} />}
                        {step === 2 && <OddsRatio reduce={reduce} />}
                    </motion.div>
                </Panel>
                <Panel className="p-4 flex flex-col gap-3">
                    <Narration stepKey={step} kicker={plan.kicker} title={plan.title} text={plan.text} color={C.risk} reduce={reduce} />
                    <div className="mt-auto"><Takeaway stepKey={step} reduce={reduce}>{plan.takeaway}</Takeaway></div>
                </Panel>
            </div>
        </Shell>
    );
};

export default ParesthesiaSim;
