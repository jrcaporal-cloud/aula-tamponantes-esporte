import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStore } from '../../store/useStore';
import { ANIMATED_BACKGROUND_SLIDES, DECK } from '../deck/slides';
import { moodFor, type Mood } from '../deck/actMood';
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

/** Valores do clima no quadro atual: caminham até o clima do slide (ver `deck/actMood.ts`). */
interface Live {
    protons: number;
    ions: number;
    warm: number;
    speed: number;
    pull: number;
    ionColor: THREE.Color;
    ionGlow: THREE.Color;
}

const liveFrom = (m: Mood): Live => ({
    protons: m.protons, ions: m.ions, warm: m.warm, speed: m.speed, pull: m.pull,
    ionColor: new THREE.Color(m.ionColor), ionGlow: new THREE.Color(m.ionGlow),
});

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/** Leva o clima vivo até o alvo, mais devagar quando o clima pede uma troca longa (o fecho). */
const MoodDriver = ({ target, liveRef }: { target: Mood; liveRef: RefObject<Live> }) => {
    const ionColor = useMemo(() => new THREE.Color(target.ionColor), [target.ionColor]);
    const ionGlow = useMemo(() => new THREE.Color(target.ionGlow), [target.ionGlow]);
    useFrame((_, delta) => {
        const live = liveRef.current;
        const a = 1 - Math.exp(-Math.min(delta, 0.05) * (4000 / target.settleMs));
        live.protons += (target.protons - live.protons) * a;
        live.ions += (target.ions - live.ions) * a;
        live.warm += (target.warm - live.warm) * a;
        live.speed += (target.speed - live.speed) * a;
        live.pull += (target.pull - live.pull) * a;
        live.ionColor.lerp(ionColor, a);
        live.ionGlow.lerp(ionGlow, a);
    });
    return null;
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

/*
 * Passos do laço de quadros, fora dos componentes (o compilador do React não deixa mutar ali o que veio
 * de um hook) e em `for` simples, sem closure por quadro.
 */
const advanceIons = (ions: Drifter[], dt: number, visible: number, dummy: THREE.Object3D, mesh: THREE.InstancedMesh) => {
    for (let i = 0; i < ions.length; i++) {
        const c = ions[i];
        c.pos.x += c.speed * dt;
        c.pos.y += Math.sin(c.pos.x * 0.15 + i) * 0.1 * dt;
        if (c.pos.x > FIELD.x) c.pos.x = -FIELD.x;
        c.rot.x += c.spin.x * dt;
        c.rot.y += c.spin.y * dt;
        c.rot.z += c.spin.z * dt;
        dummy.position.copy(c.pos);
        dummy.rotation.copy(c.rot);
        // Íons além da fração do clima encolhem até sumir (sem "estalo" de aparecer/desaparecer).
        dummy.scale.setScalar(c.scale * clamp01(visible - i));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
};

const advanceProtons = (drifters: Drifter[], dt: number, attr: THREE.BufferAttribute) => {
    for (let i = 0; i < drifters.length; i++) {
        const p = drifters[i];
        p.pos.x += p.speed * dt;
        p.pos.y += Math.sin(p.pos.x * 0.3 + i * 1.7) * 0.25 * dt;
        if (p.pos.x > FIELD.x) p.pos.x = -FIELD.x;
        attr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
    }
};

/** Íons de bicarbonato (ciano) derivando devagar. */
const Bicarbonate = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const geometry = useMemo(() => makeBicarbonateGeometry(), []);
    const ions = useMemo(() => makeDrifters(ION_COUNT, 7, [0.35, 0.9], [0.55, 1.1]), []);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const live = liveRef.current;
        const dt = Math.min(delta, 0.05) * live.speed;
        const visible = live.ions * ION_COUNT;
        advanceIons(ions, dt, visible, dummy, mesh);
        mesh.instanceMatrix.needsUpdate = true;
        materialRef.current?.color.copy(live.ionColor);
        materialRef.current?.emissive.copy(live.ionGlow);
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, ION_COUNT]}>
            <meshStandardMaterial ref={materialRef} color="#0e7490" emissive="#0b4f63" emissiveIntensity={0.6} roughness={0.35} metalness={0.1} />
        </instancedMesh>
    );
};

/** Prótons (H⁺) laranja: pontos menores e mais rápidos, como faíscas. */
const Protons = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const ref = useRef<THREE.Points>(null);
    const drifters = useMemo(() => makeDrifters(PROTON_COUNT, 13, [1.2, 2.6], [1, 1]), []);
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PROTON_COUNT * 3), 3));
        return geo;
    }, []);
    useFrame((_, delta) => {
        const attr = ref.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
        if (!attr || !ref.current) return;
        const live = liveRef.current;
        const dt = Math.min(delta, 0.05) * live.speed;
        ref.current.geometry.setDrawRange(0, Math.round(live.protons * PROTON_COUNT));
        advanceProtons(drifters, dt, attr);
        attr.needsUpdate = true;
    });
    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial size={0.16} color="#fb923c" transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

/** Luz quente (H⁺) que acompanha o clima. */
const WarmLight = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const ref = useRef<THREE.PointLight>(null);
    useFrame(() => { if (ref.current) ref.current.intensity = liveRef.current.warm; });
    return <pointLight ref={ref} position={[-12, -4, 4]} intensity={2.2} distance={40} color="#f97316" />;
};

/** Parallax suave com o mouse + leve aproximação ao avançar na aula. */
const CameraDrift = ({ liveRef }: { liveRef: RefObject<Live> }) => {
    const slide = useStore(s => s.currentSlide);
    // criado uma vez (inicializador preguiçoso); o ref só carrega o vetor que o useFrame reescreve
    const [scratch] = useState(() => new THREE.Vector3());
    const target = useRef(scratch);
    useFrame(({ camera, pointer }, delta) => {
        target.current.set(pointer.x * 1.6, pointer.y * 1.0, 16 - Math.min(slide, 40) * 0.08 + liveRef.current.pull);
        camera.position.lerp(target.current, Math.min(delta * 1.5, 1));
        camera.lookAt(0, 0, -10);
    });
    return null;
};

/**
 * Fundo 3D da aula: íons de bicarbonato e prótons derivando — tema da aula, baixo custo
 * (duas instâncias, sem pós-processamento) e fica atenuado nos slides de conteúdo.
 * Cada ato tem seu clima (mais H⁺ na Perícia, mais tampão no Ato III…); ver `deck/actMood.ts`.
 */
export const AmbientBackground = () => {
    const slide = useStore(s => s.currentSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const item = DECK[slide] ?? DECK[0];
    const mood = moodFor(item.slide.id, item.section);
    // clima inicial calculado uma vez só (não a cada render); os valores vivos mudam pelo ref no useFrame
    const [initialLive] = useState(() => liveFrom(mood));
    const liveRef = useRef<Live>(initialLive);

    // Ao trocar de clima, o fundo anima até assentar e depois volta a congelar.
    const [settling, setSettling] = useState(false);
    useEffect(() => {
        const start = window.setTimeout(() => setSettling(true), 0);
        const stop = window.setTimeout(() => setSettling(false), mood.settleMs);
        return () => { window.clearTimeout(start); window.clearTimeout(stop); };
    }, [mood]);
    const animated = settling || ANIMATED_BACKGROUND_SLIDES.has(slide);

    return (
        <div
            aria-hidden
            className="absolute inset-0 z-0 transition-opacity"
            style={{ opacity: mood.opacity, transitionDuration: `${Math.min(mood.settleMs, 4000)}ms` }}
        >
            <Canvas
                dpr={1}
                frameloop={modalOpen ? 'never' : animated ? 'always' : 'demand'}
                camera={{ position: [0, 0, 16], fov: 50 }}
                gl={{ antialias: false, powerPreference: 'low-power' }}
            >
                <color attach="background" args={['#04080F']} />
                <fog attach="fog" args={['#04080F', 14, 46]} />
                <ambientLight intensity={0.35} color="#1e3a5f" />
                <directionalLight position={[8, 10, 12]} intensity={1.3} color="#cffafe" />
                <MoodDriver target={mood} liveRef={liveRef} />
                <WarmLight liveRef={liveRef} />
                <CameraDrift liveRef={liveRef} />
                <Bicarbonate liveRef={liveRef} />
                <Protons liveRef={liveRef} />
            </Canvas>
            {/* Vinheta: garante contraste do texto sobre o fundo animado. */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,8,15,0.55)_60%,rgba(4,8,15,0.92)_100%)]" />
        </div>
    );
};
