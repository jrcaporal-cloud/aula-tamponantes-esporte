/**
 * Versões da aula por tempo disponível. A completa (56 slides) dura cerca de 3h20 com discussão.
 * `?tempo=120`, `?tempo=90` ou `?tempo=60` escondem slides de aprofundamento (ids do JSON);
 * nada é apagado — sem o parâmetro a aula vem completa.
 */
export type Tempo = 'completa' | '120' | '90' | '60';

/** 120 min: saem aprofundamentos de história, os "quases", a dieta, o desenho dos estudos e o dia de prova. */
const SKIP_120 = new Set<number>([13, 22, 24, 25, 28, 30, 41, 42, 44, 45, 63, 64, 66, 71, 72, 74, 83, 85, 87, 93]);

/** 90 min: a espinha (fisiologia essencial, bicarbonato, β-alanina, metodologia central, segurança e casos). */
const KEEP_90 = new Set<number>([0, 10, 11, 20, 26, 27, 29, 40, 43, 46, 47, 48, 60, 61, 62, 65, 81, 82, 84, 86, 90, 92, 94, 95, 97, 99]);

/** 60 min: o essencial para decidir — mecanismo, as duas testemunhas, o ruído do teste, o cegamento e a segurança. */
const KEEP_60 = new Set<number>([0, 10, 11, 26, 29, 43, 46, 47, 48, 61, 62, 65, 81, 84, 92, 94, 96, 99]);

export const readTempo = (search: string): Tempo => {
    const value = new URLSearchParams(search).get('tempo');
    return value === '120' || value === '90' || value === '60' ? value : 'completa';
};

export const keepsSlide = (tempo: Tempo, slideId: number): boolean => {
    if (tempo === '120') return !SKIP_120.has(slideId);
    if (tempo === '90') return KEEP_90.has(slideId);
    if (tempo === '60') return KEEP_60.has(slideId);
    return true;
};
