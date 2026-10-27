import { site } from '../data/site';

export function Nav() {
  return (
    <header className="nav">
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
        <nav className="links" aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#work">Use cases</a>
          <a href="#why">Why us</a>
          <a className="btn" href="#contact">
            Talk to us
          </a>
        </nav>
      </div>
    </header>
  );
}
