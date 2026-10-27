export interface UseCase {
  area: string;
  title: string;
  description: string;
  before: string;
  after: string;
}

export const useCases: UseCase[] = [
  {
    area: 'Finance',
    title: 'Accounts payable intake',
    description:
      'Invoices arrive in many formats from many vendors. The system reads each one, matches it to a purchase order and queues exceptions for review.',
    before: 'Staff key in every invoice by hand',
    after: 'Staff review flagged exceptions only',
  },
  {
    area: 'Customer support',
    title: 'First-line support agent',
    description:
      'An assistant answers common questions from your help center and order data, and passes complex cases to a person with the context attached.',
    before: 'Every ticket waits in one queue',
    after: 'Routine questions answered instantly',
  },
  {
    area: 'Sales operations',
    title: 'Lead research and CRM updates',
    description:
      'New leads are enriched, scored and logged in your CRM, with a short briefing written for the rep before the first call.',
    before: 'Reps research leads by hand',
    after: 'Every lead arrives with a briefing',
  },
  {
    area: 'Operations',
    title: 'Contract and compliance review',
    description:
      'Incoming contracts are scanned for key terms, deadlines and unusual clauses, with each finding linked back to the source page.',
    before: 'Full read-through for every contract',
    after: 'Reviewers jump to flagged clauses',
  },
];
