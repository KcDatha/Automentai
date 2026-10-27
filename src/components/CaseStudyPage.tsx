import { findCaseStudy } from '../data/caseStudies';
import { Icon } from './Icon';

interface CaseStudyPageProps {
  slug: string;
}

export function CaseStudyPage({ slug }: CaseStudyPageProps) {
  const study = findCaseStudy(slug);

  if (!study) {
    return (
      <div className="case-page">
        <a className="back" href="#work">
          <Icon name="back" size={16} /> All use cases
        </a>
        <h1>We could not find that example</h1>
        <p className="lede">The link may be out of date. Choose one from the list instead.</p>
        <div className="cta">
          <a className="btn" href="#work">
            See all use cases
          </a>
        </div>
      </div>
    );
  }

  return (
    <article className="case-page">
      <a className="back" href="#work">
        <Icon name="back" size={16} /> All use cases
      </a>
      <header>
        <div className="case-top">
          <span className="mono">{study.industry}</span>
          {study.isExample && <span className="chip">Illustrative example</span>}
        </div>
        <h1>{study.title}</h1>
        <p className="lede">{study.summary}</p>
      </header>

      <div className="case-cols" data-reveal>
        <section>
          <h2>The problem</h2>
          <p>{study.problem}</p>
        </section>
        <section>
          <h2>The approach</h2>
          <p>{study.solution}</p>
        </section>
      </div>

      <section data-reveal>
        <h2>What changes</h2>
        <div className="outcomes">
          {study.outcome.map((o) => (
            <div key={o.label}>
              <span>{o.label}</span>
              <b>{o.value}</b>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal>
        <h2>Typical building blocks</h2>
        <ul className="chips">
          {study.tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {study.isExample && (
        <p className="note">
          This is an illustrative example, not a description of a specific client. We agree on
          measurements with you before the pilot and report real numbers from your own data.
        </p>
      )}

      <div className="case-cta" data-reveal>
        <h2>Want to see this for your team?</h2>
        <p>Tell us how the work runs today and we will outline what a pilot would look like.</p>
        <a className="btn" href="#contact">
          Talk to us
        </a>
      </div>
    </article>
  );
}
