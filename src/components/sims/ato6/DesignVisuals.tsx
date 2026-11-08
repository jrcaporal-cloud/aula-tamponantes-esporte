import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { WASHOUT } from './designContent';

/** Desenhos dos passos 2 e 3 do "Cruzado ou Paralelo?" (caixa 696 × 440); passos 1 e 4 em DesignSchemes. */

export const DV_W = 696;
export const DV_H = 440;

/** Curva de aprendizado: +1,2% da 1ª para a 2ª tentativa, +0,2% depois. */
export const LearningCurve = () => {
    const trials = [0, 1.2, 1.4, 1.6];
    const x = (i: number) => 130 + i * 150;
    const y = (v: number) => 330 - v * 130;
    const line = trials.map((v, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(v)}`).join(' ');
    return (
        <svg width={DV_W} height={DV_H} viewBox={`0 0 ${DV_W} ${DV_H}`} role="img" aria-label="Efeito de aprendizado">
            <SvgText x={32} y={44} text="Mesmo atleta, nenhuma intervenção: só repetir o teste" color={C.text} size={18} weight={700} />
            {[0, 0.5, 1, 1.5].map(v => (
                <g key={v}>
                    <line x1={90} x2={620} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.08)" />
                    <SvgText x={80} y={y(v) + 6} anchor="end" text={`+${String(v).replace('.', ',')}%`} color={C.muted} size={16} weight={500} />
                </g>
            ))}
            <path d={`${line} L ${x(3)} ${y(0)} L ${x(0)} ${y(0)} Z`} fill={C.base} fillOpacity={0.1} />
            <path d={line} fill="none" stroke={C.base} strokeWidth={3} />
            <line x1={x(0)} x2={x(1)} y1={y(0)} y2={y(1.2)} stroke={C.lactate} strokeWidth={5} strokeLinecap="round" />
            {trials.map((v, i) => (
                <g key={i}>
                    <circle cx={x(i)} cy={y(v)} r={8} fill={i < 2 ? C.lactate : C.base} stroke="#04080F" strokeWidth={2} />
                    <SvgText x={x(i)} y={y(0) + 32} anchor="middle" text={`tentativa ${i + 1}`} color={C.muted} size={16} weight={500} />
                </g>
            ))}
            <SvgText x={(x(0) + x(1)) / 2 - 14} y={(y(0) + y(1.2)) / 2 - 14} anchor="end" text="+1,2%" color={C.lactate} size={28} weight={700} />
            <SvgText x={(x(1) + x(2)) / 2} y={y(1.3) - 18} anchor="middle" text="+0,2%" color={C.muted} size={18} />
            <SvgText x={(x(2) + x(3)) / 2} y={y(1.5) - 18} anchor="middle" text="+0,2%" color={C.muted} size={18} />
            <SvgText x={32} y={414} text="Se a tentativa 1 for a linha de base, o suplemento ganha 1,2% de brinde." color={C.lactate} size={17} />
        </svg>
    );
};

/** Carnosina: carga e washout (marcos de Baguet 2009; forma ilustrativa). */
export const WashoutCurve = () => {
    const weeks = 22;
    const x = (w: number) => 70 + (w / weeks) * 590;
    const y = (v: number) => 360 - (v / 60) * 290;
    const { loadingWeeks: lw, curves, crossoverGap } = WASHOUT;
    const value = (peak: number, back: number, w: number) =>
        w <= lw ? peak * (1 - Math.exp(-w / 2)) / (1 - Math.exp(-lw / 2)) : Math.max(peak * (1 - (w - lw) / back), 0);
    const path = (peak: number, back: number) =>
        Array.from({ length: 89 }, (_, i) => i / 4).map((w, i) => `${i ? 'L' : 'M'} ${x(w).toFixed(1)} ${y(value(peak, back, w)).toFixed(1)}`).join(' ');
    const gapW = lw + crossoverGap;
    const high = curves[0];
    const residual = value(high.peak, high.back, gapW);
    const tones = [C.carno, C.carnoSoft, C.co2];
    return (
        <svg width={DV_W} height={DV_H} viewBox={`0 0 ${DV_W} ${DV_H}`} role="img" aria-label="Carga e washout da carnosina">
            <SvgText x={32} y={36} text="Carnosina muscular acima do basal" color={C.text} size={18} weight={700} />
            <rect x={x(0)} y={52} width={x(lw) - x(0)} height={y(0) - 52} fill={C.carno} fillOpacity={0.08} />
            <SvgText x={(x(0) + x(lw)) / 2} y={74} anchor="middle" text="β-alanina 4,8 g/dia" color={C.carnoSoft} size={16} />
            <line x1={x(0)} x2={x(weeks)} y1={y(0)} y2={y(0)} stroke="rgba(255,255,255,0.35)" />
            {[0, 6, 12, 18].map(w => <SvgText key={w} x={x(w)} y={y(0) + 24} anchor="middle" text={`${w} sem`} color={C.muted} size={16} weight={500} />)}
            {curves.map((c, i) => (
                <g key={c.label}>
                    <path d={path(c.peak, c.back)} fill="none" stroke={tones[i]} strokeWidth={i === 1 ? 2.5 : 3.5} strokeDasharray={i === 1 ? '6 5' : undefined} />
                    <circle cx={x(lw + c.back)} cy={y(0)} r={6} fill={tones[i]} stroke="#04080F" strokeWidth={2} />
                </g>
            ))}
            <SvgText x={x(lw) + 8} y={y(55) - 6} text="alto respondedor +55%" color={C.carno} size={16} />
            <SvgText x={x(lw + high.back) + 4} y={y(0) - 14} anchor="middle" text="15 sem" color={C.carno} size={16} weight={700} />
            <SvgText x={x(lw + 9)} y={y(0) - 14} anchor="middle" text="9" color={C.carnoSoft} size={16} weight={700} />
            <SvgText x={x(lw + 6) - 6} y={y(0) - 14} anchor="end" text="6" color={C.co2} size={16} weight={700} />
            <SvgText x={x(lw) - 8} y={y(15) - 12} anchor="end" text="baixo +15%" color={C.co2} size={16} />
            <SvgText x={x(lw) + 10} y={y(30) - 6} text="média do grupo" color={C.carnoSoft} size={16} weight={500} />
            <line x1={x(gapW)} x2={x(gapW)} y1={92} y2={y(0)} stroke={C.lactate} strokeWidth={2} strokeDasharray="5 5" />
            <circle cx={x(gapW)} cy={y(residual)} r={7} fill={C.lactate} stroke="#04080F" strokeWidth={2} />
            <SvgText x={x(gapW) + 12} y={112} text="2º período de um cruzado" color={C.lactate} size={16} weight={700} />
            <SvgText x={x(gapW) + 12} y={132} text="com 4 semanas de intervalo" color={C.lactate} size={16} weight={500} />
            <SvgText x={32} y={420} text="Ponto amarelo: o placebo do 2º período ainda teria carnosina extra." color={C.lactate} size={17} />
        </svg>
    );
};
