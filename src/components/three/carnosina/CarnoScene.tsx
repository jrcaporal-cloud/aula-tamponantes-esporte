import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Bvh, OrbitControls } from '@react-three/drei';
import { Label3D, type TimeState } from '../shared/Label3D';
import { BloodStation } from './BloodStation';
import { BufferStation } from './BufferStation';
import { CameraDirector } from './CameraDirector';
import { GutStation } from './GutStation';
import { labelsForStep } from './labels';
import { MembraneStation } from './MembraneStation';
import { PickLayer } from './PickLayer';
import { SkinStation } from './SkinStation';
import { useSelection } from './store';
import { Backdrop, StudioLights, StudioPost } from './Studio';
import type { StructureId } from './structures';
import { SynthesisStation } from './SynthesisStation';
import { TankStation } from './TankStation';

/**
 * Compila os shaders de todas as estações logo na montagem (ainda estão todas visíveis): sem isso, cada
 * estação engasga ~0,2–0,7 s na primeira vez que entra em cena. Com `compileAsync` (KHR_parallel_shader_compile)
 * a compilação não trava a thread principal; o véu de carga só sai depois dela e do primeiro quadro.
 */
const Warmup = ({ onReady }: { onReady: () => void }) => {
    const gl = useThree(s => s.gl);
    const scene = useThree(s => s.scene);
    const camera = useThree(s => s.camera);
    const compiled = useRef(false);
    const drawn = useRef(false);
    useLayoutEffect(() => {
        let alive = true;
        const finish = () => {
            if (!alive) return;
            compiled.current = true;
            if (drawn.current) onReady();
        };
        if (typeof gl.compileAsync === 'function') gl.compileAsync(scene, camera).then(finish, finish);
        else { gl.compile(scene, camera); finish(); }
        return () => { alive = false; };
    }, [gl, scene, camera, onReady]);
    useFrame(() => {
        if (drawn.current) return;
        drawn.current = true;
        if (compiled.current) onReady();
    });
    return null;
};

const setCursor = (el: HTMLElement, cursor: string) => { if (el.style.cursor !== cursor) el.style.cursor = cursor; };

/** Cursor do canvas direto no DOM (sem re-renderizar o modal a cada hover): mão, agarrar ou arrastando. */
const CursorSync = () => {
    const el = useThree(s => s.gl.domElement);
    useEffect(() => {
        let down = false;
        const apply = () => {
            const s = useSelection.getState();
            setCursor(el, down ? 'grabbing' : s.pin || s.hoverId ? 'pointer' : 'grab');
        };
        const onDown = (e: PointerEvent) => { if (e.button === 0) { down = true; apply(); } };
        const onUp = () => { if (down) { down = false; apply(); } };
        apply();
        const unsub = useSelection.subscribe(apply);
        el.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return () => {
            unsub();
            el.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    }, [el]);
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

/** Memorizado: o modal re-renderiza por coisas da UI (tocar/pausar, véu); a cena só muda com as props dela. */
export const CarnoScene = memo(({ step, settled, reduced, pin, recenterKey, onSettled, onReady, timeRef }: CarnoSceneProps) => {
    const labels = settled === step && !pin ? labelsForStep(step) : [];
    return (
        <>
            <Backdrop />
            <fog attach="fog" args={['#07061a', 44, 90]} />
            <StudioLights />

            <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={60} />
            <CameraDirector step={step} reduced={reduced} pin={pin} recenterKey={recenterKey} onSettled={onSettled} timeRef={timeRef} />
            <PickLayer />
            <CursorSync />

            {/* BVH nas malhas comuns (transportadores, CARNS1, neurônio…): o raio do hover não varre triângulo por triângulo */}
            <Bvh firstHitOnly>
                <GutStation timeRef={timeRef} />
                <BloodStation timeRef={timeRef} />
                <MembraneStation timeRef={timeRef} />
                <SynthesisStation timeRef={timeRef} />
                <TankStation timeRef={timeRef} />
                <BufferStation timeRef={timeRef} />
                <SkinStation timeRef={timeRef} />
            </Bvh>
            <Warmup onReady={onReady} />

            {labels.map((l, i) => <Label3D key={`${step}-${l.id}`} spec={l} timeRef={timeRef} delay={0.08 + i * 0.12} />)}

            <StudioPost />
        </>
    );
});
CarnoScene.displayName = 'CarnoScene';
