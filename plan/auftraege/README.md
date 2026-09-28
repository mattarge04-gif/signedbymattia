# Tageslauf: Aufträge für den Tag

Stand: 28.09.2026 · Status: **eingerichtet, Test am 29.09.2026** · Workflow:
`.github/workflows/tageslauf.yml`

## Idee [F] (Mattia, 28.09.2026)

Mattia ist abends **2 h** am PC. Diese Zeit gehört den Aufgaben, die ihn brauchen:
Texte, Entscheide, Interview, Kontrolle. Alles, was klar ist und ihn nicht braucht,
schreiben wir abends als Auftrag auf. Claude arbeitet es am nächsten Tag
selbstständig ab (Mo–Fr, Start 08:30).

## Abends (ca. 15 Min. der 2 h)

1. PR des Tageslaufs ansehen: Bericht lesen, Ergebnis kurz anklicken, mergen oder
   Änderungen notieren.
2. Auftrag für morgen schreiben: `plan/auftraege/JJJJ-MM-TT.md` nach `VORLAGE.md`.
3. Erst mit `Status: freigegeben` läuft der Auftrag. Ohne Auftrag: kein Lauf,
   keine Kosten.
4. Committen und pushen (der Lauf liest `main`).

## Was in einen Auftrag gehört

| Ja | Nein |
| --- | --- |
| Code, Prototypen, Shader, SVG | Texte aus dem Interview, Mattias Stimme |
| Recherche mit Quellen | Entscheide, Preise, Recht |
| Einbau von bereits Entschiedenem (JSON-LD, robots.txt, Titel) | alles mit Mattias Logins oder Konten |
| Entwürfe, klar als Entwurf markiert | Veröffentlichen, Zahlen, Mails senden |
| Aufräumen, Prüfen, Tests | Dateien, die nur auf Mattias PC liegen |

## Regeln für den Lauf [F]

1. Immer auf Branch `tageslauf/JJJJ-MM-TT`, nie auf `main`, nie mergen.
2. `CLAUDE.md` gilt vollständig: Wissensklassen, kein Eszett, keine Geheimnisse,
   offene Punkte bleiben offen.
3. Bei [?] oder Unklarheit: nicht raten. Aufgabe als **blockiert** markieren,
   Frage in den Bericht, weiter zur nächsten Aufgabe.
4. Nur die Dateien anfassen, die der Auftrag nennt (Scope halten). Ideen darüber
   hinaus kommen in den Bericht unter „Vorschläge".
5. Am Ende Bericht in die Auftragsdatei und PR öffnen.

## Grenzen und Kosten [F]

- Eigener API-Schlüssel, **Ausgabenlimit CHF 20/Monat** in der Anthropic Console
  (harte Grenze). Budget: `agency-automation-os` `budgets.yaml` ›
  `claude_tageslauf_api`.
- Pro Lauf höchstens 60 Schritte (`--max-turns`), 90 Minuten, Modell Sonnet.
- Höchstens 3–6 Aufgaben pro Auftrag.
- Nach einer Woche Kosten pro Lauf in der Console ablesen und hier eintragen [A].

## Einrichtung (einmalig, Mattia)

1. console.anthropic.com: API-Schlüssel erstellen, Name „tageslauf-signedbymattia".
2. Dort unter Limits das monatliche Ausgabenlimit auf den Betrag für CHF 20 setzen.
3. GitHub › Repo signedbymattia › Settings › Secrets and variables › Actions ›
   New repository secret: Name `ANTHROPIC_API_KEY`, Wert = Schlüssel.
4. Test: GitHub › Actions › Tageslauf › „Run workflow" (läuft nur mit freigegebenem
   Auftrag für heute).
