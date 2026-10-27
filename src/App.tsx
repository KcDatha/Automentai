import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ForCompany } from './components/ForCompany';
import { Demo } from './components/Demo';
import { Process } from './components/Process';
import { CaseStudies } from './components/CaseStudies';
import { CaseStudyPage } from './components/CaseStudyPage';
import { Roi } from './components/Roi';
import { Why } from './components/Why';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Builder } from './components/Builder';
import { Presentation } from './components/Presentation';
import { useReveal } from './lib/useReveal';
import { parseHash, routeKey, useHash } from './lib/router';
import { useShowcase } from './lib/showcase';

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <ForCompany />
      <Demo />
      <Process />
      <CaseStudies />
      <Roi />
      <Why />
      <Contact />
    </>
  );
}

function typingInField(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable
  );
}

export function App() {
  const hash = useHash();
  const route = useMemo(() => parseHash(hash), [hash]);
  const key = routeKey(route);
  const { company } = useShowcase();
  const [presenting, setPresenting] = useState(false);
  const savedY = useRef(0);
  const wasPresenting = useRef(false);
  const inFullscreen = useRef(false);

  useReveal(`${key}:${presenting}`);

  // Hash links to a home section from another page: scroll once the page has rendered.
  useEffect(() => {
    if (route.name === 'home' && route.anchor) {
      document.getElementById(route.anchor)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  // Personalised pages and the builder are not for search engines.
  useEffect(() => {
    const noindex = route.name === 'builder' || company !== null;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        document.head.appendChild(meta);
      }
      meta.content = 'noindex, nofollow';
    } else if (meta) {
      meta.remove();
    }
  }, [route, company]);

  useEffect(() => {
    document.title = company ? `Automent AI for ${company}` : 'Automent AI';
  }, [company]);

  const start = useCallback(() => {
    savedY.current = window.scrollY;
    setPresenting(true);
    const root = document.documentElement;
    if (root.requestFullscreen) {
      root.requestFullscreen().then(
        () => {
          inFullscreen.current = true;
        },
        () => {
          /* Fullscreen can be refused. The overlay still works without it. */
        },
      );
    }
  }, []);

  const stop = useCallback(() => {
    setPresenting(false);
    inFullscreen.current = false;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  }, []);

  // The browser's own Esc leaves fullscreen without telling the page, so follow it.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && inFullscreen.current) {
        inFullscreen.current = false;
        setPresenting(false);
      }
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Return to the same place on the page after the presentation.
  useLayoutEffect(() => {
    if (wasPresenting.current && !presenting) {
      window.scrollTo({ top: savedY.current, behavior: 'instant' });
    }
    wasPresenting.current = presenting;
  }, [presenting]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'p' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (presenting || typingInField(e.target)) return;
      e.preventDefault();
      start();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [presenting, start]);

  if (presenting) return <Presentation onExit={stop} />;

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Nav routeKey={key} onPresent={start} />
      <main className="wrap" id="top" tabIndex={-1}>
        {route.name === 'case' ? (
          <CaseStudyPage slug={route.slug} />
        ) : route.name === 'builder' ? (
          <Builder />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </>
  );
}
