import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { EffortBoard, VerdictList } from './ato7/WhoTakesParts';
import { WHO_STEPS, WHO_TABS } from './ato7/whoTakes';
import { Fictional, Shell, StoryPanel } from './ato7/ui';

/**
 * Slide 102 — Quem Leva o Quê. Quadro por tipo de esforço com as luzes do bicarbonato e da β-alanina;
 * depois os quatro personagens caem nas linhas (três na verde) e, no fim, cada um ganha a luz da própria decisão.
 */
const WhoTakesWhatSim = () => {
    const { step, setStep } = useSlideSteps(WHO_TABS.length);
    const story = WHO_STEPS[step];

    return (
        <Shell tabs={WHO_TABS} step={step} setStep={setStep} layoutId="who-tabs" chips={step >= 1 ? <Fictional /> : null}>
            <Panel className="min-w-0 flex-1 p-4" state="active" glow={C.ok}>
                <EffortBoard step={step} />
            </Panel>
            {story ? (
                <StoryPanel id={step} kicker={story.kicker} color={C.ok} title={story.title} text={story.text}
                    points={story.points} source={story.source} width={360} />
            ) : (
                <Panel className="w-[360px] shrink-0 p-4">
                    <VerdictList />
                </Panel>
            )}
        </Shell>
    );
};

export default WhoTakesWhatSim;
