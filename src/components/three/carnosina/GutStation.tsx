import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { lerp, smooth } from '../shared/math';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { STATION, stationX } from './layout';
import { useStructure } from './useStructure';

/*
 * Etapa 1 — intestino: vilosidades num piso de epitélio, a luz intestinal acima e um capilar ao lado.
 * A β-alanina (violeta) desce da luz até a ponta da vilosidade, atravessa por dentro dela e segue
 * pelo capilar. Cada partícula percorre o mesmo laço com fase própria.
 */

const I = STATION.gut;
const VILLI: [number, number][] = [];
for (let ix = 0; ix < 6; ix++) for (let iz = 0; iz < 5; iz++) VILLI.push([-7.2 + ix * 1.65, -3.6 + iz * 1.8]);
const VILLUS_H = 4.2;
const BASE_Y = -3.6;
const TIP_Y = BASE_Y + VILLUS_H + 0.6;
const CAP_X = 4.6;
const CAP_Y = -2.6;
const N = 64;

const Villi = () => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('vilosidade');
    const geo = useMemo(() => new THREE.CapsuleGeometry(0.58, VILLUS_H, 6, 14), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b48aa0', roughness: 0.55, emissive: '#4a2338', emissiveIntensity: 0.5, transparent: true, opacity: 0.82 }), []);
    useLayoutEffect(() => {
        const m = ref.current;
        if (!m) return;
        const jit = randoms(11, VILLI.length);
        VILLI.forEach(([x, z], k) => putInstance(m, k, x + (jit[k] - 0.5) * 0.3, BASE_Y + VILLUS_H / 2 + 0.3, z, 1, (jit[k] - 0.5) * 0.12, 0, (jit[(k + 3) % VILLI.length] - 0.5) * 0.12));
        m.instanceMatrix.needsUpdate = true;
    }, []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.3 : 0.5 }); }, [lit, mat]);
    return <instancedMesh ref={ref} args={[geo, mat, VILLI.length]} {...bind} />;
};

const Capillary = () => {
    const { bind, lit } = useStructure('capilar');
    return (
        <mesh position={[CAP_X, CAP_Y, 0]} rotation={[Math.PI / 2, 0, 0]} {...bind}>
            <cylinderGeometry args={[1.15, 1.15, 13, 28, 1, true]} />
            <meshStandardMaterial color="#be123c" emissive="#7f1d1d" emissiveIntensity={lit ? 1.4 : 0.55} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
    );
};

/** Trajetória de uma partícula: luz → ponta da vilosidade → base → capilar → ao longo do capilar. */
const pathAt = (u: number, k: number, r: readonly number[], out: THREE.Vector3) => {
    const [vx, vz] = VILLI[k % VILLI.length];
    const sx = -8 + r[0] * 9;
    const sy = 3.2 + r[1] * 3;
    const sz = -4 + r[2] * 8;
    if (u < 0.36) {
        const s = smooth(u / 0.36);
        return out.set(lerp(sx, vx, s), lerp(sy, TIP_Y, s), lerp(sz, vz, s));
    }
    if (u < 0.56) return out.set(vx, lerp(TIP_Y, BASE_Y - 0.2, smooth((u - 0.36) / 0.2)), vz);
    if (u < 0.74) {
        const s = smooth((u - 0.56) / 0.18);
        return out.set(lerp(vx, CAP_X, s), lerp(BASE_Y - 0.2, CAP_Y, s), lerp(vz, vz * 0.3, s));
    }
    const s = (u - 0.74) / 0.26;
    return out.set(CAP_X + Math.sin(s * 9 + k) * 0.35, CAP_Y + Math.cos(s * 7 + k) * 0.35, lerp(vz * 0.3, 7, s));
};

const BetaAlanine = ({ timeRef }: { timeRef: TimeBox }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind } = useStructure('bala');
    const geo = useMemo(() => new THREE.SphereGeometry(0.2, 12, 10), []);
    const mat = useMemo(() => glowMaterial(C.carno, 1.7), []);
    const seeds = useMemo(() => Array.from({ length: N }, (_, k) => randoms(100 + k, 4)), []);
    const p = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        const m = ref.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < N; k++) {
            const u = frac(t / 11 + k / N + seeds[k][3] * 0.02);
            pathAt(u, k * 7, seeds[k], p);
            const fade = Math.min(u / 0.05, (1 - u) / 0.05, 1);
            putInstance(m, k, p.x, p.y, p.z, fade);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={ref} args={[geo, mat, N]} frustumCulled={false} {...bind} />;
};

export const GutStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { if (g.current) g.current.visible = stationWeight(timeRef.current.t, I) > 0; });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <mesh position={[-1.5, BASE_Y - 0.6, 0]}>
                <boxGeometry args={[14, 1.2, 10.5]} />
                <meshStandardMaterial color="#5b3448" roughness={0.8} emissive="#2a1020" emissiveIntensity={0.4} />
            </mesh>
            <Villi />
            <Capillary />
            <BetaAlanine timeRef={timeRef} />
        </group>
    );
};
