import { reasons } from '../data/why';
import { Icon } from './Icon';

export function Why() {
  return (
    <section className="section" id="why">
      <div className="why">
        <div className="sec-head">
          <span className="mono">Why Automent AI</span>
          <h2>Automation your team can inspect, correct and trust</h2>
          <p>
            Plenty of AI demos look good for a day. We build systems meant to run for years inside a
            real company.
          </p>
        </div>
        <ul>
          {reasons.map((r) => (
            <li key={r.title}>
              <Icon name="tick" strokeWidth={2.2} />
              <div>
                <b>{r.title}</b>
                <span>{r.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
