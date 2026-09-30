// Kapitel II „Wasserspiele" · ENTWURF, Prototyp · Stand: 30.09.2026
// Drehbuch: website/drehbuch/10-startseite.md §12. Bewegungswerte: 00-grammatik.md.
// Aufbau wie marke/entwuerfe/buehne/buehne.js (Renderer, Kamera zieht weich nach), aber eigene Datei.
//
//   1. Eine sticky Bühne (index.html): Garten-Ebenen (DOM), darüber ein Canvas mit der 3D-Kaskade,
//      darüber Schläfer, Beschriftungen und die Probier-Karte (alles HTML).
//   2. Der Scroll-Fortschritt von #lauf (0–1) wählt die Station; pro Frame zieht der geglättete Wert
//      dem echten nach (Faktor 0.12), daraus werden Kamera, Kaskade und Ebenen berechnet.
//   3. Die Kaskade ist eigener Code: 4 Becken als LatheGeometry, Marmor aus Canvas-Rauschen,
//      Wasserfilm und Wasservorhänge als halbtransparente, bewegte Flächen. Keine fremden Modelle.
import * as THREE from 'three';
import Lenis from 'lenis';
import { kapitelAuftakt, gerissenesPapier, karteWeckt, fortschritt } from '../bausteine/bausteine.js';

// ---------------------------------------------------------------------------
// Stellschrauben (siehe README.md)
// ---------------------------------------------------------------------------
export const PARAMETER = {
  nachziehen: 0.12,                 // Kamera folgt dem Scroll (pro Frame bei 60 fps)
  pixelRatioMax: 1.5,
  stationen: [0.2, 0.45, 0.7],      // Grenzen: Auftakt | Anflug | Explosion | Probier es
  becken: {
    radien: [0.85, 1.25, 1.7, 2.2], // von oben nach unten
    abstand: 1.05,                  // Höhe zwischen zwei Becken (zusammen)
    explosion: 1.9,                 // Abstand × Faktor in der Explosionsansicht
  },
  anflug: { drehungen: 1.1, startY: -11 },       // Umdrehungen während des Anflugs; Start unter dem Bild
  kamera: { fov: 32, nahZ: 6.5, fernZ: 15, explosionZ: 19, kippen: 2.2 },
  kugel: { hopfMs: 450, hoehe: 1.0, radius: 0.22 },
  wasser: { wellen: 0.03, tempo: 1 },
  spritzer: { tropfen: 16, ms: 750 },
};

const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_UI = [0.23, 1, 0.32, 1];
const EASE_POINTE = [0.34, 1.56, 0.64, 1];
const EASE_FARBE = [0.77, 0, 0.175, 1];

// cubic-bezier wie in CSS (Newton-Verfahren), damit JS-Bewegungen dieselben Kurven haben
function bezier([x1, y1, x2, y2]) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) { const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= (X(t) - x) / d; }
    return Y(Math.min(1, Math.max(0, t)));
  };
}
const easeUi = bezier(EASE_UI), easePointe = bezier(EASE_POINTE), easeFarbe = bezier(EASE_FARBE);
const klemme = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const bereich = (p, a, b) => klemme((p - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Bausteine (M1, M7, M9) -------------------------------------------------
const kapitel = document.getElementById('kapitel');
const lauf = document.getElementById('lauf');
const buehne = document.getElementById('buehne');
kapitelAuftakt(kapitel.querySelector('.b-auftakt'));
gerissenesPapier(kapitel.querySelector('.b-papier'));
kapitel.querySelectorAll('.b-papier .b-karte').forEach((k) => karteWeckt(k));

// --- Farben zur Laufzeit aus marke/tokens.css --------------------------------
const css = getComputedStyle(document.documentElement);
const token = (n) => new THREE.Color(css.getPropertyValue(n).trim());
const F = {
  flieder: token('--color-chapter-1'), himmel: token('--color-chapter-2'), pfirsich: token('--color-chapter-3'),
  creme: token('--color-bg'), tinte: token('--color-text'), pink: token('--color-accent'), gold: token('--color-gold'),
};

// --- Renderer ---------------------------------------------------------------
const canvas = document.getElementById('kaskade');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  document.documentElement.classList.add('ohne-webgl');
}

const labels = [...document.querySelectorAll('#labels .label')];
const probier = document.getElementById('probier');
const karte = probier.querySelector('.b-karte');
const knopf = document.getElementById('absenden');
const schlaefer = document.getElementById('schlaefer');
const gartenHinten = buehne.querySelector('.garten--hinten');
const gartenVorne = buehne.querySelector('.garten--vorne');
const schleier = buehne.querySelector('.schleier');

if (renderer) aufbauen();
else { buehne.classList.add('zeigt-labels', 'zeigt-probier'); knopf.addEventListener('click', () => karte.classList.add('ist-wach')); }

function aufbauen() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, PARAMETER.pixelRatioMax));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(PARAMETER.kamera.fov, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(F.himmel, F.pfirsich, 1.6));
  const sonne = new THREE.DirectionalLight(0xffffff, 2.4); sonne.position.set(4, 9, 7); scene.add(sonne);
  const kante = new THREE.DirectionalLight(F.flieder, 1.2); kante.position.set(-6, 3, -4); scene.add(kante);

  // --- Marmor: Pastellgrund mit hellen und wenigen dunklen Adern (Canvas) ---
  function marmor(grund, seed) {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = `#${grund.getHexString()}`; g.fillRect(0, 0, 512, 512);
    let s = seed; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 46; i++) {
      const dunkel = i % 7 === 0;
      g.strokeStyle = dunkel ? 'rgba(35,27,58,.10)' : `rgba(255,255,255,${0.18 + r() * 0.3})`;
      g.lineWidth = 0.6 + r() * (dunkel ? 1.2 : 2.6);
      g.beginPath();
      let x = r() * 512, y = r() * 512; g.moveTo(x, y);
      for (let k = 0; k < 9; k++) { x += (r() - 0.3) * 90; y += (r() - 0.5) * 60; g.quadraticCurveTo(x - 20 + r() * 40, y - 20 + r() * 40, x, y); }
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  // Wasservorhang: senkrechte helle Streifen, transparent, wird nach unten verschoben
  const vorhangTextur = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const g = c.getContext('2d');
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * 256, h = 40 + Math.random() * 200, y = Math.random() * 256;
      const v = g.createLinearGradient(0, y, 0, y + h);
      v.addColorStop(0, 'rgba(255,255,255,0)'); v.addColorStop(0.5, `rgba(255,255,255,${0.35 + Math.random() * 0.5})`); v.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = v; g.fillRect(x, y - 256, 1 + Math.random() * 2.5, h + 256); g.fillRect(x, y, 1 + Math.random() * 2.5, h);
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 1);
    return t;
  })();

  // --- Kaskade ---
  const kaskade = new THREE.Group(); scene.add(kaskade);
  const { radien, abstand } = PARAMETER.becken;
  const farben = [F.pfirsich, F.flieder, F.himmel, F.flieder];
  const becken = radien.map((R, i) => {
    const gruppe = new THREE.Group(); kaskade.add(gruppe);
    const h = 0.22 + R * 0.08; // Tiefe wächst mit dem Radius
    const profil = [[0.001, -h], [R * 0.3, -h * 1.02], [R * 0.72, -h * 0.72], [R * 0.95, -h * 0.1], [R, 0.08], [R * 0.97, 0.13],
      [R * 0.92, 0.07], [R * 0.7, -h * 0.45], [R * 0.3, -h * 0.72], [0.001, -h * 0.74]].map(([x, y]) => new THREE.Vector2(x, y));
    const stein = new THREE.MeshPhysicalMaterial({ map: marmor(farben[i], 11 + i * 7), roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.22, side: THREE.DoubleSide });
    gruppe.add(new THREE.Mesh(new THREE.LatheGeometry(profil, 72), stein));
    const rand = new THREE.Mesh(new THREE.TorusGeometry(R * 0.985, 0.022, 8, 96), new THREE.MeshStandardMaterial({ color: F.gold, metalness: 0.5, roughness: 0.35 }));
    rand.rotation.x = Math.PI / 2; rand.position.y = 0.12; gruppe.add(rand);
    // Schaft unter dem Becken (unten: Fuss)
    const schaftH = i === 3 ? 1.3 : abstand * 0.8;
    const schaft = new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [0.16, 0], [0.1, 0.25], [0.19, 0.5], [0.09, 0.8], [0.14, 1], [0.001, 1]].map(([x, y]) => new THREE.Vector2(x * (1 + R * 0.25), y)), 36),
      new THREE.MeshPhysicalMaterial({ map: marmor(F.creme, 5 + i), roughness: 0.4, clearcoat: 0.4 }));
    schaft.scale.y = schaftH; schaft.position.y = -h - schaftH; gruppe.add(schaft);
    if (i === 3) {
      const sockel = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.22, 48), stein);
      sockel.position.y = -h - schaftH - 0.11; gruppe.add(sockel);
    }
    // Wasserfilm: Scheibe mit Ringen, Wellen per Vertex
    const scheibe = new THREE.RingGeometry(0.001, R * 0.9, 64, 8);
    const wasser = new THREE.Mesh(scheibe, new THREE.MeshPhysicalMaterial({ color: F.himmel.clone().lerp(new THREE.Color(1, 1, 1), 0.45), transparent: true, opacity: 0.62, roughness: 0.08, clearcoat: 1, depthWrite: false }));
    wasser.rotation.x = -Math.PI / 2; wasser.position.y = 0.04; gruppe.add(wasser);
    const basis = Float32Array.from(scheibe.attributes.position.array);
    // Vorhang: fällt vom Rand ins nächste Becken (nicht beim untersten)
    let vorhang = null;
    if (i < 3) {
      const geo = new THREE.CylinderGeometry(R * 1.0, R * 1.08, 1, 72, 1, true); geo.translate(0, -0.5, 0);
      const tex = vorhangTextur.clone(); tex.needsUpdate = true;
      vorhang = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, alphaMap: tex, color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }));
      vorhang.position.y = 0.1; gruppe.add(vorhang);
    }
    return { gruppe, R, h, wasser, basis, vorhang };
  });

  // --- pinke Kugel (M13 leuchtet leise) und Ringwelle ---
  const kugel = new THREE.Mesh(new THREE.SphereGeometry(PARAMETER.kugel.radius, 32, 16),
    new THREE.MeshStandardMaterial({ color: F.pink, emissive: F.pink, emissiveIntensity: 0.35, roughness: 0.3 }));
  kugel.visible = false; kaskade.add(kugel);
  const ringe = [];
  function ringwelle(b) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2; m.position.y = 0.07; b.gruppe.add(m);
    ringe.push({ m, b, start: performance.now() });
  }

  // --- Zustand aus dem Scroll-Fortschritt ---
  let p = 0, glatt = 0, spreizung = 1;
  const [s1, s2, s3] = PARAMETER.stationen;
  const breit = () => innerWidth / innerHeight >= 1;
  const ziel = new THREE.Vector3();

  function stellen(q, t) {
    const a = ruhig ? 1 : bereich(q, s1, s2);          // Anflug
    const e = ruhig ? 1 : bereich(q, s2, s3);          // Explosion
    const g = ruhig ? 1 : bereich(q, s3, s3 + 0.08);   // Platz für die Karte
    spreizung = mix(1, PARAMETER.becken.explosion, easeFarbe(e));
    // Becken übereinander, von oben (0) nach unten (3)
    becken.forEach((b, i) => { b.gruppe.position.y = (3 - i) * abstand * spreizung; });
    becken.forEach((b, i) => {
      if (!b.vorhang) return;
      const unten = becken[i + 1];
      b.vorhang.scale.y = Math.max(0.01, b.gruppe.position.y - unten.gruppe.position.y - 0.06);
    });
    const mitte = 1.5 * abstand * spreizung;
    const flug = easeUi(klemme(a * 1.5));                // steigt schnell, dann zieht die Kamera zurück
    kaskade.position.set(0, mix(PARAMETER.anflug.startY, 0, flug) - mitte + 0.4, 0);
    kaskade.visible = q > s1 - 0.04 || ruhig;
    kaskade.rotation.y = a * Math.PI * 2 * PARAMETER.anflug.drehungen + e * 0.5 + (ruhig ? 0.35 : 0);
    const k = PARAMETER.kamera;
    const hochkant = breit() ? 1 : Math.pow(1.25 / (innerWidth / innerHeight), 0.85);
    let z = mix(k.nahZ, k.fernZ, easeFarbe(klemme((a - 0.25) / 0.75)));
    z = mix(z, k.explosionZ, easeFarbe(e)) * hochkant;
    const kipp = easeFarbe(e) * k.kippen;               // Kamera unten, Blick nach oben
    let cx = 0, cy = -kipp * 0.9, ly = kipp * 0.55;
    if (breit()) cx = -easeFarbe(g) * 2.6; else { cy -= easeFarbe(g) * 2.4; ly -= easeFarbe(g) * 2.4; }
    kamera.position.set(cx, cy + 0.6, z);
    ziel.set(cx, ly + 0.4, 0); kamera.lookAt(ziel);

    // leise Bewegung (M13): Wasserfilm, Vorhänge, Kugel
    if (!ruhig) {
      const w = PARAMETER.wasser;
      becken.forEach((b, i) => {
        const pos = b.wasser.geometry.attributes.position;
        for (let v = 0; v < pos.count; v++) {
          const x = b.basis[v * 3], y = b.basis[v * 3 + 1], r = Math.hypot(x, y);
          pos.array[v * 3 + 2] = Math.sin(r * 9 - t * 2.2 * w.tempo + i) * w.wellen * (r / b.R);
        }
        pos.needsUpdate = true;
        if (b.vorhang) b.vorhang.material.map.offset.y = (t * 0.55 * w.tempo + i * 0.3) % 1;
      });
      if (kugel.visible) kugel.scale.setScalar(1 + Math.sin(t * 3.2) * 0.05);
      kugel.material.emissiveIntensity = 0.3 + Math.sin(t * 3.2) * 0.12;
    }
    // Ringwellen
    for (let i = ringe.length - 1; i >= 0; i--) {
      const r = ringe[i], u = (performance.now() - r.start) / 700;
      if (u >= 1) { r.b.gruppe.remove(r.m); r.m.geometry.dispose(); ringe.splice(i, 1); continue; }
      r.m.scale.setScalar(mix(0.2, r.b.R * 0.85, easeUi(u))); r.m.material.opacity = 0.9 * (1 - u);
    }

    // DOM: Ebenen, Labels, Karte
    if (!ruhig) {
      gartenHinten.style.transform = `translate3d(0, ${(-q * 3).toFixed(2)}%, 0) scale(${(1 + q * 0.05).toFixed(3)})`;
      gartenVorne.style.transform = `translate3d(0, ${(-q * 9).toFixed(2)}%, 0) scale(${(1 + q * 0.12).toFixed(3)})`;
      schleier.style.opacity = (0.72 + 0.28 * a).toFixed(3);
      schlaefer.style.transform = `translate3d(0, ${(-q * 4).toFixed(2)}vh, 0)`;
    }
    buehne.classList.toggle('zeigt-labels', ruhig || e > 0.55);
    buehne.classList.toggle('zeigt-probier', ruhig || q > s3 + 0.02);
    kamera.updateMatrixWorld();
    const rechts = new THREE.Vector3().setFromMatrixColumn(kamera.matrixWorld, 0);
    const v = new THREE.Vector3();
    labels.forEach((el, i) => {
      const b = becken[i];
      b.gruppe.getWorldPosition(v); v.addScaledVector(rechts, b.R * 1.02); v.y += 0.08;
      v.project(kamera);
      const x = (v.x + 1) / 2 * innerWidth, y = (1 - v.y) / 2 * innerHeight;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-50%)`;
    });
  }

  // --- Probier es: Kugel hüpft von Becken zu Becken ---
  // Landepunkt im Becken, abwechselnd links und rechts der Achse (Koordinaten der Kaskade, dreht mit)
  const punkt = (b) => { const i = becken.indexOf(b); return new THREE.Vector3((i % 2 ? -1 : 1) * b.R * 0.42, b.gruppe.position.y + 0.07 + PARAMETER.kugel.radius * 0.6, 0); };
  function hopf(von, nach, ms) {
    return new Promise((fertig) => {
      const start = performance.now();
      const schritt = (jetzt) => {
        const u = klemme((jetzt - start) / ms), f = easePointe(u);
        kugel.position.set(mix(von.x, nach.x, f), mix(von.y, nach.y, f) + Math.sin(Math.PI * klemme(u)) * PARAMETER.kugel.hoehe, mix(von.z, nach.z, f));
        if (u < 1) requestAnimationFrame(schritt); else fertig();
      };
      requestAnimationFrame(schritt);
    });
  }
  function spritzen() {
    // Scherzbrunnen: Tropfen vom untersten Becken zum Gesicht des Schläfers (DOM, WAAPI)
    const v = new THREE.Vector3(); becken[3].gruppe.getWorldPosition(v); v.project(kamera);
    const sx = (v.x + 1) / 2 * innerWidth, sy = (1 - v.y) / 2 * innerHeight;
    const r = schlaefer.getBoundingClientRect(), bu = buehne.getBoundingClientRect();
    const zx = r.left + r.width * 0.42 - bu.left, zy = r.top + r.height * 0.26 - bu.top;
    const { tropfen, ms } = PARAMETER.spritzer;
    for (let i = 0; i < tropfen; i++) {
      const d = document.createElement('span'); d.className = 'spritzer'; buehne.append(d);
      const streu = (Math.random() - 0.5) * 60, hoch = 120 + Math.random() * 90, verz = Math.random() * 140;
      const mx = mix(sx, zx, 0.5) + streu, my = Math.min(sy, zy) - hoch;
      d.animate([
        { transform: `translate(${sx}px, ${sy}px) scale(.6)`, opacity: 0 },
        { transform: `translate(${mx}px, ${my}px) scale(1)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${zx + streu * 0.4}px, ${zy + Math.random() * 30}px) scale(.8)`, opacity: 0.9, offset: 0.92 },
        { transform: `translate(${zx + streu * 0.5}px, ${zy + 30}px) scale(.6)`, opacity: 0 },
      ], { duration: ms, delay: verz, easing: 'linear' }).finished.then(() => d.remove());
    }
    setTimeout(() => { schlaefer.classList.add('ist-nass'); setTimeout(() => schlaefer.classList.remove('ist-nass'), 900); }, ms * 0.9);
  }
  let laeuft = false;
  knopf.addEventListener('click', async () => {
    if (laeuft) return;
    laeuft = true; knopf.disabled = true;
    karte.classList.remove('ist-wach');
    if (ruhig) { karte.classList.add('ist-wach'); knopf.textContent = 'Nochmals'; knopf.disabled = false; laeuft = false; return; }
    await warte(160);
    kugel.visible = true;
    let von = punkt(becken[0]).add(new THREE.Vector3(0, 1.2, 0));
    for (const b of becken) { const nach = punkt(b); await hopf(von, nach, PARAMETER.kugel.hopfMs); ringwelle(b); von = nach; }
    await warte(120);
    karte.classList.add('ist-wach');
    await warte(360);
    spritzen();
    await warte(PARAMETER.spritzer.ms + 400);
    kugel.visible = false;
    knopf.textContent = 'Nochmals'; knopf.disabled = false; laeuft = false;
  });

  // --- Grösse, Schleife ---
  function groesse() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); kamera.aspect = w / h; kamera.updateProjectionMatrix();
  }
  addEventListener('resize', () => { groesse(); if (ruhig) { stellen(1, 0); renderer.render(scene, kamera); } });
  groesse();

  let lenis = null;
  if (!ruhig && matchMedia('(pointer: fine)').matches) lenis = new Lenis({ lerp: 0.1 });
  let sichtbar = true;
  new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }).observe(kapitel);

  if (ruhig) {
    stellen(1, 0); renderer.render(scene, kamera);
    addEventListener('scroll', () => { stellen(1, 0); renderer.render(scene, kamera); }, { passive: true });
  } else {
    let zuletzt = performance.now();
    const schleife = (jetzt) => {
      requestAnimationFrame(schleife);
      lenis?.raf(jetzt);
      const dt = Math.min(0.1, (jetzt - zuletzt) / 1000); zuletzt = jetzt;
      p = fortschritt(lauf);
      glatt += (p - glatt) * (1 - Math.pow(1 - PARAMETER.nachziehen, dt * 60));
      if (Math.abs(p - glatt) < 1e-4) glatt = p;
      if (!sichtbar) return;
      stellen(glatt, jetzt / 1000);
      renderer.render(scene, kamera);
    };
    requestAnimationFrame(schleife);
  }
  window.__wasserspiele = { PARAMETER, stand: () => ({ p, glatt, spreizung }), lenis };
}
