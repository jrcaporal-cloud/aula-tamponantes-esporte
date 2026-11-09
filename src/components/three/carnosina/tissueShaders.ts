import * as THREE from 'three';

/*
 * Superfícies procedurais (sem textura) enxertadas nos materiais padrão do three via onBeforeCompile:
 * bicamada lipídica fluida, endotélio em paralelepípedos, hemácia com "subsuperfície" falsa e a pele
 * (placas de corneócitos, queratinócitos com núcleo). A luz, a neblina e o ambiente continuam os do three.
 */

/** Relógio compartilhado por vários materiais: um objeto só, atualizado uma vez por quadro. */
export type TimeUniform = { value: number };
export const makeTimeUniform = (): TimeUniform => ({ value: 0 });
/** Avança o relógio (fora dos componentes: o compilador do React não deixa mutar ali valores de hook). */
export const tickTime = (u: TimeUniform, t: number) => { u.value = t; };

/** Direção da luz de chave do estúdio (Studio.tsx), em coordenadas de mundo. */
const KEY_DIR = new THREE.Vector3(8, 16, 14).normalize();

/*
 * Hash inteiro e Voronoi com distância exata à borda.
 * Adaptado de shader-art-coding (MIT): hash.glsl (pcg, Jarzynski & Olano 2020) e noise.glsl (voronoiBorder, Quilez).
 */
const CELL_GLSL = /* glsl */ `
uvec3 cpcg3d(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    return v;
}
vec3 chash32(vec2 p) {
    ivec2 q = ivec2(floor(p));
    return vec3(cpcg3d(uvec3(q.x, q.y, 0x2545u)) >> 8u) * (1.0 / 16777216.0);
}
// x = distância à borda da célula, yz = vetor até o centro da célula, w = acaso da célula
vec4 cellBorder(vec2 p, float jitter) {
    vec2 ip = floor(p), fp = fract(p);
    vec2 mg = vec2(0.0), mr = vec2(0.0);
    float md = 8.0;
    for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 r = g + jitter * chash32(ip + g).xy - fp;
        float d = dot(r, r);
        if (d < md) { md = d; mr = r; mg = g; }
    }
    float cellRnd = chash32(ip + mg).z;
    md = 8.0;
    for (int j = -2; j <= 2; j++)
    for (int i = -2; i <= 2; i++) {
        vec2 g = mg + vec2(float(i), float(j));
        vec2 r = g + jitter * chash32(ip + g).xy - fp;
        vec2 dr = r - mr;
        if (dot(dr, dr) > 1e-5) md = min(md, dot(0.5 * (mr + r), normalize(dr)));
    }
    return vec4(md, mr, cellRnd);
}
`;

type Shader = THREE.WebGLProgramParametersWithUniforms;

/** Encadeia um onBeforeCompile novo ao que o material já tiver (ex.: o brilho de borda de `withRim`). */
const chain = <M extends THREE.Material>(mat: M, key: string, fn: (s: Shader) => void): M => {
    const prev = mat.onBeforeCompile.bind(mat);
    const prevKey = mat.customProgramCacheKey.bind(mat);
    mat.onBeforeCompile = (s, r) => { prev(s, r); fn(s); };
    mat.customProgramCacheKey = () => `${prevKey()}|${key}`;
    return mat;
};

/* ───────────────────────── Bicamada lipídica ───────────────────────── */

export interface LipidOpts {
    time: TimeUniform;
    /** Centros (x, z) das proteínas: a membrana ondula menos junto delas. */
    gates: readonly { x: number; z: number }[];
    /** Cabeça (cor por lipídio, verniz molhado) ou cauda (só acompanha o movimento). */
    part: 'head' | 'tail';
}

/**
 * Movimento de membrana fluida: cada lipídio (atributo `aLipid` = índice da cabeça) treme de lado e a
 * bicamada inteira ondula devagar, com a mesma função nas duas folhas e nas caudas (presas à cabeça).
 */
export const lipidMaterial = <M extends THREE.MeshStandardMaterial>(mat: M, o: LipidOpts): M => {
    const gates = o.gates.map(g => new THREE.Vector2(g.x, g.z));
    const keyDir = KEY_DIR.clone();
    return chain(mat, `lipid-${o.part}`, s => {
        s.uniforms.uTime = o.time;
        s.uniforms.uGates = { value: gates };
        s.uniforms.uKeyDir = { value: keyDir };
        s.vertexShader = s.vertexShader
            .replace('#include <common>', `#include <common>
uniform float uTime;
uniform vec2 uGates[${gates.length}];
attribute float aLipid;
varying float vLipid;
vec3 lipidOffset(vec3 o, float id) {
    // perto das proteínas a membrana é mais presa
    float pin = 1.0;
    for (int i = 0; i < ${gates.length}; i++) pin = min(pin, smoothstep(1.4, 3.2, distance(o.xz, uGates[i])));
    float t = uTime;
    float wave = sin(o.x * 0.34 + t * 0.55) * cos(o.z * 0.42 - t * 0.4) * 0.16
               + sin((o.x + o.z) * 0.21 - t * 0.31) * 0.08;
    float ph = id * 2.399;
    vec2 jit = vec2(sin(t * 1.7 + ph) + sin(t * 2.9 + ph * 1.7) * 0.5,
                    cos(t * 1.3 + ph * 1.3) + sin(t * 2.3 + ph * 0.7) * 0.5) * 0.045;
    return vec3(jit.x, wave, jit.y) * pin;
}`)
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLipid = aLipid;')
            .replace('#include <project_vertex>', `vec4 mvPosition = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
    mvPosition.xyz += lipidOffset(instanceMatrix[3].xyz, aLipid);
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`);
        s.fragmentShader = s.fragmentShader
            .replace('#include <common>', `#include <common>
uniform vec3 uKeyDir;
varying float vLipid;
float lipidRnd(float id) { return fract(sin(id * 12.9898) * 43758.5453); }`)
            .replace('#include <color_fragment>', `#include <color_fragment>
{
    // variação por lipídio: um pouco mais claro/escuro e mais quente/frio (composições diferentes)
    float r1 = lipidRnd(vLipid), r2 = lipidRnd(vLipid + 17.0);
    diffuseColor.rgb *= 0.86 + 0.26 * r1;
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.08, 0.94, 0.86), r2 * 0.6);
}`)
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
${o.part === 'head' ? `{
    // aspecto molhado: borda acesa (fresnel) e um brilho de luz enrolada (wrap) do lado da chave
    vec3 V = normalize(vViewPosition);
    float ndv = clamp(dot(normal, V), 0.0, 1.0);
    float fr = 1.0 - ndv;
    vec3 L = normalize((viewMatrix * vec4(uKeyDir, 0.0)).xyz);
    float wrapL = clamp((dot(normal, L) + 0.45) / 1.45, 0.0, 1.0);
    vec3 H = normalize(L + V);
    float glint = pow(max(dot(normal, H), 0.0), 60.0);
    totalEmissiveRadiance += vec3(1.0, 0.86, 0.6) * (fr * fr * fr * 0.55 + glint * 0.55) + diffuseColor.rgb * wrapL * 0.12;
}` : ''}`);
    });
};

/* ───────────────────────── Endotélio ───────────────────────── */

/**
 * Endotélio em paralelepípedos alongados no sentido do fluxo (eixo x): sulcos escuros entre as células,
 * núcleo saltado no meio de cada uma, relevo pela distância à borda e um brilho que corre com o sangue.
 */
export const endotheliumMaterial = <M extends THREE.MeshStandardMaterial>(mat: M, time: TimeUniform, radius: number): M =>
    chain(mat, 'endothelium', s => {
        s.uniforms.uTime = time;
        s.vertexShader = s.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vEndo;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvEndo = position;');
        s.fragmentShader = s.fragmentShader
            .replace('#include <common>', `#include <common>
uniform float uTime;
varying vec3 vEndo;
${CELL_GLSL}`)
            .replace('#include <color_fragment>', `#include <color_fragment>
// costura do ângulo dentro do corte do vaso (voltado para +z), nunca na parede visível
float eAng = atan(vEndo.y, -vEndo.z);
vec2 eP = vec2(vEndo.x / 2.6, eAng * ${radius.toFixed(3)} / 1.0);
vec4 eC = cellBorder(eP, 0.8);
// longe (células pequenas na tela) o desenho some aos poucos: nada de cintilar
vec2 eFw = fwidth(eP);
float eLod = 1.0 - smoothstep(0.06, 0.2, max(eFw.x, eFw.y));
float eW = max(fwidth(eC.x), 1e-3);
float eGroove = (1.0 - smoothstep(0.02, 0.07 + eW * 2.0, eC.x)) * eLod;
float eNuc = (1.0 - smoothstep(0.12, 0.19 + eW * 2.0, length(eC.yz * vec2(0.8, 1.5)))) * eLod;
// célula abaulada: mais clara no alto, mais escura junto ao sulco (sombreamento sem mexer na normal)
float eDome = smoothstep(0.0, 0.34, eC.x);
diffuseColor.rgb *= mix(1.0, (0.8 + 0.3 * eDome) * (0.92 + 0.16 * eC.w), eLod) * mix(1.0, 0.5, eGroove);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.1, 0.22), eNuc * 0.45);`)
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
    // brilho úmido que desliza no sentido do fluxo, mais forte no alto de cada célula
    float run = 0.5 + 0.5 * sin(vEndo.x * 0.32 - uTime * 1.4 + eAng * 0.8);
    float sheen = run * run * run * run;
    vec3 V = normalize(vViewPosition);
    float fr = 1.0 - clamp(abs(dot(normal, V)), 0.0, 1.0);
    totalEmissiveRadiance += vec3(1.0, 0.55, 0.62) * (sheen * 0.14 * mix(1.0, eDome, eLod) + fr * fr * 0.08) * (1.0 - eGroove);
}`);
    });

/* ───────────────────────── Hemácia ───────────────────────── */

/**
 * Hemácia com subsuperfície falsa: o miolo fino (bicôncavo) deixa passar luz e fica mais claro, mais ainda
 * contra a luz; o anel grosso escurece. Lê o raio no espaço do modelo (eixo y = eixo do disco).
 */
export const redCellMaterial = <M extends THREE.MeshStandardMaterial>(mat: M, strength = 1): M => {
    const keyDir = KEY_DIR.clone();
    return chain(mat, `rbc-${strength}`, s => {
        s.uniforms.uKeyDir = { value: keyDir };
        s.uniforms.uSss = { value: strength };
        s.vertexShader = s.vertexShader
            .replace('#include <common>', '#include <common>\nvarying float vRbcR;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRbcR = length(position.xz);');
        s.fragmentShader = s.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uKeyDir;\nuniform float uSss;\nvarying float vRbcR;')
            .replace('#include <color_fragment>', `#include <color_fragment>
float rbcCenter = 1.0 - smoothstep(0.12, 0.58, vRbcR);
float rbcTorus = smoothstep(0.5, 0.78, vRbcR) * (1.0 - smoothstep(0.9, 1.0, vRbcR));
diffuseColor.rgb *= mix(1.0, 0.56, rbcTorus);`)
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize((viewMatrix * vec4(uKeyDir, 0.0)).xyz);
    float back = smoothstep(-0.3, 1.0, dot(L, -V));
    float thin = rbcCenter * (0.4 + 0.6 * back);
    // luz que atravessa o miolo fino: vermelho mais vivo e mais claro
    totalEmissiveRadiance += vec3(1.0, 0.2, 0.13) * thin * 0.7 * uSss;
    // borda: um fio de luz no contorno do anel
    float fr = 1.0 - clamp(abs(dot(normal, V)), 0.0, 1.0);
    totalEmissiveRadiance += vec3(1.0, 0.45, 0.4) * fr * fr * fr * 0.22 * uSss;
}`);
    });
};

/* ───────────────────────── Pele ───────────────────────── */

/**
 * Camada córnea em placas (corneócitos achatados): sulcos escuros, cada placa levemente abaulada e de tom
 * próprio, luz enrolada quente (pele translúcida). Plano no xz do modelo.
 */
export const corneumMaterial = <M extends THREE.MeshStandardMaterial>(mat: M): M => {
    const keyDir = KEY_DIR.clone();
    return chain(mat, 'corneum', s => {
        s.uniforms.uKeyDir = { value: keyDir };
        s.vertexShader = s.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec2 vSkin;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSkin = position.xz;');
        s.fragmentShader = s.fragmentShader
            .replace('#include <common>', `#include <common>
uniform vec3 uKeyDir;
varying vec2 vSkin;
${CELL_GLSL}`)
            .replace('#include <color_fragment>', `#include <color_fragment>
vec2 kP = vSkin * vec2(0.95, 1.1);
vec4 kC = cellBorder(kP, 0.75);
vec2 kFw = fwidth(kP);
float kLod = 1.0 - smoothstep(0.08, 0.25, max(kFw.x, kFw.y));
float kW = max(fwidth(kC.x), 1e-3);
float kGroove = (1.0 - smoothstep(0.02, 0.06 + kW * 2.0, kC.x)) * kLod;
float kDome = smoothstep(0.0, 0.4, kC.x);
diffuseColor.rgb *= mix(1.0, (0.85 + 0.2 * kDome) * (0.9 + 0.2 * kC.w), kLod) * mix(1.0, 0.55, kGroove);
diffuseColor.a = mix(diffuseColor.a, min(diffuseColor.a + 0.15, 1.0), kGroove);`)
            .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
    // normal pela distância à borda (analítica, sem derivadas): a placa desce em direção ao sulco
    vec2 kOut = -normalize(kC.yz + 1e-4) * (1.0 - kDome) * 0.45 * kLod;
    normal = normalize(normal + mat3(viewMatrix) * vec3(kOut.x, 0.0, kOut.y) * faceDirection);
}`)
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
    vec3 L = normalize((viewMatrix * vec4(uKeyDir, 0.0)).xyz);
    float wrapL = clamp((dot(normal, L) + 0.6) / 1.6, 0.0, 1.0);
    totalEmissiveRadiance += vec3(1.0, 0.58, 0.42) * wrapL * 0.1 * (1.0 - kGroove);
}`);
    });
};

/**
 * Queratinócito translúcido com núcleo: onde o raio de visão passa perto do centro da célula, aparece um
 * núcleo escuro e mais opaco; contra a luz, a borda acende quente.
 */
export const keratinocyteMaterial = <M extends THREE.MeshStandardMaterial>(mat: M): M => {
    const keyDir = KEY_DIR.clone();
    return chain(mat, 'keratinocyte', s => {
        s.uniforms.uKeyDir = { value: keyDir };
        s.vertexShader = s.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vCellC;\nvarying float vCellR;')
            .replace('#include <begin_vertex>', `#include <begin_vertex>
#ifdef USE_INSTANCING
    vCellC = (modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vCellR = length((modelViewMatrix * instanceMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
#else
    vCellC = (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vCellR = 1.0;
#endif`);
        s.fragmentShader = s.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uKeyDir;\nvarying vec3 vCellC;\nvarying float vCellR;')
            .replace('#include <color_fragment>', `#include <color_fragment>
// distância do centro da célula à linha de visão deste fragmento, em raios da célula
vec3 kDir = normalize(-vViewPosition);
float kMiss = length(vCellC - kDir * dot(vCellC, kDir)) / vCellR;
float kNuc = 1.0 - smoothstep(0.26, 0.4, kMiss);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.36, 0.17, 0.2), kNuc * 0.75);
diffuseColor.a = mix(diffuseColor.a, 0.62, kNuc);`)
            .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize((viewMatrix * vec4(uKeyDir, 0.0)).xyz);
    float back = smoothstep(-0.2, 1.0, dot(L, -V));
    float fr = 1.0 - clamp(abs(dot(normal, V)), 0.0, 1.0);
    totalEmissiveRadiance += vec3(1.0, 0.62, 0.45) * fr * fr * (0.12 + 0.3 * back) * (1.0 - kNuc);
}`);
    });
};
