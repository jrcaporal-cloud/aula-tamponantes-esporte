import { gaussian, mulberry32 } from './random';
import { tCrit95 } from './stats';

/** Meta-análise de efeitos aleatórios (DerSimonian–Laird) sobre estudos simulados. Funções puras. */

export interface MetaStudy {
    id: number;
    effect: number;
    se: number;
    published: boolean;
}

export interface MetaResult {
    mean: number;
    se: number;
    ciLo: number;
    ciHi: number;
    piLo: number;
    piHi: number;
    tau: number;
    i2: number;
}

export const randomEffects = (studies: readonly MetaStudy[]): MetaResult => {
    const k = studies.length;
    const w = studies.map(s => 1 / s.se ** 2);
    const sw = w.reduce((a, b) => a + b, 0);
    const fixed = studies.reduce((a, s, i) => a + w[i] * s.effect, 0) / sw;
    const q = studies.reduce((a, s, i) => a + w[i] * (s.effect - fixed) ** 2, 0);
    const c = sw - w.reduce((a, b) => a + b * b, 0) / sw;
    const tau2 = Math.max((q - (k - 1)) / c, 0);
    const wr = studies.map(s => 1 / (s.se ** 2 + tau2));
    const swr = wr.reduce((a, b) => a + b, 0);
    const mean = studies.reduce((a, s, i) => a + wr[i] * s.effect, 0) / swr;
    const se = Math.sqrt(1 / swr);
    const half = Math.max(k - 2, 1);
    const pi = tCrit95(half) * Math.sqrt(tau2 + se ** 2);
    return {
        mean, se,
        ciLo: mean - 1.96 * se, ciHi: mean + 1.96 * se,
        piLo: mean - pi, piHi: mean + pi,
        tau: Math.sqrt(tau2),
        i2: q > 0 ? Math.max((q - (k - 1)) / q, 0) : 0,
    };
};

/** Estudos pequenos de uma área: efeito verdadeiro varia entre cenários (tau) e cada estudo tem seu erro. */
export const simulateArea = (seed: number, k: number, mu: number, tau: number, seMin: number, seMax: number): MetaStudy[] => {
    const rand = mulberry32(seed);
    const z = gaussian(rand);
    return Array.from({ length: k }, (_, id) => {
        const se = seMin + (seMax - seMin) * rand();
        const effect = mu + tau * z() + se * z();
        return { id, effect, se, published: true };
    });
};

/** Viés de publicação: estudo grande sai sempre; pequeno só sai se for "significativo" (ou por sorte). */
export const filterPublication = (seed: number, studies: readonly MetaStudy[], seCut: number, luck: number): MetaStudy[] => {
    const rand = mulberry32(seed);
    return studies.map(s => {
        const significant = s.effect - 1.96 * s.se > 0;
        const draw = rand();
        return { ...s, published: s.se < seCut || significant || draw < luck };
    });
};
