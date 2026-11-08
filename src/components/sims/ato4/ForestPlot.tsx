import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CountSvgText } from '../kit/CountUp';
import { br } from '../kit/format';
import { DURATION_ZONES, FOREST_ROWS, OUTSIDE_FACTS } from './forestContent';

/** Forest plot das estimativas agrupadas (SMD) e as faixas "onde esperar efeito". */

const W = 670;
const H = 316;
const X0 = 300;
const X1 = W - 24;
const MIN = -0.4;
const MAX = 0.9;
const ROW_H = 58;
const TOP = 34;
const sx = (v: number) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const rowY = (i: number) => TOP + i * ROW_H + 28;
const fmt = (v: number) => (v < 0 ? `−${br(-v, 2)}` : br(v, 2));

export const ForestPlot = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Forest plot das meta-análises de β-alanina">
        <SvgText x={14} y={20} text="tamanho de efeito (SMD) e IC95%" color={C.muted} size={16} weight={500} />
        <line x1={sx(0)} x2={sx(0)} y1={TOP} y2={H - 40} stroke={C.text} strokeOpacity={0.55} strokeDasharray="5 5" />
        {step === 1 && (
            <rect x={6} y={rowY(1) - 30} width={W - 12} height={ROW_H * 2 - 2} rx={10} fill={C.carno} fillOpacity={0.07} stroke={C.carno} strokeOpacity={0.35} />
        )}
        {FOREST_ROWS.map((r, i) => {
            const visible = step >= r.from;
            const y = rowY(i);
            return (
                <motion.g key={r.label} initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.45 }}>
                    <SvgText x={14} y={y - 4} text={r.label} color={C.text} size={18} weight={700} />
                    <SvgText x={14} y={y + 18} text={r.detail} color={C.muted} size={16} weight={500} />
                    {/* o intervalo abre a partir da estimativa quando a linha aparece */}
                    <motion.g key={visible ? 'on' : 'off'} initial={visible && !reduce ? { scaleX: 0.15 } : false} animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformBox: 'view-box', transformOrigin: `${sx(r.es)}px ${y}px` }}>
                        <line x1={sx(r.lo)} x2={sx(r.hi)} y1={y} y2={y} stroke={r.color} strokeWidth={4} strokeLinecap="round" />
                    </motion.g>
                    <rect x={sx(r.es) - 9} y={y - 9} width={18} height={18} fill={r.color} transform={`rotate(45 ${sx(r.es)} ${y})`} />
                    <CountSvgText x={sx(r.es)} y={y - 16} text={`${fmt(r.es)} (${fmt(r.lo)} a ${fmt(r.hi)})`} anchor="middle" color={r.color} size={16} weight={700}
                        run={visible && !reduce} duration={0.7} />
                </motion.g>
            );
        })}
        <line x1={X0} x2={X1} y1={H - 40} y2={H - 40} stroke="white" strokeOpacity={0.3} />
        {[-0.25, 0, 0.25, 0.5, 0.75].map(t => (
            <SvgText key={t} x={sx(t)} y={H - 16} text={fmt(t)} anchor="middle" color={C.muted} size={16} weight={500} />
        ))}
        <SvgText x={sx(-0.36)} y={H - 46} text="← placebo" color={C.muted} size={16} weight={500} />
        <SvgText x={X1} y={H - 46} text="β-alanina →" anchor="end" color={C.muted} size={16} weight={500} />
    </svg>
);

export const DurationStrip = () => (
    <div className="flex flex-col gap-1.5 px-2">
        <span className="text-[16px] text-gray-300">duração do esforço</span>
        <div className="flex gap-1.5">
            {DURATION_ZONES.map(z => (
                <div key={z.label} className="rounded-lg border px-3 py-1.5 flex flex-col"
                    style={{ width: `${z.width}%`, borderColor: `${z.color}80`, background: `${z.color}14` }}>
                    <span className="font-mono text-[16px] font-semibold" style={{ color: z.color }}>{z.label}</span>
                    <span className="text-[16px] leading-tight text-gray-100">{z.verdict}</span>
                </div>
            ))}
        </div>
    </div>
);

export const OutsideFacts = () => (
    <div className="grid grid-cols-3 gap-2 px-2">
        {OUTSIDE_FACTS.map(f => (
            <div key={f.label} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 flex flex-col">
                <span className="font-mono text-[1.1rem] font-semibold" style={{ color: C.carnoSoft }}>{f.value}</span>
                <span className="text-[16px] leading-tight text-gray-200">{f.label}</span>
            </div>
        ))}
    </div>
);
