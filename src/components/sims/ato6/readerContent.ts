/**
 * "Leitor Crítico": resumo FICTÍCIO montado para a aula, com as bandeiras na ordem de leitura.
 * Cada explicação aponta para números conferidos no dossiê 05 (e 01).
 */

export type FlagId = 'n' | 'placebo' | 'test' | 'dropout' | 'mbi' | 'claim' | 'funding';

export interface Flag {
    id: FlagId;
    tab: string;
    title: string;
    why: string;
    source: string;
}

/** Texto do resumo: trechos simples (string) e trechos com bandeira. */
export type Segment = string | { flag: FlagId; text: string };

export const PAPER = {
    journal: 'Revista Fictícia de Desempenho Esportivo · 2026',
    title: 'Bicarbonato de sódio melhora o desempenho de lutadores: ensaio randomizado duplo-cego',
    body: [
        'Objetivo: avaliar o efeito do bicarbonato de sódio no desempenho de lutadores. Métodos: ',
        { flag: 'n', text: 'nove lutadores universitários' },
        ' receberam 0,3 g/kg de bicarbonato ou placebo (',
        { flag: 'placebo', text: 'farinha dissolvida em água' },
        '), em ordem aleatória, 60 min antes de um ',
        { flag: 'test', text: 'teste de ciclismo até a exaustão a 110% da potência máxima' },
        '. ',
        { flag: 'dropout', text: 'Dois participantes que tiveram diarreia foram excluídos da análise.' },
        ' Resultados: o tempo até a exaustão aumentou 18% com bicarbonato, efeito ',
        { flag: 'mbi', text: '"possivelmente benéfico" (inferência baseada em magnitude)' },
        '. Conclusão: ',
        { flag: 'claim', text: 'o bicarbonato melhora o desempenho em lutas e deve ser recomendado a atletas de combate.' },
        ' ',
        { flag: 'funding', text: 'Financiamento: fabricante do suplemento testado.' },
    ] as readonly Segment[],
};

export const FLAGS: readonly Flag[] = [
    {
        id: 'n', tab: 'n = 9', title: 'Nove pessoas, sem cálculo de amostra',
        why: 'Com ~11 por estudo, o poder para achar 1% fica perto de 20%, e os estudos que "acham" exageram o efeito. Na revisão da MBI, só 15% dos artigos calcularam a amostra antes.',
        source: 'Simulação do slide "Onze Atletas" · de Oliveira 2022 (cálculo) · Lohse 2020.',
    },
    {
        id: 'placebo', tab: 'Placebo', title: 'Placebo sem sódio, em solução',
        why: 'Farinha não tem gosto de sal nem dá estufamento. Em solução, só 1 em 3 fica em dúvida logo após beber; um placebo de sal com água com gás rendeu +9,5% sozinho.',
        source: 'Gurton 2022 · Higgins & Shabir 2016.',
    },
    {
        id: 'test', tab: 'Teste', title: 'Teste de capacidade, e de bicicleta',
        why: 'Tempo até a exaustão mede capacidade: o % dele não vira % de prova. E o lutador foi testado pedalando. Na β-alanina, o efeito em capacidade é ~5× o efeito em desempenho (0,50 × 0,11).',
        source: 'Amann 2008 · Saunders 2017 (BJSM).',
    },
    {
        id: 'dropout', tab: 'Perdas', title: 'Excluir quem passou mal',
        why: 'Viés de atrito: sai justamente quem mais sentiu o efeito colateral. Na corrida, ajustar pelas desistências por GI levou o efeito a SMD 0,18 (IC95% −0,01 a 0,36).',
        source: 'Miller LE et al. JISSN 2025.',
    },
    {
        id: 'mbi', tab: 'MBI', title: '"Possivelmente benéfico"',
        why: 'É a linguagem da MBI. Com 8 a 15 por grupo, alegações "possíveis" são falso-positivas em 22 a 45% das vezes.',
        source: 'Lohse KR et al. PLoS One 2020 · Sainani 2018.',
    },
    {
        id: 'claim', tab: 'Conclusão', title: 'A conclusão foi mais longe que os dados',
        why: 'De sete universitários numa bicicleta para "lutas" e "atletas de combate": outra população, outro teste, outro desfecho. A maior parte dos estudos já é de nível 0 a 2.',
        source: 'Smith 2022 · McKay 2022.',
    },
    {
        id: 'funding', tab: 'Dinheiro', title: 'Financiado pelo fabricante',
        why: 'Não invalida o dado, mas pede replicação independente — como nos estudos do bicarbonato em hidrogel, feitos por grupos com vínculo com a empresa.',
        source: 'Dossiê 01 (conflitos declarados nos textos completos).',
    },
];

export const VERDICT = {
    title: 'O resumo que os dados permitem',
    text: 'Em sete universitários que completaram o estudo, o tempo até a exaustão na bicicleta foi maior com bicarbonato do que com um placebo que não imita o bicarbonato. O efeito em lutas não foi testado.',
};
