import { motion } from 'framer-motion';
import { Info, Pin, X } from 'lucide-react';
import { C } from '../../sims/kit/palette';
import { useSelection } from './selection';
import type { Controls, FiberStep } from './steps';
import { STRUCTURES } from './structures';

/* Peças do painel lateral: texto da etapa, controles, legenda de cores e cartão da estrutura. */

export const StepText = ({ data, step, last }: { data: FiberStep; step: number; last: number }) => (
    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-3 mb-2.5 pr-12">
            <span className="inline-block px-3 py-1 text-[14px] font-mono tracking-widest text-cyan-200 bg-cyan-500/10 border border-cyan-400/25 rounded-full">{data.badge}</span>
            <span className="text-[14px] font-mono text-gray-400" aria-label={`Etapa ${step + 1} de ${last + 1}`}>{step + 1}/{last + 1}</span>
        </div>
        <h3 className="font-display text-[24px] font-semibold text-white leading-tight mb-2">{data.title}</h3>
        <p className="text-[15px] text-gray-200 leading-relaxed">{data.text}</p>
        <ul className="mt-2 space-y-0.5">
            {data.sources.map(s => <li key={s} className="text-[14px] text-gray-400 leading-snug">{s}</li>)}
        </ul>
    </motion.div>
);

const Toggle = ({ on, label, color, onChange }: { on: boolean; label: string; color: string; onChange: (v: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border text-[14px] font-semibold transition-colors"
        style={on ? { borderColor: `${color}99`, background: `${color}22`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.12)', color: '#D1D5DB' }}
    >
        <span className="relative w-8 h-4 rounded-full shrink-0" style={{ background: on ? color : 'rgba(255,255,255,0.18)' }}>
            <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all" style={{ left: on ? 18 : 2 }} />
        </span>
        {label}
    </button>
);

export const ControlsBox = ({ value, onChange }: { value: Controls; onChange: (c: Controls) => void }) => (
    <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
        <label className="flex items-center justify-between text-[14px] font-semibold text-gray-200 mb-1" htmlFor="fibra-intensidade">
            Intensidade
            <span className="font-mono text-gray-300">{value.intensity < 0.02 ? 'repouso' : `${Math.round(value.intensity * 100)}%`}</span>
        </label>
        <input
            id="fibra-intensidade"
            type="range" min={0} max={1} step={0.05} value={value.intensity}
            onChange={e => onChange({ ...value, intensity: Number(e.target.value) })}
            className="w-full accent-orange-400"
        />
        <div className="flex gap-2 mt-2">
            <Toggle on={value.bic} label="Bicarbonato" color={C.base} onChange={bic => onChange({ ...value, bic })} />
            <Toggle on={value.ba} label="Beta-alanina" color={C.carno} onChange={ba => onChange({ ...value, ba })} />
        </div>
    </div>
);

const LEGEND: readonly [string, string][] = [
    [C.acid, 'H⁺'], [C.lactate, 'Lactato'], [C.base, 'HCO₃⁻ / tampões'], [C.carno, 'Carnosina'], [C.sodium, 'Na⁺'], [C.co2, 'CO₂'],
];

export const Legend = () => (
    <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-1.5">
        {LEGEND.map(([c, l]) => (
            <span key={l} className="flex items-center gap-2 text-[14px] text-gray-200 whitespace-nowrap">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />{l}
            </span>
        ))}
    </div>
);

/** Estrutura fixada (com "Soltar") ou, sem nada fixado, a que está sob o ponteiro. */
export const StructureCard = () => {
    const pin = useSelection(s => s.pin);
    const hoverId = useSelection(s => s.hoverId);
    const release = useSelection(s => s.release);
    const id = pin ?? hoverId;
    const shown = id ? STRUCTURES[id] : null;
    if (!shown) {
        return (
            <p className="flex items-center gap-2 text-[14px] text-gray-400">
                <Info size={15} aria-hidden /> Passe o mouse ou clique numa estrutura para o close-up.
            </p>
        );
    }
    const color = shown.color;
    return (
        <div className="p-3 rounded-xl border transition-colors duration-300"
            style={{ borderColor: `${color}80`, background: `${color}10` }}>
            <div className="flex items-center gap-2 mb-1">
                {pin ? <Pin size={15} style={{ color }} aria-hidden /> : <Info size={15} style={{ color }} aria-hidden />}
                <span className="flex-1 text-[14px] font-semibold text-gray-100 uppercase tracking-wider">{shown.name}</span>
                {pin && (
                    <button type="button" onClick={release} aria-label="Soltar a estrutura fixada (Esc)"
                        className="inline-flex items-center gap-1.5 pl-2 pr-2.5 h-7 rounded-full text-[14px] text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15">
                        <X size={14} aria-hidden /> Soltar
                    </button>
                )}
            </div>
            <p className="text-[14px] text-gray-300 leading-snug" aria-live="polite">{shown.info}</p>
            <p className="mt-1 text-[14px] text-gray-400 leading-snug">{shown.source}</p>
        </div>
    );
};
