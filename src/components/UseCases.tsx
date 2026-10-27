import { useCases } from '../data/useCases';

export function UseCases() {
  return (
    <section className="section" id="work">
      <div className="sec-head" data-reveal>
        <span className="mono">Example use cases</span>
        <h2>What this looks like in a real department</h2>
        <p>Typical starting points for companies in operations, finance, support and sales.</p>
      </div>
      <div className="cases" data-reveal>
        {useCases.map((c) => (
          <article className="case" key={c.title}>
            <span className="mono">{c.area}</span>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <div className="ba">
              <div>
                <span>Before</span>
                <b>{c.before}</b>
              </div>
              <div>
                <span>After</span>
                <b>{c.after}</b>
              </div>
            </div>
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
