import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Zwei Ausgabeformen aus derselben Quelle:
//
//   npm run build        → normaler Web-Build für Vercel. Assets werden als eigene Dateien mit Hash im
//                          Namen ausgeliefert, dadurch kann der Browser sie dauerhaft zwischenspeichern
//                          und parallel laden. Die drei großen Brocken (three.js, GSAP/Lenis, React)
//                          liegen in eigenen Bündeln, damit ein Codewechsel nicht alles entwertet.
//
//   npm run build:stele  → eine einzige HTML-Datei für die Stele. Die läuft offline per Doppelklick,
//                          deshalb muss alles inline sein (Bilder als base64). Für das Web wäre das
//                          die schlechteste Variante: 7 MB, die bei jedem Aufruf neu geladen werden,
//                          nichts davon zwischenspeicherbar.
//
// STELE=1 schaltet um (siehe package.json).
const stele = process.env.STELE === '1'

export default defineConfig({
  // Relative Pfade nur für die Stele (dort wird die Datei direkt vom Dateisystem geöffnet);
  // auf Vercel sind absolute Pfade richtig, sonst brechen Unterseiten die Asset-Auflösung.
  base: stele ? './' : '/',
  plugins: [
    react(),
    ...(stele ? [viteSingleFile({ useRecommendedBuildConfig: true, removeViteModuleLoader: true })] : []),
  ],
  build: {
    outDir: stele ? 'dist-stele' : 'dist',
    // Für die Stele alles inline; im Web nur echte Kleinstdateien (darunter lohnt keine eigene Anfrage).
    assetsInlineLimit: stele ? 100_000_000 : 4096,
    cssCodeSplit: !stele,
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: stele ? {} : {
      output: {
        // Nach Pfad statt nach Paketname: `react-dom` landete sonst im App-Bündel, weil der Einstieg
        // `react-dom/client` heißt und nicht auf den Paketnamen passt.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/three/')) return 'three'
          if (id.includes('/gsap/') || id.includes('/lenis/')) return 'motion'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react'
        },
      },
    },
  },
})
