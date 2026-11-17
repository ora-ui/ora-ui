import { expect, test } from '@playwright/test';

test('Tab into a theming radio group focuses the radio restored after mount', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('playground:radius', 'lg');
  });
  await page.goto('/playground/button');
  const sidebar = page.getByRole('complementary');
  await sidebar.getByRole('tab', { name: 'Theming' }).click();

  const dark = sidebar.getByRole('radio', { name: 'Dark', exact: true });
  const large = sidebar.getByRole('radio', { name: 'Large', exact: true });
  await expect(dark).toBeChecked();
  await expect(large).toBeChecked();

  await sidebar.getByRole('radio', { name: 'gray', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(dark).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(large).toBeFocused();
});
