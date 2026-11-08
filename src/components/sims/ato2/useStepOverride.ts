import { useState } from 'react';

/**
 * Valor que o passador define e o mouse pode mexer (slider). O ajuste manual vale só no passo
 * em que foi feito: ao trocar de passo, volta o valor da história — sem setState em efeito.
 */
export const useStepOverride = <T,>(step: number, storyValue: T): [T, (v: T) => void, boolean] => {
    const [manual, setManual] = useState<{ step: number; value: T } | null>(null);
    const active = manual !== null && manual.step === step;
    return [active ? manual.value : storyValue, (value: T) => setManual({ step, value }), active];
};
