import { site } from '../data/site';

export function Footer() {
  return (
    <div className="wrap">
      <footer className="footer">
        <span>
          © {site.year} {site.name}. All rights reserved.
        </span>
        <span>{site.tagline}</span>
      </footer>
    </div>
  );
}
