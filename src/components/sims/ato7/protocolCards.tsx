import { motion } from 'framer-motion';
import { Baby, Bean, Check, HeartPulse, Hourglass, Pill, Utensils, X, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { FLOW } from './protocol';
import { Light } from './ui';

/**
 * Mini-visuais em HTML do slide 95: 2 semáforo com os ícones de contraindicação,
 * 3 as duas "portas" (WADA × Brasil) e 5 o prontuário com os campos se marcando.
 */

const chipsOf = (id: string): readonly string[] => FLOW.find(n => n.id === id)?.chips ?? [];

const enter = (reduce: boolean, delay: number, from: { opacity?: number; y?: number; x?: number; scale?: number } = { opacity: 0, y: 8 }) => ({
    initial: reduce ? false : from,
    animate: { opacity: 1, y: 0, x: 0, scale: 1 },
    transition: { duration: 0.4, delay },
});

/* ---------- 2 · o semáforo ---------- */

const CONTRA_ICON: Record<string, LucideIcon> = {
    diurético: Pill,
    'doença renal': Bean,
    'IC / edema': HeartPulse,
    gestação: Baby,
    'transtorno alimentar': Utensils,
    '> 60 anos': Hourglass,
};

export const ContraVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="flex h-full items-stretch gap-4">
        <div className="flex w-[66px] shrink-0 flex-col items-center justify-center gap-3 rounded-[22px] border border-white/15 bg-black/50 py-3">
            <motion.span {...enter(reduce, 0.6, { opacity: 0.25, scale: 0.8 })} className="inline-flex">
                <Light signal="vermelho" size={38} />
            </motion.span>
            <Light signal="amarelo" size={38} on={false} />
            <Light signal="verde" size={38} on={false} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="grid flex-1 grid-cols-3 gap-2">
                {chipsOf('contra').map((label, i) => {
                    const Icon = CONTRA_ICON[label] ?? Pill;
                    return (
                        <motion.div key={label} {...enter(reduce, 0.05 + i * 0.08)}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 text-center"
                            style={{ borderColor: `${C.risk}66`, background: `${C.risk}10` }}>
                            <Icon size={28} color={C.risk} aria-hidden />
                            <span className="text-[16px] font-semibold leading-tight text-gray-100">{label}</span>
                        </motion.div>
                    );
                })}
            </div>
            <motion.p {...enter(reduce, 0.7)} className="m-0 text-[17px] font-semibold leading-snug" style={{ color: C.risk }}>
                Qualquer um presente → sim → não usar
            </motion.p>
        </div>
    </div>
);

/* ---------- 3 · as duas portas ---------- */

type Mark = 'sim' | 'não' | 'limite';
const MARK: Record<Mark, { color: string; node: ReactNode }> = {
    sim: { color: C.ok, node: <Check size={17} strokeWidth={3} aria-hidden /> },
    não: { color: C.risk, node: <X size={17} strokeWidth={3} aria-hidden /> },
    limite: { color: C.lactate, node: <span className="text-[15px] font-bold leading-none">!</span> },
};

interface DoorProps {
    title: string;
    sub: string;
    rows: readonly { mark: Mark; text: string }[];
    delay: number;
    reduce: boolean;
}

const ARCH = '120px 120px 14px 14px / 56px 56px 14px 14px';

const Door = ({ title, sub, rows, delay, reduce }: DoorProps) => (
    <div className="relative flex min-w-0 flex-1 flex-col gap-2 overflow-hidden border-2 px-4 pb-3 pt-5"
        style={{ borderRadius: ARCH, borderColor: `${C.base}88`, background: 'rgba(14,116,144,0.14)' }}>
        <p className="m-0 text-center font-display text-[20px] font-semibold leading-none text-white">{title}</p>
        <p className="m-0 mb-1 text-center font-mono text-[15px] leading-none text-cyan-200">{sub}</p>
        {rows.map((r, i) => {
            const m = MARK[r.mark];
            return (
                <motion.div key={r.text} {...enter(reduce, delay + 0.35 + i * 0.1, { opacity: 0, x: -8 })} className="flex items-center gap-2">
                    <span className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${m.color}2e`, border: `2px solid ${m.color}`, color: m.color }}>{m.node}</span>
                    <span className="text-[16px] font-semibold leading-tight text-gray-100">{r.text}</span>
                </motion.div>
            );
        })}
        {/* a folha da porta abre para a esquerda e fica entreaberta */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 border-r-4"
            style={{ borderRadius: ARCH, transformOrigin: 'left center', borderColor: `${C.base}aa`, background: 'linear-gradient(90deg, #0b2a36, #0e3b4a)' }}
            initial={reduce ? false : { scaleX: 1 }} animate={{ scaleX: 0.05 }} transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }} />
    </div>
);

export const RulesVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="flex h-full flex-col gap-2.5">
        <div className="flex min-h-0 flex-1 gap-3">
            <Door title="WADA" sub="Lista 2026" delay={0.1} reduce={reduce} rows={[
                { mark: 'sim', text: 'oral: permitido' },
                { mark: 'não', text: 'IV > 100 mL/12 h' },
                { mark: 'limite', text: 'diurético (S5) → AUT' },
            ]} />
            <Door title="Brasil" sub="Anvisa · IN 28" delay={0.3} reduce={reduce} rows={[
                { mark: 'limite', text: 'β-alanina ≤ 2 g/d' },
                { mark: 'não', text: '< 19 anos' },
            ]} />
        </div>
        <motion.p {...enter(reduce, 0.9)} className="m-0 text-[17px] font-semibold leading-snug" style={{ color: C.risk }}>
            Se uma porta fecha → parar
        </motion.p>
    </div>
);

/* ---------- 5 · o prontuário ---------- */

export const RecordVisual = ({ reduce }: { reduce: boolean }) => {
    const fields = chipsOf('registrar');
    return (
        <div className="relative flex h-full flex-col rounded-2xl border border-white/20 bg-white/[0.04] px-5 pb-3 pt-5">
            <span aria-hidden className="absolute left-1/2 top-[-9px] h-[18px] w-[110px] -translate-x-1/2 rounded-md border border-white/30 bg-slate-700" />
            <div className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-[20px] font-semibold text-white">Prontuário</span>
                <span className="font-mono text-[15px] text-gray-300">CFN 656/2020</span>
            </div>
            <div className="flex flex-1 flex-col justify-between">
                {fields.map((f, i) => {
                    const delay = 0.1 + i * 0.15;
                    const adverse = i === fields.length - 1;
                    return (
                        <div key={f} className="flex items-center gap-3">
                            <span className="relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 border-white/40">
                                <motion.span {...enter(reduce, delay + 0.15, { opacity: 0, scale: 0.3 })} className="inline-flex" style={{ color: C.ok }}>
                                    <Check size={18} strokeWidth={3.5} aria-hidden />
                                </motion.span>
                            </span>
                            <span className="w-[140px] shrink-0 text-[17px] font-semibold text-gray-100">{f}</span>
                            <span className="relative h-[2px] flex-1 bg-white/10">
                                <motion.span className="absolute inset-0" style={{ background: `${C.base}aa`, transformOrigin: 'left center' }}
                                    initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay }} />
                            </span>
                            {adverse && (
                                <motion.span {...enter(reduce, delay + 0.3)} className="shrink-0 rounded-md border px-2 py-0.5 text-[15px] font-semibold"
                                    style={{ borderColor: `${C.risk}aa`, color: C.risk, background: `${C.risk}14` }}>
                                    se houver → notificar
                                </motion.span>
                            )}
                        </div>
                    );
                })}
            </div>
            <motion.p {...enter(reduce, 1)} className="m-0 mt-2 border-t border-white/10 pt-2 text-[15px] leading-snug text-gray-300">
                Anote também GI, horário e desempenho.
            </motion.p>
        </div>
    );
};
