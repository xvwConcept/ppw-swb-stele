import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { reduceMotion } from './ambient'

gsap.registerPlugin(CustomEase)
// Haus-Ease „stele": lange ruhige Kurve (nach noho.ink), „snap" für Auswahl-Feedback.
export const EASE = CustomEase.create('stele', 'M0,0 C0.25,0.1 0.1,1 1,1')
export const SNAP = 'power2.out'

// Gestaffelter Reveal aller [data-reveal]-Kinder beim Mount: Kicker → Headline → Karten → Rest.
// Touchziele bleiben ab dem ersten Frame antippbar (nur opacity/transform).
export function useReveal(ref: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!items.length) return
    if (reduceMotion) { gsap.set(items, { opacity: 1, y: 0 }); return }
    const tl = gsap.timeline()
    tl.fromTo(items, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.06, overwrite: true, clearProps: 'transform' })
    return () => { tl.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function popIn(el: HTMLElement | null) {
  if (!el || reduceMotion) return
  gsap.fromTo(el, { scale: 0.96, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.25, ease: SNAP, clearProps: 'transform' })
}
