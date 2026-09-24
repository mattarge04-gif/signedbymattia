# DESIGN.md — signedbymattia

Stand: 24.09.2026 · Status: **Gerüst, Werte offen** · Zielplan KW 43
(„Gestaltungsrichtung festlegen: Typografie, Farben, Bildsprache“), **vorgezogen**:
Identität vor Website (Entscheid 24.09.2026)

**Aktueller Schritt:** drei Richtungen zur Wahl in
[`entwuerfe/markenrichtungen.html`](entwuerfe/markenrichtungen.html)
(A Signatur, B Editionen, C Nachtlicht). Wow-Ablauf Schritte 1 und 2
(Vorschlag, Quelle). Nichts davon ist entschieden [?].

**Reihenfolge Identität:** Richtung wählen → Prototyp → Mattias Änderungen →
Werte hier eintragen → Logo/Wortmarke (SVG, PNG) → Vorlagen (Offerte, Rechnung,
E-Mail-Signatur, LinkedIn-Grafik, Präsentation) → Website.

Diese Datei beschreibt die visuelle Identität so, dass ein Agent sie ohne
Rückfrage anwenden kann: Website, LinkedIn-Grafiken, Videos, Dashboard,
Offerten. Aufbau nach der Spezifikation
[google-labs-code/design.md](https://github.com/google-labs-code/design.md)
[A: Format beim Ausfüllen gegen die Spezifikation prüfen]. Beispiele echter
Marken: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md),
nur als Anregung, nicht übernehmen. Grundregeln: [`ui-regeln.md`](ui-regeln.md).

Alle Werte mit `?` sind offen. Kein Agent setzt sie ohne Mattias Entscheid.

## 1. Charakter

Drei Adjektive, die die Marke visuell trägt [F]: **innovativ, kreativ,
farbenfroh.** Vorbilder: `referenzen.md` (Sofi Health, Emotion Agency, Shopify
Editions Winter 2026).
Wirkung, die vermieden wird: generische Agentur, Tech-Startup-Lila, Stock-Look.

## 2. Farben (jede Farbe hat eine Rolle)

| Rolle | Token | Wert | Kontrast geprüft |
| --- | --- | --- | --- |
| Markenbasis, primäre Interaktion | `--color-primary` | `?` | – |
| Status, Bewegung, Aktivität | `--color-secondary` | `?` | – |
| CTA, Momentakzent (warm) | `--color-accent` | `?` | – |
| Hintergrund hell | `--color-bg` | `?` | – |
| Hintergrund dunkel (Kapitel) | `--color-bg-dark` | `?` | – |
| Text | `--color-text` | `?` | ≥ 4.5:1 |
| Text gedämpft | `--color-text-muted` | `?` | ≥ 4.5:1 |

Gradients nur innerhalb einer Farbe, dunkel zu hell. Helle und dunkle Kapitel
geplant und rhythmisch.

## 3. Typografie (höchstens zwei Familien)

| Rolle | Familie | Gewichte | Lizenz |
| --- | --- | --- | --- |
| Emotional: Headlines, Zitate, grosse Zahlen | `?` | `?` | `?` |
| Neutral: Text, Navigation, Formulare | `?` | `?` | `?` |

Skala `?` (z. B. 1.25), Zeilenlänge Fliesstext 60–75 Zeichen.

## 4. Raum, Form, Tiefe

| Token | Wert |
| --- | --- |
| Abstands-Grundeinheit | `?` (z. B. 4 oder 8 px) |
| Radius klein / gross | `?` / `?` |
| Schatten | weich, viel Blur, wenig Kontrast; Wert `?` |
| Maximale Inhaltsbreite | `?` |

## 5. Bildsprache [?]

Echte Bilder und kurze Videosequenzen statt Stock. Wer fotografiert? Eigene
Arbeiten, Screenshots, Vorher/Nachher. Keine fremden Fotos ohne Rechte.

## 6. Bewegung

Nach `ui-regeln.md`: keine Deko-Animation, kein Scroll-Hijacking,
`prefers-reduced-motion` respektieren, Inhalt ohne JavaScript lesbar.
Mikro-Interaktionen erwünscht.

## 7. Anwendungen

| Anwendung | Format | Besonderheit |
| --- | --- | --- |
| Website | responsive | zuerst mobil |
| LinkedIn-Grafik | 1080×1350, 1200×627 | Text gross, wenig Wörter |
| LinkedIn-Video | 1080×1350 oder 1080×1920 | Untertitel immer eingebrannt |
| Offerte/PDF | A4 | `?` |
| Logo | `?` | Datei und Schutzzone offen |
