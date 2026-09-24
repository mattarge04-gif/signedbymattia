# UI-Regeln

Stand: 24.09.2026 · Status: **entschieden [F]** · Quelle: Vault `10_Notizen/UI-Regeln.md` (destilliert aus aurabot und The Vibe Code). Ab jetzt ist **dieses Dokument die Wahrheit**; die Vault-Notiz verweist hierher.

Projektspezifisches (Farben, Schriften, Inhalt) steht in `DESIGN.md` bzw. im jeweiligen Projekt. Werkzeuge: impeccable, taste-skill (AI Tool Box).

## Anti-Slop — nicht verwenden

- Drei identische Karten nur aus Gewohnheit
- Ueberall derselbe Aufbau: Eyebrow, H2, Absatz
- Gradient-Blobs ohne Bedeutung, abstrakte Stock-Illustrationen
- Uebertriebenes Glassmorphism, ueberall abgerundete Rechtecke
- Gradient-Schrift in jeder Sektion
- Generische Texte wie "Innovation neu gedacht"
- Icons ohne funktionale oder erzaehlerische Bedeutung
- Animationen, die nur Bewegung erzeugen
- Fake-Kundenlogos, Fake-Reviews, erfundene Resultate
- Neue Unterseiten nur fuer vermeintliches SEO
- Framework-Migration nur fuer einen visuellen Effekt

## Stattdessen

- Echte Bilder und kurze Videosequenzen, grosse visuelle Momente
- Asymmetrische, abwechslungsreiche Layouts statt Raster ueberall
- Typografische Kontraste, interaktive Demonstrationen
- Klar sichtbare naechste Handlung
- Konkrete, glaubwuerdige Aussagen
- **Wenige starke Designelemente statt vieler Dekorationen**

## Farbe

**Jede Farbe braucht eine Rolle.** Nicht gleichmaessig als Regenbogen verteilen,
sondern zuweisen:

| Rolle | Beispiel |
|---|---|
| Primaere Interaktion, Markenbasis | eine Hauptfarbe |
| Status, Bewegung, Aktivitaet | eine zweite |
| CTA und Momentakzente | eine warme dritte |

Helle und dunkle Kapitel duerfen kombiniert werden, aber der Wechsel muss **geplant
und rhythmisch** wirken, nicht zufaellig.

Gradients nur innerhalb derselben Farbe, dunkel zu hell. Dropshadows ja, aber mit
Blur und wenig Kontrast — weniger Noise ist besseres Design.

## Typografie

Maximal **zwei** Schriftfamilien. Eine emotionale fuer Headlines, Zitate und grosse
Zahlen; eine neutrale fuer Navigation, Text, Formulare und UI.

Spielen mit: sehr grossen Display-Headlines, unterschiedlichen Zeilenlaengen, kurzen
typografischen Aussagen, grossen Zahlen, kleinen technischen Labels.

Vermeiden: zu viele Schriften, duenne Texte mit zu wenig Kontrast, immer dieselbe
Headline-Groesse, Eyebrows vor jeder Ueberschrift.

Neue Schrift nur mit Begruendung und Freigabe — nicht einfach installieren.

## Bewegung

> **Entscheid 24.09.2026: Wow ist erwünscht, so viel wie möglich** (Vorbilder in
> `referenzen.md`). Es gibt kein Limit, sondern einen festen Ablauf für jeden
> Wow-Effekt:
>
> 1. **Vorschlag:** Der Agent schlägt den Effekt vor und beschreibt ihn.
> 2. **Quelle nennen:** woher der Effekt kommt, also Bibliothek, Tool, Codebeispiel
>    oder Website, auf der er zu sehen ist, mit Link und Lizenz.
> 3. **Prototyp:** eine lauffähige Version zum Anschauen.
> 4. **Mattias Änderungen:** Er sagt, was anders werden soll; der Agent passt an.
> 5. **Abschluss:** erst nach Mattias Freigabe fest eingebaut.
>
> Beim Abschluss wird zusätzlich geprüft [A, Empfehlung]: `prefers-reduced-motion`
> bietet eine ruhige Variante, und die Ladezeit am Handy ist gemessen. Die Regeln
> unten („keine Animation nur zur Dekoration“, „keine schwere Bibliothek ohne
> Freigabe“) gelten für Wow-Effekte als erfüllt, sobald der Ablauf oben
> durchlaufen ist.

- Keine Animation nur zur Dekoration
- Kein Scroll-Hijacking, keine dauerpulsierenden Elemente
- Keine schwere Animationsbibliothek ohne Freigabe
- `prefers-reduced-motion` vollstaendig respektieren
- Inhalt muss **ohne JavaScript** sichtbar und verstaendlich bleiben
- Mobile und Performance duerfen nicht leiden

Bei einer One-Page-Site sind CSS, SVG und Vanilla JS die bevorzugte Loesung. React
oder Next.js nicht wegen einer Animation einfuehren.

Viel Mikro-Interaktion ist erwuenscht: Button-Hover, Scroll-Effekte, Cursor-Reaktionen
an interaktiven Elementen. Icons brauchen eine Hover-Erklaerung, was sie tun.

## Arbeitsweise mit dem Agenten

- **Der Agent muss zuerst fragen.** Das gehoert explizit in den Prompt, sonst baut er los.
- Fuer UI die Skills nutzen statt alles im Prompt zu beschreiben — siehe
  [[Agenten-Dokumente]]
- Learnings aus jedem Projekt zurueck ins Repo, mit Namen, damit sie wiederverwendbar
  sind

## Sektionsfrage

Jede Sektion muss mindestens eine konkrete Frage des Besuchers beantworten. Beantwortet
sie keine, kommt sie raus. Das ersetzt jede Diskussion ueber "brauchen wir hier noch
etwas".
