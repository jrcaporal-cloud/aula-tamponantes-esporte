import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng, smooth } from '../shared/math';
import { CAPILLARY_Y, FIBER, MCT_X, MEMBRANE_Y } from './anatomy';
import { SPHERE_LO, SPHERE_MID, commit, glowMaterial, push, sleep } from './materials';
import { SYS, type JourneyStateRef } from './state';

/*
 * Músculo: dentro da fibra, uma névoa de H⁺ (laranja). Cada "saída" leva um H⁺ e um lactato
 * (âmbar) juntos até um MCT e daí ao capilar; lá um HCO₃⁻ (ciano) chega, o H⁺ some e nasce um CO₂
 * (ardósia), que segue o sangue para o pulmão. Com sangue alcalino, as saídas correm 10,0/4,2 vezes
 * mais rápido e há mais delas (proporção de HOLLIDGE2000; a animação é ilustrativa).
 */

const CLOUD = 90;
const OUT = 48;
const RATIO = 4.2 / 10;
const P = new THREE.Vector3();
const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();
const A = new THREE.Vector3();
const B = new THREE.Vector3();

interface Exit { pore: number; x: number; y: number; z: number; ph: number; sp: number }

const buildExits = (): Exit[] => {
    const r = rng(2000);
    return Array.from({ length: OUT }, (_, i) => {
        const th = Math.PI + r() * Math.PI;
        const rr = Math.sqrt(r()) * 0.8 * FIBER.r;
        return { pore: i % MCT_X.length, x: (r() - 0.5) * 1.1, y: Math.cos(th) * rr * 0.9, z: Math.sin(th) * rr * 0.4, ph: r(), sp: 0.8 + r() * 0.4 };
    });
};

const buildCloud = () => {
    const r = rng(6.6);
    return Array.from({ length: CLOUD }, () => {
        const th = Math.PI + r() * Math.PI;
        const rr = Math.sqrt(r()) * 0.86 * FIBER.r;
        return { x: FIBER.x0 + 0.3 + r() * (FIBER.x1 - FIBER.x0 - 0.6), y: FIBER.y + Math.cos(th) * rr, z: Math.sin(th) * rr * 0.6, ph: r() * 6.3 };
    });
};

/** Trajeto da saída: dentro → poro (0–0,45) → capilar (0,45–0,62) → corre no capilar (0,62–1). */
const exitPoint = (e: Exit, L: number, dx: number, out: THREE.Vector3) => {
    const px = MCT_X[e.pore];
    A.set(px + e.x + dx, FIBER.y + e.y, e.z);
    B.set(px + dx * 0.4, MEMBRANE_Y - 0.02, -0.12);
    if (L < 0.45) return out.copy(A).lerp(B, smooth(L / 0.45));
    A.set(px + dx * 0.4, CAPILLARY_Y - 0.05, -0.05);
    if (L < 0.62) return out.copy(B).lerp(A, smooth((L - 0.45) / 0.17));
    return out.copy(A).setX(A.x + (L - 0.62) * 5.5);
};

export const MuscleEfflux = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const cloud = useRef<THREE.InstancedMesh>(null);
    const hplus = useRef<THREE.InstancedMesh>(null);
    const lact = useRef<THREE.InstancedMesh>(null);
    const hco = useRef<THREE.InstancedMesh>(null);
    const co2 = useRef<THREE.InstancedMesh>(null);
    const exits = useMemo(() => buildExits(), []);
    const dots = useMemo(() => buildCloud(), []);
    /** Fase de cada saída, integrada por quadro (a velocidade muda com o botão alcalino × normal). */
    const life = useRef<Float32Array | null>(null);
    const mats = useMemo(() => ({
        acid: glowMaterial(C.acid, 1.4),
        acidDim: glowMaterial(C.acid, 0.9, 0.7),
        lact: glowMaterial(C.lactate, 1.3),
        base: glowMaterial(C.base, 1.45),
        co2: glowMaterial(C.co2, 1.05, 0.7),
    }), []);
    useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

    useFrame(({ clock }, delta) => {
        const mc = cloud.current; const mh = hplus.current; const ml = lact.current; const mb = hco.current; const mo = co2.current;
        if (!mc || !mh || !ml || !mb || !mo) return;
        const { in: inp, f } = stateRef.current;
        const w = f.w[SYS.muscle];
        const rate = inp.alkaline ? 1 : RATIO;
        const lf = life.current ?? (life.current = Float32Array.from(exits, e => e.ph));
        const dt = Math.min(delta, 0.05);
        // a fase das saídas segue correndo mesmo apagada (sem custo de GPU)
        for (let i = 0; i < OUT; i++) lf[i] = (lf[i] + dt * 0.2 * exits[i].sp * rate) % 1;
        if (w <= 1e-3) {
            sleep(mc); sleep(mh); sleep(ml); sleep(mb); sleep(mo);
            return;
        }
        const t = clock.elapsedTime;
        for (let i = 0; i < CLOUD; i++) {
            const d = dots[i];
            P.set(d.x + Math.sin(t * 0.9 + d.ph) * 0.12, d.y + Math.cos(t * 1.1 + d.ph * 1.3) * 0.1, d.z);
            mc.setMatrixAt(i, M.compose(P, Q, S.setScalar(0.055 * w)));
        }
        commit(mc, CLOUD);
        const n = Math.round(OUT * w * (inp.alkaline ? 1 : 0.55));
        let ih = 0; let il = 0; let ib = 0; let io = 0;
        for (let i = 0; i < n; i++) {
            const e = exits[i];
            const L = lf[i];
            const fadeIn = Math.min(L / 0.06, 1);
            const fadeOut = Math.min((1 - L) / 0.12, 1);
            if (L < 0.62) ih = push(mh, ih, exitPoint(e, L, 0, P), 0.085 * fadeIn);
            il = push(ml, il, exitPoint(e, L, 0.2, P), 0.095 * fadeIn * fadeOut);
            // o HCO₃⁻ chega pelo capilar e encontra o H⁺ na saída do poro
            if (L > 0.5 && L < 0.62) {
                const k = smooth((L - 0.5) / 0.12);
                P.set(MCT_X[e.pore] - 1.1 * (1 - k), CAPILLARY_Y + 0.1, -0.05);
                ib = push(mb, ib, P, 0.08);
            }
            if (L >= 0.62) io = push(mo, io, exitPoint(e, L, -0.15, P).setY(P.y + (L - 0.62) * 0.6), 0.11 * fadeOut);
        }
        commit(mh, ih); commit(ml, il); commit(mb, ib); commit(mo, io);
    });

    return (
        <group>
            <instancedMesh ref={cloud} args={[SPHERE_LO, mats.acidDim, CLOUD]} frustumCulled={false} />
            <instancedMesh ref={hplus} args={[SPHERE_LO, mats.acid, OUT]} frustumCulled={false} />
            <instancedMesh ref={lact} args={[SPHERE_LO, mats.lact, OUT]} frustumCulled={false} />
            <instancedMesh ref={hco} args={[SPHERE_LO, mats.base, OUT]} frustumCulled={false} />
            <instancedMesh ref={co2} args={[SPHERE_MID, mats.co2, OUT]} frustumCulled={false} />
        </group>
    );
};
