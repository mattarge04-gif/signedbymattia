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

## Aktueller Stand und nächste Schritte

Stand: 27.09.2026. Zeitplan: Vault `Zielplan.md`. Aktuelle Phase
**Fundament** (KW 39–42, bis 18.10.2026).

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

**Nächste Schritte, in dieser Reihenfolge:**

1. ~~Blog-Themen und Keywords~~: erledigt 27.09.2026, `website/keywords.md`
   (geclustert mit claude-seo), Anzeigen-Nachtrag in agency-marketing PR #15.
   Offen: Volumen im Google Keyword-Planer prüfen.
2. **Anmeldung** bei der Ausgleichskasse Luzern, **Frist 18.10.**
   (`website/vertrauen-und-sichtbarkeit.md` Nr. 1).
3. Texte bis 18.10.: Startseite (Mattia), 3 Kaufseiten (Entwurf nach
   `marke/stil.md`), Editionen, 3 Blogartikel, Belege, Hosting.
4. Gewerbe Rontal beitreten (CHF 225/Jahr), Gewerbeverein Ebikon und
   IG Kultur Luzern anfragen.
5. [?] Kosten der KI-Stimme prüfen (`marke/grafik-system.md` §5), Budget Higgsfield.
6. Später: Barock-Bibliothek `marke/assets/` (KW 43), Grafik- und Video-Skill (vor KW 01).

**Kommt erst mit der Website** (bis dahin nur dokumentiert in `DESIGN.md`):
Raum-Tokens, Logo-Dateien (SVG, PNG), eigenes Barock-Bild, Freisteller für
Collagen, Prototypen der Wow-Akte (Himmelsflug, 3D-Galerie).
