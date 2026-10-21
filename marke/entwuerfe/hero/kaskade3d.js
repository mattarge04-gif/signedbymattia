// Kapitel II: der Brunnen als echtes 3D-Modell, dreht sich beim Scrollen wie der POS Hub bei Shopify.
// Modell: „Fountain" von jolly.sweets (Sketchfab, CC BY 4.0, Nennung im Impressum nötig),
// in Pastell-Marmor umgefärbt und in 4 Teile getrennt (bilder/k2-brunnen3d.glb, Draco).
// Dazu: Goldränder, Wasser in den Schalen, fallende Wasservorhänge, Bodenbecken, Gischt, Kugel, Ringe.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const glatt = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const GOLD = 0xe3c58a;

// Masse aus Blender (Meter, y oben): Schalen von oben nach unten, Rand-Höhe und -Radius
const SCHALEN = [
  { name: 'schale1', rand: 1.704, r: 0.255, wasser: 1.66 },
  { name: 'schale2', rand: 1.345, r: 0.37, wasser: 1.3 },
  { name: 'schale3', rand: 0.901, r: 0.6, wasser: 0.86 },
];
const BECKEN = { r: 1.15, rand: 0.2, wasser: 0.15 };
const HUB = [0.95, 0.62, 0.3, 0];       // Explosion: wie weit jede Ebene nach oben fährt (Schale1…Sockel)

function wasserMaterial(farbe = [0.72, 0.85, 0.97]) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uZeit: { value: 0 } },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      varying vec3 vP; uniform float uZeit;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float rausch(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        vec2 p = vP.xy * 7.0;
        float r = length(vP.xy);
        float k = rausch(p + vec2(uZeit * 0.5, uZeit * 0.3)) * 0.6 + rausch(p * 2.4 - vec2(uZeit * 0.6, 0.0)) * 0.4;
        float wellen = 0.5 + 0.5 * sin(r * 40.0 - uZeit * 3.0);
        vec3 c = mix(vec3(${farbe.join(', ')}), vec3(0.92, 0.97, 1.0), 0.35 + 0.45 * k);
        c = mix(c, vec3(1.0), smoothstep(0.62, 0.9, k) * 0.6 + wellen * 0.08);
        gl_FragColor = vec4(c, 0.9);
      }`,
  });
}

function vorhangMaterial() {
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
        float st = rausch(vec2(u * 140.0, v * 3.0 - uZeit * 2.6)) * 0.6 + rausch(vec2(u * 320.0, v * 8.0 - uZeit * 3.6)) * 0.4;
        float a = (0.03 + pow(st, 2.6) * 0.5) * smoothstep(0.0, 0.08, v);
        float schaum = smoothstep(0.82, 1.0, v) * (0.5 + 0.5 * rausch(vec2(u * 200.0, uZeit * 6.0)));
        vec3 c = mix(vec3(0.78, 0.89, 0.99), vec3(1.0), st * 0.8 + schaum);
        gl_FragColor = vec4(c, clamp(a + schaum * 0.5, 0.0, 0.92));
      }`,
  });
}

export function kaskade3d(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const szene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);
  szene.add(new THREE.HemisphereLight(0xe2ecfb, 0xf6cfbf, 1.5));
  const sonne = new THREE.DirectionalLight(0xfff0d8, 2.6);
  sonne.position.set(-3, 6, 4);
  szene.add(sonne);
  const rand = new THREE.DirectionalLight(0xd9ccf5, 1.2);
  rand.position.set(4, 2, -4);
  szene.add(rand);

  const brunnen = new THREE.Group();
  szene.add(brunnen);
  const ebenen = { schale1: new THREE.Group(), schale2: new THREE.Group(), schale3: new THREE.Group(), sockel: new THREE.Group() };
  Object.values(ebenen).forEach((g) => brunnen.add(g));
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.3, emissive: 0x3a2a10, emissiveIntensity: 0.2 });

  // Modell laden
  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/gltf/');
  new GLTFLoader().setDRACOLoader(draco).load('bilder/k2-brunnen3d.glb', (gltf) => {
    const funde = [];
    gltf.scene.traverse((o) => { if (o.isMesh) funde.push(o); });
    funde.forEach((o) => {
      let n = o;
      while (n && !ebenen[n.name]) n = n.parent;
      if (o.material) o.material.roughness = 0.5;
      (n ? ebenen[n.name] : ebenen.sockel).add(o);
    });
  });

  // Goldränder, Wasser und Vorhänge je Schale
  const wasserMats = [];
  const vorhaenge = [];
  SCHALEN.forEach((s, i) => {
    const g = ebenen[s.name];
    const ring = new THREE.Mesh(new THREE.TorusGeometry(s.r * 1.02, 0.012 + i * 0.003, 10, 96), gold);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = s.rand;
    g.add(ring);
    const wm = wasserMaterial();
    wasserMats.push(wm);
    const w = new THREE.Mesh(new THREE.CircleGeometry(s.r * 0.9, 64), wm);
    w.rotation.x = -Math.PI / 2;
    w.position.y = s.wasser;
    g.add(w);
    // Wasservorhang vom Rand nach unten (offener Zylinder)
    const vm = vorhangMaterial();
    wasserMats.push(vm);
    const v = new THREE.Mesh(new THREE.CylinderGeometry(s.r * 1.03, s.r * 1.07, 1, 96, 1, true), vm);
    v.renderOrder = 5;
    brunnen.add(v);
    vorhaenge.push({ v, s, i });
  });
  // Bodenbecken mit Goldrand
  const beckenWand = new THREE.Mesh(new THREE.CylinderGeometry(BECKEN.r, BECKEN.r * 1.02, BECKEN.rand, 96, 1, true), new THREE.MeshStandardMaterial({ color: 0xf6e6dc, roughness: 0.55, side: THREE.DoubleSide }));
  beckenWand.position.y = BECKEN.rand / 2;
  ebenen.sockel.add(beckenWand);
  const beckenRand = new THREE.Mesh(new THREE.TorusGeometry(BECKEN.r, 0.035, 12, 120), new THREE.MeshStandardMaterial({ color: 0xfbf0e6, roughness: 0.5 }));
  beckenRand.rotation.x = Math.PI / 2;
  beckenRand.position.y = BECKEN.rand;
  ebenen.sockel.add(beckenRand);
  const beckenGold = new THREE.Mesh(new THREE.TorusGeometry(BECKEN.r * 1.012, 0.012, 8, 120), gold);
  beckenGold.rotation.x = Math.PI / 2;
  beckenGold.position.y = BECKEN.rand + 0.03;
  ebenen.sockel.add(beckenGold);
  const bw = wasserMaterial([0.68, 0.82, 0.96]);
  wasserMats.push(bw);
  const beckenWasser = new THREE.Mesh(new THREE.CircleGeometry(BECKEN.r * 0.98, 96), bw);
  beckenWasser.rotation.x = -Math.PI / 2;
  beckenWasser.position.y = BECKEN.wasser;
  ebenen.sockel.add(beckenWasser);

  // Kugel, Ringe, Gischt
  const kugel = new THREE.Mesh(new THREE.SphereGeometry(0.06, 32, 16), new THREE.MeshStandardMaterial({ color: 0xff9dc8, roughness: 0.2, emissive: 0xff6fae, emissiveIntensity: 0.35 }));
  kugel.visible = false;
  brunnen.add(kugel);
  const ringe = [0, 1, 2].map(() => {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.065, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
    r.rotation.x = -Math.PI / 2;
    brunnen.add(r);
    return { r, t: -9, stufe: 0 };
  });
  const ANZ = 360;
  const gGeo = new THREE.BufferGeometry();
  gGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ANZ * 3), 3));
  const gisch = Array.from({ length: ANZ }, () => ({ s: Math.floor(Math.random() * 3), w: Math.random() * 6.283, a: Math.random(), v: 0.5 + Math.random() * 0.7 }));
  brunnen.add(new THREE.Points(gGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.85, depthWrite: false })));

  let breite = 1;
  let hoehe = 1;
  const hub = [0, 0, 0, 0];

  function groesse(w, h) {
    breite = w; hoehe = h;
    renderer.setSize(w, h, false);
    kamera.aspect = w / h;
  }

  // Wasserpunkte für die Kugel: drei Schalen, Becken, Becken vorne
  function wasserPunkt(i) {
    if (i < 3) return new THREE.Vector3(0.05, SCHALEN[i].wasser + hub[i] + 0.04, SCHALEN[i].r * 0.45);
    return new THREE.Vector3(0.1, BECKEN.wasser + 0.04, i === 3 ? 0.8 : 0.95);
  }
  function ankerAufBildschirm(i) {
    const r = i < 3 ? SCHALEN[i].r : BECKEN.r * 0.9;
    const y = i < 3 ? SCHALEN[i].rand + hub[i] : BECKEN.rand + (i - 3) * 0.12;
    const p = new THREE.Vector3(r, y, 0).applyMatrix4(brunnen.matrixWorld).project(kamera);
    return { x: (p.x * 0.5 + 0.5) * breite, y: (-p.y * 0.5 + 0.5) * hoehe };
  }
  function plumps(i, jetzt) {
    const r = ringe.find((x) => jetzt - x.t > 1.2) || ringe[0];
    r.t = jetzt;
    r.stufe = Math.min(i, 4);
  }

  // z: heranfahren (0→1), explo: auseinander (0→1), dreh: Umdrehungen durch den Scroll
  function bild(z, explo, jetzt, maus, versatzX = 0, kugelZustand = null, dreh = 0) {
    const zz = glatt(z);
    ['schale1', 'schale2', 'schale3', 'sockel'].forEach((n, i) => { hub[i] = HUB[i] * explo; ebenen[n].position.y = hub[i]; });
    // Vorhänge zwischen Rand und nächster Wasserfläche
    vorhaenge.forEach(({ v, s, i }) => {
      const oben = s.rand + hub[i] - 0.005;
      const unten = i < 2 ? SCHALEN[i + 1].wasser + hub[i + 1] : BECKEN.wasser;
      v.scale.y = Math.max(0.01, oben - unten);
      v.position.y = (oben + unten) / 2;
    });
    brunnen.rotation.y = dreh * Math.PI * 2 + maus.x * 0.15;
    const dist = lerp(9, 4.3, zz) + explo * 3.2;
    const winkel = lerp(0.02, 0.2, zz) + explo * 0.12 - maus.y * 0.05;   // erst fast von unten: mächtig
    kamera.position.set(0, Math.sin(winkel) * dist + 0.9, Math.cos(winkel) * dist);
    kamera.lookAt(0, lerp(1.25, 0.95, zz) + explo * 0.6, 0);
    if (versatzX) kamera.setViewOffset(breite, hoehe, versatzX, 0, breite, hoehe); else kamera.clearViewOffset();
    kamera.updateProjectionMatrix();
    brunnen.updateMatrixWorld();

    wasserMats.forEach((m) => { m.uniforms.uZeit.value = jetzt; });

    if (kugelZustand) {
      kugel.visible = true;
      const a = wasserPunkt(kugelZustand.von);
      const b = wasserPunkt(kugelZustand.nach);
      const k = kugelZustand.k;
      const nachAussen = Math.sin(k * Math.PI) * 0.25;
      kugel.position.set(lerp(a.x, b.x, k), lerp(a.y, b.y, k * k), lerp(a.z, b.z, k) + nachAussen);
    } else kugel.visible = false;

    ringe.forEach((r) => {
      const alt = jetzt - r.t;
      const an = alt >= 0 && alt < 1.3;
      r.r.material.opacity = an ? (1 - alt / 1.3) * 0.95 : 0;
      if (an) {
        const p = wasserPunkt(r.stufe);
        r.r.position.set(p.x, p.y - 0.035, p.z);
        r.r.scale.setScalar(1 + alt * 5);
      }
    });

    const arr = gGeo.attributes.position.array;
    gisch.forEach((g, n) => {
      g.a += 0.012 * g.v;
      if (g.a > 1) { g.a = 0; g.w = Math.random() * 6.283; g.s = Math.floor(Math.random() * 3); }
      const s = SCHALEN[g.s];
      const unten = g.s < 2 ? SCHALEN[g.s + 1].wasser + hub[g.s + 1] : BECKEN.wasser;
      const r = s.r * 1.06 + g.a * 0.12;
      arr[n * 3] = Math.cos(g.w) * r;
      arr[n * 3 + 1] = unten + Math.sin(g.a * Math.PI) * 0.12;
      arr[n * 3 + 2] = Math.sin(g.w) * r;
    });
    gGeo.attributes.position.needsUpdate = true;

    renderer.render(szene, kamera);
  }

  return { groesse, bild, plumps, ankerAufBildschirm, stufen: 5 };
}
