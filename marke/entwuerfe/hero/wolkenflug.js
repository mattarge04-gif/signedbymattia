// Wolkenflug: Übergang Hero → Kapitel I. Die Kamera fliegt durch lebende Wolken.
// Eigene Projektion (nur transform/opacity), Wolken treiben und atmen unabhängig vom Scroll.
// Ablauf: Ende Hero (Kamera nähert sich, Nebel steigt) → Nebel voll beim Wechsel →
// Kapitel I ist festgeheftet, Wolken ziehen auseinander, die Wand erscheint.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);

const PARAMETER = {
  start: 0.7,       // Anteil der Hero-Strecke, ab dem die Wolken kommen
  danach: 0.6,      // so viele Bildschirmhöhen nach dem Hero lösen sich die Wolken auf
  brennweite: 700,  // Perspektive (px)
  weg: 3900,        // Flugstrecke der Kamera in Welt-Einheiten (alle Wolken werden passiert)
};

const hero = document.getElementById('hero');
const flug = document.getElementById('wolkenflug');
const welt = document.getElementById('wfWelt');
const nebel = document.getElementById('wfNebel');

// Wolken in die Tiefe staffeln: links/rechts abwechselnd, leicht zufällig, aber reproduzierbar
let saat = 7;
const zufall = () => ((saat = (saat * 16807) % 2147483647) / 2147483647);
const BILDER = ['wolke4-700', 'wolke5-700', 'wolke1', 'wolke3', 'wolke2', 'wolke4-700', 'wolke5-700'];
const wolken = [];
for (let i = 0; i < 30; i++) {
  const seite = i % 2 ? 1 : -1;
  const el = document.createElement('img');
  el.src = `bilder/${BILDER[i % BILDER.length]}.webp`;
  el.alt = '';
  el.decoding = 'async';
  welt.appendChild(el);
  wolken.push({
    el,
    x: seite * (80 + zufall() * 520) * (i % 5 === 0 ? 0.3 : 1),  // manche mitten im Weg
    y: (zufall() - 0.45) * 520,
    z: 300 + i * 112 + zufall() * 100,
    breite: 520 + zufall() * 520,
    spiegel: zufall() < 0.5 ? -1 : 1,
    phase: zufall() * 6.28,
    tempo: 0.5 + zufall() * 0.7,
  });
}

let stand = 0;   // geglätteter Fortschritt 0–1
let laeuft = false;

function strecke() {
  const R = hero.offsetHeight - innerHeight;
  const anfang = PARAMETER.start * R;
  const ende = R + PARAMETER.danach * innerHeight;
  return { anfang, ende, wechsel: (R - anfang) / (ende - anfang) };
}

function bild(jetzt) {
  const { anfang, ende, wechsel } = strecke();
  const ziel = klemm((scrollY - anfang) / (ende - anfang));
  stand += (ziel - stand) * 0.14;
  if (Math.abs(ziel - stand) < 0.0005) stand = ziel;
  const aktiv = stand > 0.001 && stand < 0.999;
  flug.style.visibility = aktiv ? 'visible' : 'hidden';

  if (aktiv) {
    const W = innerWidth;
    const H = innerHeight;
    const P = PARAMETER.brennweite * Math.max(1, W / 1440);
    const kamera = PARAMETER.weg * stand;
    const t = jetzt / 1000;
    // Nebel: steigt bis zum Wechsel, hält kurz, klärt sich in Kapitel I
    const n = glatt(klemm((stand - wechsel * 0.55) / (wechsel * 0.45))) * (1 - glatt(klemm((stand - wechsel - 0.08) / 0.3)));
    nebel.style.opacity = String(n);
    flug.style.opacity = String(glatt(klemm(stand / 0.12)) * (1 - glatt(klemm((stand - 0.86) / 0.13))));

    for (const w of wolken) {
      const d = w.z - kamera;
      if (d < 60) { w.el.style.opacity = '0'; continue; }
      const k = P / d;
      // lebendig: treiben, schaukeln, atmen
      const dx = Math.sin(t * 0.35 * w.tempo + w.phase) * 60;
      const dy = Math.cos(t * 0.27 * w.tempo + w.phase) * 22;
      const atmen = 1 + Math.sin(t * 0.6 * w.tempo + w.phase) * 0.035;
      const sx = W / 2 + (w.x + dx) * k;
      const sy = H / 2 + (w.y + dy) * k;
      const s = k * atmen * (w.breite / 600);
      const fern = klemm((3000 - d) / 900);           // aus der Ferne einblenden
      const nah = klemm((d - 90) / 260);               // kurz vor der Kamera auflösen
      w.el.style.opacity = String(fern * nah);
      w.el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${s * w.spiegel}, ${s}) rotate(${Math.sin(t * 0.2 + w.phase) * 2}deg)`;
      w.el.style.zIndex = String(Math.round(10000 - d));
    }
  }
  if (laeuft) requestAnimationFrame(bild);
}

if (!RUHIG && flug) {
  // Schleife nur rund um den Übergang
  const beobachter = new IntersectionObserver((eintraege) => {
    const nah = eintraege.some((e) => e.isIntersecting);
    if (nah && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
    else if (!nah) { laeuft = false; flug.style.visibility = 'hidden'; }
  }, { rootMargin: '50% 0px' });
  beobachter.observe(document.getElementById('k1Bahn'));
}
