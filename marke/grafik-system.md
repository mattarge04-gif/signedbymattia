# Grafik-System — signedbymattia

Stand: 27.09.2026 · Status: **entschieden [F]** (Interview mit echten Beispielen,
7 Fragen, Prototyp von Mattia freigegeben) · Prototyp:
[`entwuerfe/grafik-system-v1.html`](entwuerfe/grafik-system-v1.html)

Grundlage für den Grafik- und Video-Skill (LinkedIn und Blog). Farben, Schriften
und Logo stehen in [`DESIGN.md`](DESIGN.md), Sprache und Ton in
[`tonalitaet.md`](tonalitaet.md). Diese Datei regelt nur, **wie Grafiken und
Videos aufgebaut sind**.

## 1. Formate [F]

Drei Grafik-Typen, jeder hat eine Rolle aus der Persönlichkeit:

| Format | Rolle | Aufbau |
| --- | --- | --- |
| **Statement-Karte** | Meinungen, auch Weltgeschehen als Aufhänger | Riesen-Schrift + Figur |
| **Tipp-Karussell** | Tipps | Cover laut, innen ruhig |
| **Editions-Vorstellung** | Werke zeigen | Collage + Goldrahmen |

Nicht gewählt: Vorher/Nachher als eigenes Format.

**Leinwand:** 4:5, 1080×1350 px (LinkedIn). Videos in 4:5 oder 9:16
(1080×1920) nach `DESIGN.md` §8.

## 2. Aufbau je Format [F]

Gewählt aus sechs echten Arbeiten auf Dribbble: **Riesen-Schrift mit
freigestellter Figur** (Vorbild: „Modern Newsletter“, Deez Gud Dab) und **wilde
Papier-Collage** (Vorbild: „Chess digital collage poster“, udogri oruaro). Nur
der Aufbau ist übernommen, nicht der Inhalt.

### Statement-Karte

- Hintergrund: ein Pastell-Kapitel (Flieder, Himmel, Pfirsich).
- Oben ein kurzer Satz in Host Grotesk.
- Unten **ein Riesen-Wort** (Host Grotesk 800, eng gesetzt), das Hand-Element
  kursiv in Instrument Serif (z. B. der Punkt oder ein Wort).
- **Ein Collage-Stück** (gerissener Papierrand, weicher Schatten) überlappt
  das Riesen-Wort.
- Beispiel: „Kein Template. Ein **WERK***.*“ · „Die Welt redet über KI. Ich über
  **HAND***.*“

### Tipp-Karussell

| Seite | Aufbau |
| --- | --- |
| 1 (Cover) | **laut:** 2–3 Collage-Stücke, Papierstreifen mit Rubrik („Tipps für Kreative · I–V“), Titel gross mit einem Hand-Wort |
| 2 bis vorletzte | **ruhig:** Creme oder ein Pastell-Kapitel, römische Nummer kursiv gross oben, **ein Satz** als Titel, 1–2 Sätze Erklärung, ein **kleiner** Collage-Sticker unten rechts |
| letzte | **laut:** Pink, Collage-Stück, Tagline „Kein Template. Ein *Werk*.“, Knopf „Edition anfragen → signedbymattia.ch“ |

Lesbarkeit hat auf den Innenseiten Vorrang vor Wow.

### Editions-Vorstellung

- Barock-Himmel als gerissenes Collage-Stück oben.
- Screenshot der Website in einem schlichten Browserfenster im **Goldrahmen**.
- Mauszeiger-Sticker zeigt auf die Website.
- Darunter: „Edition *No.* 001“, Kunde, Ort, Livedatum römisch.
- **Nur echte Kundenarbeiten mit Freigabe.** Sonst sichtbar als „Konzept“
  markiert (`tonalitaet.md`).

## 3. Wiedererkennung: feste Bausteine [F]

Auf **jeder** Grafik:

1. **Fusszeile:** links „signed*by*mattia“ (Logo klein), rechts römische
   Seitenzahl („II / VII“), Formatname oder „No. 001“ in Instrument Serif.
2. **Mauszeiger-Sticker:** weisser Mauszeiger mit Tinten-Kontur, weicher
   Schatten. Das Signatur-Detail, wie die zeigenden Hände bei Shopify.
3. **Goldrahmen** (Pastell-Gold `#E3C58A`) um das wichtigste Element, wo es
   eines gibt (Website, Zitat, Zahl).

Nicht gewählt: Browserfenster als Rahmen für alles. Es bleibt nur für
Screenshots von Websites.

## 4. Collage-Regeln

- Stücke mit **gerissenem Papierrand** und weichem Schatten, leicht gedreht
  (±2–8°).
- Quelle: gemeinfreie Werke (Met Open Access, CC0), später Freisteller aus dem
  eigenen Barock-Bild (`DESIGN.md` §6). Jede Quelle mit Lizenz festhalten.
- Witz nur im Detail (Ton „Ehrfurcht mit Augenzwinkern“). Keine religiösen oder
  politischen Aussagen in Bildern [A, siehe `tonalitaet.md`].
- **Keine Nacktheit im Anschnitt** [A: Vorsichtsregel für LinkedIn].
  Barock-Figuren so zuschneiden, dass sie im Feed nicht anecken.

## 5. Video [F]

**Vier Bewegungen, je mit Einsatz:**

| Bewegung | Beschreibung | Einsatz |
| --- | --- | --- |
| Scherenschnitt | Ausgeschnittene Figuren ploppen rein, Arme und Köpfe klappen (Vorbild: Terry Gilliam, Monty Python) | Statements, Pointen |
| Kamerafahrt ins Gemälde | Langsamer Flug durch Ebenen eines Barock-Bildes (wie Akt I der Website) | Editions-Intros |
| Kinetische Schrift | Worte im Takt, das Hand-Wort kommt kursiv hinterher | Tipps |
| Website im Rahmen | Edition scrollt im Goldrahmen, der Mauszeiger klickt durch | Editions-Vorstellung |

**Zwei Längen:**

- **Kurz, 6–15 s:** Musik, kein Sprecher, Text im Bild. Muss stumm
  funktionieren.
- **Lang, 20–45 s:** KI-Stimme, Untertitel immer eingebrannt.
  [?] Kosten der KI-Stimme prüfen, bevor sie eingebaut wird. Ziel laut
  `agency-marketing/docs/LINKEDIN-BLOG-CONTENT.md` ist „kostenfrei“.

Regeln aus `ui-regeln.md` gelten auch hier: keine Bewegung nur zur Dekoration,
jede Bewegung trägt die Aussage.

## 6. Freiheit des Skills [F]

„Teile fest, sonst frei nach Regeln“:

| Fest | Frei |
| --- | --- |
| Leinwand 4:5, Schriften, Farben (`DESIGN.md`) | Welche Bildausschnitte und Collage-Stücke |
| Die drei Bausteine (Fusszeile, Mauszeiger, Goldrahmen) | Welches Pastell-Kapitel |
| Aufbau je Format (§2) | Position und Drehung der Collage-Stücke |
| Ton und Wortschatz (`tonalitaet.md`) | Welches Wort riesig wird |
| Karussell: Innenseiten ruhig | Welche der vier Bewegungen, passend zum Format |

Jede Grafik geht vor dem Posten an Mattia zur Freigabe
(`agency-marketing/docs/MARKETING-SYSTEM.md`).

## 7. Technik [A]

Arbeitshypothese aus `agency-marketing/docs/LINKEDIN-BLOG-CONTENT.md`:

- **Grafik:** HTML/CSS-Vorlage, per Playwright als PNG gerendert.
- **Video:** HTML/CSS/JS-Animation, per Playwright aufgenommen, mit ffmpeg zu
  MP4. Alternative: Remotion (Lizenz prüfen).

Beides ist noch nicht gebaut.
