import { C } from '../kit/palette';

/**
 * Slide 73 · "Alianças". Combinações como peças que somam ou não somam.
 * CURRANBOWEN2024, TOBIAS2013, DASILVA2019, KILDING2012, CALLAHAN2017, MOESGAARD2024, BURKE2017 (dossiê 04, G/H/K).
 * A barra "se somasse" é soma aritmética dos isolados: cálculo, rotulado no slide.
 */

export const PIECE = {
    ba: C.carno,
    bic: C.base,
    caf: C.co2,
    cre: C.text,
    combo: C.ok,
} as const;

export interface BarRow {
    label: string;
    value: number;
    color: string;
    lo?: number;
    hi?: number;
    /** Soma aritmética dos isolados: desenhada como peças empilhadas, tracejada. */
    parts?: readonly { value: number; color: string }[];
}

export interface BarPanel {
    heading: string;
    unit: string;
    min: number;
    max: number;
    decimals: number;
    rows: readonly BarRow[];
}

export type Verdict = 'só a combinação passa do zero' | 'quase soma' | 'nulo para todos' | 'não soma' | 'cada um na sua tarefa';

export interface ComboStep {
    tab: string;
    title: string;
    text: string;
    caveat: string;
    source: string;
    verdict: Verdict;
    panels: readonly BarPanel[];
}

const sumOf = (a: number, b: number) => Math.round((a + b) * 10) / 10;

export const COMBO_STEPS: readonly ComboStep[] = [
    {
        tab: 'Os dois andares',
        title: 'β-alanina + bicarbonato',
        text: 'Um tampão dentro da fibra, outro no sangue. Nos 10 estudos com os quatro braços, só a combinação teve intervalo acima de zero.',
        caveat: 'Estudos pequenos: os isolados “não significativos” aqui são eficazes em meta-análises maiores.',
        source: 'Curran-Bowen 2024, Biol Sport · 243 pessoas, I² = 0%',
        verdict: 'só a combinação passa do zero',
        panels: [{
            heading: 'Efeito contra placebo (SMD, IC 95%)', unit: '', min: -0.2, max: 0.7, decimals: 2,
            rows: [
                { label: 'β-alanina', value: 0.18, lo: -0.06, hi: 0.43, color: PIECE.ba },
                { label: 'bicarbonato', value: 0.17, lo: -0.08, hi: 0.41, color: PIECE.bic },
                { label: 'os dois', value: 0.32, lo: 0.07, hi: 0.57, color: PIECE.combo },
            ],
        }],
    },
    {
        tab: 'No tatame',
        title: 'Judocas e lutadores de jiu-jítsu (USP)',
        text: '37 atletas, 4 Wingates de 30 s de membros superiores. A combinação chegou perto da soma das duas peças.',
        caveat: 'Bicarbonato crônico (500 mg/kg/dia por 7 dias), ~9 por grupo, placebo de carbonato de cálcio.',
        source: 'Tobias 2013, Amino Acids',
        verdict: 'quase soma',
        panels: [{
            heading: 'Trabalho total contra placebo (%)', unit: '%', min: 0, max: 17, decimals: 0,
            rows: [
                { label: 'β-alanina', value: 7, color: PIECE.ba },
                { label: 'bicarbonato', value: 8, color: PIECE.bic },
                { label: 'se somasse', value: sumOf(7, 8), color: PIECE.combo, parts: [{ value: 7, color: PIECE.ba }, { value: 8, color: PIECE.bic }] },
                { label: 'os dois', value: 14, color: PIECE.combo },
            ],
        }],
    },
    {
        tab: 'O maior estudo',
        title: '71 ciclistas, quatro grupos',
        text: 'O maior ensaio da combinação, também da USP. No contrarrelógio de 30 kJ, nenhum tratamento melhorou: nem as peças, nem a aliança.',
        caveat: 'O bicarbonato aumentou a contribuição glicolítica estimada; o desempenho não acompanhou.',
        source: 'da Silva 2019, Amino Acids · placebos de dextrose e CaCO₃',
        verdict: 'nulo para todos',
        panels: [],
    },
    {
        tab: 'Cafeína e nitrato',
        title: 'Bicarbonato + cafeína; + nitrato',
        text: 'Contrarrelógio de 3 km, 10 ciclistas: cada peça sozinha rendeu quase o mesmo que as duas juntas.',
        caveat: 'Nitrato + bicarbonato: um único ensaio (n = 8), 4 km, nulo em todas as condições.',
        source: 'Kilding 2012, IJSNEM · Callahan 2017, IJSNEM',
        verdict: 'não soma',
        panels: [{
            heading: 'Potência média contra placebo (%)', unit: '%', min: 0, max: 5.6, decimals: 1,
            rows: [
                { label: 'cafeína', value: 2.4, color: PIECE.caf },
                { label: 'bicarbonato', value: 2.6, color: PIECE.bic },
                { label: 'se somasse', value: sumOf(2.4, 2.6), color: PIECE.combo, parts: [{ value: 2.4, color: PIECE.caf }, { value: 2.6, color: PIECE.bic }] },
                { label: 'os dois', value: 2.7, color: PIECE.combo },
            ],
        }],
    },
    {
        tab: 'O “stack”',
        title: 'Creatina + cafeína + bicarbonato',
        text: '23 atletas de endurance. Cada peça serviu a uma tarefa — e os efeitos não se somaram.',
        caveat: 'Ninguém testou bicarbonato + β-alanina + cafeína + creatina com todos os braços: o resto é extrapolação de pares.',
        source: 'Moesgaard 2024, Scand J Med Sci Sports · Burke 2017, Sports Med',
        verdict: 'cada um na sua tarefa',
        panels: [
            {
                heading: 'Sprint de 15 s (W, IC 95%)', unit: ' W', min: -10, max: 60, decimals: 0,
                rows: [
                    { label: 'creatina', value: 34, lo: 10, hi: 58, color: PIECE.cre },
                    { label: 'cafeína', value: 10, color: PIECE.caf },
                    { label: 'bicarbonato', value: 5, color: PIECE.bic },
                ],
            },
            {
                heading: 'Contrarrelógio de 6 min (W, IC 95%; mesma escala)', unit: ' W', min: -10, max: 60, decimals: 0,
                rows: [
                    { label: 'cafeína', value: 12, lo: 5, hi: 18, color: PIECE.caf },
                    { label: 'caf. + bic.', value: 8, lo: 0, hi: 15, color: PIECE.combo },
                    { label: 'bicarbonato', value: -1, color: PIECE.bic },
                    { label: 'creatina', value: -6, color: PIECE.cre },
                ],
            },
        ],
    },
];

/** Os quatro grupos do maior estudo (passo 3). */
export const DASILVA_ARMS = ['placebo', 'β-alanina', 'bicarbonato', 'os dois'] as const;
