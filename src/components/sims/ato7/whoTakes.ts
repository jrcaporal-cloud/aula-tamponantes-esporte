import type { CastId } from '../ato1/content';
import type { Signal } from './shared';

/**
 * Slide 102 — Quem Leva o Quê. Quadro de decisão por tipo de esforço (dossiê 06, Parte 4.1, com a força máxima
 * separada da resistência muscular como no dossiê 02) e os quatro personagens FICTÍCIOS fechando o fio.
 */

export interface EffortRow {
    id: string;
    name: string;
    examples: string;
    bic: Signal;
    ba: Signal;
    note: string;
    cast: readonly CastId[];
}

export const EFFORT_ROWS: readonly EffortRow[] = [
    { id: 'curtas', name: 'Contínuas de 30 s a 10 min', examples: '800 m · remo 2.000 m · nado 200 m', bic: 'verde', ba: 'verde', note: 'alvo clássico: ES 0,18 em 0,5–10 min', cast: ['julia', 'bianca', 'carlos'] },
    { id: 'resistencia', name: 'Resistência muscular', examples: 'repetições · CrossFit', bic: 'verde', ba: 'amarelo', note: 'SMD 0,37; Fran −12 s', cast: [] },
    { id: 'surtos', name: 'Mais de 10 min, com surtos', examples: 'estrada · sprint final', bic: 'amarelo', ba: 'amarelo', note: 'ES 0,22; evidência em construção', cast: [] },
    { id: 'lutas', name: 'Lutas', examples: 'judô · jiu-jítsu · boxe', bic: 'amarelo', ba: 'amarelo', note: 'lactato sobe; desempenho, não', cast: ['rafael'] },
    { id: 'coletivos', name: 'Sprints repetidos', examples: 'futebol · rúgbi · basquete', bic: 'amarelo', ba: 'amarelo', note: 'nulo agrupado nos dois', cast: [] },
    { id: 'forca', name: 'Força máxima e sprint ≤ 10 s', examples: '1 RM · 100 m · salto', bic: 'vermelho', ba: 'vermelho', note: 'SMD −0,03; a acidose não limita', cast: [] },
    { id: 'longas', name: 'Ritmo estável por horas', examples: 'maratona · ultra', bic: 'vermelho', ba: 'vermelho', note: 'sem ECR; sódio e GI na prova longa', cast: [] },
];

export const WHO_TABS = ['O mapa', 'Onde caem', 'Quem fica'] as const;

export interface WhoStep {
    kicker: string;
    title: string;
    text: string;
    points: readonly string[];
    source: string;
}

export const WHO_STEPS: readonly WhoStep[] = [
    {
        kicker: 'Mapa por tipo de esforço',
        title: 'A fisiologia acende o verde em poucas linhas',
        text: 'Provas contínuas de 30 s a 10 min são o alvo dos dois; a resistência muscular, do bicarbonato. Lutas, coletivos e provas longas com surtos ficam no amarelo.',
        points: ['Força máxima, sprint de até 10 s e ritmo estável por horas: vermelho para os dois.'],
        source: 'de Oliveira 2022; Saunders 2017; Grgic 2020; Silva de Souza 2024; Miranda 2022; Lopes-Silva 2019; Liang 2026; Hobson 2012; Kendrick 2008.',
    },
    {
        kicker: 'Os quatro personagens',
        title: 'Três dos quatro caem na linha verde',
        text: 'Júlia (800 m), Bianca (200 m) e Carlos (2.000 m) estão no alvo clássico; Rafael, nas lutas.',
        points: ['Mas o 200 m de nadadores bem treinados foi nulo: 124,5 × 125,1 s (Gurton 2025).'],
        source: 'Personagens fictícios (dossiê 06, Parte 5); Huang 2025; Gurton 2025.',
    },
];

/** Fecho do slide: a frase que liga o mapa às decisões do slide 94. */
export const WHO_CLOSING = 'A prova abre a porta; idade, remédio, regra e balança decidem quem passa.';
