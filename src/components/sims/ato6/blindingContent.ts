/** Passos do "O Placebo que Denuncia". Números do dossiê 05 (blocos C e B). */

export type BlindVisual = 'formulation' | 'body' | 'mimic' | 'share';

export interface BlindStep {
    tab: string;
    headline: string;
    text: string;
    visual: BlindVisual;
    source: string;
}

export const BLIND_STEPS: readonly BlindStep[] = [
    {
        tab: 'Cápsula × solução',
        headline: '"Duplo-cego" só vale se for testado',
        text: 'Doze atletas, bicarbonato ou placebo de sal. Em solução, o gosto denuncia: só 4 em 12 ficam em dúvida logo após beber. Em cápsula, 11 em 12 — mas metade já desconfia depois do esforço.',
        visual: 'formulation',
        source: 'Gurton WH et al. Eur J Appl Physiol 2022;122(12):2555-2563 — estudo 2, placebo NaCl 0,03 g/kg.',
    },
    {
        tab: 'O corpo denuncia',
        headline: 'O que o atleta sente revela o grupo',
        text: 'A β-alanina dá formigamento ~9 vezes mais que o placebo; o bicarbonato, desconforto gastrintestinal em quase 1 de cada 3. Que isso quebre o cegamento é plausível, mas pouco medido.',
        visual: 'body',
        source: 'Dolan E et al. Adv Nutr 2019 · Miller LE et al. JISSN 2025 · de Camargo JBB et al. Biol Sport 2023.',
    },
    {
        tab: 'O placebo que imita',
        headline: 'Sem bicarbonato, +9,5%',
        text: 'Um placebo com água com gás, para imitar o estufamento, e um texto que prometia efeito: o tempo até a exaustão subiu 9,5%. Em 2024, a dextrose anunciada como ergogênica rendeu o mesmo que o bicarbonato anunciado como ergogênico.',
        visual: 'mimic',
        source: 'Higgins MF, Shabir A. Appl Physiol Nutr Metab 2016 · Zagatto AM et al. Eur J Appl Physiol 2024.',
    },
    {
        tab: 'Quanto é crença',
        headline: 'Um quarto do efeito é expectativa',
        text: 'Comparando com um grupo que não toma nada, ~25% do efeito dos tamponantes vem do placebo. E o placebo não é universal: em 627 participantes, a cápsula vazia só ajudou quem já pretendia usar suplemento; o nocebo pegou todos.',
        visual: 'share',
        source: 'Marticorena FM et al. MSSE 2021 (CrI75% 16–35%) · Hurst P et al. MSSE 2017.',
    },
];

/** Gurton 2022, estudo 2: % de "não sei" em 12 atletas (convertido para pessoas). */
export const GURTON = [
    { moment: 'logo após ingerir', capsule: 11, solution: 4, capsulePct: '92%', solutionPct: '33%' },
    { moment: 'antes do teste', capsule: 8, solution: 2, capsulePct: '67%', solutionPct: '17%' },
    { moment: 'depois do teste', capsule: 6, solution: 2, capsulePct: '50%', solutionPct: '17%' },
] as const;

/** Hurst 2017: mudança no sprint vs. controle sem cápsula (%; negativo = mais lento). */
export const HURST = [
    { label: 'cápsula "potente"', value: -0.07 },
    { label: '… quem pretendia usar', value: 0.19 },
    { label: '… quem não pretendia', value: -1.1 },
    { label: 'cápsula "prejudicial"', value: -0.92 },
] as const;
