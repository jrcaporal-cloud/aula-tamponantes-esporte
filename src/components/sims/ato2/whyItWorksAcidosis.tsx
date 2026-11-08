import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ACIDOSIS_ONSET_W } from './whyItWorks.content';
import { MEM_H, MEM_W } from './MembraneScene';

/**
 * Slide 15, passo 4 — "Acidose adiada" (Raymer 2004, punho, ³¹P-ERM). Forma das curvas ILUSTRATIVA;
 * marcos medidos: início da acidose 1,17 × 1,28 W, tempo até a fadiga +~12%, mesmo total de H⁺.
 */

const X0 = 70;
const X1 = 612;
const Y_TOP = 112;
const Y_FLOOR = 296;
const AXIS_Y = 330;
/** Faixa de potência do eixo (só para posicionar os marcos medidos). */
const P0 = 0.75;
const P1 = 1.8;
/** Fadiga do controle: posição ilustrativa; a da alcalose fica ~12% adiante. */
const FATIGUE_C = 1.5;
const FATIGUE_A = FATIGUE_C * 1.12;

const px = (p: number) => X0 + ((p - P0) / (P1 - P0)) * (X1 - X0);

const curve = (onset: number, fatigue: number) => {
    const a = px(onset);
    const b = px(fatigue);
    return `M${X0} ${Y_TOP} L${a.toFixed(1)} ${Y_TOP} C${(a + (b - a) * 0.45).toFixed(1)} ${Y_TOP} ${(a + (b - a) * 0.55).toFixed(1)} ${Y_FLOOR} ${b.toFixed(1)} ${Y_FLOOR}`;
};

interface AcidosisChartProps {
    alkalosis: boolean;
    reduce: boolean;
}

export const AcidosisChart = ({ alkalosis, reduce }: AcidosisChartProps) => {
    const rows = [
        { k: 'controle', color: C.acid, onset: ACIDOSIS_ONSET_W.controle, fatigue: FATIGUE_C, on: !alkalosis, delay: 0.1 },
        { k: 'alcalose', color: C.base, onset: ACIDOSIS_ONSET_W.alcalose, fatigue: FATIGUE_A, on: alkalosis, delay: 0.5 },
    ];
    const draw = (delay: number) => ({
        initial: { pathLength: reduce ? 1 : 0 }, animate: { pathLength: 1 },
        transition: { duration: reduce ? 0 : 1.1, delay: reduce ? 0 : delay, ease: 'easeOut' as const },
    });
    return (
        <svg viewBox={`0 0 ${MEM_W} ${MEM_H}`} width={MEM_W} height={MEM_H} role="img"
            aria-label="pH dentro da fibra no exercício progressivo: a acidose começa mais tarde com alcalose">
            <SvgText x={20} y={36} text="pH dentro da fibra" size={18} color={C.acidSoft} weight={700} />
            <SvgText x={MEM_W - 20} y={36} text="forma ilustrativa" anchor="end" size={16} color={C.lactate} weight={600} />
            {rows.map((r, i) => (
                <g key={r.k} style={{ opacity: r.on ? 1 : 0.5, transition: 'opacity 0.4s' }}>
                    <line x1={20 + i * 150} x2={48 + i * 150} y1={68} y2={68} stroke={r.color} strokeWidth={4} strokeLinecap="round" />
                    <SvgText x={56 + i * 150} y={74} text={r.k} size={16} color="#E5E7EB" weight={600} />
                </g>
            ))}
            {/* faixa da acidose e piso comum */}
            <line x1={X0} x2={X1} y1={Y_FLOOR} y2={Y_FLOOR} stroke="rgba(255,255,255,0.3)" strokeDasharray="6 6" />
            <SvgText x={X0 + 6} y={Y_FLOOR - 10} text="mesmo total de H⁺ acumulado" size={16} color="#CBD5E1" weight={600} />
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="rgba(255,255,255,0.35)" />
            <line x1={X0} x2={X0} y1={Y_TOP - 20} y2={AXIS_Y} stroke="rgba(255,255,255,0.35)" />
            <SvgText x={X0 - 10} y={Y_TOP + 6} text="alto" anchor="end" size={16} color={C.muted} />
            <SvgText x={X0 - 10} y={Y_FLOOR + 6} text="baixo" anchor="end" size={16} color={C.muted} />
            <SvgText x={X1} y={AXIS_Y + 50} text="exercício progressivo de punho →" anchor="end" size={16} color={C.muted} weight={500} />
            {rows.map(r => (
                <g key={r.k} style={{ opacity: r.on ? 1 : 0.45, transition: 'opacity 0.4s' }}>
                    <line x1={px(r.onset)} x2={px(r.onset)} y1={Y_TOP} y2={AXIS_Y} stroke={r.color} strokeDasharray="4 4" strokeWidth={2} />
                    <motion.path d={curve(r.onset, r.fatigue)} fill="none" stroke={r.color} strokeWidth={r.on ? 5 : 3.5} strokeLinecap="round" {...draw(r.delay)} />
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: reduce ? 0 : r.delay + 1 }}>
                        <path d={`M${px(r.fatigue) - 8} ${Y_FLOOR - 8} l16 16 m0 -16 l-16 16`} stroke={r.color} strokeWidth={3.5} strokeLinecap="round" />
                    </motion.g>
                </g>
            ))}
            {/* rótulos dos marcos medidos */}
            <SvgText x={px(ACIDOSIS_ONSET_W.controle) - 6} y={AXIS_Y + 22} text={`${br(ACIDOSIS_ONSET_W.controle, 2)} W`} anchor="end" size={16} color={C.acidSoft} weight={700} />
            <SvgText x={px(ACIDOSIS_ONSET_W.alcalose) + 6} y={AXIS_Y + 22} text={`${br(ACIDOSIS_ONSET_W.alcalose, 2)} W`} size={16} color={C.baseSoft} weight={700} />
            <SvgText x={(px(ACIDOSIS_ONSET_W.controle) + px(ACIDOSIS_ONSET_W.alcalose)) / 2} y={Y_TOP - 14} text="início da acidose" anchor="middle" size={16} color="#E5E7EB" weight={600} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: reduce ? 0 : 1.7 }}>
                <path d={`M${px(FATIGUE_C)} ${Y_FLOOR + 16} L${px(FATIGUE_C)} ${Y_FLOOR + 24} L${px(FATIGUE_A)} ${Y_FLOOR + 24} L${px(FATIGUE_A)} ${Y_FLOOR + 16}`}
                    fill="none" stroke={C.baseSoft} strokeWidth={2} />
                <SvgText x={(px(FATIGUE_C) + px(FATIGUE_A)) / 2} y={AXIS_Y + 22} text="fadiga +~12%" anchor="middle" size={16} color={C.baseSoft} weight={700} />
            </motion.g>
        </svg>
    );
};
