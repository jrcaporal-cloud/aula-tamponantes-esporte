import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import type { SlideSchema } from './TitleSlide';
import { EASE_OUT } from '../../lib/motion';

/** Ilustração própria de algumas citações (por id do JSON); as demais usam o traço de cor. */
const QUOTE_ILLUSTRATIONS: Record<number, ComponentType> = {};

/**
 * Slides sem título (citação de transição e encerramento): o texto do JSON vira
 * a peça central, em tipografia grande, em vez de cair no layout de texto corrido.
 */
export const QuoteSlide = ({ slide }: { slide: SlideSchema }) => {
    const Illustration = QUOTE_ILLUSTRATIONS[slide.id];
    return (
    <div className="quote-slide w-full min-h-[560px] flex flex-col items-center justify-center text-center px-16 relative z-10">
        {Illustration ? (
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT }}
                className="mb-8"
            >
                <Illustration />
            </motion.div>
        ) : (
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="w-[3px] h-16 mb-10 rounded-full origin-top"
                style={{ background: 'linear-gradient(180deg, #22d3ee, #fb923c 60%, transparent)' }}
            />
        )}
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="max-w-5xl"
            dangerouslySetInnerHTML={{ __html: slide.content }}
        />
    </div>
    );
};
