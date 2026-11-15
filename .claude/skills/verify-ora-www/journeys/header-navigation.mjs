// Feature: features/header-navigation.md — primary nav, theme toggle, GitHub link, and the
// mobile navigation drawer.
export default async ({ page, step, shot, aria, check, expect }) => {
  const banner = page.getByRole('banner');
  const htmlIsDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'));

  await step('Primary navigation > Documentation goes to /docs', async () => {
    await page.goto('/playground');
    await banner
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Documentation' })
      .click();
    await expect(page).toHaveURL(/\/docs$/);
  });

  await step('logo link returns home', async () => {
    await expect(banner.getByRole('link').first()).toHaveAttribute('href', '/');
  });

  await step('GitHub link points at the repo in a new tab', async () => {
    const gh = banner.getByRole('link', { name: 'GitHub' });
    await expect(gh).toHaveAttribute('href', 'https://github.com/ora-ui/ora-ui');
    await expect(gh).toHaveAttribute('target', '_blank');
  });

  await step('Toggle theme flips dark -> light and persists', async () => {
    check(await htmlIsDark(), 'starts dark');
    await banner.getByRole('button', { name: 'Toggle theme' }).click();
    await expect.poll(htmlIsDark).toBe(false);
    await shot('docs-light');
    await page.reload();
    await expect.poll(htmlIsDark).toBe(false);
  });

  await step('mobile (390px): drawer lists docs pages and navigates', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/docs');
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer.getByText('Navigation', { exact: true })).toBeVisible();
    await aria('mobile-drawer', drawer);
    await shot('mobile-drawer');
    await drawer.getByRole('link', { name: 'Input', exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/components\/input$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Input' })).toBeVisible();
  });
};
