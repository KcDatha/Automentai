import type { IndustryId } from './caseStudies';

export interface IndustryPlan {
  id: IndustryId;
  label: string;
  /** Slugs from caseStudies.ts, most relevant first. */
  slugs: string[];
  /** One line describing a sensible first pilot. */
  pilot: string;
}

export const industryPlans: Record<IndustryId, IndustryPlan> = {
  finance: {
    id: 'finance',
    label: 'Finance',
    slugs: ['accounts-payable', 'contract-review', 'support-agent'],
    pilot:
      'Start with one invoice flow from your busiest vendors, with every exception routed to your approver.',
  },
  support: {
    id: 'support',
    label: 'Customer support',
    slugs: ['support-agent', 'lead-research', 'accounts-payable'],
    pilot:
      'Start with the five most common questions in your queue, answered from your help center, with a person handling everything else.',
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    slugs: ['lead-research', 'support-agent', 'contract-review'],
    pilot:
      'Start with one lead source, enriched and logged in your CRM, with a short briefing for the rep before each first call.',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    slugs: ['contract-review', 'accounts-payable', 'shipment-documents'],
    pilot:
      'Start with one document type that your team reads by hand today, and flag only the items that need a person.',
  },
  healthcare: {
    id: 'healthcare',
    label: 'Healthcare',
    slugs: ['patient-intake', 'contract-review', 'accounts-payable'],
    pilot:
      'Start with one administrative form, with access limited to the staff who already handle it and every change logged.',
  },
  logistics: {
    id: 'logistics',
    label: 'Logistics',
    slugs: ['shipment-documents', 'accounts-payable', 'support-agent'],
    pilot:
      'Start with one carrier or supplier whose paperwork is cross-checked against your orders before filing.',
  },
  retail: {
    id: 'retail',
    label: 'Retail',
    slugs: ['support-agent', 'shipment-documents', 'accounts-payable'],
    pilot:
      'Start with order-status and returns questions answered from your order data, with exceptions passed to your team.',
  },
};

/** Used when a company is named but no industry is given. */
export const defaultPlan: Omit<IndustryPlan, 'id' | 'label'> = {
  slugs: ['accounts-payable', 'support-agent', 'contract-review'],
  pilot:
    'Start with one process your team repeats every week. We map it together and agree what success looks like before building anything.',
};

export const industryList: { id: IndustryId; label: string }[] = Object.values(industryPlans).map(
  ({ id, label }) => ({ id, label }),
);
