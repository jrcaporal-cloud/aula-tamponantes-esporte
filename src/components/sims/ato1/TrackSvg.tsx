import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import {
    FINAL_STRETCH_FROM, RACE_M, finalStretchPath, formatRaceTime, makeTrack, mixHex, phAt, pointAt,
    speedAt, stadiumPath, timeAt, PH_EXHAUSTION, PH_REST,
} from './race';

/** Pista de 800 m vista de cima + curva de velocidade embaixo (slide 10). viewBox = tamanho real da caixa. */

export const TRACK_W = 724;
export const TRACK_H = 462;

const SCALE = 3.0;
const LANE = 1.22 * SCALE;
const LANES = 6;
const TRACK = makeTrack(TRACK_W / 2, 166, SCALE);
const RUNNER_OFFSET = LANE * 0.5;

// Gráfico de velocidade
const GX0 = 64;
const GX1 = 700;
const GY0 = 338;
const GY1 = 432;
const V_MIN = 5.0;
const V_MAX = 7.2;
const gx = (d: number) => GX0 + (d / RACE_M) * (GX1 - GX0);
const gy = (v: number) => GY1 - ((v - V_MIN) / (V_MAX - V_MIN)) * (GY1 - GY0);

const speedPath = (upTo: number): string => {
    const pts: string[] = [];
    for (let d = 0; d <= upTo; d += 8) pts.push(`${gx(d).toFixed(1)} ${gy(speedAt(d)).toFixed(1)}`);
    pts.push(`${gx(upTo).toFixed(1)} ${gy(speedAt(upTo)).toFixed(1)}`);
    return `M ${pts.join(' L ')}`;
};

/** Rastro: últimos ~36 m em segmentos que somem. */
const Trail = ({ distance, color }: { distance: number; color: string }) => {
    const segs = 9;
    const len = 4;
    return (
        <g>
            {Array.from({ length: segs }, (_, i) => {
                const d1 = distance - i * len;
                const d0 = d1 - len;
                if (d0 < 0) return null;
                const a = pointAt(TRACK, d0, RUNNER_OFFSET);
                const b = pointAt(TRACK, d1, RUNNER_OFFSET);
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={6 - i * 0.5}
                    strokeLinecap="round" opacity={0.55 * (1 - i / segs)} />;
            })}
        </g>
    );
};

interface TrackSvgProps {
    distance: number;
    step: number;
}

export const TrackSvg = ({ distance, step }: TrackSvgProps) => {
    const ph = phAt(distance);
    const acid = (PH_REST - ph) / (PH_REST - PH_EXHAUSTION);
    const runnerColor = mixHex(C.base, C.acid, acid);
    const runner = pointAt(TRACK, distance, RUNNER_OFFSET);
    const lap = distance < 400 ? 1 : 2;
    const bandOffset = (LANE * LANES) / 2;
    const finalOn = step >= 1 || distance >= FINAL_STRETCH_FROM;
    const mark600 = pointAt(TRACK, FINAL_STRETCH_FROM, 0);
    const finish = pointAt(TRACK, 0, 0);
    const v = speedAt(distance);

    return (
        <svg viewBox={`0 0 ${TRACK_W} ${TRACK_H}`} className="h-full w-full" role="img"
            aria-label="Pista de 800 metros vista de cima, com a corredora e a curva de velocidade">
            {/* Pista: faixa das raias, linhas e o trecho final em laranja */}
            <path d={stadiumPath(TRACK, bandOffset)} fill="none" stroke={C.co2} strokeOpacity={0.16} strokeWidth={LANE * LANES} />
            {Array.from({ length: LANES + 1 }, (_, k) => (
                <path key={k} d={stadiumPath(TRACK, k * LANE)} fill="none" stroke={C.co2} strokeOpacity={k === 0 || k === LANES ? 0.6 : 0.28} strokeWidth={1.2} />
            ))}
            <path d={finalStretchPath(TRACK, bandOffset)} fill="none" stroke={C.acid} strokeWidth={LANE * LANES}
                style={{ opacity: finalOn ? 0.3 : 0.06, transition: 'opacity 0.6s' }} />
            <path d={stadiumPath(TRACK, -6)} fill={C.baseDeep} fillOpacity={0.08} stroke="none" />

            {/* Linha de chegada e marca dos 600 m */}
            <line x1={finish.x} y1={finish.y} x2={finish.x} y2={finish.y + LANE * LANES} stroke={C.text} strokeWidth={3} />
            <SvgText x={finish.x + 14} y={finish.y + LANE * LANES + 20} text="chegada" color={C.text} size={16} />
            <line x1={mark600.x} y1={mark600.y} x2={mark600.x} y2={mark600.y - LANE * LANES} stroke={C.acid} strokeWidth={3} strokeDasharray="4 3" />
            <SvgText x={mark600.x - 10} y={mark600.y - LANE * LANES - 10} text="600 m · faltam 200" color={C.acidSoft} size={16} anchor="middle" />

            {/* Centro do campo: distância e relógio, ou a pergunta */}
            {step < 2 ? (
                <g>
                    <SvgText x={TRACK.cx} y={TRACK.cy - 6} text={`${Math.round(distance)} m`} color={C.text} size={46} anchor="middle" weight={700} />
                    <SvgText x={TRACK.cx} y={TRACK.cy + 26} text={`volta ${lap} de 2 · ${formatRaceTime(timeAt(distance))}`} color={C.muted} size={18} anchor="middle" />
                </g>
            ) : (
                <g>
                    <SvgText x={TRACK.cx} y={TRACK.cy + 4} text="O que queima?" color={C.acid} size={48} anchor="middle" weight={700} />
                    <SvgText x={TRACK.cx} y={TRACK.cy + 34} text={`chegada em ${formatRaceTime(timeAt(RACE_M))}`} color={C.muted} size={18} anchor="middle" />
                </g>
            )}

            {/* Corredora */}
            <Trail distance={distance} color={runnerColor} />
            <circle cx={runner.x} cy={runner.y} r={16} fill={runnerColor} opacity={0.22} />
            <circle cx={runner.x} cy={runner.y} r={8} fill={runnerColor} stroke="#04080F" strokeWidth={2} />

            {/* Velocidade ao longo da prova */}
            <SvgText x={GX0 - 8} y={GY0 - 14} text="velocidade (m/s)" color={C.muted} size={16} />
            <rect x={gx(FINAL_STRETCH_FROM)} y={GY0} width={gx(RACE_M) - gx(FINAL_STRETCH_FROM)} height={GY1 - GY0}
                fill={C.acid} style={{ opacity: finalOn ? 0.14 : 0.04, transition: 'opacity 0.6s' }} />
            {[5.5, 6.5].map(t => (
                <g key={t}>
                    <line x1={GX0} x2={GX1} y1={gy(t)} y2={gy(t)} stroke={C.co2} strokeOpacity={0.22} strokeDasharray="3 4" />
                    <SvgText x={GX0 - 10} y={gy(t) + 5} text={br(t)} color={C.muted} size={16} anchor="end" />
                </g>
            ))}
            <line x1={GX0} x2={GX1} y1={GY1} y2={GY1} stroke={C.co2} strokeOpacity={0.5} />
            {[0, 200, 400, 600, 800].map(d => (
                <SvgText key={d} x={gx(d)} y={GY1 + 24} text={d === 800 ? '800 m' : String(d)} color={C.muted} size={16} anchor="middle" />
            ))}
            {distance > 1 && <path d={speedPath(distance)} fill="none" stroke={runnerColor} strokeWidth={3} strokeLinejoin="round" />}
            <circle cx={gx(distance)} cy={gy(v)} r={5} fill={runnerColor} />
            <SvgText x={distance > 640 ? gx(distance) - 12 : gx(distance) + 10} y={gy(v) - 14} text={`${br(v)} m/s`}
                color={runnerColor} size={16} anchor={distance > 640 ? 'end' : 'start'} />
        </svg>
    );
};
