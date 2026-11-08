import { useEffect, useRef, useState } from 'react';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Leva um número (ou vetor de números) até o alvo com transição suave sempre que o alvo muda.
 * Parte de onde estiver: trocar de passo no meio da transição não dá salto. Com `reduce`, chega de uma vez.
 */
export const useTween = (target: number, reduce: boolean, ms = 700): number => {
    const [value, setValue] = useState(target);
    const ref = useRef(target);
    useEffect(() => {
        const from = ref.current;
        const duration = reduce ? 0 : ms;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const k = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
            const v = from + (target - from) * easeInOut(k);
            ref.current = v;
            setValue(v);
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, reduce, ms]);
    return value;
};
