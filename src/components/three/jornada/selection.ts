import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { create } from 'zustand';
import type { StructureId } from './content';

/*
 * Seleção: o que está sob o ponteiro (`hoverId`) e o que o clique fixou (`pin`). Muda só na
 * entrada/saída de uma estrutura ou no clique — nunca por quadro —, então pode ser estado do React.
 * O clique é decidido no ponteiro para baixo ("armado") e só fixa se o ponteiro subir sem arrastar.
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

/** Gesto de clique: `discard` só limpa a armação; arrastou = foi a câmera; vazio = solta. */
export const pinOrRelease = (discard: boolean, dragged: boolean): void => {
    const a = armed;
    armed = null;
    if (discard || dragged) return;
    const s = useSelection.getState();
    if (a) s.pinStructure(a);
    else s.release();
};

/** Quanto o ponteiro precisa andar para o gesto contar como arrasto da câmera. */
export const DRAG_PX = 4;

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
            armed = id;
        },
    }), [id]);
    return { bind, lit };
};
