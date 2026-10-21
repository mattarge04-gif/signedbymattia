# Drehbuch 12: Kapitel II Automation · Die Wasserspiele

Stand: 21.10.2026 · Status: **Drehbuch abgenommen [F] (Mattia, 21.10.2026), Bilder offen** · Grundlage:
`10-startseite.md` §12, `12-16-naechste-kapitel.md` §12, `00-grammatik.md` (Werte),
`03-bildstil.md` (Stil-Bibel)

## Entscheide [F] (Mattia, 21.10.2026)

- Motiv bleibt: Barockgarten, schlafender Gelehrter, Kaskade, Scherzbrunnen.
- Kaskade **gemalt in 2.5D** (Gemini-Ebenen wie Hero und Kapitel I), Wasser als Shader.
- Himmelblau bleibt vorerst roter Faden. Die Musterseite in Kapitel I sieht Mattia noch nicht gut genug
  aus und will sie überarbeiten [?] (eigener Punkt, nicht Teil dieses Kapitels).

## Die Frage des Kunden

„Welche Arbeit nimmt mir das ab?"

## Die Idee in einem Satz

Während der Gelehrte schläft, arbeitet sein Garten: Eine Anfrage fällt als pinke Kugel durch vier
Becken und kommt als fertiger Termin unten an.

## Figuren und Ebenen (2.5D, von hinten nach vorne)

| Ebene | Inhalt | Bewegung |
|---|---|---|
| E0 Garten | Barockgarten in Pastell: Heckenbögen, Kieswege, ein Pavillon, Himmel mit Wolken. Mitte frei für die Kaskade | steht, leichte Tiefe mit der Maus |
| E1 Kaskade | Treppenkaskade aus Pastell-Marmor mit **4 Becken übereinander**, die Becken voll stillem Wasser, **ohne fallendes Wasser** dazwischen | Explosionsansicht: Becken schweben auseinander |
| E1w Wasser | Shader: Wasserfälle zwischen den Becken, Glitzern, Wellen | läuft immer; die Kugel zieht Ringe |
| E2 Schläfer | **namenloser Barock-Gelehrter** im Liegestuhl, pinke Schlafmaske, schläft mit offenem Mund [F] | atmet; Zwei-Bild-Wechsel beim Aufwachen |
| E3 Scherzbrunnen | Kleiner Putto aus Stein auf einem Sockel, spitzt den Mund | spritzt einen Wasserstrahl (Shader) |
| E4 Vordergrund | Unscharfer Heckenrand und Rosen | zieht schneller vorbei (Parallaxe) |

## Ablauf beim Scrollen (Fortschritt s des Kapitels, 0–1)

**Übergang davor:** Kapitel I endet mit „Anfrage gesendet". Ölfarben-Auflösung (M8) in den Garten [A].

1. **Auftakt (s 0–0.15):** Das Kapitelwort „Automation" steigt durchs Bild (M1). Darunter ein Satz
   `[Platzhalter Erzählsatz]`. Im Garten schnarcht der Gelehrte, über ihm steigen drei kleine „z" auf.
2. **Kamerafahrt (s 0.15–0.32):** Die Kamera gleitet am Schläfer vorbei auf die Kaskade zu. Die Becken
   plätschern leise (nur Bild, kein Ton).
3. **Explosionsansicht (s 0.32–0.5):** Die 5 Becken schweben auseinander (Becken 1 oben, 5 unten), an
   jedem zeichnet sich eine goldene Linie zu einem Schild (Kaskade hat 5 Becken, Bild 21.10.):
   1. *Anfrage kommt an*
   2. *wird sortiert*
   3. *Antwort geht raus*
   4. *Termin steht*
   5. unterstes, grösstes Becken: *Und Sie?* → *haben geschlafen.* (Pointe) [A]
4. ⭐ **„Probier es" (s 0.5–0.82):** Neben Becken 1 liegt eine Karte, schon ausgefüllt mit Frau Meiers
   Anfrage aus Kapitel I: *„Boiler tropft in der Küche, Kriens. Morgen möglich?"* Knopf **„Absenden"**.
   - Klick: Die Karte rollt sich zur **pinken Kugel** und fällt in Becken 1. Ringe im Wasser.
   - Becken 1 → 2: Die Kugel fällt mit dem Wasserfall, im Becken erscheint ein Etikett
     **Notfall · Sanitär · Kriens**.
   - Becken 2 → 3: Ein Brief steigt auf: *„Guten Tag Frau Meier, wir kommen morgen um 8 Uhr."*
   - Becken 3 → 4: Ein Kalenderblatt klappt auf: **Do 08:00 · Meier, Kriens · Boiler**.
   - Becken 4 → 5: Die Kugel landet im grossen Becken und treibt ruhig.
   - Pointe: Der Scherzbrunnen spritzt dem Gelehrten ins Gesicht. Er schreckt hoch (nass, Maske
     verrutscht), schaut auf das Kalenderblatt, nickt zufrieden und schläft weiter.
   - Klickt niemand, läuft das Ganze ab s 0.7 von selbst ab.
   - Hinweis klein darunter: *Beispiel. Es wird nichts gesendet.*
5. **Papier und Grafik (s 0.82–1):** Creme-Papier (M7). Links viele kleine Punkte (Anfragen aus E-Mail,
   Formular, Telefonnotiz), sie ziehen sich über Linien zu **einem** sauberen Eingang zusammen, rechts
   kommen geordnete Antworten heraus. Keine Prozentzahlen. Dazu **Tarot-Karte II „Das Rad"**: ab
   CHF 500, + CHF 400 je weiterer Ablauf, Knopf „Ins Atelier legen".

## Lebt (auch im Stillstand)

- Wasser fällt, glitzert und zieht Ringe.
- Der Gelehrte atmet, die „z" steigen alle paar Sekunden.
- Ein Schmetterling setzt sich ab und zu auf die Schlafmaske [F].

## Maus und Finger

- Maus: leichte Tiefe der Ebenen wie im Hero; über dem Wasser zieht die Maus feine Ringe.
- Klick auf den Gelehrten: Er dreht sich murrend auf die andere Seite (Zwei-Bild-Wechsel) [F].
- Tastatur: „Absenden" ist ein echter Knopf; die Abfolge läuft auch per Enter.

## Ruhige Variante (`prefers-reduced-motion`)

Kein Kameraflug, Becken stehen schon auseinander mit ihren Schildern. „Absenden" zeigt die vier
Ergebnisse direkt nacheinander (Überblenden 0.2 s), ohne Kugelweg und ohne Spritzer.

## Texte [Platzhalter] (Textinterview)

- Erzählsatz unter „Automation"
- Die vier Becken-Schilder (Entwurf oben)
- Beispiel-Anfrage, Antwortbrief, Kalenderblatt (Entwurf oben, Ton nach `marke/stil.md`)
- Satz zur Grafik, Grenzen des Angebots (B9)

## Bilder von Mattia (Gemini, Modell 3.1 Pro)

Alle nach Stil-Bibel `03-bildstil.md`. Figuren auf flachem Grau `#EDEDED`, Licht von oben links.
Ablage `marke/assets/erster-wurf/`.

| # | Datei | Format | Inhalt |
|---|---|---|---|
| 1 | `k2-garten-v1.jpg` | 16:9 | Barockgarten, Mitte frei |
| 2 | `k2-kaskade-v1.jpg` | 3:4 | Kaskade, 4 Becken, kein fallendes Wasser, grauer Grund |
| 3 | `k2-gelehrter-v1.jpg` | 1:1 | Gelehrter schläft im Liegestuhl, grauer Grund |
| 4 | `k2-gelehrter-wach-v1.jpg` | 1:1 | Bearbeitung von 3: wach, nass, Maske verrutscht |
| 5 | `k2-brunnen-v1.jpg` | 3:4 | Putto-Scherzbrunnen auf Sockel, grauer Grund |
| 6 | `k2-gelehrter-dreht-v1.jpg` | 1:1 | Bearbeitung von 3: murrend auf die andere Seite gedreht |
| 7 | `k2-vordergrund-v1.jpg` | 16:9 | Heckenrand und Rosen unten, Rest grau (optional) |

### Prompts (so in Gemini einfügen)

Für alle Bilder als Stilbezug `amor-v1.jpg` anhängen und dazuschreiben: *"Same painting style, palette
and light as the attached image."* Ausnahme: Bearbeitungen (4 und 6) hängen nur ihr Ausgangsbild an.

**1 · Garten** → `k2-garten-v1.jpg` (16:9)
```
A Baroque pleasure garden seen from a slightly elevated viewpoint, painted like an 18th-century Venetian
ceiling fresco in soft luminous oil (Tiepolo light from the top left). Pastel palette only: sky blue
#CFE3F7, lilac #D9CCF5, peach #FFD6C2, cream #FBF3EA, pale gold #E3C58A. Clipped hedge arches, pale
gravel paths, a small round pavilion in the distance, a soft sky with fluffy pastel clouds. The CENTER
of the image is an empty open lawn terrace (space for a fountain to be added later). No people, no
fountain, no water, no text, no frame, no watermark. Never brown, never dark.
```

**2 · Kaskade** → `k2-kaskade-v1.jpg` (3:4)
```
A Baroque garden water cascade carved from pastel marble (cream with lilac and peach veining, pale gold
ornaments), shown frontally: exactly FOUR shallow basins stacked as steps, each basin slightly wider
than the one above, with clear empty gaps between the basins. Each basin is filled with calm still
water, but there is NO falling water between the basins (the waterfalls will be added digitally).
Soft luminous oil painting like a Tiepolo fresco, light from the top left. The whole cascade fully
visible, isolated on a flat plain light-grey background #EDEDED, no shadow on the background, no
plants, no people, no text, no watermark.
```

**3 · Gelehrter schläft** → `k2-gelehrter-v1.jpg` (1:1)
```
A plump Baroque scholar in an 18th-century powdered wig and a lilac silk coat, fast asleep in a modern
striped deckchair (pastel peach and cream stripes), head tilted back, mouth slightly open, a book
sliding off his lap. On his forehead sits a smooth glossy PINK sleep mask (#FF9DC8), rendered crisp and
flat like a vector graphic, contrasting with the oil painting. Cheeky, warm, never grotesque. Soft
luminous oil painting like a Tiepolo fresco, light from the top left. Whole figure and deckchair
visible, isolated on a flat plain light-grey background #EDEDED, no shadow on the background, no text,
no watermark.
```

**4 · Gelehrter wach und nass** → `k2-gelehrter-wach-v1.jpg` (Bild 3 anhängen)
```
Edit the attached image. Keep the same scholar, deckchair, colours, framing, size and position, same
flat light-grey background. Change only: he is startled awake, eyes wide open, face and wig dripping
wet with a few water droplets flying, the pink sleep mask has slipped down over one ear.
```

**5 · Scherzbrunnen** → `k2-brunnen-v1.jpg` (3:4)
```
A small Baroque garden fountain statue: a chubby stone putto made of pale cream marble on a short
ornamented pedestal with pale gold details, cheeks puffed and lips pursed as if about to spit water to
the LEFT side. Mischievous grin. Soft luminous oil painting like a Tiepolo fresco, light from the top
left. No water visible (added digitally). Whole statue visible, isolated on a flat plain light-grey
background #EDEDED, no shadow on the background, no text, no watermark.
```

**6 · Gelehrter dreht sich murrend um** → `k2-gelehrter-dreht-v1.jpg` (Bild 3 anhängen)
```
Edit the attached image. Keep the same scholar, deckchair, colours, framing, size and position, same
flat light-grey background. Change only: still asleep, he has grumpily turned onto his side towards the
right, eyebrows frowning, lips pouting, one hand pulling the pink sleep mask down over his eyes.
```

**7 · Vordergrund (optional)** → `k2-vordergrund-v1.jpg` (16:9)
```
Only the bottom edge of the image: a soft, slightly blurred band of clipped pastel hedges and pale pink
roses, painted like a Tiepolo fresco in soft oil, light from the top left. Everything above the hedge
band is a flat plain light-grey background #EDEDED. No people, no text, no watermark.
```

## Aufwand [A]

- Mattia: Bilder ca. 45 min, Abnahme ca. 15 min
- Claude: Freistellen und Bau ca. 4 h (Wasser-Shader ca. 1 h davon)

## Entscheide [F] (Mattia, 21.10.2026, Nachtrag)

1. Schläfer: **namenloser Gelehrter** (nicht Herr Huber).
2. Schmetterling und „dreht sich murrend um": **drin**.
3. Beispiel-Anfrage „Boiler tropft, Kriens": **passt**.

## Umsetzung v4 [F] (22.10.2026)

- Brunnen als **echtes 3D-Modell**, dreht sich beim Scrollen (Mattia: wie der Shopify POS Hub):
  „Fountain" von jolly.sweets, Sketchfab, **Lizenz CC BY 4.0 → Nennung im Impressum Pflicht**
  (Quelle: https://sketchfab.com/3d-models/fountain-a6b48df60d864880bdc70a8e3d35f797). In Pastell-Marmor
  umgefärbt, in 4 Teile getrennt: `marke/entwuerfe/hero/bilder/k2-brunnen3d.glb`.
- Dadurch 3 Schalen + Bodenbecken statt 5 eckiger Becken; Kugel fällt Schale 1 → 2 → 3 → Becken.
- Gartenplan als Grundriss des gemalten Gartens mit Kartensymbolen, Legende, fliessendem Wasser, Glanz.
- Offen: Hintergrund-Szenen wechseln mit dem Scroll (Garten → Pergola → Abend), 2 Bilder von Mattia.
