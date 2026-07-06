# CV — Aitor Izurrategui

CV como **web estática + PDF**, generado a partir de un único archivo de datos.
Diseño replicado del CV original de Canva.

## Cómo funciona

```
data/cv.json        ← contenido (la "fuente de verdad")
src/template.js     ← diseño (HTML + CSS)
build.js            ← generador
   │
   └─ node build.js ─┬─ index.html                (web, la sirve GitHub Pages)
                     ├─ dist/Aitor-Izurrategui-CV.pdf
                     └─ preview.png                (vista previa para revisar)
```

Cambiar el CV = editar `data/cv.json` y volver a ejecutar `node build.js`.
El diseño no se toca nunca al actualizar el contenido.

## Uso

```bash
npm install        # solo la primera vez (instala puppeteer-core)
node build.js      # genera TODAS las variantes (web + PDF) + vista previa
```

El PDF se imprime con el Microsoft Edge ya instalado (no descarga Chromium).

## Idiomas y variantes

Cada archivo `data/cv*.json` es una variante y `node build.js` las construye todas:

- `data/cv.json`     → `index.html`  + `dist/Aitor-Izurrategui-CV.pdf`    (inglés)
- `data/cv.es.json`  → `cv-es.html`  + `dist/Aitor-Izurrategui-CV-ES.pdf` (español)

La web incluye un selector de idioma (EN/ES). Cada variante define en su `meta`:
`htmlFile` (página de salida) y `pdfFileName` (PDF), y comparte el bloque `languages`.

Para una versión adaptada a una oferta concreta, se crea `data/cv.<variante>.json`
con su propio `meta.htmlFile` y `meta.pdfFileName`, y `node build.js` la genera junto al resto.

## Foto

Colocar la foto en `assets/photo.jpg` (cuadrada, se recorta en círculo).
Sin ella se muestra un marcador con las iniciales.

## Publicar en GitHub Pages

1. Crear el repo en GitHub (recomendado: `aitorizur.github.io` → sirve en la raíz del dominio).
2. `git init && git add . && git commit -m "CV web"` y hacer push.
3. En *Settings → Pages*, elegir la rama `main` y carpeta `/ (root)`.
4. Queda publicado en `https://aitorizur.github.io` y el PDF descargable en
   `https://aitorizur.github.io/dist/Aitor-Izurrategui-CV.pdf`.
