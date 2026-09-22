import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import Icon from './Icon'
import { EASE } from '../motion/reveal'
import { reduceMotion } from '../motion/ambient'

// Alle Inhalte des Overlays sind nach dieser Zeit (in Sekunden) fertig aufgedeckt.
const REVEAL_END = 0.85

type Props = {
  title?: string
  kicker?: string
  onClose: () => void
  children: ReactNode
  actions?: ReactNode
  prev?: () => void
  next?: () => void
  height?: number
  media?: ReactNode
}

// Bottom-Sheet (noho-Detailpanel ins Hochformat übertragen): volle Breite, nicht volle Höhe, gleitet von unten.
// Früher gab es hier eine zweite Form (center) für eine mittige Karte. Die brauchte nur das Timeout-Overlay,
// und das baut sein Markup inzwischen selbst (Overlays.tsx) — der Zweig war tot und ist entfernt.
export default function Sheet({ title, kicker, onClose, children, actions, prev, next, height, media }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (reduceMotion) return
    gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    gsap.fromTo(ref.current, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: EASE })
  }, [])

  // Inhalt des Overlays: Bild, Kicker, Titel und Texte starten leicht versetzt, sind aber alle zum selben
  // Zeitpunkt fertig (REVEAL_END) — sonst stehen die Texte schon, während das Bild noch aufgeschoben wird.
  // Bedienelemente (Knöpfe, Regler, Aufklapper, Fußzeile) bleiben ruhig, damit nichts unter dem Finger wegläuft.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduceMotion) return
    const parts = Array.from(el.querySelectorAll<HTMLElement>('[data-oa]'))
    const wipes = Array.from(el.querySelectorAll<HTMLElement>('[data-ow]'))
    if (!parts.length && !wipes.length) return
    const tl = gsap.timeline({ delay: 0.1 })
    wipes.forEach((n, i) => {
      const at = Math.min(0.14, i * 0.06)
      tl.fromTo(n, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: REVEAL_END - at, ease: EASE, clearProps: 'clipPath' }, at)
    })
    parts.forEach((n, i) => {
      const at = Math.min(0.3, 0.06 + i * 0.07)
      tl.fromTo(n, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: REVEAL_END - at, ease: EASE, clearProps: 'transform' }, at)
    })
    return () => { tl.kill() }
    // Abhängigkeit bewusst nicht [children]: Das ist bei jedem Render ein neues Element-Objekt, und
    // `Overlays` rendert bei jedem Store-Dispatch neu. Der Reveal lief dadurch bei jeder Eingabe im Sheet
    // erneut los — beim Ziehen des Bogen-Reglers rund 60×/s, wobei die Texte jedes Mal auf opacity 0
    // zurückgesetzt wurden. Titel und Kicker ändern sich genau dann, wenn wirklich ein anderer Inhalt
    // im Sheet steht, und sind als Zeichenketten über Renders hinweg stabil.
  }, [title, kicker])

  const box = (
    <div ref={ref} className="sheet" style={{ height }}>
      <div className="head">
        <div className="nav">
          {(prev || next) && (
            <>
              <button className="sqbtn" onClick={prev} disabled={!prev} aria-label="zurück"><Icon name="arrowRight" style={{ transform: 'rotate(180deg)' }} /></button>
              <button className="sqbtn" onClick={next} disabled={!next} aria-label="weiter"><Icon name="arrowRight" /></button>
            </>
          )}
        </div>
        <button className="sqbtn" onClick={onClose} aria-label="Schließen"><Icon name="close" /></button>
      </div>
      {/* Mit Bild: Kopf zweispaltig, links Topline und Überschrift, rechts das 4:3-Bild — halbe/halbe mit 32 px dazwischen. */}
      {media ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'stretch', marginBottom: 64 }}>
          {/* Textspalte auf Höhe des Bildes, Inhalt an der Unterkante — Überschrift und Bildkante schließen bündig ab. */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {kicker && <div className="kicker" data-oa style={{ marginBottom: 12 }}>{kicker}</div>}
            {title && <h2 className="h2" data-oa>{title}</h2>}
          </div>
          {media}
        </div>
      ) : (
        <>
          {kicker && <div className="kicker" data-oa style={{ marginBottom: 12 }}>{kicker}</div>}
          {title && <h2 className="h2" data-oa style={{ marginBottom: 26 }}>{title}</h2>}
        </>
      )}
      <div className="content">{children}</div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  )

  return (
    <>
      <div ref={scrim} className="scrim" onClick={onClose} />
      {box}
    </>
  )
}
