// build.js — genera la web (index.html) y el PDF del CV a partir de los datos JSON.
//
//   node build.js                -> usa data/cv.json  -> index.html + dist/<pdf>.pdf + preview.png
//   node build.js <variante>     -> usa data/cv.<variante>.json (para CVs personalizados por oferta)
//
// El PDF se imprime con puppeteer-core usando el Microsoft Edge ya instalado (no descarga Chromium).

const fs = require('fs');
const path = require('path');
const { renderHTML } = require('./src/template');

// --- localizar el navegador (Edge o Chrome) ---
function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function main() {
  const variant = process.argv.find((a) => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]);
  const dataFile = variant
    ? path.join(__dirname, 'data', `cv.${variant}.json`)
    : path.join(__dirname, 'data', 'cv.json');

  if (!fs.existsSync(dataFile)) {
    console.error(`✗ No encuentro los datos: ${dataFile}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const html = renderHTML(data);

  // 1) Escribir la web estática (esto es lo que sirve GitHub Pages)
  const htmlOut = path.join(__dirname, 'index.html');
  fs.writeFileSync(htmlOut, html, 'utf8');
  console.log(`✓ Web:  ${path.relative(__dirname, htmlOut)}`);

  // 2) Generar el PDF con el navegador headless
  const browserPath = findBrowser();
  if (!browserPath) {
    console.error('✗ No se encontró Edge ni Chrome. La web sí se generó; el PDF no.');
    process.exit(1);
  }

  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });
  try {
    const page = await browser.newPage();
    // Cargar desde archivo para que se resuelvan rutas relativas (foto en assets/)
    await page.goto('file://' + htmlOut.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

    const distDir = path.join(__dirname, 'dist');
    fs.mkdirSync(distDir, { recursive: true });
    const pdfName = (data.meta && data.meta.pdfFileName) || 'CV';
    const pdfOut = path.join(distDir, `${pdfName}.pdf`);

    await page.pdf({
      path: pdfOut,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    console.log(`✓ PDF:  ${path.relative(__dirname, pdfOut)}`);

    // 3) Vista previa PNG (para revisar el diseño rápidamente)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    const previewOut = path.join(__dirname, 'preview.png');
    await page.screenshot({ path: previewOut, fullPage: true });
    console.log(`✓ Vista previa: ${path.relative(__dirname, previewOut)}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
