/** Textos e curvas do slide 64 "O Formigamento". */

export interface ParesthesiaStep {
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
}

export const PARESTHESIA_STEPS: readonly ParesthesiaStep[] = [
    {
        tab: 'A curva',
        kicker: 'Décombaz 2012',
        title: 'O formigamento segue o pico do plasma',
        text: 'Mesma dose, 1,6 g em jejum: pura em solução, o pico foi 248 µM em 30 min; em comprimido de liberação lenta, 82 µM em 1 h. As "agulhadas" em braços e tronco acompanharam a curva pura; com liberação lenta, ficaram iguais ao placebo.',
        takeaway: 'O que formiga é a velocidade de subida no sangue, não a carnosina no músculo.',
    },
    {
        tab: 'O receptor',
        kicker: 'Shinohara 2004 · Liu 2012',
        title: 'Um receptor de coceira que não usa histamina',
        text: 'Em 2004, o receptor MrgD (MrgprD) foi identificado respondendo à β-alanina em concentrações micromolares, em neurônios pequenos do gânglio da raiz dorsal. Em 2012 (J Neurosci), a coceira por β-alanina dependeu dele em camundongos; em humanos, a injeção na pele deu coceira sem pápula nem vermelhidão.',
        takeaway: 'Via independente de histamina: anti-histamínico não é a resposta.',
    },
    {
        tab: 'Quão comum',
        kicker: 'Dolan 2019 · 101 estudos humanos',
        title: 'O único efeito colateral consistente',
        text: 'Na avaliação sistemática de risco, a parestesia foi o único efeito relatado: chance 8,9 vezes maior que com placebo. Abandono igual ao placebo; ALT levemente maior, dentro da faixa de referência; taurina muscular sem queda.',
        takeaway: 'Um efeito que quase todo mundo sente também denuncia quem tomou o suplemento: guarde isso para o cegamento.',
    },
    {
        tab: 'O que fazer',
        kicker: 'Artioli 2010 · ISSN 2015 · COI 2018',
        title: 'Fracionar resolve; formigar não prova nada',
        text: 'Doses únicas acima de 800 mg sem liberação lenta costumam formigar. Os consensos fracionam: doses de até 1,6 g (ISSN) ou 0,8–1,6 g a cada 3–4 h (COI), ou usam liberação lenta. A área sob a curva foi igual nas duas formas.',
        takeaway: '"Formigou, está funcionando" é falso: a liberação lenta carrega o músculo igual, sem formigar (Stegen 2013).',
    },
];

export interface PkCurve {
    name: string;
    peak: number;
    hours: number;
    /** Forma da curva gama (cálculo próprio, ajustado para área igual entre as duas formas). */
    shape: number;
    peakLabel: string;
}

/** Picos e tempos de Décombaz 2012; o desenho entre eles é ilustrativo. */
export const PK_CURVES: readonly PkCurve[] = [
    { name: 'pura', peak: 248, hours: 0.5, shape: 3, peakLabel: '248 µM · 30 min' },
    { name: 'liberação lenta', peak: 82, hours: 1, shape: 1.4, peakLabel: '82 µM · 1 h' },
];

export const concentrationAt = (t: number, c: PkCurve): number =>
    t <= 0 ? 0 : c.peak * Math.pow(t / c.hours, c.shape) * Math.exp(c.shape * (1 - t / c.hours));

/** Posição do limiar no desenho (µM): ilustrativa, sem valor publicado. */
export const ITCH_THRESHOLD = 140;

export const ODDS = { value: 8.9, low: 2.2, high: 32.6 } as const;
