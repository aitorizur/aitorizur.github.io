// serve.js — servidor de desarrollo del portfolio con recarga automática.
// Renderiza el hub y las fichas en vivo desde data/portfolio.json + src/template.js.
//
//   node serve.js            -> http://localhost:5174

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 5174;

const DATA = path.join(ROOT, 'data', 'portfolio.json');
const TEMPLATE = path.join(ROOT, 'src', 'template.js');

function load() {
  delete require.cache[require.resolve('./src/template')];
  const tpl = require('./src/template');
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  return { tpl, data };
}

function watchedMtime() {
  let m = 0;
  for (const f of [TEMPLATE, DATA]) {
    try { m = Math.max(m, fs.statSync(f).mtimeMs); } catch (e) { /* ignore */ }
  }
  return Math.round(m);
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.pdf': 'application/pdf'
};

const RELOAD = `<script>
(function(){var last=null;setInterval(function(){
  fetch('/__mtime').then(function(r){return r.text();}).then(function(t){
    if(last===null){last=t;}else if(t!==last){location.reload();}
  }).catch(function(){});
},600);})();
</script>`;

function sendHTML(res, html) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html.replace('</body>', RELOAD + '</body>'));
}

function sendError(res, err) {
  res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<pre style="color:#f66;background:#111;font:14px monospace;padding:20px">' +
    String(err.stack || err).replace(/[<>&]/g, '') + '</pre>' + RELOAD);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/__mtime') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(String(watchedMtime()));
    return;
  }

  if (url === '/' || url === '/index.html') {
    try { sendHTML(res, load().tpl.renderHub(load().data)); }
    catch (err) { sendError(res, err); }
    return;
  }

  const gameMatch = url.match(/^\/games\/([\w-]+)\.html$/);
  if (gameMatch) {
    try {
      const { tpl, data } = load();
      const slug = gameMatch[1];
      if (!data.games[slug]) { res.writeHead(404); res.end('Unknown game: ' + slug); return; }
      sendHTML(res, tpl.renderGame(data, slug));
    } catch (err) { sendError(res, err); }
    return;
  }

  // Archivos estáticos (assets/)
  const filePath = path.join(ROOT, decodeURIComponent(url));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, buf) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log('Portfolio dev server: http://localhost:' + PORT);
  console.log('Edita data/portfolio.json o src/template.js y el navegador se refresca solo.');
});
