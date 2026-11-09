import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { br } from '../kit/format';

/** Barra de comparação com marcas de referência (tetos), em HTML para o texto ficar nítido. */

export interface RefMark {
    value: number;
    label: string;
    color: string;
    dashed?: boolean;
}

interface CompareBarProps {
    title: string;
    value: number;
    unit: string;
    max: number;
    color: string;
    refs: readonly RefMark[];
    note: string;
}

export const CompareBar = ({ title, value, unit, max, color, refs, note }: CompareBarProps) => {
    const pctNum = (v: number) => Math.min(v / max, 1) * 100;
    const pctOf = (v: number) => `${pctNum(v)}%`;
    const move = { duration: 0.5, ease: EASE_OUT };
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <span className="text-[16px] font-semibold text-gray-100">{title}</span>
                <span className="text-[17px] font-bold" style={{ color }}>{note}</span>
            </div>
            <div className="relative h-[30px] rounded-md bg-white/[0.05] [container-type:inline-size]">
                <motion.div className="absolute inset-0 rounded-md" style={{ background: color, opacity: 0.85 }}
                    initial={{ clipPath: 'inset(0 100% 0 0 round 6px)' }} animate={{ clipPath: `inset(0 ${100 - pctNum(value)}% 0 0 round 6px)` }} transition={move} />
                {/* rótulo anda por translação em unidades da trilha (cqw): o invólucro tem largura zero e não vaza */}
                <motion.div className="pointer-events-none absolute inset-y-0 left-0 w-0" initial={false} animate={{ x: `${pctNum(Math.max(value, max * 0.16))}cqw` }} transition={move}>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 text-[16px] font-bold text-[#04080F] whitespace-nowrap">{br(value, 1)} {unit}</span>
                </motion.div>
                {refs.map(r => (
                    <span key={r.label} className="absolute -top-1 -bottom-1 w-0 border-l-[3px]"
                        style={{ left: pctOf(r.value), borderColor: r.color, borderStyle: r.dashed ? 'dashed' : 'solid' }} />
                ))}
            </div>
            <div className="relative h-[22px]">
                {refs.map(r => (
                    <span key={r.label} className="absolute top-0 whitespace-nowrap text-[15px] font-semibold -translate-x-1/2"
                        style={{ left: pctOf(r.value), color: r.color }}>{r.label}</span>
                ))}
            </div>
        </div>
    );
};
