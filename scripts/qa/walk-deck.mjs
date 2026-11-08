// Percurso completo da aula: slide a slide, passo a passo, pelo teclado (como o passador).
// Uso: node scripts/qa/walk-deck.mjs <porta> <pasta> [1280x720] [primeiro-slide] [último-slide]
// Mede por passo: estouro de caixa, texto < 14 px de projeto, rolagem do palco e erros de console.
// Salva uma captura do último passo de cada slide.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const [port = '5330', outDir = '/tmp/walk', size = '1280x720', from = '1', to = '999'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
let errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message.slice(0, 160)}`));

const base = `http://localhost:${port}/aula-tamponantes-esporte/`;
await page.goto(`${base}#/${from}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const probe = () => page.evaluate(() => {
    const overflow = [];
    const section = document.querySelector('section[aria-roledescription="slide"]');
    const root = section ?? document.body;
    for (const el of root.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (!/(hidden|clip)/.test(cs.overflow + cs.overflowY + cs.overflowX)) continue;
        if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
            const r = el.getBoundingClientRect();
            if (r.width > 4 && r.height > 4) overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${el.scrollHeight}>${el.clientHeight}`);
        }
    }
    const stageEl = [...root.querySelectorAll('[style*="scale("]')].find(e => /scale\(/.test(e.style.transform));
    const stageScale = stageEl ? parseFloat(stageEl.style.transform.match(/scale\(([^)]+)\)/)[1]) || 1 : 1;
    const small = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent.trim();
        if (!text) continue;
        const el = node.parentElement;
        const range = document.createRange();
        range.selectNodeContents(node);
        if (![...range.getClientRects()].some(r => r.width > 0 && r.height > 0)) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
        let px = parseFloat(cs.fontSize);
        const svg = el.closest('svg');
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
        if (px / stageScale < 13.7) small.push(`${(px / stageScale).toFixed(1)} "${text.slice(0, 30)}"`);
    }
    const stage = document.querySelector('.deck-stage');
    const scrolls = stage ? stage.scrollHeight > stage.clientHeight + 2 : false;
    const label = section?.getAttribute('aria-label') ?? '';
    const stepText = [...document.querySelectorAll('span')].map(s => s.textContent).find(t => /^Passo \d+ de \d+$/.test(t ?? '')) ?? 'Passo 1 de 1';
    const [, step, count] = stepText.match(/Passo (\d+) de (\d+)/);
    return { label, step: +step, count: +count, overflow: overflow.slice(0, 6), small: [...new Set(small)].slice(0, 6), scrolls };
});

const report = [];
for (let guard = 0; guard < 400; guard++) {
    const p = await probe();
    const idx = parseInt(p.label, 10);
    if (idx > Number(to)) break;
    const issues = { overflow: p.overflow, small: p.small, scrolls: p.scrolls, errors: [...new Set(errors)] };
    errors = [];
    const bad = issues.overflow.length || issues.small.length || issues.scrolls || issues.errors.length;
    if (bad) report.push({ slide: p.label.slice(0, 60), passo: `${p.step}/${p.count}`, ...issues });
    const lastStep = p.step >= p.count;
    if (lastStep) await page.screenshot({ path: `${outDir}/s${String(idx).padStart(2, '0')}.png` });
    const total = p.label.match(/de (\d+):/)?.[1];
    if (lastStep && total && idx >= Number(total)) break;
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(lastStep ? 1700 : 1000);
}
writeFileSync(`${outDir}/relatorio-${size}.json`, JSON.stringify(report, null, 1));
console.log(`${size}: ${report.length} passos com problema`);
for (const r of report.slice(0, 40)) console.log(JSON.stringify(r));
await browser.close();
