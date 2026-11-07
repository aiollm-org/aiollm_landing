import { test, expect } from '@playwright/test';
import { faqEntries, project } from '../src/data/project';
import { serializeJsonLd, siteTitle } from '../src/lib/seo';

test('canonical, hreflang, social metadata, and JSON-LD are in server HTML', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const response = await page.goto(`${baseURL}/?theme=dark&utm_source=test`);
    expect(response!.status()).toBe(200);
    await expect(page).toHaveTitle(siteTitle);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      project.landing,
    );
    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute('hreflang'),
          link.getAttribute('href'),
        ]),
      );
    expect(alternates).toEqual([
      ['en', project.landing],
      ['ru', `${project.landing}/ru`],
      ['x-default', project.landing],
    ]);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Pydantic and aiohttp/,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      project.landing,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow',
    );
    const data = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    expect(data['@context']).toBe('https://schema.org');
    expect(
      data['@graph'].map((entry: { '@type': string }) => entry['@type']),
    ).toEqual(['WebSite', 'WebPage', 'SoftwareSourceCode', 'FAQPage']);
    const software = data['@graph'][2];
    expect(software.codeRepository).toBe(project.repository);
    expect(software.version).toBe(project.version);
    expect(software.subjectOf.url).toBe(project.docs);
    expect(data['@graph'][3].mainEntity).toEqual(
      faqEntries.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    );
    // Actual DOM, with scripts disabled: serialized React payload alone does not pass.
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main h2')).toHaveCount(8);
    for (const id of [
      'getting-started',
      'features',
      'generation',
      'flow',
      'providers',
      'streaming',
      'docs',
      'faq',
    ]) {
      await expect(page.locator(`#${id} h2`)).toBeVisible();
    }
    await expect(
      page.getByRole('link', { name: 'Read the docs', exact: true }),
    ).toHaveAttribute('href', project.docs);
    await expect(page.locator('#code')).toBeVisible();
    for (const { question, answer } of faqEntries) {
      await page.getByText(question, { exact: true }).click();
      await expect(page.getByText(answer, { exact: true })).toBeVisible();
    }
    const oldLinks = page.locator(
      'a[href^="https://grehban.github.io/aiollm"]',
    );
    await expect(oldLinks).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('sitemap and robots describe only the canonical landing site', async ({
  request,
}) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toContain('xml');
  const xml = await sitemap.text();
  expect(xml.match(/<loc>/g)).toHaveLength(2);
  expect(xml).toContain(`<loc>${project.landing}</loc>`);
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('hreflang="x-default"');
  expect(xml).not.toMatch(/localhost|127\.0\.0\.1|docs\.aiollm\.dev/);
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Allow: /');
  expect(await robots.text()).toContain(
    'Sitemap: https://aiollm.dev/sitemap.xml',
  );
});

test('advertised social images exist locally without a production domain', async ({
  page,
  request,
}) => {
  await page.goto('/');
  for (const selector of [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
  ]) {
    const url = new URL(
      (await page.locator(selector).getAttribute('content'))!,
    );
    expect(url.origin).toBe('https://aiollm.dev');
    const response = await request.get(url.pathname + url.search);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const image = await response.body();
    expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  }
});

test('JSON-LD serialization cannot close its HTML script element', () => {
  const hostile = { text: '</script><script>alert("example")</script>' };
  const serialized = serializeJsonLd(hostile);
  expect(serialized).not.toContain('<');
  expect(JSON.parse(serialized)).toEqual(hostile);
});
