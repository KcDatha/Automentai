export type IndustryId =
  'finance' | 'support' | 'sales' | 'operations' | 'healthcare' | 'logistics' | 'retail';

export interface CaseOutcome {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** Display name of the department or industry shown on the card. */
  industry: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: CaseOutcome[];
  tools: string[];
  /** True for illustrative examples. Set to false only for real, approved client work. */
  isExample: boolean;
}

const measured = {
  label: 'Measured in the pilot',
  value: 'Time per item, error rate and share handled without review',
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'accounts-payable',
    title: 'Accounts payable intake',
    industry: 'Finance',
    summary:
      'Invoices arrive in many formats from many vendors. The system reads each one, matches it to a purchase order and queues exceptions for review.',
    problem:
      'Invoices come in by email and portal in dozens of layouts. Staff retype each one into the ERP, check it against the purchase order and chase approvals, so errors and late payments creep in.',
    solution:
      'An intake flow reads every invoice, pulls out vendor, amount, due date and PO number, and checks them against the purchase order. Clean invoices post automatically. Mismatches go to an approver with the difference highlighted.',
    outcome: [
      { label: 'Before', value: 'Staff key in every invoice by hand' },
      { label: 'After', value: 'Staff review flagged exceptions only' },
      measured,
    ],
    tools: ['Email inbox', 'Document extraction', 'ERP', 'Approval queue'],
    isExample: true,
  },
  {
    slug: 'support-agent',
    title: 'First-line support agent',
    industry: 'Customer support',
    summary:
      'An assistant answers common questions from your help center and order data, and passes complex cases to a person with the context attached.',
    problem:
      'Every ticket lands in one queue, so simple questions about orders and returns wait behind hard cases. Agents spend their day looking up the same answers.',
    solution:
      'An assistant answers routine questions using your help center and live order data. Anything unusual, repeated or emotional goes to a person with the conversation and order history already attached.',
    outcome: [
      { label: 'Before', value: 'Every ticket waits in one queue' },
      { label: 'After', value: 'Routine questions answered instantly' },
      measured,
    ],
    tools: ['Help desk', 'Order system', 'Knowledge base', 'Escalation rules'],
    isExample: true,
  },
  {
    slug: 'lead-research',
    title: 'Lead research and CRM updates',
    industry: 'Sales operations',
    summary:
      'New leads are enriched, scored and logged in your CRM, with a short briefing written for the rep before the first call.',
    problem:
      'Reps copy details from websites and emails into the CRM and research each lead before a call. The work is slow and records end up incomplete.',
    solution:
      'New leads are matched to company information, scored against your criteria and written to the CRM. The rep gets a short briefing with the lead context before the first call.',
    outcome: [
      { label: 'Before', value: 'Reps research leads by hand' },
      { label: 'After', value: 'Every lead arrives with a briefing' },
      measured,
    ],
    tools: ['CRM', 'Web forms', 'Company data source', 'Email'],
    isExample: true,
  },
  {
    slug: 'contract-review',
    title: 'Contract and compliance review',
    industry: 'Operations',
    summary:
      'Incoming contracts are scanned for key terms, deadlines and unusual clauses, with each finding linked back to the source page.',
    problem:
      'Every contract gets a full read-through, even when most follow a standard pattern. Renewal dates and risky clauses are easy to miss.',
    solution:
      'Contracts are scanned for renewal terms, notice periods, fee changes and liability limits. Each finding links to the source page so a reviewer can jump straight to it. Deadlines go into the calendar.',
    outcome: [
      { label: 'Before', value: 'Full read-through for every contract' },
      { label: 'After', value: 'Reviewers jump to flagged clauses' },
      measured,
    ],
    tools: ['Document storage', 'Clause extraction', 'Calendar', 'Review queue'],
    isExample: true,
  },
  {
    slug: 'patient-intake',
    title: 'Intake form processing',
    industry: 'Healthcare administration',
    summary:
      'Paper and PDF intake forms become structured records, with missing or unclear fields sent back for a quick human check.',
    problem:
      'Front-desk staff retype handwritten and PDF forms into the records system. Mistakes and missing fields only surface later, when someone needs the data.',
    solution:
      'Forms are read and turned into structured entries. Missing, unclear or conflicting fields are flagged for a staff member to confirm. Access is limited to the people who already see this data, and every change is logged.',
    outcome: [
      { label: 'Before', value: 'Staff retype every form' },
      { label: 'After', value: 'Staff confirm only the flagged fields' },
      measured,
    ],
    tools: ['Form scans', 'Document extraction', 'Records system', 'Audit log'],
    isExample: true,
  },
  {
    slug: 'shipment-documents',
    title: 'Shipment document processing',
    industry: 'Logistics',
    summary:
      'Bills of lading, delivery notes and customs forms are read, cross-checked against orders and filed automatically.',
    problem:
      'Shipping paperwork arrives from carriers and suppliers in many formats. Coordinators compare it by hand against orders, and mismatches are found late.',
    solution:
      'Each document is read and cross-checked against the order and the other paperwork for the same shipment. Matches are filed automatically. Differences go to a coordinator with both versions side by side.',
    outcome: [
      { label: 'Before', value: 'Coordinators compare paperwork by hand' },
      { label: 'After', value: 'Coordinators resolve only the mismatches' },
      measured,
    ],
    tools: ['Email inbox', 'Document extraction', 'Order system', 'Shared drive'],
    isExample: true,
  },
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
