import { useState } from 'react'
import Icon from './Icon'
import Pill from './Pill'
import ArcSlider from './ArcSlider'
import { S02, type Section } from '../data/content'
import { useStore } from '../store'
import imgHaus from '../assets/photos/wp-haus-modern.jpg'
import imgCheck from '../assets/photos/wp-check.jpg'
import imgKey from '../assets/photos/wp-keyvisual.jpg'
import imgEauto from '../assets/photos/waermepumpe-eauto.jpg'
import imgBeratung from '../assets/photos/beratung.jpg'
import imgSchema from '../assets/photos/wp-schema.jpg'

const MODULE_IMG: Record<string, { src: string; alt: string }> = {
  funktion: { src: imgSchema, alt: 'Schema: Außengerät, Speicher im Haus, Heizkreislauf' },
  rechner: { src: imgHaus, alt: 'Wärmepumpe an einem modernen Haus' },
  eignung: { src: imgCheck, alt: 'SWB-Berater beim WP-Check im Heizungskeller' },
  kosten: { src: imgKey, alt: 'Wärmepumpe' },
  ablauf: { src: imgCheck, alt: 'SWB-Berater beim WP-Check im Heizungskeller' },
  kombi: { src: imgEauto, alt: 'Wärmepumpe und Elektroauto' },
  warum: { src: imgBeratung, alt: 'Beratung vor Ort' },
}

// Bild eines Moduls. Sitzt im Kopf des Overlays rechts neben Topline und Überschrift (50/50), nicht mehr
// im Inhalt darunter — deshalb eine eigene Komponente, die `Overlays` als `media` an das Sheet gibt.
// Format 4:3, der Kasten holt seine Breite aus der Spalte.
export function ModuleMedia({ s }: { s: Section }) {
  const img = MODULE_IMG[s.id]
  if (!img) return null
  const schema = s.kind === 'funktion'
  return (
    <div className="photo" data-ow style={{ aspectRatio: '4 / 3', background: schema ? '#fff' : undefined }}>
      <img src={img.src} alt={img.alt} style={schema ? { height: '100%', marginTop: 0, objectFit: 'contain', padding: 18 } : { height: '100%', marginTop: 0 }} />
    </div>
  )
}

// Interaktiver Inhalt eines Wärmepumpen-Moduls. Wird im Overlay (Karte geöffnet) gezeigt.

function Haus({ fill }: { fill: number }) {
  const h = 220, top = 60
  const level = top + h - h * fill
  return (
    <svg viewBox="0 0 260 300" width="220" height="254" aria-hidden="true">
      <defs><clipPath id="hausclip"><path d="M30 130 L130 40 L230 130 V280 H30 Z" /></clipPath></defs>
      <path d="M30 130 L130 40 L230 130 V280 H30 Z" fill="var(--n-100)" stroke="var(--n-300)" strokeWidth="6" strokeLinejoin="round" />
      <rect x="0" y={level} width="260" height={300 - level} fill="var(--accent-400)" clipPath="url(#hausclip)" style={{ transition: 'y .5s ease-in, height .5s ease-in' }} />
      <path d="M30 130 L130 40 L230 130" fill="none" stroke="var(--brand-800)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M170 40 h26 v40" fill="none" stroke="var(--brand-800)" strokeWidth="8" strokeLinecap="round" />
      <rect x="112" y="200" width="36" height="80" fill="#fff" stroke="var(--brand-800)" strokeWidth="6" />
      <rect x="60" y="160" width="36" height="36" fill="#fff" stroke="var(--brand-800)" strokeWidth="6" />
      <rect x="164" y="160" width="36" height="36" fill="#fff" stroke="var(--brand-800)" strokeWidth="6" />
    </svg>
  )
}

export default function ModuleContent({ s }: { s: Section }) {
  const { state, dispatch } = useStore()
  const { session, flags } = state
  const long = flags.dichte === 'ausfuehrlich'
  const revealed = session.guessRevealed === true
  const [step, setStep] = useState(0)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const use = (id: string) => dispatch({ type: 'use', id })
  const guessFill = session.guess !== undefined ? ((revealed ? 4 : session.guess) - 1) / 5 : 0
  const text = long ? s.ausfuehrlich : [s.kompakt]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 820 }}>
        {text.map((p, i) => <p key={i} className="body" data-oa>{p}</p>)}
      </div>

      {/* Rechte Spalte 300 statt 260 px: "Aufdecken" ist mit Symbol breiter und wurde sonst rechts beschnitten.
          Bogen 500 statt 560, damit der Inhalt bei der neuen Kopfhöhe ohne Scrollen ins Sheet passt. */}
      {s.kind === 'rechner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'center' }}>
          <ArcSlider min={1} max={6} unit="kWh Wärme" label="Ihre Schätzung" value={session.guess} truth={4} revealed={revealed} size={500}
            onChange={(v) => { dispatch({ type: 'session', patch: { guess: v, guessRevealed: false } }); use('rechner') }} />
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <Haus fill={revealed ? 0.8 : guessFill} />
            <div className="small">1 kWh Strom → {revealed ? 4 : session.guess ?? '?'} kWh Wärme</div>
            {!revealed ? <Pill label="Aufdecken" variant="brand" onClick={() => dispatch({ type: 'session', patch: { guessRevealed: true } })} disabled={session.guess === undefined} />
              : <span className="tag cyan">Rund 4 kWh · 75 % aus der Umwelt</span>}
          </div>
        </div>
      )}

      {s.kind === 'eignung' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div>
            <div className="small" style={{ marginBottom: 12, fontWeight: 665 }}>Baujahr</div>
            <div className="steps">{S02.baujahr.map((b) => <button key={b} aria-pressed={session.baujahr === b} onClick={() => { dispatch({ type: 'session', patch: { baujahr: b, eignung: S02.eignung(b, session.heizung) } }); use('eignung') }} style={{ fontSize: 28 }}>{b}</button>)}</div>
          </div>
          <div>
            <div className="small" style={{ marginBottom: 12, fontWeight: 665 }}>Heutige Heizung</div>
            <div className="steps">{S02.heizung.map((h) => <button key={h} aria-pressed={session.heizung === h} onClick={() => { dispatch({ type: 'session', patch: { heizung: h, eignung: S02.eignung(session.baujahr, h) } }); use('eignung') }} style={{ fontSize: 28 }}>{h}</button>)}</div>
          </div>
          {session.eignung && (
            <div className="fade-enter" style={{ borderLeft: '6px solid var(--accent-500)', padding: '8px 0 8px 28px' }}>
              <div className="body" style={{ fontWeight: 665, fontSize: 34 }}>{session.eignung}</div>
            </div>
          )}
        </div>
      )}

      {s.kind === 'kosten' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="seg">
            {(['mieten', 'kaufen'] as const).map((k) => <button key={k} aria-pressed={(session.kosten ?? 'mieten') === k} onClick={() => { dispatch({ type: 'session', patch: { kosten: k } }); use('kosten') }}>{k}</button>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <span className="num" style={{ fontSize: 140, lineHeight: 1, color: 'var(--accent-a)' }}>{(session.kosten ?? 'mieten') === 'mieten' ? 'ab 114 €' : 'Angebot'}</span>
            <span className="body" style={{ fontSize: 34 }}>{(session.kosten ?? 'mieten') === 'mieten' ? 'im Monat' : 'am Beratungstisch'}</span>
          </div>
          <div className="small">Beispiel, Preisstand 09/2026 — Ihr Angebot am Beratungstisch.</div>
        </div>
      )}

      {s.kind === 'ablauf' && (
        <div>
          <div className="steps">{['Ihre Anfrage', 'WP-Check', 'Planung und Einbau', 'Wartung'].map((t, i) => (
            <button key={t} aria-pressed={step === i} onClick={() => { setStep(i); use('ablauf') }} style={{ fontSize: 26, flexDirection: 'column', gap: 4, height: 124 }}>
              <span className="num" style={{ fontSize: 42 }}>{i + 1}</span><span style={{ fontSize: 21, fontWeight: 665 }}>{t}</span>
            </button>))}</div>
          <p className="body" style={{ marginTop: 24, fontSize: 34 }}>{['Sie melden sich, wir melden uns zurück.', 'Kostenloser Vorab-Check bei Ihnen zu Hause.', 'Wir planen die Anlage und bauen sie ein.', 'Wartung und Service, auch nachts.'][step]}</p>
        </div>
      )}

      {s.kind === 'kombi' && (
        <div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[{ id: 'pv', l: 'Photovoltaik', i: 'ds_photovoltaik' }, { id: 'wallbox', l: 'Wallbox', i: 'ds_wallbox' }, { id: 'oeko', l: 'Ökostrom', i: 'ds_electricity' }].map((k) => {
              const on = session.kombi.includes(k.id)
              return (
                <button key={k.id} className="ans" aria-pressed={on} style={{ flex: '1 1 0', gap: 14, fontSize: 30 }}
                  onClick={() => { dispatch({ type: 'session', patch: { kombi: on ? session.kombi.filter((x) => x !== k.id) : [...session.kombi, k.id] } }); use('kombi') }}>
                  <Icon name={k.i} size={40} />{k.l}
                </button>
              ) })}
          </div>
          <p className="body" style={{ marginTop: 24, fontSize: 34, color: session.kombi.length ? 'var(--accent-900)' : undefined, fontWeight: 665 }}>
            {session.kombi.length >= 2 ? 'Zusätzlicher Bonus in Kombination — Höhe am Beratungstisch.' : session.kombi.length === 1 ? 'Guter Anfang. Mit einer zweiten Kombination steigt der Bonus.' : 'Wählen Sie, was zu Ihnen passt.'}
          </p>
        </div>
      )}

      {s.kind === 'warum' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 48px' }}>
          {[['Verlässlicher Partner', 'ds_mappin'], ['Durchdachte Planung', 'reader'], ['Vier-Augen-Prinzip', 'user'], ['24-Stunden-Service', 'bell'], ['Wartung & Entsorgung', 'reload'], ['Auch im Altbau', 'home']].map(([t, i]) => (
            <div key={t} style={{ borderTop: '1px solid var(--rule)', padding: '20px 0', display: 'flex', alignItems: 'center', gap: 18 }}>
              <Icon name={i} size={38} style={{ color: 'var(--icon)' }} /><span style={{ fontSize: 28, fontWeight: 665, lineHeight: 1.15 }}>{t}</span>
            </div>
          ))}
        </div>
      )}

      {s.kind === 'faq' && (
        <div className="acc-list">
          {S02.faq.map((f, i) => (
            <div className="acc-item" key={f.q}>
              <button onClick={() => { setFaqOpen(faqOpen === i ? null : i); use('faq') }}><span>{f.q}</span><span className="pm">{faqOpen === i ? '–' : '+'}</span></button>
              {faqOpen === i && <div className="a fade-enter">{f.a}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
