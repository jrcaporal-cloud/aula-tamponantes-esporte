// Filma a entrada de slides com contagem e o fecho, indo direto pelo endereço (#/n, 1 = capa).
// Uso: node scripts/qa/film-counts.mjs <porta> <pasta> [larguraxaltura]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [port = '5330', outDir = '/tmp/film', size = '1280x720'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const CHROME = '/Users/mac/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const base = `http://localhost:${port}/aula-tamponantes-esporte/`;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=metal', '--enable-gpu-rasterization'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`${base}#/2`, { waitUntil: 'networkidle' });
await page.waitForTimeout(6000); // pré-carga dos sims

const shots = async (name, times) => {
    const t0 = Date.now();
    for (const ms of times) {
        const wait = ms - (Date.now() - t0);
        if (wait > 0) await page.waitForTimeout(wait);
        await page.screenshot({ path: `${outDir}/${name}-${String(ms).padStart(5, '0')}.png` });
    }
};
for (const [name, n, times] of [['intestino', 24, [150, 500, 1400]], ['takeaways', 54, [150, 600, 1500]], ['forestBA', 32, [150, 450, 1400]], ['forestSB', 20, [150, 450, 1400]], ['fecho', 56, [400, 4500, 10000]]]) {
    await page.evaluate(() => { location.hash = '#/2'; });
    await page.waitForTimeout(1200);
    await page.evaluate(h => { location.hash = h; }, `#/${n}`);
    await shots(name, times);
}
console.log(JSON.stringify({ errors: [...new Set(errors)] }));
await browser.close();
