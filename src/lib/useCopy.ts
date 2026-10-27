import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copies text to the clipboard. Some browsers and embedded views refuse, so the caller
 * can pass a fallback that selects the text for a manual copy.
 */
export function useCopy(text: string, idleLabel: string) {
  const [label, setLabel] = useState(idleLabel);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = useCallback(
    (message: string) => {
      setLabel(message);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setLabel(idleLabel), 1800);
    },
    [idleLabel],
  );

  const copy = useCallback(
    (selectFallback?: () => void) => {
      const fallback = () => {
        selectFallback?.();
        flash('Selected: press Ctrl/Cmd+C');
      };
      try {
        navigator.clipboard.writeText(text).then(() => flash('Copied'), fallback);
      } catch {
        fallback();
      }
    },
    [text, flash],
  );

  return { label, copy };
}
