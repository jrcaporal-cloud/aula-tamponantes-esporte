import { motion } from 'framer-motion';

interface SlideHeaderProps {
    title: string;
    subtitle?: string | null;
}

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Cabeçalho único de todos os slides: barra vermelha à esquerda, título e subtítulo. */
export const SlideHeader = ({ title, subtitle }: SlideHeaderProps) => {
    const sub = subtitle ? tidy(subtitle) : '';
    return (
        <div className="mb-6 border-l-4 border-brand-deep pl-7 pointer-events-none">
            <motion.h2
                initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.9rem] leading-[1.06] font-display font-semibold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
                {tidy(title)}
            </motion.h2>
            {sub && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-2 text-[1.45rem] leading-snug text-brand-accent font-light max-w-4xl drop-shadow-md"
                >
                    {sub}
                </motion.p>
            )}
        </div>
    );
};
