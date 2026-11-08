import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FiberStep } from './steps';

/* Linha das etapas no rodapé do modal (o clique também troca de etapa). */

interface TimelineProps { steps: readonly FiberStep[]; step: number; accent: string; onGo: (i: number) => void }

export const Timeline = ({ steps, step, accent, onGo }: TimelineProps) => {
    const last = steps.length - 1;
    return (
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-black/65 border border-white/10 backdrop-blur-xl">
            <button type="button" aria-label="Etapa anterior (←)" onClick={() => onGo(step - 1)} disabled={step === 0}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronLeft size={18} />
            </button>
            {steps.map((s, i) => (
                <button key={s.short} type="button" onClick={() => onGo(i)} title={s.short} aria-label={`${i + 1}. ${s.short}`}
                    aria-current={i === step ? 'step' : undefined}
                    className={`w-9 h-9 rounded-full text-[14px] font-semibold transition-all duration-300 ${i === step ? 'text-white border-2 scale-110' : 'bg-white/5 border border-white/15 text-gray-300 hover:text-white'}`}
                    style={i === step ? { background: `${accent}33`, borderColor: accent, boxShadow: `0 0 14px ${accent}80` } : i < step ? { borderColor: `${accent}66`, color: accent } : undefined}>
                    {i + 1}
                </button>
            ))}
            <button type="button" aria-label="Próxima etapa (→)" onClick={() => onGo(step + 1)} disabled={step === last}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25">
                <ChevronRight size={18} />
            </button>
        </div>
    );
};
