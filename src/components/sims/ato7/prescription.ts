import type { Signal } from './shared';

/**
 * Slides 100 e 101 — os cartões de prescrição (bicarbonato e β-alanina).
 * Tipos comuns: cada passo preenche uma linha do cartão e abre, ao lado, o que os consensos dizem,
 * com o número, o selo de honestidade (o tipo de evidência) e a fonte. Números: dossiês 01, 02, 04 e 06.
 */

/** Faixa numa régua (dose, minutos, semanas). `from === to` desenha um ponto. */
export interface RangeRow {
    label: string;
    from: number;
    to: number;
    color: string;
    /** Texto curto ao lado da barra (ex.: "ótima 0,3"). */
    note?: string;
    /** Ponto em destaque dentro da faixa (ex.: a dose ótima). */
    mark?: number;
}

export interface RangeVisual {
    kind: 'range';
    /** Unidade do eixo, escrita sob a régua. */
    unit: string;
    min: number;
    max: number;
    ticks: readonly number[];
    /** Casas decimais dos rótulos do eixo. */
    decimals: number;
    rows: readonly RangeRow[];
}

export interface StatsVisual {
    kind: 'stats';
    items: readonly { value: string; label: string; color: string }[];
}

export interface FlagsVisual {
    kind: 'flags';
    items: readonly { label: string; signal: Signal }[];
}

export type CardVisual = RangeVisual | StatsVisual | FlagsVisual;

export interface CardField {
    tab: string;
    /** Rótulo da linha no cartão. */
    field: string;
    /** O que fica escrito no cartão (curto: é o que o aluno fotografa). */
    value: string;
    title: string;
    text: string;
    points: readonly string[];
    /** Selo de honestidade: de onde vem a orientação (consenso, MA, ECR pequeno, regra, cálculo…). */
    seal: string;
    sealColor: string;
    source: string;
    visual: CardVisual;
}

export interface PrescriptionCard {
    compound: string;
    color: string;
    /** Linha sob o nome, no topo do cartão. */
    tagline: string;
    fields: readonly CardField[];
}
