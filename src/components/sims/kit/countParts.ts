/**
 * Números de um texto em português ("ES 0,17", "14,8–38%", "1.461 pessoas") para a contagem animada:
 * o texto vira pedaços fixos e números; cada número sobe de zero até o valor com as mesmas casas decimais.
 */

export interface NumberToken {
    value: number;
    decimals: number;
    /** Tinha ponto de milhar ("1.461"): mantém o agrupamento durante a contagem. */
    grouped: boolean;
}

export type CountPart = string | NumberToken;

// Milhar com ponto (1.461 / 2.019,5) antes do número simples, para "1.461" não virar "1" + ".461".
const NUMBER = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;

export const parseNumbers = (text: string): readonly CountPart[] => {
    const parts: CountPart[] = [];
    let last = 0;
    for (const match of text.matchAll(NUMBER)) {
        const raw = match[0];
        const at = match.index ?? 0;
        if (at > last) parts.push(text.slice(last, at));
        const [int, frac = ''] = raw.replace(/\./g, '').split(',');
        parts.push({ value: Number(`${int}.${frac || '0'}`), decimals: frac.length, grouped: raw.includes('.') });
        last = at + raw.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
};

const groupThousands = (int: string): string => int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const formatToken = (token: NumberToken, value: number): string => {
    const [int, frac] = value.toFixed(token.decimals).split('.');
    const head = token.grouped ? groupThousands(int) : int;
    return frac ? `${head},${frac}` : head;
};

/** O texto com cada número a uma fração `k` (0 → 1) do valor final. Em k = 1 devolve o texto original. */
export const countAt = (parts: readonly CountPart[], k: number): string =>
    parts.map(p => (typeof p === 'string' ? p : formatToken(p, p.value * Math.min(Math.max(k, 0), 1)))).join('');

/** Desacelera no fim: o número "pousa" no valor em vez de parar de repente. */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
