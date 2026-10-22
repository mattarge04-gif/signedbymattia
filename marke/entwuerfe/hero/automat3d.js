// Kapitel II: der barocke Automat als echtes 3D-Objekt (Blender: marke/assets/3d/automat-v1.blend → bilder/k2-automat.glb).
// Wie der POS Hub bei Shopify: der Scroll spult eine inszenierte Sequenz mit Keyframes ab
// (Kamera, Drehung, Explosion der Teile). „Probier es" lässt nacheinander Walze, Zahnräder, Kamm und Putto arbeiten.
// Putto-Figur: „Garden Baby Angel Statue" von ZeusAlmighty, Sketchfab, CC BY 4.0 (Nennung im Impressum).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// Keyframes je Teil für die Explosion (Versatz in Metern, y oben; z zur Kamera)
const EXPLO = {
  kuppel: { p: [0, 0.62, 0], r: [0, 0.6, 0] },
  putto: { p: [0, 0.78, 0], r: [0, -1.2, 0] },
  gehaeuse: { p: [0, 0.3, 0], s: 1.08 },
  walze: { p: [-0.42, 0.0, 0.42], r: [0, 0.4, 0] },
  kamm: { p: [0.45, -0.08, 0.45], r: [0, -0.35, 0] },
  zahnrad1: { p: [0, 0.12, 0.6] },
  zahnrad2: { p: [0.55, 0.2, 0.3] },
  zahnrad3: { p: [-0.55, 0.28, 0.25] },
  feder: { p: [0.1, 0.55, 0.55], r: [0.6, 0, 0] },
  sockel: { p: [0, -0.1, 0] },
};
// Reihenfolge der Schritte im Ablauf-Panel → welches Teil arbeitet
const SCHRITT_TEIL = ['walze', 'zahnrad1', 'kamm', 'putto', 'putto'];

export function kaskade3d(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;

  const szene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);
  szene.add(new THREE.HemisphereLight(0xe8eefb, 0xf6cfbf, 0.7));
  const sonne = new THREE.DirectionalLight(0xfff0d8, 2.4);
  sonne.position.set(-3, 6, 4);
  szene.add(sonne);
  const gegen = new THREE.DirectionalLight(0xd9ccf5, 1.4);
  gegen.position.set(4, 2, -4);
  szene.add(gegen);
  // Umgebung für Goldglanz: einfache Farbverlaufs-Kuppel
  const pmrem = new THREE.PMREMGenerator(renderer);
  const umgebung = new THREE.Scene();
  const himmel = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 c = mix(vec3(1.0,0.86,0.78), vec3(0.82,0.89,0.98), smoothstep(-0.2,0.6,h)); c += vec3(1.0,0.95,0.85) * pow(max(dot(normalize(vP), normalize(vec3(-0.5,0.8,0.4))),0.0), 30.0) * 3.0; gl_FragColor = vec4(c,1.0); }',
  }));
  umgebung.add(himmel);
  szene.environment = pmrem.fromScene(umgebung, 0.04).texture;

  const automat = new THREE.Group();
  szene.add(automat);
  const teile = {};
  const basis = {};
  const leuchten = {};   // Materialien je Teil für das Aufleuchten

  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/gltf/');
  new GLTFLoader().setDRACOLoader(draco).load('bilder/k2-automat.glb', (gltf) => {
    gltf.scene.children.slice().forEach((g) => {
      if (!EXPLO[g.name]) return;
      teile[g.name] = g;
      basis[g.name] = { p: g.position.clone(), r: g.rotation.clone() };
      leuchten[g.name] = [];
      g.traverse((o) => {
        if (!o.isMesh) return;
        o.material = o.material.clone();
        if (o.material.metalness > 0.5) { o.material.envMapIntensity = 1.6; o.material.roughness = 0.2; o.material.color.setRGB(0.95, 0.66, 0.26); }
        else { o.material.envMapIntensity = 0.25; o.material.roughness = 0.55; if (o.material.map) o.material.color.setRGB(0.84, 0.72, 0.86); }
        if (o.material.emissive) leuchten[g.name].push(o.material);
      });
      automat.add(g);
    });
  });

  // Glanz-Funken, die um aktive Teile kreisen
  const ANZ = 90;
  const fGeo = new THREE.BufferGeometry();
  fGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ANZ * 3), 3));
  const funken = new THREE.Points(fGeo, new THREE.PointsMaterial({ color: 0xffe7b0, size: 0.03, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  automat.add(funken);
  const fDaten = Array.from({ length: ANZ }, () => ({ w: Math.random() * 6.28, r: 0.15 + Math.random() * 0.25, h: (Math.random() - 0.5) * 0.4, v: 0.5 + Math.random() }));

  function karteTextur(zeilen, farbe) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 340;
    const x = c.getContext('2d');
    x.fillStyle = '#FBF3EA'; x.fillRect(0, 0, 512, 340);
    x.strokeStyle = '#E3C58A'; x.lineWidth = 10; x.strokeRect(14, 14, 484, 312);
    x.lineWidth = 3; x.strokeRect(30, 30, 452, 280);
    x.fillStyle = farbe; x.textAlign = 'center';
    x.font = 'italic 46px Georgia, serif'; x.fillText(zeilen[0], 256, 130);
    x.font = '600 34px system-ui, sans-serif'; x.fillStyle = '#231B3A';
    zeilen.slice(1).forEach((z, i) => x.fillText(z, 256, 200 + i * 48));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }
  function karte(zeilen, farbe) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), new THREE.MeshBasicMaterial({ map: karteTextur(zeilen, farbe), transparent: true, side: THREE.DoubleSide, toneMapped: false }));
    m.visible = false;
    automat.add(m);
    return m;
  }
  const brief = karte(['Anfrage', 'Boiler tropft, Kriens'], '#C2557F');
  const antwort = karte(['Antwort', 'Morgen um 8 Uhr'], '#8C7650');
  const kalender = karte(['Do 08:00', 'Meier, Kriens · Boiler'], '#C2557F');

  let breite = 1;
  let hoehe = 1;
  let aktiv = -1;
  let aktivSeit = 0;

  function groesse(w, h) {
    breite = w; hoehe = h;
    renderer.setSize(w, h, false);
    kamera.aspect = w / h;
  }
  function weltPunkt(name) {
    const g = teile[name];
    if (!g) return new THREE.Vector3();
    const b = new THREE.Box3().setFromObject(g);
    return b.getCenter(new THREE.Vector3());
  }
  function ankerAufBildschirm(i) {
    const p = weltPunkt(SCHRITT_TEIL[Math.min(i, 4)]).project(kamera);
    return { x: (p.x * 0.5 + 0.5) * breite, y: (-p.y * 0.5 + 0.5) * hoehe };
  }
  function plumps(i, jetzt) { aktiv = Math.min(i, 3); aktivSeit = jetzt; }

  // z: heranfahren, explo: auseinander, dreh: Umdrehungen
  function bild(z, explo, jetzt, maus, versatzX = 0, _kugel = null, dreh = 0, auftauchen = 1) {
    const zz = glatt(z);
    const e = glatt(explo);
    for (const [name, g] of Object.entries(teile)) {
      const k = EXPLO[name];
      const b = basis[name];
      // gestaffelt: obere Teile zuerst, Zahnräder zuletzt
      const verz = name.startsWith('zahnrad') ? 0.25 : name === 'feder' ? 0.15 : 0;
      const t = glatt(klemm((e - verz) / (1 - verz)));
      g.position.set(b.p.x + k.p[0] * t, b.p.y + k.p[1] * t, b.p.z + k.p[2] * t);
      const r = k.r || [0, 0, 0];
      g.rotation.set(b.r.x + r[0] * t, b.r.y + r[1] * t, b.r.z + r[2] * t);
      if (k.s) g.scale.setScalar(lerp(1, k.s, t));
    }
    // Arbeit: Zahnräder drehen ständig leicht, das aktive Teil arbeitet sichtbar
    const seit = jetzt - aktivSeit;
    const z1 = teile.zahnrad1; const z2 = teile.zahnrad2; const z3 = teile.zahnrad3;
    const tempo = aktiv === 1 ? 2.2 : 0.25;
    if (z1) z1.rotation.z += 0.004 * tempo * 6;
    if (z2) z2.rotation.z -= 0.006 * tempo * 6;
    if (z3) z3.rotation.z -= 0.008 * tempo * 6;
    if (teile.walze) teile.walze.rotation.x += aktiv === 0 ? 0.08 : 0.004;
    if (teile.kamm && aktiv === 2) teile.kamm.position.y += Math.sin(jetzt * 40) * 0.004;
    if (teile.putto) teile.putto.rotation.y += aktiv === 3 ? 0.06 : 0.002;
    for (const [name, mats] of Object.entries(leuchten)) {
      const an = aktiv >= 0 && SCHRITT_TEIL[aktiv] === name ? Math.max(0, 1 - Math.max(0, seit - 1.2)) : 0;
      mats.forEach((m) => { m.emissive.setRGB(1, 0.75, 0.85); m.emissiveIntensity = an * 0.35; });
    }
    // Funken um das aktive Teil
    const arr = fGeo.attributes.position.array;
    const mitte = aktiv >= 0 ? automat.worldToLocal(weltPunkt(SCHRITT_TEIL[aktiv])) : new THREE.Vector3();
    fDaten.forEach((f, n) => {
      f.w += 0.02 * f.v;
      arr[n * 3] = mitte.x + Math.cos(f.w) * f.r;
      arr[n * 3 + 1] = mitte.y + f.h + Math.sin(f.w * 2) * 0.03;
      arr[n * 3 + 2] = mitte.z + Math.sin(f.w) * f.r;
    });
    fGeo.attributes.position.needsUpdate = true;
    funken.material.opacity = aktiv >= 0 ? 0.9 * Math.max(0, 1 - Math.max(0, seit - 1.6)) : 0;

    // Karten: Brief fällt in die Walze (Station 1), Antwort steigt auf (3), Kalender beim Putto (4)
    const zeig = (m, an, pos, rotY = 0) => { m.visible = an > 0.01; m.material.opacity = an; m.position.copy(pos); m.rotation.set(0, rotY, 0); };
    const w = teile.walze ? automat.worldToLocal(weltPunkt('walze')) : new THREE.Vector3(0, 0.66, 0);
    const k = teile.kamm ? automat.worldToLocal(weltPunkt('kamm')) : new THREE.Vector3(0, 0.6, 0);
    const pu = teile.putto ? automat.worldToLocal(weltPunkt('putto')) : new THREE.Vector3(0, 1.9, 0);
    const f0 = aktiv === 0 ? Math.min(1, seit / 1.4) : 0;
    zeig(brief, aktiv === 0 ? 1 - Math.max(0, f0 - 0.8) * 5 : 0, new THREE.Vector3(w.x, w.y + 0.7 - f0 * 0.6, w.z + 0.2), -automat.rotation.y);
    const f2 = aktiv === 2 ? Math.min(1, seit / 2) : 0;
    zeig(antwort, aktiv === 2 ? Math.min(1, f2 * 3) : 0, new THREE.Vector3(k.x, k.y + 0.2 + f2 * 0.8, k.z + 0.3), -automat.rotation.y + Math.sin(jetzt * 2) * 0.15);
    zeig(kalender, aktiv === 3 ? Math.min(1, seit * 1.5) : 0, new THREE.Vector3(pu.x + 0.28, pu.y + 0.05, pu.z + 0.1), -automat.rotation.y);
    automat.position.y = -2.4 * (1 - glatt(auftauchen));

    // Inszenierte Kamera: weit und von unten → nah → zurück und etwas höher für die Explosion
    automat.rotation.y = dreh * Math.PI * 2 + maus.x * 0.12;
    const dist = lerp(9, 5.4, zz) + e * 2.4;
    const winkel = lerp(0.06, 0.14, zz) + e * 0.08 - maus.y * 0.04;
    kamera.position.set(0, Math.sin(winkel) * dist + 0.9, Math.cos(winkel) * dist);
    kamera.lookAt(0, lerp(1.1, 0.95, zz) + e * 0.25, 0);
    kamera.fov = lerp(34, 30, zz) + e * 2;
    if (versatzX) kamera.setViewOffset(breite, hoehe, versatzX, 0, breite, hoehe); else kamera.clearViewOffset();
    kamera.updateProjectionMatrix();
    renderer.render(szene, kamera);
  }

  return { groesse, bild, plumps, ankerAufBildschirm, stufen: 5 };
}
