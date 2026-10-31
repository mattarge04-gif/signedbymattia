// Kapitel I, Baustein K1-B1: Im Torbogen hängt ein gemaltes Fresko der Himmelblau-Werkstatt.
// Beim Reinzoomen reisst die Farbe vom Handgelenk des Klempners aus, die Schollen blättern ab und
// fallen ins Bild, darunter liegt die Website. Alles hängt am Scroll (s), also auch rückwärts.
// Drehbuch: website/drehbuch/10-startseite.md („Überarbeitung Kapitel I“)
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const zufall = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Takt auf der Kapitel-Bahn (s), abgestimmt auf den Zoom in kapitel1.js (0.08–0.30)
const TAKT = { risse: 0.07, risseDauer: 0.07, fallen: 0.13, fallenSpanne: 0.08, fallDauer: 0.07 };
const URSPRUNG = [0.47, 0.42];   // Smartwatch des Klempners: hier reisst es zuerst
const SPALTEN = 7, ZEILEN = 13;

const bild = new Image();
bild.decoding = 'async';
bild.src = 'bilder/k1-fresko.webp';

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
    const d = Math.hypot((mx - URSPRUNG[0]) * ax, (my - URSPRUNG[1]) * ay);
    return {
      poly, mx, my, d,
      drall: (zufall(i + 3) - 0.5) * 2.4,
      seit: (zufall(i + 5) - 0.5) * 0.5,
      kipp: 0.6 + zufall(i + 11) * 1.4,
    };
  });
}
const schollen = schollenBauen();
// Abstand zum Ursprung auf 0–1, daraus der Zeitpunkt, an dem die Scholle fällt
const weitest = Math.max(...schollen.map((sc) => sc.d));
schollen.forEach((sc, i) => {
  sc.d /= weitest;
  sc.start = TAKT.fallen + sc.d * TAKT.fallenSpanne + zufall(i + 7) * 0.012;
});

function leinwand(id, z) {
  const c = document.createElement('canvas');
  c.id = id;
  c.className = 'k1-fresko';
  c.style.zIndex = z;
  c.setAttribute('aria-hidden', 'true');
  return c;
}

export function freskoAnlegen(buehne, wand) {
  const hinten = leinwand('k1FreskoHinten', 2);   // im Bogen, hinter der Wand
  const vorne = leinwand('k1FreskoVorne', 5);     // fallende Schollen, vor der Wand
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

  // Fresko „cover“ in die Öffnung legen
  function freskoZeichnen(ctx, R) {
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
    for (const c of [ch, cv]) { c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, buehne.clientWidth, buehne.clientHeight); }
    const fertig = s > TAKT.fallen + TAKT.fallenSpanne + 0.012 + TAKT.fallDauer;
    hinten.style.visibility = vorne.style.visibility = fertig ? 'hidden' : 'visible';
    if (fertig || !bild.complete || !bild.naturalWidth) return;

    const riss = klemm((s - TAKT.risse) / TAKT.risseDauer);
    const fest = [], lose = [];
    for (const sc of schollen) (s < sc.start ? fest : lose).push(sc);

    // 1 · Noch haftende Farbe, in einem Zug
    if (fest.length) {
      ch.save();
      ch.beginPath();
      for (const sc of fest) {
        sc.poly.forEach(([x, y], i) => ch[i ? 'lineTo' : 'moveTo'](R.x + x * R.w, R.y + y * R.h));
        ch.closePath();
      }
      ch.clip();
      freskoZeichnen(ch, R);
      ch.restore();
    }

    // 2 · Risse wachsen vom Ursprung aus; kurz vor dem Fallen hebt sich die Scholle (heller Rand, Schatten)
    const breite = Math.max(0.8, R.w / 420);
    for (const sc of fest) {
      const sichtbar = klemm((riss - sc.d) / 0.12);
      if (sichtbar <= 0) continue;
      const heben = klemm(1 - (sc.start - s) / 0.025);
      ch.save();
      pfad(ch, sc.poly, R);
      ch.lineJoin = 'round';
      ch.strokeStyle = `rgba(92, 70, 74, ${0.4 * sichtbar})`;
      ch.lineWidth = breite * (1 + heben);
      ch.stroke();
      if (heben > 0) {
        ch.translate(-breite * heben, -breite * heben);
        pfad(ch, sc.poly, R);
        ch.strokeStyle = `rgba(255, 246, 232, ${0.7 * heben})`;
        ch.lineWidth = breite;
        ch.stroke();
      }
      ch.restore();
    }

    // 3 · Lose Schollen kippen nach vorn und fallen, mit Kalkstaub
    for (const sc of lose) {
      const u = klemm((s - sc.start) / TAKT.fallDauer);
      if (u >= 1) continue;
      const px = R.x + sc.mx * R.w, py = R.y + sc.my * R.h;
      const fallY = u * u * R.h * 0.9;
      const fallX = sc.seit * u * R.w;
      const nah = 1 + 0.45 * u;                       // kommt der Kamera entgegen
      const kipp = Math.cos(Math.min(Math.PI * 0.45, u * sc.kipp * 2.2));
      cv.save();
      cv.globalAlpha = 1 - klemm((u - 0.65) / 0.35);
      cv.translate(px + fallX, py + fallY);
      cv.rotate(sc.drall * u);
      cv.scale(nah, nah * kipp);
      cv.translate(-px, -py);
      cv.shadowColor = 'rgba(70, 50, 80, 0.35)';
      cv.shadowBlur = 14 * u;
      cv.shadowOffsetY = 10 * u;
      pfad(cv, sc.poly, R);
      cv.fillStyle = '#efe4d6';                       // Rückseite: Kalkputz
      cv.fill();
      cv.shadowColor = 'transparent';
      cv.clip();
      cv.globalAlpha *= 0.55 + 0.45 * kipp;           // abgewandt: dunkler
      freskoZeichnen(cv, R);
      cv.restore();

      // Staub: ein paar helle Körner stieben aus der Bruchstelle
      const staub = klemm(u / 0.8);
      if (staub < 1) {
        cv.save();
        cv.fillStyle = `rgba(251, 243, 234, ${0.8 * (1 - staub)})`;
        for (let k = 0; k < 6; k++) {
          const w = zufall(sc.start * 1000 + k) * Math.PI * 2;
          const weit = (0.2 + zufall(k + sc.mx * 50)) * R.w * 0.12 * staub;
          cv.beginPath();
          cv.arc(px + Math.cos(w) * weit, py + Math.sin(w) * weit + staub * staub * R.h * 0.08, breite * (1.2 + zufall(k) * 1.5), 0, Math.PI * 2);
          cv.fill();
        }
        cv.restore();
      }
    }
  };
}
