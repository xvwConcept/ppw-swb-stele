import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'
import Icon from '../components/Icon'
import Pill from '../components/Pill'
import TouchHint from '../components/TouchHint'
import Chevron from '../components/Chevron'
import { S02, SYSTEM } from '../data/content'
import { useStore } from '../store'
import { EASE } from '../motion/reveal'
import { reduceMotion } from '../motion/ambient'
import { stageScale } from '../motion/scroll'
import heroImg from '../assets/photos/wp-faq-junge.jpg'
import bandImg from '../assets/photos/wp-handshake.jpg'
import altbauImg from '../assets/photos/wp-altbau.jpg'
import faqImg from '../assets/photos/wp-gruendach.jpg'
import footImg from '../assets/photos/swb-eingang.jpg'
import logo from '../assets/icons-swb/logo-swb.svg'

// Wörter einzeln maskiert, damit Überschriften zeilenweise hochlaufen (SplitText-Prinzip wie bei noho)
function Split({ text, color }: { text: string; color?: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i}><span className="wmask"><span className="w" style={{ color }}>{w}</span></span>{' '}</span>
      ))}
    </>
  )
}

// S02 Wärmepumpe als gestapelte Kapitel: Jedes Kapitel ist eine Bildschirmhöhe, bleibt beim Scrollen stehen (sticky)
// und das nächste schiebt sich darüber. So bleibt eine Informationsgruppe mit ihrem Bild zusammen im Blick, bis die
// nächste kommt. Bilder laufen bis zum Rand. Ein Tipp auf „Öffnen" vertieft das Kapitel im Overlay.

const RAIL_CARD = 640, RAIL_GAP = 20

export default function S02Waermepumpe() {
  const { state, dispatch } = useStore()
  const { session } = state
  const scroller = useRef<HTMLDivElement>(null)
  const railWrap = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const bandImgRef = useRef<HTMLImageElement>(null)
  const faqShell = useRef<HTMLDivElement>(null)
  const bandBox = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [focus, setFocus] = useState(0)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tRef = useRef(0)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const modules = S02.sections.filter((x) => x.kind !== 'cta' && x.kind !== 'faq')
  const RAIL_STEP = 720 // vertikale Scrollstrecke je Karte
  const RAIL_LEAD = 520 // Vorlauf: die erste Karte bleibt stehen, bevor die zweite kommt
  const BAND_START = 250, BAND_RANGE = 1000 // Scrollweg, über den sich das Handschlag-Bild öffnet
  // Hero: Der Text setzt kurz nach dem Wechsel an; Text und Bildzoom sind gleichzeitig fertig (HERO_END).
  // Die Zahlen zählen danach noch HERO_COUNT weiter — sie stehen also schon an ihrem Platz und laufen dort hoch.
  const HERO_START = 0.45, HERO_END = 2.4, HERO_COUNT = 2.2   // HERO_COUNT: Dauer des Hochzählens, beginnt mit dem Text
  const COUNT_STEP = 0.6   // Versatz, mit dem die drei Zahlen nacheinander ihren Endwert erreichen
  const HERO_STEP = 0.3   // Versatz von Stufe zu Stufe beim Erreichen der Endlage
  // Startversatz nach rechts: im Hero deutlich größer als in den übrigen Abschnitten, damit der Einlauf trägt
  const HERO_XW = 130, HERO_XI = 170, SEC_XW = 46, SEC_XI = 70
  // Das FAQ-Bild klappt beim Hereinscrollen aus dem Nichts auf seine volle Höhe auf (16:9 auf voller Bühnenbreite).
  const FAQ_H = Math.round(1080 * 9 / 16)
  // Überstand oben und unten in Pixeln — er gibt dem Parallax sein Spiel. In Prozent gerechnet wäre er
  // schief: Prozenthöhen beziehen sich auf die Höhe des Kastens, Prozentränder dagegen auf seine Breite.
  const FAQ_OVER = 60
  // Beim Quadrat der Kombination bewusst knapp: Jeder Pixel Überstand zieht den Ausschnitt weiter zu,
  // ohne Überstand stünde das Bild aber ganz still. 28 px geben einen ruhigen Versatz von 56 px.
  const KOMBI_OVER = 28
  // Versatz im Stapel: am Ende des Scrolls steht die oberste Karte rechts bündig mit dem Pfeil-Button (1016 px)
  const RAIL_OFFSET = (1016 - 64 - RAIL_CARD) / Math.max(1, modules.length - 1)
  const railDistance = RAIL_LEAD + (modules.length - 1) * RAIL_STEP
  // Kartenpositionen folgen dem Scroll kontinuierlich (kein Springen): bis zum Fokus liegen sie mit 30 px Versatz
  // übereinander, die folgenden stehen rechts daneben. Innerhalb eines Schritts leicht geglättet (smoothstep).
  // Ganze Pixel und gleiche Werte werden übersprungen: Bruchteile zwingen den Browser, die Karte samt
  // Schatten neu zu rastern, und ein erneut gesetzter gleicher Stil kostet umsonst Arbeit.
  const lastCard = useRef<string[]>([])
  const place = (t: number) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const x = Math.round(Math.min(i, t) * RAIL_OFFSET + Math.max(i - t, 0) * (RAIL_CARD + RAIL_GAP))
      const o = (1 - 0.08 * Math.min(Math.max(t - i, 0), 1)).toFixed(2)
      const key = x + '/' + o
      if (lastCard.current[i] === key) return
      lastCard.current[i] = key
      el.style.transform = `translate3d(${x}px,0,0)`
      el.style.opacity = o
    })
  }
  useLayoutEffect(() => { place(tRef.current) })
  const anschluss = session.lockQuestion === 'kwh' ? S02.anschluss.kwh : session.lockQuestion === 'frost' ? S02.anschluss.frost : session.lockQuestion === 'laut' ? S02.anschluss.laut : S02.anschluss.default

  useEffect(() => {
    const root = scroller.current!
    const lenis = new Lenis({ wrapper: root, content: root.firstElementChild as HTMLElement, lerp: 0.035, wheelMultiplier: 1.75, syncTouch: true, syncTouchLerp: 0.04, touchMultiplier: 1.9 })
    lenisRef.current = lenis
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // Alle Tweens dieser Seite sammeln und beim Verlassen abräumen (sonst laufen sie auf entfernten Knoten weiter)
    const tweens: gsap.core.Animation[] = []
    // Der Vorhang (motion/curtain.ts) enthüllt die Seite nach dem Wechsel; dahinter zoomt das Hero-Bild
    // sanft heraus, die Headline wartet, bis die letzte Fläche weg ist.
    // Zoom auf dem Bild selbst: der Kasten beschneidet, nichts ragt über den Verlauf hinaus
    const heroPhoto = root.querySelector<HTMLElement>('.hero-photo img')
    if (heroPhoto && !reduceMotion) tweens.push(gsap.fromTo(heroPhoto, { scale: 1.14, transformOrigin: '50% 30%' }, { scale: 1, duration: HERO_END, ease: EASE, clearProps: 'transform' }))
    const observers: IntersectionObserver[] = []
    const parallax: { sec: HTMLElement; img: HTMLElement }[] = []
    // Scrollrichtung: animiert wird nur, wenn ein Abschnitt beim Abwärtsscrollen hereinkommt.
    // Kommt er von oben ins Bild (man scrollt zurück nach oben), steht er sofort fertig da.
    let lastY = root.scrollTop, scrollDir = 1
    root.querySelectorAll<HTMLElement>('[data-sec]').forEach((sec) => {
      const words = sec.querySelectorAll<HTMLElement>('.w')
      const all = Array.from(sec.querySelectorAll<HTMLElement>('[data-sr]'))
      const items = all.filter((el) => !el.hasAttribute('data-fade'))
      const fades = all.filter((el) => el.hasAttribute('data-fade'))
      const wipes = Array.from(sec.querySelectorAll<HTMLElement>('[data-wipe]'))
      const isHero = sec.classList.contains('hero')
      const xw = isHero ? HERO_XW : SEC_XW, xi = isHero ? HERO_XI : SEC_XI
      const arm = () => {
        gsap.set(words, { x: xw, opacity: 0 }); gsap.set(items, { opacity: 0, x: xi }); gsap.set(fades, { opacity: 0 })
        gsap.set(wipes, { clipPath: 'inset(0 100% 0 0)' })
      }
      if (!reduceMotion) arm()
      // Der Abschnitt spielt jedes Mal, wenn er ins Bild kommt; verlässt er es ganz, wird er zurückgesetzt.
      let playing = false, first = true
      const reset = arm
      // sofort fertig, ohne Bewegung
      const show = () => {
        gsap.set(words, { x: 0, opacity: 1, clearProps: 'transform' })
        gsap.set(items, { opacity: 1, x: 0, clearProps: 'transform' })
        gsap.set(fades, { opacity: 1 })
        gsap.set(wipes, { clipPath: 'inset(0 0% 0 0)' })
        sec.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => { el.textContent = String(el.dataset.count) })
        first = false
      }
      const play = () => {
        const heroFirst = first && isHero
        first = false
        if (heroFirst) {
          // Beim ersten Aufbau setzen die Zeilen kurz nach dem Wechsel an und sind — wie der Bildzoom —
          // alle zum selben Zeitpunkt fertig: die Dauer wird je Element aus dem Endpunkt zurückgerechnet.
          // Alle Stufen starten gemeinsam — wenn man sie sieht, läuft ihre Bewegung also schon — aber sie
          // erreichen ihre Endlage nacheinander, je HERO_STEP versetzt. Die Reihenfolge steht im Markup
          // (data-hstep), nicht in der Lage auf dem Schirm: 0 = Tag und Überschrift zusammen, 1 = Unterzeile,
          // danach die drei Zahlen einzeln. Die letzte Stufe endet bei HERO_END, gemeinsam mit dem Bildzoom.
          // Bewegung und Deckkraft laufen getrennt: der Weg nach links mit einem harten Ausklang (expo),
          // die Deckkraft flach (power1), damit sie das Erscheinen trägt.
          const steps: HTMLElement[][] = []
          const put = (i: number, el: HTMLElement) => { (steps[i] ||= []).push(el) }
          Array.from(words).forEach((el) => put(0, el))
          Array.from(items).forEach((el) => put(Number(el.dataset.hstep ?? 0), el))
          const dense = steps.filter(Boolean)
          const tl = gsap.timeline({ delay: HERO_START })
          dense.forEach((els, i) => {
            const dur = Math.max(0.5, HERO_END - HERO_STEP * (dense.length - 1 - i) - HERO_START)
            els.forEach((el) => {
              tl.to(el, { x: 0, duration: dur, ease: 'expo.out', clearProps: 'transform' }, 0)
              tl.to(el, { opacity: 1, duration: dur, ease: 'power1.out' }, 0)
            })
          })
          tweens.push(tl)
        } else {
          // Bewegung und Deckkraft laufen getrennt, und die Bewegung geht voraus: Die Zeilen sind schon
          // unterwegs an ihren Platz, bevor sie überhaupt sichtbar werden. Die Deckkraft läuft deutlich
          // länger (1,8 s) und flach aus, dadurch trägt sie das Erscheinen. Die Akkordeon-Zeilen kommen
          // zuletzt und deutlich nacheinander, reine Deckkraft ohne Bewegung.
          tweens.push(gsap.timeline()
            .to(words, { x: 0, duration: 1.1, ease: EASE, stagger: 0.06, clearProps: 'transform' }, 0)
            .to(words, { opacity: 1, duration: 1.8, ease: 'power1.out', stagger: 0.06 }, 0.22)
            .to(items, { x: 0, duration: 1.1, ease: EASE, stagger: 0.12, clearProps: 'transform' }, 0.25)
            .to(items, { opacity: 1, duration: 1.8, ease: 'power1.out', stagger: 0.12 }, 0.5)
            .to(fades, { opacity: 1, duration: 1.1, ease: 'power1.out', stagger: 0.16 }, 0.75)
            .to(wipes, { clipPath: 'inset(0 0% 0 0)', duration: 1.25, ease: EASE, stagger: 0.12 }, 0))
        }
        sec.querySelectorAll<HTMLElement>('[data-count]').forEach((el, i) => {
          const target = Number(el.dataset.count); const o = { v: 0 }
          // Im Hero laufen alle drei Zahlen gleich mit dem Text los (HERO_START), erreichen ihren Endwert aber
          // um COUNT_STEP versetzt — von links nach rechts. Sie werden zum Schluss deutlich langsamer (power3.out),
          // statt gleichmäßig durchzulaufen. In allen anderen Abschnitten zählen sie unverändert über 1,4 s.
          const dur = heroFirst ? HERO_COUNT + i * COUNT_STEP : 1.4
          tweens.push(gsap.to(o, { v: target, duration: dur, delay: heroFirst ? HERO_START : 0, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(o.v)) } }))
        })
      }
      const h = Math.max(1, sec.offsetHeight)
      // Ausgelöst wird in Pixeln gedacht, nicht in Prozent: Bei sehr hohen Abschnitten löst ein fester
      // Prozentsatz viel zu spät aus, deshalb rund 1000 px Sichtbarkeit. Die FAQ-Sektion beginnt mit einem
      // hohen Bild — dort lief die Einblendung los, während erst dessen Oberkante hereinragte. Sie braucht
      // mehr Vorlauf; der Wert bleibt an die Sichthöhe gebunden, damit er überhaupt erreichbar ist.
      const isFaq = !!faqShell.current && sec.contains(faqShell.current)
      const enter = isFaq ? Math.min(0.45, (root.clientHeight / h) * 0.8) : Math.min(0.22, 1000 / h)
      const io = new IntersectionObserver((entries) => {
        if (reduceMotion) return
        const e = entries[entries.length - 1]
        // Nach unten: erst animieren, wenn genug vom Abschnitt zu sehen ist. Nach oben: sofort fertig setzen,
        // sobald er überhaupt hereinragt — sonst stünde der obere Teil (etwa die Karten) noch unsichtbar da,
        // während der untere (die Punkte) schon sichtbar ist.
        if (!playing && e.intersectionRatio > 0 && scrollDir < 0) { playing = true; show() }
        else if (!playing && e.intersectionRatio >= enter && scrollDir > 0) { playing = true; play() }
        else if (playing && e.intersectionRatio === 0) { playing = false; reset() }
      // Bei sehr hohen Abschnitten (die feste Kartensektion) würde ein fester Anteil erst spät auslösen;
      // deshalb je nach Höhe umgerechnet, damit rund 1000 px sichtbar reichen.
      }, { root, threshold: [0, enter] })
      io.observe(sec)
      observers.push(io)
      // Parallax auf Bildern (auch FAQ), Fortschritt aus der Lage des Abschnitts im Scroller
      // Das Handschlag-Bild ist ausgenommen: Es bekommt keinen Parallax, sondern weiter unten einen sehr
      // langsamen Zoom. Sonst liefe beides übereinander und das Bild würde im Kasten wandern.
      sec.querySelectorAll<HTMLElement>('.photo:not(.hero-photo) img').forEach((img) => { if (!reduceMotion && img !== bandImgRef.current) parallax.push({ sec, img }) })
    })
    // ---- Scrollgebundene Effekte ---------------------------------------------------------------
    // Alles, was am Scroll hängt, läuft in EINEM Listener und in zwei getrennten Phasen: erst rechnen,
    // dann schreiben. Vorher taten das vier eigene Listener, die abwechselnd Layout lasen
    // (getBoundingClientRect) und Stile schrieben — der Browser musste dadurch mehrfach je Bild neu
    // umbrechen. Genau das war das Nachrucken beim Scrollen.
    //
    // Zwei Regeln halten den Listener billig:
    //   1. Maße werden einmal genommen (measure) und danach nur noch mit scrollTop verrechnet. Gerechnet
    //      wird in Layout-Pixeln (offsetHeight, clientHeight, scrollTop); die sind von der Skalierung der
    //      Bühne unberührt, deshalb ist hier kein stageScale nötig.
    //   2. Jeder Wert wird gerundet und nur geschrieben, wenn er sich geändert hat. Ohne das schreibt
    //      jeder Frame dieselben Stile neu und der Compositor arbeitet umsonst.
    const content = root.firstElementChild as HTMLElement
    type Box = { top: number; height: number }
    const boxOf = new Map<HTMLElement, Box>()
    const track = (el: HTMLElement | null) => { if (el) boxOf.set(el, { top: 0, height: 0 }) }
    const measure = () => {
      const scale = stageScale()
      const rootTop = root.getBoundingClientRect().top
      const y = root.scrollTop
      for (const el of boxOf.keys()) {
        boxOf.set(el, { top: (el.getBoundingClientRect().top - rootTop) / scale + y, height: el.offsetHeight })
      }
    }
    // Parallax nur so weit, wie das Bild über seinen Kasten hinausragt. Bei Bildern, die den Kasten genau
    // füllen, käme sonst an Ober- oder Unterkante der Seitenhintergrund zum Vorschein — das war beim Scrollen
    // als heller Streifen zu sehen. Ohne Überstand steht das Bild still.
    const parallaxAmp = new Map<HTMLElement, number>()
    {
      const scale = stageScale()
      for (const { img } of parallax) {
        const box = img.parentElement as HTMLElement
        const r = img.getBoundingClientRect(), br = box.getBoundingClientRect()
        const slack = Math.min(br.top - r.top, r.bottom - br.bottom) / scale
        parallaxAmp.set(img, Math.max(0, Math.min(84, Math.round(slack))))
      }
    }
    const fadeSecs = Array.from(root.querySelectorAll<HTMLElement>('section.sec'))
    const page = root.querySelector<HTMLElement>('.page')
    for (const { sec } of parallax) track(sec)
    fadeSecs.forEach(track)
    track(railWrap.current); track(page); track(faqShell.current)
    measure()
    // Der Aufklapper ändert die Höhe der Seite; danach stimmen die gespeicherten Maße nicht mehr.
    const ro = new ResizeObserver(() => measure())
    ro.observe(content)

    // Fortschritt eines Kastens im Sichtfeld: 0 = Oberkante kommt unten herein, 1 = Unterkante ist oben raus.
    // Gleiche Rechnung wie progressIn, nur aus zwischengespeicherten Maßen statt aus frischen Rechtecken.
    const prog = (el: HTMLElement | null, y: number, viewH: number) => {
      const b = el && boxOf.get(el)
      if (!b) return 0
      return Math.max(0, Math.min(1, (y + viewH - b.top) / (b.height + viewH)))
    }
    const smooth = (t: number) => t * t * (3 - 2 * t)

    // Letzte geschriebene Werte, damit gleiche Stile nicht erneut gesetzt werden
    const lastTf = new Map<HTMLElement, string>()
    const lastOp = new Map<HTMLElement, string>()
    const setTf = (el: HTMLElement, v: string) => { if (lastTf.get(el) !== v) { lastTf.set(el, v); el.style.transform = v } }
    const setOp = (el: HTMLElement, v: string) => { if (lastOp.get(el) !== v) { lastOp.set(el, v); el.style.opacity = v } }
    let lastHide = -1, lastFold = -1, lastBand = -1, hintShown = true, footShown = false

    const hint = hintRef.current
    const footParts = curtainRef.current?.querySelectorAll<HTMLElement>('[data-foot]')
    if (footParts?.length && !reduceMotion) gsap.set(footParts, { opacity: 0, y: -54 })

    const onScroll = () => {
      const y = root.scrollTop
      const viewH = root.clientHeight
      if (y !== lastY) { scrollDir = y > lastY ? 1 : -1; lastY = y }

      // --- Rail: aktive Karte und Kartenpositionen (kein Layout-Zugriff) ---
      const wrap = railWrap.current
      if (wrap) {
        const raw = Math.max(0, Math.min(modules.length - 1, (y - (boxOf.get(wrap)?.top ?? 0) - RAIL_LEAD) / RAIL_STEP))
        tRef.current = raw
        place(raw)
        const k = Math.round(raw)
        setFocus((cur) => (cur === k ? cur : k))
      }

      if (!reduceMotion) {
        // --- Parallax auf den Bildern ---
        for (const { sec, img } of parallax) {
          const amp = parallaxAmp.get(img) ?? 0
          if (!amp) continue
          const v = Math.round(-amp + prog(sec, y, viewH) * 2 * amp)
          setTf(img, `translate3d(0,${v}px,0)`)
        }
        // --- Textsektionen treten hervor und wieder zurück ---
        for (const sec of fadeSecs) {
          const p = prog(sec, y, viewH)
          const o = p < .3 ? .35 + .65 * (p / .3) : p > .72 ? Math.max(.4, 1 - (p - .72) / .38 * .6) : 1
          setOp(sec, o.toFixed(2))
        }
        // --- Handschlag: Aufdecken von links nach rechts, dazu sehr langsamer Zoom auf 105 % ---
        if (bandBox.current) {
          const hide = Math.round((1 - smooth(Math.max(0, Math.min(1, (y - BAND_START) / BAND_RANGE)))) * 200) / 2
          if (hide !== lastHide) {
            lastHide = hide
            bandBox.current.style.clipPath = hide <= 0 ? 'none' : `inset(0 ${hide}% 0 0)`
          }
        }
        if (bandImgRef.current && wrap) {
          const s = Math.round((1 + prog(wrap, y, viewH) * 0.05) * 1000) / 1000
          if (s !== lastBand) { lastBand = s; setTf(bandImgRef.current, `scale(${s})`) }
        }
        // --- FAQ-Bild klappt von oben auf ---
        // Geklappt wird mit clip-path auf einer Hülle fester Höhe, nicht mit der Höhe des Kastens selbst:
        // eine Höhenänderung bricht bei jedem Bild alles darunter neu um, clip-path kostet den Compositor nichts.
        if (faqShell.current) {
          // Aufgeklappt wird, während die Oberkante des Kastens von 78 % auf 30 % der Sichthöhe wandert.
          // Dazu blendet der Kasten auf: Die Deckkraft ist schon nach 55 % der Strecke voll da, das Aufklappen
          // läuft danach weiter — das Bild ist also erst zu ahnen und schiebt sich dann auf.
          const bx = boxOf.get(faqShell.current)
          const vp = bx ? (bx.top - y) / viewH : 1
          const t = Math.max(0, Math.min(1, (0.78 - vp) / 0.48))
          const fold = Math.round((1 - smooth(t)) * 200) / 2
          if (fold !== lastFold) {
            lastFold = fold
            faqShell.current.style.clipPath = fold <= 0 ? 'none' : `inset(0 0 ${fold}% 0)`
          }
          setOp(faqShell.current, (Math.round(Math.min(1, t / 0.55) * 100) / 100).toFixed(2))
        }
        // --- Wisch-Hinweis blendet beim ersten Scrollen aus ---
        if (hint) {
          const show = y <= 120
          if (show !== hintShown) { hintShown = show; gsap.to(hint, { opacity: show ? 1 : 0, duration: 0.35, overwrite: true }) }
        }
        // --- Fußzeile: setzt sich ab, sobald sie hinter der Seite hervorkommt ---
        if (!footShown && footParts?.length && page) {
          const pb = boxOf.get(page)
          if (pb && y + viewH - (pb.top + pb.height) >= 420) {
            footShown = true
            tweens.push(gsap.to(footParts, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.09 }))
          }
        }
      }
    }
    lenis.on('scroll', onScroll)
    onScroll()
    if (hint) {
      if (!reduceMotion) gsap.to(hint, { opacity: 1, duration: 0.8, ease: EASE, delay: 1.6 })
      else hint.style.opacity = '1'
    }

    // Ziehen mit der Maus scrollt die Seite (Touch macht Lenis selbst). Beim Loslassen läuft der Schwung
    // nach; nach einer echten Bewegung wird der folgende Klick geschluckt, damit nichts versehentlich öffnet.
    const DRAG_RATIO = 0.66  // ein Pixel Mausweg bewegt die Seite um 0,66 Pixel, dazu ein spürbarer Schwung
    let drag: { y0: number; s0: number; last: number; t: number; v: number; moved: boolean } | null = null
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      drag = { y0: e.clientY, s0: lenis.scroll, last: e.clientY, t: performance.now(), v: 0, moved: false }
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const scale = stageScale()
      const dy = (e.clientY - drag.y0) / scale
      // erst ab 14 Bildschirmpixeln zählt es als Ziehen, ein leicht wackelnder Klick bleibt ein Klick
      if (!drag.moved && Math.abs(e.clientY - drag.y0) < 14) return
      drag.moved = true
      const now = performance.now()
      drag.v = ((drag.last - e.clientY) / scale) / Math.max(1, now - drag.t) * 1000
      drag.last = e.clientY; drag.t = now
      lenis.scrollTo(drag.s0 - dy * DRAG_RATIO, { lerp: 0.08 })
    }
    const onUp = () => {
      if (!drag) return
      const d = drag; drag = null
      if (!d.moved) return
      const target = lenis.scroll + d.v * DRAG_RATIO * 0.2
      lenis.scrollTo(target, { duration: 1.0 })
      const swallow = (ev: Event) => { ev.stopPropagation(); ev.preventDefault() }
      root.addEventListener('click', swallow, { capture: true, once: true })
      setTimeout(() => root.removeEventListener('click', swallow, { capture: true }), 80)
    }
    root.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      tweens.forEach((t) => t.kill()); observers.forEach((o) => o.disconnect()); ro.disconnect()
      gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(1000, 33); lenis.destroy()   // GSAP-Standard wiederherstellen, sonst erbt ihn jeder spätere Screen
      root.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  const railTo = (i: number) => {
    const wrap = railWrap.current
    if (!wrap) return
    const k = Math.max(0, Math.min(modules.length - 1, i))
    lenisRef.current?.scrollTo(wrap.offsetTop + RAIL_LEAD + k * RAIL_STEP, { duration: 1.1 })
  }
  const open = (id: string) => dispatch({ type: 'overlay', overlay: { type: 'modul', id } })
  const toBerater = () => dispatch({ type: 'go', screen: 's03' })

  return (
    <div className="screen">
      {/* Wisch-Hinweis knapp über der Leiste (deren Oberkante liegt bei 1690), außerhalb des Scrollers:
          er bleibt stehen und blendet aus, sobald gescrollt wird. */}
      <div ref={hintRef} style={{ position: 'absolute', left: 0, right: 0, top: 1510, zIndex: 3, pointerEvents: 'none', opacity: 0 }}><TouchHint text="Nach unten wischen" dir="down" style={{ color: '#fff' }} /></div>
      <div className="scroller" ref={scroller}>
        <div className="scroll-content">
          <div className="page">
            {/* Hero: Bild bis zum Rand, Kopfzeile darüber, Headline unten im Bild */}
            <section data-sec className="hero">
              <div className="photo hero-photo"><img src={heroImg} alt="Kind spielt neben einer Wärmepumpe im Garten" style={{ height: '100%', marginTop: 0, objectPosition: '46% 0%' }} /></div>
              <div className="hero-fade" />
              <div className="topbar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <img className="logo" src={logo} alt="SWB Gruppe" />
              </div>
              <div className="hero-text">
                {/* data-hstep bestimmt die Reihenfolge des Einlaufs: Tag und Überschrift zusammen (0),
                    dann die Unterzeile (1), dann die drei Zahlen einzeln (2, 3, 4). */}
                <div data-sr data-hstep="0"><span className="tag">Heizen · Wärmepumpe</span></div>
                <h1 className="display" style={{ fontSize: 112, marginTop: 20, color: '#fff' }}><Split text="Aus 1 kWh Strom" /><br /><Split text="werden" /> <Split text="4 kWh Wärme." color="var(--accent-200)" /></h1>
                <p className="body" data-sr data-hstep="1" style={{ marginTop: 26, maxWidth: 760, color: 'rgba(255,255,255,.88)' }}>{anschluss}</p>
                {/* Jede Zahlenspalte ist ein eigener Block: Sie fächern beim Aufbau nacheinander auf, statt als Reihe zu kommen. */}
                <div style={{ marginTop: 68, display: 'flex', gap: 48 }}>
                  {[{ pre: '', v: 75, post: ' %', t: 'Wärme aus der Umwelt' }, { pre: 'bis ', v: 70, post: ' %', t: 'Förderung' }, { pre: 'ab ', v: 114, post: ' €', t: 'im Monat' }].map((k, n) => (
                    <div key={k.t} data-sr data-hstep={2 + n} style={{ borderTop: '2px solid rgba(255,255,255,.5)', paddingTop: 26, minWidth: 200 }}>
                      <div className="num" style={{ fontSize: 60, lineHeight: 1, color: '#fff' }}>{k.pre}<span data-count={k.v}>0</span>{k.post}</div>
                      <div className="small" style={{ marginTop: 6, color: 'rgba(255,255,255,.75)' }}>{k.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stories-Rail (noho): Der Abschnitt bleibt beim Scrollen stehen; weiteres Scrollen schaltet die Karten
                nach rechts durch, vorbeigezogene Karten stapeln sich links als Streifen. Danach geht es wieder nach unten. */}
            <div style={{ height: 192, background: '#00343b' }} aria-hidden="true" />
            <div className="railwrap" data-sec ref={railWrap} style={{ height: 1650 + railDistance }}>
              <div className="railstick">
                {/* Handschlag-Band der Sektion (21:9): wird beim Hereinkommen als Ganzes aufgedeckt, danach
                    wandert es mit der festen Sektion nach oben. Leichter Parallax im Bild. */}
                <div className="photo" ref={bandBox} style={{ height: 463, margin: 'auto 64px 0', clipPath: 'inset(0 100% 0 0)' }}><img ref={bandImgRef} src={bandImg} alt="Handschlag vor der neuen Wärmepumpe" style={{ height: '114%', marginTop: 0, objectPosition: '50% 0%' }} /></div>
                <div data-sr style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 64px', marginTop: 72 }}>
                  <div>
                    <div className="kicker" data-sr>Sieben Karten, sieben Antworten</div>
                    <h2 className="display" style={{ fontSize: 84, marginTop: 12 }}><Split text="Was Sie" /><br /><Split text="wissen wollen." /></h2>
                    <p className="body" data-sr style={{ marginTop: 14, maxWidth: 640 }}>Nutzen, Eignung, Kosten, Ablauf, Kombination und warum mit uns. Antippen öffnet die Karte, wischen blättert weiter.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 22 }}>
                    <button className="slbtn" onClick={() => railTo(focus - 1)} disabled={focus === 0} aria-label="zurück"><Chevron dir={-1} /></button>
                    <button className="slbtn" onClick={() => railTo(focus + 1)} disabled={focus >= modules.length - 1} aria-label="weiter"><Chevron dir={1} /></button>
                  </div>
                </div>
                <div data-sr className="rail-h" style={{ marginTop: 36 }}>
                  {modules.map((m, i) => {
                    const used = session.used.includes(m.id)
                    return (
                      <button key={m.id} ref={(el) => { cardRefs.current[i] = el }} className={`story ${i === focus ? 'focus' : ''}`} onClick={() => (i === focus ? open(m.id) : railTo(i))}
                        style={{ left: 64, width: RAIL_CARD, zIndex: i + 1 }}>
                        <div className="story-in">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="kicker" style={{ fontSize: 19 }}>{m.kicker}</span>
                            {used && <span className="tag" style={{ height: 36, fontSize: 19 }}>angesehen</span>}
                          </div>
                          <div className="display" style={{ fontSize: 46, marginTop: 18, lineHeight: 1 }}>{m.title}</div>
                          <p className="body" style={{ marginTop: 18, fontSize: 26 }}>{m.kompakt}</p>
                          <div className="story-foot">
                            <span className="num" style={{ fontSize: 24, color: 'var(--fg3)' }}>{String(i + 1).padStart(2, '0')}</span>
                            <span className="linkline">{m.kind === 'rechner' ? 'Schätzen' : m.kind === 'eignung' ? 'Einschätzen' : 'Öffnen'} <Icon name="chevronRight" size={22} /></span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 4, padding: '0 64px' }}>
                  {modules.map((m, i) => (
                    <button key={m.id} onClick={() => railTo(i)} aria-label={m.kicker} aria-current={i === focus ? 'step' : undefined}
                      style={{ all: 'unset', cursor: 'pointer', padding: '22px 6px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ display: 'block', width: i === focus ? 44 : 14, height: 12, background: i === focus ? 'var(--accent-a)' : 'var(--rule)', transition: 'width .3s' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kombination mit Bild links bis zum Rand */}
            <section data-sec className="sec" style={{ paddingRight: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 48, alignItems: 'start' }}>
                <div>
                  <div className="kicker" data-sr>Passt dazu</div>
                  <h2 className="display" style={{ fontSize: 76, marginTop: 16 }}><Split text="Stark in Kombination." /></h2>
                  <p className="body" data-sr style={{ marginTop: 20 }}>Photovoltaik liefert den Strom, die Wallbox lädt das Auto, Ökostrom macht es rund. In Kombination gibt es einen zusätzlichen Bonus. Höhe am Beratungstisch.</p>
                  <div data-sr style={{ marginTop: 64 }}><Pill label="Kombination wählen" variant="accent" onClick={() => open('kombi')} /></div>
                </div>
                {/* Quadrat (520 × 520), Oberkante auf einer Linie mit dem Textblock links, rechte Kante bündig mit dem Rand.
                    520 ist das Maß, das noch passt: Die Überschrift zwingt die linke Spalte auf 429 px (Mindestbreite von
                    "Kombination."), 64 + 429 + 48 + 520 ergibt genau die 1080 px der Stele. Ein breiteres Bild liefe rechts
                    aus dem Bild heraus und wäre auf dem Schirm kein Quadrat mehr. Das Bild füllt den Kasten ohne zusätzlichen
                    Überstand, sonst zöge das hohe Format den Ausschnitt seitlich noch weiter zu. */}
                <div data-wipe className="photo" style={{ height: 520 }}><img src={altbauImg} alt="Wärmepumpe mit Holzverkleidung an einem Fachwerkhaus" style={{ height: 520 + 2 * KOMBI_OVER, marginTop: -KOMBI_OVER, objectPosition: '62% 50%' }} /></div>
              </div>
            </section>

            {/* FAQ: Bild links bis zum Rand, Akkordeon rechts */}
            <section data-sec className="sec" style={{ padding: 0 }}>
              {/* Hülle mit fester Höhe: Das Bild klappt darin von oben auf (clip-path, scrollgebunden). Die Höhe
                  der Seite ändert sich dabei nicht — eine echte Höhenänderung müsste bei jedem Bild alles darunter
                  neu umbrechen und war als Ruckeln zu sehen. Deshalb hier auch kein data-wipe: Das Aufklappen ist
                  die Enthüllung. */}
              <div ref={faqShell} className="faq-shell" style={{ height: FAQ_H, clipPath: 'inset(0 0 100% 0)' }}>
                <div className="photo" style={{ height: FAQ_H }}><img src={faqImg} alt="Wärmepumpe mit bepflanztem Dach" style={{ height: FAQ_H + 2 * FAQ_OVER, marginTop: -FAQ_OVER, objectPosition: '50% 40%' }} /></div>
              </div>
              <div style={{ padding: '72px 64px 0' }}>
                <div className="kicker" data-sr>Aus dem Beratungsalltag</div>
                <h2 className="display" data-sr style={{ fontSize: 84, marginTop: 12 }}><Split text="Häufige Fragen." /></h2>
                <p className="body" data-sr style={{ marginTop: 14, maxWidth: 760 }}>Was Menschen uns am Beratungstisch am häufigsten fragen. Antippen öffnet die Antwort.</p>
              </div>
              <div style={{ marginTop: 36, padding: '0 64px 120px' }}>
                <div className="acc-list" style={{ borderBottom: '1px solid var(--rule)' }}>
                  {S02.faq.slice(0, 6).map((f, k) => (
                    <div className="acc-item" key={f.q} data-sr data-fade>
                      <button aria-expanded={faqOpen === k} onClick={() => { setFaqOpen(faqOpen === k ? null : k); dispatch({ type: 'use', id: 'faq' }) }}><span>{f.q}</span><span className="pm">{faqOpen === k ? '–' : '+'}</span></button>
                      {faqOpen === k && <div className="a fade-enter">{f.a}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          {/* Fußzeile am Ende des Scrollinhalts, sticky am unteren Rand: sie steht hinter der Seite und wird freigegeben, wenn die Seite hochgeschoben ist; antippbar, weil im Scroller */}
          <div className="curtain" ref={curtainRef}>
            {/* Konzernbild bündig in der oberen rechten Ecke, drei Viertel der Abschnittshöhe; die Verläufe
                nach links und unten stehen im Stylesheet. Trägt data-foot, damit es erst mit dem übrigen
                Fuß erscheint und nicht schon sichtbar ist, während der Text noch wartet. */}
            <div className="photo curtain-photo" data-foot><img src={footImg} alt="Eingang der Stadtwerke Bonn" style={{ height: 'calc(100% - 6px)', marginTop: 0, objectPosition: '50% 40%' }} /></div>
            <div className="kicker" data-foot>Ihr nächster Schritt</div>
            <div className="display" data-foot style={{ fontSize: 132, marginTop: 24, lineHeight: .98 }}>Sprechen Sie<br />uns an.</div>
            <p className="body" data-foot style={{ fontSize: 36, marginTop: 32, maxWidth: 680 }}>Wir sind gleich nebenan. Kostenlos, unverbindlich, etwa 15 Minuten. Sagen Sie einfach, welches Thema Sie interessiert.</p>
            <div data-foot style={{ display: 'flex', gap: 18, marginTop: 56, flexWrap: 'wrap', alignItems: 'center' }}>
              <Pill label={SYSTEM.beraterCta} variant="accent" size="xl" icon="ds_contact" onClick={toBerater} />
              <button className="textlink" onClick={toBerater}>{SYSTEM.summary} <Icon name="chevronRight" size={24} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
