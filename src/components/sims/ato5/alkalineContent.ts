/**
 * Slide 74 · "Treinar alcalino?". EDGE2006B (mulheres ativas), DRILLER2013 (remadores de elite),
 * BISHOP2010 (ratos), PERCIVAL2015 (PGC-1α), PAINELLI2018 (HIIT em vegetarianos). Dossiê 04, seção J.
 */

export interface PairMetric {
    label: string;
    bic: number;
    placebo: number;
    unit: string;
    decimals: number;
    note?: string;
}

export interface TrainingStudy {
    id: 'edge' | 'driller';
    who: string;
    tier: string;
    design: string;
    max: number;
    metrics: readonly PairMetric[];
    takeaway: string;
    source: string;
}

export const STUDIES: readonly TrainingStudy[] = [
    {
        id: 'edge', who: 'Mulheres ativas', tier: '2006 · n = 16',
        design: '8 semanas, 3×/semana: 6–12 tiros de 2 min a 140–170% do limiar, com bicarbonato ou placebo antes de cada sessão.',
        max: 180,
        metrics: [
            { label: 'βm (tampão)', bic: 19, placebo: 9, unit: '%', decimals: 0, note: 'sem diferença' },
            { label: 'limiar', bic: 26, placebo: 15, unit: '%', decimals: 0 },
            { label: 'tempo até a fadiga', bic: 164, placebo: 123, unit: '%', decimals: 0, note: 'P = 0,05' },
        ],
        takeaway: 'O tampão não subiu mais; a resistência, sim.',
        source: 'Edge, Bishop e Goodman 2006, J Appl Physiol',
    },
    {
        id: 'driller', who: 'Remadores de elite', tier: '2013 · n = 12',
        design: 'Remadores de nível nacional da Austrália; 4 semanas de HIIT, 2×/semana, com 0,3 g/kg ou placebo.',
        max: 20,
        metrics: [
            { label: 'potência 2.000 m', bic: 17.8, placebo: 15.2, unit: ' W', decimals: 1, note: 'sem ganho adicional' },
        ],
        takeaway: 'Os dois grupos melhoraram; o bicarbonato não somou nada.',
        source: 'Driller 2013, IJSNEM',
    },
];

export interface AlkalineStep {
    tab: string;
    focus: readonly TrainingStudy['id'][];
    revealed: readonly TrainingStudy['id'][];
}

export const ALKALINE_STEPS: readonly AlkalineStep[] = [
    { tab: 'A ideia', focus: [], revealed: [] },
    { tab: 'Mulheres ativas', focus: ['edge'], revealed: ['edge'] },
    { tab: 'Remadores de elite', focus: ['driller'], revealed: ['edge', 'driller'] },
    { tab: 'Por que a diferença?', focus: ['edge', 'driller'], revealed: ['edge', 'driller'] },
    { tab: 'O treino já tampona', focus: [], revealed: ['edge', 'driller'] },
];

/** Passo 1: a hipótese e o que a sustenta (mecanismo, não desempenho). */
export const HYPOTHESIS = {
    chain: ['bicarbonato antes do treino', 'menos acidose na sessão', 'mais adaptação?'],
    clues: [
        { who: 'Ratos', text: 'tempo até a exaustão 81,2 min com bicarbonato × 53,5 com placebo, e mais respiração mitocondrial', source: 'Bishop 2010' },
        { who: 'Humanos, 1 sessão', text: 'mRNA de PGC-1α ~7 vezes o repouso com bicarbonato × ~5 vezes com placebo, 3 h depois', source: 'Percival 2015' },
    ],
} as const;

/** Passo 4: o que separa os dois estudos (a última linha é hipótese, não achado). */
export const CONTRASTS = [
    { label: 'Duração', a: '8 semanas', b: '4 semanas' },
    { label: 'Sessões', a: '24', b: '8' },
    { label: 'Teste', a: 'até a fadiga', b: '2.000 m' },
] as const;

export const CONTRAST_NOTE = 'Sessões = semanas × frequência (cálculo). Perto do teto sobra pouco para ganhar; e o teste até a fadiga amplia efeitos (Ato VI).';

export const PAINELLI = {
    from: '15,8',
    to: '20,6',
    delta: '+30%',
    text: '20 homens vegetarianos, sem β-alanina na dieta: 12 semanas de HIIT elevaram a carnosina muscular (mmol/kg ms); controle 14,3 → 15,0.',
    source: 'Painelli 2018, Med Sci Sports Exerc · USP',
} as const;
