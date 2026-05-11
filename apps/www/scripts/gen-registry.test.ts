import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NamingViolationError, generate, generateToMemory, parsePreviewFile } from './gen-registry';

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

describe('parsePreviewFile — snippet extraction', () => {
  it('snippet for ButtonSolid contains its own body and excludes ButtonOutline body', () => {
    const file = writeFixture(
      'button/button-variants.tsx',
      [
        `import { Button } from '@/registry/ui/button';`,
        ``,
        `export function ButtonSolid() {`,
        `  return <Button variant="solid">Sign up</Button>;`,
        `}`,
        ``,
        `export function ButtonOutline() {`,
        `  return <Button variant="outline">Sign up</Button>;`,
        `}`,
        ``,
        `export default ButtonSolid;`,
        ``,
      ].join('\n')
    );

    const entry = parsePreviewFile(file);
    const solid = entry.exports.find((e) => e.name === 'ButtonSolid')!;
    expect(solid.snippet).toContain('variant="solid"');
    expect(solid.snippet).not.toContain('variant="outline"');
    expect(solid.snippet.startsWith('export function ButtonSolid')).toBe(true);
  });
});

describe('parsePreviewFile — kebab-case value', () => {
  it('converts multi-word PascalCase suffixes to kebab-case (ButtonIconSm → icon-sm, ButtonSm → sm)', () => {
    const file = writeFixture(
      'button/button-sizes.tsx',
      [
        `import { Button } from '@/registry/ui/button';`,
        ``,
        `export function ButtonIconSm() {`,
        `  return <Button size="icon-sm">x</Button>;`,
        `}`,
        ``,
        `export function ButtonSm() {`,
        `  return <Button size="sm">x</Button>;`,
        `}`,
        ``,
        `export default ButtonSm;`,
        ``,
      ].join('\n')
    );

    const entry = parsePreviewFile(file);
    const byName = Object.fromEntries(entry.exports.map((e) => [e.name, e.value]));
    expect(byName.ButtonIconSm).toBe('icon-sm');
    expect(byName.ButtonSm).toBe('sm');
  });
});

describe('parsePreviewFile — naming validation', () => {
  it('throws NamingViolationError with file:line and expected prefix when an export does not start with DirPascal', () => {
    const file = writeFixture(
      'button/button-bad.tsx',
      [
        `import { Button } from '@/registry/ui/button';`,
        ``,
        `export function CoolThing() {`,
        `  return <Button>x</Button>;`,
        `}`,
        ``,
        `export default CoolThing;`,
        ``,
      ].join('\n')
    );

    let caught: unknown;
    try {
      parsePreviewFile(file);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(NamingViolationError);
    const err = caught as NamingViolationError;
    expect(err.file).toBe(file);
    expect(err.line).toBe(3);
    expect(err.actual).toBe('CoolThing');
    expect(err.expectedPrefix).toBe('Button');
    expect(err.message).toContain(`${file}:3`);
    expect(err.message).toContain('Button');
  });
});

const PREVIEW_FIXTURE = [
  `import { Button } from '@/registry/ui/button';`,
  ``,
  `export function ButtonSolid() {`,
  `  return <Button variant="solid">Sign up</Button>;`,
  `}`,
  ``,
  `export default ButtonSolid;`,
  ``,
].join('\n');

const UI_FIXTURE = `export function Button() { return null; }\n`;

function setupGenFixture() {
  const previewsDir = path.join(tmpRoot, 'previews');
  const uiDir = path.join(tmpRoot, 'ui');
  const registryOut = path.join(tmpRoot, 'registry.generated.ts');
  const sourcesOut = path.join(tmpRoot, 'sources.generated.ts');
  fs.mkdirSync(path.join(previewsDir, 'button'), { recursive: true });
  fs.mkdirSync(uiDir, { recursive: true });
  fs.writeFileSync(path.join(previewsDir, 'button', 'button-default.tsx'), PREVIEW_FIXTURE);
  fs.writeFileSync(path.join(uiDir, 'button.tsx'), UI_FIXTURE);
  return { previewsDir, uiDir, registryOut, sourcesOut };
}

describe('drift round-trip', () => {
  it('generate then generateToMemory matches on-disk (no drift)', () => {
    const opts = setupGenFixture();
    generate(opts);
    const memory = generateToMemory(opts);
    expect(fs.readFileSync(opts.registryOut, 'utf-8')).toBe(memory.registry);
    expect(fs.readFileSync(opts.sourcesOut, 'utf-8')).toBe(memory.sources);
  });

  it('generateToMemory differs from on-disk after preview file changes (drift)', () => {
    const opts = setupGenFixture();
    generate(opts);

    // mutate the preview file after generation
    const previewFile = path.join(opts.previewsDir, 'button', 'button-default.tsx');
    fs.writeFileSync(
      previewFile,
      [
        `import { Button } from '@/registry/ui/button';`,
        ``,
        `export function ButtonSolid() {`,
        `  return <Button variant="outline">Changed</Button>;`,
        `}`,
        ``,
        `export default ButtonSolid;`,
        ``,
      ].join('\n')
    );

    const memory = generateToMemory(opts);
    const onDisk = fs.readFileSync(opts.registryOut, 'utf-8');
    expect(onDisk).not.toBe(memory.registry);
  });
});

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
