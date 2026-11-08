import { useMemo } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { filterPublication, randomEffects, simulateArea } from './ato6/meta';
import { FOREST, FUNNEL, META_STEPS } from './ato6/metaContent';
import { CertaintyBoard, ForestPlot, FunnelPlot } from './ato6/MetaVisuals';
import { StoryLayout } from './ato6/StoryLayout';
import { SimChip, SimFrame, Tag } from './ato6/ui';

/**
 * "A Meta-análise por Dentro" (Ato VI). Estudos simulados com semente fixa: IC da média ×
 * intervalo de predição, I², funil com viés de publicação (a gaveta) e, no fim, GRADE e MBI.
 */

const forestStudies = simulateArea(FOREST.seed, FOREST.k, FOREST.mu, FOREST.tau, FOREST.seMin, FOREST.seMax);
const funnelStudies = filterPublication(FUNNEL.pubSeed,
    simulateArea(FUNNEL.seed, FUNNEL.k, FUNNEL.mu, FUNNEL.tau, FUNNEL.seMin, FUNNEL.seMax), FUNNEL.seCut, FUNNEL.luck);

const MetaInsideSim = () => {
    const { step, setStep } = useSlideSteps(META_STEPS.length);
    const plan = META_STEPS[step];
    const forest = useMemo(() => randomEffects(forestStudies), []);
    const published = useMemo(() => randomEffects(funnelStudies.filter(s => s.published)), []);
    const all = useMemo(() => randomEffects(funnelStudies), []);
    const pubCount = funnelStudies.filter(s => s.published).length;
    const warm = plan.showPi || plan.showGhosts || plan.visual === 'certainty';

    return (
        <SimFrame tabs={META_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-meta-tab"
            chips={plan.visual === 'certainty' ? <Tag color={C.text}>dados publicados</Tag> : <SimChip />}>
            <StoryLayout step={step} visualKey={plan.visual} headline={plan.headline} text={plan.text} source={plan.source}
                tone={warm ? C.lactate : C.base} headlineColor={warm ? C.lactate : C.baseSoft}
                aside={plan.visual === 'funnel'
                    ? <p className="text-[16px] text-gray-300">{plan.showGhosts ? `${FUNNEL.k} estudos feitos; ${pubCount} publicados.` : `${pubCount} estudos publicados.`}</p>
                    : null}>
                {plan.visual === 'forest' && <ForestPlot studies={forestStudies} result={forest} showPi={plan.showPi} showI2={plan.showI2} />}
                {plan.visual === 'funnel' && <FunnelPlot studies={funnelStudies} published={published} all={all} showGhosts={plan.showGhosts} />}
                {plan.visual === 'certainty' && <CertaintyBoard />}
            </StoryLayout>
        </SimFrame>
    );
};

export default MetaInsideSim;
