// Screenshots echter Websites als Referenz (nur zum Studieren, nicht veröffentlichen).
// Aufruf: node screenshot.cjs <zielordner> <name>=<url> [<name>=<url> ...]
// Beispiel: node screenshot.cjs ../marke/referenzen basement=https://basement.studio
const { chromium } = require('playwright');
const fs = require('fs');
const [out, ...pairs] = process.argv.slice(2);
if (!out || !pairs.length) { console.error('Aufruf: node screenshot.cjs <zielordner> name=url ...'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] });
  await Promise.all(pairs.map(async (p) => {
    const [name, ...rest] = p.split('='); const url = rest.join('=');
    const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(12000); // WebGL- und Lade-Animationen abwarten
      await page.screenshot({ path: `${out}/ref-${name}.jpg`, type: 'jpeg', quality: 80 });
      console.log('ok', name);
    } catch (e) { console.log('FEHLER', name, e.message.split('\n')[0]); }
    await page.close();
  }));
  await b.close();
})();
