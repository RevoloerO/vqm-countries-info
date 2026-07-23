// Derives readable accent/glow colors from a country's flag color swatches
// (src/data/countries.json `flagColors`, sourced from REST Countries v5,
// which extracts these directly from each flag image server-side).
//
// This module owns the *dynamic* part: blending the raw extracted colors so
// they read well together, and synthesizing extra shades when a flag only
// has one or two real colors to work with (e.g. Japan, Poland, Monaco).

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [r, g, b].map((v) => clamp255(v).toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
    case gn: h = (bn - rn) / d + 2; break;
    default: h = (rn - gn) / d + 4;
  }
  return { h: h * 60, s, l };
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToHex(h, s, l) {
  const hn = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return rgbToHex(v, v, v);
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return rgbToHex(
    hue2rgb(p, q, hn + 1 / 3) * 255,
    hue2rgb(p, q, hn) * 255,
    hue2rgb(p, q, hn - 1 / 3) * 255
  );
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function hueDistance(h1, h2) {
  const d = Math.abs(h1 - h2) % 360;
  return d > 180 ? 360 - d : d;
}

// Lighter (deltaL > 0) or darker (deltaL < 0) version of a color
function shade(hex, deltaL) {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, clamp(l + deltaL, 0.06, 0.94));
}

// Rotates hue while keeping saturation/lightness — used to pull two colors
// apart when they'd otherwise look identical
function rotateHue(hex, degrees) {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h + degrees, s, l);
}

// Muddy/gray flag colors (very low saturation) read poorly as a glow or
// accent — lift them toward a minimum saturation without changing hue/lightness
function boostSaturation(hex, minS) {
  const { h, s, l } = hexToHsl(hex);
  return s >= minS ? hex : hslToHex(h, minS, l);
}

function channelLuminance(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

// WCAG relative luminance, 0 (black) - 1 (white)
export function hexLuminance(hex) {
  if (!hex) return 0.5;
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

// Best text color to place directly on top of the given hex background
export function contrastTextColor(hex) {
  return hexLuminance(hex) > 0.45 ? '#000000' : '#ffffff';
}

// Blends the raw picked colors so they read well as a background-wash /
// accent pair, and synthesizes a second tone when the flag has too little
// color variety for glowA and glowB to actually differ (common on 2-color
// flags like Japan or Poland).
function harmonize({ accent, glowA, glowB }, mode) {
  const a = hexToHsl(glowA);
  const b = hexToHsl(glowB);

  if (hueDistance(a.h, b.h) < 12 && Math.abs(a.l - b.l) < 0.08) {
    glowB = shade(glowA, mode === 'dark' ? 0.22 : -0.22);
  }

  glowA = boostSaturation(glowA, 0.35);
  glowB = boostSaturation(glowB, 0.35);

  // Make sure the accent visually separates from the glow it sits on top of
  const accentHsl = hexToHsl(accent);
  const glowAHsl = hexToHsl(glowA);
  if (hueDistance(accentHsl.h, glowAHsl.h) < 10 && Math.abs(accentHsl.l - glowAHsl.l) < 0.12) {
    accent = shade(accent, accentHsl.l > 0.5 ? -0.28 : 0.28);
  }
  accent = boostSaturation(accent, 0.4);

  return { accent, glowA, glowB };
}

// A swatch is "usable" for hue comparison if it's saturated enough that its
// hue is actually meaningful — near-white/black/gray colors have unstable,
// near-arbitrary hue values that would otherwise pollute diversity ranking.
function isUsable(hex) {
  if (!hex) return false;
  const { s, l } = hexToHsl(hex);
  return s > 0.12 && l > 0.08 && l < 0.95;
}

// Walks `pool` (already ordered most- to least-important) and keeps up to
// `count` colors, skipping any candidate that's within `minHueGap` of one
// already kept. This respects the pool's priority order — unlike a pure
// "maximize spread" search, which can let a minor `muted` swatch outrank the
// flag's actual dominant/prominent color just because the numbers say it's
// a few degrees further from the first pick — while still guaranteeing a
// flag's genuinely distinct colors (the blue AND the yellow AND the red)
// all get a chance to show up instead of being starved by a fixed fallback.
function pickDistinctInOrder(pool, count, minHueGap = 25) {
  const usable = pool.filter(isUsable);
  const source = usable.length > 0 ? usable : pool.filter(Boolean);
  if (source.length === 0) return [];

  const picked = [source[0]];
  for (const candidate of source.slice(1)) {
    if (picked.length >= count) break;
    const farEnough = picked.every(
      (p) => hueDistance(hexToHsl(candidate).h, hexToHsl(p).h) >= minHueGap
    );
    if (farEnough) picked.push(candidate);
  }
  return picked;
}

// Picks a themed {accent, glowA, glowB} triple for the given light/dark mode.
// Always returns non-null hex strings — falls back to dominant/prominent
// (always present) when swatch roles are missing or flagColors is absent.
export function pickCountryTheme(flagColors, mode) {
  const fc = flagColors || {};
  const dominant = fc.dominant || '#6366f1';
  const prominent = fc.prominent || dominant;

  // `prominent`/`dominant` are defined by the API as area-coverage winners —
  // i.e. what the flag actually looks like at a glance — so they anchor the
  // pool first. `vibrant`/`darkVibrant` etc. come after: they're picked for
  // saturation, not area, so on a flag like a Blue Ensign they can just as
  // easily be a tiny coat-of-arms detail (a cactus, a sliver of Union Jack
  // red) as the flag's real character. Letting them outrank the dominant
  // color was exactly what made minor accents hijack the whole theme.
  const pool = mode === 'dark'
    ? [prominent, dominant, fc.vibrant, fc.darkVibrant, fc.muted, fc.darkMuted, fc.lightVibrant, fc.lightMuted]
    : [prominent, dominant, fc.darkVibrant, fc.vibrant, fc.muted, fc.lightVibrant, fc.lightMuted, fc.darkMuted];

  const diverse = pickDistinctInOrder(pool, 3);
  // diverse[0] is the flag's main color — give it the dominant visual role
  // (background wash) rather than burying it as a thin border accent
  const picked = {
    glowA: diverse[0] || dominant,
    accent: diverse[1] || diverse[0] || dominant,
    glowB: diverse[2] || prominent,
  };

  return harmonize(picked, mode);
}

// Ensures two compared countries stay visually distinguishable — rotates B's
// hue away from A's when both flags land on near-identical colors (e.g.
// comparing two red/white/blue flags)
export function differentiateThemes(themeA, themeB) {
  const a = hexToHsl(themeA.glowA);
  const b = hexToHsl(themeB.glowA);
  if (hueDistance(a.h, b.h) > 25) return themeB;

  return {
    accent: rotateHue(themeB.accent, 50),
    glowA: rotateHue(themeB.glowA, 50),
    glowB: rotateHue(themeB.glowB, 50),
  };
}
