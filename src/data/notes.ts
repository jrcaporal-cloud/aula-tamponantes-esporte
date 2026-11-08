import NOTAS from './notas.json';

/**
 * Notas do apresentador por slide (chave = id do slide no JSON). Aparecem na janela P.
 * `minutos` é o tempo-alvo com discussão; a janela do apresentador soma tudo e mostra o ritmo.
 * `pergunta` é um gancho para a turma; `transicao` é a frase que leva ao próximo slide.
 * O texto fica em `notas.json`, montado a partir dos fragmentos de cada ato (scripts/montar-aula.py).
 */
export interface SlideNote {
    minutos: number;
    mensagem: string;
    pergunta?: string;
    transicao?: string;
}

export const NOTES: Record<number, SlideNote> = NOTAS as Record<string, SlideNote>;
