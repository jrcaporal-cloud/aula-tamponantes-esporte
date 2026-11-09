import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../lib/motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { WHY_STEPS } from './ato2/whyItWorks.content';
import { MembraneScene, type MembraneStage } from './ato2/MembraneScene';
import { AcidosisChart } from './ato2/whyItWorksAcidosis';
import { MechanismMap } from './ato2/whyItWorksMap';
import { SimShell, StepText, Tag } from './ato2/ui';
import { useStepOverride } from './ato2/useStepOverride';

/**
 * Slide 15 — "Então por que Tamponar Funciona?". Passos 1–3: a membrana em corte (bicarbonato barrado
 * fora; gradiente e efluxo; glicólise e K⁺). Passo 4: pH da fibra no exercício progressivo, acidose
 * adiada. Passo 5: a fibra com os cinco mecanismos acendendo. O botão alterna controle × alcalose.
 */

const CHIP = ['partículas ilustrativas', 'partículas ilustrativas', 'partículas ilustrativas', 'curvas ilustrativas', 'mapa do dossiê 03'] as const;

const WhyItWorksSim = () => {
    const { step, setStep } = useSlideSteps(WHY_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = WHY_STEPS[step];
    const [alkalosis, setAlkalosis] = useStepOverride(step, true);
    const summary = step === WHY_STEPS.length - 1;

    return (
        <SimShell tabs={WHY_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="why-tabs"
            chips={<Tag kind="ilustrativo">{CHIP[step]}</Tag>}>
            <Panel className="shrink-0" glow={C.base}>
                {summary ? <MechanismMap reduce={reduce} /> : step === 3 ? <AcidosisChart alkalosis={alkalosis} reduce={reduce} /> : (
                    <MembraneScene alkalosis={alkalosis} stage={step as MembraneStage} reduce={reduce} />
                )}
            </Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                {!summary && (
                    <div className="flex items-center gap-1 self-start rounded-xl border border-white/10 p-1" role="group" aria-label="Condição">
                        {[{ v: false, label: 'controle' }, { v: true, label: 'alcalose' }].map(o => (
                            <button key={o.label} type="button" onClick={() => setAlkalosis(o.v)} aria-pressed={alkalosis === o.v}
                                className="cursor-pointer rounded-lg px-3 py-1 text-[15px] font-semibold transition-colors"
                                style={{ background: alkalosis === o.v ? 'rgba(14,116,144,0.55)' : 'transparent', color: alkalosis === o.v ? '#fff' : '#D1D5DB' }}>
                                {o.label}
                            </button>
                        ))}
                    </div>
                )}
                <StepText step={step} headline={plan.headline} text={plan.text} accent={C.baseSoft} />
                <motion.ul key={step} className="mt-auto flex flex-col gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text, ease: EASE_OUT }}>
                    {plan.facts.map(f => (
                        <li key={f.text} className="text-[15px] leading-snug text-gray-100">
                            {f.text}{' '}<Tag kind={f.kind}>{`${f.kind.toUpperCase()} · ${f.label}`}</Tag>
                        </li>
                    ))}
                </motion.ul>
            </Panel>
        </SimShell>
    );
};

export default WhyItWorksSim;
