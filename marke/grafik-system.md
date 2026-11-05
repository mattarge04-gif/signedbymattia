# Grafik-System — signedbymattia

Stand: 05.11.2026 (neu §8 Content-Betrieb LinkedIn, §5/§7 Video mit Remotion) ·
Grundfassung 27.09.2026 · Status: **entschieden [F]** (Interview mit echten Beispielen,
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
- Seit 05.11.2026 ist dieser Aufbau ein **Ausgangspunkt, keine feste
  Anordnung** (§8): Komposition frei innerhalb der Markenregeln.

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
- Witz nur im Detail (Ton „Ehrfurcht mit Augenzwinkern“). Weltgeschehen darf
  auch in Bildern vorkommen [F, 27.09.2026, siehe `tonalitaet.md`].
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

## 7. Technik

- **Grafik [F]:** HTML/CSS-Vorlage mit den Werten aus `tokens.css`, per
  Playwright als PNG gerendert. Schrift, Wortmarke und Farben setzt immer der
  Code, nie das Bildmodell.
- **Video [F, 05.11.2026]:** **Remotion.** Claude schreibt die Szene als Code
  (Szenenplan → Remotion-Komposition), der Server rendert das MP4. Keine
  generative Video-API im Standardablauf. Remotion-Lizenz vor dem Einsatz
  prüfen (gratis bis 3 Personen, Stand 24.09.2026).
- **Bild-Motive [A]:** Vorschlag Gemini Nano Banana Pro über Vertex (gleicher
  Stil und gleiches Projekt wie die Website-Bilder, `werkzeuge/bild.py`).
  Noch nicht entschieden, eigene Kostengrenze nötig.

Gebaut ist bisher nur die Statement-Karte mit festem Collage-Stück
(`agency-marketing/render/grafik.mjs`).

## 8. Content-Betrieb LinkedIn [F]

Aus dem Grafik-Interview mit Mattia (03./04.11.2026, Zusammenfassung in
`agency-marketing/docs/CONTENT-AUTOMATION-OFFEN.md` §2) und dem Entscheid vom
05.11.2026. Gilt für die automatisch vorbereiteten LinkedIn-Beiträge und geht
§2 und §6 vor, wo sie sich widersprechen.

**Plan:** ein Post pro Werktag, pro Woche 2 Text, 2 Grafik, 1 Video
(`agency-marketing/docs/CONTENT-PLAN-2026-11-04.md`).

**Grafik:**

- **Plakativ und minimal:** starke Typografie mit **einem einfachen Motiv**.
  Die Grafik soll Interesse wecken, nicht alles erklären.
- **Wenig Text, keine feste Wortgrenze.** Die Handlungsaufforderung steht im
  Begleittext, nicht auf der Grafik.
- **Freie Komposition** innerhalb der Markenregeln (Farben, Schriften,
  Fusszeile aus §3). Keine festen Positionen.
- **Motive wechseln** und dürfen neu erzeugt werden, **im Stil der Website**
  (`website/drehbuch/03-bildstil.md`, abgenommene Website-Bilder als
  Vorlage). Das Met-CC0-Collage-Stück ist nicht mehr Pflicht.
- **Frechheit 8/10.**

**Themen:** Sichtbarkeit/SEO, digitale Visitenkarte, Kundengewinnung,
Zeitersparnis durch Automation.

**Fakten und Quellen:**

- Keine ungeprüften Fakten. Jede Zahl braucht eine Originalquelle, die genau
  diese Aussage deckt (Zahl, Zeitraum, Bezugsgruppe).
- Fremde Studien nie als eigenes Ergebnis oder Versprechen formulieren.
- Quellen mit direktem Link **unten im Begleittext**.

**Sichtprüfung vor Mattias Freigabe:**

- Handy-Feed-Grösse: Hauptaussage in einer Sekunde lesbar?
- Volle Auflösung: Augen, Hände, Anatomie, Gegenstände, Spiegelungen,
  Perspektive, Licht und Schatten stimmig. Beispiel aus dem Interview: das Auge
  in einer Lupe muss zum Auge der Figur passen.
- Schreibweise, Wortmarke, Kanten.
- Sichtbare KI-Fehler werden vorher behoben oder das Motiv vereinfacht.

**Video [F]:** Remotion (§7), Bewegungen aus §5. Gemalte Website-Bilder dürfen
in 2.5D bewegt werden (Ebenen, Kamerafahrt, Zwei-Bild-Wechsel), dazu
kinetische Schrift. Kurzfassung 6–15 s muss stumm funktionieren.

[?] Offen: Bildanbieter und dessen Kostengrenze; welche abgenommenen
Website-Bilder als Stil-Vorlagen dienen (wählt Mattia); Wochentage je Format.
