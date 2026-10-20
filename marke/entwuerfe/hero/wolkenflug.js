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
  aufloesung: 0.6,  // Renderauflösung relativ zu CSS-Pixeln (weich, schnell)
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
#define SCHRITTE ${HANDY ? 56 : 90}

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

// Grundform: grosse, klar abgegrenzte Wolkenballen (tiefe Frequenzen), langsam quellend
float form(vec3 p){
  vec3 q = p * 0.34 + vec3(uZeit * 0.012, 0.0, uZeit * 0.03);
  return rausch(q) * 0.58 + rausch(q * 2.07 + 3.1) * 0.29 + rausch(q * 4.31 + 7.7) * 0.13;
}
// Quellen: "Blumenkohl"-Detail (Billow-Rauschen), nagt nur an den Rändern
float quellen(vec3 p){
  vec3 q = p * 1.9 + vec3(uZeit * 0.05, -uZeit * 0.03, uZeit * 0.02);
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * (1.0 - abs(rausch(q) * 2.0 - 1.0)); q = DREH * q * 2.11; a *= 0.5; }
  return s / 0.875;
}
// Grobe Dichte (für Schatten und leere Bereiche); Korridor um die Flugbahn bleibt frei
float grob(vec3 p){
  float r = length(p.xy - bahn(p.z));
  // Korridor nur nahe der Kamera (sonst sieht man eine Röhre); weiter vorne fliegt man durch Wolken
  float nah = 1.0 - smoothstep(0.6, 2.2, p.z - uFlug);
  float b = form(p) - (1.0 - smoothstep(0.0, 0.7, r)) * 0.32 * nah - uKlar * 0.5;
  return clamp((b - 0.56) / 0.2, 0.0, 1.0);
}
float dichte(vec3 p, float g){
  float e = (1.0 - quellen(p)) * 0.68;
  return clamp((g - e) / (1.0 - e) * 1.7, 0.0, 1.0);
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
  vec3 flieder = vec3(0.89, 0.84, 0.95), pfirsich = vec3(1.0, 0.80, 0.70), creme = vec3(1.0, 0.97, 0.91);

  vec4 summe = vec4(0.0);
  float vorne = pow(max(dot(rd, sonneR), 0.0), 5.0);   // Silberrand Richtung Sonne
  float t = 0.12 + hash(vec3(gl_FragCoord.xy, uZeit)) * 0.06;
  for (int i = 0; i < SCHRITTE; i++) {
    if (summe.a > 0.97 || t > 10.0) break;
    vec3 p = ro + rd * t;
    float g = grob(p);
    if (g <= 0.0) { t += 0.16 + 0.02 * t; continue; }    // leere Luft schnell überspringen
    float schritt = 0.05 + 0.012 * t;
    float d = dichte(p, g);
    if (d > 0.005) {
      // Licht: drei Schattenproben Richtung Sonne (Beer), Puder-Effekt gibt den Ballen Form
      float sh = grob(p + sonneR * 0.18) + grob(p + sonneR * 0.45) + grob(p + sonneR * 0.95) * 0.8;
      float T = exp(-sh * 1.6);
      float puder = 1.0 - exp(-d * 5.0);
      float licht = T * (0.55 + 0.45 * puder);
      float oben = clamp(0.5 + (p.y - bahn(p.z).y) * 0.5, 0.0, 1.0);   // oben heller, unten Flieder
      vec3 farbe = mix(flieder * (0.86 + 0.14 * oben), pfirsich, smoothstep(0.08, 0.55, licht));
      farbe = mix(farbe, creme, smoothstep(0.45, 0.95, licht));
      farbe += vec3(1.0, 0.9, 0.74) * (vorne * T * 0.55 + uSonne * licht * 0.45);
      farbe = mix(farbe, himmel, smoothstep(2.5, 10.0, t) * 0.55);   // Luftperspektive: Ferne wird Himmel
      farbe = mix(farbe, mix(creme, pfirsich, 0.25), (1.0 - smoothstep(0.1, 1.3, t)) * 0.7);   // mitten in der Wolke: hell, nicht grau
      float a = 1.0 - exp(-d * schritt * 11.0);
      summe.rgb += farbe * a * (1.0 - summe.a);
      summe.a += a * (1.0 - summe.a);
    }
    t += schritt;
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
  // höchstens ~820 px Breite rendern: weich genug für Wolken, schnell genug für Laptops
  const f = Math.min(PARAMETER.aufloesung * Math.min(devicePixelRatio || 1, 2), 820 / innerWidth);
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
