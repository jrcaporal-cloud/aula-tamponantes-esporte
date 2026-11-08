import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from '../kit/palette';

/** Peças comuns aos simuladores do Ato II (A Perícia). Texto HTML sempre ≥15 px de projeto. */

/** Altura da caixa do simulador (o limite do palco é 516). */
export const SIM_H = 500;
/** Altura útil do corpo, abaixo das abas. */
export const BODY_H = 440;

interface ActTabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

/** Abas do passador (variante do kit com o número a 15 px: a 1280×720 o palco encolhe ~9%). */
const ActTabs = ({ labels, step, onSelect, layoutId }: ActTabsProps) => (
    <div className="flex items-center gap-1 self-start rounded-2xl border border-white/10 p-1" style={PANEL_BG} role="tablist" aria-label="Passos">
        {labels.map((label, i) => {
            const active = i === step;
            return (
                <button key={label} type="button" role="tab" aria-selected={active} onClick={() => onSelect(i)}
                    className="relative cursor-pointer rounded-xl px-3 py-1.5 text-[15px] font-semibold transition-colors"
                    style={{ color: active ? '#fff' : '#D1D5DB' }}>
                    {active && (
                        <motion.span layoutId={layoutId} className="absolute inset-0 rounded-xl border border-brand-accent/70 bg-brand-deep/45"
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

interface SimShellProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    /** Selos à direita das abas (tipo de evidência, "valores ilustrativos"…). */
    chips?: ReactNode;
    children: ReactNode;
}

/** Moldura: abas do passador em cima, selos à direita, corpo flexível embaixo. */
export const SimShell = ({ tabs, step, setStep, layoutId, chips, children }: SimShellProps) => (
    <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <ActTabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-3">{children}</div>
    </div>
);

export type EvidenceKind = 'humano' | 'animal' | 'in vitro' | 'revisão' | 'cálculo' | 'ilustrativo' | 'teoria';

const KIND_COLOR: Record<EvidenceKind, string> = {
    humano: C.ok,
    animal: '#FDE68A',
    'in vitro': '#E5E7EB',
    revisão: C.co2,
    cálculo: C.baseSoft,
    ilustrativo: C.lactate,
    teoria: C.co2,
};

/** Selo legível (15 px): diz de onde vem o dado. */
export const Tag = ({ kind, children }: { kind: EvidenceKind; children?: ReactNode }) => {
    const color = KIND_COLOR[kind];
    return (
        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[15px] leading-tight"
            style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
            {children ?? kind.toUpperCase()}
        </span>
    );
};

interface StepTextProps {
    step: number;
    headline: string;
    text: string;
    accent?: string;
    footer?: ReactNode;
    className?: string;
}

/** Narração do passo: entra com fade a cada troca (sem AnimatePresence, nada de texto velho preso). */
export const StepText = ({ step, headline, text, accent = C.base, footer, className = '' }: StepTextProps) => (
    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className={`flex flex-col gap-2 ${className}`}>
        <h3 className="font-display text-[1.3rem] font-semibold leading-tight" style={{ color: accent }}>{headline}</h3>
        <p className="text-[16px] leading-snug text-gray-100">{text}</p>
        {footer}
    </motion.div>
);

/** Linha de fonte do passo (curta; a citação completa fica atrás da tecla D). */
export const SourceLine = ({ children }: { children: ReactNode }) => (
    <p className="text-[15px] leading-snug text-gray-300">{children}</p>
);
