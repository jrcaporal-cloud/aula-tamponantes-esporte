import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { ODDS } from './paresthesiaContent';

/** Razão de chances da parestesia (Dolan 2019), em escala logarítmica, e o que mais a meta-análise olhou. */

const W = 640;
const H = 170;
const M = { l: 30, r: 30 };
const LOG_MIN = Math.log10(0.5);
const LOG_MAX = Math.log10(50);
const sx = (v: number) => M.l + ((Math.log10(v) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (W - M.l - M.r);
const TICKS = [0.5, 1, 2, 5, 10, 20, 50] as const;
const AXIS_Y = 120;

const OTHER = [
    { label: 'abandono', value: 'igual ao placebo', color: C.ok },
    { label: 'ALT', value: 'levemente ↑, na faixa normal', color: C.text },
    { label: 'taurina muscular', value: 'sem queda', color: C.ok },
] as const;

export const OddsRatio = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-5 px-2">
        <div className="flex items-baseline gap-3">
            <span className="font-display text-[3.2rem] leading-none font-semibold" style={{ color: C.risk }}>OR {br(ODDS.value, 1)}</span>
            <span className="text-[1.05rem] text-gray-200">parestesia × placebo · IC95% (credível) {br(ODDS.low, 1)}–{br(ODDS.high, 1)}</span>
        </div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Razão de chances 8,9 com intervalo de 2,2 a 32,6">
            <rect x={sx(0.5)} y={30} width={sx(1) - sx(0.5)} height={70} fill="white" fillOpacity={0.03} />
            <line x1={sx(1)} x2={sx(1)} y1={24} y2={AXIS_Y} stroke={C.text} strokeOpacity={0.6} strokeDasharray="5 5" />
            <SvgText x={sx(1) + 8} y={40} text="1 = sem diferença" color={C.muted} size={16} weight={500} />
            <motion.g initial={reduce ? false : { opacity: 0, scaleX: 0.2 }} animate={{ opacity: 1, scaleX: 1 }}
                style={{ transformOrigin: `${sx(ODDS.value)}px 75px` }} transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}>
                <line x1={sx(ODDS.low)} x2={sx(ODDS.high)} y1={75} y2={75} stroke={C.risk} strokeWidth={4} strokeLinecap="round" />
                <rect x={sx(ODDS.value) - 11} y={64} width={22} height={22} fill={C.risk} transform={`rotate(45 ${sx(ODDS.value)} 75)`} />
            </motion.g>
            <line x1={M.l} x2={W - M.r} y1={AXIS_Y} y2={AXIS_Y} stroke="white" strokeOpacity={0.3} />
            {TICKS.map(t => <SvgText key={t} x={sx(t)} y={AXIS_Y + 24} text={br(t, t < 1 ? 1 : 0)} anchor="middle" color={C.muted} size={16} weight={500} />)}
            <SvgText x={W - M.r} y={H - 2} text="razão de chances (escala log)" anchor="end" color={C.muted} size={16} weight={500} />
        </svg>
        <div className="grid grid-cols-3 gap-2">
            {OTHER.map(o => (
                <div key={o.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 flex flex-col gap-0.5">
                    <span className="text-[16px] text-gray-300">{o.label}</span>
                    <span className="text-[1.05rem] font-semibold leading-snug" style={{ color: o.color }}>{o.value}</span>
                </div>
            ))}
        </div>
    </div>
);
