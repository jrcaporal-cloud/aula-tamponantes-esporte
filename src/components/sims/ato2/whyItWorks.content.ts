import type { EvidenceKind } from './ui';

/**
 * Slide 29 — "Então por que Tamponar Funciona?". Dossiê 03, Parte 4 e mapa das hipóteses:
 * BISHOP2004 (HCO₃⁻ 23,6 → 30,0; pH muscular de repouso e βm iguais), HOLLIDGE2000 (efluxo da
 * perna 10,0 × 4,2 mmol/min a 75% VO₂máx), MAINWOOD1975 (rã), STREET2005 (H⁺ 79 × 131 nM;
 * K⁺ 8,0 × 11,0 mM), RAYMER2004 (acidose intracelular adiada), CAIRNS2006.
 */

export interface WhyFact {
    text: string;
    kind: EvidenceKind;
    label: string;
}

export interface WhyStep {
    tab: string;
    headline: string;
    text: string;
    facts: readonly WhyFact[];
}

export const WHY_STEPS: readonly WhyStep[] = [
    {
        tab: 'Fica do lado de fora',
        headline: 'O bicarbonato não entra na fibra',
        text: 'Ele sobe no sangue, mas o pH do músculo em repouso e a capacidade tamponante da fibra não mudam. Se ajuda, ajuda de fora.',
        facts: [
            { text: 'HCO₃⁻ em repouso 23,6 → 30,0 mmol/L; pH muscular de repouso e βm iguais.', kind: 'humano', label: 'Bishop 2004 · duplo-cego' },
        ],
    },
    {
        tab: 'O gradiente puxa',
        headline: 'Fora mais alcalino, mais H⁺ e lactato saem',
        text: 'O MCT leva lactato⁻ e H⁺ juntos, a favor do gradiente. Com o lado de fora mais alcalino, a porta trabalha mais. Use o botão para comparar.',
        facts: [
            { text: 'Efluxo de lactato da perna a 75% VO₂máx: 10,0 × 4,2 mmol/min.', kind: 'humano', label: 'Hollidge 2000 · n = 8' },
            { text: 'pH externo 8,0: o pico de efluxo dobra ou triplica.', kind: 'animal', label: 'Mainwood 1975 · rã' },
        ],
    },
    {
        tab: 'Glicólise e K⁺',
        headline: 'A fábrica acelera e o potássio fica no lugar',
        text: 'Com menos H⁺ dentro, a glicólise freia menos: mais ATP anaeróbio. E sobra menos K⁺ do lado de fora da fibra, o que ajuda a membrana a continuar excitável.',
        facts: [
            { text: 'Glicogenólise acelerada; lactato muscular 72,8 × 65,2 mmol/kg ps.', kind: 'humano', label: 'Hollidge 2000' },
            { text: 'No interstício: H⁺ 79 × 131 nM; K⁺ 8,0 × 11,0 mM (citrato de sódio).', kind: 'humano', label: 'Street 2005 · n = 7' },
        ],
    },
    {
        tab: 'Acidose adiada',
        headline: 'A acidose chega mais tarde, não menor',
        text: 'Em exercício progressivo, o início da acidose dentro da fibra atrasou, e o tempo até a fadiga subiu ~12% — sem mudar o total de H⁺ acumulado.',
        facts: [
            { text: 'Início da acidose intracelular 1,17 × 1,28 W; tempo até a fadiga +~12%.', kind: 'humano', label: 'Raymer 2004 · ³¹P-ERM' },
        ],
    },
    {
        tab: 'Soma de mecanismos',
        headline: 'Não há um mecanismo só',
        text: 'Efluxo, glicólise, potássio e, talvez, o sinal que o músculo manda ao cérebro. Cada peça tem prova; o peso de cada uma é incerto e muda com o tipo de esforço.',
        facts: [
            { text: 'Revisão: em corpo inteiro, alcalose melhora provas de 1–10 min.', kind: 'revisão', label: 'Cairns 2006' },
        ],
    },
];

/** Mapa das hipóteses (dossiê 03): o que tem prova em humano e o que é só animal/in vitro. */
export const HYPOTHESES = [
    { id: 'efflux', label: 'mais efluxo de H⁺/lactato', human: 'Hollidge, Sostaric, Raymer', other: 'Mainwood (rã)' },
    { id: 'glyco', label: 'glicólise menos inibida', human: 'Hollidge, Bishop', other: '—' },
    { id: 'k', label: 'menos K⁺ fora da fibra', human: 'Street, Sostaric, Bangsbo', other: 'rato: sentido oposto' },
    { id: 'xb', label: 'menos H⁺ + Pi na ponte cruzada', human: 'Sundberg, Hultman', other: 'Knuth, Woodward' },
    { id: 'sense', label: 'percepção / aferentes III–IV', human: 'Pollak, Amann (indiretos)', other: 'Light (camundongo)' },
] as const;

/** Efluxo de lactato da perna a 75% VO₂máx (HOLLIDGE2000). */
export const EFFLUX = { controle: 4.2, alcalose: 10.0 } as const;
