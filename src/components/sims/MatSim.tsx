import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, Tag } from './ato3/Frame';
import { MatTimeline } from './ato3/MatTimeline';
import { MAT_DEFAULT_TIMING, MAT_FEET, MAT_TABS, RAFAEL, type DoseTiming } from './ato3/tatame';
import { MetaScene, MiniScale, Trials, Weighs } from './ato3/tatameScenes';
import { br } from './kit/format';
import { C } from './kit/palette';

/**
 * Slide 26 — "Nos Tatames". Ensaios de luta (um ponto por atleta; ganho nas séries finais) → posicionamento ×
 * meta-análise (mostradores: lactato sobe, desempenho não) → o dilema de Rafael (caso fictício) na pesagem
 * IBJJF → as quatro vinhetas do que pesa: balança, estômago no solo, relógio e S5.
 */

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
            <span className="ml-auto flex items-center gap-2 text-[17px] font-bold" style={{ color: timing === 'antes' ? C.sodium : C.co2 }}>
                <MiniScale heavy={timing === 'antes'} />
                {timing === 'antes' ? `balança: + sódio e água (${br(RAFAEL.na, 1)} g de Na, ~${RAFAEL.fluidMl} mL)` : '1ª luta: sem tampão'}
            </span>
        </div>
        <div className="flex-1 min-h-0"><MatTimeline timing={timing} /></div>
    </div>
);

const MatSim = () => {
    const { step, setStep } = useSlideSteps(MAT_TABS.length);
    const [override, setOverride] = useState<{ step: number; timing: DoseTiming } | null>(null);
    const timing = override?.step === step ? override.timing : MAT_DEFAULT_TIMING[step];
    const rafael = step >= 2;
    const reduce = useReducedMotion() ?? false;

    return (
        <Frame tabs={MAT_TABS} step={step} setStep={setStep} layoutId="mat-tab" foot={MAT_FEET[step]}
            chips={rafael ? <Tag color={C.caveat}>caso fictício · 76 kg</Tag> : <Tag color={C.base}>{step === 0 ? 'ECRs agudos' : 'meta-análise'}</Tag>}>
            <motion.div key={step < 2 ? step : 'rafael'} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                {step === 0 && <Trials reduce={reduce} />}
                {step === 1 && <MetaScene reduce={reduce} />}
                {(step === 2 || step === 3) && <Dilemma timing={timing} setTiming={t => setOverride({ step, timing: t })} />}
                {step === 4 && <Weighs reduce={reduce} />}
            </motion.div>
        </Frame>
    );
};

export default MatSim;
