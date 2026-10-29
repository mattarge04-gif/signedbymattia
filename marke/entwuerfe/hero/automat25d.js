// Kapitel II: der gemalte Automat als 2.5D-Ebenen (Gemini-Bilder, zerlegt mit werkzeuge/k2_ebenen.py).
// Alle Teile liegen im gemeinsamen Rahmen 2752 × 1536 (bilder/k2-am.json) und fahren per transform auseinander.
// Die Zahnräder drehen sich echt, die Walze vibriert, der Putto schwebt; Briefe sind echte HTML-Karten.
// Station 1 (werkzeuge/k2_station1.py, bilder/k2-s1.json): Automat ohne Nebel mit Briefschlitz, eine Taube
// bringt den Brief, die Klappe geht auf, der Brief fällt hinein, die Walze läuft an.
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
  const [info, s1] = await Promise.all(['bilder/k2-am.json', 'bilder/k2-s1.json'].map(async (u) => (await fetch(u)).json()));
  // Das ganze Bild ist jetzt der Automat ohne Nebel mit Briefschlitz (gleicher Rahmen 2752 × 1536)
  info.ganz = s1.automat;
  info['klappe-offen'] = s1['klappe-offen'];
  const buehne = document.createElement('div');
  buehne.className = 'am-rahmen';
  huelle.appendChild(buehne);
  const el = {};
  const leg = (name, datei = `k2-am-${name}`) => {
    const i = info[name];
    const img = new Image();
    img.src = `bilder/${datei}.webp`;
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
  TEILE.forEach((n) => leg(n));
  leg('ganz', 'k2-s1-automat');
  leg('klappe-offen', 'k2-s1-klappe-offen');

  // Walze läuft: wandernde Lichtbänder über der gemalten Walze (Mitte aus dem pinken Bereich)
  const walzeLauf = document.createElement('div');
  walzeLauf.className = 'am-walzelauf';
  const wm = [s1.automat.x + s1.automat.siegel[0] * s1.automat.w, s1.automat.y + s1.automat.siegel[1] * s1.automat.h];
  Object.assign(walzeLauf.style, { left: `${((wm[0] - 108) / RAHMEN[0]) * 100}%`, top: `${((wm[1] - 62) / RAHMEN[1]) * 100}%`, width: `${(216 / RAHMEN[0]) * 100}%`, height: `${(124 / RAHMEN[1]) * 100}%` });
  buehne.appendChild(walzeLauf);

  // Taube (zwei Flügelbilder) und der lose Brief
  const taube = document.createElement('div');
  taube.className = 'am-taube';
  const taubeBild = {};
  for (const n of ['taube-auf', 'taube-ab', 'taube-leer-auf', 'taube-leer-ab'].filter((x) => s1[x])) {
    const img = new Image();
    img.src = `bilder/k2-s1-${n}.webp`;
    img.alt = '';
    img.decoding = 'async';
    img.className = n;
    taube.appendChild(img);
    taubeBild[n] = img;
  }
  const loserBrief = new Image();
  loserBrief.src = 'bilder/k2-s1-brief.webp';
  loserBrief.alt = '';
  loserBrief.className = 'am-loserbrief';
  buehne.append(taube, loserBrief);
  const SCHLITZ = [(s1['klappe-offen'].x + s1['klappe-offen'].w / 2) / RAHMEN[0], (s1['klappe-offen'].y + s1['klappe-offen'].h * 0.42) / RAHMEN[1]];

  // Karten am Automaten (Antwort, Kalender)
  const karte = (klasse, titel, zeile) => {
    const k = document.createElement('div');
    k.className = `am-karte ${klasse}`;
    k.innerHTML = `<b>${titel}</b><span>${zeile}</span>`;
    buehne.appendChild(k);
    return k;
  };
  const antwort = karte('am-antwort', 'Antwort', 'Morgen um 8 Uhr');
  const kalender = karte('am-kalender', 'Do 08:00', 'Meier, Kriens · Boiler');

  let s1Start = null;
  let s1Fertig = 0;
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

    // Station 1: Taube bringt den Brief. Der Anflug folgt dem Scroll (p bis 0.35); ist sie da, läuft das
    // Abwerfen als feste Abfolge von rund 2.5 s (q in Sekunden), damit man es auch bei schnellem Scrollen sieht.
    const p = station === 0 ? st[0] : (station > 0 ? 1 : 0);
    if (p >= 0.35 && s1Start === null) s1Start = station > 0 ? t - 99 : t;
    if (p < 0.2) s1Start = null;
    const q = s1Start === null ? 0 : t - s1Start;
    s1Fertig = klemm((q - 2.2) / 0.6);
    const sx = SCHLITZ[0] * breite;
    const sy = SCHLITZ[1] * hoehe;
    const tw = hoehe * 0.34;
    const flugEin = glatt(klemm(p / 0.35));
    const flugAus = glatt(klemm((q - 1.25) / 0.8));
    const schwebt = flugEin >= 1 && flugAus <= 0;
    const ab = Math.sin(t * (schwebt ? 22 : 30)) > 0;
    // Nach dem Abwerfen ohne Brief im Schnabel, sobald die Bilder S1-6/S1-7 da sind
    const leer = q > 0.55 && taubeBild['taube-leer-auf'];
    const sichtbar = `${leer ? 'taube-leer' : 'taube'}-${ab ? 'ab' : 'auf'}`;
    for (const [n, img] of Object.entries(taubeBild)) img.style.opacity = n === sichtbar ? '1' : '0';
    // Beide Flügelbilder stammen aus demselben Rahmen, das Siegel liegt in beiden gleich: Lage nach taube-auf
    const ti = s1['taube-auf'];
    // Siegel der Taube über dem Schlitz. Die Taube schaut nach links: Anflug von rechts oben im Bogen,
    // Abflug nach links oben über den Gelehrten
    const hx = sx - tw * 0.05;
    const hy = sy - hoehe * 0.1;
    const zx = hx + (1 - flugEin) * hoehe * 1.3 - flugAus * hoehe * 1.5;
    let zy = hy - Math.sin((1 - flugEin) * 1.4) * hoehe * 0.55 - flugAus * flugAus * hoehe * 0.9;
    zy += Math.sin(t * 2.2) * hoehe * 0.008 + glatt(klemm(q / 0.4)) * (1 - glatt(klemm((q - 0.7) / 0.5))) * hoehe * 0.05;
    const taubeDa = p > 0.001 && flugAus < 1;
    taube.style.width = `${tw}px`;
    taube.style.opacity = taubeDa ? '1' : '0';
    taube.style.transform = `translate(${zx - ti.siegel[0] * tw}px, ${zy - ti.siegel[1] * tw * (ti.h / ti.w)}px) rotate(${(1 - flugEin) * -8 + flugAus * 14}deg)`;
    // Brief löst sich beim Schweben und fällt in den Schlitz; bis dahin trägt die Taube ihn
    const fall = glatt(klemm((q - 0.5) / 0.75));
    const briefW = tw * 0.36;
    loserBrief.style.width = `${briefW}px`;
    loserBrief.style.opacity = String(fall > 0 && fall < 1 ? 1 - klemm((fall - 0.75) / 0.25) : 0);
    loserBrief.style.transform = `translate(${sx - briefW * 0.5}px, ${hy + (sy - hy) * fall - briefW * 0.4}px) rotate(${25 * (1 - fall)}deg) scale(${1 - 0.35 * fall}, ${1 - 0.6 * fall * fall})`;
    // Klappe offen, solange der Brief fällt; danach läuft die Walze an
    const klappe = klemm((q - 0.3) / 0.12) * (1 - klemm((q - 1.4) / 0.12));
    el['klappe-offen'].style.opacity = String(klappe * (1 - zerlegt));
    const laeuft = station === 0 ? klemm((q - 1.4) / 0.3) : 0;
    walzeLauf.style.opacity = String(laeuft * (1 - zerlegt));
    walzeLauf.style.backgroundPositionY = `${t * 260}px`;
    if (laeuft > 0) el.ganz.style.transform = `translate(${Math.sin(t * 50) * 0.8 * laeuft}px, ${Math.cos(t * 43) * 0.6 * laeuft}px)`;
    else el.ganz.style.transform = '';

    // Karten
    const zeig = (kk, an, x, y, rot = 0) => {
      kk.style.opacity = String(an);
      kk.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${0.9 + 0.1 * an})`;
    };
    const mx = breite / 2;
    zeig(antwort, station === 2 ? Math.min(1, st[2] * 2.5) : 0, mx + hoehe * 0.12, hoehe * (0.58 - st[2] * 0.42), 4);
    zeig(kalender, station === 3 ? Math.min(1, st[3] * 2.5) : 0, mx + hoehe * 0.14, hoehe * 0.02, -3);
  }

  function ankerAufBildschirm(i, bezug) {
    const name = SCHRITT_TEIL[Math.min(i, 4)];
    const r = el[name === 'ganz' ? 'ganz' : name].getBoundingClientRect();
    return { x: r.left + r.width * 0.75 - bezug.left, y: r.top + r.height * 0.4 - bezug.top };
  }

  // 0 → 1, sobald der Brief drin ist: erst dann darf die Kamera heranfahren
  return { bild, ankerAufBildschirm, s1Fertig: () => s1Fertig };
}
