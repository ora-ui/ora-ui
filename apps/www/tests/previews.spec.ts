import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { parsePreviewsDir } from '../scripts/gen-registry';

const themes = ['dark', 'light'] as const;
type Theme = (typeof themes)[number];

/*
 * A preview passes only when its axe rule ids match its entry exactly, so a
 * fix fails the run until the entry is removed.
 */
const baselinePath = path.join(__dirname, 'previews.a11y-baseline.json');
const baseline: Record<Theme, Record<string, string[]>> = JSON.parse(
  fs.readFileSync(baselinePath, 'utf-8')
);

const previews = parsePreviewsDir(path.join(__dirname, '../docs/previews')).flatMap((entry) =>
  entry.exports.map((e) => `${entry.slug}/${e.value}`)
);

/*
 * Concurrent first requests to `next dev` intermittently produce useId
 * hydration mismatches in checkbox previews. Production builds do not, so
 * this file runs its tests in order on one worker.
 */
test.describe.configure({ mode: 'default' });

test('every baseline entry names an existing preview', () => {
  const stale = themes.flatMap((theme) =>
    Object.keys(baseline[theme])
      .filter((id) => !previews.includes(id))
      .map((id) => `${theme}: ${id}`)
  );
  expect(stale, 'remove these entries from previews.a11y-baseline.json').toEqual([]);
});

for (const theme of themes)
  for (const id of previews) {
    test(`preview ${id} (${theme}) renders without errors and meets its a11y baseline`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
      });

      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      const response = await page.goto(`/preview/${id}`);
      expect(response?.status(), `GET /preview/${id}`).toBe(200);
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
      await expect(page.locator('[data-preview-root]')).toBeAttached();

      /* Heading structure belongs to the page a component sits in, not the component. */
      const { violations } = await new AxeBuilder({ page })
        .exclude('header')
        .disableRules(['heading-order', 'page-has-heading-one'])
        .analyze();
      const actual = violations.map((v) => v.id).sort();
      test.info().annotations.push({ type: 'axe', description: JSON.stringify(actual) });

      expect(errors, `errors while rendering ${id} (${theme})`).toEqual([]);
      expect(
        actual,
        `${theme} axe violations for ${id} differ from previews.a11y-baseline.json:\n${violations
          .map((v) => `  ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
          .join('\n')}`
      ).toEqual([...(baseline[theme][id] ?? [])].sort());
    });
  }
