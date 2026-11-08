import { describe, expect, it } from 'vitest';
import parsed from './parsedPresentation.json';
import { NOTES } from './notes';
import { keepsSlide, readTempo, type Tempo } from './modes';
import { MODEL_3D_BY_SLIDE } from '../components/deck/models3d';

interface RawSlide { id: number; sectionName: string; title: string; content: string }
const SLIDES = parsed as unknown as RawSlide[];
const IDS = SLIDES.map(s => s.id);
const ATOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

describe('ordem da aula', () => {
    it('tem ids únicos', () => {
        expect(new Set(IDS).size).toBe(IDS.length);
    });

    it('tem entre 50 e 60 slides', () => {
        expect(IDS.length).toBeGreaterThanOrEqual(50);
        expect(IDS.length).toBeLessThanOrEqual(60);
    });

    it('todo slide pertence a um ato', () => {
        for (const s of SLIDES) expect(s.sectionName, `slide ${s.id}`).toMatch(/^Ato (I|II|III|IV|V|VI|VII) · /);
    });

    it('os atos aparecem em ordem e sem voltar', () => {
        const seq = SLIDES.map(s => ATOS.indexOf(s.sectionName.split(' ')[1]));
        expect([...seq].sort((a, b) => a - b)).toEqual(seq);
    });

    it('abre com a capa e fecha com a frase final', () => {
        expect(IDS[0]).toBe(0);
        expect(IDS[IDS.length - 1]).toBe(99);
    });

    it('todo slide com simulador traz as fontes', () => {
        for (const s of SLIDES.filter(x => x.content.includes('[[COMP:'))) expect(s.content, `slide ${s.id}`).toContain('Fontes');
    });

    it('todo modelo 3D aponta para um slide que existe', () => {
        for (const id of MODEL_3D_BY_SLIDE.keys()) expect(IDS).toContain(id);
    });
});

describe('notas do apresentador', () => {
    it('todo slide tem nota com mensagem e tempo-alvo', () => {
        for (const id of IDS) {
            const note = NOTES[id];
            expect(note, `slide ${id}`).toBeDefined();
            expect(note.mensagem.length).toBeGreaterThan(10);
            expect(note.minutos).toBeGreaterThan(0);
        }
    });

    it('não há nota para slide que não existe', () => {
        for (const key of Object.keys(NOTES)) expect(IDS).toContain(Number(key));
    });

    it('a aula completa cabe em 3h30 com discussão', () => {
        const total = IDS.reduce((sum, id) => sum + NOTES[id].minutos, 0);
        expect(total).toBeGreaterThan(150);
        expect(total).toBeLessThanOrEqual(210);
    });
});

describe('versões por tempo', () => {
    const minutesOf = (tempo: Tempo) =>
        IDS.filter(id => keepsSlide(tempo, id)).reduce((sum, id) => sum + NOTES[id].minutos, 0);

    it('lê o parâmetro da URL e cai na versão completa', () => {
        expect(readTempo('?tempo=120')).toBe('120');
        expect(readTempo('?tempo=90')).toBe('90');
        expect(readTempo('?tempo=60')).toBe('60');
        expect(readTempo('?tempo=abc')).toBe('completa');
        expect(readTempo('')).toBe('completa');
    });

    it('a versão completa mantém tudo', () => {
        expect(IDS.every(id => keepsSlide('completa', id))).toBe(true);
    });

    it('as versões curtas mantêm a abertura, o mecanismo, as duas testemunhas e o fechamento', () => {
        for (const tempo of ['120', '90', '60'] as const) {
            for (const id of [0, 10, 11, 26, 43, 62, 92, 94, 99]) expect(keepsSlide(tempo, id), `${tempo} min, slide ${id}`).toBe(true);
        }
    });

    it('cada versão cabe no tempo prometido (margem de 15%)', () => {
        expect(minutesOf('120')).toBeLessThanOrEqual(120 * 1.15);
        expect(minutesOf('90')).toBeLessThanOrEqual(90 * 1.15);
        expect(minutesOf('60')).toBeLessThanOrEqual(60 * 1.15);
        expect(minutesOf('60')).toBeLessThan(minutesOf('90'));
        expect(minutesOf('90')).toBeLessThan(minutesOf('120'));
    });
});
