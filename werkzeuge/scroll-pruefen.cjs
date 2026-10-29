// Prüft eine Scroll-Szene wie ein Mensch: Mausrad in Stössen, Bildschirm-Video (jedes 3. Bild) + Messung
// der Lage von Automat, Taube und Brief alle 100 ms. Aufruf: node werkzeuge/scroll-pruefen.cjs <ausgabeordner>
// (Server ab Repo-Wurzel auf Port 8766: python -m http.server 8766)
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2];
(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(e.message));
  await p.goto('http://localhost:8766/marke/entwuerfe/hero/index.html', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => { const e = document.getElementById('k2Bahn').getBoundingClientRect(); return { top: e.top + scrollY, h: e.height }; });
  const y = (s) => r.top + s * (r.h - 900);
  await p.evaluate((v) => window.lenis ? window.lenis.scrollTo(v, { immediate: true }) : scrollTo(0, v), y(0.10));
  await p.waitForTimeout(2500);
  // Messung pro Bild: Lage des Automaten, der Taube, des Briefs
  const log = [];
  const cdp = await p.context().newCDPSession(p);
  let n = 0;
  cdp.on('Page.screencastFrame', async (f) => {
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
    if (n % 3 === 0) fs.writeFileSync(`${OUT}/f${String(n).padStart(4, '0')}.jpg`, Buffer.from(f.data, 'base64'));
    n++;
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: 1440, maxHeight: 900 });
  await p.mouse.move(700, 450);
  // wie ein Mensch: Mausrad in Stössen, bis in Station 2
  const t0 = Date.now();
  const mess = setInterval(async () => {
    try {
      log.push(await p.evaluate(() => {
        const q = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), +getComputedStyle(e).opacity]; };
        return { y: Math.round(scrollY), am: q('.am-rahmen'), taube: q('.am-taube'), brief: q('.am-loserbrief') };
      }));
    } catch {}
  }, 100);
  while (await p.evaluate(() => scrollY) < y(0.40)) { await p.mouse.wheel(0, 100); await p.waitForTimeout(110); }
  await p.waitForTimeout(1500);
  clearInterval(mess);
  await cdp.send('Page.stopScreencast');
  fs.writeFileSync(`${OUT}/log.json`, JSON.stringify(log));
  console.log('Bilder', n, 'Dauer', (Date.now() - t0) / 1000, 's, Fehler:', fehler.join(' | ') || 'keine');
  await b.close();
})();
