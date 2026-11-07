import { test, expect } from '@playwright/test';

test('theme control becomes interactive only after hydration', async ({
  page,
}) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route('**/_next/static/**/*.js*', async (route) => {
    await scriptsReady;
    await route.continue();
  });
  try {
    await page.goto('/ru', { waitUntil: 'commit' });
    const button = page.getByRole('button', {
      name: 'Тема оформления: Системная',
    });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    releaseScripts();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(
      page.getByRole('menuitemradio', { name: 'Светлая', exact: true }),
    ).toBeVisible();
  } finally {
    releaseScripts();
  }
});

test('Russian locale and saved theme hydrate consistently on direct visits and reloads', async ({
  page,
  context,
  baseURL,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydrat|server rendered|minified react error/i.test(message.text())
    )
      errors.push(message.text());
  });
  await context.addCookies([
    { name: 'aiollm-theme', value: 'dark', url: baseURL! },
  ]);
  for (let visit = 0; visit < 2; visit++) {
    const response = await page.goto('/ru', { waitUntil: 'networkidle' });
    expect(await response!.text()).toContain('lang="ru" data-theme="dark"');
    await expect(
      page.getByRole('button', { name: 'Тема оформления: Тёмная' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Копировать', exact: true }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'stream.py' }).click();
    await expect(page.locator('#caption')).toContainText(
      'Если поток оборвётся',
    );
  }
  expect(errors).toEqual([]);
});

test('server and client hydrate consistently on a fresh load and reload', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydrat|server rendered|minified react error/i.test(message.text())
    )
      errors.push(message.text());
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    const html = await response!.text();
    const serverClasses = /<html\b[^>]*\bclass="([^"]*)"/.exec(html)?.[1] ?? '';
    await expect(page.getByRole('tab', { name: 'generate.py' })).toBeVisible();
    await page.getByRole('tab', { name: 'stream.py' }).click();
    await expect(page.getByRole('tabpanel')).toContainText('AnthropicClient');
    expect((await page.locator('html').getAttribute('class')) ?? '').toBe(
      serverClasses,
    );
  }
  expect(errors).toEqual([]);
});

test('server-rendered content is visible before JavaScript runs', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#code')).toBeVisible();
    await expect(page.locator('#getting-started')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('saved light and dark themes match server HTML during hydration', async ({
  page,
  context,
  baseURL,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat/i.test(message.text()))
      errors.push(message.text());
  });
  for (const theme of ['light', 'dark']) {
    await context.addCookies([
      { name: 'aiollm-theme', value: theme, url: baseURL! },
    ]);
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(await response!.text()).toContain(`data-theme="${theme}"`);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(
      page.getByRole('button', { name: /^Color theme:/ }),
    ).toHaveAccessibleName(
      `Color theme: ${theme === 'light' ? 'Light' : 'Dark'}`,
    );
    await expect(page.locator(`.hero-logo .logo-${theme}`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});
