import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br, signed } from '../kit/format';
import type { StudyResult } from './stats';

/** Desenho do PowerSim: em cima, os atletas do estudo nº 1; embaixo, o histograma dos 400 estudos. */

export const PLOT_W = 736;
export const PLOT_H = 440;
const LO = -4;
const HI = 6;
const PAD = 28;
const BIN = 0.25;
const BINS = Math.round((HI - LO) / BIN);
const HIST_TOP = 168;
const HIST_BASE = 386;

const x = (v: number) => PAD + ((Math.min(Math.max(v, LO), HI) - LO) / (HI - LO)) * (PLOT_W - 2 * PAD);

interface Bin { winners: number; others: number }

const histogram = (studies: readonly StudyResult[]): Bin[] => {
    const empty: Bin[] = Array.from({ length: BINS }, () => ({ winners: 0, others: 0 }));
    return studies.reduce((bins, s) => {
        const i = Math.min(Math.max(Math.floor((s.observed - LO) / BIN), 0), BINS - 1);
        return bins.map((b, j) => (j !== i ? b : s.winner ? { ...b, winners: b.winners + 1 } : { ...b, others: b.others + 1 }));
    }, empty);
};

interface PowerPlotProps {
    n: number;
    effect: number;
    diffs: readonly number[];
    first: StudyResult;
    studies: readonly StudyResult[];
    showHist: boolean;
    highlight: boolean;
    winnersMean: number | null;
}

export const PowerPlot = ({ n, effect, diffs, first, studies, showHist, highlight, winnersMean }: PowerPlotProps) => {
    const bins = histogram(studies);
    const maxCount = Math.max(8, ...bins.map(b => b.winners + b.others));
    const h = (c: number) => (c / maxCount) * (HIST_BASE - HIST_TOP);
    const bw = (PLOT_W - 2 * PAD) / BINS;
    const ticks = Array.from({ length: HI - LO + 1 }, (_, i) => LO + i);
    const ciLo = first.observed - first.halfCi;
    const ciHi = first.observed + first.halfCi;

    return (
        <svg width={PLOT_W} height={PLOT_H} viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} role="img" aria-label="Simulação de estudos">
            {/* linhas de referência: zero e efeito real */}
            <line x1={x(0)} x2={x(0)} y1={40} y2={HIST_BASE} stroke={C.muted} strokeDasharray="4 5" strokeWidth={1.5} />
            <line x1={x(effect)} x2={x(effect)} y1={40} y2={HIST_BASE} stroke={C.base} strokeWidth={2.5} />
            <SvgText x={PAD} y={26} text={`Estudo nº 1 · ${n} atletas`} color={C.text} size={17} weight={700} />
            <SvgText x={x(effect) + 8} y={26} text={`efeito real ${signed(effect, 0)}%`} color={C.base} size={16} />

            {/* atletas do estudo nº 1 */}
            {diffs.map((d, i) => (
                <circle key={i} cx={x(d)} cy={62 + ((i % 3) - 1) * 9} r={5} fill={C.co2} fillOpacity={0.85} stroke="#04080F" strokeWidth={1} />
            ))}
            <line x1={x(ciLo)} x2={x(ciHi)} y1={102} y2={102} stroke={first.winner ? C.lactate : C.text} strokeWidth={3} strokeLinecap="round" />
            <rect x={x(first.observed) - 6} y={96} width={12} height={12} transform={`rotate(45 ${x(first.observed)} 102)`}
                fill={first.winner ? C.lactate : C.text} />
            <SvgText x={Math.min(x(ciHi) + 10, PLOT_W - 250)} y={108}
                text={`${signed(first.observed, 1)}% (IC95% ${signed(ciLo, 1)} a ${signed(ciHi, 1)})`}
                color={first.winner ? C.lactate : C.text} size={16} />

            {/* histograma dos estudos */}
            {showHist && (
                <g>
                    <SvgText x={PAD} y={HIST_TOP - 22} text={`${studies.length} estudos iguais · efeito observado em cada um`} color={C.text} size={16} weight={700} />
                    {bins.map((b, i) => {
                        const bx = PAD + i * bw + 1;
                        const hw = h(b.winners);
                        const ho = h(b.others);
                        return (
                            <g key={i}>
                                <rect x={bx} y={HIST_BASE - hw} width={bw - 2} height={hw} fill={highlight ? C.lactate : C.co2} fillOpacity={highlight ? 0.95 : 0.55} />
                                <rect x={bx} y={HIST_BASE - hw - ho} width={bw - 2} height={ho} fill={C.co2} fillOpacity={highlight ? 0.3 : 0.55} />
                            </g>
                        );
                    })}
                    {highlight && winnersMean !== null && (
                        <g>
                            <path d={`M ${x(winnersMean) - 8} ${HIST_TOP - 8} L ${x(winnersMean) + 8} ${HIST_TOP - 8} L ${x(winnersMean)} ${HIST_TOP + 4} Z`} fill={C.lactate} />
                            <SvgText x={x(winnersMean) + 12} y={HIST_TOP + 4} text={`média dos significativos ${signed(winnersMean, 1)}%`} color={C.lactate} size={16} />
                        </g>
                    )}
                </g>
            )}
            {!showHist && (
                <SvgText x={PLOT_W / 2} y={280} anchor="middle" text="E se o mesmo estudo fosse repetido 400 vezes?" color={C.muted} size={18} />
            )}

            {/* eixo */}
            <line x1={PAD} x2={PLOT_W - PAD} y1={HIST_BASE} y2={HIST_BASE} stroke="rgba(255,255,255,0.35)" />
            {ticks.map(t => (
                <SvgText key={t} x={x(t)} y={HIST_BASE + 22} anchor="middle" text={`${t > 0 ? '+' : t < 0 ? '−' : ''}${br(Math.abs(t), 0)}%`} color={C.muted} size={16} weight={500} />
            ))}
            <SvgText x={PLOT_W / 2} y={PLOT_H - 6} anchor="middle" text="diferença suplemento − placebo (% de desempenho)" color={C.muted} size={16} weight={500} />
        </svg>
    );
};
