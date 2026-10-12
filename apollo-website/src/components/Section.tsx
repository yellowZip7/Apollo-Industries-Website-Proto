import type { ReactNode } from 'react';

interface SectionProps {
  label: string;
  id?: string;
  /** Background: plain (default), tint (pale blue-grey) or navy (brand band). */
  tone?: 'plain' | 'tint' | 'navy';
  children: ReactNode;
}

/** A page section: its heading sits in a narrow left column, the content beside it. */
export default function Section({ label, id, tone = 'plain', children }: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  const className = ['block', `block--${tone}`, tone === 'navy' ? 'on-navy' : ''].filter(Boolean).join(' ');

  return (
    <section className={className} id={id} aria-labelledby={headingId}>
      <div className="wrap block__grid">
        <h2 className="block__label" id={headingId}>
          {label}
        </h2>
        <div className="block__body">{children}</div>
      </div>
    </section>
  );
}
