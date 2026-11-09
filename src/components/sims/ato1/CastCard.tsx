import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { HelpCircle } from 'lucide-react';
import { Panel } from '../kit/ui';
import type { CastMember } from './content';
import { SportArt } from './SportArt';

/** Ficha de personagem (slide 12): esporte desenhado, duração do esforço numa régua comum e o dilema. */

const SCALE_MIN = 10;

interface CastCardProps {
    member: CastMember;
    revealed: boolean;
    state: 'idle' | 'active' | 'dim';
}

export const CastCard = ({ member, revealed, state }: CastCardProps) => {
    const reduce = useReducedMotion() ?? false;
    const [a, b] = member.minutes;
    const left = (a / SCALE_MIN) * 100;
    const width = Math.max(((b - a) / SCALE_MIN) * 100, 2.2);

    return (
        <Panel state={state} glow={member.color} className="flex h-full flex-col">
            <div className="h-[112px] shrink-0 border-b border-white/10" style={{ background: `${member.color}0d` }}>
                <SportArt sport={member.sport} color={member.color} animate={!reduce && state !== 'dim'} />
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3.5 pt-2.5">
                <div>
                    <p className="font-body text-[1.65rem] font-semibold leading-none text-white">{member.name}</p>
                    <p className="mt-1 text-[16px] text-gray-300">{member.meta}</p>
                    <p className="text-[16px] font-semibold" style={{ color: member.color }}>{member.event}</p>
                </div>

                {/* Duração de um esforço, todos na mesma régua de 0 a 10 min */}
                <div>
                    <div className="flex items-center gap-2">
                        <div className="relative h-2.5 flex-1 rounded-full bg-white/10">
                            <div className="absolute inset-y-0 rounded-full" style={{ left: `${left}%`, width: `${width}%`, background: member.color }} />
                        </div>
                        <span className="font-mono text-[16px] text-gray-400">10 min</span>
                    </div>
                    <p className="mt-1 text-[16px] leading-snug text-gray-200">{member.durationLabel}</p>
                </div>

                <div className="min-h-0 flex-1 rounded-xl border px-3 py-2"
                    style={{ borderColor: revealed ? `${member.color}66` : 'rgba(255,255,255,0.12)', borderStyle: revealed ? 'solid' : 'dashed' }}>
                    {revealed ? (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }}>
                            <p className="font-mono text-[16px] uppercase tracking-wide" style={{ color: member.color }}>o dilema</p>
                            <p className="mt-0.5 text-[16px] leading-snug text-gray-100">{member.dilemma}</p>
                        </motion.div>
                    ) : (
                        <div className="flex h-full items-center justify-center gap-2 text-[16px] text-gray-400">
                            <HelpCircle size={18} aria-hidden /> o dilema
                        </div>
                    )}
                </div>
            </div>
        </Panel>
    );
};
