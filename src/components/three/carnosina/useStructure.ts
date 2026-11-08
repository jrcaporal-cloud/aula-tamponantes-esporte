import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type * as THREE from 'three';
import { armPin, useSelection } from './store';
import type { StructureId } from './structures';

/** Quanto o ponteiro precisa andar entre descer e subir para o gesto contar como arrasto da câmera. */
export const DRAG_PX = 4;

/** O raycaster também acerta objetos escondidos: só vale a estrutura da estação que está em cena. */
const shown = (o: THREE.Object3D | null): boolean => {
    for (let p = o; p; p = p.parent) if (!p.visible) return false;
    return true;
};

/**
 * Handlers de hover e de clique de uma estrutura, mais `lit` (sob o ponteiro ou fixada). Com algo
 * fixado, o hover não troca o cartão.
 */
export const useStructure = (id: StructureId) => {
    const lit = useSelection(s => (s.pin ? s.pin === id : s.hoverId === id));
    const bind = useMemo(() => ({
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            if (!shown(e.object)) return;
            e.stopPropagation();
            useSelection.getState().setHover(id);
        },
        onPointerOut: () => {
            const s = useSelection.getState();
            if (s.hoverId === id) s.setHover(null);
        },
        onPointerDown: (e: ThreeEvent<PointerEvent>) => {
            if (!shown(e.object)) return;
            e.stopPropagation();
            armPin(id);
        },
    }), [id]);
    return { bind, lit };
};
