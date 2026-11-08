import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';

/**
 * Peças comuns do Ato VI: moldura, abas, selos, narração por passo, seletor segmentado, número grande.
 * O palco encolhe para 0,91 num projetor 1280×720, então nada aqui fica abaixo de 15 px de projeto.
 */

/** Altura total de cada simulador do ato (o teto do palco é 516 px). */
export const SIM_H = 500;

interface TabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

/** Abas numeradas (versão do kit com 16 px): mostram onde o passador está; o clique é atalho. */
const Tabs = ({ labels, step, onSelect, layoutId }: TabsProps) => (
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
                        <span className="font-mono text-[15px] text-cyan-300">{i + 1}</span>
                        {label}
                    </span>
                </button>
            );
        })}
    </div>
);

/** Selo (ex.: "simulação · semente fixa"). */
export const Tag = ({ children, color = C.lactate }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[15px]"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);

/** Linha de fonte, discreta mas legível. */
export const Src = ({ children }: { children: ReactNode }) => (
    <p className="text-[15px] leading-snug text-gray-300">{children}</p>
);

interface FrameProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

/** Abas do passador à esquerda, selos à direita, conteúdo embaixo. */
export const SimFrame = ({ tabs, step, setStep, layoutId, chips, children }: FrameProps) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-2" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <Tabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            <div className="flex items-center gap-2">{chips}</div>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
    </div>
);

interface NarrationProps {
    stepKey: number;
    headline: string;
    text: string;
    color?: string;
}

/** Texto do passo: manchete + duas ou três frases, com fade a cada troca. */
export const Narration = ({ stepKey, headline, text, color = C.baseSoft }: NarrationProps) => (
    <motion.div key={stepKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex flex-col gap-1.5">
        <p className="font-display text-[1.35rem] font-semibold leading-tight" style={{ color }}>{headline}</p>
        <p className="text-[17px] leading-snug text-gray-100">{text}</p>
    </motion.div>
);

interface SegmentedProps<T extends string | number> {
    label: string;
    options: readonly { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
    color?: string;
}

/** Seletor de poucas opções (CV, n…). O passador ajusta sozinho; o clique é extra. */
export const Segmented = <T extends string | number>({ label, options, value, onChange, color = C.base }: SegmentedProps<T>) => (
    <div className="flex items-center gap-2">
        <span className="text-[15px] text-gray-300 w-[96px] shrink-0">{label}</span>
        <div className="flex gap-1 rounded-xl border border-white/10 p-0.5" style={PANEL_BG}>
            {options.map(o => {
                const on = o.value === value;
                return (
                    <button key={String(o.value)} type="button" onClick={() => onChange(o.value)}
                        className="px-2 py-1 rounded-lg font-mono text-[15px] cursor-pointer transition-colors"
                        style={{ color: on ? '#04080F' : '#E5E7EB', background: on ? color : 'transparent', fontWeight: on ? 700 : 500 }}>
                        {o.label}
                    </button>
                );
            })}
        </div>
    </div>
);

interface BigStatProps {
    value: string;
    label: string;
    color?: string;
    size?: number;
}

/** Número de destaque com legenda curta. */
export const BigStat = ({ value, label, color = C.text, size = 40 }: BigStatProps) => (
    <div className="flex flex-col">
        <span className="font-display font-semibold leading-none tabular-nums" style={{ color, fontSize: size }}>{value}</span>
        <span className="mt-1 text-[15px] leading-snug text-gray-300">{label}</span>
    </div>
);

/** Selos padrão do ato. */
export const SimChip = () => <Tag color={C.lactate}>simulação · semente fixa</Tag>;
export const IllustrativeChip = ({ text = 'valores ilustrativos' }: { text?: string }) => <Tag color={C.lactate}>{text}</Tag>;
