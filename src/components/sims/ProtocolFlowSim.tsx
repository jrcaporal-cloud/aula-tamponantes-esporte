import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { FLOW } from './ato7/protocol';
import { ProtocolChart } from './ato7/protocolChart';
import { StepVisual } from './ato7/protocolVisuals';
import { Chip, FadeSwap, Shell, Source } from './ato7/ui';

/**
 * Slide 95 — Testar no Treino Antes da Prova. Fluxograma desenhado (losangos com saída rosa, ações, terminal)
 * que acende o caminho até o passo atual; embaixo, o texto do passo à esquerda e um mini-visual à direita:
 * régua da janela → semáforo → duas portas (WADA × Brasil) → escada do AIS + 23 remadores → prontuário → bifurcação.
 */
const ProtocolFlowSim = () => {
    const { step, setStep } = useSlideSteps(FLOW.length);
    const reduce = useReducedMotion() ?? false;
    const n = FLOW[step];

    return (
        <Shell tabs={FLOW.map(f => f.tab)} step={step} setStep={setStep} layoutId="flow-tabs"
            chips={<Chip color={C.co2}>fluxo de raciocínio, não receita</Chip>}>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <ProtocolChart step={step} onSelect={setStep} reduce={reduce} />
                <Panel className="min-h-0 flex-1 px-5 py-4" state="active">
                    <FadeSwap id={step} className="flex h-full gap-6">
                        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                            <p className="m-0 font-display text-[26px] font-semibold leading-tight text-white">
                                <span className="mr-2 font-mono text-[18px] text-cyan-300">{step + 1}</span>{n.q}
                            </p>
                            <p className="m-0 text-[18px] leading-snug text-gray-100">{n.detail}</p>
                            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                                {n.points.map(p => (
                                    <li key={p} className="flex gap-2 text-[16px] leading-snug text-gray-200">
                                        <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.base }} />{p}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto"><Source>{n.source}</Source></div>
                        </div>
                        <div className="flex w-[602px] shrink-0 items-center border-l border-white/10 pl-5">
                            <div className="h-[240px] w-[580px]"><StepVisual id={n.id} reduce={reduce} /></div>
                        </div>
                    </FadeSwap>
                </Panel>
            </div>
        </Shell>
    );
};

export default ProtocolFlowSim;
