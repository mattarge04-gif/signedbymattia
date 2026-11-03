// Kapitel II, Tarot-Karte II „Das Rad“ (Entscheid Mattia 03.11.2026: „Rohrpost liefert“).
// Inhalt steht in einer Bahn (.rad-bahn, 230vh) still. Ein Rohr im Stil des Plans kommt von rechts ins Papier und endet über der Karte. Am Scroll (vor- und rückwärts):
//   0.00–0.40 goldene Büchse fährt durchs Rohr · 0.40–0.56 fällt heraus und landet · 0.56–0.64 Deckel springt
//   0.60–0.90 Karte wächst aus der Büchse und landet leicht gekippt · ab 0.90 Hover hebt, Klick dreht
// Rückseite wie im Atelier (An/Aus), dazu ein Rad: jeder Klick dreht eine Speiche weiter, Preis rollt mit.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const lieferung = document.getElementById('radLieferung');
const bahn = document.getElementById('radBahn');
const svg = document.getElementById('radRohr');
const karte = document.getElementById('radKarte');

const F = { gold: '#E3C58A', goldDunkel: '#B9965C', papier: '#FCF6EE', schatten: '#E6D3B1' };
const klemme = (v) => Math.min(1, Math.max(0, v));
const teil = (v, a, b) => klemme((v - a) / (b - a));
const sanft = (t) => t * t * (3 - 2 * t);
const aus = (t) => 1 - (1 - t) ** 3;
const feder = (t) => { const c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; }; // wie --ease-pointe
function el(tag, attr, eltern) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  eltern.append(e);
  return e;
}

// ---------- Rohr: drei flache Striche wie im Plan (Kante, Messing, Glaskanal), Massstab 1.6 ----------
const MUND = { x: 190, y: 70 };
const WEG = `M760 -60 H230 Q${MUND.x} -60 ${MUND.x} -20 V${MUND.y}`;
const rohr = el('g', {}, svg);
[[F.goldDunkel, 21], [F.gold, 16], [F.papier, 4]].forEach(([farbe, breite]) =>
  el('path', { d: WEG, class: 'rad-strich', stroke: farbe, 'stroke-width': breite }, rohr));
const weg = rohr.lastChild;
const LAENGE = weg.getTotalLength();
// Muffe und Mündung (flacher Kragen), Schatten einfarbig wie im Plan
el('rect', { x: MUND.x - 14, y: 22, width: 28, height: 9, rx: 2, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1.4 }, rohr);
el('path', { d: `M${MUND.x - 12} ${MUND.y - 8} H${MUND.x + 12} L${MUND.x + 17} ${MUND.y + 6} H${MUND.x - 17} Z`, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, rohr);
el('rect', { x: MUND.x - 15, y: MUND.y + 3, width: 30, height: 3, fill: F.goldDunkel }, rohr);
rohr.style.filter = `drop-shadow(0 4px 0 ${F.schatten})`;

// ---------- Büchse (Ergebnis = gold), Deckel als eigenes Teil ----------
const B = 44, H = 23;
const buechse = el('g', {}, svg);
const koerper = el('g', {}, buechse);
el('rect', { x: -B / 2, y: -H / 2, width: B * 0.74, height: H, rx: H / 2, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1.4 }, koerper);
el('rect', { x: B * 0.14, y: -H / 2, width: B * 0.1, height: H, fill: F.goldDunkel }, koerper);
const deckel = el('g', {}, buechse);
el('path', { d: `M${B * 0.24} ${-H / 2} H${B / 2 - H / 2} A${H / 2} ${H / 2} 0 0 1 ${B / 2 - H / 2} ${H / 2} H${B * 0.24} Z`, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1.4 }, deckel);
buechse.style.filter = `drop-shadow(0 3px 0 ${F.schatten})`;

// Ruheplatz unter der Karte (Karte: left 25, top 130, 250 × 416.7 → Mitte 150/338)
const RUHE = { x: 222, y: 566 };
const KARTE_MITTE = { x: 150, y: 338 };
const OEFFNUNG = { x: RUHE.x + B * 0.3, y: RUHE.y };

function zeichne(p) {
  // 1 · Fahrt durchs Rohr, Lage folgt der Richtung des Rohrs
  let x, y, dreh;
  const fahrt = teil(p, 0, 0.4);
  if (p < 0.4) {
    const s = sanft(fahrt) * LAENGE, a = weg.getPointAtLength(s), b = weg.getPointAtLength(Math.min(LAENGE, s + 1));
    x = a.x; y = a.y; dreh = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 180;
    if (s >= LAENGE - 1) dreh = 270;
  } else {
    // 2 · Fall mit Schwerkraft, kippt in die Waagrechte, kleiner Hüpfer beim Aufprall
    const f = teil(p, 0.4, 0.52), h = teil(p, 0.52, 0.56);
    x = MUND.x + (RUHE.x - MUND.x) * f;
    y = MUND.y + (RUHE.y - MUND.y) * f * f - Math.sin(Math.PI * h) * 12;
    dreh = 270 + 90 * aus(f) + Math.sin(Math.PI * h) * 6;
  }
  buechse.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${dreh.toFixed(1)})`);
  // 3 · Deckel springt im Bogen ab und bleibt daneben liegen
  const d = teil(p, 0.56, 0.64);
  deckel.setAttribute('transform', d > 0 ? `translate(${(30 * aus(d)).toFixed(1)} ${(-34 * Math.sin(Math.PI * d) + 4 * d).toFixed(1)}) rotate(${(150 * aus(d)).toFixed(1)} ${B * 0.36} 0)` : '');
  // 4 · Karte wächst aus der offenen Büchse, federt und landet um -3°
  const k = teil(p, 0.6, 0.9), w = aus(k), fe = feder(k);
  const dx = (OEFFNUNG.x - KARTE_MITTE.x) * (1 - w), dy = (OEFFNUNG.y - KARTE_MITTE.y) * (1 - w);
  const massstab = 0.08 + 0.92 * fe, winkel = -70 + 67 * fe;
  karte.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${winkel.toFixed(2)}deg) scale(${massstab.toFixed(4)})`;
  karte.style.opacity = Math.min(1, k * 8).toFixed(2);
  karte.style.visibility = k > 0 ? 'visible' : 'hidden';
  const da = p >= 0.9;
  if (karte.classList.contains('gelandet') !== da) {
    karte.classList.toggle('gelandet', da);
    if (!da) dreheZu();
  }
}

function fortschritt() {
  // Bahn steht still (sticky); Beginn, wenn der Inhalt zu gut zwei Dritteln im Bild ist
  const r = bahn.getBoundingClientRect(), vor = 0.3 * innerHeight;
  return klemme((vor - r.top) / (r.height - innerHeight + vor));
}

// ---------- Umdrehen (wie im Atelier) ----------
const vorne = karte.querySelector('.rad-vorne'), hinten = karte.querySelector('.rad-hinten');
function drehe(auf) {
  karte.classList.toggle('umgedreht', auf);
  vorne.inert = auf; hinten.inert = !auf;
  (auf ? karte.querySelector('.rad-legen') : vorne).focus({ preventScroll: true });
}
function dreheZu() { karte.classList.remove('umgedreht'); vorne.inert = false; hinten.inert = true; }
vorne.addEventListener('click', () => drehe(true));
karte.querySelector('.rad-zurueck').addEventListener('click', () => drehe(false));
karte.addEventListener('keydown', (e) => { if (e.key === 'Escape' && karte.classList.contains('umgedreht')) drehe(false); });

// ---------- Rad: 8 Speichen, jeder Schritt eine Speiche weiter; 1–5 Abläufe ----------
const dreh = karte.querySelector('.rad-dreh');
el('circle', { r: 25, fill: 'none', stroke: F.goldDunkel, 'stroke-width': 3.2 }, dreh);
el('circle', { r: 20.5, fill: 'none', stroke: F.gold, 'stroke-width': 1.2 }, dreh);
for (let i = 0; i < 8; i++) {
  const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a);
  el('line', { x1: c * 5, y1: s * 5, x2: c * 21, y2: s * 21, stroke: F.goldDunkel, 'stroke-width': 2, 'stroke-linecap': 'round' }, dreh);
  el('circle', { cx: c * 28.5, cy: s * 28.5, r: 2.6, fill: i === 6 ? '#FF9DC8' : F.gold, stroke: F.goldDunkel, 'stroke-width': 1 }, dreh);
}
el('circle', { r: 6, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1.6 }, dreh);
const ausgabe = karte.querySelector('.rad-anzahl output'), preisEl = karte.querySelector('.rad-anzahl strong');
const legen = karte.querySelector('.rad-legen');
const pfeile = [...karte.querySelectorAll('.rad-pfeil')];
const chf = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const preis = (n) => 500 + 400 * (n - 1);
let anzahl = 1, gezeigt = preis(1), rollt = 0;
function rolle(ziel) {
  cancelAnimationFrame(rollt);
  const von = gezeigt, start = performance.now(), dauer = RUHIG ? 1 : 450;
  const schritt = (t) => {
    const f = aus(klemme((t - start) / dauer));
    gezeigt = Math.round((von + (ziel - von) * f) / 10) * 10;
    preisEl.textContent = `CHF ${chf(gezeigt)}`;
    if (f < 1) rollt = requestAnimationFrame(schritt);
  };
  rollt = requestAnimationFrame(schritt);
}
function setze(n) {
  anzahl = Math.min(5, Math.max(1, n));
  dreh.style.transform = `rotate(${(anzahl - 1) * 45}deg)`;
  ausgabe.textContent = anzahl === 1 ? '1 Ablauf' : `${anzahl} Abläufe`;
  pfeile[0].disabled = anzahl === 1; pfeile[1].disabled = anzahl === 5;
  legen.href = `../atelier-prototyp.html?mit=rad${anzahl > 1 ? `&ablaeufe=${anzahl}` : ''}`;
  rolle(preis(anzahl));
}
pfeile.forEach((b) => b.addEventListener('click', () => setze(anzahl + Number(b.dataset.schritt))));
setze(1);

// ---------- Lauf: nur solange das Panel in der Nähe ist ----------
let zuletzt = -1, laeuft = false, nah = false;
function tick() {
  const p = RUHIG ? 1 : fortschritt();
  if (Math.abs(p - zuletzt) > 0.0005) { zeichne(p); zuletzt = p; }
  if (nah) requestAnimationFrame(tick); else laeuft = false;
}
new IntersectionObserver(([e]) => {
  nah = e.isIntersecting;
  if (nah && !laeuft) { laeuft = true; requestAnimationFrame(tick); }
}, { rootMargin: '30% 0px' }).observe(bahn);
zeichne(RUHIG ? 1 : 0);
