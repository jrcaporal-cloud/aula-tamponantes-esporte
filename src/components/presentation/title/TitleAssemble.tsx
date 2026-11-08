import { useEffect, useRef, useState, type RefObject } from 'react';

/** Quando o título de verdade começa a aparecer por cima das partículas (s). */
export const ASSEMBLE_REVEAL_S = 1.75;

const FLIGHT_MS = 1250;
const MAX_STAGGER_MS = 300;
// As letras de pontos ficam um instante sozinhas (~1,55 → 1,75 s) antes do título de verdade.
const FADE_AT_MS = 2050;
const SAMPLE_STEP = 5;
const MAX_PARTICLES = 1500;
const PROTON = '#fb923c';
const BASE = '#22d3ee';

interface Particle {
    x0: number; y0: number; x1: number; y1: number;
    delay: number; color: string; size: number; curl: number;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Pontos dentro das letras do título: desenha cada letra onde ela está na tela e lê os pixels. */
const sampleGlyphs = (root: HTMLElement, title: HTMLElement): { x: number; y: number }[] => {
    const scale = root.getBoundingClientRect().width / root.offsetWidth || 1;
    const origin = root.getBoundingClientRect();
    const w = root.offsetWidth;
    const h = root.offsetHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    const css = getComputedStyle(title);
    ctx.font = `${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';

    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? '';
        for (let i = 0; i < text.length; i++) {
            if (!text[i].trim()) continue;
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const r = range.getBoundingClientRect();
            const cx = (r.left + r.width / 2 - origin.left) / scale;
            const cy = (r.top + r.height / 2 - origin.top) / scale;
            ctx.fillText(text[i], cx, cy);
        }
    }

    const { data } = ctx.getImageData(0, 0, w, h);
    const points: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y += SAMPLE_STEP) {
        for (let x = 0; x < w; x += SAMPLE_STEP) {
            if (data[(y * w + x) * 4 + 3] > 140) points.push({ x, y });
        }
    }
    // Título longo demais para o orçamento de partículas: fica com uma amostra espalhada por igual.
    if (points.length <= MAX_PARTICLES) return points;
    const every = points.length / MAX_PARTICLES;
    return Array.from({ length: MAX_PARTICLES }, (_, i) => points[Math.floor(i * every)]);
};

const makeParticles = (targets: { x: number; y: number }[], w: number, h: number): Particle[] =>
    targets.map((t, i) => {
        // Saem espalhados pela tela (de fora para dentro), como os íons do fundo antes de virar título.
        const angle = (i * 2.399963) % (Math.PI * 2);
        const radius = 0.55 + ((i * 7919) % 1000) / 1000 * 0.5;
        return {
            x0: w / 2 + Math.cos(angle) * w * radius,
            y0: h / 2 + Math.sin(angle) * h * radius,
            x1: t.x,
            y1: t.y,
            delay: ((i * 104729) % 1000) / 1000 * MAX_STAGGER_MS,
            color: i % 4 === 0 ? BASE : PROTON,
            size: i % 4 === 0 ? 3 : 2.5,
            curl: (((i * 31) % 100) / 100 - 0.5) * 160,
        };
    });

/**
 * Abertura da aula: prótons (laranja) e íons-tampão (ciano) vêm de todos os lados e se juntam
 * nas letras do título; o título de verdade aparece por cima e as partículas se apagam.
 */
export const TitleAssemble = ({ rootRef, titleRef }: { rootRef: RefObject<HTMLElement | null>; titleRef: RefObject<HTMLElement | null> }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        let raf = 0;
        let fadeTimer = 0;
        let cancelled = false;
        const run = async () => {
            await document.fonts.ready;
            const root = rootRef.current;
            const title = titleRef.current;
            const canvas = canvasRef.current;
            if (cancelled || !root || !title || !canvas) return;
            const w = root.offsetWidth;
            const h = root.offsetHeight;
            const particles = makeParticles(sampleGlyphs(root, title), w, h);
            const ratio = Math.min(window.devicePixelRatio * (root.getBoundingClientRect().width / w || 1), 3);
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.scale(ratio, ratio);
            const start = performance.now();
            fadeTimer = window.setTimeout(() => setFading(true), FADE_AT_MS);
            const draw = (now: number) => {
                const elapsed = now - start;
                ctx.clearRect(0, 0, w, h);
                ctx.globalCompositeOperation = 'lighter';
                for (const p of particles) {
                    const t = easeInOut(Math.min(Math.max((elapsed - p.delay) / FLIGHT_MS, 0), 1));
                    const bend = Math.sin(t * Math.PI) * p.curl;
                    ctx.globalAlpha = 0.45 + 0.55 * t;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x0 + (p.x1 - p.x0) * t + bend, p.y0 + (p.y1 - p.y0) * t - bend * 0.4, p.size, p.size);
                }
                if (elapsed < FADE_AT_MS + 900) raf = requestAnimationFrame(draw);
            };
            raf = requestAnimationFrame(draw);
        };
        void run();
        return () => { cancelled = true; cancelAnimationFrame(raf); window.clearTimeout(fadeTimer); };
    }, [rootRef, titleRef]);

    return (
        <canvas ref={canvasRef} aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700"
            style={{ opacity: fading ? 0 : 1 }} />
    );
};
