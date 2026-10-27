import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import { useActiveSection } from '../lib/useActiveSection';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'work', label: 'Use cases' },
  { id: 'why', label: 'Why us' },
];

interface NavProps {
  routeKey: string;
}

export function Nav({ routeKey }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const active = useActiveSection(
    navLinks.map((l) => l.id),
    routeKey,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) menuBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
    const onResize = () => {
      if (window.innerWidth > 640) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open, close]);

  return (
    <header className={scrolled ? 'nav scrolled' : 'nav'}>
      <div className="nav-in">
        <a className="brand" href="#top" aria-label={`${site.name} home`}>
          <span className="mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 12 8 3l5 9M5.2 9h5.6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {site.name}
        </a>
        <div className="nav-right">
          <nav className="links" aria-label="Primary">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={active === l.id ? 'active' : undefined}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
          <a className="btn nav-cta" href="#contact">
            Talk to us
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="icon-btn menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={panel} className="mobile-panel" hidden={!open}>
        <nav aria-label="Mobile">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => close(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => close(false)}>
            Talk to us
          </a>
        </nav>
      </div>
    </header>
  );
}
