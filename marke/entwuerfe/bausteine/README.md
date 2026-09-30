# Bausteine M1 · M7 · M9 (Entwurf)

Stand: 30.09.2026 · Tageslauf `plan/auftraege/2026-09-30.md` Aufgabe 1 · Grundlage:
`website/drehbuch/02-mechaniken.md` (M1, M7, M9), `01-bausteine.md` (B2, B4, B5),
`00-grammatik.md` (Werte), `marke/DESIGN.md` §2, §3. Wiederverwendbar in jedem Kapitel.

## Ansehen

```bash
python3 -m http.server 8123     # im Repo-Wurzelordner
# http://localhost:8123/marke/entwuerfe/bausteine/demo.html
```

Demo: Platzhalter-Szene (Tiepolo aus `../buehne/bilder/`), darauf M1, dann M7 mit 3 Karten M9.
Prüfung und Filmstreifen: `pruefung/`.

## Die Bausteine

| Baustein | Funktion | HTML (Klassen) | Was passiert |
| --- | --- | --- | --- |
| M1 Kapitel-Auftakt | `kapitelAuftakt(el, { faktor })` | `.b-auftakt` > `.b-auftakt__wort` + `.b-auftakt__satz.b-erscheint` | Kapitelwort (Host Grotesk 800, Zeilenhöhe 0.9) steigt `faktor`-mal so schnell wie der Scroll; der Erzählsatz blendet bei 30 % im Bild ein (0.5 s, `translateY(.4em)` → 0), die Initiale ab `scale(.95)` |
| B2 Initiale | (CSS) | `.b-initiale` > `img[aria-hidden]` + `.b-initiale__buchstabe` | SVG aus `../initialen/`, der echte Buchstabe bleibt im Text (nur visuell versteckt) |
| M7 Gerissenes Papier | `gerissenesPapier(el, optionen)` | `.b-papier` | Creme-Panel mit eigenem SVG-Rand: gerissene Kante aus 3 Wellen + Zufall (fester Seed), weicher Schatten auf der Szene, Korn, helle Fasern, wenige Goldkörner. Die Kante wandert beim Scrollen um ±`amplitude` px. Die Szene davor bleibt sichtbar, weil das Panel normal über eine `sticky` Szene scrollt |
| M9 Karte weckt sich | `karteWeckt(el)` | `.b-karte[data-farbe=1–3]` > `.b-karte__buehne` (`__eingabe` + `__ergebnis`) + `.b-karte__fuss` mit `button.b-karte__knopf` | Pastell-Leinwand (Korn, Gewebe, zwei Farbwolken derselben Farbe). Maus: Hover weckt. Handy: Tippen schaltet um, Tippen daneben schliesst. Auf 220 ms, zurück 160 ms, `cubic-bezier(.23,1,.32,1)`, Zeilen gestaffelt 40 ms. Tastatur (Knopf): ohne Animation |
| Hilfen | `beiScroll(f)`, `fortschritt(el)`, `einblenden(els)`, `ruhig()`, `alleStarten()` | – | eine gemeinsame Scroll-Schleife (1 rAF je Scroll), Fortschritt 0–1 eines hohen Abschnitts, Text beim ersten Sehen |

Jede Funktion gibt eine Aufräum-Funktion zurück.

## Einbau

```html
<link rel="stylesheet" href="/marke/tokens.css">
<link rel="stylesheet" href="bausteine.css">
<script>document.documentElement.classList.add('js');</script>
<script type="module">
  import { alleStarten } from './bausteine.js';
  alleStarten();                     // oder einzeln: kapitelAuftakt(el, { faktor: 1.8 })
</script>
```

Ohne JavaScript ist alles sichtbar und lesbar (Text steht im HTML, `.b-erscheint` nur mit `.js` versteckt).
Ohne JavaScript fehlt nur die Papierkante (das Panel ist dann gerade).

## Stellschrauben (`PARAMETER` oben in `bausteine.js`)

| Wert | Standard | Wirkung |
| --- | --- | --- |
| `auftakt.faktor` | 1.6 | wie viel schneller als der Scroll das Kapitelwort steigt (1 = gleich schnell) |
| `papier.hoehe` | 46 | Höhe der gerissenen Kante in px |
| `papier.amplitude` | 5 | wie weit die Kante beim Scrollen wandert (px) |
| `papier.fasern` | 0.07 | Fasern je px Kantenlänge |
| `papier.glitzer` | 0.012 | Goldkörner je px Kantenlänge |
| `papier.seed` | 7 | andere Zahl = andere Kante |
| `text.schwelle` | 0.3 | ab welchem Anteil im Bild der Text erscheint |

## Regeln, die eingehalten sind

- Nur `transform` und `opacity` animiert; Hover nur hinter `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion`: Wort und Kante stehen still, alles blendet nur 0.2 s ein.
- Werte aus `marke/tokens.css` (Farben, Schriften, Laufweite, Knopf, Goldrahmen), nichts kopiert.
- Alle Werbesätze sind `[Platzhalter]`, Beispieldaten `[Beispiel]`.

## Was fehlt (bewusst)

- Initiale „zeichnet sich" (Kontur 0.7 s, Tinte 0.25 s) aus der Grammatik: braucht Initialen mit
  Pfad-Kontur statt `<img>`; bis dahin einfaches Einblenden.
- Kapitelwort ist ein einzelnes Wort; mehrzeilige Wörter sind nicht geprüft.
