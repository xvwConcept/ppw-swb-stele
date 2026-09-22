// @ts-nocheck
// ---------------------------------------------------------------------------
// Die Welt der Bonner Lichtpunkt-Wolke: Gelände, Rhein, Stadt am Nordufer,
// Wahrzeichen, Windpark und die drei Anlässe (Wärmepumpe, Solardach, Ladepunkt).
// Unverändert aus der bisherigen Fassung übernommen, nur vom Zeichnen getrennt,
// damit dieselbe Welt in WebGL gerendert werden kann.
// Maße in Metern.
// ---------------------------------------------------------------------------
export function buildWorld() {
  let seed = 20260919;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

  // --- Punktwolke -------------------------------------------------------------
  // Ein Punkt: x,y,z Welt, b Grundhelligkeit, ph Phase fürs Glimmen, g Gruppe
  const PT = [];
  const GROUPS = [];                       // Wahrzeichen mit Kanten für das Drahtmodell
  const addPt = (x, y, z, b, g) => { PT.push({ x, y, z, b, ph: rnd() * 90, g: g === undefined ? -1 : g }); };

  const group = (name, edges) => { GROUPS.push({ name, edges, on: 0 }); return GROUPS.length - 1; };
  const boxEdges = (x, y, z, w, h, d) => {
    const X = x + w, Y = y + h, Z = z + d;
    return [[[x, y, z], [X, y, z]], [[X, y, z], [X, y, Z]], [[X, y, Z], [x, y, Z]], [[x, y, Z], [x, y, z]],
    [[x, Y, z], [X, Y, z]], [[X, Y, z], [X, Y, Z]], [[X, Y, Z], [x, Y, Z]], [[x, Y, Z], [x, Y, z]],
    [[x, y, z], [x, Y, z]], [[X, y, z], [X, Y, z]], [[X, y, Z], [X, Y, Z]], [[x, y, Z], [x, Y, Z]]];
  };
  // Quader als Punktwolke: Fassadenraster auf allen vier Seiten, Kanten dichter
  const boxPts = (x, z, w, d, h, step, dens, g, bright) => {
    for (let yy = step * .5; yy < h; yy += step) {
      for (let xx = 0; xx <= w; xx += step) {
        if (rnd() < dens) addPt(x + xx, yy, z, bright * (.5 + rnd() * .7), g);
        if (rnd() < dens) addPt(x + xx, yy, z + d, bright * (.4 + rnd() * .6), g);
      }
      for (let zz = step; zz < d; zz += step) {
        if (rnd() < dens * .8) addPt(x, yy, z + zz, bright * (.4 + rnd() * .6), g);
        if (rnd() < dens * .8) addPt(x + w, yy, z + zz, bright * (.4 + rnd() * .6), g);
      }
    }
    const jit = () => (rnd() - .5) * step * .9;
    for (let xx = 0; xx <= w; xx += step * .8) {
      addPt(x + xx + jit(), h + jit() * .35, z + jit() * .5, bright * 1.05, g);
      addPt(x + xx + jit(), h + jit() * .35, z + d + jit() * .5, bright * .85, g);
    }
    for (let zz = 0; zz <= d; zz += step * .8) {
      addPt(x + jit() * .5, h + jit() * .35, z + zz + jit(), bright * .85, g);
      addPt(x + w + jit() * .5, h + jit() * .35, z + zz + jit(), bright * .85, g);
    }
  };
  // Turmspitze als Punktpyramide
  const spirePts = (cx, cz, base, top, r, g, bright) => {
    for (let i = 0; i < 90; i++) {
      const u = rnd(), a = rnd() * Math.PI * 2, rr = r * (1 - u);
      addPt(cx + Math.cos(a) * rr, base + (top - base) * u, cz + Math.sin(a) * rr, bright * (.5 + rnd() * .6), g);
    }
  };

  // Gelände: Hügelband im Norden, flaches Ufer, Siebengebirge im Süden
  const terrainH = (x, z) => {
    let h = 2;
    h += Math.max(0, Math.sin((x + 900) * .0016) * 26 + Math.sin(z * .004) * 10) * (z > 340 ? 1 : .25);
    if (z > 620) h += Math.pow((z - 620) / 260, 1.5) * (70 + Math.sin(x * .004) * 46);
    if (x > 60 && x < 420 && z > 700) h += Math.exp(-Math.pow((x - 240) / 150, 2)) * 120;  // Drachenfels
    return h;
  };
  for (let i = 0; i < 3600; i++) {
    const x = -760 + rnd() * 1520, z = -320 + rnd() * 1200;
    if (z > -40 && z < 150) continue;                       // Flussbett bleibt frei
    const y = terrainH(x, z);
    addPt(x, y, z, .11 + rnd() * .16 + (y > 60 ? .07 : 0));
  }
  // Südufer im Vordergrund: Promenade und Baumreihe als lockere Punkte
  for (let i = 0; i < 900; i++) { const x = -700 + rnd() * 1400; addPt(x, 3 + rnd() * 2, -70 - rnd() * 40, .16 + rnd() * .22); }
  for (let i = 0; i < 26; i++) {
    const x = -680 + i * 54 + rnd() * 16, z = -120 - rnd() * 60, h = 9 + rnd() * 7;
    for (let k = 0; k < 40; k++) {
      const u = rnd(), a2 = rnd() * Math.PI * 2, rr = (1 - Math.abs(u - .6)) * 6.5;
      addPt(x + Math.cos(a2) * rr, h * .5 + u * h, z + Math.sin(a2) * rr, .12 + rnd() * .2);
    }
  }
  // Rhein: Punkte auf der Wasserfläche, sie wogen später
  for (let i = 0; i < 1500; i++) addPt(-760 + rnd() * 1520, 0, -40 + rnd() * 190, .07 + rnd() * .2, -2);

  // --- Stadt am Nordufer ------------------------------------------------------
  const Z0 = 190;
  // Quartier und Altstadt
  for (let i = 0; i < 16; i++) {
    const x = -700 + i * 56 + rnd() * 20, h = 14 + rnd() * 22, w = 26 + rnd() * 16, d = 20 + rnd() * 12;
    boxPts(x, Z0 + rnd() * 70, w, d, h, 4.2, .34, -1, .5);
  }
  for (let i = 0; i < 10; i++) {
    const x = 180 + i * 62 + rnd() * 20, h = 16 + rnd() * 26;
    boxPts(x, Z0 + 40 + rnd() * 90, 28 + rnd() * 18, 22, h, 4.4, .32, -1, .45);
  }
  // Bonner Münster
  const gMuenster = group('muenster', [
    ...boxEdges(-330, 0, Z0 + 10, 54, 26, 24),
    ...boxEdges(-322, 0, Z0 + 12, 12, 52, 12), ...boxEdges(-280, 0, Z0 + 12, 12, 52, 12),
    ...boxEdges(-306, 0, Z0 + 14, 16, 74, 16),
  ]);
  boxPts(-330, Z0 + 10, 54, 24, 26, 2.2, .62, gMuenster, .7);
  boxPts(-322, Z0 + 12, 12, 12, 52, 3.2, .6, gMuenster, .8);
  boxPts(-280, Z0 + 12, 12, 12, 52, 3.2, .6, gMuenster, .8);
  boxPts(-306, Z0 + 14, 16, 16, 74, 2.2, .72, gMuenster, .85);
  spirePts(-316, Z0 + 18, 52, 70, 6, gMuenster, .8);
  spirePts(-274, Z0 + 18, 52, 70, 6, gMuenster, .8);
  spirePts(-298, Z0 + 22, 74, 96, 8, gMuenster, .95);
  // Bundeskunsthalle mit den drei Kegeln
  const gKunst = group('kunsthalle', boxEdges(-120, 0, Z0 + 30, 62, 20, 30));
  boxPts(-120, Z0 + 30, 62, 30, 20, 2.4, .58, gKunst, .6);
  for (const cx of [-104, -86, -68]) spirePts(cx, Z0 + 45, 20, 44, 7, gKunst, .9);
  // Post Tower, zwei Fassadenschalen mit Fuge
  const gPost = group('post', [...boxEdges(120, 0, Z0 + 70, 17, 162, 19), ...boxEdges(140, 0, Z0 + 70, 17, 162, 19)]);
  boxPts(120, Z0 + 70, 17, 19, 162, 2.4, .8, gPost, 1);
  boxPts(140, Z0 + 70, 17, 19, 162, 2.4, .8, gPost, 1);
  // Langer Eugen
  const gEugen = group('eugen', boxEdges(200, 0, Z0 + 60, 24, 114, 24));
  boxPts(200, Z0 + 60, 24, 24, 114, 2.4, .72, gEugen, .9);
  // Kurfürstliches Schloss als langer Riegel
  const gSchloss = group('schloss', boxEdges(-620, 0, Z0 + 120, 150, 22, 20));
  boxPts(-620, Z0 + 120, 150, 20, 22, 3.0, .52, gSchloss, .55);

  // Kennedybrücke: Bogen über den Rhein, quer zur Flussachse
  const gBruecke = group('bruecke', []);
  for (let i = 0; i <= 120; i++) {
    const u = i / 120, z = -30 + u * 200, y = 6 + Math.sin(u * Math.PI) * 17;
    addPt(-150, y, z, .5 + rnd() * .3, gBruecke); addPt(-134, y, z, .45 + rnd() * .3, gBruecke);
    if (i % 12 === 0) for (let k = 0; k < 6; k++) addPt(-150 + rnd() * 16, y - k * 2.4, z, .3, gBruecke);
  }
  GROUPS[gBruecke].edges = [[[-150, 6, -30], [-150, 6, 170]], [[-134, 6, -30], [-134, 6, 170]]];

  // Windpark auf dem Höhenzug
  const TURB = [
    { x: -420, z: 760, s: 1.0, sp: .30 }, { x: -230, z: 830, s: 1.25, sp: .21 }, { x: -40, z: 790, s: .85, sp: .38 },
  ];
  for (const w of TURB) w.base = terrainH(w.x, w.z);

  // Sterne: sehr weit entfernte Punkte, bleiben beim Schwenk stehen
  const STARS = [];
  for (let i = 0; i < 260; i++) {
    const a2 = rnd() * Math.PI * 2, el = .05 + rnd() * .5, R = 4200;
    STARS.push({ x: Math.sin(a2) * R * Math.cos(el), y: 300 + Math.sin(el) * R * .5, z: Math.cos(a2) * R * Math.cos(el), b: .1 + rnd() * .5, ph: rnd() * 90 });
  }

  // Die Produkte (Haus, Solardach, Wärmepumpe, Wallbox) stehen nicht mehr als
  // feste Objekte in der Welt, sie entstehen nacheinander auf der Morph-Bühne.
  const FAN = [];
  const SPOTS = {};

  const housePts = (x, y, z, w, d, h, g, step, bright) => {
    for (let yy = step; yy < h; yy += step) for (let xx = 0; xx <= w; xx += step) {
      if (rnd() < .5) addPt(x + xx, y + yy, z, bright * (.5 + rnd() * .6), g);
      if (rnd() < .35) addPt(x + xx, y + yy, z + d, bright * (.4 + rnd() * .5), g);
    }
    for (let yy = step; yy < h; yy += step) for (let zz = step; zz < d; zz += step) {
      if (rnd() < .35) addPt(x, y + yy, z + zz, bright * (.45 + rnd() * .5), g);
      if (rnd() < .35) addPt(x + w, y + yy, z + zz, bright * (.45 + rnd() * .5), g);
    }
    // Satteldach
    for (let zz = 0; zz <= d; zz += step * .8) for (let u = 0; u <= 1; u += step / w) {
      const hx = u * w, hy = h + (1 - Math.abs(u - .5) * 2) * (w * .3);
      if (rnd() < .5) addPt(x + hx, y + hy, z + zz, bright * (.6 + rnd() * .6), g);
    }
  };
  // Quartier rund um die Anlässe: gibt den Flügen Tiefe und Maßstab
  {
    const rows = [
      { z: -300, n: 9, x0: -330, dx: 62 },
      { z: -196, n: 8, x0: -300, dx: 66 },
      { z: -128, n: 7, x0: -260, dx: 72 },
    ];
    for (const r of rows) for (let i = 0; i < r.n; i++) {
      const x = r.x0 + i * r.dx + rnd() * 14, w = 9 + rnd() * 6, d = 7 + rnd() * 4, h = 4.5 + rnd() * 3.5;
      if (Math.abs(x + 150) < 26 || Math.abs(x - 30) < 26 || Math.abs(x - 210) < 22) continue;
      housePts(x, 0, r.z + rnd() * 10, w, d, h, -1, .55, .3);
    }
    for (let i = 0; i < 34; i++) {
      const x = -360 + rnd() * 740, z = -320 + rnd() * 230, h = 5 + rnd() * 4;
      for (let k = 0; k < 34; k++) {
        const u = rnd(), a2 = rnd() * Math.PI * 2, rr = (1 - Math.abs(u - .62) * 1.4) * (2 + rnd() * 1.4);
        addPt(x + Math.cos(a2) * rr, h * .45 + u * h, z + Math.sin(a2) * rr, .10 + rnd() * .16);
      }
      for (let k = 0; k < 6; k++) addPt(x + rnd() * .5 - .25, k * .5, z, .12);
    }
    for (let x = -380; x < 400; x += 2.6) {
      addPt(x, .12, -166 + Math.sin(x * .01) * 3, .10 + rnd() * .12);
      addPt(x, .12, -160 + Math.sin(x * .01) * 3, .08 + rnd() * .1);
    }
    for (let i = 0; i < 12; i++) {
      const x = -340 + i * 64, z = -158 + Math.sin(x * .01) * 3;
      for (let k = 0; k < 16; k++) addPt(x, .3 + k * .44, z, .16 + rnd() * .1);
      for (let k = 0; k < 26; k++) { const a2 = rnd() * 7, rr = rnd() * 1.2; addPt(x + Math.cos(a2) * rr, 7.2 - rnd() * .5, z + Math.sin(a2) * rr, .55 + rnd() * .4); }
      for (let k = 0; k < 30; k++) { const u = rnd(); addPt(x + (rnd() - .5) * u * 7, 7 - u * 6.6, z + (rnd() - .5) * u * 7, .05 + (1 - u) * .12); }
    }
    for (let i = 0; i < 700; i++) addPt(-500 + rnd() * 1000, .4 + rnd() * 3.4, -340 + rnd() * 300, .05 + rnd() * .09);
  }

  // Schwebeteilchen für Tiefe beim Flug
  const DUST = [];
  for (let i = 0; i < 260; i++) DUST.push({ x: -700 + rnd() * 1400, y: 10 + rnd() * 260, z: -180 + rnd() * 900, ph: rnd() * 90 });

  // --- SWB-Zentrale als weiterer Anlass der Reise ----------------------------
  {
    // SWB-Zentrale am Nordufer: markanter Riegel mit leuchtender Krone
    const X = 320, Z = Z0 + 24, W2 = 46, D2 = 30, H2 = 44;
    const g = group('swb', boxEdges(X, 0, Z, W2, H2, D2));
    boxPts(X, Z, W2, D2, H2, 3.2, .6, g, .85);
    for (let i = 0; i <= W2; i += 1.4) { addPt(X + i, H2 + 3, Z, 1, g); addPt(X + i, H2 + 3, Z + D2, .9, g); }
    for (let i = 0; i < 120; i++) addPt(X + W2 * .5 + (rnd() - .5) * 26, H2 + 4 + rnd() * 9, Z + D2 * .5 + (rnd() - .5) * 18, .9 + rnd() * .3, g);
    SPOTS.swb = { x: X + W2 * .5, y: H2 * .6, z: Z + D2 * .5, r: 78, h: 26 };
  }

  // --- Energie im Boden: Adern, in denen ein Lichtpuls entlangläuft ----------
  // aSeed trägt die Position entlang der Ader, der Shader schickt darüber eine
  // Welle. Gruppe -6 markiert diese Punkte.
  const VEINS = [
    [[-600, 210], [-300, 205], [-60, 220], [140, 250], [330, 236], [560, 210]],   // entlang der Stadt
    [[320, 214], [210, 70], [110, -60], [73, -172]],                               // von der SWB-Zentrale zur Bühne
    [[-600, 60], [-360, -40], [-180, -160], [-70, -235]],                          // aus dem Umland
  ];
  for (const v of VEINS) {
    let acc = 0;
    for (let i = 0; i < v.length - 1; i++) {
      const [x0, z0] = v[i], [x1, z1] = v[i + 1];
      const L = Math.hypot(x1 - x0, z1 - z0), n = Math.round(L / 3.6);
      for (let k = 0; k < n; k++) {
        const u = k / n;
        const jx = (rnd() - .5) * 4.5, jz = (rnd() - .5) * 4.5;
        PT.push({ x: x0 + (x1 - x0) * u + jx, y: .1 + rnd() * .25, z: z0 + (z1 - z0) * u + jz, b: .32, ph: (acc + u * L) * .02, g: -6 });
      }
      acc += L;
    }
  }

  // --- Unsichtbares Punktfeld über der Szene ---------------------------------
  // Diese Punkte leuchten nur, wenn der Energiepunkt sie streift. Dadurch zeichnet
  // er seine Spur in die Luft, ohne dass eine Linie gezeichnet wird.
  for (let i = 0; i < 2000; i++) {
    const a = rnd() * Math.PI * 2, r = 60 + rnd() * 620;
    PT.push({ x: Math.cos(a) * r, y: 6 + rnd() * 150, z: Math.sin(a) * r, b: 0, ph: rnd() * 90, g: -7 });
  }

  // Reiseplan der Kamera
  const TOUR = [
    { k: 'city', dwell: 26 }, { k: 'wp', dwell: 20 }, { k: 'city', dwell: 20 },
    { k: 'pv', dwell: 19 }, { k: 'city', dwell: 20 }, { k: 'ev', dwell: 19 },
  ];
  const TRANS = 11;
  const CYCLE = TOUR.reduce((a, b) => a + b.dwell + TRANS, 0);
  const CTR = { x: -60, y: 46, z: 300 };

  return { PT, GROUPS, TURB, DUST, STARS, FAN, SPOTS, TOUR, TRANS, CYCLE, CTR, terrainH, rnd };
}
