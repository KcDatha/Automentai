import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/services.css';
import './styles/process.css';
import './styles/demo.css';
import './styles/casestudies.css';
import './styles/showcase.css';
import './styles/roi.css';
import './styles/presentation.css';
import './styles/why.css';
import './styles/contact.css';
import './styles/footer.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
