# Werkzeuge

Kleine Hilfsskripte für Marke und Website. Einmal einrichten:

```bash
cd werkzeuge
npm install          # Playwright; die Browser liegen schon im Benutzerprofil
```

| Skript | Zweck | Beispiel |
| --- | --- | --- |
| `screenshot.cjs` | echte Seiten fotografieren (Referenzen, nur zum Studieren) | `node screenshot.cjs ../marke/referenzen basement=https://basement.studio` |
| `kontaktbogen.cjs` | viele Bilder als ein Raster sichten | `node kontaktbogen.cjs ../marke/referenzen bogen.png 4` |
| `met-cc0.cjs` | gemeinfreie Werke (CC0) aus dem Met Museum laden, mit `quellen.csv` | `node met-cc0.cjs ../marke/assets/barock "Tiepolo" 4` |

Diagramme und Zeitpläne: Skill **archify** (global installiert unter
`~/.claude/skills/archify`, MIT, github.com/tt-a1i/archify).

Regeln: Screenshots fremder Seiten nicht veröffentlichen. Bilder nur mit Lizenz,
jede Quelle in `quellen.csv` festhalten.
