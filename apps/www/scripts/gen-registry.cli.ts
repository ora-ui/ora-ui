import path from 'path';
import { fileURLToPath } from 'url';
import { generate } from './gen-registry';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const wwwRoot = path.resolve(thisDir, '..');

generate({
  previewsDir: path.join(wwwRoot, 'docs/previews'),
  uiDir: path.join(wwwRoot, 'registry/ui'),
  registryOut: path.join(wwwRoot, 'docs/previews/registry.generated.ts'),
  sourcesOut: path.join(wwwRoot, 'registry/lib/sources.generated.ts'),
});

console.log('gen-registry: wrote registry.generated.ts and sources.generated.ts');
