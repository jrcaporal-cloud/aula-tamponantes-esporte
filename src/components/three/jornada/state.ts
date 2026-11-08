import { curvesFor, phFor, riseAt, type Curve } from './dose';

/*
 * Estado lido por quadro pela cena e pelo HUD, numa ref (sem re-render do React):
 *  - `in`: entradas que só mudam quando o usuário mexe nos controles (escritas num efeito do modal);
 *  - `f`: o quadro atual, escrito uma vez por quadro pelo relógio da cena (`JourneyClock`).
 */

export interface JourneyInputs {
    /** Gramas de pó da dose (massa × g/kg). */
    powder: number;
    /** Intensidade de gás no estômago e de água no intestino, já com as estratégias (0 … ~1,5). */
    gas: number;
    water: number;
    /** Etapa 4: sangue alcalino (com bicarbonato) × normal. */
    alkaline: boolean;
    /** Curva do atleta escolhido na etapa 3. */
    curve: Curve;
    /** Discos de sódio da pilha (0,5 g cada). */
    discs: number;
}

/** Sistemas da cena, na ordem do vetor de presença. */
export const SYS = { stream: 0, stomach: 1, gut: 2, blood: 3, muscle: 4, sodium: 5 } as const;

/** Em que etapas cada sistema aparece (a presença cai a zero a uma etapa de distância). */
const ON_STEPS: readonly (readonly number[])[] = [[0], [0, 1, 2], [0, 1, 2], [0, 2, 3, 4], [0, 3, 4], [5]];

export interface JourneyFrame {
    /** Tempo da aula (etapa contínua, animada na transição). */
    T: number;
    /** Presença de cada sistema (0 … 1). */
    w: Float32Array;
    /** Relógio da curva (min após a dose), que corre de 0 a 240 e recomeça. */
    minute: number;
    /** Aumento de HCO₃⁻ do atleta no relógio e o pH calculado. */
    rise: number;
    ph: number;
    /** Densidade de HCO₃⁻ no sangue mostrada na cena (0 … 1). */
    blood: number;
    /** Gás no estômago e água no intestino já suavizados e multiplicados pela presença. */
    gasLevel: number;
    waterLevel: number;
}

export interface JourneyState { in: JourneyInputs; f: JourneyFrame }
export type JourneyStateRef = { readonly current: JourneyState };

export const makeJourneyState = (): JourneyState => ({
    in: { powder: 21, gas: 0.85, water: 0.85, alkaline: true, curve: curvesFor(0.3)[2], discs: 11.5 },
    f: { T: 0, w: new Float32Array(ON_STEPS.length), minute: 0, rise: 0, ph: 7.4, blood: 0.6, gasLevel: 0, waterLevel: 0 },
});

/** Minutos de curva por segundo de relógio (240 min em 16 s). */
const MIN_PER_S = 15;

export const writeFrame = (st: JourneyState, T: number, dt: number): void => {
    const f = st.f;
    f.T = T;
    for (let s = 0; s < ON_STEPS.length; s++) {
        let w = 0;
        for (const k of ON_STEPS[s]) w = Math.max(w, 1 - Math.min(Math.abs(T - k), 1));
        f.w[s] = w;
    }
    f.minute = (f.minute + dt * MIN_PER_S) % 240;
    f.rise = riseAt(st.in.curve, f.minute);
    f.ph = phFor(f.rise);
    // etapa 3: segue o relógio do atleta; etapa 4: alcalino × normal; nas outras, a média
    // o HCO₃⁻ nunca é zero: a densidade parte do basal e sobe com o aumento do atleta
    const byClock = 0.3 + (0.7 * f.rise) / 12.3;
    const byToggle = st.in.alkaline ? 0.95 : 0.22;
    const k3 = 1 - Math.min(Math.abs(T - 3), 1);
    const k4 = 1 - Math.min(Math.abs(T - 4), 1);
    f.blood = 0.55 * (1 - k3 - k4) + byClock * k3 + byToggle * k4;
    const ease = 1 - Math.exp(-Math.min(dt, 0.05) * 2.4);
    f.gasLevel += (st.in.gas * f.w[SYS.stomach] - f.gasLevel) * ease;
    f.waterLevel += (st.in.water * f.w[SYS.gut] - f.waterLevel) * ease;
};
