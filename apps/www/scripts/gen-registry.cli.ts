import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generate, generateToMemory } from './gen-registry';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const wwwRoot = path.resolve(thisDir, '..');

const opts = {
  previewsDir: path.join(wwwRoot, 'docs/previews'),
  uiDir: path.join(wwwRoot, 'registry/ui'),
  registryOut: path.join(wwwRoot, 'docs/previews/registry.generated.ts'),
  sourcesOut: path.join(wwwRoot, 'registry/lib/sources.generated.ts'),
};

const args = process.argv.slice(2);

function runCheck() {
  const generated = generateToMemory(opts);
  const onDiskRegistry = fs.existsSync(opts.registryOut)
    ? fs.readFileSync(opts.registryOut, 'utf-8')
    : null;
  const onDiskSources = fs.existsSync(opts.sourcesOut)
    ? fs.readFileSync(opts.sourcesOut, 'utf-8')
    : null;

  const registryDrifted = onDiskRegistry !== generated.registry;
  const sourcesDrifted = onDiskSources !== generated.sources;

  if (registryDrifted || sourcesDrifted) {
    if (registryDrifted)
      console.error('gen-registry --check: drift detected in registry.generated.ts');
    if (sourcesDrifted)
      console.error('gen-registry --check: drift detected in sources.generated.ts');
    process.exit(1);
  }

  console.log('gen-registry --check: no drift');
}

async function runWatch() {
  generate(opts);
  console.log('gen-registry --watch: initial generation done, watching for changes…');

  const { default: chokidar } = await import('chokidar');

  const watcher = chokidar.watch([opts.previewsDir, opts.uiDir], {
    ignored: [opts.registryOut, opts.sourcesOut, /(^|[/\\])\../],
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
  });

  let running = false;
  const regenerate = async (filePath: string) => {
    if (running) return;
    running = true;
    try {
      generate(opts);
      console.log(`gen-registry --watch: regenerated (${path.relative(wwwRoot, filePath)})`);
    } catch (err) {
      console.error('gen-registry --watch: error during regeneration:', err);
    } finally {
      running = false;
    }
  };

  watcher.on('add', regenerate).on('change', regenerate).on('unlink', regenerate);
}

if (args.includes('--check')) {
  runCheck();
} else if (args.includes('--watch')) {
  runWatch();
} else {
  generate(opts);
  console.log('gen-registry: wrote registry.generated.ts and sources.generated.ts');
}
