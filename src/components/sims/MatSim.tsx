import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, Tag } from './ato3/Frame';
import { MatTimeline } from './ato3/MatTimeline';
import { COMBAT, MAT_DEFAULT_TIMING, MAT_FEET, MAT_TABS, MAT_WEIGHS, RAFAEL, type DoseTiming } from './ato3/tatame';
import { br } from './kit/format';
import { C } from './kit/palette';

/**
 * Slide 49 — "Nos Tatames". Ensaios de luta (positivos e pequenos) → meta-análise sem efeito agrupado →
 * o dilema de Rafael (caso fictício) na pesagem IBJJF: tomar antes pesa na balança; depois, a 1ª luta fica sem tampão.
 */

const Trials = () => (
    <div className="h-full flex flex-col gap-3">
    <div className="grid grid-cols-5 gap-3">
        {COMBAT.map((t, i) => (
            <motion.div key={t.sport} className="rounded-xl border bg-white/[0.03] p-4 flex flex-col gap-2"
                style={{ borderColor: t.positive ? `${C.base}66` : `${C.co2}66` }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 * i }}>
                <span className="font-display text-[1.45rem] font-semibold text-white">{t.sport}</span>
                <span className="font-mono text-[15px]" style={{ color: t.positive ? C.base : C.co2 }}>{t.n}</span>
                <span className="text-[17px] leading-snug text-gray-100 flex-1">{t.result}</span>
                <span className="text-[15px] text-gray-400">{t.who}</span>
                <span className="font-display text-[2rem] leading-none font-semibold" style={{ color: t.positive ? C.base : C.co2 }}>{t.positive ? '+' : '0'}</span>
            </motion.div>
        ))}
    </div>
    <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-4">
            <span className="font-display text-[2.4rem] leading-none font-semibold text-white whitespace-nowrap">8–14</span>
            <span className="text-[17px] leading-snug text-gray-100">atletas por estudo: com tão pouca gente, um positivo isolado pode não se repetir</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-4">
            <span className="font-display text-[2.4rem] leading-none font-semibold whitespace-nowrap" style={{ color: C.base }}>no fim</span>
            <span className="text-[17px] leading-snug text-gray-100">o ganho aparece nas últimas séries, quando a acidose já se acumulou</span>
        </div>
    </div>
    </div>
);

const Meta = () => (
    <div className="h-full grid grid-cols-2 gap-5 items-center">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-3">
            <span className="font-mono text-[15px] text-cyan-300">ISSN 2021 · POSICIONAMENTO</span>
            <p className="text-[18px] leading-snug text-gray-100">Lista boxe, judô, caratê, taekwondo e luta olímpica entre os esportes em que 0,2–0,5 g/kg melhora o desempenho.</p>
        </div>
        <div className="rounded-xl border bg-white/[0.03] p-5 flex flex-col gap-3" style={{ borderColor: `${C.lactate}66` }}>
            <span className="font-mono text-[15px] text-yellow-300">MIRANDA 2022 · META-ANÁLISE · 8 ARTIGOS</span>
            <div className="flex items-baseline gap-3"><span className="font-display text-[1.6rem] font-semibold" style={{ color: C.lactate }}>lactato ↑</span><span className="text-[16px] text-gray-300">p = 0,006</span></div>
            <div className="flex items-baseline gap-3"><span className="font-display text-[1.6rem] font-semibold" style={{ color: C.co2 }}>desempenho =</span><span className="text-[16px] text-gray-300">potência, PSE e testes específicos</span></div>
            <p className="text-[16px] leading-snug text-gray-300">Mais lactato no sangue não é mais luta: é sinal de que a glicólise andou, não de que o atleta rendeu.</p>
        </div>
    </div>
);

const Dilemma = ({ timing, setTiming }: { timing: DoseTiming; setTiming: (t: DoseTiming) => void }) => (
    <div className="h-full flex flex-col gap-2">
        <div className="flex items-center gap-3">
            {(['antes', 'depois'] as const).map(t => (
                <button key={t} type="button" onClick={() => setTiming(t)} aria-pressed={timing === t}
                    className="rounded-lg border px-3 py-1.5 text-[16px] font-semibold cursor-pointer"
                    style={{ borderColor: timing === t ? C.base : 'rgba(255,255,255,0.15)', color: timing === t ? '#fff' : '#D1D5DB', background: timing === t ? `${C.base}22` : 'transparent' }}>
                    tomar {t} da pesagem
                </button>
            ))}
            <span className="ml-auto text-[17px] font-bold" style={{ color: timing === 'antes' ? C.sodium : C.co2 }}>
                {timing === 'antes' ? `balança: + sódio e água (${br(RAFAEL.na, 1)} g de Na, ~${RAFAEL.fluidMl} mL)` : '1ª luta: sem tampão'}
            </span>
        </div>
        <div className="flex-1 min-h-0"><MatTimeline timing={timing} /></div>
    </div>
);

const Weighs = () => (
    <div className="h-full grid grid-cols-2 gap-3">
        {MAT_WEIGHS.map((w, i) => (
            <motion.div key={w.title} className="rounded-xl border bg-white/[0.03] p-4 flex flex-col gap-1.5 justify-center"
                style={{ borderColor: `${w.color}66` }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 * i }}>
                <span className="font-display text-[1.35rem] font-semibold" style={{ color: w.color }}>{w.title}</span>
                <span className="text-[17px] leading-snug text-gray-100">{w.text}</span>
            </motion.div>
        ))}
    </div>
);

const MatSim = () => {
    const { step, setStep } = useSlideSteps(MAT_TABS.length);
    const [override, setOverride] = useState<{ step: number; timing: DoseTiming } | null>(null);
    const timing = override?.step === step ? override.timing : MAT_DEFAULT_TIMING[step];
    const rafael = step >= 2;

    return (
        <Frame tabs={MAT_TABS} step={step} setStep={setStep} layoutId="mat-tab" foot={MAT_FEET[step]}
            chips={rafael ? <Tag color={C.acid}>caso fictício · 76 kg</Tag> : <Tag color={C.base}>{step === 0 ? 'ECRs agudos' : 'meta-análise'}</Tag>}>
            <motion.div key={step < 2 ? step : 'rafael'} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {step === 0 && <Trials />}
                {step === 1 && <Meta />}
                {(step === 2 || step === 3) && <Dilemma timing={timing} setTiming={t => setOverride({ step, timing: t })} />}
                {step === 4 && <Weighs />}
            </motion.div>
        </Frame>
    );
};

export default MatSim;
