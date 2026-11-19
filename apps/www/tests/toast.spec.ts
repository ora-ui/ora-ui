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
  await expect(toast).toHaveClass(/animate-toast-pulse-odd/);
  await button.click();
  await expect(toast).toHaveClass(/animate-toast-pulse-even/);
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
