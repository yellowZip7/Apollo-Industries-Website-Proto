import FounderCard from '../components/FounderCard';
import PageIntro from '../components/PageIntro';
import Row from '../components/Row';
import Section from '../components/Section';
import { coreValues, mission, vision } from '../content/mission';
import { partners, team } from '../content/team';
import { values } from '../content/values';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function About() {
  useDocumentTitle(
    'About',
    'Meet Apollo Industries, a small software development team that builds web apps and internal tools.',
  );

  return (
    <>
      <PageIntro title="A small team that answers its own email.">
        Apollo Industries is a software development company. We build software around the way
        people work, and we want you to feel you can just ask.
      </PageIntro>

      <div className="wrap">
        <figure className="figure">
          <picture>
            <source srcSet="/images/team.webp" type="image/webp" />
            <img
              src="/images/team.jpg"
              alt="The Apollo team gathered together, smiling and making peace signs"
              width={1400}
              height={918}
            />
          </picture>
          <figcaption>The Apollo team.</figcaption>
        </figure>
      </div>

      {team.length > 0 && (
        <Section label="Founders" id="founders">
          <p className="statement">Meet the people who started Apollo.</p>
          <ul className="founders">
            {team.map((member, index) => (
              <FounderCard key={member.id} member={member} lead={index === 0} />
            ))}
          </ul>
        </Section>
      )}

      <Section label="Vision and mission" tone="navy">
        <div className="mission">
          <article className="glass mission__card">
            <h3 className="mission__title">Vision</h3>
            <p className="mission__text">{vision}</p>
          </article>
          <article className="glass mission__card">
            <h3 className="mission__title">Mission</h3>
            <p className="mission__text">{mission}</p>
          </article>
        </div>
      </Section>

      <Section label="Core values" tone="tint">
        <ul className="core-values">
          {coreValues.map((value) => (
            <li key={value} className="core-value">
              {value}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Why Apollo">
        {/* TODO: replace these paragraphs with Apollo's own story. */}
        <p className="statement">Good technology shouldn&rsquo;t need a translator.</p>
        <p className="body-text">
          Whether it&rsquo;s a custom app or a small internal tool, we explain what&rsquo;s
          going on in plain words, tell you what it will cost before we begin, and stay available
          afterwards.
        </p>
        <p className="body-text">
          We&rsquo;re a small team, which means you deal with the people who actually do the work.
        </p>
      </Section>

      <Section label="What we care about" tone="tint">
        <div className="rows">
          {values.map((value) => (
            <Row key={value.title} title={value.title} text={value.text} />
          ))}
        </div>
      </Section>

      {partners.length > 0 && (
        <Section label="Certifications and partners">
          <div className="rows">
            {partners.map((partner) => (
              <Row key={partner.name} title={partner.name} text={partner.detail} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
