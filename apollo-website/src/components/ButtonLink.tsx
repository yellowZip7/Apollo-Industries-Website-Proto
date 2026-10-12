import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonLinkProps {
  to: string;
  variant?: 'primary' | 'secondary';
  small?: boolean;
  children: ReactNode;
}

/** A router link styled as a button. */
export default function ButtonLink({
  to,
  variant = 'primary',
  small = false,
  children,
}: ButtonLinkProps) {
  const className = ['btn', `btn--${variant}`, small ? 'btn--small' : ''].filter(Boolean).join(' ');
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
