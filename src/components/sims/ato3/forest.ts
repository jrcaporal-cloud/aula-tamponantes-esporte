/** Slide 43: estimativas agrupadas do bicarbonato (dossiê 01). Todas são DMP/ES com IC95 (ICr95 em de Oliveira). */

export type ForestGroup = 'geral' | 'duracao' | 'forca' | 'combate';

export interface ForestEstimate {
    id: string;
    label: string;
    sub: string;
    group: ForestGroup;
    /** Sem estimativa agrupada publicada (só "n.s."): a linha mostra texto em vez de losango. */
    est?: number;
    lo?: number;
    hi?: number;
    /** Certeza GRADE da revisão guarda-chuva (Grgic 2021), quando ela classificou esse desfecho. */
    certainty?: 'baixa' | 'moderada';
}

export const FOREST_ROWS: readonly ForestEstimate[] = [
    { id: 'geral', label: 'Geral', sub: '189 artigos · de Oliveira 2022', group: 'geral', est: 0.17, lo: 0.12, hi: 0.21 },
    { id: 'prova', label: 'Provas de 45 s a 8 min', sub: '25 estudos · n = 235 · Christensen 2017', group: 'duracao', est: 0.40, lo: 0.27, hi: 0.54, certainty: 'baixa' },
    { id: 'tt', label: 'Contrarrelógio de ciclismo', sub: '18 estudos · I² 0% · Lopes-Silva 2023', group: 'duracao', est: 0.42, lo: 0.21, hi: 0.63 },
    { id: 'forca', label: 'Força máxima', sub: '11 estudos · n = 110 · Grgic 2020', group: 'forca', est: -0.03, lo: -0.18, hi: 0.12 },
    { id: 'resist', label: 'Resistência muscular', sub: '12 estudos · I² 70% · Grgic 2020', group: 'forca', est: 0.37, lo: 0.15, hi: 0.59, certainty: 'baixa' },
    { id: 'combate', label: 'Esportes de combate', sub: '8 artigos · Miranda 2022', group: 'combate' },
];

export interface ForestStep {
    tab: string;
    /** Grupos já revelados neste passo. */
    shown: readonly ForestGroup[];
    /** Grupo em destaque (null = todos iguais). */
    focus: ForestGroup | null;
    foot: string;
}

export const FOREST_STEPS: readonly ForestStep[] = [
    { tab: 'Geral', shown: ['geral'], focus: 'geral', foot: 'A média de 189 artigos: ES 0,17. Real, mas pequeno — bem menor que o de qualquer ensaio bonito isolado.' },
    { tab: 'Por duração', shown: ['geral', 'duracao'], focus: 'duracao', foot: 'Quando o teste é uma prova fechada de 45 s a 8 min, a estimativa sobe de 0,17 para 0,40. No contrarrelógio de ciclismo, 18 estudos concordam (I² 0%).' },
    { tab: 'Força × resistência', shown: ['geral', 'duracao', 'forca'], focus: 'forca', foot: 'Ninguém fica mais forte: força máxima colada no zero. Repetir mais, quando a acidose limita, é outra história.' },
    { tab: 'Combate', shown: ['geral', 'duracao', 'forca', 'combate'], focus: 'combate', foot: 'Nas lutas, há ensaios positivos pequenos, mas a meta-análise não achou efeito agrupado no desempenho.' },
    { tab: 'Certeza', shown: ['geral', 'duracao', 'forca', 'combate'], focus: null, foot: 'A revisão guarda-chuva gradua a evidência: baixa a moderada. Nenhuma conclusão sobre o bicarbonato tem certeza alta.' },
];

/** CARR2011MA: sprint único de 1 min, potência média (%, LC90). */
export const CARR_MIRROR = [
    { label: 'alcalose (NaHCO₃)', est: 1.7, ci: 2.0, tone: 'base' },
    { label: 'acidose (NH₄Cl)', est: -1.6, ci: 1.9, tone: 'acid' },
] as const;

/** GRGIC2021UMB: certeza GRADE por desfecho. */
export const GRADE_LIST = {
    moderada: ['Wingate (potência pico e média)', 'Yo-Yo'],
    baixa: ['Provas de ~45 s a 8 min', 'Resistência muscular', 'Remo 2.000 m'],
} as const;

/** Combate: ensaios citados no posicionamento ISSN (positivos e pequenos). */
export const COMBAT_TRIALS = [
    { sport: 'Judô', n: 'n = 9 e 14', who: 'Artioli 2007' },
    { sport: 'Boxe', n: 'n = 10', who: 'Siegler 2010' },
    { sport: 'Taekwondo', n: 'n = 9', who: 'Lopes-Silva 2018' },
    { sport: 'Caratê', n: 'n = 8', who: 'Rezaei 2019' },
] as const;
