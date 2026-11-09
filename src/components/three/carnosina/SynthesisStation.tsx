import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { phase } from '../shared/math';
import { putInstance, showStation, stationWeight, type TimeBox } from './common';
import { flushGlow, moleculeMaterial, putGlow, setEmissiveIntensity, setOpacity, withRim } from './fx';
import { baPart, HERO_S, heroFrame, hisPart, POOL_BA, POOL_HIS, poolHome } from './synthesisPool';
import { STATION, stationX } from './layout';
import { AMIDE_C, makeCarnosineParts, RING_CENTER } from './molecule';
import { proteinGeometry } from './shapes';
import { useGlowMesh } from './useGlow';
import { useStructure } from './useStructure';

/*
 * Etapa 4 — síntese: a CARNS1 (verde, translúcida) recebe uma β-alanina e uma L-histidina, gasta um
 * ATP (sai um fosfato: ADP) e solta uma água; a carnosina pronta sobe com o anel imidazol aceso.
 * Ao redor, muita histidina livre e pouca β-alanina: quem limita é a β-alanina. No instante da ligação,
 * um clarão e uma onda saem do ponto da ligação peptídica.
 */

const I = STATION.synthesis;
const NH = POOL_HIS;
const NB = POOL_BA;

const ENZ_POS = new THREE.Vector3(0, -0.9, -1.4);

const Enzyme = () => {
    const { bind, lit } = useStructure('carns1');
    const geo = useMemo(() => proteinGeometry(3.1, 3, 6, 0.13), []);
    const mat = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({
        color: '#34D399', emissive: '#065f46', emissiveIntensity: 0.4, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
        sheen: 0.7, sheenColor: new THREE.Color('#a7f3d0'), transparent: true, opacity: 0.62, depthWrite: false,
    }), '#6ee7b7', 2.0, 0.9), []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.1 : 0.4 }); }, [lit, mat]);
    return <mesh geometry={geo} material={mat} position={ENZ_POS} renderOrder={3} {...bind} />;
};

interface HeroRefs {
    ba: THREE.Group | null; his: THREE.Group | null; amide: THREE.Mesh | null;
    water: THREE.Group | null; atp: THREE.Group | null; pi: THREE.Mesh | null; wave: THREE.Mesh | null;
}

/** Esfera única do ATP e da água (os hidrogênios usam a mesma, em escala). */
const BALL = new THREE.SphereGeometry(0.3, 24, 16);
const H_SCALE = 0.16 / 0.3;

const atpMat = () => new THREE.MeshPhysicalMaterial({ color: '#e2e8f0', emissive: '#64748b', emissiveIntensity: 0.4, roughness: 0.3, clearcoat: 1 });
/** Brilhos do herói: 0 clarão da ligação, 1 sítio ativo, 2 aura da carnosina pronta, 3 fosfato que sai, 4 anel. */
const NFX = 5;

const Hero = ({ timeRef }: { timeRef: TimeBox }) => {
    const r = useRef<HeroRefs>({ ba: null, his: null, amide: null, water: null, atp: null, pi: null, wave: null });
    const { bind } = useStructure('carnosina');
    const parts = useMemo(() => makeCarnosineParts(false), []);
    const mat = useMemo(() => moleculeMaterial('#1e1b4b', 0.3), []);
    const ringMat = useMemo(() => moleculeMaterial('#0891b2', 0.8), []);
    const pMat = useMemo(() => atpMat(), []);
    const waterMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e0f2fe', roughness: 0.15, clearcoat: 1, emissive: '#0c4a6e', emissiveIntensity: 0.3 }), []);
    const waveMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(C.carnoSoft).multiplyScalar(1.6), transparent: true, opacity: 0, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), []);
    const fx = useGlowMesh(NFX, '#f5f3ff', 1.3, 2);
    const aura = useGlowMesh(1, C.carno, 1.2, 0.6);
    const tmp = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock, camera }) => {
        const { ba, his, amide, water, atp, pi, wave } = r.current;
        if (!ba || !his || !amide || !water || !atp || !pi || !wave) return;
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
        setEmissiveIntensity(ringMat, 0.8 + rise * (1.6 + Math.sin(clock.elapsedTime * 5) * 0.6));

        // o momento da ligação: clarão no ponto da ligação peptídica e uma onda que se abre
        const bond = phase(u, 0.33, 0.37) * (1 - phase(u, 0.4, 0.5));
        const ax = tmp.x + AMIDE_C.x * s + 0.35 * s;
        const ay = tmp.y + AMIDE_C.y * s;
        putGlow(fx, 0, ax, ay, tmp.z + 0.4, 3.4 * bond, bond);
        const wu = phase(u, 0.34, 0.5);
        wave.position.set(ax, ay, tmp.z + 0.2);
        wave.quaternion.copy(camera.quaternion);
        wave.scale.setScalar(0.2 + wu * 4.5);
        setOpacity(waveMat, wu > 0 && wu < 1 ? (1 - wu) * 0.9 : 0);
        // sítio ativo: pulsa enquanto as metades chegam
        const site = (1 - rise) * (0.45 + 0.25 * Math.sin(clock.elapsedTime * 3));
        putGlow(fx, 1, 0, 0.1, 2.3, 2.6, site * Math.min(u / 0.05, 1));
        // carnosina pronta: aura violeta enquanto sobe
        const done = phase(u, 0.4, 0.5) * (1 - phase(u, 0.9, 1));
        putGlow(aura, 0, tmp.x, tmp.y, tmp.z, 6.5 * done, 0.45 * done);
        // fosfato que se solta (ATP → ADP)
        putGlow(fx, 3, atp.position.x + pi.position.x, atp.position.y + pi.position.y, atp.position.z + 0.2, 1.4 * split * (1 - phase(u, 0.62, 0.72)), split * 0.9);
        // anel imidazol aceso quando a carnosina sobe
        putGlow(fx, 4, his.position.x + RING_CENTER.x * s, his.position.y + RING_CENTER.y * s, his.position.z + RING_CENTER.z * s + 0.3, 2.4 * rise * (1 - phase(u, 0.9, 1)), rise * 0.6);
        flushGlow(fx);
        flushGlow(aura);
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
                <mesh geometry={BALL} material={waterMat} />
                <mesh position={[0.32, 0.2, 0]} geometry={BALL} scale={H_SCALE} material={waterMat} />
                <mesh position={[-0.3, 0.22, 0]} geometry={BALL} scale={H_SCALE} material={waterMat} />
            </group>
            <group ref={g => { r.current.atp = g; }}>
                {[0, 1].map(k => (
                    <mesh key={k} position={[-0.75 + k * 0.5, -0.15 * k, 0]} geometry={BALL} material={pMat} />
                ))}
                <mesh ref={m => { r.current.pi = m; }} geometry={BALL} material={pMat} />
            </group>
            <mesh ref={m => { r.current.wave = m; }} material={waveMat}><ringGeometry args={[0.86, 1, 64]} /></mesh>
            <primitive object={fx} />
            <primitive object={aura} />
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
    const mat = useMemo(() => moleculeMaterial('#0f172a', 0.2, { transparent: true, opacity: 0.85 }), []);
    const ringMat = useMemo(() => moleculeMaterial('#0e7490', 0.5), []);
    const baMat = useMemo(() => moleculeMaterial('#5b21b6', 0.9), []);
    const baGlow = useGlowMesh(NB, C.carno, 1.2, 0.8);
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
            putGlow(baGlow, k, p.x, p.y, p.z, 3.2, 0.32 + 0.12 * Math.sin(t * 2 + k));
        }
        flushGlow(baGlow);
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
            <primitive object={baGlow} />
        </group>
    );
};

export const SynthesisStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { if (g.current) showStation(g.current, stationWeight(timeRef.current.t, I) > 0); });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Enzyme />
            <Hero timeRef={timeRef} />
            <Pool timeRef={timeRef} />
        </group>
    );
};
