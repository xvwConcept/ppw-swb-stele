# SWB Stele — klickbarer Prototyp

Prototyp der Touch-Stele für das Servicecenter der Stadtwerke Bonn.
Entstanden bei PPW als Konzept- und Designarbeit.

Die Oberfläche ist für **1080 × 1920** gebaut (Hochformat, Touch) und wird per CSS-Transform
in das jeweilige Fenster skaliert. Am Rechner lässt sie sich deshalb in jeder Fenstergröße ansehen.

## Entwickeln

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

## Bauen

Es gibt **zwei Ausgabeformen aus derselben Quelle**, weil sie gegensätzliche Anforderungen haben:

| | Web (Vercel) | Stele (Kiosk) |
|---|---|---|
| Befehl | `npm run build` | `npm run build:stele` |
| Ergebnis | `dist/` — HTML plus Assets mit Inhalts-Hash | `dist-stele/index.html` — eine einzige Datei |
| Größe | 1,6 kB HTML, Rest einzeln und zwischenspeicherbar | rund 6,6 MB in einer Datei |
| Zweck | lädt schnell, cacht gut | läuft offline per Doppelklick, ohne Server |

`npm run export:stele` baut die Kiosk-Fassung und legt sie als `../stele-prototyp.html` ab.

Die Kiosk-Fassung muss alles inline haben (Bilder als base64), weil die Datei ohne Server direkt vom
Dateisystem geöffnet wird. Genau das wäre im Web die schlechteste Variante: Megabytes, die bei jedem
Aufruf neu geladen werden und von denen der Browser nichts behalten kann. Umgeschaltet wird über
`STELE=1` in `vite.config.ts` — deshalb zwei Skripte statt zwei Projekte.

## Deployment

Details in [DEPLOY.md](DEPLOY.md). Kurz: Repository in Vercel importieren, fertig. Das Projekt liegt
im Wurzelverzeichnis, Vite wird erkannt, Build-Befehl und Ausgabeordner stehen in `vercel.json` —
es ist nichts von Hand einzutragen.

## Aufbau

```
src/
  App.tsx              Bühne, Skalierung, Timeout, Vorhang-Wirt
  store.tsx            Zustand und Navigation (Reducer + Context)
  icons.ts             SWB-Icons als Inline-SVG
  data/content.ts      alle Texte und Inhaltsdaten
  screens/
    S01Lock.tsx        Startscreen mit Fragen-Schwarm und Bogen-Regler
    S02Waermepumpe.tsx Wärmepumpen-Seite (Lenis-Scroll, Kartenreihe, FAQ)
    S03Uebergabe.tsx   Beraterseite mit QR-Code
    S04Themen.tsx      Übersicht „Alle Bereiche"
  components/
    BonnScene.tsx      Lichtpunkt-Wolke über Bonn (three.js)
    bonnWorld.ts       Aufbau der Welt (Gelände, Stadt, Wahrzeichen)
    bonnForms.ts       Formen der Morph-Bühne
    Sheet.tsx          Bottom-Sheet für die Karten-Overlays
    …
  motion/
    curtain.ts         Screenwechsel (Farbflächen, Wasserzeichen)
    scroll.ts          Helfer für scrollgebundene Effekte
    ambient.ts         Ruhezustand der Szene
    sceneBus.ts        Themenwechsel zwischen Frage und Szene
```

Der Entwicklungsverlauf mit allen Entscheidungen und Korrekturen steht in [CHANGELOG.md](CHANGELOG.md).

## Technik

React 19, Vite 6, TypeScript, GSAP (Timelines, Flip, CustomEase), Lenis für den weichen Scroll,
three.js für die Punktwolke. Keine UI-Bibliothek, kein Router — die Navigation läuft über den Store.

Die Hausschriften (Rajdhani, Source Sans 3) liegen lokal unter `src/assets/fonts-swb` und sind per
`@font-face` eingebunden. Bewusst kein Google-Fonts-Link: Er würde die Schrift ein zweites Mal von
einem fremden Server laden, auf der Stele ohne Netz gar nicht funktionieren und wäre bei einem
Auftritt der Stadtwerke datenschutzrechtlich zu klären.

## Bildrechte

Die Fotos in `src/assets/photos` sind Platzhalter für den Prototyp. Herkunft und Lizenz stehen in
[src/assets/photos/CREDITS.md](src/assets/photos/CREDITS.md). Vor einer produktiven Nutzung sind sie
durch freigegebenes Bildmaterial der Stadtwerke zu ersetzen.
