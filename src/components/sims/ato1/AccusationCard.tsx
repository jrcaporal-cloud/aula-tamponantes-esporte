import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { C } from '../kit/palette';
import { VERDICT_LOOK, VERDICT_ORDER, type Accusation, type Verdict } from './content';

/** Carta de acusação presa no quadro (slide 11). Frente: acusação + voto da turma. Verso: veredito + fonte. */

const FACE = 'absolute inset-0 flex flex-col rounded-xl border p-3.5 [backface-visibility:hidden]';
const TILT = [-1.2, 0.8, -0.6, 1, -0.8, 0.6];

const Pin = ({ color }: { color: string }) => (
    <span className="absolute left-1/2 top-[-7px] z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-black/60"
        style={{ background: color, boxShadow: `0 2px 6px rgba(0,0,0,0.7), 0 0 10px ${color}66` }} aria-hidden />
);

interface AccusationCardProps {
    item: Accusation;
    index: number;
    flipped: boolean;
    current: boolean;
    vote: Verdict | undefined;
    onVote: (verdict: Verdict) => void;
}

export const AccusationCard = ({ item, index, flipped, current, vote, onVote }: AccusationCardProps) => {
    const reduce = useReducedMotion();
    const look = VERDICT_LOOK[item.verdict];
    const number = String(item.id).padStart(2, '0');
    const hit = vote === item.verdict;

    return (
        <motion.div className="relative [perspective:1400px]" style={{ rotate: TILT[index % TILT.length] }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : index * 0.07 }}>
            <Pin color={flipped ? look.color : C.acid} />
            <motion.div className="relative h-full w-full [transform-style:preserve-3d]"
                animate={{ rotateY: flipped ? 180 : 0, scale: current ? 1.02 : 1 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 17 }}>

                {/* Frente: a acusação e o voto */}
                <div className={`${FACE} justify-between border-white/15`}
                    style={{ background: 'linear-gradient(165deg, rgba(30,34,48,0.96), rgba(9,12,22,0.96))' }}>
                    <div className="flex items-center justify-between gap-2 font-mono text-[16px]">
                        <span className="text-gray-400">acusação {number}</span>
                        <span style={{ color: C.acidSoft }}>réu: {item.suspect}</span>
                    </div>
                    <p className="font-display text-[1.42rem] font-semibold leading-tight text-white">{item.claim}</p>
                    <div className="flex gap-1.5">
                        {VERDICT_ORDER.map(v => {
                            const on = vote === v;
                            const c = VERDICT_LOOK[v].color;
                            return (
                                <button key={v} type="button" onClick={() => onVote(v)} aria-pressed={on}
                                    className="flex-1 cursor-pointer rounded-lg border px-1 py-1.5 text-[16px] font-semibold transition-colors"
                                    style={{ borderColor: on ? c : 'rgba(255,255,255,0.16)', background: on ? `${c}2e` : 'rgba(255,255,255,0.03)', color: on ? c : '#D1D5DB' }}>
                                    {VERDICT_LOOK[v].label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Verso: o veredito */}
                <div className={`${FACE} gap-1.5 [transform:rotateY(180deg)]`}
                    style={{ background: 'linear-gradient(165deg, rgba(22,28,40,0.97), rgba(7,10,18,0.97))', borderColor: `${look.color}99`, boxShadow: current ? `0 0 26px -4px ${look.color}` : 'none' }}>
                    <div className="flex items-center justify-between gap-2">
                        <span className="-rotate-3 rounded-md border-2 px-2 font-display text-[1.35rem] font-bold uppercase tracking-wide"
                            style={{ borderColor: look.color, color: look.color }}>
                            {look.label}
                        </span>
                        {vote && (
                            <span className="flex items-center gap-1 font-mono text-[16px]" style={{ color: hit ? C.ok : C.risk }}>
                                turma: {VERDICT_LOOK[vote].label.toLowerCase()}
                                {hit ? <Check size={16} aria-label="acertou" /> : <X size={16} aria-label="errou" />}
                            </span>
                        )}
                    </div>
                    <p className="text-[16px] italic leading-snug text-gray-300">
                        <span className="mr-1.5 font-mono not-italic text-gray-400">{number}</span>“{item.claim}”
                    </p>
                    <p className="min-h-0 flex-1 text-[16px] leading-snug text-gray-100">{item.short}</p>
                    <p className="font-mono text-[16px] leading-tight" style={{ color: C.baseSoft }}>{item.source}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};
