/** Passos do "Onze Atletas e um Sussurro". Cada passo traz o cenário que o passador aplica. */

export interface PowerStep {
    tab: string;
    headline: string;
    text: string;
    cv: number;
    n: number;
    showHist: boolean;
    highlight: boolean;
    source: string;
}

export const EFFECT = 1;
export const STUDIES = 400;
export const MAX_N = 80;
/** Semente da simulação (o ano dos três frascos). */
export const SEED = 1977;

export interface Option { value: number; label: string }

export const CV_OPTIONS: readonly Option[] = [
    { value: 1, label: '1%' },
    { value: 1.3, label: '1,3%' },
    { value: 2, label: '2%' },
    { value: 3.35, label: '3,35%' },
    { value: 5, label: '5%' },
];

export const N_OPTIONS: readonly Option[] = [
    { value: 5, label: '5' },
    { value: 11, label: '11' },
    { value: 16, label: '16' },
    { value: 40, label: '40' },
    { value: 80, label: '80' },
];

export const POWER_STEPS: readonly PowerStep[] = [
    {
        tab: 'Um estudo',
        headline: 'O efeito existe. O estudo não vê.',
        text: 'Programamos um efeito real de +1%. Onze atletas, cruzado, teste com CV de 2%. Este estudo observa +0,5% e o IC cruza o zero: "sem efeito".',
        cv: 2, n: 11, showHist: false, highlight: false,
        source: '~11 pessoas por estudo: 2.019 participantes ÷ 189 artigos (cálculo; de Oliveira 2022).',
    },
    {
        tab: '400 estudos',
        headline: 'Cada estudo é um sorteio',
        text: 'Os mesmos 11 atletas, o mesmo efeito real, 400 vezes. O resultado se espalha de −2% a +4%: é o ruído do teste dividido pela raiz de 11.',
        cv: 2, n: 11, showHist: true, highlight: false,
        source: 'Simulação: diferença de cada atleta = 1% + ruído √2 × CV; teste t pareado.',
    },
    {
        tab: 'O vencedor',
        headline: 'A maldição do vencedor',
        text: 'Só 1 em cada 5 estudos dá p < 0,05: o poder é de ~20%. E quem "achou" relata, em média, o dobro do efeito real. Se só esses viram artigo, a literatura exagera.',
        cv: 2, n: 11, showHist: true, highlight: true,
        source: 'Poder ~20% com CV 2%, n = 11 e efeito de 1%: cálculo ilustrativo (dossiê 05).',
    },
    {
        tab: 'Mais atletas',
        headline: 'Quarenta atletas ainda erram',
        text: 'Com 40 atletas o poder passa de 50% e o exagero encolhe. Usando a própria prova como desfecho, um cruzado precisaria de 16 a 65 atletas.',
        cv: 2, n: 40, showHist: true, highlight: true,
        source: 'Hopkins WG et al. Med Sci Sports Exerc 1999 — cruzado 16–65; paralelo 65–260.',
    },
    {
        tab: 'Teste melhor',
        headline: 'Menos ruído vale mais',
        text: 'O n necessário cresce com o quadrado do CV: com CV de 1%, 16 atletas já acertam 7 em 10. E o alvo da elite é menor: a menor mudança relevante é 0,3 × a variação entre provas.',
        cv: 1, n: 16, showHist: true, highlight: true,
        source: 'Hopkins 2004 (SWC) · Paton & Hopkins 2006: ciclista de elite varia 1,3% entre contrarrelógios; SWC ~0,6%.',
    },
];
