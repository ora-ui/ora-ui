// Feature: features/playground-theming.md — Theming tab: radius and appearance apply to the
// whole page and persist across reload.
export default async ({ page, step, shot, aria, check, expect }) => {
  const controls = page.getByRole('complementary');
  const theming = async () => {
    await controls.getByRole('tab', { name: 'Theming' }).click();
    return controls.getByRole('tabpanel');
  };
  const cssRadius = () =>
    page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--radius').trim()
    );
  const htmlIsDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'));

  await step('open /playground/button > Theming tab', async () => {
    await page.goto('/playground/button');
    const panel = await theming();
    await expect(panel.getByRole('radio', { name: 'Medium', exact: true })).toBeChecked();
    check(await htmlIsDark(), 'site defaults to dark');
    await shot('theming-default');
  });

  await step('Radius -> Large sets --radius on <html>', async () => {
    const panel = await theming();
    await panel.getByRole('radio', { name: 'Large', exact: true }).click();
    await expect(panel.getByRole('radio', { name: 'Large', exact: true })).toBeChecked();
    await expect.poll(cssRadius).toBe('0.75rem');
    check(
      (await page.evaluate(() => localStorage.getItem('playground:radius'))) === 'lg',
      'localStorage playground:radius = lg'
    );
  });

  await step('Appearance -> Light flips the page theme', async () => {
    const panel = await theming();
    await panel.getByRole('radio', { name: 'Light', exact: true }).click();
    await expect.poll(htmlIsDark).toBe(false);
    await shot('light-large-radius');
  });

  await step('reload: radius and appearance persist', async () => {
    await page.reload();
    const panel = await theming();
    await expect(panel.getByRole('radio', { name: 'Large', exact: true })).toBeChecked();
    await expect(panel.getByRole('radio', { name: 'Light', exact: true })).toBeChecked();
    await expect.poll(cssRadius).toBe('0.75rem');
    check(!(await htmlIsDark()), 'still light after reload');
    await aria('theming-panel', controls);
    await shot('reloaded');
  });
};
