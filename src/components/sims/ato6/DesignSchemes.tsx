import { motion, useReducedMotion } from 'framer-motion';
import { EASE_IN_OUT, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CROSSOVER_ROWS, SAMPLE_PILES } from './designContent';
import { DV_H, DV_W } from './DesignVisuals';

/**
 * Passos 1 e 4 do "Cruzado ou Paralelo?": o esquema dos braços do cruzado (atletas que trocam de condição
 * depois do intervalo) e a pilha de atletas que cada desenho pede (Hopkins 1999), um ponto por atleta.
 */

const COL = { athlete: 128, fam: 228, s1: 345, s2: 565, delta: 648 } as const;
const BAND = { x: 400, w: 110 } as const;
const PLACEBO = '#64748B';
const tone = (cond: 'bic' | 'pla') => (cond === 'bic' ? C.base : PLACEBO);

const Athlete = ({ x, y }: { x: number; y: number }) => (
    <g fill="#CBD5E1" fillOpacity={0.85}>
        <circle cx={x} cy={y - 7} r={6} />
        <path d={`M ${x - 11} ${y + 11} Q ${x - 11} ${y + 1} ${x} ${y + 1} Q ${x + 11} ${y + 1} ${x + 11} ${y + 11} Z`} />
    </g>
);

const rowY = (i: number) => (i < 3 ? 116 + i * 36 : 136 + i * 36);

/** Passo 1: seis atletas, metade começa com bicarbonato e metade com placebo; depois do intervalo, trocam. */
export const CrossoverScheme = () => {
    const reduce = useReducedMotion() ?? false;
    const fade = (delay: number) => (reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay, ease: EASE_OUT } });
    const shift = COL.s2 - COL.s1;
    return (
        <svg width={DV_W} height={DV_H} viewBox={`0 0 ${DV_W} ${DV_H}`} role="img" aria-label="Esquema do desenho cruzado: os mesmos atletas trocam de condição">
            <SvgText x={28} y={36} text="Os mesmos atletas, em ordem sorteada" color={C.text} size={18} weight={700} />
            <rect x={BAND.x} y={88} width={BAND.w} height={260} rx={10} fill="white" fillOpacity={0.035} />
            {([['familiarização', COL.fam], ['sessão 1', COL.s1], ['intervalo', BAND.x + BAND.w / 2], ['sessão 2', COL.s2], ['Δ no atleta', COL.delta]] as const).map(([t, x]) => (
                <SvgText key={t} x={x} y={76} anchor="middle" text={t} color={t === 'Δ no atleta' ? C.baseSoft : C.muted} size={16} weight={600} />
            ))}
            <SvgText x={28} y={rowY(1) + 6} text="Metade A" color={C.text} size={17} weight={700} />
            <SvgText x={28} y={rowY(4) + 6} text="Metade B" color={C.text} size={17} weight={700} />
            {CROSSOVER_ROWS.map((first, i) => {
                const y = rowY(i);
                const second = first === 'bic' ? 'pla' : 'bic';
                return (
                    <g key={i}>
                        <Athlete x={COL.athlete} y={y} />
                        <motion.circle cx={COL.fam} cy={y} r={11} fill="none" stroke={C.muted} strokeWidth={2} {...fade(0.05)} />
                        <motion.circle cx={COL.s1} cy={y} r={12} fill={tone(first)} {...fade(0.2 + i * 0.03)} />
                        <motion.path d={`M ${COL.s1 + 15} ${y} Q ${BAND.x + BAND.w / 2} ${y - 20} ${COL.s2 - 15} ${y}`}
                            fill="none" stroke={C.muted} strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="4 4" {...fade(0.9)} />
                        <motion.circle cx={COL.s2} cy={y} r={12}
                            initial={reduce ? false : { x: -shift, fill: tone(first), opacity: 0.5 }}
                            animate={{ x: 0, fill: tone(second), opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.35 + i * 0.03, ease: EASE_IN_OUT }} />
                        <motion.g {...fade(1)}>
                            <SvgText x={COL.delta} y={y + 7} anchor="middle" text="Δ" color={C.baseSoft} size={20} weight={700} />
                        </motion.g>
                    </g>
                );
            })}
            <SvgText x={BAND.x + BAND.w / 2} y={340} anchor="middle" text="dias" color={C.muted} size={16} weight={600} />
            <circle cx={40} cy={372} r={8} fill={C.base} />
            <SvgText x={56} y={378} text="bicarbonato" color={C.baseSoft} size={16} weight={600} />
            <circle cx={176} cy={372} r={8} fill={PLACEBO} />
            <SvgText x={192} y={378} text="placebo" color={C.muted} size={16} weight={600} />
            <circle cx={286} cy={372} r={7} fill="none" stroke={C.muted} strokeWidth={2} />
            <SvgText x={302} y={378} text="teste sem nada" color={C.muted} size={16} weight={600} />
            <SvgText x={28} y={400} text="Intervalo de dias: na sessão 2, o bicarbonato da sessão 1 já saiu." color={C.muted} size={16} weight={500} />
            <SvgText x={28} y={428} text="Efeito = sessão com bicarbonato − sessão com placebo, no mesmo atleta" color={C.baseSoft} size={17} />
        </svg>
    );
};

const PITCH = 12;
const COLS = 13;
const BASE_Y = 372;
const PILE_X = [44, 272, 500] as const;
const PILE_W = COLS * PITCH;

/** Passo 4: um ponto por atleta. Cheio = mínimo pedido; vazado = até o máximo da faixa. */
export const SamplePiles = () => {
    const reduce = useReducedMotion() ?? false;
    const typical = SAMPLE_PILES[0].hi;
    const typicalTop = BASE_Y - Math.ceil(typical / COLS) * PITCH;
    return (
        <svg width={DV_W} height={DV_H} viewBox={`0 0 ${DV_W} ${DV_H}`} role="img" aria-label="Atletas necessários em cada desenho, um ponto por atleta">
            <SvgText x={28} y={36} text="Atletas necessários (Hopkins 1999)" color={C.text} size={18} weight={700} />
            <SvgText x={668} y={36} anchor="end" text="1 ponto = 1 atleta" color={C.muted} size={16} weight={500} />
            <SvgText x={668} y={60} anchor="end" text="cheio = mínimo · vazado = até o máximo" color={C.muted} size={16} weight={500} />
            <line x1={PILE_X[0]} x2={PILE_X[2] + PILE_W} y1={typicalTop} y2={typicalTop} stroke={C.lactate} strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="5 5" />
            {SAMPLE_PILES.map((pile, p) => {
                const x0 = PILE_X[p];
                const rows = Math.ceil(pile.hi / COLS);
                const top = BASE_Y - rows * PITCH;
                const start = [0.05, 0.25, 0.5][p];
                return (
                    <g key={pile.id}>
                        {Array.from({ length: pile.hi }, (_, i) => {
                            const row = Math.floor(i / COLS);
                            const solid = i < pile.lo;
                            return (
                                <motion.circle key={i} cx={x0 + (i % COLS) * PITCH + PITCH / 2} cy={BASE_Y - row * PITCH - PITCH / 2} r={4.4}
                                    fill={solid ? pile.color : 'none'} stroke={pile.color} strokeOpacity={solid ? 0 : 0.7} strokeWidth={1.3}
                                    initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2, delay: start + row * 0.03, ease: EASE_OUT }} />
                            );
                        })}
                        <SvgText x={x0 + PILE_W / 2} y={top - 12} anchor="middle" text={pile.range} color={pile.color} size={24} weight={700} />
                        <SvgText x={x0 + PILE_W / 2} y={BASE_Y + 28} anchor="middle" text={pile.label} color={pile.color} size={17} weight={700} />
                        <SvgText x={x0 + PILE_W / 2} y={BASE_Y + 50} anchor="middle" text={pile.sub} color={C.muted} size={16} weight={500} />
                    </g>
                );
            })}
            <line x1={28} x2={668} y1={BASE_Y + 4} y2={BASE_Y + 4} stroke="white" strokeOpacity={0.3} />
        </svg>
    );
};
