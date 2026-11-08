import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';

/**
 * Variantes do kit com corpo 16 px: no projetor 1280×720 o palco encolhe para ~0,91,
 * e os 14 px do kit ficariam abaixo do piso de 14 px efetivos.
 */

interface TabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

export const Tabs = ({ labels, step, onSelect, layoutId }: TabsProps) => (
    <div className="flex items-center gap-1 self-start rounded-2xl border border-white/10 p-1" style={PANEL_BG} role="tablist" aria-label="Passos">
        {labels.map((label, i) => {
            const active = i === step;
            return (
                <button key={label} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                    className="relative cursor-pointer rounded-xl px-3 py-1.5 text-[16px] font-semibold transition-colors"
                    style={{ color: active ? '#fff' : '#D1D5DB' }}>
                    {active && (
                        <motion.span layoutId={layoutId} className="absolute inset-0 rounded-xl border border-brand-accent/70 bg-brand-deep/45"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    <span className="relative flex items-center gap-1.5">
                        <span className="font-mono text-[16px] text-cyan-300">{i + 1}</span>
                        {label}
                    </span>
                </button>
            );
        })}
    </div>
);

export const Tag = ({ children, color = C.lactate }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[16px] leading-none"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);
