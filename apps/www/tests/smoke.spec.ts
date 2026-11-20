import { expect, test } from '@playwright/test';

test('clicking on "Documentation" in primary nav navigates to documentation page', async ({
  page,
}) => {
  await page.goto('/playground');

  const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' });
  await primaryNav.getByRole('link', { name: 'Documentation' }).click();

  await expect(page).toHaveURL('/docs');
});

test('clicking on "Playground" in primary nav navigates to the playground', async ({ page }) => {
  await page.goto('/docs');

  const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' });
  await primaryNav.getByRole('link', { name: 'Playground' }).click();

  await expect(page).toHaveURL('/playground');
});

test('a component docs page with a playground entry links to it', async ({ page }) => {
  await page.goto('/docs/components/button');

  await page.getByRole('link', { name: 'Open in Playground' }).click();

  await expect(page).toHaveURL('/playground/button');
});

test('a component docs page without a playground entry has no playground link', async ({
  page,
}) => {
  await page.goto('/docs/components/badge');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open in Playground' })).toHaveCount(0);
});

test('the mobile navigation drawer links to the playground', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs');

  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Playground' }).click();

  await expect(page).toHaveURL('/playground');
});
