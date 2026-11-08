import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { TimeState } from '../shared/Label3D';
import { smoother } from '../shared/math';
import { buildStepPath, flightPath, type CameraPath, type Pose } from './cameraPath';
import { CARNO_STEPS } from './steps';
import { poseOf, type StructureId } from './structures';

/*
 * Quem manda na câmera, em ordem de prioridade:
 *  1. voo (fixar uma estrutura, soltar ou recentrar), saindo de onde a câmera está;
 *  2. troca de etapa: a câmera segue a trilha das poses no mesmo T que acende as estações.
 * O primeiro toque do usuário no canvas desliga os dois; a etapa continua valendo (T segue).
 */

interface Tween { active: boolean; u: number; offP: THREE.Vector3; offT: THREE.Vector3 }
interface Flight { active: boolean; u: number; path: CameraPath | null; anim: gsap.core.Tween | null }

const stepPose = (step: number): Pose => CARNO_STEPS[step].cam;

interface CameraDirectorProps {
    step: number;
    reduced: boolean;
    pin: StructureId | null;
    recenterKey: number;
    onSettled: (step: number) => void;
    timeRef: { current: TimeState };
}

export const CameraDirector = ({ step, reduced, pin, recenterKey, onSettled, timeRef }: CameraDirectorProps) => {
    const camera = useThree(s => s.camera);
    const gl = useThree(s => s.gl);
    const controls = useThree(s => s.controls) as OrbitControlsImpl | null;
    const path = useMemo(() => buildStepPath(CARNO_STEPS), []);
    const tween = useRef<Tween>({ active: false, u: 1, offP: new THREE.Vector3(), offT: new THREE.Vector3() });
    const flight = useRef<Flight>({ active: false, u: 0, path: null, anim: null });
    const stepRef = useRef(step);
    const prev = useRef({ pin, key: recenterKey });
    const tp = useMemo(() => new THREE.Vector3(), []);
    const tt = useMemo(() => new THREE.Vector3(), []);

    useEffect(() => { stepRef.current = step; }, [step]);

    // toque do usuário: assume o comando da câmera
    useEffect(() => {
        const el = gl.domElement;
        const onDown = () => { tween.current.active = false; flight.current.active = false; };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('wheel', onDown, { passive: true });
        return () => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('wheel', onDown);
        };
    }, [gl]);

    // troca de etapa: T anima até a etapa nova; a câmera sai de onde estava sem pulo
    useEffect(() => {
        if (!controls) return;
        const time = timeRef.current;
        const tw = tween.current;
        const from = time.t;
        const dist = Math.abs(step - from);
        tw.offP.copy(camera.position).sub(path.pos(from, tp));
        tw.offT.copy(controls.target).sub(path.tgt(from, tt));
        tw.active = true;
        tw.u = 0;
        flight.current.active = false;
        const duration = reduced ? 0.35 : step > from
            ? (dist <= 1.01 ? 3.2 : Math.min(2 + dist * 0.7, 5.5))
            : Math.min(1.4 + dist * 0.4, 3.2);
        const anim = gsap.to(time, {
            t: step,
            duration: Math.max(duration, 0.05),
            ease: 'power1.inOut',
            onUpdate: () => { tw.u = anim.progress(); },
            onComplete: () => { tw.active = false; onSettled(step); },
        });
        return () => { anim.kill(); };
    }, [step, controls, camera, path, reduced, onSettled, timeRef, tp, tt]);

    // voo: fixar (close-up), soltar ou recentrar (pose da etapa)
    useEffect(() => {
        if (!controls) return;
        const last = prev.current;
        if (last.pin === pin && last.key === recenterKey) return;
        prev.current = { pin, key: recenterKey };
        // soltar por troca de etapa: a transição já leva a câmera à pose nova
        if (!pin && tween.current.active) return;
        const f = flight.current;
        const from: Pose = {
            pos: [camera.position.x, camera.position.y, camera.position.z],
            tgt: [controls.target.x, controls.target.y, controls.target.z],
        };
        f.path = flightPath(from, pin ? poseOf(pin) : stepPose(stepRef.current));
        f.u = 0;
        f.active = true;
        tween.current.active = false;
        f.anim?.kill();
        f.anim = gsap.to(f, { u: 1, duration: reduced ? 0.3 : 1.15, ease: 'power2.inOut', onComplete: () => { f.active = false; } });
        return () => { f.anim?.kill(); f.active = false; };
    }, [pin, recenterKey, controls, camera, reduced]);

    useFrame(() => {
        if (!controls) return;
        const f = flight.current;
        if (f.active && f.path) {
            camera.position.copy(f.path.pos(f.u, tp));
            controls.target.copy(f.path.tgt(f.u, tt));
            controls.update();
            return;
        }
        const tw = tween.current;
        if (!tw.active) return;
        const T = timeRef.current.t;
        const fade = 1 - smoother(Math.min(tw.u * 1.25, 1));
        camera.position.copy(path.pos(T, tp).addScaledVector(tw.offP, fade));
        controls.target.copy(path.tgt(T, tt).addScaledVector(tw.offT, fade));
        controls.update();
    });

    return null;
};
