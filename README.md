# signedbymattia — Agency-Handbuch

Das zentrale Repo der Agency **signedbymattia**. Hier stehen die Grundlagen, die
jedes andere Repo braucht. Regeln für Agenten: [`CLAUDE.md`](CLAUDE.md).

> Die Website wird ab 24.09.2026 im Repo
> [signedbymattia-website](https://github.com/mattarge04-gif/signedbymattia-website)
> gebaut. Die früheren Website-Issues #1–#4 sind dorthin verschoben.

```mermaid
flowchart TB
    CORE[signedbymattia<br/>Grundlagen · Marke · Vorlagen · Abläufe]
    WEB[signedbymattia-website]
    MKT[agency-marketing]
    LEAD[agency-automation-os<br/>Lead Bot · Budgets]
    K[kunde-&lt;name&gt;<br/>je Kunde]
    V[(obsidian-vault)]
    CORE --> WEB
    CORE --> MKT
    CORE --> LEAD
    CORE --> K
    LEAD -. budgets.yaml .-> MKT
    V -. Verweise .-> CORE
```

## Inhalt

| Ordner | Dokument | Stand | Zielplan |
| --- | --- | --- | --- |
| `grundlagen/` | [Positionierung](grundlagen/positionierung.md) | Richtung entschieden, 5 Sätze Entwurf | KW 39 |
| | [Zielkunden](grundlagen/zielkunden.md) | teilweise entschieden | KW 39 |
| | [Angebote und Preise](grundlagen/angebote-preise.md) | Fokus entschieden, Zusatzpreise offen | KW 40 |
| | [Was wir nicht machen](grundlagen/ausschluesse.md) | teilweise | KW 40 |
| | [Konkurrenz](grundlagen/konkurrenz.md) | Recherche 23./24.09.2026 | – |
| `marke/` | [Tonalität](marke/tonalitaet.md) | Anrede und Ich-Form entschieden | KW 41 |
| | [DESIGN.md](marke/DESIGN.md) | Gerüst, Werte offen | KW 43 |
| | [UI-Regeln](marke/ui-regeln.md) | entschieden | – |
| | [Referenzen und Lieblingsseiten](marke/referenzen.md) | offen | KW 39 |
| `website/` | [Seitenstruktur eigene Website](website/seitenstruktur.md) | Entwurf | KW 41 |
| `recht/` | [Pflichtangaben und Recht](recht/pflichtangaben.md) | offen | KW 42 |
| `vorlagen/` | [Vorlagen-Index](vorlagen/README.md) | Index | – |
| `prozesse/` | [Neues Kundenrepo anlegen](prozesse/kunden-repo.md) | Entwurf | – |
| | [Entscheide](entscheide.md) | laufend | – |

Die Spalte „Zielplan“ zeigt, in welcher Woche des Zielplans (Vault) die
Aufgabe dazu steht.
