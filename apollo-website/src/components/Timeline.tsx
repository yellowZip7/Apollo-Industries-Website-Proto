import { useEffect, useRef } from 'react';

interface TimelineStep {
  title: string;
  text: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

/**
 * A vertical timeline. A gold line fills down from the first step to the last as the visitor
 * scrolls, and each step's marker turns gold when the line reaches it. With reduced motion
 * the line is simply drawn complete.
 */
export default function Timeline({ steps }: TimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const markers = Array.from(root.querySelectorAll<HTMLElement>('.timeline__marker'));
    const items = Array.from(root.querySelectorAll<HTMLElement>('.timeline__item'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      // Marker centres come from layout (offsetTop), so the reveal animation can't skew them.
      const centers = markers.map((marker) => marker.offsetTop + marker.offsetHeight / 2);
      const start = centers[0];
      const end = centers[centers.length - 1];
      const span = Math.max(end - start, 1);

      // The fill reaches the point 60% of the way down the screen.
      const front = reduced ? end : window.innerHeight * 0.6 - root.getBoundingClientRect().top;
      const ratio = Math.min(Math.max((front - start) / span, 0), 1);

      root.style.setProperty('--track-top', `${start}px`);
      root.style.setProperty('--track-height', `${span}px`);
      root.style.setProperty('--fill-ratio', String(ratio));
      items.forEach((item, i) => item.classList.toggle('is-reached', reduced || front >= centers[i]));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="timeline" ref={rootRef}>
      <div className="timeline__track" aria-hidden="true">
        <div className="timeline__fill" />
      </div>
      <ol className="timeline__list">
        {steps.map((step, index) => (
          <li key={step.title} className="timeline__item">
            <span className="timeline__marker" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="timeline__content">
              <h3 className="timeline__title">{step.title}</h3>
              <p className="timeline__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
