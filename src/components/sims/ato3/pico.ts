/**
 * Slide 46: o relógio do bicarbonato. Curvas ILUSTRATIVAS dentro das faixas de Jones 2016 com 0,3 g/kg
 * (pico de 75 a 180 min; aumento de +6,0 a +12,3 mmol/L). Fatos de Boegman 2020, Gough 2017 e de Oliveira 2020.
 */

export interface PeakCurve {
    id: number;
    /** Tempo até o pico (min). */
    tp: number;
    /** Aumento de HCO₃⁻ no pico (mmol/L). */
    amp: number;
}

const N = 16;
const FALL_W = 70;

export const CURVES: readonly PeakCurve[] = Array.from({ length: N }, (_, i) => ({
    id: i,
    tp: 75 + (105 * i) / (N - 1),
    amp: 6 + (6.3 * ((i * 7) % N)) / (N - 1),
}));

/** Forma da curva (0–1): subida proporcional ao tempo até o pico, descida fixa. */
export const shape = (t: number, tp: number): number => {
    const w = t < tp ? 0.55 * tp : FALL_W;
    return Math.exp(-Math.pow((t - tp) / w, 2));
};

export const valueAt = (c: PeakCurve, t: number): number => (t <= 0 ? 0 : c.amp * shape(t, c.tp));

/** Limiar usado por Boegman 2020 para "tamponamento disponível". */
export const THRESHOLD = 5;
/** "Perto do pico" = pelo menos 90% do próprio pico (critério didático). */
export const NEAR_PEAK = 0.9;

export const countAt = (t: number) => ({
    above: CURVES.filter(c => valueAt(c, t) >= THRESHOLD).length,
    near: CURVES.filter(c => shape(t, c.tp) >= NEAR_PEAK).length,
});

export const PEAK_TABS = ['16 curvas', 'Horário fixo', 'Pico individual', 'O relógio se repete?'] as const;

export const PEAK_DEFAULT_T: readonly number[] = [60, 60, 60, 60];

export const PEAK_FEET: readonly string[] = [
    'Mesma dose por quilo, 16 homens: o pico do bicarbonato no sangue cai entre 75 e 180 min. Normalizar pela massa não reduziu a variação.',
    'Com o horário fixo do consenso (60 min antes), quase ninguém está no próprio pico. Nos remadores de elite, só 1 de 23 estava.',
    'Tomando no pico de cada um: 369,0 → 367,0 s em 2.000 m, 23 remadores de classe mundial. Sem braço placebo — e o aquecimento igualou o bicarbonato.',
    'O relógio é reprodutível? Em um grupo, sim (CCI 0,94); em outro, o pico médio variou cerca de 40 min entre sessões. A janela útil é larga: 75 a 240 min.',
];
