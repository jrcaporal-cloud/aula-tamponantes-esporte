import { describe, expect, it } from 'vitest';
import { countAt, parseNumbers } from './countParts';

describe('contagem dos números-chave', () => {
    it('termina exatamente no texto original', () => {
        for (const text of ['ES 0,17', '14,8–38%', '~25%', '1.461 participantes', 'OR 8,9 (2,2–32,6)', '1 de 23', '≥ 4 sem']) {
            expect(countAt(parseNumbers(text), 1)).toBe(text);
        }
    });

    it('começa do zero com as mesmas casas e o mesmo texto em volta', () => {
        expect(countAt(parseNumbers('ES 0,17'), 0)).toBe('ES 0,00');
        expect(countAt(parseNumbers('14,8–38%'), 0)).toBe('0,0–0%');
        expect(countAt(parseNumbers('placebo ~25%'), 0)).toBe('placebo ~0%');
    });

    it('lê o ponto como milhar e o mantém no meio da contagem', () => {
        const parts = parseNumbers('1.461 participantes');
        expect(parts[0]).toEqual({ value: 1461, decimals: 0, grouped: true });
        expect(countAt(parts, 0.4)).toBe('584 participantes');
        expect(countAt(parseNumbers('2.019'), 0.9)).toBe('1.817');
    });

    it('texto sem número passa intacto', () => {
        expect(countAt(parseNumbers('sem efeito agrupado'), 0)).toBe('sem efeito agrupado');
    });
});
