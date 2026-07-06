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
node build.js      # genera web + PDF + vista previa
```

El PDF se imprime con el Microsoft Edge ya instalado (no descarga Chromium).

## CVs personalizados por oferta

Para una versión adaptada a una oferta concreta, se crea un archivo de datos
alternativo y se genera con su nombre:

```bash
# data/cv.ascendion.json  (copia de cv.json con lo relevante destacado)
node build.js ascendion    # → dist/<nombre>.pdf
```

## Foto

Colocar la foto en `assets/photo.jpg` (cuadrada, se recorta en círculo).
Sin ella se muestra un marcador con las iniciales.

## Publicar en GitHub Pages

1. Crear el repo en GitHub (recomendado: `aitorizur.github.io` → sirve en la raíz del dominio).
2. `git init && git add . && git commit -m "CV web"` y hacer push.
3. En *Settings → Pages*, elegir la rama `main` y carpeta `/ (root)`.
4. Queda publicado en `https://aitorizur.github.io` y el PDF descargable en
   `https://aitorizur.github.io/dist/Aitor-Izurrategui-CV.pdf`.
