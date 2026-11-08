import { motion } from 'framer-motion';

/**
 * A ideia da aula num traço: a mesma carga de ácido derruba o pH (laranja) ou é amortecida (ciano).
 * Sem números de propósito — é símbolo, não dado.
 */
const NO_BUFFER = 'M 10 26 C 90 26, 120 28, 170 40 S 260 98, 330 104 S 430 72, 510 48';
const BUFFER = 'M 10 26 C 90 26, 120 27, 170 33 S 260 54, 330 57 S 430 42, 510 32';

export const BufferWave = () => (
    <div className="flex items-center gap-6">
        <svg width={520} height={124} viewBox="0 0 520 124" aria-hidden className="overflow-visible">
            <line x1={10} y1={26} x2={510} y2={26} stroke="rgba(255,255,255,0.14)" strokeDasharray="4 6" />
            <text x={0} y={18} fill="#94a3b8" fontSize={15} fontFamily="'JetBrains Mono', monospace">pH</text>
            <motion.path
                d={NO_BUFFER}
                fill="none"
                stroke="#fb923c"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 2.2, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.6))' }}
            />
            <motion.path
                d={BUFFER}
                fill="none"
                stroke="#22d3ee"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.6, duration: 2.2, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.6))' }}
            />
        </svg>
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.4, duration: 0.6 }}
            className="flex flex-col gap-2 text-left text-[15px] text-gray-300"
        >
            <span className="flex items-center gap-2"><span className="w-5 h-[3px] rounded bg-orange-400" />sem tampão</span>
            <span className="flex items-center gap-2"><span className="w-5 h-[3px] rounded bg-cyan-400" />com tampão</span>
        </motion.div>
    </div>
);
