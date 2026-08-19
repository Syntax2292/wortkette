# 🔗 Wortkette

Ein kleines Browser-Wortspiel: Bilde eine Kette aus Wörtern, bei der jedes neue Wort mit dem letzten Buchstaben des vorigen beginnt. Jedes Wort darf nur einmal verwendet werden, und die Uhr tickt — mit jedem Punkt wird die Zeit pro Zug knapper.

## Spielen

Einfach `index.html` im Browser öffnen — es sind keine Abhängigkeiten oder ein Build-Schritt nötig.

Alternativ lässt sich das Projekt über den mitgelieferten kleinen PowerShell-Server starten:

```powershell
./serve.ps1
```

Der Server läuft danach unter [http://localhost:8731](http://localhost:8731).

## Spielregeln

- Jedes neue Wort muss mit dem letzten Buchstaben des vorherigen Worts beginnen.
- Ein Wort darf innerhalb einer Kette nicht wiederholt werden.
- Für jedes gültige Wort gibt es einen Punkt, und die Zeit pro Zug verkürzt sich leicht.
- Das Spiel endet, wenn die Zeit abläuft. Der Bestwert wird lokal im Browser gespeichert.

## Dateien

- [`index.html`](index.html) — Struktur der Seite
- [`style.css`](style.css) — Styling
- [`script.js`](script.js) — Spiellogik
- [`serve.ps1`](serve.ps1) — einfacher lokaler Entwicklungsserver
