"""Kapitel I · Wisch-Putto (K1-9a/b) freistellen und als WebP ablegen.

Beide Bilder bekommen denselben Ausschnitt (Vereinigung der Boxen), damit der
Zwei-Bild-Wechsel nicht springt. Lauf: python werkzeuge/k1_wischputto.py
"""
import json
from pathlib import Path
from PIL import Image
from rembg import new_session, remove

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / 'marke/assets/erster-wurf'
ZIEL = WURZEL / 'marke/entwuerfe/hero/bilder'

sitzung = new_session('isnet-general-use')
frei = {}
for teil in ('a', 'b'):
    bild = Image.open(QUELLE / f'k1-putto-wischt-{teil}-v1.jpg').convert('RGB')
    frei[teil] = remove(bild, session=sitzung)

boxen = [b.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox() for b in frei.values()]
box = (min(b[0] for b in boxen), min(b[1] for b in boxen), max(b[2] for b in boxen), max(b[3] for b in boxen))
for teil, bild in frei.items():
    stueck = bild.crop(box)
    stueck.save(ZIEL / f'k1-putto-wischt-{teil}.webp', quality=88)
    klein = stueck.resize((600, round(600 * stueck.height / stueck.width)), Image.LANCZOS)
    klein.save(ZIEL / f'k1-putto-wischt-{teil}-600.webp', quality=86)

manifest = ZIEL / 'k1-manifest.json'
daten = json.loads(manifest.read_text(encoding='utf-8'))
daten['k1-putto-wischt'] = {'box': list(box), 'quelle': list(frei['a'].size)}
manifest.write_text(json.dumps(daten, indent=1), encoding='utf-8')
print('Box', box)
