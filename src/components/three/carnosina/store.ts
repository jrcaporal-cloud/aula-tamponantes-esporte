import { create } from 'zustand';
import type { Release } from './model';
import type { StructureId } from './structures';

/*
 * Estado que muda só por gesto (hover, clique, slider) — nunca por quadro. A cena lê os ajustes com
 * `getState()` dentro do useFrame, sem re-renderizar.
 */

interface SelectionState {
    hoverId: StructureId | null;
    pin: StructureId | null;
    setHover: (id: StructureId | null) => void;
    pinStructure: (id: StructureId) => void;
    release: () => void;
    reset: () => void;
}

export const useSelection = create<SelectionState>(set => ({
    hoverId: null,
    pin: null,
    setHover: id => set(s => (s.hoverId === id ? s : { hoverId: id })),
    pinStructure: id => set({ pin: id }),
    release: () => set(s => (s.pin ? { pin: null } : s)),
    reset: () => set({ hoverId: null, pin: null }),
}));

/** Doses diárias do seletor (g/d): 1,6 e 3,2–6,4 dos estudos; 2,0 = teto da IN 28 no Brasil. */
export const GPD_OPTIONS = [1.6, 2, 3.2, 4.8, 6.4] as const;

interface SimState {
    gpd: number;
    weeks: number;
    /** pH escolhido no slider; null = ciclo automático "em exercício". */
    ph: number | null;
    release: Release;
    setGpd: (g: number) => void;
    setWeeks: (w: number) => void;
    setPh: (p: number | null) => void;
    setRelease: (r: Release) => void;
    reset: () => void;
}

const SIM_START = { gpd: 6.4, weeks: 10, ph: null, release: 'pura' as Release };

export const useCarnoSim = create<SimState>(set => ({
    ...SIM_START,
    setGpd: gpd => set({ gpd }),
    setWeeks: weeks => set({ weeks }),
    setPh: ph => set({ ph }),
    setRelease: release => set({ release }),
    reset: () => set(SIM_START),
}));

/*
 * Clique: a estrutura sob o ponteiro fica "armada" na descida e só é fixada se o ponteiro subir sem
 * arrastar (ver PickLayer). Molécula anda e sairia de baixo do ponteiro antes do `click`.
 */
let armed: StructureId | null = null;
export const armPin = (id: StructureId): void => { armed = id; };
export const takeArmed = (): StructureId | null => {
    const a = armed;
    armed = null;
    return a;
};
