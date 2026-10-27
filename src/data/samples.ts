export type SampleId = 'invoice' | 'support' | 'contract';

export interface Sample {
  id: SampleId;
  label: string;
  kind: string;
  text: string;
}

/** Made-up documents used only by the in-browser demo. */
export const samples: Sample[] = [
  {
    id: 'invoice',
    label: 'Sample invoice',
    kind: 'Finance',
    text: [
      'INVOICE #INV-2041',
      'From: Northwind Supplies Ltd',
      'Date: 2026-09-28',
      'Due date: 2026-10-28',
      'PO number: PO-7781',
      'Description: Packaging materials, 12 pallets',
      'Total due: $4,860.00',
    ].join('\n'),
  },
  {
    id: 'support',
    label: 'Sample support email',
    kind: 'Customer support',
    text: [
      'Subject: Order 55102 arrived damaged',
      '',
      'Hi, my order 55102 arrived today and the box was crushed.',
      'The lamp inside is broken. I would like a replacement or a refund.',
      'This is the second time this has happened.',
      '',
      'Thanks, Priya',
    ].join('\n'),
  },
  {
    id: 'contract',
    label: 'Sample contract clause',
    kind: 'Operations',
    text: [
      '7.2 Renewal. This Agreement renews automatically for successive one-year terms',
      'unless either party gives written notice of non-renewal at least 60 days before',
      'the end of the current term.',
      '',
      '7.3 Fees. On each renewal the Supplier may increase the fees by up to 15%.',
      '',
      "7.4 Liability. The Customer's liability under this Agreement is unlimited.",
    ].join('\n'),
  },
];
