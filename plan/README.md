# Plan und Stand

Stand: 27.09.2026. Übersicht zum Öffnen im Browser: [`uebersicht.html`](uebersicht.html).

| Datei | Inhalt |
| --- | --- |
| `uebersicht.html` | Zeitstrahl, Zeitaufwand, was Mattia liefern muss, was gebaut wird |
| `plan.workflow.json` → `plan-archify.html` | der ganze Plan (6 Phasen) als Archify-Grafik |
| `bis-live.workflow.json` → `bis-live-archify.html` | Stunden pro Block bis zum Livegang |

Quelle der Termine: Vault `Zielplan.md`. Stunden sind Schätzungen [A].

## Neu erzeugen (Stand-Routine)

Am Ende jeder Sitzung, nach `/stand`:

1. In den beiden `*.workflow.json` Status und Stunden nachführen.
2. Grafiken erzeugen und prüfen:

   ```bash
   A=~/.claude/skills/archify/bin/archify.mjs
   node $A deliver workflow plan.workflow.json plan-archify.html --quality showcase --json
   node $A deliver workflow bis-live.workflow.json bis-live-archify.html --quality showcase --json
   node $A visual-check plan-archify.html --json
   node $A visual-check bis-live-archify.html --json
   ```

3. In `uebersicht.html` Datum, Zahlen und Meilensteine anpassen.
