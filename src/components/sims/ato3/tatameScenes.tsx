import { motion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import type { ReactElement } from 'react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { COMBAT, FIGHTS, GI_RATE, ISSN_COMBAT, MAT_WEIGHS, PEAK_WINDOW } from './tatame';

/**
 * Cenas do slide 26 "Nos Tatames": atletas como pontos (n de cada ensaio), séries finais (ilustrativo),
 * posicionamento × meta-análise com mostradores, balança do dilema e as quatro vinhetas do "O que pesa".
 */

const fadeUp = (i: number, reduce: boolean) => ({
    initial: reduce ? false as const : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : 0.1 * i, ease: EASE_OUT },
});

/** Um ponto por atleta, uma fileira por estudo. */
const AthleteDots = ({ rows, color, reduce }: { rows: readonly number[]; color: string; reduce: boolean }) => (
    <svg viewBox="0 0 170 40" width="100%" height={40} aria-hidden>
        {rows.map((n, r) => Array.from({ length: n }, (_, i) => (
            <motion.circle key={`${r}-${i}`} cx={6 + i * 11.5} cy={rows.length === 1 ? 20 : 9 + r * 20} r={4.5} fill={color}
                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: reduce ? 0 : 0.3 + i * 0.04, ease: EASE_OUT }} />
        )))}
    </svg>
);

/** Séries de um teste repetido: o ganho só aparece nas últimas (forma ILUSTRATIVA, sem valores). */
const LateSeries = ({ reduce }: { reduce: boolean }) => {
    const base = [96, 84, 72, 62];
    const gain = [0, 0, 9, 12];
    return (
        <svg viewBox="0 0 300 110" width={236} height={86} className="shrink-0" role="img" aria-label="Ganho nas séries finais (ilustrativo)">
            {base.map((b, i) => {
                const x = 20 + i * 70;
                return (
                    <g key={i}>
                        <rect x={x} y={100 - b} width={24} height={b} rx={4} fill={C.co2} opacity={0.55} />
                        <motion.rect x={x + 28} y={100 - b - gain[i]} width={24} height={b + gain[i]} rx={4} fill={C.base}
                            style={{ transformBox: 'fill-box', originY: 1 }}
                            initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }}
                            transition={{ duration: DUR.bar, delay: reduce ? 0 : stagger(i, 0.2, 0.15), ease: EASE_OUT }} />
                        {gain[i] > 0 && <SvgText x={x + 40} y={100 - b - gain[i] - 6} text="+" anchor="middle" size={18} color={C.base} weight={800} />}
                    </g>
                );
            })}
            <line x1={10} x2={296} y1={100} y2={100} stroke="rgba(255,255,255,0.3)" />
        </svg>
    );
};

export const Trials = ({ reduce }: { reduce: boolean }) => (
    <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-5 gap-3">
            {COMBAT.map((t, i) => {
                const color = t.positive ? C.base : C.co2;
                return (
                    <motion.div key={t.sport} className="flex flex-col gap-1.5 rounded-xl border bg-white/[0.03] px-3.5 py-3"
                        style={{ borderColor: `${color}66` }} {...fadeUp(i, reduce)}>
                        <div className="flex items-baseline justify-between">
                            <span className="font-body text-[1.35rem] font-semibold text-white">{t.sport}</span>
                            <span className="font-body text-[1.7rem] font-semibold leading-none" style={{ color }}>{t.positive ? '+' : '0'}</span>
                        </div>
                        <AthleteDots rows={t.athletes} color={color} reduce={reduce} />
                        <span className="font-mono text-[15px]" style={{ color }}>{t.n}</span>
                        <span className="flex-1 text-[16px] leading-snug text-gray-100">{t.result}</span>
                        <span className="text-[15px] text-gray-400">{t.who}</span>
                    </motion.div>
                );
            })}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
                <span className="whitespace-nowrap font-display text-[2.4rem] font-semibold leading-none text-white">8–14</span>
                <span className="text-[17px] leading-snug text-gray-100">atletas por estudo (um ponto, um atleta): um positivo isolado pode não se repetir</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-1">
                <LateSeries reduce={reduce} />
                <span className="flex flex-col gap-1">
                    <span className="text-[17px] leading-snug text-gray-100">o ganho aparece nas últimas séries</span>
                    <span className="text-[15px] text-slate-300">séries ilustrativas</span>
                </span>
            </div>
        </div>
    </div>
);

/** Mostrador semicircular: −90° (piora) … 0 (igual) … +90° (melhora/aumento). */
const Gauge = ({ x, y, angle, color, label, sub, reduce, delay }: {
    x: number; y: number; angle: number; color: string; label: string; sub: string; reduce: boolean; delay: number;
}) => (
    <g>
        <path d={`M${x - 60} ${y} A60 60 0 0 1 ${x + 60} ${y}`} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={14} strokeLinecap="round" />
        <line x1={x} x2={x} y1={y - 70} y2={y - 52} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
        <motion.g style={{ transformBox: 'fill-box', originX: 0.5, originY: 1 }} initial={{ rotate: reduce ? angle : 0 }} animate={{ rotate: angle }}
            transition={{ duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : delay, ease: EASE_IN_OUT }}>
            <line x1={x} x2={x} y1={y} y2={y - 54} stroke={color} strokeWidth={5} strokeLinecap="round" />
        </motion.g>
        <circle cx={x} cy={y} r={8} fill={color} />
        <SvgText x={x} y={y + 30} text={label} anchor="middle" size={20} color={color} weight={700} />
        <SvgText x={x} y={y + 54} text={sub} anchor="middle" size={16} color="#CBD5E1" weight={500} />
    </g>
);

const Paper = ({ x, y }: { x: number; y: number }) => (
    <g>
        <path d={`M${x} ${y} h20 l8 8 v28 h-28 Z`} fill="rgba(250,204,21,0.12)" stroke={C.lactate} strokeWidth={1.5} />
        {[14, 21, 28].map(d => <line key={d} x1={x + 5} x2={x + 22} y1={y + d} y2={y + d} stroke={C.lactate} strokeOpacity={0.6} />)}
    </g>
);

/** Passo 2: o posicionamento lista os esportes; a meta-análise junta 8 artigos e só o lactato mexe. */
export const MetaScene = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox="0 0 1096 320" width="100%" height="100%" role="img" aria-label="Posicionamento ISSN × meta-análise de Miranda 2022">
        {/* ISSN */}
        <rect x={0} y={10} width={400} height={300} rx={16} fill="rgba(255,255,255,0.03)" stroke={`${C.base}55`} />
        <SvgText x={24} y={46} text="ISSN 2021 · POSICIONAMENTO" size={16} color={C.baseSoft} weight={700} />
        {ISSN_COMBAT.map((s, i) => (
            <motion.g key={s} {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0.15 + i * 0.12, ease: EASE_OUT } })}>
                <rect x={24} y={66 + i * 40} width={200} height={32} rx={16} fill="rgba(34,211,238,0.10)" stroke={`${C.base}88`} />
                <path d={`M40 ${82 + i * 40} l6 6 l12 -12`} fill="none" stroke={C.ok} strokeWidth={3} strokeLinecap="round" />
                <SvgText x={66} y={88 + i * 40} text={s} size={17} color="#fff" weight={600} />
            </motion.g>
        ))}
        <SvgText x={244} y={136} text="0,2–0,5 g/kg" size={20} color={C.base} weight={700} />
        <SvgText x={244} y={162} text="melhora o" size={17} color="#E5E7EB" weight={500} />
        <SvgText x={244} y={184} text="desempenho" size={17} color="#E5E7EB" weight={500} />
        {/* × */}
        <SvgText x={448} y={172} text="×" anchor="middle" size={40} color={C.muted} weight={700} />
        {/* Miranda */}
        <rect x={496} y={10} width={600} height={300} rx={16} fill="rgba(255,255,255,0.03)" stroke={`${C.lactate}55`} />
        <SvgText x={520} y={46} text="MIRANDA 2022 · META-ANÁLISE · 8 ARTIGOS" size={16} color={C.lactate} weight={700} />
        {Array.from({ length: 8 }, (_, i) => <Paper key={i} x={522 + (i % 4) * 36} y={66 + Math.floor(i / 4) * 44} />)}
        <path d="M672 80 L712 110 L712 128 L672 158 Z" fill="rgba(250,204,21,0.12)" stroke={C.lactate} strokeWidth={1.5} />
        <path d="M720 119 l26 0 m-8 -7 l8 7 l-8 7" stroke={C.lactate} strokeWidth={2.5} fill="none" />
        <Gauge x={850} y={150} angle={55} color={C.lactate} label="lactato ↑" sub="p = 0,006" reduce={reduce} delay={0.3} />
        <Gauge x={1000} y={150} angle={0} color={C.co2} label="desempenho =" sub="potência, PSE, testes" reduce={reduce} delay={0.5} />
        <SvgText x={520} y={262} text="Mais lactato no sangue não é mais luta: é sinal de que a" size={16} color="#CBD5E1" weight={500} />
        <SvgText x={520} y={286} text="glicólise andou, não de que o atleta rendeu." size={16} color="#CBD5E1" weight={500} />
    </svg>
);

/** Balança pequena do dilema: o ponteiro passa da marca quando a dose vem antes da pesagem. */
export const MiniScale = ({ heavy }: { heavy: boolean }) => (
    <svg viewBox="0 0 64 44" width={64} height={44} aria-hidden>
        <path d="M8 40 h48 l-4 -10 h-40 Z" fill="rgba(163,230,53,0.15)" stroke={C.sodium} strokeWidth={1.5} />
        <path d="M14 26 A18 18 0 0 1 50 26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
        <line x1={32} x2={32} y1={6} y2={12} stroke={C.risk} strokeWidth={2} />
        <line x1={32} y1={26} x2={32} y2={10} stroke={heavy ? C.sodium : '#E5E7EB'} strokeWidth={3} strokeLinecap="round"
            style={{ transformOrigin: '32px 26px', transform: `rotate(${heavy ? 32 : 0}deg)`, transition: 'transform 0.6s var(--ease-in-out)' }} />
    </svg>
);

/* ——— Passo 5: quatro vinhetas ——— */

const ScaleVignette = ({ reduce }: { reduce: boolean }) => (
    <g>
        <rect x={40} y={140} width={180} height={28} rx={8} fill="rgba(163,230,53,0.12)" stroke={C.sodium} strokeWidth={2} />
        <circle cx={130} cy={78} r={56} fill="rgba(4,8,15,0.9)" stroke={C.sodium} strokeWidth={2.5} />
        {Array.from({ length: 9 }, (_, i) => -80 + i * 20).map(a => (
            <line key={a} x1={130} x2={130} y1={30} y2={38} stroke="rgba(255,255,255,0.4)" strokeWidth={2} transform={`rotate(${a} 130 78)`} />
        ))}
        <line x1={130} x2={130} y1={24} y2={40} stroke={C.risk} strokeWidth={3} />
        <SvgText x={130} y={18} text="limite" anchor="middle" size={16} color={C.risk} weight={700} />
        <motion.g style={{ transformBox: 'fill-box', originX: 0.5, originY: 1 }} initial={{ rotate: reduce ? 28 : 0 }} animate={{ rotate: 28 }}
            transition={{ duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : 0.3, ease: EASE_IN_OUT }}>
            <line x1={130} x2={130} y1={78} y2={32} stroke={C.sodium} strokeWidth={4} strokeLinecap="round" />
        </motion.g>
        <circle cx={130} cy={78} r={6} fill={C.sodium} />
        <SvgText x={130} y={112} text="~0,6 kg" anchor="middle" size={18} color={C.sodium} weight={800} />
        <SvgText x={130} y={159} text="Na⁺ + H₂O" anchor="middle" size={16} color={C.sodium} weight={800} />
    </g>
);

const StomachVignette = ({ reduce }: { reduce: boolean }) => {
    const r = 34;
    const circ = 2 * Math.PI * r;
    return (
        <g>
            {/* peso do oponente */}
            <rect x={36} y={8} width={120} height={26} rx={8} fill="rgba(251,113,133,0.18)" stroke={C.risk} strokeWidth={1.5} />
            <SvgText x={96} y={27} text="oponente" anchor="middle" size={16} color={C.risk} weight={700} />
            {[64, 96, 128].map(x => <path key={x} d={`M${x} 40 l0 16 m-6 -6 l6 6 l6 -6`} stroke={C.risk} strokeWidth={2.5} fill="none" />)}
            <g>
                <path d="M44 92 C40 70 70 62 96 68 C128 74 150 70 152 96 C154 124 122 140 92 136 C62 132 48 116 44 92 Z"
                    fill="rgba(251,146,60,0.14)" stroke={C.acid} strokeWidth={2.5} />
                {!reduce && <animateTransform attributeName="transform" type="scale" values="1 1; 1.03 0.9; 1 1" dur="2.2s" additive="sum" repeatCount="indefinite" />}
            </g>
            {[70, 92, 114, 130, 82, 106].map((x, i) => (
                <circle key={x} cx={x} cy={i < 4 ? 100 : 116} r={5 + (i % 2) * 2} fill="none" stroke={C.co2} strokeWidth={2}>
                    {!reduce && <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" />}
                </circle>
            ))}
            <SvgText x={96} y={160} text="CO₂" anchor="middle" size={16} color={C.co2} weight={700} />
            {/* anel do GI */}
            <circle cx={208} cy={96} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
            <motion.circle cx={208} cy={96} r={r} fill="none" stroke={C.risk} strokeWidth={10} strokeLinecap="round"
                transform="rotate(-90 208 96)" strokeDasharray={circ}
                initial={{ strokeDashoffset: reduce ? circ * (1 - GI_RATE.bicarb / 100) : circ }} animate={{ strokeDashoffset: circ * (1 - GI_RATE.bicarb / 100) }}
                transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.5, ease: EASE_OUT }} />
            <SvgText x={208} y={102} text={`${br(GI_RATE.bicarb, 1)}%`} anchor="middle" size={17} color="#fff" weight={800} />
            <SvgText x={208} y={152} text="GI" anchor="middle" size={16} color={C.risk} weight={700} />
        </g>
    );
};

const ClockVignette = ({ reduce }: { reduce: boolean }) => {
    const cx = 130;
    const cy = 80;
    const R = 62;
    /** 0–360 min depois da dose = uma volta. */
    const pt = (t: number, r: number): { x: number; y: number } => {
        const a = (t / 360) * 2 * Math.PI - Math.PI / 2;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    };
    const a0 = pt(PEAK_WINDOW.from, R);
    const a1 = pt(PEAK_WINDOW.to, R);
    return (
        <g>
            <circle cx={cx} cy={cy} r={R} fill="rgba(4,8,15,0.9)" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
            <motion.path d={`M${a0.x.toFixed(1)} ${a0.y.toFixed(1)} A${R} ${R} 0 0 1 ${a1.x.toFixed(1)} ${a1.y.toFixed(1)}`} fill="none"
                stroke={C.base} strokeWidth={12} strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.3, ease: EASE_IN_OUT }} />
            {[0, 60, 120, 180, 240, 300].map(t => {
                const p = pt(t, R - 26);
                return <SvgText key={t} x={p.x} y={p.y + 6} text={`${t / 60}h`} anchor="middle" size={16} color="#CBD5E1" weight={600} />;
            })}
            {FIGHTS.map((f, i) => {
                const inside = f.start >= PEAK_WINDOW.from && f.start <= PEAK_WINDOW.to;
                const p = pt(f.start, R + 2);
                return (
                    <motion.g key={f.start} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ duration: DUR.text, ease: EASE_OUT, delay: reduce ? 0 : stagger(i, 0.5) }}>
                        <circle cx={p.x} cy={p.y} r={12} fill={inside ? C.base : C.co2} stroke="#04080F" strokeWidth={2} />
                        <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>{i + 1}</text>
                    </motion.g>
                );
            })}
            <circle cx={cx} cy={cy} r={4} fill="#fff" />
            <SvgText x={cx} y={178} text="pico 75–180 min após a dose" anchor="middle" size={16} color={C.base} weight={700} />
        </g>
    );
};

const BanVignette = () => (
    <g>
        <g transform="rotate(-30 120 86)">
            <rect x={70} y={64} width={100} height={44} rx={22} fill="rgba(251,146,60,0.16)" stroke={C.acid} strokeWidth={2.5} />
            <line x1={120} x2={120} y1={64} y2={108} stroke={C.acid} strokeWidth={2} />
        </g>
        <circle cx={120} cy={86} r={60} fill="none" stroke={C.risk} strokeWidth={8} />
        <line x1={78} x2={162} y1={44} y2={128} stroke={C.risk} strokeWidth={8} strokeLinecap="round" />
        <rect x={180} y={18} width={52} height={32} rx={8} fill={C.risk} />
        <SvgText x={206} y={41} text="S5" anchor="middle" size={20} color="#fff" weight={800} />
        <SvgText x={120} y={170} text="alcalose + hipocalemia" anchor="middle" size={16} color={C.acidSoft} weight={700} />
    </g>
);

const VIGNETTE: Record<(typeof MAT_WEIGHS)[number]['id'], (p: { reduce: boolean }) => ReactElement> = {
    balanca: ScaleVignette,
    estomago: StomachVignette,
    relogio: ClockVignette,
    corte: BanVignette,
};

export const Weighs = ({ reduce }: { reduce: boolean }) => (
    <div className="grid h-full grid-cols-4 gap-3">
        {MAT_WEIGHS.map((w, i) => {
            const Art = VIGNETTE[w.id];
            return (
                <motion.div key={w.id} className="flex min-h-0 flex-col gap-1 rounded-xl border bg-white/[0.03] px-3 pb-3 pt-2"
                    style={{ borderColor: `${w.color}66` }} {...fadeUp(i, reduce)}>
                    <svg viewBox="0 0 260 184" width="100%" className="min-h-0 flex-1" role="img" aria-label={w.title}>
                        <Art reduce={reduce} />
                    </svg>
                    <span className="font-body text-[1.25rem] font-semibold leading-tight" style={{ color: w.color }}>{w.title}</span>
                    <span className="min-h-[5.5em] text-[16px] leading-snug text-gray-100">{w.text}</span>
                </motion.div>
            );
        })}
    </div>
);
