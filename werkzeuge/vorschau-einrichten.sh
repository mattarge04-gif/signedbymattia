#!/usr/bin/env bash
# Einmalig: Vorschau-Seite vorschau.signedbymattia.ch auf dem Hostinger-VPS einrichten (31.10.2026).
# Legt /opt/vorschau + Container „vorschau“ (nginx) im Netz von n8n an und hängt EINEN Block an
# /opt/n8n/Caddyfile (Passwortschutz, noindex). n8n und hood bleiben unberührt, Caddy wird nur neu geladen.
# Das Passwort wird zufällig erzeugt und nur am Schluss angezeigt; auf dem Server liegt nur der Hash.
# Aufruf aus der Repo-Wurzel: bash werkzeuge/vorschau-einrichten.sh
set -euo pipefail
ZIEL=root@187.7.19.144
SCHLUESSEL=~/.ssh/hostinger_vorschau
PW=$(python -c "import secrets; print(secrets.token_urlsafe(12))")

ssh -i "$SCHLUESSEL" -o BatchMode=yes "$ZIEL" PW="$PW" 'bash -s' <<'FERN'
set -euo pipefail
if grep -q '^vorschau.signedbymattia.ch' /opt/n8n/Caddyfile; then echo "Block existiert schon, nichts geändert."; exit 1; fi
cp /opt/n8n/Caddyfile /opt/n8n/Caddyfile.bak-2026-10-31
mkdir -p /opt/vorschau
[ -f /opt/vorschau/index.html ] || echo '<!doctype html><title>Vorschau</title>' > /opt/vorschau/index.html
docker ps -a --format '{{.Names}}' | grep -qx vorschau || \
  docker run -d --name vorschau --restart unless-stopped --network n8n_n8n_network \
    -v /opt/vorschau:/usr/share/nginx/html:ro nginx:alpine >/dev/null
HASH=$(docker exec n8n-caddy-1 caddy hash-password --plaintext "$PW")
cat >> /opt/n8n/Caddyfile <<EOF

vorschau.signedbymattia.ch {
    basic_auth {
        mattia $HASH
    }
    header X-Robots-Tag "noindex, nofollow"
    reverse_proxy vorschau:80
}
EOF
if ! docker exec n8n-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  cp /opt/n8n/Caddyfile.bak-2026-10-31 /opt/n8n/Caddyfile
  echo "Caddyfile ungültig, alter Stand wiederhergestellt."; exit 1
fi
docker exec n8n-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
echo "Server fertig."
FERN

echo
echo "Vorschau: https://vorschau.signedbymattia.ch  Benutzer: mattia  Passwort: $PW"
echo "(Passwort im Passwort-Manager speichern, es steht nirgends sonst.)"
