import path from 'path';
import { fileURLToPath } from 'url';
import { formatGapList, gapList } from './gap-list';

const wwwRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
void (async () => {
  const gap = await gapList(wwwRoot);
  console.log(process.argv.includes('--json') ? JSON.stringify(gap, null, 2) : formatGapList(gap));
})();
