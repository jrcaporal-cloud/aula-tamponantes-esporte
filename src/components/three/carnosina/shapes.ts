import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/* Formas orgânicas do modelo (geometria pura, criada uma vez): hemácia, vilosidade, proteína, hélice. */

/** Ruído suave e barato (soma de senos) para deformar superfícies. */
export const wobble = (x: number, y: number, z: number, seed = 0) =>
    Math.sin(x * 1.7 + seed) * Math.cos(y * 1.3 - seed * 0.7) * 0.5
    + Math.sin(z * 2.3 + x * 0.9 + seed * 1.3) * 0.3
    + Math.sin(y * 3.1 + z * 1.1 - seed) * 0.2;

/** Hemácia: disco bicôncavo (perfil clássico de Evans–Fung), raio 1. */
export const redCellGeometry = (seg = 28) => {
    const pts: THREE.Vector2[] = [];
    const n = 18;
    for (let k = 0; k <= n; k++) {
        const r = Math.sin((k / n) * Math.PI * 0.5) * 0.999;
        const x2 = r * r;
        const h = 0.5 * Math.sqrt(Math.max(1 - x2, 0)) * (0.21 + 2.0 * x2 - 1.12 * x2 * x2);
        pts.push(new THREE.Vector2(r, h));
    }
    const back = pts.slice(0, -1).reverse().map(p => new THREE.Vector2(p.x, -p.y));
    const g = new THREE.LatheGeometry([...pts, ...back].reverse(), seg);
    g.computeVertexNormals();
    return g;
};

/** Vilosidade: dedo afinando no meio e com a ponta arredondada, superfície levemente irregular. */
export const villusGeometry = (h: number, seed: number) => {
    const pts: THREE.Vector2[] = [];
    const n = 44;
    for (let k = 0; k <= n; k++) {
        const u = Math.sin((k / n) * Math.PI * 0.5) ** 0.6;
        const y = u * h;
        let r = 0.66 - 0.16 * Math.sin(u * Math.PI * 0.9) + 0.05 * Math.sin(u * 9);
        if (u > 0.86) r *= Math.sqrt(Math.max(1 - ((u - 0.86) / 0.14) ** 2, 0));
        pts.push(new THREE.Vector2(Math.max(r, 0.001), y));
    }
    const g = mergeVertices(new THREE.LatheGeometry(pts, 22));
    const pos = g.getAttribute('position');
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const k = 1 + wobble(v.x * 3, v.y * 1.4, v.z * 3, seed) * 0.07;
        pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
    g.computeVertexNormals();
    return g;
};

/**
 * Proteína globular: esfera deformada por ruído (lóbulos), com uma fenda opcional (sítio ativo) cortada
 * no ângulo `cleft` (radianos de abertura; 0 = sem fenda).
 */
export const proteinGeometry = (radius: number, seed: number, detail = 5, bumps = 0.16) => {
    const g = mergeVertices(new THREE.IcosahedronGeometry(radius, detail));
    const pos = g.getAttribute('position');
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = wobble(v.x * 1.2 / radius * 2, v.y * 1.2 / radius * 2, v.z * 1.2 / radius * 2, seed) * bumps
            + wobble(v.x * 4 / radius, v.y * 4 / radius, v.z * 4 / radius, seed + 3) * bumps * 0.35;
        v.multiplyScalar(1 + n);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
};

/** Hélice alfa estilizada (fita tubular em espiral) ao longo do eixo y, de y0 a y1. */
const helixTube = (cx: number, cz: number, y0: number, y1: number, turns: number, r: number, phase: number) => {
    const pts: THREE.Vector3[] = [];
    const n = 48;
    for (let k = 0; k <= n; k++) {
        const u = k / n;
        const a = phase + u * turns * Math.PI * 2;
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, y0 + (y1 - y0) * u, cz + Math.sin(a) * r));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.13, 7);
};

/**
 * Transportador de membrana: feixe de hélices transmembrana em anel, deixando um poro no meio.
 * `n` hélices a `ring` do eixo, levemente inclinadas (como num feixe real).
 */
export const transporterGeometry = (n: number, ring: number, half: number) => {
    const parts: THREE.BufferGeometry[] = [];
    for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        const h = helixTube(0, 0, -half, half, 4.2, 0.28, k * 1.3);
        h.rotateX(((k % 2) - 0.5) * 0.22);
        h.translate(Math.cos(a) * ring, 0, Math.sin(a) * ring);
        parts.push(h);
    }
    const g = mergeGeometries(parts);
    parts.forEach(p => p.dispose());
    return g;
};
