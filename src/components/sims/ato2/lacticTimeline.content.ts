import type { EvidenceKind } from './ui';

/** Slide 22 — "O Julgamento do Ácido Lático". Fonte: dossiê 03, Partes 1, 2 e 6. */

export interface TrialEvent {
    year: string;
    who: string;
    title: string;
    text: string;
    kind: EvidenceKind;
    kindLabel: string;
    /** Reputação do lactato depois do evento: 1 = vilão, 0 = combustível (leitura didática). */
    reputation: number;
}

export const EVENTS: readonly TrialEvent[] = [
    {
        year: '1907', who: 'Fletcher & Hopkins', title: 'Nasce a suspeita',
        text: 'Músculo de rã isolado, frio e sem circulação: sem O₂, o ácido lático se acumula. A correlação lactato–fadiga–falta de O₂ nasce aqui.',
        kind: 'animal', kindLabel: 'ANIMAL · rã', reputation: 0.92,
    },
    {
        year: '1922', who: 'Hill e Meyerhof', title: 'O paradigma ganha um Nobel',
        text: 'O Nobel premia a distinção aeróbio × anaeróbio. Com a coroa, a ideia de lactato como resíduo da falta de O₂ demora décadas a cair.',
        kind: 'revisão', kindLabel: 'HISTÓRIA · Bassett 2002', reputation: 1,
    },
    {
        year: '1931', who: 'Dennig et al.', title: 'Um homem se acidifica de propósito',
        text: 'Em acidose por cloreto de amônio, ele não passou de 15 min na esteira. Que a alcalose ajudaria foi só deduzido.',
        kind: 'humano', kindLabel: 'HUMANO · n = 1', reputation: 0.95,
    },
    {
        year: '1983', who: 'Schwane et al.', title: 'A dor tardia é absolvida',
        text: 'Descida mais leve deu dor e CK alta; corrida no plano mais intensa, não. Dor do dia seguinte não é ácido lático.',
        kind: 'humano', kindLabel: 'HUMANO · n = 7', reputation: 0.72,
    },
    {
        year: '1986', who: 'Brooks', title: 'Combustível, não lixo',
        text: 'No exercício estável, ≥75% do lactato formado é oxidado durante o próprio exercício — produzido mesmo com O₂ abundante.',
        kind: 'revisão', kindLabel: 'TRAÇADORES · humanos e animais', reputation: 0.36,
    },
    {
        year: '2004', who: 'Robergs et al.', title: 'A defesa vai ao extremo',
        text: 'A redução piruvato → lactato consome H⁺: a produção de lactato retarda, não causa, a acidose. O H⁺ viria da hidrólise do ATP.',
        kind: 'teoria', kindLabel: 'ESTEQUIOMETRIA · revisão', reputation: 0.12,
    },
    {
        year: '2005', who: 'AJP-Regul, vol. 289, nº 3', title: 'Quatro textos, uma briga',
        text: 'O mesmo número publica três críticas a Robergs — Böning, Kemp, Lindinger — e a réplica dele. A controvérsia está viva.',
        kind: 'teoria', kindLabel: 'CARTAS · conteúdo parcial', reputation: 0.42,
    },
    {
        year: '2010', who: 'Marcinek et al.', title: 'O acordo pelo experimento',
        text: 'H⁺ gerado e lactato sobem juntos: inclinação 0,98 (r² = 0,86). Seja qual for a contabilidade, o lactato é o termômetro fiel da acidose.',
        kind: 'animal', kindLabel: 'ANIMAL · camundongo isquêmico', reputation: 0.3,
    },
];

export const TIMELINE_STEPS = [
    { tab: 'A acusação', events: [0, 1] },
    { tab: 'Primeiras provas', events: [2, 3] },
    { tab: 'A reabilitação', events: [4, 5] },
    { tab: 'A briga e o acordo', events: [6, 7] },
] as const;
