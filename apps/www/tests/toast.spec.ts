import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test.describe.configure({ mode: 'default' });

async function openDocs(page: Page) {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/docs/components/toast');
  await expect(page.getByRole('button', { name: 'Export data' }).first()).toBeVisible();
}

async function fire(page: Page) {
  await page.getByRole('button', { name: 'Export data' }).first().click();
  const toast = page.locator('[data-slot="toast"]').first();
  await expect(toast).toBeVisible();
  return toast;
}

test('a toast appears with its title and description', async ({ page }) => {
  await openDocs(page);
  const toast = await fire(page);
  await expect(toast).toContainText('Export complete');
  await expect(toast).toContainText('Your file is ready to download.');
});

test('a visible toast has no axe violations', async ({ page }) => {
  await openDocs(page);
  const toast = await fire(page);
  await expect(toast).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).include('[data-slot="toaster"]').analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test('a toast is announced through a live region', async ({ page }) => {
  await openDocs(page);
  await fire(page);
  const live = page.locator('[data-slot="toaster"] [aria-live], [aria-live][role]');
  await expect(live.first()).toBeAttached();
  await expect(page.locator('[data-slot="toaster"]')).toHaveAttribute('role', 'region');
});

test('F6 moves focus to the viewport', async ({ page }) => {
  await openDocs(page);
  await fire(page);
  await page.keyboard.press('F6');
  await expect
    .poll(() => page.evaluate(() => !!document.activeElement?.closest('[data-slot="toaster"]')))
    .toBe(true);
});

test('the close button dismisses the toast', async ({ page }) => {
  await openDocs(page);
  const toast = await fire(page);
  await toast.hover();
  await toast.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
});

test('firing the same id again flips the replay animation class', async ({ page }) => {
  await openDocs(page);
  const button = page.getByRole('button', { name: 'Save draft' });
  await button.click();
  const toast = page.locator('[data-slot="toast"]').first();
  await expect(toast).toContainText('Saved 1 time.');
  await expect(toast).not.toHaveClass(/animate-toast-pulse/);
  await button.click();
  await expect(toast).toContainText('Saved 2 times.');
  await expect(toast).toHaveClass(/animate-toast-pulse-even/);
  await button.click();
  await expect(toast).toHaveClass(/animate-toast-pulse-odd/);
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(1);
});

test('stacked toasts fan out on hover', async ({ page }) => {
  await openDocs(page);
  const button = page.getByRole('button', { name: 'Send invoice' });
  await button.click();
  const toasts = page.locator('[data-slot="toast"]');
  await expect(toasts).toHaveCount(3);
  await toasts.last().hover({ force: true });
  await expect(toasts.first()).toHaveAttribute('data-expanded', '');
  await expect
    .poll(async () => {
      const [a, b] = await toasts.evaluateAll((els) =>
        els.map((e) => Math.round(e.getBoundingClientRect().y))
      );
      return Math.abs(a - b);
    })
    .toBeGreaterThan(40);
});

test('toast.promise shows the loading and success strings as titles without a replay', async ({
  page,
}) => {
  await openDocs(page);
  await page.getByRole('button', { name: 'Save changes' }).click();
  const toast = page.locator('[data-slot="toast"]').first();
  await expect(toast.locator('[data-slot="toast-title"]')).toHaveText('Saving changes');
  await expect(toast.locator('[data-slot="toast-title"]')).toHaveText('Changes saved');
  await expect(toast.locator('[data-slot="toast-description"]')).toHaveCount(0);
  await expect(toast).toHaveAttribute('data-theme', 'success');
  await expect(toast).not.toHaveClass(/animate-toast/);
});

test('an error toast is announced as an alertdialog with the destructive theme', async ({
  page,
}) => {
  await openDocs(page);
  await page.getByRole('button', { name: 'Error', exact: true }).click();
  const toast = page.locator('[data-slot="toast"]').first();
  await expect(toast).toContainText('Upload failed');
  await expect(toast).toHaveAttribute('role', 'alertdialog');
  await expect(toast).toHaveAttribute('data-theme', 'destructive');
});

test('a success toast is announced as a dialog', async ({ page }) => {
  await openDocs(page);
  const toast = await fire(page);
  await expect(toast).toHaveAttribute('role', 'dialog');
});

const variants = ['surface', 'soft', 'solid'] as const;
const themes = ['gray', 'accent', 'destructive', 'warning', 'success'] as const;
const modes = ['light', 'dark'] as const;

/*
 * Contrast failures that belong to the color tokens, not to the toast. Tracked
 * in issue #360 and its follow-up. Any other failure fails the test, and a
 * fixed entry should be removed from this list.
 */
const KNOWN_TOKEN_CONTRAST_FAILURES_360 = new Set<string>([
  /* The solid description and action share the title's bg-solid and text-on-solid pair. */
  ...modes.flatMap((mode) =>
    (['success', 'accent', 'destructive'] as const).flatMap((theme) =>
      ['toast-title', 'toast-description', 'toast-action'].map(
        (slot) => `${mode}/solid/${theme}/${slot}`
      )
    )
  ),
  ...(['destructive', 'warning'] as const).map(
    (theme) => `light/surface/${theme}/toast-description`
  ),
]);

/*
 * The action is an Ora soft Button, which takes its text color from the toast
 * theme. Its light-mode 900 step measures 3.8:1 to 4.4:1 on the soft tint, the
 * same token family as the button-theme baseline. Not owned by the toast and
 * not covered by #360, so it needs its own ticket.
 */
const KNOWN_SOFT_BUTTON_THEME_CONTRAST_FAILURES = new Set<string>(
  (['accent', 'destructive', 'warning', 'success'] as const).map(
    (theme) => `light/surface/${theme}/toast-action`
  )
);

for (const mode of modes)
  for (const variant of variants)
    for (const theme of themes) {
      test(`axe: ${variant} ${theme} toast in ${mode} mode`, async ({ page }) => {
        await page.addInitScript((m) => localStorage.setItem('theme', m), mode);
        await page.goto(`/playground/toast?variant=${variant}&theme=${theme}&timeout=0`);
        await page.getByRole('button', { name: 'Show toast' }).click();
        const toast = page.locator('[data-slot="toast"]').first();
        await expect(toast).toBeVisible();
        await expect
          .poll(() => toast.evaluate((el) => el.getAnimations({ subtree: true }).length))
          .toBe(0);
        const { violations } = await new AxeBuilder({ page })
          .include('[data-slot="toast"]')
          .analyze();
        const failures = violations.flatMap((v) =>
          v.nodes.map((node) => {
            const slot = /data-slot="([^"]+)"/.exec(node.html)?.[1] ?? node.target.join(' ');
            return `${v.id}:${slot}`;
          })
        );
        const unexpected = failures.filter((f) => {
          const [rule, slot] = f.split(':');
          const key = `${mode}/${variant}/${theme}/${slot}`;
          return !(
            rule === 'color-contrast' &&
            (KNOWN_TOKEN_CONTRAST_FAILURES_360.has(key) ||
              KNOWN_SOFT_BUTTON_THEME_CONTRAST_FAILURES.has(key))
          );
        });
        expect(unexpected).toEqual([]);
      });
    }

test('a top-center toaster renders at the top of the viewport', async ({ page }) => {
  await page.goto('/playground/toast?position=top-center&timeout=0');
  await page.getByRole('button', { name: 'Show toast' }).click();
  const toast = page.locator('[data-slot="toast"]').first();
  await expect(toast).toBeVisible();
  await expect(page.locator('[data-slot="toast-viewport"]')).toHaveAttribute(
    'data-position',
    'top-center'
  );
  await expect
    .poll(async () => (await toast.boundingBox())?.y ?? Number.POSITIVE_INFINITY)
    .toBeLessThan(100);
});
