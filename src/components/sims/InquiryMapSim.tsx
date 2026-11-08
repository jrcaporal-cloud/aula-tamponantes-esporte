import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C, PANEL_BG } from './kit/palette';
import { CHAPTERS, PRIZE } from './ato1/content';
import { ChapterCard, type CardState } from './ato1/ChapterCard';
import { BANNER, BOARD_H, BOARD_W, CARD_H, CARD_W, SLOTS, stringBetween } from './ato1/inquiryLayout';

/**
 * "O Mapa do Inquérito" (slide 13). Os 7 capítulos presos num quadro, ligados por fios. Passos 1–7: o capítulo
 * da vez acende e o fio chega até ele. Passo 8: a vaga do canto revela o tamanho do prêmio (ES 0,17; ~2%)
 * e a pergunta da aula: para quem e quando.
 */

const TILTS = [-1.4, 0.9, -0.5, 1.2, -1, 0.7, -0.8, 1.1];
const PRIZE_STEP = CHAPTERS.length;
const STRINGS = SLOTS.slice(0, -1).map((_, i) => stringBetween(i));

const PrizeCard = ({ shown }: { shown: boolean }) => {
    const slot = SLOTS[SLOTS.length - 1];
    return (
        <div className="absolute rounded-xl border px-3.5 py-3 transition-[border-color,box-shadow] duration-500"
            style={{
                left: slot.x, top: slot.y, width: CARD_W, height: CARD_H, rotate: `${TILTS[7]}deg`, ...PANEL_BG,
                borderColor: shown ? C.lactate : 'rgba(255,255,255,0.14)', borderStyle: shown ? 'solid' : 'dashed',
                boxShadow: shown ? `0 0 34px -6px ${C.lactate}` : 'none',
            }}>
            {shown ? (
                <motion.div className="flex h-full flex-col justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <p className="font-mono text-[16px] uppercase tracking-wide" style={{ color: C.lactate }}>{PRIZE.title}</p>
                    {PRIZE.lines.map(line => (
                        <div key={line.value} className="flex items-center gap-2.5">
                            <span className="w-[88px] shrink-0 whitespace-nowrap font-display text-[1.4rem] font-bold leading-none text-white">{line.value}</span>
                            <span className="text-[16px] leading-tight text-gray-200">{line.text}</span>
                        </div>
                    ))}
                </motion.div>
            ) : (
                <div className="flex h-full items-center justify-center font-display text-[2.4rem] text-gray-500">?</div>
            )}
        </div>
    );
};

const InquiryMapSim = () => {
    const { step } = useSlideSteps(CHAPTERS.length + 1);
    const reduce = useReducedMotion() ?? false;
    const prize = step === PRIZE_STEP;
    const current = CHAPTERS[Math.min(step, CHAPTERS.length - 1)];

    const stateOf = (i: number): CardState => {
        if (prize) return 'past';
        if (i === step) return 'current';
        return i < step ? 'past' : 'future';
    };

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 516 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                    className="text-[1.12rem] text-gray-100">
                    {prize
                        ? <>Sete capítulos para um prêmio <strong style={{ color: C.lactate }}>pequeno</strong></>
                        : <>Capítulo <strong className="text-white">{current.roman}</strong> de VII · <span style={{ color: current.color }}>{current.title}</span></>}
                </motion.p>
                <span className="font-mono text-[16px] text-gray-400">perícia → testemunhas → contra-interrogatório → veredito</span>
            </div>

            <div className="relative" style={{ width: BOARD_W, height: BOARD_H,
                backgroundImage: 'radial-gradient(rgba(148,163,184,0.13) 1px, transparent 1.4px)', backgroundSize: '18px 18px' }}>
                {CHAPTERS.map((chapter, i) => (
                    <ChapterCard key={chapter.roman} chapter={chapter} slot={SLOTS[i]} state={stateOf(i)} tilt={TILTS[i]}
                        badge={i === step ? 'agora' : undefined} />
                ))}
                <PrizeCard shown={prize} />

                {/* Fios e alfinetes por cima: ficam só nos vãos entre as cartas */}
                <svg viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                    {STRINGS.map((s, i) => {
                        const lit = prize || i < step;
                        return (
                            <g key={i}>
                                <path d={s.d} fill="none" stroke={C.co2} strokeOpacity={0.28} strokeWidth={2} />
                                <path d={s.d} fill="none" stroke={C.acid} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1"
                                    style={{ strokeDashoffset: lit ? 0 : 1, transition: reduce ? 'none' : 'stroke-dashoffset 0.9s ease-out' }} />
                                {[s.from, s.to].map((p, k) => (
                                    <circle key={k} cx={p.x} cy={p.y} r={5} fill={lit ? C.acid : C.co2} stroke="#04080F" strokeWidth={1.5} />
                                ))}
                            </g>
                        );
                    })}
                </svg>

                {prize && (
                    <motion.div className="absolute flex items-center justify-center rounded-xl border px-4 text-center"
                        style={{ left: BANNER.x, top: BANNER.y, width: BANNER.w, height: BANNER.h,
                            ...PANEL_BG, borderColor: `${C.lactate}66` }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.3 }}>
                        <div>
                            <p className="font-display text-[1.3rem] font-semibold leading-tight text-white">{PRIZE.question}</p>
                            <p className="mt-0.5 text-[16px] leading-tight" style={{ color: C.baseSoft }}>{PRIZE.source}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default InquiryMapSim;
