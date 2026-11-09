import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br, signed } from '../kit/format';
import { B, DAY_NOISE, T0, isoWork, power, ttChange, tteChange } from './noiseModel';

/** Curva potência–duração com a reta do TTE (carga fixa) e a hipérbole do contrarrelógio (trabalho fixo). */

export const NOISE_W = 696;
export const NOISE_H = 440;
const L = 84;
const R = 676;
const T = 20;
const BOT = 376;
const T_MIN = 150;
const T_MAX = 600;
const P_MIN = 88;
const P_MAX = 114;
const TT_COLOR = C.ok;
const TTE_COLOR = C.lactate;

const x = (t: number) => L + (Math.log(t / T_MIN) / Math.log(T_MAX / T_MIN)) * (R - L);
const y = (p: number) => BOT - ((p - P_MIN) / (P_MAX - P_MIN)) * (BOT - T);

const logSpace = (a: number, b: number, k: number) => Array.from({ length: k }, (_, i) => a * (b / a) ** (i / (k - 1)));
const SAMPLES = logSpace(T_MIN, T_MAX, 60);
const pathOf = (pts: readonly (readonly [number, number])[]) => pts.map(([px, py], i) => `${i ? 'L' : 'M'} ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
const curve = (gain: number) => pathOf(SAMPLES.map(t => [x(t), y(power(t, gain))]));

// Hipérbole de trabalho fixo, só no trecho que cabe no gráfico.
const ISO_T = logSpace((100 * T0) / P_MAX, (100 * T0) / P_MIN, 30);
const ISO_PATH = pathOf(ISO_T.map(t => [x(t), y(isoWork(t))]));

// Faixa de ruído do dia basal (±1 DP da potência sustentável).
const BAND = `${pathOf(SAMPLES.map(t => [x(t), y(power(t, DAY_NOISE))]))} ${[...SAMPLES].reverse().map(t => `L ${x(t).toFixed(1)} ${y(power(t, -DAY_NOISE)).toFixed(1)}`).join(' ')} Z`;
const TTE_LO = T0 * (1 - DAY_NOISE / 100) ** (1 / B);
const TTE_HI = T0 * (1 + DAY_NOISE / 100) ** (1 / B);
const TT_LO = T0 * (1 + DAY_NOISE / 100) ** (-1 / (1 - B));
const TT_HI = T0 * (1 - DAY_NOISE / 100) ** (-1 / (1 - B));
const TT_BAND = pathOf(logSpace(TT_LO, TT_HI, 8).map(t => [x(t), y(isoWork(t))]));

const P_TICKS = [90, 95, 100, 105, 110];
const T_TICKS = [150, 200, 300, 400, 600];

interface NoisePlotProps {
    gain: number;
    showNoise: boolean;
}

export const NoisePlot = ({ gain, showNoise }: NoisePlotProps) => {
    const tte = T0 * (1 + tteChange(gain) / 100);
    const tt = T0 * (1 + ttChange(gain) / 100);
    const ttY = y(isoWork(tt));

    return (
        <svg width={NOISE_W} height={NOISE_H} viewBox={`0 0 ${NOISE_W} ${NOISE_H}`} role="img" aria-label="Curva potência–duração">
            {/* grade e eixos */}
            {P_TICKS.map(p => (
                <g key={p}>
                    <line x1={L} x2={R} y1={y(p)} y2={y(p)} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={L - 10} y={y(p) + 6} anchor="end" text={`${p}%`} color={C.muted} size={16} weight={500} />
                </g>
            ))}
            {T_TICKS.map(t => (
                // O último tick fica preso à borda direita: centrado, "600 s" saía do viewBox.
                <SvgText key={t} x={t === T_MAX ? R : x(t)} y={BOT + 24} anchor={t === T_MAX ? 'end' : 'middle'} text={`${t} s`} color={C.muted} size={16} weight={500} />
            ))}
            <line x1={L} x2={R} y1={BOT} y2={BOT} stroke="rgba(255,255,255,0.35)" />
            <SvgText x={(L + R) / 2} y={NOISE_H - 8} anchor="middle" text="duração do esforço (escala log)" color={C.muted} size={16} weight={500} />
            <text x={22} y={(T + BOT) / 2} transform={`rotate(-90 22 ${(T + BOT) / 2})`} textAnchor="middle" fontSize={16} fill={C.muted}
                style={{ fontFamily: 'var(--font-body)' }}>potência sustentável</text>

            {/* ruído do dia a dia */}
            {showNoise && <path d={BAND} fill={C.co2} fillOpacity={0.2} />}

            {/* os dois testes */}
            <line x1={L} x2={R} y1={y(100)} y2={y(100)} stroke={TTE_COLOR} strokeWidth={2} strokeDasharray="7 6" />
            <SvgText x={R - 4} y={y(100) - 10} anchor="end" text="TTE: carga fixa" color={TTE_COLOR} size={16} />
            <path d={ISO_PATH} fill="none" stroke={TT_COLOR} strokeWidth={2} strokeDasharray="7 6" />
            <SvgText x={x(ISO_T[0]) + 10} y={T + 18} text="contrarrelógio: trabalho fixo" color={TT_COLOR} size={16} />

            {showNoise && (
                <g>
                    <line x1={x(TTE_LO)} x2={x(TTE_HI)} y1={y(100) + 16} y2={y(100) + 16} stroke={TTE_COLOR} strokeWidth={8} strokeOpacity={0.6} strokeLinecap="round" />
                    <SvgText x={x(TTE_LO) - 12} y={y(100) + 22} anchor="end" text={`ruído do TTE ≈ ±${br(tteChange(DAY_NOISE), 0)}%`} color={TTE_COLOR} size={16} />
                    <path d={TT_BAND} fill="none" stroke={TT_COLOR} strokeWidth={12} strokeOpacity={0.45} strokeLinecap="round" />
                    <SvgText x={x(318)} y={y(91)} text={`ruído do contrarrelógio ≈ ±${br(-ttChange(DAY_NOISE), 1)}%`} color={TT_COLOR} size={16} />
                </g>
            )}

            {/* curvas: dia basal e com ganho */}
            <path d={curve(0)} fill="none" stroke={C.co2} strokeWidth={3} />
            <path d={curve(gain)} fill="none" stroke={C.base} strokeWidth={3.5} />
            <SvgText x={x(170)} y={y(power(170, gain)) - 12} text={`com ${signed(gain, 0)}% de potência`} color={C.base} size={16} />
            <SvgText x={x(470)} y={y(power(470, 0)) + 30} text="dia basal" color={C.co2} size={16} />

            {/* o que cada teste registra */}
            <line x1={x(T0)} x2={x(tte)} y1={y(100)} y2={y(100)} stroke={TTE_COLOR} strokeWidth={4} />
            <circle cx={x(T0)} cy={y(100)} r={6} fill={C.text} stroke="#04080F" strokeWidth={2} />
            <circle cx={x(tte)} cy={y(100)} r={7} fill={TTE_COLOR} stroke="#04080F" strokeWidth={2} />
            <SvgText x={x(tte)} y={y(100) - 16} anchor="middle" text={`TTE ${signed(tteChange(gain), 0)}%`} color={TTE_COLOR} size={18} weight={700} />
            <circle cx={x(tt)} cy={ttY} r={7} fill={TT_COLOR} stroke="#04080F" strokeWidth={2} />
            {/* Acima e à direita do ponto: à esquerda, a linha ciano atravessava o número. */}
            <SvgText x={x(tt) + 12} y={ttY - 26} text={`${signed(ttChange(gain), 1)}%`} color={TT_COLOR} size={18} weight={700} />
        </svg>
    );
};
