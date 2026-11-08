import { useEffect, useRef, useState } from 'react';
import { speedAt } from './race';

/**
 * Leva a corredora até `target` metros andando na velocidade do modelo × `rate` (metros de prova por
 * segundo de relógio ÷ velocidade). Assim ela desacelera de verdade na reta final. Voltar de passo
 * (alvo menor) ou movimento reduzido: salta direto para o alvo. `catchUp`: trecho inicial em ritmo rápido.
 */
export const useRaceDistance = (target: number, rate: number, reduce: boolean, catchUp?: { until: number; rate: number }): number => {
    const catchUntil = catchUp?.until ?? 0;
    const catchRate = catchUp?.rate ?? rate;
    const [distance, setDistance] = useState(0);
    const ref = useRef(0);

    useEffect(() => {
        if (reduce || target <= ref.current) {
            ref.current = target;
            const raf = requestAnimationFrame(() => setDistance(target));
            return () => cancelAnimationFrame(raf);
        }
        let raf = 0;
        let last = performance.now();
        const tick = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.1);
            last = now;
            // Se o professor avançou antes da hora, corre até `until` no ritmo rápido e só então desacelera.
            const k = ref.current < catchUntil ? catchRate : rate;
            const next = Math.min(ref.current + speedAt(ref.current) * k * dt, target);
            ref.current = next;
            setDistance(next);
            if (next < target) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, rate, reduce, catchUntil, catchRate]);

    return distance;
};
