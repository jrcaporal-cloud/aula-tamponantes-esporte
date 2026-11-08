import type { EvidenceKind } from './ui';

/**
 * Slide 26 — "As Quatro Linhas de Defesa". Fontes: dossiê 03 (ABE2000, GUTHRIE1996, JUEL1997/2008,
 * KRISTENSEN2004, MEDBO1985, NIELSEN2002) e dossiê 02 (MANNION1992: carnosina ~7%).
 * Sem porcentagem por tampão nem por transportador: não confirmadas.
 */

export interface DefenseFact {
    text: string;
    /** Sem tipo = nota do professor, sem selo. */
    kind?: EvidenceKind;
    label?: string;
}

export interface DefenseStep {
    tab: string;
    headline: string;
    text: string;
    facts: readonly DefenseFact[];
}

export const DEFENSE_STEPS: readonly DefenseStep[] = [
    {
        tab: 'Dentro da fibra',
        headline: '1ª linha: segurar o H⁺ onde ele nasce',
        text: 'Proteínas (o imidazol da histidina), fosfato, carnosina e, no primeiro instante, a creatina-quinase, que consome H⁺ ao refazer ATP.',
        facts: [
            { text: 'Carnosina ≈ 7% da capacidade tamponante do músculo humano (estimativa físico-química).', kind: 'humano', label: 'Mannion 1992' },
            { text: 'Alcalose transitória nos ~2 min iniciais: a CK consumindo H⁺.', kind: 'humano', label: 'Guthrie 1996 · ³¹P-ERM' },
        ],
    },
    {
        tab: 'Exportação',
        headline: '2ª linha: tirar o H⁺ da fibra',
        text: 'Três portas no sarcolema: MCT (lactato⁻ e H⁺ juntos), NHE1 (H⁺ sai, Na⁺ entra) e NBC (HCO₃⁻ entra com Na⁺). As três se adaptam ao treino.',
        facts: [
            { text: 'O efluxo de lactato e H⁺ no exercício intenso é mediado principalmente pelo MCT.', kind: 'revisão', label: 'Juel 1997 · 2008' },
            { text: 'Em vesículas de sarcolema, ~metade da recuperação do pH dependeu de bicarbonato.', kind: 'animal', label: 'Kristensen 2004 · rato' },
        ],
    },
    {
        tab: 'No sangue',
        headline: '3ª linha: o bicarbonato recebe o H⁺',
        text: 'Fora da fibra, HCO₃⁻ + H⁺ → H₂CO₃ → CO₂ + H₂O. A hemoglobina também tampona. É aqui que o suplemento de bicarbonato reforça a defesa.',
        facts: [
            { text: 'Cada mmol/L de lactato no sangue consumiu ~1,09 mmol/L de bicarbonato.', kind: 'humano', label: 'Medbø 1985' },
            { text: 'No fim do 2.000 m, o HCO₃⁻ cai de 24 para ~11 mmol/L (cálculo).', kind: 'cálculo', label: 'sobre Nielsen 2002' },
        ],
    },
    {
        tab: 'Ventilação',
        headline: '4ª linha: soprar o CO₂ para fora',
        text: 'O CO₂ formado pelo bicarbonato sai pelo pulmão. Por isso a ventilação dispara no fim da prova — e por isso ela tem teto.',
        facts: [
            { text: 'Ventilação no fim do 2.000 m: 155 L/min com salina × 142 L/min com bicarbonato IV.', kind: 'humano', label: 'Nielsen 2002 · n = 5' },
        ],
    },
    {
        tab: 'As quatro juntas',
        headline: 'Cada suplemento reforça uma linha diferente',
        text: 'A beta-alanina engrossa a 1ª linha (carnosina, dentro da fibra). O bicarbonato reforça a 3ª — e, por ela, puxa a 2ª. Nenhum dos dois mexe na ventilação.',
        facts: [
            { text: 'A divisão do trabalho entre os tampões não tem número confirmado na literatura conferida: por isso não há pizza neste slide.' },
        ],
    },
];

export const LINES = [
    { id: 'fibra', title: 'fibra', items: ['proteínas (histidina)', 'fosfato', 'carnosina', 'PCr / CK'] },
    { id: 'membrana', title: 'membrana', items: ['MCT', 'NHE1', 'NBC'] },
    { id: 'sangue', title: 'sangue', items: ['HCO₃⁻', 'hemoglobina'] },
    { id: 'pulmao', title: 'pulmão', items: ['CO₂ ventilado'] },
] as const;
