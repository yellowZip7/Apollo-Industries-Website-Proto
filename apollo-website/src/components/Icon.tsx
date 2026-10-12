import type { ReactNode } from 'react';

export type IconName = 'software' | 'business';

/**
 * A small custom line-icon set on a 24px grid.
 * Main shapes use the current text color. One detail per icon uses the brand gold.
 */
const shapes: Record<IconName, ReactNode> = {
  // A browser window with code brackets.
  software: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path className="icon__accent" d="M10 12.5l-2 2 2 2M14 12.5l2 2-2 2" />
    </>
  ),
  // An office building with lit windows.
  business: (
    <>
      <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
      <path d="M15 10h3a1 1 0 0 1 1 1v10" />
      <path d="M3 21h18" />
      <path className="icon__accent" d="M8.5 8h3M8.5 12h3M8.5 16h3" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  small?: boolean;
}

/** An icon in a small outlined tile. Decorative: the text beside it carries the meaning. */
export default function Icon({ name, small = false }: IconProps) {
  return (
    <span className={small ? 'icon icon--small' : 'icon'} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {shapes[name]}
      </svg>
    </span>
  );
}
