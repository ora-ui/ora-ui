import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkConventions, formatFixed, formatViolation, violationKey } from './check-conventions';

let root: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'check-conventions-'));
  for (const dir of ['registry/ui', 'docs/content/components', 'playground/entries', 'public/r']) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function write(rel: string, contents = '') {
  fs.writeFileSync(path.join(root, rel), contents);
}

function component(slug: string, source: string) {
  write(`registry/ui/${slug}.tsx`, source);
  write(`docs/content/components/${slug}.mdx`);
  write(`playground/entries/${slug}.tsx`);
  write(`public/r/${slug}.json`, '{}');
}

const conforming = `
type Theme = 'gray' | 'accent' | (string & {});
function Chip({ theme = 'gray', ...props }: { theme?: Theme }) {
  return <span data-slot="chip" data-theme={theme !== 'gray' ? theme : undefined} {...props} />;
}
function ChipToggle({ theme = 'gray', pressed }: { theme?: Theme; pressed?: boolean }) {
  return <button data-slot="chip-toggle" data-theme={theme !== 'gray' && pressed ? theme : undefined} />;
}
function ChipProvider({ children }: { children: React.ReactNode }) {
  return <ChipContext.Provider value={{}}>{children}</ChipContext.Provider>;
}
export { Chip, ChipToggle, ChipProvider };
`;

const keys = (baseline: string[] = []) => checkConventions(root, baseline).added.map(violationKey);

describe('check-conventions', () => {
  it('passes a component that follows every rule', () => {
    component('chip', conforming);
    expect(checkConventions(root, [])).toMatchObject({ added: [], fixed: [] });
  });

  it('flags an exported part that renders without a data-slot', () => {
    component('chip', `export function ChipText() { return <span />; }`);
    expect(keys()).toEqual(['chip:data-slot:ChipText']);
  });

  it('flags data-theme set without the documented formula', () => {
    component(
      'chip',
      `export function Chip({ v }) { return <span data-slot="chip" data-theme={v === 'x' ? 'x' : undefined} />; }`
    );
    expect(keys()).toEqual(['chip:theme-formula:Chip']);
  });

  it('flags a theme prop typed as a closed union', () => {
    component(
      'chip',
      `type Theme = 'gray' | 'accent';
       export function Chip({ theme }: { theme?: Theme }) { return <span data-slot="chip" />; }`
    );
    expect(keys()).toEqual(['chip:theme-open']);
  });

  it('flags a theme that only comes from a cva variant', () => {
    component(
      'chip',
      `const chipVariants = cva('', { variants: { theme: { gray: '', accent: '' } } });
       export function Chip() { return <span data-slot="chip" />; }`
    );
    expect(keys()).toEqual(['chip:theme-open']);
  });

  it('flags a missing docs page, playground entry and install file', () => {
    write('registry/ui/chip.tsx', conforming);
    expect(keys()).toEqual(['chip:docs-page', 'chip:playground-entry', 'chip:install-file']);
  });

  it('names the component, the rule, the fix and the archetypes.md section', () => {
    write('registry/ui/chip.tsx', `export function ChipText() { return <span />; }`);
    const messages = checkConventions(root, []).added.map(formatViolation);
    expect(messages[0]).toBe(
      [
        'chip: ChipText renders without a data-slot [chip:data-slot:ChipText]',
        '  fix: set data-slot="chip" (root) or "chip-<part>" on the element ChipText renders',
        '  see: docs/patterns/archetypes.md#data-attributes',
      ].join('\n')
    );
    expect(messages[1]).toContain('apps/www/docs/content/components/chip.mdx');
    expect(messages[1]).toContain(
      'docs/patterns/archetypes.md#docs-page-playground-entry-and-install-file'
    );
  });

  it('lets a baselined violation through', () => {
    component('chip', `export function ChipText() { return <span />; }`);
    expect(checkConventions(root, ['chip:data-slot:ChipText'])).toMatchObject({
      added: [],
      fixed: [],
    });
  });

  it('flags a second break under a key the baseline already holds once', () => {
    component(
      'chip',
      `export function Chip({ v }) {
         return <span data-slot="chip" data-theme={v ? 'a' : undefined}><i data-theme={v ? 'b' : undefined} /></span>;
       }`
    );
    expect(keys(['chip:theme-formula:Chip'])).toEqual(['chip:theme-formula:Chip']);
  });

  it('keys a break by its top-level component, not a nested const', () => {
    component(
      'chip',
      `export function Chip({ v }) {
         const props = { 'data-theme': v ? 'a' : undefined };
         return <span data-slot="chip" {...props} />;
       }`
    );
    expect(keys()).toEqual(['chip:theme-formula:Chip']);
  });

  it('reports a baselined violation that has been fixed, so the baseline only shrinks', () => {
    component('chip', conforming);
    const { fixed } = checkConventions(root, ['chip:data-slot:ChipText']);
    expect(fixed).toEqual(['chip:data-slot:ChipText']);
    expect(formatFixed(fixed[0])).toContain('Delete that entry');
  });
});

describe('the registry', () => {
  it('passes with the checked-in baseline', () => {
    expect(checkConventions(path.resolve(__dirname, '..'))).toMatchObject({
      added: [],
      fixed: [],
    });
  });
});
