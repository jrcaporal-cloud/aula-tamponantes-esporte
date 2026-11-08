/** Slide 45: dose-resposta do bicarbonato (dossiê 01). Curvas de desempenho e GI = forma ilustrativa. */

export const DOSE_TABS = ['A curva de 1992', 'O sangue', 'O preço', 'No pico individual'] as const;

export const DOSE_FEET: readonly string[] = [
    'McNaughton testa cinco doses no mesmo grupo: 0,1 g/kg nem alcaliniza; o trabalho em 60 s sobe até 0,3 g/kg e para aí.',
    'No sangue a dose importa, mas a resposta varia muito: com 0,3 g/kg, o bicarbonato sobe de 6 a 12 mmol/L conforme a pessoa.',
    'Acima de 0,3 g/kg não há ganho extra — só mais sintomas. A curva do desempenho achata; a do intestino continua subindo.',
    'Tomado no pico individual, 0,2 g/kg rendeu o mesmo que 0,3 g/kg: 0,2 s de diferença em 4 km, com um terço a menos de sódio.',
];

/** Passo → dose inicial do cursor (g/kg). */
export const DOSE_DEFAULT: readonly number[] = [0.3, 0.3, 0.5, 0.2];

export interface DoseZone {
    from: number;
    to: number;
    title: string;
    text: string;
    source: string;
}

/** Leitura da dose no cursor. */
export const DOSE_ZONES: readonly DoseZone[] = [
    { from: 0.1, to: 0.15, title: 'Abaixo do mínimo', text: '0,1 g/kg não alcalinizou o sangue: nada a esperar no desempenho.', source: 'McNaughton 1992' },
    { from: 0.15, to: 0.25, title: 'Dose mínima', text: '0,2 g/kg já aumentou o trabalho em 60 s (p < 0,05); a ISSN a chama de mínima.', source: 'McNaughton 1992 · ISSN 2021' },
    { from: 0.25, to: 0.35, title: 'Dose ótima', text: 'Máximo em 0,3 g/kg: 41,9 kJ em 60 s; potência pico só difere a partir daqui.', source: 'McNaughton 1992 · ISSN 2021' },
    { from: 0.35, to: 0.51, title: 'Só soma sintomas', text: '0,4–0,5 g/kg: sem ganho adicional e com mais efeitos adversos.', source: 'ISSN 2021' },
];

export const zoneOf = (dose: number): DoseZone =>
    DOSE_ZONES.find(z => dose >= z.from && dose < z.to) ?? DOSE_ZONES[DOSE_ZONES.length - 1];

/** Forma ilustrativa: ganho satura a partir de ~0,3 g/kg. */
export const perfShape = (d: number): number => (d <= 0.1 ? 0 : 1 - Math.exp(-(d - 0.1) / 0.06));
/** Forma ilustrativa: sintomas GI sobem com a dose. */
export const giShape = (d: number): number => Math.pow(Math.max(d - 0.1, 0) / 0.4, 1.5);

/** JONES2016: aumento do HCO₃⁻ (mmol/L, faixa entre pessoas) e tempo até o pico (min). */
export const JONES_RANGES = [
    { dose: 0.1, lo: 2.0, hi: 5.0, peak: '30–150 min' },
    { dose: 0.2, lo: 5.1, hi: 8.1, peak: '40–165 min' },
    { dose: 0.3, lo: 6.0, hi: 12.3, peak: '75–180 min' },
] as const;

/** GOUGH2018: 4 km no pico individual, melhora vs placebo (s, média ± DP). */
export const GOUGH_TT = [
    { dose: 0.2, mean: 8.3, sd: 3.5, d: 0.64 },
    { dose: 0.3, mean: 8.6, sd: 5.4, d: 0.66 },
] as const;

/** Fração de sódio no NaHCO₃ (22,990 / 84,006). */
export const NA_FRACTION = 0.2737;
