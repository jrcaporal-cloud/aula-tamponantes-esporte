import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
 * Toque de cinema (fora do modo de movimento reduzido): no voo entre estações a lente abre um pouco no
 * meio do caminho e fecha ao chegar; parada, a câmera respira (deriva lenta de poucos décimos) até o
 * usuário tocar.
 */

interface Tween { active: boolean; u: number; offP: THREE.Vector3; offT: THREE.Vector3 }
interface Flight { active: boolean; u: number; path: CameraPath | null; anim: gsap.core.Tween | null }
interface Idle { active: boolean; t0: number; pos: THREE.Vector3; tgt: THREE.Vector3 }

const BASE_FOV = 40;
/** Quanto a lente abre no meio de um voo longo (graus). */
const FOV_SWELL = 6;
/** Amplitude da respiração parada (unidades de cena) e tempo até ela entrar inteira (s). */
const SWAY = 0.55;
const SWAY_RAMP = 2.5;

const stepPose = (step: number): Pose => CARNO_STEPS[step].cam;

/** Lente: abre no meio do voo entre estações (k = 0–1), volta ao normal no fim. */
const setFov = (camera: THREE.Camera, k: number) => {
    const cam = camera as THREE.PerspectiveCamera;
    const fov = BASE_FOV + FOV_SWELL * k;
    if (!cam.isPerspectiveCamera || Math.abs(cam.fov - fov) < 0.01) return;
    cam.fov = fov;
    cam.updateProjectionMatrix();
};

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
    // estado de animação criado uma vez (inicializador preguiçoso), mutado só pelos refs
    const [tween0] = useState<Tween>(() => ({ active: false, u: 1, offP: new THREE.Vector3(), offT: new THREE.Vector3() }));
    const [idle0] = useState<Idle>(() => ({ active: false, t0: 0, pos: new THREE.Vector3(), tgt: new THREE.Vector3() }));
    const tween = useRef(tween0);
    const flight = useRef<Flight>({ active: false, u: 0, path: null, anim: null });
    const idle = useRef(idle0);
    const swell = useRef(0);
    const clock = useThree(s => s.clock);
    const stepRef = useRef(step);
    const prev = useRef({ pin, key: recenterKey });
    const tp = useMemo(() => new THREE.Vector3(), []);
    const tt = useMemo(() => new THREE.Vector3(), []);
    const right = useMemo(() => new THREE.Vector3(), []);

    /** Começa a respirar a partir da pose atual (só sem movimento reduzido). */
    const startIdle = useCallback(() => {
        if (reduced || !controls) return;
        const i = idle.current;
        i.active = true;
        i.t0 = clock.elapsedTime;
        i.pos.copy(camera.position);
        i.tgt.copy(controls.target);
    }, [reduced, clock, camera, controls]);

    useEffect(() => { stepRef.current = step; }, [step]);

    // toque do usuário: assume o comando da câmera
    useEffect(() => {
        const el = gl.domElement;
        const onDown = () => { tween.current.active = false; flight.current.active = false; idle.current.active = false; };
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
        idle.current.active = false;
        swell.current = reduced || dist < 0.5 ? 0 : Math.min(dist, 1.5) / 1.5;
        const duration = reduced ? 0.35 : step > from
            ? (dist <= 1.01 ? 3.2 : Math.min(2 + dist * 0.7, 5.5))
            : Math.min(1.4 + dist * 0.4, 3.2);
        const anim = gsap.to(time, {
            t: step,
            duration: Math.max(duration, 0.05),
            ease: 'power2.inOut',
            onUpdate: () => { tw.u = anim.progress(); },
            onComplete: () => { tw.active = false; startIdle(); onSettled(step); },
        });
        // o tween do gsap é a "assinatura" deste efeito: morre junto, e a transição para de mandar na câmera
        return () => { anim.kill(); tw.active = false; };
    }, [step, controls, camera, path, reduced, onSettled, timeRef, tp, tt, startIdle]);

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
        idle.current.active = false;
        f.anim?.kill();
        f.anim = gsap.to(f, { u: 1, duration: reduced ? 0.3 : 1.25, ease: 'power3.inOut', onComplete: () => { f.active = false; startIdle(); } });
        return () => { f.anim?.kill(); f.active = false; };
    }, [pin, recenterKey, controls, camera, reduced, startIdle]);

    useFrame(({ clock: c }) => {
        if (!controls) return;
        const f = flight.current;
        const tw = tween.current;
        setFov(camera, tw.active ? Math.sin(Math.PI * tw.u) * swell.current : 0);
        const i = idle.current;
        if (i.active && !f.active && !tw.active) {
            const age = c.elapsedTime - i.t0;
            const ramp = smoother(Math.min(age / SWAY_RAMP, 1));
            right.subVectors(i.pos, i.tgt).cross(camera.up).normalize();
            camera.position.copy(i.pos)
                .addScaledVector(right, Math.sin(age * 0.23) * SWAY * ramp)
                .addScaledVector(camera.up, Math.sin(age * 0.17 + 1.1) * SWAY * 0.45 * ramp);
            controls.target.copy(i.tgt);
            controls.update();
            return;
        }
        if (f.active && f.path) {
            camera.position.copy(f.path.pos(f.u, tp));
            controls.target.copy(f.path.tgt(f.u, tt));
            controls.update();
            return;
        }
        if (!tw.active) return;
        const T = timeRef.current.t;
        const fade = 1 - smoother(Math.min(tw.u * 1.25, 1));
        camera.position.copy(path.pos(T, tp).addScaledVector(tw.offP, fade));
        controls.target.copy(path.tgt(T, tt).addScaledVector(tw.offT, fade));
        controls.update();
    });

    return null;
};
