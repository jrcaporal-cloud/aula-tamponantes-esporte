import * as THREE from 'three';
import { rng } from '../shared/math';

/*
 * Texturas de relevo procedurais (mapas de altura em tons de cinza, sem arquivos): vilosidades do
 * intestino, rugas finas da mucosa gástrica, estrias da fibra e o endotélio liso do vaso.
 * Geradas uma vez por chamada; quem cria descarta. Repetição em unidades de mundo (uv do tubo).
 */

const SIZE = 128;

type Height = (x: number, y: number) => number;

const toTexture = (h: Height, repeat: [number, number]): THREE.DataTexture => {
    const data = new Uint8Array(SIZE * SIZE * 4);
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const v = Math.round(Math.min(Math.max(h(x / SIZE, y / SIZE), 0), 1) * 255);
            const i = (y * SIZE + x) * 4;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
        }
    }
    const t = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.repeat.set(repeat[0], repeat[1]);
    t.needsUpdate = true;
    return t;
};

/** Ruído de valor periódico (ladrilha sem costura) com `cells` células por lado. */
const valueNoise = (cells: number, seed: number): Height => {
    const r = rng(seed);
    const g = Float32Array.from({ length: cells * cells }, () => r());
    const at = (i: number, j: number) => g[((j + cells) % cells) * cells + ((i + cells) % cells)];
    return (x, y) => {
        const fx = x * cells;
        const fy = y * cells;
        const i = Math.floor(fx);
        const j = Math.floor(fy);
        const u = fx - i;
        const v = fy - j;
        const su = u * u * (3 - 2 * u);
        const sv = v * v * (3 - 2 * v);
        const a = at(i, j) + (at(i + 1, j) - at(i, j)) * su;
        const b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * su;
        return a + (b - a) * sv;
    };
};

/** Vilosidades: domos arredondados em grade com jitter. */
export const villiTexture = (): THREE.DataTexture => {
    const n = valueNoise(8, 91);
    const cells = 10;
    const r = rng(17);
    const jit = Float32Array.from({ length: cells * cells * 2 }, () => (r() - 0.5) * 0.5);
    return toTexture((x, y) => {
        const i = Math.floor(x * cells);
        const j = Math.floor(y * cells);
        let best = 9;
        for (let dj = -1; dj <= 1; dj++) {
            for (let di = -1; di <= 1; di++) {
                const ci = (i + di + cells) % cells;
                const cj = (j + dj + cells) % cells;
                const cx = (i + di + 0.5 + jit[(cj * cells + ci) * 2]) / cells;
                const cy = (j + dj + 0.5 + jit[(cj * cells + ci) * 2 + 1]) / cells;
                best = Math.min(best, Math.hypot(x - cx, y - cy) * cells);
            }
        }
        return Math.max(1 - best * 1.25, 0) ** 0.6 * 0.85 + n(x, y) * 0.15;
    }, [1 / 0.32, 1 / 0.32]);
};

/** Mucosa gástrica: rugas finas e sinuosas sobre ruído. */
export const rugaeTexture = (): THREE.DataTexture => {
    const n = valueNoise(6, 7);
    const m = valueNoise(16, 23);
    return toTexture((x, y) => {
        const wave = 0.5 + 0.5 * Math.sin((y * 6 + n(x, y) * 1.6) * Math.PI * 2);
        return wave ** 2 * 0.65 + m(x, y) * 0.35;
    }, [1 / 2.4, 1 / 2.4]);
};

/** Estrias da fibra: bandas A/I transversais, com uma linha Z fina no meio da banda clara. */
export const striationTexture = (): THREE.DataTexture => {
    const n = valueNoise(8, 5);
    return toTexture((x, y) => {
        const p = (x * 8 + n(x, y) * 0.12) % 1;
        const band = p < 0.55 ? 0.85 : 0.25;
        const z = Math.abs(p - 0.78) < 0.025 ? 1 : 0;
        return band * 0.8 + z * 0.2 + n(x * 2 % 1, y) * 0.1;
    }, [1 / 1.6, 1 / 1.6]);
};

/** Endotélio: placas alongadas muito suaves (o vaso fica quase liso). */
export const endotheliumTexture = (): THREE.DataTexture => {
    const n = valueNoise(10, 3);
    return toTexture((x, y) => 0.5 + 0.5 * Math.sin((x * 3 + n(x, y) * 0.8) * Math.PI * 2) * 0.4 + n(x, y) * 0.3, [1 / 1.2, 1 / 0.8]);
};
