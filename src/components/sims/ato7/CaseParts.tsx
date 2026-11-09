import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { AlertTriangle, BookOpen, Lock } from 'lucide-react';
import { C } from '../kit/palette';
import { Avatar, EffortRuler, Stamp } from './caseVisuals';
import type { CaseVerdict } from './cases';
import { SIGNAL } from './shared';
import { Card } from './ui';

/**
 * Peças do slide 94: a ficha (pictograma + régua do esforço contra a janela + a conta),
 * evidência e armadilhas, o veredito com carimbo e o quadro final dos quatro.
 */

const RULER_W = 560;

/** Faixa de cima: quem é, o dilema e onde o esforço cai na janela do tampão. */
export const CaseHero = ({ c, open }: { c: CaseVerdict; open: boolean }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <Card className="flex shrink-0 items-center gap-4 px-4 py-3">
            <Avatar sport={c.sport} size={92} signal={open ? c.signal : undefined} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="m-0 flex items-baseline gap-3">
                    <span className="font-display text-[30px] font-semibold leading-none text-white">{c.name}</span>
                    <span className="text-[16px] text-gray-300">{c.profile}</span>
                </p>
                <p className="m-0 text-[16px] leading-snug text-gray-100">{c.dilemma}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
                <EffortRuler c={c} width={RULER_W} reduce={reduce} />
                <p className="m-0 pl-[20px] font-mono text-[15px] leading-tight text-gray-300">
                    <span style={{ color: C.sodium }}>a conta</span> {c.math} <span className="text-gray-400">· cálculo, não prescrição</span>
                </p>
            </div>
        </Card>
    );
};

const List = ({ items, color, delay, size = 16 }: { items: readonly string[]; color: string; delay: number; size?: number }) => (
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((t, i) => (
            <motion.li key={t} className="flex gap-2 leading-snug text-gray-100" style={{ fontSize: size }}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + i * 0.1, duration: DUR.enter, ease: EASE_OUT }}>
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                {t}
            </motion.li>
        ))}
    </ul>
);

interface ColumnProps {
    title: string;
    icon: typeof BookOpen;
    color: string;
    items: readonly string[];
    delay: number;
}

/** Coluna com rubrica e ícone (evidência em ciano, armadilhas em âmbar). */
export const CaseColumn = ({ title, icon: Icon, color, items, delay }: ColumnProps) => (
    <Card className="flex min-w-0 flex-1 flex-col gap-2.5 p-4">
        <p className="m-0 flex items-center gap-2 font-mono text-[15px] uppercase tracking-wider" style={{ color }}>
            <Icon size={18} aria-hidden /> {title}
        </p>
        <List items={items} color={color} delay={delay} />
    </Card>
);

export const EvidenceColumn = ({ c }: { c: CaseVerdict }) => (
    <CaseColumn title="O que a evidência diz" icon={BookOpen} color={C.baseSoft} items={c.evidence} delay={0.1} />
);

export const TrapsColumn = ({ c }: { c: CaseVerdict }) => (
    <CaseColumn title="Armadilhas" icon={AlertTriangle} color={C.lactate} items={c.traps} delay={0.35} />
);

export const VerdictColumn = ({ c, open }: { c: CaseVerdict; open: boolean }) => {
    const look = SIGNAL[c.signal];
    if (!open) {
        return (
            <div className="flex w-[370px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/25 p-5 text-center">
                <div className="flex h-[70px] w-[230px] items-center justify-center rounded-xl border-[3px] border-dashed border-white/25" style={{ rotate: '-5deg' }}>
                    <Lock size={28} className="text-gray-300" aria-hidden />
                </div>
                <p className="m-0 font-body text-[22px] font-semibold leading-tight text-white">O que você decidiria?</p>
                <p className="m-0 text-[16px] leading-snug text-gray-300">A turma raciocina primeiro. O carimbo cai no próximo passo.</p>
            </div>
        );
    }
    return (
        <div className="flex w-[370px] shrink-0 flex-col gap-2.5 overflow-hidden rounded-2xl border p-4"
            style={{ borderColor: `${look.color}aa`, background: `linear-gradient(165deg, ${look.color}22, rgba(4,10,20,0.85) 60%)` }}>
            <Stamp text={c.stamp} signal={c.signal} />
            <p className="m-0 font-body text-[20px] font-semibold leading-tight text-white">{c.headline}</p>
            <List items={c.reasoning} color={look.color} delay={0.35} size={15} />
        </div>
    );
};

/** Último passo: os quatro lado a lado, cada um com a régua e o carimbo. */
export const Board = ({ cases }: { cases: readonly CaseVerdict[] }) => {
    const reduce = useReducedMotion() ?? false;
    return (
        <div className="flex h-full w-full flex-col gap-3">
            <div className="grid min-h-0 flex-1 grid-cols-4 gap-3">
                {cases.map((c, i) => {
                    const look = SIGNAL[c.signal];
                    return (
                        <motion.div key={c.id} className="flex min-w-0 flex-col gap-2 rounded-2xl border p-3"
                            style={{ borderColor: `${look.color}99`, background: `linear-gradient(170deg, ${look.color}1f, rgba(4,10,20,0.85) 55%)` }}
                            initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: DUR.enter, ease: EASE_OUT }}>
                            <div className="flex items-center gap-3">
                                <Avatar sport={c.sport} size={64} signal={c.signal} />
                                <span className="font-body text-[26px] font-semibold text-white">{c.name}</span>
                            </div>
                            <div className="mb-1"><EffortRuler c={c} width={250} compact reduce={reduce} /></div>
                            <Stamp text={c.stamp} signal={c.signal} size="sm" />
                            <p className="m-0 mt-1 font-body text-[18px] font-semibold leading-tight" style={{ color: look.color }}>{c.headline}</p>
                        </motion.div>
                    );
                })}
            </div>
            <p className="m-0 rounded-2xl border border-white/10 px-5 py-3 text-[19px] font-semibold leading-snug text-white" style={{ background: 'rgba(4,10,20,0.74)' }}>
                Mesmas duas moléculas, quatro decisões. A pergunta nunca foi "funciona?", e sim "para quem, quando e sob qual regra?".
            </p>
        </div>
    );
};
