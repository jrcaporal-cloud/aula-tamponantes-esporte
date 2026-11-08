import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { CAP, MYOFIBRIL, PORTER, RIM, SHELL, SPHERE_HI, makeStriationTexture } from './geometry';
import { CUT_A, CUT_B, FIBER_HALF, FIBER_R, MITOCHONDRIA, MYOFIBRILS, PORT_A, PORT_X, onFiber, type PortId } from './layout';
import { BufferSites } from './BufferSites';
import { useStructure } from './selection';
import type { SimRef } from './types';

/*
 * A fibra em corte: casca do sarcolema (por fora clara, por dentro escura), miofibrilas estriadas ao
 * fundo, mitocôndrias no sarcoplasma, os sítios de tampão e as portas na face voltada ao capilar.
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();
const P = new THREE.Vector3();
const X_AXIS = new THREE.Vector3(1, 0, 0);

const Sarcolemma = () => {
    const { bind, lit } = useStructure('sarcolema');
    return (
        <group {...bind}>
            <mesh geometry={SHELL}>
                <meshStandardMaterial color="#8E97BE" roughness={0.55} metalness={0.05} emissive="#3B4470" emissiveIntensity={lit ? 0.9 : 0.25} side={THREE.FrontSide} />
            </mesh>
            <mesh geometry={SHELL} scale={[1, 0.985, 0.985]}>
                <meshStandardMaterial color="#2A1F33" roughness={0.9} side={THREE.BackSide} />
            </mesh>
            {[CUT_A, CUT_B].map(a => (
                <mesh key={a} geometry={RIM} position={onFiber(0, a, FIBER_R)}>
                    <meshBasicMaterial color="#C7D2FE" toneMapped={false} transparent opacity={lit ? 1 : 0.7} />
                </mesh>
            ))}
            {[-1, 1].map(side => (
                <mesh key={side} geometry={CAP} position={[side * FIBER_HALF, 0, 0]}>
                    <meshStandardMaterial color="#3A2A42" roughness={0.85} transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>
            ))}
        </group>
    );
};

const Myofibrils = () => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const tex = useMemo(() => makeStriationTexture(), []);
    const { bind, lit } = useStructure('miofibrila');
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        MYOFIBRILS.forEach((f, i) => m.setMatrixAt(i, M.makeTranslation(0, f.y, f.z)));
        m.instanceMatrix.needsUpdate = true;
    }, []);
    useLayoutEffect(() => () => tex.dispose(), [tex]);
    return (
        <instancedMesh ref={mesh} args={[MYOFIBRIL, undefined, MYOFIBRILS.length]} {...bind}>
            <meshStandardMaterial map={tex} roughness={0.6} emissive="#5B2238" emissiveIntensity={lit ? 0.7 : 0.18} />
        </instancedMesh>
    );
};

const Mitochondria = () => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('mitocondria');
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        MITOCHONDRIA.forEach((o, i) => {
            Q.setFromAxisAngle(X_AXIS, o.rot);
            m.setMatrixAt(i, M.compose(P.set(o.p[0], o.p[1], o.p[2]), Q, S.set(0.72 * o.s, 0.3 * o.s, 0.3 * o.s)));
        });
        m.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <instancedMesh ref={mesh} args={[SPHERE_HI, undefined, MITOCHONDRIA.length]} {...bind}>
            <meshStandardMaterial color="#5E8F72" roughness={0.5} emissive="#1F5135" emissiveIntensity={lit ? 1.1 : 0.4} />
        </instancedMesh>
    );
};

const PORT_COLOR: Readonly<Record<PortId, string>> = { mct4: C.lactate, mct1: '#E7B008', nhe1: C.sodium, nbc: C.base };

/** Uma família de transportadores (todas as cópias acendem juntas). Brilha mais com a exportação ligada. */
const PortFamily = ({ id, simRef }: { id: PortId; simRef: SimRef }) => {
    const { bind, lit } = useStructure(id);
    const group = useRef<THREE.Group>(null);
    const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: PORT_COLOR[id], emissive: PORT_COLOR[id], roughness: 0.4 }), [id]);
    useLayoutEffect(() => () => mat.dispose(), [mat]);
    useFrame(() => {
        // todas as cópias dividem o material: basta ajustar o da primeira
        const first = group.current?.children[0] as THREE.Mesh | undefined;
        const m = first?.material as THREE.MeshStandardMaterial | undefined;
        if (m) m.emissiveIntensity = lit ? 1.2 : 0.25 + 0.6 * simRef.current.meter.efflux;
    });
    return (
        <group ref={group} {...bind}>
            {PORT_X[id].map(x => <mesh key={x} geometry={PORTER} material={mat} position={onFiber(x, PORT_A, FIBER_R)} />)}
        </group>
    );
};

export const Fiber = ({ simRef }: { simRef: SimRef }) => (
    <group>
        <Sarcolemma />
        <Myofibrils />
        <Mitochondria />
        <BufferSites simRef={simRef} />
        {(['mct4', 'mct1', 'nhe1', 'nbc'] as const).map(id => <PortFamily key={id} id={id} simRef={simRef} />)}
    </group>
);
