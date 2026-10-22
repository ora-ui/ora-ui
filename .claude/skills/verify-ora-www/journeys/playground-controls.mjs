// Feature: features/playground-controls.md — drive the Button entry's controls and prove the
// preview and the URL (deep link) both follow.
export default async ({ page, step, shot, aria, check, expect }) => {
  const controls = page.getByRole('complementary');
  const preview = page.locator('main');
  const row = (label) =>
    controls
      .locator('div, label')
      .filter({ has: page.getByText(label, { exact: true }) })
      .last();

  await step('open /playground and pick Button from the Components sidebar', async () => {
    await page.goto('/playground');
    await expect(page.getByRole('heading', { name: 'Introduction' })).toBeVisible();
    await page.getByRole('link', { name: 'Button', exact: true }).click();
    await expect(page).toHaveURL(/\/playground\/button$/);
    await expect(preview.getByRole('button', { name: 'Button', exact: true })).toBeVisible();
    await shot('button-default');
  });

  await step('Controls > Variant: solid -> outline', async () => {
    await row('Variant').getByRole('combobox').click();
    await page.getByRole('option', { name: 'outline' }).click();
    await expect(page).toHaveURL(/[?&]variant=outline/);
    await expect(row('Variant').getByRole('combobox')).toContainText('outline');
  });

  await step('Controls > Theme: gray -> accent swatch', async () => {
    await controls.getByRole('radio', { name: 'accent' }).first().click();
    await expect(page).toHaveURL(/[?&]theme=accent/);
    await shot('outline-accent');
  });

  await step('Content > Label: type "Ship it"', async () => {
    await controls.getByRole('tab', { name: 'Content' }).click();
    await controls.getByRole('textbox', { name: 'Label' }).fill('Ship it');
    await expect(preview.getByRole('button', { name: 'Ship it' })).toBeVisible();
    await expect(page).toHaveURL(/[?&]label=Ship(\+|%20)it/);
  });

  await step('Content > Icon group: enable, then Position -> trailing', async () => {
    await controls.getByRole('button', { name: 'Icon', exact: true }).click();
    await expect(page).toHaveURL(/[?&]icon=true/);
    await controls.getByRole('button', { name: 'trailing' }).click();
    await expect(page).toHaveURL(/[?&]iconPosition=trailing/);
    const btn = preview.getByRole('button', { name: 'Ship it' });
    const lastIsSvg = await btn.evaluate(
      (el) => el.lastElementChild?.tagName.toLowerCase() === 'svg'
    );
    check(lastIsSvg, 'preview button ends with the icon (trailing)');
    await shot('label-icon-trailing');
  });

  await step('reload the deep link: state survives', async () => {
    const url = page.url();
    await page.goto(url);
    const btn = preview.getByRole('button', { name: 'Ship it' });
    await expect(btn).toBeVisible();
    check(
      await btn.evaluate((el) => el.lastElementChild?.tagName.toLowerCase() === 'svg'),
      'icon still trailing after reload'
    );
    await expect(row('Variant').getByRole('combobox')).toContainText('outline');
    await aria('reloaded-page');
    await shot('reloaded');
  });
};
