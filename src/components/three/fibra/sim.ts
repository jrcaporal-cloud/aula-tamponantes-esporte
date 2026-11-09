import { rng } from '../shared/math';
import { BUFFER_SITES, CARNO_BASE, CARNO_LOADED, type BufferKind } from './layout';
import { advance, END_CO2, END_HB, makePool, type Pool, type PoolEvents } from './pool';
import { bufferRoute, co2Route, exportRoute, freeRoute, hbRoute, nbcRoute, type Rand } from './routes';

/*
 * A simulação didática: taxas de nascimento de H⁺ e destinos sorteados conforme a etapa e os
 * interruptores. Probabilidades e pH são ILUSTRATIVOS (chip na tela); as âncoras do medidor vêm do
 * dossiê 03: músculo 7,08 → 6,60 (SAHLIN1976), sangue 7,42 → 7,07 (NIELSEN2002).
 */

export interface SimCtrl {
    stage: number;
    intensity: number;
    bic: boolean;
    ba: boolean;
    reduced: boolean;
}

export interface Meter {
    load: number;
    bicLevel: number;
    baLevel: number;
    pHi: number;
    pHe: number;
    /** Saída relativa de H⁺/lactato (0–1), ilustrativa. */
    efflux: number;
}

export interface Sim {
    h: Pool;
    lac: Pool;
    na: Pool;
    bic: Pool;
    co2: Pool;
    acc: { h: number; nbc: number };
    /** Momento (s) do último H⁺ capturado em cada sítio de tampão, para o lampejo. */
    siteHit: Float32Array;
    clock: number;
    meter: Meter;
    rand: Rand;
    /** Callbacks dos reservatórios, criados uma vez (nada de closure nova por quadro). */
    readonly ev: { readonly h: PoolEvents; readonly bic: PoolEvents; readonly none: PoolEvents };
}

export const SITE_KINDS: readonly BufferKind[] = ['proteina', 'fosfato', 'carnosina', 'ck'];
export const SITE_OFFSET: Readonly<Record<BufferKind, number>> = (() => {
    let o = 0;
    const out = {} as Record<BufferKind, number>;
    for (const k of SITE_KINDS) { out[k] = o; o += BUFFER_SITES[k].length; }
    return out;
})();
const SITE_TOTAL = SITE_KINDS.reduce((s, k) => s + BUFFER_SITES[k].length, 0);

/** Tamanho de cada reservatório (as malhas instanciadas são criadas com estes tamanhos). */
export const POOL_SIZES = { h: 320, lac: 300, na: 90, bic: 50, co2: 200 } as const;

/** Ponto final reaproveitado ao encadear rotas (spawn copia os valores, então pode ser sobrescrito). */
const END_P: [number, number, number] = [0, 0, 0];

export const createSim = (): Sim => {
    // as callbacks leem `sim` só quando chamadas (depois da criação); o relógio já avançou antes de
    // advance(), então sim.clock é o instante do quadro
    const onHold = (site: number) => { sim.siteHit[site] = sim.clock; };
    const onEnd = (x: number, y: number, z: number, end: number) => {
        END_P[0] = x;
        END_P[1] = y;
        END_P[2] = z;
        if (end === END_CO2) co2Route(sim, END_P);
        else if (end === END_HB) hbRoute(sim, END_P);
    };
    const sim: Sim = {
        h: makePool(POOL_SIZES.h),
        lac: makePool(POOL_SIZES.lac),
        na: makePool(POOL_SIZES.na),
        bic: makePool(POOL_SIZES.bic),
        co2: makePool(POOL_SIZES.co2),
        acc: { h: 0, nbc: 0 },
        siteHit: new Float32Array(SITE_TOTAL).fill(-99),
        clock: 0,
        meter: { load: 0, bicLevel: 0, baLevel: 0, pHi: 7.08, pHe: 7.42, efflux: 0 },
        rand: rng(2026),
        ev: { h: { onHold, onEnd }, bic: { onHold }, none: {} },
    };
    return sim;
};

/** H⁺ por segundo a 100% de intensidade. */
const H_RATE = 24;

/** Destinos do H⁺ por etapa (ilustrativo). A carnosina recebe ~7% do que é tamponado (MANNION1992). */
const bufferedShare = (c: SimCtrl) => (c.stage >= 2 ? (c.stage >= 3 ? 0.4 : 0.5) + (c.ba ? 0.04 : 0) : 0);
const exportShare = (c: SimCtrl) => (c.stage >= 3 ? (c.bic ? 0.52 : 0.28) : 0);
export const carnoShare = (ba: boolean): number => (ba ? 0.11 : 0.07);

/** Sítio sorteado (reaproveitado a cada nascimento; lido logo em seguida). */
const PICK: { kind: BufferKind; index: number } = { kind: 'proteina', index: 0 };

const pickSite = (r: Rand, ba: boolean): typeof PICK => {
    const x = r();
    const cs = carnoShare(ba);
    if (x < cs) {
        const lit = ba ? CARNO_LOADED : CARNO_BASE;
        PICK.kind = 'carnosina';
        PICK.index = Math.floor(r() * lit);
        return PICK;
    }
    const y = (x - cs) / (1 - cs);
    const kind: BufferKind = y < 0.5 ? 'proteina' : y < 0.78 ? 'fosfato' : 'ck';
    PICK.kind = kind;
    PICK.index = Math.floor(r() * BUFFER_SITES[kind].length);
    return PICK;
};

const birth = (sim: Sim, c: SimCtrl) => {
    const r = sim.rand;
    const buf = bufferedShare(c);
    const exp = exportShare(c);
    const x = r();
    if (x < buf) {
        const { kind, index } = pickSite(r, c.ba);
        bufferRoute(sim, BUFFER_SITES[kind][index].p, SITE_OFFSET[kind] + index);
        freeRoute(sim.lac, r);
    } else if (x < buf + exp) {
        exportRoute(sim, c.stage >= 4, c.bic);
    } else {
        freeRoute(sim.h, r);
        freeRoute(sim.lac, r);
    }
};

const relax = (v: number, target: number, dt: number, tau: number) => v + (target - v) * (1 - Math.exp(-dt / tau));

const updateMeter = (m: Meter, c: SimCtrl, dt: number) => {
    m.load = relax(m.load, Math.pow(c.intensity, 1.25), dt, 1.4);
    m.bicLevel = relax(m.bicLevel, c.bic ? 1 : 0, dt, 1.1);
    m.baLevel = relax(m.baLevel, c.ba ? 1 : 0, dt, 1.1);
    // âncoras do dossiê 03; o resto da curva é ilustrativo
    m.pHi = 7.08 - 0.48 * m.load * (1 - 0.12 * m.bicLevel - 0.05 * m.baLevel);
    m.pHe = 7.42 + 0.08 * m.bicLevel - 0.35 * m.load * (1 - 0.12 * m.bicLevel);
    const exp = c.stage >= 3 ? 0.28 + 0.24 * m.bicLevel : 0;
    m.efflux = relax(m.efflux, (c.intensity * exp) / 0.52, dt, 0.8);
};

/** Um passo da simulação (dt em segundos). */
export const stepSim = (sim: Sim, c: SimCtrl, rawDt: number): void => {
    const dt = Math.min(rawDt, 0.05) * (c.reduced ? 0.5 : 1);
    sim.clock += dt;
    updateMeter(sim.meter, c, dt);
    if (c.stage >= 1 && c.intensity > 0.01) {
        sim.acc.h += c.intensity * H_RATE * dt;
        while (sim.acc.h >= 1) { sim.acc.h -= 1; birth(sim, c); }
    }
    if (c.stage >= 3 && c.intensity > 0.01) {
        sim.acc.nbc += c.intensity * (c.bic ? 2.6 : 1.4) * dt;
        while (sim.acc.nbc >= 1) { sim.acc.nbc -= 1; nbcRoute(sim, c.bic); }
    }
    const t = sim.clock;
    advance(sim.h, dt, t, sim.ev.h);
    advance(sim.lac, dt, t, sim.ev.none);
    advance(sim.na, dt, t, sim.ev.none);
    advance(sim.bic, dt, t, sim.ev.bic);
    advance(sim.co2, dt, t, sim.ev.none);
};
