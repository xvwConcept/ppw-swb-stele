import { useCallback, useEffect, useRef } from 'react'
import { StoreProvider, useStore } from './store'
import Topbar from './components/Topbar'
import NavBar from './components/NavBar'
import Overlays from './components/Overlays'
import BonnScene from './components/BonnScene'
import S01Lock from './screens/S01Lock'
import S02Waermepumpe from './screens/S02Waermepumpe'
import S03Uebergabe from './screens/S03Uebergabe'
import S04Themen from './screens/S04Themen'
import TopicPlaceholder from './screens/TopicPlaceholder'
import { SYSTEM } from './data/content'
import { ambient } from './motion/ambient'
import { setCurtainHost } from './motion/curtain'
import { LOGO_MARK_PATH, LOGO_MARK_VIEWBOX } from './assets/logoMark'

export default function App() {
  return (
    <StoreProvider>
      <Stage />
    </StoreProvider>
  )
}

function Stage() {
  const { state, dispatch } = useStore()
  const stage = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const lastTouch = useRef(Date.now())
  const logoTaps = useRef(0)

  // Bilder blenden nach dem Laden weich ein statt aufzublitzen (Load-Ereignisse in der Capture-Phase)
  useEffect(() => {
    const onLoad = (e: Event) => { const t = e.target as HTMLElement; if (t.tagName === 'IMG') t.classList.add('loaded') }
    document.addEventListener('load', onLoad, true)
    document.querySelectorAll<HTMLImageElement>('img').forEach((i) => { if (i.complete) i.classList.add('loaded') })
    return () => document.removeEventListener('load', onLoad, true)
  }, [])

  // Skalierung der 1080x1920-Bühne auf das Fenster
  useEffect(() => {
    const fit = () => { const w = wrap.current!, s = stage.current!; s.style.transform = `scale(${Math.min(w.clientWidth / 1080, w.clientHeight / 1920)})` }
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit)
  }, [])

  // Berührung: Timer zurücksetzen, Ambient einfrieren (außer auf S01)
  const onPointerDown = useCallback(() => {
    lastTouch.current = Date.now()
    if (state.screen !== 's01') ambient.set(false)
  }, [state.screen])

  // Auch Scrollen und Zeigerbewegung zählen als Aktivität für den Timeout
  useEffect(() => {
    const bump = () => { lastTouch.current = Date.now() }
    window.addEventListener('wheel', bump, { passive: true })
    window.addEventListener('pointermove', bump, { passive: true })
    window.addEventListener('scroll', bump, true)
    return () => { window.removeEventListener('wheel', bump); window.removeEventListener('pointermove', bump); window.removeEventListener('scroll', bump, true) }
  }, [])

  // Screenwechsel: Ambient wieder frei
  const prevTick = useRef(state.tick)
  useEffect(() => {
    if (prevTick.current !== state.tick) { ambient.set(true); lastTouch.current = Date.now() }
    prevTick.current = state.tick
  }, [state.tick])

  // Timeout: nach Inaktivität Hinweis, dann Countdown (Overlays.Timeout) → Reset. Nicht auf S01.
  useEffect(() => {
    if (!state.flags.timeout) return
    const t = setInterval(() => {
      if (state.screen === 's01' || state.overlay?.type === 'timeout') return
      if (Date.now() - lastTouch.current > SYSTEM.timeoutHint * 1000) dispatch({ type: 'overlay', overlay: { type: 'timeout' } })
    }, 1000)
    return () => clearInterval(t)
  }, [state.screen, state.overlay, state.flags.timeout, dispatch])
  const stay = () => { lastTouch.current = Date.now(); dispatch({ type: 'overlay', overlay: null }) }

  // Taste A: Oberfläche aus- und einblenden (nur für die Arbeit an der Szene)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') dispatch({ type: 'flags', patch: { art: !state.flags.art } })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.flags.art, dispatch])

  const onLogoTap = () => { logoTaps.current++; if (logoTaps.current >= 5) { logoTaps.current = 0; dispatch({ type: 'flags', patch: { dev: !state.flags.dev } }) } }
  // Das SWB-Logo ist auf jeder Seite der Weg zurück zum Fragen-Screen; auch die Seiten mit eigener Kopfzeile im Bild
  const onStageClickCapture = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.topbar .logo')) return
    onLogoTap()
    if (state.screen !== 's01') dispatch({ type: 'go', screen: 's01' })
  }

  // Nur-Animation-Modus zum Feinschleifen der Szene: Taste A, ?art=1 oder der
  // Schalter im Präsentationsmenü blenden die Oberfläche aus.
  const artOnly = state.flags.art

  return (
    <div id="wrap" ref={wrap}>
      <div id="stage" ref={stage} onPointerDown={onPointerDown} onClickCapture={onStageClickCapture} data-look={state.flags.look}>
        <div className="tint" />
        {(state.screen === 's01' || artOnly) && <div className="art"><BonnScene width={1080} height={1920} /></div>}
        {artOnly && (
          <button onClick={() => dispatch({ type: 'flags', patch: { art: false } })} aria-label="Oberfläche wieder einblenden"
            style={{ all: 'unset', cursor: 'pointer', position: 'absolute', right: 26, bottom: 26, zIndex: 50, width: 54, height: 54, borderRadius: '50%', border: '1px solid rgba(255,255,255,.22)', background: 'rgba(0,30,36,.45)', backdropFilter: 'blur(14px)', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>UI</button>
        )}
        {!artOnly && <Topbar />}
        <div id="view" key={state.tick} hidden={artOnly} style={{ display: artOnly ? 'none' : undefined, top: state.screen === 's02' || state.screen === 's03' || state.screen === 'topic' ? 0 : undefined }}>
          {state.screen === 's01' && <S01Lock />}
          {state.screen === 's02' && <S02Waermepumpe />}
          {state.screen === 's03' && <S03Uebergabe />}
          {state.screen === 's04' && <S04Themen />}
          {state.screen === 'topic' && <TopicPlaceholder />}
        </div>
        {!artOnly && <NavBar />}
        {!artOnly && <Overlays onTimeoutStay={stay} />}
        {/* Vorhang für jeden Screenwechsel (blau, für den Berater grün), liegt über allem */}
        <div className="opener" ref={setCurtainHost} style={{ display: 'none' }} aria-hidden="true"><div className="op op1" /><div className="op op2" /><div className="op op3" /><div className="og og1" /><div className="og og2" /><div className="og og3" /><svg className="op-mark" viewBox={LOGO_MARK_VIEWBOX} aria-hidden="true"><path d={LOGO_MARK_PATH} fill="currentColor" /></svg></div>
      </div>
      {state.flags.dev && <DevBar />}
    </div>
  )
}

// Präsentationsmenü (Logo fünfmal tippen oder #dev): Direktsprünge und Schalter, kein Editor.
function DevBar() {
  const { state, dispatch } = useStore()
  const f = state.flags
  const B = ({ on, label, onClick }: { on?: boolean; label: string; onClick: () => void }) => <button className={on ? 'on' : ''} onClick={onClick}>{label}</button>
  return (
    <div className="devbar">
      <B label="S01" on={state.screen === 's01'} onClick={() => dispatch({ type: 'reset' })} />
      <B label="S02" on={state.screen === 's02'} onClick={() => dispatch({ type: 'go', screen: 's02', topic: 'waermepumpe' })} />
      <B label="S03" on={state.screen === 's03'} onClick={() => dispatch({ type: 'go', screen: 's03' })} />
      <B label="S04" on={state.screen === 's04'} onClick={() => dispatch({ type: 'go', screen: 's04' })} />
      <B label="PV" on={state.screen === 'topic'} onClick={() => dispatch({ type: 'go', screen: 'topic', topic: 'photovoltaik' })} />
      {(['dark', 'light', 'glass'] as const).map((l) => <B key={l} label={`Look: ${l}`} on={f.look === l} onClick={() => dispatch({ type: 'flags', patch: { look: l } })} />)}
      <B label={`Dichte: ${f.dichte}`} on={f.dichte === 'ausfuehrlich'} onClick={() => dispatch({ type: 'flags', patch: { dichte: f.dichte === 'kompakt' ? 'ausfuehrlich' : 'kompakt' } })} />
      <B label="Fernwärme in Leiste" on={f.fernwaerme} onClick={() => dispatch({ type: 'flags', patch: { fernwaerme: !f.fernwaerme } })} />
      <B label="Timeout" on={f.timeout} onClick={() => dispatch({ type: 'flags', patch: { timeout: !f.timeout } })} />
      <B label="Übergabe-Code" on={f.code} onClick={() => dispatch({ type: 'flags', patch: { code: !f.code } })} />
      <B label="Nur Animation (A)" on={f.art} onClick={() => dispatch({ type: 'flags', patch: { art: !f.art } })} />
      <B label="Timeout jetzt" onClick={() => dispatch({ type: 'overlay', overlay: { type: 'timeout' } })} />
      <B label="Schließen" onClick={() => dispatch({ type: 'flags', patch: { dev: false } })} />
    </div>
  )
}
