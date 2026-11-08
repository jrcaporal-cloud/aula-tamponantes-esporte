import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';

/** Altura total da caixa dos simuladores do Ato III (≤ 516 px de projeto). */
export const SIM_H = 500;

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (step: number) => void;
    layoutId: string;
    /** Selos à direita das abas (ex.: "valores ilustrativos"). */
    chips?: ReactNode;
    /** Frase do passo, no rodapé (troca com fade a cada passo). */
    foot: ReactNode;
    children: ReactNode;
}

/** Abas do passador (como as do kit, com números de 15 px: no projetor 1280×720 o palco encolhe ~9%). */
const Tabs = ({ labels, step, onSelect, layoutId }: { labels: readonly string[]; step: number; onSelect: (i: number) => void; layoutId: string }) => (
    <div className="flex items-center gap-1 rounded-2xl border border-white/10 p-1 self-start" style={PANEL_BG} role="tablist" aria-label="Passos">
        {labels.map((label, i) => {
            const active = i === step;
            return (
                <button key={label} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                    className="relative px-3 py-1.5 rounded-xl text-[16px] font-semibold cursor-pointer transition-colors"
                    style={{ color: active ? '#fff' : '#D1D5DB' }}>
                    {active && (
                        <motion.span layoutId={layoutId} className="absolute inset-0 rounded-xl bg-brand-deep/45 border border-brand-accent/70"
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

/** Selo (ex.: "valores ilustrativos", "caso fictício") em 15 px. */
export const Tag = ({ children, color = C.lactate }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[15px]"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);

/** Moldura comum do Ato III: abas do passador, painel principal e a frase do passo no rodapé. */
export const Frame = ({ tabs, step, setStep, layoutId, chips, foot, children }: FrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <Tabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="flex-1 min-h-0 rounded-2xl border border-white/10 px-5 pt-4 pb-3 flex flex-col gap-2" style={PANEL_BG}>
            <div className="flex-1 min-h-0">{children}</div>
            <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="pt-2.5 border-t border-white/10 text-[1.12rem] leading-snug text-white font-medium">
                {foot}
            </motion.p>
        </div>
    </div>
);

/** Cartão de estudo à direita dos gráficos: quem, quantos, o quê — e o número que importa. */
export const StudyCard = ({ tag, title, lines, color, children }: {
    tag: string; title: string; lines: readonly string[]; color: string; children?: ReactNode;
}) => (
    <div className="rounded-xl border bg-white/[0.03] p-4 flex flex-col gap-2" style={{ borderColor: `${color}55` }}>
        <span className="font-mono text-[15px] tracking-wide" style={{ color }}>{tag}</span>
        <p className="font-display text-[1.3rem] font-semibold leading-tight text-white">{title}</p>
        <ul className="flex flex-col gap-1">
            {lines.map(l => <li key={l} className="text-[16px] leading-snug text-gray-200">{l}</li>)}
        </ul>
        {children}
    </div>
);
