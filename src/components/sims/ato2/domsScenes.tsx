import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HALF_LIFE_MIN as HALF_LIFE, remaining } from './shuttle.content';

/**
 * Cenas do slide "A Dor que Vem Descendo o Morro" (viewBox 1136 × 300).
 * Raia de corrida: rampa com corredor, perna com os músculos que doeram (Schwane 1983), barra de
 * intensidade e, por passo, o lactato inferido ou a CK em 24 h. Cronologia: eixo quebrado minutos × dias.
 */

export const DOMS_W = 1136;
export const DOMS_H = 294;

/** Corredor geométrico (pés na origem). */
const Runner = ({ color }: { color: string }) => (
    <g stroke={color} strokeWidth={4} strokeLinecap="round" fill="none">
        <circle cx={2} cy={-40} r={7} fill={color} stroke="none" />
        <path d="M0 -32 L-3 -16" />
        <path d="M-3 -16 L7 -7 L4 0 M-3 -16 L-10 -6 L-16 -4" />
        <path d="M-1 -28 L9 -22 L14 -27 M-1 -28 L-10 -22" />
    </g>
);

/** Perna esquemática de perfil (quadril na origem); `sore` acende glúteo, quadríceps e perna — os locais da dor no estudo. */
const LEG = 'M-14 4 C-18 -10 4 -14 12 -4 C22 14 30 36 32 56 C32 70 22 92 18 110 L38 116 L38 123 L2 123 C2 108 -6 92 -4 78 C-2 68 6 66 12 62 C2 46 -10 26 -14 4 Z';
const MUSCLES = [
    { cx: -8, cy: 4, rx: 9, ry: 13, rot: 0 },
    { cx: 19, cy: 28, rx: 8, ry: 24, rot: -22 },
    { cx: 3, cy: 86, rx: 6.5, ry: 17, rot: 8 },
] as const;

const Leg = ({ x, y, tone, glow, reduce }: { x: number; y: number; tone: string | null; glow: boolean; reduce: boolean }) => (
    <g transform={`translate(${x} ${y})`}>
        <path d={LEG} fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
        {MUSCLES.map(m => (
            <ellipse key={m.cy} cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} transform={`rotate(${m.rot} ${m.cx} ${m.cy})`}
                fill={tone ?? 'rgba(255,255,255,0.18)'} opacity={tone ? 0.85 : 1} style={{ transition: 'fill 0.5s' }} />
        ))}
        {glow && !reduce && MUSCLES.map(m => (
            <ellipse key={`g${m.cy}`} cx={m.cx} cy={m.cy} rx={m.rx + 6} ry={m.ry + 6} transform={`rotate(${m.rot} ${m.cx} ${m.cy})`}
                fill="none" stroke={C.risk} strokeWidth={2}>
                <animate attributeName="opacity" values="0.1;0.8;0.1" dur="2.2s" repeatCount="indefinite" />
            </ellipse>
        ))}
    </g>
);

/** Gotas de lactato (contagem só ordena: mais × menos — inferência, não medida). */
const Drops = ({ x, y, n }: { x: number; y: number; n: number }) => (
    <g>
        {Array.from({ length: 3 }, (_, i) => (
            <path key={i} d={`M${x + i * 22} ${y - 14} q-7 10 0 15 q7 -5 0 -15`} fill={i < n ? C.lactate : 'none'}
                stroke={C.lactate} strokeWidth={1.5} opacity={i < n ? 1 : 0.35} />
        ))}
    </g>
);

interface LaneProps {
    x: number;
    title: string;
    pct: number;
    slope: number;
    color: string;
    /** Passo 0: lactato inferido; a partir do 1: CK e dor. */
    reveal: boolean;
    descent: boolean;
    reduce: boolean;
}

export const Lane = ({ x, title, pct, slope, color, reveal, descent, reduce }: LaneProps) => {
    const x0 = x + 20;
    const x1 = x + 400;
    const y1 = 158;
    const y0 = y1 - slope;
    const track = `M${x0 + 10} ${y0 - 2} L${x1 - 10} ${y1 - 2}`;
    const barX = x0 + 100;
    const barW = 270;
    return (
        <g>
            <SvgText x={x0} y={34} text={title} size={20} color={color} weight={700} />
            <g>
                <circle cx={x + 356} cy={28} r={11} fill="none" stroke="#CBD5E1" strokeWidth={2} />
                <path d={`M${x + 356} ${28} l0 -6 M${x + 356} ${28} l5 3`} stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" />
                <SvgText x={x + 374} y={34} text="45 min" size={17} color="#E5E7EB" weight={700} />
            </g>
            <path d={`M${x0} ${y0} L${x1} ${y1} L${x1} ${y1 + 10} L${x0} ${y1 + 10} Z`} fill={`${color}22`} stroke={color} strokeWidth={2} />
            {slope > 0 && <SvgText x={x0 + 8} y={y1 - 8} text="−10%" size={16} color={C.muted} weight={600} />}
            <g transform={reduce ? `translate(${(x0 + x1) / 2} ${(y0 + y1) / 2 - 2})` : undefined}>
                <Runner color="#fff" />
                {!reduce && <animateMotion dur={slope ? '3.4s' : '2.4s'} repeatCount="indefinite" path={track} />}
            </g>
            <Leg x={x + 470} y={50} tone={reveal ? (descent ? C.risk : C.baseSoft) : null} glow={reveal && descent} reduce={reduce} />
            {reveal && descent && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <SvgText x={x0} y={190} text="contração excêntrica: o músculo freia alongando" size={16} color={C.risk} weight={600} />
                </motion.g>
            )}
            <SvgText x={x0} y={222} text="intensidade" size={16} color={C.muted} weight={500} />
            <rect x={barX} y={208} width={barW} height={16} rx={8} fill="rgba(255,255,255,0.08)" />
            <rect x={barX} y={208} width={barW * (pct / 100)} height={16} rx={8} fill={color} />
            <SvgText x={barX + barW * (pct / 100) + 10} y={222} text={`${pct}% VO₂máx`} size={16} color="#fff" weight={700} />
            {!reveal ? (
                <g>
                    <SvgText x={x0} y={256} text="lactato" size={16} color={C.muted} weight={500} />
                    <Drops x={barX + 6} y={256} n={descent ? 1 : 3} />
                    <SvgText x={barX + 76} y={256} text={descent ? 'menos (inferido)' : 'mais (inferido)'} size={16} color={C.lactate} weight={600} />
                </g>
            ) : (
                <g>
                    <SvgText x={x0} y={256} text="CK 24 h" size={16} color={C.muted} weight={500} />
                    <rect x={barX} y={242} width={barW} height={16} rx={8} fill="rgba(255,255,255,0.08)" />
                    <motion.rect x={barX} y={242} height={16} rx={8} fill={C.risk}
                        initial={{ width: 0 }} animate={{ width: descent ? barW : 4 }} transition={{ duration: reduce ? 0 : 1.1, ease: 'easeOut' }} />
                    <SvgText x={descent ? barX + barW + 10 : barX + 16} y={256} text={descent ? '+351%' : 'sem alta'} size={16} color={descent ? C.risk : '#E5E7EB'} weight={700} />
                    <SvgText x={x0} y={287} text={descent ? 'dor tardia: glúteos, quadríceps, pernas' : 'sem dor tardia'} size={18}
                        color={descent ? C.risk : C.baseSoft} weight={700} />
                </g>
            )}
        </g>
    );
};

/** Eixo quebrado: 0–60 min à esquerda, 0,5–5 dias à direita. */
export const Chronology = ({ reduce }: { reduce: boolean }) => {
    const top = 56;
    const bottom = 222;
    const ax = (t: number) => 70 + (t / 60) * 440;
    const bx = (d: number) => 600 + ((d - 0.5) / 4.5) * 500;
    const y = (f: number) => bottom - f * (bottom - top);
    const lact = Array.from({ length: 61 }, (_, t) => `${t ? 'L' : 'M'}${ax(t).toFixed(1)} ${y(remaining(t)).toFixed(1)}`).join(' ');
    const sore = Array.from({ length: 46 }, (_, i) => {
        const d = 0.5 + i * 0.1;
        return `${i ? 'L' : 'M'}${bx(d).toFixed(1)} ${y(Math.exp(-((d - 2) ** 2) / 1.3)).toFixed(1)}`;
    }).join(' ');
    const draw = (delay: number) => ({ initial: { pathLength: reduce ? 1 : 0 }, animate: { pathLength: 1 }, transition: { duration: reduce ? 0 : 1, delay, ease: 'easeOut' as const } });
    const halves = [1, 2, 3].map(k => ({ t: HALF_LIFE * k, f: 0.5 ** k }));
    return (
        <g>
            {/* janela da dor (1–5 dias) */}
            <rect x={bx(1)} y={top - 6} width={bx(5) - bx(1)} height={bottom - top + 6} rx={10} fill={C.risk} opacity={0.045} />
            <line x1={60} x2={520} y1={bottom} y2={bottom} stroke="rgba(255,255,255,0.35)" />
            <line x1={590} x2={1110} y1={bottom} y2={bottom} stroke="rgba(255,255,255,0.35)" />
            <SvgText x={555} y={bottom + 6} text="//" anchor="middle" size={20} color={C.muted} />
            {[0, 15, 30, 45, 60].map(t => <SvgText key={t} x={ax(t)} y={bottom + 26} text={`${t}`} anchor="middle" size={16} color="#CBD5E1" weight={500} />)}
            {[1, 2, 3, 4, 5].map(d => <SvgText key={d} x={bx(d)} y={bottom + 26} text={`${d}`} anchor="middle" size={16} color="#CBD5E1" weight={500} />)}
            {/* relógio e calendário nos eixos */}
            <g stroke="#CBD5E1" strokeWidth={2} fill="none">
                <circle cx={196} cy={bottom + 47} r={9} />
                <path d={`M196 ${bottom + 47} l0 -5 M196 ${bottom + 47} l4 2`} strokeLinecap="round" />
                <rect x={760} y={bottom + 38} width={18} height={17} rx={3} />
                <path d={`M760 ${bottom + 44} l18 0 M765 ${bottom + 35} l0 5 M773 ${bottom + 35} l0 5`} />
            </g>
            <SvgText x={214} y={bottom + 53} text="minutos de recuperação" size={16} color={C.muted} />
            <SvgText x={786} y={bottom + 53} text="dias depois" size={16} color={C.muted} />
            {/* meias-vidas */}
            {halves.map(h => (
                <motion.g key={h.t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: reduce ? 0 : 0.2 + h.t / 40 }}>
                    <line x1={ax(h.t)} x2={ax(h.t)} y1={y(h.f)} y2={bottom} stroke={C.lactate} strokeDasharray="3 4" opacity={0.6} />
                    <circle cx={ax(h.t)} cy={y(h.f)} r={5} fill={C.lactate} />
                </motion.g>
            ))}
            <SvgText x={ax(HALF_LIFE) + 10} y={y(0.5) - 10} text="½ a cada 9,5 min" size={17} color={C.lactate} weight={700} />
            <motion.path d={lact} fill="none" stroke={C.lactate} strokeWidth={4} {...draw(0.1)} />
            <SvgText x={ax(60)} y={y(0) - 14} text="1 h: quase nada" anchor="end" size={16} color={C.lactate} weight={600} />
            <motion.path d={sore} fill="none" stroke={C.risk} strokeWidth={4} {...draw(0.8)} />
            <SvgText x={bx(2) + 14} y={top - 12} text="dor muscular tardia" size={17} color={C.risk} weight={700} />
            <SvgText x={bx(5)} y={bottom - 12} text="1–5 dias" anchor="end" size={16} color={C.risk} weight={600} />
            {/* o álibi: quando a dor chega, o lactato já foi embora */}
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: reduce ? 0 : 1.8 }}>
                <rect x={420} y={top - 2} width={270} height={34} rx={17} fill="rgba(4,8,15,0.9)" stroke={C.baseSoft} strokeWidth={2} />
                <SvgText x={555} y={top + 21} text="álibi: tempos não batem" anchor="middle" size={17} color={C.baseSoft} weight={700} />
            </motion.g>
        </g>
    );
};
