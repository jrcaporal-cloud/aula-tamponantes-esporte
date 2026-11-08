import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { rng } from '../shared/math';
import { C } from '../../sims/kit/palette';
import { ARROW, CAP_END_RING, CAP_WALL, GLOBULE, RBC, TREFOIL } from './geometry';
import { makeRimMaterial, noRaycast } from './materials';
import { endotheliumMap } from './textures';
import { CAP_HALF, CAP_R, CAP_Y, CAP_Z, CA_POINT, FLOW_SPEED, PLASMA_R, PORT_X, RED_CELLS } from './layout';
import { useStructure } from './selection';
import type { SimRef } from './types';

/*
 * O capilar: parede translúcida com espessura (mosaico do endotélio, brilho de borda), plasma cuja cor acompanha o HCO₃⁻ (mais ciano = mais alcalino),
 * hemácias e HCO₃⁻ correndo no sentido +x, a anidrase carbônica nos pontos de reação e a seta do
 * CO₂ para o pulmão.
 */

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const DULL = new THREE.Color('#2E3A55');
const ALK = new THREE.Color(C.base);
const SPAN = CAP_HALF * 2;

const wrapX = (x: number) => ((((x + CAP_HALF) % SPAN) + SPAN) % SPAN) - CAP_HALF;

const TUBE = new THREE.CylinderGeometry(CAP_R, CAP_R, SPAN, 64, 1, true).rotateZ(-Math.PI / 2);
const TUBE_IN = new THREE.CylinderGeometry(CAP_R - CAP_WALL, CAP_R - CAP_WALL, SPAN, 64, 1, true).rotateZ(-Math.PI / 2);
const PLASMA = new THREE.CylinderGeometry(PLASMA_R, PLASMA_R, SPAN, 32, 1, true).rotateZ(-Math.PI / 2);

const Wall = ({ simRef }: { simRef: SimRef }) => {
    const { bind, lit } = useStructure('capilar');
    const plasma = useRef<THREE.MeshBasicMaterial>(null);
    const rim = useMemo(() => makeRimMaterial('#F9A8D4', { power: 2.4, strength: 0.75 }), []);
    useLayoutEffect(() => () => rim.dispose(), [rim]);
    const endo = endotheliumMap();
    useFrame(() => {
        const m = simRef.current.meter;
        const k = Math.min(Math.max(0.42 + 0.5 * m.bicLevel - 0.3 * m.load, 0.08), 1);
        plasma.current?.color.copy(DULL).lerp(ALK, k);
    });
    return (
        <group position={[0, CAP_Y, CAP_Z]} {...bind}>
            <mesh geometry={TUBE_IN}>
                <meshStandardMaterial map={endo} color="#B98393" transparent opacity={0.22} roughness={0.5} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh geometry={PLASMA} raycast={noRaycast}>
                <meshBasicMaterial ref={plasma} transparent opacity={0.3} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh geometry={TUBE}>
                <meshPhysicalMaterial
                    map={endo} color="#E7B7C4" transparent opacity={lit ? 0.45 : 0.3} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15}
                    sheen={0.8} sheenColor="#FBCFE8" depthWrite={false} emissive="#5B2238" emissiveIntensity={0.25}
                />
            </mesh>
            <mesh geometry={TUBE} material={rim} raycast={noRaycast} />
            {[-1, 1].map(s => (
                <mesh key={s} geometry={CAP_END_RING} position={[s * CAP_HALF, 0, 0]}>
                    <meshStandardMaterial color="#D79AAE" roughness={0.4} side={THREE.DoubleSide} emissive="#5B2238" emissiveIntensity={0.4} />
                </mesh>
            ))}
            <mesh geometry={ARROW} position={[CAP_HALF + 0.5, 0, 0]} raycast={noRaycast}>
                <meshStandardMaterial color={C.co2} emissive={C.co2} emissiveIntensity={0.6} roughness={0.3} />
            </mesh>
        </group>
    );
};

const RedCells = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure('hemacia');
    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const t = simRef.current.clock;
        RED_CELLS.forEach((c, i) => {
            const x = wrapX(c.x0 + t * FLOW_SPEED);
            E.set(c.spin + t * 0.4, Math.PI / 2 + Math.sin(c.spin + clock.elapsedTime * 0.5) * 0.4, 0);
            m.setMatrixAt(i, M.compose(P.set(x, CAP_Y + c.dy, CAP_Z + c.dz), Q.setFromEuler(E), S.set(1, 1, 1)));
        });
        m.instanceMatrix.needsUpdate = true;
    });
    return (
        <instancedMesh ref={mesh} args={[RBC, undefined, RED_CELLS.length]} frustumCulled={false} {...bind}>
            <meshPhysicalMaterial color="#B91C3C" roughness={0.4} sheen={1} sheenColor="#FDA4AF" sheenRoughness={0.4} clearcoat={0.4} emissive="#7F1D1D" emissiveIntensity={lit ? 1 : 0.3} />
        </instancedMesh>
    );
};

const HCO3_N = 90;

/** HCO₃⁻ do plasma: a quantidade visível sobe com o bicarbonato e cai um pouco com o consumo. */
const PlasmaBicarbonate = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const seeds = useMemo(() => {
        const r = rng(5);
        return Array.from({ length: HCO3_N }, () => ({ x0: r() * SPAN, a: r() * Math.PI * 2, rr: Math.sqrt(r()) * PLASMA_R * 0.82, th: r(), sp: 0.85 + r() * 0.3 }));
    }, []);
    useFrame(() => {
        const m = mesh.current;
        if (!m) return;
        const sim = simRef.current;
        const density = Math.min(0.42 + 0.48 * sim.meter.bicLevel - 0.14 * sim.meter.load, 1);
        const t = sim.clock;
        seeds.forEach((s, i) => {
            const on = s.th < density ? 1 : 0;
            const x = wrapX(s.x0 + t * FLOW_SPEED * s.sp);
            const k = 0.085 * on;
            E.set(t * 0.8 + s.a, s.a, 0);
            m.setMatrixAt(i, M.compose(P.set(x, CAP_Y + Math.cos(s.a) * s.rr, CAP_Z + Math.sin(s.a) * s.rr), Q.setFromEuler(E), S.set(k, k, k)));
        });
        m.instanceMatrix.needsUpdate = true;
    });
    return (
        <instancedMesh ref={mesh} args={[TREFOIL, undefined, HCO3_N]} frustumCulled={false} raycast={() => undefined}>
            <meshStandardMaterial color={C.base} emissive={C.base} emissiveIntensity={0.8} roughness={0.3} />
        </instancedMesh>
    );
};

/** Anidrase carbônica: enzimas na face interna da parede, onde o H⁺ chega. */
const Anhydrase = () => {
    const { bind, lit } = useStructure('anidrase');
    const spots = useMemo(() => [CA_POINT[0], ...[...PORT_X.mct4, ...PORT_X.mct1, ...PORT_X.nhe1].map(x => x + 1)], []);
    return (
        <group {...bind}>
            {spots.map((x, i) => (
                <mesh key={i} geometry={GLOBULE} position={[x, CA_POINT[1] - 0.25, CA_POINT[2]]} scale={lit ? 0.16 : 0.12} rotation={[i, i * 2, 0]}>
                    <meshPhysicalMaterial color="#E2E8F0" roughness={0.3} clearcoat={1} emissive={C.co2} emissiveIntensity={lit ? 1.4 : 0.5} />
                </mesh>
            ))}
        </group>
    );
};

export const Capillary = ({ simRef }: { simRef: SimRef }) => (
    <group>
        <Wall simRef={simRef} />
        <RedCells simRef={simRef} />
        <PlasmaBicarbonate simRef={simRef} />
        <Anhydrase />
    </group>
);
