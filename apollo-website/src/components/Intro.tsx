import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { revealIntro, setIntroPlaying } from '../intro';
import { LONG_TIP, TAU, lastShade, shadeRgb, sunCoverage, sunLayout } from './sunShape';

/** Play the intro only on a visitor's first page load of the session, instead of every load. */
const ONCE_PER_SESSION = false;
const SESSION_KEY = 'apollo-intro-seen';

// Timeline, in seconds.
const REVEAL_AT = 1.05; // the sun is assembled; the screen starts to break apart
const SPREAD = 0.4; // how long the dissolve takes to travel from the sun to the far corners
const SHRINK = 0.22; // how long each tile takes to vanish
const END_AT = REVEAL_AT + SPREAD + 0.1 + SHRINK;

interface Particle {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  /** Unit vector at right angles to the flight path, used for the swirl. */
  px: number;
  py: number;
  delay: number;
  duration: number;
  phase: number;
  amp: number;
  shade: number;
  radius: number;
  dust: boolean;
}

// Colour of each particle while it flies: pale blue, turning to its gold shade as it arrives.
const BUCKETS = 8;
const NANO: [number, number, number] = [140, 190, 255];
const PALETTE = Array.from({ length: 10 }, (_, shade) =>
  Array.from({ length: BUCKETS }, (_, b) => {
    const k = (b / (BUCKETS - 1)) ** 2;
    const gold = shadeRgb(shade);
    return `rgb(${NANO.map((c, i) => Math.round(c + (gold[i] - c) * k)).join(',')})`;
  }),
);
const DUST = `rgb(${NANO.join(',')})`;

let decision: boolean | null = null;

/** Decided once per page load: play on the Home page, unless the visitor prefers less motion. */
function shouldPlay(pathname: string): boolean {
  if (decision !== null) return decision;
  decision = pathname === '/';
  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    decision = false;
  }
  if (decision && ONCE_PER_SESSION) {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) decision = false;
      else window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Storage can be blocked; just play.
    }
  }
  setIntroPlaying(decision);
  return decision;
}

/**
 * The opening animation: a swarm of tiny particles streams in and locks together into the gold
 * Apollo sun, exactly where the hero's own dot sun sits. The dark screen then breaks into tiles
 * that shrink away from the sun outward, revealing the site. Any click, tap or key skips it.
 */
export default function Intro() {
  const { pathname } = useLocation();
  const [play] = useState(() => shouldPlay(pathname));
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    if (!play) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const html = document.documentElement;

    let finished = false;
    let revealed = false;
    let frame = 0;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(failsafe);
      window.cancelAnimationFrame(frame);
      revealIntro();
      html.classList.remove('intro-lock');
      setDone(true);
    };
    // Never leave the visitor stuck behind the intro, whatever happens.
    const failsafe = window.setTimeout(finish, 20000);
    if (!root || !canvas || !ctx) {
      finish();
      return;
    }

    html.classList.add('intro-lock');

    // Everything that depends on the screen size is (re)built by `setup`, so the intro copes with
    // the page being resized or laid out late (an embedded preview, a scrollbar appearing).
    let vw = 0;
    let vh = 0;
    let dpr = 1;
    let gap = 11;
    let scale = 1;
    let centerX = 0;
    let centerY = 0;
    let tile = 26;
    let cols = 0;
    let rows = 0;
    let tileStart = new Float32Array(0);
    let particles: Particle[] = [];

    const setup = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(vw * dpr));
      canvas.height = Math.max(1, Math.round(vh * dpr));
      particles = [];
      cols = rows = 0;

      const hero = document.querySelector('.hero__art');
      if (!hero || vw < 50 || vh < 50) return; // not laid out yet; a resize will call setup again
      const box = hero.getBoundingClientRect();
      const layout = sunLayout(box.width, box.height);
      gap = layout.gap;
      scale = layout.scale;
      centerX = box.left + layout.cx;
      centerY = box.top + layout.cy;
      const reach = (LONG_TIP + 20) * scale;
      const soft = gap / scale;

      const make = (tx: number, ty: number, shade: number, radius: number, dust: boolean): Particle => {
        const sx = Math.random() * vw;
        const sy = Math.random() * vh;
        const dx = tx - sx;
        const dy = ty - sy;
        const len = Math.hypot(dx, dy) || 1;
        const dist = Math.hypot(tx - centerX, ty - centerY) / (LONG_TIP * scale);
        return {
          sx,
          sy,
          tx,
          ty,
          px: -dy / len,
          py: dx / len,
          delay: dist * 0.12 + Math.random() * 0.12,
          duration: 0.5 + Math.random() * 0.25,
          phase: Math.random() * TAU,
          amp: 20 + Math.random() * 40,
          shade,
          radius,
          dust,
        };
      };

      // One particle per lit dot of the resting sun, plus some loose dust that joins the swarm.
      for (let y = gap / 2; y < box.height; y += gap) {
        for (let x = gap / 2; x < box.width; x += gap) {
          const dx = x - layout.cx;
          const dy = y - layout.cy;
          if (Math.abs(dx) > reach || Math.abs(dy) > reach) continue;
          const r = Math.hypot(dx, dy) / scale;
          const cover = sunCoverage(r, Math.atan2(dy, dx), soft);
          if (cover >= 0.5) particles.push(make(box.left + x, box.top + y, lastShade(), gap * (0.08 + 0.19 * cover), false));
        }
      }
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * TAU;
        const d = Math.sqrt(Math.random()) * LONG_TIP * scale;
        particles.push(make(centerX + Math.cos(a) * d, centerY + Math.sin(a) * d, 0, 1.3, true));
      }

      // The dark screen is a grid of tiles that shrink away, nearest the sun first.
      tile = layout.narrow ? 22 : 26;
      cols = Math.ceil(vw / tile);
      rows = Math.ceil(vh / tile);
      const farthest = Math.max(
        Math.hypot(centerX, centerY),
        Math.hypot(vw - centerX, centerY),
        Math.hypot(centerX, vh - centerY),
        Math.hypot(vw - centerX, vh - centerY),
      );
      tileStart = new Float32Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const d = Math.hypot(col * tile + tile / 2 - centerX, row * tile + tile / 2 - centerY) / farthest;
          tileStart[row * cols + col] = REVEAL_AT + d * SPREAD + Math.random() * 0.1;
        }
      }
    };

    const at = { x: 0, y: 0, e: 0 };
    const place = (p: Particle, t: number) => {
      const u = Math.min(Math.max((t - p.delay) / p.duration, 0), 1);
      const e = 1 - (1 - u) ** 3;
      const sway = Math.sin(p.phase + u * TAU * 1.25) * p.amp * (1 - e);
      const jitter = (1 - e) * 1.8;
      at.x = p.sx + (p.tx - p.sx) * e + p.px * sway + Math.sin(t * 2.2 + p.phase) * jitter;
      at.y = p.sy + (p.ty - p.sy) * e + p.py * sway + Math.cos(t * 1.9 + p.phase) * jitter;
      at.e = e;
    };

    // The animation's own clock. It only advances while frames are being drawn (and by at most a
    // tenth of a second at a time), so a page loaded in a background tab still plays in full.
    let clock = 0;
    let lastFrame = 0;

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      if (t >= REVEAL_AT && !revealed) {
        revealed = true;
        revealIntro(); // the hero's own sun starts popping in underneath
        html.classList.remove('intro-lock');
        root.style.pointerEvents = 'none';
      }

      // Background.
      ctx.fillStyle = '#001f45';
      if (t < REVEAL_AT) {
        ctx.fillRect(0, 0, vw, vh);
      } else {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const progress = Math.min(Math.max((t - tileStart[row * cols + col]) / SHRINK, 0), 1);
            if (progress >= 1) continue;
            const size = tile * (1 - progress * progress);
            const grow = progress === 0 ? 1 : 0; // a pixel of overlap hides seams between whole tiles
            ctx.fillRect(col * tile + (tile - size) / 2, row * tile + (tile - size) / 2, size + grow, size + grow);
          }
        }
      }

      // Particles: they fly in, lock into the sun, flash once, then fade as the site appears.
      const fade = 1 - Math.min(Math.max((t - REVEAL_AT - 0.1) / 0.3, 0), 1);
      const pulse = t > REVEAL_AT - 0.15 && t < REVEAL_AT ? Math.sin(((t - (REVEAL_AT - 0.15)) / 0.15) * Math.PI) : 0;
      if (fade > 0) {
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        for (const p of particles) {
          place(p, t);
          const x = at.x;
          const y = at.y;
          const e = at.e;
          const bucket = Math.min(BUCKETS - 1, Math.floor(e * BUCKETS));
          const color = p.dust ? DUST : PALETTE[p.shade][bucket];
          const alpha = (p.dust ? 0.55 * (1 - e) : 0.4 + 0.6 * e) * fade;
          if (alpha <= 0.01) continue;

          // A short streak behind the particle while it is still moving.
          if (e > 0 && e < 0.92) {
            place(p, t - 0.035);
            ctx.globalAlpha = alpha * 0.5;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(at.x, at.y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, (1.3 + (p.radius - 1.3) * e) * (1 + 0.3 * pulse), 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      if (t >= END_AT) finish();
    };

    const loop = (now: number) => {
      clock += lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
      lastFrame = now;
      draw(clock);
      if (!finished) frame = window.requestAnimationFrame(loop);
    };

    // Any click, tap or key skips ahead: first to the reveal, then to the end.
    const skip = () => {
      clock = clock < REVEAL_AT ? REVEAL_AT : END_AT;
    };
    skipRef.current = skip;

    // Rebuild for the new size when the window changes (ignoring small shifts, such as a scrollbar).
    const onResize = () => {
      if (Math.abs(window.innerWidth - vw) > 40 || Math.abs(window.innerHeight - vh) > 40) setup();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('resize', onResize);

    setup();
    draw(0); // paint the dark screen before the browser first paints the page
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(failsafe);
      window.cancelAnimationFrame(frame);
      html.classList.remove('intro-lock');
      revealIntro();
    };
  }, [play]);

  if (!play || done) return null;
  return (
    <div className="intro" ref={rootRef} onPointerDown={() => skipRef.current()}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <button
        type="button"
        className="intro__skip"
        onClick={(e) => {
          e.stopPropagation();
          skipRef.current();
        }}
      >
        Skip intro
      </button>
    </div>
  );
}
