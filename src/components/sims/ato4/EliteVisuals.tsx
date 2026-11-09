import { motion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { ROW } from './eliteContent';
import { tForP, twoGroup } from './stats';

/** Quadros do slide 66: velocistas de 400 m, o IC do remo (com n ajustável). O "spin" fica em EliteSpinVisual. */

const BARS = [
    { label: 'Carnosina · sóleo', value: 47, text: '+47%', color: C.carno },
    { label: 'Carnosina · gastrocnêmio', value: 37, text: '+37%', color: C.carno },
    { label: 'Tempo de 400 m', value: 0, text: 'sem efeito', color: C.co2 },
] as const;

export const SprintersVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-6 px-4">
        {BARS.map((b, i) => (
            <div key={b.label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                    <span className="text-[1.15rem] font-semibold text-white">{b.label}</span>
                    <span className="font-mono text-[1.35rem] font-semibold" style={{ color: b.color }}>{b.text}</span>
                </div>
                <div className="h-[22px] rounded-full bg-white/[0.06] overflow-hidden flex items-center">
                    {b.value > 0
                        ? <motion.div className="h-full rounded-full" style={{ background: b.color, width: `${(b.value / 60) * 100}%` }}
                            initial={reduce ? false : { clipPath: 'inset(0 100% 0 0 round 11px)' }} animate={{ clipPath: 'inset(0 0% 0 0 round 11px)' }}
                            transition={{ duration: DUR.bar, delay: stagger(i, 0.15), ease: EASE_OUT }} />
                        : <span className="ml-2 h-[3px] w-[40%] rounded-full" style={{ background: b.color }} />}
                </div>
            </div>
        ))}
        <p className="text-[16px] leading-snug text-gray-300">Detalhe: no placebo, o gastrocnêmio também subiu 16%, um aumento inesperado.</p>
    </div>
);

/** DP implícito no P = 0,07 publicado (cálculo): base para refazer o IC com outro n. */
const T_REAL = tForP(ROW.p, ROW.n1 + ROW.n2 - 2);
const SD = ROW.diff / T_REAL / Math.sqrt(1 / ROW.n1 + 1 / ROW.n2);

const W = 660;
const H = 250;
const MIN = -3;
const MAX = 11;
const sx = (v: number) => 30 + ((v - MIN) / (MAX - MIN)) * (W - 60);

const CiRow = ({ y, lo, hi, label, color, faded = false }: { y: number; lo: number; hi: number; label: string; color: string; faded?: boolean }) => (
    <g opacity={faded ? 0.4 : 1}>
        <motion.line initial={false} animate={{ x1: sx(lo), x2: sx(hi) }} transition={{ duration: DUR.morph, ease: EASE_IN_OUT }}
            y1={y} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />
        <rect x={sx(ROW.diff) - 9} y={y - 9} width={18} height={18} fill={color} transform={`rotate(45 ${sx(ROW.diff)} ${y})`} />
        <SvgText x={sx(MIN) + 4} y={y + 6} text={label} color={color} size={16} weight={700} />
    </g>
);

export const RowingCi = ({ n }: { n: number | null }) => {
    const real = twoGroup(ROW.diff, SD, ROW.n1, ROW.n2);
    const what = n === null ? null : twoGroup(ROW.diff, SD, n, n);
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Diferença de tempo no 2.000 m com intervalo de confiança">
            <rect x={sx(MIN)} y={20} width={sx(0) - sx(MIN)} height={H - 70} fill="white" fillOpacity={0.03} />
            <line x1={sx(0)} x2={sx(0)} y1={20} y2={H - 50} stroke={C.text} strokeOpacity={0.55} strokeDasharray="5 5" />
            <circle cx={sx(ROW.before)} cy={52} r={7} fill={C.co2} />
            <SvgText x={sx(ROW.before) + 14} y={58} text="antes: 0,3 s mais lento" color={C.co2} size={16} weight={700} />
            <CiRow y={112} lo={real.lo} hi={real.hi} label="8 × 9" color={C.carno} faded={what !== null} />
            <SvgText x={sx(ROW.diff)} y={92} text={`4,3 s · P = 0,07 · IC ${br(real.lo, 1).replace("-", "−")} a ${br(real.hi, 1)}`} anchor="middle" color={C.carnoSoft} size={16} weight={700} />
            {what && n !== null && (
                <g>
                    <CiRow y={168} lo={what.lo} hi={what.hi} label={`${n} × ${n}`} color={what.p < 0.05 ? C.ok : C.lactate} />
                    <SvgText x={sx(ROW.diff)} y={148} text={`mesmo 4,3 s · P = ${br(what.p, 3)}`} anchor="middle" color={what.p < 0.05 ? C.ok : C.lactate} size={16} weight={700} />
                </g>
            )}
            <line x1={30} x2={W - 30} y1={H - 50} y2={H - 50} stroke="white" strokeOpacity={0.3} />
            {[0, 2, 4, 6, 8, 10].map(t => <SvgText key={t} x={sx(t)} y={H - 26} text={`${t}`} anchor="middle" color={C.muted} size={16} weight={500} />)}
            <SvgText x={W - 30} y={H - 4} text="β-alanina mais rápida que placebo (s) →" anchor="end" color={C.muted} size={16} weight={500} />
        </svg>
    );
};
