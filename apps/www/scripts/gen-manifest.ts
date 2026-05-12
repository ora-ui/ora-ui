import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const SCRIPT_DIR = path.resolve(__dirname);
const WWW_DIR = path.resolve(SCRIPT_DIR, '..');
const UI_DIR = path.join(WWW_DIR, 'registry', 'ui');
const OUT_FILE = path.join(WWW_DIR, 'registry.json');

const DEP_SKIP_LIST = [
  /^(react|react-dom|next)(\/.*)?$/, // peer deps
  /^(node|jsr|npm):.*$/, // protocol prefixes
];

function resolveNpmDep(specifier: string): string | null {
  if (DEP_SKIP_LIST.some((p) => p.test(specifier))) return null;

  // @scope/pkg/sub-path → @scope/pkg
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length > 2 ? parts.slice(0, 2).join('/') : specifier;
  }

  // pkg/sub-path → pkg
  if (specifier.includes('/')) return specifier.split('/')[0];

  return specifier;
}

interface RegistryEntry {
  name: string;
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string }[];
}

interface RegistryManifest {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryEntry[];
}

function parseImports(filePath: string): { deps: string[]; registryDeps: string[] } {
  const source = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const deps = new Set<string>();
  const registryDeps = new Set<string>();

  for (const stmt of sourceFile.statements) {
    if (!ts.isImportDeclaration(stmt)) continue;
    const specifier = (stmt.moduleSpecifier as ts.StringLiteral).text;

    if (specifier.startsWith('@/registry/lib/utils')) {
      registryDeps.add('utils');
    } else if (specifier.startsWith('@/registry/ui/')) {
      registryDeps.add(specifier.replace('@/registry/ui/', ''));
    } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
      // relative imports within same component dir → registryDep
      const name = path.basename(specifier);
      registryDeps.add(name);
    } else {
      const npm = resolveNpmDep(specifier);
      if (npm) deps.add(npm);
    }
  }

  return { deps: [...deps].sort(), registryDeps: [...registryDeps].sort() };
}

function generate(): RegistryManifest {
  const files = fs
    .readdirSync(UI_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .sort();

  const items: RegistryEntry[] = [
    {
      name: 'utils',
      type: 'registry:lib',
      dependencies: ['clsx', 'tailwind-merge'],
      files: [{ path: 'registry/lib/utils.ts', type: 'registry:lib' }],
    },
  ];

  for (const file of files) {
    const name = file.replace(/\.tsx$/, '');
    const { deps, registryDeps } = parseImports(path.join(UI_DIR, file));

    const entry: RegistryEntry = {
      name,
      type: 'registry:ui',
      files: [{ path: `registry/ui/${file}`, type: 'registry:ui' }],
    };

    if (deps.length > 0) entry.dependencies = deps;
    if (registryDeps.length > 0) entry.registryDependencies = registryDeps;

    items.push(entry);
  }

  return {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'ora-ui',
    homepage: 'https://ora-ui.com',
    items,
  };
}

function main() {
  const isCheck = process.argv.includes('--check');
  const manifest = generate();
  const generated = JSON.stringify(manifest, null, 2) + '\n';

  if (isCheck) {
    if (!fs.existsSync(OUT_FILE)) {
      console.error('registry.json missing — run `pnpm gen:manifest`');
      process.exit(1);
    }
    const current = fs.readFileSync(OUT_FILE, 'utf-8');
    if (current !== generated) {
      console.error('registry.json is out of sync — run `pnpm gen:manifest`');
      process.exit(1);
    }
    console.log('registry.json up to date.');
  } else {
    fs.writeFileSync(OUT_FILE, generated);
    console.log(`Written ${OUT_FILE}`);
  }
}

main();
