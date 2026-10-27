import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useShowcase } from '../lib/showcase';
import { Hero } from './Hero';
import { Services } from './Services';
import { ForCompany } from './ForCompany';
import { Demo } from './Demo';
import { Process } from './Process';
import { CaseStudies } from './CaseStudies';
import { Roi } from './Roi';
import { Why } from './Why';
import { Contact } from './Contact';
import { Icon } from './Icon';

interface Slide {
  id: string;
  label: string;
  node: ReactNode;
}

interface PresentationProps {
  onExit: () => void;
}

function isTyping(target: EventTarget | null) {
  const tag = (target as HTMLElement | null)?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export function Presentation({ onExit }: PresentationProps) {
  const { company } = useShowcase();
  const [index, setIndex] = useState(0);
  const area = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [
      { id: 'intro', label: 'Welcome', node: <Hero /> },
      { id: 'services', label: 'Services', node: <Services /> },
    ];
    if (company) list.push({ id: 'for-company', label: `For ${company}`, node: <ForCompany /> });
    list.push(
      { id: 'try', label: 'Try it', node: <Demo /> },
      { id: 'process', label: 'Process', node: <Process /> },
      { id: 'work', label: 'Use cases', node: <CaseStudies /> },
      { id: 'estimate', label: 'Savings', node: <Roi /> },
      { id: 'why', label: 'Why us', node: <Why /> },
      { id: 'contact', label: 'Contact', node: <Contact /> },
    );
    return list;
  }, [company]);

  const last = slides.length - 1;
  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(last, Math.max(0, i + delta))),
    [last],
  );

  // Lock page scroll behind the overlay and start each slide at the top, focused for keyboard scrolling.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (area.current) area.current.scrollTop = 0;
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      if (isTyping(e.target)) return;
      const el = area.current;
      const tag = (e.target as HTMLElement | null)?.tagName;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          go(1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          go(-1);
          break;
        case ' ':
          if (tag === 'BUTTON' || tag === 'A') return;
          e.preventDefault();
          go(e.shiftKey ? -1 : 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (el && el.scrollTop + el.clientHeight < el.scrollHeight - 4) {
            el.scrollBy({ top: Math.round(el.clientHeight * 0.8) });
          } else {
            go(1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (el && el.scrollTop > 4) {
            el.scrollBy({ top: -Math.round(el.clientHeight * 0.8) });
          } else {
            go(-1);
          }
          break;
        case 'Home':
          e.preventDefault();
          setIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setIndex(last);
          break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, last, onExit]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  // Links inside slides: section links jump to that slide, example links leave the presentation.
  const onClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    e.preventDefault();
    if (href.startsWith('#case/')) {
      onExit();
      window.setTimeout(() => {
        window.location.hash = href;
      }, 0);
      return;
    }
    const target = slides.findIndex((s) => s.id === href.slice(1));
    if (target >= 0) setIndex(target);
  };

  return (
    <div
      className="presentation"
      role="region"
      aria-roledescription="presentation"
      aria-label="Presentation mode"
    >
      <div
        className="pres-area"
        ref={area}
        tabIndex={0}
        role="group"
        aria-label="Slide content"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
      >
        <div className="pres-inner" key={slides[index].id}>
          {slides[index].node}
        </div>
      </div>

      <div className="pres-bar">
        <div className="pres-nav">
          <button
            type="button"
            className="icon-btn"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            <Icon name="back" size={18} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => go(1)}
            disabled={index === last}
            aria-label="Next slide"
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="pres-dots" role="group" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === index ? 'pdot on' : 'pdot'}
              aria-label={`Go to slide ${i + 1}: ${s.label}`}
              aria-current={i === index ? 'step' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <span className="pres-count mono">
          {index + 1} / {slides.length} · {slides[index].label}
        </span>
        <button type="button" className="btn ghost pres-exit" onClick={onExit}>
          Exit <span className="mono">Esc</span>
        </button>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        Slide {index + 1} of {slides.length}: {slides[index].label}
      </div>
    </div>
  );
}
