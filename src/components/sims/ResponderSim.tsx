import { useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { br } from './kit/format';
import { useTween } from './kit/useTween';
import { normalMatrix } from './ato6/random';
import { sd } from './ato6/stats';
import { Cascades, FourTrials } from './ato6/ResponderVisuals';
import { ATHLETES, NOISE_OPTIONS, RESP_SEED, RESPONDER_CUT, RESPONDER_STEPS, TRUE_EFFECT } from './ato6/responderContent';
import { BigStat, Narration, Segmented, SimChip, SimFrame, Src } from './ato6/ui';

/**
 * "Respondedor ou Ruído?" (Ato VI). Vinte atletas com o MESMO efeito verdadeiro (+2%) medidos com
 * ruído: "respondedores" e "não respondedores" aparecem do nada — e o grupo placebo mostra a mesma
 * dispersão. Depois, Froio 2015: o mesmo atleta, 4 vezes, não se repete.
 */

const [Z_SUPP, Z_CTRL] = normalMatrix(RESP_SEED, 2, ATHLETES);

/** Mudanças observadas, já ordenadas pelo valor final; `mix` leva da verdade (0) ao medido (1). */
const cascade = (z: readonly number[], effect: number, cv: number, mix: number): number[] =>
    z.map(v => Math.SQRT2 * cv * v).sort((a, b) => a - b).map(noise => effect + mix * noise);

interface Override { step: number; cv: number }

const ResponderSim = () => {
    const { step, setStep } = useSlideSteps(RESPONDER_STEPS.length);
    const plan = RESPONDER_STEPS[step];
    const reduce = useReducedMotion() ?? false;
    const [override, setOverride] = useState<Override | null>(null);
    const cv = override?.step === step ? override.cv : 3;
    const mix = useTween(plan.noise, reduce, 1100);
    const last = step === RESPONDER_STEPS.length - 1;

    const supplement = useMemo(() => cascade(Z_SUPP, TRUE_EFFECT, cv, mix), [cv, mix]);
    const control = useMemo(() => cascade(Z_CTRL, 0, cv, mix), [cv, mix]);
    const measured = mix > 0.98;
    const finalSupp = cascade(Z_SUPP, TRUE_EFFECT, cv, 1);
    const finalCtrl = cascade(Z_CTRL, 0, cv, 1);
    const sdSupp = sd(finalSupp);
    const sdCtrl = sd(finalCtrl);
    const sdTrue = Math.sqrt(Math.max(sdSupp ** 2 - sdCtrl ** 2, 0));
    const responders = (xs: readonly number[]) => xs.filter(v => v > RESPONDER_CUT).length;
    const nonResponders = (xs: readonly number[]) => xs.filter(v => v <= 0).length;

    return (
        <SimFrame tabs={RESPONDER_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-resp-tab"
            chips={last ? null : <SimChip />}>
            <div className="h-full flex gap-3">
                <Panel className="shrink-0" state="active" glow={last ? C.base : plan.showControl ? C.ok : C.base}>
                    {last ? <FourTrials /> : <Cascades supplement={supplement} control={plan.showControl ? control : null} colored={measured} />}
                </Panel>
                <Panel className="flex-1 min-w-0 p-5 flex flex-col gap-3">
                    <Narration stepKey={step} headline={plan.headline} text={plan.text} />
                    {!last && step > 0 && (
                        <div className="flex gap-5 pt-1">
                            {plan.showControl ? (
                                <>
                                    <BigStat value={`${br(sdSupp, 1)} × ${br(sdCtrl, 1)}`} label="DP das mudanças: suplemento × placebo (%)" size={32} />
                                    <BigStat value={`${br(sdTrue, 1)}%`} label="DP da resposta verdadeira" color={C.base} size={32} />
                                </>
                            ) : (
                                <>
                                    <BigStat value={`${responders(finalSupp)}`} label={'"respondedores"'} color={C.ok} />
                                    <BigStat value={`${nonResponders(finalSupp)}`} label={'"não respondedores"'} color={C.risk} />
                                </>
                            )}
                        </div>
                    )}
                    {last && (
                        <ul className="flex flex-col gap-2 text-[16px] leading-snug text-gray-100 list-disc pl-5">
                            <li>Rótulo instável: em treino, só 11 de 20 ficaram na mesma categoria em todos os métodos (2018).</li>
                            <li>Nem o pico do bicarbonato se repete: Tmax médio de 169, 127 e 159 min no mesmo grupo (2020).</li>
                        </ul>
                    )}
                    {plan.showControl && !last && (
                        <Src>No placebo, {responders(finalCtrl)} "respondedores" com efeito real zero.</Src>
                    )}
                    <div className="mt-auto flex flex-col gap-2">
                        {!last && step > 0 && (
                            <Segmented label="CV do teste" options={NOISE_OPTIONS} value={cv} onChange={v => setOverride({ step, cv: v })} />
                        )}
                        <Src>{plan.source}</Src>
                    </div>
                </Panel>
            </div>
        </SimFrame>
    );
};

export default ResponderSim;
