import type { TeamMember } from '../content/team';
import Avatar from './Avatar';

interface FounderCardProps {
  member: TeamMember;
  /** Highlights the card (used for the CEO and founder). */
  lead?: boolean;
}

/** One founder: avatar, name, title and, if they have one, a link to their portfolio. */
export default function FounderCard({ member, lead = false }: FounderCardProps) {
  const host = member.portfolio ? new URL(member.portfolio).host : '';

  return (
    <li className={lead ? 'founder founder--lead' : 'founder'}>
      <Avatar name={member.name} photo={member.photo} />
      <div className="founder__info">
        <h3 className="founder__name">{member.name}</h3>
        <p className="founder__role">{member.role}</p>
        {member.portfolio && (
          <a className="founder__link" href={member.portfolio} target="_blank" rel="noopener noreferrer">
            {host}
            <span className="visually-hidden"> (portfolio of {member.name}, opens in a new tab)</span>
          </a>
        )}
      </div>
    </li>
  );
}
