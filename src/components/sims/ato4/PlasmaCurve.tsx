import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ITCH_THRESHOLD, PK_CURVES, concentrationAt, type PkCurve } from './paresthesiaContent';

/** β-alanina no plasma depois de 1,6 g: pura × liberação lenta, com o limiar do formigamento (posição ilustrativa). */

const W = 670;
const H = 400;
const M = { l: 40, r: 24, t: 40, b: 46 };
const T_MAX = 4;
const Y_MAX = 290;
const sx = (t: number) => M.l + (t / T_MAX) * (W - M.l - M.r);
const sy = (c: number) => H - M.b - (c / Y_MAX) * (H - M.t - M.b);
const STEP = 0.02;
const COLORS = [C.carno, C.carnoSoft] as const;

const samples = (): number[] => Array.from({ length: Math.round(T_MAX / STEP) + 1 }, (_, i) => i * STEP);

const curvePath = (c: PkCurve): string => `M${samples().map(t => `${sx(t).toFixed(1)},${sy(concentrationAt(t, c)).toFixed(1)}`).join(' L')}`;

const areaPath = (c: PkCurve): string => `${curvePath(c)} L${sx(T_MAX)},${sy(0)} L${sx(0)},${sy(0)} Z`;

/** Parte da curva pura acima do limiar, fechada pela linha do limiar. */
const itchPath = (c: PkCurve): string => {
    const above = samples().filter(t => concentrationAt(t, c) > ITCH_THRESHOLD);
    if (above.length === 0) return '';
    const top = above.map(t => `${sx(t).toFixed(1)},${sy(concentrationAt(t, c)).toFixed(1)}`).join(' L');
    return `M${sx(above[0])},${sy(ITCH_THRESHOLD)} L${top} L${sx(above[above.length - 1])},${sy(ITCH_THRESHOLD)} Z`;
};

interface PlasmaCurveProps {
    /** Destaca as áreas sob a curva (passo "o que fazer"). */
    showArea: boolean;
    reduce: boolean;
}

export const PlasmaCurve = ({ showArea, reduce }: PlasmaCurveProps) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="β-alanina no plasma após 1,6 g, pura e de liberação lenta">
        <SvgText x={M.l} y={20} text="β-alanina no plasma após 1,6 g (picos medidos; forma ilustrativa)" color={C.muted} size={16} weight={500} />
        {showArea && PK_CURVES.map((c, i) => (
            <path key={c.name} d={areaPath(c)} fill={COLORS[i]} fillOpacity={i === 0 ? 0.16 : 0.22} />
        ))}
        {!showArea && <path d={itchPath(PK_CURVES[0])} fill={C.risk} fillOpacity={0.35} />}
        <line x1={M.l} x2={W - M.r} y1={sy(ITCH_THRESHOLD)} y2={sy(ITCH_THRESHOLD)} stroke={C.risk} strokeWidth={2} strokeDasharray="8 6" />
        <SvgText x={W - M.r} y={sy(ITCH_THRESHOLD) - 10} text="limiar do formigamento (posição ilustrativa)" anchor="end" color={C.risk} size={16} />
        {PK_CURVES.map((c, i) => (
            <g key={c.name}>
                <motion.path d={curvePath(c)} fill="none" stroke={COLORS[i]} strokeWidth={4} strokeLinecap="round"
                    strokeDasharray={i === 1 ? '10 6' : undefined}
                    initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 + i * 0.5, ease: EASE_OUT }} />
                <circle cx={sx(c.hours)} cy={sy(c.peak)} r={6} fill={COLORS[i]} stroke="#04080F" strokeWidth={2} />
                <SvgText x={sx(c.hours) + 12} y={sy(c.peak) + (i === 0 ? -6 : -14)} text={`${c.name}: ${c.peakLabel}`} color={COLORS[i]} size={17} weight={700} />
            </g>
        ))}
        {/* Em duas linhas, presas à direita: assim não encostam no rótulo "liberação lenta" (x ≈ 200–435). */}
        {showArea && (
            <g>
                <SvgText x={W - M.r} y={sy(ITCH_THRESHOLD) + 32} text="área sob a curva" anchor="end" color={C.text} size={17} weight={700} />
                <SvgText x={W - M.r} y={sy(ITCH_THRESHOLD) + 54} text="igual nas duas formas" anchor="end" color={C.text} size={17} weight={700} />
            </g>
        )}
        {!showArea && <SvgText x={sx(0.82)} y={sy(178)} text="formiga" color={C.risk} size={17} weight={700} />}
        <line x1={M.l} x2={W - M.r} y1={sy(0)} y2={sy(0)} stroke="white" strokeOpacity={0.3} />
        {[0, 1, 2, 3, 4].map(t => <SvgText key={t} x={sx(t)} y={H - M.b + 22} text={`${t} h`} anchor="middle" color={C.muted} size={16} weight={500} />)}
    </svg>
);
