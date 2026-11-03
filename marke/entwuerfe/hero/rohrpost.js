// Kapitel II, Papier: „Plan der Rohrpost-Zentrale“ (Drehbuch 12; Fassung 3, 02.11.2026).
// Mattia: eine Grafik bleiben, keine Schein-3D-Verläufe; mit wenig Farben viel Tiefe, über Bewegung und 2.5D.
// Darum: flache Formen in sechs Farben, verteilt auf vier echte Ebenen (je ein SVG mit gleicher viewBox):
//   0 Blatt (Raster, Rahmen, Legende) · 1 Rohre und Büchsen · 2 Bauten (Zentrale, Ein-/Ausgänge, Titel) · 3 Fähnchen
// Tiefe entsteht durch Abstand zwischen den Ebenen: beim Hereinscrollen liegt der Plan gekippt wie auf einem Tisch,
// die Ebenen schweben auseinander und setzen sich ab (explodierte Ansicht); danach weichen sie der Maus verschieden
// stark aus, ihr flacher Schatten wandert mit. Gewählt: 1, 2, 11, 13, 15 (16 folgt).
// Nachbesserung 02.11. nach Kritik (Claude + Codex 5/10): Scheinwerfer auf Frau Meiers Weg, Symbole in den Kammern,
// grössere Schrift, Zeiger im Massstab, Trichter weg, eine Muffe je Rohr, mehr Abstand, stärkere Maus-Tiefe.
// Scroll t über die .k2-plan-bahn (0 beim Hereinkommen, 1 am Ende):
//   0.22–0.50 Ebenen setzen sich, 0.30–0.52 Rohre zeichnen sich wie mit der Feder
//   0.56–0.88 Frau Meiers pinke Büchse: Formular 21:47 → Lesen → Sortieren → Antworten → Eintragen
//   0.88–0.96 zwei goldene Büchsen fahren zu Antwort und Termin
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(pointer: fine)').matches;
const NS = 'http://www.w3.org/2000/svg';
const basis = document.getElementById('k2Grafik');
const bahn = basis.closest('.k2-plan-bahn');

const F = {
  papier: '#FCF6EE', gold: '#E3C58A', goldDunkel: '#B9965C', tinte: '#8C7650', text: '#231B3A',
  flieder: '#D9CCF5', pink: '#FF9DC8', pinkDunkel: '#C2557F', schatten: '#E6D3B1',
};

// ---------- Ebenen ----------
const stapel = document.createElement('div');
stapel.className = 'rp-stapel';
basis.before(stapel);
stapel.append(basis);
basis.classList.add('rp-ebene');
const ebenen = [basis];
for (let i = 1; i < 4; i++) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 1000 560');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', 'k2-grafik rp-ebene');
  stapel.append(s);
  ebenen.push(s);
}
const [L0, L1, L2, L3] = ebenen;

function el(tag, attr = {}, eltern, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  eltern.appendChild(e);
  return e;
}
const g = (attr, eltern) => el('g', attr, eltern);
const klemme = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const teil = (t, a, b) => klemme((t - a) / (b - a));
const sanft = (x) => 1 - Math.pow(1 - x, 3);
const weich = (x) => x * x * (3 - 2 * x);

// ---------- Ebene 0: Blatt ----------
const defs = el('defs', {}, L0);
defs.innerHTML = `<pattern id="rpRaster" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".9" fill="${F.gold}"/></pattern>`;
el('rect', { x: 8, y: 8, width: 984, height: 544, rx: 22, fill: F.papier, stroke: F.gold, 'stroke-width': 2 }, L0);
el('rect', { x: 20, y: 20, width: 960, height: 520, rx: 14, fill: 'url(#rpRaster)', opacity: '.45' }, L0);
el('rect', { x: 20, y: 20, width: 960, height: 520, rx: 14, fill: 'none', stroke: F.gold, 'stroke-width': 0.8 }, L0);
function kapsel(art, eltern, gross = false) {
  const k = g({}, eltern);
  const [b, h] = gross ? [26, 14] : [20, 11];
  const voll = art === 'pink' ? F.pink : F.gold, rand = art === 'pink' ? F.pinkDunkel : F.goldDunkel;
  el('rect', { x: -b / 2, y: -h / 2, width: b, height: h, rx: h / 2, fill: voll, stroke: rand, 'stroke-width': 1 }, k);
  el('rect', { x: b * 0.14, y: -h / 2, width: b * 0.12, height: h, fill: rand }, k);
  return k;
}
// Schriftfeld unten wie auf einem Bauplan: Legende · Massstab · Blatt und Signatur
const FUSS = 492, ZEILE = 520;
el('path', { d: `M20 ${FUSS} H980 M316 ${FUSS} V540 M652 ${FUSS} V540`, stroke: F.gold, 'stroke-width': 0.8, fill: 'none' }, L0);
kapsel('pink', L0).setAttribute('transform', `translate(52 ${ZEILE - 4})`);
el('text', { x: 70, y: ZEILE, class: 'rp-legende' }, L0, 'Anfrage');
kapsel('gold', L0).setAttribute('transform', `translate(158 ${ZEILE - 4})`);
el('text', { x: 176, y: ZEILE, class: 'rp-legende' }, L0, 'Ergebnis');
el('text', { x: 340, y: ZEILE, class: 'rp-klein' }, L0, 'Massstab 1 : 1 Nacht');
// Massstabsbalken: fünf Felder abwechselnd voll und leer, Enden beschriftet
for (let i = 0; i < 5; i++) {
  el('rect', { x: 476 + i * 28, y: ZEILE - 13, width: 28, height: 6, fill: i % 2 ? F.papier : F.gold, stroke: F.goldDunkel, 'stroke-width': 0.8 }, L0);
}
const skala21 = el('text', { x: 476, y: ZEILE + 8, 'text-anchor': 'middle', class: 'rp-skala' }, L0, '21 h');
const zeiger = g({ opacity: 0 }, L0);
el('path', { d: `M0 ${ZEILE - 17} V${ZEILE - 3}`, stroke: F.pinkDunkel, 'stroke-width': 2, 'stroke-linecap': 'round' }, zeiger);
el('path', { d: `M-4 ${ZEILE - 21} H4 L0 ${ZEILE - 16} Z`, fill: F.pinkDunkel }, zeiger);
const zeigerText = el('text', { x: 0, y: ZEILE + 8, 'text-anchor': 'start', class: 'rp-skala rp-skala-pink' }, zeiger, '');
const SKALA = (min) => 476 + (min / 600) * 140;
el('text', { x: 616, y: ZEILE + 7, 'text-anchor': 'middle', class: 'rp-skala' }, L0, '07 h');
el('text', { x: 676, y: ZEILE, class: 'rp-legende' }, L0, 'Blatt II · Automation');
el('text', { x: 956, y: ZEILE + 1, 'text-anchor': 'end', class: 'rp-signatur' }, L0, 'gez. Mattia');

// ---------- Geometrie ----------
const Z = { x: 360, y: 196, b: 280, h: 196 };
const KAMMER = { b: 52, abst: 12, y: Z.y + 48, h: 98 };
const KX = (i) => Z.x + 18 + i * (KAMMER.b + KAMMER.abst);
const MITTE_Y = 296;
const EIN = [
  { name: 'E-Mail', y: 136, zu: 256, symbol: 'brief' },
  { name: 'Formular', y: 282, zu: MITTE_Y, symbol: 'formular' },
  { name: 'Telefon', y: 428, zu: 336, symbol: 'telefon' },
];
const AUS = [
  { name: 'Antwort', y: 122, von: 222, bsp: '„Wir kommen morgen um 8 Uhr.“' },
  { name: 'Termin', y: 206, von: 259, bsp: 'Do 08:00 · Boiler' },
  { name: 'Offerte', y: 290, von: 296, leise: true },
  { name: 'Rückruf', y: 374, von: 333, leise: true },
  { name: 'Rechnung', y: 458, von: 370, leise: true },
];
const MUND_X = 748;
const SCHRITTE = ['Lesen', 'Sortieren', 'Antworten', 'Eintragen'];
const ZEITEN = ['21:48', '21:49', '21:50', '21:51'];
// Gezeichnete Symbole je Schritt, gleicher Strich wie die Eingänge
const SCHRITT_SYMBOL = [
  '<path d="M-12 0 C-6 -8 6 -8 12 0 C6 8 -6 8 -12 0 Z"/><circle r="3.6"/>',
  '<rect x="-11" y="-11" width="22" height="6" rx="1.5"/><rect x="-11" y="-2.5" width="22" height="6" rx="1.5"/><rect x="-11" y="6" width="22" height="6" rx="1.5"/>',
  '<path d="M9 -12 C-1 -9 -7 -1 -8 9 C0 7 7 0 9 -12 Z M-8 9 L-10 13 M-3 3 L3 -3"/>',
  '<rect x="-10" y="-8" width="20" height="18" rx="2"/><path d="M-10 -2.5 H10 M-5 -11 V-5.5 M5 -11 V-5.5 M-4 4 L-1 7 L5 1"/>',
];

// ---------- Ebene 1: Rohre (drei flache Striche: Kante, Messing, Glaskanal) ----------
const rohre = [];
function rohr(d, art, dim = false) {
  const gr = g(dim ? { class: 'rp-rohr-gruppe', 'data-dim': '' } : { class: 'rp-rohr-gruppe' }, L1);
  el('path', { d, class: 'rp-rohr-kante rp-zeichnen', pathLength: 1 }, gr);
  const koerper = el('path', { d, class: 'rp-rohr rp-zeichnen', pathLength: 1 }, gr);
  el('path', { d, class: 'rp-rohr-kanal rp-zeichnen', pathLength: 1 }, gr);
  const L = koerper.getTotalLength();
  const muffen = [0.5].map((f) => {
    const p = koerper.getPointAtLength(L * f), q = koerper.getPointAtLength(Math.min(L, L * f + 1));
    const w = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    return el('rect', { x: -2.5, y: -8, width: 5, height: 16, rx: 1.5, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1, transform: `translate(${p.x} ${p.y}) rotate(${w})`, opacity: 0 }, gr);
  });
  const r = { art, pfad: koerper, L, gruppe: gr, muffen };
  rohre.push(r);
  return r;
}
EIN.forEach((e) => { e.rohr = rohr(`M160 ${e.y} C 262 ${e.y}, 262 ${e.zu}, ${Z.x} ${e.zu}`, 'ein', e.name !== 'Formular'); });
AUS.forEach((a) => { a.rohr = rohr(`M${Z.x + Z.b} ${a.von} C 700 ${a.von}, 700 ${a.y}, ${MUND_X - 12} ${a.y}`, 'aus', !!a.leise); });
const buechsenLage = g({}, L1);

// ---------- Ebene 2: Bauten ----------
// Titel: gesetzt wie auf einem Plan, darunter eine feine Linie mit Raute
el('text', { x: 500, y: 64, 'text-anchor': 'middle', class: 'rp-titel' }, L0, 'Plan der Rohrpost-Zentrale');
el('path', { d: 'M440 80 H494 M506 80 H560', stroke: F.gold, 'stroke-width': 1 }, L0);
el('path', { d: 'M500 76 L504 80 L500 84 L496 80 Z', fill: F.gold }, L0);

// Eingänge
const SYMBOL = {
  brief: '<rect x="-10" y="-7" width="20" height="14" rx="2"/><path d="M-10 -6 L0 2 L10 -6"/>',
  formular: '<rect x="-8" y="-10" width="16" height="20" rx="2"/><path d="M-4.5 -4.5 H4.5 M-4.5 0 H4.5 M-4.5 4.5 H1"/>',
  telefon: '<path d="M-7 -9 C-9 -9 -10 -7 -10 -5 C-10 4 -4 10 5 10 C7 10 9 9 9 7 L9 4 L4 2 L2 4 C-1 3 -3 1 -4 -2 L-2 -4 L-4 -9 Z"/>',
};
EIN.forEach((e) => {
  const dim = e.name !== 'Formular' ? { 'data-dim': '' } : {};
  const gr = g(dim, L2);
  el('circle', { cx: 92, cy: e.y, r: 25, fill: F.flieder, stroke: F.gold, 'stroke-width': 4 }, gr);
  el('circle', { cx: 92, cy: e.y, r: 27.5, fill: 'none', stroke: F.goldDunkel, 'stroke-width': 1 }, gr);
  const s = el('g', { transform: `translate(92 ${e.y})`, fill: 'none', stroke: F.text, 'stroke-width': 1.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gr);
  s.innerHTML = SYMBOL[e.symbol];
  el('text', { x: 92, y: e.y + 50, 'text-anchor': 'middle', class: 'rp-name', ...dim }, L0, e.name); // Schrift liegt auf dem Blatt, wirft keinen Schatten
  el('path', { d: `M130 ${e.y - 17} Q146 ${e.y - 8} 160 ${e.y - 6} L160 ${e.y + 6} Q146 ${e.y + 8} 130 ${e.y + 17} Z`, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1 }, gr);
  el('ellipse', { cx: 130, cy: e.y, rx: 4, ry: 17, fill: F.goldDunkel }, gr);
});

// Ausgänge
AUS.forEach((a) => {
  const dim = a.leise ? { 'data-dim': '' } : {};
  const gr = g({ class: a.leise ? 'rp-ausgang leise' : 'rp-ausgang', 'data-name': a.name, ...dim }, L2);
  a.ring = el('circle', { cx: MUND_X, cy: a.y, r: 13, fill: 'none', stroke: F.pink, 'stroke-width': 2, class: 'rp-ring' }, gr);
  el('circle', { cx: MUND_X, cy: a.y, r: 13, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1 }, gr);
  el('circle', { cx: MUND_X, cy: a.y, r: 6.5, fill: F.tinte }, gr);
  el('text', { x: MUND_X + 24, y: a.y + 5.5, class: a.leise ? 'rp-name leise' : 'rp-name', ...dim }, L0, a.name);
  if (a.bsp) a.bspEl = el('text', { x: MUND_X + 24, y: a.y + 25, class: 'rp-bsp', opacity: 0 }, L0, a.bsp);
});

// Hover (15): Maus auf einem Ausgang zeigt die passende Handy-Mitteilung, im gleichen Stil wie der Sperrbildschirm
// am Morgen (.k2-erl). Antwort und Termin sind die Mitteilungen aus der Szene; Offerte, Rückruf, Rechnung [A] Beispiele.
const MITTEILUNG = {
  Antwort: ['<span class="sym chat">●●●</span>', 'Nachrichten · 21:50', 'Antwort gesendet', '„Wir kommen morgen um 8&nbsp;Uhr.“'],
  Termin: ['<span class="sym kal"><b>DO</b>13</span>', 'Kalender · 21:51', 'Termin eingetragen', 'Do 08:00 · Boiler'],
  Offerte: ['<span class="sym">✎</span>', 'Offerten', 'Offerte vorbereitet', 'Badumbau · wartet auf Ihr OK'],
  Rückruf: ['<span class="sym">☎</span>', 'Telefon', 'Rückruf eingeplant', 'Morgen 09:30 · im Kalender'],
  Rechnung: ['<span class="sym rp-chf">CHF</span>', 'Buchhaltung', 'Rechnung verschickt', 'Nach dem Einsatz · mit QR-Code'],
};
const tafel = document.createElement('div');
tafel.className = 'rp-mitteilung';
tafel.setAttribute('aria-live', 'polite');
basis.closest('.k2-plan').append(tafel);
new ResizeObserver(([e]) => { tafel.style.fontSize = `${(e.contentRect.width / 1000) * 15}px`; }).observe(stapel);
let zeigt = null;
function zeige(a) {
  if (zeigt === a) return;
  zeigt?.gruppe.classList.remove('zeigt');
  zeigt = a;
  if (!a) { tafel.classList.remove('zeigen'); return; }
  const [sym, titel, was, wer] = MITTEILUNG[a.name];
  tafel.innerHTML = `<div class="k2-erl">${sym}<p class="titel">${titel}</p><p class="was">${was}</p><p class="wer">${wer}</p><span class="ok">✓</span></div>`;
  tafel.style.top = `${(Math.min(436, Math.max(a.y, 152)) / 560) * 100}%`; // nicht über Titel und Schriftfeld
  a.gruppe.classList.add('zeigt');
  tafel.classList.remove('zeigen');
  void tafel.offsetWidth; // neu einblenden, auch beim Wechsel von Ausgang zu Ausgang
  tafel.classList.add('zeigen');
}
AUS.forEach((a) => {
  a.gruppe = L2.querySelector(`.rp-ausgang[data-name="${a.name}"]`);
  const ziel = el('rect', { x: MUND_X - 22, y: a.y - 21, width: 232, height: 42, fill: 'transparent', class: 'rp-ziel' }, L0);
  ziel.addEventListener('pointerenter', () => basis.classList.contains('gezeichnet') && zeige(a));
  ziel.addEventListener('pointerleave', () => zeige(null));
  ziel.addEventListener('click', () => basis.classList.contains('gezeichnet') && zeige(zeigt === a ? null : a)); // Touch: Tippen
});

// Zentrale
const zentrale = g({}, L2);
const mx = Z.x + Z.b / 2;
el('path', {
  d: `M${Z.x} ${Z.y + 22} Q${Z.x} ${Z.y + 10} ${Z.x + 12} ${Z.y + 10} L${mx - 50} ${Z.y + 10} Q${mx} ${Z.y - 22} ${mx + 50} ${Z.y + 10} L${Z.x + Z.b - 12} ${Z.y + 10} Q${Z.x + Z.b} ${Z.y + 10} ${Z.x + Z.b} ${Z.y + 22} L${Z.x + Z.b} ${Z.y + Z.h} L${Z.x} ${Z.y + Z.h} Z`,
  fill: F.papier, stroke: F.tinte, 'stroke-width': 1.3,
}, zentrale);
el('path', { d: `M${Z.x + 8} ${Z.y + 30} H${Z.x + Z.b - 8}`, stroke: F.gold, 'stroke-width': 1 }, zentrale);
el('circle', { cx: mx, cy: Z.y + 8, r: 5, fill: F.pink, stroke: F.tinte, 'stroke-width': 0.9 }, zentrale);
el('rect', { x: Z.x - 6, y: Z.y + Z.h - 6, width: Z.b + 12, height: 12, rx: 3, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 1 }, zentrale);
el('path', { d: `M${Z.x} ${MITTE_Y} H${Z.x + Z.b}`, stroke: F.gold, 'stroke-width': 3 }, zentrale);
const kammern = SCHRITTE.map((name, i) => {
  const x = KX(i), y = KAMMER.y, b = KAMMER.b, h = KAMMER.h;
  const k = g({}, zentrale);
  const glas = el('path', { d: `M${x} ${y + h} V${y + b / 2} A${b / 2} ${b / 2} 0 0 1 ${x + b} ${y + b / 2} V${y + h} Z`, fill: F.flieder, stroke: F.gold, 'stroke-width': 3.5 }, k);
  el('path', { d: `M${x + 8} ${y + h - 8} V${y + b / 2 + 4}`, stroke: F.papier, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, k);
  const sym = el('g', { transform: `translate(${x + b / 2 + 2} ${y + h * 0.56})`, fill: 'none', stroke: F.text, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, k);
  sym.innerHTML = SCHRITT_SYMBOL[i];
  el('rect', { x: x - 6, y: y + h + 9, width: b + 12, height: 18, rx: 3, fill: F.gold, stroke: F.goldDunkel, 'stroke-width': 0.8 }, k);
  el('text', { x: x + b / 2, y: y + h + 21.4, 'text-anchor': 'middle', class: 'rp-schild' }, k, name);
  const zeit = el('text', { x: x + b / 2, y: y + h + 44, 'text-anchor': 'middle', class: 'rp-zeit', opacity: 0 }, k, ZEITEN[i]);
  return { glas, zeit, mitte: x + b / 2 };
});
el('text', { x: mx, y: Z.y + Z.h + 32, 'text-anchor': 'middle', class: 'rp-klein' }, L0, 'Zentrale · nachts besetzt von vier Putti');

// ---------- Büchsen (Ebene 1) und Fähnchen (Ebene 3) ----------
const leise = rohre.map((r, i) => ({ r, k: kapsel(r.art === 'ein' ? 'pink' : 'gold', buechsenLage), dauer: r.art === 'ein' ? 4.2 : 3.4, versatz: (i * 0.37) % 1 }));
const meier = kapsel('pink', buechsenLage, true);
const ergebnis = [AUS[0], AUS[1]].map((a) => ({ a, k: kapsel('gold', buechsenLage) }));
const fahne = g({ opacity: 0 }, L3);
el('rect', { x: -80, y: -52, width: 160, height: 26, rx: 13, fill: F.papier, stroke: F.pink, 'stroke-width': 1.4 }, fahne);
el('path', { d: 'M-5 -26.6 L0 -20 L5 -26.6', fill: F.papier, stroke: F.pink, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, fahne);
el('rect', { x: -6, y: -28, width: 12, height: 3, fill: F.papier }, fahne);
const fahneText = el('text', { x: 0, y: -34.5, 'text-anchor': 'middle', class: 'rp-fahne' }, fahne, '21:47 · Boiler tropft');
[meier, ...ergebnis.map((e) => e.k), ...leise.map((b) => b.k)].forEach((k) => k.setAttribute('opacity', 0));

const formular = EIN[1].rohr;
function meierPunkt(f) {
  if (f < 0.3) { const p = formular.pfad.getPointAtLength(formular.L * sanft(f / 0.3)); return { x: p.x, y: p.y, kammer: -1 }; }
  const g2 = (f - 0.3) / 0.7;
  const seg = Math.min(3, Math.floor(g2 * 4)), lok = g2 * 4 - seg;
  const von = seg === 0 ? Z.x : kammern[seg - 1].mitte, nach = kammern[seg].mitte;
  const fahr = klemme(lok / 0.55);
  return { x: von + (nach - von) * sanft(fahr), y: MITTE_Y, kammer: fahr >= 1 ? seg : seg - 1 };
}
function setzeKapsel(k, r, f) {
  const p = r.pfad.getPointAtLength(r.L * f), q = r.pfad.getPointAtLength(Math.min(r.L, r.L * f + 1));
  const w = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
  k.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${w.toFixed(1)})`);
}

// ---------- Tiefe: Ebenen-Abstand (2.5D) ----------
// auf = 0: gekippt, weit auseinander · auf = 1: flach, nur noch Maus-Parallaxe und flache Schatten
let maus = { x: 0, y: 0 }, mausZiel = { x: 0, y: 0 };
if (MAUS && !RUHIG) addEventListener('pointermove', (e) => { mausZiel = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 }; });
let letzteTiefe = '';
function tiefe(auf) {
  const a = weich(auf);
  if (a < 1) {
    // Einflug in echtem 3D: Stapel gekippt, Ebenen in z auseinander
    const kipp = (1 - a) * 48, dreh = (1 - a) * -10, hoch = (1 - a) * 60;
    stapel.style.transform = `translateY(${hoch.toFixed(1)}px) rotateX(${kipp.toFixed(2)}deg) rotateZ(${dreh.toFixed(2)}deg) scale(${(0.86 + 0.14 * a).toFixed(3)})`;
    ebenen.forEach((s, i) => {
      s.style.transform = i ? `translateZ(${(i * (1 - a) * 70).toFixed(1)}px)` : '';
      s.style.opacity = i ? klemme(auf * 3 - i * 0.35).toFixed(3) : 1;
      s.style.filter = i ? `drop-shadow(0 ${(2 + i * 1.6 + i * (1 - a) * 12).toFixed(1)}px 0 ${F.schatten})` : '';
    });
    letzteTiefe = '';
    return;
  }
  // Ruhe: nur 2D-Verschiebung (3D in Ruhe rastert Chrome unscharf, Lehre 01.11.)
  const sig = `${maus.x.toFixed(3)},${maus.y.toFixed(3)}`;
  if (sig === letzteTiefe) return;
  letzteTiefe = sig;
  stapel.style.transform = '';
  ebenen.forEach((s, i) => {
    if (!i) return;
    s.style.transform = `translate(${(-maus.x * i * 7).toFixed(2)}px, ${(-maus.y * i * 5).toFixed(2)}px)`;
    s.style.opacity = 1;
    // flacher Schatten in einer Farbe, fällt vom Licht (Maus) weg; je höher die Ebene, desto weiter
    s.style.filter = `drop-shadow(${(-maus.x * i * 2.4).toFixed(2)}px ${(2.5 + i * 1.8 - maus.y * i * 1.5).toFixed(2)}px 0 ${F.schatten})`;
  });
}

// ---------- Ablauf am Scroll ----------
function fortschritt() {
  const r = bahn.getBoundingClientRect();
  return klemme((innerHeight - r.top) / r.height);
}
function zeichne(tt) {
  tiefe(RUHIG ? 1 : teil(tt, 0.22, 0.5));
  const z = RUHIG ? 1 : teil(tt, 0.3, 0.52);
  rohre.forEach((r, i) => {
    const a = r.art === 'ein' ? i * 0.08 : 0.3 + (i - 3) * 0.07;
    const f = sanft(teil(z, a, a + 0.4));
    r.gruppe.style.setProperty('--d', (1 - f).toFixed(3));
    r.muffen.forEach((m) => m.setAttribute('opacity', f > 0.97 ? 1 : 0));
  });
  basis.classList.toggle('gezeichnet', z >= 1);

  const m = RUHIG ? 1 : teil(tt, 0.56, 0.88);
  const raus = RUHIG ? 1 : teil(tt, 0.88, 0.96);
  const aktiv = m > 0 && raus < 1;
  const p = meierPunkt(m);
  const sicht = aktiv ? Math.min(1, m * 12) * (1 - raus) : 0;
  meier.setAttribute('opacity', sicht);
  fahne.setAttribute('opacity', sicht);
  meier.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  fahne.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  kammern.forEach((k, i) => {
    k.glas.setAttribute('fill', p.kammer === i && raus < 1 && m > 0 ? F.pink : F.flieder);
    k.zeit.setAttribute('opacity', p.kammer >= i && m > 0 ? 1 : 0);
  });
  fahneText.textContent = p.kammer < 0 ? '21:47 · Boiler tropft' : `${ZEITEN[p.kammer]} · ${SCHRITTE[p.kammer]}`;
  ergebnis.forEach(({ a, k }, i) => {
    const f = sanft(teil(raus, i * 0.15, 0.85 + i * 0.15));
    k.setAttribute('opacity', raus > 0 && f < 1 ? 1 : 0);
    if (raus > 0) setzeKapsel(k, a.rohr, f);
    a.ring.classList.toggle('an', f >= 1);
    a.bspEl.setAttribute('opacity', f >= 1 ? 1 : 0);
  });
  basis.classList.toggle('meier-laeuft', aktiv);
  // Scheinwerfer: solange Frau Meier unterwegs ist und die Ergebnisse herausfahren
  stapel.classList.toggle('fokus', m > 0 && raus < 1);
  // Zeiger im Massstab: 21:47 bis 21:51, danach bleibt er mit „4 Min.“ stehen
  const minute = p.kammer < 0 ? 47 : 48 + p.kammer;
  zeiger.setAttribute('opacity', m > 0 ? 1 : 0);
  zeiger.setAttribute('transform', `translate(${SKALA(minute).toFixed(2)} 0)`);
  zeigerText.textContent = raus >= 1 ? '21:47–21:51 · 4 Min.' : `21:${minute}`;
  skala21.setAttribute('opacity', m > 0 ? 0 : 1);
}

// Leise Rohrpost (13): zeitbasiert, pausiert während Frau Meier unterwegs ist
let tLeise = 0, letzteZeit = performance.now(), zuletzt = -1;
function tick(jetzt) {
  const dt = Math.min(0.05, (jetzt - letzteZeit) / 1000);
  letzteZeit = jetzt;
  maus.x += (mausZiel.x - maus.x) * 0.08;
  maus.y += (mausZiel.y - maus.y) * 0.08;
  const t = fortschritt();
  if (Math.abs(t - zuletzt) > 0.0004) { zeichne(t); zuletzt = t; }
  else if (t >= 0.5) tiefe(1);
  const frei = basis.classList.contains('gezeichnet') && !basis.classList.contains('meier-laeuft') && !RUHIG;
  if (frei) tLeise += dt;
  leise.forEach((b) => {
    if (!frei) { b.k.setAttribute('opacity', 0); return; }
    const f = ((tLeise / b.dauer) + b.versatz) % 1;
    b.k.setAttribute('opacity', Math.min(1, f * 10, (1 - f) * 10).toFixed(2));
    setzeKapsel(b.k, b.r, f);
  });
  if (nah) requestAnimationFrame(tick); else laeuft = false;
}
let laeuft = false, nah = false;
new IntersectionObserver(([e]) => {
  nah = e.isIntersecting;
  if (nah && !laeuft) { laeuft = true; letzteZeit = performance.now(); requestAnimationFrame(tick); }
}, { rootMargin: '50% 0px' }).observe(bahn);
zeichne(RUHIG ? 1 : 0);
