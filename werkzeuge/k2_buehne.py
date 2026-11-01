# Kapitel II „Die Nachtschicht“, Baustein 1: Bühne aus einzeln gemalten Ebenen (Hero-Methode, 31.10.2026).
# Freistellen (rembg isnet), Fenster der Rückwand ausstanzen, alles im Rahmen 4000 × 2233 platzieren.
# Ausgabe: marke/entwuerfe/hero/bilder/k2b/*.webp + k2b.json; Probebild mit --probe <datei.jpg>
# Aufruf: python -I werkzeuge/k2_buehne.py [--probe pfad.jpg]
import json
import pathlib
import sys
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from rembg import remove, new_session

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

R = pathlib.Path('C:/web agency/signedbymattia/marke/assets/k2')
A = pathlib.Path('C:/web agency/signedbymattia/marke/entwuerfe/hero/bilder/k2b')
A.mkdir(parents=True, exist_ok=True)
W, H = 4000, 2233
ses = new_session('isnet-general-use')

# Lage im Rahmen: (Ebene, Quelle, x, y, Breite) – Breite in Rahmen-Pixeln, Höhe folgt dem Bild
LAGE = [
    ('regal', 'ebenen/e2-regal-v1', 1170, 430, 680),
    ('pult', 'ebenen/e4-pult-v1', 940, 1150, 1980),
    ('stuhl', 'ebenen/e6-stuhl-v1', 2090, 1430, 620),
]


def oeffnen(name):
    png = R / f'{name}.png'
    return Image.open(png if png.exists() else R / f'{name}.jpg').convert('RGB')


def frei(name):
    im = oeffnen(name)
    a = remove(im, session=ses, post_process_mask=True).getchannel('A')
    rgba = im.copy()
    rgba.putalpha(a)
    _boxen[name] = rgba.getbbox()
    return rgba.crop(_boxen[name])


def frei_box(name):
    # Freistell-Rahmen im Original (links, oben, rechts, unten), aus dem letzten frei()
    if name not in _boxen:
        frei(name)
    return _boxen[name]


_boxen = {}


info = {'rahmen': [W, H]}

# Rückwand: Fensterscheiben (flaches Grau) werden durchsichtig, dahinter liegt der Nachthimmel
wand = oeffnen('stiltest/wand-v1').resize((W, H), Image.LANCZOS)
f = np.asarray(wand).astype(np.float32)
grau = np.array([237, 237, 237], np.float32)
d = np.sqrt(((f - grau) ** 2).sum(-1))
alpha = np.clip((d - 6) / 10, 0, 1)
# nur im Fensterbereich ausstanzen (helle Wandstellen bleiben stehen)
ys, xs = np.mgrid[0:H, 0:W]
alpha[~((xs > 2450) & (xs < 3250) & (ys > 200) & (ys < 1800))] = 1
alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2)))
# Die Uhr bleibt in der Wand: Zifferblatt-Mitte (1997, 590), Radius ca. 95 (Zeiger per Code)
wand_rgba = wand.copy()
wand_rgba.putalpha(Image.fromarray(alpha))
fenster = np.argwhere(alpha < 128)
fy0, fx0 = fenster.min(0)
fy1, fx1 = fenster.max(0)
info['fenster'] = {'x': int(fx0), 'y': int(fy0), 'w': int(fx1 - fx0), 'h': int(fy1 - fy0)}
for b in (1600, 2752, W):
    wand_rgba.resize((b, round(H * b / W)), Image.LANCZOS).save(A / f'wand-{b}.webp', quality=84, method=6)

# Nachthimmel: füllt das Fenster grosszügig (bewegt sich mit wenig Tiefe dahinter)
himmel = oeffnen('ebenen/e0-nachthimmel-v1')
# so gross, dass das Fenster auch bei Maus-Tiefe und Kamerafahrt ganz bedeckt bleibt
k = max(1.6 * (fx1 - fx0) / himmel.width, 1.3 * (fy1 - fy0) / himmel.height)
himmel = himmel.resize((round(himmel.width * k), round(himmel.height * k)), Image.LANCZOS)
hx = int((fx0 + fx1) / 2 - himmel.width / 2)
hy = int((fy0 + fy1) / 2 - himmel.height / 2)
himmel.save(A / 'himmel.webp', quality=84, method=6)
info['himmel'] = {'x': hx, 'y': hy, 'w': himmel.width, 'h': himmel.height}

ebenen = {}
for name, quelle, x, y, breite in LAGE:
    im = frei(quelle)
    im = im.resize((breite, round(im.height * breite / im.width)), Image.LANCZOS)
    im.save(A / f'{name}.webp', quality=86, method=6)
    info[name] = {'x': x, 'y': y, 'w': im.width, 'h': im.height}
    ebenen[name] = im

# Vordergrund: ganzer Rahmen, Vorhang und Vase über den grauen Grund freigestellt (rembg verliert den Vorhang)
vq = np.asarray(oeffnen('ebenen/e7-vordergrund-v1').resize((W, H), Image.LANCZOS)).astype(np.float32)
va = np.clip((np.sqrt(((vq - np.median(vq[H // 2 - 50:H // 2 + 50, W // 2 - 50:W // 2 + 50].reshape(-1, 3), 0)) ** 2).sum(-1)) - 12) / 16, 0, 1)
va = np.asarray(Image.fromarray((va * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5)))
voll = Image.fromarray(np.dstack([vq.astype(np.uint8), va]), 'RGBA')
voll.save(A / 'vorne.webp', quality=84, method=6)
info['vorne'] = {'x': 0, 'y': 0, 'w': W, 'h': H}

info['uhr'] = {'x': 1997, 'y': 590, 'r': 95}

# Putti in den Fächern (Regal-Koordinaten 680 × 893: obere Reihe y 200–490, untere y 535–830)
FAECHER = {'o1': (65, 193, 490), 'o3': (347, 472, 490), 'u2': (205, 333, 830), 'u4': (487, 610, 830)}
PUTTI = [('schlaf-o1', 'ebenen/putto-schlaf1-v1', 'o1'), ('schlaf-o3', 'ebenen/putto-schlaf2-v1', 'o3'),
         ('schlaf-u2', 'ebenen/putto-schlaf3-v1', 'u2'), ('schlaf-u4', 'ebenen/putto-schlaf4-v1', 'u4')]
rg = info['regal']
k_regal = rg['w'] / 680
info['putti'] = {}
for name, quelle, fach in PUTTI:
    x0, x1, boden = FAECHER[fach]
    im = frei(quelle)
    breite = round((x1 - x0) * 0.92 * k_regal)
    hoehe = round(im.height * breite / im.width)
    maxh = round(270 * k_regal)
    if hoehe > maxh:
        breite = round(breite * maxh / hoehe)
        hoehe = maxh
    k = breite / im.width  # Massstab Original → Rahmen
    box = oeffnen(quelle).size, frei_box(quelle)
    im = im.resize((breite, hoehe), Image.LANCZOS)
    im.save(A / f'{name}.webp', quality=88, method=6)
    x = rg['x'] + round(((x0 + x1) / 2) * k_regal - breite / 2)
    y = rg['y'] + round((boden - 6) * k_regal) - hoehe
    info['putti'][name] = {'x': x, 'y': y, 'w': breite, 'h': hoehe}
    ebenen[name] = im
    # Station II: die wache Haltung ist eine Gemini-Bearbeitung des schlafenden Bilds. Gemini ändert dabei das
    # Format (1696 × 2528 → 1792 × 2400), die Figur bleibt aber gleich gross im Verhältnis zur Bildhöhe.
    # Darum: Massstab über die Bildhöhe, Füsse auf demselben Fachboden, Mitte über derselben Mitte.
    wach = quelle.replace('schlaf', 'wach')
    if (R / f'{wach}.png').exists() or (R / f'{wach}.jpg').exists():
        (_, gh), _ = box
        wi = frei(wach)
        _, wh = oeffnen(wach).size
        kw = k * gh / wh
        wb, whh = round(wi.width * kw), round(wi.height * kw)
        wi = wi.resize((wb, whh), Image.LANCZOS)
        wi.save(A / f'{name.replace("schlaf", "wach")}.webp', quality=88, method=6)
        info['putti'][name.replace('schlaf', 'wach')] = {'x': x + round(breite / 2 - wb / 2), 'y': y + hoehe - whh, 'w': wb, 'h': whh}
        ebenen[name.replace('schlaf', 'wach')] = wi
    # Station III: der Putto oben links fängt die Büchse (Bearbeitungen von putto-wach1, gleiches Format)
    if name == 'schlaf-o1':
        for teil, quelle_f in (('fang-a', 'ebenen/putto-fang-a-v1'), ('fang-b', 'ebenen/putto-fang-b-v1')):
            if not ((R / f'{quelle_f}.png').exists() or (R / f'{quelle_f}.jpg').exists()):
                continue
            (_, gh), _ = box
            fi = frei(quelle_f)
            fl, fo, _, _ = frei_box(quelle_f)
            _, fh = oeffnen(quelle_f).size
            kf = k * gh / fh
            fb, fhh = round(fi.width * kf), round(fi.height * kf)
            fi = fi.resize((fb, fhh), Image.LANCZOS)
            fi.save(A / f'{teil}-o1.webp', quality=88, method=6)
            fx, fy = x + round(breite / 2 - fb / 2), y + hoehe - fhh
            info['putti'][f'{teil}-o1'] = {'x': fx, 'y': fy, 'w': fb, 'h': fhh}
            ebenen[f'{teil}-o1'] = fi
            if teil == 'fang-b':
                # Hände vor der Brust im Original (1792 × 2400) bei ca. (1093, 1152) [A], nach Augenmass
                info['hand'] = {'x': round(fx + (1093 - fl) * kf), 'y': round(fy + (1152 - fo) * kf)}

# Station II: zwei Putti am Pult links und rechts vom Handy im Goldrahmen (Display x 1860–2002, Fuss y ≈ 1500)
PULT_PUTTI = [('pult-links', 'ebenen/putto-pult-links-v1', 1845, 'rechts'), ('pult-rechts', 'ebenen/putto-pult-rechts-v1', 2017, 'links')]
for name, quelle, kante, seite in PULT_PUTTI:
    if not ((R / f'{quelle}.png').exists() or (R / f'{quelle}.jpg').exists()):
        continue
    im = frei(quelle)
    hoehe = 300
    breite = round(im.width * hoehe / im.height)
    im = im.resize((breite, hoehe), Image.LANCZOS)
    im.save(A / f'{name}.webp', quality=88, method=6)
    x = kante - breite if seite == 'rechts' else kante
    info['putti'][name] = {'x': x, 'y': 1500 - hoehe, 'w': breite, 'h': hoehe}
    ebenen[name] = im

# Station IV (Mattia 01.11.): ein Putto steht von hinten vor dem Handy und tippt die Antwort (Zwei-Bild-Wechsel,
# tippt-b ist eine Bearbeitung von tippt-a). Fingerspitze im Original a bei ca. (1466, 454) [A].
# Gleich gross wie die Pult-Putti (Mattia 01.11.: „zu klein“), Füsse auf der Tischplatte vor dem Rahmen; die Höhe
# des Fingers ergibt sich daraus, die Tastatur im Display richtet sich danach (kapitel2.css .k2-tastatur).
TIPP_HOEHE, TIPP_FUSS, TIPP_X = 290, 1530, 1925
if (R / 'ebenen/putto-tippt-a-v1.png').exists() or (R / 'ebenen/putto-tippt-a-v1.jpg').exists():
    l0, t0, r0, b0 = frei_box('ebenen/putto-tippt-a-v1')
    kt = TIPP_HOEHE / (b0 - t0)
    FINGER = (TIPP_X, round(TIPP_FUSS - TIPP_HOEHE + (454 - t0) * kt))
    for teil in ('tippt-a', 'tippt-b'):
        q = f'ebenen/putto-{teil}-v1'
        if not ((R / f'{q}.png').exists() or (R / f'{q}.jpg').exists()):
            continue
        ti = frei(q)
        l1, t1, _, _ = frei_box(q)
        tb, th = round(ti.width * kt), round(ti.height * kt)
        ti = ti.resize((tb, th), Image.LANCZOS)
        ti.save(A / f'{teil}.webp', quality=88, method=6)
        info['putti'][teil] = {'x': round(FINGER[0] - (1466 - l1) * kt), 'y': round(FINGER[1] - (454 - t1) * kt), 'w': tb, 'h': th}
        ebenen[teil] = ti
    info['finger'] = {'x': FINGER[0], 'y': FINGER[1]}
    # Sprite: beide Haltungen nebeneinander auf gleich grossem Feld (Mattia 01.11.: Flackern beim Umschalten zweier
    # Bilder, Chrome malt das unsichtbare nicht vor). Im Code wird nur der Ausschnitt verschoben.
    if 'tippt-b' in info['putti']:
        pa_, pb_ = info['putti']['tippt-a'], info['putti']['tippt-b']
        x0, y0 = min(pa_['x'], pb_['x']), min(pa_['y'], pb_['y'])
        fw = max(pa_['x'] + pa_['w'], pb_['x'] + pb_['w']) - x0
        fh = max(pa_['y'] + pa_['h'], pb_['y'] + pb_['h']) - y0
        sprite = Image.new('RGBA', (fw * 2, fh))
        sprite.alpha_composite(ebenen['tippt-a'], (pa_['x'] - x0, pa_['y'] - y0))
        sprite.alpha_composite(ebenen['tippt-b'], (fw + pb_['x'] - x0, pb_['y'] - y0))
        sprite.save(A / 'tippt.webp', quality=88, method=6)
        info['tippt'] = {'x': x0, 'y': y0, 'w': fw, 'h': fh}

# Station V (Mattia 01.11.): Kalenderbuch rechts auf dem Pult klappt auf (Sprite zu, halb, offen), ein Putto
# schreibt mit der Feder den Termin hinein. Halb/offen sind Vertex-Bearbeitungen des Pult-Ausschnitts
# BUCH_BOX (Original-Pixel); nur der Bereich ums Buch wird weich überlagert, der Rest bleibt das Pult.
BUCH_BOX = (3200, 250, 5504, 1978)
if (R / 'ebenen/buch-offen-v1.png').exists():
    bx0, by0, bx1, _ = frei_box('ebenen/e4-pult-v1')
    kp = info['pult']['w'] / (bx1 - bx0)
    cw, ch = BUCH_BOX[2] - BUCH_BOX[0], BUCH_BOX[3] - BUCH_BOX[1]
    maske = Image.new('L', (cw, ch), 0)
    ImageDraw.Draw(maske).rounded_rectangle((250, 0, 2050, 1290), 80, fill=255)
    maske = maske.filter(ImageFilter.GaussianBlur(40))
    bilder_ = [oeffnen('ebenen/e4-pult-v1').crop(BUCH_BOX)]
    bilder_ += [oeffnen(f'ebenen/buch-{n}-v1').resize((cw, ch), Image.LANCZOS) for n in ('halb', 'offen')]
    fw, fh = round(cw * kp * 2), round(ch * kp * 2)  # doppelt aufgelöst, die Kamera fährt nah heran
    sprite = Image.new('RGBA', (fw * 3, fh))
    # Tischplatte: Maske des ganzen Pults (rembg sieht im Ausschnitt die Platte teils als Hintergrund);
    # dazu je Bild die eigene Maske für alles, was über die Platte hinausragt (aufgestellter Deckel)
    a_pult = remove(oeffnen('ebenen/e4-pult-v1'), session=ses, post_process_mask=True).getchannel('A').crop(BUCH_BOX)
    for n, bi in enumerate(bilder_):
        # Abstand zum grauen Grund (rembg stanzt Löcher in den hellblauen Deckel)
        f = np.asarray(bi).astype(np.float32)
        grund = np.median(f[:120, -400:].reshape(-1, 3), 0)
        da = np.clip((np.sqrt(((f - grund) ** 2).sum(-1)) - 10) / 14, 0, 1)
        da = Image.fromarray((da * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
        a = ImageChops.lighter(da, a_pult)
        bi = bi.convert('RGBA')
        bi.putalpha(ImageChops.multiply(a, maske))
        sprite.alpha_composite(bi.resize((fw, fh), Image.LANCZOS), (fw * n, 0))
    sprite.save(A / 'buch.webp', quality=88, method=6)
    bx, byy = info['pult']['x'] + (BUCH_BOX[0] - bx0) * kp, info['pult']['y'] + (BUCH_BOX[1] - by0) * kp
    info['buch'] = {'x': round(bx), 'y': round(byy), 'w': round(fw / 2), 'h': round(fh / 2)}
    if '--probe' in sys.argv:
        ebenen['buch-offen'] = sprite.crop((fw * 2, 0, fw * 3, fh)).resize((round(fw / 2), round(fh / 2)), Image.LANCZOS)
    # linke Seite des offenen Buchs (Ausschnitt-Pixel): oben links, oben am Falz, unten links → Rahmen
    rp = lambda p: [round(bx + p[0] * kp), round(byy + p[1] * kp)]
    info['seite'] = {'o': rp((453, 613)), 'r': rp((953, 507)), 'u': rp((800, 1107))}
    # Schreiblinien (Mattia 01.11.: Schrift exakt auf den gemalten Linien): Linien verfolgen (k2_linien.py), Enden
    # abschneiden (dort zittert die Spur), glätten (Polynom 3. Grades) und in Seiten-Koordinaten umrechnen
    from k2_linien import linien_finden
    sei = info['seite']
    o_ = np.array(sei['o'], float)
    ax_ = np.array(sei['r'], float) - o_
    ay_ = np.array(sei['u'], float) - o_
    M_ = np.column_stack([ax_ / np.linalg.norm(ax_), ay_ / np.linalg.norm(ay_)])
    Mi = np.linalg.inv(M_)
    gefunden = linien_finden(oeffnen('ebenen/buch-offen-v1').convert('L').resize((cw, ch), Image.LANCZOS))
    info['zeilen'] = []
    for n in (3, 7):  # Linie für „Do 08:00“ und für „Boiler · Meier“ (vier Linien Abstand)
        pk = np.array(gefunden[n][6:-8], float)
        poly = np.polyfit(pk[:, 0], pk[:, 1], 3)
        xs = np.linspace(pk[0, 0], pk[-1, 0], 40)
        fr = np.column_stack([bx + xs * kp, byy + np.polyval(poly, xs) * kp])
        lok = (Mi @ (fr - o_).T).T
        info['zeilen'].append([[round(x, 1), round(y, 1)] for x, y in lok])
    # schreibender Putto (verworfene Station-IV-Bilder): a schreibt, Federspitze im Original bei (1625, 1220);
    # b schwingt die Feder. Gleich gross wie die Pult-Putti; die Lage folgt im Code der Schrift (Bezug Federspitze).
    if (R / 'ebenen/putto-schreibt-a-v1.png').exists():
        l0, t0, r0, b0 = frei_box('ebenen/putto-schreibt-a-v1')
        ks = 300 / (b0 - t0)
        teile = {}
        for teil in ('schreibt-a', 'schreibt-b'):
            q = f'ebenen/putto-{teil}-v1'
            si = frei(q)
            l1, t1, _, _ = frei_box(q)
            si = si.resize((round(si.width * ks), round(si.height * ks)), Image.LANCZOS)
            teile[teil] = (si, round((l1 - 1625) * ks), round((t1 - 1220) * ks))  # Lage relativ zur Federspitze
        x0 = min(v[1] for v in teile.values())
        y0 = min(v[2] for v in teile.values())
        sw = max(v[1] + v[0].width for v in teile.values()) - x0
        sh = max(v[2] + v[0].height for v in teile.values()) - y0
        sprite = Image.new('RGBA', (sw * 2, sh))
        for n, (si, dx, dy) in enumerate(teile.values()):
            sprite.alpha_composite(si, (sw * n + dx - x0, dy - y0))
        sprite.save(A / 'schreibt.webp', quality=88, method=6)
        info['schreibt'] = {'dx': x0, 'dy': y0, 'w': sw, 'h': sh}  # Ecke oben links relativ zur Federspitze

# Rohrpost-Büchse (gemalt, Mattia 01.11.: echtes Bild statt SVG), Höhe 72 Rahmen-Pixel, Mitte = Bezugspunkt
if (R / 'ebenen/buechse-v1.png').exists() or (R / 'ebenen/buechse-v1.jpg').exists():
    bi = frei('ebenen/buechse-v1')
    bh = 72
    bw = round(bi.width * bh / bi.height)
    bi.resize((bw * 3, bh * 3), Image.LANCZOS).save(A / 'buechse.webp', quality=90, method=6)  # 3fach für Nähe
    info['buechse'] = {'w': bw, 'h': bh}

# Morgen (Mattia 01.11.): Kerze geht aus. Das Pult bekommt im Kerzenbereich die Vertex-Bearbeitung ohne Flamme
# (kerze-aus-v1, Ausschnitt KERZE_BOX des Originals), die brennende Kerze liegt als eigene kleine Ebene darüber
# und wird ausgeblendet. Ausserhalb der weichen Maske sind beide Bilder gleich (pixelgenau).
KERZE_BOX = (822, 250, 1622, 850)
if (R / 'ebenen/kerze-aus-v1.png').exists():
    pg = frei('ebenen/e4-pult-v1')
    bx0, by0, bx1, by1 = frei_box('ebenen/e4-pult-v1')
    kp = info['pult']['w'] / (bx1 - bx0)
    cw, ch = KERZE_BOX[2] - KERZE_BOX[0], KERZE_BOX[3] - KERZE_BOX[1]
    ox, oy = KERZE_BOX[0] - bx0, KERZE_BOX[1] - by0
    maske = Image.new('L', (cw, ch), 0)
    ImageDraw.Draw(maske).ellipse((405 - 80, 300 - 150, 405 + 80, 300 + 105), fill=255)
    m = np.asarray(maske.filter(ImageFilter.GaussianBlur(18))).astype(np.float32) / 255
    aus = np.asarray(oeffnen('ebenen/kerze-aus-v1').resize((cw, ch), Image.LANCZOS)).astype(np.float32)
    grund = np.median(aus[:80, :80].reshape(-1, 3), 0)
    a_aus = np.clip((np.sqrt(((aus - grund) ** 2).sum(-1)) - 6) / 10, 0, 1)
    an = np.asarray(pg.crop((ox, oy, ox + cw, oy + ch))).astype(np.float32)
    # Pult ohne Flamme: im Maskenbereich Farbe und Deckkraft aus der Bearbeitung
    neu = an.copy()
    neu[..., :3] = an[..., :3] * (1 - m[..., None]) + aus * m[..., None]
    neu[..., 3] = an[..., 3] * (1 - m) + a_aus * 255 * m
    pg.paste(Image.fromarray(neu.clip(0, 255).astype(np.uint8), 'RGBA'), (ox, oy))
    pg = pg.resize((info['pult']['w'], info['pult']['h']), Image.LANCZOS)
    pg.save(A / 'pult.webp', quality=86, method=6)
    ebenen['pult'] = pg
    # brennende Kerze: nur der Maskenbereich des Originals, doppelt aufgelöst (Kamera fährt nah)
    flamme = an.copy()
    flamme[..., 3] = an[..., 3] * m
    fl = Image.fromarray(flamme.clip(0, 255).astype(np.uint8), 'RGBA')
    fb_ = fl.getbbox()
    fl = fl.crop(fb_)
    fw, fh = round(fl.width * kp * 2), round(fl.height * kp * 2)
    fl.resize((fw, fh), Image.LANCZOS).save(A / 'kerze.webp', quality=90, method=6)
    info['kerze'] = {'x': round(info['pult']['x'] + (ox + fb_[0]) * kp), 'y': round(info['pult']['y'] + (oy + fb_[1]) * kp),
                     'w': round(fw / 2), 'h': round(fh / 2)}

# Morgenhimmel: Vertex-Bearbeitung des Nachthimmels, gleich gross und gleich gelegt
if (R / 'ebenen/e0-morgenhimmel-v1.png').exists():
    mh = oeffnen('ebenen/e0-morgenhimmel-v1').resize((info['himmel']['w'], info['himmel']['h']), Image.LANCZOS)
    mh.save(A / 'himmel-morgen.webp', quality=84, method=6)

# Morgen: verschlafener Kaffee-Putto ersetzt den rechten Rahmen-Putto (gähnt → hält den Kaffee hin), Sprite wie
# beim Tippen. b ist eine Bearbeitung von a (gleiches Format), darum gleicher Massstab und gleiche Lage.
if (R / 'ebenen/putto-kaffee-b-v1.png').exists():
    l0, t0, r0, b0 = frei_box('ebenen/putto-kaffee-a-v1')
    kk = 300 / (b0 - t0)
    KAFFEE_X, KAFFEE_FUSS = 2025, 1500
    teile = {}
    for teil in ('a', 'b'):
        q = f'ebenen/putto-kaffee-{teil}-v1'
        ki = frei(q)
        l1, t1, _, _ = frei_box(q)
        kb, kh = round(ki.width * kk), round(ki.height * kk)
        teile[teil] = (ki.resize((kb, kh), Image.LANCZOS), round(KAFFEE_X + (l1 - l0) * kk), round(KAFFEE_FUSS - 300 + (t1 - t0) * kk))
    x0 = min(v[1] for v in teile.values())
    y0 = min(v[2] for v in teile.values())
    fw = max(v[1] + v[0].width for v in teile.values()) - x0
    fh = max(v[2] + v[0].height for v in teile.values()) - y0
    sprite = Image.new('RGBA', (fw * 2, fh))
    for n, teil in enumerate(('a', 'b')):
        ki, kx, ky = teile[teil]
        sprite.alpha_composite(ki, (fw * n + kx - x0, ky - y0))
    sprite.save(A / 'kaffee.webp', quality=88, method=6)
    info['kaffee'] = {'x': x0, 'y': y0, 'w': fw, 'h': fh}
    ebenen['kaffee'] = sprite.crop((fw, 0, fw * 2, fh))

json.dump(info, open(A / 'k2b.json', 'w'), indent=1)
print(json.dumps(info))

if '--probe' in sys.argv:
    p = Image.new('RGBA', (W, H))
    p.paste(himmel, (hx, hy))
    p.alpha_composite(wand_rgba)
    p.alpha_composite(ebenen['regal'], (info['regal']['x'], info['regal']['y']))
    for name, i in info['putti'].items():
        p.alpha_composite(ebenen[name], (i['x'], i['y']))
    for name in ('pult', 'stuhl'):
        p.alpha_composite(ebenen[name], (info[name]['x'], info[name]['y']))
        if name == 'pult' and 'buch-offen' in ebenen:
            p.alpha_composite(ebenen['buch-offen'], (info['buch']['x'], info['buch']['y']))
        if name == 'pult' and 'kaffee' in ebenen:
            p.alpha_composite(ebenen['kaffee'], (info['kaffee']['x'], info['kaffee']['y']))
    p.alpha_composite(voll)
    p.convert('RGB').resize((2000, round(2000 * H / W))).save(sys.argv[sys.argv.index('--probe') + 1], quality=88)
