import * as THREE from 'three';

/*
 * Geografia da cena (corte esquemático no plano z = 0, a câmera olha de +z):
 * estômago à esquerda, intestino embaixo, a veia porta sobe para a direita e vira o capilar que corre
 * sobre a fibra muscular; a pilha de sódio fica embaixo da fibra. Escalas fora de proporção.
 */

type P3 = readonly [number, number, number];
const curve = (pts: readonly P3[]) => new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal');

/** Perfil de raio por Catmull-Rom 1D com chaves igualmente espaçadas em u ∈ [0, 1]. */
const profile = (keys: readonly number[]) => (u: number): number => {
    const n = keys.length - 1;
    const x = Math.min(Math.max(u, 0), 1) * n;
    const i = Math.min(Math.floor(x), n - 1);
    const t = x - i;
    const p0 = keys[Math.max(i - 1, 0)];
    const p1 = keys[i];
    const p2 = keys[i + 1];
    const p3 = keys[Math.min(i + 2, n)];
    return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
};

export interface Organ { curve: THREE.Curve<THREE.Vector3>; radius: (u: number) => number }

const stomachProfile = profile([1.3, 1.8, 2.0, 1.95, 1.7, 1.3, 0.9, 0.62, 0.52]);
export const STOMACH: Organ = {
    curve: curve([[-11.6, 5.0, 0], [-11.1, 3.0, 0], [-9.8, 1.1, 0], [-7.8, 0.2, 0], [-5.9, 0.8, 0]]),
    // o fundo fecha em cúpula (raiz quadrada no começo); o piloro fica aberto para o duodeno
    radius: u => stomachProfile(u) * Math.sqrt(Math.min(u / 0.09, 1)),
};

export const ESOPHAGUS: Organ = {
    curve: curve([[-9.3, 9.0, 0], [-9.55, 7.4, 0], [-10.1, 5.9, 0]]),
    radius: () => 0.4,
};

export const GUT: Organ = {
    curve: curve([
        [-6.1, 0.8, 0], [-4.8, 1.0, 0], [-4.1, -0.1, 0], [-4.5, -1.5, 0], [-5.7, -2.5, 0], [-5.3, -3.8, 0],
        [-3.8, -4.0, 0], [-2.7, -2.7, 0], [-1.2, -2.9, 0], [-1.0, -4.4, 0], [-2.4, -5.4, 0], [-4.2, -5.9, 0],
        [-3.6, -7.3, 0], [-1.4, -7.4, 0], [0.4, -6.4, 0],
    ]),
    radius: () => 0.62,
};

/** Veia porta → circulação → capilar sobre a fibra (o trecho do meio é esquemático). */
export const VESSEL: Organ = {
    curve: curve([
        [-1.3, -3.6, -1.2], [0.4, -2.4, -0.8], [2.2, -0.4, -0.4], [4.2, 1.0, -0.1], [6.4, 1.5, 0],
        [8.2, 1.15, 0], [10, 1.1, 0], [13, 1.1, 0], [16.2, 1.1, 0],
    ]),
    radius: u => (u < 0.42 ? 0.46 : u > 0.6 ? 0.3 : 0.46 - ((u - 0.42) / 0.18) * 0.16),
};

/** Fibra: cilindro ao longo de x, embaixo do capilar. */
export const FIBER = { x0: 8.2, x1: 15.6, y: -1.4, r: 1.45 } as const;
export const MEMBRANE_Y = FIBER.y + FIBER.r;
export const FIBER_ORGAN: Organ = {
    curve: new THREE.LineCurve3(new THREE.Vector3(FIBER.x0, FIBER.y, 0), new THREE.Vector3(FIBER.x1, FIBER.y, 0)),
    radius: () => FIBER.r,
};
export const CAPILLARY_Y = 1.1;
export const MCT_X: readonly number[] = [9.1, 10.4, 11.7, 13.0, 14.3];

/** Copo da dose: acima do esôfago, inclinado, despejando na boca do tubo. */
export const CUP = { x: -10.5, y: 10.35, z: 0.2, r: 0.62, h: 1.5, tilt: -0.95 } as const;

/** Pilha de sódio: base, três colunas (OMS, antiácido, esta dose), disco = 0,5 g de Na. */
export const STACK = { y: -8.6, z: 1.6, xs: [7.2, 9.5, 12.0] as const, r: 0.7, disc: 0.17, gap: 0.03, grams: 0.5 } as const;
export const stackHeight = (discs: number): number => discs * (STACK.disc + STACK.gap);

/* ── Amostras pré-calculadas: ponto, normal (no plano), binormal (≈ z) e raio ── */

export interface Lut { n: number; p: Float32Array; nx: Float32Array; bz: Float32Array; r: Float32Array }

const Z = new THREE.Vector3(0, 0, 1);
const tmpT = new THREE.Vector3();
const tmpN = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/** Referencial em u: tangente, normal no plano da cena e binormal (quase sempre +z). */
export const frameAt = (c: THREE.Curve<THREE.Vector3>, u: number, n: THREE.Vector3, b: THREE.Vector3): void => {
    c.getTangentAt(u, tmpT);
    n.crossVectors(Z, tmpT).normalize();
    b.crossVectors(tmpT, n).normalize();
};

export const buildLut = (o: Organ, n: number): Lut => {
    const lut: Lut = { n, p: new Float32Array(n * 3), nx: new Float32Array(n * 3), bz: new Float32Array(n * 3), r: new Float32Array(n) };
    const pt = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        o.curve.getPointAt(u, pt);
        frameAt(o.curve, u, tmpN, tmpB);
        pt.toArray(lut.p, i * 3);
        tmpN.toArray(lut.nx, i * 3);
        tmpB.toArray(lut.bz, i * 3);
        lut.r[i] = o.radius(u);
    }
    return lut;
};

/** Ponto do tubo em u, deslocado (a, b) em frações do raio ao longo da normal e da binormal. */
export const lutPoint = (l: Lut, u: number, a: number, b: number, out: THREE.Vector3): THREE.Vector3 => {
    const x = Math.min(Math.max(u, 0), 1) * (l.n - 1);
    const i = Math.min(Math.floor(x), l.n - 2);
    const k = x - i;
    const j = i + 1;
    const r = l.r[i] + (l.r[j] - l.r[i]) * k;
    for (let c = 0; c < 3; c++) {
        const p = l.p[i * 3 + c] + (l.p[j * 3 + c] - l.p[i * 3 + c]) * k;
        const nn = l.nx[i * 3 + c] + (l.nx[j * 3 + c] - l.nx[i * 3 + c]) * k;
        const bb = l.bz[i * 3 + c] + (l.bz[j * 3 + c] - l.bz[i * 3 + c]) * k;
        out.setComponent(c, p + (nn * a + bb * b) * r);
    }
    return out;
};

/** Relevo da parede: fração do raio externo onde fica a mucosa em (u, θ) — 1 = sem espessura. */
export type Inset = (u: number, th: number) => number;

export interface TubeOptions {
    /** Relevo interno (pregas, rugas): as normais passam a ser recalculadas. */
    inset?: Inset;
    /** Comprimento e deslocamento do trecho em unidades de mundo (uv.x = posição ao longo do vaso). */
    uvLen?: number;
    uvOffset?: number;
}

/**
 * Tubo de raio variável. `arc` limita o ângulo: [π, 2π] é a metade de trás (o corte), [0, 2π] o tubo
 * inteiro. As normais apontam para fora; com DoubleSide, a face de dentro acende do lado certo.
 * uv.x = distância ao longo do tubo (mundo), uv.y = arco percorrido (mundo): texturas sem esticar.
 */
export const tubeGeometry = (
    o: Organ, tubular: number, radial: number, arc: readonly [number, number] = [0, Math.PI * 2], opts: TubeOptions = {},
): THREE.BufferGeometry => {
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const pt = new THREE.Vector3();
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    const len = opts.uvLen ?? o.curve.getLength();
    const off = opts.uvOffset ?? 0;
    for (let i = 0; i <= tubular; i++) {
        const u = i / tubular;
        o.curve.getPointAt(u, pt);
        frameAt(o.curve, u, n, b);
        const r = o.radius(u);
        for (let j = 0; j <= radial; j++) {
            const th = arc[0] + ((arc[1] - arc[0]) * j) / radial;
            const cx = Math.cos(th);
            const sy = Math.sin(th);
            const dx = n.x * cx + b.x * sy;
            const dy = n.y * cx + b.y * sy;
            const dz = n.z * cx + b.z * sy;
            const rr = r * (opts.inset ? opts.inset(u, th) : 1);
            pos.push(pt.x + dx * rr, pt.y + dy * rr, pt.z + dz * rr);
            nor.push(dx, dy, dz);
            uv.push(off + u * len, (th - arc[0]) * Math.max(r, 0.05));
        }
    }
    for (let i = 0; i < tubular; i++) {
        for (let j = 0; j < radial; j++) {
            const a = i * (radial + 1) + j;
            const c = a + radial + 1;
            idx.push(a, c, a + 1, c, c + 1, a + 1);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    if (opts.inset) {
        // normais do relevo, com o sentido da convenção (para fora do eixo)
        const ref = new THREE.Vector3().fromArray(nor, (radial >> 1) * 3);
        g.computeVertexNormals();
        const got = new THREE.Vector3().fromBufferAttribute(g.getAttribute('normal') as THREE.BufferAttribute, radial >> 1);
        if (got.dot(ref) < 0) {
            const na = g.getAttribute('normal') as THREE.BufferAttribute;
            for (let k = 0; k < na.array.length; k++) (na.array as Float32Array)[k] *= -1;
        }
    }
    return g;
};

/** Camada da parede no corte: posição na espessura (0 = mucosa, 1 = serosa) e cor. */
export interface WallLayer { at: number; color: THREE.Color }

/**
 * Face do corte (θ fixo): a faixa entre a mucosa e a serosa, colorida por camadas — é ela que mostra
 * a espessura da parede, como num modelo anatômico seccionado.
 */
export const cutFaceGeometry = (o: Organ, theta: number, inset: Inset, layers: readonly WallLayer[], tubular: number): THREE.BufferGeometry => {
    const pos: number[] = [];
    const nor: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const pt = new THREE.Vector3();
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    const k = layers.length;
    for (let i = 0; i <= tubular; i++) {
        const u = i / tubular;
        o.curve.getPointAt(u, pt);
        frameAt(o.curve, u, n, b);
        const r = o.radius(u);
        const rIn = r * inset(u, theta);
        const cx = Math.cos(theta);
        const sy = Math.sin(theta);
        const dx = n.x * cx + b.x * sy;
        const dy = n.y * cx + b.y * sy;
        const dz = n.z * cx + b.z * sy;
        for (const L of layers) {
            const rr = rIn + (r - rIn) * L.at;
            pos.push(pt.x + dx * rr, pt.y + dy * rr, pt.z + dz * rr);
            nor.push(b.x, b.y, b.z);
            col.push(L.color.r, L.color.g, L.color.b);
        }
    }
    for (let i = 0; i < tubular; i++) {
        for (let j = 0; j < k - 1; j++) {
            const a = i * k + j;
            const c = a + k;
            idx.push(a, c, a + 1, c, c + 1, a + 1);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    return g;
};

/** Linha da borda do corte (θ fixo) como tubo fino: destaca a seção. */
export const rimGeometry = (o: Organ, theta: number, thick: number, samples = 96): THREE.TubeGeometry => {
    const pts: THREE.Vector3[] = [];
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        const p = o.curve.getPointAt(u, new THREE.Vector3());
        frameAt(o.curve, u, n, b);
        const r = o.radius(u);
        pts.push(p.addScaledVector(n, Math.cos(theta) * r).addScaledVector(b, Math.sin(theta) * r));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), samples, thick, 6, false);
};

/** Centro aproximado de um órgão (para inflar o estômago em torno dele). */
export const centroidOf = (o: Organ): THREE.Vector3 => {
    const acc = new THREE.Vector3();
    const p = new THREE.Vector3();
    for (let i = 0; i <= 20; i++) acc.add(o.curve.getPointAt(i / 20, p));
    return acc.multiplyScalar(1 / 21);
};
