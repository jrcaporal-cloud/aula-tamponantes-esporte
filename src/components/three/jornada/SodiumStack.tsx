import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { C } from '../../sims/kit/palette';
import { STACK, stackHeight } from './anatomy';
import { ANTACID_NA_G, WHO_NA_G } from './dose';
import { bubbleMaterial, commit, rimMaterial } from './materials';
import { useStructure } from './selection';
import { SYS, type JourneyStateRef } from './state';

/*
 * Balanço do sódio: uma pilha de discos (0,5 g de Na cada) que cresce até o sódio desta dose, ao lado
 * de duas colunas de referência em contorno — o teto diário da OMS (2 g) e o máximo de 24 h do rótulo
 * de antiácido (4,6 g). A pilha se monta quando a câmera chega e acompanha os controles de dose.
 * Colunas de referência em vidro com um anel fino a cada 0,5 g (a mesma régua dos discos); discos
 * de borda arredondada sobre um pedestal escuro com filete de luz.
 */

const MAX_DISCS = 32;
const STEP_H = STACK.disc + STACK.gap;

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();

/** Disco com a borda arredondada (perfil girado), altura STACK.disc, centrado na origem. */
const discGeometry = (): THREE.LatheGeometry => {
    const h = STACK.disc / 2;
    const r = STACK.r;
    const e = 0.045;
    const pts: THREE.Vector2[] = [new THREE.Vector2(0, -h)];
    for (let i = 0; i <= 4; i++) {
        const a = -Math.PI / 2 + (i / 4) * (Math.PI / 2);
        pts.push(new THREE.Vector2(r - e + Math.cos(a) * e, -h + e + Math.sin(a) * e));
    }
    for (let i = 0; i <= 4; i++) {
        const a = (i / 4) * (Math.PI / 2);
        pts.push(new THREE.Vector2(r - e + Math.cos(a) * e, h - e + Math.sin(a) * e));
    }
    pts.push(new THREE.Vector2(0, h));
    return new THREE.LatheGeometry(pts, 48);
};

/** Anel de 0,5 g: deitado (eixo do toro na vertical). */
const RING_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const ONE = new THREE.Vector3(1, 1, 1);

const Ghost = ({ x, grams }: { x: number; grams: number }) => {
    const h = stackHeight(grams / STACK.grams);
    const ticks = Math.floor(grams / STACK.grams);
    const rings = useRef<THREE.InstancedMesh>(null);
    const geo = useMemo(() => ({
        glass: new THREE.CylinderGeometry(STACK.r * 1.04, STACK.r * 1.04, h, 48, 1, true),
        ring: new THREE.TorusGeometry(STACK.r * 1.04, 0.012, 6, 64),
        top: new THREE.TorusGeometry(STACK.r * 1.04, 0.03, 8, 64),
    }), [h]);
    const mats = useMemo(() => {
        const glass = bubbleMaterial('#cbd5e1', { rim: 0.9, body: 0.05, spec: 0.9 });
        glass.side = THREE.DoubleSide;
        return {
            glass,
            ring: new THREE.MeshBasicMaterial({ color: C.co2, transparent: true, opacity: 0.45, depthWrite: false }),
            top: rimMaterial(C.co2, 1.1),
        };
    }, []);
    useEffect(() => () => {
        Object.values(geo).forEach(g => g.dispose());
        Object.values(mats).forEach(m => m.dispose());
    }, [geo, mats]);
    // anéis fixos (um a cada 0,5 g): uma malha instanciada, escrita uma vez
    useEffect(() => {
        const m = rings.current;
        if (!m) return;
        for (let i = 0; i < ticks; i++) m.setMatrixAt(i, M.compose(P.set(0, (i + 1) * STEP_H, 0), RING_Q, ONE));
        m.instanceMatrix.needsUpdate = true;
        m.computeBoundingSphere();
    }, [ticks]);
    return (
        <group position={[x, STACK.y, STACK.z]}>
            <mesh geometry={geo.glass} material={mats.glass} position={[0, h / 2, 0]} renderOrder={2} />
            <instancedMesh ref={rings} args={[geo.ring, mats.ring, ticks]} />
            <mesh geometry={geo.top} material={mats.top} position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
    );
};

export const SodiumStack = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const root = useRef<THREE.Group>(null);
    const level = useRef(0);
    const { bind, lit } = useStructure('sodio');
    const disc = useMemo(() => discGeometry(), []);
    const base = useMemo(() => new RoundedBoxGeometry(7.4, 0.28, 2.6, 4, 0.12), []);
    const edge = useMemo(() => new THREE.BoxGeometry(7.0, 0.025, 0.025), []);
    const mats = useMemo(() => ({
        disc: new THREE.MeshPhysicalMaterial({
            color: C.sodium, emissive: C.sodium, emissiveIntensity: 0.22, roughness: 0.3, metalness: 0.05,
            clearcoat: 1, clearcoatRoughness: 0.15, sheen: 0.6, sheenColor: new THREE.Color('#ecfccb'),
        }),
        base: new THREE.MeshPhysicalMaterial({ color: '#0b1524', roughness: 0.25, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 }),
        edge: rimMaterial(C.sodium, 0.9),
    }), []);
    useEffect(() => () => { disc.dispose(); base.dispose(); edge.dispose(); Object.values(mats).forEach(m => m.dispose()); }, [disc, base, edge, mats]);

    useFrame((_, delta) => {
        const m = mesh.current;
        if (!m) return;
        const { in: inp, f } = stateRef.current;
        const w = f.w[SYS.sodium];
        const shown = w > 0.01;
        if (root.current) root.current.visible = shown;
        // fora da etapa: nada a escrever; a pilha volta a se montar do zero quando a câmera chegar
        if (!shown) { level.current = 0; return; }
        const target = w > 0.5 ? Math.min(inp.discs, MAX_DISCS) : 0;
        level.current += (target - level.current) * (1 - Math.exp(-Math.min(delta, 0.05) * 3));
        const lv = level.current;
        let k = 0;
        for (let i = 0; i < MAX_DISCS; i++) {
            const fill = Math.min(Math.max(lv - i, 0), 1);
            if (fill <= 0.01) break;
            P.set(STACK.xs[2], STACK.y + i * STEP_H + (STACK.disc * fill) / 2, STACK.z);
            m.setMatrixAt(k++, M.compose(P, Q, S.set(1, fill, 1)));
        }
        commit(m, k);
        (m.material as THREE.MeshPhysicalMaterial).emissiveIntensity = lit ? 0.7 : 0.22;
    });

    return (
        <group ref={root} visible={false}>
            <mesh geometry={base} material={mats.base} position={[(STACK.xs[0] + STACK.xs[2]) / 2, STACK.y - 0.15, STACK.z]} {...bind} />
            <mesh geometry={edge} material={mats.edge} position={[(STACK.xs[0] + STACK.xs[2]) / 2, STACK.y - 0.08, STACK.z + 1.31]} />
            <Ghost x={STACK.xs[0]} grams={WHO_NA_G} />
            <Ghost x={STACK.xs[1]} grams={ANTACID_NA_G} />
            <instancedMesh ref={mesh} args={[disc, mats.disc, MAX_DISCS]} frustumCulled={false} {...bind} />
        </group>
    );
};
