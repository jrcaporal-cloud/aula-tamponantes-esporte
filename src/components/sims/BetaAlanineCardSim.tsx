import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { BETA_ALANINE_CARD } from './ato7/cardBetaAlanine';
import { CardSheet, FieldDetail } from './ato7/PrescriptionParts';
import { Chip, Shell } from './ato7/ui';

/**
 * Slide 101 — O Cartão da Beta-alanina. Cada passo escreve uma linha do cartão (para quem, dose, tempo,
 * manutenção, regra brasileira, combinação) e abre ao lado o que ISSN, AIS e COI dizem, com régua ou números, selo e fonte.
 */
const BetaAlanineCardSim = () => {
    const { step, setStep } = useSlideSteps(BETA_ALANINE_CARD.fields.length);
    const field = BETA_ALANINE_CARD.fields[step];

    return (
        <Shell tabs={BETA_ALANINE_CARD.fields.map(f => f.tab)} step={step} setStep={setStep} layoutId="ba-card-tabs"
            chips={<Chip color={C.co2}>orientação geral, não receita</Chip>}>
            <Panel className="w-[430px] shrink-0 p-4">
                <CardSheet card={BETA_ALANINE_CARD} step={step} onSelect={setStep} />
            </Panel>
            <Panel className="min-w-0 flex-1 px-5 py-4" state="active" glow={C.carno}>
                <FieldDetail field={field} color={C.carno} id={step} />
            </Panel>
        </Shell>
    );
};

export default BetaAlanineCardSim;
