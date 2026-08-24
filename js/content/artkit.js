/* Shared SVG art for the standards questions. Several Grade 3/4 standards are
   about reading a picture (a clock, a bar graph, a number line, an angle), so
   the picture is the question and cannot be written as text.

   Everything here returns an <svg> string for session.js to drop into .artbox.
   Colors come from CSS vars only, so each drawing works in both themes. */

const INK = 'var(--ink)';
const LINE = 'var(--line)';
const FILL = 'var(--frac)';
const SUNK = 'var(--sunk)';

const svg = (w, h, body, label) =>
  `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- number line, partitioned into b, dot at a/b ---------- */
export function numberLine(b, a, opts = {}) {
  const W = 300, H = 62, x0 = 22, x1 = W - 22, y = 34;
  const step = (x1 - x0) / b;
  let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${INK}" stroke-width="2.5"/>`;
  for (let i = 0; i <= b; i++) {
    const x = x0 + i * step;
    const major = i === 0 || i === b;
    s += `<line x1="${x}" y1="${y - (major ? 12 : 7)}" x2="${x}" y2="${y + (major ? 12 : 7)}"
           stroke="${INK}" stroke-width="${major ? 2.5 : 1.6}"/>`;
    if (major) s += `<text x="${x}" y="${y + 27}" text-anchor="middle" font-size="13"
           fill="${INK}" font-weight="700">${i === 0 ? 0 : opts.endLabel || 1}</text>`;
  }
  if (a !== null && a !== undefined)
    s += `<circle cx="${x0 + a * step}" cy="${y}" r="7" fill="${FILL}" stroke="${INK}" stroke-width="2"/>`;
  return svg(W, H, s, `number line from 0 to 1 in ${b} parts with a dot at ${a} parts`);
}

/* ---------- analog clock ---------- */
export function clockFace(h, m) {
  const W = 150, H = 150, c = 75, r = 62;
  let s = `<circle cx="${c}" cy="${c}" r="${r}" fill="${SUNK}" stroke="${INK}" stroke-width="3"/>`;
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 - 90) * Math.PI / 180;
    const big = i % 5 === 0;
    const r1 = r - (big ? 10 : 5);
    s += `<line x1="${(c + r1 * Math.cos(a)).toFixed(1)}" y1="${(c + r1 * Math.sin(a)).toFixed(1)}"
           x2="${(c + (r - 2) * Math.cos(a)).toFixed(1)}" y2="${(c + (r - 2) * Math.sin(a)).toFixed(1)}"
           stroke="${INK}" stroke-width="${big ? 2.4 : 1}"/>`;
  }
  for (let n = 1; n <= 12; n++) {
    const a = (n * 30 - 90) * Math.PI / 180, rr = r - 22;
    s += `<text x="${(c + rr * Math.cos(a)).toFixed(1)}" y="${(c + rr * Math.sin(a) + 5).toFixed(1)}"
           text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${n}</text>`;
  }
  const ma = (m * 6 - 90) * Math.PI / 180;
  const ha = ((h % 12) * 30 + m * 0.5 - 90) * Math.PI / 180;
  s += `<line x1="${c}" y1="${c}" x2="${(c + 34 * Math.cos(ha)).toFixed(1)}" y2="${(c + 34 * Math.sin(ha)).toFixed(1)}"
         stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<line x1="${c}" y1="${c}" x2="${(c + 50 * Math.cos(ma)).toFixed(1)}" y2="${(c + 50 * Math.sin(ma)).toFixed(1)}"
         stroke="${FILL}" stroke-width="3.4" stroke-linecap="round"/>`;
  s += `<circle cx="${c}" cy="${c}" r="4" fill="${INK}"/>`;
  return svg(W, H, s, 'clock face');
}

/* ---------- scaled bar graph ---------- */
export function barGraph(cats, vals, scale) {
  const W = 300, H = 170, x0 = 58, yBase = 132, bw = 30, gap = 14;
  const maxUnits = Math.max(...vals) / scale;
  const unitH = 100 / Math.max(1, maxUnits);
  let s = '';
  for (let u = 0; u <= maxUnits; u++) {
    const y = yBase - u * unitH;
    s += `<line x1="${x0 - 4}" y1="${y}" x2="${W - 8}" y2="${y}" stroke="${LINE}" stroke-width="1" opacity=".6"/>`;
    s += `<text x="${x0 - 9}" y="${y + 4}" text-anchor="end" font-size="11" fill="${INK}">${u * scale}</text>`;
  }
  cats.forEach((c, i) => {
    const x = x0 + i * (bw + gap);
    const h = (vals[i] / scale) * unitH;
    s += `<rect x="${x}" y="${yBase - h}" width="${bw}" height="${h}" fill="${FILL}" stroke="${INK}" stroke-width="1.6"/>`;
    s += `<text x="${x + bw / 2}" y="${yBase + 15}" text-anchor="middle" font-size="11" fill="${INK}" font-weight="700">${c}</text>`;
  });
  s += `<line x1="${x0 - 4}" y1="${yBase}" x2="${W - 8}" y2="${yBase}" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="${INK}">each line = ${scale}</text>`;
  return svg(W, H, s, 'scaled bar graph');
}

/* ---------- line plot over fractional units ---------- */
export function linePlot(den, counts, opts = {}) {
  const W = 300, H = 132, x0 = 26, x1 = W - 20, yBase = 96;
  const n = counts.length - 1;
  const step = (x1 - x0) / n;
  let s = `<line x1="${x0}" y1="${yBase}" x2="${x1}" y2="${yBase}" stroke="${INK}" stroke-width="2.5"/>`;
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * step;
    s += `<line x1="${x}" y1="${yBase - 5}" x2="${x}" y2="${yBase + 5}" stroke="${INK}" stroke-width="1.8"/>`;
    const whole = i / den;
    const lbl = i % den === 0 ? String(whole) : `${i}/${den}`;
    s += `<text x="${x}" y="${yBase + 20}" text-anchor="middle" font-size="10" fill="${INK}">${lbl}</text>`;
    for (let k = 0; k < counts[i]; k++)
      s += `<text x="${x}" y="${yBase - 12 - k * 15}" text-anchor="middle" font-size="15"
             fill="${FILL}" font-weight="800">X</text>`;
  }
  if (opts.unit) s += `<text x="${W / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="${INK}">${opts.unit}</text>`;
  return svg(W, H, s, 'line plot');
}

/* ---------- rectangle tiled with unit squares ---------- */
export function tiledRect(w, h, opts = {}) {
  const cell = Math.max(14, Math.min(30, Math.floor(260 / Math.max(w, h))));
  const W = w * cell + 46, H = h * cell + 40, x0 = 34, y0 = 8;
  let s = '';
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++)
    s += `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${cell}" height="${cell}"
           fill="${opts.plain ? SUNK : FILL}" stroke="${INK}" stroke-width="1.4"/>`;
  s += `<text x="${x0 + (w * cell) / 2}" y="${y0 + h * cell + 20}" text-anchor="middle"
         font-size="12" fill="${INK}" font-weight="700">${w}</text>`;
  s += `<text x="${x0 - 12}" y="${y0 + (h * cell) / 2 + 4}" text-anchor="middle"
         font-size="12" fill="${INK}" font-weight="700">${h}</text>`;
  return svg(W, H, s, `rectangle ${w} by ${h} tiled with unit squares`);
}

/* ---------- an array of dots: 3.OA groups and arrays ---------- */
export function dotArray(rows, cols) {
  const cell = Math.max(16, Math.min(28, Math.floor(240 / cols)));
  const W = cols * cell + 20, H = rows * cell + 20;
  let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    s += `<circle cx="${10 + c * cell + cell / 2}" cy="${10 + r * cell + cell / 2}"
           r="${cell * 0.32}" fill="${FILL}" stroke="${INK}" stroke-width="1.4"/>`;
  return svg(W, H, s, `${rows} rows of ${cols} dots`);
}

/* ---------- angle drawn from two rays ---------- */
export function angleArt(deg, opts = {}) {
  const W = 240, H = 150, vx = 40, vy = 118, len = 150;
  const a = -deg * Math.PI / 180;
  const x2 = vx + len * Math.cos(a), y2 = vy + len * Math.sin(a);
  let s = `<path d="M ${vx + 34} ${vy} A 34 34 0 0 0 ${(vx + 34 * Math.cos(a)).toFixed(1)} ${(vy + 34 * Math.sin(a)).toFixed(1)}"
            fill="none" stroke="${FILL}" stroke-width="3"/>`;
  s += `<line x1="${vx}" y1="${vy}" x2="${vx + len}" y2="${vy}" stroke="${INK}" stroke-width="3"/>`;
  s += `<line x1="${vx}" y1="${vy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="3"/>`;
  s += `<circle cx="${vx}" cy="${vy}" r="4" fill="${INK}"/>`;
  if (opts.label) s += `<text x="${vx + 52}" y="${vy - 14}" font-size="13" fill="${INK}" font-weight="700">${opts.label}</text>`;
  return svg(W, H, s, `an angle of about ${deg} degrees`);
}

/* ---------- two angles side by side sharing a ray (4.MD.C.7) ---------- */
export function angleSplit(a1, a2, knownLabel, unknownLabel) {
  const W = 250, H = 150, vx = 34, vy = 120, len = 150;
  const mk = d => [vx + len * Math.cos(-d * Math.PI / 180), vy + len * Math.sin(-d * Math.PI / 180)];
  const [mx, my] = mk(a1), [tx, ty] = mk(a1 + a2);
  let s = `<line x1="${vx}" y1="${vy}" x2="${vx + len}" y2="${vy}" stroke="${INK}" stroke-width="3"/>`;
  s += `<line x1="${vx}" y1="${vy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${INK}" stroke-width="3"/>`;
  s += `<line x1="${vx}" y1="${vy}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="${INK}" stroke-width="3"/>`;
  const arc = (r, d1, d2, col) => {
    const [x1, y1] = [vx + r * Math.cos(-d1 * Math.PI / 180), vy + r * Math.sin(-d1 * Math.PI / 180)];
    const [x2, y2] = [vx + r * Math.cos(-d2 * Math.PI / 180), vy + r * Math.sin(-d2 * Math.PI / 180)];
    return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}"
             fill="none" stroke="${col}" stroke-width="3"/>`;
  };
  s += arc(30, 0, a1, FILL) + arc(52, a1, a1 + a2, 'var(--accent2)');
  /* Sit each label on its own angle bisector so it never lands on an arc. */
  const at = (deg, r) => [vx + r * Math.cos(-deg * Math.PI / 180), vy + r * Math.sin(-deg * Math.PI / 180)];
  const [kx, ky] = at(a1 / 2, 46);
  const [ux, uy] = at(a1 + a2 / 2, 72);
  s += `<text x="${kx.toFixed(1)}" y="${ky.toFixed(1)}" font-size="13" fill="${INK}"
         font-weight="700" text-anchor="middle" dominant-baseline="middle">${knownLabel}</text>`;
  s += `<text x="${ux.toFixed(1)}" y="${uy.toFixed(1)}" font-size="13" fill="${INK}"
         font-weight="700" text-anchor="middle" dominant-baseline="middle">${unknownLabel}</text>`;
  s += `<circle cx="${vx}" cy="${vy}" r="4" fill="${INK}"/>`;
  return svg(W, H, s, 'two angles sharing a ray');
}

/* ---------- polygons for the geometry standards ---------- */
const POLY = {
  square:        [[30,20],[130,20],[130,120],[30,120]],
  rectangle:     [[16,32],[164,32],[164,110],[16,110]],
  rhombus:       [[80,16],[150,70],[80,124],[10,70]],
  parallelogram: [[40,24],[168,24],[128,116],[0,116]],
  trapezoid:     [[48,24],[132,24],[168,116],[12,116]],
  righttri:      [[24,120],[24,24],[136,120]],
  acutetri:      [[80,20],[150,120],[10,120]],
  obtusetri:     [[20,110],[170,110],[54,34]],
  pentagon:      [[80,14],[148,62],[122,132],[38,132],[12,62]],
  hexagon:       [[54,16],[122,16],[156,70],[122,124],[54,124],[20,70]]
};

export function polygon(kind, opts = {}) {
  const pts = POLY[kind];
  const W = 190, H = 145;
  let s = `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${SUNK}"
            stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  if (opts.mirror) {
    const [[ax, ay], [bx, by]] = opts.mirror;
    s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${FILL}"
           stroke-width="2.6" stroke-dasharray="7 5"/>`;
  }
  return svg(W, H, s, kind);
}

export const POLY_KINDS = Object.keys(POLY);

/* ---------- pairs of lines: parallel, perpendicular, intersecting ---------- */
export function linePair(kind) {
  const W = 200, H = 130;
  let s = '';
  if (kind === 'parallel')
    s = `<line x1="16" y1="42" x2="184" y2="42" stroke="${INK}" stroke-width="3"/>
         <line x1="16" y1="92" x2="184" y2="92" stroke="${INK}" stroke-width="3"/>`;
  else if (kind === 'perpendicular')
    s = `<line x1="16" y1="92" x2="184" y2="92" stroke="${INK}" stroke-width="3"/>
         <line x1="96" y1="16" x2="96" y2="118" stroke="${INK}" stroke-width="3"/>
         <rect x="96" y="76" width="16" height="16" fill="none" stroke="${FILL}" stroke-width="2.4"/>`;
  else
    s = `<line x1="14" y1="104" x2="186" y2="34" stroke="${INK}" stroke-width="3"/>
         <line x1="26" y1="22" x2="170" y2="112" stroke="${INK}" stroke-width="3"/>`;
  return svg(W, H, s, kind + ' lines');
}
