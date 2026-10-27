import { useRef, useState } from 'react';
import { industryList } from '../data/industries';
import { buildShowcaseUrl, MAX_LENGTH } from '../lib/showcase';
import { Icon } from './Icon';

export function Builder() {
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [contact, setContact] = useState('');
  const [copied, setCopied] = useState('Copy link');
  const linkRef = useRef<HTMLInputElement>(null);

  const base = `${window.location.origin}${window.location.pathname}`;
  const link = buildShowcaseUrl(base, { company, industry, contact });
  const hasCompany = company.trim().length > 0;

  const copy = () => {
    const done = (text: string) => {
      setCopied(text);
      window.setTimeout(() => setCopied('Copy link'), 1800);
    };
    const fallback = () => {
      linkRef.current?.select();
      done('Selected: press Ctrl/Cmd+C');
    };
    try {
      navigator.clipboard.writeText(link).then(() => done('Copied'), fallback);
    } catch {
      fallback();
    }
  };

  return (
    <div className="builder">
      <a className="back" href="#top">
        <Icon name="back" size={16} /> Back to the site
      </a>
      <header>
        <span className="mono">Internal tool</span>
        <h1>Share link builder</h1>
        <p className="lede">
          Make a link that opens the site with the company name and a relevant starting point. Send
          it before a meeting or open it on the screen.
        </p>
      </header>

      <form className="builder-form" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="b-company">Company name</label>
          <input
            id="b-company"
            type="text"
            value={company}
            maxLength={MAX_LENGTH}
            placeholder="Acme Logistics"
            autoComplete="off"
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="b-industry">Industry</label>
          <select id="b-industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="">Not sure yet</option>
            {industryList.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="b-contact">Person we are meeting (optional)</label>
          <input
            id="b-contact"
            type="text"
            value={contact}
            maxLength={MAX_LENGTH}
            placeholder="Dana Whitfield"
            autoComplete="off"
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
      </form>

      <div className="link-out">
        <label htmlFor="b-link">Your link</label>
        <div className="link-row">
          <input id="b-link" ref={linkRef} type="text" readOnly value={link} />
          <button type="button" className="btn" onClick={copy} disabled={!hasCompany}>
            {copied}
          </button>
        </div>
        {!hasCompany && <p className="hint">Enter a company name to personalise the link.</p>}
        <div className="cta">
          <a className="btn ghost" href={link} target="_blank" rel="noreferrer">
            Open preview in a new tab
          </a>
        </div>
      </div>

      <p className="note">
        Names are shown as plain text and shortened to {MAX_LENGTH} characters. Personalised pages
        ask search engines not to index them.
      </p>
    </div>
  );
}
