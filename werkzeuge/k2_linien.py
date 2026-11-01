# Kapitel II Station V: gemalte Linien auf der linken Seite des offenen Kalenderbuchs finden (Mattia 01.11.: die
# Schrift soll exakt auf den Linien sitzen). Hochpass (Bild minus Weichzeichnung) macht die Linien zu dunklen
# Graten; von Startpunkten bei x = 700 wird jeder Grat Spalte für Spalte nach links und rechts verfolgt.
# Koordinaten: Buch-Ausschnitt 2304 × 1728 (BUCH_BOX in k2_buehne.py).
import numpy as np
from PIL import ImageFilter


def linien_finden(grau, start_x=700, y_von=600, y_bis=980, schritt=3, min_laenge=200):
    a = np.asarray(grau).astype(np.float32)
    b = np.asarray(grau.filter(ImageFilter.GaussianBlur(8))).astype(np.float32)
    h = a - b  # Linie = negativ
    spalte = h[:, start_x - 2:start_x + 3].mean(1)
    starts = [y for y in range(y_von, y_bis) if spalte[y] < -4 and spalte[y] == spalte[y - 4:y + 5].min()]
    linien = []
    for y0 in starts:
        punkte = {start_x: float(y0)}
        for richtung in (-1, 1):
            x, y = start_x, float(y0)
            fehlt = 0
            while 0 < x + richtung * schritt < a.shape[1] - 1:
                x += richtung * schritt
                yi = int(round(y))
                fenster = h[yi - 3:yi + 4, x - 1:x + 2].mean(1)
                k = int(np.argmin(fenster))
                if fenster[k] > -2.5:
                    fehlt += 1
                    if fehlt > 4:
                        break
                    continue
                fehlt = 0
                y = yi - 3 + k
                punkte[x] = float(y)
        xs = sorted(punkte)
        if xs[-1] - xs[0] >= min_laenge:
            linien.append([(x, punkte[x]) for x in xs])
    return linien

