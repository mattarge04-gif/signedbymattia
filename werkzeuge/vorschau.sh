#!/usr/bin/env bash
# Lädt den Prototyp (marke/entwuerfe/hero + marke/tokens.css) auf vorschau.signedbymattia.ch.
# Gleiche Ordnerstruktur wie im Repo, damit ../../tokens.css stimmt; die Startseite leitet zum Prototyp weiter.
# Einrichtung des Servers einmalig mit werkzeuge/vorschau-einrichten.sh. Aufruf aus der Repo-Wurzel:
#   bash werkzeuge/vorschau.sh
set -euo pipefail
ZIEL=root@187.7.19.144
SCHLUESSEL=~/.ssh/hostinger_vorschau
cd "$(dirname "$0")/.."

# Das Skript für den Server geht als Befehl mit, die Dateien kommen als tar über stdin.
FERN=$(cat <<'EOS'
set -euo pipefail
NEU=/opt/vorschau.neu
rm -rf "$NEU" && mkdir -p "$NEU"
tar -xzf - -C "$NEU"
# Cache umgehen (Caddy schickt kein Cache-Control): eigene CSS/JS und die Seite selbst bekommen ?v=<Zeit>
V=$(date +%s)
sed -i -E "s#(href|src)=\"([^\":]+\.(css|js))\"#\1=\"\2?v=$V\"#g" "$NEU/marke/entwuerfe/hero/index.html"
printf '%s\n' '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">' \
  "<meta http-equiv=\"refresh\" content=\"0; url=marke/entwuerfe/hero/index.html?v=$V\"><title>Vorschau</title>" > "$NEU/index.html"
printf 'User-agent: *\nDisallow: /\n' > "$NEU/robots.txt"
# Inhalt austauschen, der Ordner selbst bleibt (er ist im Container eingehängt)
find /opt/vorschau -mindepth 1 -delete
cp -a "$NEU/." /opt/vorschau/
rm -rf "$NEU"
echo "hochgeladen: $(du -sh /opt/vorschau | cut -f1)"
EOS
)
tar -czf - marke/tokens.css marke/entwuerfe/hero | ssh -i "$SCHLUESSEL" -o BatchMode=yes "$ZIEL" "$FERN"
echo "https://vorschau.signedbymattia.ch"
