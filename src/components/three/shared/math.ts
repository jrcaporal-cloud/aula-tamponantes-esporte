import * as THREE from 'three';

/* Utilitários de tempo e de forma das cenas 3D (funções puras, sem estado). */

export const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Fração linear de T dentro de [a, b]. */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
/** Fração suavizada de T dentro de [a, b]. */
export const phase = (t: number, a: number, b: number) => smoother(seg(t, a, b));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Gerador pseudoaleatório determinístico (as formas não mudam entre renders). */
export const rng = (seed: number) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
};

