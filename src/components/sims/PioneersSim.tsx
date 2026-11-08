import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, StudyCard, Tag } from './ato3/Frame';
import { PIONEERS, PIONEER_FEET, PIONEER_TABS } from './ato3/historia';
import { CostillScene, KatzScene, PH, PhGradient, PW, WilkesScene } from './ato3/PioneerScenes';
import { C } from './kit/palette';

/**
 * Slide 41 — "Da Pista à Biópsia": Wilkes 1983 (800 m), Costill 1984 (tiros repetidos + biópsia)
 * e Katz 1984 (tiro único nulo). O último passo põe os dois desenhos de 1984 lado a lado.
 */

const CARD_KEYS = ['wilkes', 'costill', 'katz'] as const;

const ContrastCard = () => (
    <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 flex flex-col gap-3">
        <span className="font-mono text-[15px] tracking-wide text-cyan-300">MESMO GRUPO · MESMA DOSE (0,2 g/kg)</span>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-baseline">
            <span className="font-display text-[1.5rem] font-semibold" style={{ color: C.base }}>+42%</span>
            <span className="text-[16px] text-gray-100 leading-snug">no 5º de 5 tiros: a acidose já se acumulou</span>
            <span className="font-display text-[1.5rem] font-semibold" style={{ color: C.muted }}>≈ 0</span>
            <span className="text-[16px] text-gray-100 leading-snug">num tiro único de ~100 s, partindo do repouso</span>
        </div>
        <p className="text-[16px] leading-snug text-gray-300">Quem leu só um dos dois artigos saiu com uma certeza oposta.</p>
    </div>
);

const PioneersSim = () => {
    const { step, setStep } = useSlideSteps(PIONEER_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const study = step < 3 ? PIONEERS[CARD_KEYS[step]] : null;

    return (
        <Frame tabs={PIONEER_TABS} step={step} setStep={setStep} layoutId="pioneers-tab" foot={PIONEER_FEET[step]}
            chips={<Tag color={C.base}>{['n = 6', 'n = 11', 'n = 8', 'n = 11 × n = 8'][step]}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: '680px 1fr' }}>
                <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" height="100%" role="img" aria-label="Estudos pioneiros do bicarbonato">
                    <PhGradient />
                    <motion.g key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        {step === 0 && <WilkesScene reduce={reduce} />}
                        {step === 1 && <CostillScene reduce={reduce} />}
                        {step === 2 && <KatzScene reduce={reduce} />}
                        {step === 3 && (
                            <>
                                <CostillScene reduce compact />
                                <line x1={20} x2={PW - 6} y1={172} y2={172} stroke="rgba(255,255,255,0.12)" />
                                <KatzScene reduce compact />
                            </>
                        )}
                    </motion.g>
                </svg>
                <motion.div key={step} className="flex flex-col justify-center gap-3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                    {study ? (
                        <>
                            <span className="font-display text-[3.2rem] leading-none font-semibold" style={{ color: study.color }}>{study.year}</span>
                            <StudyCard tag={study.tag} title={study.title} lines={study.lines} color={study.color} />
                        </>
                    ) : <ContrastCard />}
                </motion.div>
            </div>
        </Frame>
    );
};

export default PioneersSim;
