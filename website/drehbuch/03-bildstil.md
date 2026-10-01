# Drehbuch 03: Bildstil und Prompts

Stand: 30.09.2026 · Status: **Werkzeug entschieden [F], Stil im Test [A]** · Grundlage:
`marke/DESIGN.md` §1, §2, §6; `marke/tokens.css`; `website/drehbuch/10-startseite.md` (Stil „Barock +
frecher Bruch"); `00-grammatik.md` („Bilder ohne Ladeprobleme")

## Werkzeug [F] (Mattia, 30.09.2026)

- **Google AI Pro** (Gemini-App, Nano Banana Pro, ca. 100 Bilder/Tag, CHF 17/Monat [A]) mit Mattias
  **privatem** Konto: Stil finden und Vorlage-Figuren im Gespräch anpassen.
- **Gemini API** (Nano Banana Pro) für die Masse im Tageslauf, mit den Vorlagen als Bezug.
- Einstellungen in der Gemini-App: **„Media Watermark" aus** (sichtbares Zeichen), Gemini-Aktivitäten
  für Training aus. Das unsichtbare SynthID-Zeichen bleibt (ehrlich, kein Problem).
- **Rechte [A]:** Bilder gehören Mattia, kommerzielle Nutzung erlaubt; rein KI-erzeugte Bilder sind
  meist nicht urheberrechtlich geschützt, keine Exklusivität. Collage, Freistellen und Animation sind
  eigene Gestaltung. Quellen im Chat 30.09.2026 (terms.law, Google Blog, technology.org).

## Stil-Bibel [A] (gilt für jedes Bild, nach dem Stiltest bestätigen)

1. **Malerei:** venezianische Deckenmalerei des 18. Jh. (Tiepolo-Licht), weiche, leuchtende Ölmalerei,
   sichtbarer Pinselduktus auf Figuren.
2. **Palette:** Pastell aus den Tokens: Himmel `#CFE3F7`, Flieder `#D9CCF5`, Pfirsich `#FFD6C2`,
   Creme `#FBF3EA`, Details Pastell-Gold `#E3C58A`. Nie braun, nie dunkel, nie Firnis-Gelb.
3. **Frecher Bruch:** genau **ein moderner Gegenstand pro Figur**, **glatt und scharf wie Vektor**
   (Kontrast zur Malerei), bevorzugt in Pink `#FF9DC8`: Mauszeiger, Kopfhörer, Handy, Bauhelm,
   Schlafmaske, Textmarker.
4. **Ausdruck:** frech, verschmitzt, nie grotesk; der Witz geht gegen die Figur selbst.
5. **Zum Freistellen:** Figur ganz, auf **flachem hellgrauem Grund** `#EDEDED`, kein Schatten auf dem
   Grund, kein Text, kein Rahmen, keine Wasserzeichen.
6. **Einheitlich:** gleiche Lichtrichtung (von oben links), gleiche Pinselstärke; nach dem Stiltest
   dient das beste Bild als **Stil-Vorlage** für alle weiteren (in der App hochladen „im gleichen
   Stil wie dieses Bild", in der API als Referenzbild).

## Test 1: Vorlage-Figur „Amor mit Mauszeiger-Pfeil" (Szene 10, Hero)

Ziel: den Look festlegen, bevor die übrigen ca. 70 Bilder entstehen. 4 Varianten, beste wählen.

**Prompt (Englisch, so in Gemini einfügen):**

```
A baroque cherub (putto) painted in the style of an 18th-century Venetian ceiling fresco by Tiepolo:
soft, luminous oil painting with visible brushwork, airy light from the upper left. Pastel palette only:
powder blue (#CFE3F7), lilac (#D9CCF5), peach (#FFD6C2), cream (#FBF3EA), delicate pale-gold highlights
(#E3C58A); no brown, no dark varnish.
The chubby cherub hovers mid-air with small lilac-white feathered wings and draws a small golden bow,
aiming with one eye squinted and the tip of the tongue out, cheeky and mischievous.
The arrow's tip is a glossy pink computer mouse cursor (#FF9DC8), rendered crisp, clean and modern like
a vector icon, a deliberate contrast to the painterly figure.
Full body visible, isolated on a plain flat light-grey background (#EDEDED), no ground shadow, no text,
no frame, no watermark. Square format, high detail.
```

**Nachschärfen im Gespräch (Beispiele):**
- „Gleiches Bild, aber noch frecher: er zwinkert direkt in die Kamera."
- „Mehr Pastell, weniger Kontrast in den Schatten."
- „Der Mauszeiger soll glänzender und klar pink sein, wie ein App-Icon."
- „Pinselstriche auf der Haut stärker sichtbar."

**Abnahme:** Mattia wählt 1 Bild → wird als `marke/assets/stil-vorlage-amor.png` abgelegt und ist ab dann
Bezug für alle weiteren Figuren.

## Test 2 und 3: Hauptplatten des Hero (E0 Himmel, E1 Kuppelrand)

**Reihenfolge:** zuerst die Amor-Vorlage (Test 1) wählen, dann diese Platten **mit der Vorlage als
angehängtem Bild** erzeugen, damit Malweise und Palette übereinstimmen.

**Einstellungen in der Gemini-App [A: Oberfläche kann abweichen]:**
- Modell **Nano Banana Pro** (in der Werkzeugwahl „Bilder erstellen", Pro-Modell).
- Seitenverhältnis steht im Prompt (**16:9**); die App übernimmt es aus dem Text.
- Nach dem Erzeugen **„Download in voller Grösse"** wählen (höchste Auflösung, Ziel 4K).
- Pro Platte 3–4 Varianten, dann im Gespräch nachschärfen.
- Platten sind **leer**: keine Figuren, keine Putti, keine Engel. Figuren kommen als eigene Ebenen.

### E0 Himmel (hinterste Ebene)

```
Using the attached image only as a reference for painting style and palette:
an empty baroque sky painted as a Venetian ceiling fresco in the manner of Tiepolo, seen from below.
Soft luminous oil painting, visible delicate brushwork, bright and airy, light falling from the upper left.
Gradient from powder blue (#CFE3F7) at the top to soft lilac (#D9CCF5) toward the bottom, with a warm
cream glow (#FBF3EA) in the centre where the light comes from, and faint peach (#FFD6C2) tints on a few
thin, wispy clouds near the edges. The centre stays calm and open for text and figures.
No figures, no angels, no putti, no birds, no architecture, no frame, no text, no watermark.
No brown, no dark areas, no varnish yellow. Wide format 16:9, ultra high resolution, seamless even edges.
```

### E1 Kuppelrand (Scheinarchitektur um die Öffnung)

```
Using the attached image only as a reference for painting style and palette:
a baroque trompe-l'oeil ceiling seen straight from below (di sotto in su): a painted architectural dome
rim with pastel stucco mouldings, soft cream and lilac marble, delicate pale-gold ornaments (#E3C58A),
shell and scroll motifs, a few small painted balustrades, all in the luminous oil-painting style of a
Tiepolo ceiling fresco, light from the upper left.
In the exact centre there is a large oval opening occupying about 60 percent of the image width. The
opening is filled with a flat, uniform, pure chroma green (#00FF00), completely even, with no texture,
no gradient, no sky and no clouds, so it can be cut out precisely. The inner edge of the rim is clean.
Pastel palette only: powder blue (#CFE3F7), lilac (#D9CCF5), peach (#FFD6C2), cream (#FBF3EA),
pale gold. No figures, no angels, no putti, no statues of people, no text, no watermark, no brown,
no dark shadows. Wide format 16:9, ultra high resolution, symmetric composition.
```

**Nachschärfen (Beispiele):** „Die grüne Öffnung muss ganz flach und einfarbig sein." · „Weniger Gold,
mehr Flieder im Stuck." · „Heller, pastelliger, keine dunklen Schatten in den Profilen." · „Öffnung
etwas grösser, Rand schmaler."

**Abnahme:** Mattia wählt je 1 Bild; Ablage als Original in `marke/assets/hero/` (Archiv, 4K). Der
Tageslauf stellt die grüne Öffnung frei, färbt fein nach und erzeugt die Web-Fassungen
(`00-grammatik.md`, „Bilder ohne Ladeprobleme").

## Später zu erstellen [F] (Mattia, 01.10.2026)

- **Wolkenband als Übergang** (ersetzt das gerissene Papier, `01-bausteine.md` B4): breite, dicke, weiche
  Barockwolken in Pastell als waagrechte Kante, oben und unten sauber auslaufend, zum Freistellen auf
  flachem Grund; in der Breite nahtlos wiederholbar.
- **Goldener Barockrahmen** (Variante 2 des Übergangs): Rahmen in Pastell-Gold `#E3C58A`, Ecken und
  Kanten einzeln nutzbar (für verschiedene Abschnittsgrössen), Inneres flach grün zum Ausschneiden.


## Kapitel I Website (Szene 11): Prompts [A] (02.10.2026)

Für alle: Modell „3.1 Pro“, als Stil-Vorlagen `erster-wurf/amor-ohne-pfeil-v1.jpg` und
`erster-wurf/kuppel-v1.jpg` anhängen. Speichern in `marke/assets/erster-wurf/` mit den genannten Namen.

**K1-1 Palastwand mit Torbogen** (16:9) → `k1-wand-v1.jpg`
```
Using the attached images as a reference for painting style, brushwork and pastel palette:
a baroque palace wall painted as a trompe-l'oeil fresco in the luminous style of a Tiepolo, seen straight on.
Pastel stucco pilasters, cream and lilac marble panels, delicate pale-gold ornaments (#E3C58A), shell and
scroll motifs, light from the upper left. In the centre a grand painted archway; inside the arch, a large
upright rectangular area (about 45 percent of the image width, 70 percent of its height) filled with a flat,
uniform pure chroma green (#00FF00), completely even, no texture, so it can be cut out precisely. Clean
edges around the green area. Pastel palette only: powder blue (#CFE3F7), lilac (#D9CCF5), peach (#FFD6C2),
cream (#FBF3EA), pale gold. No figures, no text, no watermark, no brown, no dark shadows. 16:9, high detail.
```

**K1-2 Baugerüst** (3:4) → `k1-geruest-v1.jpg`
```
Using the attached images as a reference for painting style and pastel palette:
a charming wooden painter's scaffolding painted in baroque oil-painting style with visible brushstrokes:
two levels of pale wooden planks, ladders, ropes, a few small pastel paint pots, a cream drop cloth hanging
over the edge. Light, airy, pastel colours, no brown-heavy tones (pale honey wood). Full object visible,
isolated on a plain flat light-grey background (#EDEDED), no ground shadow, no figures, no text. 3:4.
```

**K1-3 Putto mit Bauhelm und Farbroller** (1:1) → `k1-putto-roller-v1.jpg`
```
Using the attached images as a reference for painting style, brushwork and pastel palette:
a chubby baroque putto with small lilac-white wings, painted like a Tiepolo ceiling fresco, light from the
upper left. He wears a glossy pink construction hard hat (#FF9DC8), rendered crisp and modern like a product
render, slightly too big for his head. Concentrated and proud, tongue tip out, he pushes a paint roller on a
long handle, the roller dripping with pastel lilac paint. Light powder-blue drape. Full body, isolated on a
plain flat light-grey background (#EDEDED), no ground shadow, no text, no watermark. Square format.
```

**K1-4 Putto schraubt einen Knopf fest** (1:1) → `k1-putto-schraube-v1.jpg`
```
Same painting style, same putto character as before (pink hard hat, lilac-white wings, powder-blue drape).
He holds a large pastel-pink rounded website button (a pill shape with no text, glossy and crisp like a UI
element) against nothing with one hand and tightens it with a small golden screwdriver in the other hand,
squinting with focus. Full body, isolated on a plain flat light-grey background (#EDEDED), no ground shadow,
no text, no watermark. Square format.
```

**K1-5 Putto lässt den Farbroller fallen** (1:1) → `k1-putto-oops-v1.jpg`
```
Same painting style, same putto character with the pink hard hat holding the paint roller. The roller has
just slipped out of his hands and is falling, a few lilac paint drops flying; he reaches after it with wide
eyes and an "oops" face, hat tilted. Full body, isolated on a plain flat light-grey background (#EDEDED),
no ground shadow, no text, no watermark. Square format.
```

Tipp: K1-4 und K1-5 im **selben Chat** wie K1-3 erzeugen, damit der Putto gleich aussieht.
