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

/* ── Materiais de "museu": tecido com veludo (sheen) e película úmida (clearcoat) ── */

export interface TissueSpec {
    color: THREE.Color;
    emissive: string;
    emissiveIntensity: number;
    /** Brilho rasante (aproxima a luz que atravessa o tecido: subsurface barato). */
    sheen: string;
    bump?: THREE.Texture;
    bumpScale?: number;
    clearcoat?: number;
    roughness?: number;
}

/** Parede interna (mucosa) vista pelo corte. */
export const tissueMaterial = (s: TissueSpec): THREE.MeshPhysicalMaterial =>
    new THREE.MeshPhysicalMaterial({
        color: s.color,
        emissive: new THREE.Color(s.emissive),
        emissiveIntensity: s.emissiveIntensity,
        roughness: s.roughness ?? 0.55,
        metalness: 0,
        sheen: 1,
        sheenColor: new THREE.Color(s.sheen),
        sheenRoughness: 0.45,
        clearcoat: s.clearcoat ?? 0.45,
        clearcoatRoughness: 0.32,
        bumpMap: s.bump ?? null,
        bumpScale: s.bumpScale ?? 1,
        side: THREE.DoubleSide,
    });

/** Face do corte: camadas da parede em cores de vértice, com um leve verniz de peça seccionada. */
export const cutFaceMaterial = (): THREE.MeshPhysicalMaterial =>
    new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.42,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        emissive: new THREE.Color('#000000'),
        side: THREE.DoubleSide,
    });

/** Pulso do sangue: onda que percorre o vaso (fração 0…1 do comprimento) a cada batimento. */
export const PULSE_HZ = 1.05;
export const pulseFront = (t: number): number => ((t * PULSE_HZ) % 1) * 1.3 - 0.15;
export const pulseAt = (s: number, t: number): number => {
    const d = (s - pulseFront(t)) / 0.06;
    return Math.exp(-d * d);
};

export interface PulseUniforms { uTime: { value: number }; uLen: { value: number }; uColor: { value: THREE.Color }; uK: { value: number } }

/**
 * Injeta no material do vaso a onda de pulso: a parede incha um pouco e acende onde a onda passa.
 * As uniformes ficam em `userData.pulse` (atualizadas por quadro pela malha).
 */
export const withPulse = (m: THREE.MeshPhysicalMaterial, totalLen: number, hex: string): THREE.MeshPhysicalMaterial => {
    const u: PulseUniforms = { uTime: { value: 0 }, uLen: { value: totalLen }, uColor: { value: new THREE.Color(hex) }, uK: { value: 0.9 } };
    m.userData.pulse = u;
    m.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, u);
        const head = `uniform float uTime; uniform float uLen; varying float vBand;
            float pulseBand(float s){ float f = fract(uTime * ${PULSE_HZ.toFixed(3)}) * 1.3 - 0.15; float d = (s - f) / 0.06; return exp(-d * d); }\n`;
        shader.vertexShader = head + shader.vertexShader.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\n vBand = pulseBand(uv.x / uLen); transformed += objectNormal * vBand * 0.035;',
        );
        shader.fragmentShader = 'uniform vec3 uColor; uniform float uK; varying float vBand;\n' + shader.fragmentShader.replace(
            '#include <emissivemap_fragment>',
            '#include <emissivemap_fragment>\n totalEmissiveRadiance += uColor * vBand * uK;',
        );
    };
    m.customProgramCacheKey = () => 'jornada-pulse';
    return m;
};

/**
 * Bolha (ou vidro): transparente no meio, borda de fresnel e um ponto de brilho especular. Funciona
 * em malha comum e instanciada (USE_INSTANCING é definido pelo three.js). `uCutY` corta acima de um
 * y do mundo (nível da água no copo inclinado).
 */
export const bubbleMaterial = (hex: string, opts: { rim?: number; body?: number; spec?: number } = {}): THREE.ShaderMaterial =>
    new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            uColor: { value: new THREE.Color(hex) },
            uCutY: { value: 1e5 },
            uRim: { value: opts.rim ?? 1 },
            uBody: { value: opts.body ?? 0.1 },
            uSpec: { value: opts.spec ?? 1 },
            uDim: { value: 1 },
        },
        vertexShader: `varying vec3 vN; varying vec3 vV; varying float vWY;
            void main(){
                vec4 p = vec4(position, 1.0);
                vec3 n = normal;
                #ifdef USE_INSTANCING
                    p = instanceMatrix * p;
                    n = mat3(instanceMatrix) * n;
                #endif
                vec4 mv = modelViewMatrix * p;
                vWY = (modelMatrix * p).y;
                vN = normalize(normalMatrix * n);
                vV = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: `uniform vec3 uColor; uniform float uRim; uniform float uBody; uniform float uSpec; uniform float uDim; uniform float uCutY;
            varying vec3 vN; varying vec3 vV; varying float vWY;
            void main(){
                if (vWY > uCutY) discard;
                vec3 n = normalize(vN);
                float f = pow(1.0 - abs(dot(n, normalize(vV))), 2.2);
                float s = pow(max(dot(n, normalize(vec3(-0.45, 0.6, 0.66))), 0.0), 48.0);
                float s2 = pow(max(dot(n, normalize(vec3(0.5, -0.4, 0.75))), 0.0), 12.0) * 0.25;
                vec3 c = uColor * (0.35 + f * 1.3) + vec3(1.0) * (s * 1.6 + s2) * uSpec;
                float a = clamp(uBody + f * 0.8 * uRim + (s + s2) * uSpec, 0.0, 1.0) * uDim;
                gl_FragColor = vec4(c, a);
            }`,
    });

/** Partícula aditiva (rastros, clarões): soma luz em vez de cobrir. */
export const additiveMaterial = (hex: string, opacity: number, boost = 1.2): THREE.MeshBasicMaterial =>
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(hex).multiplyScalar(boost),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
    });

const NS = new THREE.Vector3();
const FWD = new THREE.Vector3(0, 1, 0);
const DIR = new THREE.Vector3();

/** Instância esticada ao longo de `dir` (rastro): comprimento `len`, espessura `s`. */
export const putStretched = (m: THREE.InstancedMesh, i: number, p: THREE.Vector3, dir: THREE.Vector3, s: number, len: number): void => {
    if (s <= 1e-4) { m.setMatrixAt(i, HIDDEN); return; }
    DIR.copy(dir);
    if (DIR.lengthSq() < 1e-10) DIR.set(1, 0, 0);
    Q.setFromUnitVectors(FWD, DIR.normalize());
    m.setMatrixAt(i, M.compose(p, Q, NS.set(s, len, s)));
    Q.identity();
};

/** Instância com escala por eixo (bolha que oscila). */
export const putScaled = (m: THREE.InstancedMesh, i: number, p: THREE.Vector3, sx: number, sy: number, sz: number): void => {
    if (sx <= 1e-4) { m.setMatrixAt(i, HIDDEN); return; }
    m.setMatrixAt(i, M.compose(p, Q, NS.set(sx, sy, sz)));
};
