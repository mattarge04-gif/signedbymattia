// Kapitel II Automation · Der Automat im Garten.
// Drehbuch: website/drehbuch/12-kapitel-2.md · Teardown: marke/teardown-shopify-pos-szene.md
// Wie bei Shopify spult der Scroll eine inszenierte Sequenz ab: Anflug (Veo-Video, Bild für Bild),
// dann 5 Stationen. Bei jeder dreht sich der Automat weiter, die Garten-Ebenen gleiten in die Tiefe
// und am Automaten passiert etwas Neues. Das Ablauf-Panel folgt dem Scroll.
import { kaskade3d } from './automat3d.js';

const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);

// Regie: Anteil der Kapitelstrecke je Abschnitt
const ANFLUG = [0.0, 0.14];
const STATIONEN = [[0.14, 0.31], [0.31, 0.48], [0.48, 0.65], [0.65, 0.82], [0.82, 1.0]];

const sektion = $('#k2Bahn');
const buehne = $('#k2Buehne');
const himmel = $('#k2Himmel');
const garten = $('#k2Garten');
const abend = $('#k2Abend');
const pergola = $('#k2Pergola');
const leben = $('#k2Leben');
const drei = $('#k2Drei');
const flug = $('#k2Flug');
const faeden = $('#k2Faeden');
const ablauf = $('#k2Ablauf');
const schritte = [...document.querySelectorAll('.k2-schritt')];
const gelehrter = $('#k2Gelehrter');
const wecken = $('#k2Wecken');
const brunnen = $('#k2Brunnen');
const strahl = $('#k2StrahlPfad');
const vorne = $('#k2Vorne');
const text = $('#k2Text');

let s = 0;
const neigung = { x: 0, y: 0 };
let maus = { x: 0.5, y: 0.5, da: false };
if (MAUS) addEventListener('pointermove', (e) => { maus = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, da: true }; });

let bahnOben = 0;
function fortschritt() {
  const r = sektion.getBoundingClientRect();
  bahnOben = r.top;
  return klemm(-r.top / (r.height - innerHeight));
}
// Fortschritt innerhalb eines Abschnitts
const teil = (x, [a, b]) => klemm((x - a) / (b - a));

// ---------- Anflug: Video Bild für Bild am Scroll ----------
const FLUG_BILDER = 80;
const flugBilder = [];
let flugGeladen = false;
function flugLaden() {
  if (flugGeladen) return;
  flugGeladen = true;
  for (let i = 1; i <= FLUG_BILDER; i++) {
    const im = new Image();
    im.decoding = 'async';
    im.src = `bilder/k2-flug/f${String(i).padStart(3, '0')}.webp`;
    flugBilder.push(im);
  }
}
const fctx = flug.getContext('2d');
let letztesBild = -1;
function flugZeichnen(k) {
  const i = Math.round(k * (FLUG_BILDER - 1));
  if (i === letztesBild) return;
  let im = flugBilder[i];
  for (let n = i; n >= 0 && !(im && im.complete && im.naturalWidth); n--) im = flugBilder[n];
  if (!im || !im.complete || !im.naturalWidth) return;
  letztesBild = i;
  const w = flug.width;
  const h = flug.height;
  const sk = Math.max(w / im.naturalWidth, h / im.naturalHeight);
  fctx.drawImage(im, (w - im.naturalWidth * sk) / 2, (h - im.naturalHeight * sk) / 2, im.naturalWidth * sk, im.naturalHeight * sk);
}

// ---------- 3D-Automat ----------
let k3 = null;
try { k3 = kaskade3d(drei); } catch (fehler) { console.warn('Automat 3D:', fehler); }
let breite = 0;
let hoehe = 0;
function groesse() {
  breite = buehne.clientWidth;
  hoehe = buehne.clientHeight;
  if (k3) k3.groesse(breite, hoehe);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  leben.width = breite * 1.12 * dpr;
  leben.height = hoehe * 1.12 * dpr;
  leben.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  flug.width = Math.round(breite * Math.min(dpr, 1.5));
  flug.height = Math.round(hoehe * Math.min(dpr, 1.5));
  letztesBild = -1;
  halmeVerteilen();
}
addEventListener('resize', groesse);

// ---------- Leben: Gras auf dem Rasen, treibende Blütenblätter ----------
const lctx = leben.getContext('2d');
const BILD = [2400, 1340];
const RASEN = { x: 0.517, y: 0.636, rx: 0.17, ry: 0.078 };
let halme = [];
const blaetter = Array.from({ length: 22 }, () => ({ x: Math.random(), y: Math.random(), v: 0.4 + Math.random() * 0.8, p: Math.random() * 6.28, r: 3 + Math.random() * 4, f: Math.random() < 0.5 ? '#FFC9B5' : '#F6D3E6' }));
function bildZuHuelle(px, py) {
  // Gartenhülle ist 112 % gross (inset −6 %), Bild darin mit cover
  const W = breite * 1.12;
  const H = hoehe * 1.12;
  const k = Math.max(W / BILD[0], H / BILD[1]);
  return { x: (W - BILD[0] * k) / 2 + px * BILD[0] * k, y: (H - BILD[1] * k) / 2 + py * BILD[1] * k, k };
}
function halmeVerteilen() {
  halme = [];
  for (let n = 0; n < 900; n++) {
    const a = Math.random() * 6.283;
    const r = Math.sqrt(Math.random());
    const p = bildZuHuelle(RASEN.x + Math.cos(a) * RASEN.rx * r, RASEN.y + Math.sin(a) * RASEN.ry * r);
    halme.push({ x: p.x, y: p.y, h: (5 + Math.random() * 7) * p.k * 2.2, f: Math.random() < 0.5 ? 'rgba(182,208,170,.85)' : 'rgba(214,232,196,.8)', p: Math.random() * 6.28 });
  }
}
function lebenZeichnen(t) {
  lctx.clearRect(0, 0, breite * 1.2, hoehe * 1.2);
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

// ---------- Faden vom aktiven Schritt zum arbeitenden Teil ----------
const NS = 'http://www.w3.org/2000/svg';
const faden = document.createElementNS(NS, 'path');
const fadenPunkt = document.createElementNS(NS, 'circle');
fadenPunkt.setAttribute('r', '4');
faden.classList.add('aktiv');
faeden.append(faden, fadenPunkt);

// ---------- Pointe in Station 5: Scherzbrunnen weckt den Gelehrten ----------
function strahlSetzen(k) {
  const br = buehne.getBoundingClientRect();
  const b = brunnen.getBoundingClientRect();
  const g = gelehrter.getBoundingClientRect();
  const mund = { x: b.left - br.left + b.width * 0.25, y: b.top - br.top + b.height * 0.116 };
  const gesicht = { x: g.left - br.left + g.width * 0.32, y: g.top - br.top + g.height * 0.15 };
  const hoch = Math.min(mund.y, gesicht.y) - br.height * 0.22;
  strahl.setAttribute('d', `M${mund.x} ${mund.y} Q${(mund.x + gesicht.x) / 2} ${hoch} ${gesicht.x} ${gesicht.y}`);
  const len = strahl.getTotalLength() || 1;
  strahl.style.strokeDasharray = `${len * 0.35} ${len}`;
  strahl.style.strokeDashoffset = `${len * 0.35 - k * len * 1.35}`;
  strahl.classList.toggle('spritzt', k > 0.02 && k < 0.98);
}

// ---------- Hauptschleife ----------
let letzteStation = -2;
function bild(jetztMs) {
  const t = jetztMs / 1000;
  const ziel = RUHIG ? 0.9 : fortschritt();
  s += (ziel - s) * (RUHIG ? 1 : 0.14);
  if (Math.abs(ziel - s) < 0.0004) s = ziel;
  buehne.classList.toggle('k2-fliegt', s > 0.02 && s < 0.98);

  if (MAUS && !RUHIG) {
    neigung.x += ((maus.da ? (0.5 - maus.x) * 2 : 0) - neigung.x) * 0.05;
    neigung.y += ((maus.da ? (0.5 - maus.y) * 2 : 0) - neigung.y) * 0.05;
  }

  // Anflug: Video spult mit, blendet am Ende in die Bühne über
  const af = teil(s, ANFLUG);
  if (!RUHIG) flugZeichnen(af);
  flug.style.opacity = String(RUHIG ? 0 : 1 - glatt(klemm((af - 0.82) / 0.18)));
  text.style.transform = `translateY(${(0.65 - 1.4 * klemm(af / 0.7)) * hoehe}px)`;
  text.style.opacity = String(1 - klemm((af - 0.55) / 0.25));

  // Stationen: welche, wie weit
  const st = STATIONEN.map((ab) => teil(s, ab));
  let station = STATIONEN.findIndex(([a, b]) => s >= a && s < b);
  if (s >= 1) station = 4;

  // Drehung des Automaten (eine ganze Umdrehung über alle Stationen) und Schwenk der Welt
  const dreh = -glatt(teil(s, [STATIONEN[0][0], 1]));
  const schwenk = Math.sin(dreh * Math.PI * 2);
  const nah = glatt(st[0]) * (1 - glatt(st[4]) * 0.6);
  const hochSehen = glatt(st[2]) * (1 - glatt(teil(s, [0.6, 0.66])));
  himmel.style.transform = `translate(${schwenk * -2 + neigung.x * 6}px, ${hochSehen * 6}vh) scale(${1.02 + 0.06 * nah})`;
  garten.style.transform = `translate(calc(${schwenk * -4}vw + ${neigung.x * 14}px), ${hochSehen * 14 + neigung.y * 6}px) scale(${1 + 0.14 * nah})`;
  vorne.style.transform = `translate(calc(${schwenk * -9}vw + ${neigung.x * 40}px), ${8 + hochSehen * 22}vh) scale(${1 + 0.08 * nah})`;
  gelehrter.style.transform = `translate(calc(${schwenk * -6}vw + ${-6 * nah}vw), ${hochSehen * 18}vh) scale(${1 - 0.25 * nah})`;
  brunnen.style.transform = `translate(calc(${schwenk * -6}vw + ${6 * nah}vw), ${hochSehen * 18}vh) scale(${1 - 0.1 * nah})`;

  // Licht: Pergola in Station 3, Abend ab Station 4
  pergola.style.opacity = String(hochSehen * 0.92);
  pergola.style.transform = `rotate(${(s - 0.56) * 50}deg) scale(1.12)`;
  const abendlicht = glatt(teil(s, [0.64, 0.74]));
  abend.style.opacity = String(abendlicht);
  leben.style.opacity = String((1 - 0.5 * abendlicht) * (1 - hochSehen));

  // 3D: Explosion ab Station 2, zusammen in Station 5; Panel macht rechts Platz
  const explo = glatt(teil(s, [0.31, 0.42])) * (1 - glatt(teil(s, [0.84, 0.93])));
  const panel = glatt(teil(s, [0.14, 0.2])) * (1 - glatt(teil(s, [0.97, 1.0])));
  ablauf.classList.toggle('da', panel > 0.5);
  if (k3) {
    const pb = ablauf.offsetWidth + innerWidth * 0.04;
    if (station !== letzteStation) { k3.plumps(Math.max(-1, Math.min(station, 3)), t); letzteStation = station; }
    k3.bild(nah, explo, t, { x: neigung.x, y: neigung.y }, (pb / 2) * panel, null, dreh, glatt(teil(s, [0.1, 0.2])));
  }

  // Panel: Schritte folgen den Stationen
  schritte.forEach((li, i) => {
    li.classList.toggle('aktiv', i === station);
    li.classList.toggle('fertig', station > i || (i === station && st[i] > 0.45));
  });
  if (k3 && station >= 0 && panel > 0.5) {
    const a = k3.ankerAufBildschirm(station);
    const br = buehne.getBoundingClientRect();
    const r = schritte[station].getBoundingClientRect();
    const zx = r.left - br.left - 6;
    const zy = r.top - br.top + 22;
    const mx = (a.x + zx) / 2;
    faden.setAttribute('d', `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${zy}, ${zx} ${zy}`);
    fadenPunkt.setAttribute('cx', a.x);
    fadenPunkt.setAttribute('cy', a.y);
    faeden.style.opacity = String(panel);
  } else faeden.style.opacity = '0';

  // Station 5: Wasserstrahl, Gelehrter wacht kurz auf
  const p5 = st[4];
  strahlSetzen(glatt(klemm((p5 - 0.25) / 0.25)));
  gelehrter.classList.toggle('ist-wach', p5 > 0.45 && p5 < 0.85);

  if (!RUHIG) lebenZeichnen(t);
  if (!RUHIG) buehne.style.visibility = bahnOben > innerHeight ? 'hidden' : 'visible';
  if (laeuft) requestAnimationFrame(bild);
}

// Gelehrten stupsen: dreht sich murrend um
wecken.addEventListener('click', () => {
  if (gelehrter.classList.contains('ist-wach')) return;
  gelehrter.classList.add('ist-dreht');
  setTimeout(() => gelehrter.classList.remove('ist-dreht'), RUHIG ? 900 : 1800);
});

let laeuft = false;
groesse();
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; flugLaden(); requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: '60% 0px' }).observe(sektion);
