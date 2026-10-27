import { site } from '../data/site';
import { WorkflowPanel } from './WorkflowPanel';

export function Hero() {
  return (
    <div className="hero">
      <div>
        <span className="mono">AI automation studio</span>
        <h1>
          Automate the work your team <em>repeats every day.</em>
        </h1>
        <p className="lede">{site.description}</p>
        <div className="cta">
          <a className="btn" href="#contact">
            Book a discovery call
          </a>
          <a className="btn ghost" href="#work">
            See example use cases
          </a>
        </div>
        <div className="meta">
          <span>
            <i></i>Human review built in
          </span>
          <span>
            <i></i>Works with your existing tools
          </span>
          <span>
            <i></i>Pilot in weeks
          </span>
        </div>
      </div>
      <WorkflowPanel />
    </div>
  );
}
