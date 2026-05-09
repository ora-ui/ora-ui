// Sequential Reviewer — implement-then-review loop
//
// Usage (targeted — recommended via skill):
//   pnpm sandcastle --issue 121 --branch agent/fix-badge-link
//
// Usage (autonomous — picks issues by priority):
//   pnpm sandcastle

import * as sandcastle from '@ai-hero/sandcastle';
import type { AgentProvider } from '@ai-hero/sandcastle';
import { docker } from '@ai-hero/sandcastle/sandboxes/docker';
import { createDashboard } from 'sandcastle-gui';
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
    'no-review': { type: 'boolean' },
  },
  strict: false,
});

const targetIssue = args.issue ? parseInt(args.issue as string, 10) : null;
const targetBranch = args.branch as string | undefined;
const baseBranch = (args.base as string | undefined) ?? 'develop';
const skipReview = Boolean(args['no-review']);

// When targeting a specific issue, run exactly one iteration.
const MAX_ITERATIONS = targetIssue ? 1 : 10;

// ---------------------------------------------------------------------------
// Agent resolution
//
// Configure via .sandcastle/.env:
//   SANDCASTLE_IMPL_AGENT=pi:anthropic/claude-sonnet-4-6
//   SANDCASTLE_REVIEW_AGENT=pi:anthropic/claude-sonnet-4-6
//
// Supported providers: pi, claude-code, codex, opencode
// ---------------------------------------------------------------------------

const resolveAgent = (envVar: string, fallback: string): AgentProvider => {
  const value = process.env[envVar] ?? fallback;
  const colonIdx = value.indexOf(':');
  const provider = colonIdx === -1 ? value : value.slice(0, colonIdx);
  const model = colonIdx === -1 ? '' : value.slice(colonIdx + 1);

  switch (provider) {
    case 'pi':
      return sandcastle.pi(model, {
        env: { OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY! },
      });
    case 'claude-code':
      return sandcastle.claudeCode(model, {
        env: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY! },
      });
    case 'codex':
      return sandcastle.codex(model, {
        env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
      });
    case 'opencode':
      return sandcastle.opencode(model);
    default:
      throw new Error(`Unknown agent provider "${provider}" in ${envVar}. Valid options: pi, claude-code, codex, opencode`);
  }
};

const implAgent = resolveAgent('SANDCASTLE_IMPL_AGENT', 'pi:anthropic/claude-sonnet-4-6');
const reviewAgent = resolveAgent('SANDCASTLE_REVIEW_AGENT', 'pi:anthropic/claude-sonnet-4-6');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const hooks = {
  sandbox: { onSandboxReady: [{ command: 'pnpm install' }] },
};

const copyToWorktree = ['node_modules'];

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

const dashboard = await createDashboard({ port: 4800 });

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
    agent: implAgent,
    promptFile: './.sandcastle/implement-prompt.md',
    promptArgs: { ISSUE_DIRECTIVE: issueDirective },
    logging: {
      type: 'file',
      path: '.sandcastle/logs/implementer.log',
      onAgentStreamEvent: dashboard.collector('implementer'),
    },
  });
  dashboard.recordResult('implementer', implement);

  const branch = implement.branch;

  if (!implement.commits.length) {
    console.log('Implementation agent made no commits. Skipping review.');
    continue;
  }

  console.log(`\nImplementation complete on branch: ${branch}`);
  console.log(`Commits: ${implement.commits.length}`);

  // -------------------------------------------------------------------------
  // Phase 2: Review (skipped when --no-review is passed)
  // -------------------------------------------------------------------------
  if (skipReview) {
    console.log('\nSkipping review phase (--no-review).');
  } else {
    const review = await sandcastle.run({
      hooks,
      copyToWorktree,
      sandbox: docker(),
      branchStrategy: { type: 'branch', branch },
      name: 'reviewer',
      maxIterations: 5,
      agent: reviewAgent,
      promptFile: './.sandcastle/review-prompt.md',
      promptArgs: { BRANCH: branch, SOURCE_BRANCH: baseBranch },
      logging: {
        type: 'file',
        path: '.sandcastle/logs/reviewer.log',
        onAgentStreamEvent: dashboard.collector('reviewer'),
      },
    });
    dashboard.recordResult('reviewer', review);

    console.log('\nReview complete.');
  }

  // -------------------------------------------------------------------------
  // Phase 3: Push & open draft PR for human review
  //
  // PR title format: "sandcastle: <branch>" (always enforced)
  // PR body: agent-generated summary extracted from <pr-summary> block,
  //          falling back to a generic message.
  // -------------------------------------------------------------------------
  const prSummaryMatch = implement.stdout.match(/<pr-summary>([\s\S]*?)<\/pr-summary>/);
  const prBody =
    prSummaryMatch?.[1]?.trim() ??
    'Automated implementation by Sandcastle. Please review before merging.';

  execSync(`git push origin ${branch}`, { stdio: 'inherit' });
  execSync(
    `gh pr create --head ${branch} --base ${baseBranch} --draft --title "sandcastle: ${branch}" --body ${JSON.stringify(prBody)}`,
    { stdio: 'inherit' }
  );

  console.log(`\nDraft PR opened for branch: ${branch}`);
}

await dashboard.close();
console.log('\nAll done.');
