import Icon from './Icon'
import { useStore, type TopicId } from '../store'
import { NAV_TOPICS, SYSTEM, topicById } from '../data/content'

// Leiste unten: sechs gleich breite Kacheln (DS icon-tab--card): vier Themen · Alle Bereiche (→ Übersicht S04) · Berater.
// Auf jedem Screen identisch, damit das Muskelgedächtnis trägt.
export default function NavBar() {
  const { state, dispatch } = useStore()
  const topics: TopicId[] = state.flags.fernwaerme ? [...NAV_TOPICS, 'fernwaerme'] : NAV_TOPICS
  const activeTopic = state.screen === 's02' ? 'waermepumpe' : state.screen === 'topic' ? state.topic : null
  const goTopic = (id: TopicId) => dispatch({ type: 'go', screen: id === 'waermepumpe' ? 's02' : 'topic', topic: id })

  return (
    <nav className="navbar">
      <div className="navrow">
        {topics.map((id) => {
          const t = topicById(id)
          return (
            <button key={id} className="ntile" onClick={() => goTopic(id)} aria-current={activeTopic === id ? 'page' : undefined}>
              <Icon name={t.icon} /><span className="l">{t.nav}</span>
            </button>
          )
        })}
      </div>
      {/* Schmale Zeile: Zurück links (nicht auf dem Startscreen), Alle Bereiche (nur Icon) und Berater rechts */}
      {(
        <div className="navrow slim">
          {state.screen !== 's01' && (
            <button className="ntile back" onClick={() => dispatch({ type: 'back' })}>
              <Icon name="arrowLeft" /><span className="l">{SYSTEM.zurueck}</span>
            </button>
          )}
          <button className="ntile alle" onClick={() => dispatch({ type: 'go', screen: 's04' })} aria-current={state.screen === 's04' ? 'page' : undefined} aria-label={SYSTEM.alle}>
            <span aria-hidden="true" style={{ display: 'inline-flex', lineHeight: 0 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </span>
          </button>
          <button className="ntile berater" onClick={() => dispatch({ type: 'go', screen: 's03' })} aria-current={state.screen === 's03' ? 'page' : undefined}>
            <Icon name="ds_contact" /><span className="l">{SYSTEM.berater}</span>
          </button>
        </div>
      )}
    </nav>
  )
}
