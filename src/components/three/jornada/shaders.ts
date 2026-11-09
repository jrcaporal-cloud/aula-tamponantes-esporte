import * as THREE from 'three';

/*
 * Shaders procedurais da jornada (sem textura: não ladrilham e não pesam no carregamento):
 *  - mucosa: relevo (vilosidades / rugas com áreas gástricas) entra na normal, a umidade na
 *    rugosidade e, no intestino, uma onda peristáltica no vértice;
 *  - face do corte: grão fibroso por cima das camadas;
 *  - plasma: o sangue que corre dentro do vaso, com brilho proporcional ao HCO₃⁻ do quadro.
 * O relevo some antes de virar ruído de pixel (frequência limitada por `fwidth`): nada cintila.
 */

/** Hash inteiro e ruído de valor 2D/3D + fBm de 4 oitavas + Voronoi (F1, F2). */
// adaptado de shader-art-coding/glsl (hash.glsl, noise.glsl) — MIT
const NOISE = /* glsl */ `
uint jPcg(uint v) { uint s = v * 747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float jHash(vec2 p) { uvec2 q = uvec2(ivec2(floor(p))); return float(jPcg(q.x + jPcg(q.y)) >> 8u) * (1.0 / 16777216.0); }
float jHash3(vec3 p) { uvec3 q = uvec3(ivec3(floor(p))); return float(jPcg(q.x + jPcg(q.y + jPcg(q.z))) >> 8u) * (1.0 / 16777216.0); }
float jNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(jHash(i), jHash(i + vec2(1.0, 0.0)), u.x), mix(jHash(i + vec2(0.0, 1.0)), jHash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float jNoise3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(jHash3(i), jHash3(i + vec3(1, 0, 0)), u.x), mix(jHash3(i + vec3(0, 1, 0)), jHash3(i + vec3(1, 1, 0)), u.x), u.y),
        mix(mix(jHash3(i + vec3(0, 0, 1)), jHash3(i + vec3(1, 0, 1)), u.x), mix(jHash3(i + vec3(0, 1, 1)), jHash3(i + vec3(1, 1, 1)), u.x), u.y),
        u.z);
}
float jFbm(vec2 p) {
    float s = 0.0; float a = 0.5;
    for (int k = 0; k < 4; k++) { s += a * jNoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return s / 0.9375;
}
/** Ruído periódico em y (período P células, inteiro): sem costura ao redor do tubo. */
float jNoiseP(vec2 p, float P) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    float y0 = mod(i.y, P); float y1 = mod(i.y + 1.0, P);
    return mix(mix(jHash(vec2(i.x, y0)), jHash(vec2(i.x + 1.0, y0)), u.x), mix(jHash(vec2(i.x, y1)), jHash(vec2(i.x + 1.0, y1)), u.x), u.y);
}
float jFbmP(vec2 p, float P) {
    float s = 0.0; float a = 0.5;
    for (int k = 0; k < 4; k++) { s += a * jNoiseP(p, P); p = vec2(p.x * 2.03 + 5.3, p.y * 2.0); P *= 2.0; a *= 0.5; }
    return s / 0.9375;
}
vec2 jVoronoi(vec2 p) {
    vec2 ip = floor(p); vec2 fp = fract(p); float f1 = 8.0; float f2 = 8.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = vec2(jHash(ip + g), jHash(ip + g + vec2(41.0, 17.0)));
        vec2 r = g + 0.85 * o - fp;
        float d = dot(r, r);
        if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
    }
    return sqrt(vec2(f1, f2));
}
`;

/** Normal perturbada por um gradiente de altura em tela (Mikkelsen, igual ao bump do three.js). */
const PERTURB = /* glsl */ `
vec3 jPerturb(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
    vec3 sx = normalize(dFdx(surfPos)); vec3 sy = normalize(dFdy(surfPos));
    vec3 r1 = cross(sy, surfNorm); vec3 r2 = cross(surfNorm, sx);
    float det = dot(sx, r1) * faceDir;
    vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
    return normalize(abs(det) * surfNorm - grad);
}
`;

export type MucosaKind = 'villi' | 'rugae';

/**
 * Altura da mucosa em uv de mundo (uv.x ao longo do tubo, uv.y no arco). `fw` = tamanho do pixel
 * em uv: o detalhe fino se apaga antes de ficar menor que ~1 px.
 */
const HEIGHT: Record<MucosaKind, string> = {
    // vilosidades: domos em células de Voronoi sobre criptas/sulcos sinuosos de baixa frequência
    villi: /* glsl */ `
float jHeight(vec2 uv, float fw) {
    // o Voronoi só roda quando as vilosidades têm pixels para aparecer (de longe é só a prega)
    float detail = 1.0 - smoothstep(0.06, 0.22, fw * 12.0);
    float dome = 0.5;
    if (detail > 0.0) dome = mix(0.5, 1.0 - smoothstep(0.05, 0.8, jVoronoi(uv * 12.0).x), detail);
    float n = jNoise(uv * 2.2);
    float fold = 0.5 + 0.5 * sin(uv.x * 7.0 + uv.y * 1.3 + n * 4.0);
    return dome * 0.55 + fold * fold * 0.45;
}`,
    // rugas finas e sinuosas + áreas gástricas (mosaico de sulcos entre células de Voronoi)
    rugae: /* glsl */ `
float jHeight(vec2 uv, float fw) {
    float n = jFbm(uv * 1.1);
    float ridge = 0.5 + 0.5 * sin(uv.y * 6.5 + n * 5.5);
    float detail = 1.0 - smoothstep(0.06, 0.22, fw * 5.0);
    float areae = 0.8;
    if (detail > 0.0) {
        vec2 v = jVoronoi(uv * 5.0);
        areae = mix(0.8, smoothstep(0.0, 0.45, v.y - v.x), detail);
    }
    return ridge * ridge * 0.7 + areae * 0.3;
}`,
};

export interface MucosaUniforms {
    uTime: { value: number };
    uBump: { value: number };
    /** Onda peristáltica: amplitude (0 desliga), número de onda e velocidade. */
    uPeriAmp: { value: number };
}

/**
 * Mucosa procedural num material físico (mantém a luz, o verniz e o veludo): altura → normal,
 * vales mais escuros e mais úmidos (rugosidade menor), e no intestino a onda peristáltica.
 * Uniformes em `userData.mucosa`.
 */
export const withMucosa = (m: THREE.MeshPhysicalMaterial, kind: MucosaKind, bump: number, peristalsis: boolean): THREE.MeshPhysicalMaterial => {
    const u: MucosaUniforms = { uTime: { value: 0 }, uBump: { value: bump }, uPeriAmp: { value: peristalsis ? 0.07 : 0 } };
    m.userData.mucosa = u;
    m.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, u);
        const peri = peristalsis
            ? `float jPw = 0.5 + 0.5 * sin(uv.x * 2.4 - uTime * 1.6); float jPw2 = jPw * jPw; transformed -= objectNormal * (jPw2 * jPw2 * jPw2) * uPeriAmp;`
            : '';
        shader.vertexShader = 'uniform float uTime; uniform float uPeriAmp; varying vec2 vJUv;\n' + shader.vertexShader.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>\n vJUv = uv; ${peri}`,
        );
        shader.fragmentShader = `uniform float uBump; varying vec2 vJUv; float jH; vec2 jdH;\n${NOISE}${PERTURB}${HEIGHT[kind]}\n` + shader.fragmentShader
            .replace('#include <color_fragment>', `#include <color_fragment>
    jH = jHeight(vJUv, length(fwidth(vJUv)));
    jdH = vec2(dFdx(jH), dFdy(jH)) * uBump;
    diffuseColor.rgb *= mix(0.62, 1.1, jH);`)
            .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
    roughnessFactor = clamp(roughnessFactor * mix(0.62, 1.2, jH), 0.12, 1.0);`)
            .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
    normal = jPerturb(- vViewPosition, normal, jdH, faceDirection);`);
    };
    m.customProgramCacheKey = () => `jornada-mucosa-${kind}-${peristalsis ? 'peri' : 'still'}`;
    return m;
};

/** Face do corte: grão fibroso 3D (posição do objeto) por cima das cores de camada. */
export const withCutGrain = (m: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial => {
    m.onBeforeCompile = shader => {
        shader.vertexShader = 'varying vec3 vJPos;\n' + shader.vertexShader.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\n vJPos = position;',
        );
        shader.fragmentShader = `varying vec3 vJPos;\n${NOISE}\n` + shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
    float jFw = length(fwidth(vJPos)) * 14.0;
    float jG = jNoise3(vJPos * 14.0) * 0.6 + jNoise3(vJPos * vec3(30.0, 30.0, 30.0) + 7.0) * 0.4;
    diffuseColor.rgb *= mix(1.0, 0.8 + 0.4 * jG, 1.0 - smoothstep(0.3, 0.9, jFw));`);
    };
    m.customProgramCacheKey = () => 'jornada-cut-grain';
    return m;
};

export interface PlasmaUniforms {
    uTime: { value: number };
    uLen: { value: number };
    /** Nível de HCO₃⁻ no sangue × presença (0 … 1): o brilho do plasma. */
    uLevel: { value: number };
    uDeep: { value: THREE.Color };
    uSoft: { value: THREE.Color };
}

/**
 * Plasma: tubo interno aditivo. fBm que corre ao longo do vaso (uv.x em mundo) com a onda de pulso
 * (a mesma da parede) e o brilho preso ao nível de HCO₃⁻. Por dentro (faces de trás) é mais forte;
 * a face da frente só vela, para os íons continuarem legíveis.
 */
export const plasmaMaterial = (u: PlasmaUniforms, pulseHz: number): THREE.ShaderMaterial => new THREE.ShaderMaterial({
    uniforms: { ...u },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
    vertexShader: /* glsl */ `
        uniform float uTime; uniform float uLen;
        varying vec2 vUv; varying float vBand; varying vec3 vN; varying vec3 vV;
        void main() {
            float f = fract(uTime * ${pulseHz.toFixed(3)}) * 1.3 - 0.15;
            float d = (uv.x / uLen - f) / 0.06;
            vBand = exp(-d * d);
            vec3 p = position + normal * vBand * 0.03;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vUv = uv; vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
        }`,
    fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uLevel; uniform vec3 uDeep; uniform vec3 uSoft;
        varying vec2 vUv; varying float vBand; varying vec3 vN; varying vec3 vV;
        ${NOISE}
        void main() {
            // nuvens alongadas no sentido do fluxo + filetes finos mais rápidos (o pulso acelera os dois)
            float drift = uTime * 0.8 + vBand * 0.35;
            float n = jFbmP(vec2(vUv.x * 0.8 - drift, vUv.y * 8.0), 8.0);
            float streak = jNoiseP(vec2(vUv.x * 0.45 - drift * 1.8, vUv.y * 16.0), 16.0);
            float body = smoothstep(0.35, 0.85, n) * 0.7 + streak * streak * streak * 0.5;
            float fres = 1.0 - abs(dot(normalize(vN), normalize(vV)));
            float side = gl_FrontFacing ? 0.25 : 0.9;
            float a = uLevel * side * (0.18 + body) * (0.5 + fres * 0.8) * (1.0 + 1.6 * vBand);
            vec3 c = mix(uDeep, uSoft, clamp(body + vBand * 0.6, 0.0, 1.0));
            gl_FragColor = vec4(c * a, 1.0);
        }`,
});
