# Teardown Shopify Editions Winter '26: Lehren für unsere Website

Stand: 28.09.2026 · Status: **Befund [F], Folgerungen [A] bis Mattia entscheidet** ·
Erstellt mit dem Skill `clone-site --analyze-only` · Vorbild laut `marke/referenzen.md` und
`website/seitenstruktur.md` („Startseite wie Shopify Editions")

Vollständige Messdaten, Screenshots und Code-Auszüge liegen **nur lokal** in
`C:\web agency\_rohdaten\teardown\www.shopify.com\` (`TEARDOWN.md`). Nichts davon wird übernommen oder
veröffentlicht: Bilder, Modelle, Schriften und Code gehören Shopify. Übernommen werden Ideen und Bauweisen.

## Was die Seite ist [F]

- **Eine fixe 3D-Bühne hinter dem Text.** Ein einziger WebGL-Canvas füllt den Bildschirm und bleibt stehen.
  Der Inhalt (echtes HTML) scrollt darüber.
- **12 Kapitel = 12 Szenen.** Jede Szene ist ein **gemaltes Hintergrundbild** plus wenige **echte 3D-Requisiten**
  (Armillarsphäre, Kreditkarte, Handy, Buch) und eine Kamera, die sich bewegt. Also 2.5D, nicht ein ganzer 3D-Raum.
- **Scroll führt Regie, ohne zu kapern.** Der Scroll-Fortschritt eines Kapitels (0–1) steuert eine Theatre.js-Sequenz
  (Kamera, Licht, Glühen, Partikel). Pro Frame wird weich nachgezogen (Faktor 0.5). Normales Scrollen bleibt erhalten.
- **Malerischer Szenenwechsel.** Zwischen zwei Szenen löst sich das Bild wie nasse Farbe auf: ein Shader mischt beide
  Szenen entlang einer Kante aus Rauschen und einer „Schlamm"-Struktur und zeichnet an der Kante die Konturen nach.
- **Technik:** Remix/React, three.js r172, Theatre.js, Lenis (Smooth Scroll), Post-Processing mit Bloom, Rive für
  kleine UI-Animationen, `detect-gpu` für eine einfache Variante auf schwachen Geräten. **Kein GSAP.**
- **Schnell trotz 12 Szenen:** Hintergründe sind komprimierte Bilder (KTX2, 100–430 KB), Modelle komprimiert (Draco),
  alles lädt pro Kapitel nach.

## Was wir schon richtig haben [F]

| Shopify | signedbymattia | Datei |
| --- | --- | --- |
| Titel „Ren*ai*ssance" mit einem Wort in Serif | Genau ein Hand-Wort pro Headline | `marke/DESIGN.md` §3, `marke/stil.md` |
| Fette Grotesk als System, Serif als Erzählstimme | Host Grotesk + Instrument Serif | `marke/tokens.css` |
| Hero mit Kapitel-Index und römischen Zahlen | Hero mit Kapitel-Index I–V | `website/seitenstruktur.md` |
| Renaissance-Gemälde mit modernen Gegenständen (Becher, Skateboard, Handy) | Barock-Collage mit Web-Dingen (Engel hält Mauszeiger) | `marke/DESIGN.md` §1 |
| Gefächerte, schräge Karten | Tarot-Fächer im Atelier | `website/preisrechner.md` |
| Kein Scroll-Hijacking, Text im HTML | gleiche Regeln | `marke/ui-regeln.md`, `website/geo.md` |

## Was wir übernehmen sollten [A], Vorschläge für Mattia

1. **Akt I und Akt II als 2.5D-Bühne statt vollem 3D.** Gemalte Himmels- und Galerie-Bilder als Hintergrund, davor
   3–5 echte Requisiten (Browserfenster, Engel mit Mauszeiger, Goldrahmen), eine Kamera, die mit dem Scroll fährt.
   Das senkt Aufwand und Ladezeit deutlich und entschärft den **Plan-B-Entscheid zu Akt II** (Checkliste §4, KW 45).
2. **Szenenwechsel als „Ölfarbe".** Derselbe Gedanke wie Shopifys Schlamm-Übergang, aber mit eigener Textur
   (Leinwand, Pinselstrich). Passt direkt zum Atelier, wo das Bild aus der Skizze gemalt wird: eine gemeinsame
   Handschrift für Übergänge auf der ganzen Seite.
3. **Linke Kapitel-Leiste, die mitläuft.** Titel oben, Kapitel I–V unten, aktives Kapitel hervorgehoben, Farbe passt
   sich hell/dunkel an. Günstig, hilft der Orientierung.
4. **Erzählsatz in Serif mit Schmuck-Initiale** nach jedem Kapitel-Titel. Instrument Serif hat keine verzierten
   Initialen; eine eigene Initiale als SVG (Barock-Ornament) wäre ein Markenzeichen.
5. **Papier-Panels über der Szene.** Die Details eines Kapitels liegen auf Creme-Flächen (`--color-bg`), die über die
   3D-Szene scrollen. So bleiben Text und Formulare ruhig lesbar.
6. **Gleiche Bauweise für Tempo:** Hintergründe als KTX2/AVIF, Modelle mit Draco, Szenen pro Kapitel nachladen,
   `detect-gpu` + `prefers-reduced-motion` schalten auf eine 2D-Variante.
7. **Federnde Hover-Kurve** `cubic-bezier(.34,1.56,.64,1)` in 0.4–0.5 s für Karten und Tags (gemessen bei Shopify),
   passt zum Tarot-Fächer.

## Was wir bewusst anders machen [F]

- **Farbe:** Shopify hat eine farblose UI (Olivschwarz, Creme, Papiergrau), die Farbe kommt nur aus den Bildern.
  signedbymattia hat Pastell-Tokens und Pink als Knopffarbe (`marke/DESIGN.md` §2). Bleibt so.
- **Umfang:** Shopify zeigt 12 Kapitel und 150 Neuerungen. Wir haben 5 Kapitel und wenige Seiten, darum kurze Akte.
- **Keine fremden Assets:** eigene Barock-Bilder (Met CC0 oder eigenes Bild, Checkliste §4), eigene Modelle, eigene
  Übergangstextur.

## Aufwand grob [A]

Nur Richtwerte, nicht gemessen; ersetzen keine Neuplanung (`plan/stand-2026-09-28.md`).

| Baustein | Aufwand |
| --- | --- |
| Bühne: fixer Canvas, Lenis, Szenen laden/entladen, 2D-Fallback | 8–12 h |
| Akt I Himmel als 2.5D (2–3 Bildebenen, 3 Requisiten, Kamera-Regie mit Theatre.js) | 10–16 h |
| Ölfarben-Übergang (Shader + eigene Textur) | 4–8 h |
| Akt II Galerie als 2.5D statt 3D-Saal | 8–12 h statt deutlich mehr für vollen 3D-Raum |
| Kapitel-Leiste, Panels, Schmuck-Initiale | 4–6 h |

## Nächster Entscheid [?] Mattia

Akt I und II als **2.5D-Bühne** nach diesem Muster bauen (Empfehlung) oder beim vollen 3D-Saal für Akt II bleiben?
