import { test, expect } from '@playwright/test';

// Fonts, images, scripts, and highlighting must work without third-party CDNs.
test.beforeEach(async ({ page }) => {
  await page.route('https://**/*', (route) => route.abort());
});

test('renders every section, correct logo, responsive grids, and highlighted examples', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrated|minified react error/i.test(message.text())
    )
      errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  const response = await page.goto('/');
  const markup = await response!.text();
  expect(markup).toMatch(/<h1(?:\s|>)/);
  expect(markup).toContain('Typed, async clients for');
  await expect(page).toHaveTitle(
    'aiollm — Typed, async Python clients for AI APIs',
  );
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Typed, async clients',
  );
  await expect(page.locator('main section')).toHaveCount(10);
  await expect(page.locator('#features article')).toHaveCount(6);
  await expect(page.locator('#flow li')).toHaveCount(6);
  await expect(page.locator('#docs .doc')).toHaveCount(11);
  await expect(page.locator('#code .hljs-keyword').first()).toBeVisible();
  await expect(
    page.locator('#any-provider .hljs-keyword').first(),
  ).toBeVisible();
  const dark = testInfo.project.use.colorScheme === 'dark';
  await expect(page.locator('.hero-logo .logo-dark')).toBeVisible({
    visible: dark,
  });
  await expect(page.locator('.hero-logo .logo-light')).toBeVisible({
    visible: !dark,
  });
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const headingRight = await page
    .getByRole('heading', { level: 1 })
    .evaluate((element) => element.getBoundingClientRect().right);
  expect(headingRight).toBeLessThanOrEqual(
    testInfo.project.use.viewport!.width,
  );
  const columns = await page
    .locator('.features')
    .evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(' ').length,
    );
  expect(columns).toBe(testInfo.project.name.startsWith('mobile') ? 1 : 3);
  if (testInfo.project.use.reducedMotion === 'reduce') {
    expect(
      await page
        .locator('.hero-copy')
        .evaluate((element) => getComputedStyle(element).transform),
    ).toBe('none');
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe('auto');
  }
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('presents the verified release, installation, shared fields, and streaming contract', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('header .pill')).toHaveText('v0.10.0');
  await expect(page.locator('#getting-started')).toContainText('not on PyPI');
  await expect(page.locator('#getting-started .setup-terminal')).toContainText(
    'uv sync',
  );
  await expect(page.locator('#generation table')).toContainText(
    'output_config.format',
  );
  await expect(page.locator('#structured-example')).toContainText(
    'effort=Effort.MEDIUM',
  );
  await expect(page.locator('#structured-example')).toContainText(
    'additionalProperties',
  );
  await expect(page.locator('#checked-stream-example')).toContainText(
    'await events.final()',
  );
  await expect(page.locator('#streaming')).toContainText(
    'APIStreamInterruptedError',
  );
  await expect(page.locator('#docs')).toContainText(
    'adds function tools to the shared API',
  );
  await expect(page.locator('#tools-example')).toContainText(
    'ToolResult(call_id=call.id, output=output)',
  );
  await expect(page.locator('#generation table')).toContainText(
    'tool_choice.disable_parallel_tool_use',
  );
  for (const title of [
    'Uploads',
    'Sessions',
    'Resources and use cases',
    'Extending',
  ]) {
    await expect(
      page
        .locator('#docs a.doc')
        .filter({ has: page.getByText(title, { exact: true }) }),
    ).toBeVisible();
  }
  await expect(
    page.locator('#docs a[href="https://docs.aiollm.dev/guide/extending/"]'),
  ).toBeVisible();
});

test('FAQ answers expand and collapse by keyboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#faq details')).toHaveCount(7);
  const details = page.locator('#faq details').first();
  const summary = details.locator('summary');
  await expect(details.locator('p')).toBeHidden();
  await summary.focus();
  await summary.press('Enter');
  await expect(details.locator('p')).toBeVisible();
  await expect(details.getByRole('link')).toHaveAttribute(
    'href',
    'https://docs.aiollm.dev/guide/providers/',
  );
  await summary.press('Enter');
  await expect(details.locator('p')).toBeHidden();
});

test('code tabs support clicking, keyboard navigation, wraparound, and ARIA relationships', async ({
  page,
}) => {
  await page.goto('/');
  const generate = page.getByRole('tab', { name: 'generate.py' });
  const stream = page.getByRole('tab', { name: 'stream.py' });
  const own = page.getByRole('tab', { name: 'your_api.py' });
  const panel = page.getByRole('tabpanel');
  await stream.click();
  await expect(stream).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('AnthropicClient');
  await expect(panel).toHaveAttribute(
    'aria-labelledby',
    (await stream.getAttribute('id'))!,
  );
  await expect(stream).toHaveAttribute(
    'aria-controls',
    (await panel.getAttribute('id'))!,
  );
  await stream.press('ArrowRight');
  await expect(own).toBeFocused();
  await expect(panel).toContainText('BaseAPIMethod');
  await own.press('ArrowRight');
  await expect(generate).toBeFocused();
  await expect(panel).toContainText('OpenAIClient');
  await generate.press('ArrowLeft');
  await expect(own).toBeFocused();
  await own.press('Home');
  await expect(generate).toBeFocused();
  await generate.press('End');
  await expect(own).toBeFocused();
  await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
  await expect(stream).toHaveAttribute('tabindex', '-1');
});

test('copies only the install command and resets feedback', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const button = page.locator('#copy-install');
  await button.click();
  await expect(button).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'pip install git+https://github.com/GrehBan/aiollm.git',
  );
  await expect(button).toHaveText('Copy');
});

for (const failure of ['unavailable', 'rejected'] as const) {
  test(`selects command text when clipboard is ${failure}`, async ({
    page,
  }) => {
    await page.addInitScript((failure) => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value:
          failure === 'unavailable'
            ? undefined
            : {
                writeText: () => Promise.reject(new Error('Permission denied')),
              },
      });
    }, failure);
    await page.goto('/');
    await page.locator('#copy-install').click();
    await expect(page.locator('#copy-install')).toHaveText('Selected');
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
      'pip install git+https://github.com/GrehBan/aiollm.git',
    );
  });
}

test('theme overrides switch logos and links stay valid', async ({ page }) => {
  await page.goto('/');
  for (const theme of ['dark', 'light']) {
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    );
    await expect(page.locator(`.hero-logo .logo-${theme}`)).toBeVisible();
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    const expectedBackground = await page
      .locator('#copy-install')
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await expect
      .poll(() =>
        page
          .locator('#copy-install')
          .evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .toBe(expectedBackground);
  }
  const invalidAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute('href')!)
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  expect(invalidAnchors).toEqual([]);
  await expect(
    page
      .getByRole('navigation', { name: 'Main', exact: true })
      .getByRole('link', { name: 'Docs', exact: true }),
  ).toHaveAttribute('href', 'https://docs.aiollm.dev/');
});
