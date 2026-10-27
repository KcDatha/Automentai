import type { SampleId } from '../data/samples';

export interface DemoField {
  label: string;
  value: string;
}

export interface DemoFlag {
  level: 'ok' | 'review';
  text: string;
}

export interface DemoResult {
  fields: DemoField[];
  flags: DemoFlag[];
  next: string;
}

/**
 * Purchase orders the demo "knows about". Sample data only.
 * Maps a PO number to its approved amount in dollars.
 */
export const SAMPLE_PO_CATALOG: Record<string, number> = {
  'PO-7781': 4200,
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function match(text: string, re: RegExp): string | null {
  const m = text.match(re);
  return m && m[1] ? m[1].trim() : null;
}

function runInvoice(text: string): DemoResult {
  const vendor = match(text, /From:\s*(.+)/i);
  const number = match(text, /INVOICE\s*#?\s*([A-Z0-9-]+)/i);
  const due = match(text, /Due date:\s*(\d{4}-\d{2}-\d{2})/i);
  const po = match(text, /PO number:\s*([A-Z]+-\d+)/i);
  const amountRaw = match(text, /Total due:\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const amount = amountRaw ? Number(amountRaw.replace(/,/g, '')) : null;

  const fields: DemoField[] = [
    { label: 'Vendor', value: vendor ?? 'Not found' },
    { label: 'Invoice number', value: number ?? 'Not found' },
    { label: 'Amount', value: amount !== null ? money.format(amount) : 'Not found' },
    { label: 'Due date', value: due ?? 'Not found' },
    { label: 'PO number', value: po ?? 'Not found' },
  ];

  const flags: DemoFlag[] = [];
  const missing = fields.filter((f) => f.value === 'Not found').map((f) => f.label);
  if (missing.length > 0) {
    flags.push({ level: 'review', text: `Missing: ${missing.join(', ')}` });
  }
  if (po && amount !== null) {
    const approved = SAMPLE_PO_CATALOG[po];
    if (approved === undefined) {
      flags.push({ level: 'review', text: `${po} was not found in the purchase order list` });
    } else if (amount > approved) {
      const diff = amount - approved;
      const pct = ((diff / approved) * 100).toFixed(1);
      flags.push({
        level: 'review',
        text: `Amount is ${money.format(diff)} (${pct}%) above the approved ${money.format(approved)} on ${po}`,
      });
    } else {
      flags.push({
        level: 'ok',
        text: `Amount is within the approved ${money.format(approved)} on ${po}`,
      });
    }
  }

  const needsReview = flags.some((f) => f.level === 'review');
  return {
    fields,
    flags,
    next: needsReview
      ? 'Send to the accounts payable approver with the mismatch highlighted'
      : 'Post to the ERP and schedule payment for the due date',
  };
}

function runSupport(text: string): DemoResult {
  const order = match(text, /order\s*#?\s*(\d{4,})/i);
  const lower = text.toLowerCase();

  let category = 'General question';
  if (/damaged|broken|crushed|cracked/.test(lower)) category = 'Damaged item';
  else if (/late|delay|not arrived|hasn'?t arrived/.test(lower)) category = 'Late delivery';
  else if (/refund|charge/.test(lower)) category = 'Billing';

  const wantsReplacement = /replacement|replace/.test(lower);
  const wantsRefund = /refund/.test(lower);
  const request =
    wantsReplacement && wantsRefund
      ? 'Replacement or refund'
      : wantsReplacement
        ? 'Replacement'
        : wantsRefund
          ? 'Refund'
          : 'Information';

  const repeat = /second time|third time|again|every time|keeps happening/.test(lower);
  const upset = /unacceptable|furious|terrible|angry/.test(lower);
  const priority = repeat || upset ? 'High' : 'Normal';

  const fields: DemoField[] = [
    { label: 'Order number', value: order ?? 'Not found' },
    { label: 'Category', value: category },
    { label: 'Customer wants', value: request },
    { label: 'Priority', value: priority },
  ];

  const flags: DemoFlag[] = [];
  if (repeat)
    flags.push({ level: 'review', text: 'Repeat issue reported, so a person should handle it' });
  if (upset) flags.push({ level: 'review', text: 'Customer sounds upset' });
  if (flags.length === 0)
    flags.push({ level: 'ok', text: 'Routine request the assistant can handle' });

  return {
    fields,
    flags,
    next:
      priority === 'High'
        ? 'Offer a replacement now and escalate to a support lead with the order history attached'
        : 'Reply with the standard answer and close the ticket',
  };
}

function runContract(text: string): DemoResult {
  const autoRenew = /renews automatically/i.test(text);
  const notice = match(text, /(\d+)\s*days/i);
  const increase = match(text, /(\d+)\s*%/);
  const unlimited = /unlimited/i.test(text);

  const fields: DemoField[] = [
    { label: 'Auto-renewal', value: autoRenew ? 'Yes, one-year terms' : 'No' },
    { label: 'Notice to cancel', value: notice ? `${notice} days before term end` : 'Not found' },
    { label: 'Fee increase on renewal', value: increase ? `Up to ${increase}%` : 'None stated' },
    { label: 'Liability cap', value: unlimited ? 'None (unlimited)' : 'Not stated' },
  ];

  const flags: DemoFlag[] = [];
  if (unlimited)
    flags.push({ level: 'review', text: 'Unlimited liability. Ask legal to negotiate a cap' });
  if (autoRenew && notice) {
    flags.push({
      level: 'review',
      text: `Cancellation deadline is ${notice} days before term end. Add it to the calendar`,
    });
  }
  if (increase && Number(increase) > 10) {
    flags.push({ level: 'review', text: `Fees can rise by up to ${increase}% at each renewal` });
  }
  if (flags.length === 0) flags.push({ level: 'ok', text: 'No unusual terms found' });

  const count = flags.filter((f) => f.level === 'review').length;
  return {
    fields,
    flags,
    next:
      count > 0
        ? `Send to the legal reviewer with ${count} flagged clause${count === 1 ? '' : 's'} linked to the source text`
        : 'Approve and file the contract',
  };
}

/** Deterministic rules, not a live model. The same text always gives the same result. */
export function runDemo(id: SampleId, text: string): DemoResult {
  switch (id) {
    case 'invoice':
      return runInvoice(text);
    case 'support':
      return runSupport(text);
    case 'contract':
      return runContract(text);
  }
}

export const demoSteps = [
  'Reading the text',
  'Extracting the fields',
  'Checking the rules',
  'Routing the result',
] as const;
