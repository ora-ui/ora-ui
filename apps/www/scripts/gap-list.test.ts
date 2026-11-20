import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { listPrimitives, registryImports } from './base-ui-primitives';
import { formatGapList, gapList } from './gap-list';

const realRoot = path.resolve(__dirname, '..');
const subpaths = (list: { subpath: string }[]) => list.map((p) => p.subpath);

describe('gap list on a fixture registry', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'gap-list-'));
    fs.mkdirSync(path.join(root, 'registry/ui'), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  const component = (file: string, source: string) =>
    fs.writeFileSync(path.join(root, 'registry/ui', file), source);

  it('leaves out a primitive the registry imports, and lists one it does not', async () => {
    component('button.tsx', `import { Button } from '@base-ui/react/button';\n`);
    const gap = subpaths(await gapList(root));
    expect(gap).not.toContain('button');
    expect(gap).toContain('progress');
  });

  it('lists a primitive again once its import is removed', async () => {
    component('progress.tsx', `import { Progress } from '@base-ui/react/progress';\n`);
    expect(subpaths(await gapList(root))).not.toContain('progress');
    component('progress.tsx', `export {};\n`);
    expect(subpaths(await gapList(root))).toContain('progress');
  });

  it('never lists providers, utilities, types or internals', async () => {
    const gap = subpaths(await gapList(root));
    for (const nonComponent of [
      'csp-provider',
      'direction-provider',
      'merge-props',
      'use-render',
      'types',
      'unstable-use-media-query',
    ]) {
      expect(gap).not.toContain(nonComponent);
    }
    expect(gap.some((s) => s.startsWith('internals/'))).toBe(false);
  });

  it('reports the part exports of each primitive', async () => {
    const progress = (await gapList(root)).find((p) => p.subpath === 'progress');
    expect(progress?.parts).toEqual(
      expect.arrayContaining(['Root', 'Track', 'Indicator', 'Label', 'Value'])
    );
  });

  it('prints one line per primitive', async () => {
    const gap = await gapList(root);
    expect(formatGapList(gap).split('\n')).toHaveLength(gap.length);
  });
});

describe('gap list on the current tree', () => {
  it('equals the package component exports minus the registry imports', async () => {
    const { exports } = createRequire(import.meta.url)('@base-ui/react/package.json') as {
      exports: Record<string, unknown>;
    };
    const exported = Object.keys(exports).map((k) => k.slice(2));
    const imported = registryImports(realRoot);
    const gap = subpaths(await gapList(realRoot));

    expect(gap.length).toBeGreaterThan(0);
    for (const subpath of gap) {
      expect(exported).toContain(subpath);
      expect(imported.has(subpath)).toBe(false);
    }
    const components = subpaths(await listPrimitives());
    expect(gap).toEqual(components.filter((s) => !imported.has(s)));
  });
});
