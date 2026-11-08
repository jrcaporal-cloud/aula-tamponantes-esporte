import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { putInstance, randoms, stationWeight, tmpColor, dummy, type TimeBox } from './common';
import { STATION, stationX } from './layout';
import { autoPh, protonatedFraction } from './model';
import { makeCarnosineWhole, RING_N } from './molecule';
import { useCarnoSim } from './store';
import { useStructure } from './useStructure';

/*
 * Etapa 6 — tampão: sarcoplasma com miofibrilas ao fundo, carnosinas e H⁺ (laranja). Quando o pH
 * cai, mais H⁺ livres aparecem e uma fração das carnosinas prende um H⁺ no anel imidazol (o anel
 * passa de ciano a laranja). A fração presa é a de Henderson–Hasselbalch com pKa 6,83 (cálculo).
 */

const I = STATION.buffer;
const NM = 26;
const NFREE = 64;
const NP = NM + NFREE;
const HERO = { pos: [0.4, 0.5, 2.8] as const, s: 0.62 };

const Myofibrils = () => {
    const bands = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('miofibrila');
    const rows = useMemo(() => Array.from({ length: 7 }, (_, k) => [-4.6 + k * 1.55, -7 - (k % 2) * 1.2] as const), []);
    const bandGeo = useMemo(() => new THREE.CylinderGeometry(0.72, 0.72, 0.14, 20), []);
    const bandMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fda4af', emissive: '#9f1239', emissiveIntensity: 0.5 }), []);
    useLayoutEffect(() => {
        const m = bands.current;
        if (!m) return;
        rows.forEach(([y, z], r) => {
            for (let k = 0; k < 14; k++) putInstance(m, r * 14 + k, -13 + k * 2 + (r % 2) * 0.6, y, z, 1, 0, 0, Math.PI / 2);
        });
        m.instanceMatrix.needsUpdate = true;
    }, [rows]);
    return (
        <group {...bind}>
            {rows.map(([y, z]) => (
                <mesh key={y} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.66, 0.66, 30, 20, 1, true]} />
                    <meshStandardMaterial color="#9f1239" emissive="#4c0519" emissiveIntensity={lit ? 1.2 : 0.5} roughness={0.6} />
                </mesh>
            ))}
            <instancedMesh ref={bands} args={[bandGeo, bandMat, rows.length * 14]} />
        </group>
    );
};

const ACID = new THREE.Color(C.acid);
const BASE = new THREE.Color(C.base);

export const BufferStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    const body = useRef<THREE.InstancedMesh>(null);
    const ring = useRef<THREE.InstancedMesh>(null);
    const protons = useRef<THREE.InstancedMesh>(null);
    const molBind = useStructure('imidazol').bind;
    const hBind = useStructure('hplus').bind;
    const geo = useMemo(() => makeCarnosineWhole(), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, emissive: '#1e1b4b', emissiveIntensity: 0.35 }), []);
    const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3, emissive: '#ffffff', emissiveIntensity: 0.25 }), []);
    const hGeo = useMemo(() => new THREE.SphereGeometry(0.2, 12, 10), []);
    const hMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(C.acid).multiplyScalar(1.8), toneMapped: false }), []);
    const seeds = useMemo(() => Array.from({ length: NP }, (_, k) => randoms(1500 + k, 5)), []);
    // ordem em que as carnosinas recebem H⁺ (o herói é o primeiro)
    const rank = useMemo(() => [0, ...randoms(77, NM - 1).map((v, k) => ({ v, k: k + 1 })).sort((a, b) => a.v - b.v).map(o => o.k)], []);
    const bindRef = useRef(new Float32Array(NM));
    const nWorld = useMemo(() => Array.from({ length: NM }, () => new THREE.Vector3()), []);
    const free = useMemo(() => new THREE.Vector3(), []);

    // cor por instância criada já na montagem: o shader nasce com ela e não recompila depois
    useLayoutEffect(() => {
        const m = ring.current;
        if (!m) return;
        for (let j = 0; j < NM; j++) m.setColorAt(j, BASE);
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }, []);

    useFrame(({ clock }, delta) => {
        if (!g.current) return;
        const vis = stationWeight(timeRef.current.t, I) > 0;
        g.current.visible = vis;
        if (!vis || !body.current || !ring.current || !protons.current) return;
        const t = clock.elapsedTime;
        const pH = useCarnoSim.getState().ph ?? autoPh(performance.now() / 1000);
        const nBound = Math.round(protonatedFraction(pH) * NM);
        const dt = Math.min(delta, 0.05);
        const bindP = bindRef.current;
        for (let j = 0; j < NM; j++) {
            const q = seeds[j];
            const hero = j === 0;
            const x = hero ? HERO.pos[0] : -6 + q[0] * 15;
            const y = hero ? HERO.pos[1] : -2.6 + q[1] * 6.2 + Math.sin(t * 0.5 + j) * 0.25;
            const z = hero ? HERO.pos[2] : -2.2 + q[2] * 4;
            const s = hero ? HERO.s : 0.3;
            const ry = hero ? Math.sin(t * 0.4) * 0.35 : t * 0.25 + q[3] * 6;
            putInstance(body.current, j, x, y, z, s, hero ? 0.2 : q[4] * 3, ry, 0);
            putInstance(ring.current, j, x, y, z, s, hero ? 0.2 : q[4] * 3, ry, 0);
            nWorld[j].copy(RING_N).multiplyScalar(1.25).applyMatrix4(dummy.matrix);
            const target = rank.indexOf(j) < nBound ? 1 : 0;
            bindP[j] += Math.sign(target - bindP[j]) * Math.min(Math.abs(target - bindP[j]), dt * 1.6);
            ring.current.setColorAt(j, tmpColor.copy(BASE).lerp(ACID, bindP[j]));
        }
        // H⁺: os NM primeiros pertencem a uma carnosina (voam até o anel); os demais vagam livres
        const nFree = Math.round(NFREE * Math.min(10 ** (6.5 - pH), 1));
        for (let k = 0; k < NP; k++) {
            const q = seeds[k];
            free.set(-6.5 + q[0] * 16 + Math.sin(t * (0.6 + q[3]) + k) * 0.8, -3 + q[1] * 7 + Math.cos(t * (0.5 + q[4]) + k) * 0.7, -2.5 + q[2] * 5.5);
            if (k < NM) {
                const b = bindP[k];
                free.lerp(nWorld[k], THREE.MathUtils.smoothstep(b, 0, 1));
                putInstance(protons.current, k, free.x, free.y, free.z, b > 0.01 ? (k === 0 ? 1.5 : 1) : 0);
            } else {
                putInstance(protons.current, k, free.x, free.y, free.z, k - NM < nFree ? 1 : 0);
            }
        }
        body.current.instanceMatrix.needsUpdate = true;
        ring.current.instanceMatrix.needsUpdate = true;
        if (ring.current.instanceColor) ring.current.instanceColor.needsUpdate = true;
        protons.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Myofibrils />
            <group {...molBind}>
                <instancedMesh ref={body} args={[geo.body, mat, NM]} frustumCulled={false} />
                <instancedMesh ref={ring} args={[geo.ring, ringMat, NM]} frustumCulled={false} />
            </group>
            <instancedMesh ref={protons} args={[hGeo, hMat, NP]} frustumCulled={false} {...hBind} />
        </group>
    );
};
