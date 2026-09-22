// @ts-nocheck
// ---------------------------------------------------------------------------
// Die Formen der Morph-Bühne: aus demselben Punkt-Pool entstehen nacheinander
// Wahrzeichen und Energieprodukte. Jede Form liefert Punkte in lokalen
// Koordinaten, zentriert auf (0,0,0), Höhe etwa 0 bis 40.
// ---------------------------------------------------------------------------
let seed = 4711
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }

const box = (out, x, y, z, w, h, d, step, dens = .55) => {
  for (let yy = 0; yy <= h; yy += step) {
    for (let xx = 0; xx <= w; xx += step) {
      if (rnd() < dens) out.push([x + xx, y + yy, z])
      if (rnd() < dens) out.push([x + xx, y + yy, z + d])
    }
    for (let zz = 0; zz <= d; zz += step) {
      if (rnd() < dens * .8) out.push([x, y + yy, z + zz])
      if (rnd() < dens * .8) out.push([x + w, y + yy, z + zz])
    }
  }
  for (let xx = 0; xx <= w; xx += step * .7) for (let zz = 0; zz <= d; zz += step * .7) {
    if (rnd() < dens * .5) out.push([x + xx, y + h, z + zz])
  }
}
const cone = (out, cx, cz, base, top, r, n = 320) => {
  for (let i = 0; i < n; i++) {
    const u = rnd(), a = rnd() * Math.PI * 2, rr = r * (1 - u)
    out.push([cx + Math.cos(a) * rr, base + (top - base) * u, cz + Math.sin(a) * rr])
  }
}
const disc = (out, cx, cy, cz, r, n, axis = 'y') => {
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, rr = r * Math.sqrt(rnd())
    if (axis === 'y') out.push([cx + Math.cos(a) * rr, cy, cz + Math.sin(a) * rr])
    else out.push([cx, cy + Math.sin(a) * rr, cz + Math.cos(a) * rr])
  }
}

// 1 Wohnhaus mit Solardach
function haus() {
  const o = []
  box(o, -9, 0, -7, 18, 11, 14, .55, .5)
  for (let zz = 0; zz <= 14; zz += .5) for (let u = 0; u <= 1; u += .022) {
    const hy = 11 + (1 - Math.abs(u - .5) * 2) * 6
    if (rnd() < .6) o.push([-9 + u * 18, hy, -7 + zz])
  }
  for (let row = 0; row < 6; row++) for (let i = 0; i < 40; i++) {   // Solarmodule
    const u = .1 + (i / 40) * .8
    o.push([-9 + u * 18, 11 + (1 - Math.abs(u - .5) * 2) * 6 + .3, -5.6 + row * 2.1])
  }
  return o
}
// 2 Wärmepumpe mit Lüfterrad
function waermepumpe() {
  const o = []
  box(o, -7, 0, -5, 14, 12, 10, .4, .55)
  disc(o, -7.2, 6, 0, 4.4, 900, 'x')
  for (let i = 0; i < 700; i++) {                                    // Luftstrom
    const u = rnd()
    o.push([-8 - u * 12, 6 + (rnd() - .5) * 7 * (1 + u), (rnd() - .5) * 7 * (1 + u)])
  }
  for (let i = 0; i < 300; i++) o.push([7 + rnd() * 3, rnd() * 3, -5 + rnd() * 10])
  return o
}
// 3 E-Auto mit Wallbox
function eauto() {
  const o = []
  for (let i = 0; i < 3200; i++) {
    const u = rnd(), v = rnd()
    const cab = Math.max(0, 1 - Math.pow((u - .52) / .3, 2))
    o.push([-11 + u * 22, 2 + v * (3.2 + cab * 4), (rnd() - .5) * 9])
  }
  for (const wx of [-6, 6]) for (const wz of [-4.2, 4.2]) disc(o, wx, 2, wz, 1.9, 260, 'x')
  box(o, 13, 0, -1.6, 2.2, 8, 3.2, .3, .8)                            // Wallbox
  for (let i = 0; i <= 90; i++) { const u = i / 90; o.push([13 - u * 4.5, 6 - Math.sin(u * Math.PI) * 2.2, -1 + u * .8]) }
  return o
}
// 4 Windrad
function windrad() {
  const o = []
  for (let i = 0; i < 900; i++) { const u = rnd(); o.push([(rnd() - .5) * (1.6 - u), u * 30, (rnd() - .5) * (1.6 - u)]) }
  for (let bl = 0; bl < 3; bl++) {
    const a0 = bl * Math.PI * 2 / 3
    for (let i = 0; i < 900; i++) {
      const u = Math.sqrt(rnd()), w = (1 - u) * 1.1 + .2
      o.push([Math.cos(a0) * u * 15 + (rnd() - .5) * w, 30 + Math.sin(a0) * u * 15 + (rnd() - .5) * w, (rnd() - .5) * 1.2])
    }
  }
  disc(o, 0, 30, 0, 1.4, 260, 'x')
  return o
}
// 5 Bonner Münster
function muenster() {
  const o = []
  box(o, -13, 0, -6, 26, 9, 12, .5, .5)
  box(o, -12, 0, -5, 5, 20, 5, .4, .6); cone(o, -9.5, -2.5, 20, 27, 2.6)
  box(o, 7, 0, -5, 5, 20, 5, .4, .6); cone(o, 9.5, -2.5, 20, 27, 2.6)
  box(o, -3.6, 0, -3.6, 7.2, 30, 7.2, .4, .62); cone(o, 0, 0, 30, 41, 3.8, 520)
  return o
}
// 6 Post Tower
function postTower() {
  const o = []
  box(o, -6, 0, -4.5, 5.2, 40, 9, .42, .7)
  box(o, 1, 0, -4.5, 5.2, 40, 9, .42, .7)
  for (let i = 0; i < 400; i++) o.push([-6 + rnd() * 12.2, 40 + rnd() * 1.2, -4.5 + rnd() * 9])
  return o
}
// 7 Kennedybrücke
function bruecke() {
  const o = []
  for (let i = 0; i < 1800; i++) { const u = rnd(); o.push([-22 + u * 44, 6 + (rnd() - .5) * .8, (rnd() - .5) * 7]) }
  for (const off of [-3, 3]) for (let i = 0; i < 900; i++) {
    const u = rnd(); o.push([-22 + u * 44, 6 + Math.sin(u * Math.PI) * 11 + (rnd() - .5) * .6, off + (rnd() - .5) * .6])
  }
  for (const px of [-11, 11]) for (let i = 0; i < 400; i++) o.push([px + (rnd() - .5) * 2, rnd() * 6, (rnd() - .5) * 6])
  return o
}

export const FORMS = [
  { name: 'Wohnhaus mit Solardach', pts: haus() },
  { name: 'Wärmepumpe', pts: waermepumpe() },
  { name: 'E-Auto mit Wallbox', pts: eauto() },
  { name: 'Windrad', pts: windrad() },
  { name: 'Bonner Münster', pts: muenster() },
  { name: 'Post Tower', pts: postTower() },
  { name: 'Kennedybrücke', pts: bruecke() },
]

// Alle Formen auf dieselbe Punktzahl bringen, damit sie ineinander übergehen können
export function resample(n: number) {
  return FORMS.map((f) => {
    const src = f.pts, out = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const p = src[Math.floor(rnd() * src.length)]
      out[i * 3] = p[0] + (rnd() - .5) * .35
      out[i * 3 + 1] = p[1] + (rnd() - .5) * .35
      out[i * 3 + 2] = p[2] + (rnd() - .5) * .35
    }
    return { name: f.name, pos: out }
  })
}
