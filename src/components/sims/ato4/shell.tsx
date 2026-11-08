import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { C } from '../kit/palette';

/** Peças de moldura do Ato IV: caixa do simulador e narração do passo. */

/** Altura da caixa de todos os simuladores do ato (limite do palco: 516 px). */
const SIM_HEIGHT = 500;

export const Shell = ({ children }: { children: ReactNode }) => (
    <div className="not-prose w-full font-body text-white select-none flex flex-col gap-3" style={{ height: SIM_HEIGHT }}>
        {children}
    </div>
);

interface NarrationProps {
    /** Muda a cada passo: refaz o fade do texto. */
    stepKey: number;
    kicker: string;
    title: string;
    text: string;
    color?: string;
    reduce: boolean;
}

/** Texto do passo: rótulo pequeno, frase-tese e explicação curta. */
export const Narration = ({ stepKey, kicker, title, text, color = C.carno, reduce }: NarrationProps) => (
    <motion.div key={stepKey} className="flex flex-col gap-2.5"
        initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <span className="font-mono text-[16px] uppercase tracking-wider" style={{ color }}>{kicker}</span>
        <h3 className="font-display text-[1.5rem] leading-[1.15] font-semibold text-white">{title}</h3>
        <p className="text-[1.06rem] leading-snug text-gray-100">{text}</p>
    </motion.div>
);

/** Linha de rodapé com a consequência do passo (a "virada" falada). */
export const Takeaway = ({ stepKey, children, reduce }: { stepKey: number; children: ReactNode; reduce: boolean }) => (
    <motion.p key={stepKey} className="pt-3 border-t border-white/10 text-[1.04rem] leading-snug font-medium text-white"
        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.15 }}>
        {children}
    </motion.p>
);
