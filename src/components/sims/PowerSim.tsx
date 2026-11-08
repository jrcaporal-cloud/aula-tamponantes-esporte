import { useMemo, useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { br, signed } from './kit/format';
import { normalMatrix } from './ato6/random';
import { crossoverDiffs, crossoverStudy, mean } from './ato6/stats';
import { BigStat, Narration, Segmented, SimChip, SimFrame, Src, Tag } from './ato6/ui';
import { useRunCounter } from './ato6/useRunCounter';
import { PowerPlot } from './ato6/PowerPlot';
import { CV_OPTIONS, EFFECT, MAX_N, N_OPTIONS, POWER_STEPS, SEED, STUDIES } from './ato6/powerContent';

/**
 * "Onze Atletas e um Sussurro" (Ato VI). Simulação real e determinística: 400 estudos cruzados
 * com o mesmo efeito verdadeiro (+1%), CV e n escolhíveis. Pinta os que deram p < 0,05 e mostra
 * que os significativos superestimam o efeito (maldição do vencedor).
 */

// As normais são sorteadas uma vez: mudar CV ou n reescala os mesmos atletas.
const Z = normalMatrix(SEED, STUDIES, MAX_N);

interface Override { step: number; cv: number; n: number }

const PowerSim = () => {
    const { step, setStep } = useSlideSteps(POWER_STEPS.length);
    const plan = POWER_STEPS[step];
    const [override, setOverride] = useState<Override | null>(null);
    // O passador aplica o cenário do passo; o clique só vale dentro do passo em que foi feito.
    const cv = override?.step === step ? override.cv : plan.cv;
    const n = override?.step === step ? override.n : plan.n;

    const studies = useMemo(() => Z.map(z => crossoverStudy(z, n, cv, EFFECT)), [cv, n]);
    const diffs = useMemo(() => crossoverDiffs(Z[0], n, cv, EFFECT), [cv, n]);
    const winners = studies.filter(s => s.winner);
    const power = winners.length / STUDIES;
    const winnersMean = winners.length ? mean(winners.map(s => s.observed)) : null;

    const shown = useRunCounter(plan.showHist ? `${cv}-${n}` : 'off', plan.showHist ? STUDIES : 0);
    const visible = studies.slice(0, shown);
    const done = shown >= STUDIES;

    return (
        <SimFrame tabs={POWER_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-power-tab"
            chips={<><Tag color={C.base}>efeito real: +1%</Tag><SimChip /></>}>
            <div className="h-full flex gap-3">
                <Panel className="shrink-0" state="idle">
                    <PowerPlot n={n} effect={EFFECT} diffs={diffs} first={studies[0]} studies={visible}
                        showHist={plan.showHist} highlight={plan.highlight && done} winnersMean={winnersMean} />
                </Panel>
                <Panel className="flex-1 min-w-0 p-4 flex flex-col gap-3">
                    <Narration stepKey={step} headline={plan.headline} text={plan.text}
                        color={plan.highlight ? C.lactate : C.baseSoft} />
                    <div className="flex gap-5 pt-1" style={{ opacity: plan.highlight ? 1 : 0, transition: 'opacity 400ms' }}>
                        <BigStat value={`${br(power * 100, 0)}%`} label="dos estudos com p < 0,05 (poder)" color={C.lactate} />
                        <BigStat value={winnersMean === null ? '—' : `${signed(winnersMean, 1)}%`} label="efeito que os significativos relatam" />
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                        <Segmented label="CV do teste" options={CV_OPTIONS} value={cv}
                            onChange={v => setOverride({ step, cv: v, n })} />
                        <Segmented label="atletas (n)" options={N_OPTIONS} value={n}
                            onChange={v => setOverride({ step, cv, n: v })} />
                        <Src>{plan.source}</Src>
                    </div>
                </Panel>
            </div>
        </SimFrame>
    );
};

export default PowerSim;
