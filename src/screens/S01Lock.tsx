import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import Pill from '../components/Pill'
import Chevron from '../components/Chevron'
import Icon from '../components/Icon'
import { ICONS } from '../icons'
import ArcSlider from '../components/ArcSlider'
import TouchHint from '../components/TouchHint'
import { LOCK_QUESTIONS, topicById, type LockQuestion } from '../data/content'
import { useStore, type TopicId } from '../store'
import { ambient, reduceMotion } from '../motion/ambient'
import { EASE, popIn } from '../motion/reveal'
import { sceneBus } from '../motion/sceneBus'
import { stageScale } from '../motion/scroll'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(Flip, CustomEase)
// S-Kurve für die Kartendrehung: deutliches Ease-in am Start und Ease-out am Ende, in der Mitte kurz langsamer
const FLIP_EASE = CustomEase.create('flip', 'M0,0 C0.46,0 0.42,0.45 0.5,0.5 C0.58,0.55 0.54,1 1,1')

// S01 Lock-Screen: Lichtpunkt-Szene über die ganze Fläche, darüber eine Reihe
// kleiner Fragekarten, die rechts aus dem Bild ragt und sich mit zwei Knöpfen
// schieben lässt, unten die Hauptfrage in einer Karte fester Höhe.
// Wechsel der Hauptfrage in drei Schritten: erst verschwindet der Text, dann
// wandern und wachsen die Flächen (FLIP), zuletzt erscheint der neue Text.
// Die Reihe liegt über der Hauptkarte, damit die wachsende Karte sie nie verdeckt.

const CARD_TOP = 850
const CARD_BOTTOM = 330
const GAP = 22
const ROW_BOTTOM = CARD_TOP - GAP   // Reihe sitzt im Kartenabstand über der Hauptkarte, beides wirkt als Einheit
const CARD_W = (952 - GAP) / 2       // zwei kleine Karten sind so breit wie die große
const CARD_H = 184
const STEP = CARD_W + GAP

// Der Tipp-Hinweis erscheint beim ersten Startscreen nach dem Laden und nach jedem Zurücksetzen
// (der Store zählt dabei `resets` hoch), nicht bei jeder Rückkehr über „Zurück".
let hintReset = -1

// Themen-Icon aus dem Designsystem ohne den umlaufenden Ring: der erste Pfad (der Ring) wird entfernt.
// Für die Wärmepumpe ein eigenes Außengerät-Icon (Gehäuse, Lüfter, Lamellen), da das DS-Icon eine Flamme zeigt.
function BareIcon({ name, size, color }: { name: string; size: number; color: string }) {
  const svg = (ICONS[name] ?? ICONS.info).replace(/<path[^>]*clip-rule="evenodd"\/>/, '').replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`)
  return <span aria-hidden="true" style={{ display: 'inline-flex', lineHeight: 0, color }} dangerouslySetInnerHTML={{ __html: svg }} />
}

// Reihenfolge der Fragen: Regler-Frage in der Hauptkarte, dann Lautstärke, dann Strombedarf,
// danach der Rest in zufälliger Reihenfolge (einmal je Laden gemischt).
const QUESTION_ORDER: LockQuestion[] = (() => {
  const fixed = ['kwh', 'laut', 'pv_anteil']
  const rest = LOCK_QUESTIONS.filter((q) => !fixed.includes(q.id))
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]] }
  return [...fixed.map((id) => LOCK_QUESTIONS.find((q) => q.id === id)!), ...rest]
})()

const more = (t: TopicId) => (t === 'strom' ? 'Mehr zu Strom & Tarif' : `Mehr zur ${topicById(t).label}`)


export default function S01Lock() {
  const { state, dispatch } = useStore()
  const [mainId, setMainId] = useState<string>(QUESTION_ORDER[0].id)
  // Die bisherige Hauptfrage kehrt beim Wechsel an ihren Platz in QUESTION_ORDER zurück.
  const [answer, setAnswer] = useState<string | number | undefined>()
  const [resolved, setResolved] = useState(false)
  const [slide, setSlide] = useState(0)
  const [hint, setHint] = useState(hintReset !== state.resets)
  const rootRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const prevId = useRef<string>(mainId)
  const switching = useRef(false)
  // Ziehen der Reihe mit Finger oder Maus; am Ende rastet sie auf die nächste Karte ein.
  const dragRow = useRef<{ x0: number; tx0: number; moved: boolean } | null>(null)
  const suppressTap = useRef(false)
  // Alles, was beim Verlassen des Screens abzuräumen ist. Der Vorhang läuft rund 2 s; wer in dieser
  // Zeit wegwechselt, ließ vorher GSAP weiter auf einem abgehängten Knoten animieren und `setResolved`
  // auf einer entfernten Komponente aufrufen.
  const junk = useRef<{ tweens: gsap.core.Tween[]; timers: number[] }>({ tweens: [], timers: [] })
  const track = <T extends gsap.core.Tween>(t: T) => { junk.current.tweens.push(t); return t }
  const later = (fn: () => void, ms: number) => { junk.current.timers.push(window.setTimeout(fn, ms)) }
  useEffect(() => () => {
    junk.current.tweens.forEach((t) => t.kill())
    junk.current.timers.forEach((t) => clearTimeout(t))
    junk.current = { tweens: [], timers: [] }
  }, [])
  const main = useMemo(() => LOCK_QUESTIONS.find((q) => q.id === mainId)!, [mainId])
  const others = QUESTION_ORDER.filter((q) => q.id !== mainId)
  const maxSlide = Math.max(0, others.length - 2)

  // Erstes Erscheinen: Reihe, Knöpfe und Hauptkarte sind eine Gruppe und kommen gemeinsam.
  // Keine Bewegung von unten, nur Aufblenden und ein leichtes Aufziehen aus der eigenen Mitte —
  // so bleiben die Kacheln beim Erscheinen an ihrem Platz. Deckkraft und Skalierung laufen getrennt:
  // Das Aufziehen ist nach 1,0 s fertig, die Deckkraft braucht mit 1,8 s fast doppelt so lang und läuft
  // flach aus, damit die Kacheln weich stehen bleiben statt hart anzuspringen.
  useLayoutEffect(() => {
    if (reduceMotion || !rootRef.current) return
    const group = rootRef.current.querySelectorAll('[data-group]')
    const tl = gsap.timeline()
    tl.fromTo(group, { scale: 0.94, transformOrigin: '50% 50%' }, { scale: 1, duration: 1, ease: EASE, clearProps: 'transform' }, 0)
      .fromTo(group, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power1.out', clearProps: 'opacity' }, 0)
    return () => { tl.revert() }
  }, [])

  // Reihe schieben
  useEffect(() => {
    if (!trackRef.current) return
    track(gsap.to(trackRef.current, { x: -slide * STEP, duration: reduceMotion ? 0 : 0.6, ease: EASE, overwrite: true }))
  }, [slide])

  // Wechsel der Hauptfrage: Die Flächen wandern per FLIP (die angetippte kleine
  // Karte wächst an die Kartenzone, die bisherige Hauptfrage schrumpft in die
  // Reihe, die übrigen rücken nach). Der Text der neuen Hauptfrage erscheint
  // erst, wenn die Fläche fast angekommen ist, der Text der geschrumpften Karte
  // ebenso. Dadurch steht nie großer Text in einer kleinen Fläche.
  useLayoutEffect(() => {
    const st = flipState.current
    if (!st) return
    flipState.current = null
    if (reduceMotion || !rootRef.current || !mainRef.current) return
    const parts = mainRef.current.querySelectorAll<HTMLElement>('[data-m]')
    const back = rootRef.current.querySelectorAll<HTMLElement>(`.swarm[data-flip-id="${prevId.current}"] > span`)
    gsap.set(parts, { opacity: 0, y: 14 })
    gsap.set(back, { opacity: 0 })
    const tl = gsap.timeline()
    tl.add(Flip.from(st, { duration: 0.75, ease: EASE, absolute: true, nested: true, targets: '[data-flip-id]' }), 0)
      .to(parts, { opacity: 1, y: 0, duration: 0.45, ease: EASE, stagger: 0.05, clearProps: 'opacity,transform' }, 0.34)
      .to(back, { opacity: 1, duration: 0.35, ease: 'power1.out', clearProps: 'opacity' }, 0.46)
    return () => { tl.kill() }
  }, [mainId])

  // Karte dreht sich, wenn die Auflösung erscheint oder wieder verschwindet: eine durchgehende
  // Drehung von 0 auf 180 Grad mit einer eigenen S-Kurve, die auf der Kante deutlich langsamer wird,
  // ohne stehen zu bleiben (dort wird der Inhalt getauscht), und an beiden Enden weich ausläuft.
  // Flache Perspektive, damit die Karte beim Drehen kaum kleiner wirkt; eigene Compositor-Ebene per CSS.
  const turn = (fn: () => void) => {
    const el = mainRef.current
    if (!el || reduceMotion) { fn(); return }
    const o = { r: 0 }
    let swapped = false
    track(gsap.to(o, { r: 180, duration: 1.26, ease: FLIP_EASE,
      onUpdate: () => {
        if (!swapped && o.r >= 90) { swapped = true; fn() }
        // Direkt in den Stil statt gsap.set je Bild: gsap.set durchläuft bei jedem Aufruf die volle
        // Auflösung der Eigenschaften, hier reicht die fertige Zeichenkette.
        const r = o.r < 90 ? o.r : o.r - 180
        el.style.transform = `perspective(3200px) rotateY(${r.toFixed(2)}deg) translateZ(0)`
      },
      onComplete: () => { el.style.transform = '' } }))
  }

  useEffect(() => { ambient.set(true) }, [mainId])
  // Hintergrundszene reist zum Thema der aktuellen Frage
  useEffect(() => { sceneBus.set(main.topic) }, [main.topic])
  useEffect(() => () => sceneBus.set(null), [])

  useEffect(() => {
    if (!resolved) return
    const t = setTimeout(() => turn(() => { setResolved(false); setAnswer(undefined); ambient.set(true) }), 40000)
    return () => clearTimeout(t)
  }, [resolved])

  const choose = (v: string | number) => {
    // Der Bogen-Regler meldet bei jeder Zeigerbewegung; ohne diese Prüfung löste jede davon einen
    // Store-Dispatch und damit einen Render des ganzen Baums aus, auch wenn der gerundete Wert gleich blieb.
    if (v === answer) return
    setAnswer(v)
    dispatch({ type: 'session', patch: { lockQuestion: main.id, lockAnswer: String(v) } })
    if (main.form.kind !== 'arc') later(() => turn(() => setResolved(true)), 220)
  }

  // Schritt eins des Wechsels: Text der Hauptkarte und der angetippten Karte
  // verschwinden, erst danach wird umgebaut.
  const pick = (q: LockQuestion, el?: HTMLElement | null) => {
    if (q.id === mainId || switching.current) return
    const go = () => {
      switching.current = false
      flipState.current = Flip.getState('[data-flip-id]')
      prevId.current = mainId
      setResolved(false); setAnswer(undefined); setMainId(q.id); ambient.set(true)
    }
    if (reduceMotion) { go(); return }
    switching.current = true
    const parts = Array.from(mainRef.current?.querySelectorAll<HTMLElement>('[data-m]') ?? [])
    const tapped = Array.from(el?.querySelectorAll<HTMLElement>(':scope > span') ?? [])
    track(gsap.to([...parts, ...tapped], { opacity: 0, y: -8, duration: 0.18, ease: 'power1.in', onComplete: go }))
  }
  const snapRow = () => { if (trackRef.current) gsap.to(trackRef.current, { x: -slide * STEP, duration: 0.5, ease: EASE, overwrite: true }) }
  const onRowDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // laufendes Gleiten anhalten, sonst überschreibt es die Zugbewegung bei jedem Tick
    gsap.killTweensOf(trackRef.current)
    dragRow.current = { x0: e.clientX, tx0: Number(gsap.getProperty(trackRef.current!, 'x')) || 0, moved: false }
  }
  const onRowMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRow.current
    if (!d || !trackRef.current) return
    const dx = (e.clientX - d.x0) / stageScale()
    if (!d.moved && Math.abs(dx) < 8) return
    // Erst ab hier wird gezogen und der Zeiger gefangen. Beim reinen Tippen bleibt er frei,
    // sonst käme der Klick nie bei der Karte an.
    if (!d.moved) { try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* kein aktiver Zeiger */ } }
    d.moved = true
    gsap.set(trackRef.current, { x: d.tx0 + dx })
  }
  const onRowUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRow.current
    dragRow.current = null
    if (!d || !d.moved || !trackRef.current) return
    suppressTap.current = true
    setTimeout(() => { suppressTap.current = false }, 60)
    const dx = (e.clientX - d.x0) / stageScale()
    const next = Math.max(0, Math.min(maxSlide, Math.round(-(d.tx0 + dx) / STEP)))
    if (next === slide) snapRow()
    else setSlide(next)
  }
  const goTopic = (t: TopicId) => dispatch(t === 'waermepumpe' ? { type: 'go', screen: 's02', topic: t } : { type: 'go', screen: 'topic', topic: t })
  const mismatch = answer !== undefined && String(answer) !== String(main.truth)
  const qSize = main.form.kind === 'arc' || main.q.length > 44 ? 42 : 48

  return (
    <div className="screen" ref={rootRef} onPointerDownCapture={() => { hintReset = state.resets; setHint(false) }}>
      {/* Schieben der Reihe */}
      <div data-group style={{ position: 'absolute', right: 64, top: ROW_BOTTOM - CARD_H - GAP - 84, display: 'flex', gap: GAP, zIndex: 3 }}>
        <button className="slbtn" aria-label="Vorherige Fragen" disabled={slide === 0} onClick={() => setSlide((s) => Math.max(0, s - 1))}><Chevron dir={-1} /></button>
        <button className="slbtn" aria-label="Weitere Fragen" disabled={slide >= maxSlide} onClick={() => setSlide((s) => Math.min(maxSlide, s + 1))}><Chevron dir={1} /></button>
      </div>

      {/* Reihe kleiner Fragekarten, unten bündig, ragt rechts aus dem Bild */}
      <div data-group style={{ position: 'absolute', left: 64, right: 0, top: 0, height: ROW_BOTTOM, zIndex: 2, pointerEvents: 'none' }}>
        {/* feste Höhe: Während des FLIP sind die Karten absolut positioniert, die Leiste darf dabei nicht zusammenfallen */}
        <div ref={trackRef} style={{ position: 'absolute', left: 0, bottom: 0, height: CARD_H, display: 'flex', alignItems: 'flex-end', gap: GAP, pointerEvents: 'auto', touchAction: 'none' }}
          onPointerDown={onRowDown} onPointerMove={onRowMove} onPointerUp={onRowUp} onPointerCancel={() => { dragRow.current = null; snapRow() }}>
          {others.map((q) => (
            <button key={q.id} className="swarm" data-flip-id={q.id} onClick={(e) => { if (!suppressTap.current) pick(q, e.currentTarget) }}>
              <span className="k">{topicById(q.topic).label}</span>
              <span className="q">{q.q}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Weiche Unschärfe am rechten Bildrand: ab 90 % der Breite nimmt sie nach rechts zu, nur in Höhe der Reihe */}
      <div style={{ position: 'absolute', left: '90%', right: -40, top: ROW_BOTTOM - CARD_H - 40, height: CARD_H + 80, zIndex: 3, pointerEvents: 'none', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', maskImage: 'linear-gradient(to right, transparent, #000)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000)' }} />

      {/* Tipp-Hinweis in der Bildschirmmitte (der Screen beginnt 132 px unter der Oberkante), verschwindet mit der ersten Berührung */}
      <div className={`lockhint ${hint ? '' : 'off'}`} style={{ position: 'absolute', left: '50%', top: 960 - 132, transform: 'translate(-50%, -50%) scale(1.35)', zIndex: 6, pointerEvents: 'none' }}>
        <TouchHint dir="tap" />
      </div>

      {/* Hauptfrage in einer Karte fester Höhe */}
      <div ref={mainRef} data-group data-flip-id={main.id} className="card" style={{ position: 'absolute', left: 64, right: 64, top: CARD_TOP, bottom: CARD_BOTTOM, zIndex: 1, padding: '38px 48px 44px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="kicker" data-m style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 34, height: 3, background: 'var(--accent-a)', display: 'inline-block' }} />{main.kicker}
        </div>
        {!resolved ? (
          <>
            <h1 className="display" data-m style={{ fontSize: qSize, marginTop: 18, maxWidth: 900 }}>{main.q}</h1>
            {/* Regler links, Aktion unten rechts: dort sitzt im Kartensystem die Hauptaktion */}
            {main.form.kind === 'arc' ? (
              <div data-m style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 30, alignItems: 'end', marginTop: 'auto', paddingTop: 20 }}>
                <ArcSlider min={main.form.min} max={main.form.max} unit={main.form.unit} label={main.form.label} value={(answer as number | undefined) ?? main.form.min} pulse={answer === undefined} onChange={choose} size={420} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 6 }}>
                  <Pill label="Aufdecken" variant="accent" size="l" icon="reload" onClick={() => answer !== undefined && turn(() => setResolved(true))} disabled={answer === undefined} />
                </div>
              </div>
            ) : (
              <div data-m className={`answers ${main.form.kind === 'yesno' || main.form.options.length === 2 ? 'two' : 'four'} ${main.form.kind === 'tiles' && main.form.big ? 'big' : ''}`} style={{ marginTop: 'auto', paddingTop: 44 }}>
                {(main.form.kind === 'yesno' ? ['Ja', 'Nein'] : main.form.options).map((o) => {
                  const meta = main.form.kind === 'tiles' && main.form.big ? main.form.meta?.[o] : undefined
                  return (
                    <button key={o} className={meta ? 'ans bigtile' : 'ans'} aria-pressed={answer === o} onClick={(e) => { popIn(e.currentTarget); choose(o) }}>
                      {meta && <Icon name={meta.icon} size={48} className="ic48" style={{ display: 'flex' }} />}
                      <span className="t">{o}</span>
                      {meta && <span className="s">{meta.sub}</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Wasserzeichen: Themen-Icon groß, dunkles CI-Blau, unten rechts angeschnitten */}
            <div data-m style={{ position: 'absolute', right: 32, bottom: -48, opacity: .55, pointerEvents: 'none' }}><BareIcon name={main.topic === 'waermepumpe' ? 'x_heatpump' : topicById(main.topic).icon} size={440} color='var(--brand-900)' /></div>
            {mismatch && <div className="body" data-m style={{ marginTop: 22, fontSize: 26, color: 'var(--fg3)' }}>Viele denken das.</div>}
            <h2 className="display" data-m style={{ fontSize: 68, marginTop: mismatch ? 6 : 22, color: 'var(--accent-a)', maxWidth: 760, position: 'relative' }}>{main.fact}</h2>
            <p className="body" data-m style={{ marginTop: 16, fontSize: 30, lineHeight: 1.4, maxWidth: 640, position: 'relative' }}>{main.meaning}</p>
            <div data-m style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 40, position: 'relative' }}>
              <Pill label={more(main.topic)} variant="accent" size="l" onClick={() => goTopic(main.topic)} />
              <Pill label="Nächste Frage" variant="outline" size="l" icon="arrowRight" onClick={() => pick(others[Math.min(slide, others.length - 1)])} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
