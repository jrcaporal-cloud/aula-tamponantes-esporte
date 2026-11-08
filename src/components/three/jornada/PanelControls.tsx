import { C } from '../../sims/kit/palette';
import { STRATEGIES, type StrategyId } from './content';
import { ATHLETE_COUNT, DOSE_RANGE, MASS_RANGE, br, type Curve, type DoseSummary } from './dose';

/*
 * Controles do painel lateral: dose (massa × g/kg, com os quatro personagens fictícios), estratégias
 * contra o GI (etapa 2), escolha do atleta (etapa 3) e sangue alcalino × normal (etapa 4).
 */

const PRESETS: readonly { name: string; mass: number }[] = [
    { name: 'Júlia', mass: 54 }, { name: 'Bianca', mass: 60 }, { name: 'Rafael', mass: 76 }, { name: 'Carlos', mass: 82 },
];

const Section = ({ title, chip, children }: { title: string; chip?: string; children: React.ReactNode }) => (
    <section className="mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2.5">
            <h4 className="text-[14px] font-semibold uppercase tracking-wider text-gray-300">{title}</h4>
            {chip && <span className="px-2 py-0.5 rounded-full text-[14px] font-mono text-amber-200 bg-amber-400/10 border border-amber-300/30">{chip}</span>}
        </div>
        {children}
    </section>
);

interface SliderProps { label: string; value: string; min: number; max: number; step: number; current: number; color: string; onChange: (v: number) => void }

const Slider = ({ label, value, min, max, step, current, color, onChange }: SliderProps) => (
    <label className="block mb-2.5">
        <span className="flex justify-between text-[14px] text-gray-300"><span>{label}</span><span className="font-mono text-white">{value}</span></span>
        <input
            type="range" min={min} max={max} step={step} value={current}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full mt-1" style={{ accentColor: color }}
        />
    </label>
);

interface DoseControlsProps { dose: DoseSummary; onMass: (m: number) => void; onDose: (d: number) => void }

export const DoseControls = ({ dose, onMass, onDose }: DoseControlsProps) => (
    <Section title="Dose">
        <Slider label="Massa corporal" value={`${dose.mass} kg`} min={MASS_RANGE.min} max={MASS_RANGE.max} step={1} current={dose.mass} color={C.sodium} onChange={onMass} />
        <Slider label="Dose" value={`${br(dose.dose, 2)} g/kg`} min={DOSE_RANGE.min} max={DOSE_RANGE.max} step={DOSE_RANGE.step} current={dose.dose} color={C.base} onChange={onDose} />
        <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS.map(p => (
                <button
                    key={p.name} type="button" onClick={() => onMass(p.mass)}
                    className={`px-2.5 h-8 rounded-full text-[14px] border ${dose.mass === p.mass ? 'text-white border-lime-300/60 bg-lime-400/15' : 'text-gray-300 border-white/15 bg-white/5 hover:bg-white/10'}`}
                >
                    {p.name} {p.mass}
                </button>
            ))}
            <span className="text-[14px] text-gray-400">casos fictícios</span>
        </div>
        <p className="mt-2 text-[14px] text-gray-300">
            {br(dose.powder)} g de pó · <span style={{ color: C.sodium }}>{br(dose.sodium)} g de sódio</span> · ISSN: 0,2 mínimo, 0,3 ótimo
        </p>
    </Section>
);

interface StrategyProps { active: readonly StrategyId[]; onToggle: (id: StrategyId) => void }

export const StrategySwitches = ({ active, onToggle }: StrategyProps) => (
    <Section title="Estratégias contra o GI" chip="efeito na cena ilustrativo">
        <div className="flex flex-col gap-2">
            {STRATEGIES.map(s => {
                const on = active.includes(s.id);
                return (
                    <button
                        key={s.id} type="button" role="switch" aria-checked={on} onClick={() => onToggle(s.id)}
                        className={`text-left rounded-xl px-3 py-2 border transition-colors ${on ? 'border-cyan-300/50 bg-cyan-400/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}
                    >
                        <span className="flex items-center gap-2">
                            <span className={`w-8 h-4.5 rounded-full p-0.5 shrink-0 transition-colors ${on ? 'bg-cyan-400' : 'bg-white/20'}`}>
                                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${on ? 'translate-x-3.5' : ''}`} />
                            </span>
                            <span className="text-[15px] font-semibold text-white">{s.label}</span>
                        </span>
                        <span className="block mt-1 text-[14px] font-mono text-cyan-200/90">{s.evidence}</span>
                        <span className="block text-[14px] text-gray-300 leading-snug">{s.note}</span>
                    </button>
                );
            })}
        </div>
    </Section>
);

interface AthleteProps { curves: Curve[]; selected: number; tested: boolean; onSelect: (i: number) => void }

export const AthletePicker = ({ curves, selected, tested, onSelect }: AthleteProps) => (
    <Section title="Escolha um atleta" chip="curvas ilustrativas">
        <div className="grid grid-cols-3 gap-1.5">
            {curves.slice(0, ATHLETE_COUNT).map((c, i) => (
                <button
                    key={c.id} type="button" onClick={() => onSelect(i)} aria-pressed={i === selected}
                    className={`rounded-lg px-2 py-1.5 border text-left ${i === selected ? 'border-cyan-300/70 bg-cyan-400/15' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'}`}
                >
                    <span className="block text-[14px] font-semibold text-white">{c.label}</span>
                    <span className="block text-[14px] font-mono text-gray-300">pico {c.peak} min</span>
                </button>
            ))}
        </div>
        <p className="mt-2 text-[14px] text-gray-300 leading-snug">
            {tested
                ? 'Picos e alturas dentro das faixas medidas por Jones 2016 na dose escolhida; a forma da curva é desenhada.'
                : 'Acima de 0,3 g/kg o estudo não testou: as curvas ficam nas faixas de 0,3 g/kg (a ISSN não vê ganho extra).'}
            {' '}No remo de elite, largar no pico individual valeu ~2 s (369,0 → 367,0 s; Boegman 2020, sem placebo).
        </p>
    </Section>
);

export const AlkalineToggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <Section title="Sangue que banha a fibra">
        <div className="grid grid-cols-2 gap-1.5" role="radiogroup">
            {([[false, 'Controle', C.acid], [true, 'Com bicarbonato', C.base]] as const).map(([v, label, color]) => (
                <button
                    key={label} type="button" role="radio" aria-checked={on === v} onClick={() => onChange(v)}
                    className="rounded-lg px-3 py-2 border text-[15px] font-semibold"
                    style={on === v ? { borderColor: `${color}aa`, background: `${color}22`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.12)', color: '#d1d5db' }}
                >
                    {label}
                </button>
            ))}
        </div>
        <p className="mt-2 text-[14px] text-gray-300 leading-snug">A velocidade das saídas segue a proporção 10,0 : 4,2 (75 % do VO₂máx); a animação é ilustrativa.</p>
    </Section>
);
