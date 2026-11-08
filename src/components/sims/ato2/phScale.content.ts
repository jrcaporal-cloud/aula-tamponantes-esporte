/** Slide 20 — "Uma Escala de Nanomols". Números: SAHLIN1976 (biópsia) e NIELSEN2002 (sangue arterial). */

/** [H⁺] em nmol/L a partir do pH (cálculo: 10^(9 − pH)). */
export const nanomolar = (ph: number): number => Math.pow(10, 9 - ph);

export const PH_MIN = 6.4;
export const PH_MAX = 7.6;
/** Cada ponto do campo = 5 nmol/L de H⁺. */
export const NM_PER_DOT = 5;
export const MAX_DOTS = Math.ceil(nanomolar(PH_MIN) / NM_PER_DOT);

export interface PhMark {
    id: string;
    label: string;
    ph: number;
    /** Onde o pH foi medido: sangue (ciano) ou músculo (laranja). */
    where: 'sangue' | 'músculo';
}

export const MARKS: readonly PhMark[] = [
    { id: 'blood', label: 'sangue em repouso', ph: 7.42, where: 'sangue' },
    { id: 'rest', label: 'músculo em repouso', ph: 7.08, where: 'músculo' },
    { id: 'exhaust', label: 'músculo na exaustão', ph: 6.6, where: 'músculo' },
    { id: 'race', label: 'sangue após 2.000 m', ph: 7.07, where: 'sangue' },
];

export interface PhStep {
    tab: string;
    ph: number;
    headline: string;
    text: string;
    source: string;
}

export const PH_STEPS: readonly PhStep[] = [
    {
        tab: 'Sangue',
        ph: 7.42,
        headline: 'pH 7,42 = 38 nanomols de H⁺ por litro',
        text: 'O pH é o expoente negativo do H⁺. A régua parece linear; o H⁺ não é: cada 0,3 a menos dobra a concentração, cada 1,0 a menos multiplica por dez.',
        source: 'Sangue arterial de remadores em repouso — Nielsen 2002 (humano, n = 5).',
    },
    {
        tab: 'Músculo parado',
        ph: 7.08,
        headline: 'Dentro da fibra parada já há o dobro',
        text: 'Uma diferença de 0,34 na régua: 83 contra 38 nmol/L. O músculo em repouso vive mais ácido que o sangue que o banha.',
        source: 'Biópsia do vasto lateral, repouso — Sahlin 1976 (humano).',
    },
    {
        tab: 'Exaustão',
        ph: 6.6,
        headline: 'Na exaustão, o H⁺ triplica dentro da fibra',
        text: 'De 7,08 para 6,60 são só 0,48 na régua — e 3 vezes mais H⁺: 251 nmol/L, 6,6 vezes o sangue em repouso.',
        source: 'Biópsia logo após exercício dinâmico até a exaustão — Sahlin 1976 (humano).',
    },
    {
        tab: 'Sangue após a prova',
        ph: 7.07,
        headline: 'No fim de um 2.000 m, o sangue tem o H⁺ do músculo em repouso',
        text: 'pH arterial 7,07: 85 nmol/L, o dobro do início. A acidose não fica presa na fibra — ela transborda para o sangue. É desse transbordamento que o bicarbonato vai cuidar.',
        source: 'Sangue arterial no último minuto do 2.000 m em remoergômetro — Nielsen 2002 (humano).',
    },
];
