/**
 * Modelo ilustrativo potência–duração (lei de potência, P = a · t^−b), como na modelagem log-log
 * de Laursen 2007. Serve só para mostrar a geometria: por que o mesmo ganho vira % enorme no
 * tempo até a exaustão (carga fixa) e % pequeno no contrarrelógio (trabalho fixo).
 */

/** Expoente de fadiga ilustrativo. */
export const B = 0.1;
/** Duração de referência do teste (s): os dois testes duram ~5 min no dia basal. */
export const T0 = 300;
/** Variação biológica de um dia para o outro na potência sustentável (%), ilustrativa. */
export const DAY_NOISE = 1.5;

/** Potência sustentável (% da potência do teste basal) para durar t segundos, com ganho g (%). */
export const power = (t: number, gain = 0): number => 100 * (1 + gain / 100) * (t / T0) ** -B;

/** Tempo até a exaustão a 100% depois de um ganho g: t = T0 · (1+g)^(1/b). Devolve a mudança em %. */
export const tteChange = (gain: number): number => ((1 + gain / 100) ** (1 / B) - 1) * 100;

/** Contrarrelógio de trabalho fixo: t = T0 · (1+g)^(−1/(1−b)). Devolve a mudança em % (negativa = mais rápido). */
export const ttChange = (gain: number): number => ((1 + gain / 100) ** (-1 / (1 - B)) - 1) * 100;

/** Curva de mesmo trabalho que o contrarrelógio basal (P · t constante). */
export const isoWork = (t: number): number => (100 * T0) / t;
