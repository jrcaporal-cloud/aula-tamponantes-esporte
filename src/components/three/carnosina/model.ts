/*
 * Contas das simulações do modelo (funções puras). Tudo o que não é número de estudo é forma de
 * curva ilustrativa e aparece rotulado na tela. Fontes: docs/dossie/02-beta-alanina.md.
 */

/** pKa do anel imidazol da carnosina (SALE2010). */
export const PKA_IMIDAZOL = 6.83;

/** ED50 da carga de carnosina em dose cumulativa, em gramas (REZENDE2020). */
export const ED50_G = 377;
/**
 * Curva ilustrativa da carga: hipérbole ajustada por mínimos quadrados aos quatro pontos medidos de
 * HARRIS2006 e HILL2007 (LOAD_POINTS). O ED50 de Rezende (377 g) vem de outra escala e outro conjunto de
 * estudos: entra no texto como achado, não desenha a curva — senão a curva contradiria os pontos ao lado.
 */
const FIT_ED50_G = 120;
const EMAX_PCT = 104;
/** Queda ilustrativa ao parar (pontos percentuais por semana): devolve ao basal em 6–15 semanas (BAGUET2009; STELLINGWERFF2012). */
export const WASHOUT_PP_WEEK = 5.5;

/** Pontos medidos que a curva ilustrativa precisa respeitar (g acumulados → % de carnosina). */
export const LOAD_POINTS = [
    { g: 89.6, pct: 42.1, src: 'Harris 2006 · 3,2 g/d × 4 sem' },
    { g: 145.6, pct: 58.8, src: 'Hill 2007 · 4 sem' },
    { g: 179.2, pct: 64.2, src: 'Harris 2006 · 6,4 g/d × 4 sem' },
    { g: 414.4, pct: 80.1, src: 'Hill 2007 · 10 sem' },
] as const;

/** Ganho de carnosina (% acima do basal) para uma dose acumulada em gramas — modelo ilustrativo. */
export const loadingGain = (grams: number) => (EMAX_PCT * Math.max(grams, 0)) / (FIT_ED50_G + Math.max(grams, 0));

export interface LoadPlan { gpd: number; weeks: number }

/** Semanas até voltar ao basal depois de parar (mesmo modelo ilustrativo). */
export const washoutWeeks = (plan: LoadPlan) => loadingGain(plan.gpd * 7 * plan.weeks) / WASHOUT_PP_WEEK;

/** Ganho na semana `w`: sobe enquanto toma, cai devagar depois de parar. */
export const gainAtWeek = (w: number, plan: LoadPlan) => {
    if (w <= plan.weeks) return loadingGain(plan.gpd * 7 * w);
    const stop = loadingGain(plan.gpd * 7 * plan.weeks);
    return Math.max(stop - WASHOUT_PP_WEEK * (w - plan.weeks), 0);
};

/** Eixo do gráfico de carga: semanas 0–40 (cabe 24 sem de uso + a volta ao basal). */
export const WEEK_AXIS = 40;
const LOAD_LOOP_S = 12;
/** Semana mostrada no instante `sec` (o cursor percorre o eixo em 12 s e recomeça). */
export const playWeek = (sec: number) => ((sec % LOAD_LOOP_S) / LOAD_LOOP_S) * WEEK_AXIS;

/** Fração do imidazol protonado num pH (Henderson–Hasselbalch, pKa 6,83). */
export const protonatedFraction = (pH: number) => 1 / (1 + 10 ** (pH - PKA_IMIDAZOL));

const PH_LOOP_S = 10;
/** pH ilustrativo do sarcoplasma em exercício: desce de 7,1 a 6,5 e volta, num ciclo de 10 s. */
export const autoPh = (sec: number) => {
    const u = (sec % PH_LOOP_S) / PH_LOOP_S;
    const k = u < 0.6 ? u / 0.6 : 1 - (u - 0.6) / 0.4;
    const s = k * k * (3 - 2 * k);
    return 7.1 - 0.6 * s;
};

export type Release = 'pura' | 'lenta';

/**
 * β-alanina plasmática (µM) depois de 1,6 g: picos de DECOMBAZ2012 (248 µM em 0,5 h pura; 82 µM em
 * 1,0 h liberação lenta). A forma entre os pontos é ilustrativa, com área sob a curva igual nas duas.
 */
export const PEAK = { pura: { c: 248, t: 0.5, k: 4 }, lenta: { c: 82, t: 1, k: 1.83 } } as const;
export const plasma = (h: number, mode: Release) => {
    if (h <= 0) return 0;
    const p = PEAK[mode];
    const x = h / p.t;
    return p.c * x ** p.k * Math.exp(p.k * (1 - x));
};

/** Limiar do formigamento no gráfico — ilustrativo (nenhuma fonte fixa um valor em µM). */
export const ITCH_THRESHOLD = 130;
export const HOUR_AXIS = 4;
const PLASMA_LOOP_S = 11;
/** Hora mostrada no instante `sec` (o cursor percorre 0–4 h em 11 s). */
export const playHour = (sec: number) => ((sec % PLASMA_LOOP_S) / PLASMA_LOOP_S) * HOUR_AXIS;

/** Intensidade de disparo do neurônio (0–1) pelo excesso acima do limiar. */
export const firing = (h: number, mode: Release) => Math.min(Math.max((plasma(h, mode) - ITCH_THRESHOLD) / 110, 0), 1);

/** Meia-vida plasmática (min) — DEJAGER2023. */
export const HALF_LIFE = { carnosina: 1.2, balenina: 34.9 } as const;

/** Um formatador por número de casas (o HUD formata a cada quadro; criar o Intl a cada chamada custa caro). */
const BR_FMT = new Map<number, Intl.NumberFormat>();
/** Formatação brasileira com casas fixas. */
export const br = (x: number, d = 0) => {
    let f = BR_FMT.get(d);
    if (!f) {
        f = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
        BR_FMT.set(d, f);
    }
    return f.format(x);
};
