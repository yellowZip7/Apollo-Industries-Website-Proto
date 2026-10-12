import ContactForm from '../components/ContactForm';
import PageIntro from '../components/PageIntro';
import Row from '../components/Row';
import Section from '../components/Section';
import { site } from '../content/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Contact() {
  useDocumentTitle(
    'Contact',
    'Contact Apollo Industries about a new software project. A real person reads every message.',
  );

  return (
    <>
      <PageIntro title="Contact">
        Tell us a little about what you need. A real person reads every message. {site.responseTime}
      </PageIntro>

      <Section label="Send a message">
        <ContactForm />
      </Section>

      <Section label="Other ways to reach us" tone="tint">
        <div className="rows">
          <Row title="Email">
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </Row>
          <Row title="Phone">
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </Row>
          <Row title="Find us" text={site.location} />
          <Row title="Hours" text={site.hours} />
        </div>
      </Section>
    </>
  );
}
