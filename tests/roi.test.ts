import { describe, expect, it } from 'vitest';
import {
  ROI_DEFAULTS,
  calculateRoi,
  formatEstimateMessage,
  formatHours,
  formatMoney,
  validateRoi,
  type RoiInputs,
  type RoiRaw,
} from '../src/lib/roi';

const base: RoiInputs = {
  tasksPerWeek: 40,
  minutesPerTask: 12,
  people: 3,
  hourlyCost: 35,
  share: 60,
};

describe('calculateRoi', () => {
  it('works out hours and cost for the example inputs', () => {
    // 40 tasks x 12 min x 3 people = 1440 min = 24 h a week; x 52/12 = 104 h a month
    const r = calculateRoi(base);
    expect(r.hoursPerMonthToday).toBeCloseTo(104, 6);
    expect(r.hoursSavedPerMonth).toBeCloseTo(62.4, 6);
    expect(r.costSavedPerMonth).toBeCloseTo(2184, 6);
    expect(r.costSavedPerYear).toBeCloseTo(26208, 6);
  });

  it('returns zero when there is no work to automate', () => {
    const r = calculateRoi({ ...base, tasksPerWeek: 0 });
    expect(r.hoursSavedPerMonth).toBe(0);
    expect(r.costSavedPerYear).toBe(0);
  });

  it('scales linearly with people and with the share automated', () => {
    const one = calculateRoi({ ...base, people: 1 });
    const four = calculateRoi({ ...base, people: 4 });
    expect(four.hoursSavedPerMonth).toBeCloseTo(one.hoursSavedPerMonth * 4, 6);
    const low = calculateRoi({ ...base, share: 30 });
    const high = calculateRoi({ ...base, share: 90 });
    expect(high.costSavedPerMonth).toBeCloseTo(low.costSavedPerMonth * 3, 6);
  });

  it('makes the yearly figure twelve times the monthly figure', () => {
    const r = calculateRoi({ ...base, hourlyCost: 52.5, minutesPerTask: 7 });
    expect(r.costSavedPerYear).toBeCloseTo(r.costSavedPerMonth * 12, 6);
  });
});

describe('validateRoi', () => {
  it('accepts the default example values', () => {
    const { values, errors } = validateRoi(ROI_DEFAULTS);
    expect(errors).toEqual({});
    expect(values).toEqual(base);
  });

  const withField = (field: keyof RoiRaw, value: string): RoiRaw => ({
    ...ROI_DEFAULTS,
    [field]: value,
  });

  it('rejects empty and non-numeric text', () => {
    expect(validateRoi(withField('tasksPerWeek', '')).errors.tasksPerWeek).toBe('Enter a number');
    expect(validateRoi(withField('hourlyCost', 'abc')).errors.hourlyCost).toBe('Enter a number');
    expect(validateRoi(withField('minutesPerTask', '   ')).errors.minutesPerTask).toBe(
      'Enter a number',
    );
  });

  it('rejects negatives and values over the maximum', () => {
    expect(validateRoi(withField('tasksPerWeek', '-1')).errors.tasksPerWeek).toBe(
      'Enter 0 or more',
    );
    expect(validateRoi(withField('minutesPerTask', '601')).errors.minutesPerTask).toBe(
      'Enter 600 or less',
    );
    expect(validateRoi(withField('people', '0')).errors.people).toBe('Enter 1 or more');
    expect(validateRoi(withField('share', '95')).errors.share).toBe('Enter 90 or less');
    expect(validateRoi(withField('share', '10')).errors.share).toBe('Enter 20 or more');
  });

  it('requires a whole number of people', () => {
    expect(validateRoi(withField('people', '2.5')).errors.people).toBe('Enter a whole number');
  });

  it('returns no values while any field is invalid', () => {
    expect(validateRoi(withField('people', 'x')).values).toBeNull();
  });
});

describe('formatting', () => {
  it('formats money without cents and hours as whole numbers', () => {
    expect(formatMoney(2184)).toBe('$2,184');
    expect(formatMoney(26207.6)).toBe('$26,208');
    expect(formatHours(62.4)).toBe('62');
  });

  it('writes the estimate into the message with the inputs and results', () => {
    const text = formatEstimateMessage(base, calculateRoi(base));
    expect(text).toContain('3 people');
    expect(text).toContain('60% automated');
    expect(text).toContain('62 hours');
    expect(text).toContain('$2,184');
    expect(text).toContain('$26,208 a year');
  });
});
