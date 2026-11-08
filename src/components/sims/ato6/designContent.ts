import { C } from '../kit/palette';

/** Passos do "Cruzado ou Paralelo?". Números: HOPKINS2001, BAGUET2009, HOPKINS1999, SAUNDERS2017_BJSM, AIS-SB2025. */

export type DesignVisual = 'crossover' | 'learning' | 'washout' | 'price';

export interface DesignStep {
    tab: string;
    headline: string;
    text: string;
    visual: DesignVisual;
    source: string;
}

export const DESIGN_STEPS: readonly DesignStep[] = [
    {
        tab: 'Cruzado',
        headline: 'Cada atleta é o próprio controle',
        text: 'No cruzado, o mesmo atleta faz o teste com bicarbonato e com placebo, em ordem sorteada. A diferença entre atletas some da conta, e por isso bastam poucos. Funciona porque o bicarbonato vem e vai no mesmo dia.',
        visual: 'crossover',
        source: 'Efeito por 3–4 h após a dose (AIS, ficha do bicarbonato, 2025). Cruzado duplo-cego é o desenho mais usado (ISSN 2021).',
    },
    {
        tab: 'Familiarização',
        headline: 'O segundo teste já é melhor',
        text: 'Entre a 1ª e a 2ª tentativa o desempenho sobe 1,2% só por aprendizado; depois, 0,2%. Sem sessão de familiarização, o brinde da ordem é maior que o efeito procurado, e o ruído das duas primeiras é 1,3× maior.',
        visual: 'learning',
        source: 'Hopkins WG, Schabort EJ, Hawley JA. Sports Med 2001;31(3):211-234 (101 estudos de confiabilidade).',
    },
    {
        tab: 'β-alanina',
        headline: 'A carnosina é um estoque que demora a esvaziar',
        text: 'Depois de 5–6 semanas de β-alanina, a carnosina cai 2–4% por semana. O grupo levou 9 semanas para voltar ao basal; os altos respondedores, 15. Um cruzado com um mês de intervalo começa o 2º período ainda carregado.',
        visual: 'washout',
        source: 'Baguet A et al. J Appl Physiol 2009;106(3):837-842 — "pode exigir meses, não semanas".',
    },
    {
        tab: 'O preço',
        headline: 'Paralelo é honesto, e caro',
        text: 'Sem o próprio controle, a variação entre pessoas volta para a conta. Usando a prova como desfecho, o cruzado pede 16–65 atletas; o paralelo, 65–260. A literatura de tamponantes trabalha com ~11.',
        visual: 'price',
        source: 'Hopkins WG et al. MSSE 1999 · a meta-análise de β-alanina excluiu os cruzados pelo washout (Saunders 2017, BJSM).',
    },
];

/** Marcos do washout (Baguet 2009). A forma das curvas é ilustrativa. */
export const WASHOUT = {
    loadingWeeks: 6,
    curves: [
        { label: 'alto respondedor', peak: 55, back: 15 },
        { label: 'média do grupo', peak: 30, back: 9 },
        { label: 'baixo respondedor', peak: 15, back: 6 },
    ],
    /** Um cruzado hipotético com 4 semanas de intervalo. */
    crossoverGap: 4,
} as const;

/** Esquema do cruzado: condição da sessão 1 de cada atleta (3 começam com bicarbonato, 3 com placebo). */
export const CROSSOVER_ROWS: readonly ('bic' | 'pla')[] = ['bic', 'bic', 'bic', 'pla', 'pla', 'pla'];

/** Atletas por estudo (HOPKINS1999, desfecho = a prova) × o estudo típico de tamponante (~11). */
export const SAMPLE_PILES = [
    { id: 'tipico', lo: 11, hi: 11, range: '~11', label: 'estudo típico', sub: 'de tamponante', color: C.lactate },
    { id: 'cruzado', lo: 16, hi: 65, range: '16–65', label: 'cruzado', sub: 'desfecho = a prova', color: C.base },
    { id: 'paralelo', lo: 65, hi: 260, range: '65–260', label: 'paralelo', sub: 'desfecho = a prova', color: C.carno },
] as const;
