// Gemeinsame Helfer für scrollgebundene Effekte auf der Wärmepumpen-Seite.

// Die Bühne ist 1080 px breit und wird ins Fenster skaliert; Zeigerwege müssen zurückgerechnet werden.
//
// Der Wert wird zwischengespeichert. Vorher maß ihn jeder Aufruf frisch per getBoundingClientRect —
// und aufgerufen wird er in pointermove-Handlern, die unmittelbar danach Stile schreiben (Ziehen der
// Fragenreihe auf dem Startscreen, Ziehen der Wärmepumpen-Seite mit der Maus). Das erzwang bei jeder
// Mausbewegung ein synchrones Neuberechnen des Layouts. Ändern kann sich die Skalierung nur, wenn sich
// das Fenster ändert; genau darauf hört der Cache.
let cached = 0
const measure = () => {
  cached = (document.getElementById('stage')?.getBoundingClientRect().width ?? 1080) / 1080
  return cached
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => { cached = 0 }, { passive: true })
  window.addEventListener('orientationchange', () => { cached = 0 }, { passive: true })
}
// Von außen anstoßen, wenn die Bühne neu skaliert wurde, ohne dass das Fenster sich geändert hat.
export function invalidateStageScale() { cached = 0 }
export function stageScale() { return cached || measure() }
