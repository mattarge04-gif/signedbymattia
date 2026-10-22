# Kapitel II: gemalten Automaten in Teile zerlegen und Vordergrund-Ebenen freistellen.
# Alle Automat-Teile behalten ihre Lage im gemeinsamen Rahmen 2752 × 1536 (Bild k2-automat-teile.jpg),
# damit sie im Browser passgenau übereinander liegen. Ausgabe: bilder/k2-am-*.webp + k2-am.json
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from rembg import remove, new_session

R = 'C:/web agency/signedbymattia/marke/assets/erster-wurf/'
A = 'C:/web agency/signedbymattia/marke/entwuerfe/hero/bilder/'
ses = new_session('isnet-general-use')
W, H = 2752, 1536


def grau_alpha(a, lo=7, hi=18, bg=None):
    if bg is None:
        bg = np.median(a[:30, :30].reshape(-1, 3), axis=0)
    d = np.sqrt(((a - bg) ** 2).sum(-1))
    return np.clip((d - lo) / (hi - lo), 0, 1)


def speichern(rgb, alpha, name, info):
    im = Image.fromarray(np.dstack([rgb, (alpha * 255).astype(np.uint8)]), 'RGBA')
    bb = im.getbbox()
    teil = im.crop(bb)
    teil.save(A + f'k2-am-{name}.webp', quality=86, method=6)
    info[name] = {'x': bb[0], 'y': bb[1], 'w': teil.width, 'h': teil.height}


info = {'rahmen': [W, H]}

# ---------- Teile ----------
t = np.asarray(Image.open(R + 'k2-automat-teile.jpg').convert('RGB'))
ta = grau_alpha(t.astype(np.float32))
ys, xs = np.mgrid[0:H, 0:W]
ZAHN = [(935, 940), (1038, 940), (1142, 940)]
RZ = 60
zahn_maske = np.zeros((H, W), bool)
for n, (cx, cy) in enumerate(ZAHN):
    m = (xs - cx) ** 2 + (ys - cy) ** 2 <= RZ ** 2
    zahn_maske |= m
    speichern(t, ta * m, f'zahnrad{n + 1}', info)
walze = (xs >= 1640) & (xs <= 1890) & (ys >= 855) & (ys <= 1085)
speichern(t, ta * walze, 'walze', info)
rest = ta * ~zahn_maske * ~walze * ((xs >= 1060) & (xs <= 1790))
speichern(t, rest * (ys < 302), 'putto', info)
speichern(t, rest * ((ys >= 302) & (ys < 548)), 'kuppel', info)
speichern(t, rest * ((ys >= 548) & (ys < 1080)), 'pavillon', info)
speichern(t, rest * (ys >= 1080), 'sockel', info)

# ---------- Ganz (zum Überblenden), in denselben Rahmen gelegt ----------
g = Image.open(R + 'k2-automat-ganz.jpg').convert('RGB')
gm = np.asarray(remove(g, session=ses, only_mask=True)).astype(np.float32) / 255
ga = np.minimum(np.clip((gm - 0.55) / 0.35, 0, 1), grau_alpha(np.asarray(g).astype(np.float32), 9, 20))
# Lage angleichen: Unterkante und Mitte des Sockels wie im Teile-Bild
def kasten(a):
    yy, xx = np.where(a > 0.5)
    return xx.min(), yy.min(), xx.max(), yy.max()
tk = kasten(ta)
gk = kasten(ga)
f = (tk[3] - tk[1]) / (gk[3] - gk[1])
gross = Image.fromarray(np.dstack([np.asarray(g), (ga * 255).astype(np.uint8)]), 'RGBA')
gross = gross.resize((round(W * f), round(H * f)), Image.LANCZOS)
leer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
mitte_t = (tk[0] + tk[2]) / 2
# Sockel-Mitte im Teile-Bild (unterer Teil), damit die Säulen genau übereinander liegen
sockel_t = kasten(ta * (ys >= 1080))
mitte_t = (sockel_t[0] + sockel_t[2]) / 2
gs = kasten(ga * (ys >= gk[3] - (gk[3] - gk[1]) * 0.28))
mitte_g = (gs[0] + gs[2]) / 2 * f
leer.alpha_composite(gross, (round(mitte_t - mitte_g), round(tk[3] - gk[3] * f)))
arr = np.asarray(leer)
speichern(arr[..., :3], arr[..., 3] / 255, 'ganz', info)

# ---------- Vordergrund: Heckenbogen links ----------
h = Image.open(R + 'k2-vorne-links.jpg').convert('RGB')
hm = np.asarray(remove(h, session=ses, only_mask=True)).astype(np.float32) / 255
ha = np.clip((hm - 0.3) / 0.5, 0, 1)
hi = Image.fromarray(np.dstack([np.asarray(h), (ha * 255).astype(np.uint8)]), 'RGBA')
hi.crop(hi.getbbox()).save(A + 'k2-hecke-vorne.webp', quality=82, method=6)

# ---------- Vordergrund: Balustrade (unteres Drittel, Grau zwischen den Säulchen weg) ----------
b = np.asarray(Image.open(R + 'k2-vorne-balustrade.jpg').convert('RGB')).astype(np.float32)
ba = grau_alpha(b, 7, 16)
ba[:700] = 0   # oberhalb der Urnen nur Grund
bi = Image.fromarray(np.dstack([b.astype(np.uint8), (ba * 255).astype(np.uint8)]), 'RGBA')
bi = bi.crop(bi.getbbox())
bi.save(A + 'k2-balustrade.webp', quality=82, method=6)

json.dump(info, open(A + 'k2-am.json', 'w'), indent=1)
print(json.dumps(info))
