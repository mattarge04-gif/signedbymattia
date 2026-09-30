# Drehbuch 00: Grammatik der Bewegung

Stand: 30.09.2026 · Status: **entschieden [F]** (Mattia, 29.09.2026) · Grundlage für alle
Szenen in `website/drehbuch/` · Quellen: `marke/DESIGN.md` §7, `marke/ui-regeln.md`,
`marke/teardown-shopify-editions.md`, Emil Kowalski (Design Engineering)

Jede Szene nutzt diese Werte. Weicht eine Szene ab, steht der Grund in ihrem Drehbuch.

## Charakter [F]

**Zwei Tempi:** Die Bühne ist ruhig und malerisch (Kurator), die Bedienung knackig. Dazu
kommen seltene federnde Pointen (frecher Meister).

## Werte [F]

| Bereich | Regel | Werte |
| --- | --- | --- |
| Bedienung (Knöpfe, Links, Menüs) | reagiert sofort | Drücken 160 ms, `scale(.97)` · Hover 200 ms · Menüs 220 ms · Kurve `--ease-ui: cubic-bezier(.23,1,.32,1)` |
| Pointe (Karten, Siegel, Tarot) | federnd, selten | 450 ms, `--ease-pointe: cubic-bezier(.34,1.56,.64,1)` |
| Bühne (Szenen, Übergänge) | ruhig, malerisch | 0.8–1.5 s, `--ease-farbe: cubic-bezier(.77,0,.175,1)`; Kamera zieht weich nach (Faktor 0.12) |
| Scroll | weich, nie gekapert | Lenis, Glättung 0.1; kein Einrasten; auf Touch natives Scrollen |
| Mauszeiger (nur `hover: hover` und `pointer: fine`) | Pinsel je nach Ort | Bühne: feine Farbspur, verblasst in 0.6 s (höchstens 40 Punkte) · Karten, Links: Hand · Editionen: Lupe · Text, Formulare: Systemzeiger · Zeiger folgt weich (Faktor 0.25) |
| Handy | Farbtropfen beim Tippen | Tropfen 36 → 80 px in 0.5 s, `--ease-ui`, verblasst; Farben der Kapitel im Wechsel; nicht in Formularen |
| Text | Tinte, nur beim ersten Sehen | Überschriften: Zeilen `translateY(.4em)` → 0 und einblenden, 0.5 s, gestaffelt 60 ms · Hand-Wort und Schmuck-Initiale: Kontur zeichnet 0.7 s, Tinte füllt 0.25 s · Auslöser: 30 % im Bild |
| Seitenwechsel | Pinselstrich-Wisch | Creme-Strich wischt von links nach rechts, 0.6 s, `--ease-farbe` (View Transitions API); ohne Unterstützung sofortiger Wechsel |
| Laden | Skizze wird zum Bild | Bleistiftskizze der Szene (ca. 20 KB) sofort; sind die Bilder da, malt sich die Szene in 1 s aus; Text ist sofort lesbar, nie Ladebalken |
| Ton | keiner | – |

## Ruhige Variante (`prefers-reduced-motion`, schwache Geräte) [F]

- Kein Kameraflug: Bildebenen stehen still. Keine Farbspur, keine Tropfen.
- Texte blenden nur ein (0.2 s), ohne Bewegung.
- Übergänge und Seitenwechsel als Überblenden (0.2 s).
- Inhalt, Reihenfolge und Bedienung bleiben gleich.

## Harte Regeln [F]

1. Animiert werden nur `transform` und `opacity` (dazu die Bühne im Canvas).
2. Hover-Effekte nur hinter `@media (hover: hover) and (pointer: fine)`.
3. Aktionen per Tastatur werden nie animiert.
4. Ausblenden ist schneller als Einblenden.
5. Höchstens **ein Wow pro Bildschirm**.
6. Nichts erscheint aus dem Nichts: Einblenden ab `scale(.95)` und Deckkraft 0, nie `scale(0)`.
7. Kein Scroll-Hijacking, Text immer im HTML (`website/geo.md` §1).

## Bilder ohne Ladeprobleme [F] (Mattia, 30.09.2026)

Gleicher Trick wie Shopify Editions (dort 100–430 KB pro Szene, gemessen im Teardown):

1. **Original in hoher Qualität** (z. B. 4K aus der KI) bleibt im Archiv und wird nie direkt geladen.
2. **Moderne Formate:** AVIF oder WebP, freigestellte Figuren mit Transparenz; Texturen der 3D-Bühne
   als KTX2.
3. **Passende Grösse pro Gerät** (`srcset`): Handy ca. 800 px, Laptop ca. 1600 px, grosse Bildschirme
   bis ca. 2400 px.
4. **Skizze zuerst** (ca. 20 KB), das echte Bild malt sich nach (siehe „Laden" oben).
5. **Kapitelweise nachladen:** nur, was gleich sichtbar wird.
6. **Auslieferung über ein CDN.**
7. **Messen statt annehmen:** Lighthouse und Bildgrössen beim Bau prüfen, Grenzen aus „Tempo-Budget".

## Tempo-Budget [A]

60 Bilder pro Sekunde auf einem Mittelklasse-Handy · sichtbarer Hauptinhalt (LCP) unter 2.5 s ·
Bilder pro Akt höchstens 1.5 MB · Bühnen-Code gezippt ca. 250 KB. Beim Bau messen.
