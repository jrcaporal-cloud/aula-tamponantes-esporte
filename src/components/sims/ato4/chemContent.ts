/** Textos e números do slide 61 "β-alanina + Histidina = Carnosina". */

export interface ChemStep {
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
}

export const CHEM_STEPS: readonly ChemStep[] = [
    {
        tab: 'Síntese',
        kicker: 'Drozak 2010 · Sale 2010',
        title: 'A fibra monta a carnosina com duas peças',
        text: 'A CARNS1 liga β-alanina e L-histidina gastando ATP. A enzima só foi identificada em 2010. A histidina sobra no músculo; a β-alanina chega pouco: é ela o fator limitante.',
        takeaway: 'Histidina sozinha, 3,5 g/dia por 23 dias, não mudou a carnosina (Blancquaert 2017).',
    },
    {
        tab: 'O imidazol',
        kicker: 'Sale 2010 · Mannion 1992',
        title: 'O anel que segura o H⁺',
        text: 'O imidazol da carnosina tem pKa 6,83, bem na faixa em que o músculo acidifica. Arraste o pH: entre 7,1 e 6,5, a fração de anéis com H⁺ quase dobra.',
        takeaway: 'Em humanos, a carnosina responde por ~7% do tampão muscular: relevante, não dominante.',
    },
    {
        tab: 'Carnosinase',
        kicker: 'de Jager 2023',
        title: 'No sangue, a carnosina pronta é cortada em minutos',
        text: 'A carnosinase do soro (CN1) quebra a carnosina em β-alanina + histidina. Meia-vida no plasma: 1,2 min para a carnosina, 2,1 min para a anserina e 34,9 min para a balenina.',
        takeaway: 'Engolir carnosina não é atalho: o músculo precisa remontá-la.',
    },
    {
        tab: 'Fonte cara',
        kicker: 'Harris 2006',
        title: 'Carnosina oral funciona como β-alanina',
        text: 'Em 4 semanas, L-carnosina em dose equivalente (isomolar) a 6,4 g/dia de β-alanina subiu a carnosina muscular tanto quanto a própria β-alanina.',
        takeaway: 'Mesmo resultado, molécula mais cara: a carnosina é só uma forma de entregar β-alanina.',
    },
];

export const PKA_IMIDAZOLE = 6.83;

/** Fração de anéis protonados (Henderson–Hasselbalch): cálculo, não medida. */
export const protonatedFraction = (pH: number): number => 1 / (1 + Math.pow(10, pH - PKA_IMIDAZOLE));

export interface HalfLife {
    name: string;
    minutes: number;
    label: string;
}

/** Meia-vida no plasma humano (de Jager 2023). */
export const HALF_LIVES: readonly HalfLife[] = [
    { name: 'carnosina', minutes: 1.2, label: '1,2 min' },
    { name: 'anserina', minutes: 2.14, label: '2,1 min' },
    { name: 'balenina', minutes: 34.9, label: '34,9 min' },
];

export const remaining = (t: number, halfLife: number): number => Math.pow(0.5, t / halfLife);

export interface LoadBar {
    label: string;
    value: number;
    text: string;
}

/** Carnosina muscular após 4 semanas (Harris 2006). */
export const HARRIS_BARS: readonly LoadBar[] = [
    { label: 'β-alanina 3,2 g/dia', value: 42.1, text: '+42,1%' },
    { label: 'β-alanina 6,4 g/dia', value: 64.2, text: '+64,2%' },
    { label: 'L-carnosina isomolar', value: 65.8, text: '+65,8%' },
];
