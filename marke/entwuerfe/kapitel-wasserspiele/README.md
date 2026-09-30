# Kapitel II „Wasserspiele" (Entwurf)

Stand: 30.09.2026 · Tageslauf `plan/auftraege/2026-09-30.md` Aufgabe 2 · Drehbuch:
`website/drehbuch/10-startseite.md` §12 · Mechaniken M1, M2, M3, M7, M9, M13
(`02-mechaniken.md`) · Bausteine aus `../bausteine/` · Werte: `00-grammatik.md`.

## Ansehen

```bash
python3 -m http.server 8123     # im Repo-Wurzelordner
# http://localhost:8123/marke/entwuerfe/kapitel-wasserspiele/index.html
```

three.js 0.172.0 und Lenis per Import-Map (wie `../buehne/`). Prüfung und Filmstreifen: `pruefung/`.

## Stationen (Scroll-Fortschritt von `#lauf`, 0–1)

| Fortschritt | Station | Was zu sehen ist |
| --- | --- | --- |
| 0–0.2 | Auftakt (M1) | Barockgarten (Fragonard, 2 Ebenen desselben Bildes, verschieden schnell) unter einem Himmelsschleier; Kapitelwort „Automation" steigt schneller als der Scroll; Erzählsatz mit Initiale K `[Platzhalter]`; der schlafende Gelehrte (Lievens) mit pinker Schlafmaske (eigenes SVG) unten rechts |
| 0.2–0.45 | Anflug (M2) | 3D-Kaskade steigt von unten nah vor die Kamera, dreht sich mit dem Scroll (1.1 Umdrehungen), die Kamera zieht zurück |
| 0.45–0.7 | Explosionsansicht (M3) | Kamera kippt nach oben, die 4 Becken schweben auseinander; HTML-Labels folgen der 3D-Position: *Anfrage kommt* → *wird sortiert* → *Antwort geht raus* → *Termin steht* |
| 0.7–1 | Probier es | Kaskade rückt nach rechts (Handy: nach oben), links die Beispiel-Offertanfrage (M9-Karte). „Absenden": pinke Kugel hüpft von Becken zu Becken (je 450 ms, `cubic-bezier(.34,1.56,.64,1)`, Ringwelle beim Aufsetzen), dann „Eingang, sortiert" + „Antwort gesendet (Beispiel)", dann spritzt der Scherzbrunnen Tropfen zum Schläfer, die Maske verrutscht kurz. **Nichts wird gesendet** |
| danach | Papier (M7) | Gerissenes Papier mit 3 Platzhalter-Karten (M9, wecken sich bei Hover/Tippen) und Putto (Procaccini) im Multiplizieren-Modus |

**Lebt (M13):** Wasserfilm mit Ringwellen (Vertex), Wasservorhänge laufen (Textur), die Kugel
pulsiert und leuchtet leise, der Schläfer atmet (`scale` 1 → 1.01, 4.2 s).

## Aufbau

- `index.html`: sticky Bühne (Garten-Ebenen, Canvas, Schläfer, Labels als `<ol>`, Probier-Karte),
  darüber `#lauf` (650vh, darin der Auftakt), danach das Papier.
- `wasserspiele.js`: Renderer, Licht, Kaskade, Zustand je Frame (`stellen(q, t)`), Kugel und Spritzer.
  Farben zur Laufzeit aus `marke/tokens.css`. Die Kurven aus der Grammatik als JS-`cubic-bezier`.
- Kaskade: 4 Becken als `LatheGeometry` mit Marmor aus Canvas-Adern (Pfirsich, Flieder, Himmel,
  Flieder), Goldrand (`TorusGeometry`), Schaft aus Creme-Marmor, Wasserfilm (`RingGeometry`, bewegt),
  Wasservorhang je Becken (offener Zylinder, laufende Streifen-Textur). Kein fremdes Modell, kein
  fremder Shader.

## Stellschrauben (`PARAMETER` oben in `wasserspiele.js`)

| Wert | Standard | Wirkung |
| --- | --- | --- |
| `nachziehen` | 0.12 | wie schnell Kamera und Kaskade dem Scroll folgen |
| `stationen` | [0.2, 0.45, 0.7] | Grenzen der Stationen |
| `becken.radien` | [0.85, 1.25, 1.7, 2.2] | Grösse der Becken, oben → unten |
| `becken.abstand` / `explosion` | 1.05 / 1.9 | Höhe zwischen den Becken; Faktor in der Explosionsansicht |
| `anflug.drehungen` / `startY` | 1.1 / −11 | Umdrehungen während des Anflugs; Start unter dem Bild |
| `kamera.nahZ` / `fernZ` / `explosionZ` / `kippen` | 6.5 / 15 / 19 / 2.2 | Kameraabstand nah, zurückgezogen, bei der Explosion; wie stark sie nach oben kippt |
| `kugel.hopfMs` / `hoehe` | 450 / 1.0 | Dauer und Bogenhöhe eines Sprungs |
| `wasser.wellen` / `tempo` | 0.03 / 1 | Wellenhöhe und Tempo |
| `spritzer.tropfen` / `ms` | 16 / 750 | Anzahl und Flugzeit der Tropfen |

Schlafmaske: Lage in `index.html` (`.maske`: `left`, `top`, `width`, Drehung).

## Ruhige Variante und Rückfall

- `prefers-reduced-motion`: Kaskade steht still in der Explosionsansicht, Labels und Karte sind immer
  sichtbar, keine Ebenenbewegung, kein Atmen. „Absenden" zeigt nur das Ergebnis (Einblenden 0.2 s).
- Ohne WebGL: kein Canvas, die 4 Stationen stehen als Liste in der Bühne, die Karte funktioniert.
- Ohne JavaScript: Texte stehen im HTML, die Bühne zeigt Garten und Schläfer.

## Was fehlt (bewusst)

- Schläfer ist **nicht freigestellt**, sondern ein ovaler Ausschnitt mit weicher Kante (die Radierung
  hat Schraffur bis an den Rand; Freistellen würde die Figur zerfressen). Er „wacht auf, schaut,
  schläft weiter" nur als Maske, die verrutscht und zurückfedert.
- Kein Liegestuhl; die Figur sitzt (Motiv der Radierung).
- Grafik B15 „viele Linien laufen in einen Punkt", Tags (B10) und Tarot-Karte II fehlen noch
  (nicht im Auftrag).
- Tempo am Handy nicht gemessen (Tempo-Budget in `00-grammatik.md`).
