import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng, smooth } from '../shared/math';
import { STOMACH, buildLut, centroidOf, lutPoint } from './anatomy';
import { HIDDEN, SPHERE_LO, SPHERE_MID, additiveMaterial, bubbleMaterial, glowMaterial, put, putScaled } from './materials';
import type { JourneyStateRef } from './state';

/*
 * A reação no estômago, por "vaga": um H⁺ (laranja) sai da parede e um HCO₃⁻ (ciano) desce da dose;
 * quando se encontram nasce uma bolha de CO₂ (ardósia) que sobe e se junta ao bolsão do fundo.
 * O número de vagas acesas e o tamanho do bolsão seguem o gás do quadro (dose × estratégias).
 * Tudo acompanha a distensão da parede (mesma escala em torno do centro do estômago).
 * Bolhas de vidro (borda de fresnel + reflexo) que oscilam ao subir; no encontro, um clarão breve.
 */

const N = 180;
const LUT = buildLut(STOMACH, 120);
const CENTER = centroidOf(STOMACH);
const FUNDUS = lutPoint(LUT, 0.14, 0.15, -0.25, new THREE.Vector3());
const REACT = 0.26;
const SPHERE_HI = new THREE.IcosahedronGeometry(1, 4);

const P = new THREE.Vector3();
const A = new THREE.Vector3();
const B = new THREE.Vector3();
const MEET = new THREE.Vector3();

interface Slot { s: number; a: number; b: number; ph: number; sp: number; size: number; side: number; fx: number; fy: number }

const buildSlots = (): Slot[] => {
    const r = rng(1977);
    return Array.from({ length: N }, () => ({
        s: 0.28 + r() * 0.56,
        a: (r() - 0.5) * 1.3,
        b: -0.65 + r() * 0.8,
        ph: r(),
        sp: 0.75 + r() * 0.5,
        size: 0.8 + r() * 0.5,
        side: r() < 0.5 ? -1 : 1,
        fx: (r() - 0.5) * 1.6,
        fy: (r() - 0.5) * 1.2,
    }));
};

/** Aplica a distensão: o ponto acompanha a parede que infla. */
const inflate = (p: THREE.Vector3, k: number) => p.sub(CENTER).multiplyScalar(k).add(CENTER);

export const StomachGas = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const acid = useRef<THREE.InstancedMesh>(null);
    const base = useRef<THREE.InstancedMesh>(null);
    const gas = useRef<THREE.InstancedMesh>(null);
    const flash = useRef<THREE.InstancedMesh>(null);
    const pocket = useRef<THREE.Mesh>(null);
    const slots = useMemo(() => buildSlots(), []);
    const mats = useMemo(() => ({
        acid: glowMaterial(C.acid, 1.4),
        base: glowMaterial(C.baseSoft, 1.4),
        gas: bubbleMaterial('#cbd5e1', { rim: 1.1, body: 0.1, spec: 1 }),
        flash: additiveMaterial('#e0f7ff', 0.5, 1),
        pocket: bubbleMaterial(C.co2, { rim: 1, body: 0.08, spec: 0.8 }),
    }), []);
    useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

    useFrame(({ clock }) => {
        const ma = acid.current;
        const mb = base.current;
        const mg = gas.current;
        const mf = flash.current;
        if (!ma || !mb || !mg || !mf) return;
        const lvl = stateRef.current.f.gasLevel;
        const k = 1 + 0.13 * lvl;
        const n = Math.round(N * Math.min(lvl / 1.2, 1));
        const t = clock.elapsedTime;
        for (let i = 0; i < N; i++) {
            if (i >= n) { ma.setMatrixAt(i, HIDDEN); mb.setMatrixAt(i, HIDDEN); mg.setMatrixAt(i, HIDDEN); mf.setMatrixAt(i, HIDDEN); continue; }
            const d = slots[i];
            const L = (t * 0.16 * d.sp + d.ph) % 1;
            lutPoint(LUT, d.s, d.a, d.b, MEET);
            // clarão do encontro: cresce e apaga logo depois da reação
            const fl = (L - REACT + 0.015) / 0.07;
            put(mf, i, inflate(P.copy(MEET), k), fl > 0 && fl < 1 ? 0.24 * Math.sin(Math.PI * fl) * (1 - fl * 0.5) : 0);
            if (L < REACT) {
                const e = smooth(L / REACT);
                lutPoint(LUT, d.s, d.side * 0.95, d.b, A);
                B.copy(MEET).y += 1.3;
                put(ma, i, inflate(P.copy(A).lerp(MEET, e), k), 0.075);
                put(mb, i, inflate(P.copy(B).lerp(MEET, e), k), 0.075);
                put(mg, i, P, 0);
                continue;
            }
            ma.setMatrixAt(i, HIDDEN);
            mb.setMatrixAt(i, HIDDEN);
            const g = (L - REACT) / (1 - REACT);
            A.set(FUNDUS.x + d.fx * 0.6, FUNDUS.y + d.fy * 0.5, FUNDUS.z);
            P.copy(MEET).lerp(A, smooth(g));
            P.x += Math.sin(t * 2.3 + d.ph * 9) * 0.08;
            const grow = Math.min(g * 4, 1) * (1 - smooth(Math.max((g - 0.85) / 0.15, 0)));
            const sz = (0.05 + 0.1 * g) * d.size * (0.8 + 0.3 * lvl) * grow;
            const wob = Math.sin(t * 9 * d.sp + d.ph * 20) * 0.1;
            putScaled(mg, i, inflate(P, k), sz * (1 + wob), sz * (1 - wob), sz);
        }
        mf.instanceMatrix.needsUpdate = true;
        ma.instanceMatrix.needsUpdate = true;
        mb.instanceMatrix.needsUpdate = true;
        mg.instanceMatrix.needsUpdate = true;
        const pk = pocket.current;
        if (pk) {
            const s = lvl > 0.02 ? 0.5 + 0.9 * Math.min(lvl, 1.4) : 0;
            pk.visible = s > 0;
            const br = Math.sin(t * 1.3) * 0.03;
            pk.scale.set(s * 1.15 * (1 + br), s * 0.8 * (1 - br), s * 0.7);
            inflate(pk.position.copy(FUNDUS), k);
        }
    });

    return (
        <group>
            <instancedMesh ref={acid} args={[SPHERE_LO, mats.acid, N]} frustumCulled={false} />
            <instancedMesh ref={base} args={[SPHERE_LO, mats.base, N]} frustumCulled={false} />
            <instancedMesh ref={gas} args={[SPHERE_MID, mats.gas, N]} frustumCulled={false} renderOrder={3} />
            <instancedMesh ref={flash} args={[SPHERE_LO, mats.flash, N]} frustumCulled={false} />
            <mesh ref={pocket} geometry={SPHERE_HI} material={mats.pocket} renderOrder={2} />
        </group>
    );
};
