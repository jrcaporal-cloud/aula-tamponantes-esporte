import { useSlideSteps } from '../../store/useSlideSteps';
import { Board, EvidenceColumn, ProfileColumn, VerdictColumn } from './ato7/CaseParts';
import { CASES, CASE_STEP_COUNT, CASE_TABS } from './ato7/cases';
import { FadeSwap, Fictional, Shell } from './ato7/ui';

/**
 * Slide 94 — Quatro Casos, Quatro Vereditos. Dois passos por personagem (fictícios):
 * ficha + evidência + armadilhas com o veredito trancado → veredito aberto. Último passo: o quadro dos quatro.
 */
const CaseVerdictSim = () => {
    const { step, setStep } = useSlideSteps(CASE_STEP_COUNT);
    const caseIndex = Math.floor(step / 2);
    const isBoard = caseIndex >= CASES.length;
    const c = CASES[Math.min(caseIndex, CASES.length - 1)];
    const open = step % 2 === 1;

    return (
        <Shell tabs={CASE_TABS} step={caseIndex} setStep={i => setStep(i * 2)} layoutId="case-tabs" chips={<Fictional />}>
            {isBoard ? (
                <FadeSwap id="board" className="flex min-w-0 flex-1"><Board cases={CASES} /></FadeSwap>
            ) : (
                <FadeSwap id={c.id} className="flex min-w-0 flex-1 gap-3">
                    <ProfileColumn c={c} />
                    <EvidenceColumn c={c} />
                    <VerdictColumn c={c} open={open} />
                </FadeSwap>
            )}
        </Shell>
    );
};

export default CaseVerdictSim;
