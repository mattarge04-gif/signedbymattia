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
   für Marke und UI vor allem impeccable, taste-skill, design.md.

## Aktueller Stand und nächste Schritte

Stand: 27.09.2026. Zeitplan: Vault `Zielplan.md`. Aktuelle Phase
**Fundament** (KW 39–42, bis 18.10.2026).

**Erledigt [F]:**

- Identität „Edition“: `marke/DESIGN.md`, Markenübersicht
  `marke/entwuerfe/identitaet-edition-v2.html` (PR #8).
- Persönlichkeit und Stimme: `marke/tonalitaet.md` (PR #9).
- Grafik- und Video-System: `marke/grafik-system.md`, Prototyp
  `marke/entwuerfe/grafik-system-v1.html` (27.09.2026).

**Nächste Schritte, in dieser Reihenfolge:**

1. ~~`agency-marketing/docs/LINKEDIN-BLOG-CONTENT.md` anpassen~~: erledigt
   27.09.2026 (agency-marketing PR #14), verweist jetzt auf `marke/`.
   Hinweis: Standard-Branch von agency-marketing auf GitHub ist
   `claude/linkedin-marketing-funnel-x68u2g`, nicht `main` [?].
2. [?] Kosten der KI-Stimme für lange Videos prüfen (`grafik-system.md` §5),
   Ziel ist „kostenfrei“.
3. Bestätigen [?]: In `tonalitaet.md` ist die Antwort zum Weltgeschehen als
   Annahme markiert („Politik nur im Text, nicht in den Bildern“).
4. [?] Mattia hat zwei Anki-Screenshots (Karte „Syllogismus“) ohne Text
   geschickt. Fragen, wofür sie gedacht sind.
5. Zielplan KW 41–42: Seitenstruktur, Text der Startseite, übrige Texte,
   Keywords, Hosting, Belege. Meilenstein 18.10.: alle Texte stehen.

**Kommt erst mit der Website** (bis dahin nur dokumentiert in `DESIGN.md`):
Raum-Tokens, Logo-Dateien (SVG, PNG), eigenes Barock-Bild, Freisteller für
Collagen, Prototypen der Wow-Akte (Himmelsflug, 3D-Galerie).
