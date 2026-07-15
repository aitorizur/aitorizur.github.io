// template.js — convierte data/portfolio.json en las páginas del portfolio.
// Dos tipos de página: renderHub() (index.html) y renderGame() (games/<slug>.html).
// Diseño "mezcla": tema oscuro + acento dorado (Canva/itch.io) con los títulos de
// sección centrados con línea del CV. base = "" en el hub, "../" en las fichas.

const SITE_ROOT = 'https://aitorizur.github.io/portfolio/';
const DEFAULT_DESCRIPTION =
  'Aitor Izurrategui — game developer (gameplay & game design). Portfolio of games, prototypes and 3D art.';

const ICONS = {
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.478 5.92.43.372.814 1.102.814 2.222 0 1.606-.014 2.9-.014 3.294 0 .32.216.694.825.576C20.565 22.296 24 17.798 24 12.5 24 5.87 18.627.5 12 .5z"/></svg>',
  itch:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.13 1.34C2.09 1.96.05 4.29 0 4.9v1.03c0 1.3 1.21 2.44 2.31 2.44 1.32 0 2.42-1.1 2.42-2.4 0 1.3 1.06 2.4 2.38 2.4s2.34-1.1 2.34-2.4c0 1.3 1.12 2.4 2.44 2.4h.03c1.32 0 2.44-1.1 2.44-2.4 0 1.3 1.02 2.4 2.34 2.4s2.38-1.1 2.38-2.4c0 1.3 1.1 2.4 2.42 2.4 1.1 0 2.31-1.14 2.31-2.44V4.9c-.05-.61-2.09-2.94-3.13-3.56C19.6 1.24 16.5 1.2 12 1.2s-7.6.04-8.87.14zM8.1 8.83c-.44.67-1.2 1.13-2.06 1.16h-.03c-.86-.03-1.62-.49-2.06-1.16-.44.67-1.2 1.13-2.06 1.16-.08 0-.16 0-.24-.01-.19 2.4-.34 5.3-.35 8.28 0 .05.34 2.68 2.38 2.83 2.2.16 4.66.24 7.28.24s5.08-.08 7.28-.24c2.04-.15 2.38-2.78 2.38-2.83-.01-2.98-.16-5.88-.35-8.28-.08.01-.16.01-.24.01-.86-.03-1.62-.49-2.06-1.16-.44.67-1.2 1.13-2.06 1.16h-.03c-.86-.03-1.62-.49-2.06-1.16-.44.67-1.2 1.13-2.06 1.16h-.06c-.86-.03-1.62-.49-2.06-1.16-.44.67-1.2 1.13-2.06 1.16h-.03zm3.9 1.4c.78 0 2.37 0 3.2.9.24.85.72 4.02.72 4.02s.35 1.62-.44 1.62c-.79 0-1.24-.85-1.24-.85l-.79-1.35s-.24.85-.79.85h-1.3c-.55 0-.79-.85-.79-.85l-.79 1.35s-.44.85-1.24.85c-.79 0-.44-1.62-.44-1.62s.48-3.17.72-4.02c.83-.9 2.42-.9 3.2-.9z"/></svg>'
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isExternal(href) {
  return /^https?:\/\//.test(href || '');
}

function renderTopbar(h, base, current) {
  const nav = h.nav
    .map((n) => {
      const href = isExternal(n.href) ? n.href : base + n.href;
      const cls = n.label === current ? 'nav-link cur' : 'nav-link';
      return `<a class="${cls}" href="${esc(href)}">${esc(n.label)}</a>`;
    })
    .join('');
  const social = h.links
    .map(
      (l) =>
        `<a class="social" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${esc(l.label)}">${ICONS[l.icon] || ''}</a>`
    )
    .join('');
  const homeHref = base + 'index.html';
  return `<header class="topbar">
    <a class="brand" href="${esc(homeHref)}">${esc(h.name)}</a>
    <nav class="nav">${nav}<span class="social-group">${social}</span></nav>
  </header>`;
}

function renderCard(item, base, compact) {
  const href = item.href ? (isExternal(item.href) ? item.href : base + item.href) : null;
  const ext = href && isExternal(href);
  const media = `<div class="card-media"><img loading="lazy" src="${esc(base + item.thumb)}" alt="${esc(item.title)}"></div>`;
  const role = item.role ? `<div class="card-role">${esc(item.role)}</div>` : '';
  const award = item.award && !compact ? `<div class="card-award">🏆 ${esc(item.award)}</div>` : '';
  const tags =
    item.tags && item.tags.length && !compact
      ? `<div class="card-tags">${item.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`
      : '';
  const desc = item.desc && !compact ? `<p class="card-desc">${esc(item.desc)}</p>` : '';
  const arrow = href ? `<span class="card-arrow">${ext ? '↗' : '→'}</span>` : '';
  const body = `<div class="card-body">
      <h3 class="card-title">${esc(item.title)}${arrow}</h3>
      ${role}${award}${tags}${desc}
    </div>`;
  const inner = media + body;
  if (href) {
    const target = ext ? ' target="_blank" rel="noopener"' : '';
    return `<a class="card${compact ? ' card-compact' : ''} card-link" href="${esc(href)}"${target}>${inner}</a>`;
  }
  return `<div class="card${compact ? ' card-compact' : ''}">${inner}</div>`;
}

function renderSection(section, base) {
  const compact = !!section.compact;
  const cards = section.items.map((i) => renderCard(i, base, compact)).join('');
  const intro = section.intro ? `<p class="section-intro">${esc(section.intro)}</p>` : '';
  const gridCls = compact ? 'grid grid-compact' : 'grid';
  return `<section class="section" id="${esc(section.id)}">
    <h2 class="section-title">${esc(section.title)}</h2>
    ${intro}
    <div class="${gridCls}">${cards}</div>
  </section>`;
}

function renderHub(data) {
  const base = '';
  const h = data.header;
  const sections = data.sections.map((s) => renderSection(s, base)).join('');
  const cta = h.cta ? `<a class="cta-btn" href="${esc(h.cta.url)}" target="_blank" rel="noopener">${esc(h.cta.label)} ↓</a>` : '';
  const intro = `<section class="intro">
    <div class="intro-inner">
      <div class="intro-photo"><img src="${esc(base + h.photo)}" alt="${esc(h.name)}"></div>
      <div class="intro-text">
        <h1 class="greeting">${esc(h.greeting)}</h1>
        <p class="tagline">${esc(h.tagline)}</p>
        ${cta}
      </div>
    </div>
  </section>`;
  return page(data.meta, renderTopbar(h, base, 'SHOWCASE') + intro + `<main class="wrap">${sections}</main>` + footer(h, base), base, {
    path: 'index.html',
    image: h.photo
  });
}

function renderGame(data, slug) {
  const base = '../';
  const h = data.header;
  const g = data.games[slug];
  const tags = (g.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const team = g.team ? `<div class="game-team">${esc(g.team)}</div>` : '';
  const links = (g.links || [])
    .map((l) => `<a class="play-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`)
    .join('');
  const gallery = (g.gallery || [])
    .map((src) => `<a class="shot" href="${esc(base + src)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(base + src)}" alt="${esc(g.title)} screenshot"></a>`)
    .join('');
  const desc = (g.description || []).map((p) => `<p>${esc(p)}</p>`).join('');
  const contribs = (g.contributions || [])
    .map(
      (c) => `<div class="contrib">
        ${c.image ? `<a class="shot" href="${esc(base + c.image)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(base + c.image)}" alt="${esc(c.title)}"></a>` : ''}
        <h4 class="contrib-title">${esc(c.title)}</h4>
        <p class="contrib-text">${esc(c.text)}</p>
      </div>`
    )
    .join('');
  const meta = Object.assign({}, data.meta, { title: `${g.title} — ${data.header.name}` });
  const body = `<main class="wrap game">
    <a class="back" href="${esc(base + 'index.html')}">← Back to showcase</a>
    <div class="game-head">
      <h1 class="game-title">${esc(g.title)}</h1>
      <div class="game-role">${esc(g.role)}</div>
      ${team}
      <div class="tags">${tags}</div>
    </div>
    <div class="gallery">${gallery}</div>
    <div class="game-desc">${desc}${links ? `<div class="play-row">${links}</div>` : ''}</div>
    <h2 class="section-title">CONTRIBUTIONS</h2>
    <div class="contribs">${contribs}</div>
  </main>`;
  return page(meta, renderTopbar(h, base, null) + body + footer(h, base), base, {
    path: `games/${slug}.html`,
    image: (g.gallery && g.gallery[0]) || h.photo,
    description: (g.description && g.description[0]) || undefined
  });
}

function footer(h, base) {
  const social = h.links
    .map(
      (l) =>
        `<a class="social" href="${esc(l.url)}" target="_blank" rel="noopener" aria-label="${esc(l.label)}">${ICONS[l.icon] || ''}</a>`
    )
    .join('');
  return `<footer class="footer">
    <div class="social-group">${social}</div>
    <div class="footer-name">${esc(h.name)}</div>
  </footer>`;
}

const CSS = `
:root{
  --bg:#0d0d0f; --panel:#141416; --ink:#eaeaea; --muted:#9a9a9e;
  --accent:#f5c518; --line:#2a2a2e; --card:#161618;
  --sans:"Segoe UI","Helvetica Neue",Arial,"Noto Sans",sans-serif;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{ font-family:var(--sans); background:var(--bg); color:var(--ink);
  line-height:1.55; -webkit-font-smoothing:antialiased; }
img{ display:block; max-width:100%; }
a{ color:inherit; }

/* Topbar */
.topbar{ position:sticky; top:0; z-index:20; display:flex; align-items:center;
  justify-content:space-between; gap:16px; padding:14px 22px;
  background:#fafafa; color:#141416; border-bottom:1px solid #e3e3e3; }
.brand{ font-weight:800; letter-spacing:1.5px; text-decoration:none; font-size:15px; }
.nav{ display:flex; align-items:center; gap:20px; }
.nav-link{ text-decoration:none; font-weight:700; font-size:12.5px; letter-spacing:1.5px;
  text-transform:uppercase; color:#141416; padding:4px 2px; border-bottom:2px solid transparent; }
.nav-link:hover{ border-bottom-color:var(--accent); }
.nav-link.cur{ border-bottom-color:var(--accent); }
.social-group{ display:flex; gap:12px; align-items:center; }
.social{ color:#141416; opacity:.85; }
.social:hover{ opacity:1; color:var(--accent); }
.social svg{ width:19px; height:19px; }

/* Intro band */
.intro{ background:#fafafa; color:#141416; padding:26px 22px; border-bottom:1px solid #e3e3e3; }
.intro-inner{ max-width:1080px; margin:0 auto; display:flex; gap:22px; align-items:center; }
.intro-photo{ flex:0 0 auto; width:96px; height:96px; border-radius:8px; overflow:hidden; background:#ddd; }
.intro-photo img{ width:100%; height:100%; object-fit:cover; }
.greeting{ margin:0 0 4px; font-size:24px; font-weight:800; }
.tagline{ margin:0; color:#3a3a3a; font-size:15px; max-width:640px; }
.cta-btn{ display:inline-block; margin-top:14px; background:var(--accent); color:#141416;
  font-weight:800; text-decoration:none; padding:9px 18px; border-radius:8px; font-size:13.5px; }
.cta-btn:hover{ background:#ffd53d; }

/* Layout */
.wrap{ max-width:1080px; margin:0 auto; padding:10px 22px 40px; }
.section{ margin-top:34px; }
.section-title{ text-align:center; text-transform:uppercase; letter-spacing:3px;
  font-size:16px; font-weight:800; margin:40px 0 6px; padding-bottom:12px;
  border-bottom:1.5px solid var(--line); }
.section-intro{ text-align:center; color:var(--muted); max-width:680px; margin:0 auto 22px;
  font-size:14.5px; }

/* Card grids */
.grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.grid-compact{ grid-template-columns:repeat(4,1fr); gap:16px; }
.card{ background:var(--card); border:1px solid var(--line); border-radius:10px;
  overflow:hidden; text-decoration:none; display:flex; flex-direction:column;
  transition:transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
.card-link:hover{ transform:translateY(-4px); border-color:var(--accent);
  box-shadow:0 10px 30px rgba(0,0,0,.5); }
.card-media{ aspect-ratio:16/9; overflow:hidden; background:#000; }
.card-media img{ width:100%; height:100%; object-fit:cover;
  transition:transform .35s ease; }
.card-link:hover .card-media img{ transform:scale(1.07); }
.card-body{ padding:12px 14px 16px; }
.card-title{ margin:0; font-size:16px; font-weight:800; color:var(--accent);
  display:flex; align-items:center; gap:6px; }
.card-arrow{ font-size:13px; color:var(--muted); transition:color .18s ease; }
.card-link:hover .card-arrow{ color:var(--accent); }
.card-role{ color:var(--muted); font-size:12.5px; margin-top:2px; }
.card-award{ display:inline-flex; align-items:center; gap:5px; background:rgba(245,197,24,.12);
  color:var(--accent); border:1px solid rgba(245,197,24,.4); border-radius:999px;
  padding:3px 10px; font-size:11px; font-weight:700; margin-top:8px; }
.card-tags{ display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.card-desc{ color:#cfcfd2; font-size:13.5px; margin:8px 0 0; }
.card-compact .card-body{ padding:10px 12px 12px; }
.card-compact .card-title{ font-size:14px; }

/* Game detail */
.game{ padding-top:22px; }
.back{ display:inline-block; color:var(--muted); text-decoration:none; font-size:13.5px;
  margin-bottom:18px; }
.back:hover{ color:var(--accent); }
.game-head{ margin-bottom:22px; }
.game-title{ margin:0; font-size:34px; font-weight:800; color:var(--accent); letter-spacing:.5px; }
.game-role{ font-size:17px; margin-top:4px; }
.game-team{ color:var(--muted); font-size:14px; margin-top:2px; }
.tags{ display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.tag{ font-size:11.5px; letter-spacing:.5px; text-transform:uppercase; color:var(--muted);
  border:1px solid var(--line); border-radius:999px; padding:3px 10px; }
.gallery{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:24px; }
.shot{ display:block; border-radius:8px; overflow:hidden; border:1px solid var(--line); background:#000; }
.shot img{ width:100%; aspect-ratio:16/9; object-fit:cover; transition:transform .35s ease; }
.shot:hover img{ transform:scale(1.05); }
.game-desc{ max-width:760px; font-size:15.5px; color:#dcdcdf; }
.game-desc p{ margin:0 0 12px; }
.play-row{ margin-top:14px; }
.play-link{ display:inline-block; background:var(--accent); color:#141416; font-weight:800;
  text-decoration:none; padding:10px 18px; border-radius:8px; font-size:14px; }
.play-link:hover{ background:#ffd53d; }
.contribs{ display:grid; grid-template-columns:repeat(2,1fr); gap:26px 30px; margin-top:22px; }
.contrib-title{ margin:12px 0 4px; font-size:16px; font-weight:800; }
.contrib-text{ margin:0; color:#cfcfd2; font-size:14px; }

/* Footer */
.footer{ border-top:1px solid var(--line); margin-top:50px; padding:26px 22px;
  display:flex; align-items:center; justify-content:space-between; max-width:1080px;
  margin-left:auto; margin-right:auto; }
.footer .social{ color:var(--muted); }
.footer .social:hover{ color:var(--accent); }
.footer-name{ color:var(--muted); font-size:12px; letter-spacing:1.5px; }

/* Responsive */
@media (max-width:860px){
  .grid{ grid-template-columns:repeat(2,1fr); }
  .grid-compact{ grid-template-columns:repeat(2,1fr); }
  .contribs{ grid-template-columns:1fr; }
}
@media (max-width:560px){
  .grid{ grid-template-columns:1fr; }
  .gallery{ grid-template-columns:1fr; }
  .intro-inner{ flex-direction:column; text-align:center; }
  .nav{ gap:12px; }
  .game-title{ font-size:27px; }
}
`;

function page(meta, inner, base, opts) {
  const lang = (meta && meta.language) || 'en';
  const title = (meta && meta.title) || 'Portfolio';
  const o = opts || {};
  const description = o.description || DEFAULT_DESCRIPTION;
  const pageUrl = SITE_ROOT + (o.path || 'index.html');
  const imageUrl = SITE_ROOT + (o.image || 'assets/photo.jpg');
  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" type="image/jpeg" href="${esc(base + 'assets/photo.jpg')}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(pageUrl)}">
<meta property="og:image" content="${esc(imageUrl)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(imageUrl)}">
<style>${CSS}</style>
</head>
<body>
${inner}
</body>
</html>`;
}

module.exports = { renderHub, renderGame };
