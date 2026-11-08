import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { COSTILL_FIFTH, KATZ_SINGLE } from './historia';

/** Cenas do slide 41 (viewBox 680 × 360). Escala única de duração: 1 s = 1 unidade. */

export const PW = 680;
export const PH = 360;
const PX_PER_S = 1;
const GAP = 14;
const X0 = 120;

const fadeIn = (delay = 0) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay } });

/** 1983: foto de chegada, eixo em segundos relativos à chegada sem bicarbonato. */
export const WilkesScene = ({ reduce }: { reduce: boolean }) => {
    const sx = (s: number) => 110 + ((s + 4) / 5) * 500;
    const lanes = [
        { label: 'sem bicarbonato', y: 130, at: 0, color: C.co2 },
        { label: 'com bicarbonato', y: 220, at: -2.9, color: C.base },
    ];
    return (
        <g>
            <SvgText x={20} y={40} text="Chegada dos 800 m (segundos em relação à chegada sem bicarbonato)" size={17} color="#CBD5E1" weight={600} />
            <line x1={sx(0)} x2={sx(0)} y1={80} y2={270} stroke="#fff" strokeWidth={3} strokeDasharray="8 6" />
            <SvgText x={sx(0)} y={72} text="chegada" size={16} anchor="middle" color={C.muted} />
            {lanes.map(l => (
                <g key={l.label}>
                    <rect x={20} y={l.y - 24} width={640} height={48} rx={10} fill="rgba(255,255,255,0.03)" />
                    <SvgText x={30} y={l.y + 6} text={l.label} size={17} color={l.color} />
                    <motion.circle cx={sx(l.at)} cy={l.y} r={14} fill={l.color}
                        initial={{ x: reduce ? 0 : -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: reduce ? 0 : 1.0, ease: 'easeOut' }} />
                </g>
            ))}
            <motion.g {...fadeIn(reduce ? 0 : 0.9)}>
                <line x1={sx(-2.9)} x2={sx(0)} y1={300} y2={300} stroke={C.base} strokeWidth={3} />
                <line x1={sx(-2.9)} x2={sx(-2.9)} y1={290} y2={310} stroke={C.base} strokeWidth={3} />
                <line x1={sx(0)} x2={sx(0)} y1={290} y2={310} stroke={C.base} strokeWidth={3} />
                <SvgText x={(sx(-2.9) + sx(0)) / 2} y={338} text="2,9 s mais rápido" size={22} weight={700} anchor="middle" color={C.base} />
            </motion.g>
            {[-4, -3, -2, -1, 0, 1].map(t => (
                <SvgText key={t} x={sx(t)} y={268} text={t === 0 ? '0' : `${t > 0 ? '+' : '−'}${Math.abs(t)} s`} size={16} anchor="middle" color={C.muted} weight={500} />
            ))}
        </g>
    );
};

interface BoutRowProps {
    y: number;
    label: string;
    color: string;
    bouts: readonly number[];
    delay?: number;
    reduce: boolean;
}

/** Uma fileira de tiros: cada bloco tem largura proporcional à duração. */
const BoutRow = ({ y, label, color, bouts, delay = 0, reduce }: BoutRowProps) => {
    const starts = bouts.map((_, i) => X0 + bouts.slice(0, i).reduce((s, b) => s + b * PX_PER_S + GAP, 0));
    const last = bouts.length - 1;
    return (
        <g>
            <SvgText x={X0 - 14} y={y + 7} text={label} size={18} anchor="end" color={color} weight={700} />
            {bouts.map((b, i) => (
                <motion.rect key={i} x={starts[i]} y={y - 17} width={b * PX_PER_S} height={34} rx={6}
                    fill={color} opacity={i === last ? 0.95 : 0.4}
                    style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                    initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }}
                    transition={{ duration: reduce ? 0 : i === last ? 0.6 : 0.25, delay: reduce ? 0 : delay + i * 0.12 }} />
            ))}
            <motion.g {...fadeIn(reduce ? 0 : delay + last * 0.12 + 0.6)}>
                <SvgText x={starts[last] + bouts[last] * PX_PER_S + 10} y={y + 7} text={`${br(bouts[last], 1)} s`} size={19} weight={700} color="#fff" />
            </motion.g>
        </g>
    );
};

/** 1984: 4 tiros de 60 s e o 5º até a exaustão; embaixo, o pH do vasto lateral antes do 5º tiro. */
export const CostillScene = ({ reduce, compact = false }: { reduce: boolean; compact?: boolean }) => {
    const y0 = compact ? 50 : 90;
    const phX = (ph: number) => 160 + ((ph - 6.65) / 0.25) * 440;
    return (
        <g>
            <SvgText x={20} y={y0 - 42} text={compact ? 'Tiros repetidos (Costill)' : '5 tiros de 1 min a 100% do VO₂máx — o 5º até a exaustão'} size={17} color="#CBD5E1" weight={600} />
            <BoutRow y={y0} label="NaCl" color={C.co2} bouts={[60, 60, 60, 60, COSTILL_FIFTH.nacl]} reduce={reduce} />
            <BoutRow y={y0 + 56} label="NaHCO₃" color={C.base} bouts={[60, 60, 60, 60, COSTILL_FIFTH.sb]} delay={0.2} reduce={reduce} />
            <motion.g {...fadeIn(reduce ? 0 : 1.1)}>
                <SvgText x={PW - 6} y={y0 + 100} text="5º tiro: +42%" size={20} weight={700} anchor="end" color={C.base} />
            </motion.g>
            {!compact && (
                <motion.g {...fadeIn(reduce ? 0 : 0.9)}>
                    <SvgText x={20} y={258} text="pH do músculo antes do 5º tiro (biópsia, n = 4)" size={17} color="#CBD5E1" weight={600} />
                    <rect x={phX(6.65)} y={284} width={phX(6.9) - phX(6.65)} height={12} rx={6} fill="url(#ph-grad)" />
                    {[6.7, 6.75, 6.8, 6.85].map(t => (
                        <SvgText key={t} x={phX(t)} y={318} text={br(t, 2)} size={16} anchor="middle" color={C.muted} weight={500} />
                    ))}
                    {[{ ph: COSTILL_FIFTH.phNacl, c: C.acid, l: 'NaCl' }, { ph: COSTILL_FIFTH.phSb, c: C.base, l: 'NaHCO₃' }].map(m => (
                        <g key={m.l}>
                            <polygon points={`${phX(m.ph) - 9},272 ${phX(m.ph) + 9},272 ${phX(m.ph)},286`} fill={m.c} />
                            <SvgText x={phX(m.ph)} y={346} text={`${m.l} ${br(m.ph, 2)}`} size={17} anchor="middle" color={m.c} weight={700} />
                        </g>
                    ))}
                </motion.g>
            )}
        </g>
    );
};

/** 1984: um único tiro até a exaustão a 125% do VO₂máx. */
export const KatzScene = ({ reduce, compact = false }: { reduce: boolean; compact?: boolean }) => {
    const y0 = compact ? 230 : 120;
    return (
        <g>
            <SvgText x={20} y={y0 - 42} text={compact ? 'Tiro único (Katz)' : 'Um tiro até a exaustão a 125% do VO₂máx — mesma escala de tempo'} size={17} color="#CBD5E1" weight={600} />
            <BoutRow y={y0} label="NaCl" color={C.co2} bouts={[KATZ_SINGLE.nacl]} reduce={reduce} />
            <BoutRow y={y0 + 56} label="NaHCO₃" color={C.base} bouts={[KATZ_SINGLE.sb]} delay={0.2} reduce={reduce} />
            <motion.g {...fadeIn(reduce ? 0 : 0.8)}>
                <SvgText x={PW - 6} y={y0 + 100} text="diferença não significativa" size={20} weight={700} anchor="end" color={C.muted} />
                {!compact && (
                    <SvgText x={20} y={y0 + 170} text="Sangue alcalino (HCO₃⁻ 28,2 × 24,4 mmol/L), desempenho igual." size={18} weight={600} color={C.lactate} />
                )}
            </motion.g>
        </g>
    );
};

export const PhGradient = () => (
    <defs>
        <linearGradient id="ph-grad" x1="0" x2="1">
            <stop offset="0%" stopColor={C.acid} />
            <stop offset="100%" stopColor={C.base} />
        </linearGradient>
    </defs>
);
