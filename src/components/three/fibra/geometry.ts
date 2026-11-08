import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { rng } from '../shared/math';
import { CAP_R, CUT_A, CUT_B, FIBER_HALF, FIBER_R, MYO_R, PORT_A, onFiber } from './layout';
import { SARCOMERES } from './textures';

/* Geometrias compartilhadas, criadas uma vez no carregamento do módulo. */

const alongX = <G extends THREE.BufferGeometry>(g: G): G => g.rotateZ(-Math.PI / 2);

/** Junta peças indexadas mantendo as normais suaves de cada uma. */
const merged = (parts: THREE.BufferGeometry[]) => mergeGeometries(parts);

/* ---------- Sarcolema (membrana com espessura) ---------- */

/** Espessura esquemática da membrana (bicamada exagerada para ser vista). */
export const MEMBRANE_T = 0.13;
const OPEN = Math.PI * 2 - (CUT_B - CUT_A);

/** Casca externa do sarcolema sem a fatia da frente (θ do cilindro = α − π/2, ver layout). */
export const SHELL = alongX(new THREE.CylinderGeometry(FIBER_R, FIBER_R, FIBER_HALF * 2, 128, 1, true, CUT_B - Math.PI / 2, OPEN));
/** Face interna (lado do sarcoplasma). */
export const SHELL_IN = alongX(new THREE.CylinderGeometry(FIBER_R - MEMBRANE_T, FIBER_R - MEMBRANE_T, FIBER_HALF * 2, 128, 1, true, CUT_B - Math.PI / 2, OPEN));

/** Faixa plana que fecha a espessura da membrana numa borda do corte longitudinal. */
const cutStrip = (alpha: number) => {
    const a = onFiber(-FIBER_HALF, alpha, FIBER_R);
    const b = onFiber(FIBER_HALF, alpha, FIBER_R);
    const c = onFiber(FIBER_HALF, alpha, FIBER_R - MEMBRANE_T);
    const d = onFiber(-FIBER_HALF, alpha, FIBER_R - MEMBRANE_T);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3));
    g.computeVertexNormals();
    return g;
};
export const CUT_STRIPS = mergeGeometries([cutStrip(CUT_A), cutStrip(CUT_B)]);

/** Folhetos da bicamada (as duas linhas claras de cada borda do corte). */
export const LEAFLET = alongX(new THREE.CylinderGeometry(0.028, 0.028, FIBER_HALF * 2, 6));

/** Anel da ponta (espessura da membrana no corte transversal). */
export const END_RING = new THREE.RingGeometry(FIBER_R - MEMBRANE_T, FIBER_R, 96, 1, Math.PI / 2 - CUT_A, OPEN).rotateY(-Math.PI / 2);
/** Fundo do corte transversal (sarcoplasma), atrás das pontas das miofibrilas. */
export const CAP = new THREE.CircleGeometry(FIBER_R - MEMBRANE_T, 64, Math.PI / 2 - CUT_A, OPEN).rotateY(-Math.PI / 2);

/** Grânulos da superfície (proteínas de membrana, esquemáticos): posições fora da fatia aberta. */
export const MEMBRANE_GRAINS: readonly [number, number, number][] = (() => {
    const r = rng(611);
    const out: [number, number, number][] = [];
    while (out.length < 340) {
        const a = r() * Math.PI * 2;
        const inCut = a > CUT_A - 0.04 && a < CUT_B + 0.04;
        if (inCut) continue;
        out.push(onFiber((r() * 2 - 1) * (FIBER_HALF - 0.15), a, FIBER_R + 0.01));
    }
    return out;
})();

/* ---------- Miofibrila com sarcômeros em relevo ---------- */

const MYO_LEN = FIBER_HALF * 2 - 0.25;

/** Miofibrila: cilindro com sulco em cada disco Z e banda A levemente saliente. */
export const MYOFIBRIL = (() => {
    const g = new THREE.CylinderGeometry(MYO_R, MYO_R, MYO_LEN, 24, SARCOMERES * 12, false);
    const pos = g.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const ph = (((y + MYO_LEN / 2) / MYO_LEN) * SARCOMERES) % 1;
        const dz = Math.min(ph, 1 - ph);
        const groove = Math.exp(-((dz / 0.035) ** 2));
        const aBand = Math.exp(-(((ph - 0.5) / 0.22) ** 4));
        const k = 1 - 0.09 * groove + 0.035 * aBand;
        pos.setX(i, pos.getX(i) * k);
        pos.setZ(i, pos.getZ(i) * k);
    }
    g.computeVertexNormals();
    return alongX(g);
})();

/** Túbulos T + cisternas terminais (tríade): um anel em cada junção A–I. */
export const TRIAD = new THREE.TorusGeometry(MYO_R + 0.035, 0.03, 5, 20).rotateY(Math.PI / 2);
/** Fases (dentro do sarcômero) onde ficam as tríades. */
export const TRIAD_PHASES = [0.22, 0.78] as const;
export const MYO_SARC_LEN = MYO_LEN / SARCOMERES;
export const MYO_START = -MYO_LEN / 2;

/** Manga do retículo sarcoplasmático (a renda vem da textura alfa). */
export const SR_SLEEVE = alongX(new THREE.CylinderGeometry(MYO_R + 0.03, MYO_R + 0.03, MYO_LEN, 24, 1, true));

/* ---------- Primitivas ---------- */

export const SPHERE = new THREE.SphereGeometry(1, 16, 12);
export const SPHERE_HI = new THREE.SphereGeometry(1, 28, 20);
export const ICO = new THREE.IcosahedronGeometry(1, 0);
export const OCTA = new THREE.OctahedronGeometry(1, 0);
export const TORUS = new THREE.TorusGeometry(0.75, 0.32, 14, 32);
export const RING = new THREE.RingGeometry(0.82, 1, 48);

/** Proteína globular: icosaedro subdividido com relevo determinístico. */
export const GLOBULE = (() => {
    const g = new THREE.IcosahedronGeometry(1, 2);
    const pos = g.getAttribute('position');
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = 1 + 0.13 * Math.sin(v.x * 5.1 + v.y * 2.3) * Math.cos(v.z * 4.3 - v.x * 1.7) + 0.06 * Math.sin(v.y * 9 + v.z * 7);
        v.multiplyScalar(n);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
})();

/** Fosfato (PO₄): fósforo central e quatro oxigênios em tetraedro. */
export const PHOSPHATE = merged([
    new THREE.SphereGeometry(0.55, 14, 10),
    ...[[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(([x, y, z]) =>
        new THREE.SphereGeometry(0.42, 12, 9).translate(x * 0.5, y * 0.5, z * 0.5)),
]);

/** Carnosina: dipeptídeo (β-alanina + histidina) como haltere, com a ligação peptídica. */
export const DUMBBELL = merged([
    new THREE.SphereGeometry(0.62, 16, 12).translate(-0.6, 0, 0),
    new THREE.SphereGeometry(0.75, 16, 12).translate(0.62, 0, 0),
    new THREE.CylinderGeometry(0.22, 0.22, 0.8, 10).rotateZ(Math.PI / 2),
]);

/** HCO₃⁻: carbono e três oxigênios num plano. */
export const TREFOIL = merged([
    new THREE.SphereGeometry(0.5, 12, 9),
    ...[0, 1, 2].map(k => {
        const a = (k * 2 * Math.PI) / 3 + Math.PI / 2;
        return new THREE.SphereGeometry(0.55, 12, 9).translate(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0);
    }),
]);

/** CO₂: O=C=O em linha. */
export const LINEAR3 = merged([
    new THREE.SphereGeometry(0.55, 12, 9),
    new THREE.SphereGeometry(0.5, 12, 9).translate(-1, 0, 0),
    new THREE.SphereGeometry(0.5, 12, 9).translate(1, 0, 0),
]);

/* ---------- Transportadores ---------- */

/** Transportador: feixe de quatro hélices (cápsulas levemente torcidas) em volta de um poro. */
export const PORTER = merged([0, 1, 2, 3].map(k => {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    return new THREE.CapsuleGeometry(0.13, 0.95, 6, 12)
        .rotateX(0.16)
        .rotateY(-a)
        .translate(Math.cos(a) * 0.23, 0, Math.sin(a) * 0.23);
})).rotateX(PORT_A);

/** Colar do transportador: anel no plano da membrana. */
export const PORTER_COLLAR = new THREE.TorusGeometry(0.42, 0.05, 8, 32).rotateX(Math.PI / 2).rotateX(PORT_A);

/* ---------- Mitocôndria ---------- */

const MITO_R = 0.3;
const MITO_LEN = 0.84;

/** Membrana externa: cápsula ao longo de x. */
export const MITO_OUTER = alongX(new THREE.CapsuleGeometry(MITO_R, MITO_LEN, 10, 28));

/** Cristas: placas que entram alternadamente de um lado e do outro, mais a matriz interna. */
export const MITO_CRISTAE = merged([
    ...Array.from({ length: 7 }, (_, k) => {
        const x = -MITO_LEN / 2 - 0.1 + (k + 0.5) * ((MITO_LEN + 0.2) / 7);
        const side = k % 2 ? 1 : -1;
        return new THREE.CylinderGeometry(MITO_R * 0.86, MITO_R * 0.86, 0.035, 18, 1, false, 0, Math.PI * 1.25)
            .rotateZ(Math.PI / 2)
            .rotateX(side > 0 ? 0 : Math.PI)
            .translate(x, 0, 0);
    }),
]);

/* ---------- Capilar ---------- */

/** Espessura esquemática da parede do capilar (endotélio). */
export const CAP_WALL = 0.11;

/** Hemácia: disco bicôncavo (perfil de Evans–Fung), eixo em z. */
export const RBC = (() => {
    const R = 0.34;
    const h = (p: number) => 0.5 * Math.sqrt(Math.max(1 - p * p, 0)) * (0.207 + 2.003 * p * p - 1.123 * p ** 4) * R;
    // de baixo (centro) à borda e de volta ao centro por cima
    const N = 22;
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 2 * N; i++) {
        const p = Math.sin((1 - Math.abs(i - N) / N) * (Math.PI / 2));
        pts.push(new THREE.Vector2(Math.max(p * R, 1e-4), (i < N ? -1 : 1) * h(p)));
    }
    const g = new THREE.LatheGeometry(pts, 36).rotateX(Math.PI / 2);
    g.computeVertexNormals();
    return g;
})();

/** Anel de borda do capilar (mostra a espessura da parede nas pontas). */
export const CAP_END_RING = new THREE.RingGeometry(CAP_R - CAP_WALL, CAP_R, 48).rotateY(Math.PI / 2);

/** Seta no fim do capilar (rumo ao pulmão). */
export const ARROW = new THREE.ConeGeometry(0.42, 0.9, 28).rotateZ(-Math.PI / 2);
