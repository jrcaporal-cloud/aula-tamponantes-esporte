import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { flushGlow, putGlow, tissueMaterial, withRim } from './fx';
import { STATION, stationX, type Vec3 } from './layout';
import { firing, plasma, playHour, PEAK } from './model';
import { useCarnoSim } from './store';
import { wobble } from './shapes';
import { useGlowMesh } from './useGlow';
import { useStructure } from './useStructure';

/*
 * Etapa 7 — pele: epiderme em cima, derme embaixo com um capilar em alça, um neurônio sensorial
 * cujas terminações livres sobem até a epiderme (MrgprD nas pontas) e um mastócito parado ao lado.
 * A β-alanina sai do capilar conforme a curva plasmática; acima do limiar, os impulsos (rosa)
 * descem pelo axônio. O mastócito nunca acende: a via não passa pela histamina. A epiderme é feita de
 * células (queratinócitos) translúcidas, com uma janela em volta de cada terminação; a derme, de fibras.
 */

const I = STATION.skin;
const BRANCH = new THREE.Vector3(0.4, -0.6, 0);
const TIPS: Vec3[] = [[-2.7, 3.5, 0.9], [-0.9, 3.85, -0.6], [1.2, 3.7, 1], [3, 3.45, -0.5]];
const TRUNK = [new THREE.Vector3(0.4, -0.6, 0), new THREE.Vector3(1.4, -3.4, 0.4), new THREE.Vector3(3.2, -7, 0)];
const NI = 22;
const NB = 30;
const TRAIL = 3;

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

/** Queratinócitos: células poliédricas em camadas, menores e mais achatadas perto da superfície. */
const CELLS: [number, number, number, number][] = [];
{
    const r = randoms(1900, 4000);
    let q = 0;
    for (let layer = 0; layer < 3; layer++) {
        const y = 2.75 + layer * 0.62;
        const step = 0.86 - layer * 0.08;
        for (let x = -9.2; x <= 9.2; x += step) {
            for (let z = -4.5; z <= 4.5; z += step) {
                const px = x + (r[q++ % r.length] - 0.5) * 0.25 + (layer % 2) * step * 0.5;
                const pz = z + (r[q++ % r.length] - 0.5) * 0.25;
                const near = TIPS.some(t => Math.hypot(px - t[0], pz - t[2]) < 1.05 && y < t[1] + 0.6);
                if (!near) CELLS.push([px, y, pz, step * 0.62]);
            }
        }
    }
}

const Layers = () => {
    const cells = useRef<THREE.InstancedMesh>(null);
    const cellGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
    const cellMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1c4ad', emissive: '#5c2e1f', emissiveIntensity: 0.35, roughness: 0.55, transparent: true, opacity: 0.3, depthWrite: false, flatShading: true }), []);
    const corneum = useMemo(() => {
        const g = new THREE.PlaneGeometry(19, 9.5, 120, 60);
        g.rotateX(-Math.PI / 2);
        const pos = g.getAttribute('position');
        for (let i = 0; i < pos.count; i++) pos.setY(i, wobble(pos.getX(i) * 1.4, 0, pos.getZ(i) * 1.4, 9) * 0.06);
        g.computeVertexNormals();
        return g;
    }, []);
    const corneumMat = useMemo(() => tissueMaterial('#f5d0b5', '#fff7ed', '#3b1d10', { transparent: true, opacity: 0.8, side: THREE.DoubleSide }), []);
    // junção dermoepidérmica: membrana ondulada (papilas dérmicas)
    const basement = useMemo(() => {
        const g = new THREE.PlaneGeometry(19, 9.5, 120, 60);
        g.rotateX(-Math.PI / 2);
        const pos = g.getAttribute('position');
        for (let i = 0; i < pos.count; i++) pos.setY(i, Math.sin(pos.getX(i) * 1.3) * Math.cos(pos.getZ(i) * 1.1) * 0.28);
        g.computeVertexNormals();
        return g;
    }, []);
    const basementMat = useMemo(() => withRim(new THREE.MeshStandardMaterial({ color: '#f9a8b4', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, roughness: 0.6 }), '#fecdd3', 2.0, 0.35), []);
    const fibers = useMemo(() => {
        const r = randoms(1950, 200);
        const parts = Array.from({ length: 12 }, (_, k) => {
            const y = -4.8 + r[k * 4] * 6.6;
            const z = -4 + r[k * 4 + 1] * 8;
            const pts = Array.from({ length: 8 }, (_, j) => new THREE.Vector3(-9.4 + j * 2.7, y + Math.sin(j * 1.7 + k) * 0.35, z + Math.cos(j * 1.3 + k * 2) * 0.5));
            return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.06 + r[k * 4 + 2] * 0.04, 5);
        });
        const g = mergeGeometries(parts);
        parts.forEach(p => p.dispose());
        return g;
    }, []);
    const fiberMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fbcfe8', emissive: '#831843', emissiveIntensity: 0.25, transparent: true, opacity: 0.13, depthWrite: false, roughness: 0.5 }), []);
    useLayoutEffect(() => {
        const m = cells.current;
        if (!m) return;
        CELLS.forEach(([x, y, z, sc], k) => {
            putInstance(m, k, x, y, z, 1, 0, k * 0.7, 0);
            m.getMatrixAt(k, tmpM);
            tmpM.scale(tmpS.set(sc, sc * (0.62 - (y - 2.75) * 0.18), sc));
            m.setMatrixAt(k, tmpM);
        });
        m.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <group>
            <mesh geometry={corneum} material={corneumMat} position={[0, 4.6, 0]} />
            <instancedMesh ref={cells} args={[cellGeo, cellMat, CELLS.length]} />
            <mesh geometry={basement} material={basementMat} position={[0, 2.3, 0]} />
            <mesh geometry={fibers} material={fiberMat} />
        </group>
    );
};

const tmpM = new THREE.Matrix4();
const tmpS = new THREE.Vector3();

const Neuron = () => {
    const { bind, lit } = useStructure('neuronio');
    const geos = useMemo(() => [
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(TRUNK), 40, 0.24, 10),
        ...BRANCHES.map(b => new THREE.TubeGeometry(b, 30, 0.12, 8)),
    ], []);
    const mat = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({ color: '#e2e8f0', emissive: '#64748b', emissiveIntensity: 0.3, roughness: 0.35, clearcoat: 0.8, sheen: 0.5, sheenColor: new THREE.Color('#f1f5f9') }), '#cbd5e1', 2.4, 0.5), []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.1 : 0.3 }); }, [lit, mat]);
    return (
        <group {...bind}>
            {geos.map((g, k) => (
                <mesh key={k} geometry={g} material={mat} />
            ))}
        </group>
    );
};

const Receptors = ({ litRef }: { litRef: { current: number } }) => {
    const { bind, lit } = useStructure('mrgprd');
    const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: C.risk, emissive: C.risk, emissiveIntensity: 0.3, roughness: 0.25, clearcoat: 1 }), []);
    const halo = useGlowMesh(TIPS.length * 2, C.risk, 1.4, 1.2);
    useFrame(({ clock }) => {
        const f = litRef.current;
        mat.setValues({ emissiveIntensity: (lit ? 1 : 0.3) + f * 2.2 });
        const t = clock.elapsedTime;
        TIPS.forEach((p, k) => {
            // pulso que se abre a cada disparo, mais rápido e forte quanto maior o disparo
            const ph = frac(t * (0.8 + f * 1.6) + k * 0.27);
            putGlow(halo, k * 2, p[0], p[1], p[2], 1.2 + f * 0.8, 0.15 + f * 0.7);
            putGlow(halo, k * 2 + 1, p[0], p[1], p[2], 1 + ph * 3.4 * f, f * (1 - ph) * 0.8);
        });
        flushGlow(halo);
    });
    return (
        <group {...bind}>
            {TIPS.map(p => <mesh key={p[0]} position={p} material={mat}><sphereGeometry args={[0.3, 24, 18]} /></mesh>)}
            <primitive object={halo} />
        </group>
    );
};

const MastCell = () => {
    const { bind, lit } = useStructure('mastocito');
    const granules = useMemo(() => randoms(1800, 36), []);
    const membrane = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({ color: '#94a3b8', emissive: '#334155', emissiveIntensity: 0.3, transparent: true, opacity: 0.4, roughness: 0.4, clearcoat: 0.8, depthWrite: false }), '#cbd5e1', 2.2, 0.5), []);
    useLayoutEffect(() => { membrane.setValues({ emissiveIntensity: lit ? 1 : 0.3 }); }, [lit, membrane]);
    return (
        <group position={[5.2, -1.6, 1.2]} {...bind}>
            <mesh material={membrane}>
                <sphereGeometry args={[1.25, 40, 28]} />
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
    const impGlow = useGlowMesh(NI * (TRAIL + 1), C.risk, 1.5, 1.4);
    const bGeo = useMemo(() => new THREE.SphereGeometry(0.15, 12, 8), []);
    const bMat = useMemo(() => glowMaterial(C.carnoSoft, 1.6), []);
    const bGlow = useGlowMesh(NB, C.carno, 1.4, 1.2);
    const capMat = useMemo(() => withRim(tissueMaterial('#be123c', '#fecdd3', '#7f1d1d', { transparent: true, opacity: 0.7 }), '#fb7185', 2.2, 0.6), []);
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
            const path = IMPULSE_PATHS[k % TIPS.length];
            path.getPoint(u, p);
            putInstance(imp.current, k, p.x, p.y, p.z, on ? 1 : 0);
            putGlow(impGlow, k * (TRAIL + 1), p.x, p.y, p.z, on ? 1.3 : 0, on ? 1 : 0);
            for (let j = 1; j <= TRAIL; j++) {
                const uj = u - j * 0.018;
                const a = on && uj > 0 ? 1 - j / (TRAIL + 1) : 0;
                path.getPoint(Math.max(uj, 0), p);
                putGlow(impGlow, k * (TRAIL + 1) + j, p.x, p.y, p.z, 0.9 * a, 0.7 * a);
            }
        }
        imp.current.instanceMatrix.needsUpdate = true;
        flushGlow(impGlow);
        // β-alanina que sai do capilar e chega às terminações: quantidade segue o plasma
        const n = Math.round((plasma(h, mode) / PEAK.pura.c) * NB);
        for (let k = 0; k < NB; k++) {
            const s = seeds[k];
            const u = frac(t * 0.22 + s[0]);
            CAPILLARY.getPoint(s[1], p);
            q.set(...TIPS[k % TIPS.length]);
            p.lerp(q, u * 0.92);
            p.set(p.x, p.y + Math.sin(u * 9 + k) * 0.3, p.z + (s[2] - 0.5) * 1.2);
            const f2 = k < n ? Math.min(u / 0.1, (1 - u) / 0.1, 1) : 0;
            putInstance(bala.current, k, p.x, p.y, p.z, f2);
            putGlow(bGlow, k, p.x, p.y, p.z, 0.9 * f2, 0.8 * f2);
        }
        bala.current.instanceMatrix.needsUpdate = true;
        flushGlow(bGlow);
    });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Layers />
            <mesh geometry={capGeo} material={capMat} />
            <Neuron />
            <Receptors litRef={fireRef} />
            <MastCell />
            <instancedMesh ref={imp} args={[impGeo, impMat, NI]} frustumCulled={false} />
            <primitive object={impGlow} />
            <instancedMesh ref={bala} args={[bGeo, bMat, NB]} frustumCulled={false} {...balaBind} />
            <primitive object={bGlow} />
        </group>
    );
};
