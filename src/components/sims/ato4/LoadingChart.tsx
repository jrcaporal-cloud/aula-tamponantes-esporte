import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { HOBSON_G, X_MAX_WEEKS, cumulativeGrams, daysToReach, gainAt } from './loadingModel';

/** Gráfico da carga: semanas × fração do teto do modelo. Desenho em pixels de projeto (viewBox 1:1). */

const CHART_W = 670;
const CHART_H = 300;
const M = { l: 62, r: 22, t: 22, b: 44 };
const sx = (w: number) => M.l + (w / X_MAX_WEEKS) * (CHART_W - M.l - M.r);
const sy = (f: number) => CHART_H - M.b - f * (CHART_H - M.t - M.b);
const STEP = 0.25;

const pathBetween = (from: number, to: number, dose: number, weeksOn: number): string => {
    const pts: string[] = [];
    for (let w = from; w <= to + 1e-6; w += STEP) pts.push(`${sx(w).toFixed(1)},${sy(gainAt(w, dose, weeksOn)).toFixed(1)}`);
    pts.push(`${sx(to).toFixed(1)},${sy(gainAt(to, dose, weeksOn)).toFixed(1)}`);
    return `M${pts.join(' L')}`;
};

const doseLabel = (d: number) => `${br(d, 1)} g/dia`;

interface CurveProps {
    dose: number;
    weeks: number;
    color: string;
    dashed?: boolean;
    labelBelow?: boolean;
}

/** Uma curva de carga com o ponto final rotulado e a marca dos 179 g, se alcançados. */
const Curve = ({ dose, weeks, color, dashed = false, labelBelow = false }: CurveProps) => {
    const end = gainAt(weeks, dose, weeks);
    const hobsonWeek = daysToReach(HOBSON_G, dose) / 7;
    const showHobson = hobsonWeek <= weeks;
    const labelX = Math.min(sx(weeks) + 10, CHART_W - 150);
    return (
        <g>
            <path d={pathBetween(0, weeks, dose, weeks)} fill="none" stroke={color} strokeWidth={dashed ? 3 : 4.5}
                strokeDasharray={dashed ? '8 6' : undefined} strokeLinecap="round" />
            {showHobson && (
                <g>
                    <line x1={sx(hobsonWeek)} x2={sx(hobsonWeek)} y1={sy(gainAt(hobsonWeek, dose, weeks)) - 10} y2={sy(0)}
                        stroke={color} strokeOpacity={0.5} strokeDasharray="3 4" />
                    <circle cx={sx(hobsonWeek)} cy={sy(gainAt(hobsonWeek, dose, weeks))} r={5} fill={C.lactate} stroke="#04080F" strokeWidth={2} />
                    {weeks - hobsonWeek > 1.5 && <SvgText x={sx(hobsonWeek) + 9} y={sy(gainAt(hobsonWeek, dose, weeks)) + 22} text="179 g" color={C.lactate} size={16} />}
                </g>
            )}
            <circle cx={sx(weeks)} cy={sy(end)} r={6.5} fill={color} stroke="#04080F" strokeWidth={2} />
            <SvgText x={labelX} y={sy(end) + (labelBelow ? 26 : -12)} text={`${doseLabel(dose)} · ${Math.round(end * 100)}%`} color={color} size={17} weight={700} />
        </g>
    );
};

interface LoadingChartProps {
    dose: number;
    weeks: number;
    compare: number | null;
    washout: boolean;
}

export const LoadingChart = ({ dose, weeks, compare, washout }: LoadingChartProps) => {
    const compareIsLower = compare !== null && compare < dose;
    const stopX = sx(weeks);
    const grams = cumulativeGrams(dose, weeks);
    return (
        <svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`} role="img"
            aria-label="Carnosina ganha, em porcentagem do teto do modelo, ao longo das semanas">
            {[0.25, 0.5, 0.75, 1].map(f => (
                <g key={f}>
                    <line x1={M.l} x2={CHART_W - M.r} y1={sy(f)} y2={sy(f)} stroke="white" strokeOpacity={f === 0.5 ? 0 : 0.08} />
                    <SvgText x={M.l - 10} y={sy(f) + 6} text={`${f * 100}%`} anchor="end" color={C.muted} size={16} weight={500} />
                </g>
            ))}
            <line x1={M.l} x2={CHART_W - M.r} y1={sy(0.5)} y2={sy(0.5)} stroke={C.carnoSoft} strokeOpacity={0.55} strokeDasharray="6 6" />
            <SvgText x={CHART_W - M.r} y={sy(0.5) - 8} text="ED50 = 377 g acumulados" anchor="end" color={C.carnoSoft} size={16} />
            <SvgText x={CHART_W - M.r} y={sy(1) - 8} text="teto do modelo (Emax)" anchor="end" color={C.muted} size={16} weight={500} />

            {washout && (
                <g>
                    <rect x={stopX} y={M.t} width={CHART_W - M.r - stopX} height={CHART_H - M.t - M.b} fill={C.co2} fillOpacity={0.07} />
                    <line x1={stopX} x2={stopX} y1={M.t} y2={sy(0)} stroke={C.co2} strokeOpacity={0.6} />
                    <SvgText x={stopX + 10} y={M.t + 52} text="parou" color={C.co2} size={17} weight={700} />
                    <path d={pathBetween(weeks, X_MAX_WEEKS, dose, weeks)} fill="none" stroke={C.carnoSoft} strokeWidth={3.5} strokeDasharray="2 7" strokeLinecap="round" />
                </g>
            )}

            {compare !== null && <Curve dose={compare} weeks={weeks} color={C.co2} dashed labelBelow={compareIsLower} />}
            <Curve dose={dose} weeks={weeks} color={C.carno} labelBelow={!compareIsLower && compare !== null} />

            <line x1={M.l} x2={CHART_W - M.r} y1={sy(0)} y2={sy(0)} stroke="white" strokeOpacity={0.3} />
            {Array.from({ length: X_MAX_WEEKS / 4 + 1 }, (_, i) => i * 4).map(w => (
                <SvgText key={w} x={sx(w)} y={CHART_H - M.b + 22} text={`${w}`} anchor="middle" color={C.muted} size={16} weight={500} />
            ))}
            <SvgText x={CHART_W - M.r} y={CHART_H - 4} text="semanas" anchor="end" color={C.muted} size={16} weight={500} />
            <SvgText x={M.l + 8} y={M.t + 4} text={`acumulado: ${Math.round(grams)} g`} color={C.text} size={17} weight={700} />
        </svg>
    );
};
