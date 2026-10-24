// Fortschritts-Video des Prototyps: scrollt mit dem Mausrad natürlich durch die Seite und nimmt per
// CDP-Screencast auf (echte Bildzeiten), danach ffmpeg. Aufruf:
//   NODE_PATH=./node_modules node video.cjs <url> <ausgabe.mp4> [hero]   (hero = nur Hero, weich)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const URL = process.argv[2] || 'http://localhost:8130/marke/entwuerfe/hero/';
const AUS = process.argv[3] || 'video.mp4';
const TMP = path.join(path.dirname(AUS), '_frames');

(async () => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const cdp = await p.context().newCDPSession(p);
  const bilder = [];
  cdp.on('Page.screencastFrame', async (f) => {
    bilder.push({ t: f.metadata.timestamp, d: f.data });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1600, maxHeight: 900, everyNthFrame: 1 });

  await p.mouse.move(900, 420);
  await p.waitForTimeout(5500);                     // Hero: Laden, Titel malt sich, Figuren leben
  await p.mouse.move(1150, 300, { steps: 25 });     // Amor zielt, Licht neigt sich
  await p.waitForTimeout(1200);
  await p.mouse.click(1150, 300);                   // Pfeil
  await p.waitForTimeout(1500);
  const nurHero = process.argv[4] === 'hero';
  if (nurHero) {
    // weich mit Lenis durch den Hero bis in die Wolken (ohne Mausrad-Ruckeln)
    const ziel = await p.evaluate(() => { const h = document.getElementById('hero'); return h.offsetHeight - innerHeight + innerHeight * 0.55; });
    await p.mouse.move(1000, 380, { steps: 30 });
    await p.evaluate((ziel) => window.lenis.scrollTo(ziel, { duration: 9, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2) }), ziel);
    await p.waitForTimeout(10500);
  } else {
    const hoehe = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    let y = 0;
    while (y < hoehe - 50) {
      for (let k = 0; k < 5; k++) { await p.mouse.wheel(0, 55); await p.waitForTimeout(30); }
      y = await p.evaluate(() => scrollY);
      await p.waitForTimeout(330);
    }
  }
  await p.waitForTimeout(2500);
  await cdp.send('Page.stopScreencast');
  await b.close();

  // Bilder mit echten Dauern als ffconcat schreiben
  let liste = 'ffconcat version 1.0\n';
  bilder.forEach((f, i) => {
    const datei = `f${String(i).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(TMP, datei), Buffer.from(f.d, 'base64'));
    const dauer = i + 1 < bilder.length ? Math.max(0.01, bilder[i + 1].t - f.t) : 0.5;
    liste += `file ${datei}\nduration ${dauer.toFixed(4)}\n`;
  });
  fs.writeFileSync(path.join(TMP, 'liste.txt'), liste);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(TMP, 'liste.txt'),
    '-vf', 'fps=60,format=yuv420p', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', AUS]);
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('bilder', bilder.length, '→', AUS);
})();
