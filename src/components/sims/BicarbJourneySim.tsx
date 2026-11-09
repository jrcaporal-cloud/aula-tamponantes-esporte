import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, Tag } from './ato3/Frame';
import { JourneyPipe } from './ato3/JourneyPipe';
import { JOURNEY_STEPS } from './ato3/jornada';
import { C } from './kit/palette';

/**
 * Slide 42 — "Do Copo ao Músculo". Um passo por estação: estômago (CO₂), intestino (soluto e água),
 * sangue (+5,2 mmol/L) e fibra (o bicarbonato fica do lado de fora e puxa H⁺/lactato). O 3D da jornada é de outro construtor.
 */

const TABS = JOURNEY_STEPS.map(s => s.tab);

const BicarbJourneySim = () => {
    const { step, setStep } = useSlideSteps(JOURNEY_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = JOURNEY_STEPS[step];

    return (
        <Frame tabs={TABS} step={step} setStep={setStep} layoutId="journey-tab" foot={info.foot}
            chips={<Tag color={C.muted}>esquema · tecla 3 abre o modelo</Tag>}>
            <div className="h-full flex flex-col gap-3">
                <div className="h-[200px] shrink-0">
                    <JourneyPipe active={info.station} reduce={reduce} />
                </div>
                <motion.div key={step} className="flex-1 min-h-0 grid grid-cols-2 gap-3"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    {info.facts.map(f => (
                        <div key={f.big} className="rounded-xl border bg-white/[0.03] px-4 py-3 flex flex-col justify-center gap-1"
                            style={{ borderColor: `${f.color}66` }}>
                            <span className="font-body text-[1.55rem] leading-tight font-semibold" style={{ color: f.color }}>{f.big}</span>
                            <span className="text-[16px] leading-snug text-gray-100">{f.label}</span>
                            <span className="font-mono text-[15px] text-gray-400">{f.source}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </Frame>
    );
};

export default BicarbJourneySim;
