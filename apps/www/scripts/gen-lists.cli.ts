import path from 'path';
import { fileURLToPath } from 'url';
import { createSpecs, generateLists } from './gen-lists';

const wwwRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specs = createSpecs(wwwRoot);

async function runWatch() {
  generateLists(specs);
  console.log('gen-lists --watch: initial generation done, watching for changes…');

  const { default: chokidar } = await import('chokidar');

  const outs = new Set(specs.map((s) => s.out));
  const watcher = chokidar.watch(
    specs.map((s) => s.dir),
    {
      ignored: (p: string) => outs.has(p) || path.basename(p).startsWith('.'),
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
    }
  );

  const regenerate = (filePath: string) => {
    try {
      generateLists(specs);
      console.log(`gen-lists --watch: regenerated (${path.relative(wwwRoot, filePath)})`);
    } catch (err) {
      console.error('gen-lists --watch: error during regeneration:', err);
    }
  };

  watcher.on('add', regenerate).on('change', regenerate).on('unlink', regenerate);
}

if (process.argv.includes('--watch')) {
  runWatch();
} else {
  generateLists(specs);
  console.log('gen-lists: wrote entries.generated.ts and meta.json');
}
