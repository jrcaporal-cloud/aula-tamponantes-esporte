import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { levelY, STATION, stationX, TANK } from './layout';
import { gainAtWeek, playWeek } from './model';
import { useCarnoSim } from './store';
import { useStructure } from './useStructure';

/*
 * Etapa 5 — o tanque: um cilindro de vidro com a carnosina (violeta). O nível segue o cursor do
 * gráfico (mesma função de tempo), sobe enquanto as cápsulas caem e desce devagar quando param.
 * Marcas fixas: basal, +50%, +100%. Modelo ilustrativo (ver model.ts).
 */

const I = STATION.tank;
const { H, R, BOTTOM } = TANK;
const NBUB = 26;
const NCAP = 6;

const Glass = () => {
    const { bind, lit } = useStructure('tanque');
    return (
        <group {...bind}>
            <mesh position={[0, BOTTOM + H / 2, 0]}>
                <cylinderGeometry args={[R, R, H, 56, 1, true]} />
                <meshStandardMaterial color="#c7d2fe" emissive="#312e81" emissiveIntensity={lit ? 0.9 : 0.25} transparent opacity={0.16} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
            <mesh position={[0, BOTTOM - 0.2, 0]}>
                <cylinderGeometry args={[R + 0.25, R + 0.4, 0.4, 56]} />
                <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
            {[1, 1.5, 2].map(r => (
                <mesh key={r} position={[0, levelY(r), 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[R + 0.04, r === 1 ? 0.06 : 0.035, 8, 64]} />
                    <meshBasicMaterial color={r === 1 ? '#e5e7eb' : '#94a3b8'} toneMapped={false} />
                </mesh>
            ))}
            <mesh position={[0, BOTTOM + H, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[R + 0.05, 0.1, 10, 64]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
            </mesh>
        </group>
    );
};

export const TankStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    const liquid = useRef<THREE.Mesh>(null);
    const surface = useRef<THREE.Mesh>(null);
    const bubbles = useRef<THREE.InstancedMesh>(null);
    const caps = useRef<THREE.InstancedMesh>(null);
    const bubGeo = useMemo(() => new THREE.SphereGeometry(0.13, 8, 6), []);
    const bubMat = useMemo(() => glowMaterial(C.carnoSoft, 1.2, 0.8), []);
    const capGeo = useMemo(() => new THREE.CapsuleGeometry(0.22, 0.5, 4, 10), []);
    const capMat = useMemo(() => glowMaterial(C.carno, 1.5), []);
    const seeds = useMemo(() => Array.from({ length: NBUB }, (_, k) => randoms(1200 + k, 3)), []);
    useFrame(({ clock }) => {
        if (!g.current) return;
        const vis = stationWeight(timeRef.current.t, I) > 0;
        g.current.visible = vis;
        if (!vis || !liquid.current || !surface.current || !bubbles.current || !caps.current) return;
        const { gpd, weeks } = useCarnoSim.getState();
        const t = clock.elapsedTime;
        const w = playWeek(performance.now() / 1000);
        const ratio = 1 + gainAtWeek(w, { gpd, weeks }) / 100;
        const top = levelY(ratio);
        const h = top - BOTTOM;
        liquid.current.scale.set(1, h, 1);
        liquid.current.position.y = BOTTOM + h / 2;
        surface.current.position.y = top + Math.sin(t * 2) * 0.03;
        const loading = w <= weeks;
        for (let k = 0; k < NBUB; k++) {
            const q = seeds[k];
            const u = frac(t * (0.25 + q[2] * 0.2) + q[0]);
            const a = q[1] * Math.PI * 2;
            const rad = 0.4 + q[0] * 2.1;
            putInstance(bubbles.current, k, Math.cos(a) * rad, BOTTOM + 0.2 + u * (h - 0.3), Math.sin(a) * rad, loading ? 1 : 0.4);
        }
        bubbles.current.instanceMatrix.needsUpdate = true;
        // cápsulas caindo no tanque: quantas, conforme a dose do dia
        const active = loading ? Math.round((gpd / 6.4) * NCAP) : 0;
        for (let k = 0; k < NCAP; k++) {
            const u = frac(t * 0.55 + k / NCAP);
            const y = BOTTOM + H + 4.5 - u * (BOTTOM + H + 4.5 - top);
            putInstance(caps.current, k, Math.sin(k * 2.3) * 1.2, y, Math.cos(k * 1.7) * 1.2, k < active ? Math.min((1 - u) / 0.12, 1) : 0, 0, 0, k * 0.7);
        }
        caps.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Glass />
            <mesh ref={liquid} position={[0, BOTTOM + 1, 0]}>
                <cylinderGeometry args={[R - 0.12, R - 0.12, 1, 56]} />
                <meshStandardMaterial color="#7c3aed" emissive="#5b21b6" emissiveIntensity={0.9} transparent opacity={0.78} roughness={0.25} />
            </mesh>
            <mesh ref={surface} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[R - 0.12, 56]} />
                <meshBasicMaterial color={new THREE.Color(C.carnoSoft).multiplyScalar(1.3)} toneMapped={false} transparent opacity={0.85} />
            </mesh>
            <instancedMesh ref={bubbles} args={[bubGeo, bubMat, NBUB]} frustumCulled={false} />
            <instancedMesh ref={caps} args={[capGeo, capMat, NCAP]} frustumCulled={false} />
        </group>
    );
};
