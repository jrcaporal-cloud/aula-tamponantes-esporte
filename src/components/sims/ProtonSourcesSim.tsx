import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { PROTON_STEPS, WITNESSES } from './ato2/protonSources.content';
import { AgreementPlot, AtpTestimony, LacticTestimony, StewartTestimony } from './ato2/ProtonVisuals';
import { SimShell, StepText, Tag } from './ato2/ui';

/**
 * Slide 24 — "De Onde Vem o H⁺?". Três testemunhas depõem uma por vez (passos 1–3) e, no
 * passo 4, convergem num só gráfico: H⁺ gerado × lactato, inclinação ~1 (Marcinek 2010).
 */

const TESTIMONY = [AtpTestimony, LacticTestimony, StewartTestimony] as const;

const WitnessCard = ({ index, step }: { index: number; step: number }) => {
    const w = WITNESSES[index];
    const agree = step === WITNESSES.length;
    const active = index === step || agree;
    return (
        <Panel state={active ? 'active' : step > index ? 'idle' : 'dim'} glow={agree ? C.lactate : C.acid} className="flex-1">
            <div className="flex h-full flex-col justify-center gap-1 px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="whitespace-nowrap font-mono text-[15px] text-gray-400">{index + 1} · {w.name}</span>
                    {agree && <span className="text-[15px] font-semibold text-yellow-300">concorda</span>}
                </div>
                <span className="font-display text-[1.2rem] font-semibold leading-tight text-white">{w.school}</span>
                <span className="text-[15px] leading-snug text-gray-100">{agree ? 'H⁺ e lactato sobem juntos.' : w.claim}</span>
            </div>
        </Panel>
    );
};

const ProtonSourcesSim = () => {
    const { step, setStep } = useSlideSteps(PROTON_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = PROTON_STEPS[step];
    const agree = step === WITNESSES.length;
    const Testimony = agree ? null : TESTIMONY[step];

    return (
        <SimShell tabs={PROTON_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="proton-tabs"
            chips={agree ? <><Tag kind="animal">ANIMAL · camundongo</Tag><Tag kind="ilustrativo">pontos ilustrativos</Tag></> : <Tag kind="teoria">três leituras do mesmo fenômeno</Tag>}>
            <div className="flex w-[360px] shrink-0 flex-col gap-3">
                {WITNESSES.map((w, i) => <WitnessCard key={w.id} index={i} step={step} />)}
            </div>
            <Panel className="flex min-w-0 flex-1 flex-col gap-4 p-5" glow={agree ? C.lactate : C.acid}>
                <StepText step={step} headline={plan.headline} text={plan.text} accent={agree ? C.lactate : C.acidSoft} />
                <motion.div key={step} className="mt-3 flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
                    {Testimony ? <><Testimony /><div><Tag kind={WITNESSES[step].kind}>{WITNESSES[step].kindLabel}</Tag></div></> : <AgreementPlot reduce={reduce} />}
                </motion.div>
            </Panel>
        </SimShell>
    );
};

export default ProtonSourcesSim;
