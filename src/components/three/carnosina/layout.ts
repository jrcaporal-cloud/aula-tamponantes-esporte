/*
 * Mapa da cena: as sete estações (uma por etapa) ficam enfileiradas no eixo x, longe o bastante
 * para a névoa esconder a vizinha. A câmera viaja de uma para a outra.
 */

export type Vec3 = readonly [number, number, number];

export const STATION_GAP = 70;
export const STATION_COUNT = 7;
/** Centro x da estação da etapa `i`. */
export const stationX = (i: number) => (i - (STATION_COUNT - 1) / 2) * STATION_GAP;

/** Soma um deslocamento local ao centro da estação. */
export const at = (i: number, dx: number, dy: number, dz: number): [number, number, number] => [stationX(i) + dx, dy, dz];

export const STATION = {
    gut: 0,
    blood: 1,
    membrane: 2,
    synthesis: 3,
    tank: 4,
    buffer: 5,
    skin: 6,
} as const;

/** Tanque da etapa 5: altura, raio e fundo; FULL = conteúdo (× basal) que enche até a boca. */
export const TANK = { H: 9, R: 3, BOTTOM: -4.6, FULL: 2.5 } as const;
/** Altura do nível para um conteúdo relativo ao basal. */
export const levelY = (ratio: number) => TANK.BOTTOM + (TANK.H * Math.min(ratio, TANK.FULL)) / TANK.FULL;
