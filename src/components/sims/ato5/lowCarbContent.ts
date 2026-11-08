/**
 * Slide 72 · "A dieta que acidificava". GREENHAFF1988 (n = 6; 4 dietas de 4 dias; exaustão a 100% do VO₂máx:
 * 179 × 210 × 219 s) e BALL1996 (n = 6; NaHCO₃ 3,6 mmol/kg × CaCO₃ 3,0 mmol/kg; a acidose foi revertida,
 * o tempo não voltou; bicarbonato sem efeito nas duas dietas). Dossiê 04, seção F.
 */

export interface LowCarbStep {
    tab: string;
    year: string;
    title: string;
    text: string;
    source: string;
}

export const LOWCARB_STEPS: readonly LowCarbStep[] = [
    {
        tab: 'A cena', year: '1988', title: 'Pouco carboidrato, esforço mais curto',
        text: 'Seis homens, quatro dietas de 4 dias, pedalada a 100% do VO₂máx até a exaustão. Com a dieta pobre em carboidrato, o esforço acabou meio minuto antes.',
        source: 'Greenhaff, Gleeson e Maughan 1988, Eur J Appl Physiol',
    },
    {
        tab: 'O suspeito', year: '1988', title: 'A pista: o sangue mais ácido',
        text: 'A dieta pobre em carboidrato e rica em gordura e proteína deixou uma acidose metabólica leve. O suspeito natural: o pH encurtou o esforço.',
        source: 'Greenhaff 1988 · acidose induzida pela dieta',
    },
    {
        tab: 'O teste', year: '1996', title: 'Corrigir o pH e ver se o tempo volta',
        text: 'O mesmo grupo repete as dietas e dá bicarbonato (3,6 mmol/kg) ou placebo de carbonato de cálcio (3,0 mmol/kg). Se o pH era o culpado, o tempo tem de voltar.',
        source: 'Ball, Greenhaff e Maughan 1996, Eur J Appl Physiol · n = 6',
    },
    {
        tab: 'O resultado', year: '1996', title: 'O pH voltou. O tempo, não.',
        text: 'O bicarbonato reverteu a acidose da dieta, mas o tempo de exercício não voltou. E não teve efeito em nenhuma das duas dietas.',
        source: 'Ball 1996',
    },
    {
        tab: 'O culpado', year: 'hoje', title: 'Duas pistas mudaram juntas',
        text: 'A dieta mexeu no pH e no glicogênio ao mesmo tempo. Só intervir em uma das duas separou o cúmplice do culpado.',
        source: 'Ball 1996 · Applegate 2017 (revisão de dieta alcalina)',
    },
];

export const GREENHAFF_BARS = [
    { label: 'pobre em carboidrato', seconds: 179, hot: true },
    { label: 'normal', seconds: 210, hot: false },
    { label: 'rica em carboidrato', seconds: 219, hot: false },
] as const;

export interface DesignCell {
    text: string;
    tone: 'neutral' | 'acid' | 'fixed' | 'unknown';
}

/** Desenho de Ball 1996: dieta (linhas) × suplemento (colunas). `after` = o que se soube no passo do resultado. */
export const BALL_ROWS = [
    { diet: 'dieta normal', placebo: { text: 'referência', tone: 'neutral' }, bicarb: { text: 'sem efeito', tone: 'neutral' } },
    { diet: 'pobre em CHO', placebo: { text: 'acidose, tempo ↓', tone: 'acid' }, bicarb: { text: 'pH corrigido, tempo segue ↓', tone: 'fixed' } },
] as const satisfies readonly { diet: string; placebo: DesignCell; bicarb: DesignCell }[];

export const LESSONS = [
    'Pista falsa: o pH andava junto com a fadiga, mas corrigi-lo não mudou o desfecho.',
    'Suspeito que sobra: o glicogênio, que a mesma dieta esvaziou.',
    'Na prática: “dieta alcalina para performance” herda o mesmo erro de leitura.',
] as const;
