import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Label3D, type TimeState } from '../shared/Label3D';
import { BloodStation } from './BloodStation';
import { BufferStation } from './BufferStation';
import { CameraDirector } from './CameraDirector';
import { GutStation } from './GutStation';
import { labelsForStep } from './labels';
import { MembraneStation } from './MembraneStation';
import { PickLayer } from './PickLayer';
import { SkinStation } from './SkinStation';
import { Backdrop, StudioLights, StudioPost } from './Studio';
import type { StructureId } from './structures';
import { SynthesisStation } from './SynthesisStation';
import { TankStation } from './TankStation';

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
            <StudioLights />

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

            <StudioPost />
        </>
    );
};
