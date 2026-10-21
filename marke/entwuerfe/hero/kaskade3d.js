// Kapitel II: die Kaskade im 3D-Raum, aus der gemalten Vorlage (Mattia 22.10.2026:
// das modellierte Marmor-Modell wirkte leblos und passte nicht ins Bild).
// Jede der 5 gemalten Stufen ist eine Bildkarte im Raum (three.js). Beim Scrollen fährt die Kamera
// von unten heran, die Stufen fliegen auseinander und gestaffelt in die Tiefe, die Kamera schwenkt:
// echte Parallaxe wie bei Shopify, aber im Malstil. Wasserfälle, Gischt, Kugel und Ringe sind 3D.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js';

const glatt = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// Masse der freigestellten Kaskade (bilder/k2-manifest.json) und Wasser je Stufe (gemessen)
const KW = 1591;
const KH = 2007;
const STUFEN = [[0, 358], [358, 668], [668, 1068], [1068, 1538], [1538, 2007]];
const WASSER = [   // in Stufen-Pixeln: Mitte der Wasserfläche (y), Vorderkante (y), Breite (x0, x1)
  { y: 136, lippe: 152, x0: 561, x1: 1026 },
  { y: 61, lippe: 90, x0: 470, x1: 1133 },
  { y: 93, lippe: 134, x0: 359, x1: 1228 },
  { y: 118, lippe: 174, x0: 265, x1: 1326 },
  { y: 126, lippe: 0, x0: 148, x1: 1446 },
];
const HOEHE = 4;                 // ganze Kaskade 4 Einheiten hoch
const PX = HOEHE / KH;           // Einheiten pro Bildpixel

function schattenTextur() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, 'rgba(70,50,90,.55)');
  g.addColorStop(1, 'rgba(70,50,90,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function fallMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uZeit: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      varying vec2 vUv; uniform float uZeit;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float rausch(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        float u = vUv.x, v = 1.0 - vUv.y;
        float rand = smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.88, 1.0, u));
        float st = rausch(vec2(u * 34.0, v * 3.0 - uZeit * 2.8)) * 0.6 + rausch(vec2(u * 90.0, v * 9.0 - uZeit * 3.8)) * 0.4;
        float a = rand * (0.18 + pow(st, 2.0) * 0.7) * smoothstep(0.0, 0.05, v);
        float schaum = smoothstep(0.84, 1.0, v) * rand * (0.5 + 0.5 * rausch(vec2(u * 50.0, uZeit * 6.0)));
        vec3 c = mix(vec3(0.76, 0.87, 0.98), vec3(1.0), st * 0.75 + schaum);
        gl_FragColor = vec4(c, clamp(a + schaum * 0.6, 0.0, 0.95));
      }`,
  });
}

export function kaskade3d(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const szene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const kaskade = new THREE.Group();
  szene.add(kaskade);
  const laden = new THREE.TextureLoader();
  const schatten = schattenTextur();

  // Stufen als gemalte Karten, darunter ein weicher Schatten
  const stufen = STUFEN.map(([y0, y1], i) => {
    const tex = laden.load(`bilder/k2-stufe${i + 1}.webp`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const h = (y1 - y0) * PX;
    const w = KW * PX;
    const karte = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, depthWrite: false }));
    karte.renderOrder = 10 + i * 3;
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, w * 0.32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: schatten, transparent: true, depthWrite: false, opacity: 0 }));
    s.renderOrder = 9 + i * 3;
    const g = new THREE.Group();
    g.add(s, karte);
    kaskade.add(g);
    return { g, karte, schatten: s, w, h, y0 };
  });

  // Wasserfälle von der Vorderkante der Stufe i ins Wasser der Stufe i+1
  const faelle = [0, 1, 2, 3].map((i) => {
    const fm = fallMaterial();
    const f = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), fm);
    f.renderOrder = 12 + i * 3;
    kaskade.add(f);
    return { f, fm };
  });

  // Kugel, Ringe, Gischt
  const kugel = new THREE.Mesh(new THREE.SphereGeometry(0.09, 32, 16), new THREE.MeshBasicMaterial({ color: 0xff8fc0 }));
  const glanz = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  glanz.position.set(-0.03, 0.035, 0.07);
  kugel.add(glanz);
  kugel.renderOrder = 40;
  kugel.visible = false;
  kaskade.add(kugel);
  const ringe = [0, 1, 2].map(() => {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
    r.renderOrder = 39;
    kaskade.add(r);
    return { r, t: -9, stufe: 0 };
  });
  const ANZ = 320;
  const gischtGeo = new THREE.BufferGeometry();
  gischtGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ANZ * 3), 3));
  const gisch = Array.from({ length: ANZ }, () => ({ s: Math.floor(Math.random() * 4), a: Math.random(), x: Math.random() - 0.5, v: 0.4 + Math.random() * 0.6 }));
  const gischt = new THREE.Points(gischtGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.8, depthWrite: false }));
  gischt.renderOrder = 38;
  kaskade.add(gischt);

  let breite = 1;
  let hoehe = 1;
  const lage = [];   // je Stufe: { x0 links, yOben, z }

  function groesse(w, h) {
    breite = w; hoehe = h;
    renderer.setSize(w, h, false);
    kamera.aspect = w / h;
  }

  // Bildpunkt (Stufen-Pixel) → Raum
  function punkt(i, px, py, dz = 0) {
    const L = lage[i];
    return new THREE.Vector3(L.x0 + px * PX, L.yOben - py * PX, L.z + dz);
  }

  function stufenSetzen(explo) {
    for (let i = 0; i < 5; i++) {
      const st = stufen[i];
      const yOben = HOEHE / 2 - st.y0 * PX + (2 - i) * explo * 0.42;   // auseinander, Mitte bleibt
      const z = (i - 2) * explo * 0.55;                                  // untere Stufen nach vorn
      lage[i] = { x0: -KW * PX / 2, yOben, z };
      st.g.position.set(0, yOben - st.h / 2, z);
      st.schatten.position.set(0, -st.h / 2 + 0.02, 0.15);
      st.schatten.material.opacity = 0.5 * explo;
    }
    for (let i = 0; i < 4; i++) {
      const w = WASSER[i];
      const oben = punkt(i, (w.x0 + w.x1) / 2, w.lippe, 0.04);
      const unten = punkt(i + 1, (w.x0 + w.x1) / 2, WASSER[i + 1].y, 0.02);
      const fb = (w.x1 - w.x0) * PX * 0.62;
      const { f } = faelle[i];
      const dy = oben.y - unten.y;
      const dz = unten.z - oben.z;
      f.scale.set(fb, Math.hypot(dy, dz), 1);
      f.position.set(0, (oben.y + unten.y) / 2, (oben.z + unten.z) / 2 + 0.03);
      f.rotation.x = Math.atan2(dz, dy);
    }
  }

  function wasserPunkt(i) {
    const w = WASSER[i];
    return punkt(i, (w.x0 + w.x1) / 2, w.y, 0.06);
  }

  function ankerAufBildschirm(i) {
    const w = WASSER[i];
    const p = punkt(i, w.x1 + 30, w.y + 40).applyMatrix4(kaskade.matrixWorld).project(kamera);
    return { x: (p.x * 0.5 + 0.5) * breite, y: (-p.y * 0.5 + 0.5) * hoehe };
  }

  function plumps(i, jetzt) {
    const r = ringe.find((x) => jetzt - x.t > 1.2) || ringe[0];
    r.t = jetzt;
    r.stufe = i;
  }

  // z: heranfahren (0→1), explo: auseinander (0→1), maus: Neigung −1…1, versatzX: Platz für das Panel
  function bild(z, explo, jetzt, maus, versatzX = 0, kugelZustand = null) {
    stufenSetzen(explo);
    const zz = glatt(z);
    const dist = lerp(22, 10.5, zz) + explo * 3.6;
    const hochWinkel = lerp(0.1, -0.1, zz) + explo * 0.16;           // erst leicht von unten: mächtig
    const dreh = explo * 0.32 + Math.sin(jetzt * 0.22) * 0.035 * explo + maus.x * 0.08;
    kamera.position.set(Math.sin(dreh) * dist, Math.sin(hochWinkel) * dist + maus.y * 0.25, Math.cos(dreh) * dist);
    kamera.lookAt(0, lerp(0.6, -0.2, zz) - explo * 0.75, 0);
    if (versatzX) kamera.setViewOffset(breite, hoehe, versatzX, 0, breite, hoehe); else kamera.clearViewOffset();
    kamera.updateProjectionMatrix();
    kaskade.updateMatrixWorld();

    faelle.forEach(({ fm }) => { fm.uniforms.uZeit.value = jetzt; });

    if (kugelZustand) {
      kugel.visible = true;
      const a = wasserPunkt(kugelZustand.von);
      const b = wasserPunkt(kugelZustand.nach);
      const k = kugelZustand.k;
      kugel.position.set(lerp(a.x, b.x, k), lerp(a.y, b.y, k * k) + 0.06, lerp(a.z, b.z, k) + Math.sin(k * Math.PI) * 0.35);
    } else kugel.visible = false;

    ringe.forEach((r) => {
      const alt = jetzt - r.t;
      const an = alt >= 0 && alt < 1.3;
      r.r.material.opacity = an ? (1 - alt / 1.3) * 0.95 : 0;
      if (an) {
        const p = wasserPunkt(r.stufe);
        r.r.position.set(p.x, p.y, p.z + 0.05);
        r.r.scale.set(1 + alt * 6, 1, 1 + alt * 2);
      }
    });

    const arr = gischtGeo.attributes.position.array;
    gisch.forEach((g, n) => {
      g.a += 0.01 * g.v;
      if (g.a > 1) { g.a = 0; g.x = Math.random() - 0.5; g.s = Math.floor(Math.random() * 4); }
      const w = WASSER[g.s];
      const p = punkt(g.s + 1, (w.x0 + w.x1) / 2, WASSER[g.s + 1].y, 0.1);
      arr[n * 3] = g.x * (w.x1 - w.x0) * PX * 0.7;
      arr[n * 3 + 1] = p.y + Math.sin(g.a * Math.PI) * 0.28;
      arr[n * 3 + 2] = p.z + g.a * 0.3;
    });
    gischtGeo.attributes.position.needsUpdate = true;

    renderer.render(szene, kamera);
  }

  return { groesse, bild, plumps, ankerAufBildschirm, stufen: 5 };
}
