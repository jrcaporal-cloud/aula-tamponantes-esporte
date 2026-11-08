// Filma animações da aula em quadros com tempo marcado (abertura, cortina de ato, contagens, fecho).
// Uso: node scripts/qa/film.mjs <porta> <pasta> [larguraxaltura]
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
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message}`));

const shots = async (name, times) => {
    const t0 = Date.now();
    for (const ms of times) {
        const wait = ms - (Date.now() - t0);
        if (wait > 0) await page.waitForTimeout(wait);
        await page.screenshot({ path: `${outDir}/${name}-${String(ms).padStart(5, '0')}.png` });
    }
};
const open = async hash => {
    await page.goto(`${base}${hash}`, { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
};

// 1 · abertura: sai da capa e volta para ela
await open('#/2');
await page.keyboard.press('ArrowLeft');
await shots('abertura', [300, 800, 1200, 1500, 1750, 2000, 2400, 3400]);

// 2 · cortina: último slide do Ato I → quadro → seguir
await open('#/5');
for (let i = 0; i < 15 && !(await page.$('[role=dialog]')); i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/cortina-0quadro.png` });
await page.keyboard.press('ArrowRight');
await shots('cortina', [100, 250, 450, 700, 1000, 1300, 1600, 2000]);
await page.waitForTimeout(3500);
await page.screenshot({ path: `${outDir}/cortina-fundo-ato2.png` });

// 3 · contagens
for (const [name, hash, keys] of [['premio', '#/5', 7], ['intestino', '#/24', 0], ['takeaways', '#/54', 0], ['placebo', '#/43', 3], ['forestBA', '#/32', 0], ['forestSB', '#/20', 0]]) {
    await open(hash);
    for (let i = 0; i < keys; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(250); }
    if (keys === 0) { await page.goto(`${base}#/${Number(hash.slice(2)) - 1}`); await page.waitForTimeout(1500); await page.keyboard.press('ArrowRight'); }
    await shots(name, [200, 600, 1500]);
}

// 4 · fecho
await open('#/55');
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowRight');
await shots('fecho', [300, 4000, 9500]);

console.log(JSON.stringify({ errors: [...new Set(errors)].slice(0, 10) }));
await browser.close();
