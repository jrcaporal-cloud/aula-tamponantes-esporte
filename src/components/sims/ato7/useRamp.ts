import { useEffect, useState } from 'react';

/**
 * Rampa de 0 a 1 ao montar (rAF). Com `reduce`, começa já em 1.
 * O setState roda dentro do callback do rAF, nunca durante o render.
 */
export const useRamp = (ms: number, reduce: boolean, delay = 0): number => {
    const [k, setK] = useState(reduce ? 1 : 0);
    useEffect(() => {
        if (reduce) return;
        let raf = 0;
        const start = performance.now() + delay;
        const tick = (now: number) => {
            const v = Math.min(Math.max((now - start) / ms, 0), 1);
            setK(v);
            if (v < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [ms, reduce, delay]);
    return k;
};
