import { test, expect } from '@playwright/test';

test('FAQ expands and collapses smoothly, and reduced motion opens immediately', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.locator('#faq details').first();
  const summary = card.locator('summary');
  async function measureTransition() {
    return card.evaluate(async (element) => {
      // Native details-content lives in the browser's shadow tree, outside getAnimations().
      const duration =
        parseFloat(
          getComputedStyle(element, '::details-content').transitionDuration,
        ) * 1000;
      const start = element.getBoundingClientRect().height;
      const heights: number[] = [];
      const started = performance.now();
      do {
        await new Promise(requestAnimationFrame);
        heights.push(element.getBoundingClientRect().height);
      } while (performance.now() - started < duration + 50);
      const end = element.getBoundingClientRect().height;
      return { start, end, heights };
    });
  }
  await summary.click();
  const opening = await measureTransition();
  expect(opening.end).toBeGreaterThan(opening.start);
  expect(
    opening.heights.some(
      (height) => height > opening.start + 1 && height < opening.end - 1,
    ),
  ).toBe(true);
  await expect(card.locator('p')).toBeVisible();
  await summary.click();
  const closing = await measureTransition();
  expect(closing.end).toBeLessThan(closing.start);
  expect(
    closing.heights.some(
      (height) => height < closing.start - 1 && height > closing.end + 1,
    ),
  ).toBe(true);
  await expect(card.locator('p')).toBeHidden();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await summary.press('Enter');
  await expect(card.locator('p')).toBeVisible();
  expect(
    await card.evaluate(
      (element) =>
        getComputedStyle(element, '::details-content').transitionDuration,
    ),
  ).toBe('0s');
});
