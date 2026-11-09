import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Label3D } from '../shared/Label3D';
import { rng } from '../shared/math';
import { CaptureFlashes } from './CaptureFlashes';
import { noRaycast } from './materials';
import { Finish, StudioLights } from './Studio';
import { CameraDirector } from './CameraDirector';
import { Capillary } from './Capillary';
import { Fiber } from './Fiber';
import { Particles } from './Particles';
import { CursorSync, PickLayer } from './PickLayer';
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

/** Partículas de fundo do interstício (só profundidade: fracas, lentas, sem significado químico). */
const Motes = ({ reduced }: { reduced: boolean }) => {
    const ref = useRef<THREE.Points>(null);
    const geo = useMemo(() => {
        const r = rng(808);
        const n = 420;
        const a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            a[i * 3] = (r() * 2 - 1) * 24;
            a[i * 3 + 1] = (r() * 2 - 1) * 14;
            a[i * 3 + 2] = -18 + r() * 26;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(a, 3));
        return g;
    }, []);
    useLayoutEffect(() => () => geo.dispose(), [geo]);
    useFrame(({ clock }) => {
        if (!ref.current || reduced) return;
        ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.03) * 0.05;
        ref.current.position.y = Math.sin(clock.elapsedTime * 0.07) * 0.3;
    });
    return (
        <points ref={ref} geometry={geo} raycast={noRaycast}>
            <pointsMaterial color="#C7D2FE" size={0.06} sizeAttenuation transparent opacity={0.22} depthWrite={false} />
        </points>
    );
};

/** Fundo: degradê azul-noite da aula. */
const Backdrop = () => {
    const mat = useMemo(() => new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vP; void main(){
            float h = vP.y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.010,0.016,0.032), vec3(0.028,0.055,0.095), smoothstep(0.25, 0.95, h));
            // faixa difusa no horizonte (profundidade do tecido), mais rosada atrás da fibra
            float y = vP.y * 2.6;
            c += vec3(0.05, 0.022, 0.055) * exp(-y * y) * (0.6 + 0.4 * (1.0 - smoothstep(-1.0, 0.0, vP.z)));
            gl_FragColor = vec4(c, 1.0);
        }`,
    }), []);
    useLayoutEffect(() => () => mat.dispose(), [mat]);
    return <mesh material={mat} scale={150} raycast={noRaycast}><sphereGeometry args={[1, 48, 24]} /></mesh>;
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
            <Motes reduced={reduced} />
            <fog attach="fog" args={['#050a14', 32, 75]} />
            <StudioLights />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={40} />
            <CameraDirector step={step} pin={pin} recenterKey={recenterKey} reduced={reduced} onSettled={onSettled} />
            <PickLayer />
            <CursorSync />
            <ReadyProbe onReady={onReady} />

            <Fiber simRef={simRef} />
            <Capillary simRef={simRef} />
            <Particles simRef={simRef} />
            <CaptureFlashes simRef={simRef} />
            <Finish reduced={reduced} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.05 + i * 0.12} />)}
        </>
    );
};

/** `memo`: o modal re-renderiza a cada troca de etapa/controle, e a cena só depende das props. */
export const FiberScene = memo(FiberSceneImpl);
