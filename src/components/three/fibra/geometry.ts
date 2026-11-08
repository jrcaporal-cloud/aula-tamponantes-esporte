import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CUT_A, CUT_B, FIBER_HALF, FIBER_R, MYO_R, PORT_A } from './layout';

/* Geometrias compartilhadas, criadas uma vez no carregamento do módulo. */

const alongX = (g: THREE.BufferGeometry) => g.rotateZ(-Math.PI / 2);

/** Casca do sarcolema sem a fatia da frente (θ do cilindro = α − π/2, ver layout). */
export const SHELL = alongX(new THREE.CylinderGeometry(
    FIBER_R, FIBER_R, FIBER_HALF * 2, 96, 1, true, CUT_B - Math.PI / 2, Math.PI * 2 - (CUT_B - CUT_A),
));

/** Tampa da ponta (corte transversal), com a mesma abertura. */
export const CAP = new THREE.CircleGeometry(FIBER_R, 64, Math.PI / 2 - CUT_A, Math.PI * 2 - (CUT_B - CUT_A)).rotateY(-Math.PI / 2);

/** Bordas do corte longitudinal. */
export const RIM = alongX(new THREE.CylinderGeometry(0.05, 0.05, FIBER_HALF * 2, 8));

export const MYOFIBRIL = alongX(new THREE.CylinderGeometry(MYO_R, MYO_R, FIBER_HALF * 2 - 0.25, 16, 1));

export const SPHERE = new THREE.SphereGeometry(1, 12, 9);
export const SPHERE_HI = new THREE.SphereGeometry(1, 24, 16);
export const ICO = new THREE.IcosahedronGeometry(1, 0);
export const OCTA = new THREE.OctahedronGeometry(1, 0);
export const TORUS = new THREE.TorusGeometry(0.75, 0.32, 8, 20);
/** Hemácia: disco bicôncavo esquemático. */
export const RBC = new THREE.TorusGeometry(0.2, 0.13, 10, 24);

const merged = (parts: THREE.BufferGeometry[]) => {
    const g = mergeGeometries(parts);
    g.computeVertexNormals();
    return g;
};

/** Carnosina: dipeptídeo (β-alanina + histidina) como haltere. */
export const DUMBBELL = merged([
    new THREE.SphereGeometry(0.62, 12, 9).translate(-0.55, 0, 0),
    new THREE.SphereGeometry(0.75, 12, 9).translate(0.55, 0, 0),
]);

/** HCO₃⁻: carbono e três oxigênios num plano. */
export const TREFOIL = merged([
    new THREE.SphereGeometry(0.5, 10, 8),
    ...[0, 1, 2].map(k => {
        const a = (k * 2 * Math.PI) / 3 + Math.PI / 2;
        return new THREE.SphereGeometry(0.55, 10, 8).translate(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0);
    }),
]);

/** CO₂: O=C=O em linha. */
export const LINEAR3 = merged([
    new THREE.SphereGeometry(0.55, 10, 8),
    new THREE.SphereGeometry(0.5, 10, 8).translate(-1, 0, 0),
    new THREE.SphereGeometry(0.5, 10, 8).translate(1, 0, 0),
]);

/** Transportador: quatro hélices em volta de um poro, eixo na normal da membrana na porta. */
export const PORTER = merged([0, 1, 2, 3].map(k => {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    return new THREE.CylinderGeometry(0.14, 0.14, 1.15, 10).translate(Math.cos(a) * 0.24, 0, Math.sin(a) * 0.24);
})).rotateX(PORT_A);

/** Seta no fim do capilar (rumo ao pulmão). */
export const ARROW = new THREE.ConeGeometry(0.42, 0.9, 20).rotateZ(-Math.PI / 2);

/** Faixas do sarcômero (linha Z escura, banda I clara, banda A escura) para as miofibrilas. */
export const makeStriationTexture = (): THREE.Texture => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 64;
    const g = c.getContext('2d');
    if (g) {
        g.fillStyle = '#d8a1ad';
        g.fillRect(0, 0, 4, 64);
        g.fillStyle = '#7d4357';
        g.fillRect(0, 18, 4, 28);
        g.fillStyle = '#9b5a6e';
        g.fillRect(0, 29, 4, 6);
        g.fillStyle = '#4a2433';
        g.fillRect(0, 0, 4, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 16);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};
