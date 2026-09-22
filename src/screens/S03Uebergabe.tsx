import { useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import Icon from '../components/Icon'
import Pill from '../components/Pill'
import { S03 } from '../data/content'
import { useStore } from '../store'
import { reduceMotion } from '../motion/ambient'
import qrRaw from '../assets/graphics/qr-code.svg?raw'
import heroImg from '../assets/photos/beratung-tisch-beethoven.webp'
import logo from '../assets/icons-swb/logo-swb.svg'

// S03 Berater: die ganze Seite auf einem Petrol-Verlauf, keine Sektionstrennung. Oben links die Einladung,
// rechts die Komposition mit dem Hochkant-Foto, unter der Einladung drei Erwartungen als Liste, dann der Weg
// aufs Handy (QR in Hellblau direkt auf der Karte) neben dem Übergabe-Code. Keine Angaben, kein Ergebnis: die Stele speichert nichts.
export default function S03Uebergabe() {
  const { state, dispatch } = useStore()
  const { flags } = state
  const root = useRef<HTMLDivElement>(null)
  // Dezenter Aufbau: der Hero blendet auf, die Einladung links kommt von rechts und dockt an ihrem Platz an,
  // danach stapeln sich die Karten unten nacheinander von unten herein.
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const hero = el.querySelector<HTMLElement>('[data-hero]')
    const text = Array.from(el.querySelectorAll<HTMLElement>('[data-herotext] > *'))
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-stack]'))
    if (reduceMotion) { gsap.set([hero, ...text, ...cards], { opacity: 1, x: 0, y: 0 }); return }
    // Start kurz nach dem Aufziehen des Vorhangs, damit die Fläche nicht leer steht. Die Elemente setzen
    // versetzt an, sind aber alle zum selben Zeitpunkt da: dafür wird die Dauer je Element zurückgerechnet.
    const END = 0.95
    const tl = gsap.timeline({ delay: 0.5 })
    if (hero) tl.fromTo(hero, { opacity: 0 }, { opacity: 1, duration: END, ease: 'power1.out' }, 0)
    text.forEach((el, i) => {
      const at = 0.1 + i * 0.08
      tl.fromTo(el, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: END - at, ease: 'power3.out', clearProps: 'transform' }, at)
    })
    cards.forEach((el, i) => {
      const at = 0.2 + i * 0.09
      tl.fromTo(el, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: END - at, ease: 'power3.out', clearProps: 'transform' }, at)
    })
    return () => { tl.kill() }
  }, [])
  const code = useMemo(() => S03.codes[Math.floor(Math.random() * S03.codes.length)], [])
  // QR-Code als Inline-SVG, Module in Hellblau direkt auf der Karte
  const qrSvg = useMemo(() => qrRaw.replace(/fill="#111"/g, 'fill="currentColor"').replace(/width="200" height="200"/, 'width="280" height="280"'), [])

  return (
    <div className="screen" ref={root} style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, var(--brand-700) 0%, var(--brand-800) 42%, var(--brand-900) 100%)' }}>
      <div className="topbar"><img className="logo" src={logo} alt="SWB Gruppe" /></div>

      {/* Einladung links, Hochkant-Foto rechts, alles auf einem durchgehenden Verlauf */}
      {/* Komposition von Max: Beethoven-Silhouette als Stromkabel über dem Hochkant-Foto (eine Datei mit Alpha).
          Die Datei ist so skaliert und gesetzt, dass das Foto darin exakt an der bisherigen Stelle liegt: 600 px hoch,
          rechts bis an den Bildrand (editorial), Unterkante auf 768 px. Foto in der Datei: links 603, oben 185, Höhe 1280 von 1465. */}
      <div data-hero style={{ position: 'relative', height: 768, padding: '168px 64px 0', boxSizing: 'border-box', display: 'flex', alignItems: 'flex-end', flex: '0 0 auto' }}>
        <img src={heroImg} alt="Beratung am Tisch im Servicecenter, davor die Beethoven-Silhouette als Stromkabel" style={{ position: 'absolute', left: 455, top: 81, width: 625, height: 'auto', display: 'block', pointerEvents: 'none' }} />
        {/* Einladung höher, darunter die drei Erwartungen als Liste, alles links neben der Komposition */}
        <div data-herotext style={{ position: 'relative', flex: '0 0 auto', width: 470, minWidth: 0, paddingBottom: 0, display: 'flex', flexDirection: 'column', gap: 34 }}>
          <div>
            <div className="kicker" style={{ color: 'var(--accent-200)' }}>{S03.next}</div>
            <div className="display" style={{ fontSize: 84, marginTop: 16, color: '#fff', whiteSpace: 'nowrap' }}>Sprechen Sie<br />uns an.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            {S03.expect.map((e) => (
              <div key={e.text} style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#fff' }}>
                <span className="icochip" style={{ width: 52, height: 52, color: 'var(--brand-300)' }}><Icon name={e.icon} size={40} className="ic40" style={{ display: 'flex' }} /></span>
                <span style={{ fontSize: 25, fontWeight: 665, lineHeight: 1.2 }}>{e.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '68px 64px 250px', display: 'flex', flexDirection: 'column', gap: 26, flex: 1 }}>

        {/* Aufs Handy: QR in Hellblau direkt auf der Karte, daneben der Text */}
        <div data-stack className="card" style={{ padding: '36px 44px', display: 'flex', gap: 44, alignItems: 'center' }}>
          <span role="img" aria-label="QR-Code" style={{ flex: '0 0 auto', width: 280, height: 280, display: 'inline-flex', lineHeight: 0, color: 'var(--brand-300)' }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div style={{ flex: 1 }}>
            <div className="kicker">Zum Mitnehmen</div>
            <div className="display" style={{ fontSize: 54, marginTop: 10, lineHeight: 1 }}>{S03.phone}</div>
            <p className="body" style={{ marginTop: 14 }}>{S03.phoneText}</p>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 665, fontSize: 25 }}><Icon name="x_nfc" size={32} />{S03.nfc}</div>
          </div>
        </div>

        {/* Übergabe-Code als Zeile */}
        {flags.code && (
          <button data-stack onClick={() => dispatch({ type: 'overlay', overlay: { type: 'code', code } })} style={{ all: 'unset', cursor: 'pointer', background: 'var(--accent-500)', color: '#000', padding: '30px 44px', display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ flex: '0 0 auto' }}>
              <div className="kicker" style={{ color: 'var(--accent-900)' }}>{S03.codeLabel}</div>
              <div className="num" style={{ fontSize: 68, lineHeight: 1, color: '#000', marginTop: 8 }}>{code}</div>
            </div>
            <div style={{ fontSize: 25, fontWeight: 665, lineHeight: 1.3, maxWidth: 520, marginLeft: 'auto' }}>{S03.codeText}</div>
          </button>
        )}

        {/* Weiter stöbern: mittig im Raum zwischen Code und Leiste */}
        <div data-stack style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Pill label={S03.browse} variant="ghost" icon="arrowRight" onClick={() => dispatch({ type: 'go', screen: 's04' })} />
        </div>
      </div>
    </div>
  )
}
