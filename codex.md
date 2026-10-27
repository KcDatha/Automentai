# Codex prompts for Automent AI

This file is the running list of every prompt we give Codex for this project.

## How to use this file

1. Give Codex the **Prompt 0** block once at the start of a session.
2. Paste the prompts one at a time, in order. Wait for each to finish and check it before the next.
3. After each prompt, Codex adds one line to the **Change log** at the bottom and ticks the box below.
4. New prompts are appended to the end of the prompt list with the next number. Never edit a prompt after it has been run; add a new one instead.

## Status

- [ ] Prompt 0: Project rules
- [ ] Prompt 1: Move to a Vite + React + TypeScript project
- [ ] Prompt 2: Design polish, theme toggle and motion
- [ ] Prompt 3: Interactive "try an automation" demo
- [ ] Prompt 4: Case studies from a data file
- [ ] Prompt 5: Per-company showcase mode
- [ ] Prompt 6: Presentation mode for meetings
- [ ] Prompt 7: ROI calculator
- [ ] Prompt 8: Working contact form
- [ ] Prompt 9: SEO, accessibility and performance
- [ ] Prompt 10: Tests and CI
- [ ] Prompt 11: Deploy

---

## Prompt 0: Project rules

```
You are working on the Automent AI website in this repo. Automent AI is an AI automation studio. The site is shown to prospective client companies in meetings, so it must look polished, load fast and never show anything misleading.

Rules for every task in this repo:
- Keep the current design language: cool paper background (#eef1f7), deep ink text (#0d1330), cobalt accent (#2f4bff), dark mode with navy (#080c1f) and lighter accent (#7b8dff). Fonts: Bricolage Grotesque (headings), Instrument Sans (body), JetBrains Mono (labels). Keep these as CSS variables.
- Light and dark mode must both work and follow the system setting by default.
- Mobile first. Nothing may scroll sideways at 390px width.
- No fake clients, logos, testimonials, statistics or results. Any example content must be labelled as an example.
- Keep copy plain and direct. Do not use em dashes in copy.
- Do not add secrets to the repo. Use environment variables and document them in .env.example.
- Keep dependencies small. Ask before adding any dependency that is not needed for the task.
- After finishing a task: run the build, run the tests if they exist, tick the matching box in codex.md under Status, and add one line to the Change log at the bottom of codex.md with the date, prompt number and a one-sentence summary.
- Never push to main without being asked. Work on a branch named after the prompt, for example prompt-1-vite-react.
```

---

## Prompt 1: Move to a Vite + React + TypeScript project

```
Convert the single-file site in index.html into a Vite + React + TypeScript project with no visual change.

Requirements:
- Create src/ with components for: Nav, Hero, WorkflowPanel, Services, Process, UseCases, Why, Contact, Footer.
- Move all styles into src/styles/ (tokens.css for variables and light/dark themes, global.css for base styles, and one CSS module or file per component).
- Move the service, process and use case content into typed data files in src/data/ (services.ts, process.ts, useCases.ts, site.ts for name, email and tagline) so content can be edited without touching components.
- Keep the animated workflow in the hero working, and respect prefers-reduced-motion.
- Keep smooth scrolling for the in-page nav links.
- Add npm scripts: dev, build, preview, lint, typecheck.
- Add ESLint and Prettier with sensible defaults.
- Update README.md with setup and run instructions.

Acceptance criteria:
- npm run build passes with no TypeScript or lint errors.
- The built page looks the same as the original index.html at 390px, 768px and 1280px, in both light and dark mode.
- The original index.html is moved to docs/legacy-index.html for reference.
```

---

## Prompt 2: Design polish, theme toggle and motion

```
Improve the visual finish of the site without changing its structure.

Requirements:
- Add a theme toggle (system, light, dark) in the nav. Save the choice in localStorage inside try/catch, and apply it with a data-theme attribute on the html element. The default is system.
- Add a subtle reveal animation as sections scroll into view. Content must be visible by default if JavaScript fails, and must be skipped when prefers-reduced-motion is set.
- Add a sticky nav that gains a bottom border after scrolling, and highlights the section currently in view.
- Add a mobile menu (button that opens a full-width panel with the nav links) for screens under 640px. It must be keyboard accessible and close on Escape and on link click.
- Add a proper favicon (the Automent A mark) and a social share image at public/og.png (1200x630, generated from the brand colors).
- Keep every color coming from CSS variables.

Acceptance criteria:
- Toggle works and persists after reload, with no flash of the wrong theme on load.
- Mobile menu is usable with keyboard only.
- No layout shift when sections animate in.
```

---

## Prompt 3: Interactive "try an automation" demo

```
Add a new section after Services called "Try it" with an interactive demo that runs entirely in the browser with no backend and no API calls.

Requirements:
- Show three sample inputs the visitor can click: a sample invoice, a sample support email and a sample contract clause. Store them as text in src/data/samples.ts.
- When a sample is selected, show the automation running step by step (reading, extracting, checking, routing) with short delays, then show structured output (for example vendor, amount, due date, risk flag, suggested next action) in a clean card.
- Use simple deterministic rules (regular expressions and keyword checks) to produce the output from the sample text, so the result is real for the sample but clearly not a live AI model.
- Add a visible label: "Sample data. This demo runs in your browser and does not send anything anywhere."
- Include a "Reset" button and make the whole demo keyboard and screen reader friendly (aria-live for the step updates).

Acceptance criteria:
- Works offline.
- No network requests are made by the demo (verify in the network tab).
- Works at 390px width with no horizontal scroll.
```

---

## Prompt 4: Case studies from a data file

```
Turn the "Example use cases" section into a case studies system that is ready for real projects later.

Requirements:
- Add a typed data file src/data/caseStudies.ts. Each entry has: slug, title, industry, summary, problem, solution, outcome (array of {label, value}), tools (string array), isExample (boolean).
- Keep the four current use cases as entries with isExample: true.
- Add a detail view for each case study at a hash route such as #case/accounts-payable (use hash routing so it works on static hosting). Include a back link, and show a clear "Illustrative example" badge when isExample is true.
- On the home page, show cards linking to each detail view.
- Do not invent numbers. Outcome values for example entries must read like "Measured during pilot" rather than a made-up figure.

Acceptance criteria:
- Direct links to #case/<slug> open the right page, and the browser back button works.
- Adding a new entry to the data file adds a card and a detail page with no other code changes.
```

---

## Prompt 5: Per-company showcase mode

```
Add a showcase mode so we can tailor the site for each company we visit, using URL parameters. This is the core use of the site.

Requirements:
- Support these query parameters: company (display name), industry (one of finance, support, sales, operations, healthcare, logistics, retail), and contact (the name of the person we are meeting).
- When company is present, show a personalised line under the hero headline, such as "Prepared for {company}", and a "For {company}" section after Services that lists the three most relevant use cases for the chosen industry (from caseStudies.ts) with a short suggested first project.
- Add a small config file src/data/industries.ts mapping each industry to its recommended use case slugs and one-line suggested pilot.
- All values from the URL must be treated as untrusted: render them only as text, trim to 60 characters, and ignore unknown industries.
- Add a hidden helper page at #builder with a form that generates the share link from company, industry and contact, with a copy button. It must not be linked from the nav.
- Without parameters the site looks exactly as it does today.

Acceptance criteria:
- ?company=Acme&industry=finance shows the personalised content.
- Script tags or HTML in parameters are shown as plain text and never executed.
- The builder page produces working links.
```

---

## Prompt 6: Presentation mode for meetings

```
Add a presentation mode for showing the site on a big screen in a meeting.

Requirements:
- A "Present" button in the nav (and the key "P") turns the page into a full-screen, one-section-at-a-time view with larger type.
- Arrow keys, Page Up/Down and swipe move between sections. Escape exits. Show a small progress indicator and the section name.
- In presentation mode hide the nav and footer and keep the Try it demo fully usable.
- Remember nothing between visits. It must work without any network access once the page is loaded.
- Respect prefers-reduced-motion by switching sections without animation.

Acceptance criteria:
- Works with a keyboard and a clicker (which sends Page Up/Down).
- Exiting returns to the same scroll position as before.
```

---

## Prompt 7: ROI calculator

```
Add a simple ROI calculator section called "Estimate your savings".

Requirements:
- Inputs: tasks per week, minutes per task, number of people doing it, hourly cost, and expected share automated (slider, 20% to 90%, default 60%).
- Outputs: hours saved per month and cost saved per month and per year, updated live as inputs change.
- Show the formula in a collapsed "How we calculate this" panel.
- Add a clear note: "An estimate based on your inputs. We confirm real numbers during the pilot."
- Validate inputs (no negatives, sensible maximums) and show helpful messages.
- Format numbers with Intl.NumberFormat and use tabular figures.
- Include a button that scrolls to the contact section and pre-fills the message with the estimate.

Acceptance criteria:
- Calculations are covered by unit tests.
- Works at 390px width and with keyboard only.
```

---

## Prompt 8: Working contact form

```
Replace the copy-email block in the Contact section with a working contact form, while keeping the email address visible as a fallback.

Requirements:
- Fields: name, work email, company, what would you like to automate (textarea), and a hidden honeypot field for spam.
- Validate on the client with clear inline error messages, and a loading, success and error state on the button.
- Submit with fetch to a form endpoint set by the environment variable VITE_FORM_ENDPOINT (for example Formspree or Web3Forms). If the variable is missing, show the email fallback instead of a broken form.
- Document the variable in .env.example and README.md. Do not commit real endpoint keys.
- No tracking and no third-party scripts.
- If the visitor came from the ROI calculator, include the estimate in the message.

Acceptance criteria:
- Submitting with a test endpoint shows the success message and clears the form.
- A network failure shows an error and keeps what the visitor typed.
- Fully usable with a screen reader and keyboard.
```

---

## Prompt 9: SEO, accessibility and performance

```
Prepare the site for sharing and for a good first impression.

Requirements:
- Add page title, description, canonical URL, Open Graph and Twitter card tags, and JSON-LD Organization data (name, url, description only).
- Add robots.txt and a sitemap.xml.
- Fix any accessibility issues found by running axe or Lighthouse: contrast in both themes, landmarks, heading order, focus styles, labels, and the aria attributes on interactive parts.
- Self-host the three fonts (woff2, latin subset) with font-display: swap and preload the primary one, instead of loading them from Google Fonts.
- Make sure images have dimensions and the page has no layout shift.

Acceptance criteria:
- Lighthouse on mobile: Performance 90+, Accessibility 100, Best Practices 95+, SEO 100.
- Report the final scores in the Change log.
```

---

## Prompt 10: Tests and CI

```
Add automated checks.

Requirements:
- Unit tests with Vitest for: the ROI calculation, the demo rules in samples, the showcase URL parameter parsing and sanitising, and the contact form validation.
- A few end-to-end tests with Playwright: home page loads, theme toggle persists, mobile menu works at 390px, showcase mode shows personalised content, case study route opens, and contact form shows an error without an endpoint.
- A GitHub Actions workflow at .github/workflows/ci.yml that runs install, lint, typecheck, unit tests and build on every pull request and push to main.

Acceptance criteria:
- All checks pass locally and in CI.
- README.md explains how to run each check.
```

---

## Prompt 11: Deploy

```
Set up automatic deployment.

Requirements:
- Add a GitHub Actions workflow .github/workflows/deploy.yml that builds the site and deploys it to GitHub Pages on every push to main, after the CI checks pass.
- Set the Vite base path correctly for the repository name, and make hash routes work on Pages.
- Add a 404.html that redirects to the home page.
- Document in README.md how to enable Pages (Settings, Pages, Source: GitHub Actions) and how to add a custom domain later.

Acceptance criteria:
- A push to main publishes the site and the workflow summary prints the live URL.
- Deep links such as #case/accounts-payable work on the deployed site.
```

---

## Change log

Add one line per completed prompt in this format: `YYYY-MM-DD | Prompt N | one-sentence summary`

- 2026-10-26 | Setup | Initial static site (index.html) and this prompt list created.
