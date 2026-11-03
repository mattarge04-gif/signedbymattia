# Drehbuch 12: Kapitel II Automation · Die Nachtschicht

Stand: 03.11.2026 · Status: **Geschichte, Ablauf und Bildverfahren abgenommen [F] (Mattia, 29.10.2026)** ·
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

## Geschichte [F] (Fassung 2, Mattia 31.10.2026)

Grund der Überarbeitung: Kunde verstand nicht, **was Automation konkret tut**, und die **Pointe** sagte nicht
klar „Zeit gewonnen, keinen Kunden verloren“.

- **Das Handy ist der Hauptdarsteller.** Ein pinkes Handy steht aufrecht in einem kleinen goldenen
  Barockrahmen auf dem Pult, frontal (der freche Bruch). Auf dem Display steht gestochen scharf, was die
  Automation tut, in den Worten des Kunden:
  1. *Neue Anfrage · 21:47 · „Boiler tropft in der Küche, Kriens. Morgen möglich?“*
  2. *Eingeordnet: Notfall*
  3. *Antwort gesendet ✓✓ · „Wir kommen morgen um 8 Uhr.“* (Text vorher mit Ihnen festgelegt)
  4. *Termin eingetragen · Do 08:00 · Boiler*
- **Die Putti und die Rohrpost** sind die unsichtbaren Helfer im Hintergrund: Sie arbeiten, das Ergebnis
  jedes Schritts erscheint auf dem Handy.
- **Pointe: Sperrbildschirm am Morgen.** Morgenlicht, die Tür geht auf, das Handy zeigt den Sperrbildschirm
  07:00 mit drei erledigten Meldungen (Antwort ✓, Termin ✓, Offerte ✓). Satz: **„Sie haben geschlafen.
  Ihr Betrieb nicht.“** Ein verschlafener Putto hält den Kaffee hin (Lächeln).
- Danach Papier: „Plan der Rohrpost-Zentrale“ und Tarot-Karte II.

## Tiefenplan [A] (31.10.2026, Abnahme mit dem Stiltest)

| Ebene (hinten → vorne) | Inhalt | Maus-Tiefe | lebt |
|---|---|---|---|
| E0 Nachthimmel | hinter dem Fenster: Sterne, Mondsichel, Wolkenschleier | 4 px | Wolken ziehen, Sterne funkeln |
| E1 Rückwand | Stuck, Fenster als Öffnung, Uhr, Tür | 8 px | Uhrzeiger |
| E2 Regal | Fächer und Messingrohre | 14 px | Rohre glänzen, wo die Büchse fährt |
| E3 Putti im Regal | je Putto eine Ebene | 16 px | atmen, Flügel zucken (Zwei-Bild) |
| E4 Pult | Kerze, Tintenfass, Kalenderbuch, **Handy im Goldrahmen** | 24 px | Flamme, Display |
| E5 Putti am Pult | lesen, schreiben, eintragen | 26 px | Zwei-Bild-Bewegungen |
| E6 Stuhl | mit Zettel „Bin ab 7 Uhr zurück.“ | 34 px | – |
| E7 Vordergrund | Samtvorhang oben links, Vase mit Rosen, unscharf | 50 px | Vorhang weht |
| Licht | WebGL: Nachtblau, Kerzenschein, Mondstrahl mit Staub; am Morgen Sonnenstrahlen | – | Staub tanzt |

Stiltest 31.10.: `marke/assets/k2/stiltest/` (3 Wände, 3 Putti).

## Ablauf beim Scrollen (Fassung 1, wird nach dem Stiltest neu geschrieben)

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

## Bilder: alles aus einem Masterbild (Fassung 1, überholt durch die Hero-Methode)

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

## Prompts Station II „gelesen“ (31.10.2026, Mattia erzeugt in Gemini)

Vorgehen: In Gemini **das genannte Bild anhängen** und den Prompt einfügen. Pro Prompt 2 Varianten,
Mattia wählt. Speichern unter dem genannten Namen in `marke/assets/k2/ebenen/`. Die wachen Putti sind
Bearbeitungen der schlafenden, damit Grösse und Lage beim Zwei-Bild-Wechsel nicht springen. Das Handy
steht rechts unterhalb vom Regal, darum schauen die Putti **nach rechts unten**.

**1 · putto-wach1-v1.png** (anhängen: `putto-schlaf1-v1.png`)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he has just woken
up. He still hugs his knees, but he lifts his head, eyes wide open and curious, looking down to the
right as if something glowing caught his eye. Cheeks rosy, hair slightly messy from sleep. Nothing else
in the image, no shadow on the background, no text.
```

**2 · putto-wach2-v1.png** (anhängen: `putto-schlaf2-v1.png`)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he wakes up with
a big yawn and a stretch, one small fist rubbing an eye, the other arm stretched up, mouth open in a
yawn, one eye already peeking down to the right. Wings slightly spread. Nothing else in the image, no
shadow on the background, no text.
```

**3 · putto-wach3-v1.png** (anhängen: `putto-schlaf3-v1.png`)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he is awake and
sits up, still holding the small pale cushion under one arm, the other hand pointing eagerly down to
the right, eyes bright, a happy surprised little smile. Nothing else in the image, no shadow on the
background, no text.
```

**4 · putto-wach4-v1.png** (anhängen: `putto-schlaf4-v1.png`)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he is awake, his
wings unfold from around his body and open to the sides, he sits upright and alert, eyes open, looking
down to the right with a serious, focused face, like a little clerk ready to work. Nothing else in the
image, no shadow on the background, no text.
```

**5 · putto-pult-links-v1.png** (anhängen: `putto-wach1-v1.png` als Stilbezug)
```
Same putto character, same painting style, palette and light as the attached image: a luminous
Tiepolo-like pastel oil painting, soft, never brown or murky. A single small chubby Baroque putto, full
body, seen from the front, standing and leaning to the right, both small hands reaching to the right at
chest height as if gripping and pulling the left edge of a picture frame towards the viewer. Small
wings, eager face, tongue slightly out in concentration. Hands empty, no frame and no object in the
image. Plain light grey background, no shadow, no text. Portrait format 2:3.
```

**6 · putto-pult-rechts-v1.png** (anhängen: `putto-wach3-v1.png` als Stilbezug)
```
Same putto character, same painting style, palette and light as the attached image: a luminous
Tiepolo-like pastel oil painting, soft, never brown or murky. A single small chubby Baroque putto, full
body, seen from the front, standing and leaning to the left, both small hands reaching to the left at
chest height as if gripping the right edge of a picture frame, while reading something just in front
of him with wide, fascinated eyes. Small wings. Hands empty, no frame and no object in the image. Plain
light grey background, no shadow, no text. Portrait format 2:3.
```

## Station III „sortiert“ [F] (Plan abgenommen, Mattia 01.11.2026)

- Scroll 0.44–0.58. Kamera bleibt oben am Regal, wo die Büchse aus Station II ankommt.
- Büchse fährt im oberen Rohr nach links, Trichter über dem Fach oben links klappt, Büchse fällt hinein.
- Putto oben links (bisher `putto-wach1`) fängt sie: Zwei-Bild-Wechsel `putto-fang-a` (Arme hoch) →
  `putto-fang-b` (hält sie vor der Brust). Hände im Bild leer, die Büchse liegt als SVG darüber.
- Unter allen 8 Fächern Messingschilder in SVG: Dringend · Offerte · Termin · Rückruf · Rechnung · Frage ·
  Später · Werbung. „Dringend“ leuchtet pink, wenn die Büchse ankommt.
- Handy: **„Eingeordnet: Dringend“** (Entscheid Mattia, gleiches Wort wie das Schild), Uhr 21:49.
- Text unten links: III · sortiert · „Tropfender Boiler heisst: dringend. Die Anfrage kommt nach vorne.“ [A]

**7 · putto-fang-a-v1.png** (anhängen: `putto-wach1-v1.png`)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he sits upright,
both small arms stretched up above his head with open, empty hands, ready to catch something falling
from above. He looks straight up with wide, eager eyes and a little open-mouthed smile. Wings slightly
lifted. Hands empty, no object in the image, no shadow on the background, no text.
```

**8 · putto-fang-b-v1.png** (anhängen: `putto-fang-a-v1.png`)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he has just
caught something. Both small hands are pulled in close in front of his chest, cupped together as if
holding a small cylinder upright, and he looks down at his hands with a proud, delighted grin. Wings
relaxed. Hands hold nothing visible, no object in the image, no shadow on the background, no text.
```

## Station IV „beantwortet“ [F] (Plan abgenommen, Mattia 01.11.2026)

- Scroll 0.58–0.72 [A]. Kamera fährt vom Fach „Dringend“ hinunter zum Pult, Schärfe zieht nach vorne.
- **Putto tippt von hinten** (Mattia 01.11., ersetzt „Putto schreibt mit Feder“): Der linke Pult-Putto tritt ab,
  ein Putto steht mit dem Rücken zu uns vor dem Handy und tippt auf der Tastatur im Display (`putto-tippt-a` Finger
  unten ↔ `putto-tippt-b` Finger oben, Wechsel je Buchstabe). Die Antwort entsteht Buchstabe für Buchstabe im
  Entwurf, beim Senden wird die Blase pink, Tastatur fährt weg. Bilder `putto-schreibt-a/b` verworfen.
- **Neue Büchse am Pult** (Entscheid Mattia): Das Papier rollt sich ein, fährt in eine zweite gemalte Büchse
  (`buechse.webp`), die springt ins Messing-Rohrende rechts vom Handy; Licht schiesst das Rohr hinaus.
  Die erste Büchse bleibt beim Fang-Putto im Fach.
- Handy: Chat mit Frau Meier („Boiler tropft. Morgen möglich?“) → getippte Antwort „Wir kommen morgen um 8 Uhr.“ →
  pink, „Gesendet ✓✓ · 21:50“.
- Text unten links: IV · beantwortet · „Die Antwort legen Sie vorher fest. Sie geht sofort raus.“ [A]

**9 · putto-schreibt-a-v1** (verworfen) (Referenz: `putto-pult-links-v1.jpg`, Vertex)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he stands and leans
forward to the right, writing. His right hand holds a long white-lilac feather quill pen, its tip pointing
down to the right at the height of his hips, as if writing on a sheet lying on a table just in front of
him. His left hand rests flat on that invisible sheet. He looks down at his writing with deep
concentration, tongue slightly out. No table, no paper, no other object, no shadow on the background,
no text.
```

**10 · putto-schreibt-b-v1** (verworfen) (Referenz: `putto-schreibt-a-v1`, Vertex)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position
in the frame, same framing and the same plain light grey background. Change only this: he has just
finished writing. He lifts the same white-lilac feather quill high with a proud flourish, his left hand
still resting on the invisible sheet, and smiles contentedly, looking down at what he wrote. No table, no
paper, no other object, no shadow on the background, no text.
```

**11 · putto-tippt-a-v1** (Referenz: `putto-pult-links-v1.jpg`, Vertex)
```
Same putto character, same painting style, palette and light as the attached image: a luminous Tiepolo-like
pastel oil painting, soft, never brown or murky. The same small chubby Baroque putto with blond curls, lilac
wings and the pale blue-lilac drape, but now seen strictly FROM BEHIND: we see the back of his curly head,
his back between the two small lilac wings, the drape around his hips, his bare legs and the soles of his
feet. He stands on tiptoe, slightly turned to the right, and stretches his right arm up and forward,
index finger extended, tapping on a flat vertical surface just in front of him at the height of his raised
hand, like typing on a big phone screen. His left hand rests on his hip. Full body, nothing in front of
him, no screen, no object, plain light grey background, no shadow, no text. Portrait format 3:4.
```

**12 · putto-tippt-b-v1** (Referenz: `putto-tippt-a-v1`, Vertex)
```
Edit the attached painting. Keep exactly the same putto seen from behind, same painting style, same size,
same position in the frame, same framing, same legs and feet, same wings, same drape and the same plain
light grey background. Change only this: his raised right hand is pulled back a little, the index finger
lifted slightly away from the invisible surface between two taps, and his curly head is tilted a little to
the left as if reading what he just typed. Nothing else in the image, no shadow on the background, no text.
```

## Station V „Termin steht“ [F] (gebaut und abgenommen 01.11.2026, Mattia: „passt“)

- Scroll 0.72–0.84 (`ST.termin`, `station5()` in `marke/entwuerfe/hero/kapitel2.js`).
- Entscheide Mattia: **Putto mit Feder** trägt ein (die Feder aus dem Tintenfass kommt endlich zum Einsatz);
  Handy zeigt eine **Mitteilung** (Banner „Kalender · Termin eingetragen · Do 08:00 · Boiler“).
- Ablauf: Kamera nah aufs Kalenderbuch (Handy links im Bild), rechter Pult-Putto tritt ab, Buch klappt auf
  (Sprite zu · halb · offen), Putto schreibt **gespiegelt** (mit links, sonst verdeckt er die Schrift) „Do 08:00“ und
  „Boiler · Meier“ auf die linke Seite, **exakt auf zwei gemalten Linien** (`werkzeuge/k2_linien.py`, SVG `textPath` in der Seiten-Matrix, vom Scroll aufgedeckt, Feder folgt), schwingt die Feder,
  pinker Haken, Banner auf dem Handy, Wanduhr 21:51, Kamera zurück auf die ganze Stube.
- Bilder über Vertex (`werkzeuge/bild.py`, Bearbeitung des Pult-Ausschnitts `ebenen/k5-buch-ausschnitt.jpg`, 4:3, 2K):
  `buch-halb-v1`, `buch-offen-v1`. Schreib-Putto: die verworfenen `putto-schreibt-a/b` aus Station IV.
  `werkzeuge/k2_buehne.py` legt die Bücher nur weich ums Buch über das Pult (Maske Pult + Farbabstand zum Grund,
  rembg stanzt sonst Löcher in den hellblauen Deckel) → `bilder/k2b/buch.webp`, `schreibt.webp`, `k2b.json`
  „buch“, „seite“, „schreibt“.
- [A] Stationssatz V „21:51. Der Termin steht im Kalender. Nachtragen müssen Sie nichts.“ Platzhalter bis Textinterview.

**12 · buch-offen-v1** (Referenz: `k5-buch-ausschnitt.jpg`, Vertex)
```
Edit the attached painting. Keep exactly the same painting style, palette, light, framing, camera angle, the same
marble desk, the same brass cylinder on the left and the same plain light grey background, everything in the same
position. Change only the book: the same leather book with the pale blue and gold cover now lies OPEN, flat on the desk
at the same spot, opened in the middle, spine in the middle, both covers resting on the marble. The two cream-ivory
pages are blank, with only very faint thin ruled lines and a thin lilac silk ribbon bookmark lying across the right
page. The open book stays within the area of the desk top and does not touch the brass cylinder. No writing, no
letters, no numbers, no text anywhere.
```

**13 · buch-halb-v1** (Referenz: `k5-buch-ausschnitt.jpg`, Vertex)
```
Edit the attached painting. Keep exactly the same painting style, palette, light, framing, camera angle, the same
marble desk, the same brass cylinder on the left and the same plain light grey background, everything in the same
position. Change only the book: the same leather book with the pale blue and gold cover is in the middle of being
opened. It still lies at the same spot, the stack of pages lies flat, and the front cover with its pale blue and gold
ornament stands upright, swung open about 90 degrees, so we see its inside lining edge-on and the first cream page is
visible. Same book size. No writing, no letters, no numbers, no text anywhere.
```

## Morgen [F] (Plan und Entscheide Mattia 01.11.2026, Abnahme offen)

- Scroll 0.84–0.99 (`ST.morgen`, `morgen()` in `kapitel2.js`). Entscheide Mattia: Sperrbildschirm zeigt, **was passiert ist**
  (Eingeordnet: Dringend · Antwort gesendet · Termin Do 08:00, keine Offerte); an der Tür **Schatten + Kaffee-Putto**.
- Ablauf: Kerze geht aus (brennende Kerze als eigene Ebene `kerze.webp` über dem Pult ohne Flamme, Rauch in SVG) →
  Wanduhr dreht durch die Nacht bis 07:00, Nachtblau weicht dem Morgenlicht (`.k2-morgen`, Morgenhimmel im Fenster,
  Sterne aus, Staub golden) → Putti schlafen wieder (Schlaf-Bilder, „z“ wieder da, Büchse liegt im Fach) → Kamera
  schwenkt zur Tür: goldener Lichtspalt, Schatten des Inhabers → Kaffee-Putto ersetzt den rechten Rahmen-Putto
  (Sprite `kaffee.webp`: gähnt → hält den Kaffee hin, Dampf) → Kamera nah aufs Handy, Eintauchen in den
  Sperrbildschirm 07:00, „Über Nacht erledigt“, drei Meldungen kommen nacheinander mit Haken → Karte unten links:
  **„Sie haben geschlafen.“ · „Ihr Betrieb nicht.“**
- Bilder über Vertex (`werkzeuge/bild.py`): `e0-morgenhimmel-v1` (Bearbeitung Nachthimmel), `putto-kaffee-a/b-v1`
  (b ist Bearbeitung von a), `kerze-aus-v1` (Bearbeitung des Pult-Ausschnitts `ebenen/k6-kerze-ausschnitt.jpg`,
  Original-Pixel 822/250–1622/850). Einbau in `werkzeuge/k2_buehne.py`. Kein neues Wandbild: Morgen ist Licht im Code.
- [A] Texte „Am Morgen · Die Kerze ist aus, die Helfer schlafen. Erledigt ist alles.“ Platzhalter bis Textinterview.
- [A] Schatten an der Tür wirkt eher wie eine Gestalt im Gegenlicht als wie ein Schlagschatten (kein Boden im Bild).
- [A] Datum auf dem Sperrbildschirm wirkt blass; Karte unten links überlappt die dritte Meldung knapp.

**14 · e0-morgenhimmel-v1** (Referenz: `e0-nachthimmel-v1.jpg`, Vertex, 16:9)
```
Edit the attached painting. Keep exactly the same painting style, framing, cloud shapes and composition. Change only the time of day: it is now early morning just after sunrise. The sky turns from night into a soft luminous dawn: pale peach and warm apricot near the bottom, fading into light rose and clear pale sky blue at the top. Clouds lit warmly from below with golden-pink edges. No stars, no moon. Pastel, bright, airy, never brown or murky. No text, no birds, no buildings.
```

**15 · putto-kaffee-a-v1** (Referenz: `putto-pult-rechts-v1.jpg`, Vertex, 3:4)
```
Same putto character, same painting style, palette and light as the attached image: a luminous Tiepolo-like pastel oil painting. Full figure of the putto STANDING upright, seen from the front, on a plain flat light grey background, whole body visible with some margin, feet at the bottom. He has just woken up after a long night shift: hair tousled, eyes half closed, one small fist rubbing his eye, a big yawn. With the other hand he holds a small white-and-gold Baroque porcelain coffee cup on a saucer close to his tummy. Wings drooping, a little crumpled. Soft morning light from the right. No steam, no shadow on the background, no text, no other objects.
```

**16 · putto-kaffee-b-v1** (Referenz: `putto-kaffee-a-v1`, Vertex, 3:4)
```
Edit the attached painting. Keep exactly the same putto, same painting style, same size, same position in the frame, same framing, same cup and the same plain light grey background. Change only this: he holds the coffee cup on its saucer out towards the viewer with both small hands, arms stretched forward, offering it. Eyes still sleepy but now with a small, warm, slightly crooked smile. Wings drooping. No steam, no shadow on the background, no text.
```

**17 · kerze-aus-v1** (Referenz: `k6-kerze-ausschnitt.jpg`, Vertex, 4:3)
```
Edit the attached painting. Keep exactly the same painting style, palette, framing, camera angle, the same candle, candlestick, table and the same plain light grey background, everything in the same position and size. Change only this: the candle has just been blown out. No flame, no glow. The wick is short, bent and blackened, a tiny dark tip. The wax at the top is slightly melted with a small drip. No smoke, no text.
```

## Papier · Plan der Rohrpost-Zentrale [F] (Vorschläge 01.11.2026, gewählt und gebaut 02.11.2026)

Gebaut [F]: Die Grafik steht beim Scrollen kurz still und füllt den Bildschirm (`.k2-plan-bahn` 190vh, sticky), der
Text darunter kommt erst danach (Commit `f006c0a`). [A] Beim Hereinscrollen steht kurz eine kleine Büchse oben links.

**A · Inhalt (was man versteht)**
1. Frau Meiers Büchse als roter Faden: pinke Büchse „Boiler tropft“ fährt sichtbar durch, mit Uhrzeiten 21:47–21:51.
2. Zentrale in vier beschriftete Schritte: Lesen, Sortieren, Antworten, Eintragen (= Stationen aus Kapitel II).
3. Ausgänge mit echten Beispielen („Antwort: Wir kommen morgen um 8 Uhr“, „Termin: Do 08:00“) statt Schlagworten.
4. Zeitleiste unten: Mond links, Sonne rechts, „Sie schlafen“; ersetzt den Massstab „0–1 Nacht“.
5. [?] Weitere Eingänge (WhatsApp, Google-Profil), nur wenn das Angebot sie wirklich abdeckt.

**B · Stil (Hero-Qualität statt Vektorkasten)**
6. Gemaltes Pergament mit Goldrand als Grund (Vertex), Plan in Tinte darüber.
7. Echter Kupferstich-Plan: Schraffuren, Kompassrose, Titel-Kartusche von zwei Putti gehalten.
8. Zentrale = das gemalte Regal aus der Szene (`regal.webp`), klein, statt des flachen Kastens.
9. Messingrohre mit Glanz, Muffen, Nieten.
10. Beschriftung von Hand wie ein Architektenplan, Legende in einer Kartusche.

**C · Bewegung, während die Grafik steht**
11. Plan zeichnet sich am Scroll Strich für Strich wie mit der Feder (GSAP DrawSVG ist eingebunden).
12. Kamera im Plan: beginnt nah an Frau Meiers Büchse, fährt auf den ganzen Plan hinaus.
13. Rohrpost lebt: Büchsen fahren dauernd, pink hinein, gold heraus.
14. Kleine Putti (vorhandene Sprites) an der Zentrale.
15. Hover auf einen Ausgang zeigt die passende Handy-Mitteilung aus der Szene.

**D · Übergang**
16. Der Sperrbildschirm wird zum Papier: die drei Meldungen fliegen an ihre Ausgänge im Plan.

**Entscheid Mattia 02.11.2026 [F]:** 1 + 2 + 6 + 11 + 13 + 15 + 16. Reihenfolge: Pergament-Stiltest zeigen, dann bauen.

**Gebaut 02.11.2026 [F]:** Flach in sechs Farben, vier echte Ebenen (Blatt, Rohre/Büchsen, Bauten, Fähnchen) als 2.5D:
Einflug gekippt und auseinandergezogen, in Ruhe Maus-Parallaxe mit flachem Schatten (`rohrpost.js`, `kapitel2.css`,
Bahn 260vh). Umgesetzt 1, 2, 11, 13: Scheinwerfer auf Frau Meiers Weg, Zeiger im Massstab „21:47–21:51 · 4 Min.“,
Schriftfeld wie ein Bauplan ([A] Texte von Claude). **6 Pergament verworfen** (Stiltest und gemalter Plan), Mattia:
„eine Grafik bleiben“. **15 und 16 gebaut 03.11.2026 [F]:** 15 Hover auf einen Ausgang zeigt die Handy-Mitteilung (Antwort, Termin aus der
Szene; Offerte, Rückruf, Rechnung [A] Beispieltexte), Tippen auf Touch. 16 Bahn liegt 100vh über dem Ende von Kapitel II,
eine Kopie des Sperrbildschirms übernimmt deckungsgleich, Himmel verblasst zu Papier, Meldungen fliegen im Bogen:
„Eingeordnet“ wird Frau Meiers Büchse am Formular-Eingang, „Antwort“/„Termin“ verschwinden in ihren Ausgängen, Ring
pulsiert, Text erst nach der Fahrt (Entscheide Mattia). Bahn 400vh. Abgenommen
(Mattia: „pushe“).

**Vorschlag Claude [A]:** 1 + 2 + 6 + 11 + 16 (gleiche Geschichte, gemalt, Übergang wie Kapitel I). Aufwand ca. ein
Abend, ca. USD 0.30 Vertex. Danach Tarot-Karte II.


## Tarot-Karte II „Das Rad“ [F] (gebaut und abgenommen 03.11.2026, Mattia: „passt“)

**Auftritt „Rohrpost liefert“** (Entscheid Mattia): Unter dem Plan steht der Inhalt in einer Bahn still
(`.rad-bahn` 230vh, sticky). Ein Messingrohr im Stil des Plans kommt von rechts und endet über der Karte. Am Scroll
(`rad.js`, vor- und rückwärts): 0–0.40 goldene Büchse fährt durchs Rohr · 0.40–0.56 fällt heraus, hüpft · 0.56–0.64
Deckel springt · 0.60–0.90 Karte wächst aus der Büchse, federt, landet um −3° · ab 0.90 Hover hebt, Klick dreht.
Reduzierte Bewegung: Karte liegt da.

**Vorderseite gemalt** (Mattia: „mehr Tarot, mit einem Hauch unserer UI“, „nichts, was keinen Sinn macht“):
hand-kolorierter Kupferstich, Goldrahmen wie unsere Knöpfe, Rundbogen, leeres Rundfeld oben und Band unten; „II“ und
„Das Rad · ab CHF 500“ liegen als Text darauf. Motiv **Mühle**: Wasserrad dreht sich von selbst, Briefe schwimmen
heran, liegen sortiert mit pinker Schleife vor der Tür, Putto schläft mit pinker Schlafmaske.
Original `marke/assets/k2/tarot/rad-g.jpg`, Web `bilder/k2b/tarot-rad.webp`.
Verworfen: a–c gemalt (zu wenig Tarot), d Rider-Waite flach, e/f Rad der Fortuna mit UI-Symbolen (Mattia: „sieht sehr
KI aus“), h Spinnrad. Vertex: 9 Bilder, ca. USD 1.12.

**Rückseite** wie im Atelier (An/Aus) plus **Rad**: ‹ › drehen das Rad um eine Speiche (45°), 1–5 Abläufe, Preis rollt
(CHF 500 + 400 je weiterer). „Ins Atelier legen“ → `atelier-prototyp.html?mit=rad&ablaeufe=n` (Atelier liest
`ablaeufe` jetzt mit).

**Offen:** [?] Rückseite ebenfalls gemalt (Tarot-Rückseite im gleichen Stil). [?] Karten I, III, IV im gleichen Stil
(rad-g als Stil-Vorlage, je ein sinnvolles Motiv). [A] Büchse liegt am Schluss fast ganz unter der Karte.

**Prompts (Vertex, `werkzeuge/bild.py -m pro --format 2:3 --groesse 2K`):**

- e (Stil-Grundlage, ohne Referenz): A single tarot card: baroque copperplate engraving with fine ink line work and cross-hatching, hand-coloured with soft pastel watercolour washes, like an 18th-century hand-tinted print. Composition of the classic tarot trump "Wheel of Fortune", strictly symmetrical and symbolic: a large wheel floats in the centre of a pastel sky with clouds. Instead of letters, the wheel rim carries four small engraved icons: an eye, a stack of trays, a quill, a calendar. On top of the wheel sits a little winged cherub in a pastel-blue robe wearing a pink sleep mask, calm like a sphinx. Down the left side of the wheel spirals a brass pneumatic-post tube, a small gold capsule rising up the right side. In the four corners, on small clouds, four winged cherubs in robes each hold one modern interface object, flat and crisp like a vector icon, in pink #FF9DC8: top left a mouse cursor arrow, top right a smartphone, bottom left a calendar page, bottom right a pink speech bubble with two check marks. A thin pale-gold double border line around the picture, a small EMPTY round cartouche at top centre and an EMPTY plain band along the bottom edge for a title. Absolutely no letters, no numbers, no words anywhere. Palette only pastel: sky blue #CFE3F7, lilac #D9CCF5, peach #FFD6C2, cream #FBF3EA, pale gold #E3C58A, accents pink #FF9DC8, outlines in deep ink #231B3A. Never brown, never dark backgrounds. Portrait card filling the whole image, cream card margin all around.
- f (Bearbeitung von e, Referenz `rad-e.png` + `bilder/knopf-rahmen-rosa.webp`): Edit the first image (a tarot card). Keep the composition, the hand-tinted copperplate engraving style, the wheel made of brass pneumatic-post tubes, the cherub with the pink sleep mask and the four corner cherubs exactly as they are. Make only these subtle changes, just a hint, so it matches our website design:
1. Replace the thin outer border with an ornate pale-gold baroque frame in the style of the second image (soft painted gilded scrollwork), slim and elegant, with rounded corners.
2. The picture area gets a round arch at the top (like a tall arched window), the cream card margin #FBF3EA shows around it.
3. A touch more pink #FF9DC8 as the accent colour: the rising capsule is pink, small pink glints on the gold, otherwise keep the pastel palette (sky blue, lilac, peach, cream, pale gold).
4. Keep the round cartouche at the top and the plain band at the bottom EMPTY. No letters, no numbers, no words anywhere.
- **g (gewählt, Referenz `rad-f.png`):** Use the reference image ONLY for the card design: the same hand-tinted copperplate engraving style, the same ornate pale-gold baroque frame with rounded corners, the round arch at the top of the picture, the empty round cartouche at the top and the empty band at the bottom, cream margin, pastel palette (sky blue, lilac, peach, cream, pale gold) with pink #FF9DC8 as the only accent. Draw a completely NEW, simple scene. Keep it calm and readable like a real tarot trump: one clear idea, few objects, every object has an obvious purpose, nothing floating without reason, no decorative icons, no random symbols, no extra figures. No letters, no numbers, no words anywhere. Scene: a baroque water mill at night under a crescent moon. A big wooden water wheel turns by itself in a little stream. One cherub in a pastel-blue robe sleeps peacefully against the mill wall, a pink sleep mask on its eyes (the only modern object). On the stream, small sealed letters float towards the wheel; on the other side a neat stack of letters tied with a pink ribbon lies ready on the doorstep. Meaning: the wheel does the work while you sleep.
