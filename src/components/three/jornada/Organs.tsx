import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { ESOPHAGUS, FIBER, GUT, MCT_X, MEMBRANE_Y, STOMACH, VESSEL, centroidOf, rimGeometry, tubeGeometry, type Organ } from './anatomy';
import type { StructureId } from './content';
import { COL, fresnelMaterial, rimMaterial, wallMaterial } from './materials';
import { useStructure } from './selection';
import type { JourneyStateRef } from './state';

/*
 * Órgãos em corte: metade de trás opaca (a parede vista por dentro), borda do corte brilhante e casca
 * da frente quase invisível (só a silhueta). O estômago infla com o gás e a parede puxa para o rosa
 * (desconforto); a fibra é laranja-escura (ácida); o vaso, ciano-escuro (sangue com bicarbonato).
 */

const BACK: readonly [number, number] = [Math.PI, Math.PI * 2];

interface CutOrganProps {
    id: StructureId;
    organ: Organ;
    base: THREE.Color;
    emissive: string;
    rim: string;
    tubular: number;
    radial: number;
    shell?: number;
    /** Estômago: a parede puxa para o rosa (desconforto) conforme o gás. */
    distress?: JourneyStateRef;
}

const RISK = new THREE.Color(C.risk);
const TINT = new THREE.Color();

const CutOrgan = ({ id, organ, base, emissive, rim, tubular, radial, shell = 0.5, distress }: CutOrganProps) => {
    const geo = useMemo(() => ({
        wall: tubeGeometry(organ, tubular, radial, BACK),
        shell: tubeGeometry(organ, tubular, radial),
        rimA: rimGeometry(organ, Math.PI, 0.045),
        rimB: rimGeometry(organ, 0, 0.045),
    }), [organ, tubular, radial]);
    const mats = useMemo(() => ({
        wall: wallMaterial(base, emissive, 0.12),
        shell: fresnelMaterial(rim, shell),
        rim: rimMaterial(rim, 0.9),
    }), [base, emissive, rim, shell]);
    const { bind, lit } = useStructure(id);
    const wallRef = useRef<THREE.Mesh>(null);
    const rimRef = useRef<THREE.Mesh>(null);

    useEffect(() => () => {
        Object.values(geo).forEach(g => g.dispose());
        Object.values(mats).forEach(m => m.dispose());
    }, [geo, mats]);

    // materiais mexidos pela malha (ref), não pelo valor memorizado
    useFrame(() => {
        const wall = wallRef.current?.material as THREE.MeshStandardMaterial | undefined;
        const rimM = rimRef.current?.material as THREE.MeshStandardMaterial | undefined;
        if (!wall || !rimM) return;
        const v = distress ? distress.current.f.gasLevel : 0;
        if (distress) wall.emissive.copy(TINT.set(emissive).lerp(RISK, Math.min(v * 1.1, 1)));
        wall.emissiveIntensity = (lit ? 0.42 : 0.12) + v * 0.32;
        rimM.emissiveIntensity = lit ? 2.2 : 0.9;
    });

    return (
        <group>
            <mesh ref={wallRef} geometry={geo.wall} material={mats.wall} {...bind} />
            <mesh geometry={geo.shell} material={mats.shell} {...bind} />
            <mesh ref={rimRef} geometry={geo.rimA} material={mats.rim} />
            <mesh geometry={geo.rimB} material={mats.rim} />
        </group>
    );
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
                    <CutOrgan id="estomago" organ={STOMACH} base={COL.tissue} emissive={C.co2} rim={C.co2} tubular={96} radial={40} distress={stateRef} />
                </group>
            </group>
        </group>
    );
};

/** Estrias da fibra (linhas Z), só na metade de trás, e as portas MCT na borda de cima do corte. */
const FiberDetails = () => {
    const { bind, lit } = useStructure('mct');
    const ring = useMemo(() => new THREE.TorusGeometry(FIBER.r * 0.995, 0.022, 6, 48, Math.PI), []);
    const pore = useMemo(() => new THREE.TorusGeometry(0.2, 0.07, 10, 28), []);
    const ringMat = useMemo(() => rimMaterial(C.acidSoft, 0.35), []);
    const poreMat = useMemo(() => rimMaterial(C.acidSoft, 1.2), []);
    useEffect(() => () => { ring.dispose(); pore.dispose(); ringMat.dispose(); poreMat.dispose(); }, [ring, pore, ringMat, poreMat]);
    const poreRef = useRef<THREE.Mesh>(null);
    useFrame(() => {
        const m = poreRef.current?.material as THREE.MeshStandardMaterial | undefined;
        if (m) m.emissiveIntensity = lit ? 2.6 : 1.2;
    });
    const xs = useMemo(() => Array.from({ length: 15 }, (_, i) => FIBER.x0 + 0.25 + i * 0.5), []);
    return (
        <group>
            {xs.map(x => (
                <group key={x} position={[x, FIBER.y, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <mesh geometry={ring} material={ringMat} rotation={[0, 0, -Math.PI / 2]} />
                </group>
            ))}
            {MCT_X.map((x, i) => (
                <mesh key={x} ref={i === 0 ? poreRef : undefined} geometry={pore} material={poreMat} position={[x, MEMBRANE_Y - 0.02, -0.12]} rotation={[Math.PI / 2, 0, 0]} {...bind} />
            ))}
        </group>
    );
};

const FIBER_ORGAN: Organ = {
    curve: new THREE.LineCurve3(new THREE.Vector3(FIBER.x0, FIBER.y, 0), new THREE.Vector3(FIBER.x1, FIBER.y, 0)),
    radius: () => FIBER.r,
};

/** Capilar = trecho final do vaso: o mesmo tubo, mas a estrutura clicável muda de nome sobre a fibra. */
const VESSEL_TRUNK: Organ = { curve: VESSEL.curve, radius: VESSEL.radius };

export const Organs = ({ stateRef }: { stateRef: JourneyStateRef }) => (
    <group>
        <CutOrgan id="estomago" organ={ESOPHAGUS} base={COL.tissue} emissive={C.co2} rim={C.co2} tubular={24} radial={20} shell={0.35} />
        <Stomach stateRef={stateRef} />
        <CutOrgan id="intestino" organ={GUT} base={COL.tissue} emissive={C.co2} rim={C.co2} tubular={260} radial={20} />
        <VesselParts />
        <CutOrgan id="fibra" organ={FIBER_ORGAN} base={COL.fiber} emissive={C.acidDeep} rim={C.acid} tubular={8} radial={40} shell={0.4} />
        <FiberDetails />
    </group>
);

/** Divide o vaso em dois trechos clicáveis: veia porta/circulação e capilar do músculo. */
const SPLIT = 0.6;
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
        return VESSEL_TRUNK.curve.getPointAt(this.a + (this.b - this.a) * t, out);
    }
}
const part = (a: number, b: number): Organ => ({ curve: new VesselPart(a, b), radius: u => VESSEL_TRUNK.radius(a + (b - a) * u) });
const PORTAL = part(0, SPLIT);
const CAPILLARY = part(SPLIT, 1);

const VesselParts = () => (
    <group>
        <CutOrgan id="veia" organ={PORTAL} base={COL.vessel} emissive={C.baseDeep} rim={C.base} tubular={120} radial={18} shell={0.45} />
        <CutOrgan id="capilar" organ={CAPILLARY} base={COL.vessel} emissive={C.baseDeep} rim={C.base} tubular={80} radial={18} shell={0.45} />
    </group>
);
