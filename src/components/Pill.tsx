import Icon from './Icon'

type Props = {
  label: string
  variant?: 'brand' | 'accent' | 'petrol' | 'ghost' | 'outline'
  size?: 'xl' | 'l' | 'm'
  icon?: string
  full?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  disabled?: boolean
}

// SWB Signature-Button: Pille plus runder Icon-Chip rechts (Anatomie aus dem SWB-Designsystem / Juni-Kit).
export default function Pill({ label, variant = 'brand', size = 'l', icon = 'arrowRight', full, onClick, style, disabled }: Props) {
  return (
    <button className={`pill ${variant} ${size} ${full ? 'full' : ''}`} onClick={onClick} disabled={disabled} style={{ ...style, opacity: disabled ? 0.45 : 1, pointerEvents: disabled ? 'none' : undefined }}>
      <span>{label}</span>
      <span className="chip"><Icon name={icon} /></span>
    </button>
  )
}
