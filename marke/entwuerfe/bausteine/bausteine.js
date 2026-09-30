// Bausteine M1, M7, M9 · ENTWURF, Prototyp
// Stand: 30.09.2026 · Grundlage: website/drehbuch/02-mechaniken.md (M1, M7, M9),
// 01-bausteine.md (B2, B4, B5), 00-grammatik.md (Werte). Kein fremder Code.
//
// Je Baustein eine Funktion; jede nimmt ein Element und Optionen und gibt eine
// Aufräum-Funktion zurück. Alle Bausteine teilen eine einzige Scroll-Schleife
// (ein requestAnimationFrame pro Scroll-Ereignis), animiert wird nur transform
// und opacity. Mit prefers-reduced-motion: keine Bewegung, nur Einblenden 0.2 s (CSS).
//
//   import { kapitelAuftakt, gerissenesPapier, karteWeckt, einblenden, fortschritt } from './bausteine.js';

export const PARAMETER = {
  auftakt: { faktor: 1.6 },          // M1: Wort steigt 1.6-mal so schnell wie der Scroll
  papier: {                          // M7
    hoehe: 46,                       // Höhe der ausgefransten Kante in px
    amplitude: 5,                    // wie weit die Kante beim Scrollen wandert (px)
    fasern: 0.07,                    // Fasern je px Kantenlänge
    glitzer: 0.012,                  // Goldkörner je px Kantenlänge
    seed: 7,                         // gleiche Zahl = gleiche Kante
  },
  text: { schwelle: 0.3 },           // Text erscheint bei 30 % im Bild (Grammatik „Text")
};

export const ruhig = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- gemeinsame Scroll-Schleife -------------------------------------------
const aufgaben = new Set();
let geplant = false;
function planen() {
  if (geplant) return;
  geplant = true;
  requestAnimationFrame(() => { geplant = false; aufgaben.forEach((f) => f()); });
}
addEventListener('scroll', planen, { passive: true });
addEventListener('resize', planen);

/** Führt f bei jedem Scroll-Frame aus. Gibt die Abmelde-Funktion zurück. */
export function beiScroll(f) { aufgaben.add(f); planen(); return () => aufgaben.delete(f); }

/** Scroll-Fortschritt 0–1 eines hohen Abschnitts: 0 = Oberkante am Bildschirm oben, 1 = Unterkante am Bildschirm unten. */
export function fortschritt(el) {
  const r = el.getBoundingClientRect();
  const weg = r.height - innerHeight;
  return weg <= 0 ? (r.top <= 0 ? 1 : 0) : Math.min(1, Math.max(0, -r.top / weg));
}

// --- Text erscheint beim ersten Sehen ---------------------------------------
/** Setzt .ist-sichtbar, sobald ein Element zu 30 % im Bild ist (nur einmal). */
export function einblenden(els, { schwelle = PARAMETER.text.schwelle } = {}) {
  const io = new IntersectionObserver((eintraege) => {
    for (const e of eintraege) if (e.isIntersecting) { e.target.classList.add('ist-sichtbar'); io.unobserve(e.target); }
  }, { threshold: schwelle });
  [...els].forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// --- M1 Kapitel-Auftakt ---------------------------------------------------
/**
 * el: .b-auftakt mit .b-auftakt__wort und .b-auftakt__satz.
 * Das Wort steigt schneller als der Scroll: zusätzlich zum normalen Scrollen
 * wird es um (faktor − 1) × gescrollte Strecke nach oben verschoben.
 */
export function kapitelAuftakt(el, { faktor = PARAMETER.auftakt.faktor } = {}) {
  const wort = el.querySelector('.b-auftakt__wort');
  const aus = [einblenden(el.querySelectorAll('.b-auftakt__satz'))];
  if (wort) {
    aus.push(beiScroll(() => {
      if (ruhig()) { wort.style.transform = ''; return; }
      // Strecke seit das Wort (ohne Verschiebung) unten ins Bild kam; offsetTop ignoriert transform
      const gescrollt = Math.max(0, innerHeight - (el.getBoundingClientRect().top + wort.offsetTop));
      wort.style.transform = `translate3d(0, ${(-(faktor - 1) * gescrollt).toFixed(1)}px, 0)`;
    }));
  }
  return () => aus.forEach((f) => f());
}

// --- M7 Gerissenes Papier -------------------------------------------------
function zufall(seed) { // mulberry32: gleiche Kante bei jedem Laden
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function kantenSvg(breite, o) {
  const r = zufall(o.seed);
  const h = o.hoehe;
  const p1 = r() * 6, p2 = r() * 6, p3 = r() * 6;
  const punkte = [];
  for (let x = 0; x <= breite; x += 2 + r() * 5) {
    // drei Wellen (gross, mittel, fein) + Zufall = gerissene, nicht gezeichnete Kante
    let y = h * 0.52 + Math.sin(x / 190 + p1) * h * 0.16 + Math.sin(x / 47 + p2) * h * 0.08
      + Math.sin(x / 11 + p3) * h * 0.03 + (r() - 0.5) * h * 0.12;
    punkte.push([x, Math.min(h - 3, Math.max(3, y))]);
  }
  punkte.push([breite, punkte[punkte.length - 1][1]]);
  const linie = punkte.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
  const flaeche = `M0 ${h + 2}L${linie}L${breite} ${h + 2}Z`;
  const schatten = `M0 ${h + 2}L${punkte.map(([x, y]) => `${x.toFixed(1)} ${(y - 1.2).toFixed(1)}`).join('L')}L${breite} ${h + 2}Z`;
  const hoehe = (x) => { // y der Kante an Stelle x
    let i = punkte.findIndex((p) => p[0] >= x); if (i <= 0) return punkte[0][1];
    const [ax, ay] = punkte[i - 1], [bx, by] = punkte[i]; return ay + (by - ay) * ((x - ax) / (bx - ax || 1));
  };
  let fasern = '', glitzer = '';
  for (let i = 0, n = Math.round(breite * o.fasern); i < n; i++) {
    const x = r() * breite, y = hoehe(x) + 1, l = 3 + r() * 9, w = (r() - 0.5) * 1.4;
    fasern += `M${x.toFixed(1)} ${y.toFixed(1)}q${(w * l * 0.5).toFixed(1)} ${(-l * 0.5).toFixed(1)} ${(w * l).toFixed(1)} ${(-l * (0.4 + r() * 0.6)).toFixed(1)}`;
  }
  for (let i = 0, n = Math.round(breite * o.glitzer); i < n; i++) {
    const x = r() * breite; glitzer += `<circle cx="${x.toFixed(1)}" cy="${(hoehe(x) + 2 + r() * 5).toFixed(1)}" r="${(0.5 + r() * 0.7).toFixed(2)}"/>`;
  }
  const id = `b-papier-${o.seed}-${breite}`;
  return `<svg class="b-papier__kante" width="${breite}" height="${h + 2}" viewBox="0 0 ${breite} ${h + 2}" aria-hidden="true" focusable="false">
    <defs>
      <filter id="${id}-w" x="-2%" y="-50%" width="104%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
      <filter id="${id}-k"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${o.seed}"/>
        <feColorMatrix values="0 0 0 0 .14  0 0 0 0 .1  0 0 0 0 .23  0 0 0 .5 -.18"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <path d="${schatten}" fill="var(--color-text)" opacity=".22" filter="url(#${id}-w)"/>
    <path d="${flaeche}" fill="var(--color-bg)"/>
    <path d="${flaeche}" fill="#000" filter="url(#${id}-k)"/>
    <path d="${fasern}" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".85"/>
    <g fill="var(--color-gold)" opacity=".9">${glitzer}</g>
  </svg>`;
}

/**
 * el: .b-papier (Creme-Panel). Setzt oben eine ausgefranste Kante (eigenes SVG,
 * aus Zufall mit festem Seed), körnig, mit hellen Fasern und wenigen Goldkörnern.
 * Die Kante wandert beim Scrollen um ±amplitude px (lebt).
 */
export function gerissenesPapier(el, optionen = {}) {
  const o = { ...PARAMETER.papier, ...optionen };
  const halter = document.createElement('div');
  halter.className = 'b-papier__rand';
  halter.style.setProperty('--b-kante', `${o.hoehe}px`);
  el.prepend(halter);
  let breite = 0;
  const bauen = () => {
    const b = Math.ceil(el.clientWidth + o.amplitude * 4);
    if (b === breite) return;
    breite = b;
    halter.innerHTML = kantenSvg(breite, o);
  };
  const ro = new ResizeObserver(bauen); ro.observe(el); bauen();
  const aus = beiScroll(() => {
    if (ruhig()) { halter.style.transform = ''; return; }
    const t = scrollY / 420;
    halter.style.transform = `translate3d(${(Math.sin(t) * o.amplitude).toFixed(2)}px, ${(Math.cos(t * 0.7) * o.amplitude * 0.25).toFixed(2)}px, 0)`;
  });
  return () => { aus(); ro.disconnect(); halter.remove(); };
}

// --- M9 Karte weckt sich --------------------------------------------------
/**
 * el: .b-karte mit .b-karte__eingabe, .b-karte__ergebnis und einem Knopf .b-karte__knopf.
 * Maus (hover: hover, pointer: fine): Hover weckt die Karte (CSS).
 * Handy: Tippen auf die Karte oder den Knopf schaltet um. Tastatur: Knopf, ohne Animation.
 */
export function karteWeckt(el) {
  const knopf = el.querySelector('.b-karte__knopf');
  const ergebnis = el.querySelector('.b-karte__ergebnis');
  const setzen = (wach, sofort) => {
    el.classList.toggle('b-sofort', !!sofort);
    el.classList.toggle('ist-wach', wach);
    knopf?.setAttribute('aria-expanded', String(wach));
    ergebnis?.setAttribute('aria-hidden', String(!wach));
  };
  setzen(false);
  const maus = matchMedia('(hover: hover) and (pointer: fine)');
  const beiKlick = (e) => {
    // Maus weckt über Hover; der Klick ändert dort nur für die Tastatur etwas
    if (maus.matches && e.detail !== 0) return;
    setzen(!el.classList.contains('ist-wach'), e.detail === 0);
  };
  const beiEintritt = () => { if (maus.matches) setzen(true); };
  const beiAustritt = () => { if (maus.matches) setzen(false); };
  const beiAussen = (e) => { if (!maus.matches && !el.contains(e.target)) setzen(false); };
  el.addEventListener('click', beiKlick);
  el.addEventListener('pointerenter', beiEintritt);
  el.addEventListener('pointerleave', beiAustritt);
  document.addEventListener('pointerdown', beiAussen);
  return () => {
    el.removeEventListener('click', beiKlick);
    el.removeEventListener('pointerenter', beiEintritt);
    el.removeEventListener('pointerleave', beiAustritt);
    document.removeEventListener('pointerdown', beiAussen);
  };
}

/** Bequem: alle Bausteine im Dokument anhand ihrer Klassen starten. */
export function alleStarten(wurzel = document) {
  wurzel.querySelectorAll('.b-auftakt').forEach((el) => kapitelAuftakt(el));
  wurzel.querySelectorAll('.b-papier').forEach((el) => gerissenesPapier(el));
  wurzel.querySelectorAll('.b-karte').forEach((el) => karteWeckt(el));
}
