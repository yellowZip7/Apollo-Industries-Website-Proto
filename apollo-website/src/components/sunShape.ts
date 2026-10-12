// The Apollo sun's geometry, shared by the hero backdrop (DotSun) and the opening animation
// (Intro) so that both draw exactly the same sun in exactly the same place.

export const TAU = Math.PI * 2;
const RAYS = 16;
const RAY_STEP = TAU / RAYS;

// The sun's shape, in "sun units" (the sun is laid out on a 600-unit-wide square).
const CORE_RADIUS = 104; // solid disc
const RAY_START = 134; // a clear gap separates the disc from the rays
const RAY_BASE = 24; // half-width of a ray where it leaves the gap
export const LONG_TIP = 268;
const SHORT_TIP = 212;

/** RGB of a lit dot's shade: 0 is deep amber, 6 is brand gold, 9 is bright yellow. */
export function shadeRgb(level: number): [number, number, number] {
  const t = level / 9;
  return [255, Math.round(150 + 71 * t), Math.round(26 * t * t)];
}

/** CSS colours for each shade. */
export const COLORS = Array.from({ length: 10 }, (_, i) => {
  const [r, g, b] = shadeRgb(i);
  return `rgb(${r}, ${g}, ${b})`;
});

let shade = 0;

/** Shade (index into COLORS) of the dot found by the last call to `sunCoverage`. */
export function lastShade(): number {
  return shade;
}

/** 1 inside the shape, 0 outside, with a one-dot soft edge so the outline shimmers smoothly. */
function edge(distance: number, softness: number): number {
  return Math.min(Math.max(0.5 - distance / softness, 0), 1);
}

/**
 * How much of a dot at distance `r` and angle `ang` from the sun's centre lies inside the sun:
 * a solid disc and sixteen pointed rays, long and short alternating, with hard edges.
 * `soft` is the size of one dot in sun units.
 */
export function sunCoverage(r: number, ang: number, soft: number): number {
  const core = edge(r - CORE_RADIUS, soft);
  if (core > 0) {
    shade = 9 - Math.min(2, Math.floor((r / CORE_RADIUS) * 3)); // pale gold centre, gold rim
    return core;
  }
  if (r < RAY_START - soft || r > LONG_TIP + soft) return 0;

  const k = Math.round(ang / RAY_STEP);
  const lateral = Math.abs(ang - k * RAY_STEP) * r;
  const tip = (((k % RAYS) + RAYS) % RAYS) % 2 === 0 ? LONG_TIP : SHORT_TIP;
  const along = Math.min(Math.max((r - RAY_START) / (tip - RAY_START), 0), 1);
  const halfWidth = RAY_BASE * (1 - 0.85 * along); // a spike that narrows toward its tip

  const ray = edge(Math.max(lateral - halfWidth, RAY_START - r, r - tip), soft);
  if (ray > 0) shade = 6 - Math.min(2, Math.floor(along * 3)); // gold at the base, amber at the tip
  return ray;
}

export interface SunLayout {
  narrow: boolean;
  /** Distance between dots, in pixels. */
  gap: number;
  /** Pixels per sun unit. */
  scale: number;
  /** Sun centre, in pixels from the hero's top-left corner. */
  cx: number;
  cy: number;
  /** How bright the sun is drawn behind the hero text (lower on small screens). */
  strength: number;
}

/** Where and how large the sun is on a hero of the given size. */
export function sunLayout(W: number, H: number): SunLayout {
  const narrow = W < 700;
  return {
    narrow,
    gap: narrow ? 10 : 11, // a fine grid keeps the silhouette smooth
    // On wide screens the whole sun fits inside the hero (only a few ray tips touch the edge).
    scale: narrow ? (W * 0.62) / 300 : Math.min(W * 0.26, H * 0.44) / LONG_TIP,
    cx: W * (narrow ? 0.8 : 0.86),
    cy: H * (narrow ? 0.6 : 0.5),
    strength: narrow ? 0.35 : 1,
  };
}
