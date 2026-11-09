import { motion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { Info, Pin, X } from 'lucide-react';
import { C } from '../../sims/kit/palette';
import { useSelection } from './selection';
import type { Controls, FiberStep } from './steps';
import { STRUCTURES } from './structures';

/* Peças do painel lateral: texto da etapa, controles, legenda de cores e cartão da estrutura. */

export const StepText = ({ data, step, last }: { data: FiberStep; step: number; last: number }) => (
    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.text, ease: EASE_OUT }}>
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
            <span className={`absolute left-[2px] top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ease-(--ease-out) ${on ? 'translate-x-[16px]' : ''}`} />
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

type Glyph = 'ion' | 'hex' | 'trefoil' | 'dumbbell' | 'linear';

/** Cada item da legenda com a mesma forma que tem no 3D. */
const LEGEND: readonly { color: string; label: string; glyph: Glyph }[] = [
    { color: C.acid, label: 'H⁺', glyph: 'ion' },
    { color: C.lactate, label: 'Lactato', glyph: 'hex' },
    { color: C.base, label: 'HCO₃⁻ / tampões', glyph: 'trefoil' },
    { color: C.carno, label: 'Carnosina', glyph: 'dumbbell' },
    { color: C.sodium, label: 'Na⁺', glyph: 'ion' },
    { color: C.co2, label: 'CO₂', glyph: 'linear' },
];

const GlyphIcon = ({ glyph, color }: { glyph: Glyph; color: string }) => (
    <svg width={22} height={16} viewBox="0 0 22 16" aria-hidden className="shrink-0" style={{ filter: `drop-shadow(0 0 4px ${color}aa)` }}>
        {glyph === 'ion' && <circle cx={11} cy={8} r={5} fill={color} />}
        {glyph === 'hex' && <polygon points="11,2 16.2,5 16.2,11 11,14 5.8,11 5.8,5" fill={color} />}
        {glyph === 'trefoil' && (
            <g fill={color}>
                <circle cx={11} cy={8.6} r={2.6} />
                <circle cx={11} cy={3.6} r={2.6} />
                <circle cx={6.6} cy={11.2} r={2.6} />
                <circle cx={15.4} cy={11.2} r={2.6} />
            </g>
        )}
        {glyph === 'dumbbell' && (
            <g fill={color}>
                <circle cx={6.5} cy={8} r={3.6} />
                <rect x={8} y={6.8} width={6} height={2.4} rx={1} />
                <circle cx={15.5} cy={8} r={4.3} />
            </g>
        )}
        {glyph === 'linear' && (
            <g fill={color}>
                <circle cx={4.5} cy={8} r={3.2} />
                <circle cx={11} cy={8} r={3.5} />
                <circle cx={17.5} cy={8} r={3.2} />
            </g>
        )}
    </svg>
);

export const Legend = () => (
    <div className="mt-4">
        <p className="text-[14px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Legenda · forma e cor como no 3D</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {LEGEND.map(({ color, label, glyph }) => (
                <span key={label} className="flex items-center gap-2 text-[14px] text-gray-200 whitespace-nowrap">
                    <GlyphIcon glyph={glyph} color={color} />{label}
                </span>
            ))}
        </div>
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
