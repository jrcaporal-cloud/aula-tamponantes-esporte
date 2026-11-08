import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStore } from '../../store/useStore';
import { ANIMATED_BACKGROUND_SLIDES } from '../deck/slides';
import { rng } from './shared/math';

const ION_COUNT = 46;
const PROTON_COUNT = 140;
const FIELD = { x: 34, y: 20, z: 26 };

/** HCO₃⁻ esquemático: carbono central e três oxigênios a 120°, num plano (uma geometria só, instanciada). */
const makeBicarbonateGeometry = () => {
    const parts: THREE.BufferGeometry[] = [new THREE.SphereGeometry(0.42, 16, 12)];
    for (let k = 0; k < 3; k++) {
        const a = (k * 2 * Math.PI) / 3 + Math.PI / 2;
        const o = new THREE.SphereGeometry(0.5, 16, 12);
        o.translate(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0);
        parts.push(o);
    }
    const geo = mergeGeometries(parts);
    geo.computeVertexNormals();
    return geo;
};

interface Drifter {
    pos: THREE.Vector3;
    rot: THREE.Euler;
    spin: THREE.Vector3;
    speed: number;
    scale: number;
}

const makeDrifters = (count: number, seed: number, speed: [number, number], scale: [number, number]): Drifter[] => {
    const rand = rng(seed);
    return Array.from({ length: count }, () => ({
        pos: new THREE.Vector3((rand() - 0.5) * FIELD.x * 2, (rand() - 0.5) * FIELD.y * 2, -rand() * FIELD.z - 4),
        rot: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
        spin: new THREE.Vector3((rand() - 0.5) * 0.4, (rand() - 0.5) * 0.4, (rand() - 0.5) * 0.3),
        speed: speed[0] + rand() * (speed[1] - speed[0]),
        scale: scale[0] + rand() * (scale[1] - scale[0]),
    }));
};

/** Íons de bicarbonato (ciano) derivando devagar. */
const Bicarbonate = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const geometry = useMemo(() => makeBicarbonateGeometry(), []);
    const ions = useMemo(() => makeDrifters(ION_COUNT, 7, [0.35, 0.9], [0.55, 1.1]), []);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const dt = Math.min(delta, 0.05);
        ions.forEach((c, i) => {
            c.pos.x += c.speed * dt;
            c.pos.y += Math.sin(c.pos.x * 0.15 + i) * 0.1 * dt;
            if (c.pos.x > FIELD.x) c.pos.x = -FIELD.x;
            c.rot.x += c.spin.x * dt;
            c.rot.y += c.spin.y * dt;
            c.rot.z += c.spin.z * dt;
            dummy.position.copy(c.pos);
            dummy.rotation.copy(c.rot);
            dummy.scale.setScalar(c.scale);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, ION_COUNT]}>
            <meshStandardMaterial color="#0e7490" emissive="#0b4f63" emissiveIntensity={0.6} roughness={0.35} metalness={0.1} />
        </instancedMesh>
    );
};

/** Prótons (H⁺) laranja: pontos menores e mais rápidos, como faíscas. */
const Protons = () => {
    const ref = useRef<THREE.Points>(null);
    const drifters = useMemo(() => makeDrifters(PROTON_COUNT, 13, [1.2, 2.6], [1, 1]), []);
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PROTON_COUNT * 3), 3));
        return geo;
    }, []);
    useFrame((_, delta) => {
        const attr = ref.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
        if (!attr) return;
        const dt = Math.min(delta, 0.05);
        drifters.forEach((p, i) => {
            p.pos.x += p.speed * dt;
            p.pos.y += Math.sin(p.pos.x * 0.3 + i * 1.7) * 0.25 * dt;
            if (p.pos.x > FIELD.x) p.pos.x = -FIELD.x;
            attr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
        });
        attr.needsUpdate = true;
    });
    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial size={0.16} color="#fb923c" transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

/** Parallax suave com o mouse + leve aproximação ao avançar na aula. */
const CameraDrift = () => {
    const slide = useStore(s => s.currentSlide);
    const target = useRef(new THREE.Vector3());
    useFrame(({ camera, pointer }, delta) => {
        target.current.set(pointer.x * 1.6, pointer.y * 1.0, 16 - Math.min(slide, 40) * 0.08);
        camera.position.lerp(target.current, Math.min(delta * 1.5, 1));
        camera.lookAt(0, 0, -10);
    });
    return null;
};

/**
 * Fundo 3D da aula: íons de bicarbonato e prótons derivando — tema da aula, baixo custo
 * (duas instâncias, sem pós-processamento) e fica atenuado nos slides de conteúdo.
 */
export const AmbientBackground = () => {
    const slide = useStore(s => s.currentSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const isHero = slide === 0;

    return (
        <div
            aria-hidden
            className="absolute inset-0 z-0 transition-opacity duration-1000"
            style={{ opacity: isHero ? 0.95 : 0.4 }}
        >
            <Canvas
                dpr={[1, 1.5]}
                frameloop={modalOpen ? 'never' : ANIMATED_BACKGROUND_SLIDES.has(slide) ? 'always' : 'demand'}
                camera={{ position: [0, 0, 16], fov: 50 }}
                gl={{ antialias: true, powerPreference: 'low-power' }}
            >
                <color attach="background" args={['#04080F']} />
                <fog attach="fog" args={['#04080F', 14, 46]} />
                <ambientLight intensity={0.35} color="#1e3a5f" />
                <directionalLight position={[8, 10, 12]} intensity={1.3} color="#cffafe" />
                <pointLight position={[-12, -4, 4]} intensity={2.2} distance={40} color="#f97316" />
                <CameraDrift />
                <Bicarbonate />
                <Protons />
            </Canvas>
            {/* Vinheta: garante contraste do texto sobre o fundo animado. */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,8,15,0.55)_60%,rgba(4,8,15,0.92)_100%)]" />
        </div>
    );
};
