import { useEffect, useRef } from 'react';
import { introState, onIntroReveal } from '../intro';
import { COLORS, LONG_TIP, TAU, lastShade, sunCoverage, sunLayout } from './sunShape';

interface DotSunProps {
  className?: string;
}

const SPIN = TAU / 110; // the sun turns once every 110 seconds

// A click or tap sends a ripple across the hero.
const RIPPLE_SPEED = 420; // pixels per second
const RIPPLE_WIDTH = 30; // thickness of the wave, in pixels
const RIPPLE_LIFE = 1.6; // seconds

/**
 * The hero backdrop: a faint grid of dots across the whole section, with the Apollo sun slowly
 * turning over it. Dots inside the sun's silhouette (a solid disc, a gap, then sixteen pointed
 * rays) light up gold and swell, so the sun is drawn by the grid itself, like an LED display.
 * The grid also answers the visitor: dots swell and brighten around the cursor or a finger, and
 * a click or tap sends a ripple across the hero. Decorative only. It pauses when scrolled out of
 * view and is drawn once, still, with no interaction, when the visitor prefers reduced motion.
 */
export default function DotSun({ className }: DotSunProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let gap = 18;
    let cx = 0;
    let cy = 0;
    let scale = 1;
    let strength = 1;
    let narrow = false;
    let ambient: HTMLCanvasElement | null = null;
    let frame = 0;
    let rot = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, level: 0, active: false };
    const ripples: { x: number; y: number; at: number }[] = [];
    // While the opening animation plays, the sun waits; it pops in as the animation dissolves.
    let started = performance.now();
    let stopWaiting: (() => void) | undefined;
    if (introState.playing && !reduced) {
      started = Infinity;
      stopWaiting = onIntroReveal(() => {
        started = performance.now();
      });
    }
    let last = performance.now();

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      ({ narrow, gap, scale, cx, cy, strength } = sunLayout(W, H));

      // The faint resting grid is drawn once and reused every frame.
      ambient = document.createElement('canvas');
      ambient.width = canvas.width;
      ambient.height = canvas.height;
      const a = ambient.getContext('2d');
      if (!a) return;
      a.setTransform(dpr, 0, 0, dpr, 0, 0);
      a.fillStyle = '#a9c3ee';
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          const near = Math.min(Math.max((x - 0.2 * W) / (0.65 * W), 0), 1); // quieter behind the headline
          a.globalAlpha = 0.05 + 0.2 * near;
          a.beginPath();
          a.arc(x, y, 0.9, 0, TAU);
          a.fill();
        }
      }
    };

    const draw = (now: number) => {
      const t = reduced ? 99 : (now - started) / 1000;
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      if (!reduced) rot += dt * SPIN;

      // Ease the pointer's glow in and out, and let its position trail the real one slightly.
      pointer.level += ((pointer.active ? 1 : 0) - pointer.level) * Math.min(1, dt * 9);
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 18);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 18);
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].at > RIPPLE_LIFE * 1000) ripples.splice(i, 1);
      }
      const interactive = pointer.level > 0.01 || ripples.length > 0;
      const hoverRadius = narrow ? 80 : 120;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (ambient) ctx.drawImage(ambient, 0, 0, W, H);

      // Light up the dots the sun is over.
      const soft = gap / scale;
      const reach = (LONG_TIP + 20) * scale;
      // Only the sun's area needs visiting, unless the pointer or a ripple is lighting the grid.
      const firstCol = interactive ? 0 : Math.max(0, Math.floor((cx - reach - gap / 2) / gap));
      const lastCol = Math.min(Math.ceil((W - gap / 2) / gap), interactive ? Infinity : Math.ceil((cx + reach - gap / 2) / gap));
      const firstRow = interactive ? 0 : Math.max(0, Math.floor((cy - reach - gap / 2) / gap));
      const lastRow = Math.min(Math.ceil((H - gap / 2) / gap), interactive ? Infinity : Math.ceil((cy + reach - gap / 2) / gap));
      let color = -1;

      for (let row = firstRow; row <= lastRow; row++) {
        const y = gap / 2 + row * gap;
        for (let col = firstCol; col <= lastCol; col++) {
          const x = gap / 2 + col * gap;
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.hypot(dx, dy) / scale;

          let cover = r <= LONG_TIP + 2 * soft ? sunCoverage(r, Math.atan2(dy, dx) - rot, soft) : 0;
          let level = lastShade();
          if (cover > 0) {
            // Dots pop in from the centre outward when the page first loads.
            cover *= Math.min(Math.max((t - 0.05 - r * 0.002) / 0.4, 0), 1);
          }

          // Glow from the pointer and from any ripples passing over this dot (0 to 1).
          let glow = 0;
          if (interactive) {
            if (pointer.level > 0.01) {
              const px = x - pointer.x;
              const py = y - pointer.y;
              const d2 = px * px + py * py;
              if (d2 < hoverRadius * hoverRadius) {
                const near = 1 - Math.sqrt(d2) / hoverRadius;
                glow = near * near * (3 - 2 * near) * pointer.level;
              }
            }
            for (const ripple of ripples) {
              const age = (now - ripple.at) / 1000;
              const off = Math.hypot(x - ripple.x, y - ripple.y) - age * RIPPLE_SPEED;
              const wave = Math.exp(-((off / RIPPLE_WIDTH) ** 2)) * (1 - age / RIPPLE_LIFE);
              if (wave > glow) glow = wave;
            }
          }
          if (cover <= 0 && glow < 0.03) continue;

          // Sun dots keep their shade (and brighten under a glow); other dots light up gold.
          level = cover > 0 ? Math.min(9, level + Math.round(glow * 3)) : Math.min(9, 4 + Math.round(glow * 5));
          if (level !== color) {
            ctx.fillStyle = COLORS[level];
            color = level;
          }
          const sunAlpha = cover > 0 ? (0.5 + 0.5 * cover) * strength : 0;
          const glowAlpha = glow > 0 ? 0.35 + 0.6 * glow : 0;
          ctx.globalAlpha = Math.min(1, Math.max(sunAlpha, glowAlpha));
          ctx.beginPath();
          ctx.arc(x, y, gap * (0.08 + 0.19 * Math.max(cover, 0) + 0.15 * glow), 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      draw(now);
      frame = window.requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduced || frame) return;
      last = performance.now();
      frame = window.requestAnimationFrame(loop);
    };
    const pause = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    layout();
    draw(performance.now());

    const resize = new ResizeObserver(() => {
      layout();
      if (!frame) draw(performance.now());
    });
    resize.observe(canvas);

    // The canvas ignores the pointer (the text sits above it), so listen on the hero around it.
    const hero = canvas.parentElement;
    const place = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - box.left;
      pointer.ty = e.clientY - box.top;
      if (pointer.level < 0.02) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && e.buttons === 0) return;
      place(e);
      pointer.active = true;
    };
    const onDown = (e: PointerEvent) => {
      place(e);
      pointer.active = true;
      ripples.push({ x: pointer.tx, y: pointer.ty, at: performance.now() });
      if (ripples.length > 5) ripples.shift();
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (hero && !reduced) {
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerdown', onDown);
      hero.addEventListener('pointerleave', onLeave);
      hero.addEventListener('pointerup', onLeave);
      hero.addEventListener('pointercancel', onLeave);
    }

    let visibility: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
      visibility.observe(canvas);
    } else {
      play();
    }

    return () => {
      pause();
      stopWaiting?.();
      hero?.removeEventListener('pointermove', onMove);
      hero?.removeEventListener('pointerdown', onDown);
      hero?.removeEventListener('pointerleave', onLeave);
      hero?.removeEventListener('pointerup', onLeave);
      hero?.removeEventListener('pointercancel', onLeave);
      resize.disconnect();
      visibility?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
