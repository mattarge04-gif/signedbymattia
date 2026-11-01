// K1-B5 · Übergang Kapitel I → II: Die Kamera ist ins pinke Handy getaucht (handy.js). Der Bildschirm ist jetzt
// das Display: Hero-Himmel als Hintergrund, die Uhr rast von 10:24 bis 21:47, die Sonne geht unter, es wird Nacht,
// das Display geht aus. Danach zieht die Kamera in Kapitel II aus demselben Handy zurück (kapitel2.js, Auftakt).
// Rein vom Scroll abhängig, rückwärts gleich. Drehbuch: website/drehbuch/10-startseite.md (K1-B5).
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const glatt = (t) => t * t * (3 - 2 * t);
const teil = (v, [a, b]) => klemm((v - a) / (b - a));

// d = Strecke in Bildschirmhöhen, seit die Bühne von Kapitel I losgelassen wird (dann ist das Display voll).
// Bei d = 1 wird Kapitel II festgeheftet (s = 0); Kapitel II hält das Handy voll bis s = 0.04 (36vh).
const EIN = [-0.08, 0];       // Überblendung vom getauchten K1-Handy
const RAFFER = [0, 1.15];     // Zeitraffer
const AUS = [1.15, 1.3];      // Überblendung zur scharfen Handy-Kopie in Kapitel II
const VON = 10 * 60 + 24;
const BIS = 21 * 60 + 47;

const k1 = document.querySelector('#k1Bahn');
if (!RUHIG && k1) {
  const zr = document.createElement('div');
  zr.className = 'zr';
  zr.setAttribute('aria-hidden', 'true');
  zr.innerHTML = '<div class="zr-tag"></div><div class="zr-sonne"></div><div class="zr-abend"></div><div class="zr-nacht"></div>'
    + '<div class="zr-uhr"><p class="zr-zeit">10:24</p><p class="zr-datum">Mittwoch, 12. November</p></div><div class="zr-dunkel"></div>';
  document.body.append(zr);
  const $ = (s) => zr.querySelector(s);
  const [tag, sonne, abend, nacht, uhr, zeit, dunkel] = ['.zr-tag', '.zr-sonne', '.zr-abend', '.zr-nacht', '.zr-uhr', '.zr-zeit', '.zr-dunkel'].map($);

  let d = -1;
  let zuletzt = '';
  function bild() {
    const ziel = (innerHeight - k1.getBoundingClientRect().bottom) / innerHeight;
    d += (ziel - d) * 0.12;   // wie die Kapitel nachziehen, damit die Übergaben zusammenpassen
    if (Math.abs(ziel - d) < 0.0004) d = ziel;
    const sicht = teil(d, EIN) * (1 - teil(d, AUS));
    zr.style.visibility = sicht > 0 ? 'visible' : 'hidden';
    zr.style.opacity = String(sicht);
    if (sicht > 0) {
      const t = teil(d, RAFFER);
      const min = Math.round(VON + (BIS - VON) * glatt(teil(t, [0.04, 0.84])));
      const text = `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
      if (text !== zuletzt) { zeit.textContent = text; zuletzt = text; }
      uhr.style.opacity = String(glatt(teil(t, [0.02, 0.1])));
      // Sonne sinkt durchs Bild, Himmel glüht am Abend, dann Nacht mit Sternen, zuletzt geht das Display aus
      const sinkt = teil(t, [0.1, 0.62]);
      sonne.style.transform = `translate(-50%, ${-30 + 150 * sinkt}vh)`;
      sonne.style.opacity = String(glatt(teil(t, [0.06, 0.16])) * (1 - glatt(teil(t, [0.5, 0.64]))));
      abend.style.opacity = String(glatt(teil(t, [0.22, 0.46])) * (1 - glatt(teil(t, [0.6, 0.78]))));
      tag.style.filter = `brightness(${1 - 0.45 * glatt(teil(t, [0.3, 0.7]))}) saturate(${1 + 0.3 * glatt(teil(t, [0.2, 0.5]))})`;
      nacht.style.opacity = String(glatt(teil(t, [0.5, 0.8])));
      dunkel.style.opacity = String(0.88 * glatt(teil(t, [0.88, 1])));
    }
    requestAnimationFrame(bild);
  }
  requestAnimationFrame(bild);
}
