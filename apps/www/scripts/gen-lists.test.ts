import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MissingEntryExportError, createSpecs, generateLists } from './gen-lists';

let root: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-lists-'));
  fs.mkdirSync(path.join(root, 'playground/entries'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs/content/components'), { recursive: true });
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function write(rel: string, contents = '') {
  fs.writeFileSync(path.join(root, rel), contents);
}

function entry(slug: string, exportName: string) {
  write(`playground/entries/${slug}.tsx`, `export const ${exportName} = {};\n`);
}

function run() {
  generateLists(createSpecs(root));
}

const indexPath = () => path.join(root, 'playground/entries/entries.generated.ts');
const metaPath = () => path.join(root, 'docs/content/components/meta.json');
const pages = () => JSON.parse(fs.readFileSync(metaPath(), 'utf-8')).pages;

describe('playground entries index', () => {
  it('imports and lists each entry, camel-casing multi-word slugs', () => {
    entry('button', 'buttonEntry');
    entry('alert-dialog', 'alertDialogEntry');
    run();
    const out = fs.readFileSync(indexPath(), 'utf-8');
    expect(out).toContain(`import { alertDialogEntry } from './alert-dialog';`);
    expect(out).toContain(`import { buttonEntry } from './button';`);
    expect(out.indexOf('  alertDialogEntry,')).toBeLessThan(out.indexOf('  buttonEntry,'));
  });

  it('excludes -render.tsx files', () => {
    entry('toggle', 'toggleEntry');
    write('playground/entries/toggle-render.tsx', 'export function ToggleRender() {}\n');
    run();
    expect(fs.readFileSync(indexPath(), 'utf-8')).not.toContain('toggle-render');
  });

  it('throws naming the file when the <camel>Entry export is missing', () => {
    entry('alert-dialog', 'wrongName');
    const file = path.join(root, 'playground/entries/alert-dialog.tsx');
    expect(run).toThrow(MissingEntryExportError);
    expect(run).toThrow(file);
    expect(run).toThrow('alertDialogEntry');
  });
});

describe('docs meta', () => {
  it('lists mdx slugs sorted, with button before button-group', () => {
    write('docs/content/components/button-group.mdx');
    write('docs/content/components/button.mdx');
    write('docs/content/components/accordion.mdx');
    run();
    expect(pages()).toEqual(['accordion', 'button', 'button-group']);
  });

  it('ignores non-mdx files and meta.json itself', () => {
    write('docs/content/components/button.mdx');
    write('docs/content/components/notes.md');
    write('docs/content/components/meta.json', '{"title":"Components","pages":["stale"]}');
    run();
    expect(pages()).toEqual(['button']);
  });
});
