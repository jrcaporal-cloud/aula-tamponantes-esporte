/** Passos do "O Teste Decide o Tamanho do Efeito". Números de dados reais: dossiê 05 e 01. */

export interface Evidence {
    label: string;
    tte: string;
    tt: string;
    note: string;
}

export interface NoiseStep {
    tab: string;
    headline: string;
    text: string;
    showNoise: boolean;
    evidence: readonly Evidence[];
    source: string;
}

export const GAIN_OPTIONS = [
    { value: 1, label: '+1%' },
    { value: 2, label: '+2%' },
    { value: 3, label: '+3%' },
    { value: 4, label: '+4%' },
];

export const NOISE_STEPS: readonly NoiseStep[] = [
    {
        tab: 'O mesmo ganho',
        headline: 'Um ganho, dois números',
        text: 'O atleta ganha 2% de potência sustentável. No contrarrelógio, ele termina ~2% mais rápido. No tempo até a exaustão (TTE), a mesma melhora vira +22%: a reta da carga fixa corta a curva quase de raspão.',
        showNoise: false,
        evidence: [],
        source: 'Modelo ilustrativo potência–duração (lei de potência, como a modelagem log-log de Laursen 2007).',
    },
    {
        tab: 'O mesmo ruído',
        headline: 'O ruído escala junto',
        text: 'A potência de um dia para o outro oscila. Na reta do TTE essa oscilação vira uma faixa larga de tempos; na hipérbole do contrarrelógio, uma faixa estreita. Os estudos de confiabilidade mostram exatamente isso.',
        showNoise: true,
        evidence: [
            { label: 'Ciclistas treinados', tte: '26,6%', tt: '3,35%', note: 'CV · Jeukendrup 1996' },
            { label: '8 corredores, 5 km', tte: '15,1%', tt: '2,0%', note: 'CV · Laursen 2007' },
        ],
        source: 'Jeukendrup A et al. MSSE 1996 · Laursen PB et al. MSSE 2007.',
    },
    {
        tab: 'Sinal ÷ ruído',
        headline: 'O TTE não é inútil: é outra régua',
        text: 'Mesma hipóxia: o TTE cai 45%, o contrarrelógio fica 5,7% mais lento. Divididos pelo ruído, os dois enxergam a mudança de forma parecida. O erro é ler o % de um como o do outro.',
        showNoise: true,
        evidence: [
            { label: 'Efeito da hipóxia', tte: '−45%', tt: '+5,7%', note: 'tempo · ±13% × ±1,6%' },
            { label: 'Sinal ÷ ruído', tte: '6,3', tt: '4,5', note: 'sensibilidade · Amann 2008' },
        ],
        source: 'Amann M, Hopkins WG, Marcora SM. MSSE 2008;40(3):574-578.',
    },
    {
        tab: 'As manchetes',
        headline: 'O +62% e o +13% são de capacidade',
        text: '1977: bicarbonato, TTE de 270 para 438 s em 5 homens. 2007: β-alanina, +13% de trabalho até a exaustão. Nenhum dos dois é "62% ou 13% mais rápido" numa prova.',
        showNoise: true,
        evidence: [
            { label: 'Jones 1977', tte: '+62%', tt: '—', note: '438 ÷ 270 s, cálculo' },
            { label: 'Hill 2007', tte: '+13%', tt: '—', note: 'trabalho até a exaustão' },
            { label: 'Meta-análise', tte: '0,50', tt: '0,11', note: 'SMD, provas de 0,5–10 min' },
        ],
        source: 'Jones 1977 · Hill 2007 · Saunders 2017 (β-alanina).',
    },
];
