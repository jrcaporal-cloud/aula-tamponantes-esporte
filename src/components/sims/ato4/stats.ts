/**
 * Estatística mínima para o slide 66: distribuição t de Student (P bilateral) e o inverso por bisseção.
 * Serve para um cálculo ilustrativo: derivar o DP a partir do P = 0,07 publicado e ver o que mudaria com outro n.
 */

/** ln Γ(x) pela aproximação de Lanczos (g = 7). */
const lnGamma = (x: number): number => {
    const g = 7;
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
    const z = x - 1;
    let a = c[0];
    const t = z + g + 0.5;
    for (let i = 1; i < g + 2; i++) a += c[i] / (z + i);
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
};

const tPdf = (t: number, df: number): number =>
    Math.exp(lnGamma((df + 1) / 2) - lnGamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (t * t) / df));

/** P bilateral para a estatística t (integração de Simpson de 0 a |t|). */
export const twoSidedP = (t: number, df: number): number => {
    const x = Math.abs(t);
    const n = 400;
    const h = x / n;
    let s = tPdf(0, df) + tPdf(x, df);
    for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * tPdf(i * h, df);
    const half = (s * h) / 3;
    return Math.min(1, Math.max(0, 1 - 2 * half));
};

/** t tal que o P bilateral seja `p` (bisseção). */
export const tForP = (p: number, df: number): number => {
    let lo = 0;
    let hi = 20;
    for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (twoSidedP(mid, df) > p) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
};

export interface TwoGroupResult {
    se: number;
    t: number;
    p: number;
    lo: number;
    hi: number;
}

/** Diferença entre dois grupos com o mesmo DP: erro-padrão, t, P e IC95%. */
export const twoGroup = (diff: number, sd: number, n1: number, n2: number): TwoGroupResult => {
    const se = sd * Math.sqrt(1 / n1 + 1 / n2);
    const df = n1 + n2 - 2;
    const t = diff / se;
    const crit = tForP(0.05, df);
    return { se, t, p: twoSidedP(t, df), lo: diff - crit * se, hi: diff + crit * se };
};
