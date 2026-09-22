# Deployment

## Vercel

Repository in Vercel importieren — mehr ist nicht nötig. Das Projekt liegt im Wurzelverzeichnis,
Vite wird erkannt, alles Weitere steht in `vercel.json`.

Zur Kontrolle, falls Vercel nachfragt:

- **Root Directory**: leer lassen
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (steht in `vercel.json`)
- **Output Directory**: `dist` (steht in `vercel.json`)
- **Node**: 20 oder neuer

`vercel.json` setzt außerdem:

- **Caching**: Alles unter `/assets/` bekommt `max-age=31536000, immutable`. Das ist sicher, weil
  jeder Dateiname einen Inhalts-Hash trägt — ändert sich das Bild, ändert sich der Name. Die
  `index.html` dagegen bekommt `must-revalidate`, sonst sähen Besucher nach einem Deploy noch die
  alte Fassung.
- **Kopfzeilen**: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, eine enge `Permissions-Policy`.
- **Rewrite** aller Pfade auf `index.html`. Die App hat keinen Router, aber so führt auch ein falsch
  getippter Pfad zur App statt zu einer 404-Seite.

`index.html` trägt `robots: noindex, nofollow` — es ist ein Kundenprototyp, keine öffentliche Seite.
Wer ihn zusätzlich schützen will, nimmt Vercels *Deployment Protection* (Passwort oder SSO).

## Die beiden Ausgabeformen

|  | Web (Vercel) | Stele (Kiosk) |
|---|---|---|
| Befehl | `npm run build` | `npm run build:stele` |
| Ergebnis | `dist/`, HTML + Assets mit Hash | `dist-stele/index.html`, eine Datei |
| Größe | 1,6 kB HTML, Rest einzeln und zwischenspeicherbar | rund 6,6 MB in einer Datei |
| Pfade | absolut (`/`) | relativ (`./`) |
| Zweck | läuft im Netz, lädt schnell | läuft offline per Doppelklick |

Die Stele-Variante muss alles inline haben (Bilder als base64), weil die Datei ohne Server direkt
vom Dateisystem geöffnet wird. Genau das wäre im Web die schlechteste Variante: Megabytes, die bei
jedem Aufruf komplett neu geladen werden und von denen der Browser nichts behalten kann. Deshalb
der Schalter `STELE=1` in `vite.config.ts` — nicht zwei getrennte Projekte.

`npm run export:stele` baut die Kiosk-Fassung und kopiert sie eine Ebene höher als
`stele-prototyp.html`. Dieser Pfad liegt außerhalb des Repositories; im geklonten Projekt landet
die Datei entsprechend neben dem Projektordner.

## Schriften

Die Hausschriften liegen lokal unter `src/assets/fonts-swb` und werden über `@font-face` in
`src/styles.css` eingebunden. Bewusst kein Google-Fonts-Link: Er würde Rajdhani ein zweites Mal von
einem fremden Server laden, auf der Stele ohne Netz gar nicht funktionieren und wäre bei einem
Auftritt der Stadtwerke auch datenschutzrechtlich zu klären.

## Vor jedem Deploy

```bash
npm run build
```

Der Build läuft `tsc --noEmit` mit; schlägt der Typecheck fehl, wird nicht deployed.
Vercel bricht in dem Fall ebenfalls ab und die bisherige Fassung bleibt online.
