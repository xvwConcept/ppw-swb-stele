import { ICONS } from '../icons'

// Inline-SVG aus dem SWB-Icon-Set. Farbe über currentColor, Größe über CSS des Elternelements.
export default function Icon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
  const svg = ICONS[name] ?? ICONS.info
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-flex', lineHeight: 0, flex: '0 0 auto', width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{ __html: size ? svg.replace(/width="\d+(\.\d+)?" height="\d+(\.\d+)?"/, `width="${size}" height="${size}"`) : svg }}
    />
  )
}
