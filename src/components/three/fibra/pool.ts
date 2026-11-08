/*
 * Reservatório de partículas com rota. Cada partícula percorre uma lista curta de pontos (até MAX_WP),
 * um trecho por vez, com tremor browniano opcional por trecho (zero ao atravessar uma porta, para o
 * íon passar exatamente pelo poro). Tudo em arrays tipados pré-alocados; nada de estado do React.
 */

export const MAX_WP = 7;
const MAX_SEG = MAX_WP - 1;

/** O que acontece quando a rota termina. */
export const END_FADE = 0;
export const END_CO2 = 1;
export const END_HB = 2;
export type EndAction = typeof END_FADE | typeof END_CO2 | typeof END_HB;

export interface Pool {
    readonly n: number;
    alive: Uint8Array;
    wp: Float32Array;
    dur: Float32Array;
    jit: Float32Array;
    nseg: Uint8Array;
    seg: Uint8Array;
    t: Float32Array;
    age: Float32Array;
    phase: Float32Array;
    end: Uint8Array;
    /** A partir deste trecho a partícula está "presa" (num tampão, na hemoglobina): encolhe e some. */
    hold: Uint8Array;
    site: Int16Array;
    pos: Float32Array;
    scale: Float32Array;
    cursor: number;
}

export const makePool = (n: number): Pool => ({
    n,
    alive: new Uint8Array(n),
    wp: new Float32Array(n * MAX_WP * 3),
    dur: new Float32Array(n * MAX_SEG),
    jit: new Float32Array(n * MAX_SEG),
    nseg: new Uint8Array(n),
    seg: new Uint8Array(n),
    t: new Float32Array(n),
    age: new Float32Array(n),
    phase: new Float32Array(n),
    end: new Uint8Array(n),
    hold: new Uint8Array(n).fill(255),
    site: new Int16Array(n).fill(-1),
    pos: new Float32Array(n * 3),
    scale: new Float32Array(n),
    cursor: 0,
});

export type P3 = readonly [number, number, number];

export interface RouteOpts {
    end?: EndAction;
    hold?: number;
    site?: number;
}

/** Lança uma partícula numa rota. Sem vaga livre, a rota é descartada (o fluxo só fica mais ralo). */
export const spawn = (pool: Pool, pts: readonly P3[], durs: readonly number[], jit: readonly number[], opts: RouteOpts = {}): boolean => {
    const segs = Math.min(pts.length - 1, MAX_SEG);
    if (segs < 1) return false;
    let i = -1;
    for (let k = 0; k < pool.n; k++) {
        const c = (pool.cursor + k) % pool.n;
        if (!pool.alive[c]) { i = c; break; }
    }
    if (i < 0) return false;
    pool.cursor = (i + 1) % pool.n;
    for (let s = 0; s <= segs; s++) {
        const o = (i * MAX_WP + s) * 3;
        pool.wp[o] = pts[s][0];
        pool.wp[o + 1] = pts[s][1];
        pool.wp[o + 2] = pts[s][2];
    }
    for (let s = 0; s < segs; s++) {
        pool.dur[i * MAX_SEG + s] = Math.max(durs[s] ?? 1, 0.05);
        pool.jit[i * MAX_SEG + s] = jit[s] ?? 0;
    }
    pool.alive[i] = 1;
    pool.nseg[i] = segs;
    pool.seg[i] = 0;
    pool.t[i] = 0;
    pool.age[i] = 0;
    pool.phase[i] = (i * 2.3999) % 6.283;
    pool.end[i] = opts.end ?? END_FADE;
    pool.hold[i] = opts.hold ?? 255;
    pool.site[i] = opts.site ?? -1;
    return true;
};

const ease = (x: number) => x * x * (3 - 2 * x);
const FADE_IN = 0.3;
const FADE_OUT = 0.45;

/** Chamado quando uma partícula chega a um trecho "preso" (sítio de tampão) ou termina a rota. */
export interface PoolEvents {
    onHold?: (site: number) => void;
    onEnd?: (x: number, y: number, z: number, end: number) => void;
}

/** Avança todas as partículas vivas e escreve posição e escala de saída. */
export const advance = (pool: Pool, dt: number, clock: number, ev: PoolEvents): void => {
    for (let i = 0; i < pool.n; i++) {
        if (!pool.alive[i]) { pool.scale[i] = 0; continue; }
        pool.age[i] += dt;
        let seg = pool.seg[i];
        let t = pool.t[i] + dt;
        const base = i * MAX_SEG;
        while (t >= pool.dur[base + seg]) {
            t -= pool.dur[base + seg];
            seg += 1;
            if (seg === pool.hold[i] && pool.site[i] >= 0) ev.onHold?.(pool.site[i]);
            if (seg >= pool.nseg[i]) break;
        }
        if (seg >= pool.nseg[i]) {
            const o = (i * MAX_WP + pool.nseg[i]) * 3;
            ev.onEnd?.(pool.wp[o], pool.wp[o + 1], pool.wp[o + 2], pool.end[i]);
            pool.alive[i] = 0;
            pool.scale[i] = 0;
            continue;
        }
        pool.seg[i] = seg;
        pool.t[i] = t;
        const d = pool.dur[base + seg];
        const k = ease(t / d);
        const a = (i * MAX_WP + seg) * 3;
        const b = a + 3;
        const j = pool.jit[base + seg] * Math.sin(Math.PI * (t / d)) + (pool.hold[i] <= seg ? 0.02 : 0);
        const ph = pool.phase[i];
        const o = i * 3;
        pool.pos[o] = pool.wp[a] + (pool.wp[b] - pool.wp[a]) * k + j * Math.sin(clock * 1.7 + ph * 3.1);
        pool.pos[o + 1] = pool.wp[a + 1] + (pool.wp[b + 1] - pool.wp[a + 1]) * k + j * Math.sin(clock * 1.3 + ph * 1.7);
        pool.pos[o + 2] = pool.wp[a + 2] + (pool.wp[b + 2] - pool.wp[a + 2]) * k + j * Math.cos(clock * 1.5 + ph * 2.3);
        // entra em fade, some no fim da rota; preso, encolhe até 45%
        const last = seg === pool.nseg[i] - 1;
        const fin = last ? Math.min((d - t) / FADE_OUT, 1) : 1;
        const held = pool.hold[i] <= seg ? 1 - 0.55 * Math.min(t / d, 1) : 1;
        pool.scale[i] = Math.min(pool.age[i] / FADE_IN, 1) * fin * held;
    }
};

export const aliveCount = (pool: Pool): number => {
    let c = 0;
    for (let i = 0; i < pool.n; i++) c += pool.alive[i];
    return c;
};
