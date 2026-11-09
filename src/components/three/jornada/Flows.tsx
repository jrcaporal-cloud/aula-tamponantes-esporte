import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng } from '../shared/math';
import { ESOPHAGUS, GUT, STOMACH, VESSEL, buildLut, lutPoint, type Lut } from './anatomy';
import { SPHERE_LO, additiveMaterial, commit, glowMaterial, pulseAt, pushStretched, sleep } from './materials';
import { SYS, type JourneyStateRef } from './state';

/*
 * Dois fluxos ao longo de trilhas pré-amostradas (uma malha instanciada cada, escrita por quadro):
 *  - a dose (etapa 0): pontos ciano que fazem o percurso inteiro, do esôfago ao capilar;
 *  - o HCO₃⁻ no sangue: a densidade de íons acesos acompanha o nível de bicarbonato do quadro.
 * Cada partícula deixa um rastro curto (instâncias aditivas atrás dela) e se estica no sentido do
 * movimento. No sangue o fluxo é pulsátil: a onda de pulso (a mesma que acende a parede) empurra os íons.
 */

const P = new THREE.Vector3();
const Q = new THREE.Vector3();
const DIR = new THREE.Vector3();
const TRAIL = 3;

/** Próximos índices livres da cabeça e do rastro no quadro (escrita compacta). */
const AT = { h: 0, t: 0 };

/** Escreve cabeça esticada + rastro de uma partícula que anda pela trilha `lut` (só o que aparece). */
const writeParticle = (
    head: THREE.InstancedMesh, tail: THREE.InstancedMesh, lut: Lut, u: number, a: number, b: number, s: number, gap: number, stretch: number,
) => {
    if (s <= 1e-4) return;
    lutPoint(lut, u, a, b, P);
    lutPoint(lut, Math.min(u + 0.002, 1), a, b, Q);
    AT.h = pushStretched(head, AT.h, P, DIR.subVectors(Q, P), s, s * stretch);
    for (let j = 1; j <= TRAIL; j++) {
        const uj = u - gap * j;
        if (uj < 0) break;
        const k = 1 - j / (TRAIL + 1);
        lutPoint(lut, uj, a, b, Q);
        AT.t = pushStretched(tail, AT.t, Q, DIR, s * (0.3 + 0.45 * k), s * stretch * (0.7 + 0.6 * k));
    }
};

/** Liga ou apaga o par cabeça + rastro; `true` = escrever o quadro. */
const awake = (head: THREE.InstancedMesh, tail: THREE.InstancedMesh, on: boolean): boolean => {
    AT.h = 0;
    AT.t = 0;
    if (on) return true;
    sleep(head);
    sleep(tail);
    return false;
};

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
    const tail = useRef<THREE.InstancedMesh>(null);
    const mat = useMemo(() => glowMaterial(C.baseSoft, 1.5), []);
    const tailMat = useMemo(() => additiveMaterial(C.base, 0.32, 1.2), []);
    const seeds = useMemo(() => {
        const r = rng(42);
        return Array.from({ length: STREAM_N }, () => ({ u0: r(), a: (r() - 0.5) * 1.1, b: (r() - 0.5) * 1.1, s: 0.07 + r() * 0.05 }));
    }, []);
    useEffect(() => () => { mat.dispose(); tailMat.dispose(); }, [mat, tailMat]);
    useFrame(({ clock }) => {
        const m = mesh.current;
        const tl = tail.current;
        if (!m || !tl) return;
        const w = stateRef.current.f.w[SYS.stream];
        if (!awake(m, tl, w > 1e-3)) return;
        const t = clock.elapsedTime;
        for (let i = 0; i < STREAM_N; i++) {
            const d = seeds[i];
            const u = (d.u0 + t * 0.03) % 1;
            // some nas pontas: nasce no esôfago, termina no capilar
            const edge = Math.min(u / 0.03, (1 - u) / 0.05, 1);
            writeParticle(m, tl, ROUTE_LUT, u, d.a, d.b, d.s * w * edge, 0.003, 1.4);
        }
        commit(m, AT.h);
        commit(tl, AT.t);
    });
    return (
        <group>
            <instancedMesh ref={mesh} args={[SPHERE_LO, mat, STREAM_N]} frustumCulled={false} />
            <instancedMesh ref={tail} args={[SPHERE_LO, tailMat, STREAM_N * TRAIL]} frustumCulled={false} />
        </group>
    );
};

const ION_N = 150;
const VESSEL_LUT = buildLut(VESSEL, 260);

const BloodIons = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const tail = useRef<THREE.InstancedMesh>(null);
    /** Posição de cada íon ao longo do vaso, integrada por quadro (a velocidade pulsa). */
    const pos = useRef<Float32Array | null>(null);
    const mat = useMemo(() => glowMaterial(C.base, 1.45), []);
    const tailMat = useMemo(() => additiveMaterial(C.base, 0.22, 1.1), []);
    const seeds = useMemo(() => {
        const r = rng(7);
        return Array.from({ length: ION_N }, () => {
            const th = r() * Math.PI * 2;
            const rr = Math.sqrt(r()) * 0.7;
            return { u0: r(), a: Math.cos(th) * rr, b: Math.sin(th) * rr, sp: 0.8 + r() * 0.4, s: 0.06 + r() * 0.03 };
        });
    }, []);
    useEffect(() => () => { mat.dispose(); tailMat.dispose(); }, [mat, tailMat]);
    useFrame(({ clock }, delta) => {
        const m = mesh.current;
        const tl = tail.current;
        if (!m || !tl) return;
        const { f } = stateRef.current;
        const n = Math.round(ION_N * Math.min(Math.max(f.blood, 0), 1) * f.w[SYS.blood]);
        const t = clock.elapsedTime;
        const dt = Math.min(delta, 0.05);
        const us = pos.current ?? (pos.current = Float32Array.from(seeds, d => d.u0));
        // a posição de todos segue andando (sem custo de GPU); só os `n` acesos são escritos
        for (let i = 0; i < ION_N; i++) {
            const push = pulseAt(us[i], t);
            us[i] = (us[i] + dt * 0.028 * seeds[i].sp * (0.55 + 1.5 * push)) % 1;
        }
        if (!awake(m, tl, n > 0)) return;
        for (let i = 0; i < n; i++) {
            const d = seeds[i];
            const push = pulseAt(us[i], t);
            writeParticle(m, tl, VESSEL_LUT, us[i], d.a, d.b, d.s * 0.9, 0.0035 * (1 + 1.2 * push), 1.15 + push * 0.8);
        }
        commit(m, AT.h);
        commit(tl, AT.t);
    });
    return (
        <group>
            <instancedMesh ref={mesh} args={[SPHERE_LO, mat, ION_N]} frustumCulled={false} />
            <instancedMesh ref={tail} args={[SPHERE_LO, tailMat, ION_N * TRAIL]} frustumCulled={false} />
        </group>
    );
};

export const Flows = ({ stateRef }: { stateRef: JourneyStateRef }) => (
    <group>
        <DoseStream stateRef={stateRef} />
        <BloodIons stateRef={stateRef} />
    </group>
);
