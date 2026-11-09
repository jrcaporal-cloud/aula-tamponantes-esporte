import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BicarbonateMark } from './title/BicarbonateMark';
import { BufferWave } from './title/BufferWave';
import { ASSEMBLE_REVEAL_S, TitleAssemble } from './title/TitleAssemble';
import { DUR, EASE_OUT } from '../../lib/motion';

// We'll define the interface inline to avoid issues
interface SlideCard {
    type: string;
    title: string;
    attributes: string[];
    rawHtml: string;
}

export interface SlideSchema {
    id: number;
    sectionName: string;
    number: string;
    layout: string;
    title: string;
    subtitle: string;
    content: string;
    cards: SlideCard[];
}

/** Tempo total da dica do passador na tela: entra em 0,8 s, fica, e sai nos últimos 0,6 s. */
const HINT_S = 6.8;

export const TitleSlide = ({ slide }: { slide: SlideSchema }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    // Abertura: as partículas montam o título; o resto da capa entra depois delas.
    const assemble = !useReducedMotion();
    const after = assemble ? ASSEMBLE_REVEAL_S : 0;
    return (
        <div ref={rootRef} className="w-full h-[660px] flex flex-col items-center justify-center text-center px-4 relative z-10">
            {/* Marca d'água deslocada só até a borda do slide (1200): não vaza e não é cortada pela tela em 4:3. */}
            <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_65%)]" />
                <BicarbonateMark className="w-[700px] max-w-none opacity-[0.2] translate-x-[248px] -translate-y-[80px] rotate-[8deg]" />
            </div>
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-brand-accent font-display tracking-[0.3em] text-base uppercase mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            >
                {slide.number.trim() || 'Aula'}
            </motion.p>
            {assemble && <TitleAssemble rootRef={rootRef} titleRef={titleRef} />}
            <motion.h1
                ref={titleRef}
                // Só esmaece, nos dois casos: com a montagem as letras caem onde as partículas estão;
                // com movimento reduzido (sem montagem) não há escala nem desfoque — só a opacidade muda.
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: after, duration: assemble ? 0.7 : DUR.enter, ease: EASE_OUT }}
                className="relative z-10 text-8xl font-display leading-[1.02] font-bold tracking-tight text-slate-50 mb-7 max-w-5xl drop-shadow-2xl"
            >
                {slide.title}
            </motion.h1>
            {/* Traço de largura fixa que se abre do centro (scaleX): sem animar largura. */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.5 + after, duration: DUR.draw, ease: EASE_OUT }}
                className="h-[2px] w-24 origin-center bg-gradient-to-r from-transparent via-brand-deep to-transparent mb-7"
            />
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.7 + after, duration: 0.8 }}
                className="text-[1.75rem] leading-snug text-gray-300 font-light max-w-3xl drop-shadow-md"
            >
                {slide.subtitle.replace(/\s+/g, ' ')}
            </motion.p>
            <div className="mt-10">
                <BufferWave />
            </div>
            {/* Dica para quem apresenta, mas aparece na projeção: fica ~6 s e some sozinha. */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ delay: 1.5 + after, duration: HINT_S, times: [0, 0.8 / HINT_S, (HINT_S - 0.6) / HINT_S, 1], ease: EASE_OUT }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-400"
            >
                <kbd className="deck-kbd">→</kbd>
                <span className="text-sm tracking-[0.25em] uppercase">avance com as setas ou o passador</span>
            </motion.div>
        </div>
    );
};
