# Keywords der eigenen Website

Stand: 28.09.2026 · Status: **entschieden [F]** (Auswahl Mattia, geclustert mit
claude-seo `seo-cluster`) · Karte: [`keywords-cluster-map.html`](keywords-cluster-map.html)

Welches Keyword gehört auf welche Seite. Anzeigen-Details (Match-Typen,
Ausschlüsse, Budget) stehen in `agency-marketing/docs/GOOGLE-ADS-KEYWORDS.md`.

## Methode

Skill `seo-cluster` aus [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)
(MIT): Jedes Keyword einzeln gesucht, dann gezählt, wie viele gleiche Seiten
unter den Treffern liegen. **7–10 gleiche = dieselbe Seite, 4–6 = derselbe
Cluster, 2–3 = verlinken, 0–1 = getrennt.** Gesucht am 27.09.2026, 34 Keywords.

**Einschränkungen [A]:**

- Die Suche lief über einen US-Suchdienst, nicht über Google in Luzern.
  Begriffe ohne Ort zeigen darum deutsche statt Schweizer Treffer.
- Suchvolumen gemessen nur für „webdesign luzern“ (480/Mt., CHF 5.51) und
  „website erstellen lassen luzern“ (10/Mt.), Ubersuggest 24.09.2026.
- **Vor dem Start alles im Google Keyword-Planer prüfen** (gratis, Standort Luzern).

## Zuordnung

### Kaufseite I · Website Luzern

| Rolle | Keyword | Befund |
| --- | --- | --- |
| **Haupt-Keyword** | **webdesign luzern** | 8/8 Schweizer Treffer, meiste Überschneidung |
| gleiche Seite | webdesigner luzern | 6 gleiche Treffer mit dem Haupt-Keyword |
| gleiche Seite | kreative webagentur luzern | 4 gleiche, passt zur Positionierung |
| gleiche Seite, Abschnitt Ablauf | website erstellen lassen luzern, homepage erstellen lassen luzern | 5 gleiche untereinander |
| gleiche Seite, Abschnitt | website für kmu | 7/9 Schweizer Agentur-Seiten |
| Abschnitt / Kapitel V | branding und webdesign luzern | 3 gleiche mit „kreative webagentur luzern“ |
| im Seitentitel variiert | webagentur luzern | eigene Trefferliste, gleiche Absicht |

### Kaufseite II · Automation

| Rolle | Keyword |
| --- | --- |
| **Haupt-Keyword** | **automatisierung kmu luzern** (Entscheid 28.09.2026, Volumen ungeprüft [A]) |
| Abschnitt | offertanfragen automatisieren |
| an den Blog abgegeben | prozesse automatisieren kmu: Google zeigt dafür fast nur Ratgeber (`website/konkurrenz-seo.md` §3) |

### Kaufseite III + IV · Sichtbarkeit

| Rolle | Keyword |
| --- | --- |
| **Haupt-Keyword** | **seo luzern** (3/4 Luzerner Agenturen) |
| im Text | lokale seo |

### Blog (3 Artikel zum Start, Wahl Mattia)

| Artikel | Keywords | verlinkt auf |
| --- | --- | --- |
| Von ChatGPT empfohlen werden: GEO für kleine Betriebe | in chatgpt gefunden werden, ki suchmaschinenoptimierung | Kaufseite III + IV |
| Google-Unternehmensprofil in 30 Minuten | google unternehmensprofil einrichten, google unternehmensprofil optimieren | Kaufseite III + IV |
| Prozesse automatisieren im KMU: 3 kleine Beispiele (Beispiel-Liste, 1'400–2'000 Wörter) | **prozesse automatisieren kmu**, termine automatisch buchen | Kaufseite II |

Jeder Artikel verlinkt auf seine Kaufseite und zurück (Regel aus `seo-cluster`:
jede Seite mindestens 3 interne Links, keine verwaisten Seiten).

### Nur Anzeigen, nicht als eigene Seite

- webdesign ebikon, webdesign rontal, webdesign zentralschweiz: Die
  Konkurrenz baut Ortsseiten, wir nicht (Entscheid). Anzeigen führen auf
  Kaufseite I.
- website erstellen lassen, homepage erstellen lassen, website machen
  lassen, individuelle website erstellen lassen: Allgemeinbegriffe, mit
  Standort-Targeting.

### Gestrichen oder später

| Keyword | Grund | Später |
| --- | --- | --- |
| landingpage startup | nur englische Treffer | – |
| website festpreis | nur deutsche Paket-Anbieter | – |
| kontaktformular automatisieren | Suchende wollen Formular-Werkzeuge | – |
| website für künstler, portfolio website erstellen lassen, website für startups | Treffer fast nur Baukästen, Suchende wollen Anleitungen | Blog „Wix, Squarespace oder Webdesigner?“ |
| website überarbeiten lassen, website bringt keine anfragen, was kostet eine website | Ratgeber-Absicht | Blog „Was eine Website in Luzern kostet“, „5 Dinge in 3 Sekunden“ |
