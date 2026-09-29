// Prüft den Bühnen-Prototyp: Screenshots an festen Scroll-Positionen, Konsolenfehler, 2D-Variante.
// Voraussetzung: lokaler Server im Repo-Wurzelordner, z. B. `python3 -m http.server 8123`.
// Aufruf (aus werkzeuge/, dort ist Playwright installiert):
//   node ../marke/entwuerfe/buehne/pruefung/pruefen.cjs [http://localhost:8123/marke/entwuerfe/buehne/]
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs'); const path = require('path');
const url = process.argv[2] || 'http://localhost:8123/marke/entwuerfe/buehne/';
const out = __dirname;

// Positionen als Anteil der gesamten Scroll-Höhe (0 = oben, 1 = ganz unten).
// Der Übergang liegt je nach Viewport etwas anders; `uebergang` wird darum aus dem DOM berechnet.
const DESKTOP = [
  ['1-hero', { anteil: 0 }],
  ['2-akt1-flug', { abschnitt: 'akt-1', p: 0.55 }],
  ['3-oelfarbe-mitte', { uebergang: 0.5 }],
  ['4-akt2-galerie', { abschnitt: 'akt-2', p: 0.45 }],
  ['5-kapitel-panels', { element: 'kapitel-2' }],
];
const MOBIL = [
  ['m1-hero', { anteil: 0 }],
  ['m2-oelfarbe-mitte', { uebergang: 0.5 }],
];

async function scrollZiel(page, ziel) {
  return page.evaluate((z) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const top = (id) => document.getElementById(id).getBoundingClientRect().top + scrollY;
    if ('anteil' in z) return z.anteil * max;
    if ('abschnitt' in z) { const el = document.getElementById(z.abschnitt); return top(z.abschnitt) + z.p * (el.offsetHeight - innerHeight); }
    if ('element' in z) return top(z.element) - innerHeight * 0.15;
    if ('uebergang' in z) {
      // Umkehrung von fortschrittUebergang() in buehne.js
      const el = document.getElementById('uebergang');
      return top('uebergang') - innerHeight + z.uebergang * (el.offsetHeight + innerHeight * 0.2);
    }
  }, ziel);
}

async function lauf(browser, name, viewport, positionen, opt = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: opt.reducedMotion || 'no-preference' });
  const page = await ctx.newPage();
  const fehler = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fehler.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => fehler.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => fehler.push(`requestfailed: ${r.url()}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const modus = await page.evaluate(() => (window.__buehne && window.__buehne.modus) || 'unbekannt');
  for (const [datei, ziel] of positionen) {
    const y = await scrollZiel(page, ziel);
    await page.evaluate((y) => {
      const l = window.__buehne && window.__buehne.lenis;
      if (l) l.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
    }, y);
    await page.waitForTimeout(6000); // Kamera weich nachziehen lassen (SwiftShader rendert langsam)
    const info = await page.evaluate(() => {
      const s = window.__buehne && window.__buehne.stand;
      return s && s.himmel ? { mix: +s.mix.toFixed(3), kameraZ: +s.himmel.z.toFixed(2), galerieX: +s.galerie.x.toFixed(2) } : {};
    });
    await page.screenshot({ path: path.join(out, `${datei}.jpg`), type: 'jpeg', quality: 78, timeout: 120000 });
    console.log(name, datei, 'scrollY', Math.round(y), JSON.stringify(info));
  }
  await ctx.close();
  return { name, modus, fehler };
}

(async () => {
  const browser = await chromium.launch({
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const ergebnisse = [
    await lauf(browser, 'desktop', { width: 1440, height: 900 }, DESKTOP),
    await lauf(browser, 'mobil', { width: 390, height: 844 }, MOBIL),
    await lauf(browser, 'ruhig', { width: 1440, height: 900 }, [['r1-fallback-hero', { anteil: 0 }], ['r2-fallback-galerie', { abschnitt: 'akt-2', p: 0.2 }]], { reducedMotion: 'reduce' }),
  ];
  // Ohne JavaScript: aller Text lesbar?
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  const text = await p.evaluate(() => document.body.innerText.length);
  await p.screenshot({ path: path.join(out, 'n1-ohne-js.jpg'), type: 'jpeg', quality: 78, fullPage: false });
  await ctx.close();
  await browser.close();

  const protokoll = [
    `Prüfung ${new Date().toISOString()} · ${url}`,
    ...ergebnisse.map((e) => `${e.name}: Modus ${e.modus}, Konsolenfehler/Warnungen: ${e.fehler.length ? '\n  ' + e.fehler.join('\n  ') : 'keine'}`),
    `ohne-js: ${text} Zeichen Text im HTML sichtbar`,
  ].join('\n');
  fs.writeFileSync(path.join(out, 'protokoll.txt'), protokoll + '\n');
  console.log(protokoll);
})();
