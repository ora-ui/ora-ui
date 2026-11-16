import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

/* The one place archetypes are known. `reference` is the registry/ui file the template is stripped from. */
export const ARCHETYPES = {
  action: { reference: 'button', hasVariants: true },
  'selection-control': { reference: 'checkbox', hasVariants: true },
  'text-field': { reference: 'input', hasVariants: true },
  'list-popup': { reference: 'select', hasVariants: true },
  'plain-overlay': { reference: 'dialog', hasVariants: false },
  group: { reference: 'toggle-group', hasVariants: true },
  disclosure: { reference: 'accordion', hasVariants: true },
  'status-display': { reference: 'badge', hasVariants: true },
  layout: { reference: 'separator', hasVariants: false },
} as const satisfies Record<string, { reference: string; hasVariants: boolean }>;

export type ArchetypeId = keyof typeof ARCHETYPES;

export type ScaffoldArgs =
  | {
      command: 'component';
      name: string;
      description: string;
      variants: string[];
      archetype: ArchetypeId;
    }
  | { command: 'docs'; name: string; description: string; examples: string[] };

export type ParseResult = { ok: true; args: ScaffoldArgs } | { ok: false; error: string };

export class ScaffoldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScaffoldError';
  }
}

const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as ArchetypeId[];

export const USAGE = `Usage:
  pnpm --filter www scaffold component <name> "<description>" "<variants|none>" <archetype>
  pnpm --filter www scaffold docs <name> "<description>" "<example1,example2>"

Every argument is required.
  component  creates a new component: registry file, playground entry, docs page and previews.
  docs       creates the docs page and previews for an existing component.
  <name>     kebab-case, e.g. date-picker
  <variants> comma-separated values of the variant prop, or "none" (only for archetypes without variants)
  <archetype> one of: ${ARCHETYPE_IDS.join(', ')}`;

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pascalCase = (slug: string) => slug.split('-').map(capitalize).join('');
const camelCase = (slug: string) => slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const sentenceCase = (slug: string) => slug.split('-').map(capitalize).join(' ');

function parseList(raw: string, what: string): string[] | string {
  const values = raw
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  if (values.length === 0) return `${what} is empty`;
  const bad = values.find((v) => !KEBAB.test(v));
  if (bad) return `${what} "${bad}" must be kebab-case`;
  if (values.includes('hero')) return `${what} "hero" is reserved for the hero preview`;
  const dupe = values.find((v, i) => values.indexOf(v) !== i);
  if (dupe) return `${what} "${dupe}" is listed twice`;
  return values;
}

const fail = (error: string): ParseResult => ({ ok: false, error });

export function parseArgs(argv: string[]): ParseResult {
  const [command, ...rest] = argv;
  if (command !== 'component' && command !== 'docs') {
    return fail(command ? `Unknown command "${command}".` : 'Missing command.');
  }
  const labels =
    command === 'component'
      ? ['name', 'description', 'variants', 'archetype']
      : ['name', 'description', 'examples'];
  const missing = labels.filter((_, i) => !rest[i]?.trim());
  if (missing.length > 0) return fail(`Missing argument: ${missing.join(', ')}.`);
  if (rest.length > labels.length) {
    return fail(`Too many arguments: expected ${labels.length}, got ${rest.length}.`);
  }

  const name = rest[0].trim();
  if (!KEBAB.test(name)) return fail(`Name "${name}" must be kebab-case, e.g. date-picker.`);
  if (name.endsWith('-render')) {
    return fail(`Name "${name}" cannot end in -render. gen-lists skips those playground files.`);
  }
  const description = rest[1].trim();

  if (command === 'docs') {
    const examples = parseList(rest[2], 'Example');
    if (typeof examples === 'string') return fail(`${examples}.`);
    return { ok: true, args: { command, name, description, examples } };
  }

  const archetype = rest[3].trim();
  if (!Object.hasOwn(ARCHETYPES, archetype)) {
    return fail(`Unknown archetype "${archetype}". Valid archetypes: ${ARCHETYPE_IDS.join(', ')}.`);
  }
  const id = archetype as ArchetypeId;
  const none = rest[2].trim().toLowerCase() === 'none';
  if (ARCHETYPES[id].hasVariants) {
    if (none) return fail(`Archetype ${id} has variants, so variants cannot be "none".`);
    const variants = parseList(rest[2], 'Variant');
    if (typeof variants === 'string') return fail(`${variants}.`);
    return { ok: true, args: { command, name, description, variants, archetype: id } };
  }
  if (!none) {
    return fail(`Archetype ${id} has no variants, so variants must be "none".`);
  }
  return { ok: true, args: { command, name, description, variants: [], archetype: id } };
}

const TEMPLATES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates');
const handlebars = Handlebars.create();

function render(templateFile: string, context: object): string {
  const source = fs.readFileSync(path.join(TEMPLATES, templateFile), 'utf-8');
  return handlebars.compile(source, { noEscape: true })(context);
}

function item(value: string) {
  return { value, Pascal: pascalCase(value), Sentence: sentenceCase(value) };
}

function baseContext(name: string, description: string) {
  return {
    name,
    Name: pascalCase(name),
    camel: camelCase(name),
    Sentence: sentenceCase(name),
    description,
    descriptionYaml: JSON.stringify(description),
  };
}

type Output = { file: string; contents: string };

function writeAll(wwwRoot: string, outputs: Output[], { skipExisting }: { skipExisting: boolean }) {
  const exists = (file: string) => fs.existsSync(path.join(wwwRoot, file));
  const clash = outputs.find((o) => exists(o.file));
  if (clash && !skipExisting) {
    throw new ScaffoldError(`${clash.file} already exists. Nothing was written.`);
  }
  const fresh = outputs.filter((o) => !exists(o.file));
  for (const { file, contents } of fresh) {
    const abs = path.join(wwwRoot, file);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contents);
  }
  return fresh.map((o) => o.file);
}

/* Docs page and previews for an existing component. Files that already exist are left alone. */
export function scaffoldDocs(
  wwwRoot: string,
  args: Extract<ScaffoldArgs, { command: 'docs' }>
): string[] {
  const { name, description, examples } = args;
  const ctx = { ...baseContext(name, description), examples: examples.map(item) };
  const outputs: Output[] = [
    {
      file: `docs/previews/${name}/${name}-hero.tsx`,
      contents: render('docs/preview-hero.tsx.hbs', ctx),
    },
    {
      file: `docs/content/components/${name}.mdx`,
      contents: render('docs/component.mdx.hbs', ctx),
    },
    ...examples.map((example) => ({
      file: `docs/previews/${name}/${name}-${example}.tsx`,
      contents: render('docs/preview.tsx.hbs', { ...ctx, ...item(example) }),
    })),
  ];
  return writeAll(wwwRoot, outputs, { skipExisting: true });
}

/* A new component's registry file, playground entry, docs page and previews. Refuses to overwrite anything. */
export function scaffoldComponent(
  wwwRoot: string,
  args: Extract<ScaffoldArgs, { command: 'component' }>
): string[] {
  const { name, description, variants, archetype } = args;
  const base = baseContext(name, description);
  const ctx = {
    ...base,
    hasVariants: variants.length > 0,
    variants: variants.map(item),
    defaultVariant: variants[0] ?? '',
    variantList: variants.map((v) => `'${v}'`).join(', '),
    variantUnion: variants.map((v) => `'${v}'`).join(' | '),
  };
  const dir = `archetypes/${archetype}`;
  const preview = (fn: string, variant?: string) =>
    render(`${dir}/preview.tsx.hbs`, { ...ctx, fn, variant });

  const outputs: Output[] = [
    { file: `registry/ui/${name}.tsx`, contents: render(`${dir}/component.tsx.hbs`, ctx) },
    { file: `playground/entries/${name}.tsx`, contents: render(`${dir}/entry.tsx.hbs`, ctx) },
    {
      file: `docs/content/components/${name}.mdx`,
      contents: render('docs/component.mdx.hbs', { ...base, examples: variants.map(item) }),
    },
    {
      file: `docs/previews/${name}/${name}-hero.tsx`,
      contents: preview(`${base.Name}Hero`),
    },
    ...variants.map((variant) => ({
      file: `docs/previews/${name}/${name}-${variant}.tsx`,
      contents: preview(`${base.Name}${pascalCase(variant)}`, variant),
    })),
  ];
  return writeAll(wwwRoot, outputs, { skipExisting: false });
}
