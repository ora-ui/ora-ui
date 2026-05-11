import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';

vi.mock('@/docs/previews/registry.generated', () => ({
  registry: {
    'button-variants': {
      slug: 'button-variants',
      defaultExport: {
        name: 'ButtonSolid',
        value: 'solid',
        label: 'Solid',
        component: () => React.createElement('div', null, 'Solid button'),
        snippet: 'export function ButtonSolid() { return <Button variant="solid" />; }',
      },
      exports: [
        {
          name: 'ButtonSolid',
          value: 'solid',
          label: 'Solid',
          component: () => React.createElement('div', null, 'Solid button'),
          snippet: 'export function ButtonSolid() { return <Button variant="solid" />; }',
        },
        {
          name: 'ButtonOutline',
          value: 'outline',
          label: 'Outline',
          component: () => React.createElement('div', null, 'Outline button'),
          snippet: 'export function ButtonOutline() { return <Button variant="outline" />; }',
        },
      ],
      source: '// full source',
    },
  },
}));

vi.mock('fumadocs-core/highlight', () => ({
  highlight: vi.fn().mockResolvedValue(React.createElement('span', null, 'highlighted')),
}));

let capturedProps: Record<string, unknown> = {};
vi.mock('./component-preview-client', () => ({
  ComponentPreviewClient: (props: Record<string, unknown>) => {
    capturedProps = props;
    return React.createElement('div', null, 'mock-client');
  },
}));

const { ComponentPreview } = await import('./component-preview');

describe('ComponentPreview D-tests (#159)', () => {
  beforeEach(() => {
    capturedProps = {};
  });

  it('implicit (no select) renders all exports in declaration order', async () => {
    const el = await ComponentPreview({ name: 'button-variants' });
    renderToString(el as React.ReactElement);
    const variants = capturedProps.variants as Array<{ value: string }>;
    expect(variants).toHaveLength(2);
    expect(variants[0].value).toBe('solid');
    expect(variants[1].value).toBe('outline');
  });

  it('explicit select={["solid"]} renders only that variant', async () => {
    const el = await ComponentPreview({ name: 'button-variants', select: ['solid'] });
    renderToString(el as React.ReactElement);
    const variants = capturedProps.variants as Array<{ value: string }>;
    expect(variants).toHaveLength(1);
    expect(variants[0].value).toBe('solid');
  });

  it('relabelled select={[{ value: "solid", label: "Primary" }]} shows custom label', async () => {
    const el = await ComponentPreview({
      name: 'button-variants',
      select: [{ value: 'solid', label: 'Primary' }],
    });
    renderToString(el as React.ReactElement);
    const variants = capturedProps.variants as Array<{ value: string; label: string }>;
    expect(variants).toHaveLength(1);
    expect(variants[0].label).toBe('Primary');
  });
});
