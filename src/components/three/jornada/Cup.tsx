import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { rng } from '../shared/math';
import { CUP, ESOPHAGUS } from './anatomy';
import { HIDDEN, SPHERE_LO, additiveMaterial, bubbleMaterial, glowMaterial, put } from './materials';
import { SYS, type JourneyStateRef } from './state';

/*
 * O copo do título ("do copo ao músculo"): vidro inclinado sobre o esôfago, com a água turva de pó
 * (grãos ciano girando) e um fio que cai na boca do tubo, de onde o fluxo da dose segue. Esquemático.
 */

const GRAINS = 46;
const DROPS = 26;
const TILT = CUP.tilt;
const UP = new THREE.Vector2(-Math.sin(TILT), Math.cos(TILT));
const SIDE = new THREE.Vector2(Math.cos(TILT), Math.sin(TILT));
const half = CUP.h / 2;
/** Ponto mais baixo da borda: de onde o fio cai. */
const LIP = new THREE.Vector3(CUP.x + UP.x * half + SIDE.x * CUP.r, CUP.y + UP.y * half + SIDE.y * CUP.r, CUP.z);
const MOUTH = ESOPHAGUS.curve.getPointAt(0, new THREE.Vector3());
const WATER_Y = LIP.y - 0.12;
const P = new THREE.Vector3();

/** Fio de líquido: arco curto da borda até a boca do esôfago. */
const streamPoint = (k: number, out: THREE.Vector3) => {
    const x = LIP.x + (MOUTH.x - LIP.x) * k + Math.sin(k * Math.PI) * 0.18;
    const y = LIP.y + (MOUTH.y - LIP.y) * k * k + Math.sin(k * Math.PI) * 0.12 * (1 - k);
    return out.set(x, y, LIP.z + (MOUTH.z - LIP.z) * k);
};

export const Cup = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const geo = useMemo(() => {
        const prof = [
            new THREE.Vector2(0, -half), new THREE.Vector2(CUP.r * 0.82, -half), new THREE.Vector2(CUP.r * 0.86, -half + 0.05),
            new THREE.Vector2(CUP.r, half),
        ];
        const inner = prof.map(v => new THREE.Vector2(v.x * 0.9, v.y + (v.y < 0 ? 0.09 : 0)));
        return {
            glass: new THREE.LatheGeometry(prof, 40),
            water: new THREE.LatheGeometry(inner, 40),
            rim: new THREE.TorusGeometry(CUP.r, 0.022, 6, 48),
        };
    }, []);
    const mats = useMemo(() => {
        const water = bubbleMaterial(C.baseSoft, { rim: 0.8, body: 0.22, spec: 0.5 });
        water.side = THREE.DoubleSide;
        water.uniforms.uCutY.value = WATER_Y;
        const glass = bubbleMaterial('#e6f4ff', { rim: 0.85, body: 0.03, spec: 1.1 });
        glass.side = THREE.DoubleSide;
        return {
            glass,
            water,
            rim: glowMaterial('#e6f4ff', 1.1, 0.8),
            grain: glowMaterial(C.text, 1.2),
            drop: additiveMaterial(C.baseSoft, 0.85, 1.4),
        };
    }, []);
    useEffect(() => () => {
        Object.values(geo).forEach(g => g.dispose());
        Object.values(mats).forEach(m => m.dispose());
    }, [geo, mats]);

    const seeds = useMemo(() => {
        const r = rng(314);
        return Array.from({ length: GRAINS }, () => ({ a: r() * 6.3, rr: Math.sqrt(r()) * 0.75, h: r(), sp: 0.4 + r() * 0.8, s: 0.025 + r() * 0.025 }));
    }, []);
    const root = useRef<THREE.Group>(null);
    const glassRef = useRef<THREE.Mesh>(null);
    const waterRef = useRef<THREE.Mesh>(null);
    const grains = useRef<THREE.InstancedMesh>(null);
    const drops = useRef<THREE.InstancedMesh>(null);

    useFrame(({ clock }) => {
        const g = grains.current;
        const d = drops.current;
        const cup = root.current;
        if (!g || !d || !cup) return;
        const { w } = stateRef.current.f;
        const k = Math.max(w[SYS.stream], w[SYS.stomach] * 0.6);
        cup.visible = k > 0.02;
        if (!cup.visible) return;
        const t = clock.elapsedTime;
        for (const mesh of [glassRef.current, waterRef.current]) {
            if (mesh) (mesh.material as THREE.ShaderMaterial).uniforms.uDim.value = k;
        }
        // grãos: giram dentro do copo (coordenadas locais do copo inclinado), abaixo do nível da água
        for (let i = 0; i < GRAINS; i++) {
            const s = seeds[i];
            const a = s.a + t * s.sp;
            const ly = -half + 0.15 + s.h * 0.75 + Math.sin(t * 0.7 + s.a) * 0.06;
            const lx = Math.cos(a) * s.rr * CUP.r * 0.8;
            P.set(CUP.x + SIDE.x * lx + UP.x * ly, CUP.y + SIDE.y * lx + UP.y * ly, CUP.z + Math.sin(a) * s.rr * CUP.r * 0.6);
            put(g, i, P, P.y < WATER_Y - 0.03 ? s.s * k : 0);
        }
        g.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < DROPS; i++) {
            const q = (t * 0.9 + i / DROPS) % 1;
            if (w[SYS.stream] < 0.05) { d.setMatrixAt(i, HIDDEN); continue; }
            put(d, i, streamPoint(q, P), (0.05 + 0.025 * Math.sin(i * 2.1 + t * 6)) * w[SYS.stream]);
        }
        d.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={root}>
            <group position={[CUP.x, CUP.y, CUP.z]} rotation={[0, 0, TILT]}>
                <mesh ref={waterRef} geometry={geo.water} material={mats.water} renderOrder={1} />
                <mesh ref={glassRef} geometry={geo.glass} material={mats.glass} renderOrder={2} />
                <mesh geometry={geo.rim} material={mats.rim} position={[0, half, 0]} rotation={[Math.PI / 2, 0, 0]} />
            </group>
            <instancedMesh ref={grains} args={[SPHERE_LO, mats.grain, GRAINS]} frustumCulled={false} />
            <instancedMesh ref={drops} args={[SPHERE_LO, mats.drop, DROPS]} frustumCulled={false} />
        </group>
    );
};
