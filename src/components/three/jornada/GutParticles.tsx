import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng, smooth } from '../shared/math';
import { GUT, buildLut, lutPoint } from './anatomy';
import { HIDDEN, SPHERE_LO, glowMaterial, put } from './materials';
import { SYS, type JourneyStateRef } from './state';

/*
 * Intestino: metade dos Na⁺ (lima) e HCO₃⁻ (ciano) atravessa a parede rumo ao sangue (absorção);
 * a outra metade fica no lúmen, descendo — é a carga de soluto. A água (branca) entra da parede
 * para o lúmen e desce junto: a diarreia osmótica. Soluto e água acesos seguem a "água" do quadro.
 */

const PER = 72;
const HALF = PER / 2;
const LUT = buildLut(GUT, 300);
const P = new THREE.Vector3();

interface Seed { s: number; side: number; b: number; ph: number; sp: number }

const seedsFor = (seed: number): Seed[] => {
    const r = rng(seed);
    return Array.from({ length: PER }, () => ({
        s: 0.04 + r() * 0.92,
        side: r() < 0.5 ? -1 : 1,
        b: -0.55 + r() * 0.5,
        ph: r(),
        sp: 0.8 + r() * 0.5,
    }));
};

/** Íon absorvido: do centro do lúmen para fora da parede (fração do raio de 0,1 a 1,45). */
const absorbed = (d: Seed, L: number, out: THREE.Vector3) => {
    const rr = 0.1 + 1.35 * smooth(L);
    return lutPoint(LUT, d.s, d.side * rr, d.b * rr, out);
};

/** Soluto que sobra: desce pelo lúmen, perto do eixo. */
const drifting = (d: Seed, L: number, out: THREE.Vector3) =>
    lutPoint(LUT, (d.s + L * 0.12) % 1, d.side * 0.35, d.b * 0.5, out);

/** Água: de fora da parede para o lúmen e depois desce. */
const water = (d: Seed, L: number, out: THREE.Vector3) => {
    const inward = smooth(Math.min(L / 0.55, 1));
    const rr = 1.5 - 1.25 * inward;
    return lutPoint(LUT, (d.s + Math.max(L - 0.55, 0) * 0.1) % 1, d.side * rr, d.b * rr, out);
};

const fade = (L: number) => Math.min(L / 0.12, 1, (1 - L) / 0.15);

export const GutParticles = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const na = useRef<THREE.InstancedMesh>(null);
    const hco = useRef<THREE.InstancedMesh>(null);
    const h2o = useRef<THREE.InstancedMesh>(null);
    const seeds = useMemo(() => ({ na: seedsFor(11), hco: seedsFor(23), h2o: seedsFor(37) }), []);
    const mats = useMemo(() => ({
        na: glowMaterial(C.sodium, 1.35),
        hco: glowMaterial(C.base, 1.4),
        h2o: glowMaterial(C.text, 0.9, 0.55),
    }), []);
    useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

    useFrame(({ clock }) => {
        const a = na.current;
        const b = hco.current;
        const w = h2o.current;
        if (!a || !b || !w) return;
        const { f } = stateRef.current;
        const pres = f.w[SYS.gut];
        const load = Math.min(f.waterLevel / 1.2, 1);
        const nAbs = Math.round(HALF * pres);
        const nStay = Math.round(HALF * load);
        const nWater = Math.round(PER * load);
        const t = clock.elapsedTime;
        for (let i = 0; i < PER; i++) {
            for (const [m, list] of [[a, seeds.na], [b, seeds.hco]] as const) {
                const d = list[i];
                const L = (t * 0.2 * d.sp + d.ph) % 1;
                const on = i < HALF ? i < nAbs : i - HALF < nStay;
                if (!on) { m.setMatrixAt(i, HIDDEN); continue; }
                put(m, i, i < HALF ? absorbed(d, L, P) : drifting(d, L, P), 0.075 * fade(L));
            }
            const d = seeds.h2o[i];
            const L = (t * 0.17 * d.sp + d.ph) % 1;
            if (i >= nWater) { w.setMatrixAt(i, HIDDEN); continue; }
            put(w, i, water(d, L, P), 0.085 * fade(L));
        }
        a.instanceMatrix.needsUpdate = true;
        b.instanceMatrix.needsUpdate = true;
        w.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={na} args={[SPHERE_LO, mats.na, PER]} frustumCulled={false} />
            <instancedMesh ref={hco} args={[SPHERE_LO, mats.hco, PER]} frustumCulled={false} />
            <instancedMesh ref={h2o} args={[SPHERE_LO, mats.h2o, PER]} frustumCulled={false} />
        </group>
    );
};
