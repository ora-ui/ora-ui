import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { ScaffoldError, USAGE, parseArgs, scaffoldComponent, scaffoldDocs } from './scaffold';

const wwwRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const run = (cmd: string, args: string[]) =>
  execFileSync(cmd, args, { cwd: wwwRoot, stdio: ['ignore', 'inherit', 'inherit'] });

const prettier = (files: string[]) => run('pnpm', ['exec', 'prettier', '--write', ...files]);

/*
 * `shadcn build` rewrites every file in public/r, so it builds into a temp
 * dir and only the new component's install file is copied across.
 */
function writeInstallFile(name: string) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-r-'));
  try {
    run('pnpm', ['exec', 'shadcn', 'build', '--output', out]);
    fs.copyFileSync(path.join(out, `${name}.json`), path.join(wwwRoot, `public/r/${name}.json`));
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
  prettier([`public/r/${name}.json`]);
}

const parsed = parseArgs(process.argv.slice(2));
if (!parsed.ok) {
  console.error(`${parsed.error}\n\n${USAGE}`);
  process.exit(1);
}

try {
  const { args } = parsed;
  const written =
    args.command === 'component' ? scaffoldComponent(wwwRoot, args) : scaffoldDocs(wwwRoot, args);
  if (written.length === 0) console.log('Every file already exists. Nothing was written.');
  else prettier(written);
  for (const file of written) console.log(`wrote apps/www/${file}`);

  if (args.command === 'component') {
    try {
      run('pnpm', ['run', 'gen:manifest']);
      writeInstallFile(args.name);
      run('pnpm', ['run', 'gen:registry']);
      run('pnpm', ['run', 'gen:lists']);
    } catch (err) {
      console.error(
        `\nA generator failed after the files above were written. Delete them, fix the error and run the same command again.`
      );
      throw err;
    }
  }
} catch (err) {
  if (!(err instanceof ScaffoldError)) throw err;
  console.error(err.message);
  process.exit(1);
}
