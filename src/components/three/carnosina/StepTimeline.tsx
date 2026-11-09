import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { CarnoStep } from './steps';

/* Linha do tempo das etapas (rodapé do modal), com ▶ Reproduzir. */

interface StepTimelineProps {
    steps: readonly CarnoStep[];
    step: number;
    playing: boolean;
    accent: string;
    onGo: (i: number) => void;
    onTogglePlay: () => void;
}

export const StepTimeline = ({ steps, step, playing, accent, onGo, onTogglePlay }: StepTimelineProps) => {
    const last = steps.length - 1;
    return (
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-2.5 rounded-full bg-black/85 border border-white/10">
            <button type="button" aria-label="Etapa anterior" onClick={() => onGo(step - 1)} disabled={step === 0}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronLeft size={18} />
            </button>
            {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                    {i > 0 && (
                        <div className="w-3 h-px bg-white/15 relative overflow-hidden">
                            <div className={`absolute inset-0 transition-transform duration-700 ${i <= step ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: accent }} />
                        </div>
                    )}
                    <button type="button" onClick={() => onGo(i)} title={s.short} aria-label={`${i + 1}. ${s.title}`} aria-current={i === step ? 'step' : undefined}
                        className={`w-9 h-9 rounded-full text-[14px] font-semibold transition-all duration-300 ${i === step ? 'text-white border-2 scale-110' : i < step ? 'bg-white/5 border hover:bg-white/10' : 'bg-white/5 border border-white/15 text-gray-400 hover:border-white/30 hover:text-gray-100'}`}
                        style={i === step ? { background: `${accent}33`, borderColor: accent, boxShadow: `0 0 16px ${accent}80` } : i < step ? { borderColor: `${accent}66`, color: accent } : undefined}>
                        {i + 1}
                    </button>
                </div>
            ))}
            <button type="button" aria-label="Próxima etapa" onClick={() => onGo(step + 1)} disabled={step === last}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronRight size={18} />
            </button>
            <span className="w-px h-6 bg-white/10" />
            <button type="button" onClick={onTogglePlay} aria-label={playing ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
                className="flex items-center gap-2 pl-3 pr-4 h-9 rounded-full text-[14px] text-gray-200 hover:text-white hover:bg-white/10">
                {playing ? <Pause size={15} /> : <Play size={15} />}
                {playing ? 'Pausar' : 'Reproduzir'}
            </button>
        </div>
    );
};
