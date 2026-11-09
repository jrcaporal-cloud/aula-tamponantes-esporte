import { motion } from 'framer-motion';
import type { SlideSchema } from './TitleSlide';
import { renderSlideContent } from './slideContent';
import { SlideHeader } from './SlideHeader';
import { DUR, EASE_OUT } from '../../lib/motion';

/** `section` é a seção herdada do deck (o JSON só a declara no 1º slide de cada uma); colore a barra do título. */
export const ProseSlide = ({ slide, section }: { slide: SlideSchema; section?: string }) => {
    return (
        <div className="w-full flex flex-col justify-center py-4 px-8 relative z-10 max-w-[1200px] mx-auto">

            <SlideHeader title={slide.title} subtitle={slide.subtitle} section={section} />

            {/* Conteúdo / componente. O que vem depois do simulador (as fontes) fica recolhido atrás da tecla D. */}
            {slide.content && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: DUR.enter, delay: 0.05, ease: EASE_OUT }}
                    className="prose prose-invert prose-p:text-gray-200 prose-headings:font-display prose-headings:text-white max-w-none prose-xl w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] custom-presentation-content pointer-events-auto"
                >
                    {renderSlideContent(slide.content, { collapseAfter: true })}
                </motion.div>
            )}
        </div>
    );
};
