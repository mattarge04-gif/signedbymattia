# Skills im Repo

Stand: 29.09.2026. Diese Skills stehen jeder Claude-Sitzung in `signedbymattia` zur
Verfügung, auch dem **Tageslauf** (GitHub Actions). Mit Mattias ausdrücklicher Erlaubnis
vom 29.09.2026 aus den unten genannten Quellen übernommen, unverändert, mit Lizenz.

## Kosten im Tageslauf

- Die **Beschreibung** jedes Skills steht bei jedem Schritt im Verlauf, zusammen rund
  3'000 Tokens. Aus dem Cache kostet das bei 100 Schritten etwa USD 0.06 pro Lauf.
- Der **ganze Skill** kommt nur in den Verlauf, wenn ein Schritt ihn nennt
  (`Skill: impeccable`), und bleibt dann bis zum Ende. Schwere Skills darum einem Helfer
  geben (`[pruefer] … Skill: impeccable`), dann liegen sie nur in dessen kurzem Verlauf.
- Gewicht: **leicht** unter 10 KB Anleitung, **mittel** bis 40 KB, **schwer** darüber oder
  mit vielen Nachschlage-Dateien.

## Katalog: wofür, wer, wie schwer

### Gestaltung und Frontend

| Skill | Wofür bei uns | Wer im Tageslauf | Gewicht |
| --- | --- | --- | --- |
| `impeccable` | Gestaltung prüfen, verbessern, polieren; `audit`, `critique`, `polish`, `typeset`, `animate`; mechanischer Detektor gegen „KI-Look“ | Opus `[selbst]` beim Gestalten, `[pruefer]` für Audit | schwer |
| `taste-skill` (design-taste-frontend) | neue Seiten und Sektionen ohne Vorlagen-Look entwerfen | Opus `[selbst]` | mittel |
| `redesign-skill` | bestehende Seite oder Prototyp auf hohes Niveau heben, ohne Funktion zu brechen | Opus `[selbst]` | leicht |
| `emil-design-eng` | Bewegung, Übergänge, Details, die sich gut anfühlen (Wow-Akte, Ölfarben-Übergang) | Opus `[selbst]` | mittel |

Für alle vier gilt zuerst `marke/DESIGN.md`, `marke/tokens.css` und `marke/ui-regeln.md`;
widerspricht ein Skill der Marke, gewinnt die Marke.

### Websites untersuchen (nur zum Lernen)

| Skill | Wofür bei uns | Wer | Gewicht |
| --- | --- | --- | --- |
| `clone-site` | Teardown einer Vorbildseite: Stack, Designsystem, Effekte mit Parametern (`--analyze-only`) | Opus `[selbst]` | schwer |
| `dom-clone` | Layout und CSS einer Seite messen (Teil von clone-site) | über `clone-site` | mittel |
| `shader-extract` | WebGL- oder Shader-Effekt einer Seite verstehen und lokal nachstellen | Opus `[selbst]` | schwer |
| `remix-site` | aus einem Teardown drei eigene Richtungen mit unseren Tokens ableiten | Opus `[selbst]` | schwer |

**Regel [F]:** Nur zum Studieren. Kein fremder Code, keine fremden Bilder, Texte oder Shader in
unsere Website oder Kundenseiten (wie beim Teardown Shopify Editions, Entscheid 28.09.2026).
Ergebnisse bleiben unter `marke/referenzen/` oder `marke/entwuerfe/` und werden nicht
veröffentlicht. Standard ist `--analyze-only`.

### SEO und Sichtbarkeit

| Skill | Wofür bei uns | Wer | Gewicht |
| --- | --- | --- | --- |
| `seo` | Einstieg, wenn unklar ist, welcher SEO-Teil passt | `[recherche]` | mittel |
| `seo-technical` | technischer Check (Crawling, Indexierung, Core Web Vitals) nach dem Bau | `[pruefer]` | leicht |
| `seo-schema` | JSON-LD prüfen oder erzeugen (`website/strukturierte-daten.md`) | `[umsetzer]` | leicht |
| `seo-geo` | Sichtbarkeit in KI-Suche, robots.txt, llms.txt (`website/geo.md`) | `[recherche]` | mittel |
| `seo-local` | Google-Profil, NAP, lokale Einträge (`website/google-profil.md`) | `[recherche]` | leicht |
| `seo-page` | eine einzelne Seite ganz prüfen | `[pruefer]` | leicht |
| `seo-content` | Inhalt auf Nutzen, E-E-A-T, Lesbarkeit prüfen (nur Entwürfe, nie Mattias Texte umschreiben) | `[recherche]` | leicht |

Die SEO-Skills rufen Hilfsprogramme unter `.claude/vendor/claude-seo/scripts/` auf. Der
Tageslauf setzt dafür `CLAUDE_PLUGIN_ROOT` und installiert die nötigen Python-Pakete nur,
wenn im Auftrag „SEO“ vorkommt. Vor dem Livegang (22.11.2026) gibt es keine eigene Seite zum
Prüfen; bis dahin vor allem Wissen und Prüfung von Entwürfen.

### Arbeitsweise (weniger Code, weniger Fehler)

| Skill | Wofür bei uns | Wer | Gewicht |
| --- | --- | --- | --- |
| `ponytail` | einfachste Lösung, die wirklich funktioniert; weniger Code heisst auch weniger Tokens | alle, die Code schreiben | leicht |
| `ponytail-review` | fertigen Code auf Überbau prüfen: was kann weg? | `[pruefer]` | leicht |
| `systematic-debugging` | Fehler erst verstehen, dann beheben, statt zu raten | Opus `[selbst]` | mittel |
| `test-driven-development` | erst Test, dann Code (Werkzeuge, Skripte) | `[umsetzer]` | mittel |
| `verification-before-completion` | vor „fertig“ wirklich prüfen, mit Beleg | alle, am Ende jeder Aufgabe | leicht |

Von superpowers bewusst **nicht** übernommen: `using-superpowers` (verlangt vor jeder Handlung
eine Skill-Prüfung) und Abläufe mit Rückfragen wie `brainstorming` oder `writing-plans`; im
Tageslauf ohne Mattia kosten sie Schritte und können hängen bleiben [A].

### Diagramme

| Skill | Wofür bei uns | Wer | Gewicht |
| --- | --- | --- | --- |
| `archify` | Abläufe, Zeitpläne, Architektur als HTML-Diagramm (Plan-Übersicht in `plan/`) | `[umsetzer]` | schwer |

Ohne Test- und gerenderte Beispieldateien übernommen (rund 3.7 MB statt 11 MB).

### Eigene

| Skill | Wofür |
| --- | --- |
| `auftrag-planen` | abends den Tageslauf für morgen planen („bereite mir die Liste für morgen vor“) |

## Quellen und Lizenzen

| Skill(s) | Quelle | Stand | Lizenz |
| --- | --- | --- | --- |
| impeccable | github.com/pbakaus/impeccable (`.claude/skills/impeccable`) | `40f990f`, 29.09.2026 | Apache 2.0, mit `NOTICE.md` |
| taste-skill, redesign-skill | github.com/Leonxlnx/taste-skill | `ce26fc2`, 26.09.2026 | MIT |
| emil-design-eng | github.com/emilkowalski/skills | `d16ebe6`, 24.09.2026 | MIT |
| clone-site, dom-clone, remix-site, shader-extract | github.com/cth9191/site-clone | `f01d396`, 21.08.2026 | MIT |
| seo, seo-technical, seo-schema, seo-geo, seo-local, seo-page, seo-content; `.claude/vendor/claude-seo` | github.com/AgriciDaniel/claude-seo | `ff87fce`, 29.09.2026 | MIT |
| ponytail, ponytail-review | github.com/DietrichGebert/ponytail | `e3ba2aa`, 14.09.2026 | MIT |
| systematic-debugging, test-driven-development, verification-before-completion | github.com/obra/superpowers | `8ca22db`, 25.09.2026 | MIT |
| archify | github.com/tt-a1i/archify (`archify/`) | `c4c6b3b`, 30.09.2026 | MIT |

Die Quellen von impeccable, taste-skill, emil-design-eng und claude-seo wurden per Suche
bestimmt; ob Mattias lokal installierte Fassungen genau daher stammen, ist nicht geprüft [A].

**Prüfung beim Übernehmen (29.09.2026):** Stichprobe über alle 129 Skript-Dateien: kein Zugriff
auf Schlüssel oder Tokens, keine Installations-Hooks, kein verstecktes Nachladen und Ausführen.
Netzadressen nur Beispiele, Dokumentation und optionale Google-Schnittstellen von claude-seo.
Kein vollständiges Audit [A].

## Aktualisieren

Nicht automatisch. Neue Fassung bewusst holen, Unterschied ansehen, Lizenz prüfen, als PR
einbringen und oben Stand und Commit nachführen. Ein Update eines fremden Repos kommt so nie
unbemerkt in den Tageslauf.
