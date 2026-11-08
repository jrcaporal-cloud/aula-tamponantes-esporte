import { actOfSection } from './inquiry';

/**
 * Clima do fundo de íons em cada ato: quanto H⁺ (laranja) e quanto tampão há na sala, de que cor é o tampão
 * e em que ritmo tudo deriva. É a narrativa do inquérito virando ambiente — a acidose na Perícia, o
 * bicarbonato no Ato III, a carnosina (violeta, lenta como a carga de semanas) no Ato IV.
 * O fundo só anima durante a troca de clima (`settleMs`) e volta a congelar: não disputa GPU com os slides.
 */
export interface Mood {
    /** Fração dos prótons visíveis (0 → 1). */
    protons: number;
    /** Fração dos íons-tampão visíveis (0 → 1). */
    ions: number;
    ionColor: string;
    ionGlow: string;
    /** Intensidade da luz quente (laranja) que vem do canto. */
    warm: number;
    /** Multiplicador da velocidade de deriva. */
    speed: number;
    /** Distância extra da câmera (o fundo "se afasta" no fim). */
    pull: number;
    /** Opacidade do fundo inteiro. */
    opacity: number;
    /** Quanto tempo o fundo fica animado ao entrar neste clima. */
    settleMs: number;
}

const BASE: Mood = {
    protons: 0.6, ions: 0.6, ionColor: '#0e7490', ionGlow: '#0b4f63',
    warm: 2.2, speed: 1, pull: 0, opacity: 0.4, settleMs: 3200,
};

/** Um clima por ato, na ordem I … VII. */
export const ACT_MOODS: readonly Mood[] = [
    { ...BASE, protons: 0.7, ions: 0.5, warm: 2.6, speed: 1.1 },                                          // I · a cena do crime
    { ...BASE, protons: 1, ions: 0.3, warm: 3.4, speed: 1.3, opacity: 0.45 },                             // II · Perícia: acidose
    { ...BASE, protons: 0.45, ions: 1, ionColor: '#0891b2', ionGlow: '#0e7490', warm: 1.6, speed: 0.9 },  // III · bicarbonato
    { ...BASE, protons: 0.5, ions: 0.85, ionColor: '#7c3aed', ionGlow: '#4c1d95', warm: 1.8, speed: 0.75 }, // IV · carnosina
    { ...BASE, protons: 0.5, ions: 0.6, ionColor: '#65a30d', ionGlow: '#365314', warm: 2, speed: 0.9 },   // V · sódio, citrato
    { ...BASE, protons: 0.3, ions: 0.5, ionColor: '#64748b', ionGlow: '#1e293b', warm: 1, speed: 0.6 },   // VI · análise fria
    { ...BASE, protons: 0.35, ions: 0.7, ionColor: '#059669', ionGlow: '#065f46', warm: 1.4, speed: 0.8 }, // VII · veredito
];

/** Climas de slides específicos (pelo id do JSON), acima do clima do ato. */
export const SLIDE_MOODS: ReadonlyMap<number, Mood> = new Map([
    // Capa: o fundo em primeiro plano.
    [0, { ...BASE, protons: 0.65, ions: 0.75, opacity: 0.95 }],
    // "Os Últimos 200 Metros": a chegada dos 800 m, a sala enche de H⁺.
    [10, { ...BASE, protons: 1, ions: 0.2, warm: 4.2, speed: 1.9, opacity: 0.5, settleMs: 6000 }],
    // Fecho ("O tampão não vence a prova…"): o H⁺ se dissipa e o fundo se afasta devagar.
    [99, { ...BASE, protons: 0, ions: 0.45, warm: 0.5, speed: 0.35, pull: 9, opacity: 0.6, settleMs: 9000 }],
]);

/** Clima do slide: o próprio, se houver; senão o do ato; fora de ato, o neutro. */
export const moodFor = (slideId: number, section: string): Mood =>
    SLIDE_MOODS.get(slideId) ?? ACT_MOODS[actOfSection(section)] ?? BASE;
