import { services } from '../data/services';
import { Icon } from './Icon';

export function Services() {
  return (
    <section className="section" id="services">
      <div className="sec-head">
        <span className="mono">What we build</span>
        <h2>Six ways we put AI to work inside your business</h2>
        <p>
          Each engagement starts from a real process in your company, not a demo. We build it,
          connect it to your tools and stay on to keep it accurate.
        </p>
      </div>
      <div className="grid">
        {services.map((s) => (
          <article className="svc" key={s.id}>
            <span className="ic">
              <Icon name={s.icon} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <ul>
              {s.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
