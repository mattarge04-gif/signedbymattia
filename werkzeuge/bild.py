#!/usr/bin/env python3
"""Bilder mit Gemini (Nano Banana) über Vertex AI erzeugen oder bearbeiten.

Bezahlt wird über das Cloud-Guthaben aus Mattias Google-AI-Pro-Abo (USD 10/Monat, Projekt
signedbymattia-bilder, Budget-Warnung CHF 9). Anmeldung: gcloud auth application-default login
(liegt im Benutzerordner, kein Schlüssel im Repo). Nur Standardbibliothek.

    python werkzeuge/bild.py -p "Prompt" -o marke/assets/x/bild.jpg --format 16:9 --groesse 4K
    python werkzeuge/bild.py --prompt-datei prompt.txt -r vorlage.jpg -r stil.jpg -o neu.jpg
    python werkzeuge/bild.py --kosten

Harter Stopp: Jeder Aufruf wird in werkzeuge/bild-kosten.csv geschätzt eingetragen; ab USD 8 im
laufenden Monat bricht das Skript ab (die Budget-Warnung von Google stoppt nichts).
Preise pro Bild sind Schätzungen [A] (Stand 30.09.2026), vor grossen Serien prüfen.
"""

import argparse
import base64
import csv
import datetime as dt
import json
import mimetypes
import pathlib
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

PROJEKT = 'signedbymattia-bilder'
WURZEL = pathlib.Path(__file__).resolve().parent.parent
KOSTEN = WURZEL / 'werkzeuge' / 'bild-kosten.csv'
GRENZE_USD = 8.0
# geschätzte USD pro Bild je Grösse [A]
PREIS = {'1K': 0.14, '2K': 0.14, '4K': 0.24}
MODELLE = {'2.1': 'gemini-nano-banana-2.1', 'pro': 'gemini-3-pro-image'}


def gcloud():
    for kandidat in [shutil.which('gcloud'), shutil.which('gcloud.cmd'),
                     pathlib.Path.home() / 'AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin/gcloud.cmd']:
        if kandidat and pathlib.Path(kandidat).exists():
            return str(kandidat)
    sys.exit('gcloud nicht gefunden. Installieren: winget install Google.CloudSDK')


def token():
    r = subprocess.run([gcloud(), 'auth', 'application-default', 'print-access-token'],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit('Keine Anmeldung. Einmal ausführen: gcloud auth application-default login')
    return r.stdout.strip()


def monat_summe():
    if not KOSTEN.exists():
        return 0.0
    monat = dt.date.today().strftime('%Y-%m')
    with KOSTEN.open(encoding='utf-8') as f:
        return sum(float(z['usd']) for z in csv.DictReader(f) if z['datum'].startswith(monat))


def eintragen(modell, groesse, usd, ausgabe, prompt):
    neu = not KOSTEN.exists()
    with KOSTEN.open('a', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        if neu:
            w.writerow(['datum', 'modell', 'groesse', 'usd', 'datei', 'prompt'])
        w.writerow([dt.datetime.now().isoformat(timespec='seconds'), modell, groesse, f'{usd:.2f}',
                    ausgabe, prompt[:120].replace('\n', ' ')])


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument('-p', '--prompt')
    a.add_argument('--prompt-datei')
    a.add_argument('-r', '--referenz', action='append', default=[], help='Referenz- oder Ausgangsbild (mehrfach)')
    a.add_argument('-o', '--ausgabe', help='Zieldatei; die Endung folgt dem gelieferten Format')
    a.add_argument('-m', '--modell', default='2.1', help='2.1 (Standard, wie Gemini-App) oder pro')
    a.add_argument('--format', default='16:9', help='Seitenverhältnis, z. B. 16:9, 3:4, 1:1')
    a.add_argument('--groesse', default='2K', choices=['1K', '2K', '4K'])
    a.add_argument('--kosten', action='store_true', help='nur Monatssumme zeigen')
    x = a.parse_args()

    if x.kosten:
        print(f'Diesen Monat geschätzt: USD {monat_summe():.2f} von {GRENZE_USD:.2f}')
        return
    prompt = x.prompt or (pathlib.Path(x.prompt_datei).read_text(encoding='utf-8') if x.prompt_datei else None)
    if not prompt or not x.ausgabe:
        a.error('Prompt (-p oder --prompt-datei) und Ausgabe (-o) sind nötig')

    usd = PREIS[x.groesse]
    if monat_summe() + usd > GRENZE_USD:
        sys.exit(f'Stopp: Monatsgrenze USD {GRENZE_USD} wäre überschritten ({monat_summe():.2f} verbraucht).')

    modell = MODELLE.get(x.modell, x.modell)
    teile = []
    for ref in x.referenz:
        mime = mimetypes.guess_type(ref)[0] or 'image/jpeg'
        teile.append({'inlineData': {'mimeType': mime, 'data': base64.b64encode(pathlib.Path(ref).read_bytes()).decode()}})
    teile.append({'text': prompt})
    koerper = {
        'contents': [{'role': 'user', 'parts': teile}],
        'generationConfig': {'responseModalities': ['IMAGE'],
                             'imageConfig': {'aspectRatio': x.format, 'imageSize': x.groesse}},
    }
    url = (f'https://aiplatform.googleapis.com/v1/projects/{PROJEKT}/locations/global'
           f'/publishers/google/models/{modell}:generateContent')
    anfrage = urllib.request.Request(url, data=json.dumps(koerper).encode(), headers={
        'Authorization': f'Bearer {token()}', 'Content-Type': 'application/json'})
    # Ratenlimit (429): bis zu 5 Versuche mit wachsender Pause, kostet nichts
    for versuch in range(5):
        try:
            with urllib.request.urlopen(anfrage, timeout=300) as r:
                antwort = json.load(r)
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and versuch < 4:
                time.sleep(20 * (versuch + 1))
                continue
            sys.exit(f'Fehler {e.code}: {e.read().decode()[:800]}')

    bilder = [t['inlineData'] for k in antwort.get('candidates', [])
              for t in k.get('content', {}).get('parts', []) if 'inlineData' in t]
    if not bilder:
        sys.exit('Kein Bild erhalten: ' + json.dumps(antwort)[:800])
    eintragen(modell, x.groesse, usd, x.ausgabe, prompt)
    ziel = pathlib.Path(x.ausgabe)
    ziel.parent.mkdir(parents=True, exist_ok=True)
    for n, b in enumerate(bilder):
        endung = mimetypes.guess_extension(b.get('mimeType', 'image/png')) or '.png'
        pfad = ziel.with_suffix(endung) if n == 0 else ziel.with_name(f'{ziel.stem}-{n + 1}{endung}')
        pfad.write_bytes(base64.b64decode(b['data']))
        print(f'gespeichert: {pfad}')
    print(f'geschätzt USD {usd:.2f}, Monat USD {monat_summe():.2f} von {GRENZE_USD:.2f}')


if __name__ == '__main__':
    main()
