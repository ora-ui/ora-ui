import { expect, test } from '@playwright/test';

test('clicking on "Documentation" in primary nav navigates to documentation page', async ({
  page,
}) => {
  await page.goto('/');

  const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' });
  await primaryNav.getByRole('link', { name: 'Documentation' }).click();

  await expect(page).toHaveURL('/docs');
});
