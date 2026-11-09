import * as THREE from 'three';
import { rng } from '../shared/math';

/*
 * Texturas procedurais (canvas), geradas sob demanda e guardadas: nada de arquivo de imagem, a aula
 * roda offline. Cada função devolve sempre a mesma textura (o modal reabre sem recriar).
 */

const canvas = (w: number, h: number) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return { c, g: c.getContext('2d') };
};

const finish = (c: HTMLCanvasElement, srgb: boolean, repeat: [number, number] = [1, 1]) => {
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
    tex.anisotropy = 4;
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const cache = new Map<string, THREE.Texture>();
const once = (key: string, make: () => THREE.Texture): THREE.Texture => {
    const hit = cache.get(key);
    if (hit) return hit;
    const tex = make();
    cache.set(key, tex);
    return tex;
};

/** Sarcômeros por miofibrila (repetição da textura ao longo do comprimento). */
export const SARCOMERES = 16;

/** Corte transversal da miofibrila: filamentos grossos em rede hexagonal (pontos escuros sobre rosa). */
export const myofibrilEndMap = () => once('myo-end', () => {
    const { c, g } = canvas(128, 128);
    if (g) {
        g.fillStyle = '#C98A9A';
        g.fillRect(0, 0, 128, 128);
        const step = 9;
        for (let j = 0; j * step * 0.866 < 140; j++) {
            for (let i = 0; i * step < 140; i++) {
                const x = i * step + (j % 2 ? step / 2 : 0);
                const y = j * step * 0.866;
                g.fillStyle = '#6E2A42';
                g.beginPath();
                g.arc(x, y, 2.2, 0, Math.PI * 2);
                g.fill();
            }
        }
    }
    return finish(c, true);
});

/** Endotélio: mosaico de células (Voronoi que emenda nas bordas), contornos claros. */
export const endotheliumMap = () => once('endo', () => {
    const W = 256;
    const H = 128;
    const { c, g } = canvas(W, H);
    if (g) {
        const r = rng(303);
        const seeds = Array.from({ length: 22 }, () => [r() * W, r() * H] as const);
        const img = g.createImageData(W, H);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                let d1 = 1e9;
                let d2 = 1e9;
                for (const [sx, sy] of seeds) {
                    // distância com volta (emenda nas bordas); células alongadas no sentido do fluxo
                    const dx = Math.min(Math.abs(x - sx), W - Math.abs(x - sx)) * 0.55;
                    const dy = Math.min(Math.abs(y - sy), H - Math.abs(y - sy));
                    const d = dx * dx + dy * dy;
                    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
                }
                const edge = Math.sqrt(d2) - Math.sqrt(d1);
                const line = Math.max(0, 1 - edge / 2.2);
                const nucleus = Math.max(0, 1 - Math.sqrt(d1) / 5) * 0.55;
                const o = (y * W + x) * 4;
                img.data[o] = 150 + 90 * line + 40 * nucleus;
                img.data[o + 1] = 92 + 110 * line + 20 * nucleus;
                img.data[o + 2] = 118 + 100 * line + 50 * nucleus;
                img.data[o + 3] = 255;
            }
        }
        g.putImageData(img, 0, 0);
    }
    return finish(c, true, [4, 1]);
});

/** Renda do retículo sarcoplasmático: malha de canais (alfa) em volta de cada miofibrila. */
export const reticulumAlpha = () => once('sr-alpha', () => {
    const W = 64;
    const H = 128;
    const { c, g } = canvas(W, H);
    if (g) {
        g.fillStyle = '#000';
        g.fillRect(0, 0, W, H);
        g.strokeStyle = '#fff';
        g.lineCap = 'round';
        const r = rng(404);
        // canais longitudinais ondulados que se ramificam
        for (let k = 0; k < 5; k++) {
            const x0 = (k + 0.5) * (W / 5);
            g.lineWidth = 1.6 + r() * 0.8;
            g.beginPath();
            for (let y = 0; y <= H; y += 4) {
                const x = x0 + Math.sin((y / H) * Math.PI * 4 + k * 1.7) * 2.6;
                if (y === 0) g.moveTo(x, y); else g.lineTo(x, y);
            }
            g.stroke();
        }
        // anastomoses (pontes entre canais), mais densas no meio do sarcômero (zona H)
        for (let k = 0; k < 14; k++) {
            const y = H * (0.3 + r() * 0.4);
            const x = r() * W;
            g.lineWidth = 1.6;
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x + 6 + r() * 4, y + (r() - 0.5) * 6);
            g.stroke();
        }
        // cisternas terminais (faixas largas) nas junções A–I
        g.fillStyle = '#fff';
        g.fillRect(0, Math.round(H * 0.2) - 2, W, 4);
        g.fillRect(0, Math.round(H * 0.8) - 2, W, 4);
    }
    return finish(c, false, [2, SARCOMERES]);
});
