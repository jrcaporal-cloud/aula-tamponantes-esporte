import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FIBER_STEPS } from './steps';
import { STRUCTURES, type Pose, type StructureId } from './structures';

/*
 * Quem manda na câmera: a cada troca de etapa, fixação ou "Recentrar", um voo curto (arco suave)
 * de onde a câmera está até a pose de destino. O toque do usuário no canvas interrompe o voo e devolve
 * o controle à órbita. A etapa só "assenta" (e os rótulos aparecem) quando o voo termina.
 */

interface Flight { active: boolean; u: number; fromP: THREE.Vector3; fromT: THREE.Vector3; toP: THREE.Vector3; toT: THREE.Vector3; lift: number }

interface Props {
    step: number;
    pin: StructureId | null;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
}

const setV = (v: THREE.Vector3, p: Pose['pos']) => v.set(p[0], p[1], p[2]);

export const CameraDirector = ({ step, pin, recenterKey, reduced, onSettled }: Props) => {
    const get = useThree(s => s.get);
    const gl = useThree(s => s.gl);
    const controls = useThree(s => s.controls) as OrbitControlsImpl | null;
    const flightRef = useRef<Flight>({
        active: false, u: 0, fromP: new THREE.Vector3(), fromT: new THREE.Vector3(), toP: new THREE.Vector3(), toT: new THREE.Vector3(), lift: 0,
    });
    const first = useRef(true);
    const pending = useRef<number | null>(null);

    useEffect(() => {
        const el = gl.domElement;
        const stop = () => {
            const flight = flightRef.current;
            if (!flight.active) return;
            flight.active = false;
            if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
        };
        el.addEventListener('pointerdown', stop);
        el.addEventListener('wheel', stop, { passive: true });
        return () => { el.removeEventListener('pointerdown', stop); el.removeEventListener('wheel', stop); };
    }, [gl, onSettled]);

    useEffect(() => {
        if (!controls) return;
        const { camera } = get();
        const flight = flightRef.current;
        const goal = pin ? STRUCTURES[pin].pose : FIBER_STEPS[step].pose;
        if (first.current) {
            first.current = false;
            setV(camera.position, goal.pos);
            setV(controls.target, goal.tgt);
            controls.update();
            onSettled(step);
            return;
        }
        flight.fromP.copy(camera.position);
        flight.fromT.copy(controls.target);
        setV(flight.toP, goal.pos);
        setV(flight.toT, goal.tgt);
        flight.lift = 0.12 * flight.fromP.distanceTo(flight.toP);
        flight.u = 0;
        flight.active = true;
        pending.current = pin ? null : step;
        const anim = gsap.to(flight, {
            u: 1,
            duration: reduced ? 0.3 : 1.7,
            ease: 'power2.inOut',
            onComplete: () => {
                flight.active = false;
                if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
            },
        });
        return () => { anim.kill(); };
    }, [step, pin, recenterKey, controls, get, reduced, onSettled]);

    useFrame(({ camera }) => {
        const flight = flightRef.current;
        if (!controls || !flight.active) return;
        const u = flight.u;
        camera.position.lerpVectors(flight.fromP, flight.toP, u);
        // arco: sobe um pouco no meio do caminho, para o voo parecer um deslize
        camera.position.y += Math.sin(Math.PI * u) * flight.lift * 0.35;
        controls.target.lerpVectors(flight.fromT, flight.toT, u);
        controls.update();
    });

    return null;
};
