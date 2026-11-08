import { C } from '../kit/palette';

/** Slides 40–41: a história do bicarbonato, do laboratório (1977) à biópsia (1984). Números: dossiê 01. */

export interface Vial {
    id: 'acido' | 'controle' | 'alcalino';
    salt: string;
    role: string;
    color: string;
    /** pH do sangue antes do exercício. */
    ph: number;
    /** Tempo até a exaustão a 95% da potência máxima (média ± DP, s). */
    time: number;
    sd: number;
}

/** JONES1977: 5 homens, cápsulas por 3 h, 0,3 g/kg; ordem do mais ácido ao mais alcalino. */
export const VIALS: readonly Vial[] = [
    { id: 'acido', salt: 'NH₄Cl', role: 'acidose', color: C.acid, ph: 7.21, time: 160, sd: 22 },
    { id: 'controle', salt: 'CaCO₃', role: 'controle', color: C.co2, ph: 7.38, time: 270, sd: 13 },
    { id: 'alcalino', salt: 'NaHCO₃', role: 'alcalose', color: C.base, ph: 7.43, time: 438, sd: 120 },
];

export const VIAL_TABS = ['Três frascos', 'O pH antes', 'A 95%', 'O legado'] as const;

export const VIAL_FEET: readonly string[] = [
    '1977: 5 homens tomam cápsulas por 3 h — giz, cloreto de amônio ou bicarbonato, 0,3 g/kg. Em qual frasco você aposta?',
    'Antes de pedalar, o sangue já está diferente: 7,21 com o cloreto de amônio, 7,38 com o giz, 7,43 com o bicarbonato.',
    'A 95% da potência máxima, até a exaustão: 160 s ácido, 270 s controle, 438 s alcalino. O pH do sangue mudou o tempo nos dois sentidos.',
    'Daqui nasce a dose de 0,3 g/kg — de 5 pessoas e de um teste até a exaustão, um dos mais ruidosos (voltamos a isso no Ato VI).',
];

export interface PioneerStudy {
    id: string;
    year: string;
    tag: string;
    title: string;
    lines: readonly string[];
    color: string;
}

export const PIONEERS: Record<'wilkes' | 'costill' | 'katz', PioneerStudy> = {
    wilkes: {
        id: 'wilkes', year: '1983', tag: 'WILKES 1983 · Med Sci Sports Exerc', title: 'Da bancada para a pista', color: C.base,
        lines: ['6 corredores de meio-fundo treinados', '0,3 g/kg × placebo (CaCO₃) × controle', 'Prova real de 800 m'],
    },
    costill: {
        id: 'costill', year: '1984', tag: 'COSTILL 1984 · Int J Sports Med', title: 'A agulha no músculo', color: C.base,
        lines: ['10 homens e 1 mulher', '0,2 g/kg × NaCl, 1 h antes', '5 tiros de 1 min a 100% do VO₂máx; o 5º até a exaustão', 'Biópsia do vasto lateral (n = 4)'],
    },
    katz: {
        id: 'katz', year: '1984', tag: 'KATZ 1984 · Int J Sports Med', title: 'Mesmo grupo, tiro único', color: C.co2,
        lines: ['8 homens saudáveis', '0,2 g/kg × NaCl, 1 h antes', 'Um tiro até a exaustão a 125% do VO₂máx (~100 s)', 'HCO₃⁻ 28,2 × 24,4 mmol/L'],
    },
};

/** COSTILL1984: 4 tiros de 60 s e o 5º até a exaustão. */
export const COSTILL_FIFTH = { nacl: 113.5, sb: 160.8, phNacl: 6.73, phSb: 6.81 } as const;
/** KATZ1984: tiro único a 125% VO₂máx. */
export const KATZ_SINGLE = { nacl: 98.6, sb: 100.6 } as const;

export const PIONEER_TABS = ['1983 · 800 m', '1984 · biópsia', '1984 · tiro único', 'Dois desenhos'] as const;

export const PIONEER_FEET: readonly string[] = [
    'Seis corredores, 800 m de verdade: 2,9 s mais rápidos com bicarbonato. Em 800 m, é distância de pódio.',
    'Costill põe a agulha no vasto lateral: antes do 5º tiro o músculo está "menos ácido" (6,81 × 6,73) e o tiro final dura 42% mais.',
    'No mesmo ano, o mesmo grupo: um tiro único de ~100 s com a mesma dose. 100,6 × 98,6 s — nada, com o sangue alcalino.',
    'Mesma substância, dois desenhos, dois resultados: o efeito aparece quando a acidose se acumula, não no primeiro esforço.',
];
