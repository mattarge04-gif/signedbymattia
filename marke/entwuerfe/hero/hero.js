// Hero-Prototyp: Laden, Leben, Amor-Schuss, Flug durch die Kuppel.
// Werte: website/drehbuch/00-grammatik.md · Drehbuch: website/drehbuch/10-startseite.md
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.mjs';

const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ausEase = (t) => 1 - (1 - t) ** 3;

const PARAMETER = {
  nachziehen: 0.12,       // Kamera folgt dem Scroll (Grammatik)
  zielFeder: 0.08,        // Amor dreht sich weich zum Zeiger
  zielMax: 14,            // höchstens ±14° zielen
  pinselFolgt: 0.25,      // Pinsel-Zeiger
  pfeileBisZucken: 3,
  // Lage der Sehne und der Bogenhand im Amor-Bild (Anteil der Bildbreite/-höhe)
  sehne: [0.388, 0.348],
  pfeilLaenge: 0.53,
  pfeilWinkel: 4.6,
};

const buehne = $('#buehne');
const hero = $('#hero');
const ebenen = {
  himmel: $('.himmel'), kuppel: $('.kuppel'), fern: $('.fern'), nah: $('.nah'),
  muse: $('#muse'), amor: $('#amor'), putto: $('#putto'), text: $('#text'), linien: $('#linien'),
};
const ende = Object.assign(document.createElement('div'), { className: 'ebene' });
ende.style.cssText = 'background:var(--color-bg);opacity:0;z-index:25';
buehne.appendChild(ende);

// ---------- Laden: Heiligenschein ist der Ladekreis ----------
const bilder = [...document.querySelectorAll('.buehne img')];
let geladen = 0;
const lader = $('#lader');
const start = performance.now();
ebenen.linien.classList.add('zeichnen');
const fortschritt = () => {
  geladen++;
  lader.style.strokeDashoffset = String(100 - (geladen / bilder.length) * 100);
  if (geladen === bilder.length) {
    const rest = Math.max(0, 900 - (performance.now() - start));
    setTimeout(() => {
      $('#schein').classList.add('fertig');
      buehne.classList.remove('skizze');
    }, RUHIG ? 0 : rest);
  }
};
bilder.forEach((b) => (b.complete ? fortschritt() : b.addEventListener('load', fortschritt, { once: true })));

// ---------- Blinzeln ----------
const augenZu = $('#augenZu');
function blinzeln() {
  augenZu.classList.add('zu');
  setTimeout(() => augenZu.classList.remove('zu'), 140);
  if (Math.random() < 0.25) setTimeout(() => { augenZu.classList.add('zu'); setTimeout(() => augenZu.classList.remove('zu'), 120); }, 320);
  setTimeout(blinzeln, 5000 + Math.random() * 4000);
}
setTimeout(blinzeln, 3500);

// ---------- Pfeil (Mauszeiger als Spitze) ----------
const PFEIL_SVG = `<svg viewBox="0 0 120 24" width="120" height="24" aria-hidden="true">
  <path d="M6 12H104" stroke="#E3C58A" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M6 12l-5-6h9l5 6zM6 12l-5 6h9l5-6z" fill="#FBF3EA" stroke="#E3C58A" stroke-width="1"/>
  <path transform="translate(117 12) rotate(107) scale(1.15)" d="M0 0 L0 16 L4.2 12.2 L7 18.5 L9.4 17.4 L6.7 11.3 L12 11.3 Z"
        fill="#FF9DC8" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
</svg>`;

const amorZielt = $('#amorZielt');
const amorBild = $('.amor-normal');
const aufgelegt = document.createElement('div');
aufgelegt.innerHTML = PFEIL_SVG;
aufgelegt.style.cssText = 'position:absolute;pointer-events:none;transform-origin:0 50%;z-index:2';
amorZielt.appendChild(aufgelegt);
function pfeilAuflegen() {
  const w = amorBild.clientWidth;
  const h = amorBild.clientHeight;
  const laenge = w * PARAMETER.pfeilLaenge;
  const s = laenge / 120;
  aufgelegt.style.left = `${PARAMETER.sehne[0] * w}px`;
  aufgelegt.style.top = `${PARAMETER.sehne[1] * h - 12}px`;
  aufgelegt.style.transform = `rotate(${PARAMETER.pfeilWinkel}deg) scale(${s})`;
}
addEventListener('resize', pfeilAuflegen);
if (amorBild.complete) pfeilAuflegen(); else amorBild.addEventListener('load', pfeilAuflegen);

const codeWort = $('#codeWort');
let pfeile = [];
let zuckt = false;
function schiessen() {
  if (zuckt || RUHIG || aufgelegt.style.opacity === '0') return;
  const r = aufgelegt.getBoundingClientRect();
  const winkel0 = ((PARAMETER.pfeilWinkel + zielWinkel) * Math.PI) / 180;
  const breite = r.width / Math.cos(Math.abs(winkel0)) || r.width;
  const skala = breite / 120;
  const startSpitze = { x: r.left + Math.cos(winkel0) * breite, y: r.top + r.height / 2 + Math.sin(winkel0) * breite * 0.5 };
  const wr = codeWort.getBoundingClientRect();
  const ziel = { x: wr.left + wr.width * (0.15 + Math.random() * 0.7), y: wr.top + wr.height * (0.3 + Math.random() * 0.45) };
  const kontroll = { x: (startSpitze.x + ziel.x) / 2, y: Math.min(startSpitze.y, ziel.y) - 160 };

  const p = document.createElement('div');
  p.className = 'pfeil';
  p.innerHTML = PFEIL_SVG;
  document.body.appendChild(p);
  aufgelegt.style.opacity = '0';
  const dauer = 650;
  const t0 = performance.now();
  let letzterWinkel = 0;
  const flug = (jetzt) => {
    const t = ausEase(klemm((jetzt - t0) / dauer));
    const x = (1 - t) ** 2 * startSpitze.x + 2 * (1 - t) * t * kontroll.x + t * t * ziel.x;
    const y = (1 - t) ** 2 * startSpitze.y + 2 * (1 - t) * t * kontroll.y + t * t * ziel.y;
    const dx = 2 * (1 - t) * (kontroll.x - startSpitze.x) + 2 * t * (ziel.x - kontroll.x);
    const dy = 2 * (1 - t) * (kontroll.y - startSpitze.y) + 2 * t * (ziel.y - kontroll.y);
    letzterWinkel = (Math.atan2(dy, dx) * 180) / Math.PI;
    p.style.transform = `translate(${x - 120}px, ${y - 12}px) rotate(${letzterWinkel}deg) scale(${skala})`;
    if (t < 1) return requestAnimationFrame(flug);
    // stecken bleiben: in das Wort einhängen, damit er mit dem Text mitwandert
    const wr2 = codeWort.getBoundingClientRect();
    p.classList.add('steckt');
    p.style.transform = `translate(${x - wr2.left - 120}px, ${y - wr2.top - 12}px) rotate(${letzterWinkel}deg) scale(${skala})`;
    codeWort.appendChild(p);
    p.firstElementChild.classList.add('wackelt');
    p.querySelector('svg').style.transformOrigin = '100% 50%';
    pfeile.push(p);
    if (pfeile.length >= PARAMETER.pfeileBisZucken) zucken();
    else setTimeout(() => { aufgelegt.style.opacity = '1'; }, 220);
  };
  requestAnimationFrame(flug);
}
function zucken() {
  zuckt = true;
  ebenen.amor.classList.add('zuckt');
  setTimeout(() => {
    pfeile.forEach((p) => p.classList.add('weg'));
    setTimeout(() => { pfeile.forEach((p) => p.remove()); pfeile = []; }, 320);
    ebenen.amor.classList.remove('zuckt');
    aufgelegt.style.opacity = '1';
    zuckt = false;
  }, 2400);
}
buehne.addEventListener('click', (e) => { if (!e.target.closest('a')) schiessen(); });

// ---------- Zeiger, Pinsel, Spur ----------
let maus = { x: innerWidth * 0.6, y: innerHeight * 0.4, da: false };
let pinsel = { x: maus.x, y: maus.y };
addEventListener('pointermove', (e) => { maus = { x: e.clientX, y: e.clientY, da: true }; spurPunkt(e.clientX, e.clientY); });
const pinselEl = $('#pinsel');
const spur = $('#spur');
const sctx = spur.getContext('2d');
const punkte = [];
const FARBEN = ['#FF9DC8', '#D9CCF5', '#CFE3F7', '#FFD6C2'];
let farbIndex = 0;
function spurPunkt(x, y) {
  if (!MAUS || RUHIG) return;
  punkte.push({ x, y, t: performance.now(), f: FARBEN[(farbIndex++ >> 3) % FARBEN.length] });
  if (punkte.length > 40) punkte.shift();
}

// ---------- Lichtstaub ----------
const staub = $('#staub');
const dctx = staub.getContext('2d');
const teilchen = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6, v: 0.15 + Math.random() * 0.35, p: Math.random() * 6.28 }));

function groesse() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  for (const c of [spur, staub]) {
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}
addEventListener('resize', groesse);
groesse();

// ---------- Scroll: Flug durch die Kuppel ----------
let ziel = 0;
let s = 0;
let zielWinkel = 0;
function scrollZiel() {
  const r = hero.getBoundingClientRect();
  ziel = klemm(-r.top / (r.height - innerHeight));
}
if (!RUHIG) {
  const lenis = new Lenis({ lerp: 0.1 });
  const lenisLauf = (t) => { lenis.raf(t); requestAnimationFrame(lenisLauf); };
  requestAnimationFrame(lenisLauf);
}
addEventListener('scroll', scrollZiel, { passive: true });

function setzen(el, transform, deckkraft = 1) {
  el.style.transform = transform;
  el.style.opacity = String(deckkraft);
}

function bild(jetzt) {
  scrollZiel();
  s += (ziel - s) * PARAMETER.nachziehen;
  if (Math.abs(ziel - s) < 0.0005) s = ziel;
  const vw = innerWidth / 100;
  const vh = innerHeight / 100;

  if (!RUHIG) {
    const flug = ausEase(klemm(s / 0.62));
    setzen(ebenen.himmel, `scale(${1 + 0.35 * s})`);
    setzen(ebenen.kuppel, `scale(${1 + 2.9 * flug})`, 1 - klemm((s - 0.48) / 0.16));
    setzen(ebenen.fern, `translateY(${-18 * s * vh}px) scale(${1 + 0.5 * s})`, 1 - klemm((s - 0.7) / 0.2));
    setzen(ebenen.nah, `scale(${1 + 2.4 * ausEase(klemm(s / 0.55))})`, 1 - klemm((s - 0.42) / 0.15));
    setzen(ebenen.muse, `translateY(${-55 * s * vh}px) scale(${1 + 0.9 * s})`, 1 - klemm((s - 0.45) / 0.18));
    setzen(ebenen.amor, `translate(${-45 * s * vw}px, ${-10 * s * vh}px) scale(${1 + 1.3 * s})`, 1 - klemm((s - 0.4) / 0.15));
    setzen(ebenen.putto, `translate(${25 * s * vw}px, ${12 * s * vh}px) scale(${1 + 3.2 * s})`, 1 - klemm((s - 0.3) / 0.15));
    setzen(ebenen.text, `translate(-50%, calc(-50% - ${120 * s * vh}px))`, 1 - klemm(s / 0.28));
    ebenen.linien.style.opacity = String(0.55 * (1 - klemm(s / 0.15)));
    ende.style.opacity = String(klemm((s - 0.82) / 0.16));
  }

  // Amor zielt weich auf den Zeiger
  const ar = amorZielt.getBoundingClientRect();
  const mitte = { x: ar.left + ar.width * 0.55, y: ar.top + ar.height * 0.45 };
  const wunsch = maus.x > mitte.x ? klemm((Math.atan2(maus.y - mitte.y, maus.x - mitte.x) * 180) / Math.PI, -PARAMETER.zielMax, PARAMETER.zielMax) : 0;
  zielWinkel += ((RUHIG ? 0 : wunsch) - zielWinkel) * PARAMETER.zielFeder;
  amorZielt.style.transform = `rotate(${zielWinkel}deg)`;

  // Pinsel und Farbspur
  if (MAUS && !RUHIG) {
    pinsel.x += (maus.x - pinsel.x) * PARAMETER.pinselFolgt;
    pinsel.y += (maus.y - pinsel.y) * PARAMETER.pinselFolgt;
    pinselEl.style.transform = `translate(${pinsel.x - 2}px, ${pinsel.y - 30}px)`;
    pinselEl.style.opacity = maus.da && buehne.getBoundingClientRect().bottom > maus.y ? '1' : '0';
    sctx.clearRect(0, 0, spur.clientWidth, spur.clientHeight);
    for (const pt of punkte) {
      const alter = (jetzt - pt.t) / 600;
      if (alter >= 1) continue;
      sctx.globalAlpha = 0.55 * (1 - alter);
      sctx.fillStyle = pt.f;
      sctx.beginPath();
      sctx.arc(pt.x, pt.y, 7 * (1 - alter * 0.5), 0, 6.283);
      sctx.fill();
    }
  }

  // Lichtstaub im Strahl von oben links
  if (!RUHIG && hero.getBoundingClientRect().bottom > 0) {
    const W = staub.clientWidth;
    const H = staub.clientHeight;
    dctx.clearRect(0, 0, W, H);
    for (const t of teilchen) {
      t.x += 0.00012 * t.v * 6;
      t.y += 0.00025 * t.v * 6;
      if (t.y > 1 || t.x > 1) { t.x = Math.random() * 0.5; t.y = -0.02; }
      const blink = 0.35 + 0.65 * Math.abs(Math.sin(jetzt / 900 + t.p));
      dctx.globalAlpha = blink * 0.75;
      dctx.fillStyle = '#FFF3D6';
      dctx.beginPath();
      dctx.arc(t.x * W, t.y * H, t.r, 0, 6.283);
      dctx.fill();
    }
  }
  requestAnimationFrame(bild);
}
requestAnimationFrame(bild);
