import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { lerp, smooth } from '../shared/math';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { STATION, stationX } from './layout';
import { useStructure } from './useStructure';

/*
 * Etapa 3 — sarcolema: bicamada lipídica horizontal (fora em cima, sarcoplasma embaixo) com dois
 * TauT e um PAT1. A β-alanina (violeta) usa os dois; a taurina (ardósia clara) disputa só o TauT.
 */

const I = STATION.membrane;
const HEAD_Y = 0.62;
type Gate = { x: number; z: number; kind: 'taut' | 'pat1' };
const GATES: Gate[] = [
    { x: -3.2, z: -0.6, kind: 'taut' },
    { x: 0.6, z: 2.2, kind: 'taut' },
    { x: 4.4, z: -0.4, kind: 'pat1' },
];
const NB = 34;
const NT = 26;

const HEADS: [number, number][] = [];
for (let ix = 0; ix < 30; ix++) {
    for (let iz = 0; iz < 17; iz++) {
        const x = -11 + ix * 0.76 + (iz % 2) * 0.38;
        const z = -6 + iz * 0.74;
        if (GATES.every(g => Math.hypot(x - g.x, z - g.z) > 1.55)) HEADS.push([x, z]);
    }
}

const Bilayer = () => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const geo = useMemo(() => new THREE.SphereGeometry(0.34, 10, 8), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c9a66b', roughness: 0.6, emissive: '#3b2a12', emissiveIntensity: 0.4 }), []);
    useLayoutEffect(() => {
        const m = ref.current;
        if (!m) return;
        HEADS.forEach(([x, z], k) => {
            putInstance(m, k * 2, x, HEAD_Y, z, 1);
            putInstance(m, k * 2 + 1, x, -HEAD_Y, z, 1);
        });
        m.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <group>
            <instancedMesh ref={ref} args={[geo, mat, HEADS.length * 2]} />
            <mesh>
                <boxGeometry args={[23.5, 0.9, 12.8]} />
                <meshStandardMaterial color="#3a2f1d" transparent opacity={0.55} roughness={0.9} />
            </mesh>
        </group>
    );
};

const TransporterMesh = ({ gate }: { gate: Gate }) => {
    const { bind, lit } = useStructure(gate.kind);
    const geo = useMemo(() => {
        const pts = [0.95, 0.8, 0.62, 0.8, 0.95].map((r, k) => new THREE.Vector2(r + 0.35, -1.7 + k * 0.85));
        return new THREE.LatheGeometry(pts, 28);
    }, []);
    const rim = gate.kind === 'taut' ? C.carnoSoft : C.carno;
    return (
        <group position={[gate.x, 0, gate.z]} {...bind}>
            <mesh geometry={geo}>
                <meshStandardMaterial color={gate.kind === 'taut' ? '#7dd3c0' : '#93c5d8'} roughness={0.35} emissive={gate.kind === 'taut' ? '#0f4c45' : '#0c3b4f'} emissiveIntensity={lit ? 1.5 : 0.55} side={THREE.DoubleSide} />
            </mesh>
            {[1.7, -1.7].map(y => (
                <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.3, 0.09, 8, 36]} />
                    <meshBasicMaterial color={new THREE.Color(rim).multiplyScalar(1.4)} toneMapped={false} />
                </mesh>
            ))}
        </group>
    );
};

/** Laço de uma molécula: vaga acima → entra na porta → atravessa → se espalha no sarcoplasma. */
const pathAt = (u: number, g: Gate, r: readonly number[], out: THREE.Vector3) => {
    const sx = g.x + (r[0] - 0.5) * 9;
    const sz = g.z + (r[1] - 0.5) * 7;
    const sy = 2.6 + r[2] * 3.4;
    if (u < 0.55) {
        const s = smooth(u / 0.55);
        return out.set(lerp(sx, g.x, s) + Math.sin(u * 20 + r[3] * 9) * 0.25 * (1 - s), lerp(sy, 2.1, s), lerp(sz, g.z, s));
    }
    if (u < 0.7) return out.set(g.x, lerp(2.1, -2.1, smooth((u - 0.55) / 0.15)), g.z);
    const s = smooth((u - 0.7) / 0.3);
    return out.set(lerp(g.x, sx, s), lerp(-2.1, -2.8 - r[2] * 3, s), lerp(g.z, sz, s));
};

interface FlowProps { timeRef: TimeBox; n: number; color: string; seed: number; gates: Gate[]; period: number; id: 'bala' | 'taurina' }

const Flow = ({ timeRef, n, color, seed, gates, period, id }: FlowProps) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind } = useStructure(id);
    const geo = useMemo(() => new THREE.SphereGeometry(0.22, 12, 10), []);
    const mat = useMemo(() => glowMaterial(color, 1.25), [color]);
    const seeds = useMemo(() => Array.from({ length: n }, (_, k) => randoms(seed + k, 4)), [n, seed]);
    const p = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        const m = ref.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < n; k++) {
            const u = frac(t / period + k / n);
            pathAt(u, gates[k % gates.length], seeds[k], p);
            putInstance(m, k, p.x, p.y, p.z, Math.min(u / 0.06, (1 - u) / 0.06, 1));
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={ref} args={[geo, mat, n]} frustumCulled={false} {...bind} />;
};

const TAUT_ONLY = GATES.filter(g => g.kind === 'taut');

export const MembraneStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { if (g.current) g.current.visible = stationWeight(timeRef.current.t, I) > 0; });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Bilayer />
            {GATES.map(gate => <TransporterMesh key={`${gate.x}`} gate={gate} />)}
            <Flow timeRef={timeRef} n={NB} color={C.carno} seed={700} gates={GATES} period={9} id="bala" />
            <Flow timeRef={timeRef} n={NT} color="#94A3B8" seed={800} gates={TAUT_ONLY} period={10.5} id="taurina" />
        </group>
    );
};
