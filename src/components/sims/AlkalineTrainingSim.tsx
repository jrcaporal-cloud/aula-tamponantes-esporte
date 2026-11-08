import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, StepTabs } from './kit/ui';
import { ALKALINE_STEPS, CONTRASTS, CONTRAST_NOTE, HYPOTHESIS, PAINELLI, STUDIES } from './ato5/alkalineContent';
import { StudyCard } from './ato5/StudyCard';
import { SIM_HEIGHT, SourceNote, StepFade, StepText } from './ato5/ui';

/**
 * Slide 74 · "Treinar alcalino?". Mulheres ativas (Edge 2006) × remadores de elite (Driller 2013), lado a lado.
 * Passos: a hipótese → mulheres ativas → remadores → por que a diferença → o treino como primeiro tampão (Painelli 2018).
 */

const Legend = () => (
    <div className="flex items-center gap-4 text-[16px] text-gray-300">
        <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded" style={{ background: C.base }} /> bicarbonato no treino</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded" style={{ background: C.co2 }} /> placebo</span>
    </div>
);

const Hypothesis = () => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
            {HYPOTHESIS.chain.map((c, i) => (
                <span key={c} className="flex items-center gap-2">
                    <span className="rounded-lg border px-3 py-1 text-[1.05rem] font-semibold"
                        style={{ borderColor: `${i === 2 ? C.lactate : C.base}88`, color: i === 2 ? C.lactate : '#fff' }}>{c}</span>
                    {i < HYPOTHESIS.chain.length - 1 && <span className="text-[1.2rem] text-gray-400">→</span>}
                </span>
            ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
            {HYPOTHESIS.clues.map(c => (
                <p key={c.who} className="text-[16px] leading-snug text-gray-200">
                    <span className="font-semibold text-white">{c.who}:</span> {c.text}
                </p>
            ))}
        </div>
    </div>
);

const Contrasts = () => (
    <div className="grid gap-x-6 gap-y-0.5 items-center" style={{ gridTemplateColumns: 'auto 1fr 1fr 1.6fr' }}>
        <span />
        <span className="text-[16px] text-gray-300">mulheres ativas</span>
        <span className="text-[16px] text-gray-300">remadores de elite</span>
        <p className="row-span-4 text-[16px] leading-snug text-gray-200">{CONTRAST_NOTE}</p>
        {CONTRASTS.map(c => (
            <div key={c.label} className="contents">
                <span className="text-[16px] text-gray-300">{c.label}</span>
                <span className="text-[17px] leading-tight font-semibold text-white">{c.a}</span>
                <span className="text-[17px] leading-tight font-semibold text-white">{c.b}</span>
            </div>
        ))}
    </div>
);

const Painelli = () => (
    <div className="grid items-center gap-6" style={{ gridTemplateColumns: 'auto minmax(0,1fr)' }}>
        <div className="flex items-baseline gap-3">
            <span className="font-display text-[2rem] font-semibold text-gray-300">{PAINELLI.from}</span>
            <span className="text-[1.4rem] text-gray-400">→</span>
            <span className="font-display text-[2.4rem] font-semibold" style={{ color: C.carno }}>{PAINELLI.to}</span>
            <span className="font-display text-[1.6rem] font-semibold" style={{ color: C.carno }}>{PAINELLI.delta}</span>
        </div>
        <StepText>{PAINELLI.text} O primeiro tampão é o treino; treinar alcalino segue como hipótese.</StepText>
    </div>
);

const STRIP_SOURCE = [
    'Bishop 2010, Am J Physiol (ratos) · Percival 2015, J Appl Physiol',
    STUDIES[0].source,
    STUDIES[1].source,
    'Edge 2006 · Driller 2013',
    PAINELLI.source,
];

const Strip = ({ step }: { step: number }) => {
    if (step === 0) return <Hypothesis />;
    if (step === 1 || step === 2) {
        const s = STUDIES[step - 1];
        return <p className="font-display text-[1.6rem] font-semibold leading-tight text-white">{s.takeaway}</p>;
    }
    if (step === 3) return <Contrasts />;
    return <Painelli />;
};

const AlkalineTrainingSim = () => {
    const { step, setStep } = useSlideSteps(ALKALINE_STEPS.length);
    const info = ALKALINE_STEPS[step];

    return (
        <div className="not-prose w-full font-body text-white select-none flex flex-col gap-3" style={{ height: SIM_HEIGHT }}>
            <div className="flex items-center justify-between">
                <StepTabs labels={ALKALINE_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato5-alkaline-tab" />
                <Legend />
            </div>
            <div className="grid grid-cols-2 gap-3" style={{ height: 268 }}>
                {STUDIES.map(s => (
                    <StudyCard key={s.id} study={s} active={info.focus.includes(s.id)} revealed={info.revealed.includes(s.id)} />
                ))}
            </div>
            <Panel state="active" glow={step === 4 ? C.carno : C.base} className="flex-1 min-h-0 px-5 py-4 flex flex-col gap-2">
                <StepFade stepKey={step} className="flex-1 min-h-0">
                    <Strip step={step} />
                </StepFade>
                <SourceNote>{STRIP_SOURCE[step]}</SourceNote>
            </Panel>
        </div>
    );
};

export default AlkalineTrainingSim;
