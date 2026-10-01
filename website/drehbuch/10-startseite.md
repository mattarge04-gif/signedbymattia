# Drehbuch 10–16: Startseite

Stand: 29.09.2026 · Status: **Ordnung entschieden [F], Motive Vorschlag v3 [A]** · Grundlage:
`00-grammatik.md` (Werte), `01-bausteine.md` (B1–B15), `02-mechaniken.md` (M1–M14),
`website/seitenstruktur.md`, `marke/DESIGN.md` §7

## Prinzip [F] (Mattia, 29.09.2026)

- **Wenige Kapitel, jedes mit dem Vom-Stuhl-hau-Effekt:** 4 grosse Choreografien in 3–4 Stationen,
  gesteuert vom Scroll (nie gekapert). Bei jeder Station wechselt ein kurzer Text.
- **Eigene Motive, echt barock.** Von Shopify übernehmen wir Mechaniken (wie etwas fliegt, sich öffnet,
  reisst), **nie Motive** (kein Maler am Entwurf, keine Hand mit Handy, keine Plakatwand). Motive kommen
  aus dem Barock selbst: Deckengemälde, Trompe-l'œil, Wasserspiele, Automaten, Spiegelsaal, Galeriebild,
  Luzerner Barock.
- **Ein Lächeln pro Szene:** Barock + frecher Bruch mit einem Gegenstand in Pink (`--color-accent`) oder
  Pastell. Bilder: **Met-Werke (CC0) + unser Twist** als Collage. Der Witz geht gegen die Figuren oder
  Mattia, nie gegen Kunden oder Konkurrenz (`marke/tonalitaet.md`).
- **Irgendwo lebt immer etwas**, auch im Stillstand. **Die Maus weckt die Karten** (M9).
- **Rhythmus:** Szene (Staunen) → Papier mit **Grafik-Teil (B15)**, klar und ungemalt → Szene.
- **Texte** sind `[Platzhalter]` (Textinterview, `marke/stil.md`). Beispiel-Anzeigen (Suche, Chat,
  Profil) tragen sichtbar „Beispiel", keine erfundenen Zahlen (`grundlagen/ausschluesse.md`).
- **Keine Preise auf der Startseite** ausser auf den Tarot-Karten; Kapitel ohne Karte nur mit Knopf.

## Ablauf

```
10 Hero ─► 11 I Website ─► 12 II Automation ─► 13 III Sichtbar ─► 14 Zwischenspiel ─► 15 Werke ─► 16 Abschluss
      └────────── zwischen den grossen Szenen: Ölfarben-Auflösung (M8) ──────────┘
```

Kapitel-Index im Hero: **I Website · II Automation · III Sichtbar · Werke**. Kapitel-Leiste links (B13).

---

## 10 · Hero „Gemalt in *Code*." — Das Deckengemälde

- **Frage:** „Bin ich hier richtig?"
- **Motiv (Barock: Deckenmalerei, Blick von unten in den Himmel):** Man schaut in ein Deckengemälde wie
  in einer Barockkirche. Am Rand eine Heilige, deren **Heiligenschein ein Ladekreis** ist. Ein **Amor
  (Putto mit Bogen)** zielt; seine Pfeile haben **pinke Mauszeiger als Spitze**.
- **Stationen:**
  1. **Ankommen:** Bleistiftskizze, **goldene Konstruktionslinien (M14)** zeichnen sich. Der
     Heiligenschein-Ladekreis läuft, solange die Bilder laden.
  2. **Ausmalen:** Ist alles geladen, schliesst sich der Ladekreis zum goldenen Heiligenschein, ein kleiner
     Glanz, und die Szene malt sich aus. (Lächeln: das Laden selbst ist der Witz.)
  3. **Himmelsflug (Scroll):** Die Kamera steigt in die gemalte Kuppel hinein, Wolkenebenen ziehen vorbei,
     ein Putto fliegt nah an der Kamera vorbei.
  4. **Ölfarben-Auflösung (M8)** in Kapitel I.
- **Maus / Finger (eigener Twist „Amors Pfeil"):** Der Amor dreht Bogen und Blick weich zum Zeiger (folgt
  federnd). **Klick oder Tippen auf die Szene:** Er schiesst einen Mauszeiger-Pfeil, der im Wort *Code*
  stecken bleibt und nachfedert (`--ease-pointe`). Höchstens 3 Pfeile, dann zuckt er mit den Schultern.
- **Lebt:** Wolken ziehen langsam, der Amor atmet (leichte Schwebe).

## 11 · Kapitel I Website — Trompe-l'œil

- **Frage:** „Was bekomme ich, wenn er meine Website macht?"
- **Motiv (Barock: Trompe-l'œil, gemalte Scheinarchitektur):** Eine Palastwand mit einem **gemalten
  Torbogen**, so echt, dass er räumlich wirkt. Auf einem Baugerüst davor arbeiten **Putti mit pinken
  Bauhelmen**, einer rollt mit einem **Farbroller** Pastell auf den Stuck.
- **Stationen:**
  1. **Auftakt (M1):** Kapitelwort „Website" steigt durchs Bild, Erzählsatz mit Initiale (B2).
  2. **Die Täuschung kippt:** Die Kamera fährt auf den gemalten Torbogen zu; im letzten Moment wird aus
     der Malerei ein **echtes Browserfenster** (Rahmen = Stuck), die Illusion wird Wirklichkeit.
  3. **Bau (M2-artig):** Im Fenster baut sich die Seite auf: Kopfzeile, Bild, Text und Knopf **fallen wie
     Stuckteile an ihren Platz** und federn nach; die Putti schrauben den letzten Knopf fest.
  4. **Gerüst ↔ fertig:** Regler über dem Fenster (einmal selbst, dann Maus/Finger): links Rohbau mit
     Gerüst und Putti, rechts die fertige Seite. Danach Papier (M7).
- **Lebt:** Ein Putto auf dem Gerüst lässt den Farbroller ab und zu fallen und fängt ihn wieder.
- **Papier + Grafik (B15):** **Seitenbaum** als feine Linienzeichnung: Startseite verzweigt sich in bis zu
  5 Seiten, Linien wachsen beim Einscrollen. Karten wecken sich (M9): „auf dem Handy" dreht ein
  Handy-Umriss, „Anfragen" zeigt ein Formular. **Ablauf als Zeitleiste (M11).** Grenzen (B9).
- **Tarot-Karte I „Das Werk":** CHF 1'600, „Ins Atelier legen", Link Kaufseite I.

## 12 · Kapitel II Automation — Die Wasserspiele

- **Frage:** „Welche Arbeit nimmt mir das ab?"
- **Motiv (Barock: Gartenkaskaden, Wasserautomaten und Scherzbrunnen, die Besucher nass spritzen):**
  Ein Barockgarten. Ein Gelehrter **schläft im Liegestuhl**, pinke Schlafmaske auf der Stirn, während
  hinter ihm eine **Kaskade** von selbst arbeitet.
- **Stationen:**
  1. **Auftakt (M1):** Kapitelwort „Automation".
  2. **Anflug (M2):** Die Kaskade als **3D-Objekt** (Pastell-Marmor, 4 Becken) fliegt ins Bild und dreht sich.
  3. **Explosionsansicht (M3):** Die Kamera kippt hoch, die 4 Becken schweben auseinander, jedes
     beschriftet: *Anfrage kommt* → *wird sortiert* → *Antwort geht raus* → *Termin steht*.
  4. **„Probier es":** Beispiel-Offertanfrage, Knopf „Absenden" → eine **pinke Kugel** hüpft von Becken zu
     Becken, jedes Becken plätschert auf, am Ende ein sortierter Eintrag + Antwort. Zum Schluss spritzt
     ein **Scherzbrunnen** dem Schlafenden ins Gesicht, er wacht auf, schaut, schläft weiter. Nichts wird
     gesendet.
- **Lebt:** Das Wasser läuft leise, der Schläfer atmet.
- **Papier + Grafik (B15):** **Viele Linien laufen in einen Punkt** (wie Shopifys Rollouts-Grafik): links
  viele kleine Anfragen-Punkte, sie ziehen sich über Linien zu einem sauberen Eingang zusammen, rechts
  kommen geordnete Antworten heraus. Keine Prozentzahlen. Karten wecken sich (M9) und zeigen die
  automatische Antwort. Fachwörter als Tags (B10).
- **Tarot-Karte II „Das Rad":** ab CHF 500, + CHF 400 je weiterer Ablauf.

## 13 · Kapitel III Sichtbar — Der Spiegelsaal

- **Frage:** „Wie werde ich gefunden, bei Google, auf der Karte und bei ChatGPT?"
- **Motiv (Barock: Spiegelsaal, Handspiegel in Porträts, Merians Stadtansicht von Luzern 1642):**
  Eine Barockdame mit Handspiegel in einem Spiegelsaal.
- **Stationen:**
  1. **Auftakt (M1):** Kapitelwort „Sichtbar".
  2. **Spiegelsaal:** Beim Scrollen gleitet die Kamera durch die Spiegel; in den Spiegeln erscheinen
     **Beispiel-Suchtreffer** zu „webdesign luzern", die Spiegel drehen sich, bis „signedbymattia" im
     vordersten steht.
  3. **Die Stadt:** Ein Spiegel zeigt **Merians Luzern**; ein Putto rammt einen **pinken Karten-Pin** wie
     eine Fahne auf die Kapellbrücke, die Beispiel-Profilkarte klappt auf, Sterne füllen sich.
  4. **„Spieglein, Spieglein":** Die Dame hebt ihren Handspiegel: „Wer macht in Luzern die schönsten
     Websites?" Im Spiegel schreibt sich eine Beispiel-Chatantwort mit signedbymattia. Die Dame zieht
     eine Augenbraue hoch. (Lächeln, klar als Beispiel markiert.)
- **Lebt:** Lichtreflexe wandern über die Spiegel.
- **Papier + Grafik (B15):** **Linien von vier Quellen** (Google, Karte, ChatGPT, Perplexity) laufen zu
  einer Website zusammen und leuchten nacheinander auf. Was ich mache, ehrlich „ohne Garantie auf
  Platz 1". Karten wecken sich (M9).
- **Tarot-Karten III „Der Stern" (CHF 690) und IV „Die Welt" (CHF 290)**, zusammen golden: CHF 890.
  Link Kaufseite III + IV.

## 14 · Zwischenspiel Handschrift — Der Schreiber

- **Frage:** „Wer schreibt die Texte, wer macht das Logo?"
- **Motiv (Rokoko-Automat „Der Schreiber", Jaquet-Droz, Neuenburg, um 1770, ein Schweizer Stück):**
  Ein Knabe aus Holz und Zahnrädern sitzt am Pult und schreibt mit Feder.
- **Nur Bewegung, keine Preise:** Der Schreiber schreibt einen schwachen Satz (Beispiel `marke/stil.md`),
  hält inne, schaut zum Besucher, **streicht ihn mit einem pinken Strich durch** und schreibt den besseren.
  Die Augen folgen der Feder, am Schluss zwinkert er. Daneben öffnet eine Dame einen **Barockfächer**,
  dessen Segmente die Farben einer Marke zeigen; die Maus fächert ihn weiter auf. Knopf „Anfragen".

## 15 · Werke — Das Galeriebild

- **Frage:** „Wie denkt er, was hat er schon gemacht?"
- **Motiv (Barock: Galeriebilder, Sammlerkabinette voller Gemälde):** Ein Kabinett, Wand an Wand mit
  Goldrahmen; darin hängen die Editionen. Kenner mit Lupen begutachten sie, **ein kleiner Hund schnüffelt
  am Rahmen**, ein Kenner macht mit einem pinken Handy ein Selfie mit einer Edition.
- **Scroll:** Kamera gleitet am Kabinett entlang (`--color-bg-dark`), die Kenner drehen die Köpfe mit.
- **Maus:** Lupen-Zeiger, Firnis-Glanz, Plakette „Edition No. 00X · Konzept". **Klick:** Rahmen zoomt nach
  vorn → Aufgabe, Entscheidung, Grund, Link.
- **Handy:** horizontal wischen, tippen öffnet.

## 16 · Abschluss — Signiert

- **Frage:** „Wie geht es weiter?"
- Zurück in der Kuppel vom Anfang, die **Konstruktionslinien (M14)** schliessen sich zum Rahmen.
  „Kein Template. Ein *Werk*." Mattias **Signatur** zeichnet sich, ein **pinkes Wachssiegel** stempelt.
  Der **Amor** vom Anfang zielt ein letztes Mal und schiesst seinen Mauszeiger-Pfeil auf „Edition anfragen";
  der Knopf wackelt kurz.
- Knöpfe: „Edition anfragen" und „Ins Atelier".

---

## Offen [?] (Mattia)

1. 3D-Kaskade in Kapitel II: selbst modellieren oder CC0-Modell als Basis (Erklärung im Chat 29.09.2026).
2. Motive v3 bestätigen oder einzelne tauschen.

---

## Umsetzungsstand Hero (Szene 10) [F] (02.10.2026)

**Prototyp:** `marke/entwuerfe/hero/` (v2 nach UX/UI-Audit, Commit `80c6a21`), Bilder aus
`marke/assets/erster-wurf/` (KI, Gemini), freigestellt in `marke/entwuerfe/hero/bilder/`. Statt der Heiligen
eine **Muse** (Allegorie, kein religiöses Motiv; Entscheid Mattia 01.10.2026).

**Umgesetzt:** Himmel, Kuppel mit durchscheinendem Himmel, 5 Wolken, Muse mit Ladekreis-Heiligenschein
(echter Ladefortschritt) und Blinzeln, Amor zielt auf den Zeiger und schiesst den pinken Mauszeiger-Pfeil
ins Wort *Code* (nach 3 Schüssen Schulterzucken), Putto mit Kopfhörern und Mini-Website auf dem Handy,
Lichtstaub, Goldlinien, Pinsel-Zeiger mit Farbspur, Flug durch die Kuppel, Kopfzeile, Unterzeile, CTA,
Amor-Andeutung, Scroll-Hinweis, ruhige Variante, Handy-Anordnung, srcset, pausierte Schleife.

**Noch offen (nicht vergessen, Mattia 02.10.2026) [F]:**

| Nr. | Punkt | Art |
| --- | --- | --- |
| H1 | Flug kürzen (340 vh → ca. 260 vh), leere Strecke bei 60–80 % füllen | Code |
| H2 | Goldglanz wandert langsam über den Kuppel-Stuck | Code |
| H3 | Hand-Wort *Code* schimmert | Code |
| H4 | Muse nickt beim Vorbeiflug | Code |
| H5 | Farbtropfen beim Tippen auf dem Handy | Code |
| H6 | Ölfarben-Übergang ans Ende des Hero (statt Überblenden) bzw. Wolkenband (B4) | Code + Grafik |
| H7 | Echte Bleistiftskizze beim Laden; Farbe breitet sich vom Heiligenschein aus | Code (+ Skizzen-Bild) |
| H8 | Flügel schlagen (Amor, Putto) und Gewandsaum der Muse weht | 2–3 KI-Bilder als eigene Ebenen + Code |
| H9 | Putto wischt mit dem Finger übers Handy (Finger tippt im Bild noch auf den Arm) | KI-Bild nachschärfen |
| H10 | Pinselspur nur über freiem Himmel, nicht über Text | Code |
| H11 | Ease-Kurven nach `marke/tokens.css` verschieben | Code |
| H12 | Texte (Unterzeile final, Index) aus dem Textinterview | Mattia |
