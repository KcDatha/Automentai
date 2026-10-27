import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { UseCases } from './components/UseCases';
import { Why } from './components/Why';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export function App() {
  return (
    <>
      <Nav />
      <main className="wrap" id="top">
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
