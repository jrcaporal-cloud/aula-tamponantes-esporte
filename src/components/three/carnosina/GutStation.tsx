import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { lerp, smooth } from '../shared/math';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { flushGlow, putGlow, tissueMaterial, withRim } from './fx';
import { STATION, stationX } from './layout';
import { redCellGeometry, villusGeometry, wobble } from './shapes';
import { useGlowMesh } from './useGlow';
import { useStructure } from './useStructure';

/*
 * Etapa 1 — intestino: vilosidades num piso de mucosa ondulado, a luz intestinal acima e um capilar ao
 * lado (com hemácias correndo). A β-alanina (violeta, com brilho e rastro) desce da luz até a ponta da
 * vilosidade, atravessa por dentro dela (o vaso central acende) e segue pelo capilar. Cada partícula
 * percorre o mesmo laço com fase própria.
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
const TRAIL = 3;
const TRAIL_DU = 0.0065;
const NMOTE = 46;
const NRBC = 12;
const CAP_LEN = 13;

const JIT = randoms(11, VILLI.length);
/** Base de cada vilosidade (com o mesmo tremor que a malha usa). */
const villusBase = (k: number) => [VILLI[k][0] + (JIT[k] - 0.5) * 0.3, VILLI[k][1]] as const;

const Villi = () => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const cores = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('vilosidade');
    const geo = useMemo(() => villusGeometry(VILLUS_H + 0.9, 2), []);
    const mat = useMemo(() => withRim(tissueMaterial('#c78fa8', '#ffd1e3', '#4a2338', { transparent: true, opacity: 0.8, depthWrite: false }), '#f9a8d4', 2.2, 0.55), []);
    const coreGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.16, VILLUS_H + 0.2, 8, 1), []);
    const coreMat = useMemo(() => glowMaterial('#e11d48', 0.85), []);
    useLayoutEffect(() => {
        const m = ref.current;
        const c = cores.current;
        if (!m || !c) return;
        VILLI.forEach((_, k) => {
            const [x, z] = villusBase(k);
            const rx = (JIT[k] - 0.5) * 0.12;
            const rz = (JIT[(k + 3) % VILLI.length] - 0.5) * 0.12;
            putInstance(m, k, x, BASE_Y - 0.3, z, 1, rx, JIT[k] * 6, rz);
            putInstance(c, k, x, BASE_Y + VILLUS_H / 2, z, 1, rx, 0, rz);
        });
        m.instanceMatrix.needsUpdate = true;
        c.instanceMatrix.needsUpdate = true;
    }, []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.1 : 0.35 }); }, [lit, mat]);
    return (
        <group>
            <instancedMesh ref={cores} args={[coreGeo, coreMat, VILLI.length]} />
            <instancedMesh ref={ref} args={[geo, mat, VILLI.length]} renderOrder={2} {...bind} />
        </group>
    );
};

/** Piso da mucosa: superfície ondulada (criptas entre as vilosidades) que cai nas bordas. */
const Mucosa = () => {
    const geo = useMemo(() => {
        const g = new THREE.PlaneGeometry(15, 11.5, 96, 72);
        g.rotateX(-Math.PI / 2);
        const pos = g.getAttribute('position');
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const ex = Math.max(Math.abs(x) - 6, 0) / 1.5;
            const ez = Math.max(Math.abs(z) - 4.5, 0) / 1.25;
            const edge = Math.min(ex * ex + ez * ez, 1);
            const crypt = Math.cos((x + 1.5) * 3.8) * Math.cos(z * 3.5) * 0.12;
            pos.setY(i, crypt + wobble(x, 0, z, 4) * 0.12 - edge * 1.6);
        }
        g.computeVertexNormals();
        return g;
    }, []);
    const mat = useMemo(() => tissueMaterial('#7a4560', '#f0abc6', '#2a1020'), []);
    return <mesh geometry={geo} material={mat} position={[-1.5, BASE_Y - 0.15, 0]} />;
};

const Capillary = ({ timeRef }: { timeRef: TimeBox }) => {
    const { bind, lit } = useStructure('capilar');
    const cells = useRef<THREE.InstancedMesh>(null);
    const mat = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({
        color: '#be123c', emissive: '#7f1d1d', emissiveIntensity: 0.4, roughness: 0.35, clearcoat: 0.6,
        transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false,
    }), '#fb7185', 2.0, 0.9), []);
    const rbcGeo = useMemo(() => redCellGeometry(18), []);
    const rbcMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#dc2626', emissive: '#7f1d1d', emissiveIntensity: 0.35, roughness: 0.4, clearcoat: 0.5 }), []);
    const seeds = useMemo(() => Array.from({ length: NRBC }, (_, k) => randoms(140 + k, 3)), []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.3 : 0.4 }); }, [lit, mat]);
    useFrame(({ clock }) => {
        const m = cells.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < NRBC; k++) {
            const q = seeds[k];
            const z = -CAP_LEN / 2 + frac(t / 7 + k / NRBC + q[0] * 0.04) * CAP_LEN;
            const a = q[1] * Math.PI * 2;
            const fade = Math.min((z + CAP_LEN / 2) / 1.2, (CAP_LEN / 2 - z) / 1.2, 1);
            putInstance(m, k, CAP_X + Math.cos(a) * 0.45, CAP_Y + Math.sin(a) * 0.45, z, 0.5 * fade, t * 0.6 + q[2] * 6, k, t * 0.4);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return (
        <group>
            <mesh position={[CAP_X, CAP_Y, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat} renderOrder={3} {...bind}>
                <cylinderGeometry args={[1.15, 1.15, CAP_LEN, 36, 1, true]} />
            </mesh>
            <instancedMesh ref={cells} args={[rbcGeo, rbcMat, NRBC]} frustumCulled={false} />
        </group>
    );
};

/** Trajetória de uma partícula: luz → ponta da vilosidade → base → capilar → ao longo do capilar. */
const pathAt = (u: number, k: number, r: readonly number[], out: THREE.Vector3) => {
    const [vx, vz] = villusBase(k % VILLI.length);
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

const uOf = (t: number, k: number, seed: number) => frac(t / 11 + k / N + seed * 0.02);
const fadeOf = (u: number) => Math.max(Math.min(u / 0.05, (1 - u) / 0.05, 1), 0);

const BetaAlanine = ({ timeRef }: { timeRef: TimeBox }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind } = useStructure('bala');
    const geo = useMemo(() => new THREE.SphereGeometry(0.17, 14, 10), []);
    const mat = useMemo(() => glowMaterial(C.carnoSoft, 1.5), []);
    const glow = useGlowMesh(N * (TRAIL + 1), C.carno, 1.5, 1.4);
    const seeds = useMemo(() => Array.from({ length: N }, (_, k) => randoms(100 + k, 4)), []);
    const p = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        const m = ref.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < N; k++) {
            const u = uOf(t, k, seeds[k][3]);
            pathAt(u, k * 7, seeds[k], p);
            const fade = fadeOf(u);
            putInstance(m, k, p.x, p.y, p.z, fade);
            putGlow(glow, k * (TRAIL + 1), p.x, p.y, p.z, 1.15 * fade, 0.85 * fade);
            for (let j = 1; j <= TRAIL; j++) {
                const uj = u - j * TRAIL_DU;
                if (uj <= 0) { putGlow(glow, k * (TRAIL + 1) + j, 0, 0, 0, 0, 0); continue; }
                pathAt(uj, k * 7, seeds[k], p);
                const f = fade * (1 - j / (TRAIL + 1));
                putGlow(glow, k * (TRAIL + 1) + j, p.x, p.y, p.z, 0.75 * f, 0.5 * f);
            }
        }
        m.instanceMatrix.needsUpdate = true;
        flushGlow(glow);
    });
    return (
        <group>
            <instancedMesh ref={ref} args={[geo, mat, N]} frustumCulled={false} {...bind} />
            <primitive object={glow} />
        </group>
    );
};

/** Partículas tênues em suspensão na luz intestinal (profundidade e escala). */
const LumenMotes = ({ timeRef }: { timeRef: TimeBox }) => {
    const glow = useGlowMesh(NMOTE, '#f9c6dc', 0.35, 0.6);
    const seeds = useMemo(() => Array.from({ length: NMOTE }, (_, k) => randoms(170 + k, 4)), []);
    useFrame(({ clock }) => {
        if (stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < NMOTE; k++) {
            const q = seeds[k];
            putGlow(glow, k, -10 + q[0] * 16 + Math.sin(t * 0.13 + k) * 0.6, 1.5 + q[1] * 7 + Math.sin(t * 0.21 + k * 2) * 0.4, -5 + q[2] * 10, 0.35 + q[3] * 0.5, 0.6);
        }
        flushGlow(glow);
    });
    return <primitive object={glow} />;
};

export const GutStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { if (g.current) g.current.visible = stationWeight(timeRef.current.t, I) > 0; });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Mucosa />
            <Villi />
            <Capillary timeRef={timeRef} />
            <LumenMotes timeRef={timeRef} />
            <BetaAlanine timeRef={timeRef} />
        </group>
    );
};
