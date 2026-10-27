import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { site } from '../data/site';
import {
  CONTACT_LIMITS,
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '../lib/contact';
import { setMessage, useMessage } from '../lib/draft';
import { useCopy } from '../lib/useCopy';

const endpoint = String(import.meta.env.VITE_FORM_ENDPOINT ?? '').trim();
const accessKey = String(import.meta.env.VITE_FORM_ACCESS_KEY ?? '').trim();

type Status = 'idle' | 'sending' | 'success' | 'error';

function EmailBlock({ compact = false }: { compact?: boolean }) {
  const mailRef = useRef<HTMLElement>(null);
  const { label, copy } = useCopy(site.email, 'Copy email address');
  const select = () => {
    const el = mailRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  return (
    <>
      <div className="row">
        <span className="mono">{compact ? 'Or email us' : 'Email'}</span>
        <b ref={mailRef}>{site.email}</b>
      </div>
      {!compact && (
        <div className="row">
          <span className="mono">Response time</span>
          <b>{site.responseTime}</b>
        </div>
      )}
      <button className={compact ? 'link-btn' : 'btn'} type="button" onClick={() => copy(select)}>
        {label}
      </button>
    </>
  );
}

function ContactForm() {
  const message = useMessage();
  const [values, setValues] = useState({ name: '', email: '', company: '', website: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const onField =
    (field: 'name' | 'email' | 'company' | 'website') => (e: ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (field !== 'company' && field !== 'website') clearError(field);
      if (status === 'success' || status === 'error') setStatus('idle');
    };

  const clearError = (field: ContactField) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const onMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    clearError('message');
    if (status === 'success' || status === 'error') setStatus('idle');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const all = { ...values, message };
    const found = validateContact(all);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    setStatus('sending');
    const result = await submitContact(all, { endpoint, accessKey: accessKey || undefined });
    if (result.ok) {
      setValues({ name: '', email: '', company: '', website: '' });
      setMessage('');
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="c-name">Your name</label>
        <input
          id="c-name"
          type="text"
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name}
          value={values.name}
          onChange={onField('name')}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'c-name-err' : undefined}
        />
        {errors.name && (
          <small id="c-name-err" className="err">
            {errors.name}
          </small>
        )}
      </div>
      <div className="field">
        <label htmlFor="c-email">Work email</label>
        <input
          id="c-email"
          type="email"
          autoComplete="email"
          maxLength={CONTACT_LIMITS.email}
          value={values.email}
          onChange={onField('email')}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'c-email-err' : undefined}
        />
        {errors.email && (
          <small id="c-email-err" className="err">
            {errors.email}
          </small>
        )}
      </div>
      <div className="field">
        <label htmlFor="c-company">Company (optional)</label>
        <input
          id="c-company"
          type="text"
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.company}
          value={values.company}
          onChange={onField('company')}
        />
      </div>
      <div className="field">
        <label htmlFor="c-message">What would you like to automate?</label>
        <textarea
          id="c-message"
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          value={message}
          onChange={onMessage}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'c-message-err' : undefined}
        />
        {errors.message && (
          <small id="c-message-err" className="err">
            {errors.message}
          </small>
        )}
      </div>

      {/* Spam trap. Hidden from people and from assistive technology. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="c-website">Leave this field empty</label>
        <input
          id="c-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={onField('website')}
        />
      </div>

      <button className="btn" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'success' && (
        <p className="form-msg ok" role="status">
          Thanks, we got your message. We reply {site.responseTime.toLowerCase()}.
        </p>
      )}
      {status === 'error' && (
        <p className="form-msg bad" role="alert">
          Your message was not sent, but what you wrote is still here. Try again, or email us at{' '}
          <b>{site.email}</b>.
        </p>
      )}

      <div className="mail-alt">
        <EmailBlock compact />
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact" data-reveal>
        <div>
          <h2>Pick one process. We will show you what automating it looks like.</h2>
          <p>
            Tell us about a task your team does over and over. In the first call we map it and
            estimate what a pilot would involve.
          </p>
        </div>
        <div className="card">
          {endpoint ? (
            <ContactForm />
          ) : (
            <>
              <p className="form-msg">
                The contact form is not switched on for this copy of the site. Email us directly.
              </p>
              <EmailBlock />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
