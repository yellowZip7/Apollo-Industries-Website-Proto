interface AvatarProps {
  name: string;
  /** Optional photo. Without one, the person's initials are shown. */
  photo?: string;
}

/** First and last initial, e.g. "Raphael Jake Caasi" becomes "RC". */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** A round avatar with a gold ring. Decorative: the person's name is always written next to it. */
export default function Avatar({ name, photo }: AvatarProps) {
  return (
    <span className="avatar" aria-hidden="true">
      {photo ? <img src={photo} alt="" /> : initials(name)}
    </span>
  );
}
