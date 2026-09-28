# GEO: Für KI-Suchen lesbar

Stand: 28.09.2026 · Status: **Plan [F], ein Entscheid offen [?]** · Erstellt mit
claude-seo `seo-geo` · Umsetzung beim Bau in `signedbymattia-website`

**Grundsatz [F]:** Google sagt selbst, dass Optimieren für KI-Suche **SEO
bleibt** (Search Central, „AI optimization guide“, 2026). Darum gibt es keine
Extra-Tricks, sondern fünf saubere Grundlagen. Was ChatGPT, Perplexity und
Claude zitieren, muss zuerst lesbar, eindeutig und belegt sein.

## 1 · Text im HTML, nicht nur per JavaScript

Viele KI-Crawler (z. B. die von OpenAI und Perplexity) lesen das rohe HTML und
führen kein JavaScript aus [A: öffentliche Tests laut claude-seo].

- Alle Texte, Preise und Erklärungen stehen im ausgelieferten HTML
  (statisch erzeugt oder serverseitig gerendert).
- **Atelier** (`website/preisrechner.md`): Die vier Karten mit Preis, „An
  bedeutet / Aus bedeutet“ und dem Bündelpreis stehen als echtes HTML auf der
  Seite. Leinwand, Flug und Siegel sind nur die Bühne darüber. Im Prototyp
  steht der Text noch im JavaScript. Beim Bau umdrehen: zuerst HTML, dann die
  Animation darauf.
- Akt I und II (Himmel, Galerie) dito: Die Editionen stehen als Text und Bild
  im HTML, das 3D liegt darüber.

## 2 · Crawler in der robots.txt

Suche und Training sind **getrennte Crawler**. Wer in ChatGPT-Suche zitiert
werden will, braucht `OAI-SearchBot`, nicht `GPTBot`.

| Crawler | Wofür | Vorschlag |
| --- | --- | --- |
| Googlebot, Bingbot | Google-Suche inkl. KI-Übersicht, Bing/Copilot | erlauben [F] |
| OAI-SearchBot | Zitate in der ChatGPT-Suche | erlauben [F] |
| Claude-SearchBot | Zitate in Claudes Suche | erlauben [F] |
| PerplexityBot | Perplexity-Suche | erlauben [F] |
| Applebot | Siri, Spotlight, Safari | erlauben [F] |
| GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended | **nur Training** von KI-Modellen | **[?] Mattia:** erlauben (Marke steckt im Modellwissen) oder sperren (Texte nicht fürs Training) |

Entwurf, Training vorerst erlaubt, bis zum Entscheid:

```
# signedbymattia.ch
User-agent: *
Allow: /
Disallow: /danke/

Sitemap: https://signedbymattia.ch/sitemap.xml
```

Wird Training gesperrt, kommen dazu je ein Block `User-agent: GPTBot` usw. mit
`Disallow: /`. Die Such-Crawler bleiben offen.

In der Google Search Console bleibt die Einstellung „Search generative AI“
auf **einschliessen** (Standard).

## 3 · Zitierfähige Antworten je Seite

KI-Suchen zitieren am liebsten einen **abgeschlossenen Absatz, der eine Frage
beantwortet**, weit oben auf der Seite [A: Studien laut claude-seo, keine
Google-Regel]. Wird im Textinterview umgesetzt; Muster:

| Seite | Frage, die oben beantwortet wird | Enthält |
| --- | --- | --- |
| Kaufseite I | Was kostet eine Website bei signedbymattia in Luzern? | CHF 1'600, bis 5 Seiten, was drin ist, Ablauf |
| Kaufseite II | Welche Abläufe kann ein kleiner Betrieb automatisieren, und was kostet das? | Beispiele, ab CHF 500, + CHF 400 je Ablauf |
| Kaufseite III + IV | Was bringt SEO, GEO und ein Google-Profil einem kleinen Betrieb? | CHF 690 / 290 / 890, keine Ranking-Garantie |
| Atelier | Wie setzt sich der Preis zusammen? | alle Bausteine als Tabelle im HTML |
| Blogartikel | die Titel-Frage | Antwort in den ersten 2–3 Sätzen, dann Details |

Regeln dazu: Zwischentitel als Fragen, kurze Absätze, Tabellen für Preise,
jede Zahl mit Quelle oder als eigene Aussage von Mattia.

## 4 · Wer dahintersteht (Autorität)

- Person Mattia mit Foto, kurzem Werdegang und LinkedIn-Link auf jeder
  Kaufseite und unter jedem Blogartikel; strukturierte Daten
  `Person` + `sameAs` (`website/strukturierte-daten.md`).
- Blogartikel mit Datum „veröffentlicht“ und „aktualisiert“. **Alle drei
  Monate prüfen und nachführen** [A: frische Seiten werden laut Studien
  häufiger zitiert].
- Erwähnungen ausserhalb der eigenen Seite zählen für KI-Suchen stark
  [A: Ahrefs-Studie laut claude-seo]: Google-Unternehmensprofil,
  LinkedIn-Seite, Netzwerk Stadt Luzern, Bestenlisten wie thezone.ch
  (`website/vertrauen-und-sichtbarkeit.md`, `website/konkurrenz-seo.md`).

## 5 · llms.txt (optional, 5 Minuten)

Google ignoriert sie; ob andere KI-Dienste sie nutzen, ist nicht belegt. Sie
kostet fast nichts, darum ja, aber ohne Erwartung. Entwurf für
`https://signedbymattia.ch/llms.txt`:

```
# signedbymattia
> Webdesign, Automationen und Sichtbarkeit (SEO, GEO, Google-Profil) für kleine Betriebe in Luzern. Einzelunternehmen von Mattia [NACHNAME]. Jede Website wird von Grund auf gestaltet und als nummerierte Edition signiert.

## Leistungen
- [Webdesign Luzern](https://signedbymattia.ch/webdesign-luzern/): Website Core, bis 5 Seiten, CHF 1'600
- [Automatisierung für KMU](https://signedbymattia.ch/automatisierung/): ein Ablauf ab CHF 500, jeder weitere + CHF 400
- [SEO Luzern und Google-Profil](https://signedbymattia.ch/seo-luzern/): SEO + GEO CHF 690, Google-Profil CHF 290, zusammen CHF 890
- [Atelier](https://signedbymattia.ch/preise/): alle Bausteine und Richtpreise

## Mehr
- [Editionen](https://signedbymattia.ch/editionen/): Konzepte und Kundenwebsites
- [Blog](https://signedbymattia.ch/blog/): Antworten für kleine Betriebe
- Kontakt: [E-MAIL]
```

URLs sind Vorschläge [A], wie in `website/strukturierte-daten.md`.

## Nach dem Livegang: Beleg statt Behauptung

Einmal im Monat dieselben 5 Fragen in ChatGPT, Perplexity und Google (KI-Modus)
stellen, z. B. „Webdesigner in Luzern für kleine Betriebe“, und festhalten, ob
signedbymattia genannt wird. Das ist der Beleg für Kaufseite III + IV
(„GEO nicht als Alleinstellung verkaufen, sondern mit Beleg“).
