# Strukturierte Daten (JSON-LD)

Stand: 28.09.2026 · Status: **Vorlage [F], Platzhalter offen [?]** · Erstellt mit
claude-seo `seo-schema` · Titel und Beschreibungen: `website/seo-titel.md`

Was Google und KI-Suchen maschinenlesbar über signedbymattia erfahren. Die
Website (`signedbymattia-website`) übernimmt die Blöcke unten und setzt nur die
Platzhalter ein.

## Regeln

- **JSON-LD im ausgelieferten HTML**, nicht per JavaScript nachgeladen
  (Google verarbeitet nachgeladene Daten verzögert).
- **Eine Wahrheit pro Objekt:** Betrieb und Person stehen nur auf der
  Startseite vollständig. Andere Seiten verweisen mit `@id` darauf.
- **Nur Wahres:** keine Bewertungen (`AggregateRating`), solange es keine
  echten gibt. Keine erfundenen Adressen oder Öffnungszeiten.
- **Kein FAQPage-Markup:** Google zeigt seit Mai 2026 keine FAQ-Treffer mehr
  [A: laut claude-seo]. Die Fragen stehen trotzdem als Text auf den Kaufseiten.
- **Kein MWST-Hinweis** in Preisen (Entscheid 28.09.2026). Preise sind
  Endpreise in CHF.
- Nach dem Bau prüfen: Google Rich Results Test und validator.schema.org.

## Platzhalter [?]

| Platzhalter | Quelle, sobald entschieden |
| --- | --- |
| `[NACHNAME]` | Mattias voller Name fürs Impressum, `recht/pflichtangaben.md` |
| `[E-MAIL]` | geschäftliche E-Mail, `recht/pflichtangaben.md` |
| `[TELEFON]` | nur falls Telefon ja; sonst Zeile löschen |
| `[STRASSE]`, `[PLZ]` | nur falls eine Adresse öffentlich sein soll; sonst bleiben nur Ort und Kanton |
| `[LINKEDIN-URL]` | LinkedIn-Unternehmensseite und Profil Mattia |
| `[LOGO-URL]`, `[PORTRAIT-URL]` | kommen mit der Website |

**Ohne öffentliche Adresse** bleibt `address` bei Ort, Kanton und Land. Das
ist gültig, reicht aber nicht für alle lokalen Google-Funktionen. Das
Google-Unternehmensprofil kann die Adresse trotzdem verbergen (Einzugsgebiet).

## 1 · Startseite: Betrieb, Person, Website

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://signedbymattia.ch/#betrieb",
      "name": "signedbymattia",
      "url": "https://signedbymattia.ch/",
      "logo": "[LOGO-URL]",
      "image": "[LOGO-URL]",
      "description": "Websites, Automationen und Sichtbarkeit für kleine Betriebe in Luzern. Von Grund auf gestaltet, von Mattia signiert.",
      "slogan": "Kein Template. Ein Werk.",
      "founder": { "@id": "https://signedbymattia.ch/#mattia" },
      "email": "[E-MAIL]",
      "telephone": "[TELEFON]",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "[STRASSE]",
        "postalCode": "[PLZ]",
        "addressLocality": "Luzern",
        "addressRegion": "LU",
        "addressCountry": "CH"
      },
      "areaServed": [
        { "@type": "City", "name": "Luzern" },
        { "@type": "AdministrativeArea", "name": "Kanton Luzern" },
        { "@type": "Country", "name": "Schweiz" }
      ],
      "knowsLanguage": "de-CH",
      "priceRange": "CHF 290–2'990",
      "sameAs": ["[LINKEDIN-URL]"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Leistungen",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@id": "https://signedbymattia.ch/webdesign-luzern/#leistung" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://signedbymattia.ch/automatisierung/#leistung" } },
          { "@type": "Offer", "itemOffered": { "@id": "https://signedbymattia.ch/seo-luzern/#leistung" } }
        ]
      }
    },
    {
      "@type": "Person",
      "@id": "https://signedbymattia.ch/#mattia",
      "name": "Mattia [NACHNAME]",
      "jobTitle": "Webdesigner und Entwickler",
      "worksFor": { "@id": "https://signedbymattia.ch/#betrieb" },
      "image": "[PORTRAIT-URL]",
      "sameAs": ["[LINKEDIN-URL]"]
    },
    {
      "@type": "WebSite",
      "@id": "https://signedbymattia.ch/#website",
      "url": "https://signedbymattia.ch/",
      "name": "signedbymattia",
      "inLanguage": "de-CH",
      "publisher": { "@id": "https://signedbymattia.ch/#betrieb" }
    }
  ]
}
```

`priceRange`: vom günstigsten Baustein (Google-Profil CHF 290) bis Website +
Sichtbarkeit + ein Ablauf (CHF 2'990), Preismatrix `website/preisrechner.md`.

## 2 · Kaufseiten: Leistung mit Preis

URLs sind Vorschläge [A], entschieden werden sie beim Bau.

**Kaufseite I** (`/webdesign-luzern/`), Preis entschieden [F]:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://signedbymattia.ch/webdesign-luzern/#leistung",
      "name": "Website Core",
      "serviceType": "Webdesign",
      "description": "Website bis 5 Seiten, von Grund auf gestaltet und auf Anfragen ausgerichtet, mit lokalen SEO-Grundlagen und Aufschaltung.",
      "provider": { "@id": "https://signedbymattia.ch/#betrieb" },
      "areaServed": { "@type": "City", "name": "Luzern" },
      "offers": {
        "@type": "Offer",
        "price": "1600",
        "priceCurrency": "CHF",
        "url": "https://signedbymattia.ch/webdesign-luzern/"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Start", "item": "https://signedbymattia.ch/" },
        { "@type": "ListItem", "position": 2, "name": "Webdesign Luzern", "item": "https://signedbymattia.ch/webdesign-luzern/" }
      ]
    }
  ]
}
```

**Kaufseite II** (`/automatisierung/`), „ab CHF 500“ [F]: gleicher Aufbau,
aber `name` „Automation Core“, `serviceType` „Prozessautomatisierung“ und der
Preis als Untergrenze:

```json
"offers": {
  "@type": "Offer",
  "priceCurrency": "CHF",
  "priceSpecification": { "@type": "PriceSpecification", "minPrice": "500", "priceCurrency": "CHF" },
  "url": "https://signedbymattia.ch/automatisierung/"
}
```

**Kaufseite III + IV** (`/seo-luzern/`): gleicher Aufbau, `name` „Sichtbarkeit:
SEO, GEO und Google-Profil“, `serviceType` „Suchmaschinenoptimierung“.
Preis ab CHF 290 (Google-Profil allein; SEO + GEO CHF 690, beides CHF 890):

```json
"offers": {
  "@type": "Offer",
  "priceCurrency": "CHF",
  "priceSpecification": { "@type": "PriceSpecification", "minPrice": "290", "priceCurrency": "CHF" },
  "url": "https://signedbymattia.ch/seo-luzern/"
}
```

## 3 · Blogartikel

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Titel aus website/seo-titel.md]",
  "description": "[Beschreibung aus website/seo-titel.md]",
  "image": "[BILD-URL, mind. 1200 px breit]",
  "datePublished": "[JJJJ-MM-TT]",
  "dateModified": "[JJJJ-MM-TT]",
  "inLanguage": "de-CH",
  "author": { "@id": "https://signedbymattia.ch/#mattia" },
  "publisher": { "@id": "https://signedbymattia.ch/#betrieb" },
  "mainEntityOfPage": "[ARTIKEL-URL]"
}
```

Dazu eine `BreadcrumbList` Start › Blog › Artikel wie bei den Kaufseiten.

## 4 · Übrige Seiten

| Seite | Markup |
| --- | --- |
| Editionen | `CollectionPage` mit `BreadcrumbList`. Konzepte **nicht** als `CreativeWork` mit Kunde auszeichnen, solange es Konzepte sind. |
| Blog-Übersicht | `Blog` mit `publisher`-Verweis |
| Atelier / Preisrechner | `WebPage` mit `BreadcrumbList`; keine Preise im Markup, weil Richtpreise |
| Kontakt, Danke, Impressum, Datenschutz | nur `WebPage` bzw. nichts; Danke-Seite `noindex` |
