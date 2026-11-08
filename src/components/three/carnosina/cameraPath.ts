import * as THREE from 'three';
import type { Vec3 } from './layout';
import type { CarnoStep } from './steps';

/*
 * Trilha da câmera: uma pose-chave por etapa (em T = k) e, se houver, a intermediária (em T = k − 0,5).
 * Os voos de fixar/recentrar usam a mesma spline com dois pontos e um arco no meio.
 */

export interface CameraPath {
    pos: (T: number, out: THREE.Vector3) => THREE.Vector3;
    tgt: (T: number, out: THREE.Vector3) => THREE.Vector3;
}

export interface Pose { pos: Vec3; tgt: Vec3 }

interface Key { t: number; p: THREE.Vector3; q: THREE.Vector3 }

const v3 = (a: Vec3) => new THREE.Vector3(a[0], a[1], a[2]);

const pathOf = (keys: Key[]): CameraPath => {
    const last = keys[keys.length - 1].t;
    const first = keys[0].t;
    const pos = new THREE.CatmullRomCurve3(keys.map(k => k.p), false, 'centripetal');
    const tgt = new THREE.CatmullRomCurve3(keys.map(k => k.q), false, 'centripetal');
    const n = keys.length - 1;
    const u = (T: number) => {
        const x = Math.min(Math.max(T, first), last);
        let i = 0;
        while (i < n - 1 && keys[i + 1].t < x) i++;
        const span = keys[i + 1].t - keys[i].t || 1;
        return Math.min((i + (x - keys[i].t) / span) / n, 1);
    };
    return {
        pos: (T, out) => pos.getPoint(u(T), out),
        tgt: (T, out) => tgt.getPoint(u(T), out),
    };
};

export const buildStepPath = (steps: readonly CarnoStep[]): CameraPath => {
    const keys: Key[] = [];
    steps.forEach((s, k) => {
        if (s.via && k > 0) keys.push({ t: k - 0.5, p: v3(s.via.pos), q: v3(s.via.tgt) });
        keys.push({ t: k, p: v3(s.cam.pos), q: v3(s.cam.tgt) });
    });
    return pathOf(keys);
};

/** Voo curto de uma pose a outra (T de 0 a 1), com um arco que recua ~12% do deslocamento. */
export const flightPath = (from: Pose, to: Pose): CameraPath => {
    const a = v3(from.pos);
    const b = v3(to.pos);
    const ta = v3(from.tgt);
    const tb = v3(to.tgt);
    const midT = ta.clone().lerp(tb, 0.5);
    const midP = a.clone().lerp(b, 0.5);
    const away = midP.clone().sub(midT).normalize().multiplyScalar(0.12 * a.distanceTo(b));
    midP.add(away).add(new THREE.Vector3(0, away.length() * 0.35, 0));
    return pathOf([
        { t: 0, p: a, q: ta },
        { t: 0.5, p: midP, q: midT },
        { t: 1, p: b, q: tb },
    ]);
};
