import ButtonLink from '../components/ButtonLink';
import PageIntro from '../components/PageIntro';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <>
      <PageIntro title="That page isn't here.">
        The link may be old, or the address may have a typo. Go back to the home page or send us a
        message.
      </PageIntro>
      <section className="not-found">
        <div className="wrap hero__actions">
          <ButtonLink to="/">Go to the home page</ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Contact us
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
