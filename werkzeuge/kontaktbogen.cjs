// Legt alle Bilder eines Ordners als Raster in ein PNG, zum schnellen Sichten.
// Aufruf: node kontaktbogen.cjs <bildordner> <ausgabe.png> [spalten]
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [dir, outFile, cols = '4'] = process.argv.slice(2);
if (!dir || !outFile) { console.error('Aufruf: node kontaktbogen.cjs <ordner> <ausgabe.png> [spalten]'); process.exit(1); }
const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
const abs = f => 'file:///' + path.resolve(dir, f).split(path.sep).join('/');
const html = `<body style="margin:0;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;background:#888;font:13px sans-serif">` +
  files.map(f => `<div><img src="${abs(f)}" style="width:100%;display:block"><b>${f}</b></div>`).join('') + '</body>';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
  await p.setContent(html); await p.waitForTimeout(1500);
  await p.screenshot({ path: outFile, fullPage: true }); await b.close();
  console.log(files.length, 'Bilder →', outFile);
})();
