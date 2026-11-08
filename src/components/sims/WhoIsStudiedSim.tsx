import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { WHO_STEPS, type WhoVisual } from './ato6/whoContent';
import { TierBars, Waffle } from './ato6/WhoVisuals';
import { BicarbDots, CastVsTypical } from './ato6/WhoPictograms';
import { StoryLayout } from './ato6/StoryLayout';
import { SimFrame, Tag } from './ato6/ui';

/**
 * "Quem é Estudado?" (Ato VI). A evidência de suplementos vem, em maioria, de homens jovens de
 * nível 0–2: 23% de mulheres, ~70% níveis 0–2, 10% elite; no bicarbonato a lacuna feminina é maior.
 * Fecha nos quatro personagens da aula (casos fictícios).
 */

const VISUALS: Record<WhoVisual, () => React.JSX.Element> = {
    waffle: Waffle,
    tiers: TierBars,
    bicarb: BicarbDots,
    cast: CastVsTypical,
};

const WhoIsStudiedSim = () => {
    const { step, setStep } = useSlideSteps(WHO_STEPS.length);
    const plan = WHO_STEPS[step];
    const Visual = VISUALS[plan.visual];
    const women = plan.visual === 'waffle' || plan.visual === 'bicarb';

    return (
        <SimFrame tabs={WHO_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-who-tab"
            chips={plan.visual === 'cast' ? <Tag color={C.lactate}>casos fictícios</Tag> : null}>
            <StoryLayout step={step} headline={plan.headline} text={plan.text} source={plan.source}
                tone={women ? C.lactate : C.base} headlineColor={women ? C.lactate : C.baseSoft}>
                <Visual />
            </StoryLayout>
        </SimFrame>
    );
};

export default WhoIsStudiedSim;
