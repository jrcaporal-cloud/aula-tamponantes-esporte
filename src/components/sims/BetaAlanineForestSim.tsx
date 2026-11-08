import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { FOREST_STEPS } from './ato4/forestContent';
import { DurationStrip, ForestPlot, OutsideFacts } from './ato4/ForestPlot';
import { Narration, Shell, Takeaway } from './ato4/shell';
import { Tabs, Tag } from './ato4/ui';

/**
 * Slide 65 "O que Dizem 40 Ensaios". O forest plot cresce a cada passo: efeito global → capacidade × desempenho
 * (bem separados) → sprints repetidos e a faixa de duração → força e composição corporal (outras métricas, fora do forest).
 */

const BetaAlanineForestSim = () => {
    const { step, setStep } = useSlideSteps(FOREST_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = FOREST_STEPS[step];

    return (
        <Shell>
            <div className="flex items-center justify-between gap-4">
                <Tabs labels={FOREST_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato4-forest-tab" />
                <Tag color={C.carnoSoft}>estimativas publicadas</Tag>
            </div>
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '700px minmax(0,1fr)' }}>
                <Panel state="active" glow={C.carno} className="p-3 flex flex-col justify-between gap-2">
                    <ForestPlot step={step} reduce={reduce} />
                    {step === 2 && <DurationStrip />}
                    {step === 3 && <OutsideFacts />}
                </Panel>
                <Panel className="p-4 flex flex-col gap-3">
                    <Narration stepKey={step} kicker={plan.kicker} title={plan.title} text={plan.text} reduce={reduce} />
                    <div className="mt-auto"><Takeaway stepKey={step} reduce={reduce}>{plan.takeaway}</Takeaway></div>
                </Panel>
            </div>
        </Shell>
    );
};

export default BetaAlanineForestSim;
