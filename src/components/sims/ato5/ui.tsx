import { motion, useReducedMotion } from 'framer-motion';
import { PANEL_BG } from '../kit/palette';
import type { ReactNode } from 'react';

/** Peças comuns aos simuladores do Ato V (testemunhas fracas e alianças). */

/** Altura total da caixa do simulador (o palco reserva ≤ 516 px abaixo do título). */
export const SIM_HEIGHT = 500;

/** Bloco de texto que troca a cada passo com fade curto (sem AnimatePresence mode="wait"). */
export const StepFade = ({ stepKey, children, className = '' }: { stepKey: string | number; children: ReactNode; className?: string }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div key={stepKey} className={className}
            initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
};

/** Número grande com legenda curta embaixo. */
export const BigNumber = ({ value, label, color }: { value: string; label: string; color: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="font-display text-[1.9rem] leading-none font-semibold" style={{ color }}>{value}</span>
        <span className="text-[16px] leading-snug text-gray-300">{label}</span>
    </div>
);

/** Título curto do passo, no topo dos painéis de história. */
export const StepTitle = ({ children }: { children: ReactNode }) => (
    <h3 className="font-display text-[1.5rem] font-semibold leading-tight text-white">{children}</h3>
);

/** Parágrafo de história: frase de quem fala com médicos, sem enfeite. */
export const StepText = ({ children }: { children: ReactNode }) => (
    <p className="text-[1.08rem] leading-snug text-gray-100">{children}</p>
);

/*
 * O palco da aula encolhe para ~0,91 numa tela de 1280 px: 14 px de projeto viram ~12,8 px.
 * Por isso as peças abaixo usam 16 px (≈14,6 px efetivos) em vez do Source/Chip de 14 px do kit.
 */

/** Linha de fonte do passo. */
export const SourceNote = ({ children }: { children: ReactNode }) => (
    <p className="text-[16px] leading-snug text-gray-300">{children}</p>
);

/** Selo ("valores ilustrativos", "caso fictício"…) em 16 px. */
export const Tag = ({ children, color }: { children: ReactNode; color: string }) => (
    <span className="inline-flex shrink-0 items-center self-start whitespace-nowrap rounded-md border px-2.5 py-0.5 font-mono text-[16px]"
        style={{ ...PANEL_BG, borderColor: `${color}80`, color }}>
        {children}
    </span>
);
