import * as THREE from 'three';
import { C } from '../../sims/kit/palette';

/*
 * Materiais da cena. Os tons de tecido derivam da paleta da aula (escurecidos): ardósia = tecido
 * neutro, ciano = sangue com bicarbonato, laranja = fibra ácida, lima = sódio, rosa = desconforto.
 */

export const dark = (hex: string, k: number): THREE.Color => new THREE.Color(hex).multiplyScalar(k);

export const COL = {
    tissue: dark(C.co2, 0.32),
    tissueLit: dark(C.co2, 0.55),
    vessel: dark(C.baseDeep, 0.75),
    fiber: dark(C.acidDeep, 0.55),
    water: new THREE.Color(C.text),
} as const;

/** Casca translúcida de "vidro": brilha na silhueta (fresnel) e quase some de frente. */
export const fresnelMaterial = (hex: string, strength: number): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: { uColor: { value: new THREE.Color(hex) }, uK: { value: strength } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uK; varying vec3 vN; varying vec3 vV;
        void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4); gl_FragColor = vec4(uColor, f * uK); }`,
});

/** Parede interna do corte (metade de trás do tubo). */
export const wallMaterial = (base: THREE.Color, emissive: string, emissiveIntensity: number): THREE.MeshStandardMaterial =>
    new THREE.MeshStandardMaterial({
        color: base,
        emissive: new THREE.Color(emissive),
        emissiveIntensity,
        roughness: 0.72,
        metalness: 0.04,
        side: THREE.DoubleSide,
    });

/** Borda brilhante do corte. */
export const rimMaterial = (hex: string, intensity = 1.4): THREE.MeshStandardMaterial =>
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: intensity, roughness: 0.4 });

/** Partícula que brilha (íons, bolhas): sem sombreamento, um pouco acima do limiar do bloom. */
export const glowMaterial = (hex: string, boost = 1.35, opacity = 1): THREE.MeshBasicMaterial =>
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(hex).multiplyScalar(boost),
        transparent: opacity < 1,
        opacity,
        depthWrite: opacity >= 1,
        toneMapped: false,
    });

/** Geometrias de partícula compartilhadas. */
export const SPHERE_LO = new THREE.IcosahedronGeometry(1, 1);
export const SPHERE_MID = new THREE.IcosahedronGeometry(1, 2);
export const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0);

const M = new THREE.Matrix4();
const Q = new THREE.Quaternion();
const S = new THREE.Vector3();

/** Escreve a instância i numa posição com escala uniforme (0 esconde). */
export const put = (m: THREE.InstancedMesh, i: number, p: THREE.Vector3, s: number): void => {
    if (s <= 1e-4) { m.setMatrixAt(i, HIDDEN); return; }
    m.setMatrixAt(i, M.compose(p, Q, S.setScalar(s)));
};
