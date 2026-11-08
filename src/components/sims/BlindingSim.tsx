import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { BLIND_STEPS, type BlindVisual } from './ato6/blindingContent';
import { BodyVisual, FormulationVisual, MimicVisual, ShareVisual } from './ato6/BlindingVisuals';
import { StoryLayout } from './ato6/StoryLayout';
import { SimFrame } from './ato6/ui';

/**
 * "O Placebo que Denuncia" (Ato VI). O cegamento depende da formulação (cápsula × solução), o corpo
 * denuncia o grupo (parestesia, GI), um placebo que imita o desconforto rende efeito sozinho, e
 * cerca de um quarto do efeito dos tamponantes é expectativa.
 */

const VISUALS: Record<BlindVisual, () => React.JSX.Element> = {
    formulation: FormulationVisual,
    body: BodyVisual,
    mimic: MimicVisual,
    share: ShareVisual,
};

const BlindingSim = () => {
    const { step, setStep } = useSlideSteps(BLIND_STEPS.length);
    const plan = BLIND_STEPS[step];
    const Visual = VISUALS[plan.visual];
    const belief = plan.visual === 'mimic' || plan.visual === 'share';

    return (
        <SimFrame tabs={BLIND_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-blind-tab">
            <StoryLayout step={step} headline={plan.headline} text={plan.text} source={plan.source}
                tone={belief ? C.lactate : C.base} headlineColor={belief ? C.lactate : C.baseSoft}>
                <Visual />
            </StoryLayout>
        </SimFrame>
    );
};

export default BlindingSim;
