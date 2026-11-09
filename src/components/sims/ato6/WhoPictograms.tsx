import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C, PANEL_BG } from '../kit/palette';
import { CAST_COLOR } from '../ato1/content';
import { SvgText } from '../kit/ui';
import { BICARB_STUDIES, CAST, TYPICAL, WOMEN_EFFECT } from './whoContent';
import { WV_H, WV_W } from './WhoVisuals';

/**
 * Passos 3 e 4 do "Quem é Estudado?": os 149 estudos de bicarbonato (um ponto por estudo, Saunders 2022)
 * e os quatro personagens da aula (casos fictícios) comparados ao participante típico.
 */

const WOMEN = C.lactate;
const MEN = '#94A3B8';
const COLS = 15;
const PITCH = 24;

/** Passo 3: 149 estudos; 30 com alguma mulher; 11 com análise feminina à parte; e o efeito que cruza o zero. */
export const BicarbDots = () => {
    const reduce = useReducedMotion() ?? false;
    const { total, withWomen, separate } = BICARB_STUDIES;
    const ex = (v: number) => 150 + (v + 0.2) * 420;
    return (
        <svg width={WV_W} height={WV_H} viewBox={`0 0 ${WV_W} ${WV_H}`} role="img" aria-label="149 estudos de bicarbonato: 30 com mulheres, 11 com análise feminina">
            <SvgText x={28} y={36} text="Estudos de bicarbonato: 1 ponto = 1 estudo" color={C.text} size={18} weight={700} />
            {Array.from({ length: total }, (_, i) => {
                const sep = i < separate;
                const lit = i < withWomen;
                return (
                    <motion.circle key={i} cx={40 + (i % COLS) * PITCH} cy={70 + Math.floor(i / COLS) * PITCH} r={8.5}
                        fill={lit ? WOMEN : MEN} fillOpacity={sep ? 1 : lit ? 0.5 : 0.25}
                        stroke={sep ? '#fff' : 'none'} strokeWidth={1.5}
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: lit ? 0.35 + i * 0.015 : 0.05 + (i / total) * 0.25, ease: EASE_OUT }} />
                );
            })}
            <SvgText x={420} y={98} text="20%" color={WOMEN} size={44} weight={700} />
            <SvgText x={420} y={124} text="30 de 149 incluíram" color={C.text} size={16} />
            <SvgText x={420} y={144} text="ao menos uma mulher" color={C.text} size={16} />
            <SvgText x={420} y={200} text="7,4%" color={WOMEN} size={34} weight={700} />
            <SvgText x={420} y={224} text="11 analisaram mulheres" color={C.text} size={16} />
            <SvgText x={420} y={244} text="à parte (contorno branco)" color={C.muted} size={16} weight={500} />
            <SvgText x={420} y={290} text="AIS 2025: só 4% dos estudos" color={C.muted} size={16} weight={500} />
            <SvgText x={420} y={310} text="de bicarbonato com mulheres" color={C.muted} size={16} weight={500} />
            <line x1={28} x2={668} y1={322} y2={322} stroke="white" strokeOpacity={0.1} />
            <SvgText x={28} y={346} text="Efeito em mulheres (11 estudos): 0,37, CrI95% −0,06 a 0,92" color={WOMEN} size={17} weight={700} />
            <line x1={ex(0)} x2={ex(0)} y1={358} y2={392} stroke={C.text} strokeOpacity={0.6} strokeDasharray="4 4" />
            <motion.rect x={ex(WOMEN_EFFECT.lo)} y={372} width={ex(WOMEN_EFFECT.hi) - ex(WOMEN_EFFECT.lo)} height={5} rx={2.5} fill={WOMEN}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.7, ease: EASE_OUT }} />
            <rect x={ex(WOMEN_EFFECT.est) - 7} y={367.5} width={14} height={14} fill={WOMEN} stroke="#04080F" strokeWidth={2}
                transform={`rotate(45 ${ex(WOMEN_EFFECT.est)} 374.5)`} />
            <SvgText x={ex(WOMEN_EFFECT.lo) - 14} y={380} anchor="end" text="0 = sem efeito" color={C.muted} size={16} weight={500} />
            <SvgText x={28} y={424} text="O intervalo cruza o zero: dado de menos para concluir igual ou diferente." color={C.muted} size={16} weight={500} />
        </svg>
    );
};

/** Silhueta geométrica (cabeça + ombros). */
const Person = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
        <circle cx={20} cy={12} r={8} fill={color} />
        <path d="M 5 40 Q 5 23 20 23 Q 35 23 35 40 Z" fill={color} />
    </svg>
);

const CARD = { w: 236, h: 196 } as const;
const SLOTS = [
    { x: 16, y: 16 }, { x: 444, y: 16 }, { x: 16, y: 228 }, { x: 444, y: 228 },
] as const;
const CENTER = { x: 348, y: 196 } as const;

/** Passo 4: os quatro da aula em volta do participante típico; o que os separa dele vem marcado. */
export const CastVsTypical = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="relative" style={{ width: WV_W, height: WV_H }}>
            <svg className="absolute inset-0" width={WV_W} height={WV_H} aria-hidden>
                {SLOTS.map((s, i) => {
                    const tx = s.x < CENTER.x ? s.x + CARD.w : s.x;
                    const ty = s.y + CARD.h / 2;
                    return (
                        <motion.line key={i} x1={CENTER.x} y1={CENTER.y} x2={tx} y2={ty} stroke={C.risk} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="5 6"
                            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 + i * 0.12, ease: EASE_OUT }} />
                    );
                })}
            </svg>
            <motion.div className="absolute flex flex-col items-center text-center" style={{ left: 264, top: 0, width: 168, height: WV_H }}
                initial={reduce ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
                <span className="mt-10 font-body text-[18px] font-semibold leading-tight text-white">participante<br />típico</span>
                <div className="absolute rounded-full border-2 p-3" style={{ top: CENTER.y - 66, borderColor: `${C.base}aa`, background: '#04080F' }}>
                    <Person size={104} color={MEN} />
                </div>
                <div className="absolute flex flex-wrap justify-center gap-1" style={{ top: 300 }}>
                    {TYPICAL.map(t => (
                        <span key={t} className="rounded-md border border-white/15 px-1.5 text-[15px] text-gray-200" style={PANEL_BG}>{t}</span>
                    ))}
                </div>
            </motion.div>
            {CAST.map((p, i) => {
                const s = SLOTS[i];
                const color = CAST_COLOR[p.id];
                return (
                    <motion.div key={p.name} className="absolute flex flex-col gap-2 rounded-xl border p-3"
                        style={{ left: s.x, top: s.y, width: CARD.w, height: CARD.h, borderColor: `${color}66`, background: 'rgba(4,10,20,0.92)' }}
                        initial={reduce ? false : { opacity: 0, x: s.x < CENTER.x ? 24 : -24 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 + i * 0.12, ease: EASE_OUT }}>
                        <div className="flex items-center gap-2.5">
                            <Person size={40} color={color} />
                            <div className="flex min-w-0 flex-col">
                                <span className="font-body text-[1.2rem] font-semibold leading-tight text-white">{p.name}</span>
                                <span className="text-[15px] leading-tight text-gray-300">{p.who}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {p.diffs.map(d => (
                                <span key={d} className="rounded-md border px-1.5 text-[15px] font-semibold" style={{ borderColor: `${C.risk}88`, color: C.risk, background: `${C.risk}14` }}>≠ {d}</span>
                            ))}
                        </div>
                        <p className="m-0 text-[15px] leading-snug text-gray-100">{p.gap}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};
