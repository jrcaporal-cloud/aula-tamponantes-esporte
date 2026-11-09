import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { frac, putInstance, randoms, showStation, stationWeight, type TimeBox } from './common';
import { flushGlow, putGlow, withRim } from './fx';
import { levelY, STATION, stationX, TANK } from './layout';
import { gainAtWeek, playWeek } from './model';
import { useCarnoSim } from './store';
import { makeLiquidMaterial, makeSurfaceMaterial, MAX_SPLASH, setShaderTime } from './tankMaterials';
import { useGlowMesh } from './useGlow';
import { useStructure } from './useStructure';

/*
 * Etapa 5 — o tanque: um cilindro de vidro com a carnosina (violeta). O nível segue o cursor do
 * gráfico (mesma função de tempo), sobe enquanto as cápsulas caem e desce devagar quando param.
 * Cada cápsula que cai abre ondas na superfície. Marcas fixas: basal, +50%, +100%.
 * Modelo ilustrativo (ver model.ts).
 */

const I = STATION.tank;
const { H, R, BOTTOM } = TANK;
const NBUB = 34;
const NCAP = 6;
const DROPS = 4;
const CAP_RATE = 0.55;
const LIQ_R = R - 0.12;

/** Onde cada cápsula cai (x, z no referencial da estação). */
/* Cores dos anéis acesos (fora do tone mapping, acima de 1 para o bloom): uma vez, não a cada render. */
const BASE_RING = new THREE.Color(C.carno).multiplyScalar(1.8);
const MARK_BASAL = new THREE.Color('#f1f5f9').multiplyScalar(1.4);
const MARK_GAIN = new THREE.Color('#a5b4fc').multiplyScalar(1.1);
const MENISCUS = new THREE.Color(C.carnoSoft).multiplyScalar(1.7);

const CAP_XZ = Array.from({ length: NCAP }, (_, k) => [Math.sin(k * 2.3) * 1.2, Math.cos(k * 1.7) * 1.2] as const);

const Glass = () => {
    const { bind, lit } = useStructure('tanque');
    const glass = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({
        color: '#e0e7ff', roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
        transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.8,
        emissive: '#312e81', emissiveIntensity: 0.15,
    }), '#c7d2fe', 3.2, 0.9), []);
    const metal = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#475569', metalness: 0.85, roughness: 0.28, clearcoat: 0.6, envMapIntensity: 1.4 }), []);
    useLayoutEffect(() => { glass.setValues({ emissiveIntensity: lit ? 0.8 : 0.15 }); }, [lit, glass]);
    return (
        <group {...bind}>
            <mesh position={[0, BOTTOM + H / 2, 0]} material={glass} renderOrder={6}>
                <cylinderGeometry args={[R, R, H, 72, 1, true]} />
            </mesh>
            {/* fundo grosso de vidro e base metálica com um anel aceso */}
            <mesh position={[0, BOTTOM - 0.05, 0]} material={glass}>
                <cylinderGeometry args={[R, R, 0.3, 72]} />
            </mesh>
            <mesh position={[0, BOTTOM - 0.45, 0]} material={metal}>
                <cylinderGeometry args={[R + 0.35, R + 0.6, 0.5, 72]} />
            </mesh>
            <mesh position={[0, BOTTOM - 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[R + 0.36, 0.045, 8, 96]} />
                <meshBasicMaterial color={BASE_RING} toneMapped={false} />
            </mesh>
            {[1, 1.5, 2].map(r => (
                <mesh key={r} position={[0, levelY(r), 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[R + 0.03, r === 1 ? 0.05 : 0.03, 8, 96]} />
                    <meshBasicMaterial color={r === 1 ? MARK_BASAL : MARK_GAIN} toneMapped={false} />
                </mesh>
            ))}
            <mesh position={[0, BOTTOM + H, 0]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
                <torusGeometry args={[R + 0.05, 0.11, 12, 96]} />
            </mesh>
        </group>
    );
};

/** Cápsula de duas cores (tampa clara, corpo violeta), como as do suplemento. */
const useCapsuleGeometry = () => useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.22, 0.5, 6, 14);
    const pos = g.getAttribute('position');
    const col = new Float32Array(pos.count * 3);
    const a = new THREE.Color('#f5f3ff');
    const b = new THREE.Color(C.carno);
    for (let i = 0; i < pos.count; i++) {
        const c = pos.getY(i) > 0.02 ? a : b;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
}, []);

export const TankStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    const liquid = useRef<THREE.Mesh>(null);
    const surface = useRef<THREE.Mesh>(null);
    const meniscus = useRef<THREE.Mesh>(null);
    const caps = useRef<THREE.InstancedMesh>(null);
    const liqMat = useMemo(() => makeLiquidMaterial(), []);
    const surfMat = useMemo(() => makeSurfaceMaterial(), []);
    const surfGeo = useMemo(() => new THREE.RingGeometry(0.001, LIQ_R, 72, 22), []);
    const capGeo = useCapsuleGeometry();
    const capMat = useMemo(() => new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, emissive: '#4c1d95', emissiveIntensity: 0.35 }), []);
    const bubbles = useGlowMesh(NBUB, C.carnoSoft, 1.1, 1.6);
    const spray = useGlowMesh(NCAP * DROPS, C.carnoSoft, 1.4, 1.6);
    const seeds = useMemo(() => Array.from({ length: NBUB }, (_, k) => randoms(1200 + k, 3)), []);
    useFrame(({ clock }) => {
        if (!g.current) return;
        const vis = stationWeight(timeRef.current.t, I) > 0;
        showStation(g.current, vis);
        if (!vis || !liquid.current || !surface.current || !meniscus.current || !caps.current) return;
        const sim = useCarnoSim.getState();
        const { gpd, weeks } = sim;
        const t = clock.elapsedTime;
        const w = playWeek(performance.now() / 1000);
        const ratio = 1 + gainAtWeek(w, sim) / 100;
        const top = levelY(ratio);
        const h = top - BOTTOM;
        liquid.current.scale.set(1, h, 1);
        liquid.current.position.y = BOTTOM + h / 2;
        surface.current.position.y = top;
        meniscus.current.position.y = top + 0.02;
        setShaderTime(liqMat, t);
        setShaderTime(surfMat, t);
        const loading = w <= weeks;
        for (let k = 0; k < NBUB; k++) {
            const q = seeds[k];
            const u = frac(t * (0.22 + q[2] * 0.2) + q[0]);
            const a = q[1] * Math.PI * 2 + u * 2;
            const rad = 0.4 + q[0] * 2.1;
            const y = BOTTOM + 0.2 + u * (h - 0.3);
            const fade = Math.min(u / 0.1, (1 - u) / 0.08, 1) * (loading ? 1 : 0.35);
            putGlow(bubbles, k, Math.cos(a) * rad, y, Math.sin(a) * rad, 0.32 + q[2] * 0.25, 0.75 * fade);
        }
        flushGlow(bubbles);
        // cápsulas caindo no tanque (quantas, conforme a dose do dia); cada queda abre ondas e respingos
        const active = loading ? Math.round((gpd / 6.4) * NCAP) : 0;
        const splash = surfMat.uniforms.uSplash.value as THREE.Vector4[];
        for (let k = 0; k < NCAP; k++) {
            const u = frac(t * CAP_RATE + k / NCAP);
            const [cx, cz] = CAP_XZ[k];
            const y = BOTTOM + H + 4.5 - u * (BOTTOM + H + 4.5 - top);
            const on = k < active;
            putInstance(caps.current, k, cx, y, cz, on ? Math.min((1 - u) / 0.12, 1) : 0, t * 0.8 + k, 0, k * 0.7 + t * 0.5);
            const age = u / CAP_RATE;
            if (k < MAX_SPLASH) splash[k].set(cx, -cz, age, on ? 1 : 0);
            for (let d = 0; d < DROPS; d++) {
                const a = d * (Math.PI / 2) + k;
                const s = age * 1.4;
                const show = on && age < 0.55 ? 1 - age / 0.55 : 0;
                putGlow(spray, k * DROPS + d, cx + Math.cos(a) * s * 0.9, top + s * 1.6 - s * s * 2.6, cz + Math.sin(a) * s * 0.9, 0.35 * show, show);
            }
        }
        caps.current.instanceMatrix.needsUpdate = true;
        flushGlow(spray);
    });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <mesh ref={liquid} position={[0, BOTTOM + 1, 0]} material={liqMat}>
                <cylinderGeometry args={[LIQ_R, LIQ_R, 1, 72, 1, true]} />
            </mesh>
            <mesh ref={surface} rotation={[-Math.PI / 2, 0, 0]} geometry={surfGeo} material={surfMat} />
            <mesh ref={meniscus} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[LIQ_R - 0.02, 0.06, 8, 96]} />
                <meshBasicMaterial color={MENISCUS} toneMapped={false} />
            </mesh>
            <primitive object={bubbles} />
            <instancedMesh ref={caps} args={[capGeo, capMat, NCAP]} frustumCulled={false} />
            <primitive object={spray} />
            <Glass />
        </group>
    );
};
