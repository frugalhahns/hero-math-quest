/* Color theme: 'auto' follows the device, 'light' / 'dark' pin it.
   The resolved value lives on <html data-theme> and css/style.css keys off it. */

import { S } from './state.js';

const LIGHT_BAR = '#f2f5ff';
const DARK_BAR = '#0b1026';

const lightQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

export function prefersLight() {
  const pref = S.theme || 'auto';
  if (pref === 'light') return true;
  if (pref === 'dark') return false;
  return !!(lightQuery && lightQuery.matches);
}

export function applyTheme() {
  const light = prefersLight();
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', light ? LIGHT_BAR : DARK_BAR);
}

/* Follow the device while the setting is on auto. */
if (lightQuery) {
  const onChange = () => { if ((S.theme || 'auto') === 'auto') applyTheme(); };
  if (lightQuery.addEventListener) lightQuery.addEventListener('change', onChange);
  else if (lightQuery.addListener) lightQuery.addListener(onChange);
}
