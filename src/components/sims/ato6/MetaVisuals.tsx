import { C, PANEL_BG } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br, signed } from '../kit/format';
import type { MetaResult, MetaStudy } from './meta';
import { GRADE, MBI_FACTS } from './metaContent';

/** Forest plot, funil e quadro de certeza do "A Meta-análise por Dentro". Caixa 696 × 440. */

export const MV_W = 696;
export const MV_H = 440;

const tickLabel = (t: number) => `${t > 0 ? '+' : t < 0 ? '−' : ''}${Math.abs(t)}%`;

interface ForestProps {
    studies: readonly MetaStudy[];
    result: MetaResult;
    showPi: boolean;
    showI2: boolean;
}

export const ForestPlot = ({ studies, result, showPi, showI2 }: ForestProps) => {
    const lo = -4;
    const hi = 7;
    const x = (v: number) => 150 + ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * 520;
    const rowY = (i: number) => 58 + i * 26;
    const dy = rowY(studies.length) + 22;
    const maxW = Math.max(...studies.map(s => 1 / s.se ** 2));
    return (
        <svg width={MV_W} height={MV_H} viewBox={`0 0 ${MV_W} ${MV_H}`} role="img" aria-label="Forest plot">
            <SvgText x={20} y={34} text="Efeito no desempenho (%)" color={C.text} size={17} weight={700} />
            <line x1={x(0)} x2={x(0)} y1={46} y2={dy + 26} stroke={C.muted} strokeDasharray="4 5" />
            {studies.map((s, i) => {
                const side = 6 + 10 * Math.sqrt((1 / s.se ** 2) / maxW);
                return (
                    <g key={s.id}>
                        <SvgText x={20} y={rowY(i) + 6} text={`Estudo ${i + 1}`} color={C.muted} size={16} weight={500} />
                        <line x1={x(s.effect - 1.96 * s.se)} x2={x(s.effect + 1.96 * s.se)} y1={rowY(i)} y2={rowY(i)} stroke={C.co2} strokeWidth={2} />
                        <rect x={x(s.effect) - side / 2} y={rowY(i) - side / 2} width={side} height={side} fill={C.baseSoft} />
                    </g>
                );
            })}
            {showPi && (
                <g>
                    <line x1={x(result.piLo)} x2={x(result.piHi)} y1={dy} y2={dy} stroke={C.lactate} strokeWidth={22} strokeOpacity={0.35} strokeLinecap="round" />
                    <SvgText x={x(result.piLo)} y={dy + 38} text={`predição: ${signed(result.piLo, 1)}% a ${signed(result.piHi, 1)}%`} color={C.lactate} size={16} weight={700} />
                </g>
            )}
            <path d={`M ${x(result.ciLo)} ${dy} L ${x(result.mean)} ${dy - 11} L ${x(result.ciHi)} ${dy} L ${x(result.mean)} ${dy + 11} Z`} fill={C.base} />
            <SvgText x={20} y={dy + 6} text="Média" color={C.base} size={17} weight={700} />
            <SvgText x={x(result.ciHi) + 12} y={dy - 12} text={`${signed(result.mean, 1)}% (IC95% ${signed(result.ciLo, 1)} a ${signed(result.ciHi, 1)})`} color={C.base} size={16} weight={700} />
            {showI2 && (
                <g>
                    <rect x={500} y={18} width={176} height={30} rx={8} fill="rgba(4,10,20,0.9)" stroke={C.lactate} />
                    <SvgText x={588} y={39} anchor="middle" text={`I² ${br(result.i2 * 100, 0)}% · tau ${br(result.tau, 1)}%`} color={C.lactate} size={16} weight={700} />
                </g>
            )}
            <line x1={x(lo)} x2={x(hi)} y1={MV_H - 40} y2={MV_H - 40} stroke="rgba(255,255,255,0.3)" />
            {[-4, -2, 0, 2, 4, 6].map(t => <SvgText key={t} x={x(t)} y={MV_H - 16} anchor="middle" text={tickLabel(t)} color={C.muted} size={16} weight={500} />)}
        </svg>
    );
};

interface FunnelProps {
    studies: readonly MetaStudy[];
    published: MetaResult;
    all: MetaResult;
    showGhosts: boolean;
}

export const FunnelPlot = ({ studies, published, all, showGhosts }: FunnelProps) => {
    const lo = -5;
    const hi = 7;
    const seMax = 2.8;
    const x = (v: number) => 60 + ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * 610;
    const y = (se: number) => 56 + (se / seMax) * 324;
    const center = showGhosts ? all.mean : published.mean;
    return (
        <svg width={MV_W} height={MV_H} viewBox={`0 0 ${MV_W} ${MV_H}`} role="img" aria-label="Gráfico de funil">
            <SvgText x={20} y={30} text="Estudos grandes (erro pequeno)" color={C.muted} size={16} weight={500} />
            <SvgText x={20} y={y(seMax) + 2} text="pequenos" color={C.muted} size={16} weight={500} />
            <path d={`M ${x(center)} ${y(0)} L ${x(center - 1.96 * seMax)} ${y(seMax)} M ${x(center)} ${y(0)} L ${x(center + 1.96 * seMax)} ${y(seMax)}`}
                stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5" fill="none" />
            <line x1={x(0)} x2={x(0)} y1={y(0)} y2={y(seMax)} stroke={C.muted} strokeDasharray="2 5" />
            {studies.map(s => (s.published || showGhosts) && (
                <circle key={s.id} cx={x(s.effect)} cy={y(s.se)} r={7}
                    fill={s.published ? C.baseSoft : 'transparent'} fillOpacity={0.9}
                    stroke={s.published ? '#04080F' : C.co2} strokeWidth={s.published ? 1.5 : 2} strokeDasharray={s.published ? undefined : '3 2'} />
            ))}
            <line x1={x(published.mean)} x2={x(published.mean)} y1={y(0) - 8} y2={y(seMax)} stroke={C.lactate} strokeWidth={2.5} />
            <SvgText x={x(published.mean) + 8} y={y(0) + 4} text={`publicados: ${signed(published.mean, 1)}%`} color={C.lactate} size={16} weight={700} />
            {showGhosts && (
                <g>
                    <line x1={x(all.mean)} x2={x(all.mean)} y1={y(0) + 24} y2={y(seMax)} stroke={C.base} strokeWidth={2.5} />
                    <SvgText x={x(all.mean) - 8} y={y(0) + 28} anchor="end" text={`todos: ${signed(all.mean, 1)}%`} color={C.base} size={16} weight={700} />
                </g>
            )}
            <line x1={x(lo)} x2={x(hi)} y1={MV_H - 40} y2={MV_H - 40} stroke="rgba(255,255,255,0.3)" />
            {[-4, -2, 0, 2, 4, 6].map(t => <SvgText key={t} x={x(t)} y={MV_H - 16} anchor="middle" text={tickLabel(t)} color={C.muted} size={16} weight={500} />)}
        </svg>
    );
};

/** GRADE do bicarbonato (umbrella 2021) e a saga da MBI em números (Lohse 2020). */
export const CertaintyBoard = () => (
    <div className="p-5 flex flex-col gap-4" style={{ width: MV_W, height: MV_H }}>
        <div className="flex flex-col gap-1.5">
            <p className="font-display text-[1.15rem] font-semibold text-white">Bicarbonato no GRADE (revisão guarda-chuva)</p>
            {GRADE.map(g => (
                <div key={g.level} className="flex items-center gap-3 rounded-lg px-3 py-1.5" style={{ ...PANEL_BG, opacity: g.items.length ? 1 : 0.5 }}>
                    <span className="w-[110px] shrink-0 font-semibold text-[16px]" style={{ color: g.items.length ? C.lactate : C.muted }}>{g.level}</span>
                    <span className="text-[16px] text-gray-100">{g.items.length ? g.items.join(' · ') : '—'}</span>
                </div>
            ))}
        </div>
        <div className="flex flex-col gap-2">
            <p className="font-display text-[1.15rem] font-semibold text-white">A MBI na ciência do esporte (232 artigos)</p>
            <div className="grid grid-cols-4 gap-2">
                {MBI_FACTS.map(f => (
                    <div key={f.label} className="rounded-xl border border-white/10 px-3 py-2" style={PANEL_BG}>
                        <p className="font-display text-[1.6rem] font-semibold leading-none" style={{ color: f.value.includes('%') && f.value.includes('–') ? C.risk : C.text }}>{f.value}</p>
                        <p className="mt-1 text-[15px] leading-snug text-gray-300">{f.label}</p>
                    </div>
                ))}
            </div>
            <p className="text-[16px] leading-snug text-gray-100">Carr 2011, a meta-análise do "+1,7%", usa MBI: IC90% e "possivelmente moderado".</p>
        </div>
    </div>
);
