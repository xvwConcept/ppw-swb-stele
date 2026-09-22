# Entwicklungsverlauf

Mitschrift der Änderungen am Prototyp: was geändert wurde, warum, und was dabei schiefging.
Neueste Einträge stehen unten.


## Dateien
- `stele-prototyp.html` — fertiger Prototyp als eine Datei (Vite-Singlefile, Fonts, Icons und Logo eingebettet). Läuft per Doppelklick in Chrome oder Safari, ohne Server. Rajdhani wird zusätzlich von Google Fonts geladen, offline greift das eingebettete Subset.
- `app/` — Quellcode (Vite + React + TypeScript + GSAP). `npm install`, dann `npm run dev` (http://127.0.0.1:5173) oder `npm run build` (erzeugt `app/dist/index.html`, danach nach `stele-prototyp.html` kopieren).
- `00_Plan_Prototyp.md` — Umsetzungsplan mit Entscheidungen, Navigationskonzept, Tokens, Screen-Spezifikation und offenen Fragen.
- `assets/` — aus den Claude-Design-Exporten extrahierte Icons, Grafiken und Fonts (siehe `assets/README.md`), plus SWB-Energie-Logo aus Figma.
- `referenz/stele-editor.html` — Kundenreferenz (Bedienkonzept, Teal-Look, Skyline-Animation), nur als Stilvorlage.

## URL-Parameter und Präsentationsmenü
- `?dev=1` oder Logo fünfmal antippen: Präsentationsmenü mit Direktsprüngen (S01 bis S04, Platzhalterseite) und Schaltern.
- `?dichte=ausfuehrlich` — Wärmepumpen-Seite in der Langfassung (Polaritäten-Vergleich für das Marketing), Standard ist `kompakt`.
- `?fernwaerme=1` — Fernwärme als eigenes Feld in der offenen Leiste.
- `?timeout=0` — Timeout aus (für Präsentationen). Standard: 60 s Hinweis, 20 s Countdown, dann Reset auf S01.
- `?code=0` — Übergabe-Screen ohne Code (Wegweiser-Text statt „Für Elise").

## Flow
S01 Lock-Screen (Fragen-Schwarm, Bogen-Slider bei der kWh-Frage) → Antwort → Karte dreht → „Mehr zur Wärmepumpe" → S02 Story-Scroll mit Sektionen (Rechner, Eignung, Kosten, Ablauf, Kombination, Warum SWB, Fragen, CTA) → Berater → S03 Übergabe (Fakten aus der Session, Code, QR/NFC, Sitzung beenden). „Alle Bereiche" öffnet das Bottom-Sheet-Menü, die große Übersicht ist S04. Timeout und Neu starten greifen auf allen Screens außer S01.

## Inhalte pflegen
Alle Texte liegen in `app/src/data/content.ts` (Fragenpool, Sektionen in zwei Dichten, S03, S04, Systemtexte). Angaben mit (W) stammen von stadtwerke-bonn.de und sind vor Freigabe beim Kunden zu bestätigen, (F) ist fachlich freizugeben.

## Designsystem-Quelle (18.09.2026, zweiter Stand)
Tokens, Schriften, Buttons, Icons und Logo stammen jetzt vom Live-Designsystem `release.stadtwerke-bonn.de` (Kopie von `main.css`, Fonts und Icons in `assets/swb-website/`, Zusammenfassung in `assets/swb-website/DESIGNSYSTEM.md`). Wichtigste Folgen im Prototyp: Rajdhani nur für Überschriften und Kennzahlen, Source Sans 3 Variable für Text, Buttons und Labels (Gewichte 380/665); weißer Header mit Logo „SWB Gruppe" und weiße Leiste (Icons brand-700); Pillen mit Chip brand-200 und Pfeil brand-900, Sekundär-Pille mit Rand brand-900; Radien 8 bis 12 px statt 30; Schatten `shadow-l-light` / `shadow-l-neutral`; Bühnenhintergrund `gradient-primary`.

## Dritter Stand (18.09.2026, nachmittags)
- Hintergrund-Animation (Skyline, Partikel) entfernt. Hintergrund neutral-100 mit dezentem brand-50-Schimmer, wie die helle Fläche der Website.
- Kein Header-Balken mehr: Logo, Pfad und Neu starten liegen frei auf dem Hintergrund.
- Leiste unten als minimale Textleiste nach dem noho-Menü (weiß, feine Trennlinien, Berater in accent-500), keine Icons.
- Layout nach awwwards/noho-Prinzipien: große Rajdhani-Display-Zeilen links, viel Weißraum, Linien statt Kästen, keine Karte in der Karte. Radien 0 wie die Tiles der Release-Seite (Pillen bleiben rund).
- Unterseiten (S02) per Tipp statt Scrollen: eine Sektion je Ansicht, „Weiter" und eine Punkt-Rail rechts, jede Sektion mit gestaffeltem Reveal.
- Overlays: Bottom-Sheet ohne Radius und Griff, Menü-Kacheln als DS-Tiles (weiß, Schatten, Akzentleiste).

## Vierter Stand (18.09.2026, spät)
- Leiste unten: sechs gleich breite Kacheln (Wärmepumpe, Photovoltaik, E-Mobilität, Strom & Tarif, Alle Bereiche → Übersicht S04, Berater), auf jedem Screen identisch. Zurück sitzt oben neben dem Logo.
- Lock-Screen: generative Bonn-Skyline mit p5.js im oberen Bereich, darunter ein Band kleiner Fragekarten, das auf einer Ebene endlos nach links läuft (stoppt bei Berührung), unten die Hauptfrage kompakter in einer Karte.
- Wärmepumpen-Seite nach noho.ink: Hero mit Foto und Kennzahlen, Stories-Rail (Modulkarten laufen horizontal über den Rand, beim Scrollen stapeln sich vorbeigezogene Karten links als Streifen, Tipp öffnet das Overlay mit Rechner, Eignung, Kosten, Ablauf, Kombination, Warum SWB), Kombination mit Foto, FAQ mit Bild links und Akkordeon rechts, Vorhang-Fußzeile „Sprechen Sie uns an." (liegt hinter dem Inhalt, erscheint am Ende). Scroll und Tipp beide möglich.
- Menü-Overlay entfernt, Akzentlinien in Kacheln entfernt, Fotos aus Wikimedia Commons (Credits in `app/src/assets/photos/CREDITS.md`, vor Kundeneinsatz ersetzen; das Hero-Foto stammt von homeandsmart.de, Rechte ungeklärt).

## Fünfter Stand (18.09.2026, abends)
- Dunkler Look: Bühne in brand-900 (Petrol), Texte weiß, helle Flächen (Karten, Sheets, Kacheln) mit dunklem Text. Logo weiß.
- Lock-Screen: p5.js-Strömungsfeld (Perlin Noise, Spuren in Cyan, Teal, wenig Lime) über die obere Fläche, darüber die Fragekarten als lockere Wolke mit weichem Drift; die Skyline ist weg.
- Timeout-Overlay neu: weiße Karte mit „Noch da?", Countdown-Ring in Lime, zwei Pillen.
- Wärmepumpen-Seite: Kopfzeile (Logo, Zurück, Pfad, Neu starten) ist Teil der Seite und scrollt mit heraus; Sektionen mit 150 px Abstand als eigene Fokusflächen; Wort-Kaskaden bei Überschriften, Parallax auf Fotos, hochzählende Kennzahlen; Lenis Smooth-Scroll mit Nachlauf wie bei noho.ink.

## Sechster Stand (18.09.2026, spät abends)
- Kopfzeile vereinheitlicht: nur noch ein Zurück-Icon (kein zusätzlicher „Zurück"-Text neben der Pfad-Anzeige) — Icon plus Breadcrumb sind jetzt ein Weg, nicht zwei parallele.
- Stories-Rail auf der Wärmepumpen-Seite: der Abschnitt bleibt beim Scrollen stehen (CSS sticky) und die Karten werden per Scroll-Fortschritt horizontal durchgeschaltet (GSAP ScrollTrigger + transform, kein natives horizontales Wischen mehr nötig). Punkte darunter zeigen den Fortschritt und sind antippbar. Danach geht es normal vertikal weiter zu Kombination und FAQ.
- Drei umschaltbare Looks (`?look=dark|light|glass`, Präsentationsmenü „Look: …") über CSS-Variablen: Flächen (Karten, Kacheln, Sheets) und die generative Kunst passen sich an.

## Siebter Stand (19.09.2026)
- Fehler behoben: Zwei alte CSS-Regeln haben die Flächen kaputt gemacht (eine erzwang dunklen Text auf Karten, `all: unset` der Kacheln löschte den Flächen-Hintergrund). Die Flächenregeln stehen jetzt am Ende des Stylesheets, die Look-Variablen (dark, light, glass) greifen wieder. Bühne im dunklen Look auf #00343b, Flächen in brand-800 mit feiner Kante, damit Karten klar lesbar sind.
- Wärmepumpen-Seite als gestapelte Kapitel: Hero mit randlosem Foto und Headline im Bild, dann sechs Kapitel (Nutzen, Passt das zu mir, Kosten, Ablauf, Kombination, Warum SWB) je eine Bildschirmhöhe. Jedes Kapitel bleibt stehen (sticky), das nächste schiebt sich darüber, das vorherige wird leicht kleiner und dunkler. Drei Bildlayouts: Foto oben, Foto links bis zum Rand, Foto vollflächig mit Text darüber. FAQ als letztes Kapitel mit Bild links und Akkordeon rechts, danach die Vorhang-Fußzeile.
- Die Stories-Rail ist entfernt; die Vertiefung je Kapitel läuft über den Button ins Overlay (Rechner, Eignung, Kosten, Ablauf, Kombination, Warum SWB).

## Achter Stand (19.09.2026)
- Wärmepumpen-Seite: die noho-Rail mit Stapel-Streifen ist zurück (horizontal wischen oder Pfeile, Karten davor werden zu Streifen, Tipp öffnet das Overlay), dazu Hero mit Foto, Kombination mit Foto links bis zum Rand, FAQ mit Bild links, Vorhang-Fußzeile. Die gestapelten Kapitel sind wieder raus.
- Kopf: nur noch das Logo. Zurück und Neu starten sitzen unten in der schmalen Leiste (Zurück · Alle Bereiche · Berater · Neu starten), oben erreicht sie an der Stele niemand. Die vier Themen-Kacheln darüber sind größer.
- Beraterseite neu: Foto mit Einladung bis zum Rand, links Ergebnis der Sitzung, rechts der Übergabe-Code in Lime, darunter drei Erwartungen, unten QR/NFC neben Weiter stöbern und Sitzung beenden.
- Übersicht: „Meistgefragt: Wärmepumpe" als Foto-Kachel.

## Neunter Stand (19.09.2026)
- Wärmepumpen-Rail nach noho: der Abschnitt bleibt beim Scrollen stehen (sticky), der weitere Scroll schaltet die Karten nach rechts durch, vorbeigezogene Karten stapeln sich links als beschriftete Streifen, dann geht es wieder nach unten. Pfeile und Punkte springen an die Stelle.
- Touch-Hinweise sichtbar animiert (Finger mit pulsierendem Ring): „Nach unten wischen" im Hero, „Weiter nach unten wischen: die nächste Karte kommt" an der Rail, „Tippen Sie auf Ihre Antwort" auf dem Lock-Screen.
- Leiste unten leicht durchsichtig mit Weichzeichner, der Inhalt läuft dahinter weiter (Screens haben unten 250 px Platz).
- Übersicht: Überschrift nicht mehr angeschnitten, kein Aufblitzen der Kacheln vor der Einblendung.

## Zehnter Stand (19.09.2026)
- Neue Fotos von Max: Beratungsbild (Berater und Kunde auf dem PV-Dach) als Hero der Beraterseite und rechts in der Vorhang-Fußzeile der Wärmepumpen-Seite; SWB-Stadtbahn als Hero der Platzhalter-Themenseiten (Photovoltaik, E-Mobilität, Strom & Tarif, Fernwärme, Beraten). Credits in `app/src/assets/photos/CREDITS.md`.

## Elfter Stand (19.09.2026)
- Wärmepumpen-Fotos von Max: Key Visual (Mann auf der Anlage) als Hero der Wärmepumpen-Seite, weiße Anlage am modernen Haus in der FAQ, SWB-Berater beim WP-Check im Heizungskeller in den Overlays Eignung und Ablauf. Jedes Modul-Overlay hat jetzt ein Foto im Kopf (Rechner: Haus, Kosten: Key Visual, Kombination: E-Auto, Warum SWB: Beratung).

## Zwölfter Stand (19.09.2026)
- Rail als Deck: alle Karten gleich breit (640 px), vorbeigezogene Karten bleiben liegen und stapeln sich mit 30 px Versatz links unter der aktuellen, die folgenden stehen rechts. Rail sitzt tiefer im Bild (sticky mit 380 px Abstand oben).
- Fotos: Gartenbild wieder als Hero, Key Visual in der FAQ, Anlage am modernen Haus im Rechner-Overlay.

## Dreizehnter Stand (19.09.2026)
- Lock-Screen: Bogen-Slider neu (Bogen über 280°, Lücke unten, Marken 1–6 als große Tippziele, Zahl mittig, alles relativ zur Größe); die Karte für Schätzfragen ist höher. Antippen einer kleinen Frage animiert sie per FLIP an die Kartenzone, die bisherige Hauptfrage schrumpft zurück in die Wolke, zwei Wolkenkarten ragen über den Rand. Kein Text-Stagger mehr; bei der Auflösung dreht sich die Karte.
- Leiste: „Neu starten" ist raus (es werden keine Angaben gemacht). Timeout erst nach 240 s ohne Berührung, Countdown 45 s, Texte ohne „Angaben löschen".
- Touch-Hinweise überall mittig zentriert.
- Wärmepumpe: Rail-Karten folgen dem Scroll kontinuierlich (kein Springen), Anleser unter „Was Sie wissen wollen" und „Häufige Fragen", FAQ-Bild = Anlage am modernen Haus, Vorhang-Fußzeile höher (1180 px) mit WP-Check-Foto (scharf), Text nicht mehr hinter der Leiste.
- Beraterseite ohne Ergebnis-Karte, ohne „Sitzung beenden": Foto bis zum oberen Rand (Logo im Bild), drei Erwartungen, QR groß, Code als Zeile, „Weiter stöbern" darunter.
- Alle Bereiche: Kicker, größere Foto-Kachel mit Kurztext, engere Kacheln, alles über der Leiste.
- Themenseiten mit passenden Motiven von release.stadtwerke-bonn.de (Photovoltaik: Solarfeld, E-Mobilität: Laden mit Kabel, Strom & Tarif: Bonn am Abend mit Energie-Symbolen, Fernwärme: Bundesviertel, Beraten: WP-Check, Kundenservice: SWB-Bahn in der Stadt). Credits in `app/src/assets/photos/CREDITS.md`.
- Typografie für den 40"-Monitor etwas kleiner: Body 28, Kicker 20, H2 50, Hero-Headlines 104–112, Sektions-Headlines 84, Kartentitel 46.

## Vierzehnter Stand (19.09.2026) — neuer Hintergrund des Lock-Screens
- Das Strömungsfeld ist ersetzt durch **Bonn als Lichtpunkt-Wolke** (`app/src/components/bonnScene.ts`, Vorschau `artwork-bonn.html`).
- Rund 12.000 Punkte in echtem 3D bilden Gelände, Rheinlauf, Stadt, Kennedybrücke und Windpark. Sie werden additiv gezeichnet, mit Tiefenabfall, Dunst und Vignette.
- Die Kamera zieht eine langsame Schleife um die Stadt, Höhe und Blickwinkel wiegen sich. Dadurch verschieben sich die Baukörper gegeneinander, ohne dass etwas sichtbar wiederholt wird.
- Wahrzeichen treten der Reihe nach hervor: ihre Punkte leuchten auf und ihre Kanten zeichnen sich für ein paar Sekunden als Drahtmodell ab. Bonner Münster, Bundeskunsthalle, Post Tower, Langer Eugen, Kurfürstliches Schloss, Kennedybrücke.
- Energie: ein Lime-Strang morpht zwischen Fluss, Skyline und Höhenzug; Impulse laufen als Wellenfront durch die Punktwolke und färben sie kurz in Lime.
- Die Stadtlichter spiegeln sich im Rhein, nach unten hin unruhiger und schwächer. Sterne und ein Horizontschimmer füllen den Himmel.
- Die Animation läuft nur im Ruhezustand und friert bei Berührung ein (wie zuvor über `ambient`).
- Verworfene Vorschläge (Rheinlinien, Energienetz, flächige Illustration im Behance-Stil) sind wieder entfernt.

### Nachjustierung (19.09.2026)
- Weltfokus sitzt jetzt im oberen Bildteil: Horizont bei 26 % der Höhe, Kamera näher an der Stadt. Die Skyline steht im freien Streifen zwischen Logo und Fragen-Wolke.
- Lock-Screen: die fünf kleinen Fragekarten sind eng um die große Karte gruppiert und liegen vollständig im Bild, kein Anschnitt mehr. Die große Karte rückt näher an die Gruppe (top 892 statt 1000).
- Die Karten treiben nicht mehr hin und her, sondern jede auf einer eigenen, sehr langsamen Kreisbahn, also immer in eine Richtung weiter.
- Der durchgehende Energiebogen ist ersetzt durch eine **Sternschnuppe**: eine gewundene Lime-Spur mit Schweif, die alle paar Sekunden durch die Welt zieht. Punkte in ihrer Nähe leuchten auf, wachsen kurz und weichen zur Seite, danach beruhigen sie sich wieder. Am Ende der Bahn löst sie eine Welle aus, die durch die Punktwolke läuft.

## Fünfzehnter Stand (19.09.2026)
- **Kamerareise statt Dauerschleife**: Die Kamera schwebt über der Stadt und fliegt dazwischen einzelne Anlässe an, die als eigene Punktwolken im Uferquartier stehen. Wärmepumpe am Haus (mit drehendem Lüfter und Luftstrom), Solardach mit Modulreihen, Ladepunkt mit Auto und Kabel. Im Anflug leuchtet das Objekt auf und zeigt sein Drahtmodell, der Bildausschnitt wandert dabei tiefer.
- Reiseplan: Stadt 18 s, Wärmepumpe 14 s, Stadt 14 s, Solardach 13 s, Stadt 14 s, Ladepunkt 13 s, dazwischen je 7 s Flug. Ein Zyklus dauert gut zwei Minuten.
- Fehler behoben: Die Blickrichtung der Kamera war falsch gerechnet, das Blickziel lag nie in der Bildmitte. Seitdem ist die Stadt sauber zentriert und Nahaufnahmen funktionieren.
- Lock-Screen: die kleinen Fragekarten stehen wieder weiter auseinander, bleiben aber vollständig im Bild. Ihre Drift ist deutlicher und läuft als Kreisbahn immer in eine Richtung.
- Hauptfrage kleiner (Schrift 42/48 statt 46/52, Antwortknöpfe 86 statt 100 px hoch) und mit 330 px Abstand zur Leiste.
- Kleine Fragekarten und Leiste sind jetzt durchsichtig mit Weichzeichner, die Punktwolke scheint hindurch.

## Sechzehnter Stand (19.09.2026) — Szene auf WebGL, echte Bonner Grundrisse
- **Stackwechsel für den Hintergrund**: p5 und Canvas2D sind raus, die Szene läuft jetzt in **three.js** (`app/src/components/BonnScene.tsx`). Grund: Canvas2D schaffte auf 1080 × 1920 nur 2 Bilder je Sekunde, jetzt sind es rund 100.
- **Runde Punkte statt Quadrate**: Jeder Punkt ist ein Sprite mit weichem Rand und Lichthof, gezeichnet im eigenen Shader mit additivem Blending. Größe, Glimmen, Tiefenabfall und die Reaktion auf den Energie-Impuls rechnet die Grafikkarte.
- **Echte Geometrie**: Gebäudegrundrisse aus OpenStreetMap (Bonner Innenstadt und Bundesviertel) plus die Mittellinie des Rheins, in `app/src/data/bonn-geo.json`. Die Abstände sind auf 30 Prozent gestaucht, damit Münster, Kreuzkirche, Stadthaus, Post Tower, Langer Eugen, Bundeskunsthalle und WCCB gemeinsam ins Bild passen. Höhen sind echt (Post Tower 162 m, Langer Eugen 115 m, Münster 82 m).
- Wahrzeichen sind dicht und hell gepunktet, der Rest der Stadt nur angedeutet. Kein 1:1-Abbild, sondern eine kuratierte Auswahl.
- **Energiefluss mit Logik**: Der Impuls startet an einer Quelle (Windpark, Solardach, Heizkraftwerk) und fließt zu dem, was die Kamera gerade zeigt. Sein Kontrollpunkt liegt nahe der Kamera, deshalb zieht er sichtbar durchs Bild. Am Ziel löst er eine Welle aus, die durch die Punktwolke läuft.
- **Nur-Animation-Modus** zum Feinschleifen: Taste **A**, `?art=1` oder der Schalter „Nur Animation" im Präsentationsmenü blenden die Oberfläche aus. Zurück über den runden Knopf unten rechts.
- Lock-Screen: Der Tipp-Hinweis steht jetzt oben bei der Fragen-Wolke, die kleinen Karten haben keinen „Antippen"-Link mehr, der Hinweis in der großen Karte ist weg. Die große Karte hat einen Verlauf, eine Lime-Kante oben und einen weichen Lichtschimmer.
- Die alten p5-Vorschaudateien (`bonn-scene.js`, `artwork-bonn.html`, `p5.min.js`) sind entfernt.

### Nachjustierung (19.09.2026, WebGL)
- Hintergrund in Markenfarben statt Schwarz: Himmelskuppel mit Verlauf von Petrol nach Dunkelblau und einem Schimmer über der Stadt, dazu Dunstschicht am Horizont, Spiegelung der Uferbebauung im Rhein und eine weiche Abdunklung an den Bildrändern.
- Kameraflug beruhigt: flachere Bögen zwischen den Stationen, stärkere Dämpfung, langsamerer Umlauf an den Anlässen.
- Erzählung neu geordnet: Altstadt, Bundesviertel, Wärmepumpe, Altstadt, Solardach, Bundesviertel, Ladepunkt.
- Lock-Screen: kleine Fragekarten tiefer gesetzt, damit oben Fläche zum Schauen bleibt, und mit deutlicherer Drift. Der Tipp-Hinweis steht jetzt zwischen Wolke und großer Karte. Die große Karte ist wieder schlicht nach Designsystem, nur der Kicker hat einen kurzen Lime-Strich.

## Siebzehnter Stand (19.09.2026) — zurück auf die p5-Szene
- Der WebGL-Umbau ist zurückgenommen. Der Hintergrund läuft wieder mit der p5-Punktwolke (`app/src/components/bonnScene2d.ts`, eingebunden über `P5Art.tsx`), weil sie in der Anmutung besser gefiel.
- Alle Verbesserungen an dieser Szene sind erhalten: nahtloser Loop (Panoramabahn an die Zyklusdauer gekoppelt), Flug als flacher Bogen mit weichen Enden, gedämpfte Blickführung, Bildzentrum wandert bei Nahaufnahmen nach unten, Quartier mit Nachbarhäusern, Bäumen, Laternen und Bodennebel, Anflüge auf Wärmepumpe, Solardach und Ladepunkt, Sternschnuppe mit Punktreaktion.
- Auch der Leistungsfix bleibt: volle Auflösung ohne Verdopplung, 30 Bilder je Sekunde, alle Punkte einer Helligkeitsstufe in einem Sammelpfad statt Tausender Einzelaufrufe.
- Die three.js-Fassung liegt zum Nachschlagen unter `experimente/BonnScene-threejs.tsx.txt`, die OpenStreetMap-Grundrisse unter `app/src/data/bonn-geo.json`. Beides wird nicht mehr gebaut.
- Die Änderungen an der Oberfläche aus der Zwischenzeit bleiben: Fragekarten tiefer mit deutlicher Drift, Tipp-Hinweis zwischen Wolke und großer Karte, große Karte schlicht nach Designsystem, Nur-Animation-Modus über Taste A.

## Achtzehnter Stand (19.09.2026) — dieselbe Szene in WebGL
- Die Welt liegt jetzt in `app/src/components/bonnWorld.ts` und ist unverändert aus der p5-Fassung übernommen: Gelände, Rhein, Stadt am Nordufer, Wahrzeichen, Windpark, Wärmepumpe, Solardach, Ladepunkt.
- Gezeichnet wird sie in `BonnScene.tsx` mit three.js. Jeder Punkt ist eine runde Kugel mit weichem Saum statt eines Quadrats, additiv gezeichnet, Größe und Glimmen im Shader.
- Neu in der Welt: **Solarpark** als Freiflächenanlage am Südufer und die **SWB-Zentrale** als Riegel mit leuchtender Krone.
- **Storyline**: Panorama, Münster, Bundeskunsthalle, Wärmepumpe, Post Tower, Langer Eugen, Solarpark, SWB-Zentrale, Ladepunkt, zurück ins Panorama. Die Blickpositionen der Wahrzeichen werden aus ihren Kanten berechnet, jeder Schritt wird weich angeflogen, der Zyklus schließt sich.
- **Energielinie der Stadtwerke**: Ihre Bahn wird im Kamerasystem gelegt, sie zieht daher immer quer durchs Blickfeld, mit Schweif und leuchtendem Kopf. Die Punkte reagieren wie zuvor.
- **Brennpunkt im oberen Viertel**: Die Kamera kippt so weit nach unten, dass das Blickziel auf etwa einem Viertel der Bildhöhe sitzt.
- Die p5-Fassung liegt gesichert unter `experimente/bonn-scene-p5-stand17.js.txt`.

### Nachjustierung (19.09.2026, WebGL)
- Keine Linien mehr in der Szene: das Drahtmodell der Wahrzeichen ist abgeschaltet, und die Dachkanten sind aufgestreut, damit dicht gesetzte Punkte nicht mehr wie gezogene Linien wirken.
- Deutlich mehr Punkte: Gelände von 5.600 auf 11.000, Wasser von 1.500 auf 3.200, Uferpromenade verdoppelt, alle Baukörper mit feinerem Raster.
- Weiter weg von den Schauplätzen: Die Blickposition wird jetzt aus der Ausdehnung der Punktwolke berechnet, jeder Ort steht mit Abstand im Bild.
- Wellenfront und Sternschnuppe sind entfernt. Stattdessen atmet der gerade gezeigte Schauplatz ruhig in Lime.
- Kameraführung gleichmäßig: nur noch ein Easing (Sinus statt doppelter Dämpfung), kein schneller Antritt mit langem Auslauf mehr.
- Solarpark mit erkennbaren Modulreihen, Ständern und Bodenschatten statt einer Rahmenfläche.

## Neunzehnter Stand (19.09.2026) — Zeppelinflug und ausgebaute Schauplätze
- **Kamera als Zeppelinfahrt**: Zwei geschlossene Catmull-Rom-Splines, einer für den Standort, einer für den Blick. Die Strecke wird nach Bogenlänge abgefahren, das Tempo ist dadurch konstant, die Höhe wechselt sanft, und der Loop schließt sich exakt. Kein Stationen-Hopping mit Beschleunigen und Abbremsen mehr.
- **Himmel in Markenfarben** statt Schwarz: Verlauf von Petrol am Horizont in ein dunkles Blaugrün, Schimmer über der Stadt, schwächere Abdunklung an den Rändern.
- **Ladestation komplett neu**: Stellplatz mit Asphalt und Markierung, Ladesäule mit Display und Kabel, Auto mit Fensterband und vier Rädern, dazu Bordstein, zwei Laternen und zwei Nachbarhäuser. Sie steht nicht mehr im Leeren.
- **Solarpark neu**: einzelne Modultische mit Ständern und Bodenschatten, Zaun rundherum, Trafostation. Die Anlage ist als solche erkennbar.
- **Energie im Boden**: vier Adern entlang der Wege, in denen ein Lichtpuls entlangläuft, aufgestreut, damit sie nicht als gezogene Linien wirken.
- Mehr Punkte überall, die Bildrate bleibt dank WebGL hoch.

## Zwanzigster Stand (19.09.2026) — ein Grundstück, Objekte setzen sich zusammen
- **Alle Produkte an einem Haus**: Wohnhaus mit Solardach, Wärmepumpe an der Giebelseite, Garage mit Wallbox und E-Auto in der Einfahrt, dazu Hecke, Bäume und Gartenlicht. Der Freiflächen-Solarpark ist entfernt, Photovoltaik gehört aufs Dach.
- **Zusammensetzen und Auflösen**: Jeder Punkt eines Objekts kennt neben seinem Platz auch eine Streulage. Nähert sich der Blick, fügt sich das Objekt zusammen, entfernt er sich, löst es sich wieder in eine treibende Wolke auf. Die vier Teile des Grundstücks (Haus, Solardach, Wärmepumpe, Wallbox) schalten einzeln, große Bauten bleiben länger zusammen.
- Die Energieadern im Boden führen jetzt von der SWB-Zentrale und aus dem Umland zum Grundstück.
- Die Flugroute sinkt über dem Quartier ab und zieht dicht an Solardach, Wärmepumpe und Wallbox vorbei.

## Einundzwanzigster Stand (19.09.2026) — die Szene als Modell
- **Kein Kartenausschnitt mehr**: Alle Abstände sind auf 46 Prozent zusammengerückt, die Höhen bleiben echt. Stadt, Rhein, Quartier und Grundstück stehen dadurch als eine Komposition beieinander.
- **Schwebende Insel**: Was außerhalb eines ovalen Ausschnitts lag, ist entfernt. Der Rand ist als dichte Punktkante gefasst, darunter laufen die Punkte nach unten aus. Die Szene liest sich als ein Objekt.
- **Kamera umkreist die Bühne** auf einer geschlossenen Route, sinkt einmal je Runde zum Grundstück ab und steigt wieder auf.
- **Auflösen sichtbarer**: Beim Auflösen verlieren die Punkte fast ihre ganze Helligkeit und driften weiter auseinander, beim Zusammensetzen leuchten sie wieder auf.
- **Himmel in Markenfarben**: Horizont in brand-700, oben die Bühnenfarbe, Schimmer in brand-500.

### Nachjustierung (19.09.2026, näher an der p5-Fassung)
- Deutlich weniger Bebauung: Altstadt- und Uferblöcke von 26 auf 15, Quartier von drei auf zwei Reihen mit weniger Häusern, weniger Bäume und Laternen.
- Punkte zurückhaltender: geringere Deckkraft und gedämpftere Farbwerte, damit die Szene nicht überstrahlt.
- Der Rhein ist wieder klar zu sehen: breiteres Wasserband, hellere Reflexe und zwei Uferkanten als Lichtwolken.
- Wahrzeichen stehen nicht mehr in einer Reihe: Münster, Bundeskunsthalle, Post Tower, Langer Eugen und Schloss sind in der Tiefe gestaffelt.
- Kamerafahrt filmischer: statt vieler Kurven nur noch wenige klare Bewegungen, eine weite Totale, eine lange gerade Annäherung, eine ruhige Seitfahrt am Quartier, eine Kranfahrt nach oben und ein langsamer Schwenk über die Skyline. Eine Runde dauert jetzt knapp drei Minuten.

## Zweiundzwanzigster Stand (19.09.2026) — die Bühne baut sich immer neu
- **Morph-Bühne**: Ein eigener Pool von 9.000 Punkten steht dort, wo das Quartier liegt, und baut nacheinander sieben Formen auf: Wohnhaus mit Solardach, Wärmepumpe mit Lüfterrad, E-Auto mit Wallbox, Windrad, Bonner Münster, Post Tower, Kennedybrücke.
- Zwischen zwei Formen blähen sich die Punkte zu einer Wolke auf, driften kurz und finden dann ihren neuen Platz. Jede Form steht elf Sekunden, der Übergang dauert gut drei.
- Die Formen liegen in `app/src/components/bonnForms.ts` und werden auf dieselbe Punktzahl gebracht, damit sie ineinander übergehen können.
- Die Kamera umkreist jetzt ruhig die Bühne, hebt sich einmal je Runde zur Stadt und sinkt wieder zurück.

## Dreiundzwanzigster Stand (19.09.2026) — Flug und Bühne gekoppelt
- Die Morph-Bühne ist nicht mehr ortsfest: Sie wandert mit dem Flug. An sechs Halten entlang der Route sammeln sich die Punkte, bauen dort eine Form auf und stehen, während die Kamera vorbeizieht. Danach lösen sie sich und ziehen zum nächsten Halt weiter.
- Der Blickpfad der Kamera führt genau über diese Halte, dadurch ist die entstehende Form immer im Bild.
- Je Segment sind rund zehn Sekunden Wanderung und Aufbau, danach knapp fünfzehn Sekunden Standzeit. Eine Runde dauert zweieinhalb Minuten und schließt sich nahtlos.
- Stadt, Rhein, Insel und Energieadern bleiben als ruhiger, dezenter Hintergrund stehen.

## Vierundzwanzigster Stand (19.09.2026) — ruhiger Hintergrund statt Flug
- Der Kameraflug ist entfernt. Die Kamera steht vor der Skyline und atmet nur noch: seitliches Driften um 46 Meter, Heben und Senken um neun, ein voller Atemzug dauert anderthalb Minuten. Die Szene bleibt damit das, was sie sein soll, ein Hintergrund hinter der Oberfläche.
- Die Morph-Bühne steht fest an einer gut sichtbaren Stelle vor der Skyline, leicht rechts der Mitte und über den Fragekarten. Dort bauen sich die Formen nacheinander auf: zehn Sekunden Standzeit, gut drei Sekunden Übergang.
- Stadt, Rhein, Insel und die Energieadern bleiben als dezente, weltbildende Punkte im Hintergrund.

### Nachjustierung (19.09.2026, mehr Dynamik)
- Die Kamera umkreist die Szene wieder langsam auf 300 Metern Abstand, die Höhe wiegt sich dabei um 26 Meter. Ein Umlauf dauert knapp zwei Minuten. Das ergibt echte Parallaxe zwischen den Türmen, bleibt aber ruhig.
- Der Energieimpuls ist zurück: Alle sechs bis zehn Sekunden zieht ein Lichtpuls mit Schweif quer durchs Blickfeld. Punkte in seiner Nähe leuchten kurz in Lime auf.
- Die Energieadern im Boden pulsieren jetzt sichtbar: In jeder Ader läuft ein Lichtband entlang, wie Strom in einer Leitung.

### Nachjustierung (19.09.2026, Energiepunkt und Tempo)
- Der Schweif ist keine gezeichnete Linie mehr. Stattdessen liegt ein unsichtbares Punktfeld über der Szene, das nur aufleuchtet, wenn der Energiepunkt vorbeikommt. Die Spur entsteht dadurch allein aus Punkten.
- Der Energiepunkt läuft dauerhaft auf einer harmonischen Bahn, gebildet aus mehreren überlagerten Schwingungen mit unterschiedlichen Frequenzen. Er wiederholt sich dadurch nie exakt und wirkt trotzdem ruhig.
- Seine letzten zehn Positionen werden als abklingende Kette mitgeführt, deshalb zieht die Aufhellung als weicher Schweif hinter ihm her.
- Die Kamera ist deutlich langsamer: ein Umlauf dauert jetzt knapp sechs Minuten statt zwei.

## Fünfundzwanzigster Stand (19.09.2026) — Sichtfeld, Loop und Herzschlag
- **Alles auf einer Periode**: Kamera, Blick und Morph-Bühne laufen auf denselben 210 Sekunden. Sieben Formen je Runde, jede belegt genau einen Abschnitt. Der Loop schließt sich dadurch exakt.
- **Objekte reagieren auf die Kamera**: Für jedes Wahrzeichen wird der Winkel zur Blickachse geprüft. Kommt es ins Sichtfeld, setzt es sich zusammen, verlässt es das Bild, löst es sich wieder auf. Der Aufbau passiert dadurch immer wieder neu.
- **Herzschlag statt Dauerleuchten**: Reihum schwillt ein Wahrzeichen an, mit doppeltem Schlag wie ein Puls und einem weichen Nachglühen. Dadurch ist immer ein anderes im Fokus, nie alle gleich hell.
- **Energiepunkt statt Linie**: Über der Szene liegt ein unsichtbares Punktfeld, das nur aufleuchtet, wenn der Energiepunkt vorbeizieht. Seine letzten zehn Positionen klingen als Schweif nach.
- Kamera deutlich langsamer, ein Umlauf dauert dreieinhalb Minuten.

## Sechsundzwanzigster Stand (19.09.2026) — reduziert und geordnet
- **Drei Ebenen statt zehn.** Hinten der Himmel mit wenigen Sternen, in der Mitte die Skyline mit Rhein und Spiegelung, vorn eine einzige Bühne. Alles andere ist raus oder stark gedämpft.
- **Entfernt**: das feste Grundstück mit Haus, Solardach, Wärmepumpe und Wallbox (die Bühne zeigt diese Produkte ohnehin), das Quartier mit Häuserreihen, Bäumen, Laternen und Bodennebel, zwei der vier Energieadern, die Unterseite der Insel bis auf eine Andeutung.
- **Reduziert**: Gelände von 11.000 auf 2.800 Punkte, Wasser von 5.200 auf 2.600, Uferkanten von 1.300 auf 420, Kontextbauten von 15 auf 10, Luftpunktfeld von 14.000 auf 5.000, Sterne von 700 auf 260, Bühne von 9.000 auf 7.000 Punkte.
- **Dunkler**: Grunddeckkraft aller Punkte um ein Viertel gesenkt, Herzschlag und Adern schwächer, Himmel oben ruhiger. Hell sind jetzt nur noch das gerade pulsierende Wahrzeichen und die Bühne.
- **Ruhiger**: Der Blickschwenk ist kleiner, die Komposition bleibt stabil. Die Bühne steht im oberen Bilddrittel, ihre Wolke beim Umbau bleibt kompakter.

### Nachjustierung (19.09.2026, dunkle Struktur)
- Struktur ist zurück, aber ganz dunkel: Gelände von 2.800 auf 6.000 Punkte bei halber Helligkeit, Uferpromenade und Uferkanten dichter, Wasser dichter, Kontextbauten von 10 auf 15 bei gut halber Helligkeit, das Quartier am Südufer als dunkle Silhouette aus neun Häusern, eine dritte Energieader aus dem Umland.
- Alle Punkte insgesamt gedimmt: Grunddeckkraft nochmals um ein Fünftel gesenkt, Farben etwas gedeckter, die Bühne ebenfalls dunkler. Das pulsierende Wahrzeichen und die Bühne bleiben die hellsten Elemente.

## Siebenundzwanzigster Stand (19.09.2026) — Abgleich mit der p5-Fassung
- Die Szene ist an der gesicherten p5-Fassung (`experimente/bonn-scene-p5-stand17.js.txt`) ausgerichtet. Die vier größten Unterschiede sind zurückgebaut:
  1. **Projektion**: Brennweite 780 Pixel auf 1080 Breite und Blickpunkt auf 26 Prozent der Bildhöhe, wie in p5. In three.js über ein verschobenes Bildfenster umgesetzt. Das ergibt den weiten, nahen Bildwinkel von damals, der zuvor mit 52 Grad viel zu eng war.
  2. **Kamerabahn**: Umkreisung des Stadtzentrums auf 300 Metern, Höhe wiegt sich um 26 Meter, Blick pendelt leicht, wie die Stadtstation in p5.
  3. **Welt**: keine Stauchung und keine Insel mehr. Gelände, Uferbaumreihe, Rhein, Stadt und Wahrzeichen stehen wieder an ihren p5-Plätzen, das Quartier am Südufer ist das aus p5.
  4. **Helligkeitsmodell**: dieselben Stufen wie in p5 (Grundwert plus Potenz der Helligkeit), dunkle Punkte tief petrol, helle fast weiß, Tiefenabfall mit denselben Werten. Punktgröße wie in p5: ein Meter entspricht bei 780 Metern Abstand einem Pixel.
- Geblieben aus den jüngeren Ständen: runde Punkte, die Morph-Bühne am Südufer, Energiepunkt mit Punktspur statt Linie, Herzschlag reihum, Energieadern im Boden.
- Bekannt: Der Horizontschimmer über der Stadt fällt beim weiten Bildwinkel als breites Band auf. In p5 war er ein runder Fleck im Bild, das wäre der nächste Abgleich.

### Nachjustierung (19.09.2026, Ton)
- Heller, aber in den Markenfarben: Himmel oben in der Bühnenfarbe, am Horizont brand-700, unten brand-800. Grunddeckkraft aller Punkte angehoben.
- Gebäude stechen nicht mehr heraus: Die hellen Punkte gehen nur noch bis zu einem hellen Petrol statt Weiß, die Helligkeitskurve ist flacher, der Herzschlag schwächer.
- Der Schimmer über der Stadt ist wieder ein runder, weicher Fleck wie in p5, kein Band mehr über die ganze Breite.

### Nachjustierung (21.09.2026, Rechenlast)
- Die Szene rendert mit höchstens 30 Bildern pro Sekunde statt mit der vollen Bildwiederholrate des Monitors (100 bis 120 Hz auf dem Mac). Der Hintergrund bewegt sich so langsam, dass davon nichts zu sehen ist; Tempo und Loop bleiben gleich, weil die Zeit weiterhin aus der Uhr kommt.
- Messung auf dem Mac (Tab mit Lock-Screen): GPU-Prozess von rund 25 % auf rund 15 % (Leerlauf liegt bei 8 %), Renderer-Anteil der Szene von 8 % auf 3 %. Bildinhalt, Farben und Bewegung unverändert, Sicherung des Standes davor in `experimente/*-stand28-vor-perf.*.txt`.
- Geprüft und verworfen: Die Blur-Filter der Karten und Leiste (`backdrop-filter`) kosten messbar nichts, der Haupt-Thread ist zu etwa 5 % ausgelastet. Was übrig bleibt, ist die Bildkomposition der treibenden Karten und des Touch-Hinweises bei Monitorrate; auf der Stele mit 60 Hz halbiert sich das von selbst.

## Achtundzwanzigster Stand (21.09.2026) — Kartenwechsel auf dem Startscreen
- Der Wechsel der Hauptfrage läuft in drei Schritten: Zuerst verschwindet der Text der Hauptkarte und der angetippten kleinen Karte (0,18 s), dann wandern und wachsen nur die Flächen per FLIP (0,75 s), und erst wenn die Fläche fast angekommen ist, erscheint der neue Text (ab 0,34 s, gestaffelt). Die geschrumpfte Karte bekommt ihren Text ebenfalls erst am Ende. So steht nie großer Text in einer kleinen Fläche und umgekehrt.
- Die kleinen Fragekarten sind statisch: zwei Spalten à 440 px, unten bündig auf 800 px, die rechte Spalte 48 px höher. Kein Treiben, keine Drehung. Die Wolke liegt über der Hauptkarte (z-index), die wachsende Karte schiebt sich also nie über die kleinen.
- Hauptkarte folgt dem Inhalt: fester Oberrand bei 918 px, Mindesthöhe 400 px, Antworten und Pills unten mit 44 px Abstand, kein leerer Raum mehr. Der Bogen-Slider ist auf 420 px verkleinert und die Frage dazu auf 42 px, damit die Slider-Karte über der Leiste endet.
- Sicherung des Standes davor: `experimente/S01Lock-stand28-vor-transition.tsx.txt`.

## Neunundzwanzigster Stand (21.09.2026) — Fragenreihe, Themenmix, Leiste
- **Fragenpool über alle Themen**: 13 Fragen mit Feld `topic`. Wärmepumpe wie bisher (Kontextdatei Abschnitt 7), dazu Photovoltaik, E-Mobilität, Strom & Tarif und Fernwärme aus `10_Research/20260915_SWB-Stele_Research_SWB-Produktfakten.md` (alle W, vor Freigabe bestätigen). Die Schätzfrage mit dem Bogen-Regler steht beim Start in der Hauptkarte. Der Ausgang aus der Auflösung heißt je nach Thema „Mehr zur Photovoltaik" usw. und führt auf die passende Themenseite.
- **Fragenreihe statt Wolke**: eine Reihe kleiner Karten (440 px, mit Themen-Kicker), unten bündig auf 800 px, ragt rechts aus dem Bild. Zwei runde Schiebeknöpfe rechts darüber schieben die Reihe kartenweise. Kein Blur mehr auf den kleinen Karten, nur noch eine 70-Prozent-Fläche.
- **Tipp-Hinweis** ohne Text: Hand als Umriss (Icon `x_tap` neu gezeichnet), größere Ringe, langsamer (3,4 s), liegt über der ersten Karte und verschwindet mit der ersten Berührung.
- **Hauptkarte** wieder mit fester Höhe (918 bis 330 über dem Boden), Antworten unten bündig.
- **Leiste**: schmale Zeile mit Zurück links (nicht auf dem Startscreen), „Alle Bereiche" nur als Icon und „Berater" rechts, beide so breit wie ihr Inhalt.
- **Szene**: Blickpunkt von 26 auf 17 Prozent der Bildhöhe, die Welt sitzt höher, oben ist weniger leerer Himmel.

### Nachjustierung (21.09.2026, Alle Bereiche)
- Zugpferd-Foto: Das Bild saß durch die `.photo img`-Regel (120 % Höhe, minus 10 % Rand) zu hoch und ließ unten einen Streifen frei. Jetzt füllt es die 340 px hohe Karte ganz.
- Keine Einblend-Animation mehr auf dem Screen: Die Kacheln standen nach dem Reveal nicht ruhig (der `.tile`-Transform-Übergang lief gegen die GSAP-Bewegung).
- Kacheln ohne „Öffnen"-Link: Icon oben, Titel und Zeile unten, dazwischen Luft.


### Nachjustierung (21.09.2026, Toast)
- Der Hinweis „Zurück am Start." nach dem Reset ist raus. Er hing 1,2 Sekunden an der Bühne statt am Screen und war deshalb auch auf „Alle Bereiche" zu sehen, wenn man schnell weitertippte. Das Timeout-Overlay bleibt unverändert.

### Nachjustierung (21.09.2026, Startscreen-Feinschliff)
- **Kartenwechsel repariert**: Sobald die Reihe geschoben war, fiel die Kartenleiste während des FLIP zusammen (die Karten sind dabei kurz absolut positioniert), die schrumpfende Karte landete 184 px zu tief und sprang am Ende hoch. Die Leiste hat jetzt eine feste Höhe. Außerdem tauschen Hauptfrage und angetippte Karte den Platz: Die bisherige Hauptfrage landet genau dort, wo die neue hergekommen ist, statt an ihre alte Listenposition (oft außerhalb des Bildes) zu fliegen.
- **Einheit aus Reihe und Karte**: Hauptkarte oben bei 850 statt 918, die Reihe sitzt 36 px darüber. Rechter Bildrand mit weicher Unschärfe ab 90 % der Breite (Streifen mit `backdrop-filter` und Verlaufsmaske, nur in Höhe der Reihe). Die Randabdunklung der Szene ist schwächer (.16 statt .38).
- **Bogen-Regler**: Skala beginnt bei 0, der Knopf steht vorausgewählt auf 0 und pulsiert leicht mit einem auslaufenden Ring, bis gewählt wurde; „Aufdecken" bleibt bis dahin inaktiv.

### Nachjustierung (21.09.2026, Reihe und Regler bedienbar)
- **Fragenreihe**: zwei kleine Karten sind zusammen so breit wie die große (465 px bei 22 px Lücke), derselbe Abstand liegt zwischen Reihe und Hauptkarte. Die Reihe lässt sich mit Finger oder Maus ziehen und rastet auf die nächste Karte ein (kleine Bewegungen bleiben ein Tipp). Schiebeknöpfe quadratisch mit dem Chevron aus dem Designsystem (`icon-chevron-right.svg`). Der Unschärfe-Streifen rechts geht über den Rand hinaus, damit nichts mehr aufblitzt.
- **Bogen-Regler**: Der Knopf lässt sich ziehen (Pointer Capture; die Marken fangen keine Events mehr ab, sonst wäre der Knopf, der immer auf einer Marke sitzt, nicht greifbar). Fehler behoben: Werte jenseits der 360-Grad-Marke (obere Hälfte rechts) waren weder tipp- noch ziehbar, weil der Winkel nicht umgerechnet wurde.
- **Leiste**: Hamburger (64 px) und Berater zusammen so breit wie eine Themenkachel darüber.

### Nachjustierung (21.09.2026, Tipp-Hinweis)
- Der Tipp-Hinweis auf dem Startscreen erscheint nur beim ersten Mal nach dem Laden und nach jedem Zurücksetzen (Timeout, Neu starten), nicht bei jeder Rückkehr über „Zurück". Dafür zählt der Store in `resets` nur echte Neustarts; `tick` zählt jeden Screenwechsel und taugt dafür nicht.
- Die Ringe des Hinweises starten im Moment, in dem die Hand am kleinsten ist.
- Reihe, Schiebeknöpfe und Hauptkarte erscheinen beim Aufbau des Screens als eine Gruppe (gemeinsames Einblenden, kein Nacheinander mehr).
- Leiste: Hamburger (64 px) plus 10 px Lücke plus Berater ergeben zusammen genau die Breite der Themenkachel darüber.

## Dreißigster Stand (21.09.2026) — Eröffnung der Wärmepumpen-Seite nach noho.ink
- Vorbild noho.ink: Dort liegt beim Laden ein dunkler Vorhang (`.preloader`) über der Seite und zieht nach unten weg, dahinter laufen die Bilder in Masken hoch und bewegen sich beim Scrollen mit Parallax.
- Umsetzung auf S02 (`.opener` in `S02Waermepumpe.tsx`): drei Flächen im Blau-Spektrum der CI liegen übereinander (unten brand-900, darüber brand-700, oben brand-500). Sie ziehen nacheinander nach oben weg (hell ab 0,2 s, mittel ab 0,38 s, dunkel ab 0,56 s, je 1 s mit der Haus-Kurve), die Seite kommt also von unten und die Farben schieben sich kurz übereinander. Parallel zoomt das Hero-Bild von 1,14 auf 1 (1,9 s), die Headline läuft mit 1,15 s Verzögerung zeilenweise hoch. Der Parallax der Bilder beim Scrollen war schon da. Der Vorhang wird danach ausgeblendet; bei reduzierter Bewegung entfällt er.
- Kartendrehung auf S01 flüssiger: eigene Ebene (`will-change`), Rückseite unsichtbar, 3D erzwungen, Wartezeit nach der Antwort 220 statt 380 ms, weichere Kurve beim Zurückdrehen.
- Sicherung: `experimente/S02Waermepumpe-stand29-vor-opener.tsx.txt`.

### Nachjustierung (21.09.2026, Vorhang als Übergang)
- Der Vorhang ist jetzt ein Übergang statt einer Eröffnung: Von jedem Ausgangspunkt (Leiste, Startscreen-Auflösung, „Alle Bereiche", Themen-Platzhalter, Heizen-Overlay, Präsentationsmenü) steigen die drei Flächen im Blau-Spektrum von unten über den aktuellen Inhalt (beschleunigend, `power3.in`, dunkel zuerst), dahinter wechselt der Screen, dann ziehen sie nach oben weg (abbremsend, `power3.out`, hell zuerst) und enthüllen die Wärmepumpen-Seite. Rund 2,3 s insgesamt. Logik in `motion/curtain.ts` (`curtainTo(swap)`), der Vorhang liegt in `App.tsx` über allem. „Zurück" nutzt ihn nicht.
- Scrollen auf S02 mit mehr Nachlauf: Lenis `lerp` 0,05 statt 0,075, Touch-Multiplikator 1,9, Rad 1,35.
- Startscreen: kleine Karten und Pfeil-Buttons ohne Schatten, die große Karte mit weichem Schatten (0 24px 70px, dazu ein kurzer Kontaktschatten). Logo global bei 64 px von oben und links.
- Kartendrehung auf S01 als eine durchgehende Bewegung (0 bis 180 Grad, `power2.inOut`, 0,9 s): Der Inhalt wird genau auf der Kante getauscht, wo die Karte am schnellsten ist. Perspektive flacher (3200 statt 1800), damit die Karte beim Drehen kaum kleiner wirkt; die Karte liegt dauerhaft auf einer eigenen Compositor-Ebene, damit die Drehung nicht mit einem Raster-Hänger beginnt.
- Antwortseite der Hauptkarte: oben rechts das Themen-Icon ohne den umlaufenden Ring in brand-300 (die Farbe des aufgedeckten Regler-Rings). Für die Wärmepumpe ein eigenes Außengerät-Icon (`x_heatpump`: Gehäuse, Lüfter, Lamellen, Füße) im Umriss-Stil, da das DS-Icon eine Flamme zeigt.
- Kartendrehung: eine durchgehende Drehung (1,26 s) mit eigener S-Kurve (`CustomEase` „flip"): weicher Start, auf der Kante auf etwa ein Drittel des Tempos, ohne stehen zu bleiben, weiches Ende. Zwei getrennte Halbdrehungen hatten auf der Kante einen Stillstand, das wirkte nicht flüssig. Außengerät-Icon mit feinerer Kontur (1,4 statt 2,2).
- Antwortseite neu gesetzt: Fakt 68 px, Bedeutung 30 px auf 640 px Breite, Pills unten. Das Themen-Icon liegt als Wasserzeichen unten rechts (440 px, brand-900 bei 55 % Deckkraft, nach links eingerückt und unten angeschnitten; Karte mit `overflow: hidden`). Nur CI-Blautöne.
- Druckzustand für alle Tasten: beim Berühren sofort heller (brightness 1,28) und auf 95 % gedrückt, Antwortflächen füllen sich mit der Auswahlfarbe, Leiste und Pfeil-Buttons hellen die Fläche auf; beim Loslassen weich zurück. Die Fragekarten der Reihe bekommen nur Fläche und Helligkeit, kein Transform, weil sie FLIP-Ziele sind.
- Drehkurve der Hauptkarte mit deutlichem Ease-in am Start und Ease-out am Ende.
- Logo auf Berater-, Themen- und Wärmepumpen-Seite: Die Regel `.photo img` (120 % Höhe, minus 10 % Rand) traf auch das Logo in der Kopfzeile im Bild und schob es aus dem Rahmen. Jetzt gilt sie nur für das Bild selbst (`.photo > img`), das Logo sitzt überall bei 64/64.
- Kartensystem: Die Hauptaktion sitzt unten rechts. „Aufdecken" steht auf der Regler-Karte unten rechts, mit dem Kreispfeil-Icon; der Regler bleibt links.
- Wärmepumpen-Seite: Ziehen mit gedrückter Maus scrollt die Seite (Touch macht Lenis selbst). Ein Pixel Mausweg bewegt die Seite um 0,6 Pixel, beim Loslassen läuft nur ein kurzer Schwung nach (0,9 s); nach einer echten Bewegung wird der folgende Klick geschluckt, damit nichts versehentlich öffnet.
- Scrollen auf S02 mit mehr Nachlauf: Lenis `lerp` 0,035 (Rad) und 0,04 (Touch), das Maus-Ziehen folgt dem Zeiger ebenfalls weich (lerp 0,08) statt sofort.
- Pfeil-Buttons der Kartenreihe auf S02 sind jetzt dieselben wie auf dem Startscreen (`.slbtn`, quadratisch, Chevron aus dem Designsystem, gemeinsame Komponente `Chevron.tsx`). Außerdem: Ein leicht wackelnder Mausklick zählt als Klick, erst ab 14 Bildschirmpixeln Bewegung beginnt das Ziehen; vorher wurden Klicks auf die Buttons beim kleinsten Zittern als Ziehen geschluckt.
- Pfeil-Buttons (`.slbtn`) auf Start- und Wärmepumpen-Seite identisch: volle Petrol-Fläche (`--surface`) statt halbtransparent, kein Schatten.
- Mausrad auf S02: Faktor 1,75 (vorher 1,35), ein Rad-Tick bringt mehr Strecke; Nachlauf unverändert.
- Beraterseite S03: neues Hero-Foto von Max (zwei Beraterinnen mit Tablet auf dem Solardach, `assets/photos/beratung-pv-dach.jpg`, auf 1600 px verkleinert). Das Bild zeigt seine volle Höhe (kein 120-%-Versatz), damit die Gesichter unter dem Logo bleiben; horizontal auf 40 % gesetzt.

### Nachjustierung (21.09.2026, Beraterseite)
- Hero ohne Hintergrundfoto: Petrol-Verlauf (brand-900 → 800 → 700), links die Einladung, rechts das Hochkant-Foto vom Beratungstisch (`assets/photos/beratung-tisch.jpg`, 600 px hoch, unten bündig mit dem Text).
- Die drei Erwartungen stehen je Spalte mittig (Icon über Text). QR-Code ohne weiße Box: das SVG wird inline gerendert (`?raw`), die Module in brand-300 direkt auf der Karte. „Weiter stöbern" sitzt mittig im Raum zwischen Code-Zeile und Leiste.
- Leiste: aktiver Zustand mit Outline in Hellblau (brand-300) statt Lime, auch für den Berater-Button (innere 4-px-Kontur, Fläche bleibt Lime).
- Sicherung: `experimente/S03Uebergabe-stand30.tsx.txt`.
- Beraterseite ohne Sektionstrennung: die ganze Seite liegt auf einem Petrol-Verlauf. Kein Untertext mehr unter „Sprechen Sie uns an." (92 px, zweizeilig neben dem Foto), die drei Erwartungen stehen direkt darunter ohne Karte, Icons in Hellblau.
- Leiste: aktiver Berater-Button mit Outline in hellem Grün (accent-200) statt Hellblau; die drei Hamburger-Linien in der Textfarbe der Kacheln (`--fg`).
- Bogen-Regler: Der Knopf wirft einen weichen Schatten nach unten (SVG `drop-shadow`), dadurch liest sich die Lime-Linie als darunter durchlaufend.
- Beraterseite: Max' Komposition (Beethoven-Silhouette als Stromkabel über dem Hochkant-Foto, `assets/photos/beratung-tisch-beethoven.webp` mit Alpha) sitzt als eine Datei im Hero. Sie ist so skaliert und gesetzt, dass das Foto darin 600 px hoch bleibt und bis an den rechten Bildrand läuft (editorial), Unterkante auf 768 px; die Silhouette ragt links oben darüber hinaus.
- Regler-Knopf: Schatten petrolgetönt und transparenter (rgba(0,45,52,.28)) statt schwarz.
- Beraterseite: Einladung höher, die drei Erwartungen als Liste darunter in der linken Spalte (mittig gesetzt), Uhr-Icon neu (`x_clock`, das DS-Kalender-Icon ragte über seine viewBox und wirkte abgeschnitten). Verlauf umgedreht (oben brand-700, unten brand-900), damit die Leiste unten auf demselben dunklen Grund liegt wie auf dem Startscreen; Leiste selbst ist auf allen Seiten identisch (nachgemessen). QR-Karte 42 px tiefer. Regler-Knopf-Schatten wieder etwas kräftiger (.38).
- Beraterseite: Kicker, Headline und die drei Erwartungen bilden eine linksbündige Gruppe, deren Unterkante auf der Unterkante des Fotos liegt (768 px). Icons sitzen exakt auf der Textmitte (die `.icochip`-Regel erzwang 64 px, jetzt 40 px als Block).

### Nachjustierung (21.09.2026, Vorhang überall)
- Jeder Screenwechsel per „go" (Leiste, Kacheln, Pills, Overlays, Präsentationsmenü) läuft jetzt zentral im Store durch den Vorhang (`StoreProvider` wickelt `dispatch`), die einzelnen Aufrufstellen sind wieder schlichtes `dispatch`. „Zurück" und Overlays bleiben ohne Vorhang.
- Beraterseite: Zudecken in Blau wie überall, Enthüllen in Grüntönen. Dafür liegt ein zweiter Satz Flächen (accent-800 / 600 / 300) im Vorhang, der sich im Moment der vollen Abdeckung in 0,3 s über die blauen blendet und dann nach oben wegzieht. Ablauf per Skript geprüft: blau 0 bis 1,0 s, Wechsel bei 1,0 s, grün blendet bis 1,26 s ein, enthüllt bis 2,4 s.
- Lautstärke-Frage: vier große Antwortkacheln im 2×2-Raster, je mit Umriss-Icon (Flüstern, Kühlschrank, Staubsauger, Rasenmäher, `x_whisper`/`x_fridge`/`x_vacuum`/`x_mower`) und Dezibel als Untertext (etwa 30 / 40 / 70 / 90 dB, Werte aus dem Lockfragen-Research). Datenmodell: `tiles` mit `big` und `meta`.
- Fragenreihenfolge fest: Die Reihe folgt immer `LOCK_QUESTIONS`, die bisherige Hauptfrage kehrt an ihren Platz zurück (der Platztausch ist raus).

### Nachjustierung (21.09.2026, Übergänge und Reihenfolge)
- Übersicht „Alle Bereiche" bekommt eine schnelle Kreis-Überblendung: Eine Petrol-Fläche wächst als Kreis vom Berührungspunkt (Hamburger) über den Screen (0,42 s, beschleunigend), dahinter wechselt der Screen, dann löst sich die Fläche in 0,32 s auf. Rund 0,75 s statt 2,3 s. Der Vorhang bleibt für Themenbereiche (blau) und Berater (grün). „Zurück" wechselt sofort ohne Animation.
- Weitere denkbare Überblendungen für später: Crossfade mit leichtem Zoom (0,3 s), horizontales Schieben, diagonaler Wischer, Kreis-Enthüllung in umgekehrter Richtung (die neue Seite wächst aus dem Tipp-Punkt).
- Fragenreihenfolge: Regler-Frage in der Hauptkarte, dann Lautstärke, dann Strombedarf, danach der Rest in zufälliger Reihenfolge (einmal je Laden gemischt). „Nächste Frage" auf der Rückseite mit Pfeil statt Kreispfeil.
- Maus-Ziehen auf S02: Verhältnis 0,66 (plus 10 %), Schwung beim Loslassen kräftiger (Faktor 0,2, 1,0 s).

### Nachjustierung (21.09.2026, Lag-Ursache und Logo)
- **Lag seit den letzten Änderungen**: Der pulsierende Regler-Knopf lief als SVG-Animation (Transform auf einer SVG-Gruppe plus Ring). SVG-Transforms werden nicht im Compositor animiert, sondern zeichnen die ganze Hauptkarte, die seit der Drehungs-Optimierung eine eigene Ebene mit großem Schatten ist, bei jedem Frame neu, und das dauerhaft, seit die Regler-Frage als erste in der Hauptkarte steht. Der Knopf pulsiert jetzt nicht mehr selbst; die Ringe sind ein HTML-Element (`.arc-pulse`, nur `transform` und `opacity`), das der Compositor ohne Neuzeichnen bewegt. Haupt-Thread lag schon vorher bei ~2 %, der Rest war Rasterlast.
- Unschärfe-Streifen am Reihenrand schwächer (3 statt 5 px).
- Das SWB-Logo führt auf jeder Seite zurück zum Fragen-Screen (schnelle Kreis-Überblendung), auch auf den Seiten mit Kopfzeile im Bild; fünf schnelle Tipps öffnen weiterhin das Präsentationsmenü.

## Einunddreißigster Stand (21.09.2026) — Wärmepumpen-Seite mit neuen Bildern
- **Zuschnitt**: Nein, der Ausschnitt ist nicht immer 9:16. Jedes Bild hat seine eigene Box und wird darin mit `object-fit: cover` beschnitten; `object-position` steuert, was im Bild bleibt.
- **Hero**: Junge mit Ball neben der Wärmepumpe (`wp-faq-junge.jpg`), Hero 1560 px hoch wie zuvor, Bild füllt ihn und läuft unten in die Seitenfarbe aus (`.hero-fade`), Headline liegt im ausgeblendeten Bereich.
- **„Was Sie wissen wollen"**: oben ein 21:9-Band mit dem Handschlag (`wp-handshake.jpg`, oben ausgerichtet, damit die Gesichter bleiben), Überschrift und Kartenreihe darunter, kein Wisch-Hinweis mehr, kein Bild unter dem Slider.
- **Springende Karten**: Die Positionen folgten dem Scroll mit einem Ease je Stufe (smoothstep), dadurch bremsten und sprangen sie an jeder Kartengrenze. Jetzt linear; die Weichheit kommt allein aus Lenis.
- **Stark in Kombination**: Text links, Holz-Wärmepumpe am Fachwerkhaus rechts bis an den Rand (`wp-altbau.jpg`, 520 × 720).
- **Häufige Fragen**: Wärmepumpe mit bepflanztem Dach (`wp-gruendach.jpg`) als 16:9-Bild in voller Breite über der Zeile „Aus dem Beratungsalltag", Akkordeon darunter in voller Breite.
- **Neue erste Karte „Wie funktioniert eine Wärmepumpe?"** (kind `funktion`), im Overlay das Schema (`wp-schema.jpg`, unbeschnitten auf Weiß) mit drei Sätzen (F).
- **Schnellübergang** (Übersicht, Logo) ohne Rundung: eine Fläche schiebt in 0,32 s von unten hoch, Wechsel, dann in 0,4 s nach oben hinaus. Die Kreis-Variante ist raus (CI erlaubt keine Rundungen).
- **Fußzeile „Sprechen Sie uns an"**: Das SWB-Konzernbild ist im Chat nicht angekommen; sobald es da ist, kommt es rechts mit dem grünen Verlauf hinein.
- Sicherung: `experimente/S02Waermepumpe-stand31-vor-bildern.tsx.txt`.

### Nachjustierung (21.09.2026, Hero, Handschlag-Band, Reveal)
- **Hero**: Bild oben angedockt, kein Parallax mehr auf dem Hero-Bild (das erzeugte den grauen Balken oben und das Aufblitzen unten). Text wieder unten, Hero 1330 px (rund 15 % niedriger), unten blendet das Bild ohne Grauschleier in ein etwas blaueres Petrol (`#00343b`), das auch der Seitenhintergrund ist.
- **Handschlag-Band** gehört zur Sektion „Was Sie wissen wollen": 21:9 oben im festen Block, das Bild ist 130 % hoch und läuft beim Scrollen mit Parallax durch die Maske (yPercent −23 → 0 über die ganze Sektion, auch während der Kartenreihe) und blendet beim Ankommen auf. Fortschritt aus der Lage des Abschnitts im Scroller, an jedes Lenis-Scroll-Ereignis gebunden; ein ScrollTrigger mit start/end lieferte hier falsche Maße. Das separate Zwischenspiel ist wieder raus (es ließ das Bild schon unter dem Hero aufblitzen).
- **Reveal** beim ersten Sichtbarwerden: Wörter und Elemente kommen seitlich (46 bzw. 70 px) und aus der Transparenz, 1,1 s mit der Haus-Kurve, gestaffelt. Parallax der Bilder ±14 %. Sektionen mit 150 px Luft (200 war zu viel).
- **Fußzeile „Sprechen Sie uns an"**: SWB-Eingang (`swb-eingang.jpg`) rechts mit dem grünen Verlauf.
- Easteregg: Beim Übergang zur Wärmepumpe (blauer Vorhang) läuft die SWB-Bildmarke (die beiden Kreise, dritter Pfad aus `logo-swb.svg`, extrahiert nach `assets/logoMark.ts`) als Wasserzeichen mit den Flächen durchs Bild: sie kommt mit der ersten Fläche von unten, steht mittig, solange der Screen wechselt, und zieht mit der letzten Fläche nach oben hinaus (400 px, Weiß bei 10 %, eigenes Element im Vorhang, nicht mehr an eine Fläche gebunden).
- Wasserzeichen-Timing: Einlauf mit der ersten Fläche (0,7 s, beschleunigend), Auslauf mit der ersten weggehenden Fläche ab 1,3 s (0,95 s, abbremsend), gleiche Kurven wie die Flächen; dadurch hängt die Marke nicht mehr am oberen Rand, während die restlichen Flächen noch wegziehen.
- Unter dem Hero eine ruhige Fläche (192 px, rund 10 % der Höhe) in der Farbe der untersten Bildreihe, also dem Verlaufsende `#00343b`; dann erst die Sektion mit dem Handschlag-Bild. Das Bild liegt hinter einem Passepartout (`.pp`, Rahmen in Seitenfarbe): Beim Ankommen öffnet sich der Ausschnitt von 160/60 px auf 64/0 px Rand (voll offen, sobald der Abschnitt oben anliegt), dahinter läuft das Bild mit Parallax und blendet auf; danach der Slider.
- **Fußzeile antippbar**: Sie lag bisher als absolute Ebene hinter dem Scroller, der alle Berührungen abfing; „Zusammenfassung mitnehmen" und „Jetzt mit Berater sprechen" waren nie erreichbar. Jetzt steht die Fußzeile am Ende des Scrollinhalts mit `position: sticky; bottom: 0` hinter der Seite (z-index 1 unter der Seite mit z-index 2): Die Seite schiebt sich darüber und gibt sie am Ende frei, der Vorhang-Effekt bleibt, Klicks kommen an. Die Pixellinie links am Bild war eine Subpixel-Kante des 46-%-Kastens: jetzt 500 px fest, der grüne Verlauf beginnt 3 px außerhalb und ist bis 3 % voll deckend.
- Passepartout um das Handschlag-Bild ohne Öffnungs-Animation (fester Rahmen 64 px), Fläche dahinter in Seitenfarbe statt der hellen `.photo`-Grundfarbe (die war beim Aufblenden als Weiß zu sehen); das Bild läuft weiter mit Parallax und blendet auf.

## Zweiunddreißigster Stand (21.09.2026) — Die Szene reist zum Thema
- Vorbild boonglobal.io (three.js-Szene, deren Punktgruppen sich je Abschnitt umformen) und Max' Idee: Der Hintergrund des Startscreens folgt dem Thema der aktuellen Frage. Bei „Nächste Frage" oder dem Tipp auf eine Karte reist die Kamera zum passenden Ort, die Punkte-Bühne wandert mit und baut dort die passende Form auf.
- Zuordnung (`TOPIC_FORM` in `BonnScene.tsx`): Wärmepumpe → Bühne am Südufer mit der Wärmepumpen-Form, Photovoltaik → Wohnhaus mit Solardach, E-Mobilität → E-Auto mit Wallbox, Strom & Tarif → Windpark (mittleres Windrad) mit der Windrad-Form, Fernwärme → Stadt (Münster) mit der Münster-Form.
- Technik: `motion/sceneBus.ts` verbindet Oberfläche und Szene (S01 meldet `main.topic`, beim Verlassen `null`). Die Szene mischt ihre Umkreisung mit einer Nahpose um das Ziel (Radius 170, Höhe +62, langsame Drehung), Ziel und Anteil werden exponentiell nachgeführt (weiche Reise, auch bei schnellem Wechsel). Die Bühne wechselt in den Reisemodus: einmal in 1,6 s zur Themenform umbauen, dann stehen lassen; ohne Thema läuft der Sieben-Formen-Zyklus wie bisher weiter.
- Sicherung: `experimente/BonnScene-stand31-vor-reise.tsx.txt`.

### Nachjustierung (21.09.2026, Kartenreihe und Hero)
- Startscreen: Nach einer Antwort läuft die Hintergrundszene weiter (das kurze Einfrieren über `ambient.set(false)` ist raus).
- Hero: Text tiefer (24 px vom Rand), die Bildfläche hinter dem Foto ist jetzt in Seitenfarbe und der Verlauf schließt 3 px über die Kante hinaus, damit kein heller Rand mehr aufblitzt.
- Kartensektion: Rahmen aus Seitenfarbe über dem Handschlag-Bild (64 px plus Restluft), 80 px Luft zwischen Bildunterkante und Text, Pfeile → Karten 36 px, Karten → Leiste 36 px (Block 1650 px hoch, Leiste beginnt bei 1686). Der Stapelversatz ist so berechnet, dass die oberste Karte am Ende des Scrolls rechts bündig mit dem Pfeil-Button steht (1016 px).
- Scrollstrecke: 720 px je Karte (statt 520) und 520 px Vorlauf, in dem die erste Karte stehen bleibt. Der Fortschritt kommt direkt aus der Scrollposition (`root.scrollTop - wrap.offsetTop`, an Lenis gebunden); der ScrollTrigger setzte den Start rund 1000 px zu früh, dadurch war die erste Karte sofort überscrollt.
- Reise weiter: Sobald die Antwort aufgedeckt ist, fliegt die Szene schon weiter Richtung Bonner Skyline (Ziel Münster, Form bleibt stehen); mit der nächsten Frage geht die Reise von dort zum neuen Thema. `sceneBus.reveal(true|false)` aus S01 (`resolved`).

### Nachjustierung (21.09.2026, Quadrat-Reveal und Reveals)
- Handschlag-Bild: eigener Abschnitt (3000 px Scrollstrecke), das Bild steht fest im Monitor (sticky, 952 × 952 mittig). Beim Scrollen öffnet sich ein Quadrat darüber (`clip-path: inset` von 50 % auf 0, Fortschritt 5 bis 45 %), steht, und schließt sich wieder (55 bis 95 %); danach kommt „Was Sie wissen wollen". Gemessen: inset 50 → 25 → 0 → 25 → 50 %.
- Content-Reveals: Alle Gruppen starten mit Deckkraft 0 und kommen seitlich mit Bewegung, sobald ihr Abschnitt zu 22 % im Bild ist. Auslöser ist jetzt ein IntersectionObserver auf dem Scroller; der ScrollTrigger feuerte hier zu früh, dadurch standen Inhalte ohne Animation da.
- Fußzeile: Die Seite überdeckt die Naht zur Fußzeile um 3 px und der grüne Verlauf des Bildes beginnt 8 px außerhalb, damit an keiner Kante ein Bildpixel durchschimmert.
- Hero S02: Hero 1400 px hoch (Text sitzt tiefer), Kicker „Heizen · Wärmepumpe" als Lime-Tag statt schwachem Text, 68 px Luft zu den Kennzahlen, Zahlen mit 26 px Abstand zur Linie.
- „Alle Bereiche": Randthemen-Buttons (Wasser, Förderungen, Bonuswelt, Events) als Pillen mit 2-px-Kontrollrahmen, 72 px hoch, Label „Außerdem" als Kicker; Druckzustand füllt sie. Das Panorama-Foto (Junge mit Ball) für die Wärmepumpen-Kachel ist im Chat nicht angekommen, bitte erneut schicken.
- Overlays geprüft: Schema-Karte zeigt das Schema unbeschnitten auf Weiß, die übrigen Modul-Bilder laufen als Cover in 300-px-Köpfen.
- Themenseiten: neue Hero-Bilder von Max für Photovoltaik (Monteure auf dem Dach), E-Mobilität (Ladestecker) und Strom & Tarif (SWB-Kraftwerk am Abend).
- Aufblitzende Ränder an Bildern global behoben: `.photo` hat jetzt die Seitenfarbe als Grundfläche (nur im hellen Look weiterhin n-200), die Abdunklungs-Overlays (`.hero-shade`) ragen 2 px über die Kante hinaus, und die Hero-Bilder der Themenseiten werden beim Einblenden nicht mehr mitbewegt (kein `data-reveal` auf dem Bildkasten). Ursache war die helle Grundfarbe, die an Subpixel-Kanten und während der Einblend-Bewegung sichtbar wurde.
- Bilder blenden nach dem Laden weich ein (`.photo > img` startet transparent, `loaded`-Klasse per Load-Ereignis in der Capture-Phase in `App.tsx`, 0,55 s). Das war das restliche „Blitzen" auf den Themenseiten: Die großen Fotos erschienen schlagartig, sobald sie geladen waren, oft mitten im Vorhang.
- „Alle Bereiche": Die Wärmepumpen-Kachel zeigt den Panorama-Zuschnitt des Jungen mit Ball (aus `wp-faq-junge.jpg` mittig als 1600 × 672 beschnitten, da die Panorama-Datei aus dem Chat nicht ankam).
- Bildkanten: Der Abdunklungs-Verlauf (`.hero-shade`) endet jetzt voll deckend in der Seitenfarbe (vorher 96 %) und ragt 3 px über die Kante; zusätzlich zeichnet `.photo::after` innen einen 1,5-px-Ring in Seitenfarbe, der die Subpixel-Kante des gerasterten Bildes abdeckt, an der sonst eine Bildzeile neben dem Overlay sichtbar blieb (Themenseiten, Übersicht).
- Kamerafahrt der Szene erst bei „Nächste Frage" oder dem Tipp auf eine Karte, nicht mehr beim Umdrehen der Karte: Der Weiterflug beim Aufdecken ist raus (`sceneBus.reveal` bleibt als Schalter im Code, wird aber nicht mehr aufgerufen).
- Themenseiten: Das Hero-Bild ist dort keine eigene Compositor-Ebene mehr (`will-change` nur noch auf der scrollenden Wärmepumpen-Seite), dadurch wird es pixelgenau mit dem Kasten beschnitten; der innere Ring ist 2 px. Damit bleibt unten keine Bildzeile mehr stehen.
- Hero-Verlauf der Themenseiten und der Übersicht reicht jetzt 60 px über die Bildunterkante hinaus und ist ab 88 % voll deckend, sodass die letzten rund 60 px des Bildes sicher in Seitenfarbe liegen; der Verlauf liegt mit z-index 2 über Bild und Ring.
- Hero der Themenseiten/Übersicht: Der Verlauf liegt wieder unter dem Text (Text z-index 3, Verlauf 1). Das Bild endet jetzt 6 px über der Kastenunterkante (`calc(120% - 6px)`), die letzten Pixel sind ohnehin in Seitenfarbe; so kann bei keiner Skalierung eine Bildzeile unter dem Verlauf hervorstehen.
- Wärmepumpen-Hero: Textblock hängt 120 px unter die Bildkante in die blaue Fläche, der Wisch-Hinweis sitzt direkt über der Leiste (Unterkante 1676, Leiste ab 1686).

## Dreiunddreißigster Stand (21.09.2026) — Feinschliff Wärmepumpe, Szene, Übersicht
- **Hero**: Der Zoom lag auf dem Bildkasten, dadurch ragte das vergrößerte Bild über den Verlauf hinaus. Jetzt zoomt das Bild selbst innerhalb des beschnittenen Kastens.
- **Handschlag-Band** gehört wieder zur Sektion „Was Sie wissen wollen" (21:9 oben im festen Block, 64 px Rand): Es öffnet sich beim Ankommen wie eine Jalousie (waagerechte Lamellen, 72 px, `mask-image` mit `repeating-linear-gradient`), bleibt dann stehen und hat leichten Parallax. Der Quadrat-Abschnitt ist raus.
- **Reveals**: Elemente mit `data-fade` (die FAQ-Einträge) blenden nur in der Deckkraft ein, nacheinander, ohne seitliche Bewegung. Parallax aller Bilder (auch FAQ) läuft jetzt über die Scrollposition statt ScrollTrigger.
- **Kombination**: Holz-Wärmepumpe kleiner (560 px hoch, Ausschnitt auf 74 %), das Gerät vor dem Haus ist besser zu sehen.
- **Fußzeile**: Der 4-px-Balken an der Naht (vorherige Notlösung) war die „starke Linie", er ist raus. „Zusammenfassung mitnehmen" ist ein Textlink mit Chevron (`.textlink`).
- **Timeout**: Rad, Zeigerbewegung und Scrollen zählen jetzt als Aktivität; vorher nur Berührungen, deshalb kam der Hinweis beim Scrollen.
- **Wisch-Hinweis**: liegt außerhalb des Scrollers über der Leiste, erscheint nach 1,6 s und blendet aus, sobald gescrollt wird.
- **Szene**: Die Bühne steht jetzt neben dem Haus am Südufer (`SPOTS.swb`), die Formen setzen sich dort zusammen und die Kamera fliegt dorthin. Reise deutlich langsamer (Nachführung 0,22/0,16 statt 0,7/0,6) und als Bogen von links nach rechts (Blickwinkel schwenkt beim Näherkommen um ~100 Grad), damit die Wahrzeichen zu sehen sind.
- **Übersicht**: Kacheln 232 px hoch statt füllend, dadurch mehr Luft zwischen Randthemen-Buttons und Leiste.

## Vierunddreißigster Stand (21.09.2026) — Review, Aufräumen, Tempo
Drei Durchsichten (Code, Laufzeit, Gestaltung) und deren Umsetzung. Sicherung des Standes davor: `experimente/stand33-src/`.

### Behobene Fehler
- **Zwei schnelle Wechsel hintereinander landeten auf dem falschen Screen.** Der Vorhang führt den Wechsel erst nach knapp einer Sekunde aus; ein zweiter Tipp währenddessen schaltete sofort und wurde danach vom ersten überschrieben. Jetzt merkt sich der Vorhang den anstehenden Wechsel und ersetzt ihn (`motion/curtain.ts`).
- **WebGL-Kontexte liefen voll.** Jeder Besuch des Startscreens baute einen neuen Renderer auf, ohne Kontext, Himmel und Bühne freizugeben. Nach Stunden hätte der Browser die ältesten Kontexte verworfen (Szene bliebe schwarz). Jetzt wird alles freigegeben; nach drei Runden Start → Wärmepumpe → Start gibt es weiterhin genau eine Zeichenfläche.
- **Übergabe-Code:** Die Seite zeigte einen zufälligen Code, das Overlay immer „Für Elise". Der Code wandert jetzt mit der Overlay-Aktion mit (geprüft: beide zeigen denselben).
- **Modul-Rechner:** „Aufgedeckt" wurde daraus geraten, dass die Schätzung 4 war; wer 4 riet, sah die Karte schon aufgedeckt. Jetzt ein eigener Sitzungswert.
- **Ziehen der Fragenreihe** brach nicht mit dem laufenden Gleiten; ein Abbruch ließ die Reihe schief stehen. Beides behoben.
- **Timeout:** zählte nur Berührungen, nicht Scrollen (Hinweis kam beim Lesen). Jetzt zählen Rad, Zeiger und Scrollen.
- Kartenstapel auf S02 endet rechts bündig mit dem Pfeil (nachgemessen 1016 zu 1016), zweizeilige Kachel-Unterzeilen auf „Alle Bereiche" werden nicht mehr abgeschnitten, die Beraterseiten-Headline kollidiert nicht mehr mit der Komposition.

### Tempo
- **Kein Weichzeichner mehr über der laufenden Szene:** Die sechs Leisten-Kacheln mussten bei jedem Bild der Lichtpunkt-Szene neu weichgezeichnet werden. Auf dem Startscreen sind sie jetzt deckend (`#stage:has(> .art)`), auf allen anderen Seiten bleibt der Weichzeichner.
- **Szene:** Gelände- und Luftpunkte halbiert, nur noch jeder zweite helle Punkt spiegelt sich, Spur von zehn auf sechs Glieder (die Distanzschleife lief für jeden Punkt), größte Punktgröße 6,5 statt 8. Keine Vektor-Allokationen mehr je Bild (Scratch-Vektoren), Wahrzeichen-Index über eine Tabelle statt Suche.
- **Wärmepumpen-Seite:** Karten bewegen sich per `transform` statt `left` (kein Layout je Scroll-Tick), die Jalousie-Maske wird nur bei ganzen Pixeln neu gesetzt, der Wisch-Hinweis bekommt nur bei Zustandswechsel ein Tween. Haupt-Thread beim Scrollen: 1,6 % ausgelastet, längster Block 2,4 ms.
- **Bilder** auf 1200 px und Qualität 72 neu berechnet (Hero des Jungen bleibt größer): Fotos 9,2 → 6,3 MB, **Einzeldatei 10,5 → 7,0 MB**.
- Weniger Compositor-Ebenen (`will-change` von jedem Überschriftenwort entfernt).

### Aufgeräumt
- Gelöscht: `components/Background.tsx` und `motion/skylineData.ts` (aus der p5-Zeit, nirgends eingebunden, starteten zwei eigene Bildschleifen), der tote Kometen- und Drahtmodell-Block der Szene, ScrollTrigger (registriert, aber kein einziger Trigger), `sceneBus.reveal`, `useTopicLabel`, `window.__timeoutCount`.
- Neu: `motion/scroll.ts` mit `progressIn()` und `stageScale()` — beide Berechnungen lagen doppelt in zwei Dateien.
- CSS von 459 auf 395 Zeilen: tote Regeln (`.iconbtn`, `.chapter*`, `.flip*`, `.curtain-space`, `.swarm .hint`, `.h1/.h3`, …) entfernt, mehrfach überschriebene Regeln (Leisten-Kacheln viermal, `.swarm` dreimal, Druckzustände doppelt) auf je eine zusammengezogen.
- Tokens `--gutter`, `--nav-top`, `--nav-clear`, `--stage-solid` statt wiederholter Zahlen und `#00343b`-Literale.
- Bedienbarkeit: `aria-current="page"` statt `"false"`, `aria-expanded` an den FAQ-Zeilen, echtes `disabled` an Pillen, größere Trefferflächen an den Punkten der Kartenreihe, heller Kleintext (Kontrast).
- Handschlag-Band: Es wird jetzt als Ganzes aufgedeckt (ein Beschnitt von oben nach unten statt Lamellen) und deutlich früher, nämlich während es von unten ins Bild kommt; fertig aufgedeckt ist es, sobald es ganz zu sehen ist (gemessen: Unterkante bei 1627 von 1920). Danach wandert es mit der festen Sektion nach oben.

## Fünfunddreißigster Stand (22.09.2026) — Bilder wischen auf, Fußzeile typografisch
- **Bilder decken seitlich auf** (Vorbild ladolfinajumping.com, dort `clip-path: inset(0 100% 0 0)` auf dem Bild im überlaufversteckten Kasten): Auf der Wärmepumpen-Seite laufen jetzt das Handschlag-Band, das Holzhaus-Bild und das FAQ-Bild von links nach rechts auf. Hero und Fußzeile bleiben ausgenommen. Band: scrollgebunden, fertig sobald es ganz im Bild ist; die beiden Sektionsbilder: beim ersten Sichtbarwerden über 1,25 s mit der Haus-Kurve.
- **Sektionen zusätzlich über die Deckkraft**: Die beiden Textsektionen treten beim Scrollen von 0,35 auf 1 hervor und danach sanft wieder zurück.
- **Fußzeile ohne Bild**, rein typografisch (Headline 132 px, Text 36 px). Kicker, Headline, Text und die Aktionen setzen sich beim Aufdecken von oben ab (y −54 → 0, `power3.out`, gestaffelt), sobald 420 px der Fußzeile frei liegen. Wichtig: in Bühnenmaßen rechnen, nicht in Bildschirmpixeln — die Bühne ist ins Fenster skaliert, sonst löst die Bewegung je nach Fenstergröße zu früh oder gar nicht aus.
- **Berater-Knopf**: Beschriftung und Symbol in Dunkelgrün (accent-900) statt Weiß beziehungsweise Schwarz.
- **Blaue Linie im Hero und Rahmen auf der Kachel „Alle Bereiche"**: Beides war der 2-px-Innenring, den ich gegen die Bildzeile am Rand gesetzt hatte. Auf hellen Bildern las er sich als Rahmen, im Hero lief seine Unterkante quer durch den Textblock. Der Ring ist raus; die Bildzeile verhindern inzwischen der verlängerte Verlauf und das 6 px kürzere Bild.
- Kachel „Heizen" auf „Alle Bereiche" trägt jetzt wie die anderen ein Tag („Meistgefragt").
- Handschlag-Band nachjustiert: Der Fortschritt hängt jetzt am Scrollweg (ab 250 px, über 1000 px) statt an der Bildlage. Am Seitenanfang ist das Bild dadurch sicher ganz zugedeckt (vorher standen schon 264 px im Bild und es war halb offen), und es deckt deutlich langsamer auf (bei 600 px Scrollweg erst zu 28 %). Der freie Raum im festen Block liegt jetzt über dem Bild statt zwischen Bild und Überschrift: Abstand Bild zu Text 72 statt rund 207 px. Die Textgruppe erscheint früher, weil bei sehr hohen Abschnitten ein fester Sichtbarkeitsanteil viel zu spät auslöst — der Schwellwert wird jetzt aus der Abschnittshöhe gerechnet (rund 1000 px sichtbar reichen, statt 22 % von 6490 px).
- **Overlays der Karten**: Kicker, Titel und Texte setzen sich beim Öffnen nacheinander ab, das Bild im Kopf wischt seitlich auf (wie auf der Seite). Bedienelemente bleiben ruhig — Knöpfe, Regler, Aufklapper und die Fußzeile des Panels laufen nicht mit, damit nichts unter dem Finger wegrutscht.
- **Sektionen animieren erneut**: Bisher lief die Einblendung einmalig (der Beobachter wurde nach dem ersten Mal abgemeldet); wer zurückscrollte, sah alles ohne Bewegung. Jetzt wird ein Abschnitt zurückgesetzt, sobald er das Sichtfeld ganz verlässt, und spielt beim nächsten Hereinkommen wieder — Texte, Zahlen und die unteren Bilder. Der Hero wartet nur beim ersten Mal auf den Vorhang.
- Nur beim Abwärtsscrollen wird animiert: Kommt ein Abschnitt von oben ins Bild (man scrollt zurück nach oben), steht er sofort fertig da. Dafür merkt sich die Seite die Scrollrichtung; der Beobachter spielt die Einblendung nur bei Richtung „nach unten", sonst setzt er den Endzustand.
- Abstände verdoppelt: Kartenreihe → „Stark in Kombination" und „Stark in Kombination" → „Häufige Fragen" liegen jetzt bei 300 statt 150 px (Innenabstand der `.sec`-Abschnitte oben und unten).
- Berater-Knopf: Beschriftung und Symbol in einem dunkleren Grün (neues Token `--on-accent` #2c3800); accent-900 war auf dem Lime noch zu hell.
- „Alle Bereiche": Die grüne Unterzeile der Wärmepumpen-Kachel ist jetzt ein Tag. Die Reihe „Weitere Themen" (vorher „Außerdem") sitzt 56 px tiefer und trägt eine zweizeilige Beschriftung.
- Anzeigefehler der Kartenreihe behoben: Wer über den Abschnitt hinausgescrollt war und zurückkam, sah die Punkte, aber keine Karten. Grund: Beim Hochscrollen wurde der Abschnitt erst ab 1000 px Sichtbarkeit wieder gesetzt, während der untere Teil (die Punkte, ohne Einblendung) längst zu sehen war. Jetzt gilt beim Hochscrollen: sobald der Abschnitt überhaupt hereinragt, steht er sofort vollständig.
- Bild bei „Stark in Kombination" herausgezoomt: Kasten 620 × 430 statt 520 × 560, Ausschnitt mittiger. Sichtbar sind jetzt rund 69 % der Bildbreite statt 44 % — das Gerät steht mit Haus und Wiese im Bild.
- Beraterseite mit dezentem Aufbau: Der Hero blendet auf, die Einladung links kommt von rechts herein und dockt an ihrem Platz an (`power3.out`, gestaffelt), danach stapeln sich die QR-Karte, die Code-Zeile und „Weiter stöbern" nacheinander von unten herein. Die Bewegung startet mit 1,25 s Verzögerung, weil der grüne Vorhang die Seite erst dann freigibt — sonst liefe sie unsichtbar ab (gleicher Fallstrick wie beim Hero der Wärmepumpen-Seite).
- Beraterseite schneller: Start 0,5 s nach dem Wechsel statt 1,25 s, damit die Fläche nicht leer steht. Die Elemente setzen weiterhin versetzt an, sind aber alle zum selben Zeitpunkt da — die Dauer wird je Element aus dem gemeinsamen Endpunkt (0,95 s) zurückgerechnet. Gesamt rund 1,45 s statt 2,6 s.
- Hero der Wärmepumpen-Seite gleichgezogen: Der Text setzt schon bei 0,45 s an (vorher lief er erst nach dem Aufbau der Seite los) und ist gemeinsam mit dem Bild bei 1,5 s final — Zoom des Hero-Bildes und Endpunkt von Überschrift, Unterzeile und Zahlenreihe fallen jetzt auf denselben Moment. Die Dauer wird je Element aus dem gemeinsamen Endpunkt zurückgerechnet (`HERO_START` / `HERO_END`), die Zähler laufen über dieselbe Strecke. Alle anderen Abschnitte behalten ihre gestaffelte Einblendung.
- Overlays der Karten korrigiert: Das Kopfbild war mit 300 px nur ein Streifen (jetzt 520 px, Schema-Bild 480 px) und sein Seitenwisch endete deutlich später als die Texte — die Schrift stand schon, während das Bild noch aufschob. Jetzt haben Bild, Kicker, Titel und Texte einen gemeinsamen Endpunkt (0,85 s nach 0,1 s Vorlauf): Sie starten leicht versetzt, sind aber gleichzeitig fertig. `clipPath` wird am Ende geräumt, damit kein Beschnitt stehen bleibt.
- Startscreen: Die Quizkacheln (Fragenreihe, Pfeilknöpfe, Hauptkarte) kommen beim ersten Erscheinen nicht mehr von unten herein. Statt `y: 36` nur noch Aufblenden mit leichtem Aufziehen aus der eigenen Mitte (`scale` 0,94 → 1, 0,8 s). Die Kacheln bleiben damit von Anfang an an ihrem Platz. Deckkraft und Skalierung laufen dabei getrennt: Das Aufziehen ist nach 0,8 s fertig, die Deckkraft braucht mit 1,6 s doppelt so lang und läuft flach aus (`power1.out`) — die Kacheln stehen weich da, statt hart anzuspringen.
- Bild bei „Stark in Kombination" auf 1:1 umgestellt: 520 × 520 statt 620 × 430, Oberkante auf einer Linie mit dem Textblock links (`alignItems: 'start'` statt `'center'`). 520 ist das größte Maß, das noch passt — die Überschrift zwingt die linke Spalte auf 429 px (Mindestbreite von „Kombination."), zusammen mit 64 px Rand und 48 px Spalte ergibt das genau die 1080 px der Stele. Mit den vorherigen 620 px lief das Bild 81 px aus dem Bild heraus und wäre auf dem Schirm kein Quadrat gewesen. Das Bild füllt den Kasten jetzt ohne Überstand (`height: 100 %` statt 118 %), sonst zöge das höhere Format den Ausschnitt seitlich weiter zu.
- Overlays der Karten neu aufgeteilt: Das Bild liegt nicht mehr über dem Text, sondern rechts neben Topline und Überschrift — halbe/halbe (je 460 px) mit 32 px dazwischen, Format 4:3 (460 × 345), Oberkanten auf einer Linie. Dafür ist das Bild aus `ModuleContent` in die neue Komponente `ModuleMedia` gewandert, die `Overlays` als `media`-Eigenschaft an das Sheet gibt; ohne `media` bleibt der Kopf einspaltig wie bisher. Das Schema-Bild („Wie funktioniert eine Wärmepumpe?") sitzt weiter auf Weiß und wird eingepasst statt beschnitten.
- Hero der Wärmepumpen-Seite langsamer und stärker über die Deckkraft geführt: Der gemeinsame Endpunkt liegt jetzt bei 2,1 s statt 1,5 s (Start weiterhin 0,45 s), Text und Bildzoom sind weiterhin gleichzeitig fertig. Bewegung und Deckkraft laufen dabei getrennt — die Zeilen schieben sich versetzt an ihren Platz (`power3.out`), die Deckkraft läuft bei allen Elementen über die volle Strecke und flach aus (`power1.out`). Dadurch trägt das Aufblenden die Sequenz, statt nur ein kurzer Anhang der Bewegung zu sein.
- Zahlenreihe im Hero zählt erst nach der Endposition: Start bei 2,1 s (wenn alles steht), Dauer 1,4 s (`HERO_COUNT`). Die Zahlen stehen also schon an ihrem Platz und laufen dort hoch, statt während des Einschiebens mitzulaufen. In allen anderen Abschnitten zählen sie unverändert direkt beim Erscheinen über 1,4 s.
- Overlay-Kopf: Topline und Überschrift stehen jetzt an der Unterkante des Bildes (Textspalte auf Bildhöhe, Inhalt unten ausgerichtet), Abstand zum Text darunter von 30 auf 64 px.
- Alle sieben Karten-Overlays auf abgeschnittene Bedienelemente geprüft. Ein Fund: Bei „Aus 1 kWh Strom werden rund 4 kWh Wärme" lief „Aufdecken" 13 px aus seiner Spalte und wurde vom Inhaltsbereich beschnitten; außerdem scrollte der Inhalt um 45 px. Rechte Spalte jetzt 300 statt 260 px, Bogen-Slider 500 statt 560 — alle sieben ohne Überlauf und ohne Scrollen.
- Handschlag-Bild ohne Parallax: Es wandert nicht mehr im Kasten (weder der eigene noch der allgemeine Bild-Parallax greift), sondern zoomt über den ganzen Abschnitt sehr langsam von 100 auf 105 %. Gemessen: 100,9 % beim Hereinkommen, 105 % am Ende, keine Verschiebung.
- FAQ-Bild kommt im Kinoformat herein: Der Kasten startet in 21:9 (463 px) und wächst beim Hereinscrollen weich auf 16:9 (608 px).
- Hero der Wärmepumpen-Seite blockweise versetzt: Alle Blöcke starten gemeinsam (ihre Bewegung läuft also schon, wenn man sie sieht), erreichen ihre Endlage aber von oben nach unten um je 200 ms versetzt. Als Block zählt eine Textzeile und jedes einzelne Element; der unterste endet bei 2,4 s gemeinsam mit dem Bildzoom.
- Die drei Zahlen-Blöcke (Linie, Wert, Text) fächern einzeln auf statt als Reihe zu kommen: Jede Spalte ist ein eigener Block und läuft 200 ms nach der vorherigen ein, getragen von der langen Deckkraftkurve.
- Zahlen zählen jetzt gleich mit dem Text los (Start 0,45 s statt 2,1 s) und sind vor der Endposition fertig.
- Startscreen: Quizkacheln 200 ms länger — Aufziehen 1,0 s statt 0,8 s, Deckkraft 1,8 s statt 1,6 s.
- Übergang zur Startseite und zu „Alle Bereiche" ruhiger: Die schnelle Kurzvariante des Vorhangs schiebt jetzt in 0,45 s zu und in 0,55 s wieder auf (vorher 0,32 s / 0,4 s) und nutzt die weichere Kurve `power2` statt `power3`. Sie bleibt mit gut 1 s klar kürzer als der große dreiflächige Vorhang, schnappt aber nicht mehr zu.
- FAQ-Bild klappt aus dem Nichts auf: Startwert 0 statt 463 px, Endwert unverändert 608 px (16:9). Wichtig dabei: Der Fortschritt hängt jetzt an der Oberkante des Kastens statt an `progressIn` — dessen Wert steckt die Höhe des Kastens mit ein, und genau die wird hier verändert. Das Bild hätte sich selbst gefüttert und gezittert. Gemessen: 0 → 145 → 502 → 608 px und bei wiederholten Scroll-Ereignissen an derselben Stelle stabil.
- Zahlen im Hero langsamer und versetzt: Grunddauer 2,2 s statt 1,4 s, dazu erreichen die drei Werte ihren Endstand um je 600 ms versetzt von links nach rechts (Dauer 2,2 / 2,8 / 3,4 s). Sie starten weiterhin gemeinsam mit dem Text und werden zum Schluss deutlich langsamer (`power3.out` statt `power2.out`). In allen anderen Abschnitten zählen sie unverändert über 1,4 s.

## Refactor der Wärmepumpen-Seite (Scrollen)

Das Nachrucken beim Scrollen bis hinunter zur Fußzeile kam nicht von zu vielen Effekten, sondern davon, **wie** sie ausgeführt wurden.

- **Vier Scroll-Listener wurden zu einem.** Vorher hingen vier eigene Handler an Lenis (Parallax und Sektionsdeckkraft, Wisch-Hinweis, Fußzeile, Kartenreihe). Jeder las Layout (`getBoundingClientRect`) und schrieb danach Stile — der nächste las wieder. Der Browser muss bei jedem solchen Wechsel die Seite neu durchrechnen (Layout-Thrashing), und zwar mehrfach pro Bild. Jetzt läuft alles in einem Handler mit klar getrennter Rechen- und Schreibphase.
- **Keine Layout-Abfragen mehr im Scrollen.** Alle Maße werden einmal genommen (und per `ResizeObserver` neu, wenn der FAQ-Aufklapper die Seitenhöhe ändert); danach wird nur noch mit `scrollTop` gerechnet. Gerechnet wird in Layout-Pixeln (`offsetHeight`, `clientHeight`, `scrollTop`), die von der Skalierung der Bühne unberührt bleiben — die vorherigen Umrechnungen über `stageScale` entfallen damit an diesen Stellen.
- **Nur geänderte Werte werden geschrieben.** Transform, Deckkraft, Beschnitt und Zoom werden gerundet und gegen den zuletzt geschriebenen Wert geprüft. Vorher setzte jedes Bild dieselben Stile erneut.
- **Die Höhe des FAQ-Bildes wird nicht mehr animiert.** Eine Höhenänderung bricht bei jedem Bild alles darunter neu um — das war der teuerste Einzeleffekt und genau dort, wo es bis zur Fußzeile ruckelte. Das Bild sitzt jetzt in einer Hülle fester Höhe und klappt darin per `clip-path` auf. Sichtbar ist dasselbe, die Seitenhöhe bleibt aber konstant. Dadurch braucht es dort auch kein `data-wipe` mehr: Das Aufklappen ist die Enthüllung.
- **Visueller Glitch behoben:** Zwei Bilder (Kombination, FAQ) füllten ihren Kasten genau, bekamen aber Parallax — beim Verschieben blitzte oben oder unten der Seitenhintergrund durch. Der Parallax wird jetzt aus dem tatsächlichen Überstand des Bildes über seinen Kasten berechnet; ohne Überstand steht das Bild still. Das FAQ-Bild hat dafür 60 px Überstand nach oben und unten bekommen, in Pixeln statt Prozent — Prozenthöhen beziehen sich auf die Höhe des Kastens, Prozentränder dagegen auf seine Breite, wodurch der Überstand vorher einseitig war.
- Nachgemessen: Kein Bild zeigt an irgendeiner Scrollposition einen Spalt (alle Über-/Unterstände ≤ 0), der Aufklapper bleibt bei wiederholten Scroll-Ereignissen an derselben Stelle stehen (keine Rückkopplung), Kartenreihe, Sektionsdeckkraft, Fußzeile und Handschlag-Zoom arbeiten unverändert.
- **Wackelnder Text und ruckelnde Karten in der Kartenreihe, ruckelnder Text im Fuß:** Lenis scrollt mit Nachkommastellen. Klebende Blöcke (`.railstick`, `.curtain`) landen dadurch Bild für Bild auf einer anderen Bruchteilposition, und der Browser rastert ihren Text jedes Mal neu — das ist das Wackeln. Beide liegen jetzt auf einer eigenen Compositor-Ebene (`will-change: transform`) und werden nur noch verschoben. Die Karten der Reihe tragen zusätzlich einen 60 px weichen Schatten, der ohne eigene Ebene bei jedem Bild neu gezeichnet werden musste; auch sie sind jetzt promoted. Ihre Position wird außerdem auf ganze Pixel gerundet (Bruchteile erzwingen ein Neurastern) und nur geschrieben, wenn sie sich geändert hat.
- **FAQ-Aufklappen wieder sichtbar:** Es lief zwar, aber im falschen Fenster — der Kasten war bereits ganz offen, während er noch am unteren Bildrand stand und die Sektion erst halb eingeblendet war. Jetzt klappt er auf, während seine Oberkante von 78 % auf 25 % der Sichthöhe wandert: Beginn im unteren Drittel, fertig etwa auf halber Höhe bei voller Deckkraft.
- **Parallax bei „Stark in Kombination" wieder da:** Das Bild füllte sein Quadrat exakt, deshalb hatte die neue Überstandsbegrenzung es stillgestellt. Es bekommt jetzt 28 px Überstand oben und unten — bewusst knapp, weil jeder Pixel den Ausschnitt weiter zuzieht — und wandert damit über 56 px. Nachgemessen: Über- und Unterstand bleiben an jeder Scrollposition ≤ 0, es blitzt also nirgends Hintergrund durch.
- FAQ-Sektion löst später aus: Der allgemeine Schwellwert (rund 1000 px Sichtbarkeit) ließ ihre Einblendung anlaufen, während erst die Oberkante des hohen Bildes hereinragte. Sie braucht jetzt 45 % Sichtbarkeit (rund 820 px), begrenzt auf einen Wert, der bei ihrer Höhe überhaupt erreichbar ist.
- FAQ-Bild klappt wieder früher auf und blendet dabei auf: Aufklappen von 78 % auf 30 % der Sichthöhe, die Deckkraft des Kastens ist schon nach 55 % der Strecke voll da. Das Bild ist also erst zu ahnen und schiebt sich dann auf, statt hart aufzutauchen. Gemessen: Deckkraft 0 → 0,57 → 0,96 → 1 bei gleichzeitigem Beschnitt 100 % → 77 % → 45 % → 16 %.
- Sektionen blenden stärker über die Deckkraft ein (betrifft „Stark in Kombination" und „Häufige Fragen"): Bewegung und Deckkraft laufen jetzt wie im Hero getrennt — die Zeilen schieben sich in 1,1 s versetzt an ihren Platz, die Deckkraft läuft über 1,8 s und flach aus (`power1.out`). Vorher hingen beide an derselben 1,1-s-Kurve, dadurch war das Aufblenden nur ein kurzer Anhang der Bewegung.
- Knopf „Kombination wählen" sitzt 64 statt 28 px unter dem Text.
- Reihenfolge in der Einblendung der Sektionen umgedreht: Die Bewegung geht jetzt voraus, die Deckkraft folgt. Die Zeilen sind also schon unterwegs an ihren Platz, bevor sie überhaupt sichtbar werden (Bewegung ab 0 s bzw. 0,25 s, Deckkraft ab 0,22 s bzw. 0,5 s). Vorher blendete der Text teilweise vor der Bewegung auf.
- Unrunde Überschrift bei „Häufige Fragen" behoben: Die Deckkraft der Sektion hängt am Scroll und ändert sich bei jedem Bild — ohne eigene Ebene musste der Browser dafür den ganzen, rund 1800 px hohen Abschnitt neu zeichnen, während die Überschrift darin selbst noch animiert wurde. `section.sec` und die Hülle des FAQ-Bildes liegen jetzt auf einer eigenen Ebene (`will-change: opacity`), die Deckkraft ist damit reine Compositor-Arbeit.
- Akkordeon-Zeilen kommen deutlicher nacheinander: Versatz 0,16 statt 0,1 s je Zeile, Start erst bei 0,75 s (also nach Überschrift und Fließtext), weiterhin reine Deckkraft ohne Bewegung.
- Hero-Einlauf der Wärmepumpen-Seite kräftiger und neu sortiert:
  - Startversatz nach rechts deutlich größer und nur im Hero: Überschriftzeilen 130 statt 46 px, übrige Elemente 170 statt 70 px. Die anderen Abschnitte behalten ihre 46/70 px (eigene Konstanten `HERO_XW`/`HERO_XI` gegenüber `SEC_XW`/`SEC_XI`).
  - Härterer Ausklang: `expo.out` statt `power3.out` für den Weg nach links. Die Deckkraft läuft weiter flach aus (`power1.out`) und trägt das Erscheinen.
  - Größerer Versatz von Stufe zu Stufe: 0,3 statt 0,2 s.
  - Reihenfolge steht jetzt im Markup (`data-hstep`) statt in der Lage auf dem Schirm: 0 = Tag und Überschrift gemeinsam, 1 = Unterzeile, 2–4 = die drei Zahlen einzeln. Vorher wurden die Blöcke nach ihrer Position sortiert, dadurch lief der Tag allein vor der Überschrift.
  - Nachgemessen: Ausgangslage im Hero 130 px (Zeilen) und 170 px (übrige), in den anderen Abschnitten unverändert 46/70 px; alle fünf Stufen erreichen Deckkraft 1, Zahlen 75/70/114.
- Konzernbild ist zurück im Fuß: `swb-eingang.jpg`, 520 px breit, drei Viertel der Abschnittshöhe (885 von 1180 px), bündig in der oberen rechten Ecke des Fußes — ohne Innenabstand, also wirklich an der Ecke. Zwei Verläufe in der Fußfarbe blenden es nach links (bis 68 %) und nach unten (bis 54 %) aus; oben und rechts steht es auf Kante. Es trägt `data-foot`, erscheint also mit dem übrigen Fuß und ist nicht schon sichtbar, während der Text noch wartet.
  - Zwei Fallen dabei: Der Absolutsatz griff zuerst nicht, weil die allgemeine Regel `.photo { position: relative }` weiter unten im Stylesheet steht und dieselbe Spezifität hat — deshalb jetzt `.curtain .curtain-photo`. Und die Höhe des Bildes muss am Element selbst stehen, weil die Inline-Angabe im JSX jede Stylesheet-Regel schlägt.
  - Pixellinie an der Unterkante behoben: Der Kasten beschneidet (`overflow: hidden`), ein überstehender Verlauf wird also mitbeschnitten und kann die letzte Bildzeile nicht abdecken. Stattdessen endet das Bild 6 px über der Unterkante, und der Kasten trägt die Fußfarbe statt `--stage-solid` (sonst stünde dort ein dunkler Streifen). Nachgemessen: 6 px Luft, Kastenfarbe rgb(241, 255, 185).

## Refactor: Performance, Codequalität und Vercel

### Build: zwei Ausgabeformen statt einer
Bisher gab es nur den Ein-Datei-Build (`vite-plugin-singlefile`, alle Bilder als base64). Der ist für die Stele richtig — sie öffnet die Datei ohne Server —, fürs Web aber die schlechteste Variante: 6,7 MB, die bei jedem Aufruf neu geladen werden und von denen der Browser nichts behalten kann. Jetzt schaltet `STELE=1` in `vite.config.ts` um:
- `npm run build` → Web-Build für Vercel. `index.html` ist 1,6 kB statt 6,7 MB, Assets tragen einen Inhalts-Hash und sind dauerhaft zwischenspeicherbar. Die großen Brocken liegen in eigenen Bündeln (three 518 kB, React 223 kB, GSAP/Lenis 122 kB, App-Code 219 kB), damit eine Codeänderung nicht alles entwertet.
- `npm run build:stele` → unverändert eine einzige HTML-Datei.
- `npm run export:stele` baut und kopiert sie gleich nach `30_Prototyp/stele-prototyp.html`.

Details und die Vercel-Einrichtung stehen in `DEPLOY.md`. Wichtig dort: **Root Directory ist `30_Prototyp/app`**, nicht das Projektwurzelverzeichnis.

### Google Fonts entfernt
`index.html` lud Rajdhani zusätzlich von Google, obwohl die Hausschriften lokal unter `src/assets/fonts-swb` liegen und per `@font-face` eingebunden sind. Doppelte Ladung, auf der Stele ohne Netz wirkungslos, und bei einem Auftritt der Stadtwerke datenschutzrechtlich zu klären. Ersatzlos raus.

### Gefundene und behobene Fehler
- **Overlay-Reveal lief bei jeder Eingabe neu.** Der Einblende-Effekt in `Sheet.tsx` hing an `children` — das ist bei jedem Render ein neues Objekt, und `Overlays` rendert bei jedem Store-Dispatch. Beim Ziehen des Bogen-Reglers im Rechner-Modul wurde also rund 60×/s eine komplette GSAP-Timeline über alle Textblöcke aufgebaut, wobei die Texte jedes Mal kurz auf Deckkraft 0 zurücksprangen. Hängt jetzt an Titel und Kicker, die sich nur bei echtem Inhaltswechsel ändern.
- **Nicht abgeräumte Tweens und Timer auf dem Startscreen.** Die Kartendrehung, das Reihen-Gleiten und der 220-ms-Timer liefen weiter, wenn man den Screen währenddessen verließ — GSAP animierte dann bis zu 1,26 s auf einem abgehängten Knoten und rief State-Setter einer entfernten Komponente auf. Alles wird jetzt gesammelt und beim Verlassen gekillt.
- **Gestapelte Tweens im Bogen-Slider.** Die Zahl wurde ohne `overwrite` und ohne Abräumen animiert; beim Ziehen schrieben am Ende rund hundert parallele Tweens in dasselbe Textfeld.

### Performance
- **Die Bonn-Welt wird nicht mehr bei jeder Rückkehr neu gebaut.** `buildWorld()` und `resample(7000)` sind zusammen rund 60 ms synchrone Arbeit auf dem Hauptthread — und die Szene hängt nur am Startscreen, wird also bei jedem Hin und Zurück neu gemountet, genau während der Vorhang läuft. Beide sind reine Erzeuger und werden nirgends mutiert (geprüft), das Ergebnis wird jetzt einmal je Sitzung behalten.
- **`stageScale()` misst nicht mehr bei jedem Aufruf.** Die Funktion macht ein `getBoundingClientRect()` und wird in `pointermove`-Handlern aufgerufen, die unmittelbar danach Stile schreiben — das erzwang bei jeder Mausbewegung ein synchrones Neuberechnen des Layouts. Der Wert wird zwischengespeichert und nur bei `resize` verworfen.
- **Context-Wert des Stores memoisiert.** Ohne das rendert bei jedem Dispatch der ganze Baum mit, auch bei den vielen Dispatches, die ein Regler beim Ziehen auslöst. Dazu ein früher Ausstieg in `choose()`, wenn sich die Antwort gar nicht geändert hat.
- **Weichzeichner der Navigationsleiste von 34 auf 14 px.** Ein `backdrop-filter` muss den Hintergrund neu lesen und falten, sobald sich dahinter etwas bewegt — auf der Wärmepumpen-Seite also bei jedem Scroll-Bild, siebenmal, einmal je Kachel. Die Kosten wachsen mit dem Radius. Zum Ausgleich etwas mehr Deckung (56 statt 46 %). *Das ist die einzige bewusste optische Änderung; sie steckt in einer einzigen Zeile in `styles.css` und lässt sich dort zurückdrehen.*
- **Tote Uniforms im Punkte-Shader entfernt.** `uPulse`, `uPulseOn`, `uWave`, `uFocus`, `uFocusAmt` und `uPx` waren deklariert, wurden im Shader-Rumpf aber nirgends gelesen — geschrieben wurden sie trotzdem bei jedem Bild, samt einer Winkelrechnung über alle Gruppen, die nur sie speiste. Der halbe Öffnungswinkel wurde außerdem in der Schleife statt davor berechnet.
- **Rund 70.000 kurzlebige Vector3-Objekte beim Aufbau eingespart**, indem die Hüllquader der Wahrzeichen über Zahlen statt über Vektoren gerechnet werden.

### Codequalität
- `p5` und `@types/p5` entfernt — im Code gab es davon nur noch Kommentare, importiert wurde nichts (im Bundle war es entsprechend auch nicht).
- Typpakete von den Laufzeit- in die Entwicklungsabhängigkeiten verschoben.
- Toter Renderpfad `center` in `Sheet.tsx` entfernt: gedacht war er für das Timeout-Overlay, das sein Markup inzwischen selbst baut.
- Tote Kette `path` (`App.tsx` → `Topbar`) entfernt — der Wert wurde berechnet, übergeben und dann verworfen.
- Ungenutzter Export `progressIn` entfernt; die Wärmepumpen-Seite rechnet den Fortschritt längst aus zwischengespeicherten Maßen.
- Drei ungenutzte Importe entfernt und `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride` in `tsconfig.json` eingeschaltet. Der Build läuft `tsc --noEmit` mit, es kommt also nichts mehr durch.
- `.gitignore`, `.vercelignore` und `vercel.json` ergänzt.

Was ich **nicht** angefasst habe und warum, steht in `AUFRAEUMEN.md` — vor allem ungenutzte Fotos und Icons, die nach bewusst gepflegtem Quellmaterial aussehen und ohnehin nicht im Build landen.

### Nach dem Umbau geprüft
Startscreen mit Szene, Bogen-Regler, Kartendrehung beim Aufdecken, Fragenwechsel per FLIP, Wärmepumpen-Seite mit Scrollen und Kartenreihe, Overlay öffnen samt Regler darin (Texte bleiben jetzt stehen), Beraterseite, „Alle Bereiche", zurück zum Startscreen. Nach dem Hin und Zurück wieder genau ein Canvas — kein WebGL-Leck. Keine Fehler in der Konsole.
