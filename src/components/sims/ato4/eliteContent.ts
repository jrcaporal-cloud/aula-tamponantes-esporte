/** Textos do slide 66 "Os 'Quases' da Elite" (DERAVE2007, BAGUET2010ROW, KERN2011, ASHTARYLARKY2022). */

export interface EliteStep {
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
}

export const ELITE_STEPS: readonly EliteStep[] = [
    {
        tab: '400 m', kicker: 'Derave 2007 · velocistas de 400 m',
        title: 'A carnosina subiu; o tempo, não',
        text: 'Quinze velocistas, 4,8 g/dia por 4 semanas. Carnosina +47% no sóleo e +37% no gastrocnêmio, medida por ressonância. O torque melhorou nas últimas séries isocinéticas. O tempo de 400 m não mudou.',
        takeaway: 'Mudar o mecanismo não é mudar o desfecho que importa ao atleta.',
    },
    {
        tab: 'Remo 2.000 m', kicker: 'Baguet 2010 · remadores belgas de elite',
        title: 'Quatro segundos e um P = 0,07',
        text: 'Antes, o grupo β-alanina era 0,3 s mais lento. Depois de 7 semanas a 5 g/dia, ficou 4,3 s mais rápido que o placebo no 2.000 m, com P = 0,07. Quem mais ganhou carnosina mais melhorou (r = 0,50).',
        takeaway: '4,3 s em ~6–7 min é ~1% (cálculo): em elite, isso não é pouco.',
    },
    {
        tab: 'Significância × relevância', kicker: 'cálculo ilustrativo',
        title: 'O efeito não muda; muda a incerteza',
        text: 'Com 8 e 9 remadores, o intervalo vai de perto de −0,4 a 9 s. Mantendo o mesmo efeito e a mesma variabilidade, com 10 por grupo o P já cairia para ~0,05. Arraste o n.',
        takeaway: 'P = 0,07 não prova ausência de efeito; prova que o estudo era pequeno para decidir.',
    },
    {
        tab: 'O "spin"', kicker: 'Kern & Robinson 2011',
        title: 'Quando o nulo vira manchete',
        text: 'Wrestlers e jogadores de futebol americano, 4 g/dia por 8 semanas. Nenhuma diferença significativa em nenhum teste. A conclusão do resumo: a β-alanina "parece aumentar o desempenho e a massa magra".',
        takeaway: 'O "quase" honesto reporta a incerteza; o spin a esconde. Leia o resultado antes da conclusão.',
    },
];

/** Remo 2.000 m: diferença β-alanina − placebo (s; positivo = mais rápido). */
export const ROW = { diff: 4.3, before: -0.3, n1: 8, n2: 9, p: 0.07 } as const;

export const KERN_RESULTS: readonly { test: string; result: string }[] = [
    { test: 'Shuttle de 300 jardas (futebol)', result: '−1,1 s × −0,4 s · n.s.' },
    { test: 'Massa magra (wrestlers)', result: '+1,1 lb × −0,98 lb · n.s.' },
    { test: 'Todos os testes', result: 'p > 0,05' },
];
