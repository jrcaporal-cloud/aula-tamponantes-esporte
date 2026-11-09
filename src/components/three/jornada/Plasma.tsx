import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { VESSEL, tubeGeometry } from './anatomy';
import { PULSE_HZ } from './materials';
import { plasmaMaterial, type PlasmaUniforms } from './shaders';
import { SYS, type JourneyStateRef } from './state';

/*
 * Plasma correndo dentro do vaso inteiro (veia porta → capilar): um tubo interno aditivo cujo brilho
 * é o nível de HCO₃⁻ do quadro (`f.blood` × presença do sangue). Na etapa 3 ele sobe e desce com o
 * relógio do atleta; na etapa 4 acende com o sangue alcalino e apaga no normal. Os íons seguem por cima.
 */

const TUBULAR = 220;
const RADIAL = 18;
const VESSEL_LEN = VESSEL.curve.getLength();
/** Raio do plasma: um pouco dentro da mucosa do vaso (inset 0,84). */
const INNER = 0.78;

/** Tubo inteiro com uv.y normalizado (0…1 em volta): o ruído periódico fecha sem costura. */
const plasmaGeometry = (): THREE.BufferGeometry => {
    const g = tubeGeometry({ curve: VESSEL.curve, radius: u => VESSEL.radius(u) * INNER }, TUBULAR, RADIAL, [0, Math.PI * 2], { uvLen: VESSEL_LEN });
    const uv = g.getAttribute('uv') as THREE.BufferAttribute;
    for (let i = 0; i <= TUBULAR; i++) {
        for (let j = 0; j <= RADIAL; j++) uv.setY(i * (RADIAL + 1) + j, j / RADIAL);
    }
    return g;
};

export const Plasma = ({ stateRef }: { stateRef: JourneyStateRef }) => {
    const geo = useMemo(() => plasmaGeometry(), []);
    const mat = useMemo(() => plasmaMaterial({
        uTime: { value: 0 },
        uLen: { value: VESSEL_LEN },
        uLevel: { value: 0 },
        uDeep: { value: new THREE.Color(C.baseDeep).multiplyScalar(0.55) },
        uSoft: { value: new THREE.Color(C.baseSoft).multiplyScalar(0.8) },
    }, PULSE_HZ), []);
    useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
    const mesh = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const m = mesh.current;
        if (!m) return;
        const { f } = stateRef.current;
        const level = Math.min(Math.max(f.blood, 0), 1) * f.w[SYS.blood];
        m.visible = level > 1e-3;
        if (!m.visible) return;
        const u = (m.material as THREE.ShaderMaterial).uniforms as unknown as PlasmaUniforms;
        // mesmo relógio da parede: o pulso do plasma e o da parede andam juntos
        u.uTime.value = clock.elapsedTime;
        u.uLevel.value = level;
    });

    return <mesh ref={mesh} geometry={geo} material={mat} renderOrder={1} frustumCulled={false} />;
};
