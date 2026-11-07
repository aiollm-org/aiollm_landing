import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

test('development serves a valid source map for the rendered server layout', async ({
  request,
}) => {
  const page = await request.get('/');
  expect(page.status()).toBe(200);
  // Exercise the same absolute-filename endpoint shown in the Firefox report.
  const directory = resolve('.next/dev/server/chunks/ssr');
  const files = (await readdir(directory)).filter((file) =>
    file.endsWith('.js'),
  );
  const chunks = await Promise.all(
    files.map(async (file) => ({
      filename: resolve(directory, file),
      code: await readFile(resolve(directory, file), 'utf8'),
    })),
  );
  const layout = chunks.find(
    ({ code }) =>
      code.includes('async function RootLayout(') &&
      code.includes('src/app/[locale]/layout.tsx'),
  );
  expect(
    layout,
    'RootLayout must have compiled before looking up its source map',
  ).toBeDefined();
  const response = await request.get('/__nextjs_source-map', {
    params: { filename: layout!.filename },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const map = await response.json();
  expect(map.version).toBe(3);
  expect(JSON.stringify(map)).toContain('src/app/[locale]/layout.tsx');
});
