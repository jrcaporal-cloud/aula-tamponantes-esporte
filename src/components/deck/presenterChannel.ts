/**
 * Canal entre a janela da aula (projetor) e a janela do apresentador (notebook).
 * BroadcastChannel funciona entre janelas da mesma origem, sem servidor.
 */
export const PRESENTER_CHANNEL = 'aula-doping-apresentador';

export type DeckState = { type: 'state'; index: number; step: number; stepCount: number };
export type PresenterCommand =
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goto'; index: number }
    | { type: 'hello' };

export type PresenterMessage = DeckState | PresenterCommand;

export const openPresenterWindow = (index: number) => {
    const tempo = new URLSearchParams(window.location.search).get('tempo');
    const url = `${window.location.pathname}?apresentador${tempo ? `&tempo=${tempo}` : ''}#/${index + 1}`;
    window.open(url, 'aula-apresentador', 'width=1280,height=800');
};
