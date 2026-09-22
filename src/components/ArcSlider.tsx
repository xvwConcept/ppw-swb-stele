import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SNAP } from '../motion/reveal'

type Props = {
  min: number
  max: number
  value?: number
  truth?: number
  revealed?: boolean
  unit: string
  label?: string
  onChange: (v: number) => void
  size?: number
  step?: number
  pulse?: boolean
}

// Bogen-Slider in SWB-Optik: Bogen über 220°, Stufenmarken als große Tippziele, Knopf, große Zahl in der Mitte.
// Bedienung durch Tippen auf eine Marke oder den Bogen oder durch Ziehen des Knopfs (Pointer Capture,
// damit der Finger auch außerhalb des Bogens weiterziehen kann). Die Marken fangen keine Events mehr ab,
// sonst ließe sich der Knopf, der immer auf einer Marke sitzt, nicht greifen.
// Alle Maße sind relativ zur Größe, damit der Slider in Karte und Overlay gleich sauber sitzt und nichts abgeschnitten wird.
export default function ArcSlider({ min, max, value, truth, revealed, unit, label, onChange, size = 640, step = 1, pulse }: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const drag = useRef(false)
  const W = size, H = Math.round(size * 0.9)
  const cx = W / 2, cy = Math.round(size * 0.5), r = Math.round(size * 0.35)
  const START = 220, SWEEP = 280 // Grad, im Uhrzeigersinn von links unten bis rechts unten; unten bleibt eine Lücke von 80°
  const shown = revealed && truth !== undefined ? truth : value
  const frac = shown === undefined ? 0 : (shown - min) / (max - min)
  const stroke = Math.max(14, Math.round(size * 0.045))

  const polar = (deg: number, rad = r) => { const a = ((deg - 90) * Math.PI) / 180; return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) } }
  const arc = (f0: number, f1: number) => {
    const a0 = START + SWEEP * f0, a1 = START + SWEEP * f1
    const p0 = polar(a0), p1 = polar(a1)
    return `M${p0.x},${p0.y} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1.x},${p1.y}`
  }
  const knob = polar(START + SWEEP * frac)

  const setFromPointer = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W - cx
    const y = ((e.clientY - rect.top) / rect.height) * H - cy
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90
    if (deg < 0) deg += 360
    // Der Bogen läuft von 220 über 360 hinaus bis 500 Grad; Winkel unter 140 gehören zum Ende
    if (deg < START + SWEEP - 360) deg += 360
    let f = (deg - START) / SWEEP
    if (f < 0) f = deg > START - 40 ? 0 : 1                       // Lücke unten: zur nächsten Seite schnappen
    if (f > 1) f = 1
    onChange(Math.round((min + f * (max - min)) / step) * step)
  }

  // Zahl zählt animiert, wenn sich der Wert ändert oder die Auflösung erscheint.
  // overwrite und das Abräumen sind wichtig: Beim Ziehen des Reglers ändert sich `shown` bei jeder
  // Zeigerbewegung. Ohne das liefen die alten Tweens weiter und schrieben gleichzeitig in dasselbe
  // Textfeld — nach zwei Sekunden Ziehen waren das rund hundert.
  useEffect(() => {
    if (!numRef.current || shown === undefined) return
    const o = { v: Number(numRef.current.dataset.v || shown) }
    const tw = gsap.to(o, { v: shown, duration: 0.5, ease: SNAP, overwrite: true, onUpdate: () => { if (numRef.current) numRef.current.textContent = String(Math.round(o.v)) } })
    numRef.current.dataset.v = String(shown)
    return () => { tw.kill() }
  }, [shown])

  const marks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step)
  const numSize = Math.round(size * 0.26)
  const on = (m: number) => shown !== undefined && m <= shown
  return (
    <div style={{ position: 'relative', width: W, height: H, margin: '0 auto', flex: '0 0 auto' }}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', touchAction: 'none', cursor: 'pointer', overflow: 'visible' }}
        onPointerDown={(e) => { try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* kein aktiver Zeiger, z. B. bei synthetischen Events */ } drag.current = true; setFromPointer(e) }} onPointerMove={(e) => drag.current && setFromPointer(e)} onPointerUp={() => { drag.current = false }} onPointerCancel={() => { drag.current = false }}>
        <path d={arc(0, 1)} stroke="var(--rule)" strokeWidth={stroke} fill="none" strokeLinecap="round" />
        {shown !== undefined && <path d={arc(0, Math.max(frac, 0.002))} stroke={revealed ? 'var(--brand-300)' : 'var(--accent-500)'} strokeWidth={stroke} fill="none" strokeLinecap="round" />}
        {marks.map((m) => {
          const f = (m - min) / (max - min); const p = polar(START + SWEEP * f); const lp = polar(START + SWEEP * f, r + stroke * 2.2)
          const hot = (m === value && !revealed) || (m === truth && revealed)
          return (
            <g key={m} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r={stroke * 1.8} fill="transparent" />
              <circle cx={p.x} cy={p.y} r={stroke * 0.3} fill={on(m) ? 'rgba(0,0,0,.4)' : 'var(--fg)'} opacity={on(m) ? 0.55 : 0.85} />
              <text x={lp.x} y={lp.y + size * 0.022} textAnchor="middle" fontSize={Math.round(size * 0.064)} fontWeight="700" fill={hot ? (revealed ? 'var(--brand-300)' : 'var(--accent-a)') : 'var(--fg3)'} fontFamily="Rajdhani">{m}</text>
            </g>
          )
        })}
        {shown !== undefined && (
          <g style={{ pointerEvents: 'none' }}>
            <g className="arc-knob">
              <circle cx={knob.x} cy={knob.y} r={stroke * 1.25} fill="#fff" stroke={revealed ? 'var(--brand-300)' : 'var(--accent-500)'} strokeWidth={Math.max(4, Math.round(stroke * 0.3))} />
              <circle cx={knob.x} cy={knob.y} r={stroke * 0.35} fill={revealed ? 'var(--brand-500)' : 'var(--accent-700)'} />
            </g>
          </g>
        )}
      </svg>
      {pulse && !revealed && shown !== undefined && (
        <span className="arc-pulse" style={{ left: `${(knob.x / W) * 100}%`, top: `${(knob.y / H) * 100}%`, width: stroke * 2.5, height: stroke * 2.5 }} />
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy - numSize * 0.66, textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: Math.round(size * 0.02) }}>
          <div ref={numRef} className="num" style={{ fontSize: shown === undefined ? Math.round(numSize * 0.75) : numSize, lineHeight: 1, color: shown === undefined ? 'var(--fg3)' : 'var(--fg)' }}>{shown ?? '?'}</div>
          <div style={{ fontSize: Math.round(size * 0.05), fontWeight: 665, color: 'var(--fg3)' }}>{unit}</div>
        </div>
        {label && <div className="small" style={{ marginTop: 6, fontSize: Math.round(size * 0.042) }}>{revealed ? 'Auflösung' : label}</div>}
      </div>
    </div>
  )
}
