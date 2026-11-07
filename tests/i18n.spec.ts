import { test, expect } from '@playwright/test';
import { ru } from '../src/data/i18n/ru';
import { en } from '../src/data/i18n/en';
import { installCommand } from '../src/data/examples';

test('Russian content, metadata, FAQ, and language links are server rendered without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const response = await page.goto(`${baseURL}/ru?utm_source=test`);
    expect(response!.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page).toHaveTitle(ru.seo.title);
    await expect(page.locator('main h1')).toHaveText(
      ru.hero.before + ru.hero.emphasis + ru.hero.after,
    );
    for (const [id, title] of [
      ['getting-started', ru.start.title],
      ['features', ru.features.title],
      ['generation', ru.generation.title],
      ['flow', ru.flow.title],
      ['providers', ru.providers.title],
      ['streaming', ru.streaming.title],
      ['docs', ru.documentation.title],
      ['faq', ru.faq.title],
    ])
      await expect(page.locator(`#${id} h2`)).toHaveText(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://aiollm.dev/ru',
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      'https://aiollm.dev',
    );
    await expect(page.locator('link[hreflang="ru"]')).toHaveAttribute(
      'href',
      'https://aiollm.dev/ru',
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      ru.seo.description,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      'ru_RU',
    );
    await expect(
      page.locator('meta[property="og:locale:alternate"]'),
    ).toHaveAttribute('content', 'en_US');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      ru.seo.title,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://aiollm.dev/opengraph-image',
    );
    await expect(page.locator('#code')).toBeVisible();
    const jsonLd = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    expect(jsonLd['@graph'][1].inLanguage).toBe('ru');
    expect(jsonLd['@graph'][1].url).toBe('https://aiollm.dev/ru');
    expect(jsonLd['@graph'][3].mainEntity[0].acceptedAnswer.text).toBe(
      ru.faq.items[0].answer,
    );
    for (const entry of ru.faq.items) {
      await page.getByText(entry.question, { exact: true }).click();
      await expect(page.getByText(entry.answer, { exact: true })).toBeVisible();
    }
    await page.getByRole('link', { name: 'English', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(en.seo.title);
  } finally {
    await context.close();
  }
});

test('language switching preserves the theme and translates interactive controls', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat/i.test(message.text()))
      errors.push(message.text());
  });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: /^Color theme:/ }).click();
  await page.getByRole('menuitemradio', { name: 'Dark', exact: true }).click();
  await page.getByRole('link', { name: 'Русский', exact: true }).click();
  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(
    page.getByRole('link', { name: 'Русский', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Тема оформления: Тёмная' }).click();
  await expect(
    page.getByRole('menuitemradio', { name: 'Системная', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('menuitemradio', { name: 'Светлая', exact: true })
    .click();
  await page.getByRole('button', { name: 'Копировать', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Скопировано', exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    installCommand,
  );
  await page.getByRole('tab', { name: 'stream.py' }).click();
  await expect(page.locator('#caption')).toContainText('Если поток оборвётся');
  await page.getByRole('link', { name: 'English', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByRole('button', { name: 'Color theme: Light' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(errors).toEqual([]);
});

test('Russian navigation, code, and translated copy fit narrow and wide layouts', async ({
  page,
}) => {
  await page.goto('/ru');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(
      page.getByRole('link', { name: 'English', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Русский', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^Тема оформления:/ }),
      `${width}px navigation`,
    ).toBeInViewport();
    for (const tab of ['generate.py', 'stream.py', 'your_api.py']) {
      await page.getByRole('tab', { name: tab }).click();
      const overflow = await page
        .locator('main pre, #install-cmd, .setup-terminal, .nav .wrap')
        .evaluateAll((elements) =>
          elements
            .filter((element) => element.scrollWidth > element.clientWidth + 1)
            .map((element) => element.className),
        );
      expect(overflow, `${width}px, ${tab}`).toEqual([]);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
  }
});

test('English aliases redirect, unsupported locales return 404, and sitemap lists both languages', async ({
  request,
}) => {
  const alias = await request.get('/en?source=test', { maxRedirects: 0 });
  expect(alias.status()).toBe(308);
  expect(alias.headers().location).toBe('/?source=test');
  expect((await request.get('/fr')).status()).toBe(404);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(2);
  expect(sitemap).toContain('<loc>https://aiollm.dev/ru</loc>');
  expect(sitemap).toContain('hreflang="ru"');
});

test('each streaming point appears once and in the page language', async ({
  page,
}) => {
  for (const [path, heading] of [
    ['/', 'Retry the opening, not the output'],
    ['/ru', 'Повторяется открытие, а не вывод'],
  ]) {
    await page.goto(path);
    const titles = page.locator('#streaming article h3');
    await expect(titles).toHaveCount(3);
    await expect(titles.filter({ hasText: heading })).toHaveCount(1);
  }
  await expect(page.locator('#streaming')).not.toContainText(
    'Retry the opening',
  );
});
