import { motion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, StudyCard, Tag } from './ato3/Frame';
import { PeakChart } from './ato3/PeakChart';
import { countAt, CURVES, PEAK_DEFAULT_T, PEAK_FEET, PEAK_TABS } from './ato3/pico';
import { C } from './kit/palette';

/**
 * Slide 46 — "Cada Atleta tem seu Relógio". Curvas individuais (ilustrativas, faixas de Jones 2016);
 * horário fixo × pico individual com contagem de atletas na janela; Boegman 2020; reprodutibilidade.
 * O 3D `jornada-bicarbonato` é de outro construtor.
 */

const SESSIONS = [169, 127, 159] as const;

const Counter = ({ value, label, color }: { value: string; label: string; color: string }) => (
    <div className="flex items-baseline gap-3">
        <span className="font-display text-[2.3rem] leading-none font-semibold tabular-nums" style={{ color }}>{value}</span>
        <span className="text-[16px] leading-snug text-gray-100">{label}</span>
    </div>
);

const TimeToPeakSim = () => {
    const { step, setStep } = useSlideSteps(PEAK_TABS.length);
    const [override, setOverride] = useState<{ step: number; t: number } | null>(null);
    const fixedT = override?.step === step ? override.t : PEAK_DEFAULT_T[step];
    const total = CURVES.length;
    const counts = countAt(fixedT);

    return (
        <Frame tabs={PEAK_TABS} step={step} setStep={setStep} layoutId="peak-tab" foot={PEAK_FEET[step]}
            chips={<Tag color={C.caveat}>curvas ilustrativas · faixas de Jones 2016</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: '700px 1fr' }}>
                <PeakChart fixedT={step === 1 ? fixedT : null} individual={step === 2} sessions={step === 3 ? SESSIONS : null} />
                <motion.div key={step} className="flex flex-col justify-center gap-3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
                    {step === 0 && (
                        <StudyCard tag="JONES 2016 · n = 16" title="Uma dose, dezesseis relógios" color={C.base}
                            lines={['0,3 g/kg, sem cegamento, sangue capilar por 3 h', 'Pico entre 75 e 180 min', 'Aumento de +6,0 a +12,3 mmol/L']} />
                    )}
                    {step === 1 && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
                            <span className="font-mono text-[15px] text-orange-300">HORÁRIO FIXO</span>
                            <input type="range" min={30} max={240} step={5} value={fixedT} aria-label="Minutos entre a dose e a largada"
                                onChange={e => setOverride({ step, t: Number(e.target.value) })} className="w-full accent-orange-400 cursor-pointer" />
                            <Counter value={`${counts.near}/${total}`} label="perto do próprio pico (≥ 90%)" color={C.base} />
                            <Counter value={`${counts.above}/${total}`} label="acima de +5 mmol/L" color={C.lactate} />
                            <p className="text-[16px] leading-snug text-gray-300">Arraste a largada: nenhum horário único pega todos no pico.</p>
                        </div>
                    )}
                    {step === 2 && (
                        <StudyCard tag="BOEGMAN 2020 · Front Nutr" title="369,0 → 367,0 s" color={C.base}
                            lines={['23 remadores (Canadá e Austrália), 13 de seleções olímpicas/mundiais', 'Consenso (60 min) × pico individual, ambos com bicarbonato', '18 de 23 melhoraram; d = 0,15', 'Sem braço placebo; após o aquecimento, o HCO₃⁻ ficou igual']} />
                    )}
                    {step === 3 && (
                        <>
                            <StudyCard tag="GOUGH 2017 · n = 15" title="CCI 0,94" color={C.base}
                                lines={['Tempo até o pico do HCO₃⁻ com 0,3 g/kg, repetido 2 vezes']} />
                            <StudyCard tag="DE OLIVEIRA 2020 · n = 13" title="169 · 127 · 159 min" color={C.lactate}
                                lines={['Tmax médio em 3 sessões: não reprodutível', '> 80% acima de +5 mmol/L entre 75 e 240 min (modelo)']} />
                        </>
                    )}
                </motion.div>
            </div>
        </Frame>
    );
};

export default TimeToPeakSim;
