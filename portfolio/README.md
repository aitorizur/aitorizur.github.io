# Portfolio (web estática)

Portfolio de Aitor Izurrategui como web estática. Réplica mejorada del antiguo
portfolio de Canva. Se publica en GitHub Pages dentro del sitio de usuario:
**https://aitorizur.github.io/portfolio/**

## Arquitectura (contenido / diseño separados)

```
portfolio/
  data/portfolio.json   → CONTENIDO (fuente de verdad): secciones, tarjetas y fichas
  src/template.js        → DISEÑO: renderHub() (index) y renderGame() (fichas)
  build.js               → genera index.html + games/<slug>.html (+ preview.png)
  serve.js               → dev server con recarga automática
  assets/                → imágenes (thumbs del hub + galerías por juego)
```

Para cambiar el contenido se edita `data/portfolio.json`; el diseño no se toca.
Añadir una ficha de proyecto = añadir una entrada en `games` del JSON (la clave es
el `slug`) y su `href` en la tarjeta correspondiente de `sections`.

## Comandos (desde `portfolio/`)

```bash
node build.js    # genera el hub y todas las fichas
node serve.js    # dev server en http://localhost:5174 (recarga sola)
```

`build.js` reutiliza el `puppeteer-core` de `cv-web/` (Edge instalado) solo para la
`preview.png`; las páginas HTML se generan sin necesidad de navegador.

## Detalles

- **Diseño**: tema oscuro + acento dorado (estilo Canva/itch.io) con los títulos de
  sección centrados con línea del CV. Rejilla responsive, hover con zoom en capturas.
- **Rutas**: el template usa `base=""` en el hub y `base="../"` en las fichas
  (`games/`), así funciona igual en local y en GitHub Pages.
- **Multi-idioma**: por ahora solo EN (como el original). El esquema permite añadir
  variantes en el futuro.
- Las capturas provienen del portfolio original; el gameplay real (GIF/vídeo) puede
  añadirse más adelante o embeberse desde itch.io.
