// template.js — convierte los datos del CV (cv.json) en una página HTML completa.
// El diseño replica el CV de Canva: cabecera + dos columnas (principal ancha + lateral).

const ICONS = {
  globe:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.478 5.92.43.372.814 1.102.814 2.222 0 1.606-.014 2.9-.014 3.294 0 .32.216.694.825.576C20.565 22.296 24 17.798 24 12.5 24 5.87 18.627.5 12 .5z"/></svg>'
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function bullets(list) {
  if (!list || !list.length) return '';
  return `<ul class="bullets">${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
}

// Fila superior de una entrada: izquierda (org/proyecto) + derecha (fecha)
function entryTop(left, right) {
  return `<div class="entry-top"><span class="entry-left">${left}</span><span class="entry-date">${esc(right)}</span></div>`;
}

function renderExperience(item) {
  const org = `<span class="org">${esc(item.org)}</span>`;
  const loc = item.location ? ` • ${esc(item.location)}` : '';
  return `<div class="entry">
    ${entryTop(org + loc, item.date)}
    <div class="role">${esc(item.role)}</div>
    ${bullets(item.bullets)}
  </div>`;
}

function renderProject(item) {
  const tag = item.tag ? ` • ${esc(item.tag)}` : '';
  const nameHtml = item.url
    ? `<a class="proj-name" href="${esc(item.url)}">${esc(item.name)}</a>`
    : `<span class="proj-name">${esc(item.name)}</span>`;
  const left = `${nameHtml}${tag}`;
  return `<div class="entry">
    ${entryTop(left, item.date)}
    <div class="role">${esc(item.role)}</div>
    ${bullets(item.bullets)}
  </div>`;
}

function renderEducation(item) {
  const org = `<span class="org">${esc(item.org)}</span>`;
  const loc = item.location ? ` • ${esc(item.location)}` : '';
  return `<div class="entry">
    ${entryTop(org + loc, item.date)}
    <div class="role">${esc(item.role)}</div>
  </div>`;
}

function renderMainSection(section) {
  let body = '';
  if (section.type === 'projects') {
    body = section.items.map(renderProject).join('');
  } else if (section.type === 'education') {
    body = section.items.map(renderEducation).join('');
  } else {
    body = section.items.map(renderExperience).join('');
  }
  return `<section class="block">
    <h2 class="section-title">${esc(section.title)}</h2>
    ${body}
  </section>`;
}

function renderSideSection(section) {
  let body = '';
  if (section.type === 'text') {
    body = `<p class="side-text">${esc(section.text)}</p>`;
  } else {
    body = `<ul class="bullets">${section.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  }
  return `<section class="block side-block">
    <h2 class="section-title">${esc(section.title)}</h2>
    ${body}
  </section>`;
}

function renderHeader(h) {
  const links = h.links
    .map(
      (l) =>
        `<a class="link" href="${esc(l.url)}"><span class="link-icon">${ICONS[l.icon] || ''}</span><span class="link-label">${esc(l.label)}</span></a>`
    )
    .join('');
  const contact = [h.contact.location, h.contact.phone, h.contact.email]
    .filter(Boolean)
    .map(esc)
    .join(' • ');
  return `<header class="header">
    <div class="photo"><img src="${esc(h.photo)}" alt="${esc(h.name)}" onerror="this.style.display='none';this.parentNode.classList.add('photo-fallback');this.parentNode.textContent='AI'"></div>
    <div class="head-text">
      <h1 class="name">${esc(h.name)}</h1>
      <div class="title">${esc(h.title)}</div>
      <p class="summary">${esc(h.summary)}</p>
      <div class="contact">${contact}</div>
      <div class="links">${links}</div>
    </div>
  </header>`;
}

const CSS = `
:root{
  --ink:#2b2b2b; --muted:#4a4a4a; --rule:#3a3a3a; --accent:#2b2b2b;
  --sans:"Segoe UI","Helvetica Neue",Arial,"Noto Sans",sans-serif;
}
*{box-sizing:border-box;}
@page{ size:A4; margin:14mm 13mm; }
html,body{margin:0;padding:0;}
body{
  font-family:var(--sans); color:var(--ink);
  font-size:9.4pt; line-height:1.4; background:#fff;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.sheet{ max-width:210mm; margin:0 auto; }

/* Cabecera */
.header{ display:flex; gap:20px; align-items:center; margin-bottom:14px; }
.photo{ flex:0 0 auto; width:144px; height:144px; border-radius:50%; overflow:hidden;
  background:#e8e8e8; display:flex; align-items:center; justify-content:center; }
.photo img{ width:100%; height:100%; object-fit:cover; }
.photo-fallback{ font-weight:700; font-size:39px; color:#8a2a2a; letter-spacing:1px; }
.head-text{ flex:1 1 auto; }
.name{ font-size:23pt; font-weight:700; letter-spacing:1px; margin:0 0 2px; }
.title{ font-size:9.5pt; letter-spacing:4px; text-transform:uppercase; color:var(--muted);
  padding-bottom:8px; border-bottom:1.4px solid var(--rule); margin-bottom:8px; }
.summary{ margin:0 0 8px; color:var(--muted); }
.contact{ text-align:left; color:var(--muted); font-size:9pt; margin-bottom:6px; }
.links{ display:flex; gap:26px; justify-content:flex-start; }
.link{ display:inline-flex; align-items:center; gap:5px; color:var(--ink); text-decoration:none; font-size:9.5pt; }
.link-label{ text-decoration:underline; }
.link-icon svg{ width:13px; height:13px; display:block; }

/* Dos columnas: table = paginado fiable en impresión */
.columns{ display:table; width:100%; border-collapse:separate; border-spacing:0; table-layout:fixed; }
.col{ display:table-cell; vertical-align:top; }
.col-main{ width:80%; padding-right:22px; }
.col-side{ width:20%; }

/* El bloque de columnas es indivisible: si cae a caballo del salto de página, el
   navegador lo empuja entero y puede desbordar a una tercera hoja. Se fuerza el corte
   antes: hoja 1 = cabecera + experiencia a ancho completo, hoja 2 = las dos columnas.
   Solo afecta a impresión/PDF; en pantalla el documento sigue siendo continuo. */

/* Títulos de sección */
.section-title{ text-align:center; text-transform:uppercase; letter-spacing:2px;
  font-size:10.5pt; font-weight:700; margin:13px 0 9px; padding-bottom:5px;
  border-bottom:1.4px solid var(--rule); }
.block{ margin-bottom:2px; }
.block:first-child .section-title{ margin-top:0; }
.full-width{ margin-top:16px; margin-bottom:16px; }
.full-width .block:first-child .section-title{ margin-top:18px; }

/* Entradas */
.entry{ margin-bottom:9px; break-inside:avoid; }
.entry-top{ display:flex; justify-content:space-between; gap:12px; align-items:baseline; }
.entry-left{ color:var(--muted); font-size:9pt; }
.org{ color:var(--muted); }
.proj-name{ color:var(--ink); }
a.proj-name, a.proj-name:link, a.proj-name:visited{ color:var(--ink); text-decoration:underline; }
.entry-date{ color:var(--muted); font-size:8.6pt; white-space:nowrap; }
.role{ font-weight:700; margin:1px 0 3px; }
ul.bullets{ margin:2px 0 0; padding-left:16px; }
ul.bullets li{ margin-bottom:1px; }

/* Lateral */
.side-block .section-title{ margin-top:14px; }
.side-block:first-child .section-title{ margin-top:0; }
.side-text{ margin:2px 0 0; color:var(--muted); }

/* Acciones (selector de idioma + descarga): solo en pantalla, ocultas al imprimir/exportar PDF */
.top-actions{ display:none; }

/* Impresión / PDF: el bloque de dos columnas es una tabla de una sola fila y Chrome la
   fragmenta mal si cae a caballo del salto de página (deja una tira huérfana y se va a
   una tercera hoja). Se le prohíbe partirse y se añade separación para que arranque ya
   en la hoja 2: hoja 1 = cabecera + experiencia; hoja 2 = las dos columnas.
   Debe ir al final del CSS para ganar a las reglas base. */
@media print{
  .columns{ break-inside:auto; }
  .columns .block{ break-inside:avoid; }
}

/* Pantalla (web): fondo gris y hoja tipo papel */
@media screen{
  body{ background:#e9e9ea; padding:24px 12px; }
  .sheet{ background:#fff; padding:16mm 15mm; box-shadow:0 4px 24px rgba(0,0,0,.14);
    border-radius:2px; }
  .top-actions{ display:flex; align-items:center; gap:10px; position:fixed; top:18px; right:18px; z-index:10; }
  .lang-switch{ display:flex; background:#fff; border:1px solid #ccc; border-radius:6px;
    overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.12); }
  .lang-switch .lang{ padding:8px 11px; font-size:13px; font-weight:600; text-decoration:none; color:#2b2b2b; }
  .lang-switch a.lang:hover{ background:#f0f0f0; }
  .lang-switch .cur{ background:#2b2b2b; color:#fff; }
  .download-btn{ display:inline-block; background:#2b2b2b; color:#fff; text-decoration:none;
    font-size:13px; font-weight:600; padding:9px 15px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,.22); }
  .download-btn:hover{ background:#000; }
}
`;

function renderHTML(data) {
  // Secciones marcadas layout:"full" van a ancho completo, antes de las columnas.
  const fullSections = data.main.filter((s) => s.layout === 'full');
  const colSections = data.main.filter((s) => s.layout !== 'full');
  const full = fullSections.map(renderMainSection).join('');
  const main = colSections.map(renderMainSection).join('');
  const side = data.side.map(renderSideSection).join('');
  const fullBlock = full ? `<div class="full-width">${full}</div>` : '';
  const pdfName = (data.meta && data.meta.pdfFileName) || 'CV';
  const lang = (data.meta && data.meta.language) || 'en';
  const current = (data.meta && data.meta.htmlFile) || 'index.html';
  const dlLabel = lang === 'es' ? '↓ Descargar PDF' : '↓ Download PDF';
  const langSwitch =
    data.languages && data.languages.length
      ? `<div class="lang-switch">${data.languages
          .map((l) =>
            l.href === current
              ? `<span class="lang cur">${esc(l.label)}</span>`
              : `<a class="lang" href="${esc(l.href)}">${esc(l.label)}</a>`
          )
          .join('')}</div>`
      : '';
  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(data.header.name)} — CV</title>
<style>${CSS}</style>
</head>
<body>
<div class="top-actions">${langSwitch}<a class="download-btn" href="dist/${esc(pdfName)}.pdf" download>${dlLabel}</a></div>
<div class="sheet">
  ${renderHeader(data.header)}
  ${fullBlock}
  <div class="columns">
    <div class="col col-main">${main}</div>
    <div class="col col-side">${side}</div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { renderHTML };
