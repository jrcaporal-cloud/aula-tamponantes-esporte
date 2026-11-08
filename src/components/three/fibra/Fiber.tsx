import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import {
    CAP, CUT_STRIPS, END_RING, LEAFLET, MEMBRANE_GRAINS, MEMBRANE_T, MITO_CRISTAE, MITO_OUTER, MYOFIBRIL, MYO_SARC_LEN, MYO_START,
    PORTER, PORTER_COLLAR, SHELL, SHELL_IN, SPHERE, SR_SLEEVE, TRIAD, TRIAD_PHASES,
} from './geometry';
import { CUT_A, CUT_B, FIBER_HALF, FIBER_R, MITOCHONDRIA, MYOFIBRILS, PORT_A, PORT_X, onFiber, type PortId } from './layout';
import { BufferSites } from './BufferSites';
import { makeRimMaterial, noRaycast } from './materials';
import { useStructure } from './selection';
import { SARCOMERES, membraneBump, myofibrilEndMap, reticulumAlpha, sarcomereBump, sarcomereMap } from './textures';
import type { SimRef } from './types';

/*
 * A fibra em corte: sarcolema com espessura (bicamada nas bordas do corte, grânulos na superfície),
 * miofibrilas com sarcômeros em relevo envoltas pelo retículo sarcoplasmático e pelas tríades,
 * mitocôndrias com cristas, os sítios de tampão e as portas na face voltada ao capilar.
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();
const P = new THREE.Vector3();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const NRM = new THREE.Vector3();

const Sarcolemma = () => {
    const { bind, lit } = useStructure('sarcolema');
    const grains = useRef<THREE.InstancedMesh>(null);
    const rim = useMemo(() => makeRimMaterial('#C7D2FE', { power: 3, strength: 0.55 }), []);
    useLayoutEffect(() => () => rim.dispose(), [rim]);
    useLayoutEffect(() => {
        const m = grains.current;
        if (!m) return;
        MEMBRANE_GRAINS.forEach((p, i) => {
            NRM.set(0, p[1], p[2]).normalize();
            Q.setFromUnitVectors(Y_AXIS, NRM);
            const k = 0.045 + ((i * 37) % 11) * 0.004;
            m.setMatrixAt(i, M.compose(P.set(p[0], p[1], p[2]), Q, S.set(k * 1.4, k * 0.7, k * 1.4)));
        });
        m.instanceMatrix.needsUpdate = true;
    }, []);
    const leaflets = [CUT_A, CUT_B].flatMap(a => [onFiber(0, a, FIBER_R - 0.02), onFiber(0, a, FIBER_R - MEMBRANE_T + 0.02)]);
    return (
        <group {...bind}>
            <mesh geometry={SHELL}>
                <meshPhysicalMaterial
                    color="#8E97C6" roughness={0.42} sheen={1} sheenColor="#E0E7FF" sheenRoughness={0.45} clearcoat={0.55} clearcoatRoughness={0.3}
                    bumpMap={membraneBump()} bumpScale={1.4} emissive="#3B4470" emissiveIntensity={lit ? 0.85 : 0.18}
                />
            </mesh>
            <mesh geometry={SHELL} material={rim} raycast={noRaycast} />
            <mesh geometry={SHELL_IN}>
                <meshStandardMaterial color="#2B1E34" roughness={0.85} side={THREE.BackSide} emissive="#160c1d" />
            </mesh>
            <mesh geometry={CUT_STRIPS}>
                <meshStandardMaterial color="#5E6699" roughness={0.6} side={THREE.DoubleSide} emissive="#2A2F55" emissiveIntensity={lit ? 1.2 : 0.5} />
            </mesh>
            {leaflets.map((p, i) => (
                <mesh key={i} geometry={LEAFLET} position={p} raycast={noRaycast}>
                    <meshBasicMaterial color="#DCE3FF" toneMapped={false} transparent opacity={lit ? 1 : 0.85} />
                </mesh>
            ))}
            {[-1, 1].map(side => (
                <group key={side}>
                    <mesh geometry={END_RING} position={[side * FIBER_HALF, 0, 0]}>
                        <meshStandardMaterial color="#7880B4" roughness={0.5} side={THREE.DoubleSide} emissive="#2A2F55" emissiveIntensity={lit ? 1.2 : 0.5} />
                    </mesh>
                    <mesh geometry={CAP} position={[side * (FIBER_HALF - 0.16), 0, 0]} raycast={noRaycast}>
                        <meshStandardMaterial color="#3A2840" roughness={0.9} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            ))}
            <instancedMesh ref={grains} args={[SPHERE, undefined, MEMBRANE_GRAINS.length]}>
                <meshPhysicalMaterial color="#B7BFEA" roughness={0.35} clearcoat={0.8} emissive="#3B4470" emissiveIntensity={lit ? 0.8 : 0.15} />
            </instancedMesh>
        </group>
    );
};

const Myofibrils = () => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('miofibrila');
    const mats = useMemo(() => {
        const side = new THREE.MeshPhysicalMaterial({
            map: sarcomereMap(), bumpMap: sarcomereBump(), bumpScale: 2.2, roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color('#FFD1DC'),
            sheenRoughness: 0.5, emissive: new THREE.Color('#5B2238'), emissiveIntensity: 0.12,
        });
        const end = new THREE.MeshStandardMaterial({ map: myofibrilEndMap(), roughness: 0.6, emissive: new THREE.Color('#5B2238'), emissiveIntensity: 0.12 });
        return [side, end, end];
    }, []);
    useLayoutEffect(() => () => { mats[0].dispose(); mats[1].dispose(); }, [mats]);
    useEffect(() => {
        const m = mesh.current;
        if (!m) return;
        for (const mat of m.material as THREE.MeshStandardMaterial[]) mat.emissiveIntensity = lit ? 0.75 : 0.12;
    }, [lit]);
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        MYOFIBRILS.forEach((f, i) => m.setMatrixAt(i, M.makeTranslation(0, f.y, f.z)));
        m.instanceMatrix.needsUpdate = true;
    }, []);
    return <instancedMesh ref={mesh} args={[MYOFIBRIL, mats, MYOFIBRILS.length]} {...bind} />;
};

/** Retículo sarcoplasmático (renda) e tríades nas junções A–I: só visual, o clique passa para a miofibrila. */
const Reticulum = () => {
    const sleeves = useRef<THREE.InstancedMesh>(null);
    const triads = useRef<THREE.InstancedMesh>(null);
    const nTriads = MYOFIBRILS.length * SARCOMERES * TRIAD_PHASES.length;
    useLayoutEffect(() => {
        const s = sleeves.current;
        const t = triads.current;
        if (!s || !t) return;
        let k = 0;
        MYOFIBRILS.forEach((f, i) => {
            s.setMatrixAt(i, M.makeTranslation(0, f.y, f.z));
            for (let j = 0; j < SARCOMERES; j++) {
                for (const ph of TRIAD_PHASES) t.setMatrixAt(k++, M.makeTranslation(MYO_START + (j + ph) * MYO_SARC_LEN, f.y, f.z));
            }
        });
        s.instanceMatrix.needsUpdate = true;
        t.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <>
            <instancedMesh ref={sleeves} args={[SR_SLEEVE, undefined, MYOFIBRILS.length]} raycast={noRaycast}>
                <meshStandardMaterial color="#F4EBDC" alphaMap={reticulumAlpha()} transparent opacity={0.4} depthWrite={false} side={THREE.DoubleSide} roughness={0.4} emissive="#6B5E48" emissiveIntensity={0.2} />
            </instancedMesh>
            <instancedMesh ref={triads} args={[TRIAD, undefined, nTriads]} raycast={noRaycast}>
                <meshStandardMaterial color="#F3EBDD" roughness={0.3} metalness={0.05} emissive="#6B5E48" emissiveIntensity={0.2} />
            </instancedMesh>
        </>
    );
};

const Mitochondria = () => {
    const outer = useRef<THREE.InstancedMesh>(null);
    const cristae = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('mitocondria');
    useLayoutEffect(() => {
        const o = outer.current;
        const c = cristae.current;
        if (!o || !c) return;
        MITOCHONDRIA.forEach((m, i) => {
            Q.setFromAxisAngle(X_AXIS, m.rot);
            M.compose(P.set(m.p[0], m.p[1], m.p[2]), Q, S.set(m.s, m.s, m.s));
            o.setMatrixAt(i, M);
            c.setMatrixAt(i, M);
        });
        o.instanceMatrix.needsUpdate = true;
        c.instanceMatrix.needsUpdate = true;
    }, []);
    return (
        <group {...bind}>
            <instancedMesh ref={cristae} args={[MITO_CRISTAE, undefined, MITOCHONDRIA.length]} raycast={noRaycast}>
                <meshStandardMaterial color="#A7DDB8" roughness={0.45} emissive="#1F5135" emissiveIntensity={lit ? 1.2 : 0.45} side={THREE.DoubleSide} />
            </instancedMesh>
            <instancedMesh ref={outer} args={[MITO_OUTER, undefined, MITOCHONDRIA.length]}>
                <meshPhysicalMaterial
                    color="#4F8A66" roughness={0.25} clearcoat={1} clearcoatRoughness={0.2} sheen={0.8} sheenColor="#BBF7D0"
                    transparent opacity={0.66} depthWrite={false} emissive="#1F5135" emissiveIntensity={lit ? 0.9 : 0.25}
                />
            </instancedMesh>
        </group>
    );
};

const PORT_COLOR: Readonly<Record<PortId, string>> = { mct4: C.lactate, mct1: '#E7B008', nhe1: C.sodium, nbc: C.base };

/** Uma família de transportadores (todas as cópias acendem juntas). Brilha mais com a exportação ligada. */
const PortFamily = ({ id, simRef }: { id: PortId; simRef: SimRef }) => {
    const { bind, lit } = useStructure(id);
    const group = useRef<THREE.Group>(null);
    const litRef = useRef(lit);
    useEffect(() => { litRef.current = lit; }, [lit]);
    useFrame(({ clock }) => {
        const g = group.current;
        if (!g) return;
        const ef = simRef.current.meter.efflux;
        const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 4);
        const body = litRef.current ? 1.1 : 0.22 + ef * (0.45 + 0.2 * pulse);
        const collar = litRef.current ? 0.9 : 0.15 + ef * 0.5;
        g.traverse(o => {
            if (o instanceof THREE.Mesh) (o.material as THREE.MeshPhysicalMaterial).emissiveIntensity = o.name === 'collar' ? collar : body;
        });
    });
    const color = PORT_COLOR[id];
    return (
        <group ref={group} {...bind}>
            {PORT_X[id].map(x => (
                <group key={x} position={onFiber(x, PORT_A, FIBER_R)}>
                    <mesh geometry={PORTER}>
                        <meshPhysicalMaterial color={color} emissive={color} roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
                    </mesh>
                    <mesh name="collar" geometry={PORTER_COLLAR}>
                        <meshPhysicalMaterial color="#C7D2FE" emissive={color} emissiveIntensity={0.3} roughness={0.3} clearcoat={0.8} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

export const Fiber = ({ simRef }: { simRef: SimRef }) => (
    <group>
        <Sarcolemma />
        <Myofibrils />
        <Reticulum />
        <Mitochondria />
        <BufferSites simRef={simRef} />
        {(['mct4', 'mct1', 'nhe1', 'nbc'] as const).map(id => <PortFamily key={id} id={id} simRef={simRef} />)}
    </group>
);
