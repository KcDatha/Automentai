export type RoiField = 'tasksPerWeek' | 'minutesPerTask' | 'people' | 'hourlyCost' | 'share';

export interface RoiInputs {
  /** Tasks each person does per week. */
  tasksPerWeek: number;
  minutesPerTask: number;
  people: number;
  /** Fully loaded cost of one hour of that person's time, in dollars. */
  hourlyCost: number;
  /** Share of the work that is automated, 20 to 90. */
  share: number;
}

export interface RoiResult {
  hoursPerMonthToday: number;
  hoursSavedPerMonth: number;
  costSavedPerMonth: number;
  costSavedPerYear: number;
}

export const ROI_LIMITS: Record<RoiField, { min: number; max: number; integer?: boolean }> = {
  tasksPerWeek: { min: 0, max: 5000 },
  minutesPerTask: { min: 0, max: 600 },
  people: { min: 1, max: 1000, integer: true },
  hourlyCost: { min: 0, max: 1000 },
  share: { min: 20, max: 90 },
};

export const ROI_DEFAULTS: Record<RoiField, string> = {
  tasksPerWeek: '40',
  minutesPerTask: '12',
  people: '3',
  hourlyCost: '35',
  share: '60',
};

export type RoiRaw = Record<RoiField, string>;
export type RoiErrors = Partial<Record<RoiField, string>>;

const WEEKS_PER_MONTH = 52 / 12;

/** Checks the text typed into each field and returns numbers, or a message per bad field. */
export function validateRoi(raw: RoiRaw): { values: RoiInputs | null; errors: RoiErrors } {
  const errors: RoiErrors = {};
  const values = {} as RoiInputs;

  (Object.keys(ROI_LIMITS) as RoiField[]).forEach((field) => {
    const { min, max, integer } = ROI_LIMITS[field];
    const text = raw[field].trim();
    const n = Number(text);
    if (text === '' || Number.isNaN(n) || !Number.isFinite(n)) {
      errors[field] = 'Enter a number';
    } else if (n < min) {
      errors[field] = `Enter ${min} or more`;
    } else if (n > max) {
      errors[field] = `Enter ${max} or less`;
    } else if (integer && !Number.isInteger(n)) {
      errors[field] = 'Enter a whole number';
    } else {
      values[field] = n;
    }
  });

  return { values: Object.keys(errors).length === 0 ? values : null, errors };
}

export function calculateRoi(inputs: RoiInputs): RoiResult {
  const hoursPerWeek = (inputs.tasksPerWeek * inputs.minutesPerTask * inputs.people) / 60;
  const hoursPerMonthToday = hoursPerWeek * WEEKS_PER_MONTH;
  const hoursSavedPerMonth = hoursPerMonthToday * (inputs.share / 100);
  const costSavedPerMonth = hoursSavedPerMonth * inputs.hourlyCost;
  return {
    hoursPerMonthToday,
    hoursSavedPerMonth,
    costSavedPerMonth,
    costSavedPerYear: costSavedPerMonth * 12,
  };
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const hoursFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatMoney = (n: number) => money.format(Math.round(n));
export const formatHours = (n: number) => hoursFmt.format(Math.round(n));

/** Text added to the contact message when the visitor sends their estimate along. */
export function formatEstimateMessage(inputs: RoiInputs, result: RoiResult): string {
  return [
    'My savings estimate from your calculator (an estimate from my own inputs):',
    `${inputs.people} ${inputs.people === 1 ? 'person' : 'people'} doing ${inputs.tasksPerWeek} tasks a week each, ${inputs.minutesPerTask} minutes per task, at ${formatMoney(inputs.hourlyCost)} an hour, with ${inputs.share}% automated.`,
    `That comes to about ${formatHours(result.hoursSavedPerMonth)} hours and ${formatMoney(result.costSavedPerMonth)} saved per month (${formatMoney(result.costSavedPerYear)} a year).`,
    'I would like to talk about where to start.',
  ].join('\n');
}
