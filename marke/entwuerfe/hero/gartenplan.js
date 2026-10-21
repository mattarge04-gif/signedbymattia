// Kapitel II, Papier: „Plan der Wasserspiele" als Grundriss des gemalten Gartens (Mattia 22.10.2026).
// Von oben gesehen wie ein Kupferstich-Gartenplan in Pastell und Gold: runder Rasen mit der Kaskade
// in der Mitte, vier Broderie-Parterres, Heckenwände mit Bögen, Rundtempel, Balustrade mit Treppe.
// Anfragen (pink) kommen durch drei Heckenbögen links, laufen auf den Kieswegen um den Rasen zur
// Kaskade; geordnete Ergebnisse (gold) gehen auf den Alleen rechts zu fünf Pavillons.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const svg = document.getElementById('k2Grafik');
svg.setAttribute('viewBox', '0 0 1000 620');

function el(tag, attr = {}, eltern = svg, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  if (text) e.textContent = text;
  eltern.appendChild(e);
  return e;
}

const F = {
  papier: '#FCF6EE', gold: '#E3C58A', tinte: '#8C7650', kies: '#F3E6D3', rasen: '#D6E5CC', rasenRand: '#AFC6A4',
  hecke: '#C9D3E6', heckeDunkel: '#9FA9C8', beet: '#FFD6C2', schnoerkel: '#B9946A', wasser: '#CFE3F7',
};
const M = { x: 470, y: 330 };   // Mitte: Kaskade auf dem Rasen

// ---------- Muster ----------
const defs = el('defs');
const schraffur = el('pattern', { id: 'gpSchraffur', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(40)' }, defs);
el('line', { x1: 0, y1: 0, x2: 0, y2: 5, stroke: F.heckeDunkel, 'stroke-width': 0.9, opacity: 0.5 }, schraffur);
const kies = el('pattern', { id: 'gpKies', width: 9, height: 9, patternUnits: 'userSpaceOnUse' }, defs);
el('rect', { width: 9, height: 9, fill: F.kies }, kies);
el('circle', { cx: 2, cy: 3, r: 0.7, fill: F.tinte, opacity: 0.25 }, kies);
el('circle', { cx: 6.5, cy: 7, r: 0.5, fill: F.tinte, opacity: 0.2 }, kies);
const gras = el('pattern', { id: 'gpGras', width: 7, height: 7, patternUnits: 'userSpaceOnUse' }, defs);
el('rect', { width: 7, height: 7, fill: F.rasen }, gras);
el('path', { d: 'M1 6 l1 -3 M4 6 l.6 -2.5', stroke: F.rasenRand, 'stroke-width': 0.7 }, gras);

// ---------- Papier, Rahmen, Kartusche ----------
el('rect', { x: 6, y: 6, width: 988, height: 608, rx: 18, fill: F.papier, stroke: F.gold, 'stroke-width': 2 });
el('rect', { x: 16, y: 16, width: 968, height: 588, rx: 12, fill: 'none', stroke: F.gold, 'stroke-width': 0.8 });

// ---------- Kiesplatz (Kreis) und Wege ----------
el('ellipse', { cx: M.x, cy: M.y, rx: 255, ry: 205, fill: 'url(#gpKies)', stroke: F.gold, 'stroke-width': 1 });
// Weg nach unten zur Treppe und zum Tempel oben rechts
el('path', { d: `M${M.x - 34} ${M.y + 200} L${M.x - 34} 590 L${M.x + 34} 590 L${M.x + 34} ${M.y + 200} Z`, fill: 'url(#gpKies)' });
el('path', { d: `M${M.x + 150} ${M.y - 150} L820 95 L850 125 L${M.x + 185} ${M.y - 120} Z`, fill: 'url(#gpKies)' });

// ---------- Vier Broderie-Parterres im Ring ----------
const rad = (a) => (a * Math.PI) / 180;
const P = (r, a, ry = r * 0.8) => [M.x + Math.cos(rad(a)) * r, M.y + Math.sin(rad(a)) * ry];
const beete = el('g');
const VIERTEL = [[200, 250], [290, 340], [20, 70], [110, 160]];
VIERTEL.forEach(([a0, a1]) => {
  const [x0, y0] = P(128, a0); const [x1, y1] = P(128, a1);
  const [x2, y2] = P(210, a1); const [x3, y3] = P(210, a0);
  const d = `M${x0} ${y0} A128 102 0 0 1 ${x1} ${y1} L${x2} ${y2} A210 168 0 0 0 ${x3} ${y3} Z`;
  el('path', { d, fill: F.beet, stroke: F.rasenRand, 'stroke-width': 3 }, beete);
  // Schnörkel: zwei Ranken und eine Rosette (Broderie)
  const am = (a0 + a1) / 2;
  const [cx, cy] = P(168, am);
  const [ax, ay] = P(150, a0 + 6); const [bx, by] = P(150, a1 - 6);
  const [ox, oy] = P(196, am);
  el('path', { d: `M${ax} ${ay} Q${ox} ${oy} ${cx} ${cy} Q${ox} ${oy} ${bx} ${by}`, fill: 'none', stroke: F.schnoerkel, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, beete);
  el('ellipse', { cx, cy, rx: 9, ry: 7, fill: '#FBF3EA', stroke: F.schnoerkel, 'stroke-width': 1.4 }, beete);
  el('circle', { cx: ax, cy: ay, r: 3, fill: F.schnoerkel }, beete);
  el('circle', { cx: bx, cy: by, r: 3, fill: F.schnoerkel }, beete);
  // Formschnitt-Kugeln an den Ecken
  [[x2, y2], [x3, y3]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 5, fill: F.rasen, stroke: F.rasenRand, 'stroke-width': 1 }, beete));
});

// ---------- Rasen mit der Kaskade ----------
el('ellipse', { cx: M.x, cy: M.y, rx: 112, ry: 88, fill: 'url(#gpGras)', stroke: F.rasenRand, 'stroke-width': 2.5 });
const kaskade = el('g', { class: 'gp-brunnen' });
[52, 42, 32, 22, 12].forEach((r, i) => el('ellipse', { cx: M.x, cy: M.y, rx: r * 1.15, ry: r * 0.9, fill: i % 2 ? F.wasser : '#FBF3EA', stroke: F.gold, 'stroke-width': i === 0 ? 2.5 : 1.2 }, kaskade));
for (let r = 0; r < 3; r++) el('ellipse', { cx: M.x, cy: M.y, rx: 10, ry: 8, class: 'gp-ring', style: `animation-delay:${r * 1.1}s` }, kaskade);
el('circle', { cx: M.x, cy: M.y, r: 5, fill: '#FF9DC8', stroke: '#fff', 'stroke-width': 1.5 }, kaskade);

// ---------- Heckenwände mit Bögen (U-Form, wie im Bild) ----------
const hecken = el('g');
function hecke(d) {
  el('path', { d, fill: 'none', stroke: F.hecke, 'stroke-width': 26, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, hecken);
  el('path', { d, fill: 'none', stroke: 'url(#gpSchraffur)', 'stroke-width': 26, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, hecken);
  el('path', { d, fill: 'none', stroke: F.heckeDunkel, 'stroke-width': 1, 'stroke-dasharray': '2 5' }, hecken);
}
// links: von unten nach oben, mit drei Lücken (Bögen) für E-Mail, Formular, Telefon
hecke(`M${M.x - 80} 575 Q120 560 100 450`);
hecke('M100 395 L100 345');
hecke('M100 290 L100 240');
hecke(`M100 185 Q110 70 ${M.x - 40} 70`);
// oben und rechts bis zum Tempel
hecke(`M${M.x + 40} 70 L700 70`);
hecke(`M${M.x + 80} 575 Q800 560 820 460`);
// Bögen in den Lücken
const BOGEN = [{ y: 422, t: 'Telefon' }, { y: 318, t: 'Formular' }, { y: 213, t: 'E-Mail' }];
const marken = el('g');
BOGEN.forEach(({ y, t }) => {
  el('path', { d: `M86 ${y - 14} A16 16 0 0 1 114 ${y - 14} M86 ${y + 14} A16 16 0 0 0 114 ${y + 14}`, fill: 'none', stroke: F.heckeDunkel, 'stroke-width': 3 }, marken);
  el('text', { class: 'gp-name', x: 72, y: y + 5, 'text-anchor': 'end' }, marken, t);
});

// ---------- Rundtempel oben rechts (von oben: Säulenkranz) ----------
const tempel = el('g', { transform: 'translate(840 112)' });
el('circle', { r: 36, fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 2 }, tempel);
el('circle', { r: 24, fill: 'none', stroke: F.gold, 'stroke-width': 1 }, tempel);
for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; el('circle', { cx: Math.cos(a) * 30, cy: Math.sin(a) * 30, r: 3.2, fill: F.gold }, tempel); }
el('text', { class: 'gp-klein', x: 0, y: 56, 'text-anchor': 'middle' }, tempel, 'Tempel des Feierabends');

// ---------- Balustrade mit Treppe unten ----------
const treppe = el('g');
for (let k = 0; k < 5; k++) el('line', { x1: M.x - 34, x2: M.x + 34, y1: 560 + k * 6, y2: 560 + k * 6, stroke: F.tinte, 'stroke-width': 0.8, opacity: 0.6 }, treppe);
[[M.x - 120, M.x - 40], [M.x + 40, M.x + 120]].forEach(([a, b]) => {
  el('rect', { x: a, y: 548, width: b - a, height: 8, rx: 2, fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 1.2 }, treppe);
  for (let x = a + 6; x < b; x += 9) el('circle', { cx: x, cy: 552, r: 2, fill: F.gold }, treppe);
});
[M.x - 40, M.x + 40].forEach((x) => el('circle', { cx: x, cy: 552, r: 7, fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 1.5 }, treppe));
el('text', { class: 'gp-klein', x: M.x, y: 610, 'text-anchor': 'middle' }, treppe, 'Ihr Eingang');

// ---------- Ausgänge rechts: fünf Alleen mit Pavillons ----------
const ZIELE = ['Antwort', 'Termin', 'Offerte', 'Rückruf', 'Rechnung'];
const alleen = el('g');
const zielPfade = [];
ZIELE.forEach((t, n) => {
  const zy = 220 + n * 62;
  const start = P(212, -30 + n * 15);
  const d = `M${start[0]} ${start[1]} C 790 ${start[1]}, 800 ${zy}, 905 ${zy}`;
  el('path', { d, class: 'gp-allee', pathLength: 1 }, alleen);
  zielPfade.push(d);
  const pav = el('g', { transform: `translate(918 ${zy})` }, alleen);
  el('rect', { x: -9, y: -9, width: 18, height: 18, rx: 3, fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 1.6, transform: 'rotate(45)' }, pav);
  el('text', { class: 'gp-name', x: 18, y: 5 }, pav, t);
});
// Bäumchen entlang der Alleen
ZIELE.forEach((t, n) => {
  const pfad = el('path', { d: zielPfade[n] }, alleen);
  const len = pfad.getTotalLength();
  for (let b = 1; b < 6; b++) {
    const p = pfad.getPointAtLength((len * b) / 6);
    el('circle', { cx: p.x, cy: p.y - 8, r: 3.6, class: 'gp-baum' }, alleen);
  }
  pfad.remove();
});

// ---------- Wege der Anfragen: durch die Bögen, um den Rasen herum zur Kaskade ----------
const anfragePfade = [];
BOGEN.forEach(({ y }, n) => {
  for (let k = 0; k < 3; k++) {
    const auf = P(214 - k * 14, 180 + (n - 1) * 32 + k * 6);
    const ring = P(120, 180 + (n - 1) * 55 + (k - 1) * 20);
    anfragePfade.push(`M100 ${y} C 160 ${y}, ${auf[0] - 30} ${auf[1]}, ${auf[0]} ${auf[1]} S ${ring[0]} ${ring[1]}, ${M.x} ${M.y}`);
  }
});
const wege = el('g');
anfragePfade.forEach((d) => el('path', { d, class: 'gp-weg', pathLength: 1 }, wege));

// ---------- Windrose, Massstab, Kartusche ----------
const rose = el('g', { transform: 'translate(150 560)' });
el('path', { d: 'M0 -18 L4.5 0 L0 18 L-4.5 0 Z M-18 0 L0 4.5 L18 0 L0 -4.5 Z', fill: F.gold, stroke: F.tinte, 'stroke-width': 0.8 }, rose);
el('text', { class: 'gp-klein', x: 0, y: -22, 'text-anchor': 'middle' }, rose, 'N');
const mass = el('g', { transform: 'translate(800 575)' });
el('path', { d: 'M0 0 H120 M0 -4 V4 M60 -3 V3 M120 -4 V4', stroke: F.tinte, 'stroke-width': 1.2, fill: 'none' }, mass);
el('text', { class: 'gp-klein', x: 60, y: -8, 'text-anchor': 'middle' }, mass, '0 – 1 Nacht Schlaf');
const kart = el('g', { transform: 'translate(470 40)' });
el('path', { d: 'M-160 0 C-140 -26 -60 -22 0 -22 C 60 -22 140 -26 160 0 C 140 26 60 22 0 22 C -60 22 -140 26 -160 0 Z', fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 1.5 }, kart);
el('text', { class: 'gp-titel', x: 0, y: 8, 'text-anchor': 'middle' }, kart, 'Plan der Wasserspiele');

// ---------- Bewegung ----------
if (!RUHIG) {
  const laeufer = el('g', { class: 'gp-laeufer' });
  anfragePfade.forEach((d, n) => {
    const c = el('circle', { r: 4, fill: '#FF9DC8', stroke: '#fff', 'stroke-width': 1.2 }, laeufer);
    el('animateMotion', { dur: `${4 + (n % 3) * 0.5}s`, begin: `${(n * 0.61) % 4.5}s`, repeatCount: 'indefinite', path: d, calcMode: 'spline', keyPoints: '0;1', keyTimes: '0;1', keySplines: '.45 0 .55 1' }, c);
  });
  zielPfade.forEach((d, n) => {
    const c = el('circle', { r: 4, fill: F.gold, stroke: '#fff', 'stroke-width': 1.2 }, laeufer);
    el('animateMotion', { dur: '3s', begin: `${1.6 + n * 0.6}s`, repeatCount: 'indefinite', path: d }, c);
  });
}

new IntersectionObserver(([e]) => { if (e.isIntersecting) svg.classList.add('zeigt'); }, { threshold: 0.25 }).observe(svg);
