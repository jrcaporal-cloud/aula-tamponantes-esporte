import { useEffect, useRef } from 'react';

export interface CarnoKeyActions {
    next: () => void;
    prev: () => void;
    togglePlay: () => void;
    /** Esc: solta a estrutura fixada; sem nada fixado, fecha. */
    escape: () => void;
    close: () => void;
}

/** Teclado do modal: ←/→ (e PageUp/PageDown) trocam de etapa, espaço reproduz, Esc solta ou fecha, 3 fecha. */
export const useCarnoKeys = (actions: CarnoKeyActions): void => {
    const latest = useRef(actions);
    useEffect(() => { latest.current = actions; });
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.target instanceof HTMLInputElement && e.target.type === 'range' && e.key.startsWith('Arrow')) return;
            const a = latest.current;
            if (['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); a.next(); }
            else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); a.prev(); }
            else if (e.key === ' ') { e.preventDefault(); a.togglePlay(); }
            else if (e.key === 'Escape') a.escape();
            else if (e.key === '3') a.close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
};
