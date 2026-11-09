import { Atom, FlaskConical, Gavel, Microscope, Scale, Search, Users, type LucideIcon } from 'lucide-react';
import { C, PANEL_BG } from '../kit/palette';
import type { Chapter, ChapterIcon } from './content';
import { CARD_H, CARD_W, type Slot } from './inquiryLayout';

/** Carta de capítulo presa no quadro do slide 13. */

const ICONS: Record<ChapterIcon, LucideIcon> = {
    search: Search, microscope: Microscope, flask: FlaskConical, atom: Atom, users: Users, scale: Scale, gavel: Gavel,
};

export type CardState = 'past' | 'current' | 'future';

interface ChapterCardProps {
    chapter: Chapter;
    slot: Slot;
    state: CardState;
    tilt: number;
    badge?: string;
}

export const ChapterCard = ({ chapter, slot, state, tilt, badge }: ChapterCardProps) => {
    const Icon = ICONS[chapter.icon];
    const lit = state !== 'future';
    const current = state === 'current';
    return (
        <div className="absolute flex flex-col gap-1.5 rounded-xl border px-3.5 pb-3 pt-3 transition-[opacity,border-color,box-shadow] duration-500"
            style={{
                left: slot.x, top: slot.y, width: CARD_W, height: CARD_H, rotate: `${tilt}deg`,
                ...PANEL_BG,
                background: current ? `linear-gradient(165deg, ${chapter.color}26, rgba(4,10,20,0.92))` : PANEL_BG.background,
                borderColor: current ? chapter.color : lit ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)',
                boxShadow: current ? `0 0 0 1px ${chapter.color}66, 0 0 34px -6px ${chapter.color}` : 'none',
            }}>
            {/* Ato futuro: apagado pela cor (cinza claro em opacidade cheia, ~7:1), não por opacidade — continua legível. */}
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[16px]" style={{ color: lit ? chapter.color : C.muted }}>
                    <Icon size={18} aria-hidden /> Ato {chapter.roman}
                </span>
                {badge && (
                    <span className="whitespace-nowrap rounded-md px-1.5 font-mono text-[16px] leading-snug text-black" style={{ background: chapter.color }}>{badge}</span>
                )}
            </div>
            <p className={`font-display text-[1.22rem] font-semibold leading-tight ${lit ? 'text-white' : 'text-gray-300'}`}>{chapter.title}</p>
            <p className={`text-[16px] leading-snug ${lit ? 'text-gray-300' : 'text-gray-400'}`}>{chapter.question}</p>
        </div>
    );
};
