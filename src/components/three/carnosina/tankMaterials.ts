import * as THREE from 'three';
import { C } from '../../sims/kit/palette';

/*
 * Materiais do tanque (etapa 5): o líquido (degradê de baixo para cima, borda acesa, faixas de luz
 * que ondulam) e a superfície (ondas que nascem onde cada cápsula cai). Shaders próprios, sem luz da
 * cena: o brilho é do próprio líquido, como num frasco iluminado por dentro.
 */

export const MAX_SPLASH = 6;

const deep = new THREE.Color('#2e1065');
const mid = new THREE.Color('#6d28d9');
const top = new THREE.Color(C.carnoSoft);

export const makeLiquidMaterial = () => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uDeep: { value: deep }, uMid: { value: mid }, uTop: { value: top } },
    vertexShader: /* glsl */ `
        varying float vY;
        varying vec3 vN;
        varying vec3 vV;
        varying vec3 vW;
        void main() {
            vY = position.y + 0.5;
            vec4 w = modelMatrix * vec4(position, 1.0);
            vW = w.xyz;
            vec4 mv = viewMatrix * w;
            vV = -mv.xyz;
            vN = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mv;
        }`,
    fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uDeep;
        uniform vec3 uMid;
        uniform vec3 uTop;
        varying float vY;
        varying vec3 vN;
        varying vec3 vV;
        varying vec3 vW;
        void main() {
            vec3 n = normalize(vN);
            vec3 v = normalize(vV);
            float fres = pow(1.0 - abs(dot(n, v)), 2.2);
            vec3 col = mix(uDeep, uMid, smoothstep(0.0, 0.75, vY));
            float a = atan(vW.z, vW.x);
            float caustic = sin(vW.y * 2.6 - uTime * 1.3 + sin(a * 5.0 + uTime * 0.7) * 0.9);
            caustic = smoothstep(0.55, 1.0, caustic) * 0.35;
            col += uTop * (caustic + fres * 0.9);
            col += uTop * smoothstep(0.82, 1.0, vY) * 0.35;
            gl_FragColor = vec4(col, 0.86);
        }`,
    transparent: true,
    toneMapped: false,
    fog: false,
});

export const makeSurfaceMaterial = () => new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uSplash: { value: Array.from({ length: MAX_SPLASH }, () => new THREE.Vector4(0, 0, 99, 0)) },
        uColor: { value: new THREE.Color(C.carno) },
        uHi: { value: new THREE.Color('#f5f3ff') },
    },
    vertexShader: /* glsl */ `
        #define MAX_SPLASH ${MAX_SPLASH}
        uniform float uTime;
        uniform vec4 uSplash[MAX_SPLASH];
        varying vec3 vW;
        varying float vR;
        void main() {
            vec3 p = position;
            float h = sin(p.x * 1.4 + uTime * 1.6) * 0.035 + sin(p.y * 1.9 - uTime * 1.2) * 0.03;
            for (int i = 0; i < MAX_SPLASH; i++) {
                vec4 s = uSplash[i];
                float d = distance(p.xy, s.xy);
                float age = s.z;
                float front = smoothstep(age * 2.2 + 0.4, age * 2.2 - 0.2, d);
                h += s.w * sin(d * 7.0 - age * 10.0) * exp(-age * 1.6) * exp(-d * 0.5) * front * 0.16;
            }
            p.z += h;
            vR = length(position.xy);
            vec4 w = modelMatrix * vec4(p, 1.0);
            vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
        }`,
    fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform vec3 uHi;
        varying vec3 vW;
        varying float vR;
        void main() {
            vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
            if (n.y < 0.0) n = -n;
            vec3 v = normalize(cameraPosition - vW);
            vec3 l = normalize(vec3(0.4, 1.0, 0.6));
            float spec = pow(max(dot(reflect(-l, n), v), 0.0), 48.0);
            float fr1 = 1.0 - max(dot(n, v), 0.0);
            float fres = fr1 * fr1 * fr1;
            vec3 col = uColor * 0.9 + uHi * (spec * 1.4 + fres * 0.5);
            col += uHi * smoothstep(2.55, 2.88, vR) * 0.55;
            gl_FragColor = vec4(col, 0.92);
        }`,
    transparent: true,
    toneMapped: false,
    side: THREE.DoubleSide,
    fog: false,
});

/** Avança o relógio de um material do tanque (fora do componente: o compilador do React não deixa mutar ali). */
export const setShaderTime = (m: THREE.ShaderMaterial, t: number) => { m.uniforms.uTime.value = t; };
