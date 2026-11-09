/**
 * Tokens de movimento da aula (método Emil Kowalski): poucas curvas e durações, iguais em todos os slides.
 * Regra de ouro do palco: tudo o que um clique dispara termina em até ~1,2 s — o passador nunca espera.
 */

/** Entradas, revelações, barras: arranca rápido e pousa devagar. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Mudanças dentro da tela (ponteiro, chip que troca de lugar, curva sendo desenhada). */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** Durações em segundos, por papel. */
export const DUR = { exit: 0.18, text: 0.25, enter: 0.3, morph: 0.45, bar: 0.6, draw: 0.9 } as const;

export const STAGGER = 0.08;
export const STAGGER_CAP = 0.4;

/** Atraso escalonado com teto: listas longas não fazem o último item esperar. */
export const stagger = (i: number, base = 0, step = STAGGER): number => base + Math.min(i * step, STAGGER_CAP);
