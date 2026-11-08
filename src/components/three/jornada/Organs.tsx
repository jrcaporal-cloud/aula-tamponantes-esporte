import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import {
    ESOPHAGUS, FIBER_ORGAN, GUT, STOMACH, VESSEL, centroidOf, cutFaceGeometry, rimGeometry, tubeGeometry,
    type Inset, type Organ, type WallLayer,
} from './anatomy';
import type { StructureId } from './content';
import { COL, cutFaceMaterial, dark, fresnelMaterial, rimMaterial, tissueMaterial, withPulse, type PulseUniforms } from './materials';
import { FiberDetails } from './FiberDetails';
import { useStructure } from './selection';
import { SYS, type JourneyStateRef } from './state';
import { endotheliumTexture, rugaeTexture, striationTexture, villiTexture } from './textures';

/*
 * Órgãos em corte, como peça anatômica seccionada: a metade de trás mostra a mucosa por dentro
 * (com relevo: rugas no estômago, pregas circulares e vilosidades no intestino, estrias na fibra),
 * a face do corte mostra a espessura da parede em camadas, e uma casca de vidro marca a silhueta.
 * O estômago infla com o gás e a parede puxa para o rosa (desconforto); fora da etapa, o órgão
 * escurece para a atenção ficar no que a etapa explica.
 */

const BACK: readonly [number, number] = [Math.PI, Math.PI * 2];
const RISK = new THREE.Color(C.risk);
const TINT = new THREE.Color();
const WHITE = new THREE.Color(1, 1, 1);

type TextureKind = 'rugae' | 'villi' | 'striation' | 'endothelium';
const makeTexture = (k: TextureKind): THREE.Texture =>
    k === 'rugae' ? rugaeTexture() : k === 'villi' ? villiTexture() : k === 'striation' ? striationTexture() : endotheliumTexture();

interface WallLook {
    base: THREE.Color;
    emissive: string;
    sheen: string;
    rim: string;
    layers: readonly WallLayer[];
    texture: TextureKind;
    bumpScale: number;
    shell: number;
    clearcoat?: number;
    /** Brilho próprio da parede (o vaso acende: sangue com bicarbonato). */
    glow: number;
}

interface CutOrganProps {
    id: StructureId;
    organ: Organ;
    look: WallLook;
    inset: Inset;
    tubular: number;
    radial: number;
    /** Presença do sistema (índice em `f.w`) que acende ou escurece o órgão. */
    sys: number;
    stateRef: JourneyStateRef;
    /** Estômago: a parede puxa para o rosa (desconforto) conforme o gás. */
    distress?: boolean;
    /** Vaso: onda de pulso; uv ao longo do vaso inteiro. */
    pulse?: { offset: number; len: number; total: number };
}

const CutOrgan = ({ id, organ, look, inset, tubular, radial, sys, stateRef, distress, pulse }: CutOrganProps) => {
    const geo = useMemo(() => {
        const opts = pulse ? { inset, uvOffset: pulse.offset, uvLen: pulse.len } : { inset };
        return {
            wall: tubeGeometry(organ, tubular, radial, BACK, opts),
            shell: tubeGeometry(organ, Math.max(tubular >> 1, 8), Math.max(radial >> 1, 12)),
            faceA: cutFaceGeometry(organ, Math.PI, inset, look.layers, tubular),
            faceB: cutFaceGeometry(organ, Math.PI * 2, inset, look.layers, tubular),
            rimA: rimGeometry(organ, Math.PI, 0.03),
            rimB: rimGeometry(organ, 0, 0.03),
        };
    }, [organ, tubular, radial, inset, look.layers, pulse]);
    const mats = useMemo(() => {
        const bump = makeTexture(look.texture);
        const wall = tissueMaterial({
            color: look.base, emissive: look.emissive, emissiveIntensity: 0.1, sheen: look.sheen,
            bump, bumpScale: look.bumpScale, clearcoat: look.clearcoat,
        });
        return {
            bump,
            wall: pulse ? withPulse(wall, pulse.total, C.baseSoft) : wall,
            face: cutFaceMaterial(),
            shell: fresnelMaterial(look.rim, look.shell),
            rim: rimMaterial(look.rim, 0.8),
        };
    }, [look, pulse]);
    const { bind, lit } = useStructure(id);
    const wallRef = useRef<THREE.Mesh>(null);
    const faceRef = useRef<THREE.Mesh>(null);
    const shellRef = useRef<THREE.Mesh>(null);
    const rimRef = useRef<THREE.Mesh>(null);

    useEffect(() => () => {
        Object.values(geo).forEach(g => g.dispose());
        Object.values(mats).forEach(m => m.dispose());
    }, [geo, mats]);

    // materiais mexidos pela malha (ref), não pelo valor memorizado
    useFrame(({ clock }) => {
        const wall = wallRef.current?.material as THREE.MeshPhysicalMaterial | undefined;
        const face = faceRef.current?.material as THREE.MeshPhysicalMaterial | undefined;
        const shell = shellRef.current?.material as THREE.ShaderMaterial | undefined;
        const rimM = rimRef.current?.material as THREE.MeshStandardMaterial | undefined;
        if (!wall || !face || !shell || !rimM) return;
        const { f } = stateRef.current;
        const focus = 0.2 + 0.8 * f.w[sys];
        const v = distress ? f.gasLevel : 0;
        const pink = Math.min(v * 1.1, 1);
        TINT.set(look.emissive);
        if (distress) TINT.lerp(RISK, pink);
        wall.emissive.copy(TINT);
        wall.emissiveIntensity = ((lit ? look.glow + 0.32 : look.glow) + v * 0.32) * focus;
        wall.color.copy(look.base).multiplyScalar(focus);
        // fora de foco o verniz, o veludo e os reflexos também apagam (não só a cor)
        wall.sheen = focus;
        wall.envMapIntensity = focus;
        face.envMapIntensity = focus;
        face.color.copy(WHITE).lerp(RISK, pink * 0.45).multiplyScalar(focus);
        face.emissive.copy(RISK).multiplyScalar(pink * 0.12 + (lit ? 0.08 : 0));
        shell.uniforms.uK.value = look.shell * (lit ? 1.6 : 1) * focus;
        rimM.emissiveIntensity = (lit ? 2.2 : 0.8) * focus;
        const pu = wall.userData.pulse as PulseUniforms | undefined;
        if (pu) {
            pu.uTime.value = clock.elapsedTime;
            pu.uK.value = 0.9 * focus;
        }
    });

    return (
        <group>
            <mesh ref={wallRef} geometry={geo.wall} material={mats.wall} {...bind} />
            <mesh ref={faceRef} geometry={geo.faceA} material={mats.face} {...bind} />
            <mesh geometry={geo.faceB} material={mats.face} {...bind} />
            <mesh ref={shellRef} geometry={geo.shell} material={mats.shell} {...bind} />
            <mesh ref={rimRef} geometry={geo.rimA} material={mats.rim} />
            <mesh geometry={geo.rimB} material={mats.rim} />
        </group>
    );
};

/* ── Aparência de cada tecido (tons da paleta escurecidos: ardósia = neutro, ciano = sangue, laranja = fibra) ── */

const slate = (k: number) => dark(C.co2, k);
const GI_LAYERS: readonly WallLayer[] = [
    { at: 0, color: slate(0.95) },      // mucosa
    { at: 0.26, color: slate(0.78) },
    { at: 0.3, color: slate(0.5) },     // submucosa
    { at: 0.55, color: slate(0.46) },
    { at: 0.6, color: slate(0.3) },     // muscular
    { at: 0.9, color: slate(0.26) },
    { at: 1, color: slate(0.85) },      // serosa
];
const GI: WallLook = { base: COL.tissue, emissive: C.co2, sheen: '#cbd5e1', rim: C.co2, layers: GI_LAYERS, texture: 'villi', bumpScale: 1.6, shell: 0.42, glow: 0.1 };
const STOMACH_LOOK: WallLook = { ...GI, texture: 'rugae', bumpScale: 2.2, shell: 0.5 };
const VESSEL_LOOK: WallLook = {
    base: COL.vessel, emissive: C.baseDeep, sheen: C.baseSoft, rim: C.base, texture: 'endothelium', bumpScale: 0.5, shell: 0.45, clearcoat: 0.9, glow: 0.42,
    layers: [
        { at: 0, color: dark(C.baseSoft, 0.9) },   // íntima
        { at: 0.18, color: dark(C.base, 0.55) },
        { at: 0.24, color: dark(C.baseDeep, 0.8) }, // média
        { at: 0.75, color: dark(C.baseDeep, 0.6) },
        { at: 0.8, color: dark(C.co2, 0.45) },     // adventícia
        { at: 1, color: dark(C.co2, 0.6) },
    ],
};
const FIBER_LOOK: WallLook = {
    base: COL.fiber, emissive: C.acidDeep, sheen: C.acidSoft, rim: C.acid, texture: 'striation', bumpScale: 1.4, shell: 0.4, glow: 0.16,
    layers: [{ at: 0, color: dark(C.acidSoft, 0.7) }, { at: 0.6, color: dark(C.acid, 0.6) }, { at: 1, color: dark(C.acidSoft, 0.9) }],
};

/* ── Relevo interno (fração do raio externo) ── */

const flat = (k: number): Inset => () => k;
/** Rugas gástricas: dobras longitudinais que serpenteiam. */
const rugae: Inset = (u, th) => {
    const fold = (0.5 + 0.5 * Math.sin(th * 9 + Math.sin(u * 13) * 0.9)) ** 3;
    return 0.88 - 0.075 * fold;
};
const GUT_LEN = GUT.curve.getLength();
/** Pregas circulares (plicae) do delgado, a cada ~0,45 de comprimento. */
const plicae: Inset = (u, th) => {
    const fold = (0.5 + 0.5 * Math.sin((u * GUT_LEN / 0.45) * Math.PI * 2 + Math.sin(th * 2) * 0.6)) ** 4;
    return 0.83 - 0.13 * fold * (0.75 + 0.25 * Math.sin(th * 3 + u * 40));
};

const STOMACH_C = centroidOf(STOMACH);
const STOMACH_BACK = STOMACH_C.clone().negate();

/** Estômago que infla com o gás: escala em torno do próprio centro. */
const Stomach = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const g = useRef<THREE.Group>(null);
    useFrame(() => { g.current?.scale.setScalar(1 + 0.13 * stateRef.current.f.gasLevel); });
    return (
        <group position={STOMACH_C}>
            <group ref={g}>
                <group position={STOMACH_BACK}>
                    <CutOrgan id="estomago" organ={STOMACH} look={STOMACH_LOOK} inset={rugae} tubular={110} radial={72} sys={SYS.stomach} stateRef={stateRef} distress />
                </group>
            </group>
        </group>
    );
};

/** Divide o vaso em dois trechos clicáveis: veia porta/circulação e capilar do músculo. */
const SPLIT = 0.6;
const VESSEL_LEN = VESSEL.curve.getLength();
/** Trecho [a, b] do vaso, reparametrizado de 0 a 1. */
class VesselPart extends THREE.Curve<THREE.Vector3> {
    readonly a: number;
    readonly b: number;
    constructor(a: number, b: number) {
        super();
        this.a = a;
        this.b = b;
    }
    getPoint(t: number, out = new THREE.Vector3()): THREE.Vector3 {
        return VESSEL.curve.getPointAt(this.a + (this.b - this.a) * t, out);
    }
}
const part = (a: number, b: number): Organ => ({ curve: new VesselPart(a, b), radius: u => VESSEL.radius(a + (b - a) * u) });
const PORTAL = part(0, SPLIT);
const CAPILLARY = part(SPLIT, 1);
const PORTAL_PULSE = { offset: 0, len: SPLIT * VESSEL_LEN, total: VESSEL_LEN };
const CAPILLARY_PULSE = { offset: SPLIT * VESSEL_LEN, len: (1 - SPLIT) * VESSEL_LEN, total: VESSEL_LEN };
const VESSEL_INSET = flat(0.84);

const VesselParts = ({ stateRef }: { stateRef: JourneyStateRef }) => (
    <group>
        <CutOrgan id="veia" organ={PORTAL} look={VESSEL_LOOK} inset={VESSEL_INSET} tubular={140} radial={22} sys={SYS.blood} stateRef={stateRef} pulse={PORTAL_PULSE} />
        <CutOrgan id="capilar" organ={CAPILLARY} look={VESSEL_LOOK} inset={VESSEL_INSET} tubular={90} radial={22} sys={SYS.blood} stateRef={stateRef} pulse={CAPILLARY_PULSE} />
    </group>
);

const ESO_INSET = flat(0.78);
const FIBER_INSET = flat(0.965);

export const Organs = ({ stateRef }: { stateRef: JourneyStateRef }) => (
    <group>
        <CutOrgan id="estomago" organ={ESOPHAGUS} look={GI} inset={ESO_INSET} tubular={28} radial={24} sys={SYS.stomach} stateRef={stateRef} />
        <Stomach stateRef={stateRef} />
        <CutOrgan id="intestino" organ={GUT} look={GI} inset={plicae} tubular={620} radial={26} sys={SYS.gut} stateRef={stateRef} />
        <VesselParts stateRef={stateRef} />
        <CutOrgan id="fibra" organ={FIBER_ORGAN} look={FIBER_LOOK} inset={FIBER_INSET} tubular={24} radial={48} sys={SYS.muscle} stateRef={stateRef} />
        <FiberDetails stateRef={stateRef} />
    </group>
);
