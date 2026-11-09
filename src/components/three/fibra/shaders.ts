import * as THREE from 'three';
import { FIBER_R } from './layout';
import { MEMBRANE_T, MYO_SARC_LEN, MYO_START } from './geometry';
import { SARCOMERES } from './textures';

/*
 * Superfícies procedurais da fibra, injetadas nos materiais físicos do three (onBeforeCompile): a luz,
 * o ambiente e o Bloom continuam os mesmos, só a cor e a normal passam a vir de funções no shader.
 * - Miofibrila: bandas do sarcômero (disco Z, banda I, banda A, zona H, linha M) com antisserrilhado
 *   por fwidth e relevo analítico do mesmo perfil; I e H estreitam com a intensidade (contração).
 * - Sarcolema: membrana mosqueada por ruído 3D no espaço do objeto, estrias Z fracas por baixo e um
 *   calor alaranjado que sobe com o H⁺ (pH da fibra).
 * - Borda do corte: bicamada (cabeças claras nas duas faces, caudas finas no meio).
 * Os valores por quadro (contração, acidez) ficam em FIBER_UNIFORMS, lidos por todos os materiais.
 */

/** Uniformes compartilhados, escritos uma vez por quadro (Fiber). */
export const FIBER_UNIFORMS = {
    /** 0 = repouso, 1 = contração máxima (segue a carga suavizada da simulação). */
    uContract: { value: 0 },
    /** 0 = pH de repouso, 1 = pH mais ácido da aula (segue o pH da fibra). */
    uAcid: { value: 0 },
};

/** Acidez normalizada a partir do pH da fibra (7,08 → 0; 6,60 → 1, as âncoras do medidor). */
export const acidFromPh = (pHi: number): number => Math.min(Math.max((7.08 - pHi) / 0.48, 0), 1);

// Hash e ruído de gradiente 3D com derivadas analíticas: adaptados de shader-art-coding glsl/hash.glsl e noise.glsl (MIT).
const NOISE_GLSL = /* glsl */ `
uvec3 fbPcg3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    return v;
}
vec3 fbHash33(vec3 p) { return vec3(fbPcg3(uvec3(ivec3(floor(p)))) >> 8u) * (1.0 / 16777216.0); }
vec4 fbNoiseD(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    vec3 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
    vec3 g000 = fbHash33(i) * 2.0 - 1.0;
    vec3 g100 = fbHash33(i + vec3(1, 0, 0)) * 2.0 - 1.0;
    vec3 g010 = fbHash33(i + vec3(0, 1, 0)) * 2.0 - 1.0;
    vec3 g110 = fbHash33(i + vec3(1, 1, 0)) * 2.0 - 1.0;
    vec3 g001 = fbHash33(i + vec3(0, 0, 1)) * 2.0 - 1.0;
    vec3 g101 = fbHash33(i + vec3(1, 0, 1)) * 2.0 - 1.0;
    vec3 g011 = fbHash33(i + vec3(0, 1, 1)) * 2.0 - 1.0;
    vec3 g111 = fbHash33(i + vec3(1, 1, 1)) * 2.0 - 1.0;
    float v000 = dot(g000, f);
    float v100 = dot(g100, f - vec3(1, 0, 0));
    float v010 = dot(g010, f - vec3(0, 1, 0));
    float v110 = dot(g110, f - vec3(1, 1, 0));
    float v001 = dot(g001, f - vec3(0, 0, 1));
    float v101 = dot(g101, f - vec3(1, 0, 1));
    float v011 = dot(g011, f - vec3(0, 1, 1));
    float v111 = dot(g111, f - vec3(1, 1, 1));
    float kx = v100 - v000, ky = v010 - v000, kz = v001 - v000;
    float kxy = v000 - v100 - v010 + v110;
    float kyz = v000 - v010 - v001 + v011;
    float kzx = v000 - v100 - v001 + v101;
    float kxyz = -v000 + v100 + v010 - v110 + v001 - v101 - v011 + v111;
    float value = v000 + kx * u.x + ky * u.y + kz * u.z + kxy * u.x * u.y + kyz * u.y * u.z + kzx * u.z * u.x + kxyz * u.x * u.y * u.z;
    vec3 grad = g000 + (g100 - g000) * u.x + (g010 - g000) * u.y + (g001 - g000) * u.z
        + (g000 - g100 - g010 + g110) * u.x * u.y
        + (g000 - g010 - g001 + g011) * u.y * u.z
        + (g000 - g100 - g001 + g101) * u.z * u.x
        + (-g000 + g100 + g010 - g110 + g001 - g101 - g011 + g111) * u.x * u.y * u.z
        + du * vec3(kx + kxy * u.y + kzx * u.z + kxyz * u.y * u.z,
                    ky + kxy * u.x + kyz * u.z + kxyz * u.x * u.z,
                    kz + kyz * u.y + kzx * u.x + kxyz * u.x * u.y);
    return vec4(value, grad);
}
`;

type Shader = THREE.WebGLProgramParametersWithUniforms;

const inject = (src: string, chunk: string, code: string, after = true): string => {
    const tag = `#include <${chunk}>`;
    if (!src.includes(tag)) throw new Error(`fibra/shaders: chunk ${chunk} não encontrado`);
    return src.replace(tag, after ? `${tag}\n${code}` : `${code}\n${tag}`);
};

/* ---------- Miofibrila: sarcômeros procedurais ---------- */

/* Cores das bandas (as mesmas da antiga textura de canvas). */
const BAND_I = new THREE.Color('#F0C4CD');
const BAND_A = new THREE.Color('#7E2F4A');
const BAND_H = new THREE.Color('#9C4A65');
const BAND_M = new THREE.Color('#5A1F35');
const BAND_Z = new THREE.Color('#3A1222');

const SARC_VERT_PARS = /* glsl */ `
varying vec2 vSarc;
varying vec3 vAxisV;
varying float vTint;
`;
const SARC_VERT = /* glsl */ `
vSarc = uv;
// eixo da miofibrila (x do objeto) no espaço da câmera, para inclinar a normal no relevo das bandas
vAxisV = normalize(normalMatrix * vec3(1.0, 0.0, 0.0));
#ifdef USE_INSTANCING
    // variação leve por miofibrila (tom e filamentos), sem tirar as bandas do registro com os discos Z
    vTint = vec3(fbPcg3(uvec3(ivec2(instanceMatrix[3].yz * 37.0 + 512.0), 7)) >> 8u).x * (1.0 / 16777216.0);
#else
    vTint = 0.5;
#endif
`;

const SARC_FRAG_PARS = /* glsl */ `
uniform float uContract;
uniform vec3 uBandI;
uniform vec3 uBandA;
uniform vec3 uBandH;
uniform vec3 uBandM;
uniform vec3 uBandZ;
uniform float uPhPerUnit;
uniform float uSarcBump;
varying vec2 vSarc;
varying vec3 vAxisV;
varying float vTint;

/* d = distância à linha M em fração do sarcômero (0 no meio, 0,5 no disco Z). */
float sarcIn(float d, float edge, float w) { return 1.0 - smoothstep(edge - w, edge + w, d); }
/* Meia-largura da banda A e da zona H: com a contração a banda I e a zona H estreitam. */
vec2 sarcEdges() { return vec2(mix(0.25, 0.3, uContract), mix(0.085, 0.03, uContract)); }
/* Perfil de altura: banda A saliente, zona H um pouco rebaixada, disco Z em sulco. */
float sarcHeight(float d, vec2 e, float w) {
    return 0.55 * sarcIn(d, e.x, w) - 0.18 * sarcIn(d, e.y, w) - smoothstep(0.47 - w, 0.5, d);
}
`;

const SARC_COLOR = /* glsl */ `
float fb_sv = vSarc.y * ${SARCOMERES.toFixed(1)};
float fb_sw = max(fwidth(fb_sv), 1e-4);
float fb_sd = abs(fract(fb_sv) - 0.5);
vec2 fb_se = sarcEdges();
float fb_aa = 0.75 * fb_sw + 0.004;
vec3 fb_band = mix(uBandI, uBandA, sarcIn(fb_sd, fb_se.x, fb_aa));
fb_band = mix(fb_band, uBandH, sarcIn(fb_sd, fb_se.y, fb_aa));
fb_band = mix(fb_band, uBandM, sarcIn(fb_sd, 0.013, fb_aa));
fb_band = mix(fb_band, uBandZ, smoothstep(0.455 - fb_aa, 0.455 + fb_aa, fb_sd));
// filamentos: estrias finas ao longo do eixo, mais marcadas na banda A (filamentos grossos)
float fb_fu = vSarc.x * 150.0;
float fb_fcell = mod(floor(fb_fu), 150.0);
float fb_fn = mix(fbHash33(vec3(fb_fcell, vTint * 97.0, 3.0)).x, fbHash33(vec3(mod(fb_fcell + 1.0, 150.0), vTint * 97.0, 3.0)).x, smoothstep(0.0, 1.0, fract(fb_fu)));
float fb_ffade = 1.0 - smoothstep(0.35, 0.9, fwidth(fb_fu));
fb_band *= 1.0 + (fb_fn - 0.5) * 0.26 * fb_ffade * (0.35 + 0.65 * sarcIn(fb_sd, fb_se.x, fb_aa));
// longe da câmera (bandas com menos de ~4 px) as bandas viram a média: sem moiré nem cintilação
float fb_sfade = 1.0 - smoothstep(0.1, 0.28, fb_sw);
vec3 fb_avg = uBandI * (1.0 - 2.0 * fb_se.x - 0.09) + uBandA * (2.0 * (fb_se.x - fb_se.y)) + uBandH * (2.0 * fb_se.y) + uBandZ * 0.09;
fb_band = mix(fb_avg, fb_band, fb_sfade);
diffuseColor.rgb *= fb_band * (0.93 + 0.14 * vTint);
`;

const SARC_NORMAL = /* glsl */ `
{
    // relevo analítico do mesmo perfil das bandas (diferença central no eixo, em unidades do objeto)
    const float fb_dd = 0.006;
    float fb_hp = sarcHeight(abs(fract(fb_sv + fb_dd) - 0.5), fb_se, fb_aa);
    float fb_hm = sarcHeight(abs(fract(fb_sv - fb_dd) - 0.5), fb_se, fb_aa);
    float fb_slope = (fb_hp - fb_hm) / (2.0 * fb_dd) * uPhPerUnit * uSarcBump * fb_sfade;
    vec3 fb_ax = normalize(vAxisV);
    vec3 fb_tg = fb_ax - normal * dot(fb_ax, normal);
    normal = normalize(normal - fb_tg * fb_slope);
}
`;

/** Liga as bandas procedurais num material físico da miofibrila (face lateral). */
export const applySarcomere = (mat: THREE.MeshPhysicalMaterial): void => {
    mat.onBeforeCompile = (shader: Shader) => {
        Object.assign(shader.uniforms, {
            uContract: FIBER_UNIFORMS.uContract,
            uBandI: { value: BAND_I },
            uBandA: { value: BAND_A },
            uBandH: { value: BAND_H },
            uBandM: { value: BAND_M },
            uBandZ: { value: BAND_Z },
            uPhPerUnit: { value: 1 / MYO_SARC_LEN },
            uSarcBump: { value: 0.011 },
        });
        let vs = inject(shader.vertexShader, 'common', NOISE_GLSL + SARC_VERT_PARS);
        vs = inject(vs, 'begin_vertex', SARC_VERT);
        let fs = inject(shader.fragmentShader, 'common', NOISE_GLSL + SARC_FRAG_PARS);
        fs = inject(fs, 'color_fragment', SARC_COLOR);
        fs = inject(fs, 'normal_fragment_maps', SARC_NORMAL);
        shader.vertexShader = vs;
        shader.fragmentShader = fs;
    };
    mat.customProgramCacheKey = () => 'fibra-sarcomero-v1';
    mat.needsUpdate = true;
};

/* ---------- Sarcolema: membrana orgânica ---------- */

const OBJ_VERT_PARS = /* glsl */ `
varying vec3 vObjP;
varying vec3 vBx;
varying vec3 vBy;
varying vec3 vBz;
`;
const OBJ_VERT = /* glsl */ `
vObjP = position;
// base do objeto no espaço da câmera: leva o gradiente do ruído (objeto) para a normal (câmera)
vBx = normalMatrix * vec3(1.0, 0.0, 0.0);
vBy = normalMatrix * vec3(0.0, 1.0, 0.0);
vBz = normalMatrix * vec3(0.0, 0.0, 1.0);
`;

const MEM_FRAG_PARS = /* glsl */ `
uniform float uAcid;
uniform vec3 uAcidColor;
uniform float uSarcStart;
uniform float uSarcLen;
uniform float uMemBump;
varying vec3 vObjP;
varying vec3 vBx;
varying vec3 vBy;
varying vec3 vBz;
/* peso de uma oitava: some antes de ficar menor que ~2 px (sem cintilação) */
float octW(float freq, float px) { return 1.0 - smoothstep(0.22, 0.45, freq * px); }
`;

const MEM_COLOR = /* glsl */ `
float fb_mpx = length(fwidth(vObjP));
// fbm de 4 oitavas com derivadas analíticas: a cor usa as duas primeiras, o relevo usa todas
const float F0 = 1.3;
vec4 fb_n1 = fbNoiseD(vObjP * F0);
float fb_w2 = octW(F0 * 2.07, fb_mpx);
vec4 fb_n2 = fbNoiseD(vObjP * (F0 * 2.07) + vec3(17.1, -3.7, 5.3));
float fb_w3 = octW(F0 * 4.3, fb_mpx);
vec4 fb_n3 = fb_w3 > 0.0 ? fbNoiseD(vObjP * (F0 * 4.3) + vec3(-8.3, 11.2, 2.9)) : vec4(0.0);
float fb_w4 = octW(F0 * 8.9, fb_mpx);
vec4 fb_n4 = fb_w4 > 0.0 ? fbNoiseD(vObjP * (F0 * 8.9) + vec3(4.4, 7.7, -12.5)) : vec4(0.0);
float fb_mottle = fb_n1.x * 0.62 + fb_n2.x * 0.3 * fb_w2 + fb_n3.x * 0.16 * fb_w3;
vec3 fb_memGrad = F0 * (fb_n1.yzw * 0.25 + fb_n2.yzw * (2.07 * 0.22 * fb_w2) + fb_n3.yzw * (4.3 * 0.16 * fb_w3) + fb_n4.yzw * (8.9 * 0.1 * fb_w4));
diffuseColor.rgb *= 1.0 + 0.3 * fb_mottle;
// estrias Z das miofibrilas vistas através da membrana (fracas, no registro dos sarcômeros)
float fb_zs = (vObjP.x - uSarcStart) / uSarcLen;
float fb_zw = max(fwidth(fb_zs), 1e-4);
float fb_zd = abs(fract(fb_zs) - 0.5);
float fb_zaa = 0.75 * fb_zw + 0.006;
float fb_zfade = 1.0 - smoothstep(0.08, 0.22, fb_zw);
float fb_zline = smoothstep(0.465 - fb_zaa, 0.465 + fb_zaa, fb_zd);
float fb_aband = 1.0 - smoothstep(0.27 - fb_zaa, 0.27 + fb_zaa, fb_zd);
diffuseColor.rgb *= 1.0 - (0.2 * fb_zline + 0.08 * fb_aband) * fb_zfade;
// acidez: a membrana esquenta (laranja do H⁺), mais nas manchas
float fb_acidPatch = smoothstep(-0.35, 0.45, fb_mottle);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.22, 0.86, 0.72), 0.5 * uAcid);
`;

const MEM_NORMAL = /* glsl */ `
{
    vec3 fb_gv = fb_memGrad.x * vBx + fb_memGrad.y * vBy + fb_memGrad.z * vBz;
    normal = normalize(normal - uMemBump * (fb_gv - normal * dot(fb_gv, normal)));
}
`;

const MEM_EMISSIVE = /* glsl */ `
totalEmissiveRadiance += uAcidColor * uAcid * (0.1 + 0.32 * fb_acidPatch);
`;

/** Liga a membrana procedural no material do sarcolema. */
export const applyMembrane = (mat: THREE.MeshPhysicalMaterial, acidColor: string): void => {
    mat.onBeforeCompile = (shader: Shader) => {
        Object.assign(shader.uniforms, {
            uAcid: FIBER_UNIFORMS.uAcid,
            uAcidColor: { value: new THREE.Color(acidColor) },
            uSarcStart: { value: MYO_START },
            uSarcLen: { value: MYO_SARC_LEN },
            uMemBump: { value: 0.2 },
        });
        let vs = inject(shader.vertexShader, 'common', OBJ_VERT_PARS);
        vs = inject(vs, 'begin_vertex', OBJ_VERT);
        let fs = inject(shader.fragmentShader, 'common', NOISE_GLSL + MEM_FRAG_PARS);
        fs = inject(fs, 'color_fragment', MEM_COLOR);
        fs = inject(fs, 'normal_fragment_maps', MEM_NORMAL);
        fs = inject(fs, 'emissivemap_fragment', MEM_EMISSIVE);
        shader.vertexShader = vs;
        shader.fragmentShader = fs;
    };
    mat.customProgramCacheKey = () => 'fibra-membrana-v1';
    mat.needsUpdate = true;
};

/* ---------- Borda do corte: bicamada lipídica ---------- */

const BILAYER_FRAG_PARS = /* glsl */ `
uniform float uArc;
uniform float uRin;
uniform float uRout;
varying vec3 vObjP;
`;

/*
 * t = 0 na face interna, 1 na externa. Cabeças polares: fileira de círculos claros junto a cada face;
 * caudas: pares de traços finos no miolo. Coordenada ao longo da borda: x (faixas) ou arco (anel).
 */
const BILAYER_COLOR = /* glsl */ `
float fb_bt = clamp((length(vObjP.yz) - uRin) / (uRout - uRin), 0.0, 1.0);
float fb_along = mix(vObjP.x, atan(vObjP.z, vObjP.y) * uRout, uArc);
const float HEAD_SPACING = 0.042;
float fb_bs = fb_along / HEAD_SPACING;
float fb_bsw = fwidth(fb_bs);
float fb_bfade = 1.0 - smoothstep(0.25, 0.6, fb_bsw);
float fb_thick = uRout - uRin;
float fb_hc = fb_bt < 0.5 ? 0.13 : 0.87;
vec2 fb_hq = vec2((fract(fb_bs) - 0.5) * HEAD_SPACING, (fb_bt - fb_hc) * fb_thick);
float fb_hd = length(fb_hq);
float fb_haa = fwidth(fb_hd) + 1e-4;
float fb_head = 1.0 - smoothstep(0.0145 - fb_haa, 0.0145 + fb_haa, fb_hd);
float fb_headBand = 1.0 - smoothstep(0.24, 0.29, min(fb_bt, 1.0 - fb_bt));
float fb_core = smoothstep(0.24, 0.3, fb_bt) * (1.0 - smoothstep(0.7, 0.76, fb_bt));
float fb_tails = 1.0 - smoothstep(0.035, 0.075, abs(abs(fract(fb_bs) - 0.5) - 0.11));
float fb_headMix = mix(0.55, fb_head, fb_bfade) * fb_headBand;
float fb_tailMix = mix(0.3, fb_tails, fb_bfade) * fb_core;
diffuseColor.rgb *= 0.62 + 0.95 * fb_headMix + 0.3 * fb_tailMix;
`;

/** Liga a bicamada procedural num material da borda do corte (uArc: 0 = faixa ao longo de x, 1 = anel). */
export const applyBilayer = (mat: THREE.MeshStandardMaterial, arc: 0 | 1): void => {
    mat.onBeforeCompile = (shader: Shader) => {
        Object.assign(shader.uniforms, {
            uArc: { value: arc },
            uRin: { value: FIBER_R - MEMBRANE_T },
            uRout: { value: FIBER_R },
        });
        shader.vertexShader = inject(inject(shader.vertexShader, 'common', 'varying vec3 vObjP;'), 'begin_vertex', 'vObjP = position;');
        shader.fragmentShader = inject(inject(shader.fragmentShader, 'common', BILAYER_FRAG_PARS), 'color_fragment', BILAYER_COLOR);
    };
    mat.customProgramCacheKey = () => 'fibra-bicamada-v1';
    mat.needsUpdate = true;
};
