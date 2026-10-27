import { describe, expect, it } from 'vitest';
import {
  MAX_LENGTH,
  buildShowcaseUrl,
  cleanText,
  parseIndustry,
  parseShowcase,
} from '../src/lib/showcase';

describe('cleanText', () => {
  it('returns null for empty or missing values', () => {
    expect(cleanText(null)).toBeNull();
    expect(cleanText(undefined)).toBeNull();
    expect(cleanText('')).toBeNull();
    expect(cleanText('   \n\t ')).toBeNull();
  });

  it('trims and collapses whitespace', () => {
    expect(cleanText('  Acme    Logistics \n Ltd  ')).toBe('Acme Logistics Ltd');
  });

  it('removes control characters', () => {
    expect(cleanText('Ac\u0000me\u0007 Co')).toBe('Ac me Co');
    expect(cleanText('\u001b[31mRed')).toBe('[31mRed');
  });

  it('shortens to 60 characters', () => {
    const out = cleanText('A'.repeat(200));
    expect(out).toHaveLength(MAX_LENGTH);
    expect(MAX_LENGTH).toBe(60);
  });

  it('keeps markup as plain text, since it is only ever rendered as text', () => {
    expect(cleanText('<b>Acme</b>')).toBe('<b>Acme</b>');
  });
});

describe('parseIndustry', () => {
  it('accepts known industries in any case', () => {
    expect(parseIndustry('finance')).toBe('finance');
    expect(parseIndustry('  Healthcare ')).toBe('healthcare');
    expect(parseIndustry('LOGISTICS')).toBe('logistics');
  });

  it('ignores unknown industries and object property names', () => {
    expect(parseIndustry('crypto')).toBeNull();
    expect(parseIndustry('finance<script>')).toBeNull();
    expect(parseIndustry('constructor')).toBeNull();
    expect(parseIndustry('__proto__')).toBeNull();
    expect(parseIndustry('toString')).toBeNull();
    expect(parseIndustry('')).toBeNull();
    expect(parseIndustry(null)).toBeNull();
  });
});

describe('parseShowcase', () => {
  it('reads company, industry and contact from the query string', () => {
    expect(parseShowcase('?company=Acme&industry=finance&contact=Dana%20Whitfield')).toEqual({
      company: 'Acme',
      industry: 'finance',
      contact: 'Dana Whitfield',
    });
  });

  it('returns nulls when nothing is given', () => {
    expect(parseShowcase('')).toEqual({ company: null, industry: null, contact: null });
    expect(parseShowcase('?utm_source=mail')).toEqual({
      company: null,
      industry: null,
      contact: null,
    });
  });

  it('cleans every value', () => {
    const r = parseShowcase(`?company=${'x'.repeat(100)}&industry=nope&contact=%20%20`);
    expect(r.company).toHaveLength(60);
    expect(r.industry).toBeNull();
    expect(r.contact).toBeNull();
  });

  it('decodes plus signs and percent escapes', () => {
    expect(parseShowcase('?company=Acme+Logistics%20%26+Co').company).toBe('Acme Logistics & Co');
  });
});

describe('buildShowcaseUrl', () => {
  const base = 'https://example.com/site/';

  it('builds a link with only the fields that are set', () => {
    expect(buildShowcaseUrl(base, { company: 'Acme', industry: '', contact: '' })).toBe(
      'https://example.com/site/?company=Acme',
    );
    expect(buildShowcaseUrl(base, { company: '', industry: '', contact: '' })).toBe(base);
  });

  it('encodes special characters and round-trips through parseShowcase', () => {
    const url = buildShowcaseUrl(base, {
      company: 'Smith & Sons, Ltd',
      industry: 'retail',
      contact: 'Zoë O’Neil',
    });
    const parsed = parseShowcase(url.slice(url.indexOf('?')));
    expect(parsed).toEqual({
      company: 'Smith & Sons, Ltd',
      industry: 'retail',
      contact: 'Zoë O’Neil',
    });
  });

  it('drops industries that are not on the list', () => {
    const url = buildShowcaseUrl(base, { company: 'Acme', industry: 'hacking', contact: '' });
    expect(url).not.toContain('industry');
  });
});
