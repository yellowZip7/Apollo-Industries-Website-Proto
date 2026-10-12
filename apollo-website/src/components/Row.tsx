import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import type { IconName } from './Icon';

interface RowProps {
  title: string;
  /** Short supporting text. */
  text?: string;
  /** Small tags shown under the text. */
  tags?: string[];
  /** Step number for sequences such as the process list. */
  num?: string;
  /** Icon shown above the title. */
  icon?: IconName;
  /** Internal route. Makes the whole row a link. */
  to?: string;
  /** External address. Makes the whole row a link that opens in a new tab. */
  href?: string;
  /** Custom content shown instead of text, for example a mailto link. */
  children?: ReactNode;
}

function Chevron() {
  return (
    <svg className="row__go" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function External() {
  return (
    <svg className="row__go" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A single list row: title on the left, details on the right. */
export default function Row({ title, text, tags, num, icon, to, href, children }: RowProps) {
  const content = (
    <>
      <span className={icon ? 'row__title row__title--icon' : 'row__title'}>
        {icon && <Icon name={icon} />}
        {num && <span className="row__num">{num}</span>}
        <span>{title}</span>
        {href && <span className="visually-hidden"> (opens in a new tab)</span>}
      </span>
      <span className="row__main">
        {text && <span className="row__text">{text}</span>}
        {children}
        {tags && tags.length > 0 && (
          <span className="tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>
      {to && <Chevron />}
      {href && <External />}
    </>
  );

  const baseClass = icon ? 'row row--icon' : 'row';

  if (to) {
    return (
      <Link to={to} className={`${baseClass} row--link`}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`${baseClass} row--link`} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
