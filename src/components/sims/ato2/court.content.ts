import type { EvidenceKind } from './ui';

/**
 * Slide 27 — "O H⁺ é Mesmo o Vilão?". Dossiê 03, Parte 5. Atenção: KNUTH2006 é fibra de RATO
 * (o dossiê manda); a prova em fibra humana é SUNDBERG2018.
 */

export interface Exhibit {
    id: string;
    who: string;
    finding: string;
    kind: EvidenceKind;
    kindLabel: string;
    /** Passo em que entra no tribunal. */
    step: number;
    /** Prova que não se reproduziu. */
    void?: boolean;
}

export const PROSECUTION: readonly Exhibit[] = [
    { id: 'hultman', who: 'Hultman 1985', finding: 'Acidose induzida + estímulo elétrico: força final 44,6% × 55,4% da inicial.', kind: 'humano', kindLabel: 'HUMANO · n = 5', step: 0 },
    { id: 'knuth', who: 'Knuth 2006', finding: 'pH 6,2 a 30 °C: potência de pico −34% (tipo I) e −18% (IIa).', kind: 'animal', kindLabel: 'ANIMAL · fibra de rato', step: 0 },
    { id: 'sundberg', who: 'Sundberg 2018', finding: 'H⁺ + Pi juntos derrubam força, velocidade e potência.', kind: 'humano', kindLabel: 'HUMANO · fibras', step: 0 },
];

export const DEFENSE: readonly Exhibit[] = [
    { id: 'westerblad', who: 'Westerblad 1997', finding: 'Mesma acidose: força −28% a 12 °C, só −10% a 32 °C.', kind: 'animal', kindLabel: 'ANIMAL · camundongo', step: 1 },
    { id: 'cady', who: 'Cady 1989', finding: 'Na doença de McArdle o pH não cai — e a força cai igual.', kind: 'humano', kindLabel: 'HUMANO · ³¹P-ERM', step: 1 },
    { id: 'bangsbo', who: 'Bangsbo 1996', finding: 'Exaustão em pH 6,65 num dia e 6,82 no outro: não há pH de corte.', kind: 'humano', kindLabel: 'HUMANO · n = 7', step: 1 },
    { id: 'pedersen', who: 'Pedersen 2004', finding: 'Acidose "protegeria" a excitabilidade — rato, K⁺ alto, músculo parado.', kind: 'animal', kindLabel: 'ANIMAL · rato', step: 2, void: true },
];

export interface CourtStep {
    tab: string;
    headline: string;
    text: string;
    /** Inclinação da balança: −1 = acusação vence, +1 = defesa vence (leitura didática). */
    tilt: number;
}

export const COURT_STEPS: readonly CourtStep[] = [
    {
        tab: 'Acusação', tilt: -0.8,
        headline: 'O H⁺ rouba potência',
        text: 'Acidificar um humano de fora piora a força mesmo com o músculo estimulado eletricamente. Em fibras, o H⁺ tira potência e, junto com o fosfato, freia a ponte cruzada.',
    },
    {
        tab: 'Defesa', tilt: 0.6,
        headline: 'Aqueça a fibra e o vilão encolhe',
        text: 'Os experimentos clássicos eram no frio. Um músculo que não acidifica fadiga do mesmo jeito, e a força volta com o pH ainda baixo.',
    },
    {
        tab: 'Prova contestada', tilt: 0.3,
        headline: 'A acidose protetora não se repetiu',
        text: 'O efeito apareceu no músculo de rato parado e despolarizado por K⁺. No músculo estimulado até a fadiga, Kristensen 2005 não o reproduziu. Prova anulada.',
    },
    {
        tab: 'O mensageiro', tilt: -0.1,
        headline: 'O H⁺ fala com o cérebro — em grupo',
        text: 'Injetados sob a fáscia de humanos, pH, ATP ou lactato sozinhos não causam nada. Juntos (pH 7,2 + ATP 500 nM + lactato 10 mM), dão fadiga e alguma dor.',
    },
    {
        tab: 'Veredito', tilt: 0,
        headline: 'Cúmplice, não chefe',
        text: 'O tubo de ensaio quase absolve; o atleta inteiro condena em parte: acidose induzida piora e alcalose melhora provas de 1 a 10 min. O H⁺ age em bando.',
    },
];

export const ACCOMPLICES = ['fosfato (Pi)', 'K⁺ fora da fibra', 'liberação de Ca²⁺', 'sinal aferente'] as const;
