# Plan und Stand

Stand: 31.10.2026. **Kurzübersicht für den Wiedereinstieg** (Text statt Grafik, Regel 11 Tokens sparen).
Ausführlich: `aufgaben-bis-live.md` (Wochenplan), `CLAUDE.md` (Sitzungsabschlüsse, „Beim Wiedereinstieg zuerst“).

## Startseite Desktop (Livegang 17.12.2026)

| Teil | Stand | Nächster Schritt |
| --- | --- | --- |
| Hero | gebaut, Mattia „10 von 10“, Abnahme formell offen | – |
| Wolkenflug | gebaut, „perfekt“ | – |
| Kapitel I Website | gebaut, Abnahme offen | Mattia scrollt und nimmt ab |
| **Kapitel II Automation** | **Hero-Methode: Baustein 1 + 2 abgenommen** (Bühne, Handy, Eintauchen) | wache Putti, Station II (Rohrpost) |
| Kapitel III Sichtbar | Drehbuch grob | nach Kapitel II |
| Zwischenspiel, Werke, Abschluss | Drehbuch grob | Streichliste: Werke + Zwischenspiel zusammen |
| Handy-Version | später neu | nach Desktop |

## Ausserhalb der Startseite

| Thema | Stand |
| --- | --- |
| Texte (Interview) | offen, Meilenstein 18.10. verpasst |
| Zugänge (Hosting, DNS, E-Mail, Google-Konto) | bis 15.11.; VPS als Vorschau/Hosting prüfen [?] |
| Werkzeuge | Codex-Prüfer, Bilder über Vertex AI (USD 10/Monat), Scroll-Prüfung |

## Ältere Dateien

| Datei | Inhalt |
| --- | --- |
| `uebersicht.html` | aktuelle Kurzansicht und Eigenaufwand |
| `stand-2026-09-28.workflow.json` → `stand-2026-09-28.html` | aktueller Weg bis live als Archify-Grafik |
| `plan.workflow.json` → `plan-archify.html` | älterer Gesamtplan, Status teils überholt |
| `bis-live.workflow.json` → `bis-live-archify.html` | ältere Stundenannahmen, nicht aktuelle Restschätzung |

Quelle der Termine: Vault `Zielplan.md`. Alte Stunden sind Schätzungen [A]
und wegen der erweiterten SEO-Arbeit und geänderten AHV-Reihenfolge neu zu
prüfen. Das aktuelle Diagramm verwendet deshalb keine Reststunden oder
Prozentzahl.

## Neu erzeugen (Stand-Routine)

Am Ende jeder Sitzung, nach `/stand`:

1. Stand und Aufgaben in `stand-2026-09-28.md` und der aktuellen
   `*.workflow.json` nachführen. Stunden erst mit neuer Schätzung ergänzen.
2. Aktuelle Grafik erzeugen und prüfen:

   ```bash
   node <archify>/bin/archify.mjs deliver workflow stand-2026-09-28.workflow.json stand-2026-09-28.html --quality showcase --json
   node <archify>/bin/archify.mjs visual-check stand-2026-09-28.html --json
   ```

3. In `uebersicht.html` Datum, Aufgaben und Meilensteine anpassen.
