// Kapitel II Automation · Die Nachtschicht. Drehbuch: website/drehbuch/12-kapitel-2.md
// Baustein 1 (Hero-Methode, 31.10.2026): Bühne aus einzeln gemalten Ebenen (werkzeuge/k2_buehne.py,
// bilder/k2b/k2b.json, Rahmen 4000 × 2233). Wie im Hero: jede Ebene hat ihre Tiefe für die Maus und ihren
// Anteil am Kameraflug; der Vorhang fliegt im Auftakt an der Kamera vorbei. Lebt: Sterne, ziehender Himmel,
// Kerze, Mondstaub, Uhr. Baustein 2: Station I (Handy, schlafende Putti, Eintauchen).
// Baustein 3: Station II „gelesen“ (Putti wachen auf, Display „Gelesen“, Büchse fährt durchs Rohr).
// Station III „sortiert“ (Fang-Putto, Schild „Dringend“), Station IV „beantwortet“ (Putto tippt von hinten aufs Display).
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
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
const HANDY = { x: 0.4856, y: 0.597 }; // Mitte des Handys im Goldrahmen (nach dem Auftakt-Flug der Pult-Ebene)
const sanft = (t) => t * t * t * (t * (t * 6 - 15) + 10); // weicher als glatt
const kam = { x: 0.5, y: 0.5, z: 1 };
const puttiEbene = $('#k2Putti');
const display = $('#k2Display');
const handy = $('#k2Handy');
const meldung = $('#k2Meldung');
const stationText = $('#k2Station');
const ST = { auftakt: [0, 0.1], anfrage: [0.1, 0.3], lesen: [0.3, 0.44], sortieren: [0.44, 0.58], antworten: [0.58, 0.72] };
// Station II: wann welcher Putto aufwacht (Anteil der Station); der Schnarcher (oben 3) zuletzt
const WECKEN = { 'schlaf-o1': 0.06, 'schlaf-u4': 0.12, 'schlaf-u2': 0.18, 'schlaf-o3': 0.26 };
const rohrWeg = $('#k2RohrWeg');
const rohrGlanz = $('#k2RohrGlanz');
const spuren = [[$('#k2SpurAussen'), 320, 0.45], [rohrGlanz, 200, 0.9], [$('#k2SpurKern'), 90, 1]]; // Länge, Stärke
const displayZeit = display.querySelector('.k2-uhrzeit');
const glut = $('#k2Glut');
const buechse = $('#k2BuechseBild'); // gemalte Büchse in eigener Ebene (Tiefe wie die Putti, ohne screen-Mischung)
const ROHR_LANG = rohrWeg.getTotalLength();
// Station II fährt bis unter den Trichter (Verteiler), Station III von dort durch das obere Rohr zum Fach „Dringend“
const bisVerteiler = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bisVerteiler.setAttribute('d', 'M1818 1150 Q1832 1146 1832 1128 L1832 552 Q1832 532 1812 532 L1778 532');
const ROHR_II = bisVerteiler.getTotalLength();
const TRICHTER = { x: 1298, y: 662 }; // Mündung über Fach oben links
const HAND = { x: 1322, y: 800 }; // Hände des Fang-Puttos (k2b.json „hand“)
const SCHILDER = [['Dringend', 0], ['Offerte', 1], ['Termin', 2], ['Rückruf', 3], ['Rechnung', 4], ['Frage', 5], ['Später', 6], ['Werbung', 7]];
const schilder = $('#k2Schilder');
let dringend = null;
const fang = {};
const schreib = {};
const ROHRENDE = { x: 2157, y: 1232 }; // Mündung des Messing-Rohrendes rechts vom Handy (Pult-Bild)
const buechse2 = $('#k2BuechseZwei');
const rausLicht = $('#k2RausLicht');
const antwort = display.querySelector('.k2-antwort');
for (const [el, lang] of spuren) el.style.strokeDasharray = `${lang} ${ROHR_LANG + 400}`;
const START = { x: 1931, y: 1175 }; // Oberkante des Handys im Goldrahmen
const EINWURF = rohrWeg.getPointAtLength(0);
const putti = [];
const pultPutti = [];
const zs = [];
const teil = (x, [a, b]) => klemm((x - a) / (b - a));

// ---------- Teile platzieren ----------
let info = null;
fetch('bilder/k2b/k2b.json', { cache: 'no-cache' }).then((r) => r.json()).then((j) => {
  info = j;
  const lege = (el, i) => Object.assign(el.style, { left: `${(i.x / W) * 100}%`, top: `${(i.y / H) * 100}%`, width: `${(i.w / W) * 100}%` });
  document.querySelectorAll('.k2-teil').forEach((el) => lege(el, j[el.dataset.teil]));
  lege($('#k2Himmel'), j.himmel);
  // Putti in den Fächern; der schnarchende (oben 3) bekommt aufsteigende „z“
  const bildFuer = (name, i, klasse, eltern) => {
    const im = new Image();
    im.src = `bilder/k2b/${name}.webp`;
    im.alt = '';
    im.className = klasse;
    lege(im, i);
    eltern.appendChild(im);
    return im;
  };
  for (const [name, i] of Object.entries(j.putti)) {
    if (name.startsWith('pult-')) pultPutti.push(bildFuer(name, i, 'k2-pult-putto', display.parentElement));
    if (!name.startsWith('schlaf-')) continue;
    const wachName = name.replace('schlaf', 'wach');
    const schlaf = bildFuer(name, i, `k2-putto schlaf-bild${j.putti[wachName] ? '' : ' allein'}`, puttiEbene);
    const wach = j.putti[wachName] ? bildFuer(wachName, j.putti[wachName], 'k2-putto wach-bild', puttiEbene) : null;
    putti.push({ ab: WECKEN[name] ?? 0.1, bilder: wach ? [schlaf, wach] : [schlaf] });
  }
  for (const n of ['tippt-a', 'tippt-b']) if (j.putti[n]) schreib[n] = bildFuer(n, j.putti[n], 'k2-pult-putto tipp-bild', display.parentElement);
  schreib.links = pultPutti.find((b) => b.src.endsWith('pult-links.webp'));
  if (j.buechse) Object.entries({ x: -j.buechse.w / 2, y: -j.buechse.h / 2, width: j.buechse.w, height: j.buechse.h }).forEach(([k, v]) => buechse2.setAttribute(k, v));
  for (const n of ['fang-a', 'fang-b']) if (j.putti[`${n}-o1`]) fang[n] = bildFuer(`${n}-o1`, j.putti[`${n}-o1`], 'k2-putto fang-bild', puttiEbene);
  // den wachen Putto nur ausblenden, wenn die Fang-Bilder wirklich da sind (alte k2b.json im Cache)
  if (fang['fang-a'] && fang['fang-b']) fang.wach = puttiEbene.querySelector('img[src$="wach-o1.webp"]');
  if (j.buechse) Object.entries({ x: -j.buechse.w / 2, y: -j.buechse.h / 2, width: j.buechse.w, height: j.buechse.h }).forEach(([k, v]) => buechse.setAttribute(k, v));
  schilderBauen(j.regal);
  HAND.x = j.hand?.x ?? HAND.x;
  HAND.y = j.hand?.y ?? HAND.y;
  const sn = j.putti['schlaf-o3'];
  for (let n = 0; n < 3; n++) {
    const z = document.createElement('span');
    z.className = 'k2-z';
    z.textContent = 'z';
    Object.assign(z.style, { left: `${((sn.x + sn.w * 0.62) / W) * 100}%`, top: `${((sn.y + sn.h * 0.12) / H) * 100}%` });
    puttiEbene.appendChild(z);
    zs.push(z);
  }
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
// Stil nur schreiben, wenn er sich ändert (ruhendes Bild = Chrome rastert in voller Auflösung)
const gesetzt = new WeakMap();
function setze(el, k, v) {
  let m = gesetzt.get(el);
  if (!m) gesetzt.set(el, (m = {}));
  if (m[k] !== v) { m[k] = v; el.style[k] = v; }
}
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
  // Auftakt (K1-B5): Wir sind noch im Display des Handys (Zeitraffer aus Kapitel I, zeitraffer.js). Die Kamera
  // zieht aus demselben Handy zurück, jetzt im Goldrahmen auf dem Pult; die Ebenen ziehen dabei verschieden schnell.
  const zurueck = RUHIG ? 0 : 1 - sanft(teil(s, [0.04, 0.1]));
  const flug = 1 + 0.5 * zurueck;
  const fx = FOKUS.x * 100;
  const fy = FOKUS.y * 100;
  for (const e of ebenen) {
    const z = 1 + flug * e.flug * 0.28;
    setze(e.el, 'transformOrigin', `${fx}% ${fy}%`);
    setze(e.el, 'transform', `translate(${(neigung.x * e.tiefe).toFixed(1)}px, ${(neigung.y * e.tiefe * 0.6).toFixed(1)}px) scale(${z.toFixed(4)})`);
  }
  vorne.style.opacity = '0';   // Vorhang-Auftakt ersetzt durch das Zurückziehen aus dem Handy

  // Station I: das Handy wacht auf, die Kamera fährt heran und taucht ins Display ein (wie Apples Fahrt ins Objektiv)
  const pa = teil(s, ST.anfrage);
  const licht = 0.12 + 0.88 * glatt(teil(pa, [0, 0.1]));
  display.style.setProperty('--licht', licht);
  handy.style.setProperty('--licht', licht);
  // Kamera: Blickpunkt wandert stetig von der Bildmitte zur Handymitte, das Handy landet in der Bildschirmmitte
  // Handymitte live messen (inkl. Tiefe der Pult-Ebene), damit es wirklich in der Bildschirmmitte landet
  const rr = display.getBoundingClientRect();
  const wr = welt.getBoundingClientRect();
  if (wr.width) {
    HANDY.x = (rr.left + rr.width / 2 - wr.left) / wr.width;
    HANDY.y = (rr.top + rr.height / 2 - wr.top) / wr.height;
  }
  const pl = teil(s, ST.lesen);
  const rohr = station2(pl);
  const ps = teil(s, ST.sortieren);
  const ziel3 = station3(ps);
  const pa4 = teil(s, ST.antworten);
  const ziel4 = station4(pa4);
  schaerfe(pl, ps);
  let blick;
  if (ziel4) {
    // Station IV: nah aufs Handy mit dem schreibenden Putto, dann der Büchse nach oben folgen, am Ende die ganze Stube
    const ein = RUHIG ? 0 : sanft(teil(pa4, [0, 0.14]));
    const raus = sanft(teil(pa4, [0.72, 0.88]));
    const ende = RUHIG ? 1 : sanft(teil(pa4, [0.88, 1]));
    const zx = HANDY.x + (ziel4.x / W - HANDY.x) * raus;
    const zy = HANDY.y + (ziel4.y / H - HANDY.y) * raus;
    const nah = ein * (1 - ende);
    blick = { x: 0.5 + (zx - 0.5) * nah, y: 0.5 + (zy - 0.5) * nah, z: 1 + (1.4 - 0.7 * raus) * nah };
  } else if (s < ST.lesen[0]) {
    const nah = RUHIG ? 0 : Math.max(zurueck, sanft(teil(pa, [0.04, 0.46])) * (1 - sanft(teil(pa, [0.86, 1]))));
    blick = { x: 0.5 + (HANDY.x - 0.5) * nah, y: 0.5 + (HANDY.y - 0.5) * nah, z: 1 + 1.5 * nah };
  } else if (ziel3) {
    // Station III: nah am Rohr und am Fach, dann zurück auf Fach und Handy, am Ende die ganze Stube
    const nah = RUHIG ? 0 : 1 - sanft(teil(ps, [0.88, 1]));
    const zurueckHandy = sanft(teil(ps, [0.58, 0.76]));
    const zx = ziel3.x / W + (0.42 - ziel3.x / W) * zurueckHandy;
    const zy = ziel3.y / H + (0.46 - ziel3.y / H) * zurueckHandy;
    const z = 1 + (1.3 - 0.75 * zurueckHandy) * nah;
    blick = { x: 0.5 + (zx - 0.5) * nah, y: 0.5 + (zy - 0.5) * nah, z };
  } else {
    // Station II: zuerst Handy und Regal mit den Putti im Blick, dann folgt die Kamera der Büchse im Rohr
    const nah = RUHIG ? 0 : sanft(teil(pl, [0, 0.22]));
    const folgen = sanft(teil(pl, [0.42, 0.6]));
    const zielX = 0.44 + (rohr.x / W - 0.44) * folgen;
    const zielY = 0.5 + (rohr.y / H - 0.5) * folgen;
    blick = { x: 0.5 + (zielX - 0.5) * nah, y: 0.5 + (zielY - 0.5) * nah, z: 1 + 0.85 * nah };
  }
  // nie über den Rand der Welt hinaus schauen (Welt ist mindestens so gross wie der Bildschirm)
  const randX = innerWidth / (2 * blick.z * welt.offsetWidth);
  const randY = innerHeight / (2 * blick.z * welt.offsetHeight);
  blick.x = klemm(blick.x, randX, 1 - randX);
  blick.y = klemm(blick.y, randY + 0.02, 1 - randY);
  const f = RUHIG ? 1 : 0.08;
  kam.x += (blick.x - kam.x) * f;
  kam.y += (blick.y - kam.y) * f;
  kam.z += (blick.z - kam.z) * f;
  // einrasten: sonst ändert sich der transform ewig um Bruchteile und Chrome rastert nie scharf nach
  if (Math.abs(blick.x - kam.x) < 0.0005 && Math.abs(blick.y - kam.y) < 0.0005 && Math.abs(blick.z - kam.z) < 0.001) Object.assign(kam, blick);
  const ww = welt.offsetWidth;
  const wh = welt.offsetHeight;
  const links = (innerWidth - ww) / 2;
  const oben = (innerHeight - wh) / 2;
  const tx = innerWidth / 2 - links - kam.z * kam.x * ww;
  const ty = innerHeight / 2 - oben - kam.z * kam.y * wh;
  setze(welt, 'transform', `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${kam.z.toFixed(4)})`);
  // Eintauchen: die scharfe Kopie liegt zuerst genau auf dem Handy im Bild und wächst bis zum ganzen Bildschirm
  const ein = RUHIG ? glatt(teil(pa, [0.3, 0.4])) * (1 - glatt(teil(pa, [0.86, 0.95]))) : Math.max(zurueck, sanft(teil(pa, [0.52, 0.66])) * (1 - sanft(teil(pa, [0.72, 0.85]))));
  const sichtbar = RUHIG ? ein > 0.01 : (pa > 0.5 && pa < 0.87) || zurueck > 0.001;
  if (sichtbar) {
    // gleiches Seitenverhältnis: wächst, bis das Display die ganze Breite füllt; der Bereich mit Uhrzeit
    // und Meldung (ca. 32 % der Höhe) landet in der Bildschirmmitte. Schrift höchstens 24 px (echte Grösse).
    const r = display.getBoundingClientRect();
    const voll = (innerWidth * 1.08) / r.width;
    const k = 1 + (voll - 1) * ein;
    const w = r.width * k;
    const h = r.height * k;
    const x = r.left + (innerWidth / 2 - w / 2 - r.left) * ein;
    const y = r.top + (innerHeight * 0.42 - h * 0.3 - r.top) * ein;
    const fs = Math.min(w / 21, 30 + (w / 21 - 30) * (1 - ein));
    const oben = fs * 8.5 + ((innerHeight * 0.2 - y - h * 0.03) - fs * 8.5) * ein;
    Object.assign(handy.style, { width: `${w}px`, height: `${h}px`, fontSize: `${w / 21}px`, transform: `translate(${x}px, ${y}px)`, opacity: '1' });
    const sperre = handy.querySelector('.k2-sperre');
    sperre.style.fontSize = `${fs / (w / 21)}em`;
    sperre.style.paddingTop = `${oben}px`;
  } else handy.style.opacity = '0';
  welt.style.filter = ein > 0.01 ? `blur(${ein * 6}px)` : '';
  meldung.classList.toggle('da', pa > 0.6 && pa < 0.76);
  if (s > ST.anfrage[0] + 0.004 && s < ST.anfrage[1]) stationZeigen(STATIONEN[0]);
  else if (s >= ST.lesen[0] && s < ST.lesen[1]) stationZeigen(STATIONEN[pl < 0.44 ? 1 : 2]);
  else if (s >= ST.sortieren[0] && s < ST.sortieren[1] - 0.003) stationZeigen(STATIONEN[3]);
  else if (s >= ST.antworten[0] && s < ST.antworten[1] - 0.003) stationZeigen(STATIONEN[4]);
  else stationZeigen(null);

  text.style.opacity = String(1 - glatt(klemm((s - 0.05) / 0.05)));
  welt.parentElement.style.setProperty('--schleier', text.style.opacity);
  text.style.transform = `translateY(${-glatt(klemm((s - 0.05) / 0.05)) * 4}vh)`;

  uhrSetzen(21 * 60 + 47 + glatt(teil(pl, [0.1, 0.5])) + glatt(teil(ps, [0.55, 0.7])) + glatt(teil(pa4, [0.5, 0.62])));
  if (!RUHIG) lebenZeichnen(t);
  if (laeuft) requestAnimationFrame(bild);
}

// ---------- Tiefenschärfe in Station II (Mattia 01.11.) ----------
// Zuerst sind Pult und Handy scharf, Regal und Wand weich; folgt die Kamera der Büchse ins Rohr, zieht die
// Schärfe nach hinten: Regal, Rohr und Uhr scharf, Pult und Stuhl weich. Blur in Welt-Pixeln (wird mitskaliert).
const SCHAERFE = { hinten: [8, 14, 16], vorne: [24, 34] }; // Ebenen nach data-tiefe
let letzteSchaerfe = '';
function schaerfe(pl, ps) {
  // in Station III bleibt das Regal scharf, beim Zurückziehen auf Fach und Handy wird alles scharf
  const an = RUHIG ? 0 : sanft(teil(pl, [0.02, 0.2])) * (1 - sanft(teil(ps, [0.58, 0.74])));
  const zurRohr = sanft(teil(pl, [0.4, 0.58]));
  const weich = (f) => (f * an > 0.02 ? `blur(${(f * an * 2.6).toFixed(2)}px)` : '');
  const schluessel = `${an.toFixed(3)}|${zurRohr.toFixed(3)}`;
  if (schluessel === letzteSchaerfe) return;
  letzteSchaerfe = schluessel;
  for (const e of ebenen) {
    if (e.tiefe <= 4) continue; // Himmel im Fenster bleibt
    const istRohr = e.el.classList.contains('k2-rohrpost') || e.el.classList.contains('k2-buechsen');
    let f = 0;
    if (SCHAERFE.hinten.includes(e.tiefe) && !istRohr) f = e.tiefe === 8 ? 1 - 0.6 * zurRohr : 1 - zurRohr;
    else if (SCHAERFE.vorne.includes(e.tiefe)) f = zurRohr * (e.tiefe === 34 ? 1.3 : 1);
    e.el.style.filter = weich(f);
  }
}

// ---------- Station II „gelesen“ ----------
// Rein vom Scroll abhängig, rückwärts gleich: Putti wachen nacheinander auf, das Display zeigt „Gelesen“,
// zwei Putti treten ans Handy, die Büchse springt aus dem Handy ins Rohr, ihr Leuchten fährt hinauf und
// nach links hinter die Krone (Station III fängt sie). Gibt die Lage der Büchse für die Kamera zurück.
function station2(pl) {
  const aktiv = s >= ST.lesen[0];
  for (const p of putti) for (const b of p.bilder) b.classList.toggle('ist-wach', aktiv && pl >= p.ab || s >= ST.lesen[1]);
  for (const z of zs) z.classList.toggle('weg', s >= ST.lesen[0] + 0.004);
  const ps = teil(s, ST.sortieren);
  display.classList.toggle('gelesen', pl > 0.3 && ps <= 0.6);
  display.classList.toggle('sortiert', ps > 0.6 && s < ST.antworten[0] + 0.012);
  displayZeit.textContent = ps > 0.6 ? '21:49' : aktiv ? '21:48' : '21:47';
  for (const b of pultPutti) b.classList.toggle('da', pl > 0.3);
  // Sprung: Büchse aus dem Handy im Bogen zum Einwurf, dort hinein (kleiner werden)
  const sprung = teil(pl, [0.44, 0.54]);
  const hinein = teil(pl, [0.52, 0.56]);
  const bx = START.x + (EINWURF.x - START.x) * sprung;
  const by = START.y + (EINWURF.y - START.y) * sprung - Math.sin(sprung * Math.PI) * 90;
  const winkel = -70 * sprung;
  buechse.setAttribute('transform', `translate(${bx} ${by}) rotate(${winkel}) scale(${(0.4 + 0.6 * glatt(teil(pl, [0.42, 0.47])) - 0.5 * hinein)})`);
  buechse.style.opacity = pl > 0.42 && hinein < 1 ? '1' : '0';
  // Fahrt im Rohr: Leuchten und Glanz entlang des Wegs, am Ende hinter der Krone ausblenden
  const fahrt = RUHIG ? (pl > 0.56 ? 1 : 0) : sanft(teil(pl, [0.55, 0.86]));
  const p = rohrLicht(fahrt * ROHR_II, pl > 0.54 ? Math.min(1, (pl - 0.54) * 40) : 0);
  if (pl <= 0.54) return { x: EINWURF.x, y: EINWURF.y };
  return p;
}

// Licht im Rohr an der Stelle weg (Länge), Kopf an der Büchse, Schweif dahinter (je Strich eigene Länge)
function rohrLicht(weg, staerke) {
  const p = rohrWeg.getPointAtLength(weg);
  glut.setAttribute('cx', p.x);
  glut.setAttribute('cy', p.y);
  glut.style.opacity = String(staerke);
  for (const [el, lang, st] of spuren) {
    el.style.strokeDashoffset = String(-(weg - lang));
    el.style.opacity = String(staerke * st);
  }
  return { x: p.x, y: p.y };
}

// ---------- Station III „sortiert“ ----------
// Die Büchse fährt vom Verteiler durchs obere Rohr zum Trichter über Fach „Dringend“, fällt heraus, der Putto
// oben links fängt sie (Zwei-Bild-Wechsel), das Schild „Dringend“ leuchtet, das Handy zeigt „Eingeordnet“.
// Gibt den Blickpunkt (Rahmen-Pixel) zurück.
function station3(ps) {
  const aktiv = s >= ST.sortieren[0];
  // Putto: wach → Arme hoch → hält die Büchse
  const arme = aktiv && ps >= 0.12 && ps < 0.47;
  const haelt = aktiv && ps >= 0.47;
  fang['fang-a']?.classList.toggle('zeigen', arme);
  fang['fang-b']?.classList.toggle('zeigen', haelt);
  fang.wach?.classList.toggle('weg', arme || haelt);
  dringend?.classList.toggle('an', haelt && ps >= 0.5);
  if (!aktiv) return null;
  // Fahrt durchs obere Rohr, am Trichter verlischt das Licht
  const fahrt = RUHIG ? (ps > 0.05 ? 1 : 0) : sanft(teil(ps, [0, 0.36]));
  const p = rohrLicht(ROHR_II + fahrt * (ROHR_LANG - ROHR_II), 1 - glatt(teil(ps, [0.34, 0.42])));
  // Fall aus dem Trichter in die Hände (beschleunigt), dann ruht sie in den Händen
  const fall = teil(ps, [0.38, 0.47]);
  const f2 = fall * fall;
  const bx = TRICHTER.x + (HAND.x - TRICHTER.x) * f2;
  const by = TRICHTER.y + (HAND.y - TRICHTER.y) * f2;
  const kipp = haelt ? 0 : 25 * Math.sin(fall * Math.PI);
  buechse.setAttribute('transform', `translate(${bx} ${by}) rotate(${kipp}) scale(0.85)`);
  buechse.style.opacity = ps > 0.38 ? '1' : '0';
  // Blick: folgt dem Licht, dann aufs Fach; danach Fach und Handy zusammen
  const zumFach = sanft(teil(ps, [0.28, 0.42]));
  return { x: p.x + (1300 - p.x) * zumFach, y: p.y + (760 - p.y) * zumFach };
}

// ---------- Station IV „beantwortet“ ----------
// Ein Putto steht von hinten vor dem Handy und tippt die Antwort (Entscheid Mattia 01.11.): Buchstabe für
// Buchstabe vom Scroll, bei jedem Buchstaben wechselt der Finger (Zwei-Bild). Dann tippt er „Senden“, die Blase
// wird pink ✓✓. Danach steigt eine zweite Büchse aus dem Messing-Rohrende und schiesst nach oben hinaus.
const ANTWORT = 'Wir kommen morgen um 8 Uhr.';
const getippt = antwort.querySelector('.getippt');
let getipptJetzt = -1;
function station4(pa) {
  const aktiv = s >= ST.antworten[0];
  const da = aktiv && pa >= 0.08;
  display.classList.toggle('antwort', aktiv && pa > 0.06);
  const n = Math.round(ANTWORT.length * teil(pa, [0.16, 0.52]));
  if (n !== getipptJetzt) { getipptJetzt = n; getippt.textContent = ANTWORT.slice(0, n); }
  const tippt = aktiv && pa >= 0.14;
  const gesendet = aktiv && pa >= 0.6;
  display.classList.toggle('tippt', tippt);
  display.classList.toggle('gesendet', gesendet);
  // Finger: unten (a) bei jedem Buchstaben, oben (b) dazwischen; Senden-Tipp bei 0.58, danach Finger oben
  const unten = RUHIG ? pa < 0.6 : (pa >= 0.16 && pa < 0.53 ? n % 2 === 1 : pa >= 0.56 && pa < 0.6) || pa < 0.16;
  schreib['tippt-a']?.classList.toggle('zeigen', da && unten);
  schreib['tippt-b']?.classList.toggle('zeigen', da && !unten);
  schreib.links?.classList.toggle('weg', !!(schreib['tippt-a'] && da));
  // zweite Büchse: steigt aus dem Rohrende, kurzes Zögern, dann schiesst sie nach oben hinaus (mit Lichtspur)
  const steigt = sanft(teil(pa, [0.68, 0.74]));
  const schuss = teil(pa, [0.75, 0.88]);
  const sy = ROHRENDE.y + 30 - 50 * steigt - 1500 * schuss * schuss;
  buechse2.setAttribute('transform', `translate(${ROHRENDE.x} ${sy.toFixed(1)})`);
  buechse2.setAttribute('opacity', aktiv && pa > 0.68 && schuss < 1 ? '1' : '0');
  rausLicht.setAttribute('transform', `translate(${ROHRENDE.x} ${(sy + 20).toFixed(1)})`);
  rausLicht.setAttribute('height', String(Math.max(0, Math.min(420, ROHRENDE.y - sy - 20)).toFixed(0)));
  rausLicht.setAttribute('opacity', aktiv && schuss > 0 ? String((1 - glatt(teil(pa, [0.86, 0.94]))).toFixed(3)) : '0');
  if (!aktiv) return null;
  return { x: ROHRENDE.x, y: Math.max(500, sy) };
}

// Messingschilder unter den Trichtern (oben in jedem Fach), Regal-Koordinaten 680 × 893 → Rahmen
function schilderBauen(rg) {
  const k = rg.w / 680;
  const mitten = [129, 269, 410, 549];
  for (const [wort, n] of SCHILDER) {
    const cx = rg.x + mitten[n % 4] * k;
    const cy = rg.y + (n < 4 ? 258 : 600) * k;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'k2-schild');
    g.setAttribute('transform', `translate(${cx} ${cy})`);
    g.innerHTML = `<rect x="-46" y="-12" width="92" height="24" rx="5"/><text y="5">${wort}</text>`;
    schilder.appendChild(g);
    if (n === 0) dringend = g;
  }
}

const STATIONEN = [
  // [A] Platzhalter bis zum Textinterview, erklärender zum Mitlesen (Mattia 01.11.)
  { nr: 'I', titel: 'Anfrage kommt an', satz: '21:47. Frau Meier schreibt über die Website. Im Büro ist niemand mehr.' },
  { nr: 'II', titel: 'gelesen', satz: '21:48. Die Helfer lesen sofort mit und erkennen: Boiler, Kriens, eilt.' },
  { nr: 'II', titel: 'gelesen', satz: 'Per Rohrpost geht die Anfrage weiter zum Sortieren.' },
  { nr: 'III', titel: 'sortiert', satz: 'Tropfender Boiler heisst: dringend. Die Anfrage kommt nach vorne.' },
  { nr: 'IV', titel: 'beantwortet', satz: '21:50. Die Antwort haben Sie vorher festgelegt. Sie geht sofort raus.' },
];
let stationJetzt;
let stationUhr = 0;
function stationZeigen(st) {
  if (st === stationJetzt) return;
  stationJetzt = st;
  clearTimeout(stationUhr);
  const setzen = () => {
    stationText.querySelector('.nr').textContent = st ? st.nr : '';
    stationText.querySelector('b').textContent = st ? st.titel : '';
    stationText.querySelector('.satz').textContent = st ? st.satz : '';
    stationText.classList.remove('wechselt');
  };
  if (!st || !stationText.querySelector('b').textContent) { setzen(); return; }
  stationText.classList.add('wechselt');
  stationUhr = setTimeout(setzen, RUHIG ? 120 : 350);
}

let laeuft = false;
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; groesse(); requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: '40% 0px' }).observe(bahn);
