import { useRef } from 'react'
import Icon from '../components/Icon'
import Pill from '../components/Pill'
import { SYSTEM, topicById } from '../data/content'
import { useStore } from '../store'
import { useReveal } from '../motion/reveal'
import logo from '../assets/icons-swb/logo-swb.svg'
import pvImg from '../assets/photos/pv-montage.jpg'
import emobilImg from '../assets/photos/emobil-stecker.jpg'
import stromImg from '../assets/photos/swb-kraftwerk.jpg'
import fernwaermeImg from '../assets/photos/bonn-skyline.jpg'
import beratenImg from '../assets/photos/wp-check.jpg'
import serviceImg from '../assets/photos/swb-bahn-stadt.webp'
import bahnImg from '../assets/photos/bahn.jpg'

// Passendes Motiv je Thema (SWB-Website-Motive und gelieferte Fotos, siehe assets/photos/CREDITS.md)
const HERO: Record<string, { src: string; alt: string }> = {
  photovoltaik: { src: pvImg, alt: 'Monteure verlegen Solarmodule auf einem Dach' },
  emobilitaet: { src: emobilImg, alt: 'Ladestecker im E-Auto vor dem Haus' },
  strom: { src: stromImg, alt: 'SWB-Kraftwerk am Abend' },
  fernwaerme: { src: fernwaermeImg, alt: 'Skyline des Bonner Bundesviertels' },
  beraten: { src: beratenImg, alt: 'SWB-Berater mit Kunde im Heizungskeller' },
  kundenservice: { src: serviceImg, alt: 'SWB-Bahn in der Bonner Innenstadt' },
}

// Platzhalter-Themenseite (Photovoltaik, E-Mobilität, Strom & Tarif, Fernwärme, Energieberatung):
// gleiche Rahmenlogik wie S02, Inhalte folgen nach Entscheidung über das S02-Muster. Keine Sackgasse: Weg zum Berater.
export default function TopicPlaceholder() {
  const { state, dispatch } = useStore()
  const t = topicById(state.topic)
  const hero = HERO[t.id] ?? { src: bahnImg, alt: 'SWB Stadtbahn in Bonn' }
  const root = useRef<HTMLDivElement>(null)
  useReveal(root, [state.topic])
  return (
    <div className="screen" ref={root} style={{ padding: '0 0 250px' }}>
      <div className="photo" style={{ height: 760 }}>
        <img src={hero.src} alt={hero.alt} />
        <div className="hero-shade" />
        <div className="topbar"><img className="logo" src={logo} alt="SWB Gruppe" /></div>
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 48, zIndex: 3 }}>
          <div className="kicker" style={{ color: 'var(--accent-200)' }}>{t.anlass}</div>
          <h1 className="display" style={{ fontSize: 104, marginTop: 14, color: '#fff' }}>{t.label}</h1>
          <p className="body" style={{ marginTop: 16, color: 'rgba(255,255,255,.88)' }}>{t.sub}</p>
        </div>
      </div>
      <div style={{ padding: '0 64px' }}>
      <div className="card" data-reveal style={{ marginTop: 40, textAlign: 'center', padding: '70px 60px' }}>
        <span className="icochip" style={{ width: 130, height: 130, borderRadius: 30, margin: '0 auto 30px' }}><Icon name={t.icon} size={76} /></span>
        <h2 className="h2">Inhalte folgen</h2>
        <p className="body" style={{ marginTop: 16, maxWidth: 760, margin: '16px auto 0' }}>
          Diese Seite folgt dem Muster der Wärmepumpen-Seite: Nutzen, Passt das zu mir, Kosten, Ablauf, Kombination, Warum SWB, Fragen.
          {t.id === 'photovoltaik' || t.id === 'emobilitaet' ? ' Stark in Kombination mit der Wärmepumpe.' : ''}
        </p>
        <div style={{ marginTop: 40, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Pill label={SYSTEM.beraterCta} variant="accent" size="l" icon="ds_contact" onClick={() => dispatch({ type: 'go', screen: 's03' })} />
          {t.id !== 'waermepumpe' && <Pill label="Zur Wärmepumpe" variant="outline" size="l" onClick={() => dispatch({ type: 'go', screen: 's02', topic: 'waermepumpe' })} />}
        </div>
      </div>
      </div>
    </div>
  )
}
