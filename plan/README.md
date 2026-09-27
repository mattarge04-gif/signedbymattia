# Plan und Stand

Stand: 28.09.2026. Aktuelle Übersicht: [`uebersicht.html`](uebersicht.html).
Sitzungsabschluss mit Aufgaben und Quellen: [`stand-2026-09-28.md`](stand-2026-09-28.md).

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
