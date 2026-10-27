import { useCallback, useEffect, useState } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';

export const THEME_KEY = 'automent-theme';
const order: ThemeChoice[] = ['system', 'light', 'dark'];

export function readStoredTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* storage can be blocked; fall back to system */
  }
  return 'system';
}

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
}

export function nextTheme(current: ThemeChoice): ThemeChoice {
  return order[(order.indexOf(current) + 1) % order.length];
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeChoice>(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const cycle = useCallback(() => {
    setTheme((current) => {
      const next = nextTheme(current);
      try {
        if (next === 'system') localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, cycle };
}
