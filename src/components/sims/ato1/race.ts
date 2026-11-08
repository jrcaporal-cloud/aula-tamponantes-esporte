/**
 * Modelo da prova de Júlia (slide 10). Geometria real de uma pista de 400 m (reta 84,39 m, curva 115,61 m);
 * velocidade e pH são ILUSTRATIVOS: só os extremos do pH (7,08 em repouso, 6,60 na exaustão) vêm de SAHLIN1976.
 */

export const RACE_M = 800;
export const LAP_M = 400;
const STRAIGHT_M = 84.39;
const BEND_M = 115.61;
export const FINAL_STRETCH_FROM = 600;

export const PH_REST = 7.08;
export const PH_EXHAUSTION = 6.6;

export interface Point { x: number; y: number }

export interface TrackGeometry {
    cx: number;
    cy: number;
    /** pixels por metro */
    scale: number;
    /** meia-reta em px */
    half: number;
    /** raio da raia 1 em px */
    radius: number;
}

export const makeTrack = (cx: number, cy: number, scale: number): TrackGeometry => ({
    cx, cy, scale, half: (STRAIGHT_M * scale) / 2, radius: (BEND_M / Math.PI) * scale,
});

/**
 * Posição na pista a `d` metros da largada (que é a linha de chegada, fim da reta principal, embaixo à direita).
 * Sentido anti-horário visto de cima. `offset` afasta para fora (raias externas).
 */
export const pointAt = (t: TrackGeometry, d: number, offset = 0): Point => {
    const r = t.radius + offset;
    const u = ((d % LAP_M) + LAP_M) % LAP_M;
    const right = t.cx + t.half;
    const left = t.cx - t.half;
    if (u < BEND_M) {
        const a = Math.PI / 2 - (u / BEND_M) * Math.PI;
        return { x: right + r * Math.cos(a), y: t.cy + r * Math.sin(a) };
    }
    if (u < BEND_M + STRAIGHT_M) {
        return { x: right - ((u - BEND_M) / STRAIGHT_M) * 2 * t.half, y: t.cy - r };
    }
    if (u < 2 * BEND_M + STRAIGHT_M) {
        const a = -Math.PI / 2 - ((u - BEND_M - STRAIGHT_M) / BEND_M) * Math.PI;
        return { x: left + r * Math.cos(a), y: t.cy + r * Math.sin(a) };
    }
    return { x: left + ((u - 2 * BEND_M - STRAIGHT_M) / STRAIGHT_M) * 2 * t.half, y: t.cy + r };
};

/** Contorno de estádio (raia com afastamento `offset`). */
export const stadiumPath = (t: TrackGeometry, offset = 0): string => {
    const r = t.radius + offset;
    const l = t.cx - t.half;
    const rt = t.cx + t.half;
    return `M ${l} ${t.cy - r} L ${rt} ${t.cy - r} A ${r} ${r} 0 0 1 ${rt} ${t.cy + r} L ${l} ${t.cy + r} A ${r} ${r} 0 0 1 ${l} ${t.cy - r} Z`;
};

/** Os últimos 200 m: curva final + reta de chegada. */
export const finalStretchPath = (t: TrackGeometry, offset = 0): string => {
    const r = t.radius + offset;
    const l = t.cx - t.half;
    const rt = t.cx + t.half;
    return `M ${l} ${t.cy - r} A ${r} ${r} 0 0 0 ${l} ${t.cy + r} L ${rt} ${t.cy + r}`;
};

/** Velocidade ilustrativa (m/s): saída, ritmo que cede devagar e queda nos 200 m finais. */
export const speedAt = (d: number): number => {
    if (d <= 60) return 5.2 + 1.7 * Math.sqrt(Math.max(d, 0) / 60);
    if (d <= FINAL_STRETCH_FROM) return 6.9 - 0.75 * ((d - 60) / (FINAL_STRETCH_FROM - 60));
    const k = Math.min((d - FINAL_STRETCH_FROM) / (RACE_M - FINAL_STRETCH_FROM), 1);
    return 6.15 - 0.7 * Math.pow(k, 1.3);
};

/** pH muscular ilustrativo entre os extremos medidos por biópsia (SAHLIN1976). */
export const phAt = (d: number): number => {
    const k = Math.min(Math.max(d / RACE_M, 0), 1);
    return PH_REST - (PH_REST - PH_EXHAUSTION) * Math.pow(k, 1.8);
};

/** Tempo de prova acumulado (s) por metro, integrado uma vez. */
const TIME_TABLE: readonly number[] = (() => {
    const table = [0];
    for (let m = 1; m <= RACE_M; m++) table.push(table[m - 1] + 1 / speedAt(m - 0.5));
    return table;
})();

export const timeAt = (d: number): number => {
    const m = Math.min(Math.max(d, 0), RACE_M);
    const i = Math.floor(m);
    const next = TIME_TABLE[Math.min(i + 1, RACE_M)];
    return TIME_TABLE[i] + (next - TIME_TABLE[i]) * (m - i);
};

export const formatRaceTime = (s: number): string => {
    const min = Math.floor(s / 60);
    const sec = s - min * 60;
    return `${min}:${sec.toFixed(1).padStart(4, '0').replace('.', ',')}`;
};

/** Mistura duas cores hex (k = 0 → a, 1 → b). */
export const mixHex = (a: string, b: string, k: number): string => {
    const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
    const c = [0, 1, 2].map(i => Math.round(p(a, i) + (p(b, i) - p(a, i)) * Math.min(Math.max(k, 0), 1)));
    return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
};
