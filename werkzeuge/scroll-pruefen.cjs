// Prüft eine Scroll-Szene wie ein Mensch: Mausrad in Stössen durch einen Abschnitt, Bildschirm-Video
// (jedes 3. Bild als JPG). Aufruf:
//   node werkzeuge/scroll-pruefen.cjs <url> <bahn-selektor> <von 0–1> <bis 0–1> <ausgabeordner>
// Beispiel: node werkzeuge/scroll-pruefen.cjs http://localhost:8766/marke/entwuerfe/hero/index.html "#k2Bahn" 0.1 0.4 /tmp/k2
// (Server ab Repo-Wurzel: python -m http.server 8766). Meist über werkzeuge/pruefen.sh aufgerufen.
const { chromium } = require('playwright');
const fs = require('fs');

const [URL, BAHN, VON = '0', BIS = '1', OUT] = process.argv.slice(2);
if (!URL || !BAHN || !OUT) { console.error('Aufruf: node scroll-pruefen.cjs <url> <bahn-selektor> <von> <bis> <ausgabeordner>'); process.exit(1); }

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
  await p.goto(URL, { waitUntil: 'networkidle' });
  const r = await p.evaluate((sel) => { const e = document.querySelector(sel).getBoundingClientRect(); return { top: e.top + scrollY, h: e.height }; }, BAHN);
  const y = (s) => r.top + s * (r.h - 900);
  await p.evaluate((v) => (window.lenis ? window.lenis.scrollTo(v, { immediate: true }) : scrollTo(0, v)), y(+VON));
  await p.waitForTimeout(2500);

  const cdp = await p.context().newCDPSession(p);
  let n = 0;
  cdp.on('Page.screencastFrame', (f) => {
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
    if (n % 3 === 0) fs.writeFileSync(`${OUT}/f${String(n).padStart(4, '0')}.jpg`, Buffer.from(f.data, 'base64'));
    n++;
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 75, maxWidth: 1440, maxHeight: 900 });
  await p.mouse.move(700, 450);
  const t0 = Date.now();
  // wie ein Mensch: Mausrad in Stössen (rund 900 px/s)
  while (await p.evaluate(() => scrollY) < y(+BIS)) { await p.mouse.wheel(0, 100); await p.waitForTimeout(110); }
  await p.waitForTimeout(2000);
  await cdp.send('Page.stopScreencast');
  console.log(`Bilder ${n}, Dauer ${(Date.now() - t0) / 1000} s, Fehler: ${fehler.join(' | ') || 'keine'}`);
  await b.close();
})();
