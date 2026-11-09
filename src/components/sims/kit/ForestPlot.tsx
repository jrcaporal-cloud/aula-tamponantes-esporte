import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { br } from './format';
import { C } from './palette';
import { SvgText } from './ui';

/**
 * Gráfico de floresta reutilizável (meta-análises da aula). Cada linha é um estudo, um subgrupo
 * ou um efeito agrupado (losango). Opcionalmente desenha o intervalo de predição como "sombra".
 * Tudo em SVG com viewBox do tamanho da caixa (texto ≥16 fica ≥14 px efetivos).
 */

export interface ForestRow {
    id: string;
    label: string;
    /** Linha de apoio (ex.: "k = 40 · n = 1.461"). */
    sub?: string;
    est: number;
    lo: number;
    hi: number;
    /** 'pooled' = losango; 'study' = quadrado com barra. */
    kind?: 'study' | 'pooled';
    color?: string;
    /** Intervalo de predição (só para 'pooled'). */
    pi?: readonly [number, number];
    /** Texto à direita (padrão: "est (lo a hi)"). */
    right?: string;
}

interface ForestPlotProps {
    rows: readonly ForestRow[];
    width: number;
    height: number;
    /** Faixa do eixo x. */
    domain: readonly [number, number];
    ticks: readonly number[];
    /** Rótulo do eixo (ex.: "tamanho de efeito (g de Hedges)"). */
    axisLabel: string;
    /** Valor do "nenhum efeito" (0 para SMD; 0 para % de diferença). */
    nullValue?: number;
    /** Casas decimais do texto à direita. */
    decimals?: number;
    /** Linha em foco (as outras apagam). */
    focusId?: string | null;
    onFocus?: (id: string | null) => void;
    /** Largura da coluna de rótulos e da coluna de números (unidades do viewBox). */
    labelWidth?: number;
    valueWidth?: number;
    /** Esquerda/direita do eixo: o que significa cada lado. */
    sides?: readonly [string, string];
}

export const ForestPlot = ({
    rows, width, height, domain, ticks, axisLabel, nullValue = 0, decimals = 2, focusId = null, onFocus,
    labelWidth = 330, valueWidth = 170, sides,
}: ForestPlotProps) => {
    const top = sides ? 34 : 12;
    const bottom = 58;
    const x0 = labelWidth;
    const x1 = width - valueWidth;
    const rowH = Math.min(56, (height - top - bottom) / Math.max(rows.length, 1));
    const sx = (v: number) => x0 + ((v - domain[0]) / (domain[1] - domain[0])) * (x1 - x0);
    const clampX = (v: number) => sx(Math.min(Math.max(v, domain[0]), domain[1]));
    const axisY = top + rowH * rows.length + 8;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label={axisLabel}>
            {sides && (
                <>
                    <SvgText x={sx(nullValue) - 10} y={20} text={`← ${sides[0]}`} anchor="end" size={16} color={C.muted} weight={500} />
                    <SvgText x={sx(nullValue) + 10} y={20} text={`${sides[1]} →`} size={16} color={C.muted} weight={500} />
                </>
            )}
            {ticks.map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={top - 4} y2={axisY} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(t)} y={axisY + 22} text={br(t, Number.isInteger(t) ? 0 : 1)} anchor="middle" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <line x1={sx(nullValue)} x2={sx(nullValue)} y1={top - 6} y2={axisY} stroke="rgba(255,255,255,0.45)" strokeDasharray="5 5" />
            <line x1={x0} x2={x1} y1={axisY} y2={axisY} stroke="rgba(255,255,255,0.25)" />
            <SvgText x={(x0 + x1) / 2} y={axisY + 46} text={axisLabel} anchor="middle" size={16} color="#CBD5E1" weight={500} />

            {rows.map((r, i) => {
                const cy = top + rowH * i + rowH / 2;
                const color = r.color ?? (r.kind === 'pooled' ? C.base : '#E5E7EB');
                const dim = focusId !== null && focusId !== r.id;
                const right = r.right ?? `${br(r.est, decimals)} (${br(r.lo, decimals)} a ${br(r.hi, decimals)})`;
                return (
                    <motion.g
                        key={r.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: dim ? 0.3 : 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 * i, ease: EASE_OUT }}
                        onMouseEnter={onFocus ? () => onFocus(r.id) : undefined}
                        onMouseLeave={onFocus ? () => onFocus(null) : undefined}
                        style={{ cursor: onFocus ? 'pointer' : 'default' }}
                    >
                        <rect x={0} y={cy - rowH / 2} width={width} height={rowH} fill="transparent" />
                        <SvgText x={0} y={r.sub ? cy - 3 : cy + 6} text={r.label} size={r.kind === 'pooled' ? 18 : 17} weight={r.kind === 'pooled' ? 700 : 600} color={r.kind === 'pooled' ? '#fff' : '#E5E7EB'} />
                        {r.sub && <SvgText x={0} y={cy + 18} text={r.sub} size={16} weight={400} color={C.muted} />}
                        {r.pi && (
                            <rect x={clampX(r.pi[0])} y={cy - 5} width={clampX(r.pi[1]) - clampX(r.pi[0])} height={10} rx={5}
                                fill={color} opacity={0.18} />
                        )}
                        <line x1={clampX(r.lo)} x2={clampX(r.hi)} y1={cy} y2={cy} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
                        {r.kind === 'pooled' ? (
                            <polygon
                                points={`${sx(r.lo)},${cy} ${sx(r.est)},${cy - 11} ${sx(r.hi)},${cy} ${sx(r.est)},${cy + 11}`}
                                fill={color} fillOpacity={0.85} stroke="#fff" strokeOpacity={0.6} />
                        ) : (
                            <rect x={sx(r.est) - 7} y={cy - 7} width={14} height={14} fill={color} />
                        )}
                        <SvgText x={width} y={cy + 6} text={right} anchor="end" size={17} weight={600} color={color} />
                    </motion.g>
                );
            })}
        </svg>
    );
};
