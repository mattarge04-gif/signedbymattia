// Göttliches Licht: weiche Strahlen fallen durch die Kuppelöffnung, folgen langsam der Maus.
// Kleiner WebGL-Shader, Ebene mit mix-blend-mode: screen über der Kuppel, unter den Figuren.
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const hero = document.getElementById('hero');
const canvas = document.getElementById('licht');
const gl = canvas && canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });

const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uZeit; uniform vec2 uQuelle; uniform float uStaerke; uniform float uNeigung;
float hash(float n){ return fract(sin(n) * 43758.5453); }
float rausch(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), f); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 d = uv - uQuelle; d.x *= uRes.x / uRes.y;
  float r = length(d);
  float w = atan(d.x, -d.y) - uNeigung;               // Winkel, 0 = gerade nach unten; Fächer neigt zur Maus
  // Strahlenbündel: mehrere Frequenzen, langsam wandernd und flackernd
  float strahl = rausch(w * 9.0 + uZeit * 0.12) * 0.55 + rausch(w * 23.0 - uZeit * 0.2 + 4.0) * 0.3 + rausch(w * 51.0 + uZeit * 0.35) * 0.15;
  strahl = smoothstep(0.3, 0.85, strahl);
  float kegel = 1.0 - smoothstep(0.0, 1.15, abs(w));        // nur nach unten fächern
  float abfall = exp(-r * 0.75) * smoothstep(0.0, 0.1, r);
  float kern = exp(-r * r * 22.0) * 0.55;             // heller Schein an der Öffnung
  float a = (strahl * kegel * abfall * 1.35 + kern * 1.4) * uStaerke;
  vec3 farbe = mix(vec3(1.0, 0.86, 0.62), vec3(1.0, 0.97, 0.9), kern);
  gl_FragColor = vec4(farbe * a, a);
}`;

if (!RUHIG && gl) {
  const prog = gl.createProgram();
  for (const [typ, q] of [[gl.VERTEX_SHADER, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }'], [gl.FRAGMENT_SHADER, FRAG]]) {
    const sh = gl.createShader(typ);
    gl.shaderSource(sh, q);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn('Licht-Shader:', gl.getShaderInfoLog(sh));
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  for (const n of ['uRes', 'uZeit', 'uQuelle', 'uStaerke', 'uNeigung']) u[n] = gl.getUniformLocation(prog, n);

  const groesse = () => {
    const f = Math.min(0.4, 640 / innerWidth);   // weich, günstig
    canvas.width = Math.round(innerWidth * f);
    canvas.height = Math.round(innerHeight * f);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  addEventListener('resize', groesse);
  groesse();

  // Quelle fest oben in der Mitte der Kuppelöffnung; nur der Strahlenfächer unten neigt sich zur Maus
  const quelle = { x: 0.5, y: 0.96 };
  let neigung = 0;
  let zielNeigung = 0;
  if (MAUS) addEventListener('pointermove', (e) => { zielNeigung = (e.clientX / innerWidth - 0.5) * -0.5; });

  let laeuft = false;
  const bild = (jetzt) => {
    neigung += (zielNeigung - neigung) * 0.03;
    gl.uniform1f(u.uNeigung, neigung);
    const r = hero.getBoundingClientRect();
    const s = klemm(-r.top / (r.height - innerHeight));
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uZeit, jetzt / 1000);
    gl.uniform2f(u.uQuelle, quelle.x, quelle.y);
    gl.uniform1f(u.uStaerke, (0.85 + Math.sin(jetzt / 2300) * 0.15) * (1 - klemm((s - 0.05) / 0.3)));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (laeuft) requestAnimationFrame(bild);
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !laeuft) { laeuft = true; requestAnimationFrame(bild); }
    else if (!e.isIntersecting) laeuft = false;
  }).observe(hero);
}
