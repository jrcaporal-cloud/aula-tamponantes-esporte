import { ACCUSATIONS, CHAPTERS, type Accusation } from '../sims/ato1/content';
import { RECAP } from '../sims/ato7/recap';

/**
 * Quadro do inquérito: entre um ato e outro a aula volta às 6 acusações do slide 11.
 * As que o ato que terminou julgou ganham o carimbo; as outras seguem "em julgamento".
 * Tudo vem dos dados dos slides 11 e 97 (ACCUSATIONS, RECAP): nenhum texto novo.
 */

/** Atos na ordem da aula: I … VII (índice 0 … 6). */
export const ROMANS: readonly string[] = CHAPTERS.map(c => c.roman);

const romanIndex = (text: string, pattern: RegExp): number => {
    const match = text.match(pattern);
    return match ? ROMANS.indexOf(match[1]) : -1;
};

/** "Ato III · A Primeira Testemunha…" → 2. Fora do padrão → -1. */
export const actOfSection = (section: string): number => romanIndex(section, /^Ato ([IVX]+)\b/);

/** Ato em que a acusação é julgada: o primeiro citado no "onde" do slide 97 ("Atos III e VII · …" → III). */
export const judgedInAct = (where: string): number => romanIndex(where, /^Atos? ([IVX]+)\b/);

export const JUDGED_IN: ReadonlyMap<number, number> = new Map(
    ACCUSATIONS.map(a => [a.id, judgedInAct(RECAP[a.id]?.where ?? '')]),
);

export interface BoardState {
    /** Ato que acabou de fechar (null quando o quadro foi aberto com Q, no meio de um ato). */
    ended: number | null;
    /** Atos de 0 até este índice já foram julgados. */
    closedThrough: number;
    /** Próximo ato (ou o ato em andamento, no modo Q). */
    upcoming: number;
    /** Slide para onde "continuar" leva; null = só fecha o quadro. */
    target: number | null;
}

/**
 * Troca de ato ao avançar: devolve o quadro a mostrar, ou null se não houver troca.
 * Usa `to - 1` como fechado: numa versão curta que pule um ato inteiro, ele também conta como julgado.
 */
export const boardForCrossing = (fromSection: string, toSection: string, targetIndex: number): BoardState | null => {
    const from = actOfSection(fromSection);
    const to = actOfSection(toSection);
    if (from < 0 || to <= from) return null;
    return { ended: from, closedThrough: to - 1, upcoming: to, target: targetIndex };
};

/** Quadro aberto com Q: tudo antes do ato atual está julgado. */
export const boardForCurrent = (section: string): BoardState | null => {
    const act = actOfSection(section);
    return act < 0 ? null : { ended: null, closedThrough: act - 1, upcoming: act, target: null };
};

export type CardState = 'pending' | 'judged' | 'fresh';

/** Situação de uma acusação no quadro: ainda em julgamento, julgada antes, ou julgada no ato que acabou. */
export const cardState = (a: Accusation, board: BoardState): CardState => {
    const act = JUDGED_IN.get(a.id) ?? -1;
    if (act < 0 || act > board.closedThrough) return 'pending';
    return act === board.ended ? 'fresh' : 'judged';
};
