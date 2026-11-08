import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { STATION, stationX, type Vec3 } from './layout';
import { firing, plasma, playHour, PEAK } from './model';
import { useCarnoSim } from './store';
import { useStructure } from './useStructure';

/*
 * Etapa 7 — pele: epiderme em cima, derme embaixo com um capilar em alça, um neurônio sensorial
 * cujas terminações livres sobem até a epiderme (MrgprD nas pontas) e um mastócito parado ao lado.
 * A β-alanina sai do capilar conforme a curva plasmática; acima do limiar, os impulsos (rosa)
 * descem pelo axônio. O mastócito nunca acende: a via não passa pela histamina.
 */

const I = STATION.skin;
const BRANCH = new THREE.Vector3(0.4, -0.6, 0);
const TIPS: Vec3[] = [[-2.7, 3.5, 0.9], [-0.9, 3.85, -0.6], [1.2, 3.7, 1], [3, 3.45, -0.5]];
const TRUNK = [new THREE.Vector3(0.4, -0.6, 0), new THREE.Vector3(1.4, -3.4, 0.4), new THREE.Vector3(3.2, -7, 0)];
const NI = 22;
const NB = 30;

const branchCurve = (tip: Vec3) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(...tip),
    new THREE.Vector3(tip[0] * 0.6 + BRANCH.x * 0.4, 1.6, tip[2] * 0.6),
    BRANCH.clone(),
]);
const BRANCHES = TIPS.map(branchCurve);
/** Caminho do impulso: da ponta até o fim do tronco (rumo à medula). */
const IMPULSE_PATHS = TIPS.map(tip => new THREE.CatmullRomCurve3([...branchCurve(tip).points, ...TRUNK.slice(1)]));
const CAPILLARY = new THREE.CatmullRomCurve3([[-7.4, -3.4, -1.2], [-7, 1.2, -1.2], [-5.6, 2.1, -1.2], [-4.2, 1.2, -1.2], [-3.9, -3.4, -1.2]].map(p => new THREE.Vector3(...p)));

const hash = (k: number, c: number) => frac(Math.sin(k * 12.9898 + c * 78.233) * 43758.5453);

const Layers = () => (
    <group>
        <mesh position={[0, 4.55, 0]}>
            <boxGeometry args={[19, 0.35, 9.5]} />
            <meshStandardMaterial color="#f5d0b5" roughness={0.8} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, 3.45, 0]}>
            <boxGeometry args={[19, 1.9, 9.5]} />
            <meshStandardMaterial color="#e7a98f" roughness={0.7} transparent opacity={0.32} depthWrite={false} />
        </mesh>
        <mesh position={[0, -1.3, 0]}>
            <boxGeometry args={[19, 7.6, 9.5]} />
            <meshStandardMaterial color="#f9a8b4" roughness={0.9} transparent opacity={0.07} depthWrite={false} />
        </mesh>
    </group>
);

const Neuron = () => {
    const { bind, lit } = useStructure('neuronio');
    const geos = useMemo(() => [
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(TRUNK), 40, 0.24, 10),
        ...BRANCHES.map(b => new THREE.TubeGeometry(b, 30, 0.12, 8)),
    ], []);
    return (
        <group {...bind}>
            {geos.map((g, k) => (
                <mesh key={k} geometry={g}>
                    <meshStandardMaterial color="#e2e8f0" emissive="#64748b" emissiveIntensity={lit ? 1.2 : 0.35} roughness={0.4} />
                </mesh>
            ))}
        </group>
    );
};

const Receptors = ({ litRef }: { litRef: { current: number } }) => {
    const { bind, lit } = useStructure('mrgprd');
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: C.risk, emissive: C.risk, emissiveIntensity: 0.3, roughness: 0.3 }), []);
    useFrame(() => { mat.setValues({ emissiveIntensity: (lit ? 1 : 0.3) + litRef.current * 2.2 }); });
    return (
        <group {...bind}>
            {TIPS.map(p => <mesh key={p[0]} position={p} material={mat}><sphereGeometry args={[0.3, 18, 14]} /></mesh>)}
        </group>
    );
};

const MastCell = () => {
    const { bind, lit } = useStructure('mastocito');
    const granules = useMemo(() => randoms(1800, 36), []);
    return (
        <group position={[5.2, -1.6, 1.2]} {...bind}>
            <mesh>
                <sphereGeometry args={[1.25, 28, 20]} />
                <meshStandardMaterial color="#94a3b8" emissive="#334155" emissiveIntensity={lit ? 1 : 0.3} transparent opacity={0.45} roughness={0.5} />
            </mesh>
            {Array.from({ length: 12 }, (_, k) => (
                <mesh key={k} position={[(granules[k * 3] - 0.5) * 1.5, (granules[k * 3 + 1] - 0.5) * 1.5, (granules[k * 3 + 2] - 0.5) * 1.5]}>
                    <sphereGeometry args={[0.16, 8, 6]} />
                    <meshStandardMaterial color="#64748b" roughness={0.6} />
                </mesh>
            ))}
        </group>
    );
};

export const SkinStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    const imp = useRef<THREE.InstancedMesh>(null);
    const bala = useRef<THREE.InstancedMesh>(null);
    const fireRef = useRef(0);
    const balaBind = useStructure('bala').bind;
    const capGeo = useMemo(() => new THREE.TubeGeometry(CAPILLARY, 40, 0.42, 12), []);
    const impGeo = useMemo(() => new THREE.SphereGeometry(0.2, 12, 10), []);
    const impMat = useMemo(() => glowMaterial(C.risk, 2), []);
    const bGeo = useMemo(() => new THREE.SphereGeometry(0.16, 10, 8), []);
    const bMat = useMemo(() => glowMaterial(C.carno, 1.7), []);
    const seeds = useMemo(() => Array.from({ length: NB }, (_, k) => randoms(2000 + k, 3)), []);
    const p = useMemo(() => new THREE.Vector3(), []);
    const q = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        if (!g.current) return;
        const vis = stationWeight(timeRef.current.t, I) > 0;
        g.current.visible = vis;
        if (!vis || !imp.current || !bala.current) return;
        const mode = useCarnoSim.getState().release;
        const h = playHour(performance.now() / 1000);
        const f = firing(h, mode);
        fireRef.current = f;
        const t = clock.elapsedTime;
        for (let k = 0; k < NI; k++) {
            const c = t * 0.8 + k / NI;
            const u = frac(c);
            const on = hash(k, Math.floor(c)) < f;
            IMPULSE_PATHS[k % TIPS.length].getPoint(u, p);
            putInstance(imp.current, k, p.x, p.y, p.z, on ? 1 : 0);
        }
        imp.current.instanceMatrix.needsUpdate = true;
        // β-alanina que sai do capilar e chega às terminações: quantidade segue o plasma
        const n = Math.round((plasma(h, mode) / PEAK.pura.c) * NB);
        for (let k = 0; k < NB; k++) {
            const s = seeds[k];
            const u = frac(t * 0.22 + s[0]);
            CAPILLARY.getPoint(s[1], p);
            q.set(...TIPS[k % TIPS.length]);
            p.lerp(q, u * 0.92);
            p.set(p.x, p.y + Math.sin(u * 9 + k) * 0.3, p.z + (s[2] - 0.5) * 1.2);
            putInstance(bala.current, k, p.x, p.y, p.z, k < n ? Math.min(u / 0.1, (1 - u) / 0.1, 1) : 0);
        }
        bala.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Layers />
            <mesh geometry={capGeo}>
                <meshStandardMaterial color="#be123c" emissive="#7f1d1d" emissiveIntensity={0.6} transparent opacity={0.6} />
            </mesh>
            <Neuron />
            <Receptors litRef={fireRef} />
            <MastCell />
            <instancedMesh ref={imp} args={[impGeo, impMat, NI]} frustumCulled={false} />
            <instancedMesh ref={bala} args={[bGeo, bMat, NB]} frustumCulled={false} {...balaBind} />
        </group>
    );
};
