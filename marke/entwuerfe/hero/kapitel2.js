// Kapitel II Automation · Die Wasserspiele.
// Drehbuch: website/drehbuch/12-kapitel-2.md · Werte: website/drehbuch/00-grammatik.md
// Ebenen gemalt (Gemini), Wasser als WebGL-Shader, „Probier es": eine Anfrage fällt als Kugel durch 5 Becken.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s) => document.querySelector(s);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

// Masse aus bilder/k2-manifest.json (Kaskade freigestellt 1591 × 2007, 5 Stufen)
const KW = 1591;
const KH = 2007;
const STUFEN = [[0, 358], [358, 668], [668, 1068], [1068, 1538], [1538, 2007]];
// Wasser je Becken (y in der Stufe): Mitte der Wasserfläche und Vorderkante (Überlauf)
const WASSER_MITTE = [136, 61, 93, 118, 126];
const LIPPE = [152, 90, 134, 174, 0];
const VORHANG_BREITE = [0.4, 0.46, 0.52, 0.58];

const sektion = $('#k2Bahn');
const buehne = $('#k2Buehne');
const garten = $('#k2Garten');
const kaskade = $('#k2Kaskade');
const stufen = [...document.querySelectorAll('.k2-stufe')];
const wasser = $('#k2Wasser');
const kugel = $('#k2Kugel');
const schilder = [...document.querySelectorAll('.k2-schild')];
const gelehrter = $('#k2Gelehrter');
const wecken = $('#k2Wecken');
const brunnen = $('#k2Brunnen');
const strahl = $('#k2StrahlPfad');
const vorne = $('#k2Vorne');
const karte = $('#k2Karte');
const senden = $('#k2Senden');
const text = $('#k2Text');

let s = 0;
let lage = null;          // aktuelle Lage der Kaskade (für Kugel, Schilder, Karte)
let ablauf = 'bereit';    // bereit → laeuft → fertig
const ring = { x: 0.5, y: 0.1, t: 9 };   // Ring im Wasser (uv, Startzeit)
const neigung = { x: 0, y: 0 };
let maus = { x: 0.5, y: 0.5, da: false };
if (MAUS) addEventListener('pointermove', (e) => { maus = { x: e.clientX / innerWidth, y: e.clientY / innerHeight, da: true }; });

let bahnOben = 0;
function fortschritt() {
  const r = sektion.getBoundingClientRect();
  bahnOben = r.top;
  return klemm(-r.top / (r.height - innerHeight));
}

// ---------- Wasser-Shader: Vorhänge zwischen den Becken, Glitzern, Ringe ----------
const gl = wasser.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uZeit; uniform vec4 uVorhang[4]; uniform vec3 uRing;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float rausch(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
void main(){
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec4 farbe = vec4(0.0);
  for (int i = 0; i < 4; i++) {
    vec4 r = uVorhang[i];
    if (uv.x > r.x && uv.x < r.z && uv.y > r.y && uv.y < r.w) {
      float u = (uv.x - r.x) / (r.z - r.x);
      float v = (uv.y - r.y) / (r.w - r.y);
      float rand = smoothstep(0.0, 0.18, u) * (1.0 - smoothstep(0.82, 1.0, u));
      float streifen = rausch(vec2(u * 26.0, v * 2.5 - uZeit * 2.4)) * 0.6 + rausch(vec2(u * 70.0, v * 6.0 - uZeit * 3.4)) * 0.4;
      float a = rand * (0.12 + pow(streifen, 2.0) * 0.55) * smoothstep(0.0, 0.05, v);
      float schaum = smoothstep(0.86, 1.0, v) * rand * (0.4 + 0.6 * rausch(vec2(u * 40.0, uZeit * 5.0)));
      vec3 c = mix(vec3(0.75, 0.87, 0.97), vec3(1.0), streifen * 0.6 + schaum);
      a = clamp(a + schaum * 0.5, 0.0, 0.9);
      farbe = vec4(c * a, a);
    }
  }
  // Ring dort, wo die Kugel ins Wasser fällt
  float t = uZeit - uRing.z;
  if (t > 0.0 && t < 1.2) {
    vec2 d = (uv - uRing.xy) * vec2(uRes.x / uRes.y, 2.6);
    float r = length(d);
    float ring = exp(-pow((r - t * 0.16) * 70.0, 2.0)) * (1.0 - t / 1.2);
    farbe += vec4(vec3(1.0) * ring * 0.8, ring * 0.8);
  }
  gl_FragColor = farbe;
}`;
let u = null;
if (gl) {
  const prog = gl.createProgram();
  for (const [typ, q] of [[gl.VERTEX_SHADER, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }'], [gl.FRAGMENT_SHADER, FRAG]]) {
    const sh = gl.createShader(typ);
    gl.shaderSource(sh, q);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn('Wasser-Shader:', gl.getShaderInfoLog(sh));
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  u = {};
  for (const n of ['uRes', 'uZeit', 'uVorhang', 'uRing']) u[n] = gl.getUniformLocation(prog, n);
}

// ---------- Lage: Kamera, Kaskade, Explosion ----------
function berechne(m) {
  const vw = innerWidth;
  const vh = innerHeight;
  const zoom = glatt(klemm((s - 0.12) / 0.22));
  const explo = glatt(klemm((s - 0.32) / 0.16));
  const hoehe = vh * (0.4 + 0.26 * zoom) * (1 - 0.14 * explo);   // Höhe der geschlossenen Kaskade
  const k = hoehe / KH;
  const breite = KW * k;
  const luecke = vh * 0.05 * explo;
  const gesamt = hoehe + 4 * luecke;
  const unten = vh * (0.72 + 0.17 * zoom) - (vh * 0.1 * explo);
  const x = vw * 0.5 - breite / 2;
  const y = unten - gesamt;
  const stufeY = STUFEN.map(([y0], i) => y0 * k + i * luecke);
  return { vw, vh, zoom, explo, k, breite, hoehe, luecke, gesamt, x, y, stufeY };
}

function bild(jetzt) {
  const ziel = RUHIG ? 0.6 : fortschritt();
  s += (ziel - s) * (RUHIG ? 1 : 0.12);
  if (Math.abs(ziel - s) < 0.0004) s = ziel;
  const L = berechne();
  lage = L;
  buehne.classList.toggle('k2-fliegt', s > 0.08 && s < 0.6);

  if (MAUS && !RUHIG) {
    neigung.x += ((maus.da ? (0.5 - maus.x) * 2 : 0) - neigung.x) * 0.05;
    neigung.y += ((maus.da ? (0.5 - maus.y) * 2 : 0) - neigung.y) * 0.05;
  }
  const tief = (px) => `translate(${neigung.x * px}px, ${neigung.y * px * 0.6}px) `;

  // Auftakt: Kapitelwort steigt schneller als der Scroll (M1)
  text.style.transform = `translateY(${(0.8 - 1.6 * klemm(s / 0.22)) * L.vh}px)`;
  text.style.opacity = String(1 - klemm((s - 0.15) / 0.07));

  // Kamera: Garten zoomt, Figuren weichen zur Seite, Vordergrund zieht schneller
  garten.style.transform = tief(8) + `scale(${1.04 + 0.32 * L.zoom}) translateY(${-3 * L.zoom}vh)`;
  gelehrter.style.transform = tief(26) + `translateX(${-5 * L.zoom}vw) scale(${1 - 0.12 * L.zoom})`;
  brunnen.style.transform = tief(22) + `translateX(${4 * L.zoom}vw) scale(${1 - 0.08 * L.zoom})`;
  vorne.style.transform = tief(40) + `translateY(${10 * L.zoom}vh) scale(${1 + 0.15 * L.zoom})`;

  // Kaskade und Stufen
  kaskade.style.width = `${L.breite}px`;
  kaskade.style.height = `${L.gesamt}px`;
  kaskade.style.transform = tief(14) + `translate(${L.x}px, ${L.y}px)`;
  stufen.forEach((el, i) => { el.style.transform = `translateY(${L.stufeY[i]}px)`; });

  // Schilder rechts an jedem Becken
  schilder.forEach((el, i) => {
    const sy = L.y + L.stufeY[i] + LIPPE[Math.min(i, 3)] * L.k * (i === 4 ? 0 : 1) + (i === 4 ? WASSER_MITTE[4] * L.k : 0);
    el.style.transform = `translate(${L.x + L.breite + L.vw * 0.05 + neigung.x * 14}px, ${sy - 14 + neigung.y * 8}px)`;
    el.style.opacity = String(klemm((L.explo - i * 0.12) / 0.3));
  });

  // Karte „Probier es" links neben Becken 1
  const kartenDa = s > 0.5 && s < 0.88 && ablauf === 'bereit';
  karte.classList.toggle('da', kartenDa || (RUHIG && ablauf === 'bereit'));
  karte.style.transform = `translate(${Math.max(16, L.x - karte.offsetWidth - L.vw * 0.05)}px, ${L.y + L.stufeY[0] + 20}px)`;
  if (!RUHIG && s > 0.7 && ablauf === 'bereit') starten();
  if (s < 0.42 && ablauf === 'fertig') zuruecksetzen();

  wasserZeichnen(L, jetzt);
  if (!RUHIG) buehne.style.visibility = bahnOben > innerHeight ? 'hidden' : 'visible';
  if (laeuft) requestAnimationFrame(bild);
}

function wasserZeichnen(L, jetzt) {
  if (!gl) return;
  const f = Math.min(0.6, 700 / Math.max(1, L.breite));
  const w = Math.max(2, Math.round(L.breite * f));
  const h = Math.max(2, Math.round(L.gesamt * f));
  if (wasser.width !== w || wasser.height !== h) { wasser.width = w; wasser.height = h; gl.viewport(0, 0, w, h); }
  const daten = [];
  for (let i = 0; i < 4; i++) {
    const breiteRel = VORHANG_BREITE[i];
    const oben = (L.stufeY[i] + LIPPE[i] * L.k) / L.gesamt;
    const unten = (L.stufeY[i + 1] + WASSER_MITTE[i + 1] * L.k) / L.gesamt;
    daten.push(0.5 - breiteRel / 2, oben, 0.5 + breiteRel / 2, unten);
  }
  gl.uniform2f(u.uRes, w, h);
  gl.uniform1f(u.uZeit, jetzt / 1000);
  gl.uniform4fv(u.uVorhang, new Float32Array(daten));
  gl.uniform3f(u.uRing, ring.x, ring.y, ring.t);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ---------- „Probier es": Kugel fällt durch die Becken ----------
function kugelZu(i) {
  const L = lage;
  const y = L.stufeY[i] + WASSER_MITTE[i] * L.k;
  return { x: L.breite / 2, y };
}
function kugelSetzen(p, sichtbar = true) {
  const d = kugel.offsetWidth;
  kugel.style.transform = `translate(${p.x - d / 2}px, ${p.y - d * 0.75}px)`;
  kugel.style.opacity = sichtbar ? '1' : '0';
}
function fallen(von, nach, ms) {
  return new Promise((fertig) => {
    const t0 = performance.now();
    const schritt = (t) => {
      const k = klemm((t - t0) / ms);
      const a = kugelZu(von);
      const b = kugelZu(nach);
      // erst kurz nach vorn über die Kante, dann mit Schwerkraft nach unten
      const vor = Math.sin(k * Math.PI) * lage.breite * 0.03;
      kugelSetzen({ x: a.x + (b.x - a.x) * k + vor, y: a.y + (b.y - a.y) * k * k });
      if (k < 1) requestAnimationFrame(schritt); else fertig();
    };
    requestAnimationFrame(schritt);
  });
}
function plumps(i) {
  const p = kugelZu(i);
  ring.x = p.x / lage.breite;
  ring.y = p.y / lage.gesamt;
  ring.t = performance.now() / 1000;
}

function strahlSetzen() {
  const br = buehne.getBoundingClientRect();
  const b = brunnen.getBoundingClientRect();
  const g = gelehrter.getBoundingClientRect();
  const mund = { x: b.left - br.left + b.width * 0.25, y: b.top - br.top + b.height * 0.116 };
  const gesicht = { x: g.left - br.left + g.width * 0.32, y: g.top - br.top + g.height * 0.15 };
  const hoch = Math.min(mund.y, gesicht.y) - br.height * 0.25;
  strahl.setAttribute('d', `M${mund.x} ${mund.y} Q${(mund.x + gesicht.x) / 2} ${hoch} ${gesicht.x} ${gesicht.y}`);
  const len = strahl.getTotalLength();
  strahl.style.strokeDasharray = `${len * 0.35} ${len}`;
  strahl.style.strokeDashoffset = `${len * 0.35}`;
  return len;
}

async function starten() {
  if (ablauf !== 'bereit') return;
  ablauf = 'laeuft';
  if (RUHIG) {
    schilder.forEach((el) => el.classList.add('fertig'));
    karte.classList.remove('da');
    ablauf = 'fertig';
    return;
  }
  karte.classList.add('rollt');
  await warte(380);
  kugelSetzen(kugelZu(0));
  plumps(0);
  schilder[0].classList.add('fertig');
  for (let i = 0; i < 4; i++) {
    await warte(i === 0 ? 650 : 750);
    await fallen(i, i + 1, 520);
    plumps(i + 1);
    if (i < 3) schilder[i + 1].classList.add('fertig');
  }
  // Pointe: der Scherzbrunnen weckt den Gelehrten, er schaut, nickt, schläft weiter
  await warte(500);
  const len = strahlSetzen();
  strahl.classList.add('spritzt');
  strahl.style.transition = 'stroke-dashoffset .55s cubic-bezier(.4,0,.6,1)';
  requestAnimationFrame(() => { strahl.style.strokeDashoffset = `${-len}`; });
  await warte(480);
  gelehrter.classList.add('ist-wach');
  await warte(250);
  strahl.classList.remove('spritzt');
  strahl.style.transition = 'none';
  await warte(1500);
  gelehrter.classList.remove('ist-wach');
  schilder[4].classList.add('fertig');
  kugel.style.opacity = '0';
  ablauf = 'fertig';
}
function zuruecksetzen() {
  ablauf = 'bereit';
  karte.classList.remove('rollt');
  schilder.forEach((el) => el.classList.remove('fertig'));
  kugel.style.opacity = '0';
}
senden.addEventListener('click', starten);

// Gelehrten stupsen: dreht sich murrend um
wecken.addEventListener('click', () => {
  if (gelehrter.classList.contains('ist-wach')) return;
  gelehrter.classList.add('ist-dreht');
  setTimeout(() => gelehrter.classList.remove('ist-dreht'), RUHIG ? 900 : 1800);
});

// ---------- Grafik auf dem Papier: viele Anfragen → ein Eingang → geordnete Antworten ----------
const grafik = $('#k2Grafik');
const NS = 'http://www.w3.org/2000/svg';
function svg(tag, attr, eltern) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attr)) el.setAttribute(k, v);
  eltern.appendChild(el);
  return el;
}
const quellen = grafik.querySelector('.k2-quellen');
const antworten = grafik.querySelector('.k2-antworten');
const ART = ['E-Mail', 'Formular', 'Telefon'];
for (let i = 0; i < 15; i++) {
  const y = 30 + i * 21;
  const d = `M60 ${y} C 250 ${y}, 300 180, 424 180`;
  const p = svg('path', { d, pathLength: 1 }, quellen);
  p.style.transitionDelay = `${i * 40}ms`;
  svg('circle', { class: 'quelle', cx: 60, cy: y, r: 5 }, quellen);
  if (!RUHIG) {
    const c = svg('circle', { class: 'punkt', r: 3.5 }, quellen);
    svg('animateMotion', { dur: `${2.6 + (i % 4) * 0.4}s`, begin: `${(i * 0.37) % 3}s`, repeatCount: 'indefinite', path: d }, c);
  }
}
ART.forEach((t, i) => svg('text', { x: 0, y: 40 + i * 140, 'text-anchor': 'start' }, quellen).append(t));
['Antwort', 'Termin', 'Offerte', 'Rückruf', 'Rechnung'].forEach((t, i) => {
  const y = 80 + i * 50;
  const d = `M476 180 C 580 180, 600 ${y}, 760 ${y}`;
  const p = svg('path', { d, pathLength: 1, class: 'antwort' }, antworten);
  p.style.transitionDelay = `${1.2 + i * 0.12}s`;
  svg('text', { x: 772, y: y + 4 }, antworten).append(t);
});
new IntersectionObserver(([e]) => { if (e.isIntersecting) grafik.classList.add('zeigt'); }, { threshold: 0.3 }).observe(grafik);

// Schleife nur, solange das Kapitel sichtbar ist
let laeuft = false;
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
  else if (!e.isIntersecting) laeuft = false;
}, { rootMargin: '20% 0px' }).observe(sektion);
