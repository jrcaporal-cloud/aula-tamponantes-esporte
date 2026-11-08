import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType } from 'react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { WINDOW_SEC, type CaseVerdict, type Sport } from './cases';
import { SIGNAL, type Signal } from './shared';

/** Visuais do slide 94: pictograma do esporte, régua do esforço × janela do tampão e o carimbo do veredito. */

const INK = '#F3F4F6';
const LIMB = { stroke: INK, strokeWidth: 8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

const Runner = () => (
    <>
        <line x1={14} x2={106} y1={104} y2={104} stroke={`${C.base}66`} strokeWidth={3} strokeDasharray="10 8" />
        <circle cx={72} cy={22} r={10} fill={INK} />
        <polyline points="68,36 58,64" {...LIMB} />
        <polyline points="66,42 82,52 94,44" {...LIMB} />
        <polyline points="66,42 50,50 40,62" {...LIMB} />
        <polyline points="58,64 74,80 70,98" {...LIMB} />
        <polyline points="58,64 46,82 28,86" {...LIMB} />
    </>
);

const Grappler = () => (
    <>
        <line x1={12} x2={108} y1={106} y2={106} stroke={`${C.base}66`} strokeWidth={3} />
        <circle cx={58} cy={22} r={10} fill={INK} />
        <polyline points="58,36 56,68" {...LIMB} />
        <polyline points="58,44 78,54 92,48" {...LIMB} />
        <polyline points="58,46 76,64 90,62" {...LIMB} />
        <polyline points="56,68 40,86 36,102" {...LIMB} />
        <polyline points="56,68 74,86 80,102" {...LIMB} />
        <line x1={46} x2={68} y1={62} y2={62} stroke={C.carno} strokeWidth={6} strokeLinecap="round" />
    </>
);

const Rower = () => (
    <>
        <path d="M10,84 Q60,104 110,84" fill="none" stroke={`${C.base}aa`} strokeWidth={5} strokeLinecap="round" />
        <path d="M6,104 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke={`${C.base}55`} strokeWidth={3} />
        <circle cx={46} cy={30} r={10} fill={INK} />
        <polyline points="48,44 58,74" {...LIMB} />
        <polyline points="50,52 76,60" {...LIMB} />
        <polyline points="58,74 80,62 90,78" {...LIMB} />
        <line x1={76} y1={60} x2={112} y2={98} stroke={C.lactate} strokeWidth={5} strokeLinecap="round" />
    </>
);

const Swimmer = () => (
    <>
        <path d="M4,80 q12,-8 24,0 t24,0 t24,0 t24,0 t24,0" fill="none" stroke={`${C.base}aa`} strokeWidth={4} />
        <path d="M4,98 q12,-8 24,0 t24,0 t24,0 t24,0 t24,0" fill="none" stroke={`${C.base}55`} strokeWidth={3} />
        <circle cx={30} cy={66} r={10} fill={INK} />
        <polyline points="42,70 94,72" {...LIMB} />
        <polyline points="48,68 62,40 82,44" {...LIMB} />
        <polyline points="94,72 110,64" {...LIMB} />
        <polyline points="94,72 110,82" {...LIMB} />
    </>
);

const FIGURE: Record<Sport, ComponentType> = { corrida: Runner, 'jiu-jitsu': Grappler, remo: Rower, natação: Swimmer };

/** Pictograma geométrico do esporte, num disco com a cor do semáforo (ou neutro antes do veredito). */
export const Avatar = ({ sport, size = 120, signal }: { sport: Sport; size?: number; signal?: Signal }) => {
    const Figure = FIGURE[sport];
    const ring = signal ? SIGNAL[signal].color : C.base;
    return (
        <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`pictograma: ${sport}`} className="shrink-0">
            <circle cx={60} cy={60} r={57} fill={`${ring}14`} stroke={`${ring}99`} strokeWidth={2.5} style={{ transition: 'stroke .5s, fill .5s' }} />
            <g transform="translate(0 2)"><Figure /></g>
        </svg>
    );
};

/** Escala log do tempo (5 s → 30 min). */
const T0 = 5;
const T1 = 1800;
const TICKS = [
    { s: 10, label: '10 s' }, { s: 30, label: '30 s' }, { s: 60, label: '1 min' },
    { s: 120, label: '2 min' }, { s: 300, label: '5 min' }, { s: 720, label: '12 min' },
] as const;

interface RulerProps {
    c: CaseVerdict;
    width: number;
    /** Compacto: sem legenda à esquerda e com marcas só nas pontas da janela. */
    compact?: boolean;
    reduce: boolean;
}

/** Régua do tempo de esforço contra a janela do tampão (30 s a ~12 min). */
export const EffortRuler = ({ c, width, compact = false, reduce }: RulerProps) => {
    const H = compact ? 84 : 82;
    const x0 = compact ? 8 : 112;
    const x1 = width - 10;
    const sx = (s: number) => x0 + (Math.log(s / T0) / Math.log(T1 / T0)) * (x1 - x0);
    const [w0, w1] = WINDOW_SEC;
    const bandY = 24;
    const bandH = 30;
    const [e0, e1] = c.effortSec;
    const ex0 = sx(e0) - (e0 === e1 ? 7 : 0);
    const ex1 = sx(e1) + (e0 === e1 ? 7 : 0);
    const mid = (ex0 + ex1) / 2;
    const anchor = mid > x1 - 90 ? 'end' : mid < x0 + 90 ? 'start' : 'middle';
    const labelX = anchor === 'end' ? ex1 : anchor === 'start' ? ex0 : mid;
    const ticks = compact ? TICKS.filter(t => t.s === w0 || t.s === w1) : TICKS;
    return (
        <svg viewBox={`0 0 ${width} ${H}`} width={width} height={H} role="img"
            aria-label={`esforço de ${c.name}: ${c.effort}; janela do tampão de 30 s a ~12 min`}>
            {!compact && (
                <>
                    <SvgText x={x0 - 12} y={bandY + 13} text="janela do" size={16} anchor="end" color={C.baseSoft} />
                    <SvgText x={x0 - 12} y={bandY + 31} text="tampão" size={16} anchor="end" color={C.baseSoft} />
                </>
            )}
            <line x1={x0} x2={x1} y1={bandY + bandH} y2={bandY + bandH} stroke="rgba(255,255,255,0.35)" />
            <rect x={sx(w0)} y={bandY} width={sx(w1) - sx(w0)} height={bandH} rx={6} fill={`${C.base}24`} stroke={`${C.base}88`} strokeWidth={1.5} />
            {ticks.map(t => (
                <g key={t.s}>
                    <line x1={sx(t.s)} x2={sx(t.s)} y1={bandY + bandH} y2={bandY + bandH + 6} stroke="rgba(255,255,255,0.45)" />
                    <SvgText x={sx(t.s)} y={bandY + bandH + 22} text={t.label} size={16} anchor="middle" color="#CBD5E1" weight={500} />
                </g>
            ))}
            {/* o esforço do personagem entra (ou não) na janela */}
            <motion.g initial={reduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
                <rect x={ex0} y={bandY + 6} width={ex1 - ex0} height={bandH - 12} rx={5} fill={C.acid} />
                <SvgText x={labelX} y={bandY - 8} text={c.effort} size={16} anchor={anchor} color={C.acidSoft} weight={700} />
            </motion.g>
        </svg>
    );
};

/** Carimbo do veredito: bate e fica levemente torto. */
export const Stamp = ({ text, signal, size = 'lg' }: { text: string; signal: Signal; size?: 'lg' | 'sm' }) => {
    const reduce = useReducedMotion();
    const color = SIGNAL[signal].color;
    const big = size === 'lg';
    return (
        <motion.div className="inline-flex flex-col items-center self-start rounded-xl px-4 py-1"
            style={{ border: `3px double ${color}`, color, rotate: big ? -5 : -4, background: `${color}12` }}
            initial={reduce ? false : { scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.15 }}>
            <span className={`font-display font-bold uppercase leading-none tracking-wide ${big ? 'text-[23px]' : 'text-[19px]'}`}>{text}</span>
            <span className="mt-1 font-mono text-[15px] uppercase leading-none tracking-wider">{SIGNAL[signal].label}</span>
        </motion.div>
    );
};
