import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkConventions } from './check-conventions';
import { createSpecs, generateLists } from './gen-lists';
import { parsePreviewsDir } from './gen-registry';
import {
  ARCHETYPES,
  ScaffoldError,
  parseArgs,
  scaffoldComponent,
  scaffoldDocs,
  type ArchetypeId,
  type ScaffoldArgs,
} from './scaffold';

const archetypeIds = Object.keys(ARCHETYPES) as ArchetypeId[];

function error(...argv: string[]) {
  const result = parseArgs(argv);
  if (result.ok) throw new Error(`expected a usage error for: ${argv.join(' ')}`);
  return result.error;
}

function args(...argv: string[]) {
  const result = parseArgs(argv);
  if (!result.ok) throw new Error(result.error);
  return result.args;
}

describe('parseArgs', () => {
  it('parses a component command into typed args', () => {
    expect(args('component', 'date-picker', 'Pick a date', 'solid, Soft', 'action')).toEqual({
      command: 'component',
      name: 'date-picker',
      description: 'Pick a date',
      variants: ['solid', 'soft'],
      archetype: 'action',
    });
  });

  it('parses a docs command into typed args', () => {
    expect(args('docs', 'badge', 'A badge', 'theme,icon-only')).toEqual({
      command: 'docs',
      name: 'badge',
      description: 'A badge',
      examples: ['theme', 'icon-only'],
    });
  });

  it('rejects a missing or unknown command', () => {
    expect(error()).toMatch(/Missing command/);
    expect(error('plop', 'a')).toMatch(/Unknown command "plop"/);
  });

  it.each([
    [['component'], 'name, description, variants, archetype'],
    [['component', 'foo'], 'description, variants, archetype'],
    [['component', 'foo', 'desc'], 'variants, archetype'],
    [['component', 'foo', 'desc', 'solid'], 'archetype'],
    [['component', 'foo', ' ', 'solid', 'action'], 'description'],
    [['docs'], 'name, description, examples'],
    [['docs', 'foo', 'desc'], 'examples'],
  ])('names the missing arguments for %j', (argv, missing) => {
    expect(error(...argv)).toBe(`Missing argument: ${missing}.`);
  });

  it('rejects extra arguments', () => {
    expect(error('component', 'foo', 'desc', 'solid', 'action', 'extra')).toMatch(/Too many/);
    expect(error('docs', 'foo', 'desc', 'a', 'b')).toMatch(/Too many/);
  });

  it('lists every valid archetype for an unknown one', () => {
    const message = error('component', 'foo', 'desc', 'solid', 'widget');
    expect(message).toMatch(/Unknown archetype "widget"/);
    for (const id of archetypeIds) expect(message).toContain(id);
    expect(archetypeIds).toHaveLength(9);
  });

  it('requires none for archetypes without variants and rejects it for the rest', () => {
    expect(args('component', 'foo', 'desc', 'none', 'layout')).toMatchObject({ variants: [] });
    expect(error('component', 'foo', 'desc', 'solid', 'layout')).toMatch(/must be "none"/);
    expect(error('component', 'foo', 'desc', 'none', 'action')).toMatch(/cannot be "none"/);
  });

  it('rejects bad names and variant lists', () => {
    expect(error('component', 'FooBar', 'desc', 'solid', 'action')).toMatch(/kebab-case/);
    expect(error('component', 'foo_bar', 'desc', 'solid', 'action')).toMatch(/kebab-case/);
    expect(error('component', '1foo', 'desc', 'solid', 'action')).toMatch(/kebab-case/);
    expect(error('component', 'foo', 'desc', 'Big Soft', 'action')).toMatch(/kebab-case/);
    expect(error('component', 'foo', 'desc', 'solid,solid', 'action')).toMatch(/twice/);
    expect(error('component', 'foo', 'desc', 'hero', 'action')).toMatch(/reserved/);
    expect(error('docs', 'foo', 'desc', 'hero')).toMatch(/reserved/);
  });
});

let root: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-'));
  for (const dir of ['registry/ui', 'docs/content/components', 'playground/entries', 'public/r']) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function componentArgs(archetype: ArchetypeId, name = 'zz-widget') {
  const variants = ARCHETYPES[archetype].hasVariants ? 'solid,on-soft' : 'none';
  return args('component', name, 'A test widget', variants, archetype) as Extract<
    ScaffoldArgs,
    { command: 'component' }
  >;
}

describe('scaffoldComponent', () => {
  it.each(archetypeIds)('%s passes the conventions check and the generators', (archetype) => {
    const input = componentArgs(archetype);
    const written = scaffoldComponent(root, input);
    fs.writeFileSync(path.join(root, 'public/r/zz-widget.json'), '{}');

    expect(written).toEqual(
      expect.arrayContaining([
        'registry/ui/zz-widget.tsx',
        'playground/entries/zz-widget.tsx',
        'docs/content/components/zz-widget.mdx',
        'docs/previews/zz-widget/zz-widget-hero.tsx',
      ])
    );
    expect(checkConventions(root, []).violations).toEqual([]);

    const previews = parsePreviewsDir(path.join(root, 'docs/previews'));
    expect(previews.map((p) => p.slug).sort()).toEqual(
      ['zz-widget-hero', ...input.variants.map((v) => `zz-widget-${v}`)].sort()
    );
    expect(previews.find((p) => p.slug === 'zz-widget-hero')?.defaultExport.name).toBe(
      'ZzWidgetHero'
    );

    generateLists(createSpecs(root));
    expect(
      fs.readFileSync(path.join(root, 'playground/entries/entries.generated.ts'), 'utf-8')
    ).toContain('zzWidgetEntry');
    expect(
      JSON.parse(fs.readFileSync(path.join(root, 'docs/content/components/meta.json'), 'utf-8'))
        .pages
    ).toEqual(['zz-widget']);
  });

  it('writes one preview per variant and lists them as docs examples', () => {
    const written = scaffoldComponent(root, componentArgs('action'));
    expect(written).toContain('docs/previews/zz-widget/zz-widget-on-soft.tsx');
    const preview = fs.readFileSync(
      path.join(root, 'docs/previews/zz-widget/zz-widget-on-soft.tsx'),
      'utf-8'
    );
    expect(preview).toContain('export default function ZzWidgetOnSoft');
    expect(preview).toContain('variant="on-soft"');
    const source = fs.readFileSync(path.join(root, 'registry/ui/zz-widget.tsx'), 'utf-8');
    expect(source).toContain("'on-soft': '',");
    expect(source).toContain("'solid': '',");
    const mdx = fs.readFileSync(path.join(root, 'docs/content/components/zz-widget.mdx'), 'utf-8');
    expect(mdx).toContain('<ComponentPreview name="zz-widget-on-soft" />');
  });

  it('omits the variants export and the examples section when there are no variants', () => {
    scaffoldComponent(root, componentArgs('layout'));
    expect(fs.readFileSync(path.join(root, 'registry/ui/zz-widget.tsx'), 'utf-8')).not.toContain(
      'Variants'
    );
    expect(
      fs.readFileSync(path.join(root, 'docs/content/components/zz-widget.mdx'), 'utf-8')
    ).not.toContain('## Examples');
  });

  it('refuses an existing registry file and writes nothing', () => {
    fs.writeFileSync(path.join(root, 'registry/ui/zz-widget.tsx'), 'export {};\n');
    expect(() => scaffoldComponent(root, componentArgs('action'))).toThrow(ScaffoldError);
    expect(fs.existsSync(path.join(root, 'playground/entries/zz-widget.tsx'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'registry/ui/zz-widget.tsx'), 'utf-8')).toBe(
      'export {};\n'
    );
  });

  it('refuses when a docs file already exists and writes nothing', () => {
    fs.writeFileSync(path.join(root, 'docs/content/components/zz-widget.mdx'), 'mine\n');
    expect(() => scaffoldComponent(root, componentArgs('action'))).toThrow(/already exists/);
    expect(fs.existsSync(path.join(root, 'registry/ui/zz-widget.tsx'))).toBe(false);
  });
});

describe('scaffoldDocs', () => {
  const docsArgs = () =>
    args('docs', 'zz-widget', 'A test widget', 'theme,icon-only') as Extract<
      ScaffoldArgs,
      { command: 'docs' }
    >;

  it('writes the page and previews, skipping files that exist', () => {
    fs.writeFileSync(path.join(root, 'docs/content/components/zz-widget.mdx'), 'mine\n');
    const written = scaffoldDocs(root, docsArgs());
    expect(written).toEqual([
      'docs/previews/zz-widget/zz-widget-hero.tsx',
      'docs/previews/zz-widget/zz-widget-theme.tsx',
      'docs/previews/zz-widget/zz-widget-icon-only.tsx',
    ]);
    expect(fs.readFileSync(path.join(root, 'docs/content/components/zz-widget.mdx'), 'utf-8')).toBe(
      'mine\n'
    );
    expect(parsePreviewsDir(path.join(root, 'docs/previews'))).toHaveLength(3);
  });
});
