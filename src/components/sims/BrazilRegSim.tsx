import type { ComponentType } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { BRAZIL_STEPS, type BrazilVisual } from './ato7/brazil';
import { CfnZones, LabelDay, LoadRace, Shelves } from './ato7/BrazilVisuals';
import { Chip, FadeSwap, Shell, StoryPanel } from './ato7/ui';

/**
 * Slide 91 — E no Brasil? A regra brasileira chega antes da ciência:
 * rótulo da β-alanina (IN 28) → o tempo de carga no teto do rótulo → bicarbonato não é suplemento em cápsula
 * → o que a CFN 656 exige e as zonas cinzentas (sem parecer encontrado; não é orientação jurídica).
 */

const VISUALS: Record<BrazilVisual, ComponentType> = {
    rotulo: LabelDay,
    relogio: LoadRace,
    bicarbonato: Shelves,
    cfn: CfnZones,
};

const COLOR: Record<BrazilVisual, string> = {
    rotulo: C.carno,
    relogio: C.carnoSoft,
    bicarbonato: C.sodium,
    cfn: C.co2,
};

const BrazilRegSim = () => {
    const { step, setStep } = useSlideSteps(BRAZIL_STEPS.length);
    const s = BRAZIL_STEPS[step];
    const Visual = VISUALS[s.visual];

    return (
        <Shell tabs={BRAZIL_STEPS.map(b => b.tab)} step={step} setStep={setStep} layoutId="brazil-tabs"
            chips={<Chip color={C.co2}>Anvisa · CFN · consulta em 04/11/2026</Chip>}>
            <StoryPanel id={step} kicker={s.kicker} color={COLOR[s.visual]} title={s.title} text={s.text}
                points={s.points} source={s.source} />
            <Panel className="min-w-0 flex-1 p-4" state="active" glow={COLOR[s.visual]}>
                <FadeSwap id={`v-${step}`} className="h-full w-full">
                    <Visual />
                </FadeSwap>
            </Panel>
        </Shell>
    );
};

export default BrazilRegSim;
