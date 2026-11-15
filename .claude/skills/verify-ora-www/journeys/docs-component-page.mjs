// Feature: features/docs-component-page.md — reach a component page from the docs sidebar,
// see the live preview, switch install package managers, and copy the command.
export default async ({ page, step, shot, aria, check, expect }) => {
  const sidebar = page.getByRole('main').getByRole('navigation').first();

  await step('/docs sidebar -> Button', async () => {
    await page.goto('/docs');
    await sidebar.getByRole('link', { name: 'Button', exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/components\/button$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible();
    await shot('button-page');
  });

  await step('live preview renders (no "Preview not found")', async () => {
    await expect(page.getByText(/Preview not found/)).toHaveCount(0);
    const previewButtons = await page.getByRole('main').getByRole('button').count();
    check(previewButtons > 0, 'page renders interactive buttons');
  });

  await step('Installation > CLI: pnpm then npm', async () => {
    await page.getByRole('heading', { name: 'Installation' }).scrollIntoViewIfNeeded();
    await expect(page.getByText('pnpm dlx shadcn@latest add button')).toBeVisible();
    await page.getByRole('tab', { name: 'npm', exact: true }).click();
    await expect(page.getByText('npx shadcn@latest add button')).toBeVisible();
    await shot('install-npm');
  });

  await step('Copy puts the npm command on the clipboard', async () => {
    // The preview's code block has its own Copy; scope to the bar that holds the npm tab.
    const bar = page
      .locator('div')
      .filter({ has: page.getByRole('tab', { name: 'npm', exact: true }) })
      .filter({ has: page.getByRole('button', { name: 'Copy', exact: true }) })
      .last();
    const copy = bar.getByRole('button', { name: 'Copy', exact: true });
    await copy.click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    check(clip === 'npx shadcn@latest add button', `clipboard = "${clip}"`);
  });

  await step('Table of contents jumps to a section (xl viewport)', async () => {
    const toc = page.getByRole('link', { name: 'Installation', exact: true });
    await toc.click();
    await expect(page).toHaveURL(/#installation$/);
    await aria('page-outline', page.getByRole('main'));
  });
};
