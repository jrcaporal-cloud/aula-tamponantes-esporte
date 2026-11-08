import * as THREE from 'three';
import type { Pose, Vec3 } from './content';

/*
 * Trilhas de câmera: uma pose por etapa em T = k (spline centrípeta), e voos curtos de dois pontos
 * (fixar uma estrutura, recentrar) com um ponto intermediário que abre um arco leve.
 */

export interface CameraPath {
    pos: (T: number, out: THREE.Vector3) => THREE.Vector3;
    tgt: (T: number, out: THREE.Vector3) => THREE.Vector3;
}

const v3 = (a: Vec3) => new THREE.Vector3(a[0], a[1], a[2]);

/** Trilha com chaves em T = 0, 1, 2…; T fora da faixa fica preso nas pontas. */
export const buildCameraPath = (poses: readonly Pose[]): CameraPath => {
    const last = poses.length - 1;
    const pos = new THREE.CatmullRomCurve3(poses.map(p => v3(p.pos)), false, 'centripetal');
    const tgt = new THREE.CatmullRomCurve3(poses.map(p => v3(p.tgt)), false, 'centripetal');
    // u da spline: chaves igualmente espaçadas no parâmetro (getPoint, não getPointAt)
    const u = (T: number) => Math.min(Math.max(T, 0), last) / last;
    return {
        pos: (T, out) => pos.getPoint(u(T), out),
        tgt: (T, out) => tgt.getPoint(u(T), out),
    };
};

const avg = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

/** Ponto do meio do voo: afastado do alvo (~12 % do deslocamento) e um pouco acima. */
const midPose = (from: Pose, to: Pose): Pose => {
    const tgt = avg(from.tgt, to.tgt);
    const pos = avg(from.pos, to.pos);
    const away = [pos[0] - tgt[0], pos[1] - tgt[1], pos[2] - tgt[2]];
    const len = Math.hypot(away[0], away[1], away[2]) || 1;
    const lift = 0.12 * Math.hypot(from.pos[0] - to.pos[0], from.pos[1] - to.pos[1], from.pos[2] - to.pos[2]);
    return {
        pos: [pos[0] + (away[0] / len) * lift, pos[1] + (away[1] / len) * lift + lift * 0.35, pos[2] + (away[2] / len) * lift],
        tgt,
    };
};

/** Voo de `from` a `to`, com T de 0 a 1. */
export const flightPath = (from: Pose, to: Pose): CameraPath => {
    const poses = [from, midPose(from, to), to];
    const pos = new THREE.CatmullRomCurve3(poses.map(p => v3(p.pos)), false, 'centripetal');
    const tgt = new THREE.CatmullRomCurve3(poses.map(p => v3(p.tgt)), false, 'centripetal');
    return {
        pos: (T, out) => pos.getPoint(Math.min(Math.max(T, 0), 1), out),
        tgt: (T, out) => tgt.getPoint(Math.min(Math.max(T, 0), 1), out),
    };
};
