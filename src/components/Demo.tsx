import { useEffect, useMemo, useRef, useState } from 'react';
import { samples, type SampleId } from '../data/samples';
import { demoSteps, runDemo } from '../lib/demo';
import { Icon } from './Icon';

export function Demo() {
  const [selected, setSelected] = useState<SampleId | null>(null);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  const sample = useMemo(() => samples.find((s) => s.id === selected) ?? null, [selected]);
  const result = useMemo(() => (sample ? runDemo(sample.id, sample.text) : null), [sample]);
  const total = demoSteps.length;
  const done = sample !== null && progress >= total;

  useEffect(() => {
    const list = timers;
    return () => list.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const choose = (id: SampleId) => {
    clearTimers();
    setSelected(id);
    setProgress(0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduce ? 120 : 750;
    for (let i = 0; i < total; i++) {
      timers.current.push(window.setTimeout(() => setProgress(i + 1), delay * (i + 1)));
    }
  };

  const reset = () => {
    clearTimers();
    setSelected(null);
    setProgress(0);
  };

  const reviewCount = result ? result.flags.filter((f) => f.level === 'review').length : 0;
  const status = !sample
    ? ''
    : !done
      ? `Step ${progress + 1} of ${total}: ${demoSteps[progress]}`
      : reviewCount > 0
        ? `Finished. ${reviewCount} ${reviewCount === 1 ? 'item needs' : 'items need'} review.`
        : 'Finished. Nothing needs review.';

  return (
    <section className="section" id="try">
      <div className="sec-head" data-reveal>
        <span className="mono">Try it</span>
        <h2>Watch one automation run on sample data</h2>
        <p>
          Pick a document and see the steps a real system would take: read it, pull out the facts,
          check them against the rules and decide where it goes next.
        </p>
      </div>

      <div className="demo" data-reveal>
        <div className="demo-col">
          <div className="demo-bar">
            <span className="mono">1. Choose a sample</span>
            <span className="chip">Sample data</span>
          </div>
          <div className="samples" role="group" aria-label="Choose a sample document">
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                className="sample-btn"
                aria-pressed={selected === s.id}
                onClick={() => choose(s.id)}
              >
                <span>{s.label}</span>
                <small>{s.kind}</small>
              </button>
            ))}
          </div>
          <pre className="sample-text" tabIndex={0} aria-label="Sample document text">
            {sample ? sample.text : 'Choose a sample above to start the demo.'}
          </pre>
        </div>

        <div className="demo-col">
          <div className="demo-bar">
            <span className="mono">2. Watch it run</span>
            <button type="button" className="link-btn" onClick={reset} disabled={!sample}>
              Reset
            </button>
          </div>
          <ol className="demo-steps">
            {demoSteps.map((label, i) => {
              const state = !sample
                ? 'idle'
                : i < progress
                  ? 'done'
                  : i === progress
                    ? 'active'
                    : 'idle';
              return (
                <li key={label} className={`dstep ${state}`}>
                  <span className="dot">
                    {state === 'done' ? <Icon name="tick" size={14} strokeWidth={3} /> : i + 1}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>

          {result && done ? (
            <div className="result">
              <dl>
                {result.fields.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="flags">
                {result.flags.map((f) => (
                  <li key={f.text} className={f.level}>
                    <b>{f.level === 'review' ? 'Review' : 'OK'}</b>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <p className="next">
                <span className="mono">Next action</span>
                {result.next}
              </p>
            </div>
          ) : (
            <div className="result empty">
              {sample ? 'Working on it…' : 'The extracted fields and next action appear here.'}
            </div>
          )}
        </div>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {status}
      </div>
      <p className="note">
        Sample data. This demo runs in your browser and does not send anything anywhere. It uses
        fixed rules on made-up documents, not a live AI model.
      </p>
    </section>
  );
}
