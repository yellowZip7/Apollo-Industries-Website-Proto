import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contactTopics } from '../content/topics';
import type { ContactTopic } from '../content/topics';
import { site } from '../content/site';

type TopicValue = ContactTopic['value'];
type Status = 'idle' | 'opened' | 'copied' | 'copy-failed';

interface Errors {
  name?: string;
  message?: string;
}

function isTopicValue(value: string | null): value is TopicValue {
  return contactTopics.some((topic) => topic.value === value);
}

/**
 * Builds an email in the visitor's own mail app (a mailto link).
 * Nothing is sent until they press send there. A copy button covers
 * visitors who use webmail or have no mail app set up.
 */
export default function ContactForm() {
  const [params] = useSearchParams();
  const requested = params.get('topic');

  const [topic, setTopic] = useState<TopicValue>(isTopicValue(requested) ? requested : 'project');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = 'Enter your name so we know who to reply to.';
    if (!message.trim()) nextErrors.message = 'Tell us a little about what you need.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const selected = contactTopics.find((item) => item.value === topic) ?? contactTopics[0];
    const subject = encodeURIComponent(`${selected.subject} from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n${name.trim()}`);

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus('opened');
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus('copied');
    } catch {
      setStatus('copy-failed');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="topic">What can we help with?</label>
        <select
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value as TopicValue)}
        >
          {contactTopics.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p className="field__error" id="name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="message">Tell us what is going on</label>
        <textarea
          id="message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p className="field__error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          Open email
        </button>
        <button type="button" className="btn btn--secondary" onClick={copyAddress}>
          Copy email address
        </button>
      </div>
      <p className="form__note">
        This opens your email app with your message ready to go. Nothing is sent until you press
        send there.
      </p>

      <div role="status" aria-live="polite">
        {status === 'opened' && (
          <p className="form__status">
            Your email app should have opened. If it did not, copy our address and write to us from
            any email service: <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        )}
        {status === 'copied' && (
          <p className="form__status">Copied {site.email}. Paste it into any email app.</p>
        )}
        {status === 'copy-failed' && (
          <p className="form__status">
            We could not copy it automatically. Our address is{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        )}
      </div>
    </form>
  );
}
