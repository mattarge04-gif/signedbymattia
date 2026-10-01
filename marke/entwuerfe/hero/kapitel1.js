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
const rohTeile = [...document.querySelectorAll('.rohbau > div')];
const rKnopf = $('.r-knopf');

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

function fortschritt() {
  const rect = sektion.getBoundingClientRect();
  return klemm(-rect.top / (rect.height - innerHeight));
}

function bild() {
  const ziel = RUHIG ? 0.9 : fortschritt();
  s += (ziel - s) * (RUHIG ? 1 : PARAMETER.nachziehen);
  if (Math.abs(ziel - s) < 0.0004) s = ziel;
  const m = masse();
  buehne.classList.toggle('k1-fliegt', s > 0.08 && s < 0.5);

  // 1 · Auftakt: Kapitelwort steigt schneller als der Scroll (M1)
  const tY = (0.8 - 1.6 * klemm(s / 0.32)) * m.vh;
  text.style.transform = `translateY(${tY}px)`;
  text.style.opacity = String(1 - klemm((s - 0.22) / 0.1));

  // 2 · Die Täuschung kippt: Kamera fährt auf den Bogen zu
  const z = 1 + m.zoom * aus(klemm((s - 0.12) / 0.3));
  const cx = (m.loch.x0 + m.loch.x1) / 2;
  const cy = (m.loch.y0 + m.loch.y1) / 2;
  wand.style.transformOrigin = `${cx}px ${cy}px`;
  wand.style.transform = `scale(${z})`;
  wand.style.opacity = String(1 - klemm((s - 0.34) / 0.1));
  geruest.style.transform = `translateX(${-40 * aus(klemm((s - 0.12) / 0.3))}vw) scale(${1 + 0.6 * (z - 1)})`;
  geruest.style.opacity = String(1 - klemm((s - 0.3) / 0.1));

  // Browser: erst hinter der Öffnung (füllt sie), dann echtes Fenster in der Mitte
  const lw = (m.loch.x1 - m.loch.x0) * z;
  const lh = (m.loch.y1 - m.loch.y0) * z;
  const lcx = cx;
  const lcy = cy;
  const imLoch = Math.max(lw / m.tw, lh / m.th);
  const mix = glatt(klemm((s - 0.3) / 0.15));
  const sc = imLoch + (1 - imLoch) * mix;
  const mx = lcx + (m.vw / 2 - lcx) * mix;
  const my = lcy + (m.vh * 0.53 - lcy) * mix;
  browser.style.width = `${m.tw}px`;
  browser.style.height = `${m.th}px`;
  browser.style.transformOrigin = '0 0';
  browser.style.transform = `translate(${mx - (m.tw * sc) / 2}px, ${my - (m.th * sc) / 2}px) scale(${sc})`;
  browser.classList.toggle('gemalt', mix < 0.6);

  // 3 · Bau: Rohbau-Teile fallen wie Stuck an ihren Platz
  rohTeile.forEach((el, i) => {
    const t = klemm((s - 0.46 - i * 0.025) / 0.05);
    el.style.transform = `translateY(${(1 - pointe(t)) * -160}%)`;
    el.style.opacity = String(klemm(t * 3));
  });
  // Bauhelm-Putto schraubt den Knopf fest
  const sp = klemm((s - 0.56) / 0.04) * (1 - klemm((s - 0.68) / 0.04));
  if (sp > 0) {
    const kb = rKnopf.getBoundingClientRect();
    const bb = buehne.getBoundingClientRect();
    const w = schraube.clientWidth;
    const wackel = Math.sin(performance.now() / 90) * 3 * sp;
    schraube.style.transform = `translate(${kb.right - bb.left - w * 0.42}px, ${kb.top - bb.top - w * 0.55}px) rotate(${wackel}deg)`;
  }
  schraube.style.opacity = String(sp);

  // 4 · Roller malt die fertige Seite über den Rohbau
  const rollerDa = s > 0.66;
  roller.classList.toggle('da', rollerDa);
  if (!gezogen) r = 100 * glatt(klemm((s - 0.69) / 0.17));
  setzeR(r);
  tipp.classList.toggle('da', s > 0.86 && s < 0.98 && !gezogen);

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
}).observe(sektion);
