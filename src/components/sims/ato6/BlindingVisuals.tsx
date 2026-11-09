import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { useCountUp } from '../kit/useCountUp';
import { GURTON, HURST } from './blindingContent';

/** Os quatro desenhos do "O Placebo que Denuncia" (caixa 696 × 440). */

export const BV_W = 696;
export const BV_H = 440;

/** 12 atletas em 4 × 3; os que dizem "não sei" acendem em ciano. */
const PeopleGrid = ({ cx, cy, lit, delay }: { cx: number; cy: number; lit: number; delay: number }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <g>
            {Array.from({ length: 12 }, (_, i) => {
                const on = i < lit;
                return (
                    <motion.circle key={i} cx={cx - 45 + (i % 4) * 30} cy={cy - 30 + Math.floor(i / 4) * 30} r={10}
                        fill={on ? C.base : C.risk} fillOpacity={on ? 0.9 : 0.55} stroke="#04080F" strokeWidth={1.5}
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + i * 0.03, duration: 0.25, ease: EASE_OUT }} />
                );
            })}
        </g>
    );
};

export const FormulationVisual = () => {
    const cols = [210, 380, 550];
    const rows = [{ key: 'capsule', label: 'Cápsulas', y: 140 }, { key: 'solution', label: 'Solução', y: 300 }] as const;
    return (
        <svg width={BV_W} height={BV_H} viewBox={`0 0 ${BV_W} ${BV_H}`} role="img" aria-label="Cegamento por formulação">
            {GURTON.map((g, i) => <SvgText key={g.moment} x={cols[i]} y={44} anchor="middle" text={g.moment} color={C.text} size={17} weight={700} />)}
            {rows.map(r => (
                <g key={r.key}>
                    <SvgText x={28} y={r.y + 6} text={r.label} color={C.text} size={18} weight={700} />
                    {GURTON.map((g, i) => (
                        <g key={g.moment}>
                            <PeopleGrid cx={cols[i]} cy={r.y} lit={r.key === 'capsule' ? g.capsule : g.solution} delay={i * 0.5} />
                            <SvgText x={cols[i]} y={r.y + 74} anchor="middle" text={r.key === 'capsule' ? g.capsulePct : g.solutionPct}
                                color={C.base} size={24} weight={700} />
                        </g>
                    ))}
                </g>
            ))}
            <circle cx={40} cy={414} r={9} fill={C.base} />
            <SvgText x={56} y={420} text='"não sei o que tomei"' color={C.text} size={16} weight={500} />
            <circle cx={270} cy={414} r={9} fill={C.risk} fillOpacity={0.6} />
            <SvgText x={286} y={420} text="arrisca um palpite (cegamento em risco)" color={C.text} size={16} weight={500} />
        </svg>
    );
};

export const BodyVisual = () => {
    // Escala log de 1 a 40 para a razão de chances.
    const lx = (v: number) => 60 + (Math.log(v) / Math.log(40)) * 560;
    const by = (pct: number) => 400 - pct * 5;
    return (
        <svg width={BV_W} height={BV_H} viewBox={`0 0 ${BV_W} ${BV_H}`} role="img" aria-label="Efeitos que denunciam o grupo">
            <SvgText x={28} y={42} text="β-alanina: parestesia × placebo (razão de chances)" color={C.carnoSoft} size={18} weight={700} />
            <line x1={lx(1)} x2={lx(40)} y1={110} y2={110} stroke="rgba(255,255,255,0.3)" />
            {[1, 2, 5, 10, 20, 40].map(v => <SvgText key={v} x={lx(v)} y={136} anchor="middle" text={`${v}`} color={C.muted} size={16} weight={500} />)}
            <line x1={lx(2.2)} x2={lx(32.6)} y1={110} y2={110} stroke={C.carno} strokeWidth={6} strokeLinecap="round" />
            <circle cx={lx(8.9)} cy={110} r={11} fill={C.carno} stroke="#04080F" strokeWidth={2} />
            <SvgText x={lx(8.9)} y={88} anchor="middle" text="OR 8,9 (CrI95% 2,2–32,6)" color={C.carno} size={18} weight={700} />
            <SvgText x={lx(1) + 6} y={92} text="igual ao placebo" color={C.muted} size={16} weight={500} />

            <SvgText x={28} y={196} text="Bicarbonato: corrida, 11 estudos" color={C.baseSoft} size={18} weight={700} />
            {[
                { x: 90, pct: 29.5, label: 'sintomas GI', other: 2.6 },
                { x: 380, pct: 8.7, label: 'desistiu por GI', other: 1.6 },
            ].map(b => (
                <g key={b.label}>
                    <rect x={b.x} y={by(b.pct)} width={80} height={400 - by(b.pct)} rx={6} fill={C.base} fillOpacity={0.75} />
                    <rect x={b.x + 90} y={by(b.other)} width={80} height={400 - by(b.other)} rx={6} fill={C.co2} fillOpacity={0.6} />
                    <SvgText x={b.x + 40} y={by(b.pct) - 8} anchor="middle" text={`${String(b.pct).replace('.', ',')}%`} color={C.base} size={18} weight={700} />
                    <SvgText x={b.x + 130} y={by(b.other) - 8} anchor="middle" text={`${String(b.other).replace('.', ',')}%`} color={C.co2} size={18} weight={700} />
                    <SvgText x={b.x + 85} y={426} anchor="middle" text={b.label} color={C.text} size={16} />
                </g>
            ))}
            <SvgText x={640} y={262} anchor="end" text="■ bicarbonato" color={C.base} size={16} />
            <SvgText x={640} y={286} anchor="end" text="■ placebo" color={C.co2} size={16} />
        </svg>
    );
};

export const MimicVisual = () => {
    const y = (s: number) => 380 - ((s - 300) / 200) * 280;
    const ey = (es: number) => 380 - es * 480;
    return (
        <svg width={BV_W} height={BV_H} viewBox={`0 0 ${BV_W} ${BV_H}`} role="img" aria-label="Placebos que imitam">
            <SvgText x={28} y={40} text="2016 · tempo até a exaustão (s)" color={C.text} size={18} weight={700} />
            <rect x={60} y={y(421)} width={110} height={380 - y(421)} rx={8} fill={C.co2} fillOpacity={0.6} />
            <rect x={200} y={y(461)} width={110} height={380 - y(461)} rx={8} fill={C.lactate} fillOpacity={0.85} />
            <SvgText x={115} y={y(421) - 10} anchor="middle" text="421" color={C.co2} size={22} weight={700} />
            <SvgText x={255} y={y(461) - 10} anchor="middle" text="461 (+9,5%)" color={C.lactate} size={22} weight={700} />
            <SvgText x={115} y={404} anchor="middle" text="sal + água" color={C.text} size={16} />
            <SvgText x={255} y={404} anchor="middle" text="sal + água com gás" color={C.text} size={16} />
            <SvgText x={255} y={426} anchor="middle" text="+ promessa de efeito" color={C.lactate} size={16} />

            <SvgText x={380} y={40} text="2024 · efeito vs. controle" color={C.text} size={18} weight={700} />
            <rect x={400} y={ey(0.46)} width={110} height={380 - ey(0.46)} rx={8} fill={C.base} fillOpacity={0.8} />
            <rect x={540} y={ey(0.45)} width={110} height={380 - ey(0.45)} rx={8} fill={C.lactate} fillOpacity={0.85} />
            <SvgText x={455} y={ey(0.46) - 10} anchor="middle" text="0,46" color={C.base} size={22} weight={700} />
            <SvgText x={595} y={ey(0.45) - 10} anchor="middle" text="0,45" color={C.lactate} size={22} weight={700} />
            <SvgText x={455} y={404} anchor="middle" text="bicarbonato" color={C.text} size={16} />
            <SvgText x={595} y={404} anchor="middle" text="dextrose" color={C.text} size={16} />
            <SvgText x={525} y={426} anchor="middle" text='os dois anunciados como "ergogênicos"' color={C.lactate} size={16} />
            <line x1={40} x2={670} y1={380} y2={380} stroke="rgba(255,255,255,0.3)" />
        </svg>
    );
};

export const ShareVisual = () => {
    const reduce = useReducedMotion() ?? false;
    const active = useCountUp('substância ~75%', reduce, { delay: 0.1, duration: 0.8 });
    const placebo = useCountUp('placebo ~25%', reduce, { delay: 0.6, duration: DUR.bar });
    const zero = 540;
    const hx = (v: number) => zero + v * 140;
    return (
        <svg width={BV_W} height={BV_H} viewBox={`0 0 ${BV_W} ${BV_H}`} role="img" aria-label="Parte do efeito que é expectativa">
            <SvgText x={28} y={40} text="Tamponantes: efeito total vs. não tomar nada (ES 0,37)" color={C.text} size={18} weight={700} />
            <motion.rect x={28} y={62} width={640 * 0.75} height={56} rx={10} fill={C.base} fillOpacity={0.75} style={{ transformBox: 'fill-box', originX: 0 }}
                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.1, duration: 0.8, ease: EASE_OUT }} />
            <motion.rect x={28 + 640 * 0.75} y={62} width={640 * 0.25} height={56} rx={10} fill={C.lactate} fillOpacity={0.9} style={{ transformBox: 'fill-box', originX: 0 }}
                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: DUR.bar, ease: EASE_OUT }} />
            <text x={44} y={97} fontSize={18} fontWeight={700} fill="#04080F" style={{ fontFamily: 'var(--font-body)', fontVariantNumeric: 'tabular-nums' }}>{active}</text>
            <text x={28 + 640 * 0.75 + 14} y={97} fontSize={18} fontWeight={700} fill="#04080F" style={{ fontFamily: 'var(--font-body)', fontVariantNumeric: 'tabular-nums' }}>{placebo}</text>
            <SvgText x={28} y={146} text="Ensaios só ativo × placebo medem a parte azul; o atleta vive as duas." color={C.muted} size={16} weight={500} />

            <SvgText x={28} y={200} text="627 participantes, sprint de 5 × 20 m (vs. sem cápsula)" color={C.text} size={18} weight={700} />
            <line x1={zero} x2={zero} y1={216} y2={420} stroke="rgba(255,255,255,0.4)" />
            {HURST.map((h, i) => {
                const y = 230 + i * 48;
                const color = h.value > 0 ? C.ok : h.value < -0.5 ? C.risk : C.co2;
                return (
                    <g key={h.label}>
                        <SvgText x={28} y={y + 22} text={h.label} color={C.text} size={17} />
                        <rect x={Math.min(hx(0), hx(h.value))} y={y + 4} width={Math.max(Math.abs(hx(h.value) - hx(0)), 3)} height={26} rx={5} fill={color} fillOpacity={0.85} />
                        <SvgText x={h.value >= 0 ? hx(h.value) + 8 : hx(h.value) - 8} y={y + 24} anchor={h.value >= 0 ? 'start' : 'end'}
                            text={`${h.value > 0 ? '+' : '−'}${Math.abs(h.value).toFixed(2).replace('.', ',')}%`} color={color} size={17} weight={700} />
                    </g>
                );
            })}
        </svg>
    );
};
