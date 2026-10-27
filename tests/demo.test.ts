import { describe, expect, it } from 'vitest';
import { samples } from '../src/data/samples';
import { runDemo, SAMPLE_PO_CATALOG } from '../src/lib/demo';

const sample = (id: 'invoice' | 'support' | 'contract') => samples.find((s) => s.id === id)!.text;
const field = (r: ReturnType<typeof runDemo>, label: string) =>
  r.fields.find((f) => f.label === label)?.value;

describe('invoice rules', () => {
  const result = runDemo('invoice', sample('invoice'));

  it('extracts the fields from the sample invoice', () => {
    expect(field(result, 'Vendor')).toBe('Northwind Supplies Ltd');
    expect(field(result, 'Invoice number')).toBe('INV-2041');
    expect(field(result, 'Amount')).toBe('$4,860.00');
    expect(field(result, 'Due date')).toBe('2026-10-28');
    expect(field(result, 'PO number')).toBe('PO-7781');
  });

  it('flags an amount above the purchase order and routes it to an approver', () => {
    expect(SAMPLE_PO_CATALOG['PO-7781']).toBe(4200);
    const flag = result.flags.find((f) => f.level === 'review');
    expect(flag?.text).toContain('$660.00');
    expect(flag?.text).toContain('15.7%');
    expect(result.next).toContain('approver');
  });

  it('passes an invoice that is within the purchase order', () => {
    const text = sample('invoice').replace('$4,860.00', '$4,100.00');
    const r = runDemo('invoice', text);
    expect(r.flags).toHaveLength(1);
    expect(r.flags[0].level).toBe('ok');
    expect(r.next).toContain('Post to the ERP');
  });

  it('flags a purchase order it does not know', () => {
    const r = runDemo('invoice', sample('invoice').replace('PO-7781', 'PO-9999'));
    expect(r.flags.some((f) => f.level === 'review' && f.text.includes('PO-9999'))).toBe(true);
  });

  it('reports missing fields instead of guessing', () => {
    const r = runDemo('invoice', 'INVOICE #A-1\nFrom: Someone');
    expect(field(r, 'Amount')).toBe('Not found');
    expect(r.flags[0].level).toBe('review');
    expect(r.flags[0].text).toContain('Amount');
  });
});

describe('support rules', () => {
  it('classifies the sample email as a high priority damaged item', () => {
    const r = runDemo('support', sample('support'));
    expect(field(r, 'Order number')).toBe('55102');
    expect(field(r, 'Category')).toBe('Damaged item');
    expect(field(r, 'Customer wants')).toBe('Replacement or refund');
    expect(field(r, 'Priority')).toBe('High');
    expect(r.flags.some((f) => f.level === 'review')).toBe(true);
    expect(r.next).toContain('escalate');
  });

  it('treats a first-time request as routine', () => {
    const r = runDemo('support', 'Hi, order 88231 has not arrived yet. Can you check where it is?');
    expect(field(r, 'Category')).toBe('Late delivery');
    expect(field(r, 'Priority')).toBe('Normal');
    expect(r.flags).toEqual([{ level: 'ok', text: 'Routine request the assistant can handle' }]);
  });
});

describe('contract rules', () => {
  it('finds the renewal, fee and liability terms in the sample clauses', () => {
    const r = runDemo('contract', sample('contract'));
    expect(field(r, 'Auto-renewal')).toBe('Yes, one-year terms');
    expect(field(r, 'Notice to cancel')).toBe('60 days before term end');
    expect(field(r, 'Fee increase on renewal')).toBe('Up to 15%');
    expect(field(r, 'Liability cap')).toBe('None (unlimited)');
    expect(r.flags.filter((f) => f.level === 'review')).toHaveLength(3);
    expect(r.next).toContain('3 flagged clauses');
  });

  it('approves a contract with nothing unusual', () => {
    const r = runDemo('contract', 'The parties agree to the services described in Schedule A.');
    expect(r.flags).toEqual([{ level: 'ok', text: 'No unusual terms found' }]);
    expect(r.next).toBe('Approve and file the contract');
  });
});

describe('determinism', () => {
  it('gives the same result for the same text every time', () => {
    for (const s of samples) {
      expect(runDemo(s.id, s.text)).toEqual(runDemo(s.id, s.text));
    }
  });
});
