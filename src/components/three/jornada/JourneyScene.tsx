import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Label3D, type TimeRef } from '../shared/Label3D';
import { buildCameraPath } from './camera';
import { CameraDirector } from './CameraDirector';
import { STEPS, type StructureId } from './content';
import type { DoseSummary } from './dose';
import { Flows } from './Flows';
import { GutParticles } from './GutParticles';
import { labelsForStep } from './labels';
import { MuscleEfflux } from './MuscleEfflux';
import { Organs } from './Organs';
import { PickLayer } from './PickLayer';
import { SodiumStack } from './SodiumStack';
import { writeFrame, type JourneyStateRef } from './state';
import { StomachGas } from './StomachGas';

/*
 * Raiz da cena. O relógio (primeiro filho: os `useFrame` rodam na ordem de montagem) escreve o
 * quadro que todos leem; depois vêm câmera, órgãos, partículas, rótulos e o pós-processamento.
 */

const JourneyClock = ({ stateRef, timeRef }: { stateRef: JourneyStateRef; timeRef: TimeRef }) => {
    useFrame((_, delta) => writeFrame(stateRef.current, timeRef.current.t, Math.min(delta, 0.1)));
    return null;
};

/** Avisa quando os primeiros quadros foram desenhados. */
const ReadyProbe = ({ onReady }: { onReady: () => void }) => {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 3) onReady();
    });
    return null;
};

/** Fundo: degradê escuro da aula com um véu ciano no alto. */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.012,0.024,0.045), vec3(0.03,0.06,0.09), smoothstep(0.2, 0.95, h));
            c += vec3(0.0,0.06,0.08) * pow(max(vP.y, 0.0), 2.0) * 0.5;
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    return <mesh material={mat} scale={180}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

export interface JourneySceneProps {
    step: number;
    settled: number;
    reduced: boolean;
    pin: StructureId | null;
    recenterKey: number;
    dose: DoseSummary;
    onSettled: (step: number) => void;
    onReady: () => void;
    stateRef: JourneyStateRef;
    timeRef: TimeRef;
}

const JourneySceneImpl = ({ step, settled, reduced, pin, recenterKey, dose, onSettled, onReady, stateRef, timeRef }: JourneySceneProps) => {
    const path = useMemo(() => buildCameraPath(STEPS.map(s => s.pose)), []);
    // com algo fixado, os rótulos da etapa sairiam na frente do close-up
    const labels = useMemo(() => (settled === step && !pin ? labelsForStep(step, dose) : []), [settled, step, pin, dose]);

    return (
        <>
            <JourneyClock stateRef={stateRef} timeRef={timeRef} />
            <Backdrop />
            <fog attach="fog" args={['#04080f', 50, 130]} />
            <ambientLight intensity={0.5} color="#c8d4e0" />
            <hemisphereLight args={['#cffafe', '#0b1220', 0.55]} />
            <directionalLight position={[6, 14, 20]} intensity={2.0} color="#f8fbff" />
            <directionalLight position={[-14, 2, 10]} intensity={0.8} color="#67e8f9" />
            <directionalLight position={[10, -10, 14]} intensity={0.55} color="#fdba74" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={70} />
            <CameraDirector step={step} reduced={reduced} pin={pin} recenterKey={recenterKey} onSettled={onSettled} timeRef={timeRef} path={path} />
            <PickLayer />
            <ReadyProbe onReady={onReady} />

            <Organs stateRef={stateRef} />
            <Flows stateRef={stateRef} />
            <StomachGas stateRef={stateRef} />
            <GutParticles stateRef={stateRef} />
            <MuscleEfflux stateRef={stateRef} />
            <SodiumStack stateRef={stateRef} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}-${l.text}`} spec={l} timeRef={timeRef} delay={0.08 + i * 0.12} />)}

            <EffectComposer multisampling={2}>
                <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={0.5} radius={0.5} />
                <Vignette offset={0.3} darkness={0.6} />
            </EffectComposer>
        </>
    );
};

/** `memo`: o modal re-renderiza no hover, e a cena não depende disso. */
export const JourneyScene = memo(JourneySceneImpl);
