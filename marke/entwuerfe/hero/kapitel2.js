// Kapitel II Automation · Die Wasserspiele.
// Drehbuch: website/drehbuch/12-kapitel-2.md · Werte: website/drehbuch/00-grammatik.md
// Garten gemalt (Gemini) mit lebendem Gras, Kaskade als echtes 3D-Modell (kaskade3d.js),
// „Probier es": eine Anfrage fällt als Kugel durch 5 Becken, rechts das Ablauf-Panel.
import { kaskade3d } from './kaskade3d.js';

const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

const sektion = $('#k2Bahn');
const buehne = $('#k2Buehne');
const garten = $('#k2Garten');
const leben = $('#k2Leben');
const drei = $('#k2Drei');
const faeden = $('#k2Faeden');
const ablauf = $('#k2Ablauf');
const anfrage = $('#k2Karte');
const senden = $('#k2Senden');
const schritte = [...document.querySelectorAll('.k2-schritt')];
const gelehrter = $('#k2Gelehrter');
const wecken = $('#k2Wecken');
const brunnen = $('#k2Brunnen');
const strahl = $('#k2StrahlPfad');
const vorne = $('#k2Vorne');
const text = $('#k2Text');

let s = 0;
let zustand = 'bereit';   // bereit → laeuft → fertig
let kugel = null;         // { von, nach, k } während des Falls
const neigung = { x: 0, y: 0 };
let maus = { x: 0.5, y: 0.5, da: false };
if (MAUS) addEventListener('pointermove', (e) => { maus = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, da: true }; });

let bahnOben = 0;
function fortschritt() {
  const r = sektion.getBoundingClientRect();
  bahnOben = r.top;
  return klemm(-r.top / (r.height - innerHeight));
}

// ---------- 3D-Kaskade ----------
let k3 = null;
try { k3 = kaskade3d(drei); } catch (fehler) { console.warn('Kaskade 3D:', fehler); }
let breite = 0;
let hoehe = 0;
function groesse() {
  breite = buehne.clientWidth;
  hoehe = buehne.clientHeight;
  if (k3) k3.groesse(breite, hoehe);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  leben.width = breite * dpr;
  leben.height = hoehe * dpr;
  leben.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  halmeVerteilen();
}
addEventListener('resize', groesse);

// ---------- Leben im Garten: Gras auf dem Rasen, treibende Blütenblätter ----------
const lctx = leben.getContext('2d');
const BILD = [2400, 1340];               // Garten-Datei (object-fit: cover)
const RASEN = { x: 0.517, y: 0.636, rx: 0.17, ry: 0.078 };   // Rasen-Ellipse im Bild (Anteil)
let halme = [];
const blaetter = Array.from({ length: 22 }, () => ({ x: Math.random(), y: Math.random(), v: 0.4 + Math.random() * 0.8, p: Math.random() * 6.28, r: 3 + Math.random() * 4, f: Math.random() < 0.5 ? '#FFC9B5' : '#F6D3E6' }));
function bildZuSchirm(px, py) {
  const k = Math.max(breite / BILD[0], hoehe / BILD[1]);
  return { x: (breite - BILD[0] * k) / 2 + px * BILD[0] * k, y: (hoehe - BILD[1] * k) / 2 + py * BILD[1] * k, k };
}
function halmeVerteilen() {
  halme = [];
  for (let n = 0; n < 900; n++) {
    const a = Math.random() * 6.283;
    const r = Math.sqrt(Math.random());
    const px = RASEN.x + Math.cos(a) * RASEN.rx * r;
    const py = RASEN.y + Math.sin(a) * RASEN.ry * r;
    const sp = bildZuSchirm(px, py);
    halme.push({ x: sp.x, y: sp.y, h: (5 + Math.random() * 7) * sp.k * 2.2, f: Math.random() < 0.5 ? 'rgba(182,208,170,.85)' : 'rgba(214,232,196,.8)', p: Math.random() * 6.28 });
  }
}
function lebenZeichnen(t) {
  lctx.clearRect(0, 0, breite, hoehe);
  // Gras: Windwelle läuft von links nach rechts
  lctx.lineWidth = 1.3;
  lctx.lineCap = 'round';
  for (const h of halme) {
    const wind = Math.sin(t * 1.6 - h.x * 0.012 + h.p * 0.3) * 0.5 + Math.sin(t * 3.1 + h.p) * 0.15;
    lctx.strokeStyle = h.f;
    lctx.beginPath();
    lctx.moveTo(h.x, h.y);
    lctx.quadraticCurveTo(h.x + wind * h.h * 0.3, h.y - h.h * 0.6, h.x + wind * h.h * 0.8, h.y - h.h);
    lctx.stroke();
  }
  // Blütenblätter treiben schräg durchs Bild
  for (const b of blaetter) {
    b.x += 0.00045 * b.v;
    b.y += 0.00022 * b.v + Math.sin(t + b.p) * 0.0002;
    if (b.x > 1.05 || b.y > 1.05) { b.x = -0.05; b.y = Math.random() * 0.7; }
    lctx.save();
    lctx.translate(b.x * breite, b.y * hoehe);
    lctx.rotate(t * b.v + b.p);
    lctx.scale(1, 0.55 + 0.45 * Math.sin(t * 2 * b.v + b.p));
    lctx.fillStyle = b.f;
    lctx.globalAlpha = 0.85;
    lctx.beginPath();
    lctx.ellipse(0, 0, b.r, b.r * 0.6, 0, 0, 6.283);
    lctx.fill();
    lctx.restore();
  }
  lctx.globalAlpha = 1;
}

// ---------- Fäden vom Panel zu den Becken ----------
const NS = 'http://www.w3.org/2000/svg';
const faedenPfade = schritte.map(() => {
  const p = document.createElementNS(NS, 'path');
  faeden.appendChild(p);
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('r', '3.5');
  faeden.appendChild(c);
  return { p, c };
});
function faedenSetzen(sichtbar) {
  faeden.style.opacity = String(sichtbar);
  if (!k3 || sichtbar <= 0) return;
  const br = buehne.getBoundingClientRect();
  schritte.forEach((li, i) => {
    const a = k3.ankerAufBildschirm(i);
    const r = li.getBoundingClientRect();
    const zx = r.left - br.left - 6;
    const zy = r.top - br.top + 22;
    const mx = (a.x + zx) / 2;
    faedenPfade[i].p.setAttribute('d', `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${zy}, ${zx} ${zy}`);
    faedenPfade[i].c.setAttribute('cx', a.x);
    faedenPfade[i].c.setAttribute('cy', a.y);
    faedenPfade[i].p.classList.toggle('aktiv', li.classList.contains('aktiv') || li.classList.contains('fertig'));
  });
}

// ---------- Hauptschleife ----------
function bild(jetztMs) {
  const t = jetztMs / 1000;
  const ziel = RUHIG ? 0.62 : fortschritt();
  s += (ziel - s) * (RUHIG ? 1 : 0.12);
  if (Math.abs(ziel - s) < 0.0004) s = ziel;
  buehne.classList.toggle('k2-fliegt', s > 0.06 && s < 0.6);

  if (MAUS && !RUHIG) {
    neigung.x += ((maus.da ? (0.5 - maus.x) * 2 : 0) - neigung.x) * 0.05;
    neigung.y += ((maus.da ? (0.5 - maus.y) * 2 : 0) - neigung.y) * 0.05;
  }
  const tief = (px) => `translate(${neigung.x * px}px, ${neigung.y * px * 0.6}px) `;
  const zoom = glatt(klemm((s - 0.1) / 0.24));
  const explo = glatt(klemm((s - 0.34) / 0.16));
  const panel = glatt(klemm((s - 0.4) / 0.08)) * (1 - klemm((s - 0.92) / 0.06));

  // Auftakt: Kapitelwort steigt schneller als der Scroll (M1)
  text.style.transform = `translateY(${(0.8 - 1.6 * klemm(s / 0.2)) * hoehe}px)`;
  text.style.opacity = String(1 - klemm((s - 0.13) / 0.07));

  // Kamera: Garten zoomt mit, Figuren weichen, Vordergrund zieht schneller
  garten.style.transform = tief(8) + `scale(${1.04 + 0.5 * zoom}) translateY(${-4 * zoom}vh)`;
  gelehrter.style.transform = tief(26) + `translateX(${-7 * zoom}vw) scale(${1 - 0.1 * zoom})`;
  brunnen.style.transform = tief(22) + `translateX(${-30 * panel}vw) translateX(${6 * zoom}vw) scale(${1 - 0.1 * zoom})`;
  vorne.style.transform = tief(40) + `translateY(${12 * zoom}vh) scale(${1 + 0.2 * zoom})`;
  ablauf.classList.toggle('da', panel > 0.5);

  // 3D-Kaskade: nach links rücken, wenn das Panel rechts steht
  if (k3) {
    const panelBreite = ablauf.offsetWidth + innerWidth * 0.04;
    // Brunnen dreht sich mit dem Scroll (eine Dreivierteldrehung über das Kapitel), wie der Shopify-Hub
    k3.bild(zoom, explo, t, { x: neigung.x, y: neigung.y }, (panelBreite / 2) * panel, kugel, -0.75 * glatt(klemm((s - 0.08) / 0.84)));
  }
  faedenSetzen(panel);

  if (!RUHIG && s > 0.72 && zustand === 'bereit') starten();
  if (s < 0.38 && zustand === 'fertig') zuruecksetzen();

  if (!RUHIG) lebenZeichnen(t);
  if (!RUHIG) buehne.style.visibility = bahnOben > innerHeight ? 'hidden' : 'visible';
  if (laeuft) requestAnimationFrame(bild);
}

// ---------- „Probier es" ----------
function fallen(von, nach, ms) {
  return new Promise((fertig) => {
    const t0 = performance.now();
    const schritt = (t) => {
      const k = klemm((t - t0) / ms);
      kugel = { von, nach, k };
      if (k < 1) requestAnimationFrame(schritt); else fertig();
    };
    requestAnimationFrame(schritt);
  });
}
function aktiv(i) {
  schritte.forEach((li, n) => li.classList.toggle('aktiv', n === i));
}
function strahlSetzen() {
  const br = buehne.getBoundingClientRect();
  const b = brunnen.getBoundingClientRect();
  const g = gelehrter.getBoundingClientRect();
  const mund = { x: b.left - br.left + b.width * 0.25, y: b.top - br.top + b.height * 0.116 };
  const gesicht = { x: g.left - br.left + g.width * 0.32, y: g.top - br.top + g.height * 0.15 };
  const hoch = Math.min(mund.y, gesicht.y) - br.height * 0.22;
  strahl.setAttribute('d', `M${mund.x} ${mund.y} Q${(mund.x + gesicht.x) / 2} ${hoch} ${gesicht.x} ${gesicht.y}`);
  const len = strahl.getTotalLength();
  strahl.style.transition = 'none';
  strahl.style.strokeDasharray = `${len * 0.35} ${len}`;
  strahl.style.strokeDashoffset = `${len * 0.35}`;
  return len;
}
async function starten() {
  if (zustand !== 'bereit') return;
  zustand = 'laeuft';
  senden.disabled = true;
  if (RUHIG) {
    schritte.forEach((li) => li.classList.add('fertig'));
    zustand = 'fertig';
    return;
  }
  anfrage.classList.add('rollt');
  kugel = { von: 0, nach: 0, k: 0 };
  k3?.plumps(0, performance.now() / 1000);
  aktiv(0);
  await warte(300);
  schritte[0].classList.add('fertig');
  for (let i = 0; i < 4; i++) {
    await warte(i === 0 ? 700 : 850);
    aktiv(i + 1);
    await fallen(i, i + 1, 560);
    k3?.plumps(i + 1, performance.now() / 1000);
    if (i < 3) schritte[i + 1].classList.add('fertig');
  }
  // Pointe: der Scherzbrunnen weckt den Gelehrten, er schaut, nickt, schläft weiter
  await warte(450);
  const len = strahlSetzen();
  strahl.classList.add('spritzt');
  requestAnimationFrame(() => {
    strahl.style.transition = 'stroke-dashoffset .55s cubic-bezier(.4,0,.6,1)';
    strahl.style.strokeDashoffset = `${-len}`;
  });
  await warte(470);
  gelehrter.classList.add('ist-wach');
  await warte(260);
  strahl.classList.remove('spritzt');
  await warte(1500);
  gelehrter.classList.remove('ist-wach');
  schritte[4].classList.add('fertig');
  aktiv(-1);
  kugel = null;
  zustand = 'fertig';
}
function zuruecksetzen() {
  zustand = 'bereit';
  senden.disabled = false;
  anfrage.classList.remove('rollt');
  schritte.forEach((li) => li.classList.remove('fertig', 'aktiv'));
  kugel = null;
}
senden.addEventListener('click', starten);

// Gelehrten stupsen: dreht sich murrend um
wecken.addEventListener('click', () => {
  if (gelehrter.classList.contains('ist-wach')) return;
  gelehrter.classList.add('ist-dreht');
  setTimeout(() => gelehrter.classList.remove('ist-dreht'), RUHIG ? 900 : 1800);
});

// Schleife nur, solange das Kapitel sichtbar ist
let laeuft = false;
groesse();
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: '20% 0px' }).observe(sektion);
