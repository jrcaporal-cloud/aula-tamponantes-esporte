import { useEffect, useMemo, useState } from 'react';
import { countAt, easeOutCubic, parseNumbers } from './countParts';

export interface CountUpOptions {
    /** Espera antes de começar, em segundos (para casar com a barra ou o ponto que entra junto). */
    delay?: number;
    /** Duração da contagem, em segundos. */
    duration?: number;
    /** Só conta quando `run` fica verdadeiro (ex.: a linha do gráfico aparece neste passo). */
    run?: boolean;
}

/**
 * Devolve o texto com os números subindo de zero até o valor. Recomeça quando o texto muda ou `run` liga.
 * Com movimento reduzido (ou parado), devolve o texto pronto.
 */
export const useCountUp = (text: string, reduce: boolean, { delay = 0, duration = 0.9, run = true }: CountUpOptions = {}): string => {
    const parts = useMemo(() => parseNumbers(text), [text]);
    const key = `${text}|${run}`;
    // O progresso guarda a chave da contagem: quando ela muda, o render já parte do zero (sem piscar o valor final).
    const [progress, setProgress] = useState({ key: '', k: 0 });
    const active = run && !reduce;

    useEffect(() => {
        if (!active) return undefined;
        const start = performance.now() + delay * 1000;
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
            setProgress({ key, k: easeOutCubic(t) });
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [key, active, delay, duration]);

    if (!active) return text;
    return countAt(parts, progress.key === key ? progress.k : 0);
};
