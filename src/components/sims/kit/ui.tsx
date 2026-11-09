import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C, PANEL_BG } from './palette';

/** Peças comuns a todos os simuladores da aula. Texto sempre ≥14 px de projeto. */

interface StepTabsProps {
    labels: readonly string[];
    step: number;
    onSelect: (index: number) => void;
    layoutId: string;
}

/** Abas numeradas: mostram onde o passador está; o clique é atalho opcional. */
export const StepTabs = ({ labels, step, onSelect, layoutId }: StepTabsProps) => (
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
                        <span className="font-mono text-[14px] text-cyan-300">{i + 1}</span>
                        {label}
                    </span>
                </button>
            );
        })}
    </div>
);

type PanelState = 'idle' | 'active' | 'dim';

interface PanelProps {
    state?: PanelState;
    /** Cor da borda quando ativo (padrão: ciano). */
    glow?: string;
    /** Halo externo: só para o que precisa saltar do palco (carimbo de veredito, quadro do inquérito). */
    halo?: boolean;
    className?: string;
    children: ReactNode;
}

/**
 * Painel de vidro escuro; `active` tinge a borda, `dim` apaga (foco cruzado).
 * Sem halo por padrão: quando quase todo painel brilha, nenhum se destaca.
 */
export const Panel = ({ state = 'idle', glow = C.base, halo = false, className = '', children }: PanelProps) => {
    const active = state === 'active';
    return (
        <div className={`relative overflow-hidden rounded-2xl border transition-[opacity,border-color,box-shadow] duration-300 ${className}`}
            style={{
                ...PANEL_BG,
                borderColor: active ? `${glow}73` : 'rgba(255,255,255,0.1)',
                boxShadow: active && halo ? `0 0 0 1px ${glow}55, 0 0 30px -8px ${glow}` : 'none',
                opacity: state === 'dim' ? 0.55 : 1,
            }}>
            {children}
        </div>
    );
};

/** Selo pequeno (ex.: "valores ilustrativos", "ECR cruzado"). */
export const Chip = ({ children, color = C.caveat }: { children: ReactNode; color?: string }) => (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[14px]"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);

/** Linha de fonte, discreta mas legível (a lista completa fica atrás da tecla D). */
export const Source = ({ children }: { children: ReactNode }) => (
    <p className="text-[14px] leading-snug text-gray-300">{children}</p>
);

interface SvgTextProps {
    x: number;
    y: number;
    text: string;
    color?: string;
    size?: number;
    anchor?: 'start' | 'middle' | 'end';
    weight?: number;
}

/** Texto SVG com contorno escuro, para não sumir sobre linhas e formas. Use size ≥16 dentro de viewBox. */
export const SvgText = ({ x, y, text, color = '#E5E7EB', size = 16, anchor = 'start', weight = 600 }: SvgTextProps) => (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color}
        style={{ fontFamily: 'var(--font-body)', paintOrder: 'stroke', stroke: '#04080F', strokeWidth: 4, strokeLinejoin: 'round' }}>
        {text}
    </text>
);
