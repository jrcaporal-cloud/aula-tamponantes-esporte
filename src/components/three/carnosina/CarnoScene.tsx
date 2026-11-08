import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Label3D, type TimeState } from '../shared/Label3D';
import { BloodStation } from './BloodStation';
import { BufferStation } from './BufferStation';
import { CameraDirector } from './CameraDirector';
import { GutStation } from './GutStation';
import { labelsForStep } from './labels';
import { MembraneStation } from './MembraneStation';
import { PickLayer } from './PickLayer';
import { SkinStation } from './SkinStation';
import type { StructureId } from './structures';
import { SynthesisStation } from './SynthesisStation';
import { TankStation } from './TankStation';

/** Fundo: degradê escuro com um leve tom violeta (a cor da carnosina). */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.012,0.012,0.03), vec3(0.05,0.035,0.1), smoothstep(0.2, 0.95, h));
            c += vec3(0.06,0.03,0.12) * pow(max(vP.y, 0.0), 2.0) * 0.6;
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    return <mesh material={mat} scale={400}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

/** Avisa o modal quando o primeiro quadro foi desenhado (some o véu de carga). */
const FirstFrame = ({ onReady }: { onReady: () => void }) => {
    const done = useRef(false);
    useFrame(() => {
        if (done.current) return;
        done.current = true;
        onReady();
    });
    return null;
};

/**
 * Compila os shaders de todas as estações antes do primeiro quadro (ainda estão todas visíveis):
 * sem isso, cada estação engasga ~0,2–0,7 s na primeira vez que entra em cena.
 */
const Warmup = () => {
    const gl = useThree(s => s.gl);
    const scene = useThree(s => s.scene);
    const camera = useThree(s => s.camera);
    useLayoutEffect(() => { gl.compile(scene, camera); }, [gl, scene, camera]);
    return null;
};

export interface CarnoSceneProps {
    step: number;
    settled: number;
    reduced: boolean;
    pin: StructureId | null;
    recenterKey: number;
    onSettled: (step: number) => void;
    onReady: () => void;
    timeRef: { current: TimeState };
}

export const CarnoScene = ({ step, settled, reduced, pin, recenterKey, onSettled, onReady, timeRef }: CarnoSceneProps) => {
    const labels = settled === step && !pin ? labelsForStep(step) : [];
    return (
        <>
            <Backdrop />
            <fog attach="fog" args={['#07061a', 44, 90]} />
            <ambientLight intensity={0.4} color="#b8b5e8" />
            <hemisphereLight args={['#ddd6fe', '#0b0b1a', 0.6]} />
            <directionalLight position={[8, 16, 14]} intensity={2.1} color="#f5f3ff" />
            <directionalLight position={[-10, 4, -16]} intensity={0.9} color="#a78bfa" />
            <directionalLight position={[2, -14, 10]} intensity={0.5} color="#67e8f9" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={60} />
            <CameraDirector step={step} reduced={reduced} pin={pin} recenterKey={recenterKey} onSettled={onSettled} timeRef={timeRef} />
            <PickLayer />
            <FirstFrame onReady={onReady} />

            <GutStation timeRef={timeRef} />
            <BloodStation timeRef={timeRef} />
            <MembraneStation timeRef={timeRef} />
            <SynthesisStation timeRef={timeRef} />
            <TankStation timeRef={timeRef} />
            <BufferStation timeRef={timeRef} />
            <SkinStation timeRef={timeRef} />
            <Warmup />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.08 + i * 0.12} />)}

            <EffectComposer multisampling={4}>
                <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={0.6} radius={0.55} />
                <Vignette offset={0.28} darkness={0.6} />
            </EffectComposer>
        </>
    );
};
