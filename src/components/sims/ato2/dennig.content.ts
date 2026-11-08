/**
 * Slide 23 — "O Homem que se Acidificou de Propósito". Fonte única: DENNIG1931 (texto completo,
 * J Clin Invest 1931;9(4):601-13). A página do caderno é reconstituição; os dados são do artigo.
 */

export interface NoteLine {
    text: string;
    /** Tinta vermelha = efeito adverso; sublinhado = conclusão. */
    ink?: 'red' | 'underline';
}

export interface DennigStep {
    tab: string;
    date: string;
    lines: readonly NoteLine[];
    headline: string;
    text: string;
}

export const DENNIG_STEPS: readonly DennigStep[] = [
    {
        tab: 'O sujeito',
        date: 'setembro',
        lines: [
            { text: 'Sujeito: H. D. — o próprio autor. Não atleta.' },
            { text: '12 corridas de treino na esteira.' },
            { text: 'Teste: esteira a 9,3 km/h até não aguentar.' },
        ],
        headline: 'n = 1, e o sujeito é o pesquisador',
        text: 'H. Dennig, docente da Clínica Médica de Heidelberg, no Harvard Fatigue Laboratory. Pouca experiência na esteira, nenhuma de atleta. Ele vai mudar o pH do próprio sangue nos dois sentidos.',
    },
    {
        tab: 'Acidose',
        date: '27–28 set.',
        lines: [
            { text: 'Cloreto de amônio, 15 g por dia, 2 dias.' },
            { text: 'pH arterial: 7,21 em repouso → 7,09 na exaustão.' },
            { text: 'Parou aos 15 min (outros dias: 18–20); lactato ~2 mEq/L.' },
        ],
        headline: 'Acidificado, ele cansa antes',
        text: 'Com o sangue já ácido em repouso, a corrida acabou aos 15 minutos, com lactato baixíssimo. O limite chegou sem o "ácido lático" subir.',
    },
    {
        tab: 'Alcalose',
        date: '29–30 set.',
        lines: [
            { text: 'Suspende o NH₄Cl. Bicarbonato de sódio, 10 g.' },
            { text: 'Reserva alcalina (normal = 100): 127 e 126.' },
            { text: 'Noite de 30/set.: cãibras tetânicas leves.', ink: 'red' },
        ],
        headline: 'Alcalinizado, a reserva sobe — e o corpo reclama',
        text: 'A capacidade do sangue de neutralizar ácido passou do normal. A alcalose foi tão intensa que deu cãibras tetânicas: o primeiro efeito adverso do bicarbonato no esporte já está aqui.',
    },
    {
        tab: 'A conclusão',
        date: '1931',
        lines: [
            { text: 'A acidose reduz claramente a capacidade de trabalho.' },
            { text: 'A alcalose deveria aumentá-la — não testado.', ink: 'underline' },
        ],
        headline: 'O ganho da alcalose foi só deduzido',
        text: 'Nas palavras dos autores, o trabalho "não foi severo o bastante" para testar a hipótese. Sem placebo, sem cegamento, duas sessões de alcalose. A ideia esperou décadas pelos ensaios.',
    },
];

/** Capacidade de neutralizar ácido do sangue, normal = 100; duas medidas por condição (DENNIG1931). */
export const RESERVE = [
    { id: 'a1', label: 'acidose', value: 70, tone: 'acid' },
    { id: 'a2', label: 'acidose', value: 21, tone: 'acid' },
    { id: 'n', label: 'normal', value: 100, tone: 'neutral' },
    { id: 'b1', label: 'alcalose', value: 127, tone: 'base' },
    { id: 'b2', label: 'alcalose', value: 126, tone: 'base' },
] as const;
