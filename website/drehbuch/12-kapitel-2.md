# Drehbuch 12: Kapitel II Automation · Die Nachtschicht

Stand: 29.10.2026 · Status: **Geschichte, Ablauf und Bildverfahren abgenommen [F] (Mattia, 29.10.2026)** ·
ersetzt alle früheren Fassungen (Wasserspiele, Brunnen, Automat; in der Git-Geschichte bis Commit `4977d26`).
Grundlage: `00-grammatik.md` (Werte), `03-bildstil.md` (Stil-Bibel), Prüfung `werkzeuge/pruefliste.md`.

## Arbeitsweise nach Hero-Methode [F] (Mattia, 31.10.2026)

Der erste Bau („ein Masterbild, Figuren hineinbearbeitet“, Commit `032e7e5`) erreichte nicht Hero-Qualität:
flach, wenig Leben, kein Wow, KI-Look. Darum gilt ab jetzt dasselbe Vorgehen wie beim Hero:

1. **Tiefenplan** vor den Bildern: Ebenen von hinten nach vorne, je mit Tiefenwert (Maus, Kamera).
2. **Stiltest**: ein Hintergrund und ein Putto im Hero-Malstil; Mattia nimmt ab, bevor die Masse entsteht.
3. **Einzeln gemalte Ebenen** auf grauem Grund (wie Kuppelrand, Amor, Wolken), das Masterbild nur als
   Skizze für Perspektive und Grösse. Mattia wählt jedes Bild aus 2–3 Varianten.
4. **Liste „lebt“ und „Wow“** je Station, so konkret wie im Hero (Zwei-Bild-Bewegungen, Licht, Staub, Effekt).
5. **Baustein für Baustein**, nach jedem ein Video an Mattia. Codex prüft nur Technik (Fehler, Kanten,
   Schärfe, Konsole), Geschmack entscheidet Mattia.

## Kernsatz [F]

**Arbeit läuft, während Sie weg sind.** Gebaut nach dem Prinzip des Heros: eine Welt, ein Blickwinkel,
ein Witz, eine Pointe. Reihenfolge: Geschichte → Ablauf → Bilder → Animationen.

## Geschichte [F]

1. **Abend.** Barocke Schreibstube, frontal aufs Pult, Kerzenlicht. Der Stuhl ist leer, daran ein Zettel
   „Bin ab 7 Uhr zurück“. Wanduhr 21:47. Regal mit Fächern, dazwischen Messingrohre einer Rohrpost.
   In den Fächern schlafen 4 Putti.
2. **Anfrage.** Auf dem Pult leuchtet ein **pinkes Handy** (der freche Bruch): „Boiler tropft in der
   Küche. Morgen möglich?“ Die Putti blinzeln.
3. **Die Kette über die Rohrpost:**
   1. Lesen: Ein Putto hebt das schwere Handy an und liest, die Nachricht fährt als **pinke Büchse**
      mit leuchtendem Schweif durchs Rohr.
   2. Sortieren: Ein Putto fängt die Büchse, Zettel ins Fach „Dringend“, weiter durchs Rohr.
   3. Antworten: Ein Putto schreibt mit der Feder, die Büchse zischt zurück, das Handy zeigt „Wir kommen
      morgen um 8 Uhr.“ Die Antwort geht **sofort** raus [F]; klein: „Text vorher mit Ihnen festgelegt“.
   4. Termin: Ein Putto trägt „Do 08:00 · Boiler“ ins Kalenderbuch ein.
4. **Ruhe.** Putti zurück in die Fächer, Kerze aus.
5. **Pointe.** Morgenlicht, Tür geht auf, Schatten des Meisters, alles erledigt, ein Putto hält ihm
   verschlafen den Kaffee hin. „Erledigt, während Sie weg waren.“ [Platzhalter]
6. **Papier + Grafik.** „Plan der Rohrpost-Zentrale“ (SVG, Umbau des Gartenplans): links E-Mail,
   Formular, Telefon → Zentrale → rechts Antwort, Termin, Offerte, Rückruf, Rechnung; Massstab
   „0–1 Nacht“. Tarot-Karte II „Das Rad“, ab CHF 500, + CHF 400 je weiterer Ablauf.

## Ablauf beim Scrollen [F]

- Bühne sticky, Scroll spult ab und zurück, nie gekapert. **Scrollweg 1000vh**, je Station ca. 140vh (29.10.: Büchsenfahrt war zu kurz).
- **Ein Blickwinkel.** Die Kamera fährt pro Station nah an die Handlung (Nähe bis 1.9) und folgt der
  Büchse durch die Rohre; im Auftakt und am Morgen die ganze Stube. Bilder 4000 px: bei 1440 px Breite
  bleibt bis Nähe 2.2 alles scharf (29.10., nach Prüfung: kleine Handlung war nicht lesbar).
- **Haltungen wechseln** an festen Scrollpunkten mit 0.3 s Überblendung (wie im Hero), nie halb durchsichtig.
- **Wanduhr** läuft mit (21:47 → … → 07:00).
- **Text-Raster:** linkes Drittel ist ruhige Wand. Kapitelwort nur im Auftakt, danach immer unten links
  *Nummer · Titel · ein Satz*, Wechsel mit Tinte-Animation (`00-grammatik.md`). Nichts hängt an Figuren.

| s | Station | Bild | Text unten links |
|---|---|---|---|
| 0–0.10 | Auftakt | Stube im Kerzenlicht, leerer Stuhl, Zettel | **Automation** + Erzählsatz [Platzhalter] |
| 0.10–0.24 | I Anfrage | Handy leuchtet, Putti blinzeln | I · Anfrage kommt an · 21:47 |
| 0.24–0.38 | II Lesen | Putti schleppen Handy, lesen, Büchse ins Rohr | II · gelesen |
| 0.38–0.52 | III Sortieren | Büchse gefangen, Fach „Dringend“ | III · sortiert: dringend |
| 0.52–0.66 | IV Antworten | Feder schreibt, Büchse zurück, Handy zeigt Antwort | IV · beantwortet |
| 0.66–0.78 | V Termin | Eintrag im Kalenderbuch | V · Termin steht |
| 0.78–0.92 | Morgen | Kerze aus, Morgenlicht, Tür, Schatten, Kaffee | Erledigt, während Sie weg waren. |
| 0.92–1 | Papier | Übergang zur Grafik + Tarot-Karte II | – |

- **Lebt:** Kerze flackert, Putti atmen, Handy pulsiert, solange ungelesen.
- **Maus:** Kerzenflamme neigt sich zur Maus; Klick auf schlafenden Putto: dreht sich murrend um.
- **Ruhig** (`prefers-reduced-motion`): Standbild je Station, Überblenden 0.2 s.

## Bilder: alles aus einem Masterbild [F]

Jede Figur entsteht als Bearbeitung **desselben** Masterbilds und wird per Unterschied zum Master
freigestellt (rembg). So stimmen Perspektive, Licht, Massstab und Lage. Erzeugt mit `werkzeuge/bild.py`
(Vertex AI), Originale in `marke/assets/k2/`.

| # | Bild | Verfahren |
|---|---|---|
| 1 | Master Nacht, 4K 16:9 | leere Stube, Stilbezug `amor-v1.jpg`; 3 Varianten, Codex prüft, Mattia wählt |
| 2 | Master Morgen | Bearbeitung von 1, nur Licht + Tür einen Spalt offen |
| 3 | Hinterwand ohne Pult/Stuhl | Bearbeitung von 1, für Tiefe |
| 4–13 | Putti (ca. 10 Haltungen) | Bearbeitungen von 1, Zwei-Bild-Wechsel für kleine Bewegungen |
| 14–16 | Büchse, Uhrzeiger, Kaffeetasse | einzeln freigestellt, per Code bewegt |

Per Code: Kerzenflamme, Handy-Leuchten und Display-Text, Federstrich, Kalendereintrag, Weg der Büchse.
Kosten [A]: ca. 25 Aufrufe × USD 0.24 ≈ USD 6 (Grenze USD 8/Monat).

## Prompts

**Master Nacht** → `marke/assets/k2/master-nacht-vN.png` (16:9, 4K, `amor-v1.jpg` als Stilbezug)
```
Same painting style, palette and light quality as the attached image (soft luminous Tiepolo-like oil
painting, pastel, never brown or murky). A Baroque scholar's study at night, seen strictly frontally and
at eye level, symmetrical, calm, like a stage set. Centre: a carved writing desk (pastel marble and pale
gold) with an inkwell, a quill, wax seals, a large closed calendar book, and a smooth glossy PINK
smartphone (#FF9DC8) lying flat on the desk, rendered crisp and flat like a vector graphic, contrasting
with the oil painting. In front of the desk an EMPTY upholstered chair, a small paper note pinned to its
backrest. Behind the desk: a tall wooden shelf with eight open pigeonhole compartments, connected by
polished brass pneumatic-post tubes that curve along the wall from compartment to compartment and end in
a brass funnel above the desk. Right: a tall window with night sky and stars, and a closed door. Above the
shelf a Baroque wall clock. Warm candlelight from one candle on the desk, cool lilac moonlight from the
window. The LEFT THIRD of the image is a calm, softly lit, almost empty lilac-grey wall (space for text).
No people, no putti, no text, no letters, no watermark. Everything sharp and clearly drawn.
```

Weitere Prompts (Morgen, Hinterwand, Putti, Requisiten) folgen nach der Wahl des Masters.
