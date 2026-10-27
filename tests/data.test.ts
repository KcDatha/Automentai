import { describe, expect, it } from 'vitest';
import { caseStudies, findCaseStudy } from '../src/data/caseStudies';
import { defaultPlan, industryList, industryPlans } from '../src/data/industries';
import { services } from '../src/data/services';
import { parseHash, routeKey } from '../src/lib/router';

describe('case studies', () => {
  it('have unique, URL-safe slugs', () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('have every field filled in', () => {
    for (const c of caseStudies) {
      expect(c.title.length).toBeGreaterThan(3);
      expect(c.summary.length).toBeGreaterThan(20);
      expect(c.problem.length).toBeGreaterThan(20);
      expect(c.solution.length).toBeGreaterThan(20);
      expect(c.outcome.length).toBeGreaterThanOrEqual(2);
      expect(c.tools.length).toBeGreaterThan(0);
    }
  });

  it('are all marked as illustrative examples until real client work is added', () => {
    expect(caseStudies.every((c) => c.isExample)).toBe(true);
  });

  it('contain no invented percentages or money figures in the outcomes', () => {
    for (const c of caseStudies) {
      for (const o of c.outcome) expect(o.value).not.toMatch(/[%$]|\d{2,}/);
    }
  });

  it('can be looked up by slug', () => {
    expect(findCaseStudy('accounts-payable')?.title).toBe('Accounts payable intake');
    expect(findCaseStudy('missing')).toBeUndefined();
  });
});

describe('industry plans', () => {
  it('recommend exactly three case studies that exist', () => {
    for (const plan of [...Object.values(industryPlans), defaultPlan]) {
      expect(plan.slugs).toHaveLength(3);
      expect(new Set(plan.slugs).size).toBe(3);
      for (const slug of plan.slugs) expect(findCaseStudy(slug)).toBeDefined();
      expect(plan.pilot.length).toBeGreaterThan(20);
    }
  });

  it('list every industry the share link builder offers', () => {
    expect(industryList.map((i) => i.id).sort()).toEqual(
      ['finance', 'healthcare', 'logistics', 'operations', 'retail', 'sales', 'support'].sort(),
    );
  });
});

describe('services', () => {
  it('has unique ids', () => {
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(services).toHaveLength(6);
  });
});

describe('parseHash', () => {
  it('treats empty and section hashes as the home page', () => {
    expect(parseHash('')).toEqual({ name: 'home', anchor: null });
    expect(parseHash('#')).toEqual({ name: 'home', anchor: null });
    expect(parseHash('#services')).toEqual({ name: 'home', anchor: 'services' });
    expect(parseHash('#top')).toEqual({ name: 'home', anchor: 'top' });
  });

  it('reads case study routes', () => {
    expect(parseHash('#case/accounts-payable')).toEqual({ name: 'case', slug: 'accounts-payable' });
    expect(parseHash('#case/')).toEqual({ name: 'case', slug: '' });
  });

  it('survives a badly encoded slug', () => {
    expect(parseHash('#case/%E0%A4%A')).toEqual({ name: 'case', slug: '%E0%A4%A' });
  });

  it('reads the builder route', () => {
    expect(parseHash('#builder')).toEqual({ name: 'builder' });
  });

  it('gives each page its own key', () => {
    expect(routeKey(parseHash('#services'))).toBe('home');
    expect(routeKey(parseHash('#case/a'))).toBe('case:a');
    expect(routeKey(parseHash('#builder'))).toBe('builder');
  });
});
