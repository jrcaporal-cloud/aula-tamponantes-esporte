import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { DUMBBELL, GLOBULE, PHOSPHATE, TORUS } from './geometry';
import { BUFFER_SITES, CARNO_BASE, CARNO_LOADED, type BufferKind } from './layout';
import { useStructure } from './selection';
import { SITE_OFFSET } from './sim';
import type { SimRef } from './types';

/*
 * Sítios de tampão dentro da fibra. Cada captura de H⁺ dá um lampejo (o sítio cresce e clareia; o anel
 * de captura fica em CaptureFlashes).
 * A carnosina tem sítios extras que aparecem com a beta-alanina (mais violeta na fibra).
 */

const SPEC: Readonly<Record<BufferKind, { geo: THREE.BufferGeometry; size: number; color: string }>> = {
    proteina: { geo: GLOBULE, size: 0.17, color: C.baseDeep },
    fosfato: { geo: PHOSPHATE, size: 0.16, color: C.baseSoft },
    carnosina: { geo: DUMBBELL, size: 0.16, color: C.carno },
    ck: { geo: TORUS, size: 0.17, color: C.ok },
};

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const S = new THREE.Vector3();
const COL = new THREE.Color();
const WHITE = new THREE.Color('#ffffff');

const SiteKind = ({ kind, simRef }: { kind: BufferKind; simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { bind, lit } = useStructure(kind);
    const spec = SPEC[kind];
    const sites = BUFFER_SITES[kind];
    const base = useMemo(() => new THREE.Color(spec.color), [spec]);
    // brilho de captura já escrito em cada instância: a cor só sobe para a GPU quando muda
    const shownRef = useRef<Float32Array | null>(null);

    useLayoutEffect(() => {
        const m = mesh.current;
        if (!m) return;
        for (let i = 0; i < sites.length; i++) m.setColorAt(i, COL.set(spec.color));
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }, [sites, spec]);

    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const sim = simRef.current;
        const ba = sim.meter.baLevel;
        let recolor = false;
        const shown = (shownRef.current ??= new Float32Array(sites.length));
        for (let i = 0; i < sites.length; i++) {
            const o = sites[i];
            const hit = Math.exp(-(sim.clock - sim.siteHit[SITE_OFFSET[kind] + i]) * 3.2);
            let show = 1;
            if (kind === 'carnosina') show = i < CARNO_BASE ? 1 : i < CARNO_LOADED ? ba : 0;
            const s = spec.size * o.s * show * (1 + 0.55 * hit) * (lit ? 1.25 : 1);
            E.set(o.rot + clock.elapsedTime * 0.3, o.rot * 2, 0);
            m.setMatrixAt(i, M.compose(P.set(o.p[0], o.p[1], o.p[2]), Q.setFromEuler(E), S.set(s, s, s)));
            const glow = hit > 0.003 ? hit : 0;
            if (glow !== shown[i]) {
                shown[i] = glow;
                m.setColorAt(i, COL.copy(base).lerp(WHITE, 0.65 * glow));
                recolor = true;
            }
        }
        m.instanceMatrix.needsUpdate = true;
        if (recolor && m.instanceColor) m.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[spec.geo, undefined, sites.length]} frustumCulled={false} {...bind}>
            <meshPhysicalMaterial roughness={0.3} clearcoat={1} clearcoatRoughness={0.2} sheen={0.5} sheenColor="#ffffff" emissive={spec.color} emissiveIntensity={lit ? 0.9 : 0.4} />
        </instancedMesh>
    );
};

export const BufferSites = ({ simRef }: { simRef: SimRef }) => (
    <>
        {(['proteina', 'fosfato', 'carnosina', 'ck'] as const).map(k => <SiteKind key={k} kind={k} simRef={simRef} />)}
    </>
);
