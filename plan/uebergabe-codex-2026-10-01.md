# Übergabe an Codex: Gemini API für die Website-Bilder

Stand: 30.09.2026 abends · Von: Claude (Sitzung mit Mattia) · Für: Codex, Sitzung mit Mattia am 01.10.2026

## Ziel der Sitzung

Die **Gemini API (Nano Banana Pro)** so vorbereiten, dass der Tageslauf (GitHub Actions) Bilder für die
Website **automatisch erzeugen, freistellen und fürs Web umwandeln** kann. Mattia findet Stil und
Vorlagen abends selbst in der Gemini-App; die Masse (ca. 70 Bilder) soll über die API laufen.

## Was schon entschieden ist [F]

- Stil und Prompts: `website/drehbuch/03-bildstil.md` (Stil-Bibel „Barock + frecher Bruch", Palette aus
  `marke/tokens.css`, Prompts für Amor, E0 Himmel, E1 Kuppelrand).
- Auslieferung der Bilder: `website/drehbuch/00-grammatik.md` Abschnitt „Bilder ohne Ladeprobleme"
  (Original hoch aufgelöst im Archiv; Web als AVIF/WebP in ca. 800/1600/2400 px; Figuren mit
  Transparenz; Skizze ca. 20 KB zuerst).
- Werkzeug: Google AI Pro (privates Konto) für Stil; **Gemini API für die Masse** (`entscheide.md`, 30.09.).
- Erstes Original: `marke/assets/hero/e0-himmel.jpg` (2752×1536) mit `marke/assets/hero/quellen.csv`.
- Tageslauf: `.github/workflows/tageslauf.yml`, Regeln `plan/auftraege/README.md`, Budget-Logik
  (Kostenzähler Branch `kosten`, Telegram bei 25/50/75 %).

## Kosten [A] (Recherche 30.09.2026, vor Gebrauch prüfen)

Nano Banana Pro über die API: ca. USD 0.134 pro Bild in 1K/2K, ca. USD 0.24 in 4K; Batch-API −50 %.
Alle ca. 72 Bilder der Website mit Versuchen: ca. USD 25–60. **Modell-ID in der API vor dem Einbau in
der offiziellen Google-Doku prüfen [A]** (nicht raten).

## Aufgaben für den 01.10.2026

1. **Mattia (ohne Agent):** In Google AI Studio (privates Konto) einen API-Schlüssel anlegen, Abrechnung
   aktivieren, in der Google Cloud Console ein **Budget mit Warnungen** (Vorschlag USD 30) setzen. Der
   Schlüssel kommt **nur** als GitHub-Secret `GEMINI_API_KEY` ins Repo (Settings › Secrets › Actions),
   **nie in Dateien oder Chat**.
2. **Skript `werkzeuge/bild-erzeugen.*`:** Prompt-Datei + optionale Referenzbilder rein → Original(e)
   nach `marke/assets/<szene>/`, Eintrag in `quellen.csv` (Datei, Beschreibung, Werkzeug, Modell, Datum,
   Prompt-Verweis, Kosten). Zähler, der vor jedem Aufruf die Tages-/Monatsgrenze prüft und abbricht.
3. **Skript Web-Fassungen:** Original → freistellen (Figuren; z. B. `rembg`), AVIF/WebP in 800/1600/2400 px,
   Bleistift-Skizze ca. 20 KB. Ziel-Ordner mit Claude/Mattia abstimmen, bevor viel entsteht.
4. **Tageslauf anbinden:** Secret im Workflow bereitstellen, Pakete installieren (im Schritt „Branch und
   Werkzeuge bereitstellen"), Kosten der Bilder zusätzlich in `kosten.csv` erfassen.
5. **Test mit einem Bild** (z. B. E1 Kuppelrand oder Amor aus `03-bildstil.md`), Kosten unter USD 1.

## Grenzen

- Nichts an Drehbüchern, Marke oder Entscheiden ändern; bei offenen Fragen `[?]` markieren und Mattia fragen.
- Workflow-Änderungen als Pull Request, nicht direkt auf `main` (Tageslauf läuft von `main`).
- Keine Geheimnisse in Dateien, keine Ausgaben ohne Grenze.

## Offen [?]

- Monatsbudget für die Gemini API (Vorschlag USD 30) und ob es in `agency-automation-os`
  `budgets.yaml` eingetragen wird.
- Offener PR #25 (Tageslauf 30.09., Prototyp Bausteine + Wasserspiele): Grafik von Mattia als ungenügend
  bewertet, Technik ok; nicht mergen ohne Mattia.
