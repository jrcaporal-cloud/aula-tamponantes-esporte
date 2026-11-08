import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { PANEL_BG } from './kit/palette';
import { SIM_H } from './ato7/shared';
import { TakeawayVisual } from './ato7/takeawayVisuals';
import { TAKEAWAYS } from './ato7/takeaways';
import { FadeSwap, Source } from './ato7/ui';

/**
 * Slide 96 — O que Levar para Segunda-feira. Cinco mensagens reveladas uma a uma:
 * à esquerda a lista acumulada (a atual aberta com o seu texto); à direita, o desenho que conta a mensagem ativa.
 */
const TakeawaysSim = () => {
    const { step, setStep } = useSlideSteps(TAKEAWAYS.length);
    const reduce = useReducedMotion();
    const active = TAKEAWAYS[Math.min(step, TAKEAWAYS.length - 1)];

    return (
        <div className="not-prose flex w-full select-none gap-3 font-body text-white" style={{ height: SIM_H }}>
            <ol className="m-0 flex w-[420px] shrink-0 list-none flex-col gap-2 p-0">
                {TAKEAWAYS.map((t, i) => {
                    const shown = i <= step;
                    const isActive = i === step;
                    return (
                        <motion.li key={t.title} className="flex min-h-0" style={{ flex: isActive ? '1 1 auto' : '0 0 auto' }}
                            initial={false} animate={{ opacity: shown ? (isActive ? 1 : 0.72) : 0.3 }} transition={{ duration: reduce ? 0 : 0.35 }}>
                            <button type="button" onClick={() => setStep(i)} aria-current={isActive ? 'step' : undefined}
                                className="flex w-full cursor-pointer items-start gap-3 rounded-2xl border px-4 py-2.5 text-left"
                                style={{
                                    ...PANEL_BG,
                                    borderColor: isActive ? `${t.color}cc` : 'rgba(255,255,255,0.1)',
                                    background: isActive ? `linear-gradient(100deg, ${t.color}26, rgba(4,10,20,0.8) 60%)` : PANEL_BG.background,
                                }}>
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[19px] font-semibold"
                                    style={{ background: isActive ? t.color : 'rgba(255,255,255,0.1)', color: isActive ? '#04080F' : '#F3F4F6' }}>
                                    {i + 1}
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col gap-1 self-stretch">
                                    {shown ? (
                                        <span className="font-display text-[18px] font-semibold leading-tight text-white">{t.title}</span>
                                    ) : (
                                        <span aria-hidden className="mt-2.5 h-3 w-3/4 rounded-full bg-white/10" />
                                    )}
                                    {isActive && <span className="text-[16px] leading-snug text-gray-200">{t.text}</span>}
                                    {isActive && (
                                        <span className="mt-auto flex flex-col gap-1 pt-2">
                                            <span className="font-display text-[30px] font-semibold leading-none" style={{ color: t.color }}>{t.figure}</span>
                                            <span className="text-[15px] leading-tight text-gray-300">{t.figureLabel}</span>
                                        </span>
                                    )}
                                </span>
                            </button>
                        </motion.li>
                    );
                })}
            </ol>

            <div className="flex min-w-0 flex-1 flex-col rounded-2xl border p-4" style={{ ...PANEL_BG, borderColor: `${active.color}88` }}>
                <FadeSwap id={step} className="flex min-h-0 flex-1 flex-col gap-2">
                    <p className="m-0 font-mono text-[15px] uppercase tracking-wider" style={{ color: active.color }}>
                        mensagem {step + 1} de {TAKEAWAYS.length}
                    </p>
                    <div className="flex min-h-0 flex-1 items-center">
                        <TakeawayVisual index={step} label={`${active.title}: ${active.figure}, ${active.figureLabel}`} />
                    </div>
                    <Source>{active.source}</Source>
                </FadeSwap>
            </div>
        </div>
    );
};

export default TakeawaysSim;
