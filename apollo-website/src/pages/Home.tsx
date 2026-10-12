import ButtonLink from '../components/ButtonLink';
import ContactForm from '../components/ContactForm';
import Avatar from '../components/Avatar';
import DotSun from '../components/DotSun';
import ProjectShowcase from '../components/ProjectShowcase';
import Row from '../components/Row';
import Section from '../components/Section';
import TextLink from '../components/TextLink';
import Timeline from '../components/Timeline';
import { hero } from '../content/home';
import { processSteps } from '../content/process';
import { projects } from '../content/projects';
import { services } from '../content/services';
import { site } from '../content/site';
import { stats } from '../content/stats';
import { team } from '../content/team';
import { technologies } from '../content/technologies';
import { testimonials } from '../content/testimonials';
import { values } from '../content/values';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle(
    undefined,
    'Apollo Industries is a software development company building custom web apps and internal tools for businesses.',
  );

  // The "We stay around" value is reused here; the band is skipped if it is ever renamed or removed.
  const stayAround = values.find((value) => value.title === 'We stay around');

  return (
    <>
      <section className="hero on-navy">
        <DotSun className="hero__art" />
        <div className="wrap hero__content">
          <h1 className="hero__title">
            {hero.title} <span className="hero__accent">{hero.accent}</span>
          </h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero__actions">
            <ButtonLink to="/contact?topic=project">Start a project</ButtonLink>
            <ButtonLink to="/about" variant="secondary">
              Meet the team
            </ButtonLink>
          </div>

          <aside className="glass hero__status" aria-label="When we reply">
            <p className="hero__status-title">
              <span className="hero__status-dot" aria-hidden="true" />
              {site.responseTime}
            </p>
            <p className="hero__status-text">{site.hours}</p>
          </aside>

          {stats.length > 0 && (
            <dl className="stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stats__item">
                  <dt className="stats__label">{stat.label}</dt>
                  <dd className="stats__value">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <Section label="What we do">
        <p className="statement">Custom software, done properly.</p>
        <div className="rows">
          {services.map((service) => (
            <Row
              key={service.id}
              icon={service.icon}
              title={service.name}
              text={service.description}
              tags={service.tags}
              to={`/services?section=${service.id}`}
            />
          ))}
        </div>
      </Section>

      {projects.length > 0 && (
        <Section label="Selected work" tone="tint">
          {projects.map((project) => (
            <ProjectShowcase key={project.name} project={project} />
          ))}
        </Section>
      )}

      <Section label="How we work">
        <p className="statement">No surprises, whether it&rsquo;s a new app or a small internal tool.</p>
        <Timeline steps={processSteps} />
      </Section>

      {stayAround && (
        <Section label="Our team" tone="navy">
          <div className="people">
            <figure className="people__photo">
              <picture>
                <source srcSet="/images/team.webp" type="image/webp" />
                <img
                  src="/images/team.jpg"
                  alt="The Apollo team gathered together, smiling and making peace signs"
                  width={1400}
                  height={918}
                  loading="lazy"
                />
              </picture>
            </figure>
            <div className="people__text">
              <p className="statement">{stayAround.title}.</p>
              <p className="body-text">{stayAround.text}</p>
              {team.length > 0 && (
                <ul className="avatar-stack" aria-label="Our founders">
                  {team.map((member) => (
                    <li key={member.id}>
                      <Avatar name={member.name} photo={member.photo} />
                      <span className="visually-hidden">{member.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <TextLink to="/about">{team.length > 0 ? 'Meet the founders' : 'Meet the team'}</TextLink>
            </div>
          </div>
        </Section>
      )}

      <Section label="Technologies">
        <p className="statement">The tools we build with.</p>
        <dl className="tech">
          {technologies.map((group) => (
            <div key={group.group} className="tech__row">
              <dt>{group.group}</dt>
              <dd className="tags">
                {group.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {testimonials.length > 0 && (
        <Section label="What clients say" tone="tint">
          <div className="quotes">
            {testimonials.map((item) => (
              <figure key={item.name} className="quote">
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  {item.name}
                  {item.company ? `, ${item.company}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section label="Contact" id="contact" tone="navy">
        <p className="statement">Tell us what&rsquo;s going on.</p>
        <p className="body-text">
          A short message is plenty. A real person reads every message and replies with questions
          or next steps. {site.responseTime}
        </p>
        <ContactForm />
      </Section>
    </>
  );
}
