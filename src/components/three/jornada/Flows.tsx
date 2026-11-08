import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng } from '../shared/math';
import { ESOPHAGUS, GUT, STOMACH, VESSEL, buildLut, lutPoint } from './anatomy';
import { HIDDEN, SPHERE_LO, glowMaterial, put } from './materials';
import { SYS, type JourneyStateRef } from './state';

/*
 * Dois fluxos ao longo de trilhas pré-amostradas (uma malha instanciada cada, escrita por quadro):
 *  - a dose (etapa 0): pontos ciano que fazem o percurso inteiro, do esôfago ao capilar;
 *  - o HCO₃⁻ no sangue: a densidade de íons acesos acompanha o nível de bicarbonato do quadro.
 */

const P = new THREE.Vector3();

/** Percurso inteiro da dose: esôfago → estômago → intestino → veia → capilar. */
const routeCurve = (): THREE.CatmullRomCurve3 => {
    const pts: THREE.Vector3[] = [];
    const sample = (c: THREE.Curve<THREE.Vector3>, a: number, b: number, n: number) => {
        for (let i = 0; i < n; i++) pts.push(c.getPointAt(a + ((b - a) * i) / n));
    };
    sample(ESOPHAGUS.curve, 0, 1, 6);
    sample(STOMACH.curve, 0.22, 1, 10);
    sample(GUT.curve, 0.02, 0.55, 26);
    sample(VESSEL.curve, 0.02, 1, 30);
    pts.push(VESSEL.curve.getPointAt(1));
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
};

const STREAM_N = 70;
const ROUTE_LUT = buildLut({ curve: routeCurve(), radius: () => 0.32 }, 420);

const DoseStream = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useMemo(() => glowMaterial(C.baseSoft, 1.5), []);
    const seeds = useMemo(() => {
        const r = rng(42);
        return Array.from({ length: STREAM_N }, () => ({ u0: r(), a: (r() - 0.5) * 1.1, b: (r() - 0.5) * 1.1, s: 0.07 + r() * 0.05 }));
    }, []);
    useEffect(() => () => mat.dispose(), [mat]);
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const w = stateRef.current.f.w[SYS.stream];
        const t = clock.elapsedTime;
        for (let i = 0; i < STREAM_N; i++) {
            const d = seeds[i];
            const u = (d.u0 + t * 0.03) % 1;
            // some nas pontas: nasce no esôfago, termina no capilar
            const edge = Math.min(u / 0.03, (1 - u) / 0.05, 1);
            put(m, i, lutPoint(ROUTE_LUT, u, d.a, d.b, P), d.s * w * edge);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={mesh} args={[SPHERE_LO, mat, STREAM_N]} frustumCulled={false} />;
};

const ION_N = 150;
const VESSEL_LUT = buildLut(VESSEL, 260);

const BloodIons = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const mat = useMemo(() => glowMaterial(C.base, 1.45), []);
    const seeds = useMemo(() => {
        const r = rng(7);
        return Array.from({ length: ION_N }, () => {
            const th = r() * Math.PI * 2;
            const rr = Math.sqrt(r()) * 0.7;
            return { u0: r(), a: Math.cos(th) * rr, b: Math.sin(th) * rr, sp: 0.8 + r() * 0.4, s: 0.06 + r() * 0.03 };
        });
    }, []);
    useEffect(() => () => mat.dispose(), [mat]);
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const { f } = stateRef.current;
        const n = Math.round(ION_N * Math.min(Math.max(f.blood, 0), 1) * f.w[SYS.blood]);
        const t = clock.elapsedTime;
        for (let i = 0; i < ION_N; i++) {
            if (i >= n) { m.setMatrixAt(i, HIDDEN); continue; }
            const d = seeds[i];
            const u = (d.u0 + t * 0.028 * d.sp) % 1;
            put(m, i, lutPoint(VESSEL_LUT, u, d.a, d.b, P), d.s);
        }
        m.instanceMatrix.needsUpdate = true;
    });
    return <instancedMesh ref={mesh} args={[SPHERE_LO, mat, ION_N]} frustumCulled={false} />;
};

export const Flows = ({ stateRef }: { stateRef: JourneyStateRef }) => (
    <group>
        <DoseStream stateRef={stateRef} />
        <BloodIons stateRef={stateRef} />
    </group>
);
