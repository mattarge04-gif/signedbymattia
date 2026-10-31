// K1-B5a · Das Fenster wird zum pinken iPhone aus Kapitel II (.k2-geraet): jedes Teil fliegt sichtbar
// vom Desktop- an seinen Handy-Platz (FLIP mit Überblendung). Drehbuch: website/drehbuch/10-startseite.md (K1-B5a)
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);

// [Desktop, Handy] in der Reihenfolge, in der sie losfliegen
const TEILE = [
  ['.hb-nav', '.hb-burger'], ['.hb-marke'], ['.hb-foto'], ['.hb-titel'], ['.hb-lead'],
  ['.hb-knoepfe'], ['.hb-bewertung'], ['.hb-leistungen'], ['.hb-notruf'],
];
const VERSATZ = 0.045;   // Abstand der Starts, in hp
const FLUG = 0.5;        // Flugdauer je Teil, in hp

export function handyAnlegen(buehne) {
  const desk = buehne.querySelector('.hb-farbe');
  const geraet = document.createElement('div');
  geraet.className = 'k2-geraet k1-iphone';
  geraet.setAttribute('aria-hidden', 'true');
  geraet.innerHTML = '<div class="k2-glas"><div class="k1-display"><span class="k2-insel"></span>'
    + '<p class="k1-status"><b>10:24</b><span class="k1-akku"><i></i></span></p></div></div>';
  const display = geraet.querySelector('.k1-display');

  // Handy-Seite = Kopie der fertigen Seite mit Burger-Menü und Anruf-Leiste
  const hb = desk.cloneNode(true);
  hb.removeAttribute('id');
  hb.classList.replace('hb-farbe', 'hb-handy');
  hb.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
  hb.querySelector('.hb-nav').insertAdjacentHTML('afterend', '<span class="hb-burger"><i></i><i></i><i></i></span>');
  hb.querySelector('.hb-notruf').innerHTML = '<i></i>Notfall 24 h <b>☎ 041 000 00 00</b>';
  display.append(hb);

  const flug = document.createElement('div');
  flug.className = 'k1-flug';
  flug.setAttribute('aria-hidden', 'true');
  buehne.append(geraet, flug);

  const paare = TEILE.map(([a, b = a]) => [desk.querySelector(a), hb.querySelector(b)]);
  paare.flat().forEach((e) => e.classList.add('k1-teil'));

  let flieger = null;
  let schluessel = '';

  // Raum = Kopie des Containers (cqw und em stimmen), Teile darin an ihrem Platz, ab dann nur noch transform
  function bauen() {
    flug.textContent = '';
    const bu = buehne.getBoundingClientRect();
    const raum = (container, klasse) => {
      const r = container.getBoundingClientRect();
      const d = document.createElement('div');
      d.className = 'k1-raum';
      Object.assign(d.style, { left: `${r.left - bu.left}px`, top: `${r.top - bu.top}px`, width: `${container.clientWidth}px`, height: `${container.clientHeight}px` });
      const innen = document.createElement('div');
      innen.className = klasse;
      d.append(innen);
      flug.append(d);
      return { innen, r };
    };
    const ra = raum(desk.parentElement, 'hb');
    const rb = raum(display, 'hb hb-handy');
    const kopie = (el, { innen, r }) => {
      const q = el.getBoundingClientRect();
      const k = el.cloneNode(true);
      k.classList.add('k1-flieger');
      Object.assign(k.style, { left: `${q.left - r.left}px`, top: `${q.top - r.top}px`, width: `${q.width}px`, height: `${q.height}px` });
      innen.append(k);
      return { k, x: q.left - bu.left, y: q.top - bu.top, w: q.width, h: q.height };
    };
    flieger = paare.map(([a, b]) => ({ a: kopie(a, ra), b: kopie(b, rb) }));
  }

  // Kopie q auf das Rechteck R legen: Mitte auf Mitte, Fläche gleich (Schrift wird nicht verzerrt)
  function setze(q, R, deckung, hub) {
    const s = Math.sqrt((R.w * R.h) / Math.max(1, q.w * q.h));
    const tx = R.x + R.w / 2 - (s * q.w) / 2 - q.x;
    const ty = R.y + R.h / 2 - (s * q.h) / 2 - q.y + hub;
    q.k.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    q.k.style.opacity = String(deckung);
  }

  function lage() {
    const vw = buehne.clientWidth;
    const vh = buehne.clientHeight;
    const pw = Math.min((vh * 0.84 * 21) / 41.26, vw * 0.8, 360);
    const h = (pw * 41.26) / 21;
    Object.assign(geraet.style, { fontSize: `${pw / 21}px`, left: `${(vw - pw) / 2}px`, top: `${vh * 0.53 - h / 2}px` });
    return vh;
  }

  function bild(hp) {
    const vh = lage();
    const fliegt = hp > 0 && hp < 1;
    const k = `${innerWidth}x${innerHeight}`;
    if (fliegt && (!flieger || k !== schluessel)) { bauen(); schluessel = k; }
    if (!fliegt && flieger) { flug.textContent = ''; flieger = null; }
    desk.classList.toggle('teile-weg', hp > 0);
    hb.classList.toggle('teile-weg', hp < 1);
    geraet.style.visibility = hp > 0 ? 'visible' : 'hidden';
    geraet.style.opacity = String(glatt(klemm((hp - 0.3) / 0.35)));
    if (!flieger) return;
    flieger.forEach(({ a, b }, i) => {
      const t = glatt(klemm((hp - 0.08 - i * VERSATZ) / FLUG));
      const R = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t };
      const hub = -Math.sin(t * Math.PI) * 0.04 * vh;   // leichter Bogen statt gerader Linie
      const x = klemm((t - 0.3) / 0.35);
      setze(a, R, 1 - x, hub);
      setze(b, R, x, hub);
    });
  }

  return { bild, display, knopf: hb.querySelector('.hb-knopf.haupt'), toast: hb.querySelector('.hb-toast') };
}
