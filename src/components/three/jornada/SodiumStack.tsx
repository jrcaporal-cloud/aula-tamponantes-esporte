import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { STACK, stackHeight } from './anatomy';
import { ANTACID_NA_G, WHO_NA_G } from './dose';
import { HIDDEN, rimMaterial } from './materials';
import { useStructure } from './selection';
import { SYS, type JourneyStateRef } from './state';

/*
 * Balanço do sódio: uma pilha de discos (0,5 g de Na cada) que cresce até o sódio desta dose, ao lado
 * de duas colunas de referência em contorno — o teto diário da OMS (2 g) e o máximo de 24 h do rótulo
 * de antiácido (4,6 g). A pilha se monta quando a câmera chega e acompanha os controles de dose.
 */

const MAX_DISCS = 32;
const STEP_H = STACK.disc + STACK.gap;

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3();

const Ghost = ({ x, grams }: { x: number; grams: number }) => {
    const h = stackHeight(grams / STACK.grams);
    const geo = useMemo(() => new THREE.CylinderGeometry(STACK.r, STACK.r, h, 40, 1, true), [h]);
    const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(STACK.r, STACK.r, h, 40)), [h]);
    const mats = useMemo(() => ({
        fill: new THREE.MeshBasicMaterial({ color: C.co2, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }),
        line: new THREE.LineBasicMaterial({ color: C.co2, transparent: true, opacity: 0.85 }),
    }), []);
    useEffect(() => () => { geo.dispose(); edges.dispose(); mats.fill.dispose(); mats.line.dispose(); }, [geo, edges, mats]);
    return (
        <group position={[x, STACK.y + h / 2, STACK.z]}>
            <mesh geometry={geo} material={mats.fill} />
            <lineSegments geometry={edges} material={mats.line} />
        </group>
    );
};

export const SodiumStack = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const root = useRef<THREE.Group>(null);
    const level = useRef(0);
    const { bind, lit } = useStructure('sodio');
    const disc = useMemo(() => new THREE.CylinderGeometry(STACK.r, STACK.r, STACK.disc, 40), []);
    const base = useMemo(() => new THREE.BoxGeometry(7.2, 0.12, 2.4), []);
    const mats = useMemo(() => ({
        disc: new THREE.MeshStandardMaterial({ color: C.sodium, emissive: C.sodium, emissiveIntensity: 0.3, roughness: 0.45, metalness: 0.1 }),
        base: rimMaterial(C.co2, 0.15),
    }), []);
    useEffect(() => () => { disc.dispose(); base.dispose(); mats.disc.dispose(); mats.base.dispose(); }, [disc, base, mats]);

    useFrame((_, delta) => {
        const m = mesh.current;
        if (!m) return;
        const { in: inp, f } = stateRef.current;
        const w = f.w[SYS.sodium];
        if (root.current) root.current.visible = w > 0.01;
        const target = w > 0.5 ? Math.min(inp.discs, MAX_DISCS) : 0;
        level.current += (target - level.current) * (1 - Math.exp(-Math.min(delta, 0.05) * 3));
        const lv = level.current;
        for (let i = 0; i < MAX_DISCS; i++) {
            const fill = Math.min(Math.max(lv - i, 0), 1);
            if (fill <= 0.01) { m.setMatrixAt(i, HIDDEN); continue; }
            P.set(STACK.xs[2], STACK.y + i * STEP_H + (STACK.disc * fill) / 2, STACK.z);
            m.setMatrixAt(i, M.compose(P, Q, S.set(1, fill, 1)));
        }
        m.instanceMatrix.needsUpdate = true;
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity = lit ? 0.75 : 0.3;
    });

    return (
        <group ref={root} visible={false}>
            <mesh geometry={base} material={mats.base} position={[(STACK.xs[0] + STACK.xs[2]) / 2, STACK.y - 0.06, STACK.z]} {...bind} />
            <Ghost x={STACK.xs[0]} grams={WHO_NA_G} />
            <Ghost x={STACK.xs[1]} grams={ANTACID_NA_G} />
            <instancedMesh ref={mesh} args={[disc, mats.disc, MAX_DISCS]} frustumCulled={false} {...bind} />
        </group>
    );
};
