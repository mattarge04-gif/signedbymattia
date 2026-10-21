// Kapitel II: die Kaskade als echtes 3D-Modell (three.js, selbst modelliert, Mattia 22.10.2026).
// 5 Becken aus Pastell-Marmor mit Gold, Wasser und Wasserfälle als Shader, Kugel und Ringe.
// Die Kamera fährt heran (von unten, mächtig), dann Explosionsansicht mit Umkreisen wie bei Shopify.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js';

const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

const GOLD = new THREE.Color('#E3C58A');
const STUFEN = 5;
const BREITE = (i) => 1.0 + i * 0.42;          // Becken oben schmal, unten breit
const TIEFE = (i) => 0.62 * BREITE(i);
const BECKEN_H = 0.34;
const ABSTAND = 0.66;                           // Höhe von Becken zu Becken (geschlossen)

// ---------- Marmor als Canvas-Textur ----------
function marmor() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#F2E2D8';
  x.fillRect(0, 0, 512, 512);
  const farben = ['rgba(176,150,220,.75)', 'rgba(240,170,140,.7)', 'rgba(210,175,110,.5)'];
  for (let n = 0; n < 34; n++) {
    x.strokeStyle = farben[n % 3];
    x.lineWidth = 0.6 + Math.random() * 2.2;
    x.beginPath();
    let px = Math.random() * 512;
    let py = Math.random() * 512;
    x.moveTo(px, py);
    for (let k = 0; k < 6; k++) {
      const nx = px + (Math.random() - 0.3) * 160;
      const ny = py + (Math.random() - 0.5) * 120;
      x.quadraticCurveTo((px + nx) / 2 + (Math.random() - 0.5) * 60, (py + ny) / 2, nx, ny);
      px = nx; py = ny;
    }
    x.stroke();
  }
  x.globalAlpha = 0.25;
  for (let n = 0; n < 2500; n++) { x.fillStyle = Math.random() < 0.5 ? '#fff' : '#E9D9EE'; x.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- Grundform eines Beckens: abgerundet, vorne barock ausgebaucht ----------
function beckenForm(w, d, einzug = 0) {
  const s = new THREE.Shape();
  const W = w / 2 - einzug;
  const D = d / 2 - einzug;
  const r = Math.min(0.2, D * 0.5);
  const bauch = d * 0.16;
  s.moveTo(-W + r, -D);
  s.lineTo(W - r, -D);
  s.quadraticCurveTo(W, -D, W, -D + r);
  s.lineTo(W, D - r);
  s.quadraticCurveTo(W, D, W - r, D);
  // vorne: zwei Schwünge und ein Bauch in der Mitte
  s.bezierCurveTo(W * 0.55, D, W * 0.45, D + bauch, 0, D + bauch);
  s.bezierCurveTo(-W * 0.45, D + bauch, -W * 0.55, D, -W + r, D);
  s.quadraticCurveTo(-W, D, -W, D - r);
  s.lineTo(-W, -D + r);
  s.quadraticCurveTo(-W, -D, -W + r, -D);
  // gespiegelt, damit der Bauch nach dem Aufrichten (rotateX) vorne bei +z liegt
  return new THREE.Shape(s.getPoints(40).map((p) => new THREE.Vector2(p.x, -p.y)));
}

function stufe(i, mat) {
  const g = new THREE.Group();
  const w = BREITE(i);
  const d = TIEFE(i);
  const h = i === STUFEN - 1 ? BECKEN_H * 1.25 : BECKEN_H;
  const aussen = beckenForm(w, d);
  const innen = beckenForm(w, d, 0.085);
  const ring = (form, loch) => { const f = form.clone(); f.holes.push(new THREE.Path(loch.getPoints(48).reverse())); return f; };
  const extr = (form, tiefe, rund) => new THREE.ExtrudeGeometry(form, { depth: tiefe, bevelEnabled: rund > 0, bevelThickness: rund, bevelSize: rund, bevelSegments: 5, curveSegments: 28 }).rotateX(-Math.PI / 2);

  // Profil von unten nach oben: Fuss (eingezogen) · Bauch (rund) · Lippe (ausladend)
  const fuss = new THREE.Mesh(extr(beckenForm(w * 0.82, d * 0.8), 0.07, 0.02), mat.marmor);
  g.add(fuss);
  const bauch = new THREE.Mesh(extr(ring(beckenForm(w * 0.96, d * 0.95), innen), h - 0.14, 0.06), mat.marmor);
  bauch.position.y = 0.09;
  g.add(bauch);
  const lippe = new THREE.Mesh(extr(ring(beckenForm(w + 0.1, d + 0.1), innen), 0.035, 0.02), mat.marmor);
  lippe.position.y = h - 0.035;
  g.add(lippe);
  const boden = new THREE.Mesh(extr(innen, 0.04, 0), mat.marmor);
  boden.position.y = 0.09;
  g.add(boden);

  // Goldkanten: an der Lippe und über dem Fuss
  const kante = (form, y, r) => {
    const pts = form.getSpacedPoints(140).map((p) => new THREE.Vector3(p.x, y, -p.y));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 180, r, 6, true), mat.gold));
  };
  kante(beckenForm(w + 0.13, d + 0.13), h + 0.02, 0.018);
  kante(beckenForm(w * 0.99, d * 0.98), 0.12, 0.012);

  // Muschel vorne: Fächer aus Gold mit Rippen
  const muschel = new THREE.Group();
  const facher = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24, 0, Math.PI), mat.gold);
  muschel.add(facher);
  for (let k = 0; k <= 8; k++) {
    const a = (k / 8) * Math.PI;
    const rippe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.008, 0.012), mat.goldDunkel);
    rippe.position.set(Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0.004);
    rippe.rotation.z = a;
    muschel.add(rippe);
  }
  const knopf = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), mat.gold);
  muschel.add(knopf);
  muschel.position.set(0, h * 0.34, (d * 0.95) / 2 + d * 0.95 * 0.16 + 0.055);
  muschel.scale.setScalar(0.85 + i * 0.16);
  g.add(muschel);

  // Voluten an den vorderen Ecken
  for (const sx of [-1, 1]) {
    const vol = new THREE.Mesh(new THREE.TorusGeometry(0.055 + i * 0.006, 0.018, 8, 24, Math.PI * 1.6), mat.marmor);
    vol.position.set(sx * (w * 0.48), h * 0.5, d * 0.36);
    vol.rotation.set(0, sx * 0.6, sx > 0 ? 0 : Math.PI);
    g.add(vol);
  }

  // Sockel unter dem untersten Becken
  if (i === STUFEN - 1) {
    const sockel = new THREE.Mesh(new THREE.ExtrudeGeometry(beckenForm(w + 0.22, d + 0.2), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }).rotateX(-Math.PI / 2), mat.marmor);
    sockel.position.y = -0.16;
    g.add(sockel);
    kante(beckenForm(w + 0.27, d + 0.25), -0.005, 0.014);
  }

  // Wasser
  const wasserGeo = new THREE.ShapeGeometry(innen, 24).rotateX(-Math.PI / 2);
  const wasser = new THREE.Mesh(wasserGeo, mat.wasser);
  wasser.position.y = h * 0.82;
  g.add(wasser);

  // Säulen mit Voluten unter dem Becken (tragen es auf dem nächsten)
  const saeulen = new THREE.Group();
  if (i < STUFEN - 1) {
    const hoehe = ABSTAND - BECKEN_H;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const sa = new THREE.Mesh(new THREE.BoxGeometry(0.11, hoehe, 0.11), mat.marmor);
      sa.position.set(sx * w * 0.36, -hoehe / 2, sz * d * 0.28);
      saeulen.add(sa);
      const kap = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.15), mat.gold);
      kap.position.set(sx * w * 0.36, -0.02, sz * d * 0.28);
      saeulen.add(kap);
      if (sz > 0) {
        const volute = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 8, 20, Math.PI * 1.5), mat.marmor);
        volute.position.set(sx * (w * 0.36 + 0.09), -hoehe * 0.3, sz * d * 0.28);
        volute.rotation.y = Math.PI / 2;
        volute.scale.x = sx;
        saeulen.add(volute);
      }
    }
  }
  g.add(saeulen);
  return { g, w, d, h, wasser, saeulen };
}

// ---------- Wasserfall-Material ----------
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
        float rand = smoothstep(0.0, 0.15, u) * (1.0 - smoothstep(0.85, 1.0, u));
        float st = rausch(vec2(u * 30.0, v * 3.0 - uZeit * 2.6)) * 0.6 + rausch(vec2(u * 80.0, v * 8.0 - uZeit * 3.6)) * 0.4;
        float a = rand * (0.22 + pow(st, 2.0) * 0.6);
        float schaum = smoothstep(0.85, 1.0, v) * rand;
        vec3 c = mix(vec3(0.74, 0.86, 0.97), vec3(1.0), st * 0.7 + schaum);
        gl_FragColor = vec4(c, clamp(a + schaum * 0.5, 0.0, 0.92));
      }`,
  });
}

function wasserMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uZeit: { value: 0 } },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      varying vec3 vP; uniform float uZeit;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float rausch(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      void main(){
        vec2 p = vP.xz * 6.0;
        float k = rausch(p + vec2(uZeit * 0.4, uZeit * 0.25)) * 0.6 + rausch(p * 2.3 - vec2(uZeit * 0.5, 0.0)) * 0.4;
        float licht = smoothstep(0.55, 0.85, k);
        vec3 c = mix(vec3(0.66, 0.80, 0.94), vec3(0.86, 0.93, 1.0), 0.5 + 0.5 * k);
        c = mix(c, vec3(1.0), licht * 0.55);
        gl_FragColor = vec4(c, 0.9);
      }`,
  });
}

export function kaskade3d(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const szene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  // Licht: Himmel von oben (blau), Boden warm, Sonne von oben links
  szene.add(new THREE.HemisphereLight(0xdfe9fb, 0xf5c9b8, 1.0));
  const sonne = new THREE.DirectionalLight(0xfff1dc, 2.0);
  sonne.position.set(-4, 7, 5);
  szene.add(sonne);
  const gegen = new THREE.DirectionalLight(0xd9ccf5, 0.9);
  gegen.position.set(5, 2, -3);
  szene.add(gegen);

  const tex = marmor();
  const mat = {
    marmor: new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5, metalness: 0.0, color: 0xfff4ee }),
    goldDunkel: new THREE.MeshStandardMaterial({ color: 0xc9a466, roughness: 0.4, metalness: 0.7 }),
    gold: new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.32, metalness: 0.75, emissive: 0x3a2a10, emissiveIntensity: 0.15 }),
    wasser: wasserMaterial(),
  };

  const kaskade = new THREE.Group();
  szene.add(kaskade);
  const stufen = [];
  for (let i = 0; i < STUFEN; i++) {
    const st = stufe(i, mat);
    kaskade.add(st.g);
    stufen.push(st);
  }
  // Wasserfälle von Becken i (Vorderkante) in Becken i+1
  const faelle = [];
  for (let i = 0; i < STUFEN - 1; i++) {
    const fm = fallMaterial();
    const f = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), fm);
    kaskade.add(f);
    faelle.push({ f, fm });
  }
  // Kugel und Ring
  const kugel = new THREE.Mesh(new THREE.SphereGeometry(0.075, 32, 16), new THREE.MeshStandardMaterial({ color: 0xff9dc8, roughness: 0.25, emissive: 0xff6fae, emissiveIntensity: 0.25 }));
  kugel.visible = false;
  kaskade.add(kugel);
  const ringe = [];
  for (let k = 0; k < 3; k++) {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.075, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
    kaskade.add(r);
    ringe.push({ r, t: -9, stufe: 0 });
  }
  // Gischt: feine Tröpfchen um die Wasserfälle
  const ANZ = 260;
  const gischtGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(ANZ * 3);
  const gisch = Array.from({ length: ANZ }, () => ({ s: Math.floor(Math.random() * 4), a: Math.random(), x: (Math.random() - 0.5), v: 0.3 + Math.random() * 0.5 }));
  gischtGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const gischt = new THREE.Points(gischtGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.75, depthWrite: false }));
  kaskade.add(gischt);

  let breite = 1;
  let hoehe = 1;
  const lage = [];   // aktuelle Höhe je Stufe (für Kugel und Schilder)

  function groesse(w, h) {
    breite = w; hoehe = h;
    renderer.setSize(w, h, false);
    kamera.aspect = w / h;
  }

  // Stufen-Höhen: geschlossen gestapelt, bei Explosion auseinander
  function stufenSetzen(explo) {
    let y = 0;
    for (let i = STUFEN - 1; i >= 0; i--) {
      const st = stufen[i];
      lage[i] = y;
      st.g.position.y = y;
      st.g.rotation.y = explo * (i - 2) * 0.05;
      st.saeulen.visible = true;
      y += ABSTAND + explo * 0.55;
    }
    const mitte = lage[0] / 2;
    kaskade.position.y = -mitte - 0.2;
    // Wasserfälle: von der Vorderkante des Beckens i bis ins Wasser von i+1
    for (let i = 0; i < STUFEN - 1; i++) {
      const oben = lage[i] + stufen[i].h + 0.02;
      const unten = lage[i + 1] + stufen[i + 1].h * 0.8;
      const zf = TIEFE(i) / 2 + TIEFE(i) * 0.16 + 0.04;
      const { f } = faelle[i];
      f.scale.set(BREITE(i) * 0.5, oben - unten, 1);
      f.position.set(0, (oben + unten) / 2, zf);
      f.rotation.y = stufen[i].g.rotation.y * 0.5;
    }
    return lage;
  }

  function wasserPunkt(i) {
    return new THREE.Vector3(0, lage[i] + stufen[i].h * 0.82 + 0.07, TIEFE(i) * 0.12);
  }

  // Bildschirmlage eines Punkts rechts an der Vorderkante einer Stufe (für Schilder)
  function ankerAufBildschirm(i) {
    const p = new THREE.Vector3(BREITE(i) * 0.5, lage[i] + stufen[i].h * 0.6, TIEFE(i) * 0.4).applyMatrix4(kaskade.matrixWorld);
    p.project(kamera);
    return { x: (p.x * 0.5 + 0.5) * breite, y: (-p.y * 0.5 + 0.5) * hoehe };
  }

  function plumps(i, jetzt) {
    const r = ringe.find((x) => jetzt - x.t > 1.2) || ringe[0];
    r.t = jetzt;
    r.stufe = i;
  }

  // Kamera: zoom 0→1 (heranfahren, von unten), explo 0→1 (auseinander, umkreisen), versatzX in px
  function bild(z, explo, jetzt, maus, versatzX = 0, kugelZustand = null) {
    stufenSetzen(explo);
    kaskade.updateMatrixWorld();
    const radius = lerp(16, 6.6, glatt(z)) + explo * 6.2;
    const hoch = lerp(0.32, -0.06, glatt(z)) + explo * 0.34;                // Höhenwinkel (rad): von unten mächtig, dann Draufsicht
    const dreh = explo * 0.62 + Math.sin(jetzt * 0.25) * 0.04 * explo + maus.x * 0.12;
    kamera.position.set(Math.sin(dreh) * radius * Math.cos(hoch), Math.sin(hoch) * radius + maus.y * 0.3, Math.cos(dreh) * radius * Math.cos(hoch));
    const ziel = new THREE.Vector3(0, lerp(1.1, 0.15, glatt(z)) + explo * 0.35, 0);
    kamera.lookAt(ziel);
    if (versatzX) kamera.setViewOffset(breite, hoehe, versatzX, 0, breite, hoehe); else kamera.clearViewOffset();
    kamera.updateProjectionMatrix();

    const t = jetzt;
    mat.wasser.uniforms.uZeit.value = t;
    faelle.forEach(({ fm }) => { fm.uniforms.uZeit.value = t; });

    // Kugel
    if (kugelZustand) {
      kugel.visible = true;
      const a = wasserPunkt(kugelZustand.von);
      const b = wasserPunkt(kugelZustand.nach);
      const k = kugelZustand.k;
      kugel.position.set(lerp(a.x, b.x, k), lerp(a.y, b.y, k * k), lerp(a.z, b.z, k) + Math.sin(k * Math.PI) * 0.25);
    } else kugel.visible = false;

    // Ringe
    ringe.forEach((r) => {
      const alt = t - r.t;
      const an = alt >= 0 && alt < 1.2;
      r.r.material.opacity = an ? (1 - alt / 1.2) * 0.9 : 0;
      if (an) {
        const p = wasserPunkt(r.stufe);
        r.r.position.set(p.x, p.y - 0.06, p.z);
        r.r.scale.setScalar(1 + alt * 5);
      }
    });

    // Gischt an den Füssen der Wasserfälle
    const arr = gischtGeo.attributes.position.array;
    gisch.forEach((g, n) => {
      g.a += 0.008 * g.v;
      if (g.a > 1) { g.a = 0; g.x = Math.random() - 0.5; g.s = Math.floor(Math.random() * 4); }
      const unten = lage[g.s + 1] + stufen[g.s + 1].h * 0.85;
      const zf = TIEFE(g.s) / 2 + TIEFE(g.s) * 0.16 + 0.05;
      arr[n * 3] = g.x * BREITE(g.s) * 0.55 + Math.sin(g.a * 9 + n) * 0.03;
      arr[n * 3 + 1] = unten + Math.sin(g.a * Math.PI) * 0.22;
      arr[n * 3 + 2] = zf + g.a * 0.25;
    });
    gischtGeo.attributes.position.needsUpdate = true;

    renderer.render(szene, kamera);
  }

  return { groesse, bild, plumps, ankerAufBildschirm, stufen: STUFEN };
}
