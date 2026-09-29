---
name: auftrag-planen
description: Plant am Abend mit Mattia den Tageslauf für morgen. Schlägt Aufgaben vor, die Claude über die API ohne Mattia erledigen kann, lässt ihn wählen und schreibt den Auftrag so, dass er möglichst wenig kostet (Modell je Schritt, Helfer, genaue Wissensquellen). Nutzen bei „bereite mir die Liste für morgen vor“, „Auftrag für morgen“, „was kann morgen ohne mich laufen“ und am Ende jeder Abendsitzung.
---

# Auftrag für morgen planen

Stand: 29.09.2026. Regeln des Tageslaufs: `plan/auftraege/README.md`. Vorlage:
`plan/auftraege/VORLAGE.md`. Workflow: `.github/workflows/tageslauf.yml`.

Der Tageslauf ist Claude über die bezahlte API (Budget USD 20/Monat, harte Grenze in der
Console). Er läuft Mo–Fr um 08:17 Zürich, nur mit einem freigegebenen Auftrag auf `main`.
Dieser Skill sorgt dafür, dass jeder Franken dort etwas bringt, das Mattia abends Zeit spart.

## Warum es kostet, wie es kostet

Claude liest bei **jedem Schritt den ganzen bisherigen Verlauf** neu (aus dem Cache, aber
jeder Schritt zählt). Am 29.09.2026 kostete ein Opus-Lauf mit 104 Schritten USD 3.22.
Teuer machen einen Auftrag darum:

1. **viele Schritte** (Suchen, Ausprobieren, Umwege, abgelehnte Befehle),
2. **ein dicker Verlauf** (ganze lange Dateien, viele angesehene Bilder, lange Ausgaben),
3. **das Modell** (Opus doppelt so teuer wie Sonnet, Sonnet rund doppelt so teuer wie Haiku).

Billig wird er, wenn der Auftrag das Denken schon enthält: genaue Pfade, genaue Abschnitte,
feste Reihenfolge, klares „fertig, wenn“, und einfache Schritte gehen an günstige Helfer.

## Ablauf am Abend

### 1. Stand einlesen (still, ohne Mattia)

Kurz und gezielt, nicht alles ganz lesen:

- `CLAUDE.md` › „Aktueller Stand und nächste Schritte“.
- Das neueste `plan/stand-*.md` (nur Abschnitte „Offen“ und „Nächste Schritte“).
- Den letzten Auftrag in `plan/auftraege/`: Abschnitt „Bericht“, vor allem „Fragen an
  Mattia“ und „Vorschläge“. Ist sein PR noch offen, zuerst daran erinnern.
- `website/checkliste-vorbereitung.md`: offene Punkte ohne Mattia-Zugang.
- Budget: `git fetch -q origin kosten && git show origin/kosten:kosten.csv`. Summe der Spalte
  `usd` im laufenden Monat, Rest bis USD 20.
- Falls lesbar: Vault `Zielplan.md`, Block der aktuellen Woche (Wochenziel, Meilenstein).

### 2. Liste vorschlagen

Mattia bekommt **eine Tabelle mit 4–8 Kandidaten**, sortiert nach Nutzen für den aktuellen
Meilenstein, und darunter getrennt, was **nur mit ihm** geht (Texte, Entscheide, Konten).

| Nr | Aufgabe | Spart dir | Modell | Grösse | ca. USD | Vorher von dir nötig |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | … | was er sonst abends täte | Opus / Sonnet / Haiku-Helfer | S/M/L | 0.5 | nichts / Entscheid X |

Dazu eine Zeile Budget: „Diesen Monat USD x von 20 verbraucht, Rest y, reicht für etwa n
Läufe.“ Dann fragen: **Welche Nummern nehmen wir?** Nicht selbst auswählen.

**Geeignet** (Tageslauf ohne Mattia): Code, Prototypen, Shader, SVG; Recherche mit Quellen;
Einbau von bereits Entschiedenem (JSON-LD, robots.txt, Titel, Tokens); Entwürfe, klar als
Entwurf markiert; Aufräumen, Prüfen, Tests, Screenshots; Nachbesserung nach Mattias
Rückmeldung zum letzten Lauf.

**Nicht geeignet**, gar nicht erst vorschlagen: Texte in Mattias Stimme (Interview), Entscheide,
Preise, Recht; alles mit Mattias Logins oder Konten; Veröffentlichen, Zahlen, Mails; Dateien,
die nur auf seinem PC liegen; alles mit einem offenen [?], das nicht heute Abend entschieden
wird. Hängt eine gute Aufgabe an einem [?], die Frage in die Spalte „Vorher von dir nötig“.

### 3. Modell je Aufgabe und Schritt wählen

| Wer | Kosten | Nehmen für |
| --- | --- | --- |
| **Opus** (Hauptmodell, Standard) | 1× | kreativer Code, Shader, Gestaltung mit Geschmack, Architektur, knifflige Fehler, alles, wo Qualität den Preis rechtfertigt |
| **Sonnet** (Hauptmodell mit `Modell: sonnet`) | ½ | ganze Tage ohne kreative Aufgabe: Einbau von Entschiedenem, Aufräumen, Doku, Tests |
| Helfer **`recherche`** (Sonnet) | ½, eigener kurzer Verlauf | Web- und Quellenrecherche, lange Dateien auswerten; gibt nur eine knappe Zusammenfassung zurück |
| Helfer **`umsetzer`** (Sonnet) | ½, eigener kurzer Verlauf | genau beschriebene Änderungen: Dateien anlegen, Werte einbauen, umbenennen, Vorlagen füllen |
| Helfer **`pruefer`** (Haiku) | ¼, eigener kurzer Verlauf | Screenshots mit Playwright, Konsolenfehler, Dateigrössen, Links, SVG gültig, Checklisten abhaken |

Die Helfer liegen in `.claude/agents/`. Sie sparen doppelt: Sie sind billiger, und ihr Lesen
landet nicht im Verlauf des Hauptmodells, nur ihr kurzes Ergebnis. **Faustregel:** Alles, was
viel liest oder viel wiederholt, aber wenig Urteil braucht, geht an einen Helfer.

Hauptmodell für den Tag: Braucht **keine** gewählte Aufgabe Opus, schreibe `Modell: sonnet`
in den Auftrag. Sonst keine Zeile (Opus).

### 4. Grösse und Kosten schätzen

Richtwerte aus dem Lauf vom 29.09.2026 [A], nach ein paar Läufen mit `kosten.csv` anpassen:

| Grösse | Schritte | Opus | Sonnet |
| --- | --- | --- | --- |
| S | bis 20 | ca. USD 0.50 | ca. USD 0.25 |
| M | 20–50 | ca. USD 1.50 | ca. USD 0.75 |
| L | 50–100 | ca. USD 3.00 | ca. USD 1.50 |

Ein Tag hat höchstens 120 Schritte (`--max-turns`). Zusammen **höchstens 100 Schritte** planen,
damit Bericht und Commit sicher noch Platz haben. Lieber 2 Aufgaben ganz als 4 halb.

### 5. Auftrag schreiben

Erst wenn Mattia gewählt hat. Datei `plan/auftraege/JJJJ-MM-TT.md` für den **nächsten
Werktag** (Freitagabend → Montag), nach `VORLAGE.md`. Regeln, die Geld sparen:

1. **Genaue Pfade**, nie „schau dich um“ oder „finde heraus, wo“.
2. **Wissen mit Abschnitt:** `marke/DESIGN.md` §2, §3, nicht „DESIGN.md“. Die Karte unten sagt,
   wo was steht. Kurze Fakten (unter ca. 10 Zeilen) direkt in den Auftrag schreiben, statt eine
   lange Datei lesen zu lassen.
3. **Nummerierte Schritte** mit Rolle davor: `[selbst]`, `[recherche]`, `[umsetzer]`,
   `[pruefer]`. Beim Helfer steht, was er zurückgeben soll (z. B. „Tabelle mit 5 Zeilen, je URL“).
4. **Entscheide vorher treffen.** Kein [?] im Auftrag; was offen ist, bleibt draussen oder
   wird heute Abend mit Mattia entschieden.
5. **Fertig, wenn** prüfbar (Datei existiert, 0 Konsolenfehler, Screenshot X zeigt Y).
6. **Bilder sparsam:** wie viele Screenshots, welche davon der Hauptagent selbst ansieht
   (höchstens 3), der Rest nur speichern oder an `pruefer`.
7. **Grenzen:** was nicht angefasst wird, wann anhalten („klappt X nicht nach 2 Versuchen:
   Stand committen, im Bericht beschreiben“).
8. **Richtwert** Schritte je Aufgabe (S/M/L) angeben.
9. **Gleiche Grundlagen zusammen:** Aufgaben, die dieselben Dateien brauchen, an denselben Tag.
10. Baut eine Aufgabe auf dem letzten Lauf auf, dessen Branch nennen (z. B.
    `tageslauf/2026-09-29`), falls noch nicht gemergt.

Dann Mattia den fertigen Auftrag in 5 Zeilen zusammenfassen (Aufgaben, Modell, ca. USD) und
fragen: **Freigeben?** Erst bei Ja `Status: freigegeben` setzen, auf `main` committen und
pushen. Der Lauf liest `main`; was nur lokal liegt, läuft nicht.

## Skills im Tageslauf

Im GitHub-Lauf gibt es nur, was im Repo liegt (`.claude/skills/`, `.claude/agents/`).
**Katalog mit Zweck, passendem Helfer und Gewicht: `.claude/skills/README.md`.** Kurz:
Gestaltung `impeccable`, `taste-skill`, `redesign-skill`, `emil-design-eng`; Vorbilder
untersuchen `clone-site` (nur `--analyze-only`, nie fremden Code übernehmen); SEO `seo-*`;
weniger Code `ponytail`; Fehler `systematic-debugging`; Abschluss
`verification-before-completion`; Diagramme `archify`.

- Einen Skill **pro Schritt** nennen: `Skill: impeccable` hinter dem Schritt. Ohne Nennung
  lädt der Lauf keinen; jeder geladene Skill bleibt bis zum Ende im Verlauf und kostet.
- **Schwere** Skills (laut Katalog) lieber einem **Helfer** geben, z. B.
  `[pruefer] … Skill: impeccable`: dann liegt der Skill nur in dessen kurzem Verlauf.
- Kommt „SEO“ im Auftrag vor, installiert der Lauf die Python-Pakete der SEO-Hilfsprogramme.
- Widerspricht ein Skill der Marke (`marke/DESIGN.md`, `marke/ui-regeln.md`), gilt die Marke.

## Wissenskarte: wo was steht

| Thema | Datei › Abschnitt |
| --- | --- |
| Farben, Schrift, Logo | `marke/DESIGN.md` §2, §3, §4; Werte `marke/tokens.css` |
| Raum, Bildsprache, Bewegung, Wow | `marke/DESIGN.md` §5, §6, §7 |
| Was in UI verboten ist | `marke/ui-regeln.md` „Anti-Slop“, „Stattdessen“ |
| Grafik, Social, Video | `marke/grafik-system.md` §1–§5 |
| Texte schreiben (nur Entwürfe) | `marke/stil.md`, `marke/tonalitaet.md` „Entschieden“ |
| Vorbild Startseite | `marke/teardown-shopify-editions.md` „Entscheide“ |
| Seiten und Aufbau | `website/seitenstruktur.md` „Seiten zum Livegang“, „Startseite“ |
| Titel, Beschreibungen | `website/seo-titel.md` |
| JSON-LD | `website/strukturierte-daten.md` §1–§4 |
| robots.txt, llms.txt, KI-Suche | `website/geo.md` §1–§5 |
| Keywords | `website/keywords.md` „Zuordnung“ |
| Preise, Pakete | `grundlagen/angebote-preise.md` „Aktuelle Pakete“, `website/preisrechner.md` „Preismatrix“ |
| Zielkunden, Positionierung | `grundlagen/zielkunden.md` „Entschieden“, `grundlagen/positionierung.md` „Die fünf Sätze“ |
| Was wir nicht machen | `grundlagen/ausschluesse.md` |
| Werkzeuge (Screenshots, Met-Bilder) | `werkzeuge/README.md` |
| Recht (nur lesen, nie entscheiden) | `recht/pflichtangaben.md` |

Stimmen Abschnittsnamen nicht mehr, vor dem Schreiben mit `grep -n '^## ' <datei>` prüfen.
