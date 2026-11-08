import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, Box, MonitorSpeaker, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSlideStepStore } from '../../store/useSlideSteps';
import { useDetailsStore } from '../../lib/detailsStore';
import { toggleDetails } from '../../lib/detailsEvent';

interface DeckChromeProps {
    index: number;
    total: number;
    section: string;
    idle: boolean;
    has3D: boolean;
    onPrev: () => void;
    onNext: () => void;
    onOverview: () => void;
    on3D: () => void;
    onPresenter: () => void;
}

const useFullscreen = () => {
    const [isFull, setIsFull] = useState(Boolean(document.fullscreenElement));
    useEffect(() => {
        const sync = () => setIsFull(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', sync);
        return () => document.removeEventListener('fullscreenchange', sync);
    }, []);
    const toggle = () => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
    };
    return { isFull, toggle };
};

const pad = (n: number) => String(n).padStart(2, '0');

const IconButton = ({ label, onClick, disabled, children }: {
    label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode;
}) => (
    <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled={disabled}
        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-brand-accent"
    >
        {children}
    </button>
);

/** Barra de progresso, seção atual, contador e controles — somem com o mouse parado. */
export const DeckChrome = ({ index, total, section, idle, has3D, onPrev, onNext, onOverview, on3D, onPresenter }: DeckChromeProps) => {
    const { isFull, toggle } = useFullscreen();
    const step = useSlideStepStore(s => s.step);
    const stepCount = useSlideStepStore(s => s.count);
    const detailsAvailable = useDetailsStore(s => s.available > 0);
    const detailsOpen = useDetailsStore(s => s.open);
    const progress = total > 1 ? index / (total - 1) : 1;
    const fade = idle ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0';

    return (
        <>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 z-30" aria-hidden>
                <div
                    className="h-full bg-gradient-to-r from-brand-deep via-brand-accent to-orange-400 transition-[width] duration-500 ease-out"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {section && (
                <div className={`absolute top-5 left-7 z-30 flex items-center gap-3 text-[13px] uppercase tracking-[0.22em] text-gray-300 pointer-events-none transition-all duration-500 ${idle ? 'opacity-60' : 'opacity-90'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_#22d3ee]" />
                    <span>{section}</span>
                </div>
            )}

            {stepCount > 1 && (
                <div
                    className="absolute bottom-20 min-[1180px]:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-black/55 border border-white/10 backdrop-blur-md pointer-events-none"
                    aria-label={`Passo ${step + 1} de ${stepCount}`}
                >
                    <span className="text-[13px] font-mono text-gray-200 tabular-nums">Passo {step + 1} de {stepCount}</span>
                    <span className="flex items-center gap-1.5" aria-hidden>
                        {Array.from({ length: stepCount }, (_, i) => (
                            <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-brand-accent' : i < step ? 'w-2 bg-brand-accent/70' : 'w-2 bg-white/30'}`} />
                        ))}
                    </span>
                </div>
            )}

            {(has3D || detailsAvailable) && (
                <div className={`absolute bottom-6 left-7 z-30 flex items-center gap-3 transition-all duration-500 ${idle ? 'opacity-60' : 'opacity-100'}`}>
                    {has3D && (
                        <button
                            type="button"
                            onClick={on3D}
                            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-sm text-white bg-gradient-to-r from-cyan-500/25 to-violet-500/25 border border-cyan-300/30 hover:border-cyan-200/70 shadow-[0_0_30px_-6px_rgba(34,211,238,0.6)] backdrop-blur-md"
                        >
                            <Box size={16} className="text-cyan-300" />
                            Ver mecanismo em 3D
                            <kbd className="deck-kbd ml-1">3</kbd>
                        </button>
                    )}
                    {detailsAvailable && (
                        <button
                            type="button"
                            onClick={toggleDetails}
                            aria-expanded={detailsOpen}
                            className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full text-sm text-gray-100 bg-black/55 border border-white/15 hover:border-brand-accent/60 hover:text-white backdrop-blur-md"
                        >
                            {detailsOpen ? 'Ocultar detalhamento' : 'Mostrar detalhamento'}
                            <ChevronDown size={16} className={`transition-transform duration-300 ${detailsOpen ? 'rotate-180' : ''}`} />
                            <kbd className="deck-kbd">D</kbd>
                        </button>
                    )}
                </div>
            )}

            <nav
                aria-label="Navegação dos slides"
                className={`absolute bottom-5 right-6 z-30 flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/55 border border-white/10 backdrop-blur-md transition-all duration-500 ${fade}`}
            >
                <IconButton label="Slide anterior (←)" onClick={onPrev} disabled={index === 0}>
                    <ChevronLeft size={18} />
                </IconButton>
                <span className="px-2 font-mono text-xs text-gray-300 tabular-nums select-none">
                    {pad(index + 1)}<span className="text-gray-600"> / {pad(total)}</span>
                </span>
                <IconButton label="Próximo slide (→)" onClick={onNext} disabled={index === total - 1}>
                    <ChevronRight size={18} />
                </IconButton>
                <span className="w-px h-5 bg-white/10 mx-1" />
                <IconButton label="Modo apresentador (P)" onClick={onPresenter}>
                    <MonitorSpeaker size={16} />
                </IconButton>
                <IconButton label="Visão geral (G)" onClick={onOverview}>
                    <LayoutGrid size={16} />
                </IconButton>
                <IconButton label={isFull ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'} onClick={toggle}>
                    {isFull ? <Minimize size={16} /> : <Maximize size={16} />}
                </IconButton>
            </nav>
        </>
    );
};
