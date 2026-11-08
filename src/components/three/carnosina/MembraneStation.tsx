import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { lerp, smooth } from '../shared/math';
import { frac, glowMaterial, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { flushGlow, putGlow, withRim } from './fx';
import { STATION, stationX } from './layout';
import { transporterGeometry } from './shapes';
import { useGlowMesh } from './useGlow';
import { useStructure } from './useStructure';

/*
 * Etapa 3 — sarcolema: bicamada lipídica horizontal (fora em cima, sarcoplasma embaixo) com dois
 * TauT e um PAT1 (feixes de hélices em anel, com o poro no meio). A β-alanina (violeta) usa os dois;
 * a taurina (ardósia clara) disputa só o TauT. O poro acende quando uma molécula passa.
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

/** Calor de cada porta (0–1): sobe quando uma molécula atravessa, cai sozinho. Escrito pelos fluxos. */
type Heat = { current: Float32Array };

/** Aquece a porta `i` (uma molécula passando). */
const warm = (heat: Heat, i: number) => { heat.current[i] = Math.min(heat.current[i] + 0.08, 1.4); };
/** Esfria as portas com o tempo e devolve o calor da porta `i`, já limitado a 1. */
const cool = (heat: Heat, i: number, dt: number) => {
    heat.current[i] = Math.max(heat.current[i] - dt * 1.8, 0);
    return Math.min(heat.current[i], 1);
};

const TAIL_L = 0.46;

const Bilayer = () => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const tails = useRef<THREE.InstancedMesh>(null);
    const geo = useMemo(() => new THREE.SphereGeometry(0.34, 14, 10), []);
    const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#d9b77a', roughness: 0.42, clearcoat: 0.8, clearcoatRoughness: 0.2, emissive: '#3b2a12', emissiveIntensity: 0.35 }), []);
    const tailGeo = useMemo(() => {
        const g = new THREE.CylinderGeometry(0.055, 0.04, TAIL_L, 5, 1);
        g.translate(0, -TAIL_L / 2, 0);
        return g;
    }, []);
    const tailMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8a7044', roughness: 0.7, emissive: '#2a1c08', emissiveIntensity: 0.4 }), []);
    useLayoutEffect(() => {
        const m = ref.current;
        const tl = tails.current;
        if (!m || !tl) return;
        const jit = randoms(710, HEADS.length * 4);
        HEADS.forEach(([x, z], k) => {
            putInstance(m, k * 2, x, HEAD_Y, z, 1);
            putInstance(m, k * 2 + 1, x, -HEAD_Y, z, 1);
            // duas caudas por cabeça, para dentro da bicamada (as de baixo, viradas para cima)
            for (let j = 0; j < 2; j++) {
                const dx = (j - 0.5) * 0.16;
                const w = (jit[k * 4 + j] - 0.5) * 0.35;
                putInstance(tl, k * 4 + j, x + dx, HEAD_Y - 0.18, z, 1, w, 0, (j - 0.5) * 0.25);
                putInstance(tl, k * 4 + 2 + j, x + dx, -HEAD_Y + 0.18, z, 1, Math.PI + w, 0, (j - 0.5) * 0.25);
            }
        });
        m.instanceMatrix.needsUpdate = true;
        tl.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <group>
            <instancedMesh ref={ref} args={[geo, mat, HEADS.length * 2]} />
            <instancedMesh ref={tails} args={[tailGeo, tailMat, HEADS.length * 4]} />
        </group>
    );
};

const TransporterMesh = ({ gate }: { gate: Gate }) => {
    const { bind, lit } = useStructure(gate.kind);
    const geo = useMemo(() => transporterGeometry(gate.kind === 'taut' ? 10 : 9, 0.92, 1.75), [gate.kind]);
    const isTaut = gate.kind === 'taut';
    const mat = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({
        color: isTaut ? '#5eead4' : '#7dd3fc', roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.15,
        emissive: isTaut ? '#0f4c45' : '#0c3b4f', emissiveIntensity: 0.5,
    }), isTaut ? '#99f6e4' : '#bae6fd', 2.2, 0.6), [isTaut]);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.4 : 0.5 }); }, [lit, mat]);
    const rim = isTaut ? C.carnoSoft : C.carno;
    return (
        <group position={[gate.x, 0, gate.z]} {...bind}>
            <mesh geometry={geo} material={mat} />
            {[1.85, -1.85].map(y => (
                <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.32, 0.05, 8, 48]} />
                    <meshBasicMaterial color={new THREE.Color(rim).multiplyScalar(1.4)} toneMapped={false} />
                </mesh>
            ))}
        </group>
    );
};

/** Brilho dentro de cada poro, na intensidade do calor da porta. */
const PoreGlow = ({ timeRef, heat }: { timeRef: TimeBox; heat: Heat }) => {
    const glow = useGlowMesh(GATES.length * 3, C.carno, 1.3, 1.2);
    useFrame((_, delta) => {
        if (stationWeight(timeRef.current.t, I) <= 0) return;
        GATES.forEach((g, k) => {
            const a = cool(heat, k, delta);
            for (let j = 0; j < 3; j++) putGlow(glow, k * 3 + j, g.x, (j - 1) * 1.1, g.z, 1.5 + a * 1.4, 0.2 + a * 0.8);
        });
        flushGlow(glow);
    });
    return <primitive object={glow} />;
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

interface FlowProps { timeRef: TimeBox; n: number; color: string; seed: number; gates: Gate[]; period: number; id: 'bala' | 'taurina'; heat: Heat; glowK: number }

const TRAIL = 3;

const Flow = ({ timeRef, n, color, seed, gates, period, id, heat, glowK }: FlowProps) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind } = useStructure(id);
    const geo = useMemo(() => new THREE.SphereGeometry(0.2, 14, 10), []);
    const mat = useMemo(() => glowMaterial(color, 1.25), [color]);
    const glow = useGlowMesh(n * (TRAIL + 1), color, glowK, 1.2);
    const seeds = useMemo(() => Array.from({ length: n }, (_, k) => randoms(seed + k, 4)), [n, seed]);
    const p = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        const m = ref.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < n; k++) {
            const u = frac(t / period + k / n);
            const gate = gates[k % gates.length];
            pathAt(u, gate, seeds[k], p);
            const fade = Math.min(u / 0.06, (1 - u) / 0.06, 1);
            putInstance(m, k, p.x, p.y, p.z, fade);
            putGlow(glow, k * (TRAIL + 1), p.x, p.y, p.z, 1.1 * fade, 0.8 * fade);
            if (id === 'bala' && u > 0.55 && u < 0.7) {
                const gi = GATES.indexOf(gate);
                warm(heat, gi);
            }
            for (let j = 1; j <= TRAIL; j++) {
                const uj = u - j * 0.006;
                const f = uj > 0 ? fade * (1 - j / (TRAIL + 1)) : 0;
                pathAt(Math.max(uj, 0), gate, seeds[k], p);
                putGlow(glow, k * (TRAIL + 1) + j, p.x, p.y, p.z, 0.7 * f, 0.45 * f);
            }
        }
        m.instanceMatrix.needsUpdate = true;
        flushGlow(glow);
    });
    return (
        <group>
            <instancedMesh ref={ref} args={[geo, mat, n]} frustumCulled={false} {...bind} />
            <primitive object={glow} />
        </group>
    );
};

const TAUT_ONLY = GATES.filter(g => g.kind === 'taut');

export const MembraneStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    const heat = useRef(new Float32Array(GATES.length));
    useFrame(() => { if (g.current) g.current.visible = stationWeight(timeRef.current.t, I) > 0; });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Bilayer />
            {GATES.map(gate => <TransporterMesh key={`${gate.x}`} gate={gate} />)}
            <PoreGlow timeRef={timeRef} heat={heat} />
            <Flow timeRef={timeRef} n={NB} color={C.carno} seed={700} gates={GATES} period={9} id="bala" heat={heat} glowK={1.5} />
            <Flow timeRef={timeRef} n={NT} color="#94A3B8" seed={800} gates={TAUT_ONLY} period={10.5} id="taurina" heat={heat} glowK={0.7} />
        </group>
    );
};
