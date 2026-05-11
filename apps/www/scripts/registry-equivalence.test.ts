import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { registry as generated } from '../docs/previews/registry.generated';
import { registry as legacy } from '../docs/previews/registry.legacy';

describe('registry equivalence', () => {
  it('identical slug sets', () => {
    expect(Object.keys(generated).sort()).toEqual(Object.keys(legacy).sort());
  });

  it('identical variant value sets per entry', () => {
    for (const [slug, legacyEntry] of Object.entries(legacy)) {
      const genEntry = generated[slug];
      const legacyVariantKeys = Object.keys(legacyEntry.variants ?? {}).sort();
      const genExportValues = genEntry.exports.map((e) => e.value).sort();

      if (legacyVariantKeys.length > 0) {
        expect(genExportValues, `${slug}: variant values`).toEqual(legacyVariantKeys);
      } else {
        expect(genEntry.exports, `${slug}: single-export entry`).toHaveLength(1);
      }
    }
  });

  it('identical rendered HTML for each component ref', () => {
    for (const [slug, legacyEntry] of Object.entries(legacy)) {
      const genEntry = generated[slug];

      const legacyHtml = renderToString(createElement(legacyEntry.component));
      const genHtml = renderToString(createElement(genEntry.defaultExport.component));
      expect(genHtml, `${slug}: default component`).toBe(legacyHtml);

      if (legacyEntry.variants) {
        for (const [variantKey, VariantComp] of Object.entries(legacyEntry.variants)) {
          const genExport = genEntry.exports.find((e) => e.value === variantKey);
          const legacyVariantHtml = renderToString(createElement(VariantComp));
          const genVariantHtml = renderToString(createElement(genExport!.component));
          expect(genVariantHtml, `${slug} :: ${variantKey}`).toBe(legacyVariantHtml);
        }
      }
    }
  });
});
