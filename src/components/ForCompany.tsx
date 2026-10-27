import { findCaseStudy, type CaseStudy } from '../data/caseStudies';
import { defaultPlan, industryPlans } from '../data/industries';
import { useShowcase } from '../lib/showcase';
import { Icon } from './Icon';

export function ForCompany() {
  const { company, industry } = useShowcase();
  if (!company) return null;

  const plan = industry ? industryPlans[industry] : defaultPlan;
  const studies = plan.slugs
    .map((slug) => findCaseStudy(slug))
    .filter((c): c is CaseStudy => c !== undefined);
  const intro = industry
    ? `Three automations that fit ${industryPlans[industry].label.toLowerCase()} teams, and the first pilot we would suggest.`
    : 'Three common starting points, and the first pilot we would suggest. We will adjust them once we hear how your work runs.';

  return (
    <section className="section" id="for-company">
      <div className="sec-head" data-reveal>
        <span className="mono">For {company}</span>
        <h2>Where we would start at {company}</h2>
        <p>{intro}</p>
      </div>
      <div className="grid" data-reveal>
        {studies.map((c) => (
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
      <div className="pilot" data-reveal>
        <span className="mono">Suggested first pilot</span>
        <p>{plan.pilot}</p>
      </div>
    </section>
  );
}
