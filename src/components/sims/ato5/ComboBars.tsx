import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { br, signed } from '../kit/format';
import type { BarPanel, BarRow } from './comboContent';

/** Barras horizontais do slide 73: efeito de cada peça, IC quando houver e a "soma" tracejada (cálculo). */

const LABEL_W = 132;
const VALUE_W = 64;

const pctOf = (panel: BarPanel, v: number) => ((v - panel.min) / (panel.max - panel.min)) * 100;

const fmt = (panel: BarPanel, row: BarRow) =>
    panel.min < 0 && panel.unit !== '%' && panel.decimals > 0 ? br(row.value, panel.decimals) : `${signed(row.value, panel.decimals)}${panel.unit}`;

const Row = ({ panel, row, index, rowH }: { panel: BarPanel; row: BarRow; index: number; rowH: number }) => {
    const reduce = useReducedMotion();
    const zero = pctOf(panel, 0);
    const end = pctOf(panel, row.value);
    const from = Math.min(zero, end);
    const width = Math.abs(end - zero);
    const isSum = Boolean(row.parts);
    const t = { duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : stagger(index, 0.15, 0.18), ease: EASE_OUT };
    const reveal = { from: { clipPath: 'inset(0 100% 0 0 round 6px)' }, to: { clipPath: 'inset(0 0% 0 0 round 6px)' } };
    return (
        <div className="grid items-center" style={{ gridTemplateColumns: `${LABEL_W}px minmax(0,1fr) ${VALUE_W}px`, height: rowH }}>
            <span className={`text-[16px] leading-tight ${isSum ? 'italic text-gray-300' : 'font-semibold text-white'}`}>{row.label}</span>
            <div className="relative h-full">
                {row.parts ? (
                    <motion.div className="absolute top-1/2 -translate-y-1/2 h-[26px] flex rounded-md border-2 border-dashed overflow-hidden"
                        style={{ left: `${from}%`, width: `${width}%`, borderColor: 'rgba(255,255,255,0.55)' }}
                        initial={reduce ? false : reveal.from} animate={reveal.to} transition={t}>
                        {row.parts.map((p, i) => (
                            <span key={i} className="h-full" style={{ width: `${(p.value / row.value) * 100}%`, background: `${p.color}55` }} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div className="absolute top-1/2 -translate-y-1/2 h-[26px] rounded-md" style={{ left: `${from}%`, width: `${width}%`, background: row.color }}
                        initial={reduce ? false : reveal.from} animate={reveal.to} transition={t} />
                )}
                {row.lo != null && row.hi != null && (
                    <motion.div className="absolute top-1/2 h-[2px] -translate-y-1/2" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ ...t, duration: reduce ? 0 : DUR.text, delay: t.delay + (reduce ? 0 : DUR.bar * 0.8) }}
                        style={{ left: `${pctOf(panel, row.lo)}%`, width: `${pctOf(panel, row.hi) - pctOf(panel, row.lo)}%`, background: '#fff' }}>
                        <span className="absolute left-0 top-1/2 h-[16px] w-[2px] -translate-y-1/2 bg-white" />
                        <span className="absolute right-0 top-1/2 h-[16px] w-[2px] -translate-y-1/2 bg-white" />
                    </motion.div>
                )}
            </div>
            <span className="text-right font-mono text-[16px] font-semibold" style={{ color: isSum ? '#D1D5DB' : row.color }}>{fmt(panel, row)}</span>
        </div>
    );
};

export const ComboBars = ({ panel, rowH = 52 }: { panel: BarPanel; rowH?: number }) => {
    const zero = pctOf(panel, 0);
    return (
        <div className="flex flex-col gap-1">
            <p className="text-[16px] text-gray-300">{panel.heading}</p>
            <div className="relative">
                <div className="absolute top-0 bottom-0 grid" style={{ left: LABEL_W, right: VALUE_W }}>
                    <span className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${zero}%` }} />
                </div>
                {panel.rows.map((row, i) => <Row key={row.label} panel={panel} row={row} index={i} rowH={rowH} />)}
            </div>
        </div>
    );
};
