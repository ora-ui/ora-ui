import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

export interface Primitive {
  subpath: string;
  exportName: string;
  parts: string[];
}

const IMPORT_PATTERN = /from\s+['"]@base-ui\/react\/([\w-]+)['"]/g;

const normalize = (s: string) => s.replace(/-/g, '').toLowerCase();

export function packageSubpaths(): string[] {
  const require = createRequire(import.meta.url);
  const { exports } = require('@base-ui/react/package.json') as {
    exports: Record<string, unknown>;
  };
  return Object.keys(exports)
    .filter((key) => key.startsWith('./') && !key.startsWith('./internals/'))
    .map((key) => key.slice(2))
    .filter((subpath) => subpath !== 'package.json');
}

export async function listPrimitives(): Promise<Primitive[]> {
  const primitives: Primitive[] = [];
  for (const subpath of packageSubpaths()) {
    const mod = (await import(/* @vite-ignore */ `@base-ui/react/${subpath}`)) as Record<
      string,
      unknown
    >;
    const exportName = Object.keys(mod).find((name) => normalize(name) === normalize(subpath));
    if (!exportName) continue;
    const value = mod[exportName] as Record<string, unknown> | undefined;
    if (typeof value !== 'object' || value === null) continue;
    const isNamespace = Object.prototype.toString.call(value) === '[object Module]';
    const isComponent = '$$typeof' in value;
    if (!isNamespace && !isComponent) continue;
    primitives.push({
      subpath,
      exportName,
      parts: isNamespace ? Object.keys(value).filter((k) => /^[A-Z]/.test(k)) : ['Root'],
    });
  }
  return primitives;
}

export function registryFiles(wwwRoot: string): string[] {
  const dir = path.join(wwwRoot, 'registry/ui');
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.tsx'))
    .sort();
}

export function registryComponents(wwwRoot: string): string[] {
  return registryFiles(wwwRoot).map((file) => file.replace(/\.tsx$/, ''));
}

export function registryImports(wwwRoot: string): Set<string> {
  const imported = new Set<string>();
  for (const file of registryFiles(wwwRoot)) {
    const source = fs.readFileSync(path.join(wwwRoot, 'registry/ui', file), 'utf-8');
    for (const match of source.matchAll(IMPORT_PATTERN)) imported.add(match[1]);
  }
  return imported;
}
