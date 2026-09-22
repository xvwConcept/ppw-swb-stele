// Ambient-Steuerung: alle Hintergrundbewegungen (Skyline, Glow, Partikel, Schwarm) hängen an diesem Schalter.
// Regel: Bewegung zieht den Blick, Stillstand lässt lesen. Berührung friert ein, der Lock-Screen gibt wieder frei.
type Listener = (running: boolean) => void
let running = true
const listeners = new Set<Listener>()

export const ambient = {
  get running() { return running },
  set(v: boolean) {
    if (running === v) return
    running = v
    listeners.forEach((l) => l(v))
  },
  subscribe(l: Listener) {
    listeners.add(l)
    l(running)
    return () => { listeners.delete(l) }
  },
}

export const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
