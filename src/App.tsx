import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { UseCases } from './components/UseCases';
import { Why } from './components/Why';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useReveal } from './lib/useReveal';

export function App() {
  const routeKey = 'home';
  useReveal(routeKey);

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Nav routeKey={routeKey} />
      <main className="wrap" id="top" tabIndex={-1}>
        <Hero />
        <Services />
        <Process />
        <UseCases />
        <Why />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
