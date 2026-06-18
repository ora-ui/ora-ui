import fs from 'fs';
import path from 'path';
import ts from 'typescript';

export interface ExportMeta {
  name: string;
  value: string;
  label: string;
  snippet: string;
  /** True when the only declaration of this export is `export default function X()`. */
  defaultOnly: boolean;
}

export interface PreviewEntry {
  slug: string;
  defaultExport: ExportMeta;
  exports: ExportMeta[];
  source: string;
}

export class NamingViolationError extends Error {
  constructor(
    public file: string,
    public line: number,
    public actual: string,
    public expectedPrefix: string
  ) {
    super(
      `${file}:${line} — exported function \`${actual}\` does not start with expected prefix \`${expectedPrefix}\``
    );
    this.name = 'NamingViolationError';
  }
}

function dirToPascal(dirName: string): string {
  return dirName
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

// Second clause handles acronym boundaries: URLParser → url-parser (not urlparser)
function pascalToKebab(pascal: string): string {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// Second clause handles acronym boundaries: URLParser → URL Parser (not URLParser)
function splitPascal(pascal: string): string {
  return pascal.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

interface NamedFn {
  name: string;
  start: number;
  end: number;
  line: number;
  /** True when this is `export default function X()` (no separate named export). */
  defaultOnly: boolean;
}

/**
 * Handles two default-export shapes:
 * - `export default function X() {}` — populates defaultName from the fn declaration
 * - `export default X` (assignment, X is a separately-declared exported fn) — populates defaultName from the identifier
 */
function collectExports(sourceFile: ts.SourceFile): {
  named: NamedFn[];
  defaultName: string | null;
} {
  const named: NamedFn[] = [];
  let defaultName: string | null = null;

  for (const stmt of sourceFile.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      const isExport = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      const isDefault = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      if (isExport) {
        const name = stmt.name.text;
        const { line } = sourceFile.getLineAndCharacterOfPosition(stmt.getStart(sourceFile));
        named.push({
          name,
          start: stmt.getStart(sourceFile),
          end: stmt.getEnd(),
          line: line + 1,
          defaultOnly: !!isDefault,
        });
        if (isDefault) defaultName = name;
      }
    } else if (ts.isExportAssignment(stmt) && !stmt.isExportEquals) {
      if (ts.isIdentifier(stmt.expression)) {
        defaultName = stmt.expression.text;
      }
    }
  }

  return { named, defaultName };
}

/**
 * Enforces three invariants:
 * 1. At least one named export starting with `<DirPascal>` prefix
 * 2. A default export must exist
 * 3. The default export must resolve to one of the named exports
 * Each invariant throws on violation.
 */
export function parsePreviewFile(filePath: string): PreviewEntry {
  const source = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const slug = fileName.replace(/\.tsx?$/, '');
  const dirName = path.basename(path.dirname(filePath));
  const dirPascal = dirToPascal(dirName);

  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const { named, defaultName } = collectExports(sourceFile);

  if (named.length === 0) {
    throw new Error(
      `${filePath}:1 — no exported functions found; expected at least one named export starting with \`${dirPascal}\``
    );
  }

  for (const fn of named) {
    if (!fn.name.startsWith(dirPascal)) {
      throw new NamingViolationError(filePath, fn.line, fn.name, dirPascal);
    }
  }

  const exports: ExportMeta[] = named.map((fn) => {
    const suffix = fn.name.slice(dirPascal.length);
    return {
      name: fn.name,
      value: pascalToKebab(suffix),
      label: splitPascal(suffix),
      snippet: source.slice(fn.start, fn.end),
      defaultOnly: fn.defaultOnly,
    };
  });

  if (!defaultName) {
    throw new Error(
      `${filePath}:1 — missing default export; expected one of: ${named.map((f) => f.name).join(', ')}`
    );
  }

  const defaultExport = exports.find((e) => e.name === defaultName);
  if (!defaultExport) {
    throw new Error(
      `${filePath}:1 — default export \`${defaultName}\` does not match any named export`
    );
  }

  return { slug, defaultExport, exports, source };
}

interface ParsedPreview extends PreviewEntry {
  componentDir: string;
}

function slugToPascal(slug: string): string {
  return slug
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

export function parsePreviewsDir(previewsDir: string): ParsedPreview[] {
  const entries: ParsedPreview[] = [];
  const subdirs = fs
    .readdirSync(previewsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const componentDir of subdirs) {
    const dirPath = path.join(previewsDir, componentDir);
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith('.tsx'))
      .sort();
    for (const file of files) {
      const parsed = parsePreviewFile(path.join(dirPath, file));
      entries.push({ ...parsed, componentDir });
    }
  }
  return entries;
}

const GENERATED_HEADER =
  '// AUTO-GENERATED by scripts/gen-registry.ts — do not edit by hand.\n// Run `pnpm gen:registry` to regenerate.\n';

export function renderRegistryModule(entries: ParsedPreview[]): string {
  const importLines: string[] = [];
  const entryLines: string[] = [];

  function componentRef(moduleAlias: string, e: ExportMeta): string {
    return e.defaultOnly ? `${moduleAlias}.default` : `${moduleAlias}.${e.name}`;
  }

  for (const entry of entries) {
    const moduleAlias = `${slugToPascal(entry.slug)}Module`;
    importLines.push(`import * as ${moduleAlias} from './${entry.componentDir}/${entry.slug}';`);

    const exportLines = entry.exports.map((e) => {
      return `    { name: ${JSON.stringify(e.name)}, value: ${JSON.stringify(e.value)}, label: ${JSON.stringify(e.label)}, component: ${componentRef(moduleAlias, e)}, snippet: ${JSON.stringify(e.snippet)} },`;
    });

    entryLines.push(
      `  ${JSON.stringify(entry.slug)}: {
    slug: ${JSON.stringify(entry.slug)},
    defaultExport: { name: ${JSON.stringify(entry.defaultExport.name)}, value: ${JSON.stringify(entry.defaultExport.value)}, label: ${JSON.stringify(entry.defaultExport.label)}, component: ${componentRef(moduleAlias, entry.defaultExport)}, snippet: ${JSON.stringify(entry.defaultExport.snippet)} },
    exports: [
${exportLines.join('\n')}
    ],
    source: ${JSON.stringify(entry.source)},
  },`
    );
  }

  return `${GENERATED_HEADER}
import type React from 'react';

${importLines.join('\n')}

export interface PreviewExport {
  name: string;
  value: string;
  label: string;
  component: React.ComponentType;
  snippet: string;
}

export interface PreviewEntry {
  slug: string;
  defaultExport: PreviewExport;
  exports: PreviewExport[];
  source: string;
}

export const registry: Record<string, PreviewEntry> = {
${entryLines.join('\n')}
};
`;
}

export function renderSourcesModule(sources: Record<string, string>): string {
  const keys = Object.keys(sources).sort();
  const lines = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(sources[k])},`);
  return `${GENERATED_HEADER}
const sources: Record<string, string> = {
${lines.join('\n')}
};

export default sources;
`;
}

export function readUiSources(uiDir: string): Record<string, string> {
  const files = fs
    .readdirSync(uiDir)
    .filter((f) => f.endsWith('.tsx'))
    .sort();
  const out: Record<string, string> = {};
  for (const file of files) {
    const key = file.replace(/\.tsx$/, '');
    out[key] = fs.readFileSync(path.join(uiDir, file), 'utf-8');
  }
  return out;
}

export interface GenerateOptions {
  previewsDir: string;
  uiDir: string;
  registryOut: string;
  sourcesOut: string;
}

export function generate(opts: GenerateOptions): void {
  const entries = parsePreviewsDir(opts.previewsDir);
  const sources = readUiSources(opts.uiDir);
  fs.writeFileSync(opts.registryOut, renderRegistryModule(entries));
  fs.writeFileSync(opts.sourcesOut, renderSourcesModule(sources));
}

export interface GeneratedOutput {
  registry: string;
  sources: string;
}

export function generateToMemory(opts: GenerateOptions): GeneratedOutput {
  const entries = parsePreviewsDir(opts.previewsDir);
  const sources = readUiSources(opts.uiDir);
  return {
    registry: renderRegistryModule(entries),
    sources: renderSourcesModule(sources),
  };
}
