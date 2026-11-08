import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';

/**
 * Abas e selo do Ato IV. No palco de 1280×720 a escala é ~0,91: os 14 px do kit viram ~12,8 px.
 * Por isso estas peças usam 16 px (≈14,6 px efetivos), com o mesmo desenho do kit.
 */

interface TabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

export const Tabs = ({ labels, step, onSelect, layoutId }: TabsProps) => (
    <div className="flex items-center gap-1 rounded-2xl border border-white/10 p-1 self-start" style={PANEL_BG} role="tablist" aria-label="Passos">
        {labels.map((label, i) => {
            const active = i === step;
            return (
                <button key={label} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                    className="relative px-3 py-1.5 rounded-xl text-[16px] font-semibold cursor-pointer transition-colors"
                    style={{ color: active ? '#fff' : '#D1D5DB' }}>
                    {active && (
                        <motion.span layoutId={layoutId} className="absolute inset-0 rounded-xl border"
                            style={{ background: 'rgba(91,33,182,0.42)', borderColor: `${C.carno}b3` }}
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    <span className="relative flex items-center gap-1.5">
                        <span className="font-mono text-[16px]" style={{ color: C.carnoSoft }}>{i + 1}</span>
                        {label}
                    </span>
                </button>
            );
        })}
    </div>
);

export const Tag = ({ children, color = C.lactate }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[16px] leading-tight"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);
