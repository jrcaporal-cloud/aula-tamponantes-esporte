import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { Tag, Tabs } from './ato4/ui';
import { br } from './kit/format';
import { useTween } from './kit/useTween';
import { LOADING_STEPS } from './ato4/loadingContent';
import { LoadingChart } from './ato4/LoadingChart';
import { LoadingControls, YieldCard } from './ato4/LoadingControls';
import { HOBSON_G, INCORPORATION, cumulativeGrams, daysToReach, fractionOfMax, weeksToBaseline } from './ato4/loadingModel';
import { Narration, Shell, Takeaway } from './ato4/shell';

/**
 * Slide 62 "Encher o Tanque Leva Semanas". O passador percorre cinco cenários (4 sem, 10 sem, rendimento,
 * teto brasileiro, washout); os sliders deixam a turma testar outra dose ou duração no mesmo passo.
 * Curva = modelo Emax ilustrativo com ED50 de 377 g (Rezende 2020), em `ato4/loadingModel.ts`.
 */

interface Override {
    step: number;
    dose: number;
    weeks: number;
}

const Readout = ({ label, value, color = C.text }: { label: string; value: string; color?: string }) => (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.07] py-1 last:border-b-0">
        <span className="text-[16px] leading-tight text-gray-300">{label}</span>
        <span className="font-mono text-[1.1rem] font-semibold leading-tight whitespace-nowrap" style={{ color }}>{value}</span>
    </div>
);

const CarnosineLoadingSim = () => {
    const { step, setStep } = useSlideSteps(LOADING_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = LOADING_STEPS[step];

    // O slider vale só no passo em que foi mexido; ao trocar de passo, volta o cenário do roteiro.
    const [override, setOverride] = useState<Override | null>(null);
    const active = override?.step === step ? override : null;
    const dose = active?.dose ?? plan.dose;
    const weeks = active?.weeks ?? plan.weeks;
    const setDose = (v: number) => setOverride({ step, dose: v, weeks });
    const setWeeks = (v: number) => setOverride({ step, dose, weeks: v });

    const shownDose = useTween(dose, reduce, 450);
    const shownWeeks = useTween(weeks, reduce, 450);

    const grams = cumulativeGrams(dose, weeks);
    const daysHobson = Math.round(daysToReach(HOBSON_G, dose));
    const toBaseline = Math.round(weeksToBaseline(dose, weeks));

    return (
        <Shell>
            <div className="flex items-center justify-between gap-4">
                <Tabs labels={LOADING_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato4-loading-tab" />
                <Tag color={C.carnoSoft}>modelo ilustrativo baseado em Rezende 2020</Tag>
            </div>
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '700px minmax(0,1fr)' }}>
                <Panel state="active" glow={C.carno} className="p-3 flex flex-col gap-2">
                    <div className="relative">
                        <LoadingChart dose={shownDose} weeks={shownWeeks} compare={plan.compare} washout={plan.washout} />
                        {plan.showYield && <YieldCard reduce={reduce} />}
                    </div>
                    <LoadingControls dose={dose} weeks={weeks} onDose={setDose} onWeeks={setWeeks} />
                    <div className="px-2"><Takeaway stepKey={step} reduce={reduce}>{plan.takeaway}</Takeaway></div>
                </Panel>
                <Panel className="p-4 flex flex-col gap-3">
                    <Narration stepKey={step} kicker={plan.kicker} title={plan.title} text={plan.text} reduce={reduce} />
                    <div className="mt-auto flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5">
                        <Readout label="% do teto do modelo" value={`${Math.round(fractionOfMax(grams) * 100)}%`} color={C.carno} />
                        <Readout label="dias até 179 g" value={`${daysHobson} dias`} color={C.lactate} />
                        {plan.washout
                            ? <Readout label="volta ao basal (modelo)" value={`~${toBaseline} sem`} color={C.co2} />
                            : <Readout label="vira carnosina (~3%)" value={`~${br(grams * INCORPORATION, 0)} g`} />}
                        <Readout label="dose acumulada" value={`${Math.round(grams)} g`} />
                    </div>
                </Panel>
            </div>
        </Shell>
    );
};

export default CarnosineLoadingSim;
