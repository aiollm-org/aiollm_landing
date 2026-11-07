import { test, expect } from '@playwright/test';

test('hero background moves visibly within its first second', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const distance = await page.locator('.hero-glow-blue').evaluate((element) => {
    const animation = element.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    const start = element.getBoundingClientRect();
    animation.currentTime = 1000;
    const end = element.getBoundingClientRect();
    return Math.hypot(end.x - start.x, end.y - start.y);
  });
  expect(distance).toBeGreaterThan(24);
});

test('Python panels and syntax colors follow Light, Dark, and System themes', async ({
  page,
}) => {
  await page.goto('/');
  const brightness = (color: string) => {
    const channels = color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number);
    return channels.reduce((sum, channel) => sum + channel, 0) / 3;
  };
  async function select(label: string) {
    await page.getByRole('button', { name: /^Color theme:/ }).click();
    await page.getByRole('menuitemradio', { name: label, exact: true }).click();
  }
  async function palette() {
    return page.locator('#code').evaluate((element) => ({
      background: getComputedStyle(element.closest('.code-win')!)
        .backgroundColor,
      text: getComputedStyle(element).color,
      keyword: getComputedStyle(element.querySelector('.hljs-keyword')!).color,
      string: getComputedStyle(element.querySelector('.hljs-string')!).color,
      comment: getComputedStyle(element.querySelector('.hljs-comment')!).color,
    }));
  }
  await select('Light');
  const light = await palette();
  expect(brightness(light.background)).toBeGreaterThan(200);
  expect(brightness(light.text)).toBeLessThan(110);
  const lightPanels = await page
    .locator('.code-win, .small-code, #generation figure, #streaming figure')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).backgroundColor),
    );
  expect(lightPanels.every((color) => brightness(color) > 200)).toBe(true);
  await select('Dark');
  const dark = await palette();
  expect(brightness(dark.background)).toBeLessThan(60);
  expect(brightness(dark.text)).toBeGreaterThan(180);
  for (const token of ['keyword', 'string', 'comment'] as const)
    expect(light[token]).not.toBe(dark[token]);
  await select('System');
  await page.emulateMedia({ colorScheme: 'light' });
  expect(await palette()).toEqual(light);
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await palette()).toEqual(dark);
});

test('theme menu persists explicit choices and System follows the device', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat/i.test(message.text()))
      errors.push(message.text());
  });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /^Color theme:/ });
  for (const [choice, mode] of [
    ['Dark', 'dark'],
    ['Light', 'light'],
    ['System', 'system'],
  ]) {
    await trigger.click();
    await page
      .getByRole('menuitemradio', { name: choice, exact: true })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', mode);
    expect(
      (await context.cookies()).find((cookie) => cookie.name === 'aiollm-theme')
        ?.value,
    ).toBe(mode);
    const response = await page.reload();
    expect(await response!.text()).toContain(`data-theme="${mode}"`);
    await expect(trigger).toHaveAccessibleName(`Color theme: ${choice}`);
  }
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('.hero-logo .logo-dark')).toBeVisible();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('.hero-logo .logo-light')).toBeVisible();
  expect(errors).toEqual([]);
});

test('theme menu supports keyboard selection and invalid cookies fall back to System', async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([
    { name: 'aiollm-theme', value: 'invalid', url: baseURL! },
  ]);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'system');
  const trigger = page.getByRole('button', {
    name: 'Color theme: System',
    exact: true,
  });
  await trigger.focus();
  await trigger.press('Enter');
  await expect(
    page.getByRole('menuitemradio', { name: 'System', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitemradio', { name: 'Dark', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Color theme: Dark', exact: true }),
  ).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('hero gradients and lattice animate only when motion is allowed', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const backdrop = page.locator('.hero-backdrop');
  await expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  const visibleGlows = await page
    .locator('.hero-glow')
    .evaluateAll((elements) => {
      const copy = document
        .querySelector('.hero-copy')!
        .getBoundingClientRect();
      return elements.filter((element) => {
        const bounds = element.getBoundingClientRect();
        return (
          bounds.top + bounds.height * 0.2 < copy.bottom &&
          bounds.bottom - bounds.height * 0.2 > copy.top &&
          bounds.left + bounds.width * 0.2 < copy.right &&
          bounds.right - bounds.width * 0.2 > copy.left
        );
      }).length;
    });
  expect(visibleGlows).toBeGreaterThan(0);
  const animations = await backdrop.evaluate(
    (element) =>
      element
        .getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running').length,
  );
  expect(animations).toBeGreaterThanOrEqual(3);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      backdrop.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(0);
  await expect
    .poll(() =>
      page
        .locator('.hero-copy')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe('1');
  expect(
    await page
      .locator('.hero-copy')
      .evaluate((element) => getComputedStyle(element).transform),
  ).toBe('none');
});

test('commands, code, and code tabs stay fully visible without horizontal scrolling', async ({
  page,
}) => {
  await page.goto('/');
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ['generate.py', 'stream.py', 'your_api.py']) {
      await page.getByRole('tab', { name }).click();
      const overflowing = await page
        .locator('main pre, #install-cmd, .setup-terminal, [role="tablist"]')
        .evaluateAll((elements) =>
          elements
            .filter(
              (element) =>
                element.clientWidth > 0 &&
                element.scrollWidth > element.clientWidth + 1,
            )
            .map((element) => ({
              tag: element.tagName,
              id: element.id,
              width: element.clientWidth,
              contentWidth: element.scrollWidth,
            })),
        );
      expect(overflowing, `width ${width}, sample ${name}`).toEqual([]);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
