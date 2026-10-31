// K1-B4 · Die neue Seite lebt: in der Pause vor dem Handy fährt ein Mauszeiger von Station zu Station.
// Wo er hovert, spielt die Bewegung und eine Notiz von Hand erklärt sie; zieht er weiter, geht die Notiz.
// Erste Station: Figma-Masse am Titel (exakt an den Kanten, Text mit text-box-trim). Alles hängt am Scroll:
// p läuft während der Pause von 0 bis 1 (kapitel1.js), rückwärts scrollen spult zurück.
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const aus = (t) => 1 - (1 - t) ** 3;
const ein = (a, dauer, p) => glatt(klemm((p - a) / dauer));

const ANFANG = 0.03;   // Zeiger kommt ins Bild
const ENDE = 0.95;     // danach räumt alles ab
const FAHRT = 0.22;    // Anteil einer Station, in dem der Zeiger hinfährt
const ZEIGER_SVG = '<svg viewBox="0 0 20 24"><path d="M2 2v18l5-4.5 3.4 6.8 3-1.5-3.3-6.6H17z" fill="#fff" stroke="#231B3A" stroke-width="1.6" stroke-linejoin="round"/></svg>';

export function zeigenAnlegen(buehne, browser) {
  const $ = (s) => document.querySelector(`.hb-farbe ${s}`);
  const hb = document.querySelector('.hb-farbe');
  const titel = $('.hb-titel');
  const lead = $('.hb-lead');
  const knoepfe = $('.hb-knoepfe');
  const knopf = $('.hb-knopf.haupt');
  const link = $('.hb-link');
  const tropf = $('.hb-tropf');
  const punkt = $('.hb-notruf i');
  const notruf = $('.hb-notruf');
  const bewertung = $('.hb-bewertung');
  const sterne = $('.hb-sterne-box');
  const voll = $('.hb-sterne.voll');
  const zahl = $('.hb-zahl');
  const anzahl = $('.hb-anzahl');
  const stempel = $('.hb-stempel');
  const ring = $('.hb-stempel svg');
  const jahre = $('.hb-jahre');
  const foto = $('.hb-foto');
  const fotoBild = $('.hb-foto-rahmen i');
  const leistungen = [...document.querySelectorAll('.hb-farbe .hb-leistungen li')];

  const ebene = document.createElement('div');
  ebene.className = 'k1-zeigen';
  ebene.setAttribute('aria-hidden', 'true');
  ebene.innerHTML = `
    <div class="k1-fig">
      <div class="k1-auswahl"><span>Titel</span><i></i><i></i><i></i><i></i></div>
      <div class="k1-mass waag"><b></b></div>
      <div class="k1-mass senk"><b></b></div>
      <div class="k1-mass senk"><b></b></div>
      <div class="k1-mass waag"><b></b></div>
    </div>
    <svg class="k1-striche"><path pathLength="1"/><path pathLength="1"/><path pathLength="1" class="pink"/></svg>
    <p class="k1-notiz"></p>
    <div class="k1-hover">${ZEIGER_SVG}</div>`;
  buehne.append(ebene);
  const fig = ebene.querySelector('.k1-fig');
  const auswahl = ebene.querySelector('.k1-auswahl');
  const auswahlText = auswahl.querySelector('span');
  const masse = [...ebene.querySelectorAll('.k1-mass')];
  const [pfad, spitze, kreis] = ebene.querySelectorAll('path');
  const notiz = ebene.querySelector('.k1-notiz');
  const zeiger = ebene.querySelector('.k1-hover');

  // Stationen: wohin der Zeiger fährt, was beim Hovern passiert, wo die Notiz steht.
  // gewicht = Länge am Scroll (die Masse brauchen mehr Zeit). Texte [A] Platzhalter bis zum Textinterview.
  const STATIONEN = [
    { gewicht: 2.6, text: 'Jeder Abstand gemessen, nicht geschätzt.', rand: 'links', bogen: 0.05,
      hover: (r) => { const t = r(titel); return [t.x + t.w * 0.55, t.y + t.h * 0.55]; },
      ziel: (r) => { const t = r(titel); return { ...r(hb), y: t.y + t.h * 0.3, h: 0 }; }, punkt: (z) => [z.x + 16, z.y + 9] },
    { gewicht: 1.2, text: 'Es tropft wirklich.', rand: 'links', bogen: 0.03,   // flach durch die Lücke unter dem Titel
      hover: (r) => { const t = r(tropf); return [t.x + t.w * 0.5, t.y + t.h * 0.45]; },
      // Pfeil endet mitten in der Lücke zwischen Titel und Lead, knapp links vom Tropfen
      ziel: (r) => { const t = r(tropf); const a = r(titel); const l = r(lead); return { ...t, y: (a.y + a.h + l.y) / 2 }; },
      punkt: (z) => [z.x + z.w * 0.82 - 12, z.y] },
    { gewicht: 1, text: 'Pulsiert: der Notfall ist live erreichbar.', rand: 'oben',
      hover: (r) => { const t = r(notruf); return [t.x + t.w * 0.45, t.y + t.h * 0.6]; },
      ziel: (r) => r(punkt), punkt: (z) => [z.x + z.w / 2, z.y - 5] },
    // unten: Pfeil steigt in der Lücke vor der nächsten Leistungs-Spalte hoch, nicht durch den Text
    { gewicht: 1, text: 'Zählt hoch, sobald man hinschaut.', rand: 'unten', spalte: (r) => r(leistungen[1]).x,
      hover: (r) => { const t = r(bewertung); return [t.x + t.w * 0.45, t.y + t.h * 0.6]; },
      ziel: (r) => r(sterne), punkt: (z) => [z.x + z.w * 0.6, z.y + z.h + 5] },
    { gewicht: 1, text: '37 Jahre, Jahr für Jahr.', rand: 'unten', spalte: (r) => r(leistungen[2]).x,
      hover: (r) => { const t = r(stempel); return [t.x + t.w * 0.55, t.y + t.h * 0.5]; },
      ziel: (r) => r(stempel), punkt: (z) => [z.x + z.w * 0.62, z.y + z.h - 2] },
    { gewicht: 1, text: 'Hebt sich und glänzt: hier geht es weiter.', rand: 'links', bogen: 0.08, kreis: true,
      hover: (r) => { const t = r(knopf); return [t.x + t.w * 0.6, t.y + t.h * 0.6]; },
      ziel: (r) => r(knopf), punkt: (z) => [z.x - 16, z.y + z.h / 2] },
    { gewicht: 1, text: 'Das Foto atmet mit.', rand: 'unten', spalte: (r, b) => b.x + b.w - 40,
      hover: (r) => { const t = r(foto); return [t.x + t.w * 0.55, t.y + t.h * 0.45]; },
      ziel: (r) => r(foto), punkt: (z) => [z.x + z.w - 40, z.y + z.h - 4] },
  ];
  const summe = STATIONEN.reduce((a, s) => a + s.gewicht, 0);
  let bei = ANFANG;
  for (const s of STATIONEN) {
    s.von = bei;
    s.lang = ((ENDE - ANFANG) * s.gewicht) / summe;
    bei += s.lang;
  }

  let zeigerLage = null;   // nachgezogen, damit Mausrad-Stösse nicht springen

  return function zeigen(p) {
    // aktive Station und wie weit der Zeiger dort ist (u 0–1); h = Hover-Fortschritt je Station
    let akt = -1;
    STATIONEN.forEach((s, i) => { if (p >= s.von) akt = i; });
    if (p >= ENDE) akt = STATIONEN.length;
    const u = akt >= 0 && akt < STATIONEN.length ? (p - STATIONEN[akt].von) / STATIONEN[akt].lang : 0;
    const hov = (i) => (i < akt ? 1 : i > akt ? 0 : klemm((u - FAHRT) / (1 - FAHRT - 0.1)));
    const hovert = (i) => i === akt && u > FAHRT;

    // Seite: Bewegungen beim Hovern. Zustände (Puls, Zahlen, Zoom) bleiben danach stehen
    const zaehl = aus(klemm(hov(3) / 0.7));
    zahl.textContent = (4.9 * zaehl).toFixed(1).replace('.', ',');
    anzahl.textContent = String(Math.round(87 * zaehl));
    voll.style.clipPath = `inset(0 ${100 - 98 * zaehl}% 0 0)`;
    const st = aus(klemm(hov(4) / 0.7));
    jahre.textContent = String(Math.round(37 * st));
    ring.style.rotate = `${200 * st}deg`;
    stempel.classList.toggle('hover', hovert(4));
    tropf.classList.toggle('tropft', hovert(1));
    notruf.classList.toggle('lebt', akt > 2 || hovert(2));
    knopf.classList.toggle('hover', hovert(5));
    knopf.style.setProperty('--glanz', `${-60 + 220 * glatt(klemm(hov(5) / 0.5))}%`);
    fotoBild.style.transform = `scale(${1 + 0.08 * glatt(hov(6))})`;
    if (hovert(1)) {
      // Fallhöhe bis in die Zeile darunter (beide Lagen relativ zur Seite .hb)
      const weit = Math.max(8, lead.offsetTop - tropf.offsetTop - tropf.offsetHeight * 0.86 + lead.offsetHeight * 0.2);
      tropf.style.setProperty('--fall', `${weit}px`);
    }

    // Rand: Zeiger, Masse und Notiz nur während der Pause und nur, wenn neben dem Fenster Platz ist
    const S = buehne.getBoundingClientRect();
    const B = browser.getBoundingClientRect();
    const sichtbar = p > 0.001 && p < 0.995 && B.left - S.left > 110;
    ebene.style.display = sichtbar ? '' : 'none';
    if (!sichtbar) { zeigerLage = null; return; }
    const r = (el) => {
      const k = el.getBoundingClientRect();
      return { x: k.left - S.left, y: k.top - S.top, w: k.width, h: k.height };
    };
    const b = r(browser);
    const g = parseFloat(getComputedStyle(ebene).fontSize);

    // Zeiger: kommt von unten rechts, fährt von Station zu Station, drückt kurz beim Ankommen
    const start = [b.x + b.w * 0.9, b.y + b.h + 40];
    let [zx, zy] = start;
    if (akt >= STATIONEN.length) {
      [zx, zy] = STATIONEN[STATIONEN.length - 1].hover(r);
    } else if (akt >= 0) {
      const vor = akt > 0 ? STATIONEN[akt - 1].hover(r) : start;
      const hin = STATIONEN[akt].hover(r);
      const f = glatt(klemm(u / FAHRT));
      const bogen = Math.sin(f * Math.PI) * 26;   // leichter Bogen statt gerader Linie
      zx = vor[0] + (hin[0] - vor[0]) * f;
      zy = vor[1] + (hin[1] - vor[1]) * f - bogen;
    }
    const drueck = akt === 0 && u > FAHRT && u < FAHRT + 0.04 ? 0.82 : 1;
    if (!zeigerLage) zeigerLage = [zx, zy];
    zeigerLage[0] += (zx - zeigerLage[0]) * 0.22;
    zeigerLage[1] += (zy - zeigerLage[1]) * 0.22;
    zeiger.style.transform = `translate(${zeigerLage[0]}px, ${zeigerLage[1]}px) scale(${drueck})`;
    zeiger.style.opacity = String(ein(0, ANFANG, p) * (1 - ein(ENDE, 0.03, p)));

    // Figma-Masse (Station 0): Klick auf den Titel, dann zieht sich ein Mass nach dem anderen auf
    const h0 = akt === 0 ? hov(0) : 0;
    const figA = akt === 0 ? ein(0, 0.06, h0) * (1 - ein(0.92, 0.08, u)) : 0;
    fig.style.opacity = String(figA);
    if (figA > 0) {
      const t = r(titel);
      const h = r(hb);
      const l = r(lead);
      const kn = r(knoepfe);
      const k = r(knopf);
      const li = r(link);
      setze(auswahl, t.x, t.y, t.w, t.h);
      auswahlText.textContent = `Titel · ${Math.round(parseFloat(getComputedStyle(titel).fontSize))} px`;
      mass(masse[0], 0.08, h.x, t.y + t.h * 0.3, t.x - h.x, 0);
      mass(masse[1], 0.24, t.x + t.w * 0.08, t.y + t.h, 0, l.y - t.y - t.h);
      mass(masse[2], 0.40, t.x + t.w * 0.08, l.y + l.h, 0, kn.y - l.y - l.h);
      mass(masse[3], 0.56, k.x + k.w, k.y + k.h / 2, li.x - k.x - k.w, 0);
    }
    function mass(el, a, x, y, w, h) {
      setze(el, x, y, w, h);
      el.style.setProperty('--z', String(ein(a, 0.1, h0)));
      el.querySelector('b').textContent = String(Math.round(w || h));
    }

    // Notiz der aktiven Station: schreibt sich von links, der Pfeil zieht sich ins Bild, geht beim Weiterfahren
    const s = STATIONEN[akt];
    const sch = s ? ein(FAHRT + 0.04, 0.14, u) : 0;
    const a = s ? sch * (1 - ein(0.9, 0.1, u)) : 0;
    for (const el of [notiz, pfad, spitze, kreis]) el.style.opacity = String(a);
    if (a <= 0) return;
    if (notiz.textContent !== s.text) notiz.textContent = s.text;
    notiz.style.clipPath = `inset(-20% ${100 - 100 * sch}% -20% -5%)`;
    const z = s.ziel(r);
    const [px, py] = s.punkt(z);
    const luft = g * 0.9;
    const platzRand = s.rand === 'links' ? b.x : 1e4;
    notiz.style.maxWidth = `${Math.min(g * 12, platzRand - luft - 12)}px`;
    const w = notiz.offsetWidth;
    const hoch = notiz.offsetHeight;
    const lage = platz(s, b, [px, py], w, hoch, g, s.spalte ? s.spalte(r, b) - g * 1.1 : 0);
    // nie über den Bildrand hinaus
    lage.x = klemm(lage.x, 12, S.width - w - 12);
    notiz.style.transform = `translate(${lage.x}px, ${lage.y}px)`;
    notiz.style.textAlign = s.rand === 'links' ? 'right' : s.spalte ? 'center' : 'left';
    zeichnePfeil(lage.von, [px, py], ein(FAHRT + 0.1, 0.14, u), s.bogen, lage.knick);
    kreis.style.display = s.kreis ? '' : 'none';
    if (s.kreis) {
      kreis.setAttribute('d', kringel(z, 9));
      kreis.style.strokeDashoffset = String(1 - ein(FAHRT, 0.16, u));
    }
  };

  function setze(el, x, y, w, h) {
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.width = `${Math.max(0, w)}px`;
    el.style.height = `${Math.max(0, h)}px`;
  }

  // Wo der Zettel steht und wo der Pfeil an ihm startet
  function platz(s, b, [zx, zy], w, h, g, spalte) {
    const luft = g * 0.9;
    if (s.rand === 'links') {
      const y = zy - h / 2;
      return { x: b.x - luft - w, y, von: [b.x - luft * 0.5, zy] };
    }
    if (s.rand === 'oben') {
      const x = zx - w * 0.75;
      const y = b.y - luft - h;
      return { x, y, von: [zx - w * 0.05, y + h + 4] };
    }
    // unten: Pfeil senkrecht in der Spaltenlücke hoch, dann zum Ziel
    const y = b.y + b.h + luft * 0.8;
    return { x: spalte - w / 2, y, von: [spalte, y - 4], knick: [spalte, zy + (b.y + b.h - zy) * 0.25] };
  }

  // Geschwungener Pfeil von Hand: leichte Kurve, Spitze erst, wenn der Strich ankommt
  function zeichnePfeil([ax, ay], [ex, ey], f, bogen = 0.28, knick) {
    const dx = ex - ax;
    const dy = ey - ay;
    const [cx, cy] = knick || [ax + dx * 0.5 - dy * bogen, ay + dy * 0.5 + dx * bogen];
    pfad.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
    pfad.style.strokeDashoffset = String(1 - f);
    const l = Math.hypot(ex - cx, ey - cy) || 1;
    const ux = (ex - cx) / l;
    const uy = (ey - cy) / l;
    const k = 9;
    const p1 = [ex - ux * k - uy * k * 0.55, ey - uy * k + ux * k * 0.55];
    const p2 = [ex - ux * k + uy * k * 0.55, ey - uy * k - ux * k * 0.55];
    spitze.setAttribute('d', `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`);
    spitze.style.strokeDashoffset = String(1 - klemm((f - 0.85) / 0.15));
  }

  // Kreis von Hand um ein Element: etwas mehr als eine Runde, leicht schief
  function kringel(z, luft) {
    const cx = z.x + z.w / 2;
    const cy = z.y + z.h / 2;
    const rx = z.w / 2 + luft;
    const ry = z.h / 2 + luft * 0.8;
    const pkt = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * 1.12;
      const w = -2.3 + t * Math.PI * 2;
      const wackel = 1 + 0.04 * Math.sin(t * 9) + 0.05 * t;
      pkt.push(`${(cx + Math.cos(w) * rx * wackel).toFixed(1)} ${(cy + Math.sin(w) * ry * wackel - 3 * t).toFixed(1)}`);
    }
    return `M${pkt.join(' L')}`;
  }
}
