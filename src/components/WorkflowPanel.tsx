import { useEffect, useState } from 'react';
import { workflowSteps } from '../data/workflow';
import { Icon } from './Icon';

export function WorkflowPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % workflowSteps.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="panel" aria-label="Example automation: invoice processing">
      <div className="panel-head">
        <span className="mono">Example: invoice intake</span>
        <span className="live">
          <i></i>Running
        </span>
      </div>
      <ol className="flow">
        {workflowSteps.map((step, i) => (
          <li key={step.title} className={i === active ? 'step on' : 'step'}>
            <span className="ic">
              <Icon name={step.icon} size={18} />
            </span>
            <div>
              <b>{step.title}</b>
              <small>{step.detail}</small>
            </div>
            <span className="tag">{step.time}</span>
          </li>
        ))}
      </ol>
      <div className="panel-foot">
        <span>
          Manual handling <b>~10 min</b>
        </span>
        <span>
          Automated <b>~10 sec</b>
        </span>
      </div>
    </div>
  );
}
