// Feature: features/docs-search.md — header Search button and ⌘K open the dialog; query,
// keyboard navigation, empty state, and opening a result.
export default async ({ page, step, shot, aria, check, expect }) => {
  const banner = page.getByRole('banner');
  const dialog = page.getByRole('dialog');
  const input = dialog.getByPlaceholder('Search docs...');

  await step('no Search outside /docs', async () => {
    await page.goto('/playground');
    await expect(banner.getByRole('link', { name: 'Documentation' })).toBeVisible();
    await expect(banner.getByRole('button', { name: 'Search' })).toHaveCount(0);
  });

  await step('header Search button opens the dialog', async () => {
    await page.goto('/docs');
    await banner.getByRole('button', { name: 'Search' }).click();
    await expect(input).toBeVisible();
    await expect(dialog.getByText('Type to search documentation')).toBeVisible();
  });

  await step('query "accordion" lists results; Enter opens the first', async () => {
    await input.fill('accordion');
    const first = dialog.getByRole('link').first();
    await expect(first).toHaveAttribute('href', /\/docs\/components\/accordion/);
    await aria('results', dialog);
    await shot('results');
    await input.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/docs\/components\/accordion/);
    await expect(page.getByRole('heading', { level: 1, name: 'Accordion' })).toBeVisible();
  });

  await step('⌘K / Ctrl+K reopens with an empty query', async () => {
    await page.keyboard.press('ControlOrMeta+k');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('');
  });

  await step('no-match query shows the empty state; Escape closes', async () => {
    await input.fill('zzqxv');
    await expect(dialog.getByText('No results for “zzqxv”')).toBeVisible();
    await shot('empty');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  await step('API agrees with the UI', async () => {
    const res = await page.request.get('/api/search?query=accordion');
    const body = await res.json();
    check(
      res.ok() && body.some((r) => r.url.startsWith('/docs/components/accordion')),
      'API returns accordion page'
    );
  });
};
