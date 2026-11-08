import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HALF_LIVES, HARRIS_BARS, remaining } from './chemContent';

/** Gráficos do slide 61: decaimento no plasma (de Jager 2023) e carga muscular de Harris 2006. */

const W = 670;
const H = 380;
const M = { l: 66, r: 178, t: 70, b: 46 };
const T_MAX = 30;
const sx = (t: number) => M.l + (t / T_MAX) * (W - M.l - M.r);
const sy = (f: number) => H - M.b - f * (H - M.t - M.b);
const COLORS = [C.carno, C.co2, C.carnoSoft] as const;
const CHECK_MIN = 5;

const decayPath = (halfLife: number): string => {
    const pts: string[] = [];
    for (let t = 0; t <= T_MAX + 1e-6; t += 0.2) pts.push(`${sx(t).toFixed(1)},${sy(remaining(t, halfLife)).toFixed(1)}`);
    return `M${pts.join(' L')}`;
};

export const HalfLifeChart = ({ reduce }: { reduce: boolean }) => (
    <div className="relative">
        <div className="absolute left-[66px] top-[6px] flex items-center gap-2 text-[16px] text-gray-200">
            <Scissors size={20} color={C.acid} aria-hidden />
            carnosinase do soro (CN1): carnosina → β-alanina + histidina
        </div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Fração restante no plasma ao longo dos minutos">
            {[0, 0.5, 1].map(f => (
                <g key={f}>
                    <line x1={M.l} x2={W - M.r} y1={sy(f)} y2={sy(f)} stroke="white" strokeOpacity={f === 0 ? 0.3 : 0.08} />
                    <SvgText x={M.l - 10} y={sy(f) + 6} text={`${f * 100}%`} anchor="end" color={C.muted} size={16} weight={500} />
                </g>
            ))}
            <line x1={sx(CHECK_MIN)} x2={sx(CHECK_MIN)} y1={M.t - 10} y2={sy(0)} stroke={C.text} strokeOpacity={0.35} strokeDasharray="4 5" />
            <SvgText x={sx(CHECK_MIN) + 8} y={M.t + 2} text="5 min" color={C.text} size={16} />
            {HALF_LIVES.map((h, i) => {
                const left = remaining(CHECK_MIN, h.minutes);
                return (
                    <g key={h.name}>
                        <motion.path d={decayPath(h.minutes)} fill="none" stroke={COLORS[i]} strokeWidth={4} strokeLinecap="round"
                            initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 1.4, delay: 0.2 + i * 0.25, ease: 'easeOut' }} />
                        <circle cx={sx(CHECK_MIN)} cy={sy(left)} r={6} fill={COLORS[i]} stroke="#04080F" strokeWidth={2} />
                        <SvgText x={W - M.r + 10} y={sy(remaining(T_MAX, h.minutes)) + (i === 2 ? 6 : i === 0 ? 4 : -18)}
                            text={`${h.name} ${h.label}`} color={COLORS[i]} size={16} weight={700} />
                    </g>
                );
            })}
            <rect x={sx(11)} y={sy(0.52)} width={232} height={106} rx={12} fill="#04080F" fillOpacity={0.85} stroke="white" strokeOpacity={0.12} />
            <SvgText x={sx(11) + 14} y={sy(0.52) + 26} text="em 5 min restam:" color={C.text} size={16} />
            {HALF_LIVES.map((h, i) => (
                <SvgText key={h.name} x={sx(11) + 14} y={sy(0.52) + 52 + i * 24}
                    text={`${h.name}: ${Math.round(remaining(CHECK_MIN, h.minutes) * 100)}%`} color={COLORS[i]} size={17} weight={700} />
            ))}
            {[0, 10, 20, 30].map(t => <SvgText key={t} x={sx(t)} y={H - M.b + 22} text={`${t}`} anchor="middle" color={C.muted} size={16} weight={500} />)}
            <SvgText x={W - M.r} y={H - 4} text="minutos no plasma" anchor="end" color={C.muted} size={16} weight={500} />
            <SvgText x={M.l} y={M.t - 18} text="fração intacta no plasma (cálculo pela meia-vida)" color={C.muted} size={16} weight={500} />
        </svg>
    </div>
);

export const HarrisBars = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-6 px-6">
        <p className="text-[16px] text-gray-300">Carnosina do vasto lateral após 4 semanas · Harris 2006</p>
        {HARRIS_BARS.map((b, i) => {
            const isCarnosine = i === HARRIS_BARS.length - 1;
            return (
                <div key={b.label} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between">
                        <span className="text-[1.15rem] font-semibold text-white">{b.label}</span>
                        <span className="font-mono text-[1.35rem] font-semibold" style={{ color: isCarnosine ? C.carnoSoft : C.carno }}>{b.text}</span>
                    </div>
                    <div className="h-[22px] rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            style={{ background: isCarnosine ? `repeating-linear-gradient(135deg, ${C.carnoSoft}, ${C.carnoSoft} 8px, ${C.carno} 8px, ${C.carno} 16px)` : C.carno }}
                            initial={reduce ? false : { width: 0 }} animate={{ width: `${(b.value / 80) * 100}%` }}
                            transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease: 'easeOut' }} />
                    </div>
                </div>
            );
        })}
        <p className="text-[16px] leading-snug text-gray-200">
            No mesmo estudo, caldo de galinha rico em dipeptídeos fez a β-alanina do plasma subir (pico de 428 µM), mas nenhuma carnosina apareceu no sangue.
        </p>
    </div>
);
