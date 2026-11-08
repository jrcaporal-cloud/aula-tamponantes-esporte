import { describe, expect, it } from 'vitest';
import parsed from '../../data/parsedPresentation.json';
import { ACCUSATIONS } from '../sims/ato1/content';
import { JUDGED_IN, ROMANS, actOfSection, boardForCrossing, boardForCurrent, cardState, judgedInAct } from './inquiry';

const SECTIONS = (parsed as unknown as { sectionName: string }[]).map(s => s.sectionName);

describe('quadro do inquérito', () => {
    it('lê o ato da seção de todos os slides', () => {
        for (const s of SECTIONS) expect(actOfSection(s), s).toBeGreaterThanOrEqual(0);
        expect(actOfSection('Ato III · A Primeira Testemunha: Bicarbonato')).toBe(2);
        expect(actOfSection('Capa')).toBe(-1);
    });

    it('sabe em que ato cada acusação é julgada', () => {
        expect(judgedInAct('Atos III e VII · de Oliveira 2022')).toBe(2);
        expect(judgedInAct('Ato VII · WADA 2026')).toBe(6);
        for (const a of ACCUSATIONS) {
            const act = JUDGED_IN.get(a.id) ?? -1;
            expect(act, `acusação ${a.id}`).toBeGreaterThanOrEqual(1);
            expect(act).toBeLessThan(ROMANS.length);
        }
    });

    it('só abre ao avançar para um ato posterior', () => {
        expect(boardForCrossing('Ato II · A Perícia', 'Ato II · A Perícia', 9)).toBeNull();
        expect(boardForCrossing('Ato III · X', 'Ato II · A Perícia', 9)).toBeNull();
        expect(boardForCrossing('Ato II · A Perícia', 'Ato III · X', 16)).toEqual({ ended: 1, closedThrough: 1, upcoming: 2, target: 16 });
    });

    it('carimba no ato que julgou e mantém o resto em julgamento', () => {
        const fimAtoII = boardForCrossing('Ato II · A Perícia', 'Ato III · X', 16)!;
        const states = ACCUSATIONS.map(a => cardState(a, fimAtoII));
        expect(states.filter(s => s === 'fresh')).toHaveLength(3);
        expect(states.filter(s => s === 'pending')).toHaveLength(3);

        const fimAtoIII = boardForCrossing('Ato III · X', 'Ato IV · Y', 26)!;
        expect(ACCUSATIONS.map(a => cardState(a, fimAtoIII))).toEqual(['judged', 'judged', 'judged', 'fresh', 'pending', 'pending']);
    });

    it('com Q no meio do ato, nada fica em destaque', () => {
        const board = boardForCurrent('Ato V · Testemunhas Fracas e Alianças')!;
        expect(board.target).toBeNull();
        expect(ACCUSATIONS.some(a => cardState(a, board) === 'fresh')).toBe(false);
        expect(ACCUSATIONS.filter(a => cardState(a, board) === 'judged')).toHaveLength(5);
    });
});
