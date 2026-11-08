import { C } from '../kit/palette';

/**
 * Slide 70 · Citrato × bicarbonato. Números de URWIN2023 (pico, variação, janelas, GI), URWIN2016 (pico do citrato),
 * MCMANUS2026 (ICC), CARR2011 e DEOLIVEIRA2022 (meta-análises); sódio = cálculo do dossiê 06 (70 kg).
 * A FORMA das curvas é ilustrativa: só picos, variações e janelas vêm do estudo.
 */

export interface AlkaliCurve {
    id: 'bic' | 'cit';
    label: string;
    dose: string;
    peak: number;
    delta: number;
    /** Minuto do pico na curva desenhada (ilustrativo, dentro da faixa publicada). */
    tp: number;
    /** Janela em que o HCO₃⁻ fica ≥ 6 mmol/L acima do basal (URWIN2023). */
    window: readonly [number, number];
    /** Pico dos sintomas GI (URWIN2023). */
    gi: readonly [number, number];
}

export const THRESHOLD = 6;

export const CURVE_COLOR: Record<AlkaliCurve['id'], string> = { bic: C.base, cit: C.ok };

export const CURVES: readonly AlkaliCurve[] = [
    { id: 'bic', label: 'Bicarbonato', dose: '0,3 g/kg', peak: 33.6, delta: 7.3, tp: 145, window: [120, 180], gi: [35, 50] },
    { id: 'cit', label: 'Citrato', dose: '0,5 g/kg', peak: 34.2, delta: 7.9, tp: 205, window: [180, 240], gi: [80, 90] },
];

/** Basal = pico − variação (34,2 − 7,9 = 33,6 − 7,3 = 26,3): cálculo. */
export const BASAL = 26.3;

/**
 * Curva ilustrativa: gaussiana assimétrica que cruza +6 mmol/L exatamente nas bordas da janela publicada.
 * `shift` desloca o pico (para mostrar a mesma pessoa em duas visitas).
 */
export const hco3At = (curve: AlkaliCurve, t: number, shift = 0): number => {
    const tp = curve.tp + shift;
    const k = Math.sqrt(Math.log(curve.delta / THRESHOLD));
    const width = t < tp ? (curve.tp - curve.window[0]) / k : (curve.window[1] - curve.tp) / k;
    return BASAL + curve.delta * Math.exp(-(((t - tp) / width) ** 2));
};

export interface CitrateStep {
    tab: string;
    title: string;
    text: string;
    source: string;
}

export const CITRATE_STEPS: readonly CitrateStep[] = [
    {
        tab: 'Mesma altura',
        title: 'Na dose certa, a mesma alcalose',
        text: '16 pessoas, cápsulas com refeição rica em carboidrato. Citrato 0,5 g/kg e bicarbonato 0,3 g/kg levam o HCO₃⁻ ao mesmo teto.',
        source: 'Urwin 2023, IJSNEM · cruzado, n = 16',
    },
    {
        tab: 'Outro relógio',
        title: 'O que muda é a hora',
        text: 'Acima de +6 mmol/L: bicarbonato de 2 a 3 h após a dose; citrato de 3 a 4 h. O desconforto GI também muda de hora — e chega antes do pico.',
        source: 'Urwin 2023 · pico do citrato 180–212 min (Urwin 2016)',
    },
    {
        tab: 'A prova na janela',
        title: 'Testar na hora do bicarbonato',
        text: 'Quem toma citrato no horário do bicarbonato compete antes do pico. Na meta-análise de 2011, a alta do HCO₃⁻ dependia do intervalo até o teste.',
        source: 'Carr 2011, Sports Med · 16 estudos, 45 estimativas',
    },
    {
        tab: 'Nem o relógio é fixo',
        title: 'A mesma pessoa, outro dia, outro pico',
        text: 'Em duas visitas iguais, o tempo até o pico não se repetiu. Individualizar pelo “seu” pico não se sustenta: vale a janela do grupo.',
        source: 'McManus 2026, JISSN · n = 12, teste-reteste',
    },
    {
        tab: 'O veredito',
        title: 'Testemunha mais lenta e mais salgada',
        text: 'Alcaliniza igual, mas chega mais tarde, rendeu menos que o bicarbonato na meta-análise de 2022 e traz mais sódio por dose.',
        source: 'de Oliveira 2022, Sports Med · sódio: cálculo para 70 kg',
    },
];

/** Horário inicial da prova (min após a dose); o slider do passo 3 move a partir daqui. */
export const RACE_DEFAULT = 150;

/** Visitas ilustrativas da mesma pessoa: picos separados por ~2 × erro típico (49,1 min). */
export const VISIT_SHIFTS = [-40, 45] as const;

export const SODIUM_70KG = { bic: '5,75 g', cit: '8,2 g' } as const;
