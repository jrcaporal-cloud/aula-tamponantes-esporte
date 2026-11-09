import { CAST_COLOR } from '../ato1/content';

/** Slide 44: a janela de duração do esforço (dossiê 01; personagens do dossiê 06, fictícios). */

export interface DurationMark {
    id: string;
    /** Duração em segundos (posição no eixo logarítmico). */
    t: number;
    label: string;
    sub: string;
    works: boolean;
}

/** MCNAUGHTON1992DUR: 0,3 g/kg; 10 e 30 s nulos, 120 e 240 s positivos. */
export const MCNAUGHTON_MARKS: readonly DurationMark[] = [
    { id: 'm10', t: 10, label: '10 s', sub: 'nulo', works: false },
    { id: 'm30', t: 30, label: '30 s', sub: 'nulo', works: false },
    { id: 'm120', t: 120, label: '120 s', sub: 'melhora', works: true },
    { id: 'm240', t: 240, label: '240 s', sub: 'melhora', works: true },
];

/** Onde a evidência é nula (dossiê 01, seção 6). */
export const NULL_MARKS: readonly DurationMark[] = [
    { id: 'rsa', t: 5.8, label: 'tiros repetidos', sub: 'Lopes-Silva 2019', works: false },
    { id: 'long', t: 2100, label: '30–40 min contínuos', sub: 'Stephens 2002 · Freis 2017', works: false },
];

export interface Persona {
    id: string;
    name: string;
    sport: string;
    /** Duração aproximada da prova (s); para Rafael, a faixa de uma luta. */
    t: number;
    tMax?: number;
    color: string;
    note: string;
}

export const PERSONAS: readonly Persona[] = [
    { id: 'julia', name: 'Júlia', sport: '800 m', t: 120, color: CAST_COLOR.julia, note: 'no centro' },
    { id: 'carlos', name: 'Carlos', sport: 'remo 2.000 m', t: 420, color: CAST_COLOR.carlos, note: 'dentro (~7 min)' },
    { id: 'bianca', name: 'Bianca', sport: '200 m nado', t: 150, color: CAST_COLOR.bianca, note: 'dentro; na piscina, há nulos' },
    { id: 'rafael', name: 'Rafael', sport: 'jiu-jítsu', t: 360, tMax: 600, color: CAST_COLOR.rafael, note: 'lutas de 6–10 min, intermitentes' },
];

export const DURATION_TABS = ['1992: quatro durações', 'A janela', 'Onde não funciona', 'Os quatro atletas'] as const;

export const DURATION_FEET: readonly string[] = [
    'McNaughton dá a mesma dose e mede quatro durações: em 10 e 30 s, nada; em 120 e 240 s, melhora. Nasce a "regra dos 30 s".',
    'O posicionamento da ISSN resume: o efeito aparece sobretudo em tarefas de 30 s a 12 min. A borda não é um muro: acima de 10 min, ES 0,22.',
    'Fora da janela: tiros curtos repetidos não respondem, e em provas contínuas de 30–40 min o bicarbonato mexe no sangue, não no tempo.',
    'Três dos nossos atletas caem dentro da janela. O Rafael também, pela duração — mas luta é intermitente, e o dado de combate é outro.',
];
