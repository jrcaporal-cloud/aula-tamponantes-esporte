import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { BASAL, CURVES, CURVE_COLOR, THRESHOLD, VISIT_SHIFTS, hco3At, type AlkaliCurve } from './citrateContent';

/** Gráfico do slide 70: HCO₃⁻ no sangue (mmol/L) × minutos após a dose, para bicarbonato e citrato. */

export const CHART_W = 680;
export const CHART_H = 440;
const M = { l: 62, r: 22, t: 52, b: 66 };
const T_MAX = 300;
const Y_MIN = 24;
const Y_MAX = 36;

const sx = (t: number) => M.l + (t / T_MAX) * (CHART_W - M.l - M.r);
const sy = (v: number) => M.t + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (CHART_H - M.t - M.b);


const pathOf = (curve: AlkaliCurve, shift = 0): string => {
    const pts: string[] = [];
    for (let t = 0; t <= T_MAX; t += 3) pts.push(`${sx(t).toFixed(1)},${sy(hco3At(curve, t, shift)).toFixed(1)}`);
    return `M${pts.join(' L')}`;
};

const PATHS = CURVES.map(c => ({ curve: c, d: pathOf(c) }));
const CITRATE = CURVES[1];
const VISIT_PATHS = VISIT_SHIFTS.map(s => ({ shift: s, d: pathOf(CITRATE, s) }));

interface CitrateChartProps {
    step: number;
    raceMin: number;
}

const Axes = () => (
    <g>
        {[26, 28, 30, 32, 34, 36].map(v => (
            <g key={v}>
                <line x1={M.l} x2={CHART_W - M.r} y1={sy(v)} y2={sy(v)} stroke="rgba(255,255,255,0.08)" />
                <SvgText x={M.l - 10} y={sy(v) + 6} text={String(v)} anchor="end" color={C.muted} />
            </g>
        ))}
        {[0, 60, 120, 180, 240, 300].map(t => (
            <SvgText key={t} x={sx(t)} y={CHART_H - M.b + 24} text={t === 0 ? 'dose' : `${t / 60} h`} anchor="middle" color={C.muted} />
        ))}
        <SvgText x={M.l - 10} y={M.t - 18} text="HCO₃⁻ (mmol/L)" color={C.muted} />
        <line x1={M.l} x2={CHART_W - M.r} y1={sy(BASAL)} y2={sy(BASAL)} stroke={C.co2} strokeDasharray="4 6" />
        <SvgText x={M.l + 6} y={sy(BASAL) + 22} text="basal" color={C.co2} />
    </g>
);

/** Faixas das janelas ≥ +6 mmol/L e marcas do pico GI (passo 2 em diante). */
const Windows = () => (
    <g>
        <line x1={M.l} x2={CHART_W - M.r} y1={sy(BASAL + THRESHOLD)} y2={sy(BASAL + THRESHOLD)} stroke="rgba(255,255,255,0.35)" strokeDasharray="6 5" />
        <SvgText x={M.l + 6} y={sy(BASAL + THRESHOLD) - 8} text="+6 mmol/L" color={C.text} />
        {CURVES.map((c, i) => (
            <g key={c.id}>
                <rect x={sx(c.window[0])} y={M.t} width={sx(c.window[1]) - sx(c.window[0])} height={CHART_H - M.t - M.b}
                    fill={CURVE_COLOR[c.id]} opacity={0.1} />
                <rect x={sx(c.gi[0])} y={CHART_H - M.b - 16 - i * 20} width={Math.max(sx(c.gi[1]) - sx(c.gi[0]), 8)} height={10}
                    rx={3} fill={C.risk} stroke={CURVE_COLOR[c.id]} strokeWidth={2} />
                <SvgText x={sx(c.gi[1]) + 8} y={CHART_H - M.b - 6 - i * 20} text="GI" color={C.risk} />
            </g>
        ))}
    </g>
);

export const CitrateChart = ({ step, raceMin }: CitrateChartProps) => {
    const reduce = useReducedMotion();
    const draw = reduce ? { pathLength: 1 } : { pathLength: 0 };
    return (
        <svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`} role="img"
            aria-label="Curvas de bicarbonato no sangue após citrato e após bicarbonato">
            <Axes />
            {step >= 1 && <Windows />}
            {step === 3 && (
                <g>
                    <rect x={sx(120)} y={M.t} width={sx(240) - sx(120)} height={8} fill={C.ok} opacity={0.7} />
                    <SvgText x={sx(180)} y={M.t - 6} text="janela do grupo: 2–4 h" anchor="middle" color={C.ok} />
                    {VISIT_PATHS.map((v, i) => (
                        <g key={v.shift}>
                            <path d={v.d} fill="none" stroke={C.ok} strokeWidth={2} strokeDasharray="5 6" opacity={0.75} />
                            <SvgText x={sx(CITRATE.tp + v.shift)} y={sy(CITRATE.peak) - 10} text={`visita ${i + 1}`} anchor="middle" color={C.ok} size={16} />
                        </g>
                    ))}
                </g>
            )}
            {PATHS.map(({ curve, d }, i) => (
                <motion.path key={curve.id} d={d} fill="none" stroke={CURVE_COLOR[curve.id]} strokeWidth={step === 3 && curve.id === 'cit' ? 2 : 4}
                    strokeLinecap="round" initial={draw} animate={{ pathLength: 1, opacity: step === 3 && curve.id === 'cit' ? 0.35 : 1 }}
                    transition={{ duration: reduce ? 0 : 1.3, delay: reduce ? 0 : 0.2 + i * 0.5, ease: 'easeInOut' }} />
            ))}
            {(step < 2 || step === 4) && CURVES.map(c => (
                <g key={c.id}>
                    <circle cx={sx(c.tp)} cy={sy(c.peak)} r={6} fill={CURVE_COLOR[c.id]} stroke="#04080F" strokeWidth={2} />
                    <SvgText x={sx(c.tp)} y={sy(c.peak) - 14} text={br(c.peak)} anchor="middle" color={CURVE_COLOR[c.id]} size={20} weight={700} />
                </g>
            ))}
            {step >= 2 && step !== 3 && (
                <g>
                    <line x1={sx(raceMin)} x2={sx(raceMin)} y1={M.t - 4} y2={CHART_H - M.b} stroke={C.acid} strokeWidth={3} />
                    <rect x={sx(raceMin) - 30} y={CHART_H - M.b + 34} width={60} height={24} rx={6} fill={C.acid} />
                    <text x={sx(raceMin)} y={CHART_H - M.b + 52} textAnchor="middle" fontSize={16} fontWeight={700} fill="#04080F"
                        style={{ fontFamily: 'var(--font-body)' }}>prova</text>
                    {CURVES.map(c => (
                        <circle key={c.id} cx={sx(raceMin)} cy={sy(hco3At(c, raceMin))} r={7} fill="#04080F" stroke={CURVE_COLOR[c.id]} strokeWidth={3} />
                    ))}
                </g>
            )}
            <g>
                {CURVES.map((c, i) => (
                    <g key={c.id} transform={`translate(${M.l + 140 + i * 240}, ${M.t - 24})`}>
                        <line x1={0} x2={26} y1={-6} y2={-6} stroke={CURVE_COLOR[c.id]} strokeWidth={4} strokeLinecap="round" />
                        <SvgText x={34} y={0} text={`${c.label} ${c.dose}`} color={CURVE_COLOR[c.id]} />
                    </g>
                ))}
            </g>
        </svg>
    );
};
