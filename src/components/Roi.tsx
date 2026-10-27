import { useMemo, useState } from 'react';
import {
  ROI_DEFAULTS,
  ROI_LIMITS,
  calculateRoi,
  formatEstimateMessage,
  formatHours,
  formatMoney,
  validateRoi,
  type RoiField,
  type RoiRaw,
} from '../lib/roi';
import { appendToMessage } from '../lib/draft';

interface FieldDef {
  id: RoiField;
  label: string;
  hint: string;
  step?: number;
}

const fields: FieldDef[] = [
  {
    id: 'tasksPerWeek',
    label: 'Tasks per person each week',
    hint: 'For example, invoices handled',
  },
  { id: 'minutesPerTask', label: 'Minutes per task', hint: 'Average, start to finish' },
  { id: 'people', label: 'People doing this work', hint: 'Whole number' },
  { id: 'hourlyCost', label: 'Cost per hour (US dollars)', hint: 'Salary plus overhead' },
];

export function Roi() {
  const [raw, setRaw] = useState<RoiRaw>(ROI_DEFAULTS);
  const [sent, setSent] = useState(false);

  const { values, errors } = useMemo(() => validateRoi(raw), [raw]);
  const result = useMemo(() => (values ? calculateRoi(values) : null), [values]);

  const update = (field: RoiField, value: string) => {
    setSent(false);
    setRaw((r) => ({ ...r, [field]: value }));
  };

  const addToMessage = () => {
    if (!values || !result) return;
    appendToMessage(formatEstimateMessage(values, result));
    setSent(true);
    window.location.hash = '#contact';
  };

  return (
    <section className="section" id="estimate">
      <div className="sec-head" data-reveal>
        <span className="mono">Estimate your savings</span>
        <h2>What could one repeated task be worth?</h2>
        <p>
          Enter how a task runs today. The numbers below start with an example. Replace them with
          yours.
        </p>
      </div>

      <div className="roi" data-reveal>
        <form className="roi-form" onSubmit={(e) => e.preventDefault()} noValidate>
          {fields.map((f) => {
            const limit = ROI_LIMITS[f.id];
            const err = errors[f.id];
            return (
              <div className="field" key={f.id}>
                <label htmlFor={`roi-${f.id}`}>{f.label}</label>
                <input
                  id={`roi-${f.id}`}
                  type="number"
                  inputMode="decimal"
                  min={limit.min}
                  max={limit.max}
                  step={limit.integer ? 1 : 'any'}
                  value={raw[f.id]}
                  aria-invalid={err ? true : undefined}
                  aria-describedby={`roi-${f.id}-note`}
                  onChange={(e) => update(f.id, e.target.value)}
                />
                <small id={`roi-${f.id}-note`} className={err ? 'err' : 'hint'}>
                  {err ?? f.hint}
                </small>
              </div>
            );
          })}
          <div className="field">
            <label htmlFor="roi-share">
              Share of the work automated: <b>{raw.share}%</b>
            </label>
            <input
              id="roi-share"
              type="range"
              min={ROI_LIMITS.share.min}
              max={ROI_LIMITS.share.max}
              step={5}
              value={raw.share}
              aria-describedby="roi-share-note"
              onChange={(e) => update('share', e.target.value)}
            />
            <small id="roi-share-note" className="hint">
              Between 20% and 90%. Some work always needs a person.
            </small>
          </div>
        </form>

        <div className="roi-out" aria-live="polite">
          <span className="mono">Your estimate</span>
          {result ? (
            <>
              <dl>
                <div>
                  <dt>Hours saved per month</dt>
                  <dd>{formatHours(result.hoursSavedPerMonth)}</dd>
                </div>
                <div>
                  <dt>Cost saved per month</dt>
                  <dd>{formatMoney(result.costSavedPerMonth)}</dd>
                </div>
                <div className="big">
                  <dt>Cost saved per year</dt>
                  <dd>{formatMoney(result.costSavedPerYear)}</dd>
                </div>
              </dl>
              <button type="button" className="btn" onClick={addToMessage}>
                Add this to my message
              </button>
              {sent && <p className="hint">Added. Your message is ready in the contact form.</p>}
            </>
          ) : (
            <p className="hint">Fix the highlighted fields to see your estimate.</p>
          )}
          <details className="how">
            <summary>How we calculate this</summary>
            <p>
              Hours per month today = tasks per person each week × minutes per task ÷ 60 × number of
              people × 52 ÷ 12.
            </p>
            <p>
              Hours saved = hours per month today × share automated. Cost saved per month = hours
              saved × cost per hour. Cost saved per year = cost saved per month × 12.
            </p>
          </details>
          <p className="note">
            An estimate based on your inputs. We confirm real numbers during the pilot.
          </p>
        </div>
      </div>
    </section>
  );
}
