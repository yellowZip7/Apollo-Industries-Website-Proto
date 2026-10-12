import type { ReactNode } from 'react';

interface PageIntroProps {
  title: string;
  children: ReactNode;
}

/** Page heading and short introduction used at the top of inner pages. */
export default function PageIntro({ title, children }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="wrap">
        <h1 className="page-intro__title">{title}</h1>
        <p className="lead">{children}</p>
      </div>
    </section>
  );
}
