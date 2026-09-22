import type { TopicId } from '../store'

// Verbindung zwischen Oberfläche und Hintergrundszene: Der Startscreen meldet das Thema der
// aktuellen Frage, die Szene reist dorthin (Haus, Windpark, Stadt) und baut die passende Form auf.
type Listener = (topic: TopicId | null) => void
let current: TopicId | null = null
const listeners = new Set<Listener>()

export const sceneBus = {
  get topic() { return current },
  set(topic: TopicId | null) {
    if (current === topic) return
    current = topic
    listeners.forEach((l) => l(topic))
  },
  subscribe(l: Listener) {
    listeners.add(l)
    l(current)
    return () => { listeners.delete(l) }
  },
}
