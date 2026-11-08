import { useEffect } from 'react';

/** Evento global da tecla D: abre/fecha o texto de apoio recolhido do slide. */
export const DETAILS_EVENT = 'deck:details';

export const toggleDetails = () => window.dispatchEvent(new Event(DETAILS_EVENT));

/** Chama `onToggle` quando o professor aperta D (ou clica no botão de detalhamento). */
export const useDetailsToggle = (onToggle: () => void, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        window.addEventListener(DETAILS_EVENT, onToggle);
        return () => window.removeEventListener(DETAILS_EVENT, onToggle);
    }, [onToggle, enabled]);
};
