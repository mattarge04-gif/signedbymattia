// Bildfenster der Tarot-Karte II: Ausschnitt der Schreibstube (Station I), doppelt aufgelöst
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(process.argv[2], { waitUntil: 'networkidle' });
  const y = await p.evaluate(() => { const e = document.querySelector('#k2Bahn').getBoundingClientRect(); return e.top + scrollY + 0.2 * (e.height - innerHeight); });
  await p.evaluate((v) => scrollTo(0, v), y);
  await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelectorAll('.k2-station, .k2-beispiel').forEach((e) => (e.style.visibility = 'hidden')));
  await p.screenshot({ path: process.argv[3], clip: { x: 405, y: 70, width: 470, height: 590 } });
  await b.close();
})();
