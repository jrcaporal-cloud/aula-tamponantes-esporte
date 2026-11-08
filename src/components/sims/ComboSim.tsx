import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, StepTabs } from './kit/ui';
import { COMBO_STEPS, DASILVA_ARMS, PIECE, type Verdict } from './ato5/comboContent';
import { ComboBars } from './ato5/ComboBars';
import { SIM_HEIGHT, SourceNote, StepFade, StepText, StepTitle, Tag } from './ato5/ui';

/**
 * Slide 73 · "Alianças". Cada passo põe uma combinação na bancada: as peças isoladas, a soma que se esperaria
 * (tracejada, cálculo) e o que a combinação deu. Passos: BA + bicarbonato (meta-análise) → tatame (USP) →
 * o maior estudo (nulo) → cafeína/nitrato → o "stack" completo.
 */

const VERDICT_COLOR: Record<Verdict, string> = {
    'só a combinação passa do zero': C.ok,
    'quase soma': C.ok,
    'nulo para todos': C.muted,
    'não soma': C.acid,
    'cada um na sua tarefa': C.lactate,
};

const ARM_COLOR = [C.co2, PIECE.ba, PIECE.bic, PIECE.combo] as const;

/** Passo 3: o maior estudo não tem barras para mostrar — quatro grupos, nenhuma melhora. */
const NullArms = () => {
    const reduce = useReducedMotion();
    return (
        <div className="h-full flex flex-col justify-center gap-5">
            <div className="flex items-baseline gap-3">
                <span className="font-display text-[3.4rem] leading-none font-semibold text-white">71</span>
                <span className="text-[1.1rem] text-gray-200">ciclistas · contrarrelógio de 30 kJ</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {DASILVA_ARMS.map((arm, i) => (
                    <motion.div key={arm} className="rounded-xl border px-3 py-4 flex flex-col items-center gap-2"
                        style={{ borderColor: `${ARM_COLOR[i]}88`, background: `${ARM_COLOR[i]}12` }}
                        initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.12 }}>
                        <span className="text-[1.05rem] font-semibold text-white text-center leading-tight">{arm}</span>
                        <span className="font-mono text-[16px]" style={{ color: C.muted }}>sem melhora</span>
                    </motion.div>
                ))}
            </div>
            <p className="text-[16px] leading-snug text-gray-300">Combinação × placebo: p = 0,06. O maior estudo é o que mais pesa — e foi nulo.</p>
        </div>
    );
};

const ComboSim = () => {
    const { step, setStep } = useSlideSteps(COMBO_STEPS.length);
    const info = COMBO_STEPS[step];
    const color = VERDICT_COLOR[info.verdict];
    const hasSum = info.panels.some(p => p.rows.some(r => r.parts));

    return (
        <div className="not-prose w-full font-body text-white select-none flex flex-col gap-3" style={{ height: SIM_HEIGHT }}>
            <StepTabs labels={COMBO_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato5-combo-tab" />
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '660px minmax(0,1fr)' }}>
                <Panel className="p-5 flex flex-col gap-3">
                    <StepFade stepKey={step} className="flex-1 min-h-0 flex flex-col gap-4">
                        {info.panels.length === 0 ? <NullArms /> : info.panels.map(p => (
                            <ComboBars key={p.heading} panel={p} rowH={info.panels.length > 1 ? 38 : 62} />
                        ))}
                    </StepFade>
                    {hasSum && <Tag color={C.lactate}>“se somasse” = soma dos isolados (cálculo)</Tag>}
                </Panel>
                <Panel state="active" glow={color} className="p-5 flex flex-col gap-3">
                    <StepFade stepKey={step} className="flex flex-col gap-3">
                        <StepTitle>{info.title}</StepTitle>
                        <StepText>{info.text}</StepText>
                        <span className="self-start rounded-lg border-2 px-3 py-1 font-display text-[1.2rem] font-semibold uppercase tracking-wide"
                            style={{ color, borderColor: color }}>{info.verdict}</span>
                        <p className="text-[16px] leading-snug text-gray-300">{info.caveat}</p>
                    </StepFade>
                    <div className="mt-auto">
                        <SourceNote>{info.source}</SourceNote>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default ComboSim;
