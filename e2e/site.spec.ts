import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const FORM_ENDPOINT = 'https://forms.example.test/submit';
const NO_FORM_URL = 'http://localhost:4174/';

/** Collects page errors and console errors so a test can assert there were none. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

const showAllSections = async (page: Page) => {
  await page.addStyleTag({
    content:
      '*,*::before,*::after{transition:none!important;animation:none!important}.js [data-reveal]{opacity:1!important;transform:none!important}',
  });
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
};

test.describe('home page', () => {
  test('loads with the main sections and no errors', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/');
    await expect(page).toHaveTitle('Automent AI');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Automate the work');
    for (const id of ['services', 'try', 'process', 'work', 'estimate', 'why', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    expect(errors).toEqual([]);
  });

  test('has no horizontal scrolling at desktop and phone width', async ({ page }) => {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBe(width);
    }
  });

  test('has search and sharing tags', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /^https?:\/\/.+\/$/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.png$/);
    await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /.{50,}/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(jsonLd ?? '{}')['@type']).toBe('Organization');
    const robots = await page.request.get('/robots.txt');
    expect(await robots.text()).toContain('Sitemap:');
    const sitemap = await page.request.get('/sitemap.xml');
    expect(await sitemap.text()).toContain('<loc>');
  });
});

test.describe('theme toggle', () => {
  test('cycles system, light and dark and remembers the choice after a reload', async ({
    page,
  }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /^Theme:/ });
    await expect(html).not.toHaveAttribute('data-theme', /.*/);
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(8, 12, 31)');

    await page.getByRole('button', { name: /^Theme:/ }).click();
    await expect(html).not.toHaveAttribute('data-theme', /.*/);
    await page.reload();
    await expect(html).not.toHaveAttribute('data-theme', /.*/);
  });

  test('applies the saved theme before the page is drawn', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('automent-theme', 'dark'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, closes with Escape and links to a section', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Open menu' });
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeHidden();

    await button.click();
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(menu.getByRole('link', { name: 'Services' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();

    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu.getByRole('link', { name: 'Process' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#process$/);
    await expect(page.locator('#process')).toBeInViewport();
  });
});

test.describe('showcase mode', () => {
  test('personalises the page from the link', async ({ page }) => {
    await page.goto('/?company=Acme&industry=finance&contact=Dana%20Whitfield');
    await expect(page).toHaveTitle('Automent AI for Acme');
    await expect(page.locator('.prepared')).toContainText('Prepared for Acme');
    await expect(page.locator('.prepared')).toContainText('Meeting with Dana Whitfield');
    await expect(page.locator('#for-company h2')).toHaveText('Where we would start at Acme');
    const titles = await page.locator('#for-company .case-card h3').allTextContents();
    expect(titles).toEqual([
      'Accounts payable intake',
      'Contract and compliance review',
      'First-line support agent',
    ]);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
  });

  test('shows the normal site when there are no link parameters', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.prepared')).toHaveCount(0);
    await expect(page.locator('#for-company')).toHaveCount(0);
    await expect(page.locator('meta[name=robots]')).toHaveCount(0);
  });

  test('shows hostile values as plain text and never runs them', async ({ page }) => {
    let dialogs = 0;
    page.on('dialog', (d) => {
      dialogs++;
      void d.dismiss();
    });
    const evil = encodeURIComponent(
      '<img src=x onerror=alert(1)><script>alert(2)</script>' + 'A'.repeat(80),
    );
    await page.goto(
      `/?company=${evil}&industry=${encodeURIComponent('finance<script>')}&contact=${encodeURIComponent('<b>x</b>')}`,
    );
    await expect(page.locator('.prepared b')).toHaveText(/^<img src=x onerror=alert\(1\)>/);
    expect((await page.locator('.prepared b').innerText()).length).toBe(60);
    await expect(page.locator('main img, main script, .prepared b b')).toHaveCount(0);
    await expect(page.locator('#for-company .case-card')).toHaveCount(3);
    expect(dialogs).toBe(0);
  });

  test('builder makes a working link and is not in the navigation', async ({ page }) => {
    await page.goto('/#builder');
    await expect(page.getByRole('heading', { name: 'Share link builder' })).toBeVisible();
    await expect(page.locator('header a[href="#builder"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeDisabled();
    await page.getByLabel('Company name').fill('Acme Logistics');
    await page.getByLabel('Industry').selectOption('logistics');
    await page.getByLabel(/Person we are meeting/).fill('Dana Whitfield');
    const link = await page.locator('#b-link').inputValue();
    expect(link).toContain('company=Acme+Logistics');
    expect(link).toContain('industry=logistics');
    await page.goto(link);
    await expect(page.locator('.prepared')).toContainText('Prepared for Acme Logistics');
    await expect(page.locator('#for-company .case-card h3').first()).toHaveText(
      'Shipment document processing',
    );
  });
});

test.describe('case studies', () => {
  test('open from a card, support the back button and direct links', async ({ page }) => {
    await page.goto('/');
    await page.locator('.case-card h3 a', { hasText: 'First-line support agent' }).click();
    await expect(page).toHaveURL(/#case\/support-agent$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('First-line support agent');
    await expect(page.locator('.case-page .chip')).toHaveText(/Illustrative example/i);

    await page.goBack();
    await expect(page.locator('.hero')).toBeVisible();

    await page.goto('/#case/contract-review');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Contract and compliance review',
    );

    await page.goto('/#case/not-a-real-example');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'We could not find that example',
    );
  });

  test('link from a case page back to a home section scrolls to it', async ({ page }) => {
    await page.goto('/#case/lead-research');
    await page.locator('.nav-right').getByRole('link', { name: 'Talk to us' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
  });
});

test.describe('try it demo', () => {
  test('runs each sample in the browser without any network request', async ({ page }) => {
    await page.goto('/');
    await page.locator('#try').scrollIntoViewIfNeeded();
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));

    await page.getByRole('button', { name: 'Sample invoice' }).click();
    await expect(page.getByRole('status').filter({ hasText: /Step 1 of 4/ })).toHaveCount(1);
    await expect(page.locator('.result dl')).toContainText('Northwind Supplies Ltd', {
      timeout: 8000,
    });
    await expect(page.locator('.flags')).toContainText('above the approved');
    await expect(page.locator('.next')).toContainText('approver');

    await page.getByRole('button', { name: 'Sample contract clause' }).click();
    await expect(page.locator('.result dl')).toContainText('None (unlimited)', { timeout: 8000 });

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('.result.empty')).toBeVisible();
    await expect(page.getByText(/does not send anything anywhere/)).toBeVisible();
    expect(requests).toEqual([]);
  });
});

test.describe('presentation mode', () => {
  test('opens with P, moves with the keyboard and returns to the same place', async ({ page }) => {
    await page.goto('/');
    await page.locator('#process').scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => Math.round(window.scrollY));
    const status = page.locator('.presentation > [role=status]');

    await page.keyboard.press('p');
    await expect(page.locator('.presentation')).toBeVisible();
    await expect(page.locator('header.nav')).toHaveCount(0);
    await expect(status).toHaveText('Slide 1 of 8: Welcome');
    await page.keyboard.press('ArrowRight');
    await expect(status).toHaveText('Slide 2 of 8: Services');
    await page.keyboard.press('PageDown');
    await expect(status).toHaveText('Slide 3 of 8: Try it');
    await page.keyboard.press('PageUp');
    await expect(status).toHaveText('Slide 2 of 8: Services');
    await page.keyboard.press('End');
    await expect(status).toHaveText('Slide 8 of 8: Contact');

    await page.keyboard.press('Escape');
    await expect(page.locator('.presentation')).toHaveCount(0);
    await expect(page.locator('header.nav')).toBeVisible();
    const after = await page.evaluate(() => Math.round(window.scrollY));
    expect(Math.abs(after - before)).toBeLessThanOrEqual(2);
  });

  test('keeps the demo usable and ignores the P key while typing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start presentation mode/ }).click();
    await page.getByRole('button', { name: 'Go to slide 3: Try it' }).click();
    await page.getByRole('button', { name: 'Sample support email' }).click();
    await expect(page.locator('.result dl')).toContainText('Damaged item', { timeout: 8000 });
    await expect(page.locator('.presentation > [role=status]')).toHaveText('Slide 3 of 8: Try it');
    await page.getByRole('button', { name: /^Exit/ }).click();
    await expect(page.locator('.presentation')).toHaveCount(0);

    await page.goto('/#builder');
    await page.getByLabel('Company name').press('p');
    await expect(page.locator('.presentation')).toHaveCount(0);
  });
});

test.describe('savings calculator', () => {
  test('updates live, validates and adds the estimate to the message', async ({ page }) => {
    await page.goto('/');
    const out = page.locator('.roi-out dl');
    await expect(out).toContainText('$26,208');
    await page.getByLabel('People doing this work').fill('6');
    await expect(out).toContainText('$52,416');
    await page.getByLabel('Minutes per task').fill('-5');
    await expect(page.locator('#roi-minutesPerTask-note')).toHaveText('Enter 0 or more');
    await expect(page.getByText('Fix the highlighted fields')).toBeVisible();
    await page.getByLabel('Minutes per task').fill('12');

    await page.getByRole('button', { name: 'Add this to my message' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#c-message')).toHaveValue(/6 people doing 40 tasks a week/);
    await expect(page.locator('#c-message')).toHaveValue(/\$52,416 a year/);
  });
});

test.describe('contact form', () => {
  test('shows clear errors, then sends and clears on success', async ({ page }) => {
    let body: Record<string, string> | null = null;
    await page.route(FORM_ENDPOINT, async (route) => {
      body = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
        headers: { 'access-control-allow-origin': '*' },
      });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('#c-name-err')).toHaveText('Enter your name');
    await expect(page.locator('#c-email-err')).toHaveText('Enter your work email');
    await expect(page.locator('#c-message-err')).toContainText('10 characters');
    await expect(page.getByLabel('Your name')).toBeFocused();

    await page.getByLabel('Your name').fill('Dana Whitfield');
    await expect(page.locator('#c-name-err')).toHaveCount(0);
    await page.getByLabel('Work email').fill('dana@acme');
    await page.getByLabel('What would you like to automate?').fill('Invoices from many vendors');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('#c-email-err')).toContainText('valid email');

    await page.getByLabel('Work email').fill('dana@acme.com');
    await page.getByLabel('Company (optional)').fill('Acme');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Thanks, we got your message' }),
    ).toBeVisible();
    await expect(page.getByLabel('Your name')).toHaveValue('');
    await expect(page.getByLabel('What would you like to automate?')).toHaveValue('');
    expect(body).toEqual({
      name: 'Dana Whitfield',
      email: 'dana@acme.com',
      company: 'Acme',
      message: 'Invoices from many vendors',
    });
  });

  test('keeps what was typed when sending fails', async ({ page }) => {
    await page.route(FORM_ENDPOINT, (route) => route.abort());
    await page.goto('/');
    await page.getByLabel('Your name').fill('Dana Whitfield');
    await page.getByLabel('Work email').fill('dana@acme.com');
    await page.getByLabel('What would you like to automate?').fill('Please call me about invoices');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('alert')).toContainText('was not sent');
    await expect(page.getByLabel('Your name')).toHaveValue('Dana Whitfield');
    await expect(page.getByLabel('What would you like to automate?')).toHaveValue(
      'Please call me about invoices',
    );
  });

  test('does not send anything when the hidden spam field is filled', async ({ page }) => {
    let sent = 0;
    await page.route(FORM_ENDPOINT, (route) => {
      sent++;
      return route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/');
    await page.locator('#c-website').fill('http://spam.example', { force: true });
    await page.getByLabel('Your name').fill('Bot Bot');
    await page.getByLabel('Work email').fill('bot@spam.example');
    await page.getByLabel('What would you like to automate?').fill('buy cheap things now please');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Thanks' })).toBeVisible();
    expect(sent).toBe(0);
  });

  test('shows the email address instead of a broken form when no endpoint is set', async ({
    page,
  }) => {
    await page.goto(NO_FORM_URL);
    await expect(page.locator('.contact-form')).toHaveCount(0);
    await expect(page.locator('#contact')).toContainText('The contact form is not switched on');
    await expect(page.locator('#contact')).toContainText('hello@automentai.com');
    await expect(page.getByRole('button', { name: /email address|Selected|Copied/ })).toBeVisible();
  });
});

test.describe('accessibility', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`home page has no axe violations in ${scheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/?company=Acme&industry=finance');
      await showAllSections(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();
      expect(
        results.violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
        ),
      ).toEqual([]);
    });
  }

  test('case study and builder pages have no axe violations', async ({ page }) => {
    for (const url of ['/#case/accounts-payable', '/#builder']) {
      await page.goto(url);
      await showAllSections(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    }
  });
});
