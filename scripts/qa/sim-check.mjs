// Checagem de um simulador isolado (?sim=Nome) ou de um slide da aula (#/n), passo a passo.
// Uso: node scripts/qa/sim-check.mjs <Nome|#/n> <porta> [pastaDeCapturas] [larguraxaltura]
// Mede: erros de console, estouro de caixas (scrollHeight > clientHeight em overflow oculto),
// texto visível abaixo de 14 px DE PROJETO (descontada a escala do palco) e salva um PNG por passo.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [target = '', port = '5330', outDir = '/tmp/sim-check', size = '1280x720'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const base = `http://localhost:${port}/aula-tamponantes-esporte/`;
const url = target.startsWith('#') ? `${base}${target}` : `${base}?sim=${target}`;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal', '--enable-gpu-rasterization'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);

const probe = () => page.evaluate(() => {
    const stage = document.querySelector('.deck-stage') ?? document.body;
    const overflow = [];
    for (const el of stage.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (!/(hidden|clip)/.test(cs.overflow + cs.overflowY + cs.overflowX)) continue;
        if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} ${el.scrollHeight}>${el.clientHeight}`);
        }
    }
    const small = [];
    // Régua da aula: ≥14 px DE PROJETO (o palco de 1280 encolhe ou cresce com a tela; o texto vai junto).
    const stageEl = [...document.querySelectorAll('[style*="scale("]')].find(e => /scale\(/.test(e.style.transform));
    const stageScale = stageEl ? parseFloat(stageEl.style.transform.match(/scale\(([^)]+)\)/)[1]) || 1 : 1;
    const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent.trim();
        if (!text) continue;
        const el = node.parentElement;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
        if (!rects.length) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
        // tamanho efetivo: altura da caixa de texto / line-height relativo ≈ fonte renderizada
        const svg = el.closest('svg');
        let px = parseFloat(cs.fontSize);
        if (svg) {
            const vb = svg.viewBox?.baseVal;
            const box = svg.getBoundingClientRect();
            if (vb && vb.width) px = px * (box.width / vb.width);
        } else {
            let scale = 1;
            for (let p = el; p; p = p.parentElement) {
                const t = getComputedStyle(p).transform;
                if (t && t !== 'none') { const m = t.match(/matrix\(([^,]+)/); if (m) scale *= parseFloat(m[1]); }
            }
            px *= scale;
        }
        const design = px / stageScale;
        if (design < 13.7) small.push(`${design.toFixed(1)}px de projeto "${text.slice(0, 40)}"`);
    }
    const scale = (() => { const s = document.querySelector('[style*="scale("]'); return s ? s.style.transform : 'n/a'; })();
    return { overflow: overflow.slice(0, 12), small: [...new Set(small)].slice(0, 15), scale };
});

const steps = async () => page.evaluate(() => {
    const el = document.querySelector('[data-testid="sim-step"]');
    const m = el?.textContent?.match(/(\d+)\/(\d+)/);
    return m ? { step: +m[1], count: +m[2] } : null;
});

let info = await steps();
const total = info?.count ?? 1;
const report = [];
for (let i = 0; i < Math.max(total, 1); i++) {
    await page.waitForTimeout(1300);
    const p = await probe();
    const file = `${outDir}/${(target.replace(/[^\w]/g, '') || 'slide')}-${W}x${H}-p${i + 1}.png`;
    await page.screenshot({ path: file });
    report.push({ passo: i + 1, estouro: p.overflow, textoPequeno: p.small, captura: file });
    if (i < total - 1) await page.keyboard.press('ArrowRight');
}
console.log(JSON.stringify({ url, viewport: size, passos: total, erros: [...new Set(errors)].slice(0, 15), report }, null, 1));
await browser.close();
