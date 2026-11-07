import { test, expect } from '@playwright/test';

test('reports real LCP, INP, and CLS summaries without sending analytics requests', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    const metrics: Record<string, unknown> = {};
    window.addEventListener('aiollm:web-vital', (event) => {
      const detail = (event as CustomEvent<{ name: string }>).detail;
      metrics[detail.name] = detail;
      sessionStorage.setItem('test-web-vitals', JSON.stringify(metrics));
    });
  });
  const analyticsRequests: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') analyticsRequests.push(request.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('tab', { name: 'stream.py' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('AnthropicClient');
  await page.getByRole('button', { name: /^Color theme:/ }).click();
  await page.getByRole('menuitemradio', { name: 'Dark', exact: true }).click();
  await page.evaluate(async () => {
    // Finish paints, then exercise the page-hidden flush used on tab changes.
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        Object.keys(
          JSON.parse(sessionStorage.getItem('test-web-vitals') ?? '{}'),
        ).sort(),
      ),
    )
    .toEqual(['CLS', 'INP', 'LCP']);
  const metrics = await page.evaluate(
    () =>
      JSON.parse(sessionStorage.getItem('test-web-vitals')!) as Record<
        string,
        { name: string; value: number; rating: string }
      >,
  );
  for (const metric of Object.values(metrics)) {
    expect(metric.value).toBeGreaterThanOrEqual(0);
    expect(['good', 'needs-improvement', 'poor']).toContain(metric.rating);
    expect(Object.keys(metric).sort()).toEqual([
      'delta',
      'id',
      'name',
      'navigationType',
      'rating',
      'value',
    ]);
  }
  expect(analyticsRequests).toEqual([]);
  await testInfo.attach('local-web-vitals.json', {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
});
