import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { frac, putInstance, randoms, stationWeight, type TimeBox } from './common';
import { STATION, stationX } from './layout';
import { makeCarnosineParts } from './molecule';
import { useStructure } from './useStructure';

/*
 * Etapa 2 — sangue: um vaso com hemácias e carnosina ingerida passando. Cada carnosina cruza uma
 * carnosinase sérica (CN1, verde) e é cortada na ligação peptídica: a metade β-alanina (violeta) e a
 * histidina (ardósia, anel ciano) seguem separadas. O tempo da animação é ilustrativo.
 */

const I = STATION.blood;
const LEN = 30;
const NE = 7;
const NM = 21;
const NR = 18;
const MOL_S = 0.34;
const ENZ: [number, number, number][] = Array.from({ length: NE }, (_, e) => {
    const r = randoms(300 + e, 2);
    return [-11 + e * 3.1, -1.8 + r[0] * 3.6, -1.2 + r[1] * 2];
});

/** Posição x da carnosina `k` no instante `t` (laço ao longo do vaso). */
const molX = (t: number, k: number) => -LEN / 2 + frac(t / 16 + k / NM + (k % NE) * 0.013) * LEN;

const Vessel = () => (
    <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[4.4, 4.4, LEN + 4, 40, 1, true]} />
        <meshStandardMaterial color="#9f1239" emissive="#4c0519" emissiveIntensity={0.5} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
);

const Enzymes = ({ timeRef }: { timeRef: TimeBox }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('cn1');
    const geo = useMemo(() => {
        const g = new THREE.SphereGeometry(1, 30, 22, 0.55, Math.PI * 2 - 1.1);
        g.rotateZ(Math.PI / 2);
        return g;
    }, []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#34D399', emissive: '#065f46', emissiveIntensity: 0.6, roughness: 0.4, side: THREE.DoubleSide }), []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.6 : 0.6 }); }, [lit, mat]);
    useFrame(({ clock }) => {
        const m = ref.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let e = 0; e < NE; e++) {
            // mastiga quando a molécula da sua faixa passa por ela
            let chew = 0;
            for (let k = e; k < NM; k += NE) {
                const d = molX(t, k) - ENZ[e][0];
                if (d > -0.6 && d < 1.4) chew = Math.max(chew, Math.sin(((d + 0.6) / 2) * Math.PI));
            }
            const [x, y, z] = ENZ[e];
            putInstance(m, e, x, y + Math.sin(t * 0.7 + e) * 0.15, z, 0.95 + chew * 0.18, 0, Math.PI, Math.sin(t * 0.5 + e) * 0.2 + chew * 0.4);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={ref} args={[geo, mat, NE]} frustumCulled={false} {...bind} />;
};

const Carnosines = ({ timeRef }: { timeRef: TimeBox }) => {
    const ba = useRef<THREE.InstancedMesh>(null);
    const his = useRef<THREE.InstancedMesh>(null);
    const ring = useRef<THREE.InstancedMesh>(null);
    const amide = useRef<THREE.InstancedMesh>(null);
    const { bind } = useStructure('carnosinaPlasma');
    const parts = useMemo(() => makeCarnosineParts(true), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.05, emissive: '#1e1b4b', emissiveIntensity: 0.4 }), []);
    const ringMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, emissive: '#0e7490', emissiveIntensity: 0.9 }), []);
    useFrame(({ clock }) => {
        if (!ba.current || !his.current || !ring.current || !amide.current) return;
        if (stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < NM; k++) {
            const [ex, ey, ez] = ENZ[k % NE];
            const x = molX(t, k);
            const y = ey + 0.15;
            const z = ez + 1.55;
            const cut = Math.min(Math.max((x - ex - 0.3) / 3.5, 0), 1);
            const fade = Math.min((x + LEN / 2) / 1.5, (LEN / 2 - x) / 1.5, 1);
            const s = MOL_S * fade;
            const spin = t * 0.6 + k;
            putInstance(ba.current, k, x - cut * 1.3, y + cut * 1.7, z + cut * 0.4, s, 0.3, Math.sin(spin) * 0.4, cut * 0.9);
            putInstance(his.current, k, x + cut * 0.9, y - cut * 1.5, z - cut * 0.2, s, 0.3, Math.sin(spin) * 0.4, -cut * 0.7);
            putInstance(ring.current, k, x + cut * 0.9, y - cut * 1.5, z - cut * 0.2, s, 0.3, Math.sin(spin) * 0.4, -cut * 0.7);
            putInstance(amide.current, k, x, y, z, cut > 0 ? 0 : s, 0.3, Math.sin(spin) * 0.4, 0);
        }
        [ba, his, ring, amide].forEach(r => { if (r.current) r.current.instanceMatrix.needsUpdate = true; });
    });
    return (
        <group {...bind}>
            <instancedMesh ref={ba} args={[parts.ba, mat, NM]} frustumCulled={false} />
            <instancedMesh ref={his} args={[parts.his, mat, NM]} frustumCulled={false} />
            <instancedMesh ref={ring} args={[parts.ring, ringMat, NM]} frustumCulled={false} />
            <instancedMesh ref={amide} args={[parts.amide, mat, NM]} frustumCulled={false} />
        </group>
    );
};

const RedCells = ({ timeRef }: { timeRef: TimeBox }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('hemacia');
    const geo = useMemo(() => new THREE.TorusGeometry(0.78, 0.44, 12, 26), []);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#dc2626', emissive: '#7f1d1d', emissiveIntensity: 0.45, roughness: 0.5 }), []);
    const seeds = useMemo(() => Array.from({ length: NR }, (_, k) => randoms(500 + k, 4)), []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.3 : 0.45 }); }, [lit, mat]);
    useFrame(({ clock }) => {
        const m = ref.current;
        if (!m || stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < NR; k++) {
            const r = seeds[k];
            const x = -LEN / 2 + frac(t / 12 + k / NR + r[0] * 0.05) * LEN;
            const a = r[1] * Math.PI * 2;
            const rad = 2.2 + r[2] * 1.5;
            const fade = Math.min((x + LEN / 2) / 1.5, (LEN / 2 - x) / 1.5, 1);
            putInstance(m, k, x, Math.sin(a) * rad, Math.cos(a) * rad * 0.8 - 0.8, fade, t * 0.4 + r[3] * 6, t * 0.3 + k, 0);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={ref} args={[geo, mat, NR]} frustumCulled={false} {...bind} />;
};

export const BloodStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { if (g.current) g.current.visible = stationWeight(timeRef.current.t, I) > 0; });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Vessel />
            <RedCells timeRef={timeRef} />
            <Enzymes timeRef={timeRef} />
            <Carnosines timeRef={timeRef} />
        </group>
    );
};
