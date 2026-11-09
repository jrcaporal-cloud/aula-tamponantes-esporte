import * as THREE from 'three';
import { phase } from '../shared/math';
import { RING_CENTER } from './molecule';
import { randoms } from './common';

/*
 * Moléculas livres em volta da CARNS1 (etapa 4): muita histidina, pouca β-alanina. A trajetória é
 * pura (índice + tempo), para o rótulo da β-alanina poder seguir a mesma molécula que a cena desenha.
 */

export const POOL_HIS = 22;
export const POOL_BA = 3;
const SEEDS = Array.from({ length: POOL_HIS + POOL_BA }, (_, k) => randoms(900 + k, 5));

/** Posição (referencial da estação) da molécula `k` no instante `t`; k ≥ POOL_HIS = β-alanina. */
export const poolHome = (k: number, t: number, out: THREE.Vector3) => {
    const q = SEEDS[k];
    const a = q[0] * Math.PI * 2 + t * (0.05 + q[3] * 0.05);
    const rad = 4.6 + q[1] * 3.2;
    return out.set(Math.cos(a) * rad, -3.2 + q[2] * 7 + Math.sin(t * 0.4 + k) * 0.3, -3.5 + Math.sin(a) * 3 + q[4] * 2);
};

/* Coreografia da molécula-herói (laço de 9 s): as duas metades chegam, a ligação se forma, a carnosina sobe. */
export const HERO_LOOP = 9;
export const HERO_S = 0.62;
const SITE = new THREE.Vector3(0, 0.1, 2.3);
const OUT = new THREE.Vector3(0, 4.1, 1.6);

export interface HeroFrame { u: number; come: number; rise: number; center: THREE.Vector3 }

/** Quadro de rascunho reaproveitado (chamado a cada quadro pela cena e pelos rótulos): use na hora, não guarde. */
const FRAME: HeroFrame = { u: 0, come: 0, rise: 0, center: new THREE.Vector3() };

/** Fase do laço no instante `sec`; `center` = onde a molécula montada está (referencial da estação). */
export const heroFrame = (sec: number, center: THREE.Vector3): HeroFrame => {
    const u = (sec % HERO_LOOP) / HERO_LOOP;
    const rise = phase(u, 0.44, 0.62);
    FRAME.u = u;
    FRAME.come = phase(u, 0.04, 0.32);
    FRAME.rise = rise;
    FRAME.center = center.copy(SITE).lerp(OUT, rise);
    return FRAME;
};

/** Posição da metade β-alanina e da metade histidina, a partir do quadro do herói. */
export const baPart = (f: HeroFrame, out: THREE.Vector3) => out.set(f.center.x - (1 - f.come) * 6.5, f.center.y + (1 - f.come) * 1.8, f.center.z);
export const hisPart = (f: HeroFrame, out: THREE.Vector3) => out.set(f.center.x + (1 - f.come) * 6.5, f.center.y - (1 - f.come) * 1.4, f.center.z);
/** Centro do anel imidazol do herói (para o rótulo acompanhar). */
export const heroRing = (sec: number, out: THREE.Vector3) => {
    const f = heroFrame(sec, out);
    return hisPart(f, out).addScaledVector(RING_CENTER, HERO_S);
};
const BA_LABEL_OFFSET = new THREE.Vector3(-1.6 * HERO_S, 0.6 * HERO_S, 0);
/** Ponto da metade β-alanina do herói (para o rótulo "Carnosina"). */
export const heroBa = (sec: number, out: THREE.Vector3) => {
    const f = heroFrame(sec, out);
    return baPart(f, out).add(BA_LABEL_OFFSET);
};
