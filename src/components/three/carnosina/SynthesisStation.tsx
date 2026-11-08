import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { phase } from '../shared/math';
import { putInstance, stationWeight, type TimeBox } from './common';
import { baPart, HERO_S, heroFrame, hisPart, POOL_BA, POOL_HIS, poolHome } from './synthesisPool';
import { STATION, stationX } from './layout';
import { AMIDE_C, makeCarnosineParts } from './molecule';
import { useStructure } from './useStructure';

/*
 * Etapa 4 — síntese: a CARNS1 (verde, translúcida) recebe uma β-alanina e uma L-histidina, gasta um
 * ATP (sai um fosfato: ADP) e solta uma água; a carnosina pronta sobe com o anel imidazol aceso.
 * Ao redor, muita histidina livre e pouca β-alanina: quem limita é a β-alanina.
 */

const I = STATION.synthesis;
const NH = POOL_HIS;
const NB = POOL_BA;

const Enzyme = () => {
    const { bind, lit } = useStructure('carns1');
    const geo = useMemo(() => {
        const g = mergeVertices(new THREE.IcosahedronGeometry(3.1, 5));
        const pos = g.getAttribute('position');
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const n = Math.sin(v.x * 1.3) * Math.cos(v.y * 1.1) * 0.28 + Math.sin(v.z * 1.7 + v.x) * 0.18;
            v.multiplyScalar(1 + n / 3.1);
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        g.computeVertexNormals();
        return g;
    }, []);
    return (
        <mesh geometry={geo} position={[0, -0.9, -1.4]} {...bind}>
            <meshStandardMaterial color="#34D399" emissive="#065f46" emissiveIntensity={lit ? 1.2 : 0.45} roughness={0.35} transparent opacity={0.72} />
        </mesh>
    );
};

interface HeroRefs {
    ba: THREE.Group | null; his: THREE.Group | null; amide: THREE.Mesh | null;
    water: THREE.Group | null; atp: THREE.Group | null; pi: THREE.Mesh | null;
}

const Hero = ({ timeRef }: { timeRef: TimeBox }) => {
    const r = useRef<HeroRefs>({ ba: null, his: null, amide: null, water: null, atp: null, pi: null });
    const { bind } = useStructure('carnosina');
    const parts = useMemo(() => makeCarnosineParts(false), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, emissive: '#1e1b4b', emissiveIntensity: 0.35 }), []);
    const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.25, emissive: '#0891b2', emissiveIntensity: 0.8 }), []);
    const tmp = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        const { ba, his, amide, water, atp, pi } = r.current;
        if (!ba || !his || !amide || !water || !atp || !pi) return;
        if (stationWeight(timeRef.current.t, I) <= 0) return;
        const f = heroFrame(clock.elapsedTime, tmp);
        const { u, come, rise } = f;
        const s = HERO_S * (1 - phase(u, 0.93, 1)) * Math.min(u / 0.03, 1);
        baPart(f, ba.position);
        hisPart(f, his.position);
        ba.rotation.set(0, (1 - come) * 0.9, 0);
        his.rotation.set(0, -(1 - come) * 0.9, 0);
        ba.scale.setScalar(s);
        his.scale.setScalar(s);
        amide.position.copy(tmp);
        amide.scale.setScalar(s * phase(u, 0.34, 0.42));
        // água: presa à carboxila da β-alanina até a ligação se formar, depois vai embora
        const leave = phase(u, 0.34, 0.56);
        water.position.set(ba.position.x + AMIDE_C.x * s + 0.5 + leave * 2.4, ba.position.y + AMIDE_C.y * s + 0.6 + leave * 3, ba.position.z + 0.4 + leave * 1.5);
        water.scale.setScalar((1 - phase(u, 0.5, 0.58)) * Math.min(u / 0.03, 1));
        // ATP chega por baixo; um fosfato se solta (ADP) e os dois descem
        const atpIn = phase(u, 0.06, 0.32);
        const drop = phase(u, 0.4, 0.7);
        atp.position.set(1.4 - drop * 1.5, -4.2 + atpIn * 3.2 - drop * 3, 2.6);
        atp.scale.setScalar(1 - phase(u, 0.62, 0.72));
        const split = phase(u, 0.34, 0.5);
        pi.position.set(split * 1.6, split * -0.6, 0);
        ringMat.setValues({ emissiveIntensity: 0.8 + rise * (1.6 + Math.sin(clock.elapsedTime * 5) * 0.6) });
    });
    return (
        <group {...bind}>
            <group ref={g => { r.current.ba = g; }}><mesh geometry={parts.ba} material={mat} /></group>
            <group ref={g => { r.current.his = g; }}>
                <mesh geometry={parts.his} material={mat} />
                <mesh geometry={parts.ring} material={ringMat} />
            </group>
            <mesh ref={m => { r.current.amide = m; }} geometry={parts.amide} material={mat} />
            <group ref={g => { r.current.water = g; }}>
                <mesh><sphereGeometry args={[0.3, 16, 12]} /><meshStandardMaterial color="#e5e7eb" roughness={0.3} /></mesh>
                <mesh position={[0.32, 0.2, 0]}><sphereGeometry args={[0.16, 12, 10]} /><meshStandardMaterial color="#f8fafc" /></mesh>
                <mesh position={[-0.3, 0.22, 0]}><sphereGeometry args={[0.16, 12, 10]} /><meshStandardMaterial color="#f8fafc" /></mesh>
            </group>
            <group ref={g => { r.current.atp = g; }}>
                {[0, 1].map(k => (
                    <mesh key={k} position={[-0.75 + k * 0.5, -0.15 * k, 0]}><sphereGeometry args={[0.3, 16, 12]} /><meshStandardMaterial color="#fde68a" emissive="#92400e" emissiveIntensity={0.4} /></mesh>
                ))}
                <mesh ref={m => { r.current.pi = m; }}><sphereGeometry args={[0.3, 16, 12]} /><meshStandardMaterial color="#fde68a" emissive="#92400e" emissiveIntensity={0.6} /></mesh>
            </group>
        </group>
    );
};

/** Histidina livre (muitas) e β-alanina livre (poucas), vagando em volta da enzima. */
const Pool = ({ timeRef }: { timeRef: TimeBox }) => {
    const his = useRef<THREE.InstancedMesh>(null);
    const ring = useRef<THREE.InstancedMesh>(null);
    const ba = useRef<THREE.InstancedMesh>(null);
    const hisBind = useStructure('histidina').bind;
    const baBind = useStructure('bala').bind;
    const parts = useMemo(() => makeCarnosineParts(true), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, transparent: true, opacity: 0.85 }), []);
    const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, emissive: '#0e7490', emissiveIntensity: 0.5 }), []);
    const baMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, emissive: '#5b21b6', emissiveIntensity: 0.9 }), []);
    const p = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        if (!his.current || !ring.current || !ba.current) return;
        if (stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < NH; k++) {
            poolHome(k, t, p);
            putInstance(his.current, k, p.x, p.y, p.z, 0.3, t * 0.2 + k, t * 0.3 + k * 2, 0);
            putInstance(ring.current, k, p.x, p.y, p.z, 0.3, t * 0.2 + k, t * 0.3 + k * 2, 0);
        }
        for (let k = 0; k < NB; k++) {
            poolHome(NH + k, t, p);
            putInstance(ba.current, k, p.x, p.y, p.z, 0.36, t * 0.25 + k, t * 0.35 + k, 0);
        }
        his.current.instanceMatrix.needsUpdate = true;
        ring.current.instanceMatrix.needsUpdate = true;
        ba.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <group>
            <group {...hisBind}>
                <instancedMesh ref={his} args={[parts.his, mat, NH]} frustumCulled={false} />
                <instancedMesh ref={ring} args={[parts.ring, ringMat, NH]} frustumCulled={false} />
            </group>
            <instancedMesh ref={ba} args={[parts.ba, baMat, NB]} frustumCulled={false} {...baBind} />
        </group>
    );
};

export const SynthesisStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { if (g.current) g.current.visible = stationWeight(timeRef.current.t, I) > 0; });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Enzyme />
            <Hero timeRef={timeRef} />
            <Pool timeRef={timeRef} />
        </group>
    );
};
