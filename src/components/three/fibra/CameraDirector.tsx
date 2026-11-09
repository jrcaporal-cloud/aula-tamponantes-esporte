import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FIBER_STEPS } from './steps';
import { STRUCTURES, type Pose, type StructureId } from './structures';

/*
 * Quem manda na câmera: a cada troca de etapa, fixação ou "Recentrar", um voo cinematográfico de onde a
 * câmera está até a pose de destino: o alvo desliza, a câmera orbita em coordenadas esféricas em volta
 * dele (o ângulo gira pelo caminho curto), recua um pouco no meio do voo e volta a fechar o plano. O toque do usuário no canvas interrompe o voo e devolve
 * o controle à órbita. A etapa só "assenta" (e os rótulos aparecem) quando o voo termina.
 */

interface Flight {
    active: boolean;
    u: number;
    fromP: THREE.Vector3;
    fromT: THREE.Vector3;
    toP: THREE.Vector3;
    toT: THREE.Vector3;
    /** Recuo relativo da câmera no meio do voo. */
    lift: number;
    a: THREE.Spherical;
    b: THREE.Spherical;
}

interface Props {
    step: number;
    pin: StructureId | null;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
}

const setV = (v: THREE.Vector3, p: Pose['pos']) => v.set(p[0], p[1], p[2]);
const makeFlight = (): Flight => ({
    active: false, u: 0, fromP: new THREE.Vector3(), fromT: new THREE.Vector3(), toP: new THREE.Vector3(), toT: new THREE.Vector3(), lift: 0,
    a: new THREE.Spherical(), b: new THREE.Spherical(),
});
const TMP = new THREE.Vector3();
const SPH = new THREE.Spherical();

export const CameraDirector = ({ step, pin, recenterKey, reduced, onSettled }: Props) => {
    const get = useThree(s => s.get);
    const gl = useThree(s => s.gl);
    const controls = useThree(s => s.controls) as OrbitControlsImpl | null;
    // criado uma vez (só lido em efeitos e no quadro): nada de Vector3 novo a cada render
    const [flight] = useState(makeFlight);
    const flightRef = useRef(flight);
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
        flight.a.setFromVector3(TMP.subVectors(flight.fromP, flight.fromT));
        flight.b.setFromVector3(TMP.subVectors(flight.toP, flight.toT));
        // gira pelo caminho curto
        const dTheta = flight.b.theta - flight.a.theta;
        flight.b.theta = flight.a.theta + Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
        const travel = flight.fromT.distanceTo(flight.toT) + Math.abs(flight.b.theta - flight.a.theta) * 6 + Math.abs(flight.b.radius - flight.a.radius) * 0.4;
        flight.lift = Math.min(0.04 + travel * 0.012, 0.16);
        flight.u = 0;
        flight.active = true;
        pending.current = pin ? null : step;
        const anim = gsap.to(flight, {
            u: 1,
            duration: reduced ? 0.3 : 2.1,
            ease: 'power3.inOut',
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
        controls.target.lerpVectors(flight.fromT, flight.toT, u);
        SPH.radius = THREE.MathUtils.lerp(flight.a.radius, flight.b.radius, u) * (1 + flight.lift * Math.sin(Math.PI * u));
        SPH.phi = THREE.MathUtils.lerp(flight.a.phi, flight.b.phi, u) - 0.06 * Math.sin(Math.PI * u) * (flight.lift / 0.16);
        // o ângulo horizontal chega um pouco antes (a câmera "abre" o plano e depois aproxima)
        SPH.theta = THREE.MathUtils.lerp(flight.a.theta, flight.b.theta, Math.min(u * 1.08, 1));
        SPH.makeSafe();
        camera.position.setFromSpherical(SPH).add(controls.target);
        controls.update();
    });

    return null;
};
