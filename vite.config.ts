import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Adds preload links for the two fonts used above the fold (headings and body text),
 * using the hashed file names Vite produces at build time.
 */
function preloadFonts(base: string): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const bundle = ctx.bundle ?? {};
        const wanted = [
          /bricolage-grotesque-latin-wght-normal/,
          /instrument-sans-latin-wght-normal/,
        ];
        return Object.keys(bundle)
          .filter((file) => file.endsWith('.woff2') && wanted.some((re) => re.test(file)))
          .map((file) => ({
            tag: 'link',
            injectTo: 'head-prepend' as const,
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
              href: `${base}${file}`,
            },
          }));
      },
    },
  };
}

/** Writes robots.txt and sitemap.xml using the public site address (VITE_SITE_URL). */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const root = siteUrl.replace(/\/+$/, '');
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${root}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${root}/</loc>\n  </url>\n</urlset>\n`,
      });
    },
  };
}

/** Writes 404.html. GitHub Pages serves it for unknown paths; it sends visitors to the home page. */
function notFoundPage(base: string): Plugin {
  return {
    name: 'not-found-page',
    apply: 'build',
    generateBundle() {
      const home = JSON.stringify(base);
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Page not found | Automent AI</title>
<meta http-equiv="refresh" content="3;url=${base}" />
<script>location.replace(${home});</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem">
<h1>That page does not exist</h1>
<p><a href="${base}">Go to the Automent AI home page</a></p>
</body>
</html>
`,
      });
    },
  };
}

// VITE_BASE is set by the deploy workflow (for example "/Automentai/" on GitHub Pages).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const base = process.env.VITE_BASE ?? '/';
  const siteUrl = process.env.VITE_SITE_URL ?? env.VITE_SITE_URL ?? 'http://localhost:4173';
  return {
    base,
    plugins: [react(), preloadFonts(base), seoFiles(siteUrl), notFoundPage(base)],
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'node',
    },
  };
});
