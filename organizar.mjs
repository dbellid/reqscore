// Ordena los archivos en las carpetas que Netlify necesita, antes de desplegar.
// Permite que el repositorio tenga los archivos sueltos en la raíz (subida desde la web de GitHub)
// o ya organizados en carpetas: en ambos casos el resultado es el mismo.
import fs from 'node:fs';
import path from 'node:path';

const MAPA = {
  'index.html': 'public/index.html',
  'docx.umd.js': 'public/lib/docx.umd.js',
  'exceljs.min.js': 'public/lib/exceljs.min.js',
  'jspdf.plugin.autotable.min.js': 'public/lib/jspdf.plugin.autotable.min.js',
  'jspdf.umd.min.js': 'public/lib/jspdf.umd.min.js',
  'jszip.min.js': 'public/lib/jszip.min.js',
  'levantamiento.mjs': 'netlify/functions/levantamiento.mjs',
  'ai.mjs': 'netlify/edge-functions/ai.mjs',
  'auth.mjs': 'netlify/shared/auth.mjs'
};

let copiados = 0, faltan = [];
for (const [origen, destino] of Object.entries(MAPA)) {
  if (fs.existsSync(origen)) {
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.copyFileSync(origen, destino);
    copiados++;
  } else if (!fs.existsSync(destino)) {
    faltan.push(origen);
  }
}
// Una función antigua con el mismo enrutamiento /api/* causaría conflicto: se elimina si existe.
if (fs.existsSync('netlify/functions/api.mjs')) { fs.rmSync('netlify/functions/api.mjs'); console.log('Eliminada la función antigua netlify/functions/api.mjs'); }

console.log(`organizar.mjs: ${copiados} archivo(s) ubicados en sus carpetas.`);
if (faltan.length) { console.error('Faltan archivos en el repositorio: ' + faltan.join(', ')); process.exit(1); }
