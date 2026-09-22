import { useStore } from '../store'
import logo from '../assets/icons-swb/logo-swb.svg'

// Kopf: nur das Logo. Zurück und Neu starten sitzen unten in der Leiste, oben erreicht sie an der Stele niemand.
export default function Topbar({ onLogoTap }: { onLogoTap?: () => void }) {
  const { state } = useStore()
  if (state.screen === 's02' || state.screen === 's03' || state.screen === 'topic') return null
  return (
    <div className="topbar">
      <img className="logo" src={logo} alt="SWB Gruppe" onClick={onLogoTap} />
    </div>
  )
}
