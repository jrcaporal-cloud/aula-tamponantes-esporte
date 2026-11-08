import * as THREE from 'three';
import type { TimeState } from '../shared/Label3D';
import { rng } from '../shared/math';

/* Peças comuns das estações: visibilidade por etapa, materiais de brilho e um "dummy" de matriz. */

export type TimeBox = { readonly current: TimeState };

/** Peso da estação `i` no tempo T (1 = em cena; 0 = longe, nada é desenhado nem animado). */
export const stationWeight = (T: number, i: number) => Math.max(0, 1 - Math.abs(T - i) * 1.25);

/** Material sem luz, com cor acima de 1 para o bloom acender (partículas, impulsos, H⁺). */
export const glowMaterial = (hex: string, boost = 1.6, opacity = 1) => {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(boost), toneMapped: false, transparent: opacity < 1, opacity });
    return m;
};

/** Lista determinística de números em [0, 1) (as posições não mudam entre aberturas). */
export const randoms = (seed: number, n: number) => {
    // sementes vizinhas dariam primeiros valores quase iguais: espalha a semente e descarta o começo
    const r = rng(seed * 9301 + 49297);
    r(); r(); r();
    return Array.from({ length: n }, () => r());
};

export const dummy = new THREE.Object3D();
export const tmpColor = new THREE.Color();

/** Escreve uma instância com posição, escala uniforme e rotação. */
export const putInstance = (
    mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, s: number, rx = 0, ry = 0, rz = 0,
) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(rx, ry, rz);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
};

/** Fração de [a, b] com rebobinagem cíclica (para trajetórias em laço). */
export const frac = (x: number) => x - Math.floor(x);
