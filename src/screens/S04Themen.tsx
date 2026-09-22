import { useRef } from 'react'
import Icon from '../components/Icon'
import { RAND, S04 } from '../data/content'
import { useStore } from '../store'
import heroImg from '../assets/photos/wp-junge-panorama.jpg'

// S04 Themen-Einstieg · Variante A „Anlass-Kacheln": Frage, Zugpferd-Karte, sechs Kacheln, Randthemen-Zeile.
// Ohne Einblend-Animation: Die Kacheln standen nach dem Reveal nicht ruhig.
export default function S04Themen() {
  const { dispatch } = useStore()
  const root = useRef<HTMLDivElement>(null)
  const open = (t: (typeof S04.tiles)[number]) => {
    if (t.topic === 'waermepumpe') dispatch({ type: 'overlay', overlay: { type: 'heizen' } })
    else if (t.topic === 'kundenservice') dispatch({ type: 'go', screen: 's03' })
    else dispatch({ type: 'go', screen: 'topic', topic: t.topic })
  }
  return (
    <div className="screen" ref={root} style={{ padding: '24px 64px 250px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div className="kicker">Alle Bereiche</div>
        <h1 className="display" style={{ fontSize: 76, lineHeight: 1.02, marginTop: 10 }}>{S04.title}</h1>
      </div>
      <button onClick={() => dispatch({ type: 'go', screen: 's02', topic: 'waermepumpe' })} className="photo" style={{ all: 'unset', cursor: 'pointer', position: 'relative', height: 340, flex: '0 0 auto', overflow: 'hidden', display: 'block' }}>
        <img src={heroImg} alt="Kind spielt neben einer Wärmepumpe im Garten" style={{ width: '100%', height: '100%', margin: 0, objectFit: 'cover', objectPosition: '50% 45%', display: 'block' }} />
        <div className="hero-shade" />
        <div style={{ position: 'absolute', left: 36, right: 36, bottom: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, zIndex: 3 }}>
          <div>
            <span className="tag">{S04.zugpferd.kicker}</span>
            <div className="display" style={{ fontSize: 56, color: '#fff', marginTop: 8 }}>{S04.zugpferd.title}</div>
            <div className="body" style={{ color: 'rgba(255,255,255,.85)', marginTop: 8, fontSize: 26 }}>Heizen mit Energie aus der Umwelt. Mieten ab 114 € im Monat, bis zu 70 % Förderung.</div>
          </div>
          <Icon name="arrowRight" size={48} style={{ color: '#fff', flex: '0 0 auto' }} />
        </div>
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: 252, gap: 20, flex: '0 0 auto' }}>
        {S04.tiles.map((t) => (
          <button key={t.topic} className="tile" onClick={() => open(t)} style={{ ['--acc' as string]: t.acc, minHeight: 0, padding: '26px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="icochip"><Icon name={t.icon} /></span>
              {t.tag && <span className="tag">{t.tag}</span>}
            </div>
            <div>
              <div className="t">{t.title}</div>
              <div className="s">{t.sub}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 56 }}>
        <span className="kicker" style={{ marginRight: 10, whiteSpace: 'pre-line', lineHeight: 1.25 }}>{S04.ausserdem}</span>
        {RAND.map((r) => (
          <button key={r.id} onClick={() => dispatch({ type: 'overlay', overlay: { type: 'rand', id: r.id } })} className="randbtn">{r.title}</button>
        ))}
      </div>
    </div>
  )
}
