import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import Faq from '../components/Faq';
import PageIntro from '../components/PageIntro';
import Row from '../components/Row';
import Section from '../components/Section';
import TextLink from '../components/TextLink';
import { faqs } from '../content/faqs';
import { projects } from '../content/projects';
import { services } from '../content/services';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Services() {
  useDocumentTitle(
    'Services',
    'Custom software development from Apollo Industries: websites, web apps, internal tools and automations.',
  );

  // Scroll to a service when linked from the Home page, for example /services?section=software
  const [params] = useSearchParams();
  const section = params.get('section');

  useEffect(() => {
    if (!section) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [section]);

  return (
    <>
      <PageIntro title="Services">
        We build custom software around the way you work, from the first sketch to a working product.
      </PageIntro>

      {services.map((service) => (
        <Section key={service.id} id={service.id} label={service.name}>
          <div className="block__icon">
            <Icon name={service.icon} />
          </div>
          <p className="statement">{service.summary}</p>
          <p className="body-text">{service.description}</p>

          <div className="groups">
            {service.groups.map((group) => (
              <div key={group.heading}>
                <div className="group__head">
                  {group.icon && <Icon name={group.icon} small />}
                  <h3 className="group__title">{group.heading}</h3>
                </div>
                {group.intro && <p className="group__intro">{group.intro}</p>}
                <ul className="list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {service.id === 'software' && projects.length > 0 && (
            <div className="example">
              <h3 className="group__title">Example</h3>
              <div className="rows">
                {projects.map((project) => (
                  <Row
                    key={project.name}
                    title={project.name}
                    text={project.summary}
                    tags={[project.kind]}
                    href={project.url}
                  />
                ))}
              </div>
            </div>
          )}

          <TextLink to={`/contact?topic=${service.topic}`}>{service.cta}</TextLink>
        </Section>
      ))}

      <Section label="Common questions" tone="tint">
        <Faq items={faqs} />
      </Section>

      <Section label="Something else?">
        <p className="body-text">
          If what you need isn&rsquo;t listed, ask anyway. If it&rsquo;s not something we do well, we
          will say so, and point you somewhere better if we can.
        </p>
        <TextLink to="/contact">Get in touch</TextLink>
      </Section>
    </>
  );
}
