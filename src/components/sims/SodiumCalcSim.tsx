import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, Tag } from './ato3/Frame';
import { CompareBar } from './ato3/SodiumBars';
import { BULA_BR_G, compute, LABEL_MAX_60_G, LABEL_MAX_G, PRESETS, SODIUM_DEFAULTS, SODIUM_FEET, SODIUM_TABS, WHO_NA_G } from './ato3/sodio';
import { br } from './kit/format';
import { C } from './kit/palette';

/**
 * Slide 48 — "Quanto Sódio é Isso?". Calculadora: massa × dose → g de pó, g e mmol de sódio, cápsulas de 840 mg
 * e líquido do protocolo; comparação com o teto da OMS e com o teto do rótulo do antiácido; presets dos 4 personagens.
 */

const Stat = ({ big, label, color = '#fff' }: { big: string; label: string; color?: string }) => (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 flex flex-col">
        <span className="font-display text-[2rem] leading-tight font-semibold tabular-nums" style={{ color }}>{big}</span>
        <span className="text-[15px] leading-snug text-gray-300">{label}</span>
    </div>
);

const Slider = ({ label, value, min, max, step, onChange, text }: {
    label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; text: string;
}) => (
    <label className="flex-1 flex flex-col gap-1">
        <span className="flex items-baseline justify-between text-[16px] text-gray-200">
            {label}<span className="font-display text-[1.35rem] font-semibold text-white">{text}</span>
        </span>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
            className="w-full accent-lime-400 cursor-pointer" aria-label={label} />
    </label>
);

const SodiumCalcSim = () => {
    const { step, setStep } = useSlideSteps(SODIUM_TABS.length);
    const [override, setOverride] = useState<{ step: number; mass: number; dose: number } | null>(null);
    const { mass, dose } = override?.step === step ? override : SODIUM_DEFAULTS[step];
    const set = (patch: Partial<{ mass: number; dose: number }>) => setOverride({ step, mass, dose, ...patch });
    const r = compute(mass, dose);
    const preset = PRESETS.find(p => p.mass === mass);

    return (
        <Frame tabs={SODIUM_TABS} step={step} setStep={setStep} layoutId="sodium-tab" foot={SODIUM_FEET[step]}
            chips={<>{step === 3 && <Tag color={C.acid}>casos fictícios</Tag>}<Tag color={C.lactate}>cálculo</Tag></>}>
            <div className="h-full flex flex-col gap-3">
                <div className="flex items-end gap-5">
                    <Slider label="Massa corporal" value={mass} min={40} max={120} step={1} onChange={v => set({ mass: v })} text={`${mass} kg`} />
                    <Slider label="Dose" value={dose} min={0.1} max={0.5} step={0.05} onChange={v => set({ dose: v })} text={`${br(dose, 2)} g/kg`} />
                    <div className="flex gap-1.5">
                        {PRESETS.map(p => (
                            <button key={p.id} type="button" onClick={() => set({ mass: p.mass })}
                                className="rounded-lg border px-2.5 py-1.5 text-[15px] font-semibold cursor-pointer"
                                style={{ borderColor: preset?.id === p.id ? p.color : 'rgba(255,255,255,0.15)', color: preset?.id === p.id ? p.color : '#D1D5DB', background: preset?.id === p.id ? `${p.color}18` : 'transparent' }}>
                                {p.name} {p.mass}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <Stat big={`${br(r.powder, 1)} g`} label="de NaHCO₃ em pó" />
                    <Stat big={`${br(r.na, 1)} g`} label={`de sódio (${Math.round(r.naMmol)} mmol)`} color={C.sodium} />
                    <Stat big={`${r.capsules}`} label="cápsulas de 840 mg" />
                    <Stat big={`${br(r.fluid / 1000, 2)} L`} label="de líquido (10 mL/kg, Boegman 2020)" color="#93C5FD" />
                </div>
                <motion.div key={step >= 1 ? 'bars' : 'none'} className="flex-1 min-h-0 flex flex-col justify-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.25 }} transition={{ duration: 0.4 }}>
                    <CompareBar title="Sódio desta dose × teto diário da OMS" value={r.na} unit="g de Na" max={10} color={C.sodium}
                        note={`${br(r.whoTimes, 1)}× o teto do dia`} refs={[{ value: WHO_NA_G, label: 'OMS < 2 g/dia', color: '#fff' }]} />
                    {step >= 2 && (
                        <CompareBar title="Pó desta dose × rótulo do antiácido (24 h)" value={r.powder} unit="g" max={45} color={C.base}
                            note={`${br(r.labelTimes, 1)}× o máximo de 24 h`}
                            refs={[
                                { value: BULA_BR_G, label: 'bula BR: 2,5 g', color: C.muted },
                                { value: LABEL_MAX_60_G, label: '> 60 a: 7,2', color: C.lactate, dashed: true },
                                { value: LABEL_MAX_G, label: 'rótulo: 16,8 g/24 h', color: '#fff' },
                            ]} />
                    )}
                </motion.div>
            </div>
        </Frame>
    );
};

export default SodiumCalcSim;
