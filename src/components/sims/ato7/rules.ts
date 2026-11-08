/** Slide 90 — As Regras do Jogo. Fonte: dossiê 06, Parte 2 e História H2. */

export type RuleVisual = 'lista' | 'volume' | 'tco2' | 'cavalos' | 'pote';

export interface RuleStep {
    tab: string;
    visual: RuleVisual;
    kicker: string;
    title: string;
    text: string;
    points: readonly string[];
    source: string;
}

export const RULE_STEPS: readonly RuleStep[] = [
    {
        tab: 'A lista', visual: 'lista', kicker: 'Lista Proibida WADA 2026',
        title: 'Pela boca, nenhum dos três é doping',
        text: 'No texto integral da lista, bicarbonato, citrato e β-alanina não aparecem em classe nenhuma.',
        points: ['Vale em competição e fora dela.', 'Suplemento é por conta e risco do atleta (USADA).'],
        source: 'WADA, Lista Proibida 2026 (em vigor desde 01/01/2026); USADA, "Buffers and Anti-Doping Rules".',
    },
    {
        tab: 'A agulha', visual: 'volume', kicker: 'Método M2.2',
        title: 'Na veia, o que viola a regra é o volume',
        text: 'Infusão ou injeção de mais de 100 mL em 12 h é proibida sempre, fora de tratamento hospitalar. A dose útil não cabe nisso.',
        points: ['UCI (2011) e remo (2011) têm políticas "no needle": injeção sem indicação médica já é infração.'],
        source: 'WADA 2026, M2.2; bula do bicarbonato injetável Baxter (12,6 mg/mL); volumes = cálculo.',
    },
    {
        tab: 'Os cavalos', visual: 'tco2', kicker: 'Turfe · o "milkshake"',
        title: 'A fraude tamponante nasceu nas pistas de corrida',
        text: '0,5 g/kg de bicarbonato em 2 L de água, por sonda, 3 a 5 h antes do páreo. O turfe respondeu com o TCO₂ do plasma.',
        points: ['Limite típico 36 mmol/L; ação acima de 37.', 'Trotadores: uma "corcova" em 32,3 — alcalinização discreta, abaixo do limite.'],
        source: 'Lloyd & Rose 1995; Auer 1993; Sutton 2014 (3.788 medidas de trotadores, Austrália).',
    },
    {
        tab: 'A reviravolta', visual: 'cavalos', kicker: 'Meta-análise equina',
        title: 'Puniram, por anos, algo que não funciona',
        text: '7 ECRs, 74 cavalos treinados: efeito zero na esteira e no contrarrelógio. E o teste pune até quem não alcalinizou.',
        points: ['O’Neill (2012): TCO₂ alto, árbitro aceitou que não houve milkshake — 45 dias e US$ 15.000 mesmo assim.', 'HISA (2024): acima de 37 mmol/L é prova prima facie.'],
        source: 'Denham & Hulme 2020; AP/CBS 24/05/2012; BloodHorse 29/05/2024; Lindinger 2021.',
    },
    {
        tab: 'O risco real', visual: 'pote', kicker: 'Contaminação',
        title: 'Para o atleta, o perigo está no pote',
        text: 'O tampão costuma vir em "pré-treino", justamente a categoria de alto risco. O que reprova é o que vem junto.',
        points: ['Certificação por lote reduz o risco, não o elimina.'],
        source: 'Geyer 2004 (634 produtos, 13 países); Duiven 2021 (66 produtos); COI 2018; AIS 2025.',
    },
];

/** Volumes para 21 g de NaHCO₃ (70 kg × 0,3 g/kg) — cálculo do dossiê 06. */
export const VOLUME_BARS = [
    { id: 'lim', label: 'Limite M2.2', sub: 'em 12 h', ml: 100 },
    { id: 'c84', label: '21 g a 8,4%', sub: '84 mg/mL', ml: 250 },
    { id: 'c126', label: '21 g a 1,26%', sub: '12,6 mg/mL', ml: 1670 },
] as const;

/** Classes da Lista Proibida (para a varredura do passo 1). */
export const LIST_CLASSES = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'P1', 'M1', 'M2', 'M3'] as const;

/** Forest de Denham & Hulme 2020 (SMD, IC95%). */
export const HORSE_ROWS = [
    { id: 'tte', label: 'Esteira até a exaustão', sub: 'n = 32 cavalos', est: -0.13, lo: -0.64, hi: 0.37 },
    { id: 'tt', label: 'Contrarrelógio simulado', sub: 'n = 42 cavalos', est: 0.01, lo: -0.42, hi: 0.44 },
] as const;

/** Contaminação: proporções lidas nos abstracts (arredondadas para 100 pontos). */
export const POTS = [
    { id: 'geyer', pct: 14.8, dots: 15, title: '14,8%', sub: '634 suplementos "não hormonais" com anabolizante não declarado (2004)' },
    { id: 'duiven', pct: 38, dots: 38, title: '38%', sub: '66 produtos de alto risco com substância proibida não declarada (2021)' },
] as const;
