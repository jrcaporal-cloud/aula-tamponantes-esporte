import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { DESIGN_STEPS, type DesignVisual } from './ato6/designContent';
import { CrossoverDiagram, LearningCurve, PriceBars, WashoutCurve } from './ato6/DesignVisuals';
import { IllustrativeChip, SimFrame } from './ato6/ui';
import { StoryLayout } from './ato6/StoryLayout';

/**
 * "Cruzado ou Paralelo?" (Ato VI). O bicarbonato vem e vai no mesmo dia e permite o cruzado
 * (com familiarização); a carnosina é um estoque que leva até 15 semanas para esvaziar e
 * exige o paralelo — que custa muito mais atletas.
 */

const VISUALS: Record<DesignVisual, () => React.JSX.Element> = {
    crossover: CrossoverDiagram,
    learning: LearningCurve,
    washout: WashoutCurve,
    price: PriceBars,
};

const DesignSim = () => {
    const { step, setStep } = useSlideSteps(DESIGN_STEPS.length);
    const plan = DESIGN_STEPS[step];
    const Visual = VISUALS[plan.visual];
    const carno = plan.visual === 'washout' || plan.visual === 'price';

    return (
        <SimFrame tabs={DESIGN_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-design-tab"
            chips={plan.visual === 'washout' ? <IllustrativeChip text="forma ilustrativa · marcos de Baguet 2009" /> : null}>
            <StoryLayout step={step} headline={plan.headline} text={plan.text} source={plan.source}
                tone={carno ? C.carno : C.base} headlineColor={carno ? C.carnoSoft : C.baseSoft}>
                <Visual />
            </StoryLayout>
        </SimFrame>
    );
};

export default DesignSim;
