import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Capacidade de tamponamento relativa de três pares ácido/base, mesma concentração (cálculo de
 * Henderson–Hasselbalch: β ∝ Ka·[H⁺]/(Ka+[H⁺])², pico no pKa). A faixa laranja é o pH do
 * músculo do repouso à exaustão. Só a forma importa: não há quantidade de tampão no desenho.
 */

interface Curve {
    id: string;
    label: string;
    pka: number;
    color: string;
    dashed?: boolean;
    /** Onde o rótulo encosta na curva (pH), e de que lado fica. */
    labelAt: number;
    side: 'left' | 'right';
}

const CURVES: readonly Curve[] = [
    { id: 'bic', label: 'bicarbonato · pKa 6,1', pka: 6.1, color: C.base, labelAt: 6.1, side: 'left' },
    { id: 'pi', label: 'fosfato · pKa ~6,8', pka: 6.8, color: C.co2, dashed: true, labelAt: 7.55, side: 'right' },
    { id: 'carn', label: 'carnosina · pKa 6,83', pka: 6.83, color: C.carno, labelAt: 6.95, side: 'right' },
];

const PH_LO = 5.4;
const PH_HI = 8.0;
const BAND: readonly [number, number] = [6.5, 7.1];

/** β relativo (1 no pKa). */
const beta = (ph: number, pka: number) => {
    const h = Math.pow(10, -ph);
    const ka = Math.pow(10, -pka);
    return (4 * ka * h) / ((ka + h) * (ka + h));
};

export const TitrationChart = ({ width, height, reduce }: { width: number; height: number; reduce: boolean }) => {
    const left = 64;
    const right = width - 24;
    const top = 64;
    const bottom = height - 70;
    const sx = (ph: number) => left + ((ph - PH_LO) / (PH_HI - PH_LO)) * (right - left);
    const sy = (b: number) => bottom - b * (bottom - top);
    const path = (pka: number) => Array.from({ length: 105 }, (_, i) => {
        const ph = PH_LO + (i / 104) * (PH_HI - PH_LO);
        return `${i === 0 ? 'M' : 'L'}${sx(ph).toFixed(1)} ${sy(beta(ph, pka)).toFixed(1)}`;
    }).join(' ');
    const ticks = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img"
            aria-label="Capacidade de tamponamento relativa de bicarbonato, fosfato e carnosina conforme o pH">
            <rect x={sx(BAND[0])} y={top - 20} width={sx(BAND[1]) - sx(BAND[0])} height={bottom - top + 20}
                fill="rgba(251,146,60,0.12)" stroke="rgba(251,146,60,0.4)" strokeDasharray="4 5" />
            <SvgText x={(sx(BAND[0]) + sx(BAND[1])) / 2} y={bottom - 14} text="músculo" anchor="middle" size={16} color={C.acidSoft} weight={700} />
            <SvgText x={(sx(BAND[0]) + sx(BAND[1])) / 2} y={bottom - 36} text="7,1 → 6,5" anchor="middle" size={16} color={C.acidSoft} />
            <line x1={left} x2={right} y1={bottom} y2={bottom} stroke="rgba(255,255,255,0.3)" />
            {ticks.map(t => (
                <SvgText key={t} x={sx(t)} y={bottom + 26} text={br(t, 1)} anchor="middle" size={16} color="#CBD5E1" weight={500} />
            ))}
            <SvgText x={(left + right) / 2} y={bottom + 54} text="pH" anchor="middle" size={16} color={C.muted} />
            <SvgText x={left - 8} y={sy(1) + 6} text="máx." anchor="end" size={16} color={C.muted} weight={500} />
            <SvgText x={left - 8} y={bottom} text="0" anchor="end" size={16} color={C.muted} weight={500} />
            <SvgText x={16} y={top - 36} text="poder de tamponar (relativo)" size={16} color={C.muted} weight={500} />
            {CURVES.map((c, i) => (
                <g key={c.id}>
                    <path d={path(c.pka)} fill="none" stroke={c.color} strokeWidth={3.5} pathLength={1}
                        strokeDasharray={c.dashed ? '0.012 0.01' : '1 1'} strokeDashoffset={reduce || c.dashed ? 0 : 1}>
                        {!reduce && !c.dashed && (
                            <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.1s" begin={`${i * 0.35}s`} fill="freeze" />
                        )}
                    </path>
                    <line x1={sx(c.pka)} x2={sx(c.pka)} y1={sy(1)} y2={bottom} stroke={c.color} strokeOpacity={0.4} strokeDasharray="3 4" />
                    <SvgText x={sx(c.labelAt) + (c.side === 'left' ? -12 : 12)} y={sy(beta(c.labelAt, c.pka)) - 12} text={c.label}
                        anchor={c.side === 'left' ? 'end' : 'start'} size={16} color={c.color} weight={700} />
                </g>
            ))}
        </svg>
    );
};
