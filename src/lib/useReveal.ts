import { useEffect } from 'react';

/**
 * Adds the "in" class to [data-reveal] elements as they scroll into view.
 * Content is visible by default; the hidden starting state only applies
 * once the page script has added the "js" class (see index.html).
 */
export function useReveal(routeKey: string) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    items.forEach((el) => {
      if (!el.classList.contains('in')) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [routeKey]);
}
