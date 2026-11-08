/** Estatística mínima para as simulações do Ato VI (funções puras, sem estado). */

export const mean = (xs: readonly number[]): number => xs.reduce((s, x) => s + x, 0) / Math.max(xs.length, 1);

/** Desvio-padrão amostral (n − 1). */
export const sd = (xs: readonly number[]): number => {
    if (xs.length < 2) return 0;
    const m = mean(xs);
    return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

/** Valor crítico bicaudal de t para α = 0,05 (expansão de Cornish–Fisher; erro < 0,01 para gl ≥ 3). */
export const tCrit95 = (df: number): number => {
    const z = 1.959964;
    const g1 = (z ** 3 + z) / 4;
    const g2 = (5 * z ** 5 + 16 * z ** 3 + 3 * z) / 96;
    const g3 = (3 * z ** 7 + 19 * z ** 5 + 17 * z ** 3 - 15 * z) / 384;
    return z + g1 / df + g2 / df ** 2 + g3 / df ** 3;
};

export interface StudyResult {
    /** Efeito observado no estudo (média das diferenças, em %). */
    observed: number;
    /** Meia-largura do IC95% (%). */
    halfCi: number;
    /** p < 0,05 a favor do suplemento. */
    winner: boolean;
}

/**
 * Um estudo cruzado: cada atleta faz suplemento e placebo; a diferença tem ruído √2 × CV.
 * `z` traz as normais já sorteadas para este estudo (uma por atleta).
 */
export const crossoverStudy = (z: readonly number[], n: number, cv: number, effect: number): StudyResult => {
    const diffs = z.slice(0, n).map(v => effect + Math.SQRT2 * cv * v);
    const m = mean(diffs);
    const se = sd(diffs) / Math.sqrt(n);
    const halfCi = tCrit95(n - 1) * se;
    return { observed: m, halfCi, winner: m - halfCi > 0 };
};

/** Diferenças individuais do mesmo estudo (para desenhar os atletas). */
export const crossoverDiffs = (z: readonly number[], n: number, cv: number, effect: number): number[] =>
    z.slice(0, n).map(v => effect + Math.SQRT2 * cv * v);
