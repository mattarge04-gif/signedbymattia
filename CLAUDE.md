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
| `agency-automation-os` | Lead Bot, Budgets (`config/budgets.yaml`) | `grundlagen/zielkunden.md`, `grundlagen/angebote-preise.md` |
| `kunde-<name>` | je Kundenwebsite ein Repo | `vorlagen/`, `marke/ui-regeln.md`, `prozesse/` |
| `obsidian-vault` | persönliches Wissen, Entscheide, Zielplan | verweist hierher |
| `life-os` | persönliches Betriebssystem | – |

Budgets und Kostenfreigaben bleiben in `agency-automation-os/config/budgets.yaml`.

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
   für Marke und UI vor allem impeccable, taste-skill, design.md.
