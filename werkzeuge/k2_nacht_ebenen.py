# Kapitel II „Die Nachtschicht“: Ebenen aus den Stationsbildern schneiden.
# Jede Station ist eine Gemini-Bearbeitung desselben Masters (marke/assets/k2/master-nacht-v7.png).
# Pro Figur ein fester Rahmen; darin zählt nur, was sich gegenüber dem Master geändert hat (weicher Rand),
# die Farbe wird am Rand an den Master angeglichen. Ausgabe im Rahmen 4000 × 2233:
#   marke/entwuerfe/hero/bilder/k2n/*.webp + k2n.json
# Aufruf: python -I werkzeuge/k2_nacht_ebenen.py
import json
import pathlib
import numpy as np
from PIL import Image, ImageFilter

K = pathlib.Path('C:/web agency/signedbymattia/marke/assets/k2')
A = pathlib.Path('C:/web agency/signedbymattia/marke/entwuerfe/hero/bilder/k2n')
A.mkdir(parents=True, exist_ok=True)
QUELLE = 5504
ZIEL = 4000
S = ZIEL / QUELLE

# Ebene: (Name, Stationsbild, Rahmen x0, y0, x1, y1 im Quellbild 5504 × 3072)
EBENEN = [
    ('schlaf-o1', 'e1-schlafen-v1', 2850, 900, 3200, 1350),
    ('schlaf-o3', 'e1-schlafen-v1', 3440, 880, 3850, 1350),
    ('schlaf-u2', 'e1-schlafen-v1', 3160, 1300, 3520, 1670),
    ('schlaf-u4', 'e1-schlafen-v1', 3800, 1320, 4200, 1650),
    ('wach-o1', 'e2-v2', 2860, 810, 3210, 1350),
    ('wach-o3', 'e2-v2', 3430, 800, 3850, 1350),
    ('wach-u2', 'e2-v2', 3160, 1190, 3530, 1690),
    ('wach-u4', 'e2-v2', 3810, 1240, 4250, 1710),
    ('lesen', 'e3-v3', 3260, 1540, 3780, 2160),
    ('sortieren', 'e4-v2', 3130, 800, 3740, 1420),
    ('antworten', 'e5-v2', 2860, 1540, 3760, 2160),
    ('termin', 'e6-v2', 3200, 1560, 4650, 2230),
]

def oeffnen(name):
    # Originale liegen lokal als PNG (nicht im Repo), im Repo als JPG q90
    png = K / f'{name}.png'
    return Image.open(png if png.exists() else K / f'{name}.jpg').convert('RGB')


master = np.asarray(oeffnen('master-nacht-v7')).astype(np.float32)


def weich(maske, r):
    return np.asarray(Image.fromarray((np.clip(maske, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255


def speichern(bild, name, breiten):
    for b in breiten:
        im = bild if b == bild.width else bild.resize((b, round(bild.height * b / bild.width)), Image.LANCZOS)
        im.save(A / f'{name}-{b}.webp', quality=84, method=6)


info = {'rahmen': [ZIEL, round(3072 * S)]}
# Hintergründe in drei Grössen
for name, datei in [('nacht', 'master-nacht-v7'), ('morgen', 'm2-kaffee-v1')]:
    speichern(oeffnen(datei), name, [1600, 2752, ZIEL])

cache = {}
for name, datei, x0, y0, x1, y1 in EBENEN:
    if datei not in cache:
        cache[datei] = np.asarray(oeffnen(datei)).astype(np.float32)
    bild = cache[datei][y0:y1, x0:x1]
    ref = master[y0:y1, x0:x1]
    d = np.abs(bild - ref).sum(-1)
    # was sich deutlich geändert hat, leicht erweitert, mit weichem Rand
    m = np.clip((weich(d / 255, 6) * 255 - 30) / 30, 0, 1)
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(21))).astype(np.float32) / 255
    m = weich(m, 8)
    # Rahmenrand ausblenden, damit keine Kante entsteht
    h, w = m.shape
    rand = 24
    ys, xs = np.mgrid[0:h, 0:w]
    m *= np.clip(np.minimum.reduce([xs, ys, w - 1 - xs, h - 1 - ys]) / rand, 0, 1)
    # Farbe angleichen: mittlere Abweichung dort, wo sich nichts geändert hat
    ruhig = m < 0.05
    if ruhig.sum() > 500:
        bild = bild - (bild[ruhig] - ref[ruhig]).mean(0)
    rgba = np.dstack([np.clip(bild, 0, 255), m * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    bb = im.getchannel('A').point(lambda v: 255 if v > 3 else 0).getbbox()
    im = im.crop(bb)
    px, py = x0 + bb[0], y0 + bb[1]
    im = im.resize((round(im.width * S), round(im.height * S)), Image.LANCZOS)
    im.save(A / f'{name}.webp', quality=86, method=6)
    info[name] = {'x': round(px * S), 'y': round(py * S), 'w': im.width, 'h': im.height}
    print(name, info[name])

json.dump(info, open(A / 'k2n.json', 'w'), indent=1)
