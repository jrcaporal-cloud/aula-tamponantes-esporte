import type { EvidenceKind } from './ui';

/**
 * Slide 25 — "Lactato: Combustível, não Lixo". BROOKS1986a/b (≥75% oxidado; ~20% vira glicose;
 * produção com O₂ abundante), JUEL1999/PILEGAARD1999 (MCT1 Km ~5 mM, MCT4 Km ~20 mM),
 * SAHLIN1976 (músculo 2–3× o sangue; meia-vida de remoção 9,5 min).
 */

export const HALF_LIFE_MIN = 9.5;

/** Fração que resta no músculo após t minutos de recuperação (cálculo com a meia-vida). */
export const remaining = (t: number): number => Math.pow(0.5, t / HALF_LIFE_MIN);

export interface ShuttleStep {
    tab: string;
    headline: string;
    text: string;
    source: string;
    kind: EvidenceKind;
    kindLabel: string;
}

export const SHUTTLE_STEPS: readonly ShuttleStep[] = [
    {
        tab: 'Produzido com O₂',
        headline: 'A fibra rápida faz lactato mesmo com oxigênio',
        text: 'A glicólise rápida gera piruvato mais depressa do que a mitocôndria consome; a LDH transforma o excedente em lactato. No fim do esforço, há 2 a 3 vezes mais lactato no músculo do que no sangue.',
        source: 'Brooks 1986 (traçadores); Sahlin 1976 (biópsia, humano).',
        kind: 'humano', kindLabel: 'HUMANO + ANIMAL',
    },
    {
        tab: 'Portas de saída',
        headline: 'Uma porta para sair, outra para entrar',
        text: 'O lactato sai acompanhado de um H⁺ pelo MCT4, de baixa afinidade e mais presente nas fibras tipo II. Entra pelo MCT1, de alta afinidade, nas fibras oxidativas e no coração.',
        source: 'Juel & Halestrap 1999 (revisão); Pilegaard 1999 (expressão em músculo humano).',
        kind: 'humano', kindLabel: 'HUMANO · expressão',
    },
    {
        tab: 'O destino',
        headline: 'Três quartos viram energia na hora',
        text: 'No exercício estável, ≥75% do lactato formado é oxidado durante o próprio exercício — pelas fibras vizinhas e pelo coração. Só ~20% vira glicose. É uma moeda de troca entre tecidos.',
        source: 'Brooks 1986, Med Sci Sports Exerc (traçadores isotópicos, humanos e animais).',
        kind: 'revisão', kindLabel: 'TRAÇADORES · revisão',
    },
    {
        tab: 'Some em minutos',
        headline: 'Na recuperação, o lactato do músculo cai à metade a cada 9,5 min',
        text: 'Em meia hora resta ~11%; em uma hora, quase nada. O que dói dois dias depois não pode ser o lactato — é o próximo julgamento.',
        source: 'Meia-vida: Sahlin 1976 (humano). Frações = cálculo.',
        kind: 'humano', kindLabel: 'HUMANO · biópsia',
    },
];
