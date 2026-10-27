import { useMemo } from 'react';
import type { IndustryId } from '../data/caseStudies';
import { industryPlans } from '../data/industries';

export interface Showcase {
  company: string | null;
  industry: IndustryId | null;
  contact: string | null;
}

export const MAX_LENGTH = 60;

/**
 * Everything from the URL is untrusted. This keeps printable text only, collapses
 * whitespace and trims to 60 characters. It is only ever rendered as plain text.
 */
export function cleanText(value: string | null | undefined): string | null {
  if (!value) return null;
  const printable = Array.from(value)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      return code < 32 || code === 127 ? ' ' : ch;
    })
    .join('');
  const cleaned = printable.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH).trim();
  return cleaned || null;
}

export function parseIndustry(value: string | null | undefined): IndustryId | null {
  if (!value) return null;
  const id = value.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(industryPlans, id) ? (id as IndustryId) : null;
}

export function parseShowcase(search: string): Showcase {
  const params = new URLSearchParams(search);
  return {
    company: cleanText(params.get('company')),
    industry: parseIndustry(params.get('industry')),
    contact: cleanText(params.get('contact')),
  };
}

export interface ShowcaseInput {
  company: string;
  industry: string;
  contact: string;
}

/** Builds a share link from a base URL (origin plus path). Empty fields are left out. */
export function buildShowcaseUrl(base: string, input: ShowcaseInput): string {
  const params = new URLSearchParams();
  const company = cleanText(input.company);
  const industry = parseIndustry(input.industry);
  const contact = cleanText(input.contact);
  if (company) params.set('company', company);
  if (industry) params.set('industry', industry);
  if (contact) params.set('contact', contact);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function useShowcase(): Showcase {
  return useMemo(() => parseShowcase(window.location.search), []);
}
