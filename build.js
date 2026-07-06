// build.js — genera la web (HTML) y el PDF del CV en todos los idiomas.
//
//   node build.js            -> construye todas las variantes de data/cv*.json
//
// Cada variante produce su página HTML (meta.htmlFile) y su PDF (dist/<meta.pdfFileName>.pdf).
// El PDF se imprime con puppeteer-core usando el Microsoft Edge ya instalado (no descarga Chromium).

const fs = require('fs');
const path = require('path');
const { renderHTML } = require('./src/template');

// Variantes a construir: cada archivo data/cv*.json es una variante.
function listVariants() {
  const dir = path.join(__dirname, 'data');
  return fs
    .readdirSync(dir)
    .filter((f) => /^cv(\..+)?\.json$/.test(f))
    .map((f) => path.join(dir, f));
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

async function main() {
  const variants = listVariants();
  if (!variants.length) {
    console.error('✗ No hay archivos de datos en data/');
    process.exit(1);
  }

  // 1) Escribir cada página HTML (esto es lo que sirve GitHub Pages)
  const built = [];
  for (const dataFile of variants) {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const htmlFile = (data.meta && data.meta.htmlFile) || 'index.html';
    const htmlOut = path.join(__dirname, htmlFile);
    fs.writeFileSync(htmlOut, renderHTML(data), 'utf8');
    console.log(`✓ Web:  ${htmlFile}`);
    built.push({ data, htmlOut, htmlFile });
  }

  // 2) Generar los PDFs con el navegador headless
  const browserPath = findBrowser();
  if (!browserPath) {
    console.error('✗ No se encontró Edge ni Chrome. Las webs sí se generaron; los PDF no.');
    process.exit(1);
  }

  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });
  try {
    const distDir = path.join(__dirname, 'dist');
    fs.mkdirSync(distDir, { recursive: true });

    for (const b of built) {
      const page = await browser.newPage();
      await page.goto('file://' + b.htmlOut.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

      const pdfName = (b.data.meta && b.data.meta.pdfFileName) || 'CV';
      const pdfOut = path.join(distDir, `${pdfName}.pdf`);
      await page.pdf({ path: pdfOut, format: 'A4', printBackground: true, preferCSSPageSize: true });
      console.log(`✓ PDF:  dist/${pdfName}.pdf`);

      // Vista previa PNG solo de la variante base (index.html)
      if (b.htmlFile === 'index.html') {
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
        await page.screenshot({ path: path.join(__dirname, 'preview.png'), fullPage: true });
        console.log('✓ Vista previa: preview.png');
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
