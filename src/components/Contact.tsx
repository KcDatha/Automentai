import { useRef, useState } from 'react';
import { site } from '../data/site';

export function Contact() {
  const mailRef = useRef<HTMLElement>(null);
  const [label, setLabel] = useState('Copy email address');

  const reset = () => window.setTimeout(() => setLabel('Copy email address'), 1800);

  const copy = () => {
    const fallback = () => {
      const el = mailRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setLabel('Selected: press Ctrl/Cmd+C');
      reset();
    };
    try {
      navigator.clipboard.writeText(site.email).then(() => {
        setLabel('Copied');
        reset();
      }, fallback);
    } catch {
      fallback();
    }
  };

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
          <div className="row">
            <span className="mono">Email</span>
            <b ref={mailRef}>{site.email}</b>
          </div>
          <div className="row">
            <span className="mono">Response time</span>
            <b>{site.responseTime}</b>
          </div>
          <button className="btn" type="button" onClick={copy}>
            {label}
          </button>
        </div>
      </div>
    </section>
  );
}
