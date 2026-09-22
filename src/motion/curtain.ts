import gsap from 'gsap'
import { reduceMotion } from './ambient'

// Übergang zwischen Screens: drei Flächen im Blau-Spektrum steigen von unten über den aktuellen
// Inhalt (beschleunigend), dahinter wechselt der Screen, dann ziehen die Flächen nach oben weg
// (abbremsend) und enthüllen die neue Seite. Für die Beraterseite enthüllen grüne Flächen: Sie
// blenden sich im Moment der vollen Abdeckung über die blauen und ziehen dann weg. Für die
// Übersicht und das Logo gibt es eine schnelle einflächige Variante.
export type CurtainTone = 'blue' | 'green' | 'fast'
let host: HTMLElement | null = null
let busy = false
// Der Screenwechsel, der beim nächsten vollen Zudecken ausgeführt wird; ein weiterer Wechsel
// während des Laufs ersetzt ihn (sonst käme der spätere zuerst und der frühere überschriebe ihn).
let pending: (() => void) | null = null
const runPending = () => { const s = pending; pending = null; s?.() }


export function setCurtainHost(el: HTMLElement | null) { host = el }

export function curtainTo(swap: () => void, tone: CurtainTone = 'blue') {
  if (!host || reduceMotion) { swap(); return }
  if (busy) { pending = swap; return }
  pending = swap
  const blue = Array.from(host.querySelectorAll<HTMLElement>('.op'))
  const green = Array.from(host.querySelectorAll<HTMLElement>('.og'))
  if (blue.length !== 3 || green.length !== 3) { swap(); return }
  busy = true
  host.style.display = 'block'
  // Ruhige Kurzvariante (Übersicht und Logo, also "Alle Bereiche" und die Startseite): eine einzelne Fläche
  // schiebt in 0,45 s von unten über den Screen, dahinter wechselt der Screen, dann zieht sie in 0,55 s nach
  // oben hinaus. Gegenüber der früheren Fassung (0,32 s / 0,4 s mit power3) länger und mit weicherer Kurve
  // (power2), damit der Wechsel nicht zuschnappt. Sie bleibt mit gut 1 s klar kürzer als der große Vorhang.
  // Keine Rundungen (CI).
  if (tone === 'fast') {
    const layer = blue[0]
    gsap.set(blue.slice(1), { yPercent: 100 })
    gsap.set(green, { yPercent: 100, opacity: 0 })
    gsap.set(layer, { yPercent: 100, opacity: 1 })
    gsap.timeline({ onComplete: () => { host!.style.display = 'none'; busy = false } })
      .to(layer, { yPercent: 0, duration: 0.45, ease: 'power2.in' }, 0)
      .call(runPending, [], 0.47)
      .to(layer, { yPercent: -100, duration: 0.55, ease: 'power2.out' }, 0.52)
    return
  }
  gsap.set(blue, { yPercent: 100, opacity: 1 })
  gsap.set(green, { yPercent: 100, opacity: 0 })
  const out = tone === 'green' ? green : blue
  // Bildmarke als Wasserzeichen: kommt mit der ersten Fläche von unten, steht mittig, geht mit der letzten nach oben
  const mark = host.querySelector<HTMLElement>('.op-mark')
  const tl = gsap.timeline({ onComplete: () => { host!.style.display = 'none'; busy = false } })
  if (mark) {
    gsap.set(mark, { y: 1100, opacity: 0, display: tone === 'blue' ? 'block' : 'none' })
    // Einlauf mit der ersten Fläche (0,7 s, beschleunigend), Auslauf mit der ersten weggehenden Fläche
    // (ab 1,3 s, 0,95 s, abbremsend): gleiche Kurven und gleiche Geschwindigkeit wie die Flächen
    tl.to(mark, { opacity: .1, duration: 0.25, ease: 'power1.out' }, 0)
      .to(mark, { y: 0, duration: 0.7, ease: 'power3.in' }, 0)
      .to(mark, { y: -1100, duration: 0.95, ease: 'power3.out' }, 1.3)
      .to(mark, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 1.55)
  }
  tl.to(blue[0], { yPercent: 0, duration: 0.7, ease: 'power3.in' }, 0)
    .to(blue[1], { yPercent: 0, duration: 0.7, ease: 'power3.in' }, 0.12)
    .to(blue[2], { yPercent: 0, duration: 0.7, ease: 'power3.in' }, 0.24)
    .call(runPending, [], 0.98)
  if (tone === 'green') {
    tl.set(green, { yPercent: 0 }, 0.94)
      .to(green, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 0.96)
      .set(blue, { yPercent: 100 }, 1.3)
  }
  tl.to(out[2], { yPercent: -100, duration: 0.95, ease: 'power3.out' }, 1.3)
    .to(out[1], { yPercent: -100, duration: 0.95, ease: 'power3.out' }, 1.44)
    .to(out[0], { yPercent: -100, duration: 0.95, ease: 'power3.out' }, 1.58)
}
