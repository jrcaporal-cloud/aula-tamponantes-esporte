import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CURVES, NEAR_PEAK, shape, THRESHOLD, valueAt } from './pico';

/** Curvas individuais de HCO₃⁻ × tempo (viewBox 700 × 372). */

export const KW = 700;
export const KH = 372;
const X0 = 70;
const X1 = 680;
const Y0 = 300;
const Y1 = 30;
const T_MAX = 240;
const V_MAX = 13;
const sx = (t: number) => X0 + (t / T_MAX) * (X1 - X0);
const sy = (v: number) => Y0 - (v / V_MAX) * (Y0 - Y1);

const curvePath = (tp: number, amp: number) =>
    Array.from({ length: 97 }, (_, i) => (i / 96) * T_MAX)
        .map((t, i) => `${i ? 'L' : 'M'}${sx(t).toFixed(1)} ${sy(t <= 0 ? 0 : amp * shape(t, tp)).toFixed(1)}`).join(' ');

interface PeakChartProps {
    /** Horário fixo da prova (min após a dose); null = sem faixa. */
    fixedT: number | null;
    individual: boolean;
    /** Médias de Tmax por sessão (de Oliveira 2020). */
    sessions: readonly number[] | null;
}

export const PeakChart = ({ fixedT, individual, sessions }: PeakChartProps) => (
    <svg viewBox={`0 0 ${KW} ${KH}`} width="100%" height="100%" role="img" aria-label="Curvas individuais de bicarbonato no sangue">
        {[0, 4, 8, 12].map(v => (
            <g key={v}>
                <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke="rgba(255,255,255,0.06)" />
                <SvgText x={X0 - 12} y={sy(v) + 6} text={v ? `+${v}` : '0'} anchor="end" size={16} weight={500} color={C.muted} />
            </g>
        ))}
        {[0, 60, 120, 180, 240].map(t => (
            <SvgText key={t} x={sx(t)} y={Y0 + 26} text={`${t}`} anchor="middle" size={16} weight={500} color={C.muted} />
        ))}
        <SvgText x={X0} y={Y0 + 52} text="minutos após a dose de 0,3 g/kg" size={16} weight={500} color="#CBD5E1" />
        <SvgText x={X0 - 12} y={Y1 - 10} text="Δ HCO₃⁻ (mmol/L)" size={16} weight={600} color="#CBD5E1" />
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="rgba(255,255,255,0.3)" />
        <line x1={X0} x2={X1} y1={sy(THRESHOLD)} y2={sy(THRESHOLD)} stroke={C.lactate} strokeDasharray="6 6" strokeOpacity={0.7} />
        <SvgText x={X1} y={sy(THRESHOLD) + 22} text="+5 mmol/L" anchor="end" size={16} weight={700} color={C.lactate} />
        {sessions && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <rect x={sx(75)} y={Y1} width={sx(240) - sx(75)} height={Y0 - Y1} fill={C.ok} opacity={0.07} />
                <SvgText x={X1} y={Y0 + 52} text="> 80% acima de +5: 75–240 min" anchor="end" size={16} weight={700} color={C.ok} />
                {sessions.map((t, i) => (
                    <g key={t}>
                        <line x1={sx(t)} x2={sx(t)} y1={Y1 + 20} y2={Y0} stroke="#fff" strokeWidth={2} strokeDasharray="3 4" />
                        <SvgText x={sx(t) + (i === 0 ? 6 : i === 2 ? -6 : 0)} y={Y1 + (i === 2 ? 36 : 14)} text={`S${i + 1}: ${t}`}
                            anchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} size={16} weight={700} color="#fff" />
                    </g>
                ))}
            </motion.g>
        )}
        {fixedT !== null && (
            <g>
                <rect x={sx(fixedT) - 6} y={Y1} width={12} height={Y0 - Y1} rx={6} fill={C.acid} opacity={0.3} />
                <SvgText x={sx(fixedT) + 12} y={Y1 + 14} text={`largada: ${Math.round(fixedT)} min`} size={17} weight={700} color={C.acid} />
            </g>
        )}
        {CURVES.map(c => {
            const near = fixedT !== null && shape(fixedT, c.tp) >= NEAR_PEAK;
            const above = fixedT !== null && valueAt(c, fixedT) >= THRESHOLD;
            const lit = individual || near;
            return (
                <g key={c.id}>
                    <path d={curvePath(c.tp, c.amp)} fill="none" stroke={lit ? C.base : C.co2} strokeWidth={lit ? 2.6 : 1.6}
                        strokeOpacity={lit ? 0.95 : 0.5} style={{ transition: 'stroke 0.3s, stroke-opacity 0.3s' }} />
                    {individual && <circle cx={sx(c.tp)} cy={sy(c.amp)} r={5.5} fill={C.base} stroke="#04080F" strokeWidth={1.5} />}
                    {fixedT !== null && !individual && (
                        <circle cx={sx(fixedT)} cy={sy(valueAt(c, fixedT))} r={4.5} fill={near ? C.base : above ? C.lactate : C.co2} />
                    )}
                </g>
            );
        })}
    </svg>
);
