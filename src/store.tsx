import { createContext, useCallback, useContext, useReducer, useRef, type Dispatch, type ReactNode, useMemo } from 'react'
import { curtainTo } from './motion/curtain'

export type Screen = 's01' | 's02' | 's03' | 's04' | 'topic'
export type TopicId = 'waermepumpe' | 'photovoltaik' | 'emobilitaet' | 'strom' | 'fernwaerme' | 'beraten' | 'kundenservice'

export type Overlay =
  | null
  | { type: 'modul'; id: string }
  | { type: 'heizen' }
  | { type: 'rand'; id: string }
  | { type: 'reset' }
  | { type: 'code'; code: string }
  | { type: 'timeout' }

export type Session = {
  lockQuestion?: string
  lockAnswer?: string
  guess?: number
  guessRevealed?: boolean
  baujahr?: string
  heizung?: string
  eignung?: string
  kosten?: 'mieten' | 'kaufen'
  kombi: string[]
  used: string[]
}

export type Flags = {
  dichte: 'kompakt' | 'ausfuehrlich'
  fernwaerme: boolean
  timeout: boolean
  code: boolean
  dev: boolean
  art: boolean
  look: 'dark' | 'light' | 'glass'
}

export type State = {
  screen: Screen
  topic: TopicId
  history: { screen: Screen; topic: TopicId }[]
  overlay: Overlay
  session: Session
  flags: Flags
  tick: number
  resets: number      // zählt nur echte Neustarts (Timeout, Neu starten), nicht jeden Screenwechsel
}

export type Action =
  | { type: 'go'; screen: Screen; topic?: TopicId }
  | { type: 'back' }
  | { type: 'overlay'; overlay: Overlay }
  | { type: 'session'; patch: Partial<Session> }
  | { type: 'use'; id: string }
  | { type: 'flags'; patch: Partial<Flags> }
  | { type: 'reset' }

const params = new URLSearchParams(location.search)
const emptySession = (): Session => ({ kombi: [], used: [] })

export const initialState: State = {
  screen: 's01',
  topic: 'waermepumpe',
  history: [],
  overlay: null,
  session: emptySession(),
  flags: {
    dichte: params.get('dichte') === 'ausfuehrlich' ? 'ausfuehrlich' : 'kompakt',
    fernwaerme: params.get('fernwaerme') === '1',
    timeout: params.get('timeout') !== '0',
    code: params.get('code') !== '0',
    dev: location.hash === '#dev' || params.get('dev') === '1',
    art: params.get('art') === '1',
    look: (['dark', 'light', 'glass'].includes(params.get('look') ?? '') ? params.get('look') : 'dark') as 'dark' | 'light' | 'glass',
  },
  tick: 0,
  resets: 0,
}

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'go': {
      const topic = a.topic ?? s.topic
      if (a.screen === s.screen && topic === s.topic) return { ...s, overlay: null }
      const history = s.screen === 's01' ? [] : [...s.history, { screen: s.screen, topic: s.topic }].slice(-12)
      return { ...s, screen: a.screen, topic, history, overlay: null, tick: s.tick + 1 }
    }
    case 'back': {
      const prev = s.history[s.history.length - 1]
      if (!prev) return { ...s, screen: 's01', overlay: null, tick: s.tick + 1 }
      return { ...s, screen: prev.screen, topic: prev.topic, history: s.history.slice(0, -1), overlay: null, tick: s.tick + 1 }
    }
    case 'overlay':
      return { ...s, overlay: a.overlay }
    case 'session':
      return { ...s, session: { ...s.session, ...a.patch } }
    case 'use':
      return s.session.used.includes(a.id) ? s : { ...s, session: { ...s.session, used: [...s.session.used, a.id] } }
    case 'flags':
      return { ...s, flags: { ...s.flags, ...a.patch } }
    case 'reset':
      return { ...s, screen: 's01', topic: 'waermepumpe', history: [], overlay: null, session: emptySession(), tick: s.tick + 1, resets: s.resets + 1 }
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> }>({ state: initialState, dispatch: () => {} })

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, raw] = useReducer(reducer, initialState)
  const screenRef = useRef({ screen: state.screen, topic: state.topic })
  screenRef.current = { screen: state.screen, topic: state.topic }
  // Jeder Wechsel auf einen anderen Screen läuft durch den Vorhang (motion/curtain.ts); die
  // Beraterseite wird in Grüntönen enthüllt, die Übersicht „Alle Bereiche" bekommt die schnelle
  // Kreis-Überblendung. „Zurück" und Overlays bleiben ohne Vorhang.
  const dispatch = useCallback<Dispatch<Action>>((a: Action) => {
    const cur = screenRef.current
    const changes = a.type === 'go' && (a.screen !== cur.screen || (a.screen === 'topic' && a.topic !== cur.topic))
    if (a.type === 'go' && changes) curtainTo(() => raw(a), a.screen === 's03' ? 'green' : a.screen === 's04' || a.screen === 's01' ? 'fast' : 'blue')
    else raw(a)
  }, [])
  // Ohne useMemo wäre der Wert bei jedem Render ein neues Objekt und alle Verbraucher (Bühne, Leiste,
  // Overlays, Kopfzeile, jeder Screen) würden bei jedem Dispatch mitrendern — auch bei den vielen
  // Dispatches, die ein Regler beim Ziehen auslöst.
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
