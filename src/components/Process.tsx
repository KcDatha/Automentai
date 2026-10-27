import { processStages } from '../data/process';

export function Process() {
  return (
    <section className="section" id="process">
      <div className="sec-head">
        <span className="mono">How we work</span>
        <h2>From first call to a system your team trusts</h2>
        <p>Four stages, each with something you can see and test before the next one starts.</p>
      </div>
      <div className="rail">
        {processStages.map((stage, i) => (
          <div key={stage.title}>
            <span className="n">STAGE {i + 1}</span>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
            <span className="wk">{stage.output}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
