import { motion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../lib/motion';
import { CHAPTERS } from '../sims/ato1/content';
import { actOfSection } from '../deck/inquiry';

interface SlideHeaderProps {
    title: string;
    subtitle?: string | null;
    /** Seção herdada do slide ("Ato III · …"): a barra do título ganha a cor do ato. */
    section?: string;
}

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim();

/**
 * Cabeçalho único de todos os slides: barra na cor do ato à esquerda, título e subtítulo.
 * Só esmaece (sem deslocar nem desfocar): o slide inteiro já sobe 16 px na troca, o título não precisa de outra entrada.
 */
export const SlideHeader = ({ title, subtitle, section }: SlideHeaderProps) => {
    const sub = subtitle ? tidy(subtitle) : '';
    const actColor = section ? CHAPTERS[actOfSection(section)]?.color : undefined;
    return (
        <div className="mb-6 border-l-4 border-brand-deep pl-7 pointer-events-none" style={actColor ? { borderLeftColor: actColor } : undefined}>
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DUR.text, ease: EASE_OUT }}
                className="text-[2.9rem] leading-[1.06] font-display font-semibold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
                {tidy(title)}
            </motion.h2>
            {sub && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05, duration: DUR.text, ease: EASE_OUT }}
                    className="mt-2 text-[1.45rem] leading-snug text-gray-300 font-light max-w-4xl drop-shadow-md"
                >
                    {sub}
                </motion.p>
            )}
        </div>
    );
};
