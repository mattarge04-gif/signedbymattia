# Preisrechner „Atelier“

Stand: 28.09.2026 · Status: **Konzept entschieden, Prototyp zur Prüfung** · Wunsch Mattia 28.09.2026: interaktiv, spielerisch,
passt in die UI, keine Taschenrechner-Optik, der Kunde versteht jede Option.

## Entschieden [F] (28.09.2026)

1. **Resultat = Richtpreis plus Anfrage.** Die Auswahl wird ins
   Anfrageformular übernommen, verbindlich ist erst die Offerte.
2. **Bausteine:** Website Core als Basis (abschaltbar), dazu SEO + GEO,
   Google-Profil, Automation Core. **Nicht** im Rechner: Texte, Branding,
   Zusatzseiten, Mehrsprachigkeit, monatliche Pflege.
3. **Ort:** eigene Seite „Atelier“ (z. B. `/preise`). Jede Kaufseite verlinkt
   dorthin, mit ihrem Baustein schon eingeschaltet. Ohne Website ist reine
   Automation wählbar.
4. **Kein MWST-Hinweis** (Preise sind Endpreise, `grundlagen/angebote-preise.md`).
5. Jeder Baustein erklärt in einfachen Worten, was **an** und was **aus**
   für den Kunden bedeutet.

## Preismatrix [F] (Mattia bestätigt 28.09.2026)

| Baustein | Preis | Status |
| --- | --- | --- |
| Website Core (bis 5 Seiten) | CHF 1'600 | [F] |
| SEO + GEO | CHF 690 | [F] |
| Google-Profil einrichten | CHF 290 | [F] |
| SEO + GEO und Google-Profil zusammen („Sichtbarkeit“) | CHF 890 statt 980 | [F] |
| Automation Core, 1 Ablauf | CHF 500 | [F] („ab CHF 500“) |
| jeder weitere Ablauf | + CHF 400 | [F] |

Beispiel: Website + Sichtbarkeit = CHF 2'490, im Budget der Wunschkunden
(CHF 1'500–2'500, `grundlagen/zielkunden.md`).

**Marktwerte (Recherche 28.09.2026) [A]:** einmaliges Onpage-SEO ab ca.
CHF 1'500 (Gipfelwerk, Webtree, SEOBoost); Google-Profil einrichten ab CHF 290
(wuk.ch) bis CHF 800–2'500 (Velixar). signedbymattia liegt bewusst am unteren
Rand, als Einstieg. Aufwand grob: SEO + GEO ca. 7 h, Google-Profil ca. 3 h.

## Erklärtexte, Entwurf [A]

- **SEO + GEO aus:** „Ihre Website hat saubere Grundlagen: Titel,
  Beschreibungen, schnelle Ladezeit. Google kann sie finden.“
- **SEO + GEO an:** „Ich recherchiere, wonach Ihre Kunden suchen, richte jede
  Seite darauf aus und mache sie für ChatGPT lesbar. Ohne Garantie auf Platz 1.“

## Konzept [F] (Mattia 28.09.2026): Leinwand + Tarot-Karten

Aus drei Vorschlägen (Leinwand, Himmelskuppel, Sammlerkarten) gewählt:
**Leinwand, bedient mit Tarot-Karten.**

1. Tiepolos Deckengemälde im Goldrahmen, zu Beginn als Bleistiftskizze.
2. Vier Tarot-Karten: **I Das Werk** (Website), **II Das Rad** (Automation),
   **III Der Stern** (SEO + GEO), **IV Die Welt** (Google-Profil).
3. Karte antippen → dreht sich um: „An bedeutet / Aus bedeutet“, Knopf
   „Ins Bild legen“. Beim Rad zusätzlich die Anzahl Abläufe.
4. Ins Bild legen → die Karte fliegt aufs Gemälde, ihr Bildteil malt sich mit
   Pinselstrichen aus, die Karte bekommt ein Wachssiegel. Herausnehmen macht
   den Teil wieder zur Skizze.
5. III + IV zusammen leuchten golden, das Schild zeigt CHF 890 statt 980.
6. Museumsschild mit Richtwert, die Zahl rollt mit.
7. „Werk signieren“ → Mattias Unterschrift zeichnet sich, Echtheitszertifikat
   (Entwurf) mit vorausgefülltem Anfrageformular.
8. Vorauswahl von Kaufseiten per Link, z. B. `?mit=werk,stern`.
9. Ruhige Variante bei reduzierter Bewegung, ohne JavaScript eine Tabelle.

**Prototyp:** `marke/entwuerfe/atelier-prototyp.html` (Wegwerf-Prototyp,
28.09.2026, Bild: Tiepolo, *Allegory of the Planets and Continents*, 1752,
The Met, CC0). Geprüft mit Playwright auf 1440 px und 390 px, ohne
Konsolenfehler.

## Nächste Schritte

1. ~~Preismatrix bestätigen~~: erledigt 28.09.2026.
2. ~~Gestaltungsideen~~: erledigt 28.09.2026, Prototyp steht.
3. Mattia probiert den Prototyp und nennt Änderungen (Wow-Ablauf, `marke/DESIGN.md` §7).
4. Später beim Bau: eigenes Barock-Bild statt Tiepolo? Ladezeit am Handy prüfen.
