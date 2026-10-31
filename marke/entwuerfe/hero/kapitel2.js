// Kapitel II Automation · Die Nachtschicht. Drehbuch: website/drehbuch/12-kapitel-2.md
// Baustein 1 (Hero-Methode, 31.10.2026): Bühne aus einzeln gemalten Ebenen (werkzeuge/k2_buehne.py,
// bilder/k2b/k2b.json, Rahmen 4000 × 2233). Wie im Hero: jede Ebene hat ihre Tiefe für die Maus und ihren
// Anteil am Kameraflug; der Vorhang fliegt im Auftakt an der Kamera vorbei. Lebt: Sterne, ziehender Himmel,
// Kerze, Mondstaub, Uhr. Die Handlung (Handy, Putti, Rohrpost) folgt in Baustein 2.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const ausEase = (t) => 1 - (1 - t) ** 3;
const W = 4000;
const H = 2233;

const bahn = $('#k2Bahn');
const welt = $('#k2Welt');
const text = $('#k2Text');
const ebenen = [...document.querySelectorAll('.k2-ebene')].map((el) => ({ el, tiefe: +el.dataset.tiefe, flug: +el.dataset.flug }));
const vorne = $('.k2-vorne');
const sterne = $('#k2Sterne');
const staub = $('#k2Staub');
const uhr = $('#k2Uhr');
const FOKUS = { x: 0.47, y: 0.56 }; // Pult mit dem Handy

// ---------- Teile platzieren ----------
let info = null;
fetch('bilder/k2b/k2b.json').then((r) => r.json()).then((j) => {
  info = j;
  const lege = (el, i) => Object.assign(el.style, { left: `${(i.x / W) * 100}%`, top: `${(i.y / H) * 100}%`, width: `${(i.w / W) * 100}%` });
  document.querySelectorAll('.k2-teil').forEach((el) => lege(el, j[el.dataset.teil]));
  lege($('#k2Himmel'), j.himmel);
  uhrBauen(j.uhr);
  groesse();
});

// ---------- Uhr: Zeiger auf der gemalten Uhr ----------
const NS = 'http://www.w3.org/2000/svg';
let stunde = null;
let minute = null;
let UHR = null;
function uhrBauen(u) {
  UHR = u;
  const linie = (laenge, dicke) => {
    const l = document.createElementNS(NS, 'line');
    Object.entries({ x1: u.x, y1: u.y + laenge * 0.15, x2: u.x, y2: u.y - laenge, stroke: '#3B2E52', 'stroke-width': dicke, 'stroke-linecap': 'round' }).forEach(([k, v]) => l.setAttribute(k, v));
    uhr.appendChild(l);
    return l;
  };
  stunde = linie(u.r * 0.48, 9);
  minute = linie(u.r * 0.72, 5.5);
  const knopf = document.createElementNS(NS, 'circle');
  Object.entries({ cx: u.x, cy: u.y, r: 8, fill: '#C9A45E' }).forEach(([k, v]) => knopf.setAttribute(k, v));
  uhr.appendChild(knopf);
}
function uhrSetzen(min) {
  if (!stunde) return;
  minute.setAttribute('transform', `rotate(${(min % 60) * 6} ${UHR.x} ${UHR.y})`);
  stunde.setAttribute('transform', `rotate(${((min / 60) % 12) * 30} ${UHR.x} ${UHR.y})`);
}

// ---------- Sterne im Fenster und Staub im Mondstrahl ----------
const sctx = sterne.getContext('2d');
const dctx = staub.getContext('2d');
let sternListe = [];
const staubListe = Array.from({ length: 70 }, () => ({ a: Math.random(), b: Math.random(), r: 0.8 + Math.random() * 2.2, v: 0.2 + Math.random() * 0.5, p: Math.random() * 6.28 }));
function groesse() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  for (const c of [sterne, staub]) {
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  if (info) {
    const f = info.fenster;
    sternListe = Array.from({ length: 34 }, () => ({ x: (f.x + Math.random() * f.w) / W, y: (f.y + Math.random() * f.h * 0.75) / H, r: 0.6 + Math.random() * 1.6, p: Math.random() * 6.28, v: 0.6 + Math.random() * 1.4 }));
  }
}
addEventListener('resize', groesse);
function lebenZeichnen(t) {
  const sw = sterne.clientWidth;
  const sh = sterne.clientHeight;
  sctx.clearRect(0, 0, sw, sh);
  for (const st of sternListe) {
    const blink = Math.max(0, Math.sin(t * st.v + st.p));
    sctx.globalAlpha = blink * 0.9;
    sctx.fillStyle = '#FFF8E6';
    sctx.beginPath();
    sctx.arc(st.x * sw, st.y * sh, st.r * (0.6 + blink * 0.6), 0, 6.283);
    sctx.fill();
  }
  // Mondstrahl: Band vom Fenster (oben rechts) aufs Pult (unten links), Staub treibt darin
  const dw = staub.clientWidth;
  const dh = staub.clientHeight;
  dctx.clearRect(0, 0, dw, dh);
  const von = { x: 0.7 * dw, y: 0.18 * dh };
  const nach = { x: 0.4 * dw, y: 0.78 * dh };
  for (const k of staubListe) {
    k.a += 0.0004 * k.v;
    if (k.a > 1) k.a = 0;
    const quer = (k.b - 0.5) * 0.16 * dw + Math.sin(t * 0.7 + k.p) * 6;
    const x = von.x + (nach.x - von.x) * k.a + quer;
    const y = von.y + (nach.y - von.y) * k.a + quer * 0.4;
    dctx.globalAlpha = Math.sin(k.a * Math.PI) * (0.35 + 0.45 * Math.abs(Math.sin(t * 1.3 + k.p)));
    dctx.fillStyle = '#F4F2FF';
    dctx.beginPath();
    dctx.arc(x, y, k.r, 0, 6.283);
    dctx.fill();
  }
  dctx.globalAlpha = 1;
  sctx.globalAlpha = 1;
}

// ---------- Hauptschleife ----------
let s = 0;
const neigung = { x: 0, y: 0 };
let maus = { x: 0.5, y: 0.5, da: false };
if (MAUS) addEventListener('pointermove', (e) => { maus = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, da: true }; });

function fortschritt() {
  const r = bahn.getBoundingClientRect();
  return klemm(-r.top / (r.height - innerHeight));
}

function bild(ms) {
  const t = ms / 1000;
  const ziel = fortschritt();
  s = RUHIG ? ziel : s + (ziel - s) * 0.12;
  if (Math.abs(ziel - s) < 0.0004) s = ziel;

  if (MAUS && !RUHIG) {
    neigung.x += ((maus.da ? 0.5 - maus.x : 0) - neigung.x) * 0.05;
    neigung.y += ((maus.da ? 0.5 - maus.y : 0) - neigung.y) * 0.05;
  }
  // Auftakt: der Vorhang fliegt an der Kamera vorbei, die Kamera fährt in die Stube (wie der Hero-Flug)
  const flug = RUHIG ? 1 : ausEase(klemm(s / 0.1));
  const fx = FOKUS.x * 100;
  const fy = FOKUS.y * 100;
  for (const e of ebenen) {
    const z = 1 + flug * e.flug * 0.28;
    e.el.style.transformOrigin = `${fx}% ${fy}%`;
    e.el.style.transform = `translate(${neigung.x * e.tiefe}px, ${neigung.y * e.tiefe * 0.6}px) scale(${z})`;
  }
  vorne.style.opacity = String(1 - glatt(klemm((s - 0.06) / 0.05)));
  welt.style.transform = '';

  text.style.opacity = String(1 - glatt(klemm((s - 0.05) / 0.05)));
  welt.parentElement.style.setProperty('--schleier', text.style.opacity);
  text.style.transform = `translateY(${-glatt(klemm((s - 0.05) / 0.05)) * 4}vh)`;

  uhrSetzen(21 * 60 + 47 + klemm(s) * 6);
  if (!RUHIG) lebenZeichnen(t);
  if (laeuft) requestAnimationFrame(bild);
}

let laeuft = false;
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; groesse(); requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: '40% 0px' }).observe(bahn);
