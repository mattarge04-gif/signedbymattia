# Teardown Shopify Editions: Szene „POS Hub" (Retail) – wie es wie ein Video wirkt

Stand: 22.10.2026 · Status: **Befund [F]** (aus der Szenendatei `RetailScene.theatre-project-state` und
den Bundles, Rohdaten lokal in `C:\web agency\_rohdaten\teardown\www.shopify.com\`) · Vorschlag **[A]**

## Was Shopify dort tatsächlich macht [F]

| Ebene | Was | Beleg |
|---|---|---|
| 1 Regie | **Theatre.js-Sequenz** (Länge 9.5, 30 Schritte/Einheit). Der Scroll-Fortschritt des Kapitels spult sie vor und zurück. Keyframed: Kamera-**Ziel, FOV, Blick (gaze), Rotation**; Objekte; Sonne; Umgebung-Rotation; **Blur und Abdunkeln**; Bloom. | `tracksByObject`: camera, asset-1…4, environment, effects |
| 2 Objekt | Der Hub ist ein **GLB mit eingebauter Animation** (in Blender gekeyframed: auseinanderfahren, drehen). Der Scroll spult **die Animation selbst** (`animations.Scene.progress`, `timeline`). Darum wirkt es wie ein Film. | asset-1/2/3: `["animations","Scene","progress"]` |
| 3 Raum | Der Saal mit Säulen ist ein **Gaussian Splat** (`retail-splat`): ein fotorealer 3D-Scan, keine Malerei. Dreht sich mit. Bei Kamerabewegung entsteht echte Raumtiefe. | `retail-splat` rotation keyframed |
| 4 Kuppel | Hinter allem eine **Kuppel mit Video-Textur** (`.webm`, Fallback `DomeTexture.ktx2`). Ihr Bild (`frame`) wird ebenfalls vom Scroll gespult: Szenenwechsel Halle → Gewölbe. | `retail_*.json` → webm; asset-4 `["frame"]` |
| 5 Atmosphäre | Partikel (Staub), Bloom, Bildschärfe/Blur je Moment, Licht wandert. | particles, bloom-effect, effects.blur |

**Kern:** Es ist ein **im 3D-Programm vorgedrehter Film**, den der Scroll abspielt. Nichts wird live
„erfunden"; jede Kamerafahrt und jedes Auseinanderfahren ist von Hand gekeyframed.

## Warum unser Kapitel II nicht so wirkt [F]

- Unsere Bewegungen sind **Formeln** (zoom, explo, dreh), keine gestaltete Kamerafahrt mit Rhythmus.
- Der Hintergrund ist ein **flaches Bild**; bei Kameradrehung bewegt er sich nicht mit (kein Raum).
- Es gibt keine Schärfe-/Licht-Dramaturgie (Blur, Abdunkeln, Glanz in Momenten).

## Was es braucht, um so etwas zu bauen

1. **Ein 3D-Raum statt Bild** – eine von drei Quellen:
   a. **Gaussian Splat** aus einem KI-Weltgenerator (z. B. World Labs „Marble") aus unserem Gartenbild [A: Kosten, Lizenz prüfen]
   b. **Video-Kuppel** aus einem KI-Video (Veo in Gemini, im Google-AI-Pro-Abo [A: Kontingent prüfen]): langsame Kamerafahrt durch den gemalten Garten, vom Scroll gespult
   c. **Selbst in Blender gebaut** (Hecken, Beete, Tempel als einfache 3D-Formen mit gemalten Texturen)
2. **Eine in Blender gekeyframete Animation** von Objekt und Kamera (ich kann Blender über MCP steuern),
   exportiert als GLB, vom Scroll gespult.
3. **Ein Objekt, das sich zum Zerlegen eignet.** Der Hub hat Teile (Gehäuse, Platine, Anschlüsse).
   Ein Brunnen hat nur Schalen – wenig, was beim Zerlegen staunen lässt.
4. **Regie-Werkzeug:** Theatre.js (gratis, mit Editor) oder Keyframes direkt in Blender.

## Bessere Szene für „Automation" [A, Vorschlag]

**Der barocke Automat (Spieluhr / Uhrwerk mit Figur).** Automation = Automat, das ist das historische
Original (Jaquet-Droz, 18. Jh.). Ein goldenes Spieluhr-Gehäuse mit einer kleinen Figur oben.
Beim Scrollen öffnet sich das Gehäuse, **Zahnräder, Walze und Federn fahren auseinander** (Explosionsansicht
wie beim Hub), jedes Teil leuchtet beim zugehörigen Schritt auf: Walze = Anfrage kommt an, Zahnräder =
sortiert, Kamm = Antwort, Figur dreht sich = Termin steht. Hintergrund: der Garten als Video-Kuppel.
Zahnräder sind das, was beim Zerlegen „Wow" macht.

## Was ich von Mattia brauche

1. Entscheid: **Brunnen behalten** oder **Automat** (Vorschlag).
2. Entscheid Raum: **Video-Kuppel aus Veo** (empfohlen, im Abo) oder **Splat** (Konto/Kosten) oder **Blender-Garten**.
3. Für Veo: 1–2 Videos à 8 s nach meinem Prompt, mit dem Gartenbild als Startbild.
4. Für den Automaten: ein gutes Modell. Entweder freies CC-Modell (suche ich) oder ich modelliere es in Blender
   (Zahnräder sind gut prozedural baubar).
5. Zeit: ca. 1–1,5 Abende für Blender-Szene + Einbau [A].
