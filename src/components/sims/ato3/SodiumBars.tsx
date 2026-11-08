import { motion } from 'framer-motion';
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
    const pctOf = (v: number) => `${Math.min(v / max, 1) * 100}%`;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <span className="text-[16px] font-semibold text-gray-100">{title}</span>
                <span className="text-[17px] font-bold" style={{ color }}>{note}</span>
            </div>
            <div className="relative h-[30px] rounded-md bg-white/[0.05]">
                <motion.div className="absolute left-0 top-0 bottom-0 rounded-md" style={{ background: color, opacity: 0.85 }}
                    animate={{ width: pctOf(value) }} transition={{ duration: 0.5 }} />
                <span className="absolute top-1/2 -translate-y-1/2 -translate-x-full pr-2 text-[16px] font-bold text-[#04080F] whitespace-nowrap transition-[left] duration-500"
                    style={{ left: pctOf(Math.max(value, max * 0.16)) }}>{br(value, 1)} {unit}</span>
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
