import { useEffect, useRef } from 'react';

export interface FiberKeyActions {
    next: () => void;
    prev: () => void;
    /** Esc: solta a estrutura fixada; sem nada fixado, fecha. */
    escape: () => void;
    close: () => void;
}

/**
 * Teclado do modal, capturado antes da aula (fase de captura + stopPropagation): ←/→, PageUp/PageDown
 * e ↑/↓ trocam de etapa, Esc solta ou fecha, 3 fecha. Com o controle deslizante focado, as setas são
 * dele. Com Ctrl, Cmd ou Alt nada é capturado (atalhos do navegador).
 */
export const useFiberKeys = (actions: FiberKeyActions): void => {
    const latest = useRef(actions);
    useEffect(() => { latest.current = actions; });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const a = latest.current;
            const inSlider = e.target instanceof HTMLInputElement && e.target.type === 'range';
            const fwd = ['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key);
            const back = ['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key);
            if ((fwd || back) && inSlider) { e.stopPropagation(); return; }
            if (fwd) a.next();
            else if (back) a.prev();
            else if (e.key === 'Escape') a.escape();
            else if (e.key === '3') a.close();
            else return;
            e.preventDefault();
            e.stopPropagation();
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, []);
};
