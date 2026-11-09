import { C } from '../kit/palette';

/** Altura da caixa dos simuladores do Ato VII (o limite do palco é 516). */
export const SIM_H = 500;

/** Semáforo: verde = sem alerta relevante, amarelo = cautela, vermelho = não usar fora de acompanhamento. */
export type Signal = 'verde' | 'amarelo' | 'vermelho';

export const SIGNAL: Record<Signal, { color: string; label: string }> = {
    verde: { color: C.ok, label: 'sem alerta relevante' },
    // Semáforo é convenção do mundo real: o amarelo fica amarelo, mesmo sendo a cor do lactato no resto da aula.
    amarelo: { color: C.lactate, label: 'cautela' },
    vermelho: { color: C.risk, label: 'não usar sem acompanhamento' },
};
