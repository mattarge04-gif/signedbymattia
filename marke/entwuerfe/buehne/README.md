# Prototyp 2.5D-Bühne mit Ölfarben-Übergang

Stand: 29.09.2026 · Status: **Entwurf, Wegwerf-Prototyp** (Tageslauf, Auftrag
`plan/auftraege/2026-09-29.md`) · Grundlage: `marke/DESIGN.md` §7,
`website/seitenstruktur.md` (Startseite), `marke/teardown-shopify-editions.md`
(nur der Mechanismus in Worten, **kein** Shopify-Code)

Wow-Ablauf nach `marke/ui-regeln.md`: Schritt 3 (Prototyp). Als Nächstes kommen
Mattias Änderungen, danach erst der Einbau in `signedbymattia-website`.

## Ansehen

Die Seite braucht einen lokalen Server, weil die Bilder als WebGL-Texturen geladen
werden und `tokens.css` zwei Ordner höher liegt:

```sh
# im Repo-Wurzelordner
python3 -m http.server 8123
# dann im Browser: http://localhost:8123/marke/entwuerfe/buehne/
```

Prüfung mit Screenshots (Playwright aus `werkzeuge/`):

```sh
cd werkzeuge && npm ci && npx playwright install chromium
node ../marke/entwuerfe/buehne/pruefung/pruefen.cjs
```

Das schreibt die Screenshots und `protokoll.txt` nach `pruefung/`.

## Aufbau

| Teil | Wo | Was |
| --- | --- | --- |
| HTML-Inhalt | `index.html` | Hero „Gemalt in *Code*.“ mit Kapitel-Index I–V, Akt I, Übergang, Akt II (mit den Editionen als Text), Kapitel I–V als Creme-Panels, Abschluss. Alle Texte **[Platzhalter]**. |
| Bühne | `buehne.js` | ES-Modul, three.js 0.172.0 und Lenis 1.3.4 per Import-Map von `cdn.jsdelivr.net`, kein Build-Schritt. |
| Akt I Himmel | `baueHimmel()` | Himmel aus Tiepolos Deckenbild (hinterste Ebene, aufgehellt), 3 Figurenebenen in verschiedener Tiefe mit ausgefranster Kante, 9 prozedurale Wolken, Requisiten: schwebendes Browserfenster (Canvas-Textur aus den Tokens) und Goldrahmen aus Geometrie (extrudiert, abgeschrägt) mit Tiepolo-Ausschnitt. Kamera fliegt nach hinten und steigt. |
| Akt II Galerie | `baueGalerie()` | Dunkler Raum (`--color-bg-dark`), Wand mit prozeduraler Putzstruktur, 3 Goldrahmen mit Platzhalter-Editionen „Konzept“ A–C, je ein Spot. Kamera gleitet entlang der Wand. |
| Ölfarben-Übergang | `OELFARBE_FRAGMENT` in `buehne.js` | Beide Szenen in Render-Targets. Ein Vollbild-Shader mischt sie entlang einer Kante aus **eigener** prozeduraler Textur: grosse Farbflecken (fbm), Pinselstriche (gestrecktes fbm mit stetig drehender Strichrichtung), Leinwandbindung (Kette/Schuss im Wechsel) und ein Verlauf von oben nach unten, damit die Farbe wie nass herunterläuft. An der Kante wird das Bild verschmiert und eine dunkle Farbkontur in Tinte gezeichnet. |
| Scroll | `schleife()` | Jeder Akt liefert einen Fortschritt 0–1 aus seiner Lage im Viewport. Kamera und Übergang folgen pro Frame weich (bildratenunabhängig). Lenis glättet nur, das normale Scrollen bleibt (kein Scroll-Hijacking). |
| 2D-Variante | CSS `.ebenen-2d` | Ohne JavaScript, ohne WebGL 2 oder bei `prefers-reduced-motion`: dieselben Tiepolo-Bilder als ruhige Ebenen, Galerie als Goldrahmen in CSS, kein Smooth Scroll. Der Text ist immer im HTML (`website/geo.md` §1). |

Farben liest `buehne.js` zur Laufzeit aus `marke/tokens.css` (`getComputedStyle`),
nichts ist kopiert. Schriften kommen über den Google-Fonts-Import in den Tokens.

## Stellschrauben (`PARAMETER` oben in `buehne.js`)

| Parameter | Standard | Wirkung |
| --- | --- | --- |
| `nachziehen` | 0.12 | 0.1–0.5: wie schnell Kamera und Übergang dem Scroll folgen. Shopify misst 0.5 (sehr direkt), 0.1 ist schwebend. |
| `pixelRatioMax` | 1.5 | Obergrenze der Auflösung, wichtig am Handy. |
| `msaa` | 4 | Kantenglättung in den Render-Targets. |
| `himmel.kameraStartZ` / `kameraEndeZ` | 16 / −20 | Länge des Flugs durch die Wolken. |
| `himmel.kameraHub` | 2.5 | Wie weit die Kamera beim Flug steigt. |
| `galerie.kameraStartX` / `kameraEndeX` | −9 / 9 | Weg entlang der Galeriewand. |
| `oelfarbe.kantenBreite` | 0.045 | Nasse Kante: 0.02 hart, 0.12 weich. |
| `oelfarbe.kontur` | 0.4 | Stärke der dunklen Farbkontur. |
| `oelfarbe.verschmieren` | 0.035 | Wie stark das Bild an der Kante verzogen wird. |
| `oelfarbe.pinselMassstab` | 3.0 | Grösse der Pinselstriche. |
| `oelfarbe.leinwand` | 0.06 | Sichtbares Leinwandgewebe während des Wechsels. |

Länge der Akte: CSS `min-height` von `.akt-1` (260vh), `.uebergang` (140vh), `.akt-2` (280vh).

## Prüfung 29.09.2026

Screenshots in `pruefung/`, Protokoll `pruefung/protokoll.txt`. Gerendert mit
SwiftShader (Software-WebGL im Container), darum lief die Seite dort in der Stufe
„schwach“ (ohne MSAA, Auflösung 1). Auf echter Grafikkarte sehen Kanten glatter aus.

| Datei | Zeigt |
| --- | --- |
| `1-hero.jpg` | Hero mit Kapitel-Index, Akt I am Start |
| `2-akt1-flug.jpg` | Akt I mitten im Flug (Goldrahmen, Wolken, Figurenebene) |
| `3-oelfarbe-mitte.jpg` | Ölfarben-Übergang bei 50 % |
| `4-akt2-galerie.jpg` | Akt II Galerie |
| `5-kapitel-panels.jpg` | Creme-Panels scrollen über die Galerie |
| `m1-hero.jpg`, `m2-oelfarbe-mitte.jpg` | Handy 390×844 |
| `r1-fallback-hero.jpg`, `r2-fallback-galerie.jpg` | 2D-Variante mit `reducedMotion: 'reduce'` |
| `n1-ohne-js.jpg` | ohne JavaScript |

## Was fehlt (bewusst, für den Bau)

- **Theatre.js** für die Kamera-Regie (DESIGN.md §7): hier nur lineare Pfade in Code.
- **detect-gpu**: hier nur eine einfache Erkennung von Software-Renderern.
- **Komprimierte Texturen** (KTX2/AVIF) und Nachladen pro Akt; hier JPEG, alles beim Start.
- **Eigenes Barock-Bild** und freigestellte Engel (DESIGN.md §6); hier Met-CC0-Ausschnitte mit weicher Kante.
- **Engel mit Mauszeiger** als drittes Requisit, echte 3D-Modelle (Draco).
- Ladezeit am Handy messen, `prefers-reduced-motion` beim Abschluss erneut prüfen (ui-regeln.md).
- Kapitel-Leiste links und Schmuck-Initiale (Teardown-Punkte 3 und 4) sind nicht Teil dieses Prototyps.
- Übergang auch rückwärts getestet (Scroll nach oben) nur rechnerisch: Mischung hängt allein vom Fortschritt ab.

## Bilder

`bilder/quellen.csv`: drei Werke von Giovanni Battista Tiepolo aus dem Met Museum,
CC0 (Open Access), auf höchstens 1600 px Breite verkleinert (zusammen ca. 1.3 MB).
