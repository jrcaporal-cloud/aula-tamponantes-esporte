import { motion } from 'framer-motion';

/* Véu de carga: escondido por 250 ms (se montar rápido, ninguém vê) e some quando o 1º quadro sai. */
export const LoadingVeil = ({ reduced }: { reduced: boolean }) => (
    <motion.div role="status" aria-live="polite"
        className="absolute inset-0 z-[44] flex flex-col items-center justify-center gap-5 bg-[#05040f] pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.4, delay: 0.25 }}>
        <motion.span aria-hidden className="w-7 h-7 rounded-full bg-violet-400 shadow-[0_0_28px_rgba(167,139,250,0.7)]"
            animate={reduced ? undefined : { scale: [1, 1.25, 1] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
        <p className="text-[14px] font-mono tracking-wider text-violet-200/90">Montando a fibra…</p>
    </motion.div>
);
