/**
 * Geometria do quadro do slide 13: 7 capítulos em zigue-zague (4 em cima, 3 embaixo voltando)
 * e a vaga do "prêmio" no canto inferior esquerdo. Os fios ligam a lateral de uma carta à da seguinte.
 */

export const BOARD_W = 1136;
export const BOARD_H = 464;
export const CARD_W = 232;
export const CARD_H = 178;

const GAP_X = (BOARD_W - 4 * CARD_W) / 3;
const ROW_Y = [10, 276] as const;
const colX = (c: number) => c * (CARD_W + GAP_X);

export interface Slot { x: number; y: number }

/** Ordem do inquérito: I II III IV (ida) · V VI VII (volta) · prêmio. */
export const SLOTS: readonly Slot[] = [
    { x: colX(0), y: ROW_Y[0] }, { x: colX(1), y: ROW_Y[0] }, { x: colX(2), y: ROW_Y[0] }, { x: colX(3), y: ROW_Y[0] },
    { x: colX(3), y: ROW_Y[1] }, { x: colX(2), y: ROW_Y[1] }, { x: colX(1), y: ROW_Y[1] }, { x: colX(0), y: ROW_Y[1] },
];

export interface StringPath { d: string; from: { x: number; y: number }; to: { x: number; y: number } }

/** Fio entre a carta i e a i+1, com barriga (gravidade) proporcional ao vão. */
export const stringBetween = (i: number): StringPath => {
    const a = SLOTS[i];
    const b = SLOTS[i + 1];
    let from: { x: number; y: number };
    let to: { x: number; y: number };
    if (a.y === b.y) {
        const goingRight = b.x > a.x;
        from = { x: goingRight ? a.x + CARD_W - 6 : a.x + 6, y: a.y + 34 };
        to = { x: goingRight ? b.x + 6 : b.x + CARD_W - 6, y: b.y + 34 };
    } else {
        from = { x: a.x + CARD_W / 2, y: a.y + CARD_H - 6 };
        to = { x: b.x + CARD_W / 2, y: b.y + 6 };
    }
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const sag = a.y === b.y ? 26 : 0;
    const bow = a.y === b.y ? 0 : 22;
    return { d: `M ${from.x} ${from.y} Q ${mx + bow} ${my + sag} ${to.x} ${to.y}`, from, to };
};

/** Faixa livre entre as duas fileiras, à esquerda do fio vertical IV→V: onde entra a pergunta final. */
export const BANNER = { x: 0, y: ROW_Y[0] + CARD_H + 14, w: colX(3) - 24, h: ROW_Y[1] - ROW_Y[0] - CARD_H - 28 };
