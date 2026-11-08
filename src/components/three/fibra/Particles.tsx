import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { ICO, LINEAR3, SPHERE, TREFOIL } from './geometry';
import type { Pool } from './pool';
import { POOL_SIZES, type Sim } from './sim';
import type { SimRef } from './types';

/*
 * Íons em movimento: uma InstancedMesh por espécie (núcleo), um Points aditivo (halo) e um rastro
 * (Points com o histórico curto de posições, afinando e apagando), todos lendo direto os arrays tipados
 * da simulação. Matrizes e atributos escritos por quadro, sem estado do React.
 */

const HALO_VS = `
attribute float aScale;
uniform float uSize;
uniform float uPx;
void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPx / max(-mv.z, 0.1);
    if (aScale < 0.02) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`;
const HALO_FS = `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(max(1.0 - d, 0.0), 2.2);
    gl_FragColor = vec4(uColor * a * uOpacity, a * uOpacity);
}`;

/** Amostras do rastro e intervalo entre elas (s): ~0,33 s de caminho visível. */
const TRAIL_K = 11;
const TRAIL_DT = 1 / 33;

type PoolKey = keyof typeof POOL_SIZES;

interface Species {
    key: PoolKey;
    geo: THREE.BufferGeometry;
    size: number;
    color: string;
    halo: number;
    /** Gira (moléculas não esféricas). */
    spin: boolean;
    /** Lampejo ao nascer (H₂CO₃ → CO₂ + H₂O). */
    burst: boolean;
    /** Força do rastro (0 = sem rastro). */
    trail: number;
}

const SPECIES: readonly Species[] = [
    { key: 'h', geo: SPHERE, size: 0.11, color: C.acid, halo: 0.8, spin: false, burst: false, trail: 0.9 },
    { key: 'lac', geo: ICO, size: 0.13, color: C.lactate, halo: 0.5, spin: true, burst: false, trail: 0.45 },
    { key: 'na', geo: SPHERE, size: 0.1, color: C.sodium, halo: 0.45, spin: false, burst: false, trail: 0.5 },
    { key: 'bic', geo: TREFOIL, size: 0.085, color: C.base, halo: 0.45, spin: true, burst: false, trail: 0.5 },
    { key: 'co2', geo: LINEAR3, size: 0.08, color: C.co2, halo: 0.4, spin: true, burst: true, trail: 0.4 },
];

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const E = new THREE.Euler();
const P = new THREE.Vector3();
const S = new THREE.Vector3();

const poolOf = (sim: Sim, key: PoolKey): Pool => sim[key];

interface Trail {
    geo: THREE.BufferGeometry;
    hist: Float32Array;
    head: { k: number; acc: number };
    lastAge: Float32Array;
}

/**
 * Empurra uma amostra no histórico a cada TRAIL_DT e escreve o rastro: a amostra mais velha é a menor.
 * Partícula que renasceu (idade voltou para trás) tem o histórico zerado na posição nova, sem risco
 * atravessando a cena.
 */
const writeTrail = (pool: Pool, tr: Trail, dt: number) => {
    const n = pool.n;
    tr.head.acc += dt;
    const push = tr.head.acc >= TRAIL_DT;
    if (push) {
        tr.head.acc %= TRAIL_DT;
        tr.head.k = (tr.head.k + 1) % TRAIL_K;
    }
    const pos = tr.geo.getAttribute('position') as THREE.BufferAttribute;
    const sc = tr.geo.getAttribute('aScale') as THREE.BufferAttribute;
    const out = pos.array as Float32Array;
    const outS = sc.array as Float32Array;
    for (let i = 0; i < n; i++) {
        const o = i * 3;
        const reborn = pool.age[i] < tr.lastAge[i];
        tr.lastAge[i] = pool.age[i];
        const base = i * TRAIL_K * 3;
        if (reborn) {
            for (let k = 0; k < TRAIL_K; k++) {
                tr.hist[base + k * 3] = pool.pos[o];
                tr.hist[base + k * 3 + 1] = pool.pos[o + 1];
                tr.hist[base + k * 3 + 2] = pool.pos[o + 2];
            }
        } else if (push) {
            const h = base + tr.head.k * 3;
            tr.hist[h] = pool.pos[o];
            tr.hist[h + 1] = pool.pos[o + 1];
            tr.hist[h + 2] = pool.pos[o + 2];
        }
        const s = pool.scale[i];
        for (let a = 0; a < TRAIL_K; a++) {
            // a = 0 é a amostra mais recente
            const k = (tr.head.k - a + TRAIL_K) % TRAIL_K;
            const src = base + k * 3;
            const dst = (i * TRAIL_K + a) * 3;
            out[dst] = tr.hist[src];
            out[dst + 1] = tr.hist[src + 1];
            out[dst + 2] = tr.hist[src + 2];
            outS[i * TRAIL_K + a] = s > 0 ? s * (1 - a / TRAIL_K) ** 1.3 : 0;
        }
    }
    pos.needsUpdate = true;
    sc.needsUpdate = true;
};

const SpeciesMesh = ({ sp, simRef }: { sp: Species; simRef: SimRef }) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const points = useRef<THREE.Points>(null);
    const n = POOL_SIZES[sp.key];
    const halo = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
        geo.setAttribute('aScale', new THREE.BufferAttribute(new Float32Array(n), 1).setUsage(THREE.DynamicDrawUsage));
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
        const mat = new THREE.ShaderMaterial({
            vertexShader: HALO_VS,
            fragmentShader: HALO_FS,
            uniforms: { uSize: { value: sp.size * 9 * sp.halo }, uPx: { value: 400 }, uColor: { value: new THREE.Color(sp.color) }, uOpacity: { value: 0.55 } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        return { geo, mat };
    }, [n, sp]);
    useLayoutEffect(() => () => { halo.geo.dispose(); halo.mat.dispose(); }, [halo]);

    const trailPts = useRef<THREE.Points>(null);
    const trail = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * TRAIL_K * 3), 3).setUsage(THREE.DynamicDrawUsage));
        geo.setAttribute('aScale', new THREE.BufferAttribute(new Float32Array(n * TRAIL_K), 1).setUsage(THREE.DynamicDrawUsage));
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
        const mat = new THREE.ShaderMaterial({
            vertexShader: HALO_VS,
            fragmentShader: HALO_FS,
            uniforms: { uSize: { value: sp.size * 5.5 }, uPx: { value: 400 }, uColor: { value: new THREE.Color(sp.color) }, uOpacity: { value: 0.5 * sp.trail } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        // histórico circular: hist[k] = posições de TRAIL_K amostras atrás
        return { geo, mat, hist: new Float32Array(n * TRAIL_K * 3), head: { k: 0, acc: 0 }, lastAge: new Float32Array(n).fill(1e9) };
    }, [n, sp]);
    useLayoutEffect(() => () => { trail.geo.dispose(); trail.mat.dispose(); }, [trail]);

    useFrame(({ clock, gl, camera, size }, dt) => {
        const m = mesh.current;
        const pts = points.current;
        if (!m || !pts) return;
        const pool = poolOf(simRef.current, sp.key);
        const t = clock.elapsedTime;
        for (let i = 0; i < pool.n; i++) {
            let s = pool.scale[i] * sp.size;
            if (s <= 0) { m.setMatrixAt(i, M.makeScale(0, 0, 0)); continue; }
            if (sp.burst) s *= 1 + 1.6 * Math.exp(-pool.age[i] * 5);
            const o = i * 3;
            P.set(pool.pos[o], pool.pos[o + 1], pool.pos[o + 2]);
            if (sp.spin) {
                const ph = pool.phase[i];
                E.set(t * 0.9 + ph, t * 0.7 + ph * 2, ph);
                m.setMatrixAt(i, M.compose(P, Q.setFromEuler(E), S.set(s, s, s)));
            } else {
                m.setMatrixAt(i, M.makeScale(s, s, s).setPosition(P));
            }
        }
        m.instanceMatrix.needsUpdate = true;
        const pos = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
        const sc = pts.geometry.getAttribute('aScale') as THREE.BufferAttribute;
        (pos.array as Float32Array).set(pool.pos);
        (sc.array as Float32Array).set(pool.scale);
        pos.needsUpdate = true;
        sc.needsUpdate = true;
        const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 40;
        const px = (size.height * gl.getPixelRatio()) / (2 * Math.tan((fov * Math.PI) / 360));
        (pts.material as THREE.ShaderMaterial).uniforms.uPx.value = px;
        const tm = trailPts.current?.material as THREE.ShaderMaterial | undefined;
        if (tm) tm.uniforms.uPx.value = px;
        writeTrail(pool, trail, dt);
    });

    return (
        <>
            <instancedMesh ref={mesh} args={[sp.geo, undefined, n]} frustumCulled={false} raycast={() => undefined}>
                <meshStandardMaterial color={sp.color} emissive={sp.color} emissiveIntensity={0.85} roughness={0.25} metalness={0.05} />
            </instancedMesh>
            <points ref={points} geometry={halo.geo} material={halo.mat} frustumCulled={false} raycast={() => undefined} />
            {sp.trail > 0 && <points ref={trailPts} geometry={trail.geo} material={trail.mat} frustumCulled={false} raycast={() => undefined} />}
        </>
    );
};

export const Particles = ({ simRef }: { simRef: SimRef }) => (
    <>
        {SPECIES.map(sp => <SpeciesMesh key={sp.key} sp={sp} simRef={simRef} />)}
    </>
);
