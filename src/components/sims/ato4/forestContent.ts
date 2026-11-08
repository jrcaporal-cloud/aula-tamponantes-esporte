import { C } from '../kit/palette';

/** Dados e textos do slide 65 "O que Dizem 40 Ensaios" (SMD com IC95%). */

export interface ForestRow {
    label: string;
    detail: string;
    es: number;
    lo: number;
    hi: number;
    color: string;
    /** Passo a partir do qual a linha aparece. */
    from: number;
}

export const FOREST_ROWS: readonly ForestRow[] = [
    { label: 'Todos os ensaios', detail: '40 estudos · 1.461 pessoas', es: 0.18, lo: 0.08, hi: 0.28, color: C.carno, from: 0 },
    { label: 'Capacidade', detail: 'até a exaustão · 0,5–10 min', es: 0.5, lo: 0.246, hi: 0.753, color: C.carno, from: 1 },
    { label: 'Desempenho', detail: 'tempo ou distância fixos', es: 0.11, lo: -0.201, hi: 0.416, color: C.carnoSoft, from: 1 },
    { label: 'Sprints repetidos', detail: '17 ECR · Liang 2026', es: -0.018, lo: -0.207, hi: 0.17, color: C.co2, from: 2 },
];

export interface ForestStep {
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
}

export const FOREST_STEPS: readonly ForestStep[] = [
    {
        tab: 'O efeito médio', kicker: 'Saunders 2017 · BJSM',
        title: 'Pequeno, mas diferente de zero',
        text: 'Quarenta ensaios duplo-cegos com placebo, 1.461 participantes; os cruzados ficaram de fora por causa do washout longo. Efeito global: 0,18, com intervalo de 0,08 a 0,28.',
        takeaway: 'É o mesmo tamanho do bicarbonato (0,17 em 189 estudos): duas testemunhas de voz baixa.',
    },
    {
        tab: 'Capacidade × desempenho', kicker: 'Saunders 2017 · meta-regressão',
        title: 'A mesma molécula, duas perguntas',
        text: 'Na janela de 0,5 a 10 min, o tipo de teste mudou a resposta. Pedalar até a exaustão (capacidade): 0,50. Cumprir tempo ou distância fixos, como numa prova (desempenho): 0,11, com intervalo cruzando o zero.',
        takeaway: 'A prova real é de desempenho. O número que impressiona é de capacidade.',
    },
    {
        tab: 'Onde não', kicker: 'Hobson 2012 · Liang 2026 · Chung 2014',
        title: 'Curto demais, repetido demais, longo demais',
        text: 'Abaixo de 60 s, sem efeito. Sprints repetidos: −0,02 em 17 ensaios. E ciclistas com carnosina +143 a +161% não melhoraram o contrarrelógio de 1 h.',
        takeaway: 'Mecanismo real, contexto errado: se o esforço não é limitado por acidose, o tampão não tem o que fazer.',
    },
    {
        tab: 'Força e corpo', kicker: 'Kendrick 2008 · Ashtary-Larky 2022',
        title: 'Não é suplemento de força nem de composição',
        text: 'Dez semanas de treino de força com 6,4 g/dia: carnosina subiu, força e composição não. Em 20 estudos, a massa livre de gordura mudou +0,05 kg (−0,71 a 0,82).',
        takeaway: 'Mais carga também não comprou mais efeito: a dose total não moderou o resultado (p = 0,438).',
    },
];

export interface DurationZone {
    label: string;
    verdict: string;
    width: number;
    color: string;
}

export const DURATION_ZONES: readonly DurationZone[] = [
    { label: '< 60 s', verdict: 'nulo (P = 0,312)', width: 24, color: C.co2 },
    { label: '0,5–10 min', verdict: 'capacidade ↑ · desempenho incerto', width: 50, color: C.carno },
    { label: '1 h', verdict: 'nulo (Chung 2014)', width: 26, color: C.co2 },
];

export const OUTSIDE_FACTS: readonly { value: string; label: string }[] = [
    { value: 'nulo', label: 'força em 10 semanas de treino (Kendrick 2008)' },
    { value: '+0,05 kg', label: 'massa livre de gordura, 20 estudos (I² = 0%)' },
    { value: '+2,85%', label: 'mediana com 179 g, em outra métrica (Hobson 2012)' },
];
