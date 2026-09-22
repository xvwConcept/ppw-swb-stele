// Chevron aus dem SWB-Designsystem (icon-chevron-right.svg), gespiegelt für links.
// Wird in den quadratischen Schiebeknöpfen (.slbtn) auf Start- und Wärmepumpen-Seite verwendet.
export default function Chevron({ dir }: { dir: -1 | 1 }) {
  return (
    <svg viewBox="0 0 16 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: dir < 0 ? 'scaleX(-1)' : undefined }}>
      <path d="M6 3.833 10.667 8.5 6 13.167" />
    </svg>
  )
}
