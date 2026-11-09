import { useMemo } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/*
 * Estúdio: luz de chave, de preenchimento e duas de recorte (rim), mais um ambiente feito só de painéis
 * de luz (Lightformer, renderizado uma vez, sem baixar nada) para o verniz das moléculas e o vidro do
 * tanque refletirem algo. Pós: bloom nos brilhos e vinheta (a oclusão de ambiente N8AO custou caro demais
 * no palco e ficou de fora).
 */

/** Fundo: degradê escuro com um leve tom violeta (a cor da carnosina) e um "chão" de luz fria. */
export const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.010,0.010,0.028), vec3(0.055,0.038,0.11), smoothstep(0.25, 0.95, h));
            float up = max(vP.y, 0.0);
            float dn = max(-vP.y, 0.0);
            c += vec3(0.07,0.035,0.14) * (up * up) * 0.6;
            c += vec3(0.02,0.05,0.07) * (dn * dn * dn);
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    return <mesh material={mat} scale={400}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

export const StudioLights = () => (
    <>
        <ambientLight intensity={0.28} color="#b8b5e8" />
        <hemisphereLight args={['#ddd6fe', '#0b0b1a', 0.5]} />
        {/* chave quente-neutra, de cima e da frente */}
        <directionalLight position={[8, 16, 14]} intensity={2.2} color="#f8f6ff" />
        {/* recortes: violeta por trás à esquerda, ciano por trás à direita */}
        <directionalLight position={[-12, 6, -16]} intensity={1.6} color="#a78bfa" />
        <directionalLight position={[14, 3, -12]} intensity={1.0} color="#67e8f9" />
        {/* rebote de baixo */}
        <directionalLight position={[2, -14, 10]} intensity={0.45} color="#93c5fd" />
        <Environment resolution={128} frames={1} environmentIntensity={0.85}>
            <Lightformer form="rect" intensity={3} color="#f5f3ff" position={[0, 6, 8]} scale={[12, 4, 1]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={2.2} color="#a78bfa" position={[-9, 2, -6]} scale={[6, 10, 1]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={1.6} color="#67e8f9" position={[9, 1, -5]} scale={[5, 8, 1]} target={[0, 0, 0]} />
            <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, -6, 4]} scale={4} target={[0, 0, 0]} />
        </Environment>
    </>
);

export const StudioPost = () => (
    <EffectComposer multisampling={2}>
        <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.22} intensity={0.75} radius={0.6} />
        <Vignette offset={0.28} darkness={0.62} />
    </EffectComposer>
);
