import { rng } from '../shared/math';

/*
 * Geometria da cena (unidades do mundo, escala esquemática). A fibra corre ao longo de x; o capilar
 * fica acima, paralelo a ela. O ângulo α é medido no plano YZ, de +y (topo) para +z (frente): o corte
 * longitudinal tira a fatia da frente (α entre CUT_A e CUT_B) para mostrar o sarcoplasma.
 */

export type Vec3 = readonly [number, number, number];

export const FIBER_R = 3;
export const FIBER_HALF = 7.5;
export const CUT_A = 0.62;
export const CUT_B = 2.55;

export const CAP_Y = 5.7;
export const CAP_Z = 0.7;
export const CAP_R = 1.05;
/** Raio útil do plasma (dentro da parede do capilar). */
export const PLASMA_R = 0.86;
export const CAP_HALF = 9.5;
/** Velocidade do sangue no capilar (sentido +x, rumo ao coração e ao pulmão). */
export const FLOW_SPEED = 1.5;

/** Onde os transportadores ficam: no topo da fibra, virados para o capilar e um pouco para a câmera. */
export const PORT_A = 0.36;

export const onFiber = (x: number, alpha: number, r = FIBER_R): [number, number, number] =>
    [x, r * Math.cos(alpha), r * Math.sin(alpha)];

export type PortId = 'mct4' | 'mct1' | 'nhe1' | 'nbc';
export const PORT_X: Readonly<Record<PortId, readonly number[]>> = {
    mct4: [-4.6, 2.2],
    mct1: [-1.9, 5.2],
    nhe1: [0.6, -6.4],
    nbc: [3.6],
};

/** Ponto interno (boca do lado do sarcoplasma) e externo (lado do interstício) de uma porta. */
export const portInner = (x: number): [number, number, number] => onFiber(x, PORT_A, FIBER_R - 0.45);
export const portOuter = (x: number): [number, number, number] => onFiber(x, PORT_A, FIBER_R + 0.45);
/** Interstício logo acima da porta, a caminho do capilar. */
export const portOut = (x: number, dy: number): [number, number, number] => onFiber(x, PORT_A * 0.7, FIBER_R + 0.95 + dy);

/** Ponto aleatório do sarcoplasma visível (a fatia aberta da fibra), sem cair dentro das miofibrilas de trás. */
export const sarcoPoint = (rand: () => number, xSpan = FIBER_HALF - 0.8): [number, number, number] => {
    const a = CUT_A - 0.25 + rand() * (CUT_B - CUT_A + 0.3);
    const r = 0.9 + Math.sqrt(rand()) * (FIBER_R - 1.25);
    return onFiber((rand() * 2 - 1) * xSpan, a, r);
};

/** Ponto dentro do plasma, numa seção x. */
export const plasmaPoint = (x: number, rand: () => number, k = 0.8): [number, number, number] => {
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * PLASMA_R * k;
    return [x, CAP_Y + Math.cos(t) * r, CAP_Z + Math.sin(t) * r];
};

/* ---------- Estruturas fixas, geradas uma vez (determinísticas) ---------- */

export interface Myofibril { y: number; z: number }

/** Miofibrilas em grade hexagonal; ficam as de trás e do meio, a fatia da frente vira o palco do sarcoplasma. */
export const MYOFIBRILS: readonly Myofibril[] = (() => {
    const out: Myofibril[] = [];
    const step = 0.92;
    for (let i = -4; i <= 4; i++) {
        for (let j = -4; j <= 4; j++) {
            const y = (i + (j % 2 ? 0.5 : 0)) * step;
            const z = j * step * 0.866;
            const r = Math.hypot(y, z);
            if (r > FIBER_R - 0.42) continue;
            const a = Math.atan2(z, y);
            const inCut = a > CUT_A - 0.1 && a < CUT_B + 0.1 && r > 0.75;
            if (!inCut) out.push({ y, z });
        }
    }
    return out;
})();
export const MYO_R = 0.34;

export interface Placed { p: [number, number, number]; s: number; rot: number }

const scatter = (seed: number, n: number, minGap: number): Placed[] => {
    const rand = rng(seed);
    const out: Placed[] = [];
    let guard = 0;
    while (out.length < n && guard++ < n * 60) {
        const p = sarcoPoint(rand);
        if (out.some(o => Math.hypot(o.p[0] - p[0], o.p[1] - p[1], o.p[2] - p[2]) < minGap)) continue;
        out.push({ p, s: 0.85 + rand() * 0.3, rot: rand() * Math.PI * 2 });
    }
    return out;
};

export const MITOCHONDRIA = scatter(31, 11, 1.7);

export type BufferKind = 'proteina' | 'fosfato' | 'carnosina' | 'ck';
/** Sítios de tampão. A carnosina tem um conjunto extra que só acende com a beta-alanina. */
export const BUFFER_SITES: Readonly<Record<BufferKind, readonly Placed[]>> = {
    proteina: scatter(7, 22, 0.75),
    fosfato: scatter(19, 13, 0.8),
    carnosina: scatter(43, 17, 0.9),
    ck: scatter(57, 7, 1.2),
};
/** Quantos sítios de carnosina ficam acesos sem e com beta-alanina (+~60%, ordem de HILL2007/HARRIS2006). */
export const CARNO_BASE = 10;
export const CARNO_LOADED = 17;

/** Hemácias no capilar (posição inicial ao longo de x e no plano da seção). */
export const RED_CELLS = (() => {
    const rand = rng(77);
    return Array.from({ length: 11 }, (_, i) => ({
        x0: -CAP_HALF + (i / 11) * CAP_HALF * 2 + rand() * 0.6,
        dy: (rand() * 2 - 1) * 0.32,
        dz: (rand() * 2 - 1) * 0.32,
        spin: rand() * 6.28,
    }));
})();

/** Onde o H⁺ que chega do interstício encontra o HCO₃⁻ (zona da anidrase carbônica, no rótulo). */
export const CA_POINT: Vec3 = [1.6, CAP_Y - 0.55, CAP_Z + 0.55];
