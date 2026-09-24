# DESIGN.md — signedbymattia

Stand: 24.09.2026 · Status: **Identität „Edition“ entschieden, Umsetzung offen** ·
Zielplan KW 43 („Gestaltungsrichtung festlegen: Typografie, Farben,
Bildsprache“), **vorgezogen**: Identität vor Website (Entscheid 24.09.2026)

**Entschieden am 24.09.2026 [F]:** Identität „Edition“ nach Interview mit
Bildbeispielen. Markenübersicht:
[`entwuerfe/identitaet-edition-v2.html`](entwuerfe/identitaet-edition-v2.html).
Die früheren drei Richtungen (`entwuerfe/markenrichtungen.html`, A Signatur,
B Editionen, C Nachtlicht) sind damit abgelöst und bleiben nur als Verlauf.

**Reihenfolge Identität:** ~~Richtung wählen~~ → ~~Werte hier eintragen~~ →
eigenes Barock-Bild → Logo/Wortmarke (SVG, PNG) → Vorlagen (Offerte, Rechnung,
E-Mail-Signatur, LinkedIn-Grafik, Präsentation, Zertifikat) → Website.

Diese Datei beschreibt die visuelle Identität so, dass ein Agent sie ohne
Rückfrage anwenden kann: Website, LinkedIn-Grafiken, Videos, Dashboard,
Offerten. Aufbau nach der Spezifikation
[google-labs-code/design.md](https://github.com/google-labs-code/design.md)
[A: Format beim Ausfüllen gegen die Spezifikation prüfen]. Beispiele echter
Marken: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md),
nur als Anregung, nicht übernehmen. Grundregeln: [`ui-regeln.md`](ui-regeln.md).

Alle Werte mit `?` sind offen. Kein Agent setzt sie ohne Mattias Entscheid.

## 1. Charakter und Idee

Drei Adjektive, die die Marke visuell trägt [F]: **innovativ, kreativ,
farbenfroh.** Vorbilder: `referenzen.md` (Sofi Health, Emotion Agency, Shopify
Editions Winter 2026).

**Leitidee „Edition“ [F]:** Alte Meister haben ihre Werke signiert und
nummeriert. signedbymattia macht das mit Websites: Jede Kundenseite ist eine
**Edition mit Nummer**, signiert von Mattia.

- **Welt:** Barock-Collage wie Shopify Editions (Renaissance Edition), mit dem
  Raumgefühl von basement.studio. Aus zehn echten Seiten gewählt: basement und
  die Kunst-Collage.
- **Epoche:** **Barock**, vor allem der Himmel (Tiepolo).
- **Ton:** **Ehrfurcht mit Augenzwinkern.** Die Bilder bleiben schön und ernst,
  der Witz steckt im Detail (ein Engel hält den Mauszeiger).
- **Schrift-Philosophie:** Die Grotesk ist das **System** (das Digitale). Die
  kursive Serif ist die **Hand**, also das, was Mattia signiert. Genau ein Wort
  pro Headline ist „von Hand“.

Wirkung, die vermieden wird: generische Agentur, Tech-Startup-Lila,
Stock-Look, KI-Look.

## 2. Farben (jede Farbe hat eine Rolle) [F]

Pastell-Himmel plus pastelliges Signal.

| Rolle | Token | Wert | Kontrast geprüft |
| --- | --- | --- | --- |
| Hintergrund hell, Grund überall | `--color-bg` | `#FBF3EA` Creme | – |
| Kapitel 1 | `--color-chapter-1` | `#D9CCF5` Flieder | Tinte 10.8:1 |
| Kapitel 2 | `--color-chapter-2` | `#CFE3F7` Himmel | Tinte 12.4:1 |
| Kapitel 3 | `--color-chapter-3` | `#FFD6C2` Pfirsich | Tinte 12.1:1 |
| Text, Markenbasis | `--color-text` | `#231B3A` Tinte | auf Creme 14.8:1 |
| Text gedämpft | `--color-text-muted` | `#6A5F80` | auf Creme 5.4:1 |
| CTA, Signal (nur Knöpfe, Links) | `--color-accent` | `#FF9DC8` Pastell-Pink | Tinte darauf 8.5:1 |
| Detail (Rahmen, Zertifikat) | `--color-gold` | `#E3C58A` Pastell-Blattgold | Tinte darauf 9.8:1 |
| Hintergrund dunkel (Akt II Galerie) | `--color-bg-dark` | `#15122A` Nacht | Pink darauf 9.5:1 |

**Regeln:**

- **Knopftext immer Tinte**, nie Weiss.
- **Knöpfe mit dünner Tinten-Kontur** (`inset 0 0 0 1.5px`). Grund:
  Pastell-Pink hebt sich von Creme (1.8:1) und Flieder (1.3:1) kaum ab.
- Blattgold nur als Detail, nie als Fläche für Text in Kapiteln.
- Gradients nur innerhalb einer Farbe, dunkel zu hell. Helle und dunkle
  Kapitel geplant und rhythmisch: Akt I hell (Himmel), Akt II dunkel (Nacht).

## 3. Typografie (zwei Familien, drei Rollen) [F]

Aufbau wie Shopify Editions: fette Grotesk, gerade Serif für die Unterzeile,
kursive Serif für ein einzelnes Wort.

| Rolle | Familie | Gewichte | Lizenz |
| --- | --- | --- | --- |
| System: Headlines, fette Listen, Navigation, Text, Formulare | **Host Grotesk** | 400, 500, 600, 700 | Google Fonts, SIL OFL [A: vor Einbau prüfen] |
| Unterzeile, ruhige Aussagen | **Instrument Serif** gerade | 400 | Google Fonts, SIL OFL [A: vor Einbau prüfen] |
| Hand: ein Wort pro Headline, römische Zahlen, „No.“ | **Instrument Serif** kursiv | 400 | wie oben |

- Headlines eng gesetzt (Laufweite ca. −0.035em), das kursive Wort weniger eng
  (ca. −0.01em).
- Inter ist verworfen (gefällt nicht).
- Skala `?` (z. B. 1.25), Zeilenlänge Fliesstext 60–75 Zeichen.

## 4. Logo und Taglines [F]

**Logo:** schlicht **signed** *by* **mattia**: „signed“ und „mattia“ in Host
Grotesk 600, „by“ in Instrument Serif kursiv. Einzeilig oder zweizeilig
(„signed“ / „*by* mattia“). Keine Editions-Zeile im Logo.
Datei (SVG, PNG) und Schutzzone: `?`.

**Editions-System:** Jede Kundenwebsite bekommt eine Laufnummer:
„Edition *No.* 014“, dazu Ort und Jahr in römischen Zahlen (MMXXVI).
Leistungen werden römisch nummeriert:

| Nr. | Leistung |
| --- | --- |
| I | Website Core |
| II | Automation Core |
| III | SEO + GEO |
| IV | Google-Profil |
| V | Texte + Branding |

**Taglines (je eine Rolle):**

- **„Kein Template. Ein *Werk*.“**: Haupt-Tagline für Offerte, LinkedIn und
  Zertifikat.
- **„Gemalt in *Code*.“**: grosse Zeile im Website-Hero.

## 5. Raum, Form, Tiefe

| Token | Wert |
| --- | --- |
| Abstands-Grundeinheit | `?` (z. B. 4 oder 8 px) |
| Radius Knöpfe | `999px` (Pille) [A: aus der Markenübersicht] |
| Radius Flächen klein / gross | `?` / `?` (Markenübersicht nutzt 6 / 8 px) |
| Schatten | weich, viel Blur, wenig Kontrast; Wert `?` |
| Maximale Inhaltsbreite | `?` |

## 6. Bildsprache [F]

**Barock-Himmel mit Web-Dingen:** Browserfenster, Mauszeiger, Handy und
Farbfelder schweben zwischen Wolken und Engeln.

**Eigenes Barock-Bild, als Mischung hergestellt:**

1. **Basis:** echte gemeinfreie Werke, vor allem Tiepolo aus dem Met Museum
   (Open Access, CC0). Platzhalter in der Markenübersicht: Tiepolo, „Allegory
   of the Planets and Continents“, 1752 (`entwuerfe/art-barock.jpg`).
2. **KI nur für fehlende Teile**, z. B. mit Higgsfield: der Putto mit der
   Feder, Engel mit Browserfenster.
3. **Titelbild:** die **Signatur-Szene**. Ein Putto setzt die Signatur, im
   Himmel schweben Web-Dinge.
4. Einzelne Engel und Objekte werden freigestellt und als Bausteine für
   Website, LinkedIn und Offerte genutzt.

Keine fremden Fotos ohne Rechte. Jede Quelle wird mit Lizenz festgehalten.

## 7. Bewegung und Wow

Nach `ui-regeln.md`: keine Deko-Animation, kein Scroll-Hijacking,
`prefers-reduced-motion` respektieren, Inhalt ohne JavaScript lesbar.
Mikro-Interaktionen erwünscht.

**Wow in zwei Akten [F, Richtung]**, gewählt aus vier Vorschlägen:

- **Akt I, Himmel (hell):** Beim Scrollen fliegt man durch pastellige
  Wolkenebenen. Engel und Browserfenster ziehen in der Tiefe vorbei.
  Quelle/Werkzeug: `scroll-world` (Tool Box) mit Higgsfield, oder
  Parallax-Ebenen in CSS/JS.
- **Akt II, Galerie (dunkel):** Man landet in einem barocken 3D-Saal. Die
  Editionen hängen als Gemälde an der Wand. Werkzeug: Three.js, allenfalls
  `img2threejs` (Tool Box). Weiche Übergänge mit `oil-motion`.

Stand im Wow-Ablauf: Schritt 1 (Vorschlag) und 2 (Quelle) erledigt. Als
Nächstes folgen Prototyp, Mattias Änderungen und Abschluss. Ladezeit am Handy
und eine ruhige Variante bei `prefers-reduced-motion` werden beim Abschluss
geprüft.

## 8. Anwendungen

| Anwendung | Format | Besonderheit |
| --- | --- | --- |
| Website | responsive | zuerst mobil; Hero „Gemalt in *Code*.“, CTA „Edition anfragen“ [A] |
| LinkedIn-Grafik | 1080×1350, 1200×627 | Text gross, wenig Wörter, Barock-Bausteine |
| LinkedIn-Video | 1080×1350 oder 1080×1920 | Untertitel immer eingebrannt |
| Offerte/PDF | A4 | Editions-Nummer, Tagline „Kein Template. Ein *Werk*.“; Layout `?` |
| **Echtheitszertifikat** [F] | Karte/PDF `?` | bei jeder Übergabe: „Edition No. …“, Kunde, Ort, Livedatum römisch, Signatur Mattia, Goldrahmen |
| Logo | SVG, PNG `?` | Schutzzone offen |
