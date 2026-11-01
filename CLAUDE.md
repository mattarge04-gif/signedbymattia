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
11. **Tokens sparen** (Mattia, 31.10.2026):
   - **Eine Sitzung = ein Baustein.** Neue Sitzung, sobald (a) ein Baustein
     abgenommen ist, (b) das Thema wechselt oder (c) Claude meldet, dass der
     Verlauf lang wird (Faustregel: nach rund 2 h oder vielen Bildern).
     Wechsel: Claude macht die Stand-Routine (`/stand`, Commit) → Mattia tippt
     `/clear` → erste Nachricht „weitermachen“ → Claude liest „Beim
     Wiedereinstieg zuerst“.
   - **`/compact`** tippt Mattia mitten in einem Baustein, wenn Claude es
     vorschlägt, mit Fokus, z. B. `/compact Fokus Kapitel II Baustein 3`.
   - **Routinearbeit an Helfer:** Freistellen, Videos aufnehmen, Kontaktbögen,
     Bildschirmfotos, Konsolen-Check → `pruefer` (Haiku) oder `umsetzer`
     (Sonnet). Claude (Opus) macht nur Entwurf, Szenen-Code und Urteil.
     Sichtprüfung zuerst durch Codex (ChatGPT-Abo); Claude schaut höchstens
     einen Kontaktbogen pro Prüfschritt an, keine Einzelbilder.

## Aktueller Stand und nächste Schritte

Stand: 01.11.2026 (sehr spät, Morgen). Zeitplan: Vault `Zielplan.md`, Aufgabenliste `plan/aufgaben-bis-live.md`. Phase **Fundament**
(KW 39–42) endete am 18.10.2026. **Livegang neu 17.12.2026** (Entscheid 28.10.).

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
  (Meilenstein 18.10. verpasst; neu in KW 45, siehe 28.10.).
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

**Sitzungsabschluss 22./23.10. [F]:** Kapitel II umgestellt auf **barocken
Automaten, gemalt in 2.5D** (Commits bis `8ad349c`).

- 3D-Brunnen und selbst gebauter 3D-Automat verworfen (Mattia: sieht billig aus,
  Qualität weit unter dem Hero). Skybox AI verworfen. Gemini kann keine 360°- oder
  Rundum-Ansichten.
- Vorhanden: gemalter Automat ganz (`k2-automat-ganz.jpg`, leichter Nebel) und
  zerlegt (`k2-automat-teile.jpg`) → 8 Teile per `werkzeuge/k2_ebenen.py`
  (`bilder/k2-am-*.webp`, `k2-am.json`); Heckenbogen und Balustrade als
  Vordergrund; Garten ohne Himmel; Veo-Anflug `k2-flug-v1.mp4` als Bildfolge.
  Prototyp `automat25d.js` + `kapitel2.js`. Lizenz-Pflichten im Impressum: Brunnen
  (jolly.sweets) nur falls wieder genutzt, Putto-Statue (ZeusAlmighty) nur im
  3D-Automaten, beide CC BY.
- Mattia sieht bei sich beim Scrollen keine Bewegung in Kapitel II ([?] Console
  prüfen, Cache).
- **Neues Vorgehen [F] (Mattia):** 5 Stationen + 4 Übergangsvideos, **Station für
  Station**: Szene planen → 2.5D-Bilder → Standbild-Animationen und Text festlegen
  → bauen, abnehmen → Veo-Übergang → nächste Station.
- **Beim Wiedereinstieg zuerst:** (1) Console-Screenshot von Mattia, warum sich
  nichts bewegt. (2) **Station 1 „Anfrage kommt an"** ist geplant und von Mattia
  abgenommen (Garten früher Abend, Automat geschlossen gross in der Mitte,
  Gelehrter links, Balustrade vorne; Brief fliegt in Briefschlitz, Walze dreht;
  Text „Automation" + Karte „I · Anfrage kommt an"; Übergang: Kamera fährt heran,
  Kuppel öffnet sich). Offene Detailfragen: Brief per Taube? Panel oder nur Karte?
  Dann Bild-Prompts für Station 1 (Automat ohne Nebel, Briefschlitz einzeln).
- *(Wiedereinstieg überholt durch 28.10.)*

**Sitzungsabschluss 24.10. und 28.10. [F]:**

- 24.10.: Videos vom Stand aufgenommen (`plan/videos/stand-2026-10-24.mp4`,
  `plan/videos/hero-2026-10-24.mp4`), Skript `werkzeuge/video.cjs`.
- 28.10.: Bei bisherigem Tempo (rund ein Teil der Startseite pro Woche) wäre
  der Livegang erst Mitte Januar 2027 gewesen [A]. Mattia setzt das Ziel
  **17.12.2026**. Neuer Wochenplan KW 44–51 mit Regeln in
  `plan/aufgaben-bis-live.md`: pro Teil eine Woche, höchstens ein Neuanfang;
  Texte laufen jede Woche mit; Zugänge bis 15.11.; Streichliste bei Engpass.
  Vault `Zielplan.md` noch auf 22.11. [?] (ausserhalb dieses Repos).
- *(Wiedereinstieg überholt durch 29.–31.10.)*

**Sitzungsabschluss 29.–31.10. [F]:** Kapitel II komplett neu, nach Hero-Methode.

- Werkzeuge neu: **Codex als Prüfer** (`werkzeuge/pruefen.sh`, `pruefliste.md`, ChatGPT-Abo,
  prüft nur Technik); **Bilder selbst über Vertex AI** (`werkzeuge/bild.py`, Projekt
  `signedbymattia-bilder`, Guthaben aus Google AI Pro USD 10/Monat, Budget-Warnung CHF 9, Stopp
  USD 8; Oktober aufgebraucht 7.88); Scroll-Prüfung `werkzeuge/scroll-pruefen.cjs`.
- Zwei Fehlversuche verworfen (Brieftaube/Automat; „Nachtschicht“ aus einem Masterbild, Codex 5/10,
  Mattia: Qualität ungenügend). Entscheid 31.10.: **Hero-Methode, Qualität vor Termin**
  (Tiefenplan → Stiltest → einzeln gemalte Ebenen → Baustein für Baustein mit Video-Abnahme).
- Geschichte **Fassung 2** abgenommen: Schreibstube bei Nacht, Putti + Rohrpost als Helfer, **Handy
  im Goldrahmen** zeigt jeden Schritt, Pointe Sperrbildschirm „Sie haben geschlafen. Ihr Betrieb
  nicht.“ (`website/drehbuch/12-kapitel-2.md`).
- **Baustein 1 abgenommen** („passt sehr gut“): Bühne aus Ebenen (`werkzeuge/k2_buehne.py`,
  `bilder/k2b/`), Tiefe mit Maus, Nachtlicht, Mondstaub, Sterne, Vorhang-Auftakt. Video
  `plan/videos/k2-baustein1-2026-10-31.mp4`.
- **Baustein 2 abgenommen:** 4 schlafende Putti (atmen, schnarchen), **Handy wie Apple in Pink**
  (CSS, Rosé-Metall, Dynamic Island, Hero-Himmel als Sperrbildschirm), **Eintauchen ins Display**
  mittig, Nachricht als echte iPhone-Mitteilung. Referenzen `marke/referenzen/k2-handy/`. Video
  `plan/videos/k2-baustein2-v3-2026-10-31.mp4`. Letzter Commit `b1d0a2a`.
- Regel 11 Tokens sparen (siehe oben).
- Vorschau lokal: `python -m http.server 8766` in der Repo-Wurzel, dann
  `localhost:8766/marke/entwuerfe/hero/index.html`.
- *(Wiedereinstieg überholt durch 31.10. nachmittags)* **Beim Wiedereinstieg zuerst:** (1) Ab 01.11. ist das Bild-Guthaben neu: 4 **wache Putti**
  erzeugen (gleiche Haltungen wie `marke/assets/k2/ebenen/putto-schlaf1–4`, Stil `stiltest/putto-v3`),
  freistellen, in `k2_buehne.py` einbauen. (2) **Station II** bauen: Putti wachen auf, einer liest das
  Handy, pinke Büchse fährt durch die Rohrpost; Video an Mattia. (3) [?] **VPS als Vorschau-Server**:
  Mattia liefert Anbieter, OS, RAM, SSH-Zugang (selbst eingerichtet) und ob DNS für
  `vorschau.signedbymattia.ch` geht. (4) Zeitplan: Kapitel II verschiebt den Wochenplan um ca. 1 Woche
  (`plan/aufgaben-bis-live.md`), Ausgleich über die Streichliste.

**Sitzungsabschluss 31.10. nachmittags [F]:**

- Kapitel II **Station II „gelesen“ gebaut** (Baustein 3): 4 wache Putti (Zwei-Bild-Wechsel,
  nacheinander), 2 Putti am Pult halten den Goldrahmen, Display „✓✓ Gelesen“, pinke Büchse springt
  ins Rohr, Leuchten fährt das Rohr hinauf, Kamera folgt und bleibt im Bild, Uhr 21:48. Scroll
  0.30–0.44. Prompts in `website/drehbuch/12-kapitel-2.md` (Abschnitt „Prompts Station II“); die
  Bilder hat Mattia selbst in Gemini erzeugt (Bild-Guthaben Oktober aufgebraucht, USD 7.88 von 8).
  Gemini ändert beim Bearbeiten das Format (1696×2528 → 1792×2400); `werkzeuge/k2_buehne.py` setzt
  die wachen Putti deshalb per Bildhöhe und Fachboden. Commits `2e875c7`, `3626932`. Video
  `plan/videos/k2-baustein3-2026-10-31.mp4`. **Abnahme durch Mattia offen.**
- [A] Satz „21:48. Die Helfer sind wach und lesen mit.“ ist Platzhalter.
- [?] Auffällig: Putto oben links wirkt wach kaum anders als schlafend; Putto mit offenen Flügeln
  ragt übers Fach.
- **Vorschau-Server eingerichtet:** https://vorschau.signedbymattia.ch (Hostinger-**VPS**, nicht
  Webhosting; Standort UK; Passwortschutz, Benutzer `mattia`, Passwort nur bei Mattia; noindex).
  Hochladen: `bash werkzeuge/vorschau.sh`; einmalige Einrichtung `werkzeuge/vorschau-einrichten.sh`
  (Commit `92923ae`). Auf dem VPS laufen auch n8n, hood.signedbymattia.ch und ein Video-Bot;
  Caddy-Container `n8n-caddy-1`, Config `/opt/n8n/Caddyfile`, Sicherung `Caddyfile.bak-2026-10-31`;
  **nur den eigenen Block anfassen.** Schreibende Server-Befehle blockiert die Auto-Mode-Prüfung,
  Mattia führt sie mit `!` aus. Damit ist Punkt (3) VPS aus dem vorherigen Wiedereinstieg erledigt.
- [?] Standort UK für die Live-Seite bei Aufgabe 19 klären.
- *(Wiedereinstieg überholt durch 31.10. abends)* **Beim Wiedereinstieg zuerst:** (1) **Kapitel I überarbeiten** – Mattia ist noch nicht zufrieden;
  zuerst fragen, was genau stört (mit Vorschau/Video), dann Plan zeigen. (2) Danach Abnahme
  Station II, dann Station III „sortiert“ (Büchse gefangen, Fach „Dringend“). (3) Zeitplan prüfen
  (`plan/aufgaben-bis-live.md`).

**Sitzungsabschluss 31.10. abends [F]:** Kapitel I Überarbeitung geplant, Baustein 1 gebaut.

- **Plan abgenommen** (Mattia): Aufbau bleibt, Wolkenflug nicht anfassen („perfekt“). Ablauf neu:
  Tür → billige Baukasten-Seite → Putti wischen → coole UI-Seite (Spacing stimmt, hat Leben) →
  Handy → Live-Klick. Die Schritte Skizze und Inhalte fallen weg. Bausteine K1-B1 bis K1-B5 in
  `website/drehbuch/10-startseite.md` (Abschnitt „Überarbeitung Kapitel I“).
- **K1-B1 gebaut:** gemalte Tür im Torbogen (`marke/entwuerfe/hero/tuer.js`, Bild
  `marke/assets/erster-wurf/k1-tuer-v1.jpg` von Mattia in Gemini erzeugt, Prompt K1-7 in
  `website/drehbuch/03-bildstil.md`): Risse ab Schlüsselloch, Sonne strahlt durch, Tür bröckelt
  (Voronoi-Schollen, Canvas, am Scroll), Blitz, dann Browser. Fresko-Variante (K1-6,
  `k1-fresko-v1.jpg`) verworfen. Fix: Tür war im Wolkenflug sichtbar (Commit `79ed88c`). Online auf
  https://vorschau.signedbymattia.ch.
- [A] Abnahme K1-B1 erteilt: Mattia sagte nach dem Fix „weiter zur nächsten Station“.
- [A] Blitz wirkt eher cremig als gleissend, evtl. heller machen.
- **Neue Arbeitsweise (Mattia):** kein Video mehr nach Änderungen; `bash werkzeuge/vorschau.sh`
  hochladen und „ist online“ melden. Prompts für Gemini in die Zwischenablage legen
  (Markieren im Terminal geht schlecht).
- Hinweis Helfer: `pruefer` hat beim Aufräumen versehentlich einen fremden lokalen
  `http.server 8766` (PID 34280) beendet – Helfern sagen, nur eigene Prozesse zu beenden.
  Playwright-Chromium fehlt lokal; Helfer nutzen Google Chrome (`executablePath`).
- Commits: `5c932fa`, `56034c5`, `742b800`, `c39ec7d`, `79ed88c`.
- *(Wiedereinstieg überholt durch 31.10. spätabends)* **Beim Wiedereinstieg zuerst:** (1) **K1-B2 billige Baukasten-Seite** bauen: liegt unter der Tür,
  nach dem Blitz sichtbar statt des leeren grauen Browsers; Standardschrift, gequetschte Abstände,
  Stockfoto-Slider, Seitenleiste „Kategorien“, statisch, wie ein Standard-WordPress-Thema ohne
  fremdes Logo; ersetzt Wireframe-Skizze und Inhalte-Schritt (`kapitel1.js` Schritte 1–2,
  `.hb-grau`). (2) Danach K1-B3 Putti wischen, K1-B4 Seite lebt, K1-B5 Übergang K1→K2.
  (3) Abnahme Station II Kapitel II weiterhin offen. (4) Zeitplan (`plan/aufgaben-bis-live.md`)
  prüfen.

**Sitzungsabschluss 31.10. spätabends [F]:** Kapitel I Baustein 2 gebaut und abgenommen.

- **K1-B2 billige Baukasten-Seite abgenommen** (Mattia: „passt weiter“): `.hb-billig` in
  `marke/entwuerfe/hero/index.html`, Stil `kapitel1.css`. 2. Fassung „um 2019“ (erste Fassung zu
  alt): Systemschrift, Logo-Tropfen, oranger Knopf „Jetzt anrufen!“, blaue Navigation, Slider mit
  Stockfoto, 3 Lorem-Boxen, Seitenleiste (Kategorien, Beiträge, Archiv, Facebook „Gefällt mir 87“),
  Cookie-Banner. Ersetzt Skizze, Inhalte-Schritt und Bauhelm-Putto (Code entfernt). Roller malt
  früher (Scroll 0.46–0.60).
- Stockfoto K1-8 (Monteur mit Daumen hoch) von Mattia in Gemini erzeugt: Original
  `marke/assets/erster-wurf/k1-stockfoto-v1.jpg`, Web `bilder/k1-stockfoto-600.webp`; Prompt K1-8 in
  `website/drehbuch/03-bildstil.md`.
- Fixes Übergang Tür → Website: Baukasten-Seite erst ab dem Blitz sichtbar; Palastwand und Gerüst
  verschwinden unter dem Blitz; Sonne hinter der Tür (`tuer.js`, hinterLicht) verschwindet auf der
  Blitzspitze; Browser ohne `will-change` (sonst rastert Chrome ihn klein, Seite unscharf).
  [A] Ruckeln beim Zoom auf schwachen Rechnern ungetestet.
- Befund Cache: Mattia sah den hellen Kasten noch, im Inkognito-Fenster sauber → Browser-Cache.
  [A] Caddy liefert vermutlich ohne Cache-Control. Bis zum Fix: Strg+F5 oder Inkognito.
- [?] Ein 404 beim Laden der Seite (vermutlich favicon), ungeprüft.
- Werkzeug: Playwright liegt in `node_modules` der Repo-Wurzel; Skripte von dort laufen lassen,
  Chrome per `executablePath`.
- Commits: `9ba279d`, `ee1af80`, `d9897a8`, `c2a3e7e`, `dd9231c`, `a3d2dd3`, `14cbc47`, `8cf59d8`.
  Alles online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 31.10. nachts)* **Beim Wiedereinstieg zuerst:** (1) **K1-B3 Putti wischen** planen und bauen: Roller- und
  Wisch-Putto ziehen die neue Seite Streifen für Streifen über die Baukasten-Seite; Roller bleibt
  ziehbarer Regler; zuerst Mattia den Plan zeigen und klären, ob neue Putto-Bilder nötig sind
  (Prompts in die Zwischenablage). (2) Caddy: im eigenen Block von `vorschau.signedbymattia.ch`
  `header Cache-Control "no-cache"` setzen (Mattia führt Server-Befehle mit `!` aus, nur den eigenen
  Block anfassen). (3) Danach K1-B4 Seite lebt, K1-B5 Übergang. (4) Abnahme Station II Kapitel II
  weiterhin offen. (5) Zeitplan `plan/aufgaben-bis-live.md` prüfen.

**Sitzungsabschluss 31.10. nachts [F]:** Kapitel I Baustein 3 gebaut und abgenommen.

- **K1-B3 Putti wischen abgenommen** (Mattia: „passt“): 4 senkrechte Bahnen wie Tapete. Wisch-Putto
  mit Abzieher (neu, Prompts K1-9a/b, von Mattia in Gemini erzeugt, Originale
  `marke/assets/erster-wurf/k1-putto-wischt-a-v1.jpg` / `-b-v1.jpg`, freigestellt mit neuem Skript
  `werkzeuge/k1_wischputto.py` (rembg `isnet-general-use`), Web `bilder/k1-putto-wischt-a/b(-600).webp`)
  zieht die alte Seite Bahn für Bahn weg: sie verschwimmt wie nasses Glas, nasse Kante, Seifenblasen
  in CSS. Roller-Putto rollt eine halbe Bahn dahinter die neue Seite auf (Treppen-`clip-path`), bleibt
  ziehbar, „Oops“ bleibt. Zwei-Bild-Wechsel beim Wisch-Putto.
- Technik-Befund: Chrome beschneidet `backdrop-filter` nicht auf eine Treppen-`clip-path`-Maske (nur
  auf den Umriss) → je Bahn ein eigenes Element (`#k1Grund i`).
- **Pause vor dem Handy** (Mattia): fertige Seite steht ca. 2 s still; Bahn 720vh → 810vh,
  `PAUSE_BEI = 0.68`, `PAUSE_VH = 0.9` in `kapitel1.js`. [A] 90vh ≈ 2 s Scrollen.
- [?] Prompts K1-9a/b noch nicht in `website/drehbuch/03-bildstil.md` eingetragen (stehen nur im
  Chat; Inhalt: gleicher Putto mit pinkem Bauhelm, goldener Fensterabzieher, a wischt, b holt aus).
- Prompt-Wünsche: Gemini-Prompts weiterhin in die Zwischenablage legen.
- Commits: `82c755a`, `32042e1`. Online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 31.10. spätnachts)* **Beim Wiedereinstieg zuerst:** (1) **K1-B4 „Neue Seite lebt“** in der Pause vor dem Handy. Auftrag
  Mattia: Die neue Himmelblau-Seite steht für Mattias eigene Arbeit → **UI der neuen Seite besser
  machen** und **UX und Animationen als Showoff zeigen, mit coolen Hinweisen darauf** (z. B.
  handschriftliche Anmerkungen mit Pfeilen, Abstandsraster wie Figma; Ideen: Bild-Zoom, Notfall-Punkt
  pulsiert, Bewertungen zählen hoch, „37 Jahre“ dreht, Termin-Knopf glänzt). Zuerst mit
  impeccable/taste-skill die Seite prüfen, Mattia den Plan mit 2–3 Varianten der Hinweise zeigen,
  dann bauen. (2) Danach K1-B5 Übergang K1→K2. (3) Caddy `Cache-Control "no-cache"` im eigenen Block
  (Mattia führt mit `!` aus). (4) Abnahme Station II Kapitel II offen. (5) Zeitplan
  `plan/aufgaben-bis-live.md` prüfen.

**Sitzungsabschluss 31.10. spätnachts [F]:** Kapitel I Baustein 4 gebaut.

- **K1-B4 „Neue Seite lebt“** (`marke/entwuerfe/hero/zeigen.js`): Mauszeiger hovert in der Pause vor dem
  Handy von Station zu Station, je Station eine Bewegung und **eine** Notiz von Hand mit Pfeil (Figma-Masse
  exakt per `text-box-trim`, Tropfen in Schleife, Notfall pulsiert, Bewertungen zählen hoch, Stempel dreht,
  Knopf hebt sich und glänzt, Foto zoomt). Pause 360vh (Bahn 1080vh). Details und Stationen in
  `website/drehbuch/10-startseite.md` (K1-B4). Notiz-Texte [A] Platzhalter. Mausrad-Prüfung durch Helfer
  ohne Fehler. [A] abgenommen (Mattia kommentierte danach nur das Handy).
- Neu im Header der Musterseite: „Notfall 24 h 041 000 00 00“ (offensichtlich unecht, Entscheid Mattia).
- Hinweis-Stil entschieden (Mattia): **Mix** aus Figma-Massen und Notizen von Hand; Referenzen waren
  roughnotation.com und Excalidraw (Screenshots nur im Scratchpad).
- Commits: `c3ef6d4`, `5d53213`. Online auf https://vorschau.signedbymattia.ch.
- [?] Das Falten zum Handy dauerte schon vorher nur ca. 0,25 s (wirkt evtl. wie Schnappen), wird mit K1-B5a ersetzt.
- *(Wiedereinstieg überholt durch 01.11.)* **Beim Wiedereinstieg zuerst:** (1) **K1-B5a Handy neu + Übergang „Teile fliegen“** (Entscheid Mattia):
  Plan und Befund in `website/drehbuch/10-startseite.md` (Zeile K1-B5a). Pinkes iPhone aus Kapitel II
  wiederverwenden (dort Code suchen), FLIP je Teil am Scroll, Burger-Menü, Anruf-Leiste, Handy-Layout ohne
  Loch, Toast im Display. Danach hochladen und „ist online“ melden. (2) Danach K1-B5 Übergang K1→K2.
  (3) Caddy `Cache-Control "no-cache"` im eigenen Block (Mattia führt mit `!` aus). (4) Abnahme Station II
  Kapitel II offen. (5) Zeitplan `plan/aufgaben-bis-live.md` prüfen.

**Sitzungsabschluss 01.11. [F]:** Kapitel I Baustein 5a gebaut.

- **K1-B5a Handy + „Teile fliegen“** (`marke/entwuerfe/hero/handy.js`, Stil in `kapitel1.css`): Browser verblasst,
  9 Teile (Navigation → Burger, Logo, Foto, Titel, Lead, Knöpfe, Bewertung, Leistungen, Notfall) fliegen gestaffelt
  im Bogen ins **pinke iPhone** (`.k2-geraet` aus Kapitel II wiederverwendet). Handy-Seite neu ohne Loch: Statusleiste,
  Burger, Liste mit ›, Anruf-Leiste unten, Toast passt ins Display, runde Ecken per `clip-path`. Live-Klick im Display.
  Scroll 0.71–0.83. Details Zeile K1-B5a in `website/drehbuch/10-startseite.md`. [A] abgenommen (Mattia bemängelte
  nur die Ecken, behoben, dann „pushe“).
- Technik: Flug-Kopien liegen in einem Raum mit gleicher Container-Grösse (`.k1-raum`), damit cqw/em stimmen.
- [?] Zeiger ist ein Mauspfeil auf dem Handy, evtl. Fingertipp. [A] Beim Überblenden kurz doppelter Titel.
- Werkzeug: Playwright liegt in `werkzeuge/node_modules` (nicht Repo-Wurzel), Chrome per `executablePath`.
- Commits: `0e75e8d`, `5af760e`. Online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 01.11. abends)*

**Sitzungsabschluss 01.11. abends [F]:** **Kapitel I fertig und abgenommen** (Mattia: „der Übergang ist perfekt,
Kapitel 1 ist done“).

- **K1-B5 Übergang K1 → K2**, Variante A „Handy bleibt“ (Entscheid Mattia): nach dem Live-Klick 160vh Abschluss
  (`ENDE_VH` in `kapitel1.js`, Bahn 1240vh): „Was Sie bekommen“ und Karte I stehen auf der Bühne neben dem Handy
  (`.k1-inhalt.auf-buehne`, Papier-Panel entfällt), Handy sperrt sich (Hero-Himmel, 10:24), Kamera taucht ins Display
  (`handy.js`). Neu `zeitraffer.js`: Vollbild-Display, Uhr 10:24 → 21:47, Sonne sinkt, Abendglühen, Nachthimmel
  aus K2, Display geht aus. Kapitel II zieht aus demselben Handy im Goldrahmen zurück (Auftakt s 0.04–0.1,
  Vorhang-Auftakt entfällt, `kapitel2.js`). Ohne Konsolenfehler vor- und rückwärts.
- Werkzeug neu: `werkzeuge/standbild.cjs` (Standbilder an Scroll-Stellen, Chrome per `executablePath`).
- [?] Toast K1 „Wir rufen Sie heute noch zurück“ passt zeitlich nicht ganz zur Anfrage 21:47 in K2 (Textinterview).
- Commit `05c6c81`. Online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 01.11. spätabends)* (1) Abnahme Station II Kapitel II (Mattia scrollt, Strg+F5); offene Befunde:
  Putto oben links wach kaum anders, Putto mit offenen Flügeln ragt übers Fach. (2) Dann **Station III „sortiert“**
  planen (Büchse gefangen, Fach „Dringend“), Plan zeigen, Prompts in die Zwischenablage. (3) Caddy
  `Cache-Control "no-cache"` im eigenen Block (Mattia führt mit `!` aus). (4) Zeitplan `plan/aufgaben-bis-live.md`
  prüfen (Kapitel II verschiebt ca. 1 Woche).

**Sitzungsabschluss 01.11. spätabends [F]:** **Station II Kapitel II abgenommen** (Mattia: „top weitermachen“).

- Nachbesserungen nach Mattias Befunden (Commit `4c231dd`): Vollbild-Mitteilung neu (Hintergrund oben dunkler,
  Datum über der Uhr, Glas-Karte mit Stapel, „Zum Öffnen nach oben wischen“; Symbol klebte am Rand wegen
  Namenskonflikt `.app` aus `hero.css`); „Gelesen“ als pinker Kreis mit gezeichnetem Doppelhaken, Handy zeigt 21:48;
  Licht im Rohr als Spur aus drei Strichen (`mix-blend-mode: screen`) statt Fleck daneben; **Tiefenschärfe**
  (`schaerfe()` in `kapitel2.js`): zuerst Pult/Handy scharf, beim Folgen der Büchse Regal/Rohr/Uhr scharf.
- Stationstexte erklärender, [A] Platzhalter bis Textinterview; Station II hat zwei Sätze (vor/nach der Rohrpost).
- **Unschärfe in Mattias Chrome** (Commit `ec53165`): kein `will-change` auf `.k2-welt`/`.k2-ebene`, Kamera rastet
  ein, Stil nur bei Änderung (`setze()`). Headless zeigt das Problem nicht. Bilder waren nicht schuld.
- *(Wiedereinstieg überholt durch 01.11. nachts)* **Beim Wiedereinstieg zuerst:** (1) **Station III „sortiert“** planen (Büchse gefangen, Fach „Dringend“;
  Drehbuch `website/drehbuch/12-kapitel-2.md`), Plan zeigen, Gemini-Prompts in die Zwischenablage. (2) Caddy
  `Cache-Control "no-cache"` im eigenen Block (Mattia führt mit `!` aus). (3) Zeitplan `plan/aufgaben-bis-live.md`
  prüfen (Kapitel II verschiebt ca. 1 Woche).

**Sitzungsabschluss 01.11. nachts [F]:** **Station III „sortiert“ Kapitel II gebaut und abgenommen** (Mattia: „passt“).

- Plan und Prompts in `website/drehbuch/12-kapitel-2.md` (Abschnitt „Station III“). Scroll 0.44–0.58 (`ST.sortieren`
  in `kapitel2.js`).
- Rohrweg verlängert: Station II fährt bis zum Verteiler unter dem Trichter (`ROHR_II`), Station III durchs obere Rohr
  zum Trichter über Fach oben links; Büchse fällt heraus, Putto fängt sie (Zwei-Bild-Wechsel `fang-a-o1` Arme hoch →
  `fang-b-o1` hält sie). 8 Messingschilder in SVG (`#k2Schilder` in der Regal-Ebene: Dringend, Offerte, Termin,
  Rückruf, Rechnung, Frage, Später, Werbung), „Dringend“ leuchtet pink. Handy „Eingeordnet · Dringend“, 21:49
  (Entscheid Mattia: gleiches Wort wie das Schild). Kamera folgt dem Licht, dann Fach, dann zurück auf Fach + Handy,
  am Ende ganze Stube. Station II zoomt am Ende nicht mehr hinaus.
- **Büchse jetzt gemalt** (Mattia: „echtes Bild“): `marke/assets/k2/ebenen/buechse-v1.jpg`, Web
  `bilder/k2b/buechse.webp`, eigene Ebene `.k2-buechsen` (Tiefe 16, ohne Blur, ohne screen-Mischung), ersetzt die
  SVG-Büchse in Station II und III.
- Bilder neu über Vertex (`werkzeuge/bild.py`): putto-fang-a/b, buechse; November USD 0.84 von 8.00. Fang-Putti im
  Bühnen-Skript `werkzeuge/k2_buehne.py` (Massstab wie wach1, Hände in `k2b.json` „hand“ [A] nach Augenmass).
- Cache-Befund: Mattias Browser hatte alte `k2b.json` → Putto fehlte. Fix: JSON mit `cache: 'no-cache'`, wacher Putto
  nur ausgeblendet, wenn Fang-Bilder da sind. Caddy `Cache-Control` weiterhin offen.
- [A] Stationssatz III Platzhalter bis Textinterview. [A] Büchse in den Händen eher klein, Mattia: passt.
- Commits `1a962ab`, `392e329`, `02073f5`, `ba18628`. Online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 01.11. spätnachts)* **Beim Wiedereinstieg zuerst:** (1) **Station IV „beantwortet“** planen (Drehbuch Tabelle: Feder schreibt, Büchse
  zurück, Handy zeigt Antwort „Wir kommen morgen um 8 Uhr.“ ✓✓; Scroll 0.58–0.72 [A]), Plan zeigen, Bilder über
  Vertex erzeugen (Budget frei) oder Prompts in die Zwischenablage. (2) Caddy `Cache-Control "no-cache"` im eigenen
  Block (Mattia führt mit `!` aus). (3) Zeitplan `plan/aufgaben-bis-live.md` prüfen (Kapitel II verschiebt ca.
  1 Woche).

**Sitzungsabschluss 01.11. spätnachts [F]:** **Station IV „beantwortet“ Kapitel II gebaut und abgenommen** (Mattia: „top weiter“).

- Plan, Entscheide und Prompts in `website/drehbuch/12-kapitel-2.md` (Abschnitt „Station IV“). Scroll 0.58–0.72
  (`ST.antworten`, `station4()` in `marke/entwuerfe/hero/kapitel2.js`).
- Ablauf: Kamera nah aufs Handy; Display wird Chat mit Frau Meier („Boiler tropft. Morgen möglich?“); ein **Putto von
  hinten** (Entscheid Mattia, ersetzt „Putto schreibt mit Feder“) steht vor dem Handy, tippt auf der Tastatur im
  Display, Antwort „Wir kommen morgen um 8 Uhr.“ entsteht Buchstabe für Buchstabe im Eingabefeld; Senden → pinke
  Blase, „Gesendet ✓✓ · 21:50“, Tastatur fährt weg, Wanduhr 21:50; Putto tritt ab, Rahmen-Putto kommt zurück
  (nacheinander, nie zwei halb durchsichtig). Zweite gemalte Büchse steigt aus dem Messing-Rohrende rechts vom Handy
  (Mündung Rahmen-Pixel 2157/1232) und schiesst mit Lichtspur nach oben hinaus (Entscheid Mattia: neue Büchse, erste
  bleibt beim Fang-Putto); Kamera folgt, am Ende ganze Stube.
- Bilder über Vertex: `putto-tippt-a/b` (Rückenansicht, b ist Bearbeitung von a), verworfen `putto-schreibt-a/b`.
  November USD 1.40 von 8.00. Im Bühnen-Skript `werkzeuge/k2_buehne.py`: gleich gross wie die Pult-Putti (290 px,
  Mattia: „zu klein“), Füsse 1530, Finger ergibt sich daraus (≈ 31 % der Gerätehöhe), Tastatur im Display danach
  ausgerichtet; **Sprite** `bilder/k2b/tippt.webp` (beide Haltungen nebeneinander, `k2b.json` „tippt“).
- **Lehre Flackern [F]:** Zwei-Bild-Wechsel per Opacity-Umschalten zweier `<img>` flackerte bei Mattia (Putto kurz
  durchsichtig): Überblenden macht beide halb durchsichtig, und Chrome malt unsichtbare Bilder oft nicht vor. Lösung:
  Sprite in einem Element, nur `background-position` umschalten; schnelle Wechsel zeitbasiert im Takt (0.11 s) statt
  pro Scroll-Schritt. Headless zeigt das Problem nicht.
- Fix Werkzeug: `werkzeuge/scroll-pruefen.cjs` nutzt jetzt Chrome per `executablePath` (Playwright-Chromium fehlt).
- [A] Stationssatz IV „21:50. Die Antwort haben Sie vorher festgelegt. Sie geht sofort raus.“ Platzhalter bis
  Textinterview. [A] Feder steckt weiter gemalt im Tintenfass (ungenutzt).
- Commits `60ee23c`, `297525d`, `6186b1c`, `8db54fc`, `e0cd4d6`, `774c4ea`. Online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 01.11. spät)* (1) **Station V „Termin steht“** planen (Drehbuch-Tabelle: Eintrag im Kalenderbuch
  rechts auf dem Pult; Handy „Termin eingetragen · Do 08:00 · Boiler“; Scroll ca. 0.72–0.84 [A]), Plan mit 1–2
  Entscheidfragen zeigen, Bilder über Vertex (`werkzeuge/bild.py`, Budget frei). Zwei-Bild-Wechsel gleich als Sprite
  bauen. (2) Danach „Morgen“ (Pointe Sperrbildschirm 07:00) und Papier/Tarot-Karte II. (3) Caddy
  `Cache-Control "no-cache"` im eigenen Block (Mattia führt mit `!` aus). (4) Zeitplan `plan/aufgaben-bis-live.md`
  prüfen (Kapitel II verschiebt ca. 1 Woche).

**Sitzungsabschluss 01.11. spät [F]:** **Station V „Termin steht“ Kapitel II gebaut und abgenommen** (Mattia: „passt“).

- Plan, Entscheide, Prompts in `website/drehbuch/12-kapitel-2.md` (Abschnitt „Station V“). Scroll 0.72–0.84
  (`ST.termin`, `station5()` in `kapitel2.js`). Entscheide Mattia: Putto mit Feder, Handy-Mitteilung.
- Kalenderbuch klappt auf (Sprite zu · halb · offen, `bilder/k2b/buch.webp`, doppelt aufgelöst), Bilder `buch-halb-v1`,
  `buch-offen-v1` über Vertex als Bearbeitung des Pult-Ausschnitts (`ebenen/k5-buch-ausschnitt.jpg`, 4:3) → sitzen
  pixelgenau; nur weich ums Buch überlagert (Maske Pult + Farbabstand, rembg stanzte Löcher in den hellblauen Deckel).
- Schreib-Putto: verworfene `putto-schreibt-a/b` aus Station IV, **gespiegelt** (sonst verdeckt er die Schrift), Sprite
  `schreibt.webp`, steht auf der rechten Buchseite.
- **Schrift exakt auf den gemalten Linien** (Mattia): `werkzeuge/k2_linien.py` verfolgt die Linien im Hochpass,
  `k2_buehne.py` glättet sie und legt sie als Seiten-Koordinaten in `k2b.json` „zeilen“; SVG `textPath` in der
  Seiten-Matrix (Buchstaben neigen sich mit der Seite), Tinte `mix-blend-mode: multiply` + Filter `#k2Tinte`.
  Kamera beim Schreiben z 3.7, zur Mitteilung 2.8.
- Handy-Banner „Kalender · Termin eingetragen · Do 08:00 · Boiler“, Wanduhr 21:51.
- [A] Stationssatz V Platzhalter bis Textinterview. [?] `--font-hand` wirkt eher wie kursive Druckschrift als Federschrift.
- Vertex November USD 1.68 von 8.00. Commits `9169f16`, `eb7128a`. Online auf https://vorschau.signedbymattia.ch.
- *(Wiedereinstieg überholt durch 01.11. sehr spät)* (1) **„Morgen“** planen (Drehbuch-Tabelle 0.78–0.92 → jetzt ab 0.84: Kerze aus,
  Morgenlicht, Tür, Pointe Sperrbildschirm 07:00 mit drei erledigten Meldungen, „Sie haben geschlafen. Ihr Betrieb
  nicht.“), Plan mit 1–2 Entscheidfragen zeigen, Bilder über Vertex (Master Morgen = Bearbeitung der Stube, nur Licht).
  (2) Dann Papier/Tarot-Karte II. (3) Caddy `Cache-Control "no-cache"` im eigenen Block (Mattia mit `!`).
  (4) Zeitplan `plan/aufgaben-bis-live.md` prüfen.

**Sitzungsabschluss 01.11. sehr spät [F]:** **„Morgen“ Kapitel II gebaut** (Abnahme offen; Mattia meldete nur den
doppelten Putto, behoben).

- Entscheide Mattia: Sperrbildschirm zeigt, was passiert ist (Dringend · Antwort · Termin, keine Offerte); Tür mit
  Schatten + Kaffee-Putto. Scroll 0.84–0.99 (`morgen()` in `kapitel2.js`), Details und Prompts in
  `website/drehbuch/12-kapitel-2.md` (Abschnitt „Morgen“).
- Kerze geht aus (eigene Ebene `kerze.webp` über Pult ohne Flamme, Rauch), Uhr dreht bis 07:00, Morgenlicht im Code
  (`.k2-morgen`, Vars `--kerze`/`--tag`, kein neues Wandbild), Morgenhimmel, Putti schlafen wieder, Kamera schwenkt
  zur Tür (goldener Spalt, Gestalt), Kaffee-Putto (Sprite) löst Rahmen-Putto ab, Eintauchen in Sperrbildschirm 07:00
  mit drei Meldungen, Karte „Sie haben geschlafen. · Ihr Betrieb nicht.“ [A] Texte Platzhalter.
- Fix: Putti-Wechsel hart an derselben Stelle (vorher beide halb durchsichtig). Lehre bestätigt: nie überblenden.
- Papier: Plan der Rohrpost-Zentrale steht beim Scrollen still und füllt den Bildschirm (`.k2-plan-bahn`).
- Vertex November USD 2.24 von 8.00. Commits `f897752`, `d08b09b`, `f006c0a`. Online.
- [A] Datum auf dem Sperrbildschirm blass; Karte überlappt dritte Meldung knapp; kleine Büchse oben links beim
  Hereinscrollen der Grafik.
- **Beim Wiedereinstieg zuerst:** (1) Mattia wählt aus den 16 Vorschlägen zur Grafik
  (`website/drehbuch/12-kapitel-2.md`, Abschnitt „Papier“; Vorschlag Claude 1+2+6+11+16), dann Pergament-Stiltest
  zeigen, dann bauen. (2) Abnahme „Morgen“ einholen. (3) Danach Tarot-Karte II. (4) Caddy `Cache-Control "no-cache"`
  im eigenen Block (Mattia mit `!`). (5) Zeitplan `plan/aufgaben-bis-live.md` prüfen.

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
