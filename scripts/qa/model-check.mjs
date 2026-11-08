// Percorre um modelo 3D (?model=nome) etapa a etapa: captura, fps medido por rAF e erros de console.
// Uso: node scripts/qa/model-check.mjs <nome> <porta> <pasta> [1280x720] [etapas]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [name, port = '5350', outDir = '/tmp/model', size = '1280x720', stepsArg = '8'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message.slice(0, 160)}`));
await page.goto(`http://localhost:${port}/aula-tamponantes-esporte/?model=${name}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const fps = () => page.evaluate(() => new Promise(res => {
    let n = 0; const t0 = performance.now();
    const tick = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(Math.round(n / 2)); };
    requestAnimationFrame(tick);
}));
const out = [];
for (let i = 0; i < Number(stepsArg); i++) {
    await page.waitForTimeout(2200);
    const f = await fps();
    await page.screenshot({ path: `${outDir}/${name}-${W}-e${i + 1}.png` });
    out.push(f);
    await page.keyboard.press('ArrowRight');
}
console.log(JSON.stringify({ name, size, fps: out, erros: [...new Set(errors)] }));
await browser.close();
