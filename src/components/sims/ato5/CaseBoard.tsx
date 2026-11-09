import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Quadro de investigação do slide 72: dieta → (pH, glicogênio) → tempo até a exaustão.
 * O passo decide quem acende: o suspeito (pH), a intervenção (NaHCO₃), a pista falsa e o culpado.
 */

export const BOARD_W = 600;
export const BOARD_H = 436;

interface NodeBox { x: number; y: number; w: number; h: number }

const N: Record<'diet' | 'ph' | 'gly' | 'time' | 'bic', NodeBox> = {
    diet: { x: 12, y: 196, w: 170, h: 76 },
    ph: { x: 222, y: 110, w: 160, h: 66 },
    gly: { x: 222, y: 300, w: 160, h: 66 },
    time: { x: 424, y: 196, w: 164, h: 76 },
    bic: { x: 222, y: 12, w: 160, h: 48 },
};

const right = (b: NodeBox) => ({ x: b.x + b.w, y: b.y + b.h / 2 });
const left = (b: NodeBox) => ({ x: b.x, y: b.y + b.h / 2 });

interface EdgeProps { from: { x: number; y: number }; to: { x: number; y: number }; color: string; dashed?: boolean; width?: number; opacity?: number }

const Edge = ({ from, to, color, dashed = false, width = 3, opacity = 1 }: EdgeProps) => (
    <motion.g animate={{ opacity }} transition={{ duration: 0.4, ease: EASE_OUT }}>
        <line x1={from.x} y1={from.y} x2={to.x - 6} y2={to.y} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '7 6' : undefined} />
        <circle cx={to.x - 4} cy={to.y} r={5} fill={color} />
    </motion.g>
);

interface BoardNodeProps { box: NodeBox; title: string; detail: string; color: string; opacity?: number; strong?: boolean }

const BoardNode = ({ box, title, detail, color, opacity = 1, strong = false }: BoardNodeProps) => (
    <motion.g animate={{ opacity }} transition={{ duration: 0.4, ease: EASE_OUT }}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={12} fill={strong ? `${color}26` : 'rgba(255,255,255,0.05)'}
            stroke={color} strokeWidth={strong ? 3 : 1.5} />
        <SvgText x={box.x + box.w / 2} y={box.y + (detail ? box.h / 2 - 4 : box.h / 2 + 6)} text={title} anchor="middle" color="#fff" size={18} weight={700} />
        {detail && <SvgText x={box.x + box.w / 2} y={box.y + box.h / 2 + 20} text={detail} anchor="middle" color={color} size={16} />}
    </motion.g>
);

const Stamp = ({ x, y, text, color, rotate }: { x: number; y: number; text: string; color: string; rotate: number }) => {
    const reduce = useReducedMotion();
    const w = text.length * 13 + 28;
    return (
        <motion.g initial={reduce ? false : { opacity: 0, scale: 1.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE_OUT }} style={{ transformOrigin: `${x}px ${y}px` }}>
            <g transform={`rotate(${rotate} ${x} ${y})`}>
                <rect x={x - w / 2} y={y - 20} width={w} height={40} rx={6} fill="rgba(4,8,15,0.85)" stroke={color} strokeWidth={3} />
                <text x={x} y={y + 7} textAnchor="middle" fontSize={20} fontWeight={800} fill={color} letterSpacing={2}
                    style={{ fontFamily: 'var(--font-display)' }}>{text}</text>
            </g>
        </motion.g>
    );
};

/** Posição do ✕ na seta pH → tempo (0 = início, 1 = ponta). */
const CROSS_AT = 0.55;
/** Centro do carimbo "PISTA FALSA": 12 px à esquerda do centro da coluna, longe do ✕. */
const FALSE_LEAD_X = 290;

export const CaseBoard = ({ step }: { step: number }) => {
    const phFixed = step >= 3;
    const suspectColor = phFixed ? C.base : C.acid;
    const glyColor = step >= 4 ? C.risk : C.co2;
    const phToTime = { from: right(N.ph), to: left(N.time) };
    // O ✕ fica um pouco depois do meio da seta, e o carimbo um pouco à esquerda: o canto do carimbo girado não encosta no ✕.
    const cross = { x: phToTime.from.x + (phToTime.to.x - phToTime.from.x) * CROSS_AT, y: phToTime.from.y + (phToTime.to.y - phToTime.from.y) * CROSS_AT };

    return (
        <svg width={BOARD_W} height={BOARD_H} viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} role="img"
            aria-label="Quadro de investigação: dieta pobre em carboidrato, pH, glicogênio e tempo até a exaustão">
            {step === 0 && <Edge from={right(N.diet)} to={left(N.time)} color={C.co2} dashed />}
            {step === 0 && <SvgText x={303} y={226} text="observado" anchor="middle" color={C.muted} />}
            {step >= 1 && (
                <g>
                    <Edge from={right(N.diet)} to={left(N.ph)} color={suspectColor} />
                    <Edge from={right(N.diet)} to={left(N.gly)} color={glyColor} opacity={step >= 4 ? 1 : 0.5} />
                    <Edge {...phToTime} color={suspectColor} dashed={phFixed} opacity={phFixed ? 0.6 : 1} width={phFixed ? 2 : 4} />
                    <Edge from={right(N.gly)} to={left(N.time)} color={glyColor} width={step >= 4 ? 5 : 2} opacity={step >= 4 ? 1 : 0.5} />
                    <BoardNode box={N.ph} title="pH do sangue" detail={phFixed ? 'corrigido' : '↓ acidose'} color={suspectColor} strong={step >= 1 && step < 4} />
                    <BoardNode box={N.gly} title="Glicogênio" detail="↓ sem carboidrato" color={glyColor} opacity={step >= 4 ? 1 : 0.55} strong={step >= 4} />
                </g>
            )}
            {step >= 2 && (
                <g>
                    <Edge from={{ x: N.bic.x + N.bic.w / 2, y: N.bic.y + N.bic.h }} to={{ x: N.ph.x + N.ph.w / 2 + 6, y: N.ph.y }} color={C.base} />
                    <BoardNode box={N.bic} title="NaHCO₃" detail="" color={C.base} strong />
                </g>
            )}
            <BoardNode box={N.diet} title="Dieta" detail="pobre em carboidrato" color={C.lactate} />
            <BoardNode box={N.time} title="Tempo até a" detail="exaustão ↓" color={C.acid} strong={step >= 3} />
            {phFixed && (
                <g>
                    <line x1={cross.x - 12} y1={cross.y - 12} x2={cross.x + 12} y2={cross.y + 12} stroke={C.risk} strokeWidth={4} />
                    <line x1={cross.x - 12} y1={cross.y + 12} x2={cross.x + 12} y2={cross.y - 12} stroke={C.risk} strokeWidth={4} />
                </g>
            )}
            {phFixed && step < 4 && <Stamp x={FALSE_LEAD_X} y={196} text="PISTA FALSA" color={C.risk} rotate={-8} />}
            {step >= 4 && <Stamp x={302} y={398} text="CULPADO" color={C.risk} rotate={-6} />}
            {step >= 4 && <Stamp x={FALSE_LEAD_X} y={196} text="PISTA FALSA" color={C.muted} rotate={-8} />}
        </svg>
    );
};
