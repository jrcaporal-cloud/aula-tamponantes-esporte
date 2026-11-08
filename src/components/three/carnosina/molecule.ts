import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
 * Carnosina em bola e bastão simplificada (só átomos pesados, sem hidrogênios), no referencial da
 * molécula inteira: a β-alanina, a histidina e o anel imidazol são peças separadas que se encaixam
 * exatamente (a síntese junta as duas metades; a CN1 as separa). Cor por parte, não por elemento:
 * violeta = β-alanina, ardósia = histidina, ciano = anel imidazol (o grupo que tampona).
 */

type El = 'C' | 'N' | 'O';
type Part = 'ba' | 'his' | 'ring';
interface Atom { el: El; part: Part; p: [number, number, number] }

const RAW: Atom[] = [
    { el: 'N', part: 'ba', p: [-4.6, 0.6, 0] },
    { el: 'C', part: 'ba', p: [-3.4, -0.2, 0.25] },
    { el: 'C', part: 'ba', p: [-2.1, 0.55, -0.2] },
    { el: 'C', part: 'ba', p: [-0.85, -0.25, 0.15] },
    { el: 'O', part: 'ba', p: [-0.85, -1.5, 0.3] },
    { el: 'N', part: 'his', p: [0.35, 0.45, 0] },
    { el: 'C', part: 'his', p: [1.6, -0.3, 0.2] },
    { el: 'C', part: 'his', p: [2.85, 0.5, 0] },
    { el: 'O', part: 'his', p: [2.85, 1.75, -0.2] },
    { el: 'O', part: 'his', p: [4.0, -0.2, 0.2] },
    { el: 'C', part: 'his', p: [1.6, -1.8, 0.4] },
];

// anel imidazol: pentágono preso ao Cβ da histidina (Cγ, Nδ1, Cε1, Nε2, Cδ2)
const RING_R = 1.18;
const CB = RAW[10].p;
const CG: [number, number, number] = [2.6, -2.75, 0.3];
const dir = new THREE.Vector2(CG[0] - CB[0], CG[1] - CB[1]).normalize();
const RING_C = [CG[0] + dir.x * RING_R, CG[1] + dir.y * RING_R] as const;
const a0 = Math.atan2(CG[1] - RING_C[1], CG[0] - RING_C[0]);
const RING_EL: El[] = ['C', 'N', 'C', 'N', 'C'];
const RING: Atom[] = RING_EL.map((el, k) => {
    const a = a0 + (k * 2 * Math.PI) / 5;
    return { el, part: 'ring', p: [RING_C[0] + Math.cos(a) * RING_R, RING_C[1] + Math.sin(a) * RING_R, 0.3 + Math.sin(k * 2.1) * 0.12] };
});

/** Centro da molécula: tudo é desenhado em volta da origem. */
const CENTER: [number, number, number] = [-0.2, -1.1, 0.15];
const ATOMS: Atom[] = [...RAW, ...RING].map(a => ({ ...a, p: [a.p[0] - CENTER[0], a.p[1] - CENTER[1], a.p[2] - CENTER[2]] }));

const BONDS_BA: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4]];
const BONDS_HIS: [number, number][] = [[5, 6], [6, 7], [7, 8], [7, 9], [6, 10]];
const BONDS_RING: [number, number][] = [[10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 11]];
/** A ligação peptídica (C da β-alanina – N da histidina) que a CARNS1 forma e a CN1 corta. */
const AMIDE: [number, number] = [3, 5];

const COLOR: Record<Part, Record<El, string>> = {
    ba: { C: '#C4B5FD', N: '#EDE9FE', O: '#8B5CF6' },
    his: { C: '#94A3B8', N: '#E2E8F0', O: '#64748B' },
    ring: { C: '#22D3EE', N: '#A5F3FC', O: '#22D3EE' },
};
const RADIUS: Record<El, number> = { C: 0.42, N: 0.44, O: 0.46 };

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

const paint = (g: THREE.BufferGeometry, hex: string) => {
    const c = new THREE.Color(hex);
    const n = g.getAttribute('position').count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
};

/** Cor do átomo `i` um pouco escurecida: cada metade do bastão leva a cor do átomo da ponta. */
const atomHex = (i: number) => `#${new THREE.Color(COLOR[ATOMS[i].part][ATOMS[i].el]).multiplyScalar(0.82).getHexString()}`;

const halfStick = (a: THREE.Vector3, b: THREE.Vector3, r: number, hex: string, seg: number) => {
    const len = a.distanceTo(b);
    const g = new THREE.CylinderGeometry(r, r, len, seg, 1, true);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, b.clone().sub(a).normalize());
    g.applyQuaternion(q);
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    return paint(g, hex);
};

/** Bastão entre dois átomos, em duas metades (cor de cada átomo); `hex` força uma cor só. */
const stick = (i: number, j: number, r: number, hex: string | null, seg: number) => {
    tmpA.set(...ATOMS[i].p);
    tmpB.set(...ATOMS[j].p);
    const mid = tmpA.clone().lerp(tmpB, 0.5);
    const g = mergeGeometries([
        halfStick(tmpA.clone(), mid, r, hex ?? atomHex(i), seg),
        halfStick(mid, tmpB.clone(), r, hex ?? atomHex(j), seg),
    ]);
    return g;
};

const ball = (i: number, seg: number) => {
    const a = ATOMS[i];
    const g = new THREE.SphereGeometry(RADIUS[a.el], seg, Math.max(6, seg - 4));
    g.translate(...a.p);
    return paint(g, COLOR[a.part][a.el]);
};

interface Detail { sphere: number; stick: number }
const HI: Detail = { sphere: 32, stick: 14 };
const LO: Detail = { sphere: 12, stick: 7 };

const build = (atoms: number[], bonds: [number, number][], d: Detail) => {
    const parts = [...atoms.map(i => ball(i, d.sphere)), ...bonds.map(([i, j]) => stick(i, j, 0.14, null, d.stick))];
    const g = mergeGeometries(parts);
    parts.forEach(p => p.dispose());
    return g;
};

const range = (a: number, b: number) => Array.from({ length: b - a }, (_, k) => a + k);

/** Peças da molécula. `lo` = versão leve para as cópias instanciadas. */
export const makeCarnosineParts = (lo = false) => {
    const d = lo ? LO : HI;
    return {
        ba: build(range(0, 5), BONDS_BA, d),
        his: build(range(5, 11), BONDS_HIS, d),
        ring: build(range(11, 16), BONDS_RING, d),
        amide: stick(AMIDE[0], AMIDE[1], 0.16, '#F5F0FF', d.stick),
    };
};

/** Molécula inteira numa geometria só (para as dezenas de cópias da cena do tampão). */
export const makeCarnosineWhole = () => {
    const p = makeCarnosineParts(true);
    const g = mergeGeometries([p.ba, p.his, p.amide]);
    Object.values(p).forEach(x => x !== p.ring && x.dispose());
    return { body: g, ring: p.ring };
};

/** Onde fica o N do anel que recebe o H⁺ (Nε2), no referencial da molécula. */
export const RING_N = new THREE.Vector3(...ATOMS[14].p);
/** Centro do anel imidazol. */
export const RING_CENTER = new THREE.Vector3(RING_C[0] - CENTER[0], RING_C[1] - CENTER[1], 0.3 - CENTER[2]);
/** Átomos das pontas da ligação peptídica (para a água que sai na síntese). */
export const AMIDE_C = new THREE.Vector3(...ATOMS[AMIDE[0]].p);
