// Standbilder an Scroll-Stellen: node werkzeuge/standbild.cjs <url> <ausgabeordner> "#bahn:0.5" ["#bahn:0.9" ...]
// Stelle = Anteil der scrollbaren Bahn (0–1). Chrome per executablePath (Playwright-Chromium fehlt lokal).
const { chromium } = require('playwright');
const fs = require('fs');
const [URL, OUT, ...STELLEN] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
  await p.goto(URL, { waitUntil: 'networkidle' });
  for (const st of STELLEN) {
    const [sel, f] = st.split(':');
    const y = await p.evaluate(([sel, f]) => { const e = document.querySelector(sel).getBoundingClientRect(); return e.top + scrollY + +f * (e.height - innerHeight); }, [sel, f]);
    // schrittweise hinscrollen, damit die nachziehenden Werte ankommen
    await p.evaluate((v) => scrollTo(0, v), y);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${OUT}/${sel.replace(/\W/g, '')}-${f}.jpg`, quality: 70 });
  }
  console.log('Fehler:', fehler.join(' | ') || 'keine');
  await b.close();
})();
