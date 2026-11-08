import { useEffect, useRef } from 'react';

/* Utilitários dos painéis flutuantes (HUD). */

/** Chama `cb(segundos)` a cada quadro enquanto montado — escrita direta no DOM, sem estado React. */
export const useRaf = (cb: (sec: number) => void) => {
    const latest = useRef(cb);
    useEffect(() => { latest.current = cb; });
    useEffect(() => {
        let id = 0;
        const loop = () => {
            latest.current(performance.now() / 1000);
            id = requestAnimationFrame(loop);
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, []);
};

/** Converte uma série de pontos em `d` de path SVG. */
export const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
