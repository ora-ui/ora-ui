import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parsePreviewFile } from './gen-registry';

let tmpRoot: string;

beforeEach(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-registry-'));
});

afterEach(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

function writeFixture(rel: string, contents: string): string {
  const full = path.join(tmpRoot, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
  return full;
}

describe('parsePreviewFile — shape', () => {
  it('returns PreviewEntry with declaration order preserved', () => {
    const file = writeFixture(
      'button/button-variants.tsx',
      [
        `import { Button } from '@/registry/ui/button';`,
        ``,
        `export function ButtonSolid() {`,
        `  return <Button variant="solid">x</Button>;`,
        `}`,
        ``,
        `export function ButtonOutline() {`,
        `  return <Button variant="outline">x</Button>;`,
        `}`,
        ``,
        `export default ButtonSolid;`,
        ``,
      ].join('\n')
    );

    const entry = parsePreviewFile(file);

    expect(entry.slug).toBe('button-variants');
    expect(entry.exports.map((e) => e.name)).toEqual(['ButtonSolid', 'ButtonOutline']);
    expect(entry.exports.map((e) => e.value)).toEqual(['solid', 'outline']);
    expect(entry.exports.map((e) => e.label)).toEqual(['Solid', 'Outline']);
    expect(entry.defaultExport.name).toBe('ButtonSolid');
    expect(entry.source).toContain('ButtonOutline');
  });
});
