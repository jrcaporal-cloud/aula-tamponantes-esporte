import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, N8AO, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Label3D, type TimeRef } from '../shared/Label3D';
import { buildCameraPath } from './camera';
import { CameraDirector } from './CameraDirector';
import { Cup } from './Cup';
import { STEPS, type StructureId } from './content';
import { summarize, type DoseSummary } from './dose';
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
 * Luz de estúdio: ambiente gerado na hora por painéis de luz (sem arquivo HDR, funciona offline) —
 * softbox no alto, filete ciano de um lado, âmbar do outro —, que dá reflexo ao verniz dos tecidos.
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

/** Ambiente de estúdio para reflexos (renderizado uma vez). */
const Studio = () => (
    <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={2.4} color="#f1f7ff" position={[0, 9, 6]} rotation-x={Math.PI / 2.4} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#67e8f9" position={[-10, 1, 3]} rotation-y={Math.PI / 2} scale={[2, 12, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#fdba74" position={[10, -1, 3]} rotation-y={-Math.PI / 2} scale={[2, 10, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#e2e8f0" position={[0, 0, 12]} scale={6} />
        <Lightformer form="rect" intensity={0.6} color="#0e7490" position={[0, -8, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} />
    </Environment>
);

/** Fundo: degradê escuro da aula com um véu ciano no alto e um halo atrás do palco. */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.012,0.024,0.045), vec3(0.03,0.06,0.09), smoothstep(0.2, 0.95, h));
            float up = max(vP.y, 0.0);
            c += vec3(0.0,0.06,0.08) * (up * up) * 0.5;
            float back = max(-vP.z, 0.0);
            float back2 = back * back;
            float halo = back2 * back2 * back2;
            c += vec3(0.02,0.05,0.07) * halo;
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    useEffect(() => () => mat.dispose(), [mat]);
    return <mesh material={mat} scale={180}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

/** Etapa da pilha de sódio: a única cujos rótulos trazem números da dose. */
const SODIUM_STEP = 5;
/** Dose fixa para as outras etapas (os rótulos delas não leem a dose): mexer na dose não os refaz. */
const NEUTRAL_DOSE = summarize(70, 0.3);

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
    const labelDose = step === SODIUM_STEP ? dose : NEUTRAL_DOSE;
    // com algo fixado, os rótulos da etapa sairiam na frente do close-up
    const labels = useMemo(() => (settled === step && !pin ? labelsForStep(step, labelDose) : []), [settled, step, pin, labelDose]);

    return (
        <>
            <JourneyClock stateRef={stateRef} timeRef={timeRef} />
            <Backdrop />
            <fog attach="fog" args={['#04080f', 50, 130]} />
            <Studio />
            <ambientLight intensity={0.28} color="#c8d4e0" />
            <hemisphereLight args={['#cffafe', '#0b1220', 0.45]} />
            {/* key, preenchimento ciano, contraluz âmbar e um recorte (rim) vindo de trás e do alto */}
            <directionalLight position={[6, 14, 20]} intensity={1.9} color="#f8fbff" />
            <directionalLight position={[-14, 2, 10]} intensity={0.75} color="#67e8f9" />
            <directionalLight position={[10, -10, 14]} intensity={0.5} color="#fdba74" />
            <directionalLight position={[-3, 12, -16]} intensity={1.3} color="#e0f2fe" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={70} />
            <CameraDirector step={step} reduced={reduced} pin={pin} recenterKey={recenterKey} onSettled={onSettled} timeRef={timeRef} path={path} />
            <PickLayer />
            <ReadyProbe onReady={onReady} />

            <Organs stateRef={stateRef} />
            <Cup stateRef={stateRef} />
            <Flows stateRef={stateRef} />
            <StomachGas stateRef={stateRef} />
            <GutParticles stateRef={stateRef} />
            <MuscleEfflux stateRef={stateRef} />
            <SodiumStack stateRef={stateRef} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.08 + i * 0.12} />)}

            <EffectComposer multisampling={2}>
                <N8AO halfRes aoRadius={0.9} distanceFalloff={0.6} intensity={1.6} quality="performance" />
                <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.22} intensity={0.62} radius={0.6} />
                <Vignette offset={0.3} darkness={0.6} />
            </EffectComposer>
        </>
    );
};

/** `memo`: o modal re-renderiza no hover, e a cena não depende disso. */
export const JourneyScene = memo(JourneySceneImpl);
