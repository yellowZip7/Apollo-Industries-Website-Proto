import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Delay between items that scroll into view together. */
const STAGGER_MS = 90;
const MAX_STAGGER = 6;

/** Containers whose direct children are revealed one by one instead of the container itself. */
const GROUPS = '.rows, .pair, .quotes, .tech, .founders, .mission, .core-values';

/**
 * Fades and slides each section's content up as it scrolls into view. Items that arrive
 * together are staggered. Does nothing when the visitor prefers reduced motion, so content
 * is simply there. Renders nothing; it only adds classes (see `.reveal` in global.css).
 */
export default function RevealOnScroll() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;

    const targets: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>('main .block').forEach((section) => {
      const label = section.querySelector<HTMLElement>('.block__label');
      if (label) targets.push(label);

      section.querySelectorAll<HTMLElement>('.block__body > *').forEach((el) => {
        if (el.matches(GROUPS)) {
          targets.push(...(Array.from(el.children) as HTMLElement[]));
        } else if (el.matches('.timeline')) {
          targets.push(...Array.from(el.querySelectorAll<HTMLElement>('.timeline__item')));
        } else {
          targets.push(el);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.setProperty('--reveal-delay', `${Math.min(n++, MAX_STAGGER) * STAGGER_MS}ms`);
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    targets.forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      targets.forEach((el) => {
        el.classList.remove('reveal', 'is-visible');
        el.style.removeProperty('--reveal-delay');
      });
    };
  }, [pathname]);

  return null;
}
