// Kapitel II, Papier: „Plan der Wasserspiele" als barocker Gartenplan (Kupferstich in Pastell und Gold).
// Viele Wege (Anfragen) laufen von drei Pforten zum Brunnen, geordnete Alleen führen zu fünf Pavillons.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const svg = document.getElementById('k2Grafik');

function el(tag, attr = {}, eltern = svg, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) e.setAttribute(k, v);
  if (text) e.textContent = text;
  eltern.appendChild(e);
  return e;
}

// Muster: Kupferstich-Schraffur und Papier
const defs = el('defs');
const schraffur = el('pattern', { id: 'gpSchraffur', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: '#C9A466', 'stroke-width': 0.6, opacity: 0.55 }, schraffur);
const kies = el('pattern', { id: 'gpKies', width: 8, height: 8, patternUnits: 'userSpaceOnUse' }, defs);
el('circle', { cx: 2, cy: 2, r: 0.7, fill: '#C9A466', opacity: 0.45 }, kies);
el('circle', { cx: 6, cy: 5, r: 0.5, fill: '#C9A466', opacity: 0.35 }, kies);

const M = { x: 500, y: 285 };            // Brunnen
const PFORTEN = [{ y: 135, t: 'E-Mail' }, { y: 285, t: 'Formular' }, { y: 435, t: 'Telefon' }];
const ZIELE = ['Antwort', 'Termin', 'Offerte', 'Rückruf', 'Rechnung'];

// Papier mit doppeltem Goldrahmen und Titel-Kartusche
el('rect', { x: 8, y: 8, width: 984, height: 524, rx: 18, fill: '#FCF6EE', stroke: '#E3C58A', 'stroke-width': 2 });
el('rect', { x: 18, y: 18, width: 964, height: 504, rx: 12, fill: 'none', stroke: '#E3C58A', 'stroke-width': 0.8 });
const kart = el('g', { transform: 'translate(500 46)' });
el('path', { d: 'M-150 0 C-130 -26 -60 -22 0 -22 C 60 -22 130 -26 150 0 C 130 26 60 22 0 22 C -60 22 -130 26 -150 0 Z', fill: '#FBF3EA', stroke: '#E3C58A', 'stroke-width': 1.5 }, kart);
el('text', { class: 'gp-titel', x: 0, y: 7, 'text-anchor': 'middle' }, kart, 'Plan der Wasserspiele');

// Rasenflächen und Broderie-Beete um den Brunnen (vier Viertel)
const beete = el('g', { class: 'gp-beete' });
for (let q = 0; q < 4; q++) {
  const a0 = q * 90 + 12;
  const a1 = q * 90 + 78;
  const rad = (a) => (a * Math.PI) / 180;
  const p = (r, a) => `${M.x + Math.cos(rad(a)) * r} ${M.y + Math.sin(rad(a)) * r * 0.78}`;
  el('path', { d: `M${p(95, a0)} A95 74 0 0 1 ${p(95, a1)} L${p(190, a1)} A190 148 0 0 0 ${p(190, a0)} Z`, fill: '#FFD6C2', opacity: 0.55, stroke: '#E3C58A', 'stroke-width': 1 }, beete);
  el('path', { d: `M${p(95, a0)} A95 74 0 0 1 ${p(95, a1)} L${p(190, a1)} A190 148 0 0 0 ${p(190, a0)} Z`, fill: 'url(#gpSchraffur)' }, beete);
  // Schnörkel (Broderie)
  const am = (a0 + a1) / 2;
  const c = (r, a) => [M.x + Math.cos(rad(a)) * r, M.y + Math.sin(rad(a)) * r * 0.78];
  const [x1, y1] = c(118, a0 + 8); const [x2, y2] = c(160, am); const [x3, y3] = c(118, a1 - 8);
  el('path', { d: `M${x1} ${y1} C ${x2} ${y1}, ${x2} ${y3}, ${x3} ${y3} M${c(135, am)[0]} ${c(135, am)[1]} m-10 0 a10 8 0 1 0 20 0 a10 8 0 1 0 -20 0`, fill: 'none', stroke: '#B79A63', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, beete);
}

// Wege von den Pforten: je Pforte 5 schmale Kieswege, die sich zum Brunnen schlängeln
const wege = el('g', { class: 'gp-wege' });
const anfragePfade = [];
PFORTEN.forEach((pf, n) => {
  for (let k = 0; k < 5; k++) {
    const dy = (k - 2) * 12;
    const welle = (k % 2 ? 1 : -1) * (14 + k * 4);
    const d = `M96 ${pf.y + dy} C 190 ${pf.y + dy + welle}, 250 ${pf.y - welle}, 320 ${(pf.y + M.y) / 2 + dy * 0.5} S 400 ${M.y + dy * 0.3}, ${M.x - 66} ${M.y + dy * 0.15}`;
    el('path', { d, class: 'gp-weg', pathLength: 1 }, wege);
    anfragePfade.push(d);
  }
});

// Alleen nach rechts: gerade, mit Baumreihen (Formschnitt)
const alleen = el('g', { class: 'gp-alleen' });
const zielPfade = [];
ZIELE.forEach((t, n) => {
  const zy = 105 + n * 90;
  const d = `M${M.x + 66} ${M.y + (zy - M.y) * 0.12} L ${700} ${M.y + (zy - M.y) * 0.75} L 850 ${zy}`;
  el('path', { d, class: 'gp-allee', pathLength: 1 }, alleen);
  zielPfade.push(d);
  // Bäume beidseits genau entlang der Allee
  const mess = el('path', { d }, alleen);
  const len = mess.getTotalLength();
  for (let b = 0; b < 7; b++) {
    const l = len * (0.16 + b * 0.115);
    const p0 = mess.getPointAtLength(l);
    const p1 = mess.getPointAtLength(Math.min(len, l + 1));
    const nx = -(p1.y - p0.y);
    const ny = p1.x - p0.x;
    const n = Math.hypot(nx, ny) || 1;
    for (const sgn of [-1, 1]) el('circle', { cx: p0.x + (nx / n) * 10 * sgn, cy: p0.y + (ny / n) * 10 * sgn, r: 4.3, class: 'gp-baum' }, alleen);
  }
  mess.remove();
});

// Brunnen in der Mitte: Becken, Wasser, Ringe
const brunnen = el('g', { class: 'gp-brunnen' });
el('ellipse', { cx: M.x, cy: M.y, rx: 70, ry: 56, fill: '#FBF3EA', stroke: '#E3C58A', 'stroke-width': 3 }, brunnen);
el('ellipse', { cx: M.x, cy: M.y, rx: 58, ry: 45, fill: '#CFE3F7', stroke: '#B79A63', 'stroke-width': 1 }, brunnen);
for (let r = 0; r < 3; r++) el('ellipse', { cx: M.x, cy: M.y, rx: 12, ry: 9, class: 'gp-ring', style: `animation-delay:${r * 1.1}s` }, brunnen);
el('circle', { cx: M.x, cy: M.y, r: 6, fill: '#FF9DC8', stroke: '#fff', 'stroke-width': 1.5 }, brunnen);
el('text', { class: 'gp-klein', x: M.x, y: M.y + 80, 'text-anchor': 'middle' }, brunnen, 'Ihr Eingang');

// Pforten links (kleine Rundtempel) und Pavillons rechts
function tempel(x, y, gruppe) {
  const g = el('g', { transform: `translate(${x} ${y})` }, gruppe);
  el('path', { d: 'M-14 6 L-14 -6 Q0 -22 14 -6 L14 6 Z', fill: '#FBF3EA', stroke: '#B79A63', 'stroke-width': 1.3 }, g);
  el('line', { x1: -8, y1: 6, x2: -8, y2: -5, stroke: '#B79A63', 'stroke-width': 1 }, g);
  el('line', { x1: 8, y1: 6, x2: 8, y2: -5, stroke: '#B79A63', 'stroke-width': 1 }, g);
  el('rect', { x: -18, y: 6, width: 36, height: 4, rx: 1, fill: '#E3C58A' }, g);
  return g;
}
const marken = el('g', { class: 'gp-marken' });
PFORTEN.forEach((pf) => { tempel(78, pf.y, marken); el('text', { class: 'gp-name', x: 78, y: pf.y - 26, 'text-anchor': 'middle' }, marken, pf.t); });
ZIELE.forEach((t, n) => { const zy = 105 + n * 90; tempel(866, zy, marken); el('text', { class: 'gp-name', x: 890, y: zy + 5 }, marken, t); });

// Windrose und Massstab (mit Augenzwinkern)
const rose = el('g', { transform: 'translate(150 495)', class: 'gp-rose' });
el('path', { d: 'M0 -16 L4 0 L0 16 L-4 0 Z M-16 0 L0 4 L16 0 L0 -4 Z', fill: '#E3C58A', stroke: '#B79A63', 'stroke-width': 0.8 }, rose);
el('text', { class: 'gp-klein', x: 0, y: -20, 'text-anchor': 'middle' }, rose, 'N');
const mass = el('g', { transform: 'translate(800 505)' });
el('path', { d: 'M0 0 H120 M0 -4 V4 M60 -3 V3 M120 -4 V4', stroke: '#B79A63', 'stroke-width': 1.2, fill: 'none' }, mass);
el('text', { class: 'gp-klein', x: 60, y: -8, 'text-anchor': 'middle' }, mass, '0 – 1 Nacht Schlaf');

// Bewegung: Anfragen (pink) laufen zum Brunnen, Ergebnisse (gold) in die Alleen
if (!RUHIG) {
  const laeufer = el('g', { class: 'gp-laeufer' });
  anfragePfade.forEach((d, n) => {
    const c = el('circle', { r: 3.4, fill: '#FF9DC8', stroke: '#fff', 'stroke-width': 1 }, laeufer);
    el('animateMotion', { dur: `${3.2 + (n % 5) * 0.35}s`, begin: `${(n * 0.43) % 4}s`, repeatCount: 'indefinite', path: d, keyPoints: '0;1', keyTimes: '0;1', calcMode: 'spline', keySplines: '.4 0 .6 1' }, c);
  });
  zielPfade.forEach((d, n) => {
    const c = el('circle', { r: 3.6, fill: '#E3C58A', stroke: '#fff', 'stroke-width': 1 }, laeufer);
    el('animateMotion', { dur: '2.8s', begin: `${1.4 + n * 0.55}s`, repeatCount: 'indefinite', path: d }, c);
  });
}

new IntersectionObserver(([e]) => { if (e.isIntersecting) svg.classList.add('zeigt'); }, { threshold: 0.25 }).observe(svg);
