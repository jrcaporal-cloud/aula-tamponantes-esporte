import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, Lock } from 'lucide-react';
import { C } from '../kit/palette';
import type { CaseVerdict } from './cases';
import { SIGNAL } from './shared';
import { Card, Light } from './ui';

/** Peças do slide 94: ficha do personagem, evidência + armadilhas, veredito e o quadro final. */

export const ProfileColumn = ({ c }: { c: CaseVerdict }) => (
    <Card className="flex w-[250px] shrink-0 flex-col gap-2 p-4">
        <p className="m-0 font-display text-[32px] font-semibold leading-none text-white">{c.name}</p>
        <p className="m-0 text-[16px] text-gray-200">{c.profile}</p>
        <p className="m-0 font-mono text-[15px] text-cyan-200">{c.effort}</p>
        <p className="m-0 mt-1 text-[17px] leading-snug text-gray-100">{c.dilemma}</p>
        <div className="mt-auto rounded-xl border px-3 py-2" style={{ borderColor: `${C.sodium}66`, background: `${C.sodium}10` }}>
            <p className="m-0 font-mono text-[15px] uppercase tracking-wider" style={{ color: C.sodium }}>a conta</p>
            <p className="m-0 text-[16px] leading-snug text-gray-100">{c.math}</p>
            <p className="m-0 text-[15px] text-gray-400">cálculo · não é prescrição</p>
        </div>
    </Card>
);

const List = ({ items, color, delay }: { items: readonly string[]; color: string; delay: number }) => (
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((t, i) => (
            <motion.li key={t} className="flex gap-2 text-[17px] leading-snug text-gray-100"
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + i * 0.1 }}>
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                {t}
            </motion.li>
        ))}
    </ul>
);

export const EvidenceColumn = ({ c }: { c: CaseVerdict }) => (
    <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <p className="m-0 flex items-center gap-2 font-mono text-[15px] uppercase tracking-wider text-cyan-200">
            <BookOpen size={17} aria-hidden /> O que a evidência diz
        </p>
        <List items={c.evidence} color={C.base} delay={0.1} />
        <p className="m-0 mt-1 flex items-center gap-2 font-mono text-[15px] uppercase tracking-wider text-amber-200">
            <AlertTriangle size={17} aria-hidden /> Armadilhas
        </p>
        <List items={c.traps} color={C.lactate} delay={0.4} />
    </Card>
);

export const VerdictColumn = ({ c, open }: { c: CaseVerdict; open: boolean }) => {
    const look = SIGNAL[c.signal];
    if (!open) {
        return (
            <div className="flex w-[330px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/25 p-5 text-center">
                <Lock size={26} className="text-gray-300" aria-hidden />
                <p className="m-0 font-display text-[22px] font-semibold leading-tight text-white">O que você decidiria?</p>
                <p className="m-0 text-[16px] leading-snug text-gray-300">A turma raciocina primeiro. O veredito abre no próximo passo.</p>
            </div>
        );
    }
    return (
        <motion.div className="flex w-[330px] shrink-0 flex-col gap-3 overflow-hidden rounded-2xl border p-5"
            style={{ borderColor: `${look.color}aa`, background: `linear-gradient(165deg, ${look.color}22, rgba(4,10,20,0.85) 60%)` }}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2">
                <Light signal={c.signal} size={22} />
                <span className="font-mono text-[15px] uppercase tracking-wider" style={{ color: look.color }}>veredito</span>
            </div>
            <p className="m-0 font-display text-[24px] font-semibold leading-tight text-white">{c.headline}</p>
            <List items={c.reasoning} color={look.color} delay={0.2} />
            <p className="m-0 mt-auto text-[15px] text-gray-300">Raciocínio, não receita: a ordem das perguntas.</p>
        </motion.div>
    );
};

export const Board = ({ cases }: { cases: readonly CaseVerdict[] }) => (
    <div className="flex h-full w-full flex-col gap-3">
        <div className="grid flex-1 grid-cols-4 gap-3">
            {cases.map((c, i) => {
                const look = SIGNAL[c.signal];
                return (
                    <motion.div key={c.id} className="flex flex-col gap-3 rounded-2xl border p-4"
                        style={{ borderColor: `${look.color}99`, background: `linear-gradient(170deg, ${look.color}1f, rgba(4,10,20,0.85) 55%)` }}
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                        <div className="flex items-center justify-between">
                            <span className="font-display text-[28px] font-semibold text-white">{c.name}</span>
                            <Light signal={c.signal} size={26} />
                        </div>
                        <p className="m-0 font-mono text-[15px] text-gray-300">{c.effort}</p>
                        <p className="m-0 font-display text-[21px] font-semibold leading-tight" style={{ color: look.color }}>{c.headline}</p>
                        <p className="m-0 mt-auto text-[16px] leading-snug text-gray-200">{c.reasoning[0]}</p>
                    </motion.div>
                );
            })}
        </div>
        <p className="m-0 rounded-2xl border border-white/10 px-5 py-3 text-[19px] font-semibold leading-snug text-white" style={{ background: 'rgba(4,10,20,0.74)' }}>
            Mesmas duas moléculas, quatro decisões. A pergunta nunca foi "funciona?", e sim "para quem, quando e sob qual regra?".
        </p>
    </div>
);
