/**
 * Modelo ilustrativo da carga de carnosina (slide 62).
 * Forma: Emax com dose cumulativa e ED50 = 377 g (Rezende 2020) → fração do teto = D / (ED50 + D).
 * Washout: queda de velocidade constante, calibrada para voltar à linha de base em ~9 semanas
 * depois de uma carga como a de Baguet 2009 (4,8 g/dia por ~5,5 semanas). É um desenho didático, não uma previsão.
 */

export const ED50_G = 377;
/** Mediana de β-alanina total na meta-análise de Hobson 2012. */
export const HOBSON_G = 179;
/** Fração da β-alanina engolida que vira carnosina muscular (Stegen 2013). */
export const INCORPORATION = 0.03;
/** Teto do rótulo brasileiro (IN 28, Anvisa). */
export const BRAZIL_CAP_G = 2;
export const X_MAX_WEEKS = 32;

export const fractionOfMax = (grams: number): number => (grams <= 0 ? 0 : grams / (ED50_G + grams));

const BAGUET_LOAD_G = 4.8 * 7 * 5.5;
const BAGUET_RETURN_WEEKS = 9;
const WASHOUT_PER_WEEK = fractionOfMax(BAGUET_LOAD_G) / BAGUET_RETURN_WEEKS;

/** Dose acumulada (g) depois de `weeks` semanas a `dosePerDay` g/dia. */
export const cumulativeGrams = (dosePerDay: number, weeks: number): number => dosePerDay * 7 * weeks;

/** Fração do teto (0–1) na semana `week`, carregando por `weeksOn` semanas e, se `washout`, parando depois. */
export const gainAt = (week: number, dosePerDay: number, weeksOn: number): number => {
    if (week <= weeksOn) return fractionOfMax(cumulativeGrams(dosePerDay, week));
    const atStop = fractionOfMax(cumulativeGrams(dosePerDay, weeksOn));
    return Math.max(0, atStop - WASHOUT_PER_WEEK * (week - weeksOn));
};

/** Semanas para a carnosina voltar à linha de base depois de parar (no modelo). */
export const weeksToBaseline = (dosePerDay: number, weeksOn: number): number =>
    fractionOfMax(cumulativeGrams(dosePerDay, weeksOn)) / WASHOUT_PER_WEEK;

/** Dias para somar `grams` de β-alanina. */
export const daysToReach = (grams: number, dosePerDay: number): number => grams / dosePerDay;
