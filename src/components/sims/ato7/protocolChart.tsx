import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { FLOW, type FlowNode } from './protocol';

/**
 * Fluxograma do slide 95: losangos para as perguntas (com saída rosa), retângulos para as ações e o terminal da decisão.
 * O caminho acende até o passo atual; os conectores acesos correm um traço (SMIL, parado com movimento reduzido).
 */

const W = 1136;
const H = 146;
const CY = 50;
const EXIT_Y = 112;
const SIZE: Record<FlowNode['shape'], { w: number; h: number }> = {
    pergunta: { w: 184, h: 92 },
    ação: { w: 148, h: 62 },
    fim: { w: 120, h: 56 },
};

/** Centro x de cada nó, distribuindo a sobra igualmente entre os conectores. */
const CENTERS = (() => {
    const widths = FLOW.map(n => SIZE[n.shape].w);
    const gap = (W - widths.reduce((a, b) => a + b, 0)) / (FLOW.length - 1);
    return widths.map((w, i) => widths.slice(0, i).reduce((a, b) => a + b, 0) + gap * i + w / 2);
})();

const DIM = 'rgba(255,255,255,0.22)';
const FADE = { transition: 'fill .5s, stroke .5s, opacity .5s, filter .5s' } as const;

const Shape = ({ n, cx, lit, active }: { n: FlowNode; cx: number; lit: boolean; active: boolean }) => {
    const { w, h } = SIZE[n.shape];
    const look = {
        fill: active ? `${C.base}4d` : lit ? `${C.base}1f` : 'rgba(255,255,255,0.03)',
        stroke: lit ? C.base : DIM,
        strokeWidth: active ? 3 : 2,
        style: { ...FADE, filter: active ? `drop-shadow(0 0 10px ${C.base})` : 'none' },
    };
    if (n.shape === 'pergunta') {
        return <path d={`M${cx},${CY - h / 2} L${cx + w / 2},${CY} L${cx},${CY + h / 2} L${cx - w / 2},${CY} Z`} strokeLinejoin="round" {...look} />;
    }
    return <rect x={cx - w / 2} y={CY - h / 2} width={w} height={h} rx={n.shape === 'fim' ? h / 2 : 12} {...look} />;
};

const Label = ({ n, cx, lit }: { n: FlowNode; cx: number; lit: boolean }) => {
    const y0 = CY + 6 - (n.label.length - 1) * 10;
    return (
        <>
            {n.label.map((line, k) => (
                <SvgText key={line} x={cx} y={y0 + k * 20} text={line} size={16} anchor="middle" color={lit ? '#FFFFFF' : '#9CA3AF'} weight={700} />
            ))}
        </>
    );
};

/** Conector com ponta; aceso = ciano com traço correndo. */
const Connector = ({ x1, x2, lit, pass, reduce }: { x1: number; x2: number; lit: boolean; pass?: string; reduce: boolean }) => {
    const color = lit ? C.base : DIM;
    const tip = x2 - 2;
    return (
        <g style={FADE}>
            <line x1={x1 + 2} x2={tip - 4} y1={CY} y2={CY} stroke={color} strokeWidth={3} strokeLinecap="round"
                strokeDasharray={lit && !reduce ? '7 5' : undefined}>
                {lit && !reduce && <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.9s" repeatCount="indefinite" />}
            </line>
            <polyline points={`${tip - 9},${CY - 7} ${tip},${CY} ${tip - 9},${CY + 7}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            {pass && <SvgText x={(x1 + x2) / 2} y={CY - 12} text={pass} size={15} anchor="middle" color={lit ? C.baseSoft : '#9CA3AF'} weight={700} />}
        </g>
    );
};

/** Saída rosa embaixo do losango (ou a legenda curta, nas ações). */
const Below = ({ n, cx, lit, last }: { n: FlowNode; cx: number; lit: boolean; last: boolean }) => {
    if (!n.exit) {
        return <SvgText x={last ? W - 2 : cx} y={EXIT_Y + 18} text={n.short} size={15} anchor={last ? 'end' : 'middle'} color={lit ? '#CBD5E1' : C.muted} weight={500} />;
    }
    const pillW = n.exit.length * 8 + 28;
    return (
        <g>
            {/* Saída de passo futuro: traço e pílula recuam; o texto troca o rosa por cinza claro, em opacidade cheia. */}
            <motion.g initial={false} animate={{ opacity: lit ? 1 : 0.3 }} transition={{ duration: 0.4, ease: EASE_OUT }}>
                <line x1={cx} x2={cx} y1={CY + SIZE.pergunta.h / 2} y2={EXIT_Y} stroke={C.risk} strokeWidth={2.5} strokeDasharray="4 4" />
                <rect x={cx - pillW / 2} y={EXIT_Y} width={pillW} height={27} rx={8} fill={`${C.risk}1f`} stroke={`${C.risk}aa`} strokeWidth={1.5} />
            </motion.g>
            <SvgText x={cx} y={EXIT_Y + 19} text={n.exit} size={15} anchor="middle" color={lit ? C.risk : C.muted} weight={700} />
        </g>
    );
};

interface ChartProps {
    step: number;
    onSelect: (i: number) => void;
    reduce: boolean;
}

export const ProtocolChart = ({ step, onSelect, reduce }: ChartProps) => (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="shrink-0 overflow-visible" role="img"
        aria-label="Fluxograma: janela, contraindicação, regras, testar no treino, registrar, decidir">
        {FLOW.slice(0, -1).map((n, i) => (
            <Connector key={n.id} x1={CENTERS[i] + SIZE[n.shape].w / 2} x2={CENTERS[i + 1] - SIZE[FLOW[i + 1].shape].w / 2}
                lit={i < step} pass={n.pass} reduce={reduce} />
        ))}
        {FLOW.map((n, i) => (
            <g key={n.id} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }} aria-label={`Passo ${i + 1}: ${n.q}`}>
                <Shape n={n} cx={CENTERS[i]} lit={i <= step} active={i === step} />
                <Label n={n} cx={CENTERS[i]} lit={i <= step} />
                <Below n={n} cx={CENTERS[i]} lit={i <= step} last={i === FLOW.length - 1} />
            </g>
        ))}
    </svg>
);
