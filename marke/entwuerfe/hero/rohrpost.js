// Kapitel II, Papier: „Plan der Rohrpost-Zentrale“ (Drehbuch 12; Fassung 2, 02.11.2026).
// Mattia: Pastell-Vektor-Stil bleibt, aber nicht mehr prototyp-mässig. Gewählt: 1 (Frau Meiers Büchse mit Uhrzeiten),
// 2 (vier Schritte), 11 (Plan zeichnet sich am Scroll), 13 (Rohrpost lebt); 15 und 16 folgen.
// Ablauf am Scroll der .k2-plan-bahn (t = 0 beim Hereinkommen, 1 am Ende der Bahn):
//   0.34–0.56  Plan zeichnet sich: Rahmen, Rohre wie mit der Feder, Zentrale, Ein- und Ausgänge
//   0.56–0.96  Frau Meiers pinke Büchse: Formular 21:47 → Lesen → Sortieren → Antworten → Eintragen → Antwort + Termin
// Danach und dazwischen fahren leise andere Büchsen (13).
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const svg = document.getElementById('k2Grafik');
const bahn = svg.closest('.k2-plan-bahn');

function el(tag, attr = {}, eltern = svg, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  eltern.appendChild(e);
  return e;
}
const g = (attr, eltern = svg) => el('g', attr, eltern);
const klemme = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const teil = (t, a, b) => klemme((t - a) / (b - a));
const sanft = (x) => 1 - Math.pow(1 - x, 3);

const F = {
  papier: '#FCF6EE', creme: '#FBF3EA', gold: '#E3C58A', goldHell: '#F6E7C1', goldDunkel: '#B9965C', tinte: '#8C7650',
  text: '#231B3A', pink: '#FF9DC8', pinkHell: '#FFD3E6', pinkDunkel: '#C2557F', flieder: '#D9CCF5', fliederHell: '#ECE5FB',
  fliederDunkel: '#9C88CF', holz: '#EFE2CD', holzDunkel: '#D8C3A0',
};

// ---------- Defs: Schatten, Raster, Büchsen-Verlauf ----------
const defs = el('defs');
defs.innerHTML = `
  <filter id="rpSchatten" x="-20%" y="-20%" width="140%" height="160%">
    <feDropShadow dx="0" dy="3" stdDeviation="3.2" flood-color="#6E5634" flood-opacity=".16"/>
  </filter>
  <filter id="rpGlut" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="5"/>
  </filter>
  <pattern id="rpRaster" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="10" cy="10" r=".9" fill="${F.gold}" opacity=".55"/>
  </pattern>
  <linearGradient id="rpPink" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${F.pinkHell}"/><stop offset=".55" stop-color="${F.pink}"/><stop offset="1" stop-color="#E77DAA"/>
  </linearGradient>
  <linearGradient id="rpGold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${F.goldHell}"/><stop offset=".55" stop-color="${F.gold}"/><stop offset="1" stop-color="${F.goldDunkel}"/>
  </linearGradient>
  <linearGradient id="rpFlieder" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${F.fliederHell}"/><stop offset="1" stop-color="${F.flieder}"/>
  </linearGradient>
  <linearGradient id="rpHolz" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F6ECDC"/><stop offset="1" stop-color="${F.holz}"/>
  </linearGradient>
  <radialGradient id="rpMuendung"><stop offset=".45" stop-color="#7C6340"/><stop offset="1" stop-color="${F.goldDunkel}"/></radialGradient>`;

// ---------- Blatt: Grund, Raster, Doppelrahmen mit Eckzier ----------
const blatt = g({ class: 'rp-blatt' });
el('rect', { x: 8, y: 8, width: 984, height: 544, rx: 22, fill: F.papier, stroke: F.gold, 'stroke-width': 2 }, blatt);
el('rect', { x: 20, y: 20, width: 960, height: 520, rx: 14, fill: 'url(#rpRaster)', opacity: '.5' }, blatt);
el('rect', { x: 20, y: 20, width: 960, height: 520, rx: 14, fill: 'none', stroke: F.gold, 'stroke-width': 0.8 }, blatt);
// Eckzier: kleine Volute in jeder Ecke, gezeichnet wie der Rest
[[20, 20, 1, 1], [980, 20, -1, 1], [20, 540, 1, -1], [980, 540, -1, -1]].forEach(([x, y, sx, sy]) => {
  el('path', {
    d: 'M10 34 C10 18 18 10 34 10 M16 40 C16 26 24 18 40 16 M34 10 C42 10 46 16 42 21 C39 25 34 22 36 18',
    transform: `translate(${x} ${y}) scale(${sx} ${sy})`, fill: 'none', stroke: F.gold, 'stroke-width': 1.1, 'stroke-linecap': 'round',
    class: 'rp-zeichnen', pathLength: 1,
  }, blatt);
});

// Titel-Band: geschwungene Kartusche mit eingerollten Enden
const titel = g({ class: 'rp-auf', style: '--v:0' });
el('path', { d: 'M318 70 L300 58 L322 54 L318 70 Z M682 70 L700 58 L678 54 L682 70 Z', fill: F.goldHell, stroke: F.goldDunkel, 'stroke-width': 1, 'stroke-linejoin': 'round' }, titel);
el('path', { d: 'M322 50 Q500 34 678 50 L678 82 Q500 66 322 82 Z', fill: F.creme, stroke: F.gold, 'stroke-width': 1.6, filter: 'url(#rpSchatten)' }, titel);
el('path', { d: 'M330 55 Q500 40 670 55 M330 77 Q500 62 670 77', fill: 'none', stroke: F.gold, 'stroke-width': 0.6, opacity: '.8' }, titel);
el('text', { x: 500, y: 70, 'text-anchor': 'middle', class: 'rp-titel' }, titel, 'Plan der Rohrpost-Zentrale');

// ---------- Geometrie ----------
const Z = { x: 360, y: 196, b: 280, h: 196 };        // Schrank der Zentrale
const KAMMER = { b: 52, abst: 12, y: Z.y + 48, h: 98 };
const KX = (i) => Z.x + 18 + i * (KAMMER.b + KAMMER.abst); // linke Kante Kammer i
const MITTE_Y = 296;                                    // Lauflinie durch die Kammern
const EIN = [
  { name: 'E-Mail', y: 136, zu: 266, symbol: 'brief' },
  { name: 'Formular', y: 282, zu: MITTE_Y, symbol: 'formular' },
  { name: 'Telefon', y: 428, zu: 326, symbol: 'telefon' },
];
const AUS = [
  { name: 'Antwort', y: 122, von: 232, bsp: '„Wir kommen morgen um 8 Uhr.“' },
  { name: 'Termin', y: 206, von: 264, bsp: 'Do 08:00 · Boiler' },
  { name: 'Offerte', y: 290, von: 296 },
  { name: 'Rückruf', y: 374, von: 328 },
  { name: 'Rechnung', y: 458, von: 360 },
];
const MUND_X = 766;
const SCHRITTE = ['Lesen', 'Sortieren', 'Antworten', 'Eintragen'];
const ZEITEN = ['21:48', '21:49', '21:50', '21:51'];

// ---------- Rohre: Schatten, Messing-Körper, Glaskanal, Glanzlinie, Muffen ----------
const rohrLage = g({ class: 'rp-rohre' });
const rohre = [];
function rohr(d, art, name) {
  const gr = g({ class: `rp-rohr-gruppe rp-${art}` }, rohrLage);
  el('path', { d, class: 'rp-rohr-schatten rp-zeichnen', pathLength: 1 }, gr);
  el('path', { d, class: 'rp-rohr rp-zeichnen', pathLength: 1 }, gr);
  el('path', { d, class: 'rp-rohr-kanal rp-zeichnen', pathLength: 1 }, gr);
  const glanz = el('path', { d, class: 'rp-rohr-glanz rp-zeichnen', pathLength: 1 }, gr);
  // Muffen bei 30 % und 70 % der Länge, quer zur Laufrichtung
  const L = glanz.getTotalLength();
  const muffen = [0.3, 0.7].map((f) => {
    const p = glanz.getPointAtLength(L * f), q = glanz.getPointAtLength(Math.min(L, L * f + 1));
    const w = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    return el('rect', { x: -2.5, y: -8, width: 5, height: 16, rx: 1.5, fill: 'url(#rpGold)', stroke: F.goldDunkel, 'stroke-width': 0.7, transform: `translate(${p.x} ${p.y}) rotate(${w})`, class: 'rp-muffe' }, gr);
  });
  const r = { d, art, name, pfad: glanz, L, gruppe: gr, muffen };
  rohre.push(r);
  return r;
}

// Eingänge: Medaillon mit gezeichnetem Symbol, Messing-Trichter, Rohr zur Zentrale
const SYMBOL = {
  brief: '<rect x="-10" y="-7" width="20" height="14" rx="2"/><path d="M-10 -6 L0 2 L10 -6"/>',
  formular: '<rect x="-8" y="-10" width="16" height="20" rx="2"/><path d="M-4.5 -4.5 H4.5 M-4.5 0 H4.5 M-4.5 4.5 H1"/>',
  telefon: '<path d="M-7 -9 C-9 -9 -10 -7 -10 -5 C-10 4 -4 10 5 10 C7 10 9 9 9 7 L9 4 L4 2 L2 4 C-1 3 -3 1 -4 -2 L-2 -4 L-4 -9 Z"/>',
};
EIN.forEach((e, i) => {
  const gr = g({ class: 'rp-auf rp-eingang', style: `--v:${0.1 + i * 0.06}` });
  el('circle', { cx: 92, cy: e.y, r: 25, fill: 'url(#rpFlieder)', stroke: F.gold, 'stroke-width': 1.6, filter: 'url(#rpSchatten)' }, gr);
  el('circle', { cx: 92, cy: e.y, r: 20.5, fill: 'none', stroke: F.creme, 'stroke-width': 1, opacity: '.9' }, gr);
  const s = el('g', { transform: `translate(92 ${e.y})`, fill: 'none', stroke: F.text, 'stroke-width': 1.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gr);
  s.innerHTML = SYMBOL[e.symbol];
  el('text', { x: 92, y: e.y + 46, 'text-anchor': 'middle', class: 'rp-name' }, gr, e.name);
  // Trichter: Messing-Glocke, öffnet nach links
  el('path', { d: `M130 ${e.y - 17} Q146 ${e.y - 8} 160 ${e.y - 6} L160 ${e.y + 6} Q146 ${e.y + 8} 130 ${e.y + 17} Z`, fill: 'url(#rpGold)', stroke: F.goldDunkel, 'stroke-width': 1, filter: 'url(#rpSchatten)' }, gr);
  el('ellipse', { cx: 130, cy: e.y, rx: 4, ry: 17, fill: 'url(#rpMuendung)', stroke: F.goldDunkel, 'stroke-width': 1 }, gr);
  e.rohr = rohr(`M160 ${e.y} C 262 ${e.y}, 262 ${e.zu}, ${Z.x} ${e.zu}`, 'ein', e.name);
});

// Ausgänge: Rohr aus der Zentrale, runde Messing-Mündung, Name und (für Frau Meier) Beispiel
AUS.forEach((a, i) => {
  a.rohr = rohr(`M${Z.x + Z.b} ${a.von} C 712 ${a.von}, 712 ${a.y}, ${MUND_X - 12} ${a.y}`, 'aus', a.name);
  const gr = g({ class: 'rp-auf rp-ausgang', style: `--v:${0.3 + i * 0.05}`, 'data-name': a.name });
  el('circle', { cx: MUND_X, cy: a.y, r: 13, fill: 'url(#rpGold)', stroke: F.goldDunkel, 'stroke-width': 1, filter: 'url(#rpSchatten)' }, gr);
  el('circle', { cx: MUND_X, cy: a.y, r: 7, fill: 'url(#rpMuendung)' }, gr);
  a.glut = el('circle', { cx: MUND_X, cy: a.y, r: 16, fill: F.pink, filter: 'url(#rpGlut)', class: 'rp-glut', opacity: 0 }, gr);
  el('text', { x: MUND_X + 24, y: a.y + 5, class: 'rp-name' }, gr, a.name);
  if (a.bsp) a.bspEl = el('text', { x: MUND_X + 24, y: a.y + 23, class: 'rp-bsp', opacity: 0 }, gr, a.bsp);
});

// ---------- Zentrale: Schrank mit Giebel, Trichter, vier Kammern mit Messingschildern ----------
const zentrale = g({ class: 'rp-auf rp-zentrale', style: '--v:.2' });
// Trichter oben (aus Station III), sitzt auf dem Giebel
el('path', { d: `M${Z.x + Z.b / 2 - 12} ${Z.y - 30} L${Z.x + Z.b / 2 - 22} ${Z.y - 54} L${Z.x + Z.b / 2 + 22} ${Z.y - 54} L${Z.x + Z.b / 2 + 12} ${Z.y - 30} Z`, fill: 'url(#rpGold)', stroke: F.goldDunkel, 'stroke-width': 1, 'stroke-linejoin': 'round' }, zentrale);
el('ellipse', { cx: Z.x + Z.b / 2, cy: Z.y - 54, rx: 22, ry: 4, fill: 'url(#rpMuendung)', stroke: F.goldDunkel, 'stroke-width': 1 }, zentrale);
el('rect', { x: Z.x + Z.b / 2 - 7, y: Z.y - 32, width: 14, height: 14, fill: 'url(#rpGold)', stroke: F.goldDunkel, 'stroke-width': 1 }, zentrale);
// Korpus mit Segmentgiebel
el('path', {
  d: `M${Z.x} ${Z.y + 22} Q${Z.x} ${Z.y + 10} ${Z.x + 12} ${Z.y + 10} L${Z.x + Z.b / 2 - 50} ${Z.y + 10} Q${Z.x + Z.b / 2} ${Z.y - 22} ${Z.x + Z.b / 2 + 50} ${Z.y + 10} L${Z.x + Z.b - 12} ${Z.y + 10} Q${Z.x + Z.b} ${Z.y + 10} ${Z.x + Z.b} ${Z.y + 22} L${Z.x + Z.b} ${Z.y + Z.h - 12} Q${Z.x + Z.b} ${Z.y + Z.h} ${Z.x + Z.b - 12} ${Z.y + Z.h} L${Z.x + 12} ${Z.y + Z.h} Q${Z.x} ${Z.y + Z.h} ${Z.x} ${Z.y + Z.h - 12} Z`,
  fill: 'url(#rpHolz)', stroke: F.tinte, 'stroke-width': 1.3, filter: 'url(#rpSchatten)',
}, zentrale);
el('path', { d: `M${Z.x + 8} ${Z.y + 30} H${Z.x + Z.b - 8}`, stroke: F.holzDunkel, 'stroke-width': 1 }, zentrale);
el('circle', { cx: Z.x + Z.b / 2, cy: Z.y + 8, r: 5, fill: F.pinkHell, stroke: F.tinte, 'stroke-width': 0.9 }, zentrale);
// Sammelrohr hinter den Kammern
el('path', { d: `M${Z.x} ${MITTE_Y} H${Z.x + Z.b}`, stroke: F.goldDunkel, 'stroke-width': 4, opacity: '.35' }, zentrale);
const kammern = SCHRITTE.map((name, i) => {
  const x = KX(i), y = KAMMER.y, b = KAMMER.b, h = KAMMER.h;
  const k = g({ class: 'rp-kammer' }, zentrale);
  const glas = el('path', { d: `M${x} ${y + h} V${y + b / 2} A${b / 2} ${b / 2} 0 0 1 ${x + b} ${y + b / 2} V${y + h} Z`, fill: 'url(#rpFlieder)', stroke: F.tinte, 'stroke-width': 0.9 }, k);
  el('path', { d: `M${x + 7} ${y + h - 6} V${y + b / 2 + 2}`, stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: '.55' }, k);
  // Messingschild
  el('rect', { x: x - 5, y: y + h + 10, width: b + 10, height: 15, rx: 3, fill: 'url(#rpGold)', stroke: F.goldDunkel, 'stroke-width': 0.8 }, k);
  el('text', { x: x + b / 2, y: y + h + 20.6, 'text-anchor': 'middle', class: 'rp-schild' }, k, name);
  const zeit = el('text', { x: x + b / 2, y: y + h + 40, 'text-anchor': 'middle', class: 'rp-zeit', opacity: 0 }, k, ZEITEN[i]);
  return { glas, zeit, mitte: x + b / 2 };
});
el('text', { x: Z.x + Z.b / 2, y: Z.y + Z.h + 26, 'text-anchor': 'middle', class: 'rp-klein' }, zentrale, 'Zentrale · nachts besetzt von vier Putti');

// ---------- Legende und Massstab ----------
const fuss = g({ class: 'rp-auf', style: '--v:.45' });
function kapsel(farbe, eltern, x = 0, y = 0) {
  const k = g({ transform: `translate(${x} ${y})` }, eltern);
  el('rect', { x: -10, y: -5.5, width: 20, height: 11, rx: 5.5, fill: `url(#rp${farbe})`, stroke: farbe === 'Pink' ? F.pinkDunkel : F.goldDunkel, 'stroke-width': 0.9 }, k);
  el('rect', { x: 3, y: -5.5, width: 2.4, height: 11, fill: farbe === 'Pink' ? F.pinkDunkel : F.goldDunkel, opacity: '.55' }, k);
  return k;
}
kapsel('Pink', fuss, 74, 508);
el('text', { x: 92, y: 512, class: 'rp-legende' }, fuss, 'Anfrage');
kapsel('Gold', fuss, 174, 508);
el('text', { x: 192, y: 512, class: 'rp-legende' }, fuss, 'Ergebnis');
// Massstab: eine Nacht, Mond bis Sonne
el('path', { d: 'M812 512 H932 M812 507 V517 M872 509 V515 M932 507 V517', stroke: F.tinte, 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round' }, fuss);
el('path', { d: 'M798 504 A6 6 0 1 0 804 516 A4.6 4.6 0 1 1 798 504 Z', fill: F.flieder, stroke: F.tinte, 'stroke-width': 0.8 }, fuss);
el('circle', { cx: 946, cy: 512, r: 4, fill: F.goldHell, stroke: F.tinte, 'stroke-width': 0.8 }, fuss);
el('path', { d: 'M946 503 V505 M946 519 V521 M937 512 H939 M953 512 H955', stroke: F.tinte, 'stroke-width': 0.8, 'stroke-linecap': 'round' }, fuss);
el('text', { x: 872, y: 497, 'text-anchor': 'middle', class: 'rp-klein' }, fuss, 'höchstens eine Nacht');

// ---------- Büchsen ----------
const buechsenLage = g({ class: 'rp-buechsen' });
// Leise Rohrpost (13): eine Büchse je Rohr, eigene Geschwindigkeit, nur wenn der Plan gezeichnet ist
const leise = rohre.map((r, i) => ({
  r, k: kapsel(r.art === 'ein' ? 'Pink' : 'Gold', buechsenLage), dauer: r.art === 'ein' ? 4.2 : 3.4, versatz: (i * 0.37) % 1,
}));
leise.forEach((b) => b.k.classList.add('rp-leise'));

// Frau Meiers Büchse (1): grösser, mit Fähnchen
const meier = g({ class: 'rp-meier', opacity: 0 }, buechsenLage);
const meierK = g({}, meier);
el('rect', { x: -13, y: -7, width: 26, height: 14, rx: 7, fill: 'url(#rpPink)', stroke: F.pinkDunkel, 'stroke-width': 1.1 }, meierK);
el('rect', { x: 4, y: -7, width: 3, height: 14, fill: F.pinkDunkel, opacity: '.6' }, meierK);
const fahne = g({ transform: 'translate(0 -16)' }, meier);
el('rect', { x: -66, y: -26, width: 132, height: 22, rx: 11, fill: F.creme, stroke: F.pink, 'stroke-width': 1.2, filter: 'url(#rpSchatten)' }, fahne);
el('path', { d: 'M-5 -4.6 L0 2 L5 -4.6', fill: F.creme, stroke: F.pink, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, fahne);
el('rect', { x: -6, y: -6, width: 12, height: 3, fill: F.creme }, fahne);
const fahneText = el('text', { x: 0, y: -11, 'text-anchor': 'middle', class: 'rp-fahne' }, fahne, '21:47 · Boiler tropft');
// Ergebnis-Büchsen für Antwort und Termin
const ergebnis = [AUS[0], AUS[1]].map((a) => ({ a, k: kapsel('Gold', buechsenLage) }));
ergebnis.forEach((e) => e.k.setAttribute('opacity', 0));

// Weg der Meier-Büchse: Formular-Rohr, dann gerade durch die vier Kammern
const formular = EIN[1].rohr;
function meierPunkt(f) {
  // f 0–0.3 Rohr, 0.3–1 Kammern (mit Halt an jeder Kammer)
  if (f < 0.3) { const p = formular.pfad.getPointAtLength(formular.L * sanft(f / 0.3)); return { x: p.x, y: p.y, kammer: -1 }; }
  const g2 = (f - 0.3) / 0.7;                          // 0–1 über die Kammern
  const seg = Math.min(3, Math.floor(g2 * 4)), lok = g2 * 4 - seg;
  const von = seg === 0 ? Z.x : kammern[seg - 1].mitte, nach = kammern[seg].mitte;
  const fahr = klemme(lok / 0.55);                     // 55 % fahren, 45 % halten
  return { x: von + (nach - von) * sanft(fahr), y: MITTE_Y, kammer: fahr >= 1 ? seg : seg - 1 };
}

function setzeKapsel(k, r, f) {
  const L = r.L, p = r.pfad.getPointAtLength(L * f), q = r.pfad.getPointAtLength(Math.min(L, L * f + 1));
  const w = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
  k.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${w.toFixed(1)})`);
}

// ---------- Ablauf am Scroll ----------
let t = 0, zuletzt = -1;
function fortschritt() {
  const r = bahn.getBoundingClientRect();
  return klemme((innerHeight - r.top) / r.height);
}
function zeichne(tt) {
  const z = RUHIG ? 1 : teil(tt, 0.34, 0.56);
  svg.style.setProperty('--z', z.toFixed(3));
  // Rohre einzeln gestaffelt, wie mit der Feder: Eingänge zuerst, dann Ausgänge
  rohre.forEach((r, i) => {
    const a = r.art === 'ein' ? 0.12 + i * 0.07 : 0.42 + (i - 3) * 0.06;
    const f = sanft(teil(z, a, a + 0.32));
    r.gruppe.style.setProperty('--d', (1 - f).toFixed(3));
    r.muffen.forEach((m) => m.setAttribute('opacity', f > 0.95 ? 1 : 0));
  });
  svg.querySelectorAll('.rp-blatt .rp-zeichnen').forEach((p) => p.style.setProperty('--d', (1 - sanft(teil(z, 0, 0.4))).toFixed(3)));
  svg.querySelectorAll('.rp-auf').forEach((n) => {
    const v = +n.style.getPropertyValue('--v');
    const f = sanft(teil(z, v, v + 0.3));
    n.style.opacity = f.toFixed(3);
    n.style.transform = `translateY(${((1 - f) * 8).toFixed(2)}px)`;
  });
  svg.classList.toggle('gezeichnet', z >= 1);

  // Frau Meier
  const m = RUHIG ? 1 : teil(tt, 0.56, 0.88);
  const raus = RUHIG ? 1 : teil(tt, 0.88, 0.96);
  const aktiv = m > 0 && raus < 1;
  meier.setAttribute('opacity', aktiv ? Math.min(1, m * 12) * (1 - raus) : 0);
  const p = meierPunkt(m);
  meier.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  kammern.forEach((k, i) => {
    const an = p.kammer >= i && m > 0;
    k.glas.setAttribute('fill', p.kammer === i && raus < 1 ? F.pinkHell : 'url(#rpFlieder)');
    k.zeit.setAttribute('opacity', an ? 1 : 0);
  });
  fahneText.textContent = p.kammer < 0 ? '21:47 · Boiler tropft' : `${ZEITEN[p.kammer]} · ${SCHRITTE[p.kammer]}`;
  // Ergebnis: zwei goldene Büchsen fahren hinaus, Mündungen glühen, Beispiele erscheinen
  ergebnis.forEach(({ a, k }, i) => {
    const f = sanft(teil(raus, i * 0.15, 0.85 + i * 0.15));
    k.setAttribute('opacity', raus > 0 && f < 1 ? 1 : 0);
    if (raus > 0) setzeKapsel(k, a.rohr, f);
    a.glut.setAttribute('opacity', (f >= 1 ? 0.3 : 0).toString());
    a.bspEl.setAttribute('opacity', f >= 1 ? 1 : 0);
  });
  svg.classList.toggle('meier-laeuft', aktiv);
}

// Leise Rohrpost: zeitbasiert, pausiert während Frau Meier unterwegs ist (Ruhe für den roten Faden)
let tLeise = 0, letzteZeit = performance.now();
function tick(jetzt) {
  const dt = Math.min(0.05, (jetzt - letzteZeit) / 1000);
  letzteZeit = jetzt;
  t = fortschritt();
  if (Math.abs(t - zuletzt) > 0.0005) { zeichne(t); zuletzt = t; }
  const sichtbar = svg.classList.contains('gezeichnet') && !svg.classList.contains('meier-laeuft');
  if (!RUHIG && sichtbar) tLeise += dt;
  leise.forEach((b) => {
    if (!sichtbar || RUHIG) { b.k.setAttribute('opacity', 0); return; }
    const f = ((tLeise / b.dauer) + b.versatz) % 1;
    b.k.setAttribute('opacity', Math.min(1, f * 10, (1 - f) * 10).toFixed(2));
    setzeKapsel(b.k, b.r, f);
  });
  if (nah) requestAnimationFrame(tick); else laeuft = false;
}

// Nur rechnen, wenn die Bahn in der Nähe ist
let laeuft = false, nah = false;
new IntersectionObserver(([e]) => {
  nah = e.isIntersecting;
  if (nah && !laeuft) { laeuft = true; letzteZeit = performance.now(); requestAnimationFrame(tick); }
}, { rootMargin: '50% 0px' }).observe(bahn);
zeichne(RUHIG ? 1 : 0);
