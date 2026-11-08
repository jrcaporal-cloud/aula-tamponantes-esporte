/** Textos do slide 63 "O Homem da Creatina" (dossiê 06, H3; dossiê 02, AIS-GRUPO-A). */

export interface HarrisStep {
    date: string;
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
}

export const HARRIS_STEPS: readonly HarrisStep[] = [
    {
        date: '1992', tab: 'A creatina', kicker: 'Harris, Söderlund & Hultman 1992',
        title: 'Primeiro, ele encheu o músculo de creatina',
        text: 'Roger Harris liderou os estudos originais de creatina: 5 g, 4 a 6 vezes ao dia, por 2 dias ou mais, elevaram a creatina muscular. Cada 5 g equivalem à creatina de 1,1 kg de bife cru.',
        takeaway: 'A creatina enche em dias. Com a carnosina, o mesmo cientista encontraria um tanque de semanas.',
    },
    {
        date: '1997–1999', tab: 'Cavalos e patente', kicker: 'Dunnett & Harris 1999 · US 5,965,596',
        title: 'A β-alanina nasceu em cavalos, numa patente',
        text: 'Em 1997, Harris e Mark Dunnett depositaram a patente de β-alanina para "capacidade de trabalho anaeróbio", concedida em 1999 e hoje da Natural Alternatives International (NAI). No mesmo ano saiu o estudo em 6 puro-sangues.',
        takeaway: 'Detalhe da própria patente: no estudo humano descrito nela, 6 pessoas não mostraram mudança aparente de carnosina.',
    },
    {
        date: '2006–2007', tab: 'Chichester', kicker: 'Harris 2006 · Hill 2007',
        title: 'Em Chichester, a ideia virou suplemento humano',
        text: 'O estudo de 2006 mostrou a carnosina do vasto lateral subindo com β-alanina oral, em tomadas de 400 a 800 mg. Em 2007, Hill e Harris ligaram a carga ao teste de ciclismo a 110% da potência máxima.',
        takeaway: 'Um coautor do estudo de 2006 era da NAI, fabricante do CarnoSyn usado nos ensaios.',
    },
    {
        date: '2012', tab: 'Os conflitos', kicker: 'del Favero 2012 (USP)',
        title: 'A seção que quase ninguém lê',
        text: 'No ensaio em idosos da USP, os autores declaram: Harris é inventor nomeado em patentes da NAI e consultor não remunerado; o estudo foi parcialmente financiado pela NAI, que forneceu o CarnoSyn e o placebo.',
        takeaway: 'Conflito declarado não é fraude: é motivo para perguntar quem replicou o resultado sem esse vínculo.',
    },
];

export interface Fact {
    value: string;
    label: string;
}

export const HORSE_FACTS: readonly Fact[] = [
    { value: '6', label: 'puro-sangues' },
    { value: '100 mg/kg', label: 'β-alanina + 12,5 mg/kg de histidina' },
    { value: '3×/dia', label: 'por 30 dias' },
];

export const PATENT_FACTS: readonly Fact[] = [
    { value: '12/08/1997', label: 'depósito' },
    { value: '12/10/1999', label: 'concessão' },
    { value: 'NAI', label: 'cessionária atual' },
];

export const CHICHESTER_FACTS: readonly Fact[] = [
    { value: '+42,1%', label: 'carnosina, 3,2 g/dia, 4 sem' },
    { value: '+64,2%', label: 'carnosina, 6,4 g/dia, 4 sem' },
    { value: '+58,8% → +80,1%', label: 'carnosina, 4 → 10 sem (Hill)' },
    { value: '+13,0%', label: 'trabalho no teste a 110%, 4 sem' },
];

export const DISCLOSURES: readonly string[] = [
    'Ex-funcionário da NAI entre os autores',
    'Harris: financiamento de pesquisa da NAI',
    'Harris: inventor nomeado em patentes da NAI',
    'Harris: consultor não remunerado da NAI',
    'NAI forneceu CarnoSyn e placebo; financiamento parcial (e FAPESP)',
];
