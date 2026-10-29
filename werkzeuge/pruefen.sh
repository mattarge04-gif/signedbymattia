#!/usr/bin/env bash
# Szene prüfen, bevor Mattia sie sieht: Mausrad-Scroll aufnehmen → Kontaktbogen (12 Bilder, nummeriert)
# → Codex urteilt nach werkzeuge/pruefliste.md gegen das Drehbuch (schreibgeschützt, ChatGPT-Abo).
# Aufruf (aus der Repo-Wurzel, Server läuft: python -m http.server 8766):
#   bash werkzeuge/pruefen.sh <bahn-selektor> <von> <bis> <drehbuch.md> [url]
# Beispiel: bash werkzeuge/pruefen.sh "#k2Bahn" 0.1 0.4 website/drehbuch/12-kapitel-2.md
set -euo pipefail
BAHN="$1"; VON="$2"; BIS="$3"; DREHBUCH="$4"
URL="${5:-http://localhost:8766/marke/entwuerfe/hero/index.html}"
WURZEL="$(cd "$(dirname "$0")/.." && pwd)"
AUS="${TMPDIR:-/tmp}/pruefen-$(date +%H%M%S)"

cd "$WURZEL/werkzeuge"
node scroll-pruefen.cjs "$URL" "$BAHN" "$VON" "$BIS" "$AUS"

# Kontaktbogen: 12 gleichmässig verteilte Bilder, je mit Nummer
python -I - "$AUS" <<'EOF'
import glob, sys
from PIL import Image, ImageDraw
aus = sys.argv[1]
fs = sorted(glob.glob(aus + '/f*.jpg'))
sel = [fs[round(i * (len(fs) - 1) / 11)] for i in range(12)]
b = Image.new('RGB', (4 * 720, 3 * 450), 'white')
for i, f in enumerate(sel):
    im = Image.open(f).resize((720, 450))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 44, 30], fill='black')
    d.text((10, 8), str(i + 1), fill='white')
    b.paste(im, ((i % 4) * 720, (i // 4) * 450))
b.save(aus + '/bogen.jpg', quality=82)
EOF

cd "$WURZEL"
{
  echo "Du bist der Prüfer dieser Website. Lies werkzeuge/pruefliste.md und das Drehbuch $DREHBUCH."
  echo "Der angehängte Kontaktbogen zeigt 12 Bilder (nummeriert, links oben nach rechts unten) aus einem"
  echo "echten Mausrad-Scroll durch die Szene. Beantworte die Prüfliste hart und ehrlich auf Deutsch"
  echo "(Schweizer Hochdeutsch, kein Eszett). Ändere keine Dateien."
} | codex exec -s read-only -i "$AUS/bogen.jpg" - 2>/dev/null | tail -n 40
echo "Kontaktbogen: $AUS/bogen.jpg"
