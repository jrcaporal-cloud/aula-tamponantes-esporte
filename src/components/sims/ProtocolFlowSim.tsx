import { motion } from 'framer-motion';
import { ChevronRight, CornerDownRight } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { FLOW } from './ato7/protocol';
import { Chip, FadeSwap, Shell, Source } from './ato7/ui';

/**
 * Slide 95 — Testar no Treino Antes da Prova. Fluxograma que acende um nó por passo:
 * janela → contraindicação → regras → teste no treino → registro → decisão. As três primeiras perguntas têm saída.
 */

const Node = ({ i, step, onSelect }: { i: number; step: number; onSelect: (i: number) => void }) => {
    const n = FLOW[i];
    const lit = i <= step;
    const active = i === step;
    return (
        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-2">
            <button type="button" onClick={() => onSelect(i)}
                className="flex h-[108px] cursor-pointer flex-col justify-center gap-1 rounded-2xl border px-3 text-left transition-all duration-500"
                style={{
                    borderColor: active ? C.base : lit ? `${C.base}77` : 'rgba(255,255,255,0.12)',
                    background: active ? 'rgba(14,116,144,0.38)' : lit ? 'rgba(14,116,144,0.16)' : 'rgba(255,255,255,0.02)',
                    boxShadow: active ? `0 0 26px -6px ${C.base}` : 'none',
                    opacity: lit ? 1 : 0.5,
                }}>
                <span className="font-mono text-[15px]" style={{ color: lit ? C.baseSoft : '#9CA3AF' }}>{i + 1}</span>
                <span className="font-display text-[18px] font-semibold leading-tight text-white">{n.q}</span>
                <span className="text-[15px] leading-tight text-gray-300">{n.short}</span>
            </button>
            <div className="h-[34px]">
                {n.exit && (
                    <motion.span className="flex items-center gap-1 rounded-lg border px-2 py-1 text-[15px] font-semibold leading-tight"
                        style={{ borderColor: `${C.risk}88`, color: C.risk, background: `${C.risk}12` }}
                        initial={false} animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : -6 }} transition={{ duration: 0.4 }}>
                        <CornerDownRight size={15} aria-hidden className="shrink-0" /> {n.exit}
                    </motion.span>
                )}
            </div>
        </div>
    );
};

const ProtocolFlowSim = () => {
    const { step, setStep } = useSlideSteps(FLOW.length);
    const n = FLOW[step];

    return (
        <Shell tabs={FLOW.map(f => f.tab)} step={step} setStep={setStep} layoutId="flow-tabs"
            chips={<Chip color={C.co2}>fluxo de raciocínio, não receita</Chip>}>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start">
                    {FLOW.map((f, i) => (
                        <div key={f.id} className="flex min-w-0 flex-1 items-start">
                            <Node i={i} step={step} onSelect={setStep} />
                            {i < FLOW.length - 1 && (
                                <ChevronRight size={22} className="mt-[41px] shrink-0 transition-colors duration-500" aria-hidden
                                    color={i < step ? C.base : 'rgba(255,255,255,0.25)'} />
                            )}
                        </div>
                    ))}
                </div>
                <Panel className="min-h-0 flex-1 px-6 py-5" state="active">
                    <FadeSwap id={step} className="flex h-full gap-8">
                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <p className="m-0 font-mono text-[15px] uppercase tracking-wider text-cyan-200">Passo {step + 1} de {FLOW.length}</p>
                            <p className="m-0 font-display text-[28px] font-semibold leading-tight text-white">{n.q}</p>
                            <p className="m-0 text-[20px] leading-snug text-gray-100">{n.detail}</p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                {n.chips.map((c, i) => (
                                    <motion.span key={c} className="rounded-lg border px-3 py-1.5 text-[17px] font-semibold text-gray-100"
                                        style={{ borderColor: `${C.base}66`, background: `${C.base}12` }}
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
                                        {c}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-[400px] shrink-0 flex-col gap-3 border-l border-white/10 pl-6">
                            <ul className="m-0 flex list-none flex-col gap-2 p-0">
                                {n.points.map(p => (
                                    <li key={p} className="flex gap-2 text-[18px] leading-snug text-gray-200">
                                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.base }} />{p}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto"><Source>{n.source}</Source></div>
                        </div>
                    </FadeSwap>
                </Panel>
            </div>
        </Shell>
    );
};

export default ProtocolFlowSim;
