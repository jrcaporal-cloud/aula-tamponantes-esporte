import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Contador que "roda" de 0 até `total` sempre que `runKey` muda (estudos caindo um a um).
 * Com movimento reduzido, chega direto ao total.
 */
export const useRunCounter = (runKey: string, total: number, ms = 1400): number => {
    const reduce = useReducedMotion() ?? false;
    const [state, setState] = useState({ key: runKey, shown: reduce ? total : 0 });
    useEffect(() => {
        if (reduce) {
            const raf = requestAnimationFrame(() => setState({ key: runKey, shown: total }));
            return () => cancelAnimationFrame(raf);
        }
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const k = Math.min((now - start) / ms, 1);
            setState({ key: runKey, shown: Math.round(total * k) });
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [runKey, total, ms, reduce]);
    return state.key === runKey ? state.shown : 0;
};
