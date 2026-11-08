import * as THREE from 'three';
import { dummy } from './common';

/*
 * Efeitos visuais do modelo: brilho em "sprite" instanciado (um quad que sempre encara a câmera, com
 * miolo forte e halo suave, somado ao que está atrás) e os materiais de estúdio (verniz das moléculas,
 * tecido aveludado). Tudo é escrito por quadro nas instâncias, sem React no meio.
 */

const GLOW_VERT = /* glsl */ `
varying vec2 vUv;
varying float vA;
void main() {
    vUv = uv - 0.5;
    vec4 c = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float s = length(instanceMatrix[0].xyz);
    c.xy += position.xy * s;
    #ifdef USE_INSTANCING_COLOR
        vA = instanceColor.r;
    #else
        vA = 1.0;
    #endif
    gl_Position = projectionMatrix * c;
}`;

const GLOW_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uCore;
varying vec2 vUv;
varying float vA;
void main() {
    float d = length(vUv) * 2.0;
    if (d > 1.0) discard;
    float core = exp(-d * d * 22.0) * uCore;
    float halo = exp(-d * d * 4.5) * (1.0 - d);
    gl_FragColor = vec4(uColor * (core + halo * 0.85) * vA, 1.0);
}`;

/** Material do brilho: aditivo, sem escrever profundidade, fora do tone mapping (o bloom pega). */
export const glowSpriteMaterial = (hex: string, boost = 1.4, core = 1.6) => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(hex).multiplyScalar(boost) }, uCore: { value: core } },
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    fog: false,
});

const QUAD = new THREE.PlaneGeometry(1, 1);
const noRay = () => undefined;

/**
 * Malha de brilhos com `n` instâncias, já com cor por instância (o shader nasce com ela e não recompila).
 * Começa toda escondida (escala 0).
 */
export const makeGlowMesh = (n: number, hex: string, boost = 1.4, core = 1.6) => {
    const m = new THREE.InstancedMesh(QUAD, glowSpriteMaterial(hex, boost, core), n);
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3).fill(1), 3);
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = 0; i < n; i++) m.setMatrixAt(i, dummy.matrix);
    m.frustumCulled = false;
    m.raycast = noRay;
    m.renderOrder = 5;
    return m;
};

/** Escreve um brilho: posição, diâmetro e intensidade (0–1). */
export const putGlow = (m: THREE.InstancedMesh, i: number, x: number, y: number, z: number, size: number, alpha = 1) => {
    const e = m.instanceMatrix.array as Float32Array;
    const o = i * 16;
    e[o] = size; e[o + 1] = 0; e[o + 2] = 0; e[o + 3] = 0;
    e[o + 4] = 0; e[o + 5] = size; e[o + 6] = 0; e[o + 7] = 0;
    e[o + 8] = 0; e[o + 9] = 0; e[o + 10] = size; e[o + 11] = 0;
    e[o + 12] = x; e[o + 13] = y; e[o + 14] = z; e[o + 15] = 1;
    const c = m.instanceColor?.array as Float32Array | undefined;
    if (c) c[i * 3] = alpha;
};

/** Marca as instâncias de brilho para subir à GPU. */
export const flushGlow = (m: THREE.InstancedMesh) => {
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
};

/** Descarta o material do brilho (a geometria é compartilhada). */
export const disposeGlow = (m: THREE.InstancedMesh) => { (m.material as THREE.Material).dispose(); m.dispose(); };

/** Verniz de bola-e-bastão: cor por vértice, verniz transparente por cima (reflete o estúdio). */
export const moleculeMaterial = (emissive = '#1e1b4b', emissiveIntensity = 0.3, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
    new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.32,
        metalness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        emissive,
        emissiveIntensity,
        envMapIntensity: 1.1,
        ...extra,
    });

/** Tecido mole: veludo (sheen) e um pouco de luz própria para não ficar chapado no escuro. */
export const tissueMaterial = (color: string, sheen: string, emissive: string, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
    new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.62,
        sheen: 1,
        sheenColor: new THREE.Color(sheen),
        sheenRoughness: 0.45,
        clearcoat: 0.35,
        clearcoatRoughness: 0.5,
        emissive,
        emissiveIntensity: 0.35,
        envMapIntensity: 0.7,
        ...extra,
    });

/**
 * Brilho de borda (fresnel) somado ao material padrão: a silhueta acende, como luz de recorte.
 * Usado em vidro, enzimas e membranas translúcidas.
 */
export const withRim = <M extends THREE.MeshStandardMaterial>(mat: M, hex: string, power = 2.4, strength = 1.2): M => {
    const rim = new THREE.Color(hex);
    mat.onBeforeCompile = shader => {
        shader.uniforms.uRim = { value: rim };
        shader.uniforms.uRimPow = { value: power };
        shader.uniforms.uRimK = { value: strength };
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uRim; uniform float uRimPow; uniform float uRimK;')
            .replace(
                '#include <emissivemap_fragment>',
                '#include <emissivemap_fragment>\nfloat rimF = pow(1.0 - abs(dot(normalize(vViewPosition), normal)), uRimPow);\ntotalEmissiveRadiance += uRim * rimF * uRimK;',
            );
    };
    mat.customProgramCacheKey = () => `rim-${hex}-${power}-${strength}`;
    return mat;
};
