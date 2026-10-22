// Kapitel II: der gemalte Automat als 2.5D-Ebenen (Gemini-Bilder, zerlegt mit werkzeuge/k2_ebenen.py).
// Alle Teile liegen im gemeinsamen Rahmen 2752 × 1536 (bilder/k2-am.json) und fahren per transform auseinander.
// Die Zahnräder drehen sich echt, die Walze vibriert, der Putto schwebt; Briefe sind echte HTML-Karten.
const glatt = (t) => t * t * (3 - 2 * t);
const klemm = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const RAHMEN = [2752, 1536];
// Versatz beim Zerlegen (in Rahmen-Pixeln) und Reihenfolge von hinten nach vorn
const ZERLEGT = {
  sockel: [0, 40], pavillon: [0, -20], kuppel: [0, -110], putto: [0, -190],
  zahnrad1: [-210, 50], zahnrad2: [-130, 80], zahnrad3: [-40, 110], walze: [170, 40],
};
const TEILE = ['sockel', 'pavillon', 'kuppel', 'putto', 'walze', 'zahnrad1', 'zahnrad2', 'zahnrad3'];
// welches Teil gehört zu welchem Schritt (für Faden und Funkeln)
const SCHRITT_TEIL = ['walze', 'zahnrad2', 'walze', 'putto', 'ganz'];

export async function automat25d(huelle) {
  const info = await (await fetch('bilder/k2-am.json')).json();
  const buehne = document.createElement('div');
  buehne.className = 'am-rahmen';
  huelle.appendChild(buehne);
  const el = {};
  const leg = (name) => {
    const i = info[name];
    const img = new Image();
    img.src = `bilder/k2-am-${name}.webp`;
    img.alt = '';
    img.decoding = 'async';
    img.className = `am-teil am-${name}`;
    Object.assign(img.style, {
      left: `${(i.x / RAHMEN[0]) * 100}%`, top: `${(i.y / RAHMEN[1]) * 100}%`,
      width: `${(i.w / RAHMEN[0]) * 100}%`, height: `${(i.h / RAHMEN[1]) * 100}%`,
    });
    buehne.appendChild(img);
    el[name] = img;
  };
  TEILE.forEach(leg);
  leg('ganz');

  // Karten am Automaten (Brief, Antwort, Kalender)
  const karte = (klasse, titel, zeile) => {
    const k = document.createElement('div');
    k.className = `am-karte ${klasse}`;
    k.innerHTML = `<b>${titel}</b><span>${zeile}</span>`;
    buehne.appendChild(k);
    return k;
  };
  const brief = karte('am-brief', 'Anfrage', 'Boiler tropft, Kriens');
  const antwort = karte('am-antwort', 'Antwort', 'Morgen um 8 Uhr');
  const kalender = karte('am-kalender', 'Do 08:00', 'Meier, Kriens · Boiler');

  function bild({ nah, explo, t, maus, versatzX, station, st, auftauchen }) {
    // Grösse und Lage: steht mittig auf dem Rasen, wächst beim Heranfahren
    const h = huelle.clientHeight;
    const hoehe = h * (0.62 + 0.42 * nah) * (1 - 0.2 * explo);
    const breite = hoehe * (RAHMEN[0] / RAHMEN[1]);
    const auf = glatt(klemm(auftauchen));
    buehne.style.width = `${breite}px`;
    buehne.style.height = `${hoehe}px`;
    buehne.style.transform = `translate(calc(-50% - ${versatzX}px + ${maus.x * 10}px), calc(-50% + ${(1 - auf) * 60 + 4 - 6 * explo}vh + ${maus.y * 6}px)) rotate(${maus.x * -0.8}deg)`;
    buehne.style.opacity = String(auf);

    // ganz ↔ Teile überblenden; Teile fahren mit leichter Staffelung auseinander
    const zerlegt = glatt(klemm(explo * 1.4));
    el.ganz.style.opacity = String(1 - zerlegt);
    const k = hoehe / RAHMEN[1];
    TEILE.forEach((name, n) => {
      const [dx, dy] = ZERLEGT[name];
      const e = glatt(klemm((explo - n * 0.03) / 0.85));
      let tr = `translate(${dx * e * k}px, ${dy * e * k}px)`;
      if (name.startsWith('zahnrad')) {
        const tempo = station === 1 ? 2.4 : 0.35;
        tr += ` rotate(${(name === 'zahnrad2' ? -1 : 1) * t * 60 * tempo}deg)`;
      }
      if (name === 'walze' && (station === 0 || station === 2)) tr += ` translate(${Math.sin(t * 50) * 1.4}px, ${Math.cos(t * 43) * 1}px)`;
      if (name === 'putto') tr += ` translateY(${Math.sin(t * 1.6) * 6 * (0.3 + explo)}px) rotate(${station === 3 ? Math.sin(t * 2.4) * 6 : 0}deg)`;
      if (name === 'kuppel') tr += ` translateY(${Math.sin(t * 1.3 + 1) * 4 * explo}px)`;
      el[name].style.transform = tr;
      el[name].style.opacity = String(zerlegt > 0 ? 1 : 0);
      el[name].classList.toggle('glueht', SCHRITT_TEIL[station] === name);
    });
    el.ganz.classList.toggle('glueht', station === 4);

    // Karten
    const zeig = (kk, an, x, y, rot = 0) => {
      kk.style.opacity = String(an);
      kk.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${0.9 + 0.1 * an})`;
    };
    const mx = breite / 2;
    zeig(brief, station === 0 ? Math.min(1, st[0] * 3) * (1 - klemm((st[0] - 0.7) / 0.3)) : 0, mx - 70, hoehe * (0.1 + st[0] * 0.38), -6 + st[0] * 6);
    zeig(antwort, station === 2 ? Math.min(1, st[2] * 2.5) : 0, mx + hoehe * 0.12, hoehe * (0.58 - st[2] * 0.42), 4);
    zeig(kalender, station === 3 ? Math.min(1, st[3] * 2.5) : 0, mx + hoehe * 0.14, hoehe * 0.02, -3);
  }

  function ankerAufBildschirm(i, bezug) {
    const name = SCHRITT_TEIL[Math.min(i, 4)];
    const r = el[name === 'ganz' ? 'ganz' : name].getBoundingClientRect();
    return { x: r.left + r.width * 0.75 - bezug.left, y: r.top + r.height * 0.4 - bezug.top };
  }

  return { bild, ankerAufBildschirm };
}
