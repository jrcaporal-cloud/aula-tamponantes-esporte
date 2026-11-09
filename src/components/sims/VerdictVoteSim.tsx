import { useState } from 'react';
import { EASE_OUT } from '../../lib/motion';
import { motion } from 'framer-motion';
import { Gavel, Hand } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { ACCUSATIONS, VERDICT_LOOK, VERDICT_ORDER, type Verdict } from './ato1/content';
import { AccusationCard } from './ato1/AccusationCard';

/**
 * "Culpado ou Inocente?" (slide 11). Passo 1: seis acusações presas no quadro; a turma vota em cada carta
 * (o professor marca a maioria). Passos 2–7: o passador vira uma carta por vez com o veredito e a fonte.
 * Os vereditos moram em `ato1/content.ts` (ACCUSATIONS), que o slide 97 reutiliza no fechamento.
 */

type Votes = Readonly<Record<number, Verdict | undefined>>;

const Headline = ({ step, votes }: { step: number; votes: Votes }) => {
    const revealed = ACCUSATIONS.slice(0, step);
    const voted = revealed.filter(a => votes[a.id]);
    const hits = voted.filter(a => votes[a.id] === a.verdict).length;
    const done = step === ACCUSATIONS.length;

    if (step === 0) {
        return (
            <p className="flex items-center gap-2 text-[1.12rem] text-gray-100">
                <Hand size={20} className="shrink-0" style={{ color: C.acid }} aria-hidden />
                Vote antes de virar.
                <span style={{ color: VERDICT_LOOK.culpado.color }}>Culpado</span> = a acusação procede ·
                <span style={{ color: VERDICT_LOOK.inocente.color }}>Inocente</span> = não procede ·
                <span style={{ color: VERDICT_LOOK.depende.color }}>Depende</span> = em parte
            </p>
        );
    }
    return (
        <p className="flex items-center gap-2 text-[1.12rem] text-gray-100">
            <Gavel size={20} className="shrink-0" style={{ color: C.lactate }} aria-hidden />
            {done
                ? <strong className="font-semibold text-white">Seis acusações. Nenhuma procede inteira.</strong>
                : <>Carta {step} de {ACCUSATIONS.length}</>}
            {voted.length > 0 && (
                <span className="text-gray-300">· a turma acertou <strong className="text-white">{hits} de {voted.length}</strong></span>
            )}
        </p>
    );
};

/** Nos passos de revelação a legenda fica no topo: o quadro julga a acusação, não a molécula. */
const Legend = () => (
    <span className="shrink-0 text-[16px] text-gray-300">
        {VERDICT_ORDER.map((v, i) => (
            <span key={v}>
                {i > 0 && ' · '}
                <span style={{ color: VERDICT_LOOK[v].color }}>{VERDICT_LOOK[v].label.toLowerCase()}</span> = {VERDICT_LOOK[v].brief}
            </span>
        ))}
    </span>
);

const VerdictVoteSim = () => {
    const { step } = useSlideSteps(ACCUSATIONS.length + 1);
    const [votes, setVotes] = useState<Votes>({});

    const toggleVote = (id: number, verdict: Verdict) =>
        setVotes(prev => ({ ...prev, [id]: prev[id] === verdict ? undefined : verdict }));

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 516 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <motion.div key={step === 0 ? 'vote' : step === ACCUSATIONS.length ? 'end' : 'reveal'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                    <Headline step={step} votes={votes} />
                </motion.div>
                {step === 0
                    ? <span className="shrink-0 font-mono text-[16px] uppercase tracking-wider text-gray-400">quadro do inquérito</span>
                    : <Legend />}
            </div>

            {/* O quadro: fundo pontilhado como cortiça escura */}
            <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-x-3 gap-y-4 rounded-2xl px-1 pt-2"
                style={{ backgroundImage: 'radial-gradient(rgba(148,163,184,0.13) 1px, transparent 1.4px)', backgroundSize: '18px 18px' }}>
                {ACCUSATIONS.map((item, i) => (
                    <AccusationCard key={item.id} item={item} index={i} flipped={i < step} current={i === step - 1}
                        vote={votes[item.id]} onVote={v => toggleVote(item.id, v)} />
                ))}
            </div>
        </div>
    );
};

export default VerdictVoteSim;
