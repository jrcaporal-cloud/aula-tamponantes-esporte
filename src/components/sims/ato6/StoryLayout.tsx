import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Panel } from '../kit/ui';
import { Narration, Src } from './ui';

interface StoryLayoutProps {
    step: number;
    /** Chave do desenho: passos que só acrescentam camadas mantêm a mesma e não piscam. */
    visualKey?: number | string;
    headline: string;
    text: string;
    source: string;
    /** Cor do destaque do passo (borda do desenho e manchete). */
    tone?: string;
    headlineColor?: string;
    /** Peça extra na coluna de texto, entre a narração e a fonte. */
    aside?: ReactNode;
    children: ReactNode;
}

/** Desenho do passo à esquerda (caixa fixa), narração e fonte à direita. */
export const StoryLayout = ({ step, visualKey, headline, text, source, tone = C.base, headlineColor = C.baseSoft, aside, children }: StoryLayoutProps) => (
    <div className="h-full flex gap-3">
        <Panel className="shrink-0" state="active" glow={tone}>
            <motion.div key={visualKey ?? step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }}>
                {children}
            </motion.div>
        </Panel>
        <Panel className="flex-1 min-w-0 p-5 flex flex-col gap-3">
            <Narration stepKey={step} headline={headline} text={text} color={headlineColor} />
            {aside}
            <div className="mt-auto"><Src>{source}</Src></div>
        </Panel>
    </div>
);
