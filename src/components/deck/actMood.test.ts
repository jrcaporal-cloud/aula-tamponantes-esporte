import { describe, expect, it } from 'vitest';
import parsed from '../../data/parsedPresentation.json';
import { CHAPTERS } from '../sims/ato1/content';
import { ACT_MOODS, SLIDE_MOODS, moodFor } from './actMood';

const SLIDES = (parsed as unknown as { id: number; sectionName: string }[]);

describe('clima do fundo por ato', () => {
    it('tem um clima para cada ato e para cada slide da aula', () => {
        expect(ACT_MOODS).toHaveLength(CHAPTERS.length);
        for (const s of SLIDES) {
            const m = moodFor(s.id, s.sectionName);
            expect(m.protons, `slide ${s.id}`).toBeGreaterThanOrEqual(0);
            expect(m.protons).toBeLessThanOrEqual(1);
            expect(m.ions).toBeGreaterThan(0);
            expect(m.opacity).toBeLessThanOrEqual(1);
        }
    });

    it('a Perícia é o ato mais ácido e o Ato III o de mais tampão', () => {
        const maxProtons = Math.max(...ACT_MOODS.map(m => m.protons));
        const maxIons = Math.max(...ACT_MOODS.map(m => m.ions));
        expect(ACT_MOODS[1].protons).toBe(maxProtons);
        expect(ACT_MOODS[2].ions).toBe(maxIons);
    });

    it('slides com clima próprio existem na aula e vencem o do ato', () => {
        const ids = new Set(SLIDES.map(s => s.id));
        for (const id of SLIDE_MOODS.keys()) expect(ids.has(id), `slide ${id}`).toBe(true);
        expect(moodFor(10, 'Ato I · O Inquérito').protons).toBe(1);
        expect(moodFor(99, 'Ato VII · O Veredito').protons).toBe(0);
        expect(moodFor(12, 'Ato I · O Inquérito')).toBe(ACT_MOODS[0]);
    });
});
