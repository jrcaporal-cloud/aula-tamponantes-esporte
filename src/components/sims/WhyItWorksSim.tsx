import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { HYPOTHESES, WHY_STEPS } from './ato2/whyItWorks.content';
import { MEM_H, MEM_W, MembraneScene } from './ato2/MembraneScene';
import { SimShell, StepText, Tag } from './ato2/ui';
import { useStepOverride } from './ato2/useStepOverride';

/**
 * Slide 29 — "Então por que Tamponar Funciona?". A membrana em corte: o bicarbonato fica fora,
 * o gradiente puxa H⁺ e lactato pelo MCT, a glicólise acelera, o K⁺ cai e a acidose atrasa.
 * O botão alterna controle × alcalose em qualquer passo. Último passo: mapa das hipóteses.
 */

const HypothesisMap = () => (
    <div className="flex h-full flex-col gap-2 p-5" style={{ width: MEM_W, height: MEM_H }}>
        <div className="grid grid-cols-[1.25fr_1fr_1fr] gap-3 border-b border-white/15 pb-2 text-[15px] font-semibold">
            <span className="text-gray-300">hipótese</span>
            <span style={{ color: C.ok }}>prova humana</span>
            <span className="text-amber-200">animal / in vitro</span>
        </div>
        {HYPOTHESES.map((h, i) => (
            <motion.div key={h.id} className="grid grid-cols-[1.25fr_1fr_1fr] gap-3 border-b border-white/5 py-2 text-[15px] leading-snug"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.12 }}>
                <span className="font-semibold text-white">{h.label}</span>
                <span className="text-gray-100">{h.human}</span>
                <span className="text-gray-300">{h.other}</span>
            </motion.div>
        ))}
        <p className="mt-auto text-[15px] leading-snug text-gray-300">Peso relativo de cada mecanismo: incerto. Fonte: mapa do dossiê 03 (Cairns 2006; Hostrup 2017).</p>
    </div>
);

const WhyItWorksSim = () => {
    const { step, setStep } = useSlideSteps(WHY_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = WHY_STEPS[step];
    const [alkalosis, setAlkalosis] = useStepOverride(step, true);
    const summary = step === WHY_STEPS.length - 1;

    return (
        <SimShell tabs={WHY_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="why-tabs"
            chips={<Tag kind="ilustrativo">partículas ilustrativas</Tag>}>
            <Panel className="shrink-0" glow={C.base}>
                {summary ? <HypothesisMap /> : (
                    <MembraneScene alkalosis={alkalosis} showEfflux={step >= 1} showK={step === 2} reduce={reduce} />
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
                <motion.ul key={step} className="mt-auto flex flex-col gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
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
