import type { LabelSpec } from '../shared/Label3D';
import { C } from '../../sims/kit/palette';
import { CAPILLARY_Y, FIBER, MCT_X, MEMBRANE_Y, STACK, stackHeight } from './anatomy';
import { ANTACID_NA_G, WHO_NA_G, br, type DoseSummary } from './dose';

/*
 * Rótulos 3D de cada etapa (âncora no mundo + deslocamento da caixa em px). Sempre `big`: texto de
 * 17 px e subtítulo de 14 px, legíveis no projetor. A etapa 5 usa os números da dose escolhida.
 */

const L = (id: string, text: string, sub: string | undefined, color: string, at: [number, number, number], dx: number, dy: number): LabelSpec =>
    ({ id, text, sub, color, at, dx, dy, big: true });

export const labelsForStep = (step: number, d: DoseSummary): LabelSpec[] => {
    switch (step) {
        case 0:
            return [
                L('est', '1 · Estômago', 'HCl + NaHCO₃ → CO₂', C.co2, [-9.6, 5.2, 0.6], 60, -36),
                L('int', '2 · Intestino', 'absorção e água', C.co2, [-6.2, -3.6, 0.6], -30, 50),
                L('vei', '3 · Veia porta → circulação', 'trecho esquemático', C.base, [4.2, 1.0, 0], -30, -70),
                L('cap', '4 · Capilar do músculo', undefined, C.base, [13.8, 1.4, 0], -10, -60),
                L('fib', '5 · Fibra muscular', 'o tampão age por fora', C.acid, [11.4, -2.8, 0.4], -30, 50),
            ];
        case 1:
            return [
                L('co2', 'CO₂ no fundo do estômago', 'o gás distende a parede', C.co2, [-10.6, 4.4, 0], 90, -24),
                L('hcl', 'H⁺ do HCl gástrico', 'encontra o HCO₃⁻ da dose', C.acid, [-12.4, 2.2, 0.2], 40, 40),
                L('pyl', 'Piloro → intestino', 'o que não reagiu segue', C.co2, [-5.9, 0.8, 0], 50, -40),
            ];
        case 2:
            return [
                L('abs', 'Na⁺ e HCO₃⁻ absorvidos', 'rumo ao sangue', C.sodium, [-1.3, -3.6, 0], 60, -50),
                L('h2o', 'Água puxada para o lúmen', 'diarreia osmótica', C.text, [-4.5, -1.5, 0.4], -40, -56),
            ];
        case 3:
            return [L('hco', 'HCO₃⁻ no sangue', 'sobe em média +5,2 mmol/L', C.base, [6.4, 1.2, 0], 30, 50)];
        case 4:
            return [
                L('mct', 'MCT', 'H⁺ + lactato saem juntos', C.acidSoft, [MCT_X[2], MEMBRANE_Y, 0], -36, 64),
                L('rx', 'H⁺ + HCO₃⁻ → H₂O + CO₂', 'no capilar', C.base, [MCT_X[1] + 0.2, CAPILLARY_Y + 0.3, 0], -20, -56),
                L('fib', 'Fibra: H⁺ e lactato', 'pH de repouso não muda', C.acid, [FIBER.x0 + 0.7, FIBER.y - 0.2, 0.3], -30, 24),
                L('lung', 'CO₂ → pulmão', undefined, C.co2, [15.4, CAPILLARY_Y + 0.3, 0], -10, -56),
            ];
        default: {
            const top = (g: number) => STACK.y + stackHeight(g / STACK.grams) + 0.12;
            return [
                L('who', 'OMS: < 2 g/dia', 'teto diário de sódio', C.co2, [STACK.xs[0], top(WHO_NA_G), STACK.z], -46, -40),
                L('ant', 'Antiácido: 4,6 g', 'máximo do rótulo em 24 h', C.co2, [STACK.xs[1], top(ANTACID_NA_G), STACK.z], -40, -58),
                L('dose', `Esta dose: ${br(d.sodium)} g de Na`, `${br(d.whoTimes)}× o teto da OMS`, C.sodium, [STACK.xs[2], top(Math.min(d.sodium, 16)), STACK.z], 40, -40),
            ];
        }
    }
};
