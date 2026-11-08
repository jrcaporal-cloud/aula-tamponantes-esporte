import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { AnchorCase, ProfileDetail, ProfileList } from './ato7/SafetyParts';
import { PROFILES, SAFETY_TABS } from './ato7/safety';
import { Chip, FadeSwap, Shell } from './ato7/ui';

/**
 * Slide 92 — Quando o Tampão Vira Problema. Passo 0: o caso de Diaconu (dose de atleta, contexto de risco).
 * Passos 1–6: cada perfil acende as luzes de bicarbonato e β-alanina, com o motivo, o nível de evidência e a fonte.
 */
const SafetySim = () => {
    const { step, setStep } = useSlideSteps(SAFETY_TABS.length);
    const profile = step > 0 ? PROFILES[step - 1] : null;

    return (
        <Shell tabs={SAFETY_TABS} step={step} setStep={setStep} layoutId="safety-tabs"
            chips={<Chip color={C.risk}>dose × contexto</Chip>}>
            <Panel className="w-[450px] shrink-0 p-4">
                <ProfileList step={step} onSelect={setStep} />
            </Panel>
            <Panel className="min-w-0 flex-1 p-5" state="active" glow={profile ? C.base : C.risk}>
                <FadeSwap id={step} className="h-full">
                    {profile ? <ProfileDetail profile={profile} /> : <AnchorCase />}
                </FadeSwap>
            </Panel>
        </Shell>
    );
};

export default SafetySim;
