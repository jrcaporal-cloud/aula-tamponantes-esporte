import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { create } from 'zustand';
import type { StructureId } from './structures';

/*
 * Seleção: o que está sob o ponteiro (`hoverId`) e o que o clique fixou (`pin`). Muda só a cada
 * entrada/saída ou clique, nunca por quadro. O clique é "armado" no ponteiro para baixo e só fixa se o
 * ponteiro subir sem arrastar (ver PickLayer): arrastar é girar a câmera, não escolher.
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

let armed: StructureId | null = null;
export const armPin = (id: StructureId): void => { armed = id; };
export const takeArmed = (): StructureId | null => {
    const a = armed;
    armed = null;
    return a;
};

/** Distância (px) entre descer e subir o ponteiro a partir da qual o gesto é arrasto de câmera. */
export const DRAG_PX = 5;

/** Handlers de hover/clique de uma estrutura e `lit` (sob o ponteiro ou fixada). */
export const useStructure = (id: StructureId) => {
    const lit = useSelection(s => (s.pin ? s.pin === id : s.hoverId === id));
    const bind = useMemo(() => ({
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            useSelection.getState().setHover(id);
        },
        onPointerOut: () => {
            const s = useSelection.getState();
            if (s.hoverId === id) s.setHover(null);
        },
        onPointerDown: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            armPin(id);
        },
    }), [id]);
    return { bind, lit };
};
