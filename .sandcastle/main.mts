// Sequential Reviewer — implement-then-review loop
//
// Usage (targeted — recommended via skill):
//   pnpm sandcastle --issue 121 --branch agent/fix-badge-link
//
// Usage (autonomous — picks issues by priority):
//   pnpm sandcastle

import * as sandcastle from '@ai-hero/sandcastle';
import { docker } from '@ai-hero/sandcastle/sandboxes/docker';
import { execSync } from 'child_process';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    issue: { type: 'string', short: 'i' },
    branch: { type: 'string', short: 'b' },
    base: { type: 'string' },
  },
  strict: false,
});

const targetIssue = args.issue ? parseInt(args.issue as string, 10) : null;
const targetBranch = args.branch as string | undefined;
const baseBranch = (args.base as string | undefined) ?? 'develop';

// When targeting a specific issue, run exactly one iteration.
const MAX_ITERATIONS = targetIssue ? 1 : 10;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const hooks = {
  sandbox: { onSandboxReady: [{ command: 'pnpm install' }] },
};

const copyToWorktree = ['node_modules'];

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
  console.log(`\n=== Iteration ${iteration}/${MAX_ITERATIONS} ===\n`);

  let implementBranch: string;
  let issueDirective: string;

  if (targetIssue) {
    // Targeted mode: branch and issue were provided by the caller.
    implementBranch = targetBranch ?? `agent/issue-${targetIssue}`;
    issueDirective = `**Work on issue #${targetIssue} specifically.** Do not pick a different issue.`;
  } else {
    // Autonomous mode: timestamp-based branch name, agent picks the issue.
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
    implementBranch = `agent/implementer-${timestamp}`;
    issueDirective = [
      'Work on the highest-priority open issue that is not blocked (see priority order below).',
      'You MUST only pick an issue from the "Open issues" list above — every issue in that list carries the `agent-ready` label.',
      'Do NOT work on any issue that does not appear in that list, regardless of its number or content.',
    ].join(' ');
  }

  // -------------------------------------------------------------------------
  // Phase 1: Implement
  // -------------------------------------------------------------------------
  const implement = await sandcastle.run({
    hooks,
    copyToWorktree,
    sandbox: docker(),
    branchStrategy: { type: 'branch', branch: implementBranch, baseBranch },
    name: 'implementer',
    maxIterations: 15,
    agent: sandcastle.pi('claude-sonnet-4-6'),
    promptFile: './.sandcastle/implement-prompt.md',
    promptArgs: { ISSUE_DIRECTIVE: issueDirective },
  });

  const branch = implement.branch;

  if (!implement.commits.length) {
    console.log('Implementation agent made no commits. Skipping review.');
    continue;
  }

  console.log(`\nImplementation complete on branch: ${branch}`);
  console.log(`Commits: ${implement.commits.length}`);

  // -------------------------------------------------------------------------
  // Phase 2: Review
  // -------------------------------------------------------------------------
  await sandcastle.run({
    hooks,
    copyToWorktree,
    sandbox: docker(),
    branchStrategy: { type: 'branch', branch },
    name: 'reviewer',
    maxIterations: 5,
    agent: sandcastle.pi('claude-sonnet-4-6'),
    promptFile: './.sandcastle/review-prompt.md',
    promptArgs: { BRANCH: branch },
  });

  console.log('\nReview complete.');

  // -------------------------------------------------------------------------
  // Phase 3: Push & open draft PR for human review
  // -------------------------------------------------------------------------
  execSync(`git push origin ${branch}`, { stdio: 'inherit' });
  execSync(
    `gh pr create --head ${branch} --base ${baseBranch} --draft --title "sandcastle: ${branch}" --body "Automated implementation by Sandcastle. Please review before merging."`,
    { stdio: 'inherit' }
  );

  console.log(`\nDraft PR opened for branch: ${branch}`);
}

console.log('\nAll done.');
