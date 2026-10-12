import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface TextLinkProps {
  to: string;
  children: ReactNode;
}

/** A plain, underlined text link with a comfortable tap area. */
export default function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link to={to} className="text-link">
      {children}
    </Link>
  );
}
