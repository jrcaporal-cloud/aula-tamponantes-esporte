import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { dummy, putInstance, randoms, showStation, stationWeight, tmpColor, type TimeBox } from './common';
import { flushGlow, moleculeMaterial, putGlow, tissueMaterial } from './fx';
import { STATION, stationX } from './layout';
import { autoPh, protonatedFraction } from './model';
import { makeCarnosineWhole, RING_N } from './molecule';
import { useCarnoSim } from './store';
import { useGlowMesh } from './useGlow';
import { useStructure } from './useStructure';

/*
 * Etapa 6 — tampão: sarcoplasma com miofibrilas ao fundo, carnosinas e H⁺ (laranja). Quando o pH
 * cai, mais H⁺ livres aparecem e uma fração das carnosinas prende um H⁺ no anel imidazol (o anel
 * passa de ciano a laranja, com um clarão no instante da captura). A fração presa é a de
 * Henderson–Hasselbalch com pKa 6,83 (cálculo).
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
    const bandMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#fda4af', emissive: '#9f1239', emissiveIntensity: 0.45, roughness: 0.4, clearcoat: 0.6 }), []);
    const fibGeo = useMemo(() => new THREE.CylinderGeometry(0.66, 0.66, 30, 28, 1, true), []);
    const fibMat = useMemo(() => tissueMaterial('#9f1239', '#fecdd3', '#4c0519'), []);
    useLayoutEffect(() => { fibMat.setValues({ emissiveIntensity: lit ? 1.1 : 0.35 }); }, [lit, fibMat]);
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
                <mesh key={y} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]} geometry={fibGeo} material={fibMat} />
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
    const mat = useMemo(() => moleculeMaterial('#1e1b4b', 0.3), []);
    const ringMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, emissive: '#ffffff', emissiveIntensity: 0.3 }), []);
    const hGeo = useMemo(() => new THREE.SphereGeometry(0.17, 14, 10), []);
    const hMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(C.acidSoft).multiplyScalar(1.6), toneMapped: false }), []);
    const hGlow = useGlowMesh(NP, C.acid, 1.5, 1.2);
    const capture = useGlowMesh(NM + 1, '#fff7ed', 1.4, 2);
    const seeds = useMemo(() => Array.from({ length: NP }, (_, k) => randoms(1500 + k, 5)), []);
    // ordem em que as carnosinas recebem H⁺ (o herói é o primeiro)
    // ordem invertida: order[j] = posição da carnosina j na fila (sem `indexOf` por quadro)
    const order = useMemo(() => {
        const rank = [0, ...randoms(77, NM - 1).map((v, k) => ({ v, k: k + 1 })).sort((a, b) => a.v - b.v).map(o => o.k)];
        const inv = new Int32Array(NM);
        for (let i = 0; i < NM; i++) inv[rank[i]] = i;
        return inv;
    }, []);
    const [bindInit] = useState(() => new Float32Array(NM));
    const bindRef = useRef(bindInit);
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
        showStation(g.current, vis);
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
            const target = order[j] < nBound ? 1 : 0;
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
                const on = b > 0.01 ? (k === 0 ? 1.5 : 1) : 0;
                putInstance(protons.current, k, free.x, free.y, free.z, on);
                putGlow(hGlow, k, free.x, free.y, free.z, 1.1 * on, on ? 0.75 : 0);
                // clarão da captura: acende quando o H⁺ chega ao anel (b perto de 1, ainda subindo)
                const land = b > 0.75 && b < 1 ? Math.sin(((b - 0.75) / 0.25) * Math.PI) : 0;
                putGlow(capture, k, nWorld[k].x, nWorld[k].y, nWorld[k].z, (k === 0 ? 3.2 : 2.2) * land, land);
            } else {
                const on = k - NM < nFree ? 1 : 0;
                putInstance(protons.current, k, free.x, free.y, free.z, on);
                putGlow(hGlow, k, free.x, free.y, free.z, 1.1 * on, on * 0.6);
            }
        }
        // anel do herói: halo permanente na cor do estado (ciano livre → laranja com H⁺)
        putGlow(capture, NM, nWorld[0].x, nWorld[0].y, nWorld[0].z, 2.6, 0.18 + bindP[0] * 0.2);
        flushGlow(hGlow);
        flushGlow(capture);
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
            <primitive object={hGlow} />
            <primitive object={capture} />
        </group>
    );
};
