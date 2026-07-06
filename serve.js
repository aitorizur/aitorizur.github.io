// serve.js — servidor de desarrollo con recarga automática.
// Renderiza el CV en vivo desde data/cv.json + src/template.js.
// Cada vez que se editan esos archivos, el navegador se refresca solo.
//
//   node serve.js            -> http://localhost:5173

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 5173;

const DATA = path.join(ROOT, 'data', 'cv.json');
const TEMPLATE = path.join(ROOT, 'src', 'template.js');

function render() {
  // Recargar el template en cada render para recoger ediciones sin reiniciar
  delete require.cache[require.resolve('./src/template')];
  const { renderHTML } = require('./src/template');
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  return renderHTML(data);
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

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/__mtime') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(String(watchedMtime()));
    return;
  }

  if (url === '/' || url === '/index.html') {
    try {
      const html = render().replace('</body>', RELOAD + '</body>');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<pre style="color:#b00;font:14px monospace;padding:20px">' +
        String(err.stack || err).replace(/[<>&]/g, '') + '</pre>' + RELOAD);
    }
    return;
  }

  // Archivos estáticos (assets/, dist/, etc.)
  const filePath = path.join(ROOT, decodeURIComponent(url));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, buf) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log('CV dev server en vivo: http://localhost:' + PORT);
  console.log('Edita data/cv.json o src/template.js y el navegador se refresca solo.');
});
