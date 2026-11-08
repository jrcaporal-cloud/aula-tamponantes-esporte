import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { FIBER, MCT_X, MEMBRANE_Y } from './anatomy';
import { dark, rimMaterial } from './materials';
import { useStructure } from './selection';
import { SYS, type JourneyStateRef } from './state';
import { striationTexture } from './textures';

/*
 * Detalhes da fibra: linhas Z (anéis finos na metade de trás), miofibrilas estriadas ao fundo (atrás
 * da névoa de H⁺, para não esconder as partículas) e os MCT como proteínas de membrana — um barril
 * de subunidades em volta do poro, na borda de cima do corte. Esquemático, fora de escala.
 */

const SUB = 7;
const SUB_R = 0.2;
const LEN = FIBER.x1 - FIBER.x0;
/** Miofibrilas: altura relativa ao raio; ficam no fundo da metade de trás. */
const MYO_Y: readonly number[] = [-0.58, -0.29, 0, 0.29, 0.58];

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const P = new THREE.Vector3();
const S = new THREE.Vector3(1, 1, 1);
const E = new THREE.Euler();

export const FiberDetails = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const { bind, lit } = useStructure('mct');
    const geo = useMemo(() => ({
        ring: new THREE.TorusGeometry(FIBER.r * 0.96, 0.014, 6, 48, Math.PI),
        pore: new THREE.TorusGeometry(0.16, 0.035, 8, 28),
        sub: new THREE.CapsuleGeometry(0.065, 0.3, 4, 10),
        myo: new THREE.CylinderGeometry(0.13, 0.13, LEN - 0.4, 20, 1, false),
    }), []);
    const mats = useMemo(() => {
        const tex = striationTexture();
        // o cilindro tem uv.y ao longo do eixo: gira a textura para as bandas ficarem transversais
        tex.center.set(0.5, 0.5);
        tex.rotation = Math.PI / 2;
        tex.repeat.set((LEN - 0.4) / 1.6, (LEN - 0.4) / 1.6);
        return {
            tex,
            ring: rimMaterial(C.acidSoft, 0.28),
            pore: rimMaterial(C.acidSoft, 1.2),
            sub: new THREE.MeshPhysicalMaterial({
                color: dark(C.acidSoft, 0.9), emissive: new THREE.Color(C.acid), emissiveIntensity: 0.35,
                roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2, sheen: 1, sheenColor: new THREE.Color(C.acidSoft),
            }),
            myo: new THREE.MeshPhysicalMaterial({
                color: dark(C.acidDeep, 0.4), emissive: new THREE.Color(C.acidDeep), emissiveIntensity: 0.05,
                roughness: 0.7, sheen: 0.35, sheenColor: new THREE.Color(C.acidSoft), sheenRoughness: 0.6,
                bumpMap: tex, bumpScale: 1.2,
            }),
        };
    }, []);
    useEffect(() => () => {
        Object.values(geo).forEach(g => g.dispose());
        Object.values(mats).forEach(m => m.dispose());
    }, [geo, mats]);

    const subRef = useRef<THREE.InstancedMesh>(null);
    const poreRef = useRef<THREE.Mesh>(null);
    const myoRef = useRef<THREE.InstancedMesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    const placed = useRef(false);
    /** Posições fixas das instâncias: escritas no primeiro quadro. */
    const place = (s: THREE.InstancedMesh, m: THREE.InstancedMesh) => {
        MCT_X.forEach((x, p) => {
            for (let k = 0; k < SUB; k++) {
                const a = (k / SUB) * Math.PI * 2;
                P.set(x + Math.cos(a) * SUB_R, MEMBRANE_Y - 0.02, -0.12 + Math.sin(a) * SUB_R);
                Q.setFromEuler(E.set(Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18));
                s.setMatrixAt(p * SUB + k, M.compose(P, Q, S));
            }
        });
        s.instanceMatrix.needsUpdate = true;
        MYO_Y.forEach((yk, i) => {
            const y = yk * FIBER.r;
            const z = -Math.sqrt(FIBER.r * FIBER.r - y * y) * 0.78;
            P.set((FIBER.x0 + FIBER.x1) / 2, FIBER.y + y, z);
            Q.setFromEuler(E.set(0, 0, Math.PI / 2));
            m.setMatrixAt(i, M.compose(P, Q, S));
        });
        m.instanceMatrix.needsUpdate = true;
        Q.identity();
    };

    useFrame(({ clock }) => {
        if (!placed.current && subRef.current && myoRef.current) {
            place(subRef.current, myoRef.current);
            placed.current = true;
        }
        const focus = 0.2 + 0.8 * stateRef.current.f.w[SYS.muscle];
        const pm = poreRef.current?.material as THREE.MeshStandardMaterial | undefined;
        if (pm) pm.emissiveIntensity = (lit ? 2.6 : 1.0 + 0.25 * Math.sin(clock.elapsedTime * 3)) * focus;
        const sm = subRef.current?.material as THREE.MeshPhysicalMaterial | undefined;
        if (sm) {
            sm.emissiveIntensity = (lit ? 0.9 : 0.35) * focus;
            sm.envMapIntensity = focus;
            sm.sheen = focus;
        }
        const mm = myoRef.current?.material as THREE.MeshPhysicalMaterial | undefined;
        if (mm) {
            mm.color.set(C.acidDeep).multiplyScalar(0.4 * focus);
            mm.sheen = 0.35 * focus;
            mm.envMapIntensity = focus;
        }
        const rm = ringRef.current?.material as THREE.MeshStandardMaterial | undefined;
        if (rm) rm.emissiveIntensity = 0.28 * focus;
    });

    const xs = useMemo(() => Array.from({ length: Math.round(LEN / 0.5) }, (_, i) => FIBER.x0 + 0.25 + i * 0.5), []);
    return (
        <group>
            {xs.map((x, i) => (
                <group key={x} position={[x, FIBER.y, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <mesh ref={i === 0 ? ringRef : undefined} geometry={geo.ring} material={mats.ring} rotation={[0, 0, -Math.PI / 2]} />
                </group>
            ))}
            <instancedMesh ref={myoRef} args={[geo.myo, mats.myo, MYO_Y.length]} />
            <instancedMesh ref={subRef} args={[geo.sub, mats.sub, MCT_X.length * SUB]} {...bind} />
            {MCT_X.map((x, i) => (
                <mesh key={x} ref={i === 0 ? poreRef : undefined} geometry={geo.pore} material={mats.pore} position={[x, MEMBRANE_Y - 0.02, -0.12]} rotation={[Math.PI / 2, 0, 0]} {...bind} />
            ))}
        </group>
    );
};
