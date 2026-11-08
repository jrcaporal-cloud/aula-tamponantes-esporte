import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Label3D } from '../shared/Label3D';
import { CameraDirector } from './CameraDirector';
import { Capillary } from './Capillary';
import { Fiber } from './Fiber';
import { Particles } from './Particles';
import { PickLayer } from './PickLayer';
import { stepSim } from './sim';
import { FIBER_STEPS } from './steps';
import type { StructureId } from './structures';
import type { CtrlRef, SimRef } from './types';

/** Avança a simulação uma vez por quadro. Primeiro filho: os `useFrame` rodam na ordem de montagem. */
const SimClock = ({ simRef, ctrlRef }: { simRef: SimRef; ctrlRef: CtrlRef }) => {
    useFrame((_, dt) => stepSim(simRef.current, ctrlRef.current, dt));
    return null;
};

/** Avisa quando os primeiros quadros foram desenhados (tira o véu de carregamento). */
const ReadyProbe = ({ onReady }: { onReady: () => void }) => {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 3) onReady();
    });
    return null;
};

/** Fundo: degradê azul-noite da aula. */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.012,0.02,0.04), vec3(0.03,0.06,0.1), smoothstep(0.25, 0.95, h));
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    return <mesh material={mat} scale={150} raycast={() => undefined}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

export interface FiberSceneProps {
    step: number;
    settled: number;
    pin: StructureId | null;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
    onReady: () => void;
    simRef: SimRef;
    ctrlRef: CtrlRef;
}

const FiberSceneImpl = ({ step, settled, pin, recenterKey, reduced, onSettled, onReady, simRef, ctrlRef }: FiberSceneProps) => {
    const timeRef = useRef({ t: 0 });
    const labels = settled === step && !pin ? FIBER_STEPS[step].labels : [];
    return (
        <>
            <SimClock simRef={simRef} ctrlRef={ctrlRef} />
            <Backdrop />
            <fog attach="fog" args={['#050a14', 30, 70]} />
            <ambientLight intensity={0.5} color="#c7d2fe" />
            <hemisphereLight args={['#e0e7ff', '#0b1020', 0.55]} />
            <directionalLight position={[4, 14, 16]} intensity={2} color="#ffffff" />
            <directionalLight position={[-12, 2, 8]} intensity={0.7} color="#a5b4fc" />
            <pointLight position={[0, 0.8, 2.2]} intensity={6} distance={9} color="#fde2e4" />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={40} />
            <CameraDirector step={step} pin={pin} recenterKey={recenterKey} reduced={reduced} onSettled={onSettled} />
            <PickLayer />
            <ReadyProbe onReady={onReady} />

            <Fiber simRef={simRef} />
            <Capillary simRef={simRef} />
            <Particles simRef={simRef} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.05 + i * 0.12} />)}
        </>
    );
};

/** `memo`: o modal re-renderiza a cada hover, e a cena não depende disso. */
export const FiberScene = memo(FiberSceneImpl);
