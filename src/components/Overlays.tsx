import { useEffect, useState } from 'react'
import Icon from './Icon'
import Pill from './Pill'
import Sheet from './Sheet'
import ModuleContent, { ModuleMedia } from './ModuleContent'
import { RAND, S02, S03, S04, SYSTEM } from '../data/content'
import { useStore, type TopicId } from '../store'

// Alle Overlays als Bottom-Sheet, nur der Timeout mittig.
export default function Overlays({ onTimeoutStay }: { onTimeoutStay: () => void }) {
  const { state, dispatch } = useStore()
  const ov = state.overlay
  const close = () => dispatch({ type: 'overlay', overlay: null })
  const goTopic = (id: TopicId) => dispatch({ type: 'go', screen: id === 'waermepumpe' ? 's02' : 'topic', topic: id })
  if (!ov) return null

  if (ov.type === 'heizen') {
    return (
      <Sheet title={S04.heizen.title} kicker="Heizen" onClose={close}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <button className="tile" onClick={() => goTopic('waermepumpe')} style={{ ['--acc' as string]: 'var(--brand-700)', minHeight: 300 }}>
            <span className="icochip"><Icon name="ds_heating" /></span>
            <div><div className="t">Wärmepumpe</div><div className="s">{S04.heizen.wp}</div><div className="go">Öffnen <Icon name="arrowRight" /></div></div>
          </button>
          <button className="tile dim" onClick={() => goTopic('fernwaerme')} style={{ ['--acc' as string]: 'var(--brand-300)', minHeight: 300 }}>
            <span className="icochip"><Icon name="ds_district" /></span>
            <div><div className="t">Fernwärme</div><div className="s">{S04.heizen.fw}</div><div className="go">Öffnen <Icon name="arrowRight" /></div></div>
          </button>
        </div>
      </Sheet>
    )
  }

  if (ov.type === 'rand') {
    const i = RAND.findIndex((r) => r.id === ov.id)
    const r = RAND[i]
    const go = (k: number) => dispatch({ type: 'overlay', overlay: { type: 'rand', id: RAND[k].id } })
    return (
      <Sheet title={r.title} kicker="Randthema" onClose={close} prev={i > 0 ? () => go(i - 1) : undefined} next={i < RAND.length - 1 ? () => go(i + 1) : undefined}
        actions={<><Pill label="Zum Berater" variant="accent" icon="ds_contact" onClick={() => dispatch({ type: 'go', screen: 's03' })} /><Pill label={SYSTEM.zurueck} variant="outline" icon="close" onClick={close} /></>}>
        <p className="body" data-oa>{r.text}</p>
        <p className="body" data-oa style={{ marginTop: 18, fontWeight: 700, color: 'var(--brand-800)' }}>Mehr am Beratungstisch.</p>
      </Sheet>
    )
  }

  if (ov.type === 'modul') {
    const list = S02.sections.filter((x) => x.kind !== 'cta' && x.kind !== 'faq')
    const i = list.findIndex((x) => x.id === ov.id)
    const s = list[i]
    const go = (k: number) => dispatch({ type: 'overlay', overlay: { type: 'modul', id: list[k].id } })
    return (
      <Sheet title={s.title} kicker={`${String(i + 1).padStart(2, '0')} · ${s.kicker}`} onClose={close} height={1380} media={<ModuleMedia s={s} />}
        prev={i > 0 ? () => go(i - 1) : undefined} next={i < list.length - 1 ? () => go(i + 1) : undefined}
        actions={<><Pill label="Mit Berater besprechen" variant="accent" icon="ds_contact" onClick={() => dispatch({ type: 'go', screen: 's03' })} />{i < list.length - 1 && <Pill label="Nächste Karte" variant="outline" onClick={() => go(i + 1)} />}</>}>
        <ModuleContent key={s.id} s={s} />
      </Sheet>
    )
  }

  if (ov.type === 'reset') {
    return (
      <Sheet title={SYSTEM.resetQ} onClose={close} actions={<><Pill label={SYSTEM.resetYes} variant="petrol" icon="reload" onClick={() => dispatch({ type: 'reset' })} /><Pill label={SYSTEM.resetNo} variant="outline" icon="close" onClick={close} /></>}>
        <p className="body">{SYSTEM.resetNote}</p>
      </Sheet>
    )
  }

  if (ov.type === 'code') {
    return <CodeFull code={ov.code} onClose={close} />
  }

  if (ov.type === 'timeout') {
    return <Timeout onStay={onTimeoutStay} />
  }
  return null
}

function CodeFull({ code, onClose }: { code: string; onClose: () => void }) {
  return (
    <Sheet onClose={onClose} height={1000} actions={<Pill label={SYSTEM.zurueck} variant="outline" icon="close" onClick={onClose} />}>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div className="kicker">{S03.codeLabel}</div>
        <div className="num" style={{ fontSize: 260, lineHeight: 1, color: 'var(--brand-800)', margin: '30px 0' }}>{code}</div>
        <p className="body" style={{ fontSize: 40 }}>{S03.codeText}</p>
      </div>
    </Sheet>
  )
}

function Timeout({ onStay }: { onStay: () => void }) {
  const { dispatch } = useStore()
  const total = SYSTEM.timeoutCount
  const [left, setLeft] = useState(total)
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (left <= 0) dispatch({ type: 'reset' }) }, [left, dispatch])
  const r = 96, c = 2 * Math.PI * r, f = Math.max(left, 0) / total
  return (
    <>
      <div className="scrim" onClick={onStay} />
      <div className="center" onClick={(e) => e.target === e.currentTarget && onStay()}>
        <div className="timeout fade-enter">
          <div>
            <div className="kicker">Ihre Sitzung</div>
            <div className="display" style={{ fontSize: 110, marginTop: 14 }}>{SYSTEM.timeoutTitle}</div>
            <p className="body" style={{ marginTop: 16, fontSize: 32 }}>{SYSTEM.timeoutText}</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
              <Pill label={SYSTEM.timeoutStay} variant="accent" size="l" icon="check" onClick={onStay} />
              <Pill label={SYSTEM.timeoutReset} variant="outline" size="l" icon="reload" onClick={() => dispatch({ type: 'reset' })} />
            </div>
          </div>
          <div className="ring">
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r={r} fill="none" stroke="var(--rule)" strokeWidth="10" />
              <circle cx="110" cy="110" r={r} fill="none" stroke="var(--accent-500)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - f)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="secs">{Math.max(left, 0)}</div>
          </div>
        </div>
      </div>
    </>
  )
}

