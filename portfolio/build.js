// build.js — genera el portfolio (hub + fichas de proyecto) desde data/portfolio.json.
//
//   node build.js
//
// Produce:
//   index.html                 -> hub (aitorizur.github.io/portfolio/)
//   games/<slug>.html          -> una ficha por cada entrada en data.games
//   preview.png (opcional)     -> captura del hub, si hay Edge/Chrome instalado
//
// El diseño vive en src/template.js; el contenido en data/portfolio.json.

const fs = require('fs');
const path = require('path');
const { renderHub, renderGame } = require('./src/template');

async function main() {
  const dataFile = path.join(__dirname, 'data', 'portfolio.json');
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  // 1) Hub
  const hubOut = path.join(__dirname, 'index.html');
  fs.writeFileSync(hubOut, renderHub(data), 'utf8');
  console.log('✓ Hub:  index.html');

  // 2) Una ficha por juego con detalle
  const gamesDir = path.join(__dirname, 'games');
  fs.mkdirSync(gamesDir, { recursive: true });
  for (const slug of Object.keys(data.games || {})) {
    const out = path.join(gamesDir, `${slug}.html`);
    fs.writeFileSync(out, renderGame(data, slug), 'utf8');
    console.log(`✓ Game: games/${slug}.html`);
  }

  // 3) Vista previa PNG del hub (opcional; requiere Edge/Chrome)
  const browserPath = findBrowser();
  if (!browserPath) {
    console.log('ℹ Sin Edge/Chrome: se omite preview.png (las páginas sí se generaron).');
    return;
  }
  try {
    const puppeteer = require('puppeteer-core');
    const browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
    await page.goto('file://' + hubOut.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    // Forzar carga de imágenes lazy antes de la captura de página completa
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => i.removeAttribute('loading'));
      await new Promise((r) => setTimeout(r, 400));
      await Promise.all(
        [...document.images].filter((i) => !i.complete).map((i) => new Promise((res) => { i.onload = i.onerror = res; }))
      );
    });
    await page.screenshot({ path: path.join(__dirname, 'preview.png'), fullPage: true });
    console.log('✓ Vista previa: preview.png');
    await browser.close();
  } catch (err) {
    console.log('ℹ No se pudo generar preview.png:', err.message);
  }
}

function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  return candidates.find((c) => fs.existsSync(c)) || null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
