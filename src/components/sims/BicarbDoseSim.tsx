import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { BloodChart, CurveChart, PeakChart } from './ato3/DoseCharts';
import { DOSE_DEFAULT, DOSE_FEET, DOSE_TABS, NA_FRACTION, zoneOf } from './ato3/dose';
import { Frame, Tag } from './ato3/Frame';
import { br } from './kit/format';
import { C } from './kit/palette';

/**
 * Slide 45 — "Dose: Mais não é Melhor". Passos: curva de 1992 → resposta no sangue (Jones 2016)
 * → o preço no intestino → no pico individual 0,2 = 0,3 (Gough 2018). O cursor de dose é extra.
 */

const REF_MASS = 70;

const BicarbDoseSim = () => {
    const { step, setStep } = useSlideSteps(DOSE_TABS.length);
    // O passador define a dose inicial do passo; o slider só a substitui dentro do mesmo passo.
    const [override, setOverride] = useState<{ step: number; dose: number } | null>(null);
    const dose = override?.step === step ? override.dose : DOSE_DEFAULT[step];
    const zone = zoneOf(dose);
    const grams = REF_MASS * dose;
    const curve = step === 0 || step === 2;

    return (
        <Frame tabs={DOSE_TABS} step={step} setStep={setStep} layoutId="dose-tab" foot={DOSE_FEET[step]}
            chips={curve ? <Tag color={C.lactate}>forma da curva ilustrativa</Tag> : <Tag color={C.base}>{step === 1 ? 'Jones 2016 · n = 16 · sem cegamento' : 'Gough 2018 · n = 11'}</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: '660px 1fr' }}>
                <motion.div key={step} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    {curve && <CurveChart dose={dose} showGi={step === 2} />}
                    {step === 1 && <BloodChart />}
                    {step === 3 && <PeakChart />}
                </motion.div>
                <div className="flex flex-col gap-3 justify-center">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-[15px] text-cyan-300">DOSE NO CURSOR</span>
                            <span className="font-display text-[2rem] leading-none font-semibold text-white">{br(dose, 2)} g/kg</span>
                        </div>
                        <input type="range" min={0.1} max={0.5} step={0.05} value={dose} aria-label="Dose em g/kg"
                            onChange={e => setOverride({ step, dose: Number(e.target.value) })}
                            className="w-full accent-cyan-400 cursor-pointer" />
                        <p className="font-display text-[1.3rem] font-semibold" style={{ color: zone.title === 'Só soma sintomas' ? C.risk : C.base }}>{zone.title}</p>
                        <p className="text-[16px] leading-snug text-gray-100">{zone.text}</p>
                        <span className="font-mono text-[15px] text-gray-400">{zone.source}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-baseline justify-between gap-3">
                        <span className="text-[16px] text-gray-200">Para {REF_MASS} kg (cálculo)</span>
                        <span className="text-[17px] font-semibold text-white">
                            {br(grams, 1)} g de pó · <span style={{ color: C.sodium }}>{br(grams * NA_FRACTION, 1)} g de Na</span>
                        </span>
                    </div>
                </div>
            </div>
        </Frame>
    );
};

export default BicarbDoseSim;
