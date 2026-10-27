import { useSyncExternalStore } from 'react';

export type Route =
  { name: 'home'; anchor: string | null } | { name: 'case'; slug: string } | { name: 'builder' };

/**
 * The site uses hash routes so it works on static hosting.
 * #case/<slug> and #builder are pages. Any other hash is a section anchor on the home page.
 */
export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, '');
  if (h.startsWith('case/')) {
    let slug = h.slice('case/'.length);
    try {
      slug = decodeURIComponent(slug);
    } catch {
      /* keep the raw slug */
    }
    return { name: 'case', slug };
  }
  if (h === 'builder') return { name: 'builder' };
  return { name: 'home', anchor: h || null };
}

export function routeKey(route: Route): string {
  if (route.name === 'case') return `case:${route.slug}`;
  return route.name;
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

const getHash = () => window.location.hash;
const getServerHash = () => '';

export function useHash(): string {
  return useSyncExternalStore(subscribe, getHash, getServerHash);
}
