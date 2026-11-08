import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { giShape, GOUGH_TT, JONES_RANGES, perfShape } from './dose';

/** Gráficos do slide 45 (viewBox 660 × 372). Eixo x = dose em g/kg. */

export const DW = 660;
export const DH = 372;
const X0 = 70;
const X1 = 630;
const Y0 = 300;
const Y1 = 40;
const DOSES = [0.1, 0.2, 0.3, 0.4, 0.5];
const sx = (d: number) => X0 + ((d - 0.1) / 0.4) * (X1 - X0);

const DoseAxis = ({ label = 'dose (g/kg)' }: { label?: string }) => (
    <g>
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="rgba(255,255,255,0.35)" />
        {DOSES.map(d => <SvgText key={d} x={sx(d)} y={Y0 + 26} text={br(d, 1)} anchor="middle" size={17} weight={600} color={C.muted} />)}
        <SvgText x={(X0 + X1) / 2} y={Y0 + 54} text={label} anchor="middle" size={16} weight={500} color="#CBD5E1" />
    </g>
);

const path = (f: (d: number) => number) =>
    Array.from({ length: 81 }, (_, i) => 0.1 + (i / 80) * 0.4)
        .map((d, i) => `${i ? 'L' : 'M'}${sx(d).toFixed(1)} ${(Y0 - f(d) * (Y0 - Y1 - 20)).toFixed(1)}`).join(' ');

/** Curvas de forma (ganho e GI) com o cursor da dose. */
export const CurveChart = ({ dose, showGi }: { dose: number; showGi: boolean }) => (
    <svg viewBox={`0 0 ${DW} ${DH}`} width="100%" height="100%" role="img" aria-label="Curva dose-resposta ilustrativa">
        <rect x={sx(0.25)} y={Y1} width={sx(0.35) - sx(0.25)} height={Y0 - Y1} fill={C.base} opacity={0.08} rx={8} />
        <SvgText x={sx(0.3)} y={Y1 - 10} text="ótima" anchor="middle" size={17} weight={700} color={C.base} />
        <path d={path(perfShape)} fill="none" stroke={C.base} strokeWidth={4} strokeLinecap="round" />
        <SvgText x={sx(0.44)} y={Y0 - perfShape(0.44) * (Y0 - Y1 - 20) - 16} text="ganho de desempenho" anchor="end" size={17} weight={700} color={C.base} />
        {showGi && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <path d={path(giShape)} fill="none" stroke={C.risk} strokeWidth={4} strokeDasharray="10 7" strokeLinecap="round" />
                <SvgText x={sx(0.37)} y={Y0 - giShape(0.37) * (Y0 - Y1 - 20) + 34} text="sintomas GI" size={17} weight={700} color={C.risk} />
            </motion.g>
        )}
        <line x1={sx(dose)} x2={sx(dose)} y1={Y1} y2={Y0} stroke="#fff" strokeWidth={2} strokeDasharray="4 4" />
        <circle cx={sx(dose)} cy={Y0 - perfShape(dose) * (Y0 - Y1 - 20)} r={8} fill="#fff" />
        <DoseAxis />
    </svg>
);

/** JONES2016: faixa de aumento do HCO₃⁻ entre 16 pessoas, por dose. */
export const BloodChart = () => {
    const sy = (v: number) => Y0 - (v / 14) * (Y0 - Y1);
    return (
        <svg viewBox={`0 0 ${DW} ${DH}`} width="100%" height="100%" role="img" aria-label="Aumento do bicarbonato no sangue por dose">
            {[0, 4, 8, 12].map(v => (
                <g key={v}>
                    <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={X0 - 12} y={sy(v) + 6} text={v ? `+${v}` : '0'} anchor="end" size={16} weight={500} color={C.muted} />
                </g>
            ))}
            <SvgText x={X0 - 12} y={Y1 - 14} text="HCO₃⁻ (mmol/L)" size={16} weight={600} color="#CBD5E1" />
            {JONES_RANGES.map((r, i) => (
                <motion.g key={r.dose} initial={{ opacity: 0, scaleY: 0.2 }} animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 * i }} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
                    <rect x={sx(r.dose) - 26} y={sy(r.hi)} width={52} height={sy(r.lo) - sy(r.hi)} rx={10} fill={C.base} opacity={0.3 + i * 0.25} />
                </motion.g>
            ))}
            {JONES_RANGES.map(r => (
                <g key={`t${r.dose}`}>
                    <SvgText x={sx(r.dose) + 34} y={sy(r.hi) + 6} text={`+${br(r.hi, 1)}`} size={17} weight={700} color="#fff" />
                    <SvgText x={sx(r.dose) + 34} y={sy(r.lo) + 6} text={`+${br(r.lo, 1)}`} size={17} weight={700} color={C.muted} />
                    <SvgText x={sx(r.dose)} y={sy(r.hi) - 14} text={`pico ${r.peak}`} anchor="middle" size={16} weight={500} color={C.lactate} />
                </g>
            ))}
            <DoseAxis />
        </svg>
    );
};

/** GOUGH2018: segundos ganhos em 4 km, no pico individual de cada ciclista. */
export const PeakChart = () => {
    const sy = (s: number) => Y0 - (s / 15) * (Y0 - Y1);
    return (
        <svg viewBox={`0 0 ${DW} ${DH}`} width="100%" height="100%" role="img" aria-label="Ganho em 4 km com 0,2 e 0,3 g/kg">
            <SvgText x={X0} y={Y1 - 14} text="segundos mais rápido que o placebo (4 km, n = 11)" size={16} weight={600} color="#CBD5E1" />
            {[0, 5, 10, 15].map(v => (
                <g key={v}>
                    <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={X0 - 12} y={sy(v) + 6} text={`${v} s`} anchor="end" size={16} weight={500} color={C.muted} />
                </g>
            ))}
            {GOUGH_TT.map((g, i) => {
                const cx = 230 + i * 220;
                return (
                    <g key={g.dose}>
                        <motion.rect x={cx - 50} y={sy(g.mean)} width={100} height={Y0 - sy(g.mean)} rx={8} fill={C.base} opacity={i ? 0.85 : 0.55}
                            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, delay: 0.2 * i }}
                            style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
                        <line x1={cx} x2={cx} y1={sy(g.mean + g.sd)} y2={sy(g.mean - g.sd)} stroke="#fff" strokeWidth={2} />
                        <SvgText x={cx + 14} y={sy(g.mean + g.sd) - 4} text={`−${br(g.mean, 1)} ± ${br(g.sd, 1)} s`} size={18} weight={700} color="#fff" />
                        <SvgText x={cx} y={Y0 + 30} text={`${br(g.dose, 1)} g/kg`} anchor="middle" size={19} weight={700} color={C.base} />
                    </g>
                );
            })}
            <SvgText x={(X0 + X1) / 2} y={Y0 + 58} text="diferença entre as doses: 0,2 s (p = 0,87)" anchor="middle" size={17} weight={700} color={C.lactate} />
        </svg>
    );
};
