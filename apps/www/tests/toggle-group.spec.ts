import { expect, test } from '@playwright/test';

const cases = [
  {
    preview: 'toggle-group-variants/soft',
    orientation: 'horizontal',
    next: 'ArrowRight',
    prev: 'ArrowLeft',
    cross: 'ArrowDown',
  },
  {
    preview: 'toggle-group-vertical/vertical',
    orientation: 'vertical',
    next: 'ArrowDown',
    prev: 'ArrowUp',
    cross: 'ArrowRight',
  },
] as const;

for (const { preview, orientation, next, prev, cross } of cases) {
  test(`toggle-group ${orientation}: no aria-orientation, arrows follow the axis`, async ({
    page,
  }) => {
    await page.goto(`/preview/${preview}`);
    const root = page.locator('[data-slot="toggle-group"]').first();
    const items = root.locator('[data-slot="toggle-group-item"]');
    const focused = (i: number) => items.nth(i).evaluate((el) => el === document.activeElement);

    await expect(root).toHaveAttribute('data-orientation', orientation);
    await expect(root).not.toHaveAttribute('aria-orientation');

    await items.nth(0).focus();
    await page.keyboard.press(cross);
    expect(await focused(0), `${cross} leaves focus in place`).toBe(true);
    await page.keyboard.press(next);
    expect(await focused(1), `${next} moves focus to the next item`).toBe(true);
    await page.keyboard.press(prev);
    expect(await focused(0), `${prev} moves focus back`).toBe(true);
  });
}
