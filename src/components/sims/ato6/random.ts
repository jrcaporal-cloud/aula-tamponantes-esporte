/**
 * Gerador pseudoaleatório com semente (mulberry32) e normal padrão (Box–Muller).
 * Mesma semente → mesmos "estudos" em qualquer computador ou projetor.
 */

export type Rand = () => number;

export const mulberry32 = (seed: number): Rand => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/** Fábrica de normais N(0,1) a partir de um gerador uniforme. */
export const gaussian = (rand: Rand): (() => number) => () => {
    const u = Math.max(rand(), 1e-12);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** Matriz linhas × colunas de normais padrão, sempre a mesma para a mesma semente. */
export const normalMatrix = (seed: number, rows: number, cols: number): readonly (readonly number[])[] => {
    const z = gaussian(mulberry32(seed));
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => z()));
};
