import { motion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Beef, Bird, Dog, Trophy, Waves } from 'lucide-react';
import { C } from '../kit/palette';
import { ANIMALS, HUMAN_BARS, HUMAN_RANGE, LOWER_BARS } from './originContent';

/** Quadros do slide 60: linha do tempo 1900 → 2010, os animais ricos em HCD, o humano e quem tem menos. */

export const CenturyVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-6 px-6">
        <div className="relative h-[150px]">
            <div className="absolute left-[60px] right-[60px] top-[58px] h-[3px] bg-white/15" />
            <motion.div className="absolute left-[60px] top-[58px] h-[3px]" style={{ background: C.carno, width: 'calc(100% - 120px)', originX: 0 }}
                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }} />
            {[{ year: '1900', text: 'achada na carne', left: true }, { year: '2010', text: 'CARNS1 identificada', left: false }].map(n => (
                <div key={n.year} className={`absolute top-0 flex flex-col items-center gap-2 ${n.left ? 'left-0' : 'right-0'}`} style={{ width: 120 }}>
                    <span className="font-display text-[2.2rem] leading-none font-semibold text-white">{n.year}</span>
                    <span className="w-[18px] h-[18px] rounded-full border-2" style={{ borderColor: C.carno, background: '#2E1065' }} />
                    <span className="text-[16px] text-gray-200 text-center leading-tight">{n.text}</span>
                </div>
            ))}
            <motion.span className="absolute left-1/2 top-[76px] -translate-x-1/2 font-body text-[1.6rem] font-semibold" style={{ color: C.carnoSoft }}
                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text, delay: 0.9, ease: EASE_OUT }}>
                110 anos
            </motion.span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Beef size={30} color={C.carnoSoft} aria-hidden />
            <span className="text-[1.05rem] leading-snug text-gray-100">
                Funções propostas: tampão de pH, quelação de metais, antioxidante, antiglicação. Em humanos, a prova mais forte é para o <span className="font-semibold text-white">tampão</span> (Boldyrev 2013).
            </span>
        </div>
    </div>
);

const ANIMAL_ICONS = [Waves, Trophy, Dog, Bird] as const;

export const AnimalsVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full grid grid-cols-2 gap-3 content-center">
        {ANIMALS.map((a, i) => {
            const Icon = ANIMAL_ICONS[i];
            return (
                <motion.div key={a.name} className="rounded-xl border border-white/10 bg-white/[0.04] p-5 flex flex-col gap-2"
                    initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.enter, delay: stagger(i, 0, 0.15), ease: EASE_OUT }}>
                    <Icon size={30} color={C.carno} aria-hidden />
                    <span className="font-body text-[1.35rem] font-semibold text-white">{a.name}</span>
                    <span className="text-[16px] text-gray-200">{a.detail}</span>
                </motion.div>
            );
        })}
    </div>
);

const SCALE = 35;

export const HumanVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-5 px-4">
        <span className="text-[16px] text-gray-300">Carnosina no vasto lateral, mmol/kg de massa seca (biópsia, n = 50)</span>
        <div className="relative h-[54px] rounded-xl bg-white/[0.04] border border-white/10">
            <motion.div className="absolute top-[10px] bottom-[10px] rounded-lg" style={{
                background: `${C.carno}40`, border: `1px solid ${C.carno}`,
                left: `${(HUMAN_RANGE.lo / SCALE) * 100}%`, width: `${((HUMAN_RANGE.hi - HUMAN_RANGE.lo) / SCALE) * 100}%`,
            }}
                initial={reduce ? false : { clipPath: 'inset(0 100% 0 0 round 8px)' }} animate={{ clipPath: 'inset(0 0% 0 0 round 8px)' }}
                transition={{ duration: DUR.bar, delay: 0.2, ease: EASE_OUT }} />
            <span className="absolute top-[6px] bottom-[6px] w-[3px] rounded" style={{ left: `${(HUMAN_RANGE.mean / SCALE) * 100}%`, background: C.text }} />
        </div>
        <div className="flex justify-between font-mono text-[16px] text-gray-300 -mt-3">
            <span>faixa 7,2</span><span>média 20,0</span><span>30,7</span>
        </div>
        {HUMAN_BARS.map((b, i) => (
            <div key={b.label} className="grid items-center gap-3" style={{ gridTemplateColumns: '110px minmax(0,1fr) 60px' }}>
                <span className="text-[1.1rem] font-semibold text-white">{b.label}</span>
                <div className="h-[20px] rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: C.carno, width: `${(b.value / SCALE) * 100}%` }}
                        initial={reduce ? false : { clipPath: 'inset(0 100% 0 0 round 10px)' }} animate={{ clipPath: 'inset(0 0% 0 0 round 10px)' }}
                        transition={{ duration: 0.8, delay: stagger(i, 0.2), ease: EASE_OUT }} />
                </div>
                <span className="font-mono text-[1.15rem] font-semibold text-right" style={{ color: C.carno }}>{b.text}</span>
            </div>
        ))}
    </div>
);

export const LowerVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-4 px-4">
        <span className="text-[16px] text-gray-300">Grupo de referência = 100 (¹H-ERM; barras: cálculo a partir das diferenças publicadas)</span>
        {LOWER_BARS.map((b, i) => (
            <div key={b.text} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                    <span className="text-[1.1rem] font-semibold text-white">{b.label} <span className="text-[16px] font-normal text-gray-300">× {b.ref}</span></span>
                    <span className="font-mono text-[16px] font-semibold" style={{ color: C.carnoSoft }}>{b.text}</span>
                </div>
                <div className="relative h-[20px] rounded-full bg-white/[0.06] overflow-hidden">
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: '100%', background: `${C.co2}33` }} />
                    <motion.div className="relative h-full rounded-full" style={{ background: C.carno, width: '100%' }}
                        initial={reduce ? false : { clipPath: 'inset(0 0% 0 0 round 10px)' }} animate={{ clipPath: `inset(0 ${100 - b.value}% 0 0 round 10px)` }}
                        transition={{ duration: 0.8, delay: stagger(i, 0.2), ease: EASE_OUT }} />
                </div>
            </div>
        ))}
        <p className="text-[16px] leading-snug text-gray-200">Em 60 onívoros ativos, a β-alanina da dieta não se associou à carnosina muscular (Rezende 2023).</p>
    </div>
);
