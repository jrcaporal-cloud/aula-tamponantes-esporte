import { useSlideSteps } from '../../store/useSlideSteps';
import { Board, CaseHero, EvidenceColumn, TrapsColumn, VerdictColumn } from './ato7/CaseParts';
import { CASES, CASE_STEP_COUNT, CASE_TABS } from './ato7/cases';
import { Chip, FadeSwap, Fictional, Shell } from './ato7/ui';

/**
 * Slide 94 — Quatro Casos, Quatro Vereditos. Dois passos por personagem (fictícios):
 * ficha (pictograma do esporte + régua do esforço contra a janela do tampão) + evidência + armadilhas com o
 * veredito trancado → o carimbo cai. Último passo: o quadro dos quatro, cada um com a sua régua e o seu carimbo.
 */
const CaseVerdictSim = () => {
    const { step, setStep } = useSlideSteps(CASE_STEP_COUNT);
    const caseIndex = Math.floor(step / 2);
    const isBoard = caseIndex >= CASES.length;
    const c = CASES[Math.min(caseIndex, CASES.length - 1)];
    const open = step % 2 === 1;

    return (
        <Shell tabs={CASE_TABS} step={caseIndex} setStep={i => setStep(i * 2)} layoutId="case-tabs" chips={<><Chip color="#94A3B8">raciocínio, não receita</Chip><Fictional /></>}>
            {isBoard ? (
                <FadeSwap id="board" className="flex min-w-0 flex-1"><Board cases={CASES} /></FadeSwap>
            ) : (
                <FadeSwap id={c.id} className="flex min-w-0 flex-1 flex-col gap-3">
                    <CaseHero c={c} open={open} />
                    <div className="flex min-h-0 flex-1 gap-3">
                        <EvidenceColumn c={c} />
                        <TrapsColumn c={c} />
                        <VerdictColumn c={c} open={open} />
                    </div>
                </FadeSwap>
            )}
        </Shell>
    );
};

export default CaseVerdictSim;
