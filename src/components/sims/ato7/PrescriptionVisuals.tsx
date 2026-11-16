import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import type { CardVisual, FlagsVisual, RangeVisual, StatsVisual } from './prescription';
import { Light } from './ui';

/**
 * Visuais dos cartões de prescrição (slides 100 e 101): régua com as faixas de cada consenso,
 * números grandes ou o mini-semáforo de quem não deve usar.
 */

const VB_W = 640;
const LABEL_W = 150;
const NOTE_W = 116;
const ROW_H = 27;
const AXIS_H = 54;

/** Régua: uma barra por consenso (ou ponto, quando a orientação é um valor só). */
const RangeStrip = ({ v }: { v: RangeVisual }) => {
    const reduce = useReducedMotion() ?? false;
    const x0 = LABEL_W;
    const x1 = VB_W - NOTE_W;
    const sx = (n: number) => x0 + ((n - v.min) / (v.max - v.min)) * (x1 - x0);
    const height = v.rows.length * ROW_H + AXIS_H;
    const axisY = v.rows.length * ROW_H + 8;
    return (
        <svg viewBox={`0 0 ${VB_W} ${height}`} width="100%" height={height} role="img" aria-label={v.unit} style={{ maxWidth: VB_W }}>
            {v.ticks.map(t => (
                <line key={t} x1={sx(t)} x2={sx(t)} y1={0} y2={axisY} stroke="rgba(255,255,255,0.09)" />
            ))}
            {v.rows.map((r, i) => {
                const cy = i * ROW_H + ROW_H / 2;
                const isPoint = r.from === r.to;
                const left = sx(r.from);
                const width = Math.max(sx(r.to) - left, 0);
                return (
                    <g key={r.label}>
                        <SvgText x={LABEL_W - 12} y={cy + 6} text={r.label} anchor="end" size={16} color="#E5E7EB" />
                        {isPoint ? (
                            <motion.circle cx={left} cy={cy} r={8} fill={r.color} stroke="#04080F" strokeWidth={2}
                                initial={reduce ? false : { opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}
                                style={{ transformOrigin: `${left}px ${cy}px` }} />
                        ) : (
                            <motion.rect x={left} y={cy - 8} width={width} height={16} rx={8} fill={`${r.color}cc`}
                                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }}
                                transition={{ delay: stagger(i, 0.1), duration: DUR.bar, ease: EASE_OUT }}
                                style={{ transformOrigin: `${left}px ${cy}px` }} />
                        )}
                        {r.mark !== undefined && (
                            <circle cx={sx(r.mark)} cy={cy} r={6} fill="#fff" stroke={r.color} strokeWidth={3} />
                        )}
                        {r.note && (
                            <SvgText x={Math.max(sx(r.to), r.mark !== undefined ? sx(r.mark) : 0) + (isPoint || r.mark !== undefined ? 15 : 10)} y={cy + 6}
                                text={r.note} size={16} color={r.color} weight={600} />
                        )}
                    </g>
                );
            })}
            <line x1={x0} x2={x1} y1={axisY} y2={axisY} stroke="rgba(255,255,255,0.35)" />
            {v.ticks.map(t => (
                <SvgText key={t} x={sx(t)} y={axisY + 19} text={br(t, v.decimals)} anchor="middle" size={16} color="#D1D5DB" weight={500} />
            ))}
            <SvgText x={(x0 + x1) / 2} y={axisY + 40} text={v.unit} anchor="middle" size={16} color={C.muted} weight={500} />
        </svg>
    );
};

/** Três números grandes, cada um com o que mede. */
const Stats = ({ v }: { v: StatsVisual }) => (
    <div className="grid grid-cols-3 gap-2.5">
        {v.items.map((s, i) => (
            <motion.div key={s.label} className="flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center"
                style={{ borderColor: `${s.color}66`, background: `${s.color}10` }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                <span className="font-display text-[34px] font-semibold leading-none" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[15px] leading-tight text-gray-200">{s.label}</span>
            </motion.div>
        ))}
    </div>
);

/** Mini-semáforo: quem não deve (vermelho) e quem pede cautela (amarelo). */
const Flags = ({ v }: { v: FlagsVisual }) => (
    <div className="flex flex-wrap gap-2">
        {v.items.map((f, i) => (
            <motion.span key={f.label} className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1.5 text-[16px] leading-tight text-gray-100"
                style={{ background: 'rgba(255,255,255,0.03)' }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stagger(i, 0.08, 0.05), duration: DUR.enter, ease: EASE_OUT }}>
                <Light signal={f.signal} size={14} /> {f.label}
            </motion.span>
        ))}
    </div>
);

export const CardVisualView = ({ visual }: { visual: CardVisual }) => {
    if (visual.kind === 'range') return <RangeStrip v={visual} />;
    if (visual.kind === 'stats') return <Stats v={visual} />;
    return <Flags v={visual} />;
};
