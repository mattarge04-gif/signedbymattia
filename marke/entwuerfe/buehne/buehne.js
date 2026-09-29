// Prototyp 2.5D-Bühne mit Ölfarben-Übergang · ENTWURF, Wegwerf-Prototyp
// Stand: 29.09.2026 · Grundlage: marke/DESIGN.md §7, Mechanismus nach marke/teardown-shopify-editions.md
// (nur die Idee in Worten, kein Shopify-Code). Farben kommen zur Laufzeit aus marke/tokens.css.
//
// Aufbau:
//   1. Ein fixer Canvas hinter dem HTML (index.html).
//   2. Zwei Szenen: Akt I Himmel und Akt II Galerie, je in ein eigenes Render-Target gemalt.
//   3. Ein Vollbild-Shader mischt beide entlang einer Kante aus eigener Leinwand-/Pinseltextur
//      und Rauschen ("Ölfarbe"). Der Scroll-Fortschritt des Abschnitts #uebergang steuert die Mischung.
//   4. Jeder Akt hat einen Scroll-Fortschritt 0–1; die Kamera folgt ihm, pro Frame weich nachgezogen.
import * as THREE from 'three';
import Lenis from 'lenis';

// ---------------------------------------------------------------------------
// Stellschrauben (siehe README.md)
// ---------------------------------------------------------------------------
export const PARAMETER = {
  nachziehen: 0.12,        // 0.1–0.5: wie schnell die Kamera dem Scroll folgt (pro Frame bei 60 fps)
  pixelRatioMax: 1.5,      // Obergrenze devicePixelRatio (Leistung am Handy)
  msaa: 4,                 // Kantenglättung in den Render-Targets (0 = aus, schneller)
  himmel: {
    kameraStartZ: 16,      // Kamera am Anfang von Akt I
    kameraEndeZ: -20,    // Kamera am Ende von Akt I (fliegt durch die Wolken nach hinten)
    kameraHub: 2.5,        // wie weit die Kamera beim Flug steigt
  },
  galerie: {
    kameraStartX: -9,
    kameraEndeX: 9,
    kameraZ: 9.5,
  },
  oelfarbe: {
    kantenBreite: 0.045,   // Breite der nassen Kante (0.02 hart … 0.12 weich)
    kontur: 0.4,        // Stärke der dunklen Farbkontur an der Kante (0–1)
    verschmieren: 0.035,   // wie stark das Bild an der Kante verzogen wird
    pinselMassstab: 3.0,   // Grösse der Pinselstriche
    leinwand: 0.06,        // sichtbares Leinwandgewebe während des Übergangs (0–0.15)
  },
};

// ---------------------------------------------------------------------------
// Entscheid: Bühne oder 2D-Variante
// ---------------------------------------------------------------------------
const root = document.documentElement;
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('buehne');

function webglMoeglich() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch { return false; }
}

if (ruhig || !webglMoeglich()) {
  // 2D-Variante: nichts tun. Die Ebenen im HTML (.ebenen-2d) bleiben stehen, kein Smooth Scroll.
  root.classList.add('buehne-2d');
  window.__buehne = { modus: ruhig ? '2d-ruhig' : '2d-ohne-webgl' };
} else {
  starten().catch((e) => {
    console.warn('Bühne nicht gestartet, 2D-Variante bleibt:', e);
    root.classList.remove('webgl');
    root.classList.add('buehne-2d');
  });
}

// ---------------------------------------------------------------------------
// Gemeinsame GLSL-Bausteine: Rauschen (eigene, einfache Wertrauschen-Variante)
// ---------------------------------------------------------------------------
const GLSL_RAUSCHEN = /* glsl */`
  float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float rauschen(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
               mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) { s += a * rauschen(p); p = r * p * 2.03; a *= 0.5; }
    return s;
  }
`;

const VERTEX_UV = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// ---------------------------------------------------------------------------
// Ölfarben-Übergang (Fragment-Shader)
// Leinwand: Kett- und Schussfäden aus zwei Sinus-Rastern mit Rauschen.
// Pinsel:   gestrecktes fbm (Striche in einer Richtung), leicht gedreht je Strich-Band.
// Kante:    Schwelle über Pinsel + Leinwand + grobes Rauschen, gesteuert von uFortschritt.
// ---------------------------------------------------------------------------
const OELFARBE_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tA;         // Akt I Himmel
  uniform sampler2D tB;         // Akt II Galerie
  uniform float uFortschritt;   // 0 = nur A, 1 = nur B
  uniform float uAspect;
  uniform float uKante, uKontur, uSchmieren, uPinsel, uLeinwand;
  uniform vec3 uKonturFarbe;    // Tinte aus tokens.css
  ${GLSL_RAUSCHEN}

  float leinwand(vec2 p) {
    vec2 q = p * vec2(uAspect, 1.0) * 260.0;
    float kette = 0.5 + 0.5 * sin(q.x + rauschen(q * 0.07) * 1.5);
    float schuss = 0.5 + 0.5 * sin(q.y + rauschen(q.yx * 0.07) * 1.5);
    float wechsel = sin(q.x * 0.5) * sin(q.y * 0.5);   // Leinwandbindung: Faden oben/unten im Wechsel
    return mix(kette, schuss, smoothstep(-0.3, 0.3, wechsel)) * 0.8 + rauschen(q * 0.25) * 0.2;
  }

  float pinsel(vec2 p) {
    vec2 q = p * vec2(uAspect, 1.0) * uPinsel;
    // Strichrichtung ändert sich stetig über die Fläche (keine harten Bandgrenzen).
    float winkel = (fbm(q * 0.25 + 7.0) - 0.5) * 1.2;
    mat2 r = mat2(cos(winkel), -sin(winkel), sin(winkel), cos(winkel));
    vec2 s = r * q;
    return fbm(vec2(s.x * 0.6, s.y * 7.0));
  }

  void main() {
    float t = clamp(uFortschritt, 0.0, 1.0);
    // Höhenfeld der "Farbe": grosse Flecken + Pinselstriche + Leinwand, dazu ein leichter Verlauf
    // von oben nach unten, damit die Farbe wie nass herunterläuft.
    float h = 0.60 * fbm(vUv * vec2(uAspect, 1.0) * 1.6)
            + 0.45 * pinsel(vUv)
            + 0.03 * leinwand(vUv)
            + 0.45 * (1.0 - vUv.y);
    h = clamp((h - 0.3) / 0.95, 0.0, 1.0);
    // Schwelle wandert so, dass bei t = 0 nichts und bei t = 1 alles umgefärbt ist.
    float schwelle = mix(-uKante * 2.0, 1.0 + uKante * 2.0, t);
    float m = smoothstep(schwelle - uKante, schwelle + uKante, h);
    m = 1.0 - m; // 1 = B sichtbar

    // Nasse Kante: Bild entlang der Pinselrichtung verziehen.
    float nah = exp(-pow((h - schwelle) / (uKante * 0.9), 2.0));
    vec2 schmier = vec2(pinsel(vUv + 0.13) - 0.5, rauschen(vUv * 40.0) - 0.5) * uSchmieren * nah;
    vec3 a = texture2D(tA, vUv + schmier).rgb;
    vec3 b = texture2D(tB, vUv - schmier).rgb;
    vec3 farbe = mix(a, b, m);

    // Dunkle Farbkontur genau an der Kante, gebrochen durch das Gewebe.
    float kontur = exp(-pow((h - schwelle) / (uKante * 0.28), 2.0));
    kontur *= 0.6 + 0.4 * leinwand(vUv);
    farbe = mix(farbe, uKonturFarbe, kontur * uKontur);

    // Leinwand nur während des Übergangs sichtbar.
    float mitte = sin(3.14159 * t);
    farbe *= 1.0 - uLeinwand * mitte * (leinwand(vUv) - 0.5);

    gl_FragColor = vec4(farbe, 1.0);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------------------
// Materialien der Szenen
// ---------------------------------------------------------------------------

// Bildebene: Ausschnitt aus einem Gemälde, mit weicher, leicht ausgefranster Kante.
// ausschnitt = [links, oben, rechts, unten] in Bildanteilen (0–1, oben = 0).
function bildMaterial(textur, ausschnitt, { rand = 0.22, deckkraft = 1, aufhellen = 0, ton = farbe('--color-bg') } = {}) {
  const [x0, y0, x1, y1] = ausschnitt;
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      map: { value: textur },
      uRect: { value: new THREE.Vector4(x0, 1 - y1, x1, 1 - y0) },
      uRand: { value: rand },
      uDeckkraft: { value: deckkraft },
      uAufhellen: { value: aufhellen },
      uCreme: { value: ton },
    },
    vertexShader: VERTEX_UV,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      uniform sampler2D map; uniform vec4 uRect; uniform float uRand, uDeckkraft, uAufhellen; uniform vec3 uCreme;
      ${GLSL_RAUSCHEN}
      void main() {
        vec2 uv = mix(uRect.xy, uRect.zw, vUv);
        vec3 c = texture2D(map, uv).rgb;
        c = mix(c, uCreme, uAufhellen);
        vec2 d = min(vUv, 1.0 - vUv);
        float kante = min(d.x, d.y) + (fbm(vUv * 6.0) - 0.5) * uRand * 0.6;
        float a = smoothstep(0.0, uRand, kante) * uDeckkraft;
        gl_FragColor = vec4(c, a);
      }
    `,
  });
}

// Prozedurale Wolke: eigenes fbm, keine fremde Textur.
function wolkenMaterial(saat, tönung) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uSaat: { value: saat },
      uFarbe: { value: farbe('--color-bg') },
      uToenung: { value: tönung },
      uVersatz: { value: 0 },
    },
    vertexShader: VERTEX_UV,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      uniform float uSaat, uVersatz; uniform vec3 uFarbe, uToenung;
      ${GLSL_RAUSCHEN}
      void main() {
        vec2 p = vUv * vec2(3.0, 1.4) + vec2(uSaat * 7.1 + uVersatz, uSaat * 3.3);
        float n = fbm(p * 1.6 + fbm(p * 2.3) * 1.2);
        // Umriss: verbeulte Ellipse, unten flacher (Wolkenbauch), oben Quellungen.
        vec2 d = (vUv - vec2(0.5, 0.42)) * vec2(1.0, 2.1);
        float r = length(d) + (fbm(p * 1.3 + 4.0) - 0.5) * 0.55 - max(0.0, d.y) * 0.15;
        float form = 1.0 - smoothstep(0.18, 0.46, r);
        float dichte = form * (0.55 + 0.9 * n);
        float a = smoothstep(0.38, 0.62, dichte);
        // Licht von oben: oben Creme, im Bauch die Kapitel-Tönung.
        float licht = smoothstep(0.25, 0.85, n * 0.7 + vUv.y * 0.6);
        vec3 c = mix(uToenung, uFarbe, licht);
        gl_FragColor = vec4(c, a * 0.95);
      }
    `,
  });
}

// Goldrahmen aus Geometrie: Rechteck mit Loch, extrudiert und abgeschrägt.
function goldrahmen(breite, hoehe, leiste = 0.35) {
  const aussen = new THREE.Shape();
  aussen.moveTo(-breite / 2, -hoehe / 2); aussen.lineTo(breite / 2, -hoehe / 2);
  aussen.lineTo(breite / 2, hoehe / 2); aussen.lineTo(-breite / 2, hoehe / 2); aussen.closePath();
  const loch = new THREE.Path();
  const bi = breite / 2 - leiste, hi = hoehe / 2 - leiste;
  loch.moveTo(-bi, -hi); loch.lineTo(-bi, hi); loch.lineTo(bi, hi); loch.lineTo(bi, -hi); loch.closePath();
  aussen.holes.push(loch);
  const geo = new THREE.ExtrudeGeometry(aussen, {
    depth: 0.12, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 4, steps: 1,
  });
  const mat = new THREE.MeshStandardMaterial({ color: farbe('--color-gold'), metalness: 0.55, roughness: 0.38 });
  return new THREE.Mesh(geo, mat);
}

// Schwebendes Browserfenster: Canvas-Textur mit Rahmen, gezeichnet aus den Tokens.
function browserTextur() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 680;
  const g = c.getContext('2d');
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  g.fillStyle = css('--color-bg'); g.fillRect(0, 0, 1024, 680);
  g.fillStyle = css('--color-chapter-1'); g.fillRect(0, 0, 1024, 64);
  ['--color-accent', '--color-gold', '--color-chapter-2'].forEach((n, i) => {
    g.beginPath(); g.arc(40 + i * 34, 32, 11, 0, Math.PI * 2); g.fillStyle = css(n); g.fill();
    g.lineWidth = 2; g.strokeStyle = css('--color-text'); g.stroke();
  });
  g.fillStyle = css('--color-bg'); roundRect(g, 160, 16, 700, 32, 16); g.fill();
  g.fillStyle = css('--color-text-muted'); g.font = '500 18px "Host Grotesk"'; g.fillText('[Platzhalter]', 184, 39);
  g.fillStyle = css('--color-text'); g.font = '800 76px "Host Grotesk"'; g.fillText('Edition', 60, 210);
  g.font = 'italic 84px "Instrument Serif"'; g.fillText('No.', 360, 210);
  g.fillStyle = css('--color-chapter-2'); roundRect(g, 60, 260, 440, 300, 8); g.fill();
  g.fillStyle = css('--color-chapter-3'); roundRect(g, 530, 260, 434, 140, 8); g.fill();
  g.fillStyle = css('--color-accent'); roundRect(g, 530, 430, 230, 56, 28); g.fill();
  g.lineWidth = 3; g.strokeStyle = css('--color-text'); roundRect(g, 530, 430, 230, 56, 28); g.stroke();
  g.lineWidth = 10; g.strokeRect(5, 5, 1014, 670);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// Platzhalter-Edition für die Galerie: Kapitelfarbe, Aufschrift "Konzept".
function editionTextur(kapitelToken, buchstabe) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 640;
  const g = c.getContext('2d');
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  g.fillStyle = css(kapitelToken); g.fillRect(0, 0, 512, 640);
  g.fillStyle = css('--color-text');
  g.font = '800 64px "Host Grotesk"'; g.fillText('Edition', 44, 120);
  g.font = 'italic 150px "Instrument Serif"'; g.fillText(buchstabe, 44, 290);
  g.fillStyle = css('--color-bg'); roundRect(g, 44, 520, 220, 64, 32); g.fill();
  g.lineWidth = 3; g.strokeStyle = css('--color-text'); roundRect(g, 44, 520, 220, 64, 32); g.stroke();
  g.fillStyle = css('--color-text'); g.font = '700 30px "Host Grotesk"'; g.fillText('Konzept', 92, 563);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

function farbe(token) {
  return new THREE.Color(getComputedStyle(root).getPropertyValue(token).trim());
}

// ---------------------------------------------------------------------------
// Szenen
// ---------------------------------------------------------------------------
function baueHimmel(tex) {
  const szene = new THREE.Scene();
  szene.background = farbe('--color-chapter-2').lerp(farbe('--color-bg'), 0.5);
  const kamera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);

  // Ebene 1 (hinten): Himmel aus Tiepolos Deckenbild, aufgehellt Richtung Pastell-Himmel.
  const pastell = farbe('--color-chapter-2').lerp(farbe('--color-bg'), 0.35);
  const himmel = new THREE.Mesh(new THREE.PlaneGeometry(170, 116),
    bildMaterial(tex.planeten, [0.15, 0.2, 0.85, 0.56], { rand: 0.08, aufhellen: 0.45, ton: pastell }));
  himmel.position.set(0, 4, -70);
  szene.add(himmel);

  // Ebenen 2–4: Figuren in verschiedener Tiefe (Ausschnitte mit ausgefranster Kante).
  const figuren = [
    { t: tex.monarchie, a: [0.54, 0.27, 0.81, 0.43], w: 9, h: 6.4, p: [8, 5, -38] },   // fliegende Figur
    { t: tex.monarchie, a: [0.08, 0.06, 0.52, 0.24], w: 11, h: 5.5, p: [-7, 3.5, -16] },// Engel mit Posaune
    { t: tex.planeten, a: [0.46, 0.42, 0.76, 0.62], w: 6, h: 5.5, p: [5.5, -2.2, -3] }, // Pferde, ganz vorne
  ];
  for (const f of figuren) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.h), bildMaterial(f.t, f.a, { rand: 0.3 }));
    m.position.set(...f.p);
    szene.add(m);
  }

  // Wolken: prozedurale Ebenen, durch die die Kamera fliegt.
  const wolken = [];
  const tönungen = ['--color-chapter-1', '--color-chapter-3', '--color-chapter-2'].map(farbe);
  // [x, y, z]: so gesetzt, dass Titel, Browserfenster und das Kameraziel frei bleiben.
  // Die Kamera fliegt knapp an den Wolken vorbei (x ≈ 0–1.2), nicht hindurch.
  const wolkenOrte = [[8, -3.5, 8], [-10, 2, 3], [10.5, 1.5, -4], [-9, -4.5, -10], [10, 5.5, -15],
    [-11, 0, -27], [7, -5, -33], [-4, 7, -42], [6, 1, -52]];
  wolkenOrte.forEach((ort, i) => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(17, 7.5), wolkenMaterial(i * 1.37, tönungen[i % 3]));
    w.position.set(...ort);
    szene.add(w); wolken.push(w);
  });

  // Requisit 1: schwebendes Browserfenster (Fläche mit Rahmen).
  const browser = new THREE.Mesh(new THREE.PlaneGeometry(6, 4),
    new THREE.MeshBasicMaterial({ map: tex.browser, transparent: true }));
  browser.position.set(-5.2, -3.8, 1);
  browser.rotation.set(0.05, 0.38, -0.06);
  szene.add(browser);

  // Requisit 2: Goldrahmen aus Geometrie mit einem Tiepolo-Ausschnitt darin.
  const rahmen = new THREE.Group();
  rahmen.add(goldrahmen(5.2, 4.4, 0.38));
  const bild = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.7),
    new THREE.MeshBasicMaterial({ map: tex.barbaro }));
  tex.barbaro.repeat.set(0.44, 0.6); tex.barbaro.offset.set(0.28, 1 - 0.78);
  bild.position.z = 0.05;
  rahmen.add(bild);
  rahmen.position.set(4.5, 3.6, -22);
  rahmen.rotation.set(0.04, -0.3, 0.05);
  szene.add(rahmen);

  szene.add(new THREE.HemisphereLight(0xffffff, farbe('--color-chapter-3'), 1.6));
  const sonne = new THREE.DirectionalLight(0xffffff, 2.2); sonne.position.set(-4, 6, 8); szene.add(sonne);

  const P = PARAMETER.himmel;
  return {
    szene, kamera,
    setze(p, aspect) {
      // Zielposition aus dem Fortschritt; die Glättung passiert in schleife().
      return new THREE.Vector3(Math.sin(p * Math.PI) * 1.2, p * P.kameraHub, THREE.MathUtils.lerp(P.kameraStartZ, P.kameraEndeZ, p));
    },
    anwenden(pos, p, aspect) {
      kamera.position.copy(pos);
      kamera.lookAt(pos.x * 0.4, pos.y + 0.4, pos.z - 10);
      browser.rotation.y = 0.38 + p * 0.5;
      // Hochformat: Kapitel-Index liegt unten, darum schwebt das Fenster oben.
      const hoch = aspect < 1;
      browser.position.x = hoch ? 1.5 : -5.2;
      browser.position.y = (hoch ? 5.2 : -3.8) + p * 5;
      rahmen.rotation.y = -0.3 + p * 0.6;
      wolken.forEach((w, i) => { w.material.uniforms.uVersatz.value = p * (0.6 + i * 0.1); });
    },
  };
}

function baueGalerie() {
  const szene = new THREE.Scene();
  const nacht = farbe('--color-bg-dark');
  szene.background = nacht;
  szene.fog = new THREE.Fog(nacht, 10, 30);
  const kamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  // Wand und Boden: dunkler Raum mit leichter, prozeduraler Putzstruktur.
  const wand = new THREE.Mesh(new THREE.PlaneGeometry(60, 16), new THREE.ShaderMaterial({
    uniforms: { uFarbe: { value: nacht.clone().offsetHSL(0, -0.1, 0.015) } },
    vertexShader: VERTEX_UV,
    fragmentShader: /* glsl */`
      varying vec2 vUv; uniform vec3 uFarbe;
      ${GLSL_RAUSCHEN}
      void main() {
        float n = fbm(vUv * vec2(40.0, 10.0));
        float licht = 0.6 + 0.4 * (0.5 + 0.5 * sin(vUv.x * 60.0 * 0.5236 - 1.57)); // Lichtkegel je Bild
        gl_FragColor = vec4(uFarbe * (0.7 + 0.5 * n) * licht, 1.0);
      }
    `,
  }));
  wand.position.set(0, 3, -0.2);
  szene.add(wand);
  const boden = new THREE.Mesh(new THREE.PlaneGeometry(60, 20),
    new THREE.MeshStandardMaterial({ color: nacht, roughness: 0.3, metalness: 0.2 }));
  boden.rotation.x = -Math.PI / 2; boden.position.set(0, -2.2, 5);
  szene.add(boden);

  // Drei Bilderrahmen mit Platzhalter-Editionen.
  const editionen = [['--color-chapter-1', 'A'], ['--color-chapter-2', 'B'], ['--color-chapter-3', 'C']];
  editionen.forEach(([token, b], i) => {
    const g = new THREE.Group();
    g.add(goldrahmen(4.2, 5.2, 0.34));
    const bild = new THREE.Mesh(new THREE.PlaneGeometry(3.55, 4.55),
      new THREE.MeshStandardMaterial({ map: editionTextur(token, b), roughness: 0.9 }));
    bild.position.z = 0.04;
    g.add(bild);
    g.position.set((i - 1) * 7, 1.8, 0);
    szene.add(g);
    const spot = new THREE.SpotLight(0xfff1dd, 60, 14, 0.5, 0.6, 1.6);
    spot.position.set((i - 1) * 7, 7, 4);
    spot.target = g;
    szene.add(spot);
  });
  szene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const P = PARAMETER.galerie;
  return {
    szene, kamera,
    setze(p, aspect) {
      // Am Handy etwas weiter weg, damit ein Rahmen ganz ins Bild passt.
      const z = P.kameraZ + (aspect < 1 ? 4 : 0);
      return new THREE.Vector3(THREE.MathUtils.lerp(P.kameraStartX, P.kameraEndeX, p), 1.6, z);
    },
    anwenden(pos) {
      kamera.position.copy(pos);
      kamera.lookAt(pos.x + 1.2, 1.7, 0);
    },
  };
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function starten() {
  root.classList.add('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, PARAMETER.pixelRatioMax));

  // Schriften für die Canvas-Texturen abwarten (kommen über tokens.css von Google Fonts).
  await Promise.all([
    document.fonts.load('800 40px "Host Grotesk"'),
    document.fonts.load('italic 40px "Instrument Serif"'),
  ]).catch(() => {});

  const loader = new THREE.TextureLoader();
  const lade = (datei) => loader.loadAsync(`bilder/${datei}`).then((t) => { t.colorSpace = THREE.SRGBColorSpace; return t; });
  const [planeten, monarchie, barbaro] = await Promise.all([
    lade('met-437790.jpg'), lade('met-437792.jpg'), lade('met-437798.jpg'),
  ]);
  const tex = { planeten, monarchie, barbaro, browser: browserTextur() };

  const himmel = baueHimmel(tex);
  const galerie = baueGalerie();

  // Einfache Leistungsstufe (Ersatz für detect-gpu, siehe README): Software-Renderer ohne MSAA.
  const gl = renderer.getContext();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  const schwach = /swiftshader|llvmpipe|software/i.test(gpu);
  if (schwach) renderer.setPixelRatio(1);
  const rtOpt = { type: THREE.HalfFloatType, samples: schwach ? 0 : PARAMETER.msaa };
  const rtA = new THREE.WebGLRenderTarget(1, 1, rtOpt);
  const rtB = new THREE.WebGLRenderTarget(1, 1, rtOpt);

  const O = PARAMETER.oelfarbe;
  const oel = new THREE.ShaderMaterial({
    uniforms: {
      tA: { value: rtA.texture }, tB: { value: rtB.texture },
      uFortschritt: { value: 0 }, uAspect: { value: 1 },
      uKante: { value: O.kantenBreite }, uKontur: { value: O.kontur }, uSchmieren: { value: O.verschmieren },
      uPinsel: { value: O.pinselMassstab }, uLeinwand: { value: O.leinwand },
      uKonturFarbe: { value: farbe('--color-text') },
    },
    vertexShader: /* glsl */`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: OELFARBE_FRAGMENT,
    depthTest: false, depthWrite: false,
  });
  const vollbild = new THREE.Scene();
  vollbild.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), oel));
  const vollbildKamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function groesse() {
    const w = innerWidth, h = innerHeight, a = w / h;
    renderer.setSize(w, h, false);
    const pr = renderer.getPixelRatio();
    rtA.setSize(w * pr, h * pr); rtB.setSize(w * pr, h * pr);
    for (const k of [himmel.kamera, galerie.kamera]) {
      k.aspect = a;
      k.fov = a < 1 ? (k === himmel.kamera ? 68 : 60) : (k === himmel.kamera ? 50 : 45);
      k.updateProjectionMatrix();
    }
    oel.uniforms.uAspect.value = a;
  }
  addEventListener('resize', groesse);
  groesse();

  // Smooth Scroll: Lenis glättet nur, das normale Scrollen bleibt (kein Hijacking).
  const lenis = new Lenis({ lerp: 0.1 });

  const abschnitte = {
    himmel: document.getElementById('akt-1'),
    uebergang: document.getElementById('uebergang'),
    galerie: document.getElementById('akt-2'),
  };
  const fortschritt = (el) => {
    const r = el.getBoundingClientRect();
    const weg = Math.max(1, r.height - innerHeight);
    return THREE.MathUtils.clamp(-r.top / weg, 0, 1);
  };
  const fortschrittUebergang = (el) => {
    // Übergang läuft, während der Abschnitt durch den Bildschirm wandert.
    const r = el.getBoundingClientRect();
    return THREE.MathUtils.clamp((innerHeight - r.top) / (r.height + innerHeight * 0.2), 0, 1);
  };

  const stand = { himmel: null, galerie: null, mix: 0 };
  let zuletzt = performance.now();

  function schleife(jetzt) {
    lenis.raf(jetzt);
    const dt = Math.min(0.1, (jetzt - zuletzt) / 1000); zuletzt = jetzt;
    const k = 1 - Math.pow(1 - PARAMETER.nachziehen, dt * 60); // Glättung unabhängig von der Bildrate
    const a = innerWidth / innerHeight;

    const zielH = himmel.setze(fortschritt(abschnitte.himmel), a);
    const zielG = galerie.setze(fortschritt(abschnitte.galerie), a);
    const zielMix = fortschrittUebergang(abschnitte.uebergang);
    stand.himmel = stand.himmel ? stand.himmel.lerp(zielH, k) : zielH.clone();
    stand.galerie = stand.galerie ? stand.galerie.lerp(zielG, k) : zielG.clone();
    stand.mix += (zielMix - stand.mix) * k;

    const pH = THREE.MathUtils.inverseLerp(PARAMETER.himmel.kameraStartZ, PARAMETER.himmel.kameraEndeZ, stand.himmel.z);
    himmel.anwenden(stand.himmel, pH, a);
    galerie.anwenden(stand.galerie);
    oel.uniforms.uFortschritt.value = stand.mix;

    // Nur die Szenen malen, die gerade zu sehen sind.
    if (stand.mix < 0.999) { renderer.setRenderTarget(rtA); renderer.render(himmel.szene, himmel.kamera); }
    if (stand.mix > 0.001) { renderer.setRenderTarget(rtB); renderer.render(galerie.szene, galerie.kamera); }
    renderer.setRenderTarget(null);
    renderer.render(vollbild, vollbildKamera);
    requestAnimationFrame(schleife);
  }
  requestAnimationFrame(schleife);

  window.__buehne = { modus: schwach ? 'webgl-schwach' : 'webgl', gpu, lenis, stand, PARAMETER };
}
