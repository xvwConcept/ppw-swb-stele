import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ambient, reduceMotion } from '../motion/ambient'
import { sceneBus } from '../motion/sceneBus'
import { buildWorld } from './bonnWorld'
import { resample } from './bonnForms'

// ---------------------------------------------------------------------------
// Dieselbe Bonner Lichtpunkt-Wolke wie zuvor, nur in WebGL gezeichnet: jeder
// Punkt ist eine runde Kugel mit weichem Rand statt eines Quadrats. Welt,
// Kamerareise und Wahrzeichen kommen unverändert aus bonnWorld.ts.
// Neu: die Energielinie der Stadtwerke zieht immer durchs Blickfeld, und der
// Brennpunkt der Szene liegt im oberen Viertel des Bildes.
// ---------------------------------------------------------------------------

const C_DIM = new THREE.Color('#3d94a3')
const C_MID = new THREE.Color('#4fadbc')
const C_HI = new THREE.Color('#a9dde6')
const C_LIME = new THREE.Color('#b7d92e')

// Welt und Morph-Formen werden einmal je Sitzung gebaut, nicht bei jedem Mount.
//
// Warum das nötig ist: Die Szene hängt in App.tsx nur am Startscreen. Jeder Wechsel weg und zurück
// (Logo-Tipp, "Zurück", Timeout, Reset) unmountet und mountet sie neu — und buildWorld() plus
// resample(7000) sind zusammen rund 60 ms synchrone Arbeit auf dem Hauptthread, genau während der
// Vorhang läuft. Beide Funktionen sind reine Erzeuger und werden nirgends mutiert (geprüft), das
// Ergebnis lässt sich also gefahrlos behalten.
let worldCache: ReturnType<typeof buildWorld> | null = null
let formsCache: ReturnType<typeof resample> | null = null
const MORPH_POINTS = 7000

export default function BonnScene({ width = 1080, height = 1920 }: { width?: number; height?: number }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const world = worldCache ??= buildWorld()
    const { PT, GROUPS, TURB, DUST, STARS, FAN, CTR, rnd } = world
    const SPOTS = world.SPOTS as Record<string, { x: number; y: number; z: number; r: number; h: number }>
    const TURBS = TURB as { x: number; z: number; s: number; sp: number; base: number }[]

    let running = true
    let raf = 0
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(1)
    renderer.setSize(width, height, false)
    el.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

    const scene = new THREE.Scene()
    // Projektion wie in der p5-Fassung: Brennweite 780 Pixel auf 1080 Breite,
    // der Blickpunkt liegt auf 26 Prozent der Bildhöhe. Das ergibt den weiten,
    // nahen Bildwinkel von damals. Umgesetzt über ein verschobenes Bildfenster.
    const VP = .17, FOCAL = 780
    const fullH = 2 * (1 - VP) * height
    const fov = 2 * Math.atan((fullH / 2) / FOCAL) * 180 / Math.PI
    const camera = new THREE.PerspectiveCamera(fov, width / fullH, 2, 9000)
    camera.setViewOffset(width, fullH, 0, fullH / 2 - VP * height, width, height)
    camera.updateProjectionMatrix()

    // Himmel in Markenfarben, wie in der bisherigen Fassung
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(6000, 24, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, depthTest: false,
        uniforms: {
          uTop: { value: new THREE.Color('#00343b') }, uHor: { value: new THREE.Color('#00818f') },
          uLow: { value: new THREE.Color('#005c68') }, uGlow: { value: new THREE.Color('#1aa3b0') },
        },
        vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `
          varying vec3 vP; uniform vec3 uTop, uHor, uLow, uGlow;
          void main() {
            vec3 d = normalize(vP); float h = d.y;
            vec3 c = h > 0.0 ? mix(uHor, uTop, pow(clamp(h,0.0,1.0), .55)) : mix(uHor, uLow, pow(clamp(-h,0.0,1.0), .5));
            float ga = acos(clamp(dot(d, normalize(vec3(.12, .05, .99))), -1.0, 1.0));
            float glow = exp(-(ga * ga) / (.16 * .16));
            gl_FragColor = vec4(c + uGlow * glow * .55, 1.0);
          }`,
      }),
    )
    sky.frustumCulled = false
    scene.add(sky)

    // --- Punkte aus der Welt in Attribute überführen --------------------------
    const pos: number[] = [], bri: number[] = [], sed: number[] = [], grp: number[] = [], col: number[] = [], sct: number[] = []
    const push = (x: number, y: number, z: number, b: number, ph: number, g: number, c: THREE.Color) => {
      pos.push(x, y, z); bri.push(b); sed.push(ph); grp.push(g); col.push(c.r, c.g, c.b)
      // Streuposition: von dort setzt sich der Punkt zusammen und dorthin löst er sich wieder auf
      const spread = g >= 0 ? 10 + rnd() * 16 : 0
      sct.push(x + (rnd() - .5) * spread, y + rnd() * spread * .7, z + (rnd() - .5) * spread)
    }
    let refl = 0
    for (const q of PT) {
      const c = q.b > .6 ? C_HI : q.b > .28 ? C_MID : C_DIM
      push(q.x, q.y, q.z, q.b, q.ph, q.g, c)
      // Spiegelung im Rhein: jeder zweite helle Punkt reicht, halbiert die Spiegelpunkte
      if (q.g !== -2 && q.y > 6 && q.b > .28 && (q.y < 90 || q.ph > 40) && (refl++ & 1) === 0) {
        push(q.x, -q.y * .94, q.z, q.b * .42, q.ph, -4, C_MID)
      }
    }
    for (const s of STARS) push(s.x, s.y, s.z, s.b, s.ph, -3, C_MID)
    for (const d of DUST) push(d.x, d.y, d.z, .22, d.ph, -5, C_MID)

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geom.setAttribute('aBright', new THREE.Float32BufferAttribute(bri, 1))
    geom.setAttribute('aSeed', new THREE.Float32BufferAttribute(sed, 1))
    geom.setAttribute('aGroup', new THREE.Float32BufferAttribute(grp, 1))
    geom.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3))
    geom.setAttribute('aScatter', new THREE.Float32BufferAttribute(sct, 3))

    const uniforms = {
      // uPulse, uPulseOn, uWave, uFocus, uFocusAmt und uPx standen hier ebenfalls. Sie waren im Shader
      // zwar deklariert, wurden im Rumpf aber nirgends gelesen — geschrieben wurden sie trotzdem bei
      // jedem Bild. Entfernt, samt der Rechnung, die sie speiste.
      uTime: { value: 0 },
      uLime: { value: C_LIME },
      uAssemble: { value: new Float32Array(24) },
      uGlow: { value: new Float32Array(24) },      // Herzschlag je Wahrzeichen
      uTrail: { value: Array.from({ length: 6 }, () => new THREE.Vector3(0, -9999, 0)) },
      uTrailAmt: { value: new Float32Array(6) },
    }

    const material = new THREE.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aBright; attribute float aSeed; attribute float aGroup; attribute vec3 aColor; attribute vec3 aScatter;
        uniform float uTime;
        uniform float uAssemble[24];
        uniform float uGlow[24];
        uniform vec3 uTrail[6];
        uniform float uTrailAmt[6];
        uniform vec3 uLime;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec3 p = position;
          // Zusammensetzen und Auflösen: der Punkt wandert zwischen seiner
          // Streulage und seinem Platz im Objekt, die Wolke lebt dabei leicht.
          float bond = 1.0;
          if (aGroup >= 0.0) {
            bond = uAssemble[int(aGroup)];
            vec3 drift = vec3(
              sin(uTime * .35 + aSeed * 1.7), sin(uTime * .27 + aSeed * 2.3), cos(uTime * .31 + aSeed * 1.1)
            ) * 5.0 * (1.0 - bond);
            p = mix(aScatter + drift, position, bond);
          }
          if (aGroup < -1.5 && aGroup > -2.5) {                       // Wasser wogt
            p.y += sin(p.x * .03 + uTime * .7) * .6 + sin(p.z * .04 - uTime * .5) * .5;
          }
          if (aGroup < -3.5 && aGroup > -4.5) {                       // Spiegelbild zittert
            p.x += sin(uTime * .8 + aSeed) * (1.4 + abs(p.y) * .06);
            p.z += cos(uTime * .6 + aSeed * 1.3) * (1.0 + abs(p.y) * .04);
          }
          float tw = .75 + .25 * sin(aSeed * 5.7 + uTime * .7);
          float b = aBright * tw * (aGroup >= 0.0 ? pow(bond, .7) * .94 + .06 : 1.0);
          vec4 mv0 = modelViewMatrix * vec4(p, 1.0);
          float fog = clamp(1.0 - (-mv0.z - 220.0) / 780.0, 0.0, 1.0);   // Tiefenabfall wie p5
          b *= fog;
          vec3 c = aColor;
          // Energiepunkt und seine Spur: Punkte in der Nähe leuchten auf
          float e = 0.0;
          for (int i = 0; i < 6; i++) {
            e = max(e, uTrailAmt[i] * smoothstep(74.0, 0.0, distance(p, uTrail[i])));
          }
          if (aGroup >= 0.0) {                                          // Wahrzeichen schlagen wie ein Herz
            float g = uGlow[int(aGroup)];
            b += g * aBright * .6;
            e = max(e, g * .22);
          }
          if (aGroup < -6.5) {                                          // Luftpunkte: nur die Spur macht sie sichtbar
            b = e * 1.5;
          } else if (aGroup < -5.5) {                                    // Adern: Licht läuft durch
            float wave = fract(aSeed - uTime * .12);
            float lit = smoothstep(.0, .12, wave) * smoothstep(.34, .14, wave);
            e = max(e, lit * .7);
            b += lit * .35;
          }
          b += e * .8;
          c = mix(c, uLime, clamp(e * .9, 0.0, .85));
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dist = -mv.z;
          // Helligkeitsstufen wie in p5: dunkle Punkte tief petrol, helle fast weiß
          float bb = pow(clamp(b, 0.0, 1.0), .7);
          vec3 tone = mix(vec3(.30, .70, .78), vec3(.68, .93, .97), bb);
          vColor = mix(tone, c, clamp(e * 1.2, 0.0, 1.0));
          vAlpha = (.24 + bb * .56) * 1.0 * (aGroup < -6.5 ? e * 1.6 : 1.0);
          // Punktgröße wie in p5: bei 780 Metern Abstand entspricht ein Meter einem Pixel
          float size = aBright > .6 ? .9 : .6;
          if (aGroup < -2.5 && aGroup > -3.5) size = 1.5;
          if (aGroup < -4.5 && aGroup > -5.5) size = 1.2;
          gl_PointSize = clamp(size * (1.0 + e * 1.4) * (780.0 / max(dist, 20.0)) * 1.15, 1.8, 6.5);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec2 d = gl_PointCoord - vec2(.5);
          float r = length(d) * 2.0;
          if (r > 1.0) discard;
          float core = smoothstep(1.0, .45, r);                        // runde Kugel mit weichem Saum
          float halo = pow(1.0 - r, 2.0) * .5;
          gl_FragColor = vec4(vColor * (core + halo), 1.0) * vAlpha * (core * 1.05 + halo * .8);
        }`,
    })
    const points = new THREE.Points(geom, material)
    points.frustumCulled = false
    scene.add(points)

    // --- Bewegte Punkte: Windräder und Lüfter ---------------------------------
    const movCount = TURBS.length * (26 + 3 * 16) + FAN.length
    const movPos = new Float32Array(movCount * 3)
    const movGeom = new THREE.BufferGeometry()
    movGeom.setAttribute('position', new THREE.BufferAttribute(movPos, 3))
    movGeom.setAttribute('aBright', new THREE.BufferAttribute(new Float32Array(movCount).fill(.5), 1))
    movGeom.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(movCount).map(() => rnd() * 90), 1))
    movGeom.setAttribute('aGroup', new THREE.BufferAttribute(new Float32Array(movCount).fill(-1), 1))
    const movCol = new Float32Array(movCount * 3)
    for (let i = 0; i < movCount; i++) { movCol[i * 3] = C_HI.r; movCol[i * 3 + 1] = C_HI.g; movCol[i * 3 + 2] = C_HI.b }
    movGeom.setAttribute('aColor', new THREE.BufferAttribute(movCol, 3))
    const moving = new THREE.Points(movGeom, material)
    moving.frustumCulled = false
    scene.add(moving)

    // --- Morph-Bühne ----------------------------------------------------------
    // Ein Pool von Punkten baut nacheinander Wahrzeichen und Energieprodukte auf.
    // Zwischen zwei Formen lösen sich die Punkte in eine Wolke auf und finden
    // danach ihren neuen Platz.
    const MN = MORPH_POINTS
    const forms = formsCache ??= resample(MN)
    // Die Bühne wandert mit dem Flug: an jedem Halt sammeln sich die Punkte und
    // bauen dort die nächste Form auf, danach lösen sie sich und ziehen weiter.
    // Die Bühne steht fest vor der Skyline, gut sichtbar im oberen Bildteil.
    // Bühne direkt neben dem Haus am Südufer (SPOTS.swb): dort setzen sich die Formen zusammen, dorthin fliegt die Kamera
    const HOUSE = SPOTS.swb ? new THREE.Vector3(SPOTS.swb.x, SPOTS.swb.y, SPOTS.swb.z) : new THREE.Vector3(-30, 24, -236)
    const STAGE = new THREE.Vector3(HOUSE.x - 90, 4, HOUSE.z + 36)
    const mPos = new Float32Array(MN * 3)
    const mFrom = new Float32Array(MN * 3)
    const mTo = new Float32Array(MN * 3)
    const mSeed = new Float32Array(MN)
    const mBright = new Float32Array(MN)
    const mCol = new Float32Array(MN * 3)
    for (let i = 0; i < MN; i++) {
      mSeed[i] = rnd() * 100
      mBright[i] = .45 + rnd() * .55
      const c = rnd() < .2 ? C_HI : C_MID
      mCol[i * 3] = c.r; mCol[i * 3 + 1] = c.g; mCol[i * 3 + 2] = c.b
    }
    mFrom.set(forms[0].pos); mTo.set(forms[1].pos); mPos.set(forms[0].pos)
    const mGeom = new THREE.BufferGeometry()
    mGeom.setAttribute('position', new THREE.BufferAttribute(mPos, 3))
    mGeom.setAttribute('aFrom', new THREE.BufferAttribute(mFrom, 3))
    mGeom.setAttribute('aTo', new THREE.BufferAttribute(mTo, 3))
    mGeom.setAttribute('aSeed', new THREE.BufferAttribute(mSeed, 1))
    mGeom.setAttribute('aBright', new THREE.BufferAttribute(mBright, 1))
    mGeom.setAttribute('aColor', new THREE.BufferAttribute(mCol, 3))
    const mUniforms = {
      uTime: { value: 0 }, uMorph: { value: 0 },
      uLime: { value: C_LIME }, uSpark: { value: 0 },
    }
    const mMat = new THREE.ShaderMaterial({
      uniforms: mUniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute vec3 aFrom; attribute vec3 aTo; attribute float aSeed; attribute float aBright; attribute vec3 aColor;
        uniform float uTime, uMorph, uSpark; uniform vec3 uLime;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          float e = uMorph * uMorph * (3.0 - 2.0 * uMorph);
          vec3 p = mix(aFrom, aTo, e);
          // in der Mitte des Übergangs blähen sich die Punkte zu einer Wolke auf
          float burst = sin(uMorph * 3.14159);
          vec3 dir = normalize(p + vec3(0.001, 6.0, 0.001));
          p += dir * burst * (3.0 + fract(aSeed * .37) * 10.0);
          p += vec3(sin(uTime * .6 + aSeed), sin(uTime * .5 + aSeed * 1.7), cos(uTime * .55 + aSeed)) * (.35 + burst * 3.5);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dist = -mv.z;
          float tw = .7 + .3 * sin(aSeed * 5.3 + uTime * .9);
          vec3 c = mix(aColor, uLime, uSpark * step(.82, fract(aSeed * .53)));
          vAlpha = clamp(aBright * tw * (1.0 - burst * .55) * .7, 0.0, 1.2);
          vColor = c;
          gl_PointSize = clamp(.9 * (780.0 / max(dist, 20.0)) * 1.15, 1.8, 6.5);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec2 d = gl_PointCoord - vec2(.5); float r = length(d) * 2.0;
          if (r > 1.0) discard;
          float core = smoothstep(1.0, .45, r); float halo = pow(1.0 - r, 2.0) * .5;
          gl_FragColor = vec4(vColor * (core + halo), 1.0) * vAlpha * (core * 1.05 + halo * .8);
        }`,
    })
    const morphPoints = new THREE.Points(mGeom, mMat)
    morphPoints.position.copy(STAGE)
    morphPoints.scale.setScalar(1.05)
    morphPoints.frustumCulled = false
    scene.add(morphPoints)
    let formIdx = -1

    // --- Reise zum Thema -------------------------------------------------------
    // Der Startscreen meldet das Thema der aktuellen Frage. Die Kamera löst sich dann aus der
    // Umkreisung und fährt weich an den passenden Ort (Haus am Südufer, Windpark, Stadt), die
    // Punkte-Bühne wandert mit und baut dort die passende Form auf. Ohne Thema läuft alles wie bisher.
    const TOPIC_FORM: Record<string, number> = { waermepumpe: 1, photovoltaik: 0, emobilitaet: 2, strom: 3, fernwaerme: 4 }
    const journey = { on: 0, target: STAGE.clone(), stagePos: STAGE.clone(), form: -1, morphT: 1, mode: 'cycle' as 'cycle' | 'journey', lastForm: 0 }
    const jTargetWanted = STAGE.clone(), jStageWanted = STAGE.clone()
    let jWanted = 0
    const topicTarget = (topic: string | null) => {
      if (!topic || !(topic in TOPIC_FORM)) return null
      if (topic === 'strom') { const w = TURBS[1]; return new THREE.Vector3(w.x, w.base + 60, w.z) }
      if (topic === 'fernwaerme') { const m = markInfo['muenster']; return m ? m.c.clone().setY(m.c.y + 20) : null }
      return STAGE.clone()
    }

    // Ausdehnung jedes Schauplatzes, daraus ergibt sich, was gerade gezeigt wird
    const markInfo: Record<string, { c: THREE.Vector3; r: number }> = {}
    {
      // Ohne Objekte: Die Schleife läuft über rund 34.000 Punkte, mit Vector3 je Punkt wären das
      // etwa 70.000 kurzlebige Objekte allein für die Hüllquader.
      const box: Record<number, number[]> = {}   // [minX,minY,minZ, maxX,maxY,maxZ]
      for (const q of PT) {
        if (q.g < 0) continue
        const b = box[q.g] || (box[q.g] = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9])
        if (q.x < b[0]) b[0] = q.x
        if (q.y < b[1]) b[1] = q.y
        if (q.z < b[2]) b[2] = q.z
        if (q.x > b[3]) b[3] = q.x
        if (q.y > b[4]) b[4] = q.y
        if (q.z > b[5]) b[5] = q.z
      }
      for (let i = 0; i < GROUPS.length; i++) {
        const b = box[i]; if (!b) continue
        const c = new THREE.Vector3((b[0] + b[3]) * .5, (b[1] + b[4]) * .5, (b[2] + b[5]) * .5)
        markInfo[(GROUPS as any[])[i].name] = { c, r: Math.max(b[3] - b[0], b[5] - b[2], b[4] - b[1]) }
      }
    }
    const camPos = new THREE.Vector3(), camLook = new THREE.Vector3()
    const tmpV = new THREE.Vector3(), nearV = new THREE.Vector3(), lookV = new THREE.Vector3()

    // --- Ruhige Kameraführung --------------------------------------------------
    // Kein Flug mehr: Die Kamera steht vor der Skyline und atmet nur leicht.
    // Sie driftet seitlich, hebt und senkt sich minimal. Die Szene bleibt damit
    // das, was sie sein soll, ein ruhiger Hintergrund hinter der Oberfläche.
    const CTR3 = new THREE.Vector3(CTR.x, CTR.y, CTR.z)   // Stadtzentrum, wie in p5
    const ROUND = 210        // gemeinsame Periode: Kamera, Blick und Bühne laufen synchron                                   // Sekunden für einen Atemzug der Kamera

    // --- Kamera ---------------------------------------------------------------
    const clock = new THREE.Clock()
    let elapsed = 0
    const fwd = new THREE.Vector3()

    // Hintergrund mit 30 Bildern pro Sekunde: die Szene bewegt sich langsam,
    // mehr Bilder kosten nur Rechenleistung, sichtbar wird davon nichts.
    const FPS = 30
    let last = -1e9
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!running) return
      if (now - last < 1000 / FPS - 1.5) return
      last = now
      const dt = Math.min(clock.getDelta(), .1)
      elapsed += dt
      const t = elapsed
      uniforms.uTime.value = t
      const u = (t / ROUND) % 1
      const ang = u * Math.PI * 2
      // Umkreisung des Stadtzentrums, Höhe und Blick wiegen sich, wie in p5
      camPos.set(
        CTR3.x + Math.sin(ang) * 300,
        70 + Math.sin(ang * 2) * 26,
        CTR3.z - Math.cos(ang) * 260 - 150,
      )
      camLook.set(
        CTR3.x + Math.sin(ang * 2) * 60,
        64,
        CTR3.z + Math.cos(ang * 2) * 40,
      )
      // Reise: Ziel und Anteil weich nachführen, dann Umkreisung und Nahpose mischen
      {
        // deutlich langsamer als zuvor, damit die Wahrzeichen auf dem Weg zu sehen sind
        const k = 1 - Math.exp(-dt * .22)
        journey.target.lerp(jTargetWanted, k)
        journey.stagePos.lerp(jStageWanted, k)
        journey.on += (jWanted - journey.on) * (1 - Math.exp(-dt * .16))
        const s = journey.on * journey.on * (3 - 2 * journey.on)
        if (s > .001) {
          // Anflug als Bogen von links nach rechts: der Blickwinkel schwenkt beim Näherkommen um rund 100 Grad
          const a2 = t * .05 + (1 - s) * 1.8
          nearV.set(journey.target.x + Math.sin(a2) * 170, journey.target.y + 62, journey.target.z - Math.cos(a2) * 170)
          lookV.set(journey.target.x, journey.target.y + 8, journey.target.z)
          camPos.lerp(nearV, s)
          camLook.lerp(lookV, s)
        }
        morphPoints.position.copy(journey.stagePos)
      }
      camera.position.copy(camPos)
      camera.lookAt(camLook)

      // Energiepunkt: zieht auf einer harmonischen Bahn durch die Welt und
      // lässt die Punkte, an denen er vorbeikommt, kurz aufleuchten. Die Spur
      // entsteht allein aus diesen Punkten.
      {
        const tr = uniforms.uTrail.value as THREE.Vector3[]
        const am = uniforms.uTrailAmt.value as Float32Array
        for (let i = tr.length - 1; i > 0; i--) { tr[i].copy(tr[i - 1]); am[i] = am[i - 1] * .74 }
        const w = t * .17
        tr[0].set(
          Math.sin(w * 1.00) * 300 + Math.sin(w * 0.37 + 1.3) * 110,
          64 + Math.sin(w * 0.73 + .6) * 46 + Math.sin(w * 1.9) * 9,
          Math.cos(w * 0.81 + .4) * 300 + Math.cos(w * 0.29) * 90,
        )
        am[0] = 1
      }

      // Was die Kamera sieht, setzt sich zusammen. Was aus dem Bild wandert,
      // löst sich wieder auf. Dadurch passiert der Aufbau immer wieder neu.
      {
        const asm = uniforms.uAssemble.value as Float32Array
        camera.getWorldDirection(fwd)
        // Halber Öffnungswinkel: hängt nur am Sichtfeld der Kamera, gehört also nicht in die Schleife.
        const half = THREE.MathUtils.degToRad(camera.fov * .5) * .8
        for (let i = 0; i < GROUPS.length && i < asm.length; i++) {
          const m = markInfo[(GROUPS as any[])[i].name]
          if (!m) { asm[i] = 1; continue }
          const to = tmpV.copy(m.c).sub(camera.position)
          const dist = to.length()
          to.normalize()
          const ang2 = Math.acos(Math.max(-1, Math.min(1, to.dot(fwd))))   // Winkel zur Blickachse
          const seen = ang2 < half && dist < 900
          asm[i] += ((seen ? 1 : 0) - asm[i]) * dt * (seen ? .85 : .45)
        }
      }

      // Herzschlag: reihum schwillt ein Wahrzeichen an und tritt hervor
      {
        const gl = uniforms.uGlow.value as Float32Array
        const n = Math.min(GROUPS.length, gl.length)
        const slot = 1 / n
        for (let i = 0; i < n; i++) {
          const x = ((u - i * slot) % 1 + 1) % 1 / slot          // Position im eigenen Fenster
          const beat =
            Math.exp(-Math.pow((x - .16) / .055, 2)) +
            Math.exp(-Math.pow((x - .30) / .075, 2)) * .6
          const swell = Math.exp(-Math.pow((x - .3) / .34, 2)) * .45
          gl[i] = Math.min(1.5, beat * .9 + swell)
        }
      }

      // Morph-Bühne, exakt an die Periode gekoppelt: sieben Formen je Runde,
      // dadurch ist der Zyklus geschlossen und wiederholt sich sauber.
      mUniforms.uTime.value = t
      if (journey.mode === 'journey') {
        // Themenform: einmal umbauen (1,6 s), dann stehen lassen
        journey.morphT = Math.min(1, journey.morphT + dt / 1.6)
        mUniforms.uMorph.value = journey.morphT
      } else {
        const segs = forms.length
        const fu = u * segs
        const idx = Math.floor(fu) % segs
        const prog = fu - Math.floor(fu)
        if (idx !== formIdx) {
          formIdx = idx
          journey.lastForm = idx
          mFrom.set(forms[(idx + segs - 1) % segs].pos)
          mTo.set(forms[idx].pos)
          ;(mGeom.getAttribute('aFrom') as THREE.BufferAttribute).needsUpdate = true
          ;(mGeom.getAttribute('aTo') as THREE.BufferAttribute).needsUpdate = true
        }
        // erste 22 Prozent des Abschnitts: umbauen, danach steht die Form
        mUniforms.uMorph.value = Math.min(1, prog / .22)
      }
      mUniforms.uSpark.value = .35 + .35 * Math.sin(t * .8)

      // Windräder und Lüfter
      let mi = 0
      const set = (x: number, y: number, z: number) => { movPos[mi * 3] = x; movPos[mi * 3 + 1] = y; movPos[mi * 3 + 2] = z; mi++ }
      for (const w of TURBS) {
        const hub = w.base + 92 * w.s
        for (let i = 0; i < 26; i++) set(w.x, w.base + (hub - w.base) * (i / 25), w.z)
        for (let bl = 0; bl < 3; bl++) {
          const ang = t * w.sp + bl * Math.PI * 2 / 3
          for (let i = 1; i <= 16; i++) {
            const r = (i / 16) * 52 * w.s
            set(w.x + Math.cos(ang) * r * .18, hub + Math.sin(ang) * r, w.z + Math.cos(ang) * r * .98)
          }
        }
      }
      for (const f of FAN) {
        const a2 = f.a0 + t * 1.5
        set(f.x, f.y + Math.sin(a2) * f.r, f.z + Math.cos(a2) * f.r)
      }
      ;(movGeom.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(frame)

    const unsub = ambient.subscribe((r) => { running = r && !reduceMotion })
    const unsubTopic = sceneBus.subscribe((topic) => {
      const target = topicTarget(topic)
      if (!target) {
        jWanted = 0; jStageWanted.copy(STAGE)
        if (journey.mode === 'journey') { journey.mode = 'cycle'; formIdx = -1 }
        return
      }
      jWanted = 1; jTargetWanted.copy(target)
      // Bühne wandert für Windpark und Stadt mit, sonst bleibt sie am Südufer
      jStageWanted.copy(topic === 'strom' || topic === 'fernwaerme' ? target : STAGE)
      const form = TOPIC_FORM[topic!]
      if (journey.mode !== 'journey' || journey.form !== form) {
        mFrom.set(forms[journey.mode === 'journey' ? journey.form : journey.lastForm].pos)
        mTo.set(forms[form].pos)
        ;(mGeom.getAttribute('aFrom') as THREE.BufferAttribute).needsUpdate = true
        ;(mGeom.getAttribute('aTo') as THREE.BufferAttribute).needsUpdate = true
        journey.form = form; journey.morphT = 0; journey.mode = 'journey'
      }
    })
    return () => {
      unsub(); unsubTopic(); cancelAnimationFrame(raf); running = false
      geom.dispose(); movGeom.dispose(); material.dispose(); mGeom.dispose(); mMat.dispose()
      sky.geometry.dispose(); (sky.material as THREE.Material).dispose()
      renderer.dispose(); renderer.forceContextLoss(); el.removeChild(renderer.domElement)
    }
  }, [width, height])

  return <div ref={host} style={{ width, height, pointerEvents: 'none' }} aria-hidden="true" />
}
