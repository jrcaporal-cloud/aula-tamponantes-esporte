import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { BICARB_CARD } from './ato7/cardBicarb';
import { CardSheet, FieldDetail } from './ato7/PrescriptionParts';
import { Chip, Shell } from './ato7/ui';

/**
 * Slide 100 — O Cartão do Bicarbonato. Cada passo escreve uma linha do cartão (para quem, dose, horário,
 * forma, várias provas, cuidados) e abre ao lado o que ISSN, AIS e COI dizem, com régua ou números, selo e fonte.
 */
const BicarbCardSim = () => {
    const { step, setStep } = useSlideSteps(BICARB_CARD.fields.length);
    const field = BICARB_CARD.fields[step];

    return (
        <Shell tabs={BICARB_CARD.fields.map(f => f.tab)} step={step} setStep={setStep} layoutId="bicarb-card-tabs"
            chips={<Chip color={C.co2}>orientação geral, não receita</Chip>}>
            <Panel className="w-[430px] shrink-0 p-4">
                <CardSheet card={BICARB_CARD} step={step} onSelect={setStep} />
            </Panel>
            <Panel className="min-w-0 flex-1 px-5 py-4" state="active" glow={C.base}>
                <FieldDetail field={field} color={C.base} id={step} />
            </Panel>
        </Shell>
    );
};

export default BicarbCardSim;
