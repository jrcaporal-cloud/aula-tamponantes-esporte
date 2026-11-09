import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { smooth, smoother } from '../shared/math';
import type { TimeRef } from '../shared/Label3D';
import { flightPath, type CameraPath } from './camera';
import { STEPS, STRUCTURES, type Pose, type StructureId } from './content';

/*
 * Quem manda na câmera, em ordem de prioridade:
 *  1. voo (fixar uma estrutura ou recentrar), a partir de onde a câmera está;
 *  2. transição de etapa: segue a trilha das poses no mesmo T que anima a cena, com um recuo em arco
 *     (a câmera abre o plano no meio do voo e volta a fechar na chegada, como um travelling de grua);
 *  3. varredura lenta depois de ~7 s sem toque (vai e volta ±17°: o corte só faz sentido de frente).
 * O toque do usuário desliga 1 e 2; a inatividade recomeça a contar quando ele solta.
 */

const IDLE_MS = 7000;
const SWEEP_AMP = 0.3;
const SWEEP_PERIOD = 36;
const SWEEP_RAMP = 2.5;
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const TP = new THREE.Vector3();
const TT = new THREE.Vector3();
const BACK = new THREE.Vector3();
/** Recuo máximo no meio da transição: fração da distância percorrida, com teto (unidades de mundo). */
const ARC_K = 0.2;
const ARC_MAX = 6;

interface Rig {
    tween: { active: boolean; u: number; arc: number; offP: THREE.Vector3; offT: THREE.Vector3 };
    flight: { active: boolean; u: number; path: CameraPath | null; anim: gsap.core.Tween | null };
    idleAt: number;
    sweepT: number;
    down: boolean;
}

const makeRig = (): Rig => ({
    tween: { active: false, u: 1, arc: 0, offP: new THREE.Vector3(), offT: new THREE.Vector3() },
    flight: { active: false, u: 0, path: null, anim: null },
    idleAt: performance.now(),
    sweepT: 0,
    down: false,
});

export interface CameraDirectorProps {
    step: number;
    reduced: boolean;
    pin: StructureId | null;
    recenterKey: number;
    onSettled: (step: number) => void;
    timeRef: TimeRef;
    path: CameraPath;
}

const stepPose = (step: number): Pose => STEPS[step].pose;

export const CameraDirector = ({ step, reduced, pin, recenterKey, onSettled, timeRef, path }: CameraDirectorProps) => {
    const camera = useThree(s => s.camera);
    const gl = useThree(s => s.gl);
    const controls = useThree(s => s.controls) as OrbitControlsImpl | null;
    // o rig (vetores de rascunho e estado das animações) nasce uma vez, fora dos quadros
    const [initialRig] = useState(makeRig);
    const rig = useRef<Rig>(initialRig);
    const stepRef = useRef(step);
    const prev = useRef({ pin, key: recenterKey });

    useEffect(() => { stepRef.current = step; }, [step]);

    useEffect(() => {
        const el = gl.domElement;
        const r = rig.current;
        const touch = () => { r.idleAt = performance.now(); r.sweepT = 0; };
        const onDown = () => { r.down = true; r.flight.active = false; r.tween.active = false; touch(); };
        const onUp = () => { r.down = false; touch(); };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
        el.addEventListener('wheel', touch, { passive: true });
        return () => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onUp);
            el.removeEventListener('wheel', touch);
        };
    }, [gl]);

    // Transição de etapa: T anima até a etapa nova; o deslocamento de onde o usuário deixou a câmera se desfaz.
    useEffect(() => {
        if (!controls) return;
        const r = rig.current;
        const time = timeRef.current;
        const tw = r.tween;
        const from = time.t;
        const d = step - from;
        tw.offP.subVectors(camera.position, path.pos(from, TP));
        tw.offT.subVectors(controls.target, path.tgt(from, TT));
        tw.active = true;
        tw.u = 0;
        tw.arc = reduced ? 0 : Math.min(path.pos(from, TP).distanceTo(path.pos(step, TT)) * ARC_K, ARC_MAX);
        r.flight.active = false;
        r.idleAt = performance.now();
        const dist = Math.abs(d);
        const duration = reduced ? 0.35 : d > 0 ? Math.min(2.2 + dist * 0.6, 5) : Math.min(1.4 + dist * 0.35, 3);
        const anim = gsap.to(time, {
            t: step,
            duration,
            ease: 'power2.inOut',
            onUpdate: () => { tw.u = anim.progress(); },
            onComplete: () => { tw.active = false; onSettled(step); },
        });
        return () => { anim.kill(); };
    }, [step, controls, camera, path, reduced, onSettled, timeRef]);

    // Voo: fixar (close-up), soltar ou recentrar (pose da etapa).
    useEffect(() => {
        if (!controls) return;
        const last = prev.current;
        if (last.pin === pin && last.key === recenterKey) return;
        prev.current = { pin, key: recenterKey };
        const r = rig.current;
        if (!pin && r.tween.active) return; // soltou por troca de etapa: a transição já leva a câmera
        const from: Pose = {
            pos: [camera.position.x, camera.position.y, camera.position.z],
            tgt: [controls.target.x, controls.target.y, controls.target.z],
        };
        const f = r.flight;
        f.path = flightPath(from, pin ? STRUCTURES[pin].pose : stepPose(stepRef.current));
        f.u = 0;
        f.active = true;
        r.tween.active = false;
        f.anim?.kill();
        f.anim = gsap.to(f, {
            u: 1,
            duration: reduced ? 0.3 : 1.15,
            ease: 'power2.inOut',
            onComplete: () => { f.active = false; r.idleAt = performance.now(); },
        });
        return () => { f.anim?.kill(); f.active = false; };
    }, [pin, recenterKey, controls, camera, reduced]);

    useFrame((_, delta) => {
        if (!controls) return;
        const r = rig.current;
        const now = performance.now();
        const f = r.flight;
        if (f.active && f.path) {
            camera.position.copy(f.path.pos(f.u, TP));
            controls.target.copy(f.path.tgt(f.u, TT));
            controls.update();
            r.idleAt = now;
            return;
        }
        const tw = r.tween;
        if (tw.active) {
            const T = timeRef.current.t;
            const fade = 1 - smoother(Math.min(tw.u * 1.25, 1));
            path.pos(T, TP);
            path.tgt(T, TT);
            // recuo em arco: afasta ao longo da linha de visada e sobe um pouco no meio do caminho
            const bump = Math.sin(Math.PI * tw.u) * tw.arc;
            BACK.subVectors(TP, TT).normalize();
            camera.position.copy(TP).addScaledVector(BACK, bump).addScaledVector(Y_AXIS, bump * 0.3).addScaledVector(tw.offP, fade);
            controls.target.copy(TT).addScaledVector(tw.offT, fade);
            controls.update();
            r.idleAt = now;
            return;
        }
        if (reduced || r.down || now - r.idleAt < IDLE_MS) {
            r.sweepT = 0;
            return;
        }
        const dt = Math.min(delta, 0.05);
        r.sweepT += dt;
        const w = (Math.PI * 2) / SWEEP_PERIOD;
        const ramp = smooth(Math.min(r.sweepT / SWEEP_RAMP, 1));
        const dTheta = SWEEP_AMP * w * Math.cos(w * r.sweepT) * ramp * dt;
        camera.position.subVectors(camera.position, controls.target).applyAxisAngle(Y_AXIS, dTheta).add(controls.target);
        controls.update();
    });

    return null;
};
