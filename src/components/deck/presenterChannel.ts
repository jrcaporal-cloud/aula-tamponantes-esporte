/**
 * Canal entre a janela da aula (projetor) e a janela do apresentador (notebook).
 * BroadcastChannel funciona entre janelas da mesma origem, sem servidor.
 */
export const PRESENTER_CHANNEL = 'aula-doping-apresentador';

/** `board`: título do quadro do inquérito quando ele está na tela (entre atos ou na tecla Q). */
export type DeckState = { type: 'state'; index: number; step: number; stepCount: number; board?: string | null };
export type PresenterCommand =
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goto'; index: number }
    | { type: 'hello' };

export type PresenterMessage = DeckState | PresenterCommand;

export const openPresenterWindow = (index: number) => {
    const tempo = new URLSearchParams(window.location.search).get('tempo');
    const url = `${window.location.pathname}?apresentador${tempo ? `&tempo=${tempo}` : ''}#/${index + 1}`;
    // A conversa entre as janelas é toda pelo BroadcastChannel: a do apresentador não precisa de `window.opener`.
    // Corta a referência depois de abrir (em vez de 'noopener' nas features), para manter a janela nomeada
    // reaproveitada a cada P e o tamanho de popup — 'noopener' abre janela nova e pode ignorar width/height.
    const presenter = window.open(url, 'aula-apresentador', 'width=1280,height=800');
    if (presenter) presenter.opener = null;
};
