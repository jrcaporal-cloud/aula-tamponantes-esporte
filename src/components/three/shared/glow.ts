import * as THREE from 'three';

/** Textura radial (brilho) compartilhada por todos os sprites das cenas. */

let glowTex: THREE.Texture | null = null;
export const getGlowTexture = () => {
    if (glowTex) return glowTex;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    if (g) {
        const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grd.addColorStop(0, 'rgba(255,255,255,1)');
        grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
        grd.addColorStop(0.6, 'rgba(255,255,255,0.12)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
    }
    glowTex = new THREE.CanvasTexture(c);
    return glowTex;
};
