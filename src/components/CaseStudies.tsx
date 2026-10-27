import { caseStudies } from '../data/caseStudies';
import { Icon } from './Icon';

export function CaseStudies() {
  return (
    <section className="section" id="work">
      <div className="sec-head" data-reveal>
        <span className="mono">Example use cases</span>
        <h2>What this looks like in a real department</h2>
        <p>
          Typical starting points for companies in finance, support, sales, operations, healthcare
          and logistics. Open one to see the problem, the approach and how we measure it.
        </p>
      </div>
      <div className="grid" data-reveal>
        {caseStudies.map((c) => (
          <article className="case-card" key={c.slug}>
            <div className="case-top">
              <span className="mono">{c.industry}</span>
              {c.isExample && <span className="chip">Illustrative example</span>}
            </div>
            <h3>
              <a href={`#case/${c.slug}`}>{c.title}</a>
            </h3>
            <p>{c.summary}</p>
            <span className="more" aria-hidden="true">
              Read the example <Icon name="arrow" size={16} />
            </span>
          </article>
        ))}
      </div>
      <p className="note">
        These are illustrative examples of the kind of work we do. Results depend on your data and
        process; we measure them with you during the pilot.
      </p>
    </section>
  );
}
