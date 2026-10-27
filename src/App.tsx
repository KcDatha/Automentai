import { useEffect, useMemo } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Demo } from './components/Demo';
import { Process } from './components/Process';
import { CaseStudies } from './components/CaseStudies';
import { CaseStudyPage } from './components/CaseStudyPage';
import { Why } from './components/Why';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useReveal } from './lib/useReveal';
import { parseHash, routeKey, useHash } from './lib/router';

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Demo />
      <Process />
      <CaseStudies />
      <Why />
      <Contact />
    </>
  );
}

export function App() {
  const hash = useHash();
  const route = useMemo(() => parseHash(hash), [hash]);
  const key = routeKey(route);
  useReveal(key);

  // Hash links to a home section from another page: scroll once the page has rendered.
  useEffect(() => {
    if (route.name === 'home' && route.anchor) {
      document.getElementById(route.anchor)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Nav routeKey={key} />
      <main className="wrap" id="top" tabIndex={-1}>
        {route.name === 'case' ? <CaseStudyPage slug={route.slug} /> : <HomePage />}
      </main>
      <Footer />
    </>
  );
}
