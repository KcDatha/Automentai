import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in the middle of the viewport, if any.
 * The result is tied to routeKey so a stale highlight never carries over to another page.
 */
export function useActiveSection(ids: string[], routeKey: string) {
  const [state, setState] = useState<{ route: string; id: string | null }>({
    route: routeKey,
    id: null,
  });
  const key = ids.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setState({ route: routeKey, id: entry.target.id });
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, routeKey]);

  return state.route === routeKey ? state.id : null;
}
