// Wolkenflug: Übergang Hero → Kapitel I als Volumen-Flug (WebGL, eigener Raymarcher).
// Idee nach volumetrischen Wolkenflügen auf Shadertoy, Code eigen (kein Shadertoy-Code übernommen).
// Ablauf: Wolken kommen über den Hero-Himmel → Flug durch einen Korridor lebender Pastellwolken
// → die Sonne bricht durch und erleuchtet alles → aus dem Licht erscheint Kapitel I.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);

const PARAMETER = {
  start: 0.62,      // Anteil der Hero-Strecke, ab dem die Wolken kommen
  danach: 0.9,      // so viele Bildschirmhöhen nach dem Hero (Kapitel I festgeheftet)
  aufloesung: 0.5,  // Renderauflösung relativ zu CSS-Pixeln (weich, schnell)
  flugweg: 13,      // so weit fliegt die Kamera über die ganze Strecke
};

const hero = document.getElementById('hero');
const flug = document.getElementById('wolkenflug');
const canvas = document.getElementById('wfCanvas');
const gl = canvas && canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
const HANDY = matchMedia('(max-width: 720px)').matches;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uZeit; uniform float uFlug; uniform float uKlar; uniform float uSonne; uniform float uDeck;
#define SCHRITTE ${HANDY ? 34 : 56}

float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float rausch(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
const mat3 DREH = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);
float fbm(vec3 p){
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * rausch(p); p = DREH * p * 2.03; a *= 0.5; }
  return s;
}
vec2 bahn(float z){ return vec2(sin(z * 0.28) * 0.9, cos(z * 0.21) * 0.45); }

// Dichte: lebende Wolkenmasse, Korridor um die Flugbahn bleibt offen
float dichte(vec3 p){
  vec3 q = p + vec3(0.0, 0.0, uZeit * 0.12);
  q += 0.35 * vec3(fbm(q * 0.5 + uZeit * 0.05), fbm(q * 0.5 + 7.3), 0.0);   // Wirbel, damit es lebt
  float d = fbm(q * 0.55);
  float r = length(p.xy - bahn(p.z));
  // Korridor: innen frei, aussen dichte Wolkenwände mit klaren Bäuschen
  d = d * 2.1 - 1.02 + smoothstep(0.55, 1.9, r) * 0.55 - uKlar * 0.7;
  d = smoothstep(0.0, 0.32, d);
  return clamp(d, 0.0, 1.0);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float z = uFlug;
  vec3 ro = vec3(bahn(z), z);
  vec3 ziel = vec3(bahn(z + 1.2), z + 1.2);
  vec3 vw = normalize(ziel - ro);
  vec3 re = normalize(cross(vec3(0.0, 1.0, 0.0), vw));
  vec3 ob = cross(vw, re);
  float rolle = sin(z * 0.3) * 0.08;
  vec3 rd = normalize(vw * 1.3 + (re * cos(rolle) + ob * sin(rolle)) * uv.x + (ob * cos(rolle) - re * sin(rolle)) * uv.y);

  vec3 sonneR = normalize(vec3(-0.25, 0.35, 1.0));
  // Barock-Pastell: Himmel, Schatten Flieder, Licht Pfirsich/Creme
  vec3 himmelO = vec3(0.81, 0.89, 0.97), himmelU = vec3(0.99, 0.95, 0.92);
  vec3 himmel = mix(himmelU, himmelO, clamp(rd.y * 1.6 + 0.45, 0.0, 1.0));
  vec3 flieder = vec3(0.86, 0.80, 0.93), pfirsich = vec3(1.0, 0.80, 0.70), creme = vec3(1.0, 0.97, 0.91);

  vec4 summe = vec4(0.0);
  float t = 0.15 + hash(vec3(gl_FragCoord.xy, uZeit)) * 0.05;
  for (int i = 0; i < SCHRITTE; i++) {
    if (summe.a > 0.97) break;
    vec3 p = ro + rd * t;
    float d = dichte(p);
    if (d > 0.01) {
      // Selbstschatten Richtung Sonne: Kerne Flieder, Ränder Pfirsich/Creme leuchtend
      float licht = clamp(1.0 - dichte(p + sonneR * 0.45) * 1.6, 0.0, 1.0);
      licht = 0.15 + 0.85 * licht;
      vec3 farbe = mix(flieder, pfirsich, smoothstep(0.1, 0.6, licht));
      farbe = mix(farbe, creme, smoothstep(0.65, 1.0, licht));
      farbe += vec3(1.0, 0.88, 0.7) * uSonne * licht * 0.5;
      float a = d * 0.55;
      summe.rgb += farbe * a * (1.0 - summe.a);
      summe.a += a * (1.0 - summe.a);
    }
    t += max(0.06, 0.035 * t);
    if (t > 9.0) break;
  }
  vec3 farbe = himmel * (1.0 - summe.a) + summe.rgb;

  // Sonne: Schein vorne, wächst am Schluss und erleuchtet alles
  float s = max(dot(rd, sonneR), 0.0);
  vec3 gold = vec3(1.0, 0.92, 0.76);
  farbe += gold * (pow(s, 24.0) * 0.9 + pow(s, 4.0) * 0.25) * (0.35 + uSonne * 1.4) * (1.0 - summe.a * 0.55);
  farbe = mix(farbe, vec3(1.0, 0.985, 0.95), uSonne * uSonne * 0.85);
  // feines Korn wie Leinwand
  farbe += (hash(vec3(gl_FragCoord.xy, floor(uZeit * 12.0))) - 0.5) * 0.01;
  gl_FragColor = vec4(farbe * uDeck, uDeck);
}`;

function baue() {
  const prog = gl.createProgram();
  for (const [typ, quelle] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
    const sh = gl.createShader(typ);
    gl.shaderSource(sh, quelle);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const puffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  for (const n of ['uRes', 'uZeit', 'uFlug', 'uKlar', 'uSonne', 'uDeck']) u[n] = gl.getUniformLocation(prog, n);
  return u;
}

function groesse() {
  const f = PARAMETER.aufloesung * Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * f);
  canvas.height = Math.round(innerHeight * f);
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function strecke() {
  const R = hero.offsetHeight - innerHeight;
  const anfang = PARAMETER.start * R;
  const ende = R + PARAMETER.danach * innerHeight;
  return { anfang, ende, wechsel: (R - anfang) / (ende - anfang) };
}

let u = null;
let stand = 0;
let laeuft = false;
function bild(jetzt) {
  const { anfang, ende, wechsel } = strecke();
  const ziel = klemm((scrollY - anfang) / (ende - anfang));
  stand += (ziel - stand) * 0.12;
  if (Math.abs(ziel - stand) < 0.0005) stand = ziel;
  const aktiv = stand > 0.001 && stand < 0.999;
  flug.style.visibility = aktiv ? 'visible' : 'hidden';
  if (aktiv) {
    // Deckkraft: einblenden über dem Hero-Himmel, voll beim Wechsel, am Schluss aus dem Licht ausblenden
    const deck = glatt(klemm(stand / (wechsel * 0.8))) * (1 - glatt(klemm((stand - 0.86) / 0.13)));
    const sonne = glatt(klemm((stand - wechsel - 0.05) / 0.3));
    const klar = glatt(klemm((stand - wechsel - 0.12) / 0.3));
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uZeit, jetzt / 1000);
    gl.uniform1f(u.uFlug, stand * PARAMETER.flugweg + jetzt / 1000 * 0.12);
    gl.uniform1f(u.uKlar, klar);
    gl.uniform1f(u.uSonne, sonne);
    gl.uniform1f(u.uDeck, deck);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  if (laeuft) requestAnimationFrame(bild);
}

if (!RUHIG && gl) {
  try {
    u = baue();
    groesse();
    addEventListener('resize', groesse);
    new IntersectionObserver((e) => {
      const nah = e.some((x) => x.isIntersecting);
      if (nah && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
      else if (!nah) { laeuft = false; flug.style.visibility = 'hidden'; }
    }, { rootMargin: '60% 0px' }).observe(document.getElementById('k1Bahn'));
  } catch (fehler) {
    console.warn('Wolkenflug ohne WebGL:', fehler);
  }
}
