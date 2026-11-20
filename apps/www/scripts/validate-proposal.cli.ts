import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gatherFacts, parseProposal, validateProposal } from './validate-proposal';

const wwwRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bodyFile = process.argv[2];

if (!bodyFile) {
  console.error('usage: pnpm --filter www validate-proposal <body-file | ->');
  process.exit(2);
}

async function main() {
  const body = fs.readFileSync(bodyFile === '-' ? 0 : bodyFile, 'utf-8');
  const issues = JSON.parse(
    execFileSync(
      'gh',
      [
        'issue',
        'list',
        '--state',
        'open',
        '--search',
        'New component: in:title',
        '--limit',
        '200',
        '--json',
        'title',
      ],
      { encoding: 'utf-8' }
    )
  ) as { title: string }[];

  const facts = await gatherFacts(
    wwwRoot,
    issues.map((i) => i.title)
  );
  const verdict = validateProposal(parseProposal(body), facts);

  if (verdict.ok) {
    console.log(`validate-proposal: ok\nlabels: ${verdict.labels.join(',')}`);
  } else {
    for (const defect of verdict.defects) console.error(`${defect.code}: ${defect.message}`);
    console.error(`validate-proposal: ${verdict.defects.length} defect(s), do not file`);
    process.exit(1);
  }
}

void main();
