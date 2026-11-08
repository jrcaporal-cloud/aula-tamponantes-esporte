import {
    CAP_HALF, CAP_Y, CAP_Z, FLOW_SPEED, FIBER_HALF, PLASMA_R, PORT_X,
    plasmaPoint, portInner, portOut, portOuter, sarcoPoint,
} from './layout';
import { END_CO2, END_HB, spawn, type P3, type Pool } from './pool';
import type { Sim } from './sim';

/*
 * Rotas de cada destino (pontos + duração + tremor por trecho). O tremor é zero ao cruzar o poro.
 * Com bicarbonato, a travessia fica mais rápida: o gradiente maior puxa o ácido para fora.
 */

export type Rand = () => number;

const nudge = (p: P3, r: Rand, a: number): P3 => [p[0] + (r() * 2 - 1) * a, p[1] + (r() * 2 - 1) * a, p[2] + (r() * 2 - 1) * a];
const clampX = (x: number) => Math.max(-FIBER_HALF + 0.8, Math.min(FIBER_HALF - 0.8, x));

/** Nasce no sarcoplasma e fica vagando até sumir (H⁺ livre ou lactato que não saiu). */
export const freeRoute = (pool: Pool, r: Rand): void => {
    const s = sarcoPoint(r);
    spawn(pool, [s, nudge(s, r, 0.7), nudge(s, r, 0.9)], [2 + r(), 2.2 + r()], [0.22, 0.22]);
};

/** Capturado por um tampão: vai ao sítio e fica preso, encolhendo. */
export const bufferRoute = (sim: Sim, site: P3, siteIndex: number): void => {
    const r = sim.rand;
    const s = nudge(site, r, 1.6);
    const mid = nudge([(s[0] + site[0]) / 2, (s[1] + site[1]) / 2, (s[2] + site[2]) / 2], r, 0.3);
    spawn(sim.h, [s, mid, site, site], [0.9 + r() * 0.6, 0.8, 2.4], [0.22, 0.06, 0.02], { hold: 2, site: siteIndex });
};

const startNear = (x: number, r: Rand): P3 => {
    const s = sarcoPoint(r);
    return [clampX(x + (r() * 2 - 1) * 2.4), s[1], s[2]];
};

/** Entrada no plasma e ponto da reação com o HCO₃⁻, logo acima da porta. */
const bloodPoints = (x: number, r: Rand): [P3, P3] => [
    [x + 0.3 + r() * 0.4, CAP_Y - PLASMA_R * 0.92, CAP_Z + 0.3 + r() * 0.2],
    plasmaPoint(x + 0.9 + r() * 0.8, r, 0.55),
];

/** H⁺ exportado (MCT com lactato junto, ou NHE1 com Na⁺ entrando). */
export const exportRoute = (sim: Sim, blood: boolean, bic: boolean): void => {
    const r = sim.rand;
    const sp = bic ? 0.72 : 1;
    const mct = r() < 0.62;
    const xs = mct ? (r() < 0.5 ? PORT_X.mct4 : PORT_X.mct1) : PORT_X.nhe1;
    const x = xs[Math.floor(r() * xs.length)];
    const s = startNear(x, r);
    const inner = portInner(x);
    const approach = nudge(inner, r, 0.35);
    const outer = portOuter(x);
    const out = portOut(x, r() * 0.25);
    const [entry, react] = bloodPoints(x, r);
    const head: P3[] = [s, approach, inner, outer, out];
    const headDur = [1.3 * sp, 0.7 * sp, 0.4 * sp, 0.5 * sp];
    const headJit = [0.28, 0.08, 0, 0];
    if (blood) {
        spawn(sim.h, [...head, entry, react], [...headDur, 0.7 * sp, 0.6], [...headJit, 0.08, 0.05], { end: r() < 0.75 ? END_CO2 : END_HB });
    } else {
        spawn(sim.h, [...head, [out[0], out[1] + 0.8, out[2] + 0.4]], [...headDur, 1.4], [...headJit, 0.15]);
    }
    if (mct) {
        // o lactato atravessa junto, pelo mesmo poro; no sangue, segue a corrente
        const lag = (p: P3): P3 => [p[0] + 0.14, p[1], p[2] + 0.06];
        const lh = head.map(lag);
        const ld = [headDur[0] + 0.15, ...headDur.slice(1)];
        if (blood) {
            const down: P3 = [CAP_HALF - 0.3, entry[1] + 0.35, entry[2] - 0.2];
            spawn(sim.lac, [...lh, lag(entry), down], [...ld, 0.75 * sp, (CAP_HALF - x) / FLOW_SPEED], [...headJit, 0.08, 0.06]);
        } else {
            spawn(sim.lac, [...lh, [out[0] + 0.2, out[1] + 0.9, out[2] + 0.3]], [...ld, 1.4], [...headJit, 0.15]);
        }
    } else {
        // Na⁺ entra pela mesma troca, enquanto o H⁺ sai
        const nx = x + 0.22;
        const wait = Math.max((1.3 + 0.7) * sp - 0.6, 0.2);
        const no = portOut(nx, 0.2);
        spawn(sim.na, [no, no, portOuter(nx), portInner(nx), nudge(portInner(nx), r, 0.9)], [wait, 0.6, 0.4, 1.3], [0.05, 0.04, 0, 0.12]);
    }
};

/** NBC: Na⁺ + HCO₃⁻ entram juntos e o HCO₃⁻ some lá dentro (tamponou um H⁺). */
export const nbcRoute = (sim: Sim, bic: boolean): void => {
    const r = sim.rand;
    const x = PORT_X.nbc[0];
    const sp = bic ? 0.75 : 1;
    const mk = (dx: number): P3[] => {
        const o = portOut(x + dx, 0.15 + r() * 0.2);
        return [nudge(o, r, 0.25), portOuter(x + dx), portInner(x + dx), nudge(portInner(x + dx), r, 0.8)];
    };
    const d = [1.1 * sp, 0.45 * sp, 1.4];
    spawn(sim.na, mk(-0.16), d, [0.1, 0, 0.12]);
    spawn(sim.bic, mk(0.16), d, [0.1, 0, 0.12]);
};

/** CO₂ formado no plasma: segue a corrente até a saída do capilar (rumo ao pulmão). */
export const co2Route = (sim: Sim, p: P3): void => {
    const end: P3 = [CAP_HALF, p[1] + (sim.rand() - 0.5) * 0.3, p[2]];
    spawn(sim.co2, [p, end], [Math.max((CAP_HALF - p[0]) / FLOW_SPEED, 0.4)], [0.06]);
};

/** H⁺ que a hemoglobina pega: viaja com a hemácia, encolhendo. */
export const hbRoute = (sim: Sim, p: P3): void => {
    const end: P3 = [Math.min(p[0] + 2.6, CAP_HALF), p[1], p[2]];
    spawn(sim.h, [p, end], [1.7], [0.02], { hold: 0 });
};
