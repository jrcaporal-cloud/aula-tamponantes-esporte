import { useEffect, useRef, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DECK } from './slides';

interface OverviewProps {
    current: number;
    onSelect: (index: number) => void;
    onClose: () => void;
}

const SHORTCUTS: [string, string][] = [
    ['→ / Espaço / PgDn', 'avançar'],
    ['← / PgUp', 'voltar'],
    ['G', 'visão geral'],
    ['Q', 'quadro do inquérito'],
    ['F', 'tela cheia'],
    ['P', 'modo apresentador'],
    ['Home / End', 'início / fim'],
];

/** Tab e Shift+Tab giram dentro da grade (diálogo modal): o foco nunca cai no slide escondido atrás. */
const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const focusables = e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
};

/** Grade com todos os slides — útil para saltar durante perguntas da turma. */
export const Overview = ({ current, onSelect, onClose }: OverviewProps) => {
    const activeRef = useRef<HTMLButtonElement>(null);

    // Ao fechar, o foco volta para onde estava (o botão da barra ou o corpo da aula).
    useEffect(() => {
        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        return () => previous?.focus({ preventScroll: true });
    }, []);

    useEffect(() => {
        activeRef.current?.scrollIntoView({ block: 'center' });
        activeRef.current?.focus({ preventScroll: true });
    }, []);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Visão geral dos slides"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 bg-[#05050d]/92 backdrop-blur-xl overflow-y-auto"
            onClick={onClose}
            onKeyDown={trapTab}
        >
            <div className="max-w-7xl mx-auto px-10 py-12" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-3xl font-semibold text-white">Visão geral</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar visão geral (Esc)"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {DECK.map((item, i) => {
                        const isCurrent = i === current;
                        return (
                            <button
                                key={i}
                                ref={isCurrent ? activeRef : undefined}
                                type="button"
                                onClick={() => onSelect(i)}
                                className={`text-left rounded-xl p-4 border transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-brand-accent ${isCurrent
                                    ? 'bg-brand-deep/25 border-brand-accent/70 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)]'
                                    : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]'}`}
                            >
                                <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-[0.2em] text-gray-400">
                                    <span className="font-mono text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="truncate">{item.section}</span>
                                </div>
                                <div className="font-display text-[15px] font-semibold leading-snug text-white line-clamp-2">
                                    {item.label}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                    {SHORTCUTS.map(([keys, what]) => (
                        <span key={keys}><kbd className="deck-kbd">{keys}</kbd> {what}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
