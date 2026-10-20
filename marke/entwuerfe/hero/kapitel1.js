// Kapitel I Website · Trompe-l'œil: der gemalte Torbogen wird ein echter Browser.
// Drehbuch: website/drehbuch/10-startseite.md (11) · Werte: website/drehbuch/00-grammatik.md
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const aus = (t) => 1 - (1 - t) ** 3;
const pointe = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; };

// Öffnung im Wandbild (Anteil), gemessen beim Freistellen (bilder/k1-manifest.json)
const LOCH = [0.4197, 0.4141, 0.5799, 1.0];
const WAND = [2752, 1536];
const PARAMETER = { nachziehen: 0.12, zoom: 1.6, oopsTempo: 2.4 };

const sektion = $('#k1Bahn');
const buehne = $('#k1Buehne');
const wand = $('#k1Wand');
const geruest = $('#k1Geruest');
const browser = $('#k1Browser');
const fertig = $('#k1Fertig');
const roller = $('#k1Roller');
const schraube = $('#k1Schraube');
const text = $('#k1Text');
const tipp = $('#k1Tipp');
const seite = $('#k1Seite');
const leiste = $('.br-leiste');
const grauTeile = [...document.querySelectorAll('.hb-grau .hb-teil')];
const grauKnopf = $('.hb-grau .hb-knopf.haupt');
const farbKnopf = $('.hb-farbe .hb-knopf.haupt');
const skizze = $('#k1Skizze');
const zeiger = $('#k1Zeiger');
const toast = $('#k1Toast');
const muster = $('#k1Muster');

// ---------- Kohleskizze: aus den echten Teilen der Seite gezeichnet ----------
const SVGNS = 'http://www.w3.org/2000/svg';
let skizzenSchluessel = '';
let striche = [];
function wackel(n) { const x = Math.sin(n * 12.9898) * 43758.5453; return (x - Math.floor(x) - 0.5) * 2; }
function linie(x0, y0, x1, y1, n) {
  const mx = (x0 + x1) / 2 + wackel(n) * 2;
  const my = (y0 + y1) / 2 + wackel(n + 1) * 2;
  return `M${x0 + wackel(n + 2) * 1.5} ${y0 + wackel(n + 3) * 1.5} Q${mx} ${my} ${x1 + wackel(n + 4) * 1.5} ${y1 + wackel(n + 5) * 1.5}`;
}
function skizzeBauen() {
  const schluessel = `${seite.offsetWidth}x${seite.offsetHeight}`;
  if (schluessel === skizzenSchluessel || !seite.offsetWidth) return;
  skizzenSchluessel = schluessel;
  skizze.replaceChildren();
  striche = [];
  // offset* statt getBoundingClientRect: unabhängig von Zoom und vom Fall-Versatz der Teile
  grauTeile.forEach((el, i) => {
    const x = el.offsetLeft;
    const y = el.offsetTop;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const art = el.dataset.skizze;
    const d = [];
    if (art === 'zeile' || art === 'zeilen') {
      const n = art === 'zeile' ? 1 : Math.max(1, Math.min(4, Math.round(h / 22)));
      for (let z = 0; z < n; z++) {
        const yy = y + (h * (z + 0.5)) / n;
        d.push(linie(x, yy, x + w * (z === n - 1 && n > 1 ? 0.65 : 1), yy, i * 9 + z));
      }
    } else {
      d.push(linie(x, y, x + w, y, i * 7 + 2), linie(x + w, y, x + w, y + h, i * 7 + 3),
        linie(x + w, y + h, x, y + h, i * 7 + 4), linie(x, y + h, x, y, i * 7 + 5));
      if (art === 'bild') d.push(linie(x, y, x + w, y + h, i * 7 + 6), linie(x + w, y, x, y + h, i * 7 + 8));
    }
    d.forEach((dd) => {
      const pfad = document.createElementNS(SVGNS, 'path');
      pfad.setAttribute('d', dd);
      skizze.appendChild(pfad);
      const len = pfad.getTotalLength();
      pfad.style.strokeDasharray = `${len}`;
      pfad.style.strokeDashoffset = `${len}`;
      striche.push({ pfad, len, i });
    });
  });
}

let s = 0;
let r = 0;            // wie viel der fertigen Seite der Roller schon gemalt hat (0–100)
let gezogen = false;  // hat der Besucher selbst gezogen?

function masse() {
  const vw = buehne.clientWidth;
  const vh = buehne.clientHeight;
  const k = Math.max(vw / WAND[0], vh / WAND[1]);
  const bw = WAND[0] * k;
  const bh = WAND[1] * k;
  const ox = (vw - bw) / 2;
  const oy = (vh - bh) / 2;
  const loch = {
    x0: ox + LOCH[0] * bw, y0: oy + LOCH[1] * bh,
    x1: ox + LOCH[2] * bw, y1: Math.min(vh, oy + LOCH[3] * bh),
  };
  const handy = vw < 720;
  const tw = Math.min(vw * (handy ? 0.92 : 0.8), 1120);
  const th = handy ? Math.min(vh * 0.62, tw * 1.3) : Math.min(vh * 0.72, tw * 0.64);
  return { vw, vh, loch, tw, th, zoom: handy ? 0.5 : PARAMETER.zoom };
}

// Die ersten 90vh gehören dem Wolkenflug (wolkenflug.js), erst danach beginnt die Choreografie
const WOLKEN_VH = 0.9;
function fortschritt() {
  const rect = sektion.getBoundingClientRect();
  const vor = WOLKEN_VH * innerHeight;
  return klemm((-rect.top - vor) / (rect.height - innerHeight - vor));
}

function bild() {
  const ziel = RUHIG ? 0.9 : fortschritt();
  s += (ziel - s) * (RUHIG ? 1 : PARAMETER.nachziehen);
  if (Math.abs(ziel - s) < 0.0004) s = ziel;
  const m = masse();
  buehne.classList.toggle('k1-fliegt', s > 0.05 && s < 0.86);

  // 1 · Auftakt: Kapitelwort steigt schneller als der Scroll (M1)
  const tY = (0.8 - 1.6 * klemm(s / 0.22)) * m.vh;
  text.style.transform = `translateY(${tY}px)`;
  text.style.opacity = String(1 - klemm((s - 0.15) / 0.07));

  // 2 · Die Täuschung kippt: Kamera fährt auf den Bogen zu
  const z = 1 + m.zoom * aus(klemm((s - 0.08) / 0.22));
  const cx = (m.loch.x0 + m.loch.x1) / 2;
  const cy = (m.loch.y0 + m.loch.y1) / 2;
  wand.style.transformOrigin = `${cx}px ${cy}px`;
  wand.style.transform = `scale(${z})`;
  wand.style.opacity = String(1 - klemm((s - 0.25) / 0.07));
  geruest.style.transform = `translateX(${-40 * aus(klemm((s - 0.08) / 0.22))}vw) scale(${1 + 0.6 * (z - 1)})`;
  geruest.style.opacity = String(1 - klemm((s - 0.22) / 0.07));

  // Browser: erst hinter der Öffnung (füllt sie), dann echtes Fenster in der Mitte
  const lw = (m.loch.x1 - m.loch.x0) * z;
  const lh = (m.loch.y1 - m.loch.y0) * z;
  const lcx = cx;
  const lcy = cy;
  const mix = glatt(klemm((s - 0.22) / 0.1));
  // Schritt 4 · Handy: das Fenster faltet sich zum Smartphone, die Seite ordnet sich selbst neu (Container-Query)
  const hp = glatt(klemm((s - 0.72) / 0.1));
  const pw = Math.min(m.vw * 0.8, 340, m.tw);
  const ph = Math.min(m.vh * 0.8, pw * 2.05);
  const bw = m.tw + (pw - m.tw) * hp;
  const bh = m.th + (ph - m.th) * hp;
  const imLoch = Math.max(lw / bw, lh / bh);
  const sc = imLoch + (1 - imLoch) * mix;
  const mx = lcx + (m.vw / 2 - lcx) * mix;
  const my = lcy + (m.vh * 0.53 - lcy) * mix;
  browser.style.width = `${bw}px`;
  browser.style.height = `${bh}px`;
  browser.style.borderRadius = `${10 + 26 * hp}px`;
  leiste.style.opacity = String(1 - klemm(hp * 2));
  seite.style.top = `${66 - 54 * hp}px`;
  seite.style.borderRadius = `${10 + 22 * hp}px`;
  browser.style.transformOrigin = '0 0';
  browser.style.transform = `translate(${mx - (bw * sc) / 2}px, ${my - (bh * sc) / 2}px) scale(${sc})`;
  browser.classList.toggle('gemalt', mix < 0.6);

  // Schritt 1 · Skizze: Kohlestriche zeichnen die echte Seite vor
  if (s > 0.28 && hp === 0) skizzeBauen();
  for (const st of striche) {
    const t = klemm((s - 0.32 - st.i * 0.008) / 0.05);
    st.pfad.style.strokeDashoffset = String(st.len * (1 - t));
  }
  skizze.style.opacity = String(1 - klemm((s - 0.5) / 0.06));
  muster.classList.toggle('da', s > 0.32 && s < 0.98);

  // Schritt 2 · Inhalte fallen an ihren Platz (noch ungemalt)
  grauTeile.forEach((el, i) => {
    const t = klemm((s - 0.42 - i * 0.012) / 0.05);
    el.style.transform = `translateY(${(1 - pointe(t)) * -28}px)`;
    el.style.opacity = String(klemm(t * 2.5));
  });
  // Bauhelm-Putto schraubt den Knopf fest
  const sp = klemm((s - 0.5) / 0.03) * (1 - klemm((s - 0.58) / 0.03));
  if (sp > 0) {
    const kb = grauKnopf.getBoundingClientRect();
    const bb = buehne.getBoundingClientRect();
    const w = schraube.clientWidth;
    const wack = Math.sin(performance.now() / 90) * 3 * sp;
    schraube.style.transform = `translate(${kb.right - bb.left - w * 0.42}px, ${kb.top - bb.top - w * 0.55}px) rotate(${wack}deg)`;
  }
  schraube.style.opacity = String(sp);

  // Schritt 3 · Farbe: der Roller-Putto malt die Seite (ziehbar)
  const rollerDa = s > 0.56 && s < 0.71;
  roller.classList.toggle('da', rollerDa);
  if (!gezogen) r = 100 * glatt(klemm((s - 0.58) / 0.12));
  if (s > 0.7) { r += (100 - r) * 0.2; gezogen = false; }   // vor dem Handy fertig malen
  setzeR(r);
  tipp.classList.toggle('da', s > 0.64 && s < 0.71 && !gezogen);

  // Schritt 5 · Live: ein Zeiger klickt „Termin anfragen“, die Anfrage geht raus
  const zp = glatt(klemm((s - 0.84) / 0.05));
  if (s > 0.82) {
    const lage = seite.getBoundingClientRect();
    const k = lage.width / seite.offsetWidth || 1;
    const kb = farbKnopf.getBoundingClientRect();
    const zx = (kb.left + kb.width * 0.6 - lage.left) / k;
    const zy = (kb.top + kb.height * 0.6 - lage.top) / k;
    const sx = seite.offsetWidth * 0.85;
    const sy = seite.offsetHeight * 0.95;
    zeiger.style.transform = `translate(${sx + (zx - sx) * zp}px, ${sy + (zy - sy) * zp}px) scale(${s > 0.89 && s < 0.91 ? 0.85 : 1})`;
  }
  zeiger.style.opacity = String(klemm((s - 0.82) / 0.02));
  farbKnopf.classList.toggle('gedrueckt', s > 0.89 && s < 0.91);
  toast.classList.toggle('da', s > 0.905);

  // Bühne erst zeigen, wenn sie festgeheftet ist (vorher liegt sie unter dem Hero, im Nebel)
  if (!RUHIG) buehne.style.visibility = sektion.getBoundingClientRect().top > 1 ? 'hidden' : 'visible';
  if (laeuft) requestAnimationFrame(bild);
}

function setzeR(wert) {
  r = klemm(wert, 0, 100);
  fertig.style.clipPath = `inset(0 ${100 - r}% 0 0)`;
  roller.style.left = `${r}%`;
  roller.setAttribute('aria-valuenow', String(Math.round(r)));
}

// Ziehen (Maus und Finger). Zu schnell gezogen: der Putto lässt den Roller fallen.
let ziehen = null;
roller.addEventListener('pointerdown', (e) => {
  ziehen = { x: e.clientX, t: performance.now() };
  roller.setPointerCapture(e.pointerId);
  gezogen = true;
});
roller.addEventListener('pointermove', (e) => {
  if (!ziehen) return;
  const br = browser.getBoundingClientRect();
  setzeR(((e.clientX - br.left) / br.width) * 100);
  const jetzt = performance.now();
  const tempo = Math.abs(e.clientX - ziehen.x) / Math.max(1, jetzt - ziehen.t);
  ziehen = { x: e.clientX, t: jetzt };
  if (tempo > PARAMETER.oopsTempo && !roller.classList.contains('oops') && !RUHIG) {
    roller.classList.add('oops');
    setTimeout(() => roller.classList.remove('oops'), 900);
  }
});
const loslassen = () => { ziehen = null; };
roller.addEventListener('pointerup', loslassen);
roller.addEventListener('pointercancel', loslassen);
roller.addEventListener('lostpointercapture', loslassen);
roller.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    gezogen = true;
    setzeR(r + (e.key === 'ArrowRight' ? 10 : -10));
    e.preventDefault();
  }
});

// Schleife nur, solange das Kapitel sichtbar ist
let laeuft = false;
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: "25% 0px" }).observe(sektion);
