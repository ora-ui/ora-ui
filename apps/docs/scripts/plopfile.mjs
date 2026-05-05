/**
 * Docs Component Scaffolder
 *
 * Usage:
 *   pnpm --filter docs scaffold component <name> ["<description>"] ["<variants>"]
 *
 * Examples:
 *   # All values via positional args (non-interactive)
 *   pnpm --filter docs scaffold component test "A test component" "default,alt"
 *
 *   # Only name required -- prompts for description + variants
 *   pnpm --filter docs scaffold component accordion
 *
 * Test + cleanup:
 *   pnpm --filter docs scaffold component test "A test component" "default,alt"
 *   # Then revert:
 *   git checkout -- apps/docs/src/previews/registry.ts apps/docs/src/components/ui/sources.ts apps/docs/content/docs/components/meta.json
 *   git clean -fd apps/docs/src/previews/test/ apps/docs/content/docs/components/test.mdx
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOC_ROOT = join(__dirname, '..');
const TPL_ROOT = join(DOC_ROOT, 'templates');

function pascalCase(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function sentenceCase(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export default function (plop) {
  plop.setHelper('pascalCase', (text) => pascalCase(text));
  plop.setHelper('sentenceCase', (text) => sentenceCase(text));

  plop.setGenerator('component', {
    description: 'Scaffold a new component docs page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (kebab-case):',
      },
      {
        type: 'input',
        name: 'description',
        message: 'One-line description for frontmatter:',
      },
      {
        type: 'input',
        name: 'variants',
        message: 'Variants (comma-separated):',
        default: 'default',
      },
    ],
    actions(data) {
      if (Array.isArray(data) && !data.name) {
        const [name, description, variants] = data;
        data = { name, description, variants };
      }

      if (!data.name) {
        throw new Error(
          'Missing required argument: <name>. Usage: pnpm scaffold component <name> ["<description>"] ["<variants,list>"]'
        );
      }

      const name = data.name.toLowerCase().trim().replace(/\s+/g, '-');
      const description = data.description || '';
      const variantsRaw = data.variants || 'default';
      const variants = variantsRaw
        .split(',')
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);

      data.name = name;
      data.description = description;
      data.variants = variants;
      data.pascalName = pascalCase(name);

      return [
        {
          type: 'add',
          path: join(DOC_ROOT, 'src/previews/{{name}}/{{name}}-hero.tsx'),
          templateFile: join(TPL_ROOT, 'preview-hero.tsx.hbs'),
          skipIfExists: true,
        },
        ...variants.map((variant) => ({
          type: 'add',
          path: join(DOC_ROOT, `src/previews/{{name}}/{{name}}-${variant}.tsx`),
          templateFile: join(TPL_ROOT, 'preview.tsx.hbs'),
          data: { variant },
          skipIfExists: true,
        })),
        {
          type: 'modify',
          path: join(DOC_ROOT, 'src/previews/registry.ts'),
          transform(content) {
            const newImports = [];
            const heroImport = `import ${pascalCase(name)}Hero from './${name}/${name}-hero';`;
            if (!content.includes(heroImport)) newImports.push(heroImport);
            for (const v of variants) {
              const line = `import ${pascalCase(name)}${pascalCase(v)} from './${name}/${name}-${v}';`;
              if (!content.includes(line)) newImports.push(line);
            }
            if (!newImports.length) return content;
            const block = newImports.join('\n');
            return content.replace(/(\n)(\s*\/\/ @scaffold:imports)/, `$1${block}\n$2`);
          },
        },
        {
          type: 'modify',
          path: join(DOC_ROOT, 'src/previews/registry.ts'),
          transform(content) {
            const newEntries = [];
            const heroEntry = `  '${name}-hero': {\n    component: ${pascalCase(name)}Hero,\n    source: readSource('${name}/${name}-hero.tsx'),\n  },`;
            if (!content.includes(heroEntry)) newEntries.push(heroEntry);
            for (const v of variants) {
              const entry = `  '${name}-${v}': {\n    component: ${pascalCase(name)}${pascalCase(v)},\n    source: readSource('${name}/${name}-${v}.tsx'),\n  },`;
              if (!content.includes(entry)) newEntries.push(entry);
            }
            if (!newEntries.length) return content;
            const block = newEntries.join('\n');
            return content.replace(/(\n)(\s*\/\/ @scaffold:entries)/, `$1${block}\n$2`);
          },
        },
        {
          type: 'modify',
          path: join(DOC_ROOT, 'src/components/ui/sources.ts'),
          transform(content) {
            const needsQuotes = name.includes('-');
            const sourceKey = needsQuotes ? `"${name}"` : name;
            const sourceEntry = `  ${sourceKey}: readSource('${name}.tsx'),`;
            if (content.includes(sourceEntry)) return content;
            return content.replace(
              /(\n)(\s*\/\/ @scaffold:component-entries)/,
              `$1${sourceEntry}\n$2`
            );
          },
        },
        {
          type: 'add',
          path: join(DOC_ROOT, 'content/docs/components/{{name}}.mdx'),
          templateFile: join(TPL_ROOT, 'component.mdx.hbs'),
          skipIfExists: true,
        },
        {
          type: 'modify',
          path: join(DOC_ROOT, 'content/docs/components/meta.json'),
          transform(content) {
            const meta = JSON.parse(content);
            if (!meta.pages.includes(name)) {
              meta.pages.push(name);
              meta.pages.sort((a, b) => a.localeCompare(b));
            }
            return JSON.stringify(meta, null, 2) + '\n';
          },
        },
      ];
    },
  });
}
