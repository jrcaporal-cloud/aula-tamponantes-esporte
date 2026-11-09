import { useMemo } from 'react';
import { DUR, EASE_OUT } from '../../lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { BODY_FONT, C, PANEL_BG } from './kit/palette';
import { Panel } from './kit/ui';
import { Tabs, Tag } from './ato1/ui';
import { LAST_LAP_STEPS, SUSPECTS } from './ato1/content';
import { PhGauge } from './ato1/PhGauge';
import { FINAL_STRETCH_FROM, RACE_M, phAt } from './ato1/race';
import { TrackSvg } from './ato1/TrackSvg';
import { useRaceDistance } from './ato1/useRaceDistance';

/**
 * "Os Últimos 200 Metros" (slide 10, abertura). Passo 1: Júlia corre até os 600 m. Passo 2: a reta final
 * em câmera lenta, a velocidade cai e o pH muscular escorrega. Passo 3: chegada e a pergunta "o que queima?".
 * Caso fictício; velocidade e trajeto do pH ilustrativos (extremos do pH: SAHLIN1976).
 */

/** Alvo (m) e ritmo da animação por passo: a reta final anda mais devagar, em câmera lenta. */
const PLAN: readonly { target: number; rate: number }[] = [
    { target: FINAL_STRETCH_FROM, rate: 11 },
    { target: RACE_M, rate: 6.5 },
    { target: RACE_M, rate: 11 },
];

/** Avançou antes dos 600 m? Ela chega lá depressa e só a reta final fica em câmera lenta. */
const CATCH_UP = { until: FINAL_STRETCH_FROM, rate: 30 } as const;

const LastLapSim = () => {
    const { step, setStep } = useSlideSteps(LAST_LAP_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = PLAN[step];
    const distance = useRaceDistance(plan.target, plan.rate, reduce, step === 1 ? CATCH_UP : undefined);
    const tabs = useMemo(() => LAST_LAP_STEPS.map(s => s.tab), []);
    const story = LAST_LAP_STEPS[step];

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 516 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <Tabs labels={tabs} step={step} onSelect={setStep} layoutId="lastlap-tabs" />
                <div className="flex items-center gap-2">
                    <Tag color={C.caveat}>caso fictício</Tag>
                    <Tag>valores ilustrativos</Tag>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 gap-3">
                <Panel className="w-[724px] shrink-0" state={step === 1 ? 'active' : 'idle'} glow={C.acid}>
                    <TrackSvg distance={distance} step={step} />
                </Panel>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <Panel className="h-[236px] shrink-0">
                        <PhGauge ph={phAt(distance)} />
                    </Panel>

                    {/* Sem AnimatePresence: trocar de passo rápido nunca deixa texto velho na tela. */}
                    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}
                        className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 px-4 py-3"
                        style={PANEL_BG}>
                        <h3 className="font-body text-[1.3rem] font-semibold leading-tight text-balance"
                            style={{ ...BODY_FONT, color: step === 2 ? C.acidSoft : C.text }}>
                            {story.headline}
                        </h3>
                        <p className="mt-1.5 text-[16px] leading-snug text-gray-100">{story.text}</p>
                        {step === 2 && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {SUSPECTS.map((s, i) => (
                                    <motion.span key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: reduce ? 0 : 0.25 + i * 0.12, duration: DUR.enter, ease: EASE_OUT }}
                                        className="rounded-md border px-2 py-0.5 font-mono text-[16px]"
                                        style={{ borderColor: `${C.acid}80`, color: C.acidSoft }}>
                                        {s}
                                    </motion.span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LastLapSim;
