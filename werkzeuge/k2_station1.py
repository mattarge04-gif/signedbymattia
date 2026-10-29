# Kapitel II, Station 1: Automat mit Briefschlitz, Klappe offen als Flicken, Taube (2 Flügelbilder), Brief.
# Originale: marke/assets/erster-wurf/k2-s1-*.jpg. Ausgabe: bilder/k2-s1-*.webp + k2-s1.json
# Aufruf: python -I werkzeuge/k2_station1.py   (braucht: pip install "rembg[cpu]")
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove, new_session

R = 'C:/web agency/signedbymattia/marke/assets/erster-wurf/'
A = 'C:/web agency/signedbymattia/marke/entwuerfe/hero/bilder/'
ses = new_session('isnet-general-use')
info = {}


def frei(datei):
    im = Image.open(R + datei).convert('RGB')
    a = np.asarray(remove(im, session=ses, post_process_mask=True).split()[-1]).astype(np.float32) / 255
    return np.asarray(im), a


def speichern(rgb, alpha, name, rahmen=None, breite=None):
    im = Image.fromarray(np.dstack([rgb, (np.clip(alpha, 0, 1) * 255).astype(np.uint8)]), 'RGBA')
    bb = im.getbbox()
    teil = im.crop(bb)
    if breite and teil.width > breite:
        teil = teil.resize((breite, round(teil.height * breite / teil.width)), Image.LANCZOS)
    teil.save(A + f'k2-s1-{name}.webp', quality=86, method=6)
    info[name] = {'x': bb[0], 'y': bb[1], 'w': bb[2] - bb[0], 'h': bb[3] - bb[1], 'rahmen': rahmen or [im.width, im.height]}
    # Mitte des pinken Siegels (Anteil der Teilgrösse), damit der lose Brief genau dort ansetzt
    f = np.asarray(im.crop(bb)).astype(int)
    pink = (f[..., 0] > 215) & (f[..., 1] < 150) & (f[..., 2] > 140) & (f[..., 3] > 200)
    if pink.sum() > 200:
        ys, xs = np.nonzero(pink)
        info[name]['siegel'] = [round(xs.mean() / f.shape[1], 4), round(ys.mean() / f.shape[0], 4)]


# ---------- Automat (Klappe zu) ganz ----------
rgb, a = frei('k2-s1-automat-v1.jpg')
speichern(rgb, a, 'automat')

# ---------- Klappe offen: nur der Briefschlitz als weich auslaufender Flicken ----------
offen = np.asarray(Image.open(R + 'k2-s1-automat-offen-v1.jpg').convert('RGB'))
x0, y0, x1, y1, rand = 1230, 1160, 1520, 1300, 14
m = Image.new('L', offen.shape[1::-1], 0)
ImageDraw.Draw(m).rectangle([x0 + rand, y0 + rand, x1 - rand, y1 - rand], fill=255)
m = np.asarray(m.filter(ImageFilter.GaussianBlur(rand / 2))).astype(np.float32) / 255
speichern(offen, m, 'klappe-offen')

# ---------- Taube ----------
rgb, a = frei('k2-s1-taube-v1.jpg')
# Im ersten Bild hat Gemini Putto-Beine unter die Taube gemalt (x 330–1070, y 1400–1850):
# Bereich unter dem Bauch löschen, die Taubenfüsse (x 935–1160, y 1460–1550) bleiben.
m = Image.new('L', (a.shape[1], a.shape[0]), 255)
ImageDraw.Draw(m).polygon([(0, 1390), (720, 1390), (800, 1450), (935, 1470), (938, 1560), (1100, 1560),
                           (1100, 2048), (0, 2048)], fill=0)
a = np.minimum(a, np.asarray(m.filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255)
# Zwischen den Taubenfüssen bleibt ein heller Rest der Beine: dort nur das dunklere Rosa der Füsse behalten
fuss = rgb[1480:1566, 935:1100].astype(np.float32).mean(-1)
a[1480:1566, 935:1100] *= np.clip((222 - fuss) / 20, 0, 1)
# rembg lässt unter Brief und Bauch graue Reste stehen: dort zusätzlich nach Abstand zum Grau freistellen
f = rgb.astype(np.float32)
grau = np.median(f[:30, :30].reshape(-1, 3), axis=0)
nah = np.clip((np.sqrt(((f - grau) ** 2).sum(-1)) - 7) / 11, 0, 1)
zone = np.zeros_like(a, bool)
zone[950:1500, 250:950] = True
a[zone] = np.minimum(a[zone], nah[zone])
speichern(rgb, a, 'taube-auf')
rgb, a = frei('k2-s1-taube-ab-v1.jpg')
speichern(rgb, a, 'taube-ab')

# ---------- Taube ohne Brief (S1-6/S1-7), sobald vorhanden ----------
import os
for datei, name in [('k2-s1-taube-leer-v1.jpg', 'taube-leer-auf'), ('k2-s1-taube-leer-ab-v1.jpg', 'taube-leer-ab')]:
    if os.path.exists(R + datei):
        rgb, a = frei(datei)
        speichern(rgb, a, name)

# ---------- Brief: Gemini hat einen Putto dahinter gemalt, nur das Viereck des Umschlags behalten ----------
rgb, a = frei('k2-s1-brief-v1.jpg')
m = Image.new('L', (rgb.shape[1], rgb.shape[0]), 0)
ImageDraw.Draw(m).polygon([(240, 650), (1608, 398), (1790, 1224), (414, 1586)], fill=255)
m = np.asarray(m.filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
speichern(rgb, np.minimum(a, m), 'brief', breite=600)

json.dump(info, open(A + 'k2-s1.json', 'w'), indent=1)
print(json.dumps(info))
