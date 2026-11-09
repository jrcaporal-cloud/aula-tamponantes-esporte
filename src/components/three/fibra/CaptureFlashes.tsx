import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { RING } from './geometry';
import { BUFFER_SITES, type BufferKind } from './layout';
import { noRaycast } from './materials';
import { SITE_KINDS } from './sim';
import type { SimRef } from './types';

/*
 * Lampejos de captura, de frente para a câmera: quando um sítio de tampão segura um H⁺, um anel laranja
 * (o H⁺) se fecha sobre ele enquanto um anel da cor do tampão se abre. No plasma, cada CO₂ que nasce
 * (HCO₃⁻ + H⁺ → CO₂ + H₂O) solta um anel claro. Só leitura da simulação; nada de estado do React.
 */

const KIND_COLOR: Readonly<Record<BufferKind, string>> = { proteina: C.base, fosfato: C.baseSoft, carnosina: C.carno, ck: C.ok };
const LIFE = 0.8;
const CO2_LIFE = 0.55;
const MAX = 260;

const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const COL = new THREE.Color();
const ACID = new THREE.Color(C.acid);
const CO2 = new THREE.Color('#E2E8F0');

const outEase = (u: number) => 1 - (1 - u) ** 3;

/** Escreve um anel na vaga `n` (de frente para a câmera). Devolve a próxima vaga. */
const put = (m: THREE.InstancedMesh, n: number, q: THREE.Quaternion, x: number, y: number, z: number, s: number, c: THREE.Color): number => {
    if (n >= MAX) return n;
    m.setMatrixAt(n, M.compose(P.set(x, y, z), q, S.set(s, s, s)));
    m.setColorAt(n, c);
    return n + 1;
};

export const CaptureFlashes = ({ simRef }: { simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const sites = useMemo(() => SITE_KINDS.flatMap(k => BUFFER_SITES[k].map(s => ({ p: s.p, color: new THREE.Color(KIND_COLOR[k]) }))), []);

    // cor por instância criada já na montagem: criar na primeira captura recompila o shader no meio da aula
    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m || m.instanceColor) return;
        m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3).setUsage(THREE.DynamicDrawUsage);
    }, []);

    useFrame(({ camera }) => {
        const m = mesh.current;
        if (!m) return;
        const sim = simRef.current;
        const q = camera.quaternion;
        let n = 0;
        for (let i = 0; i < sites.length; i++) {
            const age = sim.clock - sim.siteHit[i];
            if (age < 0 || age > LIFE) continue;
            const u = age / LIFE;
            const fade = (1 - u) ** 1.6;
            const [x, y, z] = sites[i].p;
            n = put(m, n, q, x, y, z, 0.16 + 0.5 * outEase(u), COL.copy(sites[i].color).multiplyScalar(1.7 * fade));
            n = put(m, n, q, x, y, z, 0.34 * (1 - outEase(u)) + 0.04, COL.copy(ACID).multiplyScalar(2 * fade));
        }
        const co2 = sim.co2;
        for (let i = 0; i < co2.n; i++) {
            if (!co2.alive[i] || co2.age[i] > CO2_LIFE) continue;
            const u = co2.age[i] / CO2_LIFE;
            const o = i * 3;
            n = put(m, n, q, co2.pos[o], co2.pos[o + 1], co2.pos[o + 2], 0.08 + 0.32 * outEase(u), COL.copy(CO2).multiplyScalar(1.3 * (1 - u) ** 2));
        }
        m.count = n;
        if (n === 0) return;
        m.instanceMatrix.clearUpdateRanges();
        m.instanceMatrix.addUpdateRange(0, n * 16);
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) {
            m.instanceColor.clearUpdateRanges();
            m.instanceColor.addUpdateRange(0, n * 3);
            m.instanceColor.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={mesh} args={[RING, undefined, MAX]} frustumCulled={false} raycast={noRaycast}>
            <meshBasicMaterial color="#ffffff" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </instancedMesh>
    );
};
