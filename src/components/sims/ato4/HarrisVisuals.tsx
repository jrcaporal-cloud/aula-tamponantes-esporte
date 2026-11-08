import { motion } from 'framer-motion';
import { FileText, ShieldAlert } from 'lucide-react';
import { C } from '../kit/palette';
import { fractionOfMax } from './loadingModel';
import { CHICHESTER_FACTS, DISCLOSURES, HORSE_FACTS, PATENT_FACTS, type Fact } from './harrisContent';

/** Quadros visuais de cada passo do slide 63. */

interface TankProps {
    name: string;
    color: string;
    fill: number;
    caption: string;
    delay: number;
    reduce: boolean;
}

const Tank = ({ name, color, fill, caption, delay, reduce }: TankProps) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
            <span className="font-display text-[1.35rem] font-semibold" style={{ color }}>{name}</span>
            <span className="text-[16px] text-gray-200">{caption}</span>
        </div>
        <div className="h-[46px] rounded-xl border border-white/15 bg-white/[0.04] overflow-hidden">
            <motion.div className="h-full" style={{ background: `linear-gradient(90deg, ${color}55, ${color})` }}
                initial={reduce ? false : { width: 0 }} animate={{ width: `${fill * 100}%` }}
                transition={{ duration: 1.6, delay, ease: 'easeOut' }} />
        </div>
    </div>
);

/** 4 semanas a 6,4 g/dia = 179 g → fração do teto no modelo do slide 62. */
const CARNOSINE_4W = fractionOfMax(6.4 * 28);

export const TanksVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-8 px-4">
        <Tank name="Creatina" color={C.base} fill={1} caption="satura em ~5 dias" delay={0.2} reduce={reduce} />
        <Tank name="Carnosina" color={C.carno} fill={CARNOSINE_4W} delay={0.6} reduce={reduce}
            caption={`28 dias a 6,4 g/dia: ~${Math.round(CARNOSINE_4W * 100)}% do teto (modelo)`} />
        <p className="text-[16px] leading-snug text-gray-300">
            O teto da carnosina vem do modelo ilustrativo do slide anterior (ED50 377 g, Rezende 2020).
        </p>
    </div>
);

const FactGrid = ({ facts, color, cols = 3 }: { facts: readonly Fact[]; color: string; cols?: number }) => (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {facts.map(f => (
            <div key={f.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 flex flex-col gap-1">
                <span className="font-mono text-[1.2rem] font-semibold leading-tight" style={{ color }}>{f.value}</span>
                <span className="text-[16px] leading-snug text-gray-200">{f.label}</span>
            </div>
        ))}
    </div>
);

export const PatentVisual = () => (
    <div className="h-full flex flex-col justify-center gap-5 px-2">
        <div className="flex flex-col gap-2">
            <span className="text-[16px] uppercase tracking-wider text-gray-300">Cavalos · Equine Vet J 1999</span>
            <FactGrid facts={HORSE_FACTS} color={C.carnoSoft} />
        </div>
        <div className="rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: `${C.lactate}66`, background: 'rgba(250,204,21,0.05)' }}>
            <span className="flex items-center gap-2 font-display text-[1.25rem] font-semibold" style={{ color: C.lactate }}>
                <FileText size={22} aria-hidden /> Patente US 5,965,596 · Harris e Dunnett
            </span>
            <FactGrid facts={PATENT_FACTS} color={C.lactate} />
        </div>
    </div>
);

export const ChichesterVisual = () => (
    <div className="h-full flex flex-col justify-center gap-3 px-2">
        <span className="text-[16px] uppercase tracking-wider text-gray-300">University of Chichester · Amino Acids 2006 e 2007</span>
        <FactGrid facts={CHICHESTER_FACTS} color={C.carno} cols={2} />
    </div>
);

export const DisclosureVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="h-full flex flex-col justify-center gap-3 px-2">
        <span className="flex items-center gap-2 font-display text-[1.3rem] font-semibold" style={{ color: C.lactate }}>
            <ShieldAlert size={22} aria-hidden /> Conflitos de interesse declarados
        </span>
        <ul className="flex flex-col gap-2">
            {DISCLOSURES.map((d, i) => (
                <motion.li key={d} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[1.02rem] text-gray-100"
                    initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.12 }}>
                    {d}
                </motion.li>
            ))}
        </ul>
    </div>
);
