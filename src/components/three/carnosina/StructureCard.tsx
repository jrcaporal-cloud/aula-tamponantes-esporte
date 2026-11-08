import { Info, Pin, X } from 'lucide-react';
import { useSelection } from './store';
import { STRUCTURES } from './structures';

/*
 * Cartão "Detalhes da estrutura": a fixada (trava o cartão e a câmera em close-up) ou, sem nada
 * fixado, a que está sob o ponteiro. Sempre com a fonte.
 */
export const StructureCard = ({ color }: { color: string }) => {
    const pin = useSelection(s => s.pin);
    const hoverId = useSelection(s => s.hoverId);
    const release = useSelection(s => s.release);
    const id = pin ?? hoverId;
    const shown = id ? STRUCTURES[id] : null;
    return (
        <div className="p-3.5 rounded-xl border transition-colors duration-300"
            style={shown ? { borderColor: `${color}80`, background: `${color}0d` } : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 mb-1">
                {pin ? <Pin size={15} style={{ color }} aria-hidden /> : <Info size={15} style={{ color: shown ? color : '#9ca3af' }} aria-hidden />}
                <span className="flex-1 text-[14px] font-semibold text-gray-200 uppercase tracking-wider">{shown ? shown.name : 'Detalhes da estrutura'}</span>
                {pin && (
                    <button type="button" onClick={release} aria-label="Soltar a estrutura fixada (Esc)"
                        className="inline-flex items-center gap-1.5 pl-2 pr-2.5 h-7 rounded-full text-[14px] text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15">
                        <X size={14} aria-hidden /> Soltar
                    </button>
                )}
            </div>
            <p className="text-[14px] text-gray-300 leading-relaxed" aria-live="polite">
                {shown ? shown.info : 'Passe o mouse ou clique numa estrutura para fixar o close-up.'}
            </p>
            {shown && <p className="text-[14px] text-gray-400 mt-1">Fonte: {shown.src}</p>}
        </div>
    );
};
