# Automent AI

Showcase website for Automent AI, an AI automation studio. It is built to be shown to companies in meetings, and can be tailored to each company with a link.

Built with Vite, React and TypeScript. It is a static site with no backend.

## Run it

Needs Node 22 or newer.

```
npm install
npm run dev        # http://localhost:5173
```

## Checks

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm run lint`      | ESLint                                                        |
| `npm run typecheck` | TypeScript, no output files                                   |
| `npm test`          | Vitest unit tests (calculator, demo, showcase links, contact) |
| `npm run build`     | Type check, then production build into `dist/`                |
| `npm run test:e2e`  | Playwright browser tests and axe accessibility checks         |
| `npm run format`    | Prettier                                                      |

First time only for browser tests: `npx playwright install chromium`. If you already have a Chromium, set `CHROMIUM_PATH` to its path instead. The test run builds the site itself, once with a contact form endpoint and once without.

The same checks run on GitHub for every pull request and push to `main` (`.github/workflows/ci.yml`).

## Show it to a company

Add the company to the address:

```
https://kcdatha.github.io/Automentai/?company=Acme&industry=finance&contact=Dana%20Whitfield
```

- `company`: name shown under the headline and in a "Where we would start" section.
- `industry`: one of `finance`, `support`, `sales`, `operations`, `healthcare`, `logistics`, `retail`. Picks the three most relevant examples and a suggested first project.
- `contact`: the person you are meeting (optional).

Open `#builder` (for example `.../Automentai/#builder`) to fill in a form and copy the link. It is not linked from the menu. Personalised pages are marked `noindex`.

Press **P** or use the **Present** button for full-screen mode: arrow keys, Page Up/Down (clickers) or swipe to move, Escape to exit.

## Contact form

The form posts JSON to a form service of your choice. Copy `.env.example` to `.env.local` and set:

```
VITE_FORM_ENDPOINT=https://...      # for example a Formspree or Web3Forms URL
VITE_FORM_ACCESS_KEY=               # only if the service needs a key (it is public in the built site)
```

If `VITE_FORM_ENDPOINT` is empty the form is replaced by the email address, so nothing looks broken. Do not commit real values; `.env.local` is ignored by git.

## Edit the content

All copy lives in `src/data/`: `site.ts` (name, email), `services.ts`, `process.ts`, `why.ts`, `caseStudies.ts`, `industries.ts`, `samples.ts`. Adding an entry to `caseStudies.ts` adds a card and a detail page.

Every case study is currently an **illustrative example** and labelled as one. When you have real work, add it with `isExample: false` and real results.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` runs lint, type check, unit tests and build, then publishes on every push to `main`. The run summary prints the live address.

1. Merge the work into `main`.
2. In the repository go to **Settings, Pages** and set **Source** to **GitHub Actions**.
3. Optional: under **Settings, Secrets and variables, Actions, Variables** add `VITE_FORM_ENDPOINT` (and `VITE_FORM_ACCESS_KEY` if needed) so the live form works.

The site is served from `/Automentai/` and uses hash links such as `#case/accounts-payable`, so deep links work without server rules. `404.html` sends unknown paths to the home page.

### Custom domain later

1. In **Settings, Pages** enter the domain and follow GitHub's DNS instructions.
2. In `deploy.yml` change `VITE_BASE` to `/` and `VITE_SITE_URL` to `https://your-domain`.
3. Update `.env.production` to the same address.

## Before going live

- Replace the placeholder email `hello@automentai.com` in `src/data/site.ts`.
- Set a real form endpoint (above).
- Replace the example case studies when you have real ones.

`docs/legacy-index.html` is the original single-file version, kept for reference.
