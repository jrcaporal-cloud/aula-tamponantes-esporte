import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { ForestChart } from './ato3/ForestChart';
import { ForestSide } from './ato3/ForestSide';
import { FOREST_ROWS, FOREST_STEPS } from './ato3/forest';
import { Frame, Tag } from './ato3/Frame';
import { C } from './kit/palette';

/**
 * Slide 43 — "O que Dizem 189 Estudos". Forest plot de estimativas agrupadas, revelado por passo:
 * geral → por duração → força × resistência → combate → certeza da evidência (GRADE).
 */

const TABS = FOREST_STEPS.map(s => s.tab);

const BicarbForestSim = () => {
    const { step, setStep } = useSlideSteps(FOREST_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const info = FOREST_STEPS[step];

    return (
        <Frame tabs={TABS} step={step} setStep={setStep} layoutId="forest-tab" foot={info.foot}
            chips={<Tag color={C.base}>6 meta-análises · IC95</Tag>}>
            <div className="h-full grid gap-4" style={{ gridTemplateColumns: '790px 1fr' }}>
                <ForestChart rows={FOREST_ROWS} shown={info.shown} focus={info.focus} showCertainty={step === 4} reduce={reduce} />
                <ForestSide step={step} />
            </div>
        </Frame>
    );
};

export default BicarbForestSim;
