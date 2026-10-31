// K1-B4 · Die neue Seite lebt: in der Pause vor dem Handy zeigt sie ihre Bewegungen.
// Zuerst Figma-Masse (die Abstände stimmen), dann Notizen von Hand mit Pfeilen, eine nach der anderen.
// Alles hängt am Scroll: p läuft während der Pause von 0 bis 1 (kapitel1.js), rückwärts scrollen spult zurück.
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const aus = (t) => 1 - (1 - t) ** 3;
const ein = (a, dauer, p) => glatt(klemm((p - a) / dauer));

export function zeigenAnlegen(buehne, browser) {
  const $ = (s) => document.querySelector(`.hb-farbe ${s}`);
  const hb = document.querySelector('.hb-farbe');
  const titel = $('.hb-titel');
  const lead = $('.hb-lead');
  const knoepfe = $('.hb-knoepfe');
  const knopf = $('.hb-knopf.haupt');
  const link = $('.hb-link');
  const tropf = $('.hb-tropf');
  const tropfen = $('.hb-tropfen');
  const platsch = $('.hb-platsch');
  const punkt = $('.hb-notruf i');
  const notruf = $('.hb-notruf');
  const sterne = $('.hb-sterne-box');
  const voll = $('.hb-sterne.voll');
  const zahl = $('.hb-zahl');
  const anzahl = $('.hb-anzahl');
  const stempel = $('.hb-stempel');
  const ring = $('.hb-stempel svg');
  const jahre = $('.hb-jahre');
  const foto = $('.hb-foto');
  const leistungen = [...document.querySelectorAll('.hb-farbe .hb-leistungen li')];
  const fotoBild = $('.hb-foto-rahmen i');

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
    <svg class="k1-striche"></svg>`;
  buehne.append(ebene);
  const fig = ebene.querySelector('.k1-fig');
  const auswahl = ebene.querySelector('.k1-auswahl');
  const auswahlText = auswahl.querySelector('span');
  const masse = [...ebene.querySelectorAll('.k1-mass')];
  const svg = ebene.querySelector('svg');
  const NS = 'http://www.w3.org/2000/svg';

  // Notizen von Hand: Ziel im Bild, Platz am Rand, Seite des Zettels, von der der Pfeil startet.
  // Texte [A] Platzhalter bis zum Textinterview.
  const NOTIZEN = [
    { bei: 0.05, aus: 0.24, text: 'Jeder Abstand gemessen, nicht geschätzt.', rand: 'links', bogen: 0.05,
      ziel: (r) => { const t = r(titel); return { ...r(hb), y: t.y + t.h * 0.3, h: 0 }; }, punkt: (z) => [z.x + 16, z.y + 9] },
    { bei: 0.30, text: 'Es tropft wirklich.', rand: 'links', bogen: 0.03,   // flach durch die Lücke unter dem Titel
      ziel: (r) => r(tropf), punkt: (z) => [z.x + z.w * 0.82 - 8, z.y + z.h * 0.97] },
    { bei: 0.41, text: 'Pulsiert: der Notfall ist live erreichbar.', rand: 'oben-rechts',
      ziel: (r) => r(punkt), punkt: (z) => [z.x + z.w / 2, z.y - 5] },
    // unten: Pfeil steigt in der Lücke vor der nächsten Leistungs-Spalte hoch, nicht durch den Text
    { bei: 0.50, text: 'Zählt hoch, sobald man hinschaut.', rand: 'unten', spalte: 1,
      ziel: (r) => r(sterne), punkt: (z) => [z.x + z.w * 0.6, z.y + z.h + 5] },
    { bei: 0.60, text: '37 Jahre, Jahr für Jahr.', rand: 'unten', spalte: 2,
      ziel: (r) => r(stempel), punkt: (z) => [z.x + z.w * 0.62, z.y + z.h - 2] },
    { bei: 0.72, text: 'Glänzt einmal: hier geht es weiter.', rand: 'links', bogen: 0.08,
      ziel: (r) => r(knopf), punkt: (z) => [z.x - 16, z.y + z.h / 2], kreis: true },
    { bei: 0.82, text: 'Das Foto atmet mit.', rand: 'rechts',
      ziel: (r) => r(foto), punkt: (z) => [z.x + z.w - 30, z.y + z.h * 0.22] },
  ];
  for (const n of NOTIZEN) {
    n.el = document.createElement('p');
    n.el.className = 'k1-notiz';
    n.el.textContent = n.text;
    ebene.append(n.el);
    n.pfad = document.createElementNS(NS, 'path');
    n.spitze = document.createElementNS(NS, 'path');
    for (const p of [n.pfad, n.spitze]) { p.setAttribute('pathLength', '1'); svg.append(p); }
    if (n.kreis) {
      n.ring = document.createElementNS(NS, 'path');
      n.ring.setAttribute('pathLength', '1');
      n.ring.classList.add('pink');
      svg.append(n.ring);
    }
  }

  let gesehen = false;

  return function zeigen(p) {
    // Seite: Bewegungen, die nach der Pause stehen bleiben (p bleibt dann 1)
    const zaehl = aus(klemm((p - 0.48) / 0.1));
    zahl.textContent = (4.9 * zaehl).toFixed(1).replace('.', ',');
    anzahl.textContent = String(Math.round(87 * zaehl));
    voll.style.clipPath = `inset(0 ${100 - 98 * zaehl}% 0 0)`;
    jahre.textContent = String(Math.round(37 * aus(klemm((p - 0.58) / 0.1))));
    ring.style.rotate = `${170 * glatt(p)}deg`;
    notruf.classList.toggle('lebt', p > 0.4);
    knopf.style.setProperty('--glanz', `${-60 + 220 * glatt(klemm((p - 0.74) / 0.08))}%`);
    fotoBild.style.transform = `scale(${1 + 0.08 * glatt(p)})`;

    // Tropfen: hängt sich an das t, fällt, platscht auf die Zeile darunter
    const werden = glatt(klemm((p - 0.28) / 0.05));
    const fall = klemm((p - 0.33) / 0.06) ** 2;
    if (werden > 0 && werden < 1 || fall > 0 && fall < 1 || gesehen !== p > 0.28) {
      gesehen = p > 0.28;
      // beide Lagen relativ zur Seite (.hb ist der nächste positionierte Vorfahre)
      const weit = Math.max(8, lead.offsetTop - tropf.offsetTop - tropf.offsetHeight * 0.86 + lead.offsetHeight * 0.18);
      tropfen.style.transform = `translateY(${fall * weit}px) scale(${werden}, ${werden * (1 + 0.35 * fall)}) rotate(45deg)`;
      tropfen.style.opacity = String(werden * (1 - klemm((fall - 0.92) / 0.08)));
      platsch.style.top = `calc(86% + ${weit}px)`;
    }
    const pl = klemm((p - 0.39) / 0.05);
    platsch.style.opacity = String(pl > 0 && pl < 1 ? 1 - pl : 0);
    platsch.style.transform = `translateX(-50%) scale(${0.3 + 1.2 * pl})`;

    // Rand: Masse und Notizen nur während der Pause und nur, wenn neben dem Fenster Platz ist
    const B = browser.getBoundingClientRect();
    const S = buehne.getBoundingClientRect();
    const sichtbar = p > 0.001 && p < 0.995 && B.left - S.left > 110;
    ebene.style.display = sichtbar ? '' : 'none';
    if (!sichtbar) return;
    const r = (el) => {
      const k = el.getBoundingClientRect();
      return { x: k.left - S.left, y: k.top - S.top, w: k.width, h: k.height };
    };
    const b = r(browser);
    const weg = 1 - glatt(klemm((p - 0.93) / 0.06));   // am Ende der Pause räumt alles ab

    // Figma-Masse (Phase 1)
    const figA = ein(0.03, 0.05, p) * (1 - ein(0.24, 0.04, p));
    fig.style.opacity = String(figA);
    if (figA > 0) {
      const t = r(titel);
      const h = r(hb);
      const l = r(lead);
      const kn = r(knoepfe);
      const k = r(knopf);
      const li = r(link);
      setze(auswahl, t.x - 4, t.y - 4, t.w + 8, t.h + 8);
      auswahlText.textContent = `Titel · ${Math.round(parseFloat(getComputedStyle(titel).fontSize))} px`;
      mass(masse[0], 0.05, h.x, t.y + t.h * 0.3, t.x - h.x, 0);
      mass(masse[1], 0.07, t.x + 40, t.y + t.h, 0, l.y - t.y - t.h);
      mass(masse[2], 0.09, t.x + 40, l.y + l.h, 0, kn.y - l.y - l.h);
      mass(masse[3], 0.11, k.x + k.w, k.y + k.h / 2, li.x - k.x - k.w, 0);
    }
    function mass(el, a, x, y, w, h) {
      setze(el, x, y, w, h);
      el.style.setProperty('--z', String(ein(a, 0.03, p)));
      el.querySelector('b').textContent = String(Math.round(w || h));
    }

    // Notizen (Phase 2): Text schreibt sich von links, der Pfeil zieht sich ins Bild
    const gross = parseFloat(getComputedStyle(ebene).fontSize);
    for (const n of NOTIZEN) {
      const sch = ein(n.bei, 0.035, p);
      const pf = ein(n.bei + 0.025, 0.04, p);
      const zu = n.aus ? 1 - ein(n.aus, 0.04, p) : weg;
      const a = sch > 0 ? zu : 0;
      n.el.style.opacity = String(a);
      n.pfad.style.opacity = n.spitze.style.opacity = String(a);
      if (n.ring) n.ring.style.opacity = String(a);
      if (a <= 0) continue;
      n.el.style.clipPath = `inset(-20% ${100 - 100 * sch}% -20% -5%)`;
      const z = n.ziel(r);
      const [zx, zy] = n.punkt(z);
      // am Rand nur so breit, wie Platz ist
      const luft = gross * 0.9;
      const rand = n.rand === 'links' ? b.x : n.rand === 'rechts' ? S.width - b.x - b.w : 1e4;
      n.el.style.maxWidth = `${Math.min(gross * 12, rand - luft - 12)}px`;
      const breite = n.el.offsetWidth;
      const hoch = n.el.offsetHeight;
      const spalte = n.spalte ? r(leistungen[n.spalte]).x - gross * 1.1 : null;
      const lage = platz(n.rand, b, [zx, zy], z, breite, hoch, gross, spalte);
      n.el.style.transform = `translate(${lage.x}px, ${lage.y}px)`;
      n.el.style.textAlign = lage.links ? 'right' : spalte ? 'center' : 'left';
      zeichnePfeil(n, lage.von, [zx, zy], pf, lage.knick);
      if (n.ring) {
        n.ring.setAttribute('d', kringel(z, 12));
        n.ring.style.strokeDashoffset = String(1 - ein(n.bei - 0.02, 0.05, p));
      }
    }
  };

  function setze(el, x, y, w, h) {
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.width = `${Math.max(0, w)}px`;
    el.style.height = `${Math.max(0, h)}px`;
  }

  // Wo der Zettel steht und wo der Pfeil an ihm startet
  function platz(rand, b, [zx, zy], z, w, h, g, spalte) {
    const luft = g * 0.9;
    switch (rand) {
      case 'links': {
        const x = b.x - luft - w;
        const y = zy - h / 2;
        return { x, y, links: true, von: [b.x - luft * 0.5, zy] };
      }
      case 'rechts': {
        const x = b.x + b.w + luft;
        const y = z.y + z.h * 0.22 - h / 2;
        return { x, y, von: [x - luft * 0.5, y + h * 0.5] };
      }
      case 'oben-rechts': {
        const x = Math.min(b.x + b.w - w, z.x - w * 0.6);
        const y = b.y - luft - h;
        return { x, y, von: [x + w * 0.75, y + h + 4] };
      }
      default: {   // unten, Pfeil senkrecht in der Spaltenlücke, dann zum Ziel
        const x = spalte - w / 2;
        const y = b.y + b.h + luft * 0.8;
        return { x, y, von: [spalte, y - 4], knick: [spalte, zy + (b.y + b.h - zy) * 0.25] };
      }
    }
  }

  // Geschwungener Pfeil von Hand: leichte Kurve, Spitze erst, wenn der Strich ankommt
  function zeichnePfeil(n, [ax, ay], [ex, ey], f, knick) {
    const dx = ex - ax;
    const dy = ey - ay;
    const bogen = n.bogen ?? 0.28;
    const [cx, cy] = knick || [ax + dx * 0.5 - dy * bogen, ay + dy * 0.5 + dx * bogen];
    n.pfad.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
    n.pfad.style.strokeDashoffset = String(1 - f);
    const l = Math.hypot(ex - cx, ey - cy) || 1;
    const ux = (ex - cx) / l;
    const uy = (ey - cy) / l;
    const s = 9;
    const p1 = [ex - ux * s - uy * s * 0.55, ey - uy * s + ux * s * 0.55];
    const p2 = [ex - ux * s + uy * s * 0.55, ey - uy * s - ux * s * 0.55];
    n.spitze.setAttribute('d', `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`);
    n.spitze.style.strokeDashoffset = String(1 - klemm((f - 0.85) / 0.15));
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
