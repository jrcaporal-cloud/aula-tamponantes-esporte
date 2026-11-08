import { useEffect, useRef } from 'react';

export interface JourneyKeyActions {
    next: () => void;
    prev: () => void;
    togglePlay: () => void;
    /** Esc: solta a estrutura fixada; sem nada fixado, fecha. */
    escape: () => void;
    close: () => void;
}

/**
 * Teclado do modal: setas / PageUp / PageDown trocam de etapa, espaço reproduz, Esc solta ou fecha,
 * 3 fecha. Com Ctrl, Cmd ou Alt nada é capturado; com o foco num slider as setas movem o slider
 * (o modal tira o foco dos controles ao soltar o mouse, para o passador voltar a trocar etapas).
 */
export const useJourneyKeys = (actions: JourneyKeyActions): void => {
    const latest = useRef(actions);
    useEffect(() => { latest.current = actions; });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const a = latest.current;
            const inInput = e.target instanceof HTMLInputElement;
            if (!inInput && ['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); a.next(); }
            else if (!inInput && ['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); a.prev(); }
            else if (e.key === ' ') { e.preventDefault(); a.togglePlay(); }
            else if (e.key === 'Escape') a.escape();
            else if (e.key === '3') a.close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
};
