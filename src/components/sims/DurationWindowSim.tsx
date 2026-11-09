import { motion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { DURATION_FEET, DURATION_TABS, MCNAUGHTON_MARKS, NULL_MARKS, PERSONAS, type DurationMark } from './ato3/duracao';
import { Frame, Tag } from './ato3/Frame';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';

/**
 * Slide 44 — "A Janela de Duração". Eixo logarítmico de 5 s a 60 min: McNaughton 1992 (4 durações),
 * a faixa de 30 s–12 min da ISSN, onde é nulo e, por fim, os quatro personagens (fictícios) no eixo.
 */

const W = 1096;
const H = 372;
const X0 = 50;
const X1 = 1060;
const AXIS_Y = 236;
const T0 = 5;
const T1 = 3600;
const sx = (t: number) => X0 + ((Math.log10(t) - Math.log10(T0)) / (Math.log10(T1) - Math.log10(T0))) * (X1 - X0);
const TICKS: readonly [number, string][] = [[5, '5 s'], [10, '10 s'], [30, '30 s'], [60, '1 min'], [120, '2 min'], [300, '5 min'], [600, '10 min'], [1800, '30 min'], [3600, '60 min']];

const Mark = ({ m, y, delay }: { m: DurationMark; y: number; delay: number }) => {
    const color = m.works ? C.base : C.co2;
    return (
        <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay, ease: EASE_OUT }}>
            <line x1={sx(m.t)} x2={sx(m.t)} y1={y + 20} y2={AXIS_Y} stroke={color} strokeOpacity={0.5} strokeDasharray="3 4" />
            <circle cx={sx(m.t)} cy={y} r={19} fill={m.works ? 'rgba(34,211,238,0.18)' : 'rgba(148,163,184,0.14)'} stroke={color} strokeWidth={2.5} />
            <SvgText x={sx(m.t)} y={y + 7} text={m.works ? '✓' : '✕'} anchor="middle" size={20} weight={800} color={color} />
            <SvgText x={sx(m.t)} y={y - 30} text={m.label} anchor="middle" size={17} weight={700} color="#fff" />
            <SvgText x={sx(m.t)} y={y + 44} text={m.sub} anchor="middle" size={16} weight={500} color={C.muted} />
        </motion.g>
    );
};

const DurationWindowSim = () => {
    const { step, setStep } = useSlideSteps(DURATION_TABS.length);
    const bandX0 = sx(30);
    const bandX1 = sx(720);

    return (
        <Frame tabs={DURATION_TABS} step={step} setStep={setStep} layoutId="duration-tab" foot={DURATION_FEET[step]}
            chips={step === 3 ? <><Tag color={C.caveat}>casos fictícios</Tag><Tag color={C.caveat}>posições aproximadas</Tag></> : <Tag color={C.base}>0,3 g/kg</Tag>}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Janela de duração do esforço">
                <defs>
                    <linearGradient id="dur-band" x1="0" x2="1">
                        <stop offset="0%" stopColor={C.base} stopOpacity={0.05} />
                        <stop offset="12%" stopColor={C.base} stopOpacity={0.2} />
                        <stop offset="80%" stopColor={C.base} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={C.base} stopOpacity={0.04} />
                    </linearGradient>
                </defs>
                {step >= 1 && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
                        <rect x={bandX0} y={18} width={bandX1 - bandX0} height={AXIS_Y - 18} rx={10} fill="url(#dur-band)" stroke={`${C.base}55`} />
                        <SvgText x={(bandX0 + bandX1) / 2} y={44} text="alvo: ~30 s a 12 min (ISSN 2021)" anchor="middle" size={19} weight={700} color={C.base} />
                    </motion.g>
                )}
                <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                {TICKS.map(([t, l]) => (
                    <g key={t}>
                        <line x1={sx(t)} x2={sx(t)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke="rgba(255,255,255,0.4)" />
                        <SvgText x={sx(t)} y={AXIS_Y + 26} text={l} anchor="middle" size={16} weight={500} color={C.muted} />
                    </g>
                ))}
                 <SvgText x={X0} y={AXIS_Y + 50} text="duração do esforço (escala logarítmica)" size={16} weight={500} color="#CBD5E1" />
                {MCNAUGHTON_MARKS.map((m, i) => <Mark key={m.id} m={m} y={step >= 1 ? 118 : 110} delay={0.15 * i} />)}
                {step >= 2 && NULL_MARKS.map((m, i) => <Mark key={m.id} m={m} y={160} delay={0.15 * i} />)}
                {step >= 3 && PERSONAS.map((p, i) => {
                    const x = sx(p.t);
                    const xEnd = p.tMax ? sx(p.tMax) : x;
                    const y = [306, 306, 336, 364][i];
                    const textLeft = i !== 1;
                    return (
                        <motion.g key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 * i, ease: EASE_OUT }}>
                            <line x1={x} x2={x} y1={AXIS_Y + 34} y2={y - 12} stroke={p.color} strokeOpacity={0.6} />
                            {p.tMax && <rect x={x} y={y - 9} width={xEnd - x} height={18} rx={9} fill={p.color} opacity={0.35} />}
                            <circle cx={x} cy={y} r={11} fill={p.color} />
                            <SvgText x={textLeft ? x - 18 : xEnd + 18} y={y + 6} text={`${p.name} · ${p.sport} — ${p.note}`} size={17} weight={700}
                                anchor={textLeft ? 'end' : 'start'} color={p.color} />
                        </motion.g>
                    );
                })}
            </svg>
        </Frame>
    );
};

export default DurationWindowSim;
