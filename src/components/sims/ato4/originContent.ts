/** Textos e números do slide 60 "Uma Molécula que Veio da Carne". */

export interface OriginStep {
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
}

export const ORIGIN_STEPS: readonly OriginStep[] = [
    {
        tab: '1900', kicker: 'Boldyrev 2013 · Drozak 2010',
        title: 'Achada na carne, explicada um século depois',
        text: 'Em 1900, a carnosina apareceu como um composto nitrogenado não proteico, abundante na carne. A enzima que a fabrica, a CARNS1, só ganhou identidade molecular em 2010.',
        takeaway: 'Cento e dez anos de função conhecida e fábrica desconhecida.',
    },
    {
        tab: 'Quem tem muito', kicker: 'Dolan 2019 · Harris 1990',
        title: 'Baleia, galgo, cavalo e peito de frango',
        text: 'As espécies que vivem de esforço sem oxigênio suficiente são ricas em dipeptídeos de histidina. No cavalo e no galgo, a capacidade tamponante do músculo é maior sobretudo por causa deles.',
        takeaway: 'O que esses animais têm em comum é o metabolismo não oxidativo, e um tampão dentro da fibra.',
    },
    {
        tab: 'O humano', kicker: 'Mannion 1992 · Baguet 2011',
        title: 'O humano é "pobre" em carnosina',
        text: 'No vasto lateral de 50 adultos, 20,0 mmol/kg de massa seca em média, com faixa de 7,2 a 30,7; anserina indetectável. Atletas explosivos têm ~30% acima da referência; fundistas, ~20% abaixo.',
        takeaway: 'Variação de até 4× entre pessoas: o ponto de partida não é igual para todos.',
    },
    {
        tab: 'Quem tem menos', kicker: 'Everaert 2011 · Blancquaert 2018',
        title: 'Dieta, sexo e idade puxam para baixo',
        text: 'Vegetarianos de longa data: −26% no gastrocnêmio. Homens têm 28 a 82% mais que mulheres, conforme o músculo; no sóleo, a carnosina cai com a idade. Já virar vegetariana por 6 meses não mudou a carnosina.',
        takeaway: 'Bianca, nossa nadadora ovolactovegetariana (caso fictício), provavelmente parte de um tanque menor.',
    },
];

export interface Bar {
    label: string;
    value: number;
    text: string;
}

/** Mannion 1992, vasto lateral (mmol/kg de massa seca). */
export const HUMAN_BARS: readonly Bar[] = [
    { label: 'Homens', value: 21.3, text: '21,3' },
    { label: 'Mulheres', value: 17.5, text: '17,5' },
];
export const HUMAN_RANGE = { lo: 7.2, hi: 30.7, mean: 20 } as const;

/** Everaert 2011 (¹H-ERM), em relação ao grupo de referência = 100. */
export const LOWER_BARS: readonly { label: string; ref: string; value: number; text: string }[] = [
    { label: 'Vegetarianos', ref: 'onívoros (homens)', value: 74, text: '−26% · gastrocnêmio' },
    { label: 'Mulheres', ref: 'homens', value: Math.round(100 / 1.28), text: 'homens +28% · gastrocnêmio' },
    { label: 'Mulheres', ref: 'homens', value: Math.round(100 / 1.82), text: 'homens +82% · tibial anterior' },
];

export const ANIMALS: readonly { name: string; detail: string }[] = [
    { name: 'Baleias', detail: 'mergulho em apneia' },
    { name: 'Cavalos de corrida', detail: 'tampão muscular alto' },
    { name: 'Galgos', detail: 'corrida de velocidade' },
    { name: 'Frango e peru', detail: 'músculo branco, glicolítico' },
];
