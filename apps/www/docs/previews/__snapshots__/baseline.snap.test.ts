import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { registry } from '../registry.generated';

/**
 * Baseline rendered-output snapshot for the previews registry.
 *
 * Regression bar for the registry generator (#140 chain). Any divergence
 * from this snapshot represents a user-visible regression in preview
 * rendering — it is not a snapshot to update lightly.
 */
describe('previews registry baseline', () => {
  it('renders every entry (and variant) identically to the committed snapshot', async () => {
    const keys = Object.keys(registry).sort();
    const lines: string[] = [];

    for (const key of keys) {
      const entry = registry[key];
      lines.push(`# ${key}`);
      lines.push(renderToString(createElement(entry.defaultExport.component)));
      if (entry.exports.length > 1) {
        for (const exp of entry.exports) {
          if (exp.name === entry.defaultExport.name) continue;
          lines.push(`# ${key} :: ${exp.value}`);
          lines.push(renderToString(createElement(exp.component)));
        }
      }
    }

    await expect(lines.join('\n\n')).toMatchFileSnapshot('./baseline.snap');
  });
});
