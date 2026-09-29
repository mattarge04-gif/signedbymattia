# Tageslauf: Aufträge für den Tag

Stand: 29.09.2026 · Status: **erster Lauf 29.09.2026 von Hand, danach auf sparsam umgestellt** · Workflow:
`.github/workflows/tageslauf.yml`

## Idee [F] (Mattia, 28.09.2026)

Mattia ist abends **2 h** am PC. Diese Zeit gehört den Aufgaben, die ihn brauchen:
Texte, Entscheide, Interview, Kontrolle. Alles, was klar ist und ihn nicht braucht,
schreiben wir abends als Auftrag auf. Claude arbeitet es am nächsten Tag
selbstständig ab (Mo–Fr, Start 08:17, Ersatztermin 09:47; im Winter je eine Stunde früher).

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

## Zeitplan [F] (29.09.2026)

GitHub startet geplante Läufe nur nach Möglichkeit: bei Last später oder gar nicht,
vor allem zur vollen und halben Stunde. Am 29.09.2026 ist der Lauf um 06:30 UTC
ganz ausgefallen (kein Lauf in Actions, API nie aufgerufen). Darum:

- zwei Termine auf krummen Minuten: 06:17 und 07:47 UTC;
- der zweite Termin bricht sofort ab, wenn es den Branch `tageslauf/JJJJ-MM-TT` oder
  eine Zeile des Tages in `kosten.csv` schon gibt (keine doppelten Kosten);
- „Run workflow" von Hand läuft immer, auch nach einem Lauf am selben Tag.

## Grenzen und Kosten [F]

- Eigener API-Schlüssel. **Ausgabenlimit USD 20/Monat in der Anthropic Console** unter
  Limits setzen (Stand 29.09.2026 noch nicht gesetzt: dort stand das Tarif-Limit
  USD 200'000). Automatisches Aufladen aus lassen. Budget: `agency-automation-os`
  `budgets.yaml` › `claude_tageslauf_api`.
- Pro Lauf höchstens 120 Schritte (`--max-turns`), 150 Minuten. **Modell Opus** (Wunsch
  Mattia 28.09.2026); mit der Zeile `Modell: sonnet` im Auftrag Sonnet zum halben Preis.
- **Erster Lauf 29.09.2026, gemessen in der Console:** USD 6.96 für 104 Schritte, zwei
  Aufgaben (2.5D-Bühne, Initialen). 11.76 Mio. Tokens Eingabe (fast alles aus dem Cache),
  0.15 Mio. Ausgabe. Claude Codes eigene Schätzung sagte USD 3.22, also zu tief.
  **Folge:** USD 20 reichen für etwa 3 Läufe dieser Grösse, nicht für jeden Arbeitstag [A].
- **Kostenzähler:** Nach jedem Lauf rechnet der Workflow Tokens × Preis und nimmt vorsichtig
  den höheren Wert aus dieser Rechnung und der Schätzung × `KORREKTUR` (2.2). Die Zeile kommt
  in den Branch `kosten` (`kosten.csv`, mit Tokens, Schritten und abgelehnten Befehlen).
  Telegram-Nachricht, sobald im Monat **25, 50 und 75 %** von USD 20 erreicht sind. Die Zeile
  vom 29.09. steht dort noch mit 3.2167; von Hand auf 6.96 korrigieren.
- Höchstens 3–6 Aufgaben pro Auftrag.

## Sparsam laufen [F] (29.09.2026)

Claude liest bei **jedem Schritt den ganzen bisherigen Verlauf** neu (am 29.09. im Schnitt
rund 113'000 Tokens pro Schritt). Gespart wird darum mit **weniger Schritten** und **kürzerem
Verlauf**, nicht mit weniger Ergebnis:

- Der Workflow macht die Vorarbeit ohne Tokens: Branch anlegen, `werkzeuge/` mit Playwright,
  Pillow; danach Push und Pull Request.
- Der Prompt verlangt CLAUDE.md nicht nochmals (Claude Code lädt sie selbst) und enthält
  die Regeln dieser Datei in Kurzform.
- Mehr harmlose Befehle sind erlaubt (am 29.09. zehn Ablehnungen mit Umwegen).
- Aufträge nennen die Grundlagen mit Abschnitt (§); höchstens 3 Prüfbilder ansehen.
- Nachsehen: Laufseite › Summary zeigt Tokens, Schritte und abgelehnte Befehle; das
  vollständige Protokoll liegt 14 Tage als Artefakt beim Lauf.

## Einrichtung (einmalig, Mattia)

1. console.anthropic.com: API-Schlüssel erstellen, Name „tageslauf-signedbymattia".
2. Dort unter Limits das monatliche Ausgabenlimit auf den Betrag für CHF 20 setzen.
3. GitHub › Repo signedbymattia › Settings › Secrets and variables › Actions ›
   New repository secret: Name `ANTHROPIC_API_KEY`, Wert = Schlüssel.
4. Telegram: Dem eigenen Bot in Telegram einmal `/start` schreiben. Dann im Browser
   `https://api.telegram.org/bot<TOKEN>/getUpdates` öffnen und bei `"chat":{"id": …}` die Zahl
   ablesen. Zwei Secrets anlegen wie oben: `TELEGRAM_BOT_TOKEN` (Token von BotFather) und
   `TELEGRAM_CHAT_ID` (die Zahl). Token nie in Chat oder Dateien. Der Token darf auch als `API_SIGNEDBYMATTIA` hinterlegt sein (so eingerichtet am 28.09.2026).
5. Test Telegram: GitHub › Actions › Tageslauf › „Run workflow" › Haken bei
   „Nur Telegram testen" › Run. Keine Kosten.
6. Test Lauf: gleich, ohne Haken (läuft nur mit freigegebenem Auftrag für heute).
7. Damit der Workflow den PR öffnen darf: GitHub › Repo › Settings › Actions › General ›
   Workflow permissions › Haken bei „Allow GitHub Actions to create and approve pull
   requests" › Save. (Am 29.09.2026 wurde kein PR erstellt, vermutlich fehlte dieser Haken [A].)
