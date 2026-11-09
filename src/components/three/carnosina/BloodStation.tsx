import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C } from '../../sims/kit/palette';
import { frac, putInstance, randoms, showStation, stationWeight, type TimeBox } from './common';
import { flushGlow, moleculeMaterial, putGlow, tissueMaterial, withRim } from './fx';
import { STATION, stationX } from './layout';
import { AMIDE_C, makeCarnosineParts } from './molecule';
import { redCellGeometry, wobble } from './shapes';
import { useGlowMesh } from './useGlow';
import { endotheliumMaterial, makeTimeUniform, redCellMaterial, tickTime, type TimeUniform } from './tissueShaders';
import { useStructure } from './useStructure';

/*
 * Etapa 2 — sangue: um vaso com hemácias e carnosina ingerida passando. Cada carnosina cruza uma
 * carnosinase sérica (CN1, verde) e é cortada na ligação peptídica: a metade β-alanina (violeta) e a
 * histidina (ardósia, anel ciano) seguem separadas; cada corte solta um clarão no ponto da ligação.
 * O vaso aparece em corte (a parede aberta para a câmera). O tempo da animação é ilustrativo.
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

const R_OUT = 4.6;
const R_IN = 4.2;
/** Abertura do corte, voltada para a câmera (+z). */
const GAP = 1.9;
const NMOTE = 48;

/** Vaso em corte: parede externa, endotélio por dentro (irregular) e a borda do corte. */
const Vessel = ({ time }: { time: TimeUniform }) => {
    const outer = useMemo(() => {
        const g = new THREE.CylinderGeometry(R_OUT, R_OUT, LEN + 4, 64, 24, true, GAP / 2, Math.PI * 2 - GAP);
        g.rotateZ(Math.PI / 2);
        return g;
    }, []);
    const inner = useMemo(() => {
        const g = new THREE.CylinderGeometry(R_IN, R_IN, LEN + 4, 96, 60, true, GAP / 2, Math.PI * 2 - GAP);
        const pos = g.getAttribute('position');
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            // células endoteliais: calombos alongados no sentido do fluxo
            const a = Math.atan2(v.x, v.z);
            const bump = Math.max(Math.sin(a * 14) * Math.sin(v.y * 1.1 + Math.floor(a * 14 / Math.PI) * 1.7), 0) ** 2 * 0.16 + wobble(v.x, v.y * 0.4, v.z, 5) * 0.04;
            const k = (R_IN - bump) / R_IN;
            pos.setXYZ(i, v.x * k, v.y, v.z * k);
        }
        g.computeVertexNormals();
        g.rotateZ(Math.PI / 2);
        return g;
    }, []);
    // as duas bordas do corte numa geometria só (um draw call)
    const lip = useMemo(() => {
        const lipY = (R_IN + R_OUT) / 2;
        const parts = [GAP / 2, -GAP / 2].map(a => {
            const b = new THREE.BoxGeometry(LEN + 4, R_OUT - R_IN, 0.06);
            b.rotateX(Math.PI / 2 - a);
            b.translate(0, Math.sin(a) * lipY, Math.cos(a) * lipY);
            return b;
        });
        const g = mergeGeometries(parts);
        parts.forEach(p => p.dispose());
        return g;
    }, []);
    const outerMat = useMemo(() => withRim(tissueMaterial('#9f1239', '#fda4af', '#4c0519', { transparent: true, opacity: 0.55, depthWrite: false, side: THREE.FrontSide }), '#fb7185', 2.6, 0.6), []);
    const innerMat = useMemo(() => endotheliumMaterial(tissueMaterial('#8a2342', '#fecdd3', '#3b0716', { side: THREE.BackSide }), time, R_IN), [time]);
    const lipMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e11d48', emissive: '#9f1239', emissiveIntensity: 0.6, roughness: 0.5 }), []);
    return (
        <group>
            <mesh geometry={inner} material={innerMat} />
            <mesh geometry={outer} material={outerMat} renderOrder={4} />
            <mesh geometry={lip} material={lipMat} />
        </group>
    );
};

/** Pontinhos do plasma correndo no sentido do fluxo (dão direção ao vaso). */
const PlasmaFlow = ({ timeRef }: { timeRef: TimeBox }) => {
    const glow = useGlowMesh(NMOTE, '#fecdd3', 0.4, 0.5);
    const seeds = useMemo(() => Array.from({ length: NMOTE }, (_, k) => randoms(380 + k, 4)), []);
    useFrame(({ clock }) => {
        if (stationWeight(timeRef.current.t, I) <= 0) return;
        const t = clock.elapsedTime;
        for (let k = 0; k < NMOTE; k++) {
            const q = seeds[k];
            const x = -LEN / 2 + frac(t / 9 + q[0]) * LEN;
            const a = q[1] * Math.PI * 2;
            const r = q[2] * 3.6;
            const fade = Math.min((x + LEN / 2) / 2, (LEN / 2 - x) / 2, 1);
            putGlow(glow, k, x, Math.sin(a) * r, Math.cos(a) * r * 0.8 - 0.6, 0.3 + q[3] * 0.4, 0.7 * fade);
        }
        flushGlow(glow);
    });
    return <primitive object={glow} />;
};

const Enzymes = ({ timeRef }: { timeRef: TimeBox }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('cn1');
    const geo = useMemo(() => {
        const g = new THREE.SphereGeometry(1, 48, 34, 0.55, Math.PI * 2 - 1.1);
        const pos = g.getAttribute('position');
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            v.multiplyScalar(1 + wobble(v.x * 2.2, v.y * 2.2, v.z * 2.2, 7) * 0.13 + wobble(v.x * 6, v.y * 6, v.z * 6, 2) * 0.03);
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        g.computeVertexNormals();
        g.rotateZ(Math.PI / 2);
        return g;
    }, []);
    const mat = useMemo(() => withRim(new THREE.MeshPhysicalMaterial({
        color: '#34D399', emissive: '#065f46', emissiveIntensity: 0.5, roughness: 0.45, clearcoat: 0.7, clearcoatRoughness: 0.3,
        sheen: 0.6, sheenColor: new THREE.Color('#a7f3d0'), side: THREE.DoubleSide,
    }), '#6ee7b7', 2.4, 0.7), []);
    useLayoutEffect(() => { mat.setValues({ emissiveIntensity: lit ? 1.4 : 0.5 }); }, [lit, mat]);
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
    const mat = useMemo(() => moleculeMaterial('#1e1b4b', 0.35), []);
    const ringMat = useMemo(() => moleculeMaterial('#0e7490', 0.8), []);
    const flash = useGlowMesh(NM, '#f5f3ff', 1.6, 2.2);
    const spark = useGlowMesh(NM, C.carno, 1.4, 1);
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
            // clarão no ponto da ligação logo que a CN1 corta, e um halo violeta que se abre
            const burst = cut > 0 && cut < 0.3 ? Math.sin((cut / 0.3) * Math.PI) : 0;
            const ax = x + AMIDE_C.x * s;
            const ay = y + AMIDE_C.y * s;
            putGlow(flash, k, ax, ay, z + 0.3, 1.6 * burst * fade, burst * fade);
            putGlow(spark, k, ax, ay, z + 0.2, (1 + cut * 9) * (cut > 0 && cut < 0.45 ? 1 : 0), (1 - cut / 0.45) * 0.6 * fade);
        }
        flushGlow(flash);
        flushGlow(spark);
        ba.current.instanceMatrix.needsUpdate = true;
        his.current.instanceMatrix.needsUpdate = true;
        ring.current.instanceMatrix.needsUpdate = true;
        amide.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <group {...bind}>
            <instancedMesh ref={ba} args={[parts.ba, mat, NM]} frustumCulled={false} />
            <instancedMesh ref={his} args={[parts.his, mat, NM]} frustumCulled={false} />
            <instancedMesh ref={ring} args={[parts.ring, ringMat, NM]} frustumCulled={false} />
            <instancedMesh ref={amide} args={[parts.amide, mat, NM]} frustumCulled={false} />
            <primitive object={flash} />
            <primitive object={spark} />
        </group>
    );
};

const RedCells = ({ timeRef }: { timeRef: TimeBox }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('hemacia');
    const geo = useMemo(() => redCellGeometry(30), []);
    const mat = useMemo(() => redCellMaterial(new THREE.MeshPhysicalMaterial({ color: '#d42424', emissive: '#7f1d1d', emissiveIntensity: 0.4, roughness: 0.38, clearcoat: 0.8, clearcoatRoughness: 0.25, sheen: 0.8, sheenColor: new THREE.Color('#fecaca') })), []);
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
            putInstance(m, k, x, Math.sin(a) * rad, Math.cos(a) * rad * 0.8 - 0.8, 1.2 * fade, t * 0.4 + r[3] * 6, t * 0.3 + k, 0);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={ref} args={[geo, mat, NR]} frustumCulled={false} {...bind} />;
};

export const BloodStation = ({ timeRef }: { timeRef: TimeBox }) => {
    const g = useRef<THREE.Group>(null);
    const time = useMemo(() => makeTimeUniform(), []);
    useFrame(({ clock }) => {
        if (!g.current) return;
        const vis = stationWeight(timeRef.current.t, I) > 0;
        showStation(g.current, vis);
        if (vis) tickTime(time, clock.elapsedTime);
    });
    return (
        <group ref={g} position={[stationX(I), 0, 0]}>
            <Vessel time={time} />
            <PlasmaFlow timeRef={timeRef} />
            <RedCells timeRef={timeRef} />
            <Enzymes timeRef={timeRef} />
            <Carnosines timeRef={timeRef} />
        </group>
    );
};
