#!/usr/bin/env node
/**
 * Materializes the currently-staged git index into a temporary directory and
 * runs `gitleaks dir` against it. This is more reliable than asking Gitleaks
 * to operate on the staged state directly, because the behaviour of the
 * various staged-file flags has drifted between releases for newly added
 * files. Copying the exact index contents gives the scanner unambiguous
 * input.
 *
 * Intended to be invoked by `lefthook`'s `pre-commit` `secrets` command as a
 * final secret-scan gate. Exits zero when the scan is clean and non-zero when
 * Gitleaks reports findings.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';

type StagedFile = {
  mode: string;
  relativePath: string;
};

const repoRoot = process.cwd();

const listStagedFiles = (): StagedFile[] => {
  const raw = execSync('git diff --cached --name-only --diff-filter=ACM -z', {
    cwd: repoRoot,
  }).toString();
  if (!raw) return [];
  return raw
    .split('\0')
    .filter((relativePath) => relativePath.length > 0)
    .map((relativePath) => ({ mode: '100644', relativePath }));
};

const copyStagedFileInto = (snapshotRoot: string, file: StagedFile): void => {
  const destination = path.join(snapshotRoot, file.relativePath);
  mkdirSync(path.dirname(destination), { recursive: true });
  try {
    const content = execSync(`git show :${file.relativePath}`, {
      cwd: repoRoot,
      encoding: 'buffer',
    });
    writeFileSync(destination, content);
  } catch {
    // File may have been deleted between listing and showing; skip it.
  }
};

const resolveGitleaksBinary = (): string | null => {
  const result = spawnSync('which', ['gitleaks']);
  if (result.status === 0) {
    return result.stdout.toString().trim() || 'gitleaks';
  }
  return null;
};

const main = () => {
  const staged = listStagedFiles();
  if (staged.length === 0) {
    console.error('No staged files to scan.');
    return;
  }

  const gitleaks = resolveGitleaksBinary();
  if (!gitleaks) {
    console.error(
      'WARNING: gitleaks binary not found on PATH. Install it (e.g. `brew install gitleaks`) to enable the secret scan. Skipping.'
    );
    return;
  }

  const snapshotRoot = mkdtempSync(path.join(tmpdir(), 'shelf-gitleaks-'));
  try {
    for (const file of staged) {
      copyStagedFileInto(snapshotRoot, file);
    }

    const configPath = path.resolve(repoRoot, '.gitleaks.toml');
    const gitleaksArguments = ['dir', snapshotRoot, '--redact'];
    if (existsSync(configPath)) {
      gitleaksArguments.push('--config', configPath);
    }

    const scan = spawnSync(gitleaks, gitleaksArguments, { stdio: 'inherit' });
    if (scan.status !== 0) {
      process.exit(scan.status ?? 1);
    }
  } finally {
    rmSync(snapshotRoot, { recursive: true, force: true });
  }
};

main();
