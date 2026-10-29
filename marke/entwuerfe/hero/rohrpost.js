// Kapitel II, Papier: „Plan der Rohrpost-Zentrale“ (Drehbuch 12, Mattia 29.10.2026).
// Wie ein Kupferstich-Plan in Pastell und Gold: links kommen E-Mail, Formular und Telefon an, die Rohre
// laufen in die Zentrale (das Regal mit den Fächern), rechts gehen fünf geordnete Ergebnisse hinaus.
// Pinke Büchsen = Anfragen, goldene = Ergebnisse. Rohre zeichnen sich beim Einscrollen.
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

const F = { papier: '#FCF6EE', gold: '#E3C58A', tinte: '#8C7650', pink: '#FF9DC8', pinkDunkel: '#C2557F', flieder: '#D9CCF5', holz: '#EADBC4' };
const Z = { x: 500, y: 300 }; // Zentrale

// Rahmen und Titel
el('rect', { x: 8, y: 8, width: 984, height: 544, rx: 22, fill: F.papier, stroke: F.gold, 'stroke-width': 2 });
el('rect', { x: 20, y: 20, width: 960, height: 520, rx: 14, fill: 'none', stroke: F.gold, 'stroke-width': 0.8 });
el('path', { d: 'M330 62 Q500 20 670 62 Q500 104 330 62 Z', fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 1.5 });
el('text', { x: 500, y: 71, 'text-anchor': 'middle', class: 'rp-titel' }, svg, 'Plan der Rohrpost-Zentrale');

// Zentrale: Regal mit acht Fächern, Trichter oben
const zentrale = el('g', {});
el('rect', { x: Z.x - 92, y: Z.y - 74, width: 184, height: 148, rx: 10, fill: F.holz, stroke: F.tinte, 'stroke-width': 1.4 }, zentrale);
for (let r = 0; r < 2; r++) {
  for (let c = 0; c < 4; c++) {
    el('rect', { x: Z.x - 80 + c * 41, y: Z.y - 62 + r * 64, width: 34, height: 54, rx: 3, fill: F.flieder, stroke: F.tinte, 'stroke-width': 0.8 }, zentrale);
  }
}
el('path', { d: `M${Z.x + 54} ${Z.y - 74} L${Z.x + 54} ${Z.y - 104} L${Z.x + 40} ${Z.y - 124} L${Z.x + 82} ${Z.y - 124} L${Z.x + 68} ${Z.y - 104} L${Z.x + 68} ${Z.y - 74} Z`, fill: F.gold, stroke: F.tinte, 'stroke-width': 1 }, zentrale);
el('text', { x: Z.x, y: Z.y + 100, 'text-anchor': 'middle', class: 'rp-klein' }, zentrale, 'Zentrale · nachts besetzt von vier Putti');

// Rohre
const EIN = [['E-Mail', 150], ['Formular', 300], ['Telefon', 450]];
const AUS = [['Antwort', 130], ['Termin', 215], ['Offerte', 300], ['Rückruf', 385], ['Rechnung', 470]];
const rohre = [];
function rohr(d, art) {
  el('path', { d, class: 'rp-rohr rp-zeichnen', pathLength: 1 });
  const innen = el('path', { d, class: 'rp-rohr-innen rp-zeichnen', pathLength: 1 });
  rohre.push({ d, art, innen });
}
EIN.forEach(([name, y], i) => {
  el('text', { x: 64, y: y + 5, class: 'rp-name' }, svg, name);
  el('path', { d: `M140 ${y - 16} L168 ${y - 6} L168 ${y + 6} L140 ${y + 16} Z`, fill: F.gold, stroke: F.tinte, 'stroke-width': 1 });
  rohr(`M168 ${y} C 300 ${y}, 330 ${Z.y - 30 + i * 30}, ${Z.x - 92} ${Z.y - 30 + i * 30}`, 'ein');
});
AUS.forEach(([name, y], i) => {
  const ya = Z.y - 56 + i * 28;
  rohr(`M${Z.x + 92} ${ya} C 670 ${ya}, 700 ${y}, 820 ${y}`, 'aus');
  el('path', { d: `M832 ${y - 12} L844 ${y} L832 ${y + 12} L820 ${y} Z`, fill: '#FBF3EA', stroke: F.gold, 'stroke-width': 1.6 });
  el('text', { x: 856, y: y + 5, class: 'rp-name' }, svg, name);
});

// Büchsen fahren durch die Rohre
if (!RUHIG) {
  rohre.forEach(({ d, art }, i) => {
    const g = el('g', { class: 'rp-buechse' });
    el('rect', { x: -9, y: -5, width: 18, height: 10, rx: 5, fill: art === 'ein' ? F.pink : F.gold, stroke: art === 'ein' ? F.pinkDunkel : F.tinte, 'stroke-width': 1 }, g);
    const dauer = art === 'ein' ? 3.2 : 2.6;
    el('animateMotion', { dur: `${dauer}s`, begin: `${(i * 0.7) % 3}s`, repeatCount: 'indefinite', rotate: 'auto', path: d }, g);
  });
}

// Legende und Massstab
const leg = el('g', { transform: 'translate(64 500)' });
el('rect', { x: 0, y: -8, width: 18, height: 10, rx: 5, fill: F.pink, stroke: F.pinkDunkel }, leg);
el('text', { x: 26, y: 1, class: 'rp-name', style: 'font-size:12px' }, leg, 'Anfrage');
el('rect', { x: 100, y: -8, width: 18, height: 10, rx: 5, fill: F.gold, stroke: F.tinte }, leg);
el('text', { x: 126, y: 1, class: 'rp-name', style: 'font-size:12px' }, leg, 'Ergebnis');
el('text', { x: 820, y: 512, class: 'rp-klein' }, svg, '0 – 1 Nacht');
el('path', { d: 'M820 520 L940 520 M820 515 L820 525 M880 517 L880 523 M940 515 L940 525', stroke: F.tinte, 'stroke-width': 1.2, fill: 'none' });

// Rohre zeichnen sich, sobald der Plan im Bild ist
new IntersectionObserver(([e], o) => {
  if (e.isIntersecting) { svg.classList.add('zeigt'); o.disconnect(); }
}, { threshold: 0.3 }).observe(svg);
