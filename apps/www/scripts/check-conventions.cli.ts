import path from 'path';
import { fileURLToPath } from 'url';
import { checkConventions, formatFixed, formatViolation } from './check-conventions';

const wwwRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { violations, added, fixed } = checkConventions(wwwRoot);

if (added.length === 0 && fixed.length === 0) {
  console.log(`check-conventions: ok (${violations.length} baselined violations left to fix)`);
} else {
  for (const v of added) console.error(formatViolation(v) + '\n');
  for (const key of fixed) console.error(formatFixed(key) + '\n');
  console.error(
    `check-conventions: ${added.length} new violation(s), ${fixed.length} stale baseline entr${fixed.length === 1 ? 'y' : 'ies'}`
  );
  process.exit(1);
}
