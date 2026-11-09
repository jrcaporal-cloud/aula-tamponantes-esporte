import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import type { ForestEstimate, ForestGroup } from './forest';

/**
 * Forest plot do slide 43 (viewBox 790 × 372): losango = estimativa agrupada, barra = IC95.
 * Linhas ainda não reveladas ficam só com o rótulo apagado — a turma vê a estrutura antes do dado.
 */

export const FW = 790;
export const FH = 372;
const TOP = 40;
const ROW_H = 50;
const X0 = 330;
const X1 = 615;
const DOMAIN = [-0.3, 0.8] as const;
const TICKS = [-0.2, 0, 0.2, 0.4, 0.6, 0.8];
const sx = (v: number) => X0 + ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (X1 - X0);

interface ForestChartProps {
    rows: readonly ForestEstimate[];
    shown: readonly ForestGroup[];
    focus: ForestGroup | null;
    showCertainty: boolean;
    reduce: boolean;
}

const rowColor = (r: ForestEstimate) => (r.lo !== undefined && r.lo > 0 ? C.base : C.co2);

const Row = ({ r, i, visible, dim, showCertainty, reduce }: {
    r: ForestEstimate; i: number; visible: boolean; dim: boolean; showCertainty: boolean; reduce: boolean;
}) => {
    const cy = TOP + ROW_H * i + ROW_H / 2;
    const color = rowColor(r);
    const has = r.est !== undefined && r.lo !== undefined && r.hi !== undefined;
    const big = r.group === 'geral';
    return (
        <g opacity={visible ? (dim ? 0.32 : 1) : 0.16} style={{ transition: 'opacity 0.4s' }}>
            <SvgText x={0} y={cy - 3} text={r.label} size={big ? 19 : 18} weight={700} color={big ? '#fff' : '#E5E7EB'} />
            <SvgText x={0} y={cy + 19} text={visible ? r.sub : '…'} size={16} weight={400} color={C.muted} />
            {visible && showCertainty && r.certainty && (
                <g>
                    <rect x={X0 - 92} y={cy - 22} width={82} height={24} rx={6} fill="rgba(250,204,21,0.12)" stroke={`${C.lactate}99`} />
                    <SvgText x={X0 - 51} y={cy - 4} text={r.certainty} size={16} anchor="middle" weight={700} color={C.lactate} />
                </g>
            )}
            {visible && has && (
                <motion.g key={`m-${r.id}`} initial={{ opacity: 0, scaleX: reduce ? 1 : 0.2 }} animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.1, ease: EASE_OUT }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <line x1={sx(r.lo!)} x2={sx(r.hi!)} y1={cy} y2={cy} stroke={color} strokeWidth={3} strokeLinecap="round" />
                    <polygon points={`${sx(r.lo!)},${cy} ${sx(r.est!)},${cy - (big ? 13 : 10)} ${sx(r.hi!)},${cy} ${sx(r.est!)},${cy + (big ? 13 : 10)}`}
                        fill={color} fillOpacity={0.9} stroke="#fff" strokeOpacity={0.7} />
                </motion.g>
            )}
            {visible && !has && (
                <SvgText x={(X0 + X1) / 2} y={cy + 6} text="n.s. (sem estimativa)" size={16} anchor="middle" weight={600} color={C.muted} />
            )}
            {visible && (
                <CountSvgText x={FW} y={cy + 6} anchor="end" size={18} weight={700} color={has ? color : C.muted} run={visible && !reduce}
                    delay={0.1} duration={0.6} text={has ? `${br(r.est!, 2)} (${br(r.lo!, 2)} a ${br(r.hi!, 2)})` : 'sem efeito agrupado'} />
            )}
        </g>
    );
};

export const ForestChart = ({ rows, shown, focus, showCertainty, reduce }: ForestChartProps) => {
    const axisY = TOP + ROW_H * rows.length + 6;
    const overall = rows.find(r => r.group === 'geral');
    return (
        <svg viewBox={`0 0 ${FW} ${FH}`} width="100%" height="100%" role="img" aria-label="Forest plot do bicarbonato de sódio">
            <SvgText x={sx(0) - 10} y={22} text="← piora" anchor="end" size={16} color={C.muted} weight={500} />
            <SvgText x={sx(0) + 10} y={22} text="melhora →" size={16} color={C.muted} weight={500} />
            <SvgText x={FW} y={22} text="ES (IC95)" anchor="end" size={16} color={C.muted} weight={600} />
            {TICKS.map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={TOP - 4} y2={axisY} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={axisY + 22} text={t === 0 ? '0' : br(t, 1)} anchor="middle" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <line x1={sx(0)} x2={sx(0)} y1={TOP - 6} y2={axisY} stroke="rgba(255,255,255,0.55)" strokeDasharray="5 5" />
            {overall?.est !== undefined && shown.length > 1 && (
                <line x1={sx(overall.est)} x2={sx(overall.est)} y1={TOP + ROW_H} y2={axisY} stroke={C.base} strokeOpacity={0.35} strokeDasharray="2 6" strokeWidth={2} />
            )}
            <line x1={X0} x2={X1} y1={axisY} y2={axisY} stroke="rgba(255,255,255,0.25)" />
            <SvgText x={(X0 + X1) / 2} y={axisY + 46} text="tamanho de efeito (DMP)" anchor="middle" size={16} color="#CBD5E1" weight={500} />
            {rows.map((r, i) => (
                <Row key={r.id} r={r} i={i} reduce={reduce} showCertainty={showCertainty}
                    visible={shown.includes(r.group)} dim={focus !== null && focus !== r.group} />
            ))}
        </svg>
    );
};
