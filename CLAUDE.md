# signedbymattia — zentrales Agency-Repo

Stand: 24.09.2026. Hier steht **alles, was die Agency ausmacht**: Positionierung,
Zielkunden, Angebote, Preise, Marke, Designsystem, UI-Regeln, Tonalität,
Vorlagen, Abläufe und Pflichtangaben. Alle anderen Repos **lesen** hier und
kopieren nichts. So wird eine Grundlage nur an einer Stelle geändert.

## Welche Repos es gibt

| Repo | Inhalt | liest von hier |
| --- | --- | --- |
| `signedbymattia` (dieses) | Grundlagen, Marke, Vorlagen, Abläufe | – |
| `signedbymattia-website` | die eigene Website | alles unter `grundlagen/`, `marke/`, `website/`, `recht/` |
| `agency-marketing` | Marketing-System (Research, LinkedIn, Google Ads, Orchestrator) | `grundlagen/`, `marke/` |
| `agency-automation-os` | Lead Bot (`projects/lead-engine/`), Probewebsite-Vorlage, Kundenphase (`projects/website-delivery/`), Budgets | `grundlagen/zielkunden.md`, `grundlagen/angebote-preise.md` |
| `kunde-<name>` | je Kundenwebsite ein Repo | `vorlagen/`, `marke/ui-regeln.md`, `prozesse/` |
| `obsidian-vault` | persönliches Wissen, Entscheide, Zielplan | verweist hierher |
| `life-os` | persönliches Betriebssystem | – |

Budgets und Kostenfreigaben bleiben in `agency-automation-os/projects/lead-engine/config/budgets.yaml`.

## Regeln

1. **Eine Wahrheit.** Was hier steht, gilt. Weicht ein anderes Repo ab, wird das
   andere Repo angepasst, nicht diese Datei still überschrieben.
2. **Wissensklassen** in jedem Dokument: **[F]** Fakt/entschieden · **[A]**
   Annahme, vor Gebrauch prüfen · **[?]** offen, Mattia entscheidet.
3. **Offene Punkte bleiben offen.** Kein Agent füllt ein [?] mit einer
   Vermutung. Andere Repos setzen dafür Platzhalter.
4. **Keine Kundendaten** in diesem Repo; die gehören ins jeweilige
   `kunde-<name>`-Repo. **Keine Geheimnisse** (Token, Passwörter).
5. Deutsch, Schweizer Hochdeutsch, **kein Eszett**.
6. Jede Änderung an einer Grundlage bekommt oben im Dokument ein neues
   `Stand:`-Datum und, wenn es ein Entscheid ist, einen Eintrag in
   `entscheide.md`.
7. Werkzeuge aus der AI Tool Box (`agency-marketing/docs/AI-TOOL-BOX.md`);
   für Marke und UI vor allem impeccable, taste-skill, design.md. Eigene
   Werkzeuge in `werkzeuge/` (Screenshots, Kontaktbogen, Met-CC0-Bilder),
   Diagramme mit dem Skill **archify**.
8. **Texte** entstehen nach `marke/stil.md`, Werte für Website und Grafiken
   kommen aus `marke/tokens.css`, nie kopiert.
9. **Stand-Routine** am Ende jeder Sitzung: `/stand`, dann den Abschnitt
   unten nachführen und die Übersicht in `plan/` neu erzeugen
   (`plan/README.md`).
10. **Tageslauf** (ab 29.09.2026): Abends in Mattias 2 h nur, was ihn braucht.
   Klare Aufgaben ohne ihn kommen als Auftrag nach `plan/auftraege/` und laufen
   Mo–Fr tagsüber per GitHub Actions (Budget CHF 20/Monat). Regeln:
   `plan/auftraege/README.md`. Am Ende jeder Abendsitzung fragen: Was kann
   morgen ohne Mattia laufen? Dafür den Skill `auftrag-planen` nutzen
   („bereite mir die Liste für morgen vor“).

## Aktueller Stand und nächste Schritte

Stand: 22.10.2026. Zeitplan: Vault `Zielplan.md`, Aufgabenliste `plan/aufgaben-bis-live.md`. Phase **Fundament**
(KW 39–42) endete am 18.10.2026; Zeitplan wegen verschobener Punkte prüfen [?].

**Sitzungsabschluss 28.09.:** Claude erreichte am 27.09. um 23:59 das
Sitzungslimit. Git und lokale Sitzungsdateien sind vorhanden; kein belegter
Verlust von Projektdateien. Aktueller Stand, Eigenaufwand und Planrisiken:
`plan/stand-2026-09-28.md`; Diagramm: `plan/stand-2026-09-28.html`.
Die bisherige Stundenrechnung in `plan/bis-live.workflow.json` ist wegen
erweiterter SEO-Basis und verschobener AHV-Anmeldung nicht mehr aktuell.

**Sitzungsabschluss 28.09. abends:** SEO-Basis weitgehend erledigt (PR #16,
Merge `5c6b1ad`), Nachtrag in `plan/stand-2026-09-28.md`. Andere Bereiche:
`signedbymattia-website` existiert noch nicht (Bau ab KW 43, 19.10., live
22.11.2026); `agency-marketing` nur Plan, nichts gebaut; Lead Engine in
`agency-automation-os` DEV-Stand 08.09., nichts live.

**Sitzungsabschluss 29.09.:** Erster Tageslauf lief (Bühnen-Prototyp und SVG-Initialen, PR #18
gemergt, USD 6.96 inkl. Doppellauf). Drehbuch der Website begonnen in `website/drehbuch/`:
`00-grammatik.md` (Bewegungswerte, entschieden), `01-bausteine.md` (B1–B15), `02-mechaniken.md`
(M1–M14 aus Shopify-Filmstreifen), `10-startseite.md` (v3: Hero Deckengemälde, I Website
Trompe-l'œil, II Automation Wasserspiele, III Sichtbar Spiegelsaal, Zwischenspiel Schreiber, Werke
Galeriebild, Abschluss; eigene barocke Motive, nie Shopify-Motive), `20-weitere-seiten.md` (grob).
Tageslauf 30.09. freigegeben: Bausteine M1/M7/M9 + Kapitel II als Prototyp
(`plan/auftraege/2026-09-30.md`). Danach: Mattias Rückmeldung → Nachbesserung → weitere Kapitel.

**Sitzungsabschluss 30.09.:** Tageslauf 30.09. gebaut (Bausteine M1/M7/M9, Kapitel II
Wasserspiele), Push scheiterte an der Workflow-Sperre, aus dem Laufprotokoll wiederhergestellt: **PR #25
offen** (Mattia: Technik ok, Grafik ungenügend). Befund: Met-Gemälde sind zu dunkel, es fehlen
lebende 2.5D-Ebenen. Entscheide: **alle Grafiken neu mit KI** im Stil „Barock + frecher Bruch"
(`website/drehbuch/03-bildstil.md`), Werkzeug **Google AI Pro** (privates Konto) + Gemini API für die
Masse; Bilder werden wie bei Shopify ausgeliefert (`00-grammatik.md`). Hero-Drehbuch mit 8 Ebenen im
Chat vorgeschlagen (noch nicht ausdrücklich abgenommen, nicht in `10-startseite.md` übertragen). **Erstes Bild fertig:**
`marke/assets/hero/e0-himmel.jpg`. Offen für Szene 1: Amor (Stil-Vorlage), E1 Kuppelrand (Prompts in
`03-bildstil.md`). Gemini-Tageslimit am 30.09. erreicht.

**Sitzungsabschluss 02.10. (vor Mattias Ferien) [F]:** Hero (Szene 10) und
**Kapitel I** (Szene 11) als Prototyp in `marke/entwuerfe/hero/` gebaut, alle
Bilder neu mit Gemini (Originale `marke/assets/erster-wurf/`). Kapitel I:
Browser aus dem Torbogen, Bau, Roller-Putto als ziehbarer Regler, Wolkenband
(Commit `4f6f3f4`). Offene Punkte: H1–H12 und K1–K5 in
`website/drehbuch/10-startseite.md`. *(Überholt durch 18./19.10.:)* Beim Wiedereinstieg zuerst UX- und
UI-Audit über Hero + Kapitel I (impeccable), dann Verbesserungen, dann
Kapitel II. GitHub Actions bleibt deaktiviert, PRs #25 und #26 offen, nicht
ohne Mattia mergen.

**Sitzungsabschluss 18./19.10. [F]:** Mattia ist zurück aus den Ferien.
Reihenfolge entschieden (17.10.): Baustein für Baustein, zuerst Wolkenband
und Hero abschliessen, dann Kapitel I, dann II usw.
(`website/drehbuch/03-bildstil.md`). Mattia erzeugt die Bilder selbst in
Gemini mit den Prompts aus `03-bildstil.md`; Claude prüft, benennt, stellt
frei und baut ein. Chrome/Gemini steuert Claude nicht mehr.

- Erledigt (Commit `61ce97d`): Wolkenband W-1 nahtlos gekachelt (ersetzt
  die 5 Einzelwolken im Panel von Kapitel I); H8 Flügelschlag Amor und
  Putto, Gewandsaum Muse; H9 Putto wischt übers Handy – alles als
  Zwei-Bild-Wechsel. Originale in `marke/assets/erster-wurf/`
  (`wolkenband-v1`, `amor-fluegel-v1`, `amor-fluegel-ohne-pfeil-v1` (Flügel
  auf Amor ohne gemalten Pfeil gesetzt), `putto-fluegel-v1`,
  `putto-wischt-v1`, `muse-saum-v1`); Lage der Varianten in
  `marke/entwuerfe/hero/bilder/varianten-manifest.json`. Test Desktop und
  Handy ohne Konsolenfehler.
- Offen: Mattias Rückmeldung zum Tempo der Bewegungen; Hero-Punkte H1–H7,
  H10, H11 im Code; Abnahme Hero durch Mattia; dann Kapitel I K1–K5; dann
  Kapitel II.
- [?] Nebenbefund: Putto im Hero ist auf dem Handy nicht sichtbar (war schon
  vorher so).
- [?] Phase Fundament endete 18.10.; das Textinterview (Meilenstein 18.10.)
  ist noch nicht gemacht und verschoben – Zeitplan prüfen.
- Unverändert: GitHub Actions deaktiviert, PRs #25 und #26 offen, nicht ohne
  Mattia mergen.
- Werkzeuge: Die Freisteller-Skripte (`varianten.py`, `wolkenband.py`) lagen
  nur im temporären Scratchpad und sind nicht im Repo. Die rembg-Umgebung
  bei Bedarf neu einrichten: `pip install "rembg[cpu]"`, Modell
  `isnet-general-use`. [A] Vorschlag: Skripte künftig nach `werkzeuge/`
  übernehmen.
- *(Wiedereinstieg überholt durch 20./21.10.)*

**Sitzungsabschluss 20./21.10. [F]:** Hero und Kapitel I stark weitergebaut
(Commits `61ce97d` bis `3240021`, alle auf `main`).

- Hero: Knöpfe mit gemaltem Goldrahmen (9-Slice), Titel wird gemalt (GSAP 3.13
  SplitText + DrawSVG, Standardlizenz ohne Kosten), göttliches Licht (WebGL,
  Ursprung fest), Tiefe mit der Maus, Kuppel dreht beim Flug, Putto-Handy =
  „Dating-App für Engel" (Herz, Match beim Wischen). Mattia: „10 von 10".
- Übergang Hero → Kapitel I: **Wolkenflug** als eigener WebGL-Volumen-Raymarcher
  (`wolkenflug.js`, kein Shadertoy-Code wegen CC BY-NC-SA), Sonne erleuchtet am
  Schluss, Qualität passt sich der Bildrate an. Mattia: „perfekt".
- Kapitel I neu: Musterseite **Himmelblau Haustechnik GmbH** (erfunden,
  „Musterbetrieb, frei erfunden" sichtbar) baut sich in 5 Schritten auf (Skizze,
  Inhalte, Roller-Farbe, Handy-Faltung, Live-Klick), Chrome-Fenster, eigene
  Schrift Bricolage Grotesque, Musterfoto von Gemini. Abnahme durch Mattia offen.
- impeccable-Audit 14/20, Fixes umgesetzt (Commit `f6e51d2`).
- Entscheide Mattia: kein Kapitel-Fortschritt am Rand; Putto im Hero auch auf
  dem Handy; **erst Desktop fertig, dann Handy komplett neu** (eigene
  Hochformat-Bilder, ca. 2 Abende).
- Neu: `plan/aufgaben-bis-live.md` (55 Aufgaben, Mattia ca. 17 h, Claude ca.
  37 h [A]); `website/drehbuch/12-16-naechste-kapitel.md` (Kapitel II–Abschluss
  mit Wows, roter Faden Himmelblau [A], 3 Entscheide [?]).
- [?] Offen: Pinsel-Bild (`pinsel-v1.jpg`), Abnahme Kapitel I, Textinterview
  (Meilenstein 18.10. verpasst, 22.11. knapp [A]).
- *(Wiedereinstieg überholt durch 21./22.10.)*

**Sitzungsabschluss 21./22.10. [F]:** Kapitel II (Wasserspiele) gebaut, Commits
`79e9aff` bis `266ce61`.

- Drehbuch `website/drehbuch/12-kapitel-2.md` abgenommen (namenloser Gelehrter,
  Schmetterling, Umdrehen, Anfrage „Boiler tropft, Kriens"). 9 Gemini-Bilder
  (Garten v2, Kaskade, Gelehrter schläft/wach/dreht, Brunnen-Putto, Vordergrund,
  Pergola, Abend) in `marke/assets/erster-wurf/k2-*`.
- Prototyp: echter **3D-Brunnen** (three.js, Modell „Fountain" von jolly.sweets,
  Sketchfab **CC BY 4.0 → Nennung im Impressum Pflicht**, umgefärbt
  `bilder/k2-brunnen3d.glb`), dreht beim Scrollen; Szenenwechsel Garten →
  Pergola → Abend; Ablauf-Panel „So läuft eine Anfrage durch" mit Fäden;
  lebendes Gras; Gartenplan als Karte (`gartenplan.js`). Desktop/Handy ohne
  Konsolenfehler.
- Mattia: noch nicht wie ein Video, soll **wie Shopify** wirken. Teardown
  `marke/teardown-shopify-pos-szene.md`: Shopify spult eine in Blender
  gekeyframte Objekt- und Kamera-Animation (GLB) per Scroll ab, Raum als
  Gaussian Splat, Video-Kuppel im Hintergrund.
- **Beim Wiedereinstieg zuerst:** Entscheide aus dem Teardown klären:
  (1) Motiv **Brunnen oder barocker Automat** (Vorschlag Automat, Zahnräder
  fahren auseinander), (2) Raum **Veo-Video** (Vorschlag) / Splat / Blender.
  Dann: Veo-Prompt an Mattia, Szene in Blender bauen und keyframen (Blender MCP
  läuft, Addon-Update `uvx mcp-for-blender install-addon` empfohlen), als GLB
  exportieren, im Prototyp vom Scroll spulen lassen. Aufwand ca. 1–1,5 Abende [A].
- Offen weiter: Pinsel-Bild, Abnahmen Kapitel I und II, Textinterview,
  Handy-Version neu (nach Desktop).

**Erledigt [F]:**

- Identität „Edition“: `marke/DESIGN.md`, Markenübersicht
  `marke/entwuerfe/identitaet-edition-v2.html` (PR #8).
- Persönlichkeit und Stimme: `marke/tonalitaet.md` (PR #9).
- Grafik- und Video-System: `marke/grafik-system.md` (PR #10).
- Seitenstruktur: `website/seitenstruktur.md` (PR #11).
- Anfrage-Liste Vertrauen und SEO: `website/vertrauen-und-sichtbarkeit.md` (PR #12).
- Werkzeuge (27.09.2026): Stil-Vorlage `marke/stil.md` [Mattia bestätigt ?],
  Design-Tokens `marke/tokens.css`, `werkzeuge/` mit Playwright-Skripten,
  archify fest installiert, Plan-Übersicht `plan/`.
- Konzept-Editionen in Arbeit bei Mattia: Tams, Keller-Scroll, Sofi Health.
- SEO-Basis (28.09.2026, PR #16, alle Entscheide in `entscheide.md`):
  Konkurrenz google.ch `website/konkurrenz-seo.md`; Titel und Beschreibungen
  aller Seiten `website/seo-titel.md`; JSON-LD-Vorlagen ohne FAQPage
  `website/strukturierte-daten.md`; GEO mit robots.txt (Such-Crawler ja,
  KI-Training gesperrt) und llms.txt-Entwurf `website/geo.md`; Google-Profil
  vorbereitet `website/google-profil.md` (Adresse verborgen, nicht im Repo).
- Preise sind Endpreise, kein MWST-Hinweis (`grundlagen/angebote-preise.md`
  Entscheid 4). Preismatrix: SEO + GEO CHF 690, Google-Profil CHF 290, beide
  CHF 890, Automation CHF 500 + CHF 400 je weiterer Ablauf.
- Keyword Kaufseite II neu „automatisierung kmu luzern“; „prozesse
  automatisieren kmu“ geht an einen Blogartikel (`website/keywords.md`,
  `website/seitenstruktur.md`). Volumen ungeprüft [A].
- Atelier `/preise` (Tiepolo-Leinwand, Tarot-Karten I–IV, Echtheitszertifikat
  mit vorausgefülltem Formular): `website/preisrechner.md`, Prototyp
  `marke/entwuerfe/atelier-prototyp.html` von Mattia abgenommen.

**Nächste Schritte, in dieser Reihenfolge:**

1. ~~Blog-Themen und Keywords~~: erledigt 27.09.2026, `website/keywords.md`
   (geclustert mit claude-seo), Anzeigen-Nachtrag in agency-marketing PR #15.
   Offen: Volumen im Google Keyword-Planer prüfen.
2. ~~SEO-Basis mit claude-seo~~: weitgehend erledigt 28.09.2026 (siehe oben),
   `website/checkliste-vorbereitung.md` §5: 4 von 7 abgehakt. Offen:
   Keyword-Planer (Mattia), Google-Profil anlegen (sobald Logo und Porträt
   da sind), technischer Check nach dem Bau.
3. **Texte gemeinsam** im Interview (noch nichts entwerfen, bevor Mattia es
   sagt; Meilenstein 18.10.): Startseite (Mattia schreibt), 3 Kaufseiten,
   Editionen, 3 Blogartikel. Was Mattia dafür liefern muss:
   `website/checkliste-vorbereitung.md` §1. Danach Zugänge §3 (geschäftliches
   Google-Konto, E-Mail, Hosting, DNS), dann Keyword-Planer, dann Logo und
   Porträt, dann Google-Profil anlegen.
4. Netzwerk Stadt Luzern: Netzwerk Neubad, *zünder, Wirtschaftsverband
   Stadt Luzern (`website/vertrauen-und-sichtbarkeit.md` §3a).
- **Anmeldung Ausgleichskasse:** nicht mehr bis 18.10., sondern **mit dem
  ersten Auftrag** (WAS Luzern verlangt Belege). Vorher Offerte-, Vertrags-
  und Rechnungsvorlage bereit haben.
5. [?] Kosten der KI-Stimme prüfen (`marke/grafik-system.md` §5), Budget Higgsfield.
6. Später: Barock-Bibliothek `marke/assets/` (KW 43), Grafik- und Video-Skill (vor KW 01).

**Kommt erst mit der Website** (bis dahin nur dokumentiert in `DESIGN.md`):
Raum-Tokens, Logo-Dateien (SVG, PNG), eigenes Barock-Bild, Freisteller für
Collagen, Prototypen der Wow-Akte als 2.5D-Bühne (Himmelsflug, Galerie),
Ölfarben-Übergang, SVG-Initialen (Entscheid 28.09.2026, `marke/DESIGN.md` §7).
