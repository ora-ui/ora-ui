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
          path: join(DOC_ROOT, 'docs/previews/{{name}}/{{name}}-hero.tsx'),
          templateFile: join(TPL_ROOT, 'preview-hero.tsx.hbs'),
          skipIfExists: true,
        },
        ...variants.map((variant) => ({
          type: 'add',
          path: join(DOC_ROOT, `docs/previews/{{name}}/{{name}}-${variant}.tsx`),
          templateFile: join(TPL_ROOT, 'preview.tsx.hbs'),
          data: { variant },
          skipIfExists: true,
        })),
        {
          type: 'add',
          path: join(DOC_ROOT, 'docs/content/components/{{name}}.mdx'),
          templateFile: join(TPL_ROOT, 'component.mdx.hbs'),
          skipIfExists: true,
        },
      ];
    },
  });
}
