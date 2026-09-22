import Icon from './Icon'

// Sichtbarer Touch-Hinweis: Finger mit pulsierendem Ring, dazu eine Richtung (nach unten wischen, nach rechts, tippen)
// und ein kurzer Satz. Rein dekorativ, nicht antippbar; hängt am ambient-Zustand über CSS (Animation pausiert bei Berührung).
export default function TouchHint({ text, dir = 'down', style }: { text?: string; dir?: 'down' | 'right' | 'tap'; style?: React.CSSProperties }) {
  return (
    <div className={`touchhint ${dir}`} style={style} aria-hidden="true">
      <span className="th-finger"><span className="th-ring" /><span className="th-ring d" /><Icon name="x_tap" size={60} /></span>
      {text && <span className="th-text">{text}</span>}
    </div>
  )
}
