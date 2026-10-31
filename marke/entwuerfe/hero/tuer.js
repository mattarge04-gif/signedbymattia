// Kapitel I, Baustein K1-B1: Im Torbogen steht eine gemalte Tür. Beim Reinzoomen reisst sie vom
// Schlüsselloch aus, durch die Risse bricht Sonnenlicht, die Tür bröckelt weg, ein heller Blitz,
// dann steht dahinter die Website. Alles hängt am Scroll (s), also auch rückwärts.
// Drehbuch: website/drehbuch/10-startseite.md („Überarbeitung Kapitel I“), Mattia 31.10.2026
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const zufall = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Takt auf der Kapitel-Bahn (s), abgestimmt auf den Zoom in kapitel1.js (0.08–0.30)
const TAKT = {
  risse: 0.06, risseDauer: 0.06,     // Risse laufen vom Schlüsselloch aus
  licht: 0.07, lichtDauer: 0.09,     // Sonne dahinter wird stärker
  fallen: 0.13, fallenSpanne: 0.06, fallDauer: 0.06,
  blitzAn: 0.18, blitzSpitze: 0.21, blitzAus: 0.27,
};
const URSPRUNG = [0.546, 0.655]; // Schlüsselloch der Tür (k1-tuer-v1.jpg)
const SPALTEN = 8, ZEILEN = 15;
const SONNE = '255, 244, 214';

const bild = new Image();
bild.decoding = 'async';
bild.src = 'bilder/k1-tuer.webp';

// Schollen: Voronoi-Zellen aus einem verwackelten Raster, im Einheitsquadrat der Öffnung
function schollenBauen() {
  const punkte = [];
  for (let z = 0; z < ZEILEN; z++) for (let sp = 0; sp < SPALTEN; sp++) {
    const n = z * SPALTEN + sp;
    punkte.push([(sp + 0.15 + 0.7 * zufall(n)) / SPALTEN, (z + 0.15 + 0.7 * zufall(n + 99)) / ZEILEN]);
  }
  // Abstände in Bildmassen messen (Öffnung ist etwa doppelt so hoch wie breit)
  const ax = 1, ay = 2;
  return punkte.map((p, i) => {
    let poly = [[0, 0], [1, 0], [1, 1], [0, 1]];
    punkte.forEach((q, j) => {
      if (i === j) return;
      // Halbebene: näher an p als an q
      const nx = (q[0] - p[0]) * ax * ax, ny = (q[1] - p[1]) * ay * ay;
      const c = (nx * (p[0] + q[0]) + ny * (p[1] + q[1])) / 2;
      const innen = (v) => nx * v[0] + ny * v[1] <= c;
      const neu = [];
      poly.forEach((a, k) => {
        const b = poly[(k + 1) % poly.length];
        const ia = innen(a), ib = innen(b);
        if (ia) neu.push(a);
        if (ia !== ib) {
          const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c;
          const t = da / (da - db);
          neu.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
      });
      poly = neu;
    });
    const mx = poly.reduce((v, q) => v + q[0], 0) / poly.length;
    const my = poly.reduce((v, q) => v + q[1], 0) / poly.length;
    return {
      poly, mx, my,
      d: Math.hypot((mx - URSPRUNG[0]) * ax, (my - URSPRUNG[1]) * ay),
      drall: (zufall(i + 3) - 0.5) * 3,
      seit: (zufall(i + 5) - 0.5) * 0.25,
    };
  });
}
const schollen = schollenBauen();
// Abstand zum Ursprung auf 0–1, daraus der Zeitpunkt, an dem die Scholle abbröckelt
const weitest = Math.max(...schollen.map((sc) => sc.d));
schollen.forEach((sc, i) => {
  sc.d /= weitest;
  sc.start = TAKT.fallen + sc.d * TAKT.fallenSpanne + zufall(i + 7) * 0.01;
});
const ENDE = TAKT.blitzAus;

// Strahlen, die aus den Rissen ins Bild fallen
const STRAHLEN = Array.from({ length: 16 }, (_, i) => ({
  winkel: (i / 16) * Math.PI * 2 + (zufall(i + 40) - 0.5) * 0.3,
  breite: 0.04 + zufall(i + 60) * 0.07,
  laenge: 0.7 + zufall(i + 80) * 0.6,
  hell: 0.5 + zufall(i + 90) * 0.5,
}));

function leinwand(id, z) {
  const c = document.createElement('canvas');
  c.id = id;
  c.className = 'k1-tuer';
  c.style.zIndex = z;
  c.setAttribute('aria-hidden', 'true');
  return c;
}

export function tuerAnlegen(buehne, wand) {
  const hinten = leinwand('k1TuerHinten', 2);   // im Bogen, hinter der Wand
  const vorne = leinwand('k1TuerVorne', 5);     // Strahlen, Brocken und Blitz, vor der Wand
  wand.before(hinten);
  wand.after(vorne);
  const ch = hinten.getContext('2d');
  const cv = vorne.getContext('2d');
  let groesse = '';

  function anpassen() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = buehne.clientWidth, h = buehne.clientHeight;
    const k = `${w}x${h}x${dpr}`;
    if (k === groesse) return dpr;
    groesse = k;
    for (const c of [hinten, vorne]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    return dpr;
  }

  // Tür „cover“ in die Öffnung legen
  function tuerZeichnen(ctx, R) {
    const k = Math.max(R.w / bild.naturalWidth, R.h / bild.naturalHeight);
    const bw = bild.naturalWidth * k, bh = bild.naturalHeight * k;
    ctx.drawImage(bild, R.x + (R.w - bw) / 2, R.y + (R.h - bh) / 2, bw, bh);
  }
  function pfad(ctx, poly, R) {
    ctx.beginPath();
    poly.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](R.x + x * R.w, R.y + y * R.h));
    ctx.closePath();
  }

  // R = Öffnung auf dem Bildschirm (nach dem Zoom), s = Kapitel-Fortschritt
  return function zeichnen(s, R) {
    const dpr = anpassen();
    const W = buehne.clientWidth, H = buehne.clientHeight;
    for (const c of [ch, cv]) { c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H); }
    const fertig = s > ENDE;
    hinten.style.visibility = vorne.style.visibility = fertig ? 'hidden' : 'visible';
    if (fertig || !bild.complete || !bild.naturalWidth) return;

    const riss = klemm((s - TAKT.risse) / TAKT.risseDauer);
    const licht = glatt(klemm((s - TAKT.licht) / TAKT.lichtDauer));
    const blitz = s < TAKT.blitzSpitze
      ? glatt(klemm((s - TAKT.blitzAn) / (TAKT.blitzSpitze - TAKT.blitzAn)))
      : 1 - glatt(klemm((s - TAKT.blitzSpitze) / (TAKT.blitzAus - TAKT.blitzSpitze)));
    const ox = R.x + URSPRUNG[0] * R.w, oy = R.y + URSPRUNG[1] * R.h;
    const breite = Math.max(0.8, R.w / 380);
    const fest = [], lose = [];
    for (const sc of schollen) (s < sc.start ? fest : lose).push(sc);

    // 1 · Hinter der Tür: die Sonne. Sichtbar, wo schon Brocken fehlen; nach dem Blitz weg
    const hinterLicht = s < TAKT.blitzSpitze ? 1 : 1 - blitz;
    if (lose.length && hinterLicht > 0) {
      const g = ch.createRadialGradient(ox, oy, 0, ox, oy, R.h * 0.7);
      g.addColorStop(0, `rgba(255, 255, 250, ${hinterLicht})`);
      g.addColorStop(1, `rgba(${SONNE}, ${hinterLicht})`);
      ch.fillStyle = g;
      ch.fillRect(R.x, R.y, R.w, R.h);
    }

    // 2 · Die Tür, soweit sie noch hält, in einem Zug
    if (fest.length) {
      ch.save();
      ch.beginPath();
      for (const sc of fest) {
        sc.poly.forEach(([x, y], i) => ch[i ? 'lineTo' : 'moveTo'](R.x + x * R.w, R.y + y * R.h));
        ch.closePath();
      }
      ch.clip();
      tuerZeichnen(ch, R);
      ch.restore();
    }

    // 3 · Risse: erst dunkle Haarlinie, dann glühen sie, weil Sonne durchscheint
    ch.save();
    ch.lineJoin = 'round';
    for (const sc of fest) {
      const sichtbar = klemm((riss - sc.d) / 0.12);
      if (sichtbar <= 0) continue;
      pfad(ch, sc.poly, R);
      ch.strokeStyle = `rgba(92, 70, 74, ${0.45 * sichtbar * (1 - licht)})`;
      ch.lineWidth = breite;
      ch.stroke();
    }
    if (licht > 0) {
      ch.globalCompositeOperation = 'lighter';
      ch.shadowColor = `rgba(${SONNE}, 1)`;
      ch.shadowBlur = 6 + 18 * licht;
      for (const sc of fest) {
        const sichtbar = klemm((riss - sc.d) / 0.12);
        if (sichtbar <= 0) continue;
        // Kurz vor dem Abbröckeln wird der Spalt breiter und heller
        const weit = klemm(1 - (sc.start - s) / 0.03);
        pfad(ch, sc.poly, R);
        ch.strokeStyle = `rgba(${SONNE}, ${sichtbar * licht * (0.6 + 0.4 * weit)})`;
        ch.lineWidth = breite * (1 + 1.5 * licht + 2.5 * weit);
        ch.stroke();
      }
    }
    ch.restore();

    // 4 · Strahlen fallen aus der Tür ins Bild (vor der Wand)
    const strahl = licht * (1 - (s > TAKT.blitzSpitze ? glatt(klemm((s - TAKT.blitzSpitze) / 0.03)) : 0));
    if (strahl > 0) {
      cv.save();
      cv.globalCompositeOperation = 'lighter';
      const lang = Math.hypot(W, H) * (0.4 + 0.6 * strahl);
      for (const st of STRAHLEN) {
        const l = lang * st.laenge;
        const g = cv.createRadialGradient(ox, oy, 0, ox, oy, l);
        g.addColorStop(0, `rgba(${SONNE}, ${0.32 * strahl * st.hell})`);
        g.addColorStop(1, `rgba(${SONNE}, 0)`);
        cv.fillStyle = g;
        cv.beginPath();
        cv.moveTo(ox, oy);
        cv.lineTo(ox + Math.cos(st.winkel - st.breite) * l, oy + Math.sin(st.winkel - st.breite) * l);
        cv.lineTo(ox + Math.cos(st.winkel + st.breite) * l, oy + Math.sin(st.winkel + st.breite) * l);
        cv.closePath();
        cv.fill();
      }
      cv.restore();
    }

    // 5 · Lose Brocken bröckeln nach unten weg, mit Kalkstaub
    for (const sc of lose) {
      const u = klemm((s - sc.start) / TAKT.fallDauer);
      if (u >= 1) continue;
      const px = R.x + sc.mx * R.w, py = R.y + sc.my * R.h;
      cv.save();
      cv.globalAlpha = 1 - klemm((u - 0.6) / 0.4);
      cv.translate(px + sc.seit * u * R.w, py + u * u * R.h * 1.1);
      cv.rotate(sc.drall * u);
      cv.scale(1 + 0.15 * u, 1 + 0.15 * u);
      cv.translate(-px, -py);
      cv.shadowColor = 'rgba(70, 50, 80, 0.3)';
      cv.shadowBlur = 10 * u;
      cv.shadowOffsetY = 8 * u;
      pfad(cv, sc.poly, R);
      cv.fillStyle = '#efe4d6';                       // Bruchkante: Kalkputz
      cv.fill();
      cv.shadowColor = 'transparent';
      cv.clip();
      tuerZeichnen(cv, R);
      cv.restore();

      const staub = klemm(u / 0.8);
      if (staub < 1) {
        cv.save();
        cv.fillStyle = `rgba(251, 243, 234, ${0.8 * (1 - staub)})`;
        for (let k = 0; k < 4; k++) {
          const w = zufall(sc.start * 1000 + k) * Math.PI * 2;
          const weit = (0.2 + zufall(k + sc.mx * 50)) * R.w * 0.08 * staub;
          cv.beginPath();
          cv.arc(px + Math.cos(w) * weit, py + Math.sin(w) * weit + staub * staub * R.h * 0.1, breite * (1 + zufall(k) * 1.4), 0, Math.PI * 2);
          cv.fill();
        }
        cv.restore();
      }
    }

    // 6 · Blitz: das Licht füllt den ganzen Bildschirm, dann steht dahinter die Website
    if (blitz > 0) {
      const g = cv.createRadialGradient(ox, oy, 0, ox, oy, Math.hypot(W, H) * (0.3 + 0.7 * blitz));
      g.addColorStop(0, `rgba(255, 255, 252, ${blitz})`);
      g.addColorStop(0.6, `rgba(${SONNE}, ${blitz * 0.95})`);
      g.addColorStop(1, `rgba(${SONNE}, ${blitz * blitz * 0.9})`);
      cv.fillStyle = g;
      cv.fillRect(0, 0, W, H);
    }
  };
}
