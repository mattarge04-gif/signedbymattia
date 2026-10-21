# Drehbuch 12: Kapitel II Automation · Die Wasserspiele

Stand: 21.10.2026 · Status: **Entwurf [A], zur Abnahme durch Mattia** · Grundlage:
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

Während der Inhaber schläft, arbeitet sein Garten: Eine Anfrage fällt als pinke Kugel durch vier
Becken und kommt als fertiger Termin unten an.

## Figuren und Ebenen (2.5D, von hinten nach vorne)

| Ebene | Inhalt | Bewegung |
|---|---|---|
| E0 Garten | Barockgarten in Pastell: Heckenbögen, Kieswege, ein Pavillon, Himmel mit Wolken. Mitte frei für die Kaskade | steht, leichte Tiefe mit der Maus |
| E1 Kaskade | Treppenkaskade aus Pastell-Marmor mit **4 Becken übereinander**, die Becken voll stillem Wasser, **ohne fallendes Wasser** dazwischen | Explosionsansicht: Becken schweben auseinander |
| E1w Wasser | Shader: Wasserfälle zwischen den Becken, Glitzern, Wellen | läuft immer; die Kugel zieht Ringe |
| E2 Schläfer | **Herr Huber, Inhaber von Himmelblau**, als Barock-Gelehrter im Liegestuhl, pinke Schlafmaske, schläft mit offenem Mund [A] | atmet; Zwei-Bild-Wechsel beim Aufwachen |
| E3 Scherzbrunnen | Kleiner Putto aus Stein auf einem Sockel, spitzt den Mund | spritzt einen Wasserstrahl (Shader) |
| E4 Vordergrund | Unscharfer Heckenrand und Rosen | zieht schneller vorbei (Parallaxe) |

## Ablauf beim Scrollen (Fortschritt s des Kapitels, 0–1)

**Übergang davor:** Kapitel I endet mit „Anfrage gesendet". Ölfarben-Auflösung (M8) in den Garten [A].

1. **Auftakt (s 0–0.15):** Das Kapitelwort „Automation" steigt durchs Bild (M1). Darunter ein Satz
   `[Platzhalter Erzählsatz]`. Im Garten schnarcht Herr Huber, über ihm steigen drei kleine „z" auf.
2. **Kamerafahrt (s 0.15–0.32):** Die Kamera gleitet am Schläfer vorbei auf die Kaskade zu. Die Becken
   plätschern leise (nur Bild, kein Ton).
3. **Explosionsansicht (s 0.32–0.5):** Die 4 Becken schweben auseinander (Becken 1 oben, 4 unten), an
   jedem zeichnet sich eine goldene Linie zu einem Schild:
   1. *Anfrage kommt an*
   2. *wird sortiert*
   3. *Antwort geht raus*
   4. *Termin steht*
4. ⭐ **„Probier es" (s 0.5–0.82):** Neben Becken 1 liegt eine Karte, schon ausgefüllt mit Frau Meiers
   Anfrage aus Kapitel I: *„Boiler tropft in der Küche, Kriens. Morgen möglich?"* Knopf **„Absenden"**.
   - Klick: Die Karte rollt sich zur **pinken Kugel** und fällt in Becken 1. Ringe im Wasser.
   - Becken 1 → 2: Die Kugel fällt mit dem Wasserfall, im Becken erscheint ein Etikett
     **Notfall · Sanitär · Kriens**.
   - Becken 2 → 3: Ein Brief steigt auf: *„Guten Tag Frau Meier, wir kommen morgen um 8 Uhr."*
   - Becken 3 → 4: Ein Kalenderblatt klappt auf: **Do 08:00 · Meier, Kriens · Boiler**.
   - Pointe: Der Scherzbrunnen spritzt Herrn Huber ins Gesicht. Er schreckt hoch (nass, Maske
     verrutscht), schaut auf das Kalenderblatt, nickt zufrieden und schläft weiter.
   - Klickt niemand, läuft das Ganze ab s 0.7 von selbst ab.
   - Hinweis klein darunter: *Beispiel. Es wird nichts gesendet.*
5. **Papier und Grafik (s 0.82–1):** Creme-Papier (M7). Links viele kleine Punkte (Anfragen aus E-Mail,
   Formular, Telefonnotiz), sie ziehen sich über Linien zu **einem** sauberen Eingang zusammen, rechts
   kommen geordnete Antworten heraus. Keine Prozentzahlen. Dazu **Tarot-Karte II „Das Rad"**: ab
   CHF 500, + CHF 400 je weiterer Ablauf, Knopf „Ins Atelier legen".

## Lebt (auch im Stillstand)

- Wasser fällt, glitzert und zieht Ringe.
- Herr Huber atmet, die „z" steigen alle paar Sekunden.
- Ein Schmetterling setzt sich ab und zu auf die Schlafmaske [A].

## Maus und Finger

- Maus: leichte Tiefe der Ebenen wie im Hero; über dem Wasser zieht die Maus feine Ringe.
- Klick auf Herrn Huber: Er dreht sich murrend auf die andere Seite (Zwei-Bild-Wechsel) [A].
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
| 3 | `k2-huber-v1.jpg` | 1:1 | Herr Huber schläft im Liegestuhl, grauer Grund |
| 4 | `k2-huber-wach-v1.jpg` | 1:1 | Bearbeitung von 3: wach, nass, Maske verrutscht |
| 5 | `k2-brunnen-v1.jpg` | 3:4 | Putto-Scherzbrunnen auf Sockel, grauer Grund |
| 6 | `k2-vordergrund-v1.jpg` | 16:9 | Heckenrand und Rosen unten, Rest grau (optional) |

Die genauen Prompts kommen nach der Abnahme dieses Drehbuchs.

## Aufwand [A]

- Mattia: Bilder ca. 45 min, Abnahme ca. 15 min
- Claude: Freistellen und Bau ca. 4 h (Wasser-Shader ca. 1 h davon)

## Offen [?] (Mattia)

1. Ist der Schläfer **Herr Huber von Himmelblau** (roter Faden) oder ein namenloser Gelehrter?
2. Schmetterling und „Huber dreht sich murrend um": drin lassen oder weg?
3. Passt die Beispiel-Anfrage (Boiler tropft, Kriens)?
