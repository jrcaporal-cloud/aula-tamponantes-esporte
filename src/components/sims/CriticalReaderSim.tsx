import { motion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';
import { useState } from 'react';
import { Flag as FlagIcon } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { FLAGS, PAPER, VERDICT, type FlagId } from './ato6/readerContent';
import { Narration, SimFrame, Src, Tag } from './ato6/ui';

/**
 * "Leitor Crítico" (Ato VI). Um resumo FICTÍCIO de ensaio com bicarbonato em lutadores. O passador
 * acende as bandeiras vermelhas uma a uma, na ordem de leitura; clicar num trecho mostra a
 * explicação dele. O último passo reescreve a conclusão no tamanho dos dados.
 */

const TABS = ['Resumo', ...FLAGS.map(f => f.tab), 'Veredito'] as const;
const VERDICT_STEP = TABS.length - 1;

interface Pick { step: number; id: FlagId }

const CriticalReaderSim = () => {
    const { step, setStep } = useSlideSteps(TABS.length);
    const [pick, setPick] = useState<Pick | null>(null);
    const revealed = new Set(FLAGS.slice(0, Math.min(step, FLAGS.length)).map(f => f.id));
    const stepFlag = step >= 1 && step <= FLAGS.length ? FLAGS[step - 1].id : null;
    const selectedId = pick?.step === step ? pick.id : stepFlag;
    const selected = FLAGS.find(f => f.id === selectedId) ?? null;
    const verdict = step === VERDICT_STEP && pick?.step !== step;

    return (
        <SimFrame tabs={TABS} step={step} setStep={setStep} layoutId="ato6-reader-tab"
            chips={<Tag color={C.risk}>resumo fictício</Tag>}>
            <div className="h-full flex gap-3">
                <Panel className="shrink-0 w-[640px] px-7 py-6 flex flex-col gap-3">
                    <p className="font-mono text-[15px] text-gray-400">{PAPER.journal}</p>
                    <p className="font-body text-[1.45rem] font-semibold leading-tight text-white">{PAPER.title}</p>
                    <p className="text-[17.5px] leading-[1.6] text-gray-100">
                        {PAPER.body.map((seg, i) => {
                            if (typeof seg === 'string') return <span key={i}>{seg}</span>;
                            const isOn = revealed.has(seg.flag);
                            const isSel = selectedId === seg.flag;
                            const n = FLAGS.findIndex(f => f.id === seg.flag) + 1;
                            return (
                                <span key={i} role="button" tabIndex={0} onClick={() => setPick({ step, id: seg.flag })}
                                    onKeyDown={e => { if (e.key === 'Enter') setPick({ step, id: seg.flag }); }}
                                    className="cursor-pointer rounded-[4px] px-0.5 transition-colors duration-300"
                                    style={{
                                        background: isSel ? `${C.risk}4d` : isOn ? `${C.risk}1f` : 'transparent',
                                        boxShadow: isOn ? `inset 0 -2px 0 ${C.risk}` : 'none',
                                        color: isSel ? '#fff' : undefined,
                                    }}>
                                    {seg.text}
                                    {isOn && <sup className="ml-0.5 font-mono text-[15px] font-bold" style={{ color: C.risk }}>{n}</sup>}
                                </span>
                            );
                        })}
                    </p>
                </Panel>
                <Panel className="flex-1 min-w-0 p-5 flex flex-col gap-3" state={selected ? 'active' : 'idle'} glow={C.risk}>
                    <p className="flex items-center gap-2 font-mono text-[15px]" style={{ color: C.risk }}>
                        <FlagIcon size={18} aria-hidden /> bandeiras: {revealed.size} de {FLAGS.length}
                    </p>
                    {step === 0 && !selected && (
                        <Narration stepKey={0} headline="Leia como quem só lê o resumo"
                            text="Randomizado, duplo-cego, +18%, conclusão firme. Parece um bom estudo. Antes de virar o passador: quantos problemas você acha?" />
                    )}
                    {selected && (
                        <motion.div key={selected.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}
                            className="flex flex-col gap-2">
                            <p className="font-body text-[1.35rem] font-semibold leading-tight" style={{ color: C.risk }}>
                                {FLAGS.findIndex(f => f.id === selected.id) + 1}. {selected.title}
                            </p>
                            <p className="text-[17px] leading-snug text-gray-100">{selected.why}</p>
                            <Src>{selected.source}</Src>
                        </motion.div>
                    )}
                    {verdict && (
                        <motion.div key="verdict" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}
                            className="flex flex-col gap-2">
                            <p className="font-body text-[1.35rem] font-semibold leading-tight" style={{ color: C.baseSoft }}>{VERDICT.title}</p>
                            <p className="text-[17px] leading-snug text-gray-100 border-l-2 pl-3" style={{ borderColor: C.base }}>{VERDICT.text}</p>
                        </motion.div>
                    )}
                    <div className="mt-auto"><Src>Clique em qualquer trecho para ver a bandeira dele.</Src></div>
                </Panel>
            </div>
        </SimFrame>
    );
};

export default CriticalReaderSim;
