// Kapitel II Automation · Die Nachtschicht. Drehbuch: website/drehbuch/12-kapitel-2.md
// Eine Schreibstube bei Nacht, der Meister ist weg, vier Putti erledigen über die Rohrpost eine Anfrage.
// Alle Figuren stammen aus Bearbeitungen desselben Masterbilds (werkzeuge/k2_nacht_ebenen.py) und liegen
// im Rahmen 4000 × 2233. Der Scroll spult ab und zurück; Uhr, Büchse, Nachrichten und Kerze per Code.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const teil = (x, [a, b]) => klemm((x - a) / (b - a));
const W = 4000;
const H = 2233;

const bahn = $('#k2Bahn');
const welt = $('#k2Welt');
const figuren = $('#k2Figuren');
const morgen = $('#k2Morgen');
const kerze = $('#k2Kerze');
const zeichen = $('#k2Zeichen');
const nachricht = $('#k2Nachricht');
const text = $('#k2Text');
const stationText = $('#k2Station');

// Regie (Fortschritt s der Bahn, 0–1)
const ST = {
  auftakt: [0, 0.1], anfrage: [0.1, 0.24], lesen: [0.24, 0.38], sortieren: [0.38, 0.52],
  antworten: [0.52, 0.66], termin: [0.66, 0.78], ruhe: [0.78, 0.83], morgen: [0.83, 0.97],
};
const TEXTE = [
  ['auftakt', '', '', ''],
  ['anfrage', 'I', 'Anfrage kommt an', '21:47. Niemand ist im Büro.'],
  ['lesen', 'II', 'Gelesen', 'Die Nachricht geht in die Rohrpost.'],
  ['sortieren', 'III', 'Sortiert: dringend', 'Boiler tropft, also kommt sie nach oben.'],
  ['antworten', 'IV', 'Beantwortet', 'Sofort, mit dem Text, den Sie vorher festgelegt haben.'],
  ['termin', 'V', 'Termin steht', 'Do 08:00, Boiler. Im Kalender.'],
  ['ruhe', '', '', ''],
  ['morgen', '', 'Erledigt, während Sie weg waren.', 'Der Meister ist zurück. Der Kaffee auch.'],
];
// Kamera je Station: Blickpunkt im Bild (Anteil) und Nähe. Die Bilder haben 4000 px, gezeigt werden rund
// 1600 px: bis Nähe 2.2 bleibt alles scharf. Der Blickpunkt landet bei 60 % der Breite (links steht Text).
const KAMERA = {
  auftakt: [0.5, 0.5, 1], ruhe: [0.5, 0.5, 1], anfrage: [0.62, 0.6, 1.7], lesen: [0.61, 0.6, 1.55], sortieren: [0.63, 0.42, 1.55],
  antworten: [0.6, 0.6, 1.6], termin: [0.7, 0.6, 1.55], morgen: [0.74, 0.55, 1.35],
};

// ---------- Figuren ----------
const fig = {};
fetch('bilder/k2n/k2n.json').then((r) => r.json()).then((j) => {
  for (const [name, i] of Object.entries(j)) {
    if (name === 'rahmen') continue;
    const im = new Image();
    im.src = `bilder/k2n/${name}.webp`;
    im.alt = '';
    im.decoding = 'async';
    im.className = 'k2-figur';
    Object.assign(im.style, { left: `${(i.x / W) * 100}%`, top: `${(i.y / H) * 100}%`, width: `${(i.w / W) * 100}%` });
    figuren.appendChild(im);
    fig[name] = im;
  }
});
// Haltungen wechseln an festen Punkten mit kurzer Überblendung (CSS), nie halb durchsichtig stehen bleiben
const zeig = (name, o, dy = 0) => {
  const f = fig[name];
  if (!f) return;
  f.classList.toggle('an', o > 0.5);
  f.style.transform = dy ? `translateY(${dy}%)` : '';
};

// ---------- Zeichen: Uhrzeiger, Handyschein, Etikett, Rohrpost-Büchse ----------
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attr, eltern = zeichen) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  eltern.appendChild(e);
  return e;
};
const defs = el('defs', {});
const unschaerfe = el('filter', { id: 'k2Weich', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
el('feGaussianBlur', { stdDeviation: 26 }, unschaerfe);
const schein = el('ellipse', { cx: 2540, cy: 1492, rx: 190, ry: 70, fill: '#FF9DC8', filter: 'url(#k2Weich)', transform: 'rotate(14 2540 1492)', opacity: 0 });

const UHR = { x: 2537, y: 206 };
const stunde = el('line', { x1: UHR.x, y1: UHR.y, x2: UHR.x, y2: UHR.y - 40, stroke: '#3B2E52', 'stroke-width': 7, 'stroke-linecap': 'round' });
const minute = el('line', { x1: UHR.x, y1: UHR.y, x2: UHR.x, y2: UHR.y - 62, stroke: '#3B2E52', 'stroke-width': 4.5, 'stroke-linecap': 'round' });
el('circle', { cx: UHR.x, cy: UHR.y, r: 7, fill: '#C9A45E' });

// Zettel am leeren Stuhl (vermessen am Master): sagt, dass der Meister weg ist
const zettel = el('g', { transform: 'translate(3024 1712) rotate(-3)', fill: '#3B2E52', 'text-anchor': 'middle', style: 'font: italic 31px var(--font-hand)' });
el('text', { x: 0, y: 0 }, zettel).textContent = 'Bin ab 7 Uhr';
el('text', { x: 0, y: 44 }, zettel).textContent = 'zurück.';

// Eintrag im Kalenderbuch (Station Termin), schräg wie die Buchseite
const eintrag = el('text', { x: 0, y: 0, opacity: 0, fill: '#C2557F', 'text-anchor': 'middle', transform: 'translate(3105 1452) rotate(-7) skewX(-18)', style: 'font: italic 30px var(--font-hand)' });
eintrag.textContent = 'Do 08:00 · Boiler';

const etikett = el('g', { opacity: 0, transform: 'translate(2668 838) rotate(-5)' });
el('rect', { x: -78, y: -24, width: 156, height: 48, rx: 6, fill: '#FBF3EA', stroke: '#E3C58A', 'stroke-width': 3 }, etikett);
el('text', { x: 0, y: 11, 'text-anchor': 'middle', fill: '#C2557F', style: 'font: italic 34px var(--font-hand)' }, etikett).textContent = 'Dringend';

// Weg der Büchse: Mündung am Pult → rechts hoch → Mittelstange nach links → links hoch → oben herum →
// Trichterrohr hinunter → Öffnung über Fach oben 3 (vermessen am Master, Rahmen 4000 × 2233)
const weg = el('path', {
  d: 'M2645 1380 L2645 1320 Q2645 1278 2690 1278 L2990 1228 Q3033 1220 3033 1180 L3033 930 Q3033 886 2990 886 '
   + 'L2020 886 Q1972 886 1972 840 L1972 560 Q1972 512 2020 512 L2830 512 Q2878 512 2878 560 L2878 590 '
   + 'Q2878 617 2850 617 L2690 617 Q2656 617 2656 650 L2656 703',
  fill: 'none', stroke: 'none',
});
const wegLaenge = weg.getTotalLength();
// Schweif hinter der Büchse, damit man ihrem Weg folgen kann
const schweif = el('path', { fill: 'none', stroke: '#FF9DC8', 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 });
const buechse = el('g', { opacity: 0 });
el('circle', { r: 80, fill: '#FF9DC8', opacity: 0.35, filter: 'url(#k2Weich)' }, buechse);
el('rect', { x: -56, y: -27, width: 112, height: 54, rx: 27, fill: '#FF9DC8', stroke: '#C2557F', 'stroke-width': 4 }, buechse);
el('rect', { x: -38, y: -16, width: 48, height: 10, rx: 5, fill: '#fff', opacity: 0.85 }, buechse);
el('line', { x1: 30, y1: -27, x2: 30, y2: 27, stroke: '#C2557F', 'stroke-width': 3 }, buechse);
const buechsePos = { x: 0, y: 0 };
function buechseAuf(k, rueckwaerts) {
  // k 0 = Pult, 1 = Fach; gedreht in Fahrtrichtung
  const l = klemm(k) * wegLaenge;
  const p = weg.getPointAtLength(l);
  const q = weg.getPointAtLength(Math.min(wegLaenge, l + 4));
  let winkel = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
  if (rueckwaerts) winkel += 180;
  buechse.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${winkel})`);
  const pkt = [];
  for (let i = 0; i <= 12; i++) {
    const li = klemm(l + (rueckwaerts ? 1 : -1) * i * 28, 0, wegLaenge);
    const w = weg.getPointAtLength(li);
    pkt.push(`${w.x.toFixed(0)} ${w.y.toFixed(0)}`);
  }
  schweif.setAttribute('d', `M${pkt.join(' L')}`);
  buechsePos.x = p.x / W;
  buechsePos.y = p.y / H;
}

// ---------- Nachrichten über dem Handy ----------
let letzteNachricht = '';
function nachrichtSetzen(art, o) {
  if (art !== letzteNachricht) {
    letzteNachricht = art;
    nachricht.classList.toggle('antwort', art === 'antwort');
    // Anfrage direkt über dem Handy; Antwort rechts über dem Kalenderbuch, wo dann niemand arbeitet
    nachricht.style.left = `${((art === 'antwort' ? 2930 : 2540) / W) * 100}%`;
    nachricht.style.top = `${((art === 'antwort' ? 1330 : 1420) / H) * 100}%`;
    nachricht.innerHTML = art === 'antwort'
      ? '<small>Antwort · gesendet 21:51</small>„Guten Tag Frau Meier, wir kommen morgen um 8 Uhr.“'
      : '<small>Neue Anfrage · 21:47</small>„Boiler tropft in der Küche. Morgen möglich?“';
  }
  nachricht.style.opacity = String(o);
  nachricht.style.transform = `scale(${0.92 + 0.08 * o})`;
}

// ---------- Text unten links ----------
let letzteStation = '';
function stationSetzen(name) {
  if (name === letzteStation) return;
  letzteStation = name;
  const [, nr, titel, satz] = TEXTE.find((x) => x[0] === name);
  stationText.classList.add('wechselt');
  setTimeout(() => {
    stationText.querySelector('.nr').textContent = nr;
    stationText.querySelector('b').textContent = titel;
    stationText.querySelector('.satz').textContent = satz;
    stationText.classList.remove('wechselt');
    stationText.classList.toggle('leer', !titel);
  }, RUHIG ? 0 : 220);
}

// ---------- Uhr: 21:47 bis 21:53 in der Nacht, dann vorspulen bis 07:00 ----------
const NACHT = [[0.1, 21 * 60 + 47], [0.24, 21 * 60 + 48], [0.38, 21 * 60 + 49], [0.52, 21 * 60 + 51], [0.66, 21 * 60 + 52], [0.78, 21 * 60 + 53]];
function uhrzeit(x) {
  if (x <= NACHT[0][0]) return NACHT[0][1];
  for (let i = 1; i < NACHT.length; i++) {
    if (x <= NACHT[i][0]) {
      const [a, ta] = NACHT[i - 1];
      const [b, tb] = NACHT[i];
      return ta + (tb - ta) * teil(x, [a, b]);
    }
  }
  return 21 * 60 + 53 + glatt(teil(x, [0.79, 0.86])) * (9 * 60 + 7); // bis 07:00
}
function uhrSetzen(min) {
  minute.setAttribute('transform', `rotate(${(min % 60) * 6} ${UHR.x} ${UHR.y})`);
  stunde.setAttribute('transform', `rotate(${((min / 60) % 12) * 30} ${UHR.x} ${UHR.y})`);
}

// ---------- Hauptschleife ----------
let s = 0;
const neigung = { x: 0, y: 0 };
let maus = { x: 0.5, y: 0.5, da: false };
if (MAUS) addEventListener('pointermove', (e) => { maus = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, da: true }; });
const kam = { x: 0.5, y: 0.5, z: 1 };

function fortschritt() {
  const r = bahn.getBoundingClientRect();
  return klemm(-r.top / (r.height - innerHeight));
}

function bild(ms) {
  const t = ms / 1000;
  const ziel = fortschritt();
  s = RUHIG ? ziel : s + (ziel - s) * 0.14;
  if (Math.abs(ziel - s) < 0.0004) s = ziel;
  const p = Object.fromEntries(Object.entries(ST).map(([k, ab]) => [k, teil(s, ab)]));
  const station = Object.keys(ST).find((k) => s < ST[k][1]) || 'morgen';

  // Rohrpost: hin in Station Lesen (ins Fach Dringend), zurück in Station Antworten
  const hin = teil(p.lesen, [0.3, 0.98]);
  const zurueck = teil(p.antworten, [0.02, 0.6]);
  const zurueckAktiv = s >= ST.antworten[0];
  const unterwegs = zurueckAktiv ? zurueck > 0 && zurueck < 1 : s < ST.sortieren[0] && hin > 0 && hin < 1;
  buechse.setAttribute('opacity', unterwegs ? '1' : '0');
  schweif.setAttribute('opacity', unterwegs ? '0.4' : '0');
  if (unterwegs) buechseAuf(zurueckAktiv ? 1 - glatt(zurueck) : glatt(hin), zurueckAktiv);

  // Kamera: Zielpunkt der Station oder der fahrenden Büchse, weich nachgeführt
  let [kx, ky, kz] = KAMERA[station];
  if (unterwegs) [kx, ky, kz] = [buechsePos.x, buechsePos.y, 1.4];
  const f = RUHIG ? 1 : 0.05;
  kam.x += (kx - kam.x) * f;
  kam.y += (ky - kam.y) * f;
  kam.z += (kz - kam.z) * f;
  if (MAUS && !RUHIG) {
    neigung.x += ((maus.da ? 0.5 - maus.x : 0) - neigung.x) * 0.05;
    neigung.y += ((maus.da ? 0.5 - maus.y : 0) - neigung.y) * 0.05;
  }
  // Blickpunkt auf 60 % Breite / 50 % Höhe des Bildschirms legen, ohne dass ein Rand sichtbar wird
  const ww = welt.offsetWidth;
  const wh = welt.offsetHeight;
  const links = (innerWidth - ww) / 2;
  const oben = (innerHeight - wh) / 2;
  const mitteX = innerWidth * (kam.z > 1.05 ? 0.6 : 0.5);
  let tx = mitteX - links - kam.z * kam.x * ww + neigung.x * 14;
  let ty = innerHeight * 0.5 - oben - kam.z * kam.y * wh + neigung.y * 10;
  tx = klemm(tx, innerWidth - links - kam.z * ww, -links);
  ty = klemm(ty, innerHeight - oben - kam.z * wh, -oben);
  welt.style.transform = `translate(${tx}px, ${ty}px) scale(${kam.z})`;

  // Kapitelwort nur im Auftakt
  text.style.opacity = String(1 - glatt(teil(s, [0.07, 0.12])));
  text.style.transform = `translateY(${-glatt(teil(s, [0.07, 0.12])) * 4}vh)`;
  stationSetzen(station);

  // Putti: schlafen → wach (Anfrage) → einzelne arbeiten → wieder schlafen (Morgen)
  const wach = glatt(teil(p.anfrage, [0.35, 0.7])) * (1 - glatt(teil(p.ruhe, [0, 0.5])));
  const ein = (k) => glatt(teil(p[k], [0, 0.18]));
  const aus = (k, a = 0, b = 0.18) => 1 - glatt(teil(p[k], [a, b]));
  const atem = (n) => (RUHIG ? 0 : Math.sin(t * 1.7 + n) * 0.6);
  const lesen = s < ST.sortieren[0] ? ein('lesen') : aus('sortieren');
  const sortieren = s < ST.antworten[0] ? ein('sortieren') : aus('antworten');
  const antworten = s < ST.termin[0] ? ein('antworten') : aus('termin');
  const termin = s < ST.ruhe[0] ? glatt(teil(p.termin, [0.12, 0.3])) : aus('ruhe', 0, 0.3);
  const arbeit = { o1: lesen, o3: sortieren, u2: antworten, u4: termin };
  for (const [n, k] of [['o1', 0], ['o3', 1.3], ['u2', 2.1], ['u4', 3.4]]) {
    zeig(`schlaf-${n}`, 1 - wach, atem(k));
    zeig(`wach-${n}`, wach * (1 - arbeit[n]));
  }
  zeig('lesen', lesen);
  zeig('sortieren', sortieren);
  zeig('antworten', antworten);
  zeig('termin', termin);

  // Handy: leuchtet, bis es gelesen ist; Nachrichten darüber
  const ungelesen = glatt(teil(p.anfrage, [0, 0.2])) * (1 - glatt(teil(p.lesen, [0.2, 0.45])));
  schein.setAttribute('opacity', String(ungelesen * (0.55 + 0.35 * Math.sin(t * 4))));
  // Anfrage nur, solange niemand am Handy arbeitet; Antwort, wenn die Büchse zurück ist
  const anfrageText = glatt(teil(p.anfrage, [0.15, 0.35])) * (1 - glatt(teil(s, [ST.lesen[0] - 0.01, ST.lesen[0] + 0.015])));
  const antwortText = glatt(teil(p.antworten, [0.6, 0.75])) * (1 - glatt(teil(p.termin, [0, 0.12])));
  if (antwortText > 0.01) nachrichtSetzen('antwort', antwortText);
  else nachrichtSetzen('anfrage', anfrageText);

  etikett.setAttribute('opacity', String(glatt(teil(p.sortieren, [0.35, 0.55])) * aus('ruhe', 0.2, 0.6)));

  // Uhr, Kerze, Morgen
  uhrSetzen(uhrzeit(s));
  kerze.style.opacity = String(1 - glatt(teil(p.ruhe, [0.4, 0.9])));
  if (MAUS && !RUHIG) kerze.style.translate = `calc(-50% + ${(maus.x - 0.5) * 30}px) calc(-50% + ${(maus.y - 0.5) * 18}px)`;
  morgen.style.opacity = String(glatt(teil(p.morgen, [0, 0.15])));
  eintrag.setAttribute('opacity', String(glatt(teil(p.termin, [0.45, 0.65])) * aus('ruhe', 0, 0.3)));

  if (laeuft) requestAnimationFrame(bild);
}

let laeuft = false;
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: '40% 0px' }).observe(bahn);
