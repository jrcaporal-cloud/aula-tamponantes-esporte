import * as THREE from 'three';

/*
 * Material de contorno (Fresnel): brilho aditivo que cresce na borda da silhueta, como nas
 * ilustrações de membrana com "vidro" — dá volume sem custo de transmissão.
 */

const RIM_VS = `
varying vec3 vN;
varying vec3 vV;
void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
}`;

const RIM_FS = `
uniform vec3 uColor;
uniform float uPower;
uniform float uStrength;
varying vec3 vN;
varying vec3 vV;
void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
    gl_FragColor = vec4(uColor * f * uStrength, f * uStrength);
}`;

export interface RimOpts { power?: number; strength?: number; side?: THREE.Side }

export const makeRimMaterial = (color: string, { power = 2.6, strength = 0.9, side = THREE.FrontSide }: RimOpts = {}): THREE.ShaderMaterial =>
    new THREE.ShaderMaterial({
        vertexShader: RIM_VS,
        fragmentShader: RIM_FS,
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uPower: { value: power },
            uStrength: { value: strength },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side,
    });

/** Nunca é alvo do raio do ponteiro (camadas decorativas deixam o clique passar). */
export const noRaycast = (): void => undefined;
