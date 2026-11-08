import type { ComponentType } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { RULE_STEPS, type RuleVisual } from './ato7/rules';
import { HorseVerdict, ListScan, PotGrid, Tco2Curve, VolumeBars } from './ato7/RulesVisuals';
import { Chip, FadeSwap, Shell, StoryPanel } from './ato7/ui';

/**
 * Slide 90 — As Regras do Jogo. Liga com a aula de doping: a lista (oral é permitido) → a agulha (M2.2, volume)
 * → o "milkshake" dos cavalos e o teste de TCO₂ → a meta-análise equina de efeito zero → o risco real, a contaminação.
 */

const VISUALS: Record<RuleVisual, ComponentType> = {
    lista: ListScan,
    volume: VolumeBars,
    tco2: Tco2Curve,
    cavalos: HorseVerdict,
    pote: PotGrid,
};

const KICKER_COLOR: Record<RuleVisual, string> = {
    lista: C.ok,
    volume: C.risk,
    tco2: C.acid,
    cavalos: C.lactate,
    pote: C.acid,
};

const RulesSim = () => {
    const { step, setStep } = useSlideSteps(RULE_STEPS.length);
    const s = RULE_STEPS[step];
    const Visual = VISUALS[s.visual];

    return (
        <Shell tabs={RULE_STEPS.map(r => r.tab)} step={step} setStep={setStep} layoutId="rules-tabs"
            chips={<Chip color={C.co2}>WADA 2026 · turfe</Chip>}>
            <StoryPanel id={step} kicker={s.kicker} color={KICKER_COLOR[s.visual]} title={s.title} text={s.text}
                points={s.points} source={s.source} />
            <Panel className="min-w-0 flex-1 p-4" state="active" glow={KICKER_COLOR[s.visual]}>
                <FadeSwap id={`v-${step}`} className="h-full w-full">
                    <Visual />
                </FadeSwap>
            </Panel>
        </Shell>
    );
};

export default RulesSim;
