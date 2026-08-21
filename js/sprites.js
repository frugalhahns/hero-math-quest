/* Original SVG sprites. Hand-drawn homages, not copied artwork.
   Every sprite is a pure function returning an SVG string. */

const wrap = (inner, vb = '0 0 64 64', cls = '') =>
  `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

/* --- Dash, the blue speedster --- */
export function speedster(mood = 'idle') {
  const eyeL = mood === 'happy' ? `<path d="M22 27 q4 -5 8 0" stroke="#0f1230" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : mood === 'sad' ? `<path d="M22 30 q4 4 8 0" stroke="#0f1230" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="26" cy="28" rx="4" ry="5.5" fill="#fff"/><circle cx="26.5" cy="29" r="2.2" fill="#0f1230"/>`;
  const eyeR = mood === 'happy' ? `<path d="M34 27 q4 -5 8 0" stroke="#0f1230" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : mood === 'sad' ? `<path d="M34 30 q4 4 8 0" stroke="#0f1230" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="37" cy="28" rx="4" ry="5.5" fill="#fff"/><circle cx="37.5" cy="29" r="2.2" fill="#0f1230"/>`;
  return wrap(`
    <g>
      <path d="M8 22 L2 14 L14 18 Z" fill="#1b5fd0"/>
      <path d="M6 34 L0 30 L12 30 Z" fill="#1b5fd0"/>
      <circle cx="32" cy="30" r="19" fill="#2a7bff"/>
      <path d="M14 20 L4 10 L18 15 Z" fill="#1f66d8"/>
      <path d="M13 30 L1 26 L15 25 Z" fill="#1f66d8"/>
      <path d="M15 40 L4 44 L17 45 Z" fill="#1f66d8"/>
      <ellipse cx="36" cy="36" rx="12" ry="10" fill="#f3c48a"/>
      <ellipse cx="42" cy="33" rx="3.4" ry="2.6" fill="#0f1230"/>
      ${eyeL}${eyeR}
      <circle cx="24" cy="12" r="4" fill="#2a7bff"/>
      <circle cx="40" cy="11" r="4" fill="#2a7bff"/>
      <path d="M22 52 q6 6 12 0 q-2 -5 -6 -5 q-4 0 -6 5" fill="#e63946"/>
      <circle cx="28" cy="52" r="3" fill="#fff"/>
    </g>`, '0 0 64 64', 'sp-speedster');
}

/* --- Web, the masked web-hero --- */
export function webhero(mood = 'idle') {
  const eyes = mood === 'sad'
    ? `<path d="M17 30 q6 6 12 1 l-1 6 q-7 3 -12 -2 Z" fill="#fff" stroke="#0f1230" stroke-width="1.6"/>
       <path d="M47 30 q-6 6 -12 1 l1 6 q7 3 12 -2 Z" fill="#fff" stroke="#0f1230" stroke-width="1.6"/>`
    : `<path d="M16 26 q8 -4 14 3 q-2 8 -9 8 q-6 0 -5 -11 Z" fill="#fff" stroke="#0f1230" stroke-width="1.8"/>
       <path d="M48 26 q-8 -4 -14 3 q2 8 9 8 q6 0 5 -11 Z" fill="#fff" stroke="#0f1230" stroke-width="1.8"/>`;
  return wrap(`
    <g>
      <circle cx="32" cy="30" r="21" fill="#e63946"/>
      <g stroke="#8f1620" stroke-width="1.1" fill="none" opacity=".85">
        <path d="M32 9 V51"/><path d="M11 30 H53"/>
        <path d="M17 15 L47 45"/><path d="M47 15 L17 45"/>
        <circle cx="32" cy="30" r="7"/><circle cx="32" cy="30" r="13"/><circle cx="32" cy="30" r="19"/>
      </g>
      ${eyes}
      <rect x="24" y="52" width="16" height="9" rx="3" fill="#2a7bff"/>
      <path d="M53 8 L60 4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <path d="M56 12 L62 10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </g>`, '0 0 64 64', 'sp-webhero');
}

/* --- Blocky, the cube-world miner --- */
export function miner(mood = 'idle') {
  const mouth = mood === 'happy' ? `<rect x="26" y="34" width="12" height="4" rx="1" fill="#3a2416"/>`
    : mood === 'sad' ? `<rect x="27" y="36" width="10" height="3" fill="#3a2416"/>`
    : `<rect x="27" y="35" width="10" height="3" fill="#3a2416"/>`;
  return wrap(`
    <g shape-rendering="crispEdges">
      <rect x="14" y="10" width="36" height="34" fill="#c8956b"/>
      <rect x="14" y="10" width="36" height="9" fill="#4a3421"/>
      <rect x="14" y="19" width="6" height="6" fill="#4a3421"/>
      <rect x="44" y="19" width="6" height="6" fill="#4a3421"/>
      <rect x="21" y="24" width="7" height="6" fill="#fff"/>
      <rect x="24" y="24" width="4" height="6" fill="#3b6ea5"/>
      <rect x="36" y="24" width="7" height="6" fill="#fff"/>
      <rect x="36" y="24" width="4" height="6" fill="#3b6ea5"/>
      ${mouth}
      <rect x="18" y="44" width="28" height="14" fill="#2fb6c9"/>
      <rect x="10" y="46" width="8" height="12" fill="#c8956b"/>
      <rect x="46" y="46" width="8" height="12" fill="#c8956b"/>
      <rect x="50" y="30" width="4" height="16" fill="#8a6034"/>
      <rect x="46" y="24" width="12" height="5" fill="#7fe3f0"/>
    </g>`, '0 0 64 64', 'sp-miner');
}

/* --- Volt, the electric mouse --- */
export function sparkmouse(mood = 'idle') {
  const eyes = mood === 'sad'
    ? `<path d="M20 26 q4 4 8 0" stroke="#1a1206" stroke-width="2.4" fill="none" stroke-linecap="round"/>
       <path d="M36 26 q4 4 8 0" stroke="#1a1206" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    : `<circle cx="24" cy="27" r="4" fill="#1a1206"/><circle cx="25.3" cy="25.7" r="1.5" fill="#fff"/>
       <circle cx="40" cy="27" r="4" fill="#1a1206"/><circle cx="41.3" cy="25.7" r="1.5" fill="#fff"/>`;
  const mouth = mood === 'happy'
    ? `<path d="M27 35 q5 7 10 0" stroke="#1a1206" stroke-width="2.4" fill="#b3261e" stroke-linecap="round"/>`
    : `<path d="M28 35 q4 3 8 0" stroke="#1a1206" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  return wrap(`
    <g>
      <path d="M18 16 L10 2 L24 12 Z" fill="#ffd400"/><path d="M12 5 L10 2 L16 6 Z" fill="#1a1206"/>
      <path d="M46 16 L54 2 L40 12 Z" fill="#ffd400"/><path d="M52 5 L54 2 L48 6 Z" fill="#1a1206"/>
      <ellipse cx="32" cy="32" rx="21" ry="19" fill="#ffd400"/>
      <circle cx="16" cy="35" r="5" fill="#ff3b30"/>
      <circle cx="48" cy="35" r="5" fill="#ff3b30"/>
      ${eyes}${mouth}
      <path d="M53 44 L62 40 L56 50 L64 48 L52 60 L55 50 L48 52 Z" fill="#ffb300" stroke="#1a1206" stroke-width="1"/>
    </g>`, '0 0 64 64', 'sp-sparkmouse');
}

/* --- extras --- */
export function creeper() {
  return wrap(`
    <g shape-rendering="crispEdges">
      <rect x="14" y="12" width="36" height="36" fill="#5ac35a"/>
      <rect x="18" y="16" width="6" height="6" fill="#3f8f3f"/>
      <rect x="40" y="20" width="6" height="6" fill="#3f8f3f"/>
      <rect x="20" y="20" width="9" height="9" fill="#0d2a0d"/>
      <rect x="35" y="20" width="9" height="9" fill="#0d2a0d"/>
      <rect x="27" y="30" width="10" height="8" fill="#0d2a0d"/>
      <rect x="23" y="34" width="5" height="12" fill="#0d2a0d"/>
      <rect x="36" y="34" width="5" height="12" fill="#0d2a0d"/>
      <rect x="18" y="48" width="12" height="10" fill="#4fb04f"/>
      <rect x="34" y="48" width="12" height="10" fill="#4fb04f"/>
    </g>`);
}
export function ring() {
  return wrap(`<circle cx="32" cy="32" r="20" fill="none" stroke="#ffd400" stroke-width="8"/>
    <circle cx="32" cy="32" r="20" fill="none" stroke="#fff3a8" stroke-width="2.5"/>`);
}
export function diamondGem() {
  return wrap(`<path d="M32 6 L54 26 L32 58 L10 26 Z" fill="#4fe3ff"/>
    <path d="M32 6 L54 26 L32 32 Z" fill="#9df3ff"/>
    <path d="M10 26 L32 32 L32 58 Z" fill="#2bb6d6"/>`);
}
export function ball() {
  return wrap(`<circle cx="32" cy="32" r="21" fill="#f4f6ff"/>
    <path d="M11 32 a21 21 0 0 1 42 0 Z" fill="#e63946"/>
    <rect x="11" y="29" width="42" height="6" fill="#1a1206"/>
    <circle cx="32" cy="32" r="8" fill="#1a1206"/><circle cx="32" cy="32" r="5" fill="#f4f6ff"/>`);
}
export function magnifier() {
  return wrap(`<circle cx="27" cy="26" r="15" fill="rgba(120,200,255,.28)" stroke="#ff8a3d" stroke-width="5"/>
    <rect x="36" y="36" width="20" height="7" rx="3.5" transform="rotate(45 36 36)" fill="#ff8a3d"/>`);
}
export function brainIcon() {
  return wrap(`<path d="M24 10 q-13 0 -13 12 q-7 4 -3 12 q-3 8 6 10 q2 8 12 8 q4 0 6 -3 V12 q-2 -2 -8 -2 Z" fill="#19d3c5"/>
    <path d="M40 10 q13 0 13 12 q7 4 3 12 q3 8 -6 10 q-2 8 -12 8 q-4 0 -6 -3 V12 q2 -2 8 -2 Z" fill="#12a89d"/>
    <path d="M32 14 V50" stroke="#0b3c39" stroke-width="2"/>`);
}
export function bookIcon() {
  return wrap(`<path d="M8 12 h20 q4 0 4 4 v38 q0 -4 -4 -4 H8 Z" fill="#ff5fa2"/>
    <path d="M56 12 h-20 q-4 0 -4 4 v38 q0 -4 4 -4 h20 Z" fill="#ff8ec0"/>
    <path d="M32 16 V54" stroke="#7a1442" stroke-width="2.5"/>`);
}
export function crown() {
  return wrap(`<path d="M8 46 L14 16 L26 32 L32 12 L38 32 L50 16 L56 46 Z" fill="#ffd400" stroke="#c79a00" stroke-width="2"/>
    <rect x="8" y="46" width="48" height="8" rx="3" fill="#ffb300"/>`);
}
export function star() {
  return wrap(`<path d="M32 5 L40 24 L61 26 L45 40 L50 60 L32 49 L14 60 L19 40 L3 26 L24 24 Z" fill="#ffd400"/>`);
}

export const HEROES = {
  speedster: { name: 'Dash', draw: speedster, color: 'var(--sonic)' },
  webhero:   { name: 'Web',  draw: webhero,   color: 'var(--spidey)' },
  miner:     { name: 'Blocky', draw: miner,   color: 'var(--mine)' },
  sparkmouse:{ name: 'Volt', draw: sparkmouse, color: 'var(--poke)' }
};

export function heroSvg(key, mood) {
  const h = HEROES[key] || HEROES.speedster;
  return h.draw(mood);
}
