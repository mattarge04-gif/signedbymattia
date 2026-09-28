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
   morgen ohne Mattia laufen?

## Aktueller Stand und nächste Schritte

Stand: 28.09.2026. Zeitplan: Vault `Zielplan.md`. Aktuelle Phase
**Fundament** (KW 39–42, bis 18.10.2026).

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
