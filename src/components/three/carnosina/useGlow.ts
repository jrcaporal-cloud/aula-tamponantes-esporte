import { useEffect, useMemo } from 'react';
import type * as THREE from 'three';
import { disposeGlow, makeGlowMesh } from './fx';

/** Malha de brilhos criada uma vez por componente e descartada na desmontagem (use com <primitive>). */
export const useGlowMesh = (n: number, hex: string, boost = 1.4, core = 1.6): THREE.InstancedMesh => {
    const mesh = useMemo(() => makeGlowMesh(n, hex, boost, core), [n, hex, boost, core]);
    useEffect(() => () => disposeGlow(mesh), [mesh]);
    return mesh;
};
