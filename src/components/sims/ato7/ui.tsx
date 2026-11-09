import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import type { ReactNode } from 'react';
import { BODY_FONT, C, PANEL_BG } from '../kit/palette';
import { SIGNAL, SIM_H, type Signal } from './shared';

/**
 * Peças comuns aos simuladores do Ato VII (O Veredito).
 * Texto HTML ≥15 px de projeto: no projetor 1280×720 o palco escala 0,91 e 14 px viraria 12,8 px.
 * Por isso Tabs, Chip e Source daqui repetem o visual do kit com um ponto a mais.
 */

interface TabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

/** Abas numeradas (mesmo visual do StepTabs do kit): mostram onde o passador está; o clique é atalho. */
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
                        <span className="font-mono text-[15px] text-cyan-300">{i + 1}</span>
                        {label}
                    </span>
                </button>
            );
        })}
    </div>
);

/** Selo pequeno (ex.: "caso fictício", "valores ilustrativos"). */
export const Chip = ({ children, color = C.caveat }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[15px] leading-tight"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);

/** Linha de fonte, discreta mas legível (a lista completa fica atrás da tecla D). */
export const Source = ({ children }: { children: ReactNode }) => (
    <p className="m-0 text-[15px] leading-snug text-gray-300">{children}</p>
);

interface ShellProps {
    tabs: readonly string[];
    step: number;
    setStep: (i: number) => void;
    layoutId: string;
    chips?: ReactNode;
    children: ReactNode;
}

/** Moldura: abas do passador em cima, selos à direita, corpo embaixo. */
export const Shell = ({ tabs, step, setStep, layoutId, chips, children }: ShellProps) => (
    <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: SIM_H }}>
        <div className="flex items-center justify-between gap-3">
            <Tabs labels={tabs} step={step} onSelect={setStep} layoutId={layoutId} />
            {chips && <div className="flex items-center gap-2">{chips}</div>}
        </div>
        <div className="flex min-h-0 flex-1 gap-3">{children}</div>
    </div>
);

/** Selo dos personagens da aula. */
export const Fictional = () => <Chip color={C.caveat}>caso fictício</Chip>;

/** Luz do semáforo (círculo com brilho). */
export const Light = ({ signal, size = 26, on = true }: { signal: Signal; size?: number; on?: boolean }) => {
    const color = SIGNAL[signal].color;
    return (
        <span aria-label={SIGNAL[signal].label} className="inline-block shrink-0 rounded-full border transition-[background-color,border-color,box-shadow] duration-500"
            style={{
                width: size, height: size,
                background: on ? color : 'rgba(255,255,255,0.06)',
                borderColor: on ? color : 'rgba(255,255,255,0.18)',
                boxShadow: on ? `0 0 14px ${color}99` : 'none',
            }} />
    );
};

/** Bloco que troca com fade a cada passo (sem AnimatePresence mode="wait"). */
export const FadeSwap = ({ id, children, className = '' }: { id: string | number; children: ReactNode; className?: string }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div key={id} className={className}
            initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
            {children}
        </motion.div>
    );
};

/** Cartão escuro simples com borda colorida opcional. */
export const Card = ({ children, color, className = '' }: { children: ReactNode; color?: string; className?: string }) => (
    <div className={`overflow-hidden rounded-2xl border ${className}`}
        style={{ ...PANEL_BG, borderColor: color ? `${color}88` : 'rgba(255,255,255,0.1)' }}>
        {children}
    </div>
);

interface StoryPanelProps {
    id: string | number;
    kicker: string;
    color: string;
    title: string;
    text: string;
    points?: readonly string[];
    source: string;
    width?: number;
}

/** Coluna de narrativa: rubrica, título, texto, tópicos e fonte no rodapé. */
export const StoryPanel = ({ id, kicker, color, title, text, points = [], source, width = 440 }: StoryPanelProps) => (
    <div className="shrink-0 rounded-2xl border border-white/10 p-6" style={{ ...PANEL_BG, width }}>
        <FadeSwap id={id} className="flex h-full flex-col gap-3">
            <p className="m-0 font-mono text-[15px] uppercase tracking-wider" style={{ color }}>{kicker}</p>
            <h3 className="m-0 font-body text-[27px] font-semibold leading-tight text-white text-balance" style={BODY_FONT}>{title}</h3>
            <p className="m-0 text-[18px] leading-snug text-gray-100 text-pretty">{text}</p>
            {points.length > 0 && (
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {points.map(p => (
                        <li key={p} className="flex gap-2 text-[16px] leading-snug text-gray-200">
                            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                            {p}
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-auto"><Source>{source}</Source></div>
        </FadeSwap>
    </div>
);
