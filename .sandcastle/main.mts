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
// import { createDashboard } from 'sandcastle-gui';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
    'review-only': { type: 'boolean' },
    'test-propagation': { type: 'boolean' },
  },
  strict: false,
});

const targetIssue = args.issue ? parseInt(args.issue as string, 10) : null;
const targetBranch = args.branch as string | undefined;
const baseBranch = (args.base as string | undefined) ?? 'develop';
const skipReview = Boolean(args['no-review']);
const reviewOnly = Boolean(args['review-only']);
const testPropagation = Boolean(args['test-propagation']);

// Targeted mode: verify issue is OPEN before doing any work.
if (targetIssue) {
  const state = execSync(`gh issue view ${targetIssue} --json state --jq .state`, {
    encoding: 'utf8',
  }).trim();
  if (state !== 'OPEN') {
    console.log(`Issue #${targetIssue} is ${state}. Exiting.`);
    process.exit(0);
  }
}

// When targeting a specific issue, run exactly one iteration.
const MAX_ITERATIONS = targetIssue ? 1 : 10;

// ---------------------------------------------------------------------------
// Autonomous mode: exit early if there are no agent-ready issues to work on
// ---------------------------------------------------------------------------

if (!targetIssue && !reviewOnly) {
  const openIssueCount = parseInt(
    execSync(
      `gh issue list --state open --label agent-ready --json number,labels --jq '[.[] | select(.labels | map(.name) | contains(["awaiting-review"]) | not)] | length'`,
      { encoding: 'utf8' }
    ).trim(),
    10
  );

  if (openIssueCount === 0) {
    console.log('No agent-ready issues found. Exiting.');
    process.exit(0);
  }
}

// ---------------------------------------------------------------------------
// Shared prompt fragments
// ---------------------------------------------------------------------------

const SHARED = readFileSync('./.sandcastle/shared.md', 'utf8');
const AUTONOMOUS_SECTION = readFileSync('./.sandcastle/autonomous-section.md', 'utf8');

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
      throw new Error(
        `Unknown agent provider "${provider}" in ${envVar}. Valid options: pi, claude-code, codex, opencode`
      );
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

const BOT_EMAIL = '285688469+ora-gh-bot@users.noreply.github.com';
const botGitEnv = {
  GIT_AUTHOR_NAME: 'ora-gh-bot',
  GIT_AUTHOR_EMAIL: BOT_EMAIL,
  GIT_COMMITTER_NAME: 'ora-gh-bot',
  GIT_COMMITTER_EMAIL: BOT_EMAIL,
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

// const dashboard = await createDashboard({ port: 4800 });

// ---------------------------------------------------------------------------
// Test-propagation mode: check whether early vs final agent output tags
// both appear in stdout (useful for diagnosing pi provider behaviour).
// ---------------------------------------------------------------------------

if (testPropagation) {
  console.log('\nRunning propagation test...\n');

  const testBranch = `agent-chore/test-propagation-${Date.now()}`;
  const result = await sandcastle.run({
    hooks,
    copyToWorktree,
    sandbox: docker({ env: botGitEnv }),
    branchStrategy: { type: 'branch', branch: testBranch, baseBranch },
    name: 'propagation-test',
    maxIterations: 1,
    agent: implAgent,
    promptFile: './.sandcastle/test-propagation-prompt.md',
    promptArgs: {},
    logging: { type: 'file', path: '.sandcastle/logs/propagation-test.log' },
  });

  const earlyFound = /<test-early>propagation-check<\/test-early>/.test(result.stdout);
  const finalFound = /<test-final>propagation-check<\/test-final>/.test(result.stdout);

  console.log('\n--- Propagation test results ---');
  console.log(`<test-early> captured: ${earlyFound ? '✓ yes' : '✗ no'}`);
  console.log(`<test-final> captured: ${finalFound ? '✓ yes' : '✗ no'}`);

  if (!earlyFound && finalFound) {
    console.log('\nConclusion: provider only returns final message. Early tags will be lost.');
  } else if (earlyFound && finalFound) {
    console.log('\nConclusion: provider returns all messages. Early tags are safe.');
  } else {
    console.log(
      '\nConclusion: unexpected result — check the log at .sandcastle/logs/propagation-test.log'
    );
  }

  process.exit(0);
}

// ---------------------------------------------------------------------------
// Review-only mode: skip implement, run reviewer + PR on an existing branch
// ---------------------------------------------------------------------------

if (reviewOnly) {
  const branch = targetBranch;
  if (!branch) {
    console.error('--review-only requires --branch <branch>');
    process.exit(1);
  }

  console.log(`\nReview-only mode on branch: ${branch}\n`);

  const review = await sandcastle.run({
    hooks,
    copyToWorktree,
    sandbox: docker({ env: botGitEnv }),
    branchStrategy: { type: 'branch', branch },
    name: 'reviewer',
    maxIterations: 5,
    agent: reviewAgent,
    promptFile: './.sandcastle/review-prompt.md',
    promptArgs: { BRANCH: branch, SHARED },
    logging: {
      type: 'file',
      path: `.sandcastle/logs/${branch.replace(/\//g, '-')}-review.log`,
      // onAgentStreamEvent: dashboard.collector('reviewer'),
    },
  });
  // dashboard.recordResult('reviewer', review);

  console.log('\nReview complete.');

  const prTitleMatch = review.stdout.match(/<pr-title>([\s\S]*?)<\/pr-title>/);
  const prTitle = prTitleMatch?.[1]?.trim() ?? `agent: ${branch.replace(/^agent-[^/]+\//, '')}`;

  const prSummaryMatch = review.stdout.match(/<pr-summary>([\s\S]*?)<\/pr-summary>/);
  const prBody =
    prSummaryMatch?.[1]?.trim() ??
    'Automated implementation by Sandcastle. Please review before merging.';

  const reviewBodyFile = join(tmpdir(), `sandcastle-pr-${Date.now()}.txt`);
  writeFileSync(reviewBodyFile, prBody, 'utf8');

  execSync(`git push origin ${branch}`, { stdio: 'inherit' });
  execSync(
    `gh pr create --head ${branch} --base ${baseBranch} --draft --title ${JSON.stringify(prTitle)} --body-file ${JSON.stringify(reviewBodyFile)}`,
    { stdio: 'inherit' }
  );

  console.log(`\nDraft PR opened for branch: ${branch}`);

  const closesMatch = prBody.match(/Closes\s+#(\d+)/i);
  const issueNumber = closesMatch?.[1] ?? null;
  if (issueNumber) {
    try {
      execSync(`gh issue edit ${issueNumber} --add-label awaiting-review`, { stdio: 'inherit' });
      console.log(`Labelled issue #${issueNumber} as awaiting-review.`);
    } catch {
      console.warn(`Could not label issue #${issueNumber}.`);
    }
  }

  // await dashboard.close();
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
  console.log(`\n=== Iteration ${iteration}/${MAX_ITERATIONS} ===\n`);

  // Autonomous mode: re-check for remaining agent-ready issues each iteration.
  if (!targetIssue && !reviewOnly) {
    const remaining = parseInt(
      execSync(
        `gh issue list --state open --label agent-ready --json number,labels --jq '[.[] | select(.labels | map(.name) | contains(["awaiting-review"]) | not)] | length'`,
        { encoding: 'utf8' }
      ).trim(),
      10
    );
    if (remaining === 0) {
      console.log('No agent-ready issues remaining. Exiting.');
      break;
    }
  }

  let implementBranch: string;
  let issueDirective: string;

  if (targetIssue) {
    // Targeted mode: branch and issue were provided by the caller.
    implementBranch = targetBranch ?? `agent-wip/issue-${targetIssue}`;
    issueDirective = `Work on issue #${targetIssue}. Do not pick a different issue.`;
  } else {
    // Autonomous mode: timestamp-based branch name, agent picks the issue.
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
    implementBranch = `agent-wip/implementer-${timestamp}`;
    issueDirective =
      'Pick the highest-priority issue from the **Open issues** list per the priority order in the autonomous section below.';
  }
  const modeSection = targetIssue ? '' : AUTONOMOUS_SECTION;

  // -------------------------------------------------------------------------
  // Phase 1: Implement
  // -------------------------------------------------------------------------
  const implement = await sandcastle.run({
    hooks,
    copyToWorktree,
    sandbox: docker({ env: botGitEnv }),
    branchStrategy: { type: 'branch', branch: implementBranch, baseBranch },
    name: 'implementer',
    maxIterations: 15,
    agent: implAgent,
    promptFile: './.sandcastle/implement-prompt.md',
    promptArgs: { ISSUE_DIRECTIVE: issueDirective, MODE_SECTION: modeSection, SHARED },
    logging: {
      type: 'file',
      path: `.sandcastle/logs/${implementBranch.replace(/\//g, '-')}.log`,
      // onAgentStreamEvent: dashboard.collector('implementer'),
    },
  });
  // dashboard.recordResult('implementer', implement);

  let branch = implement.branch;

  // Fix: detect BLOCKED runs — post reason as issue comment and skip review.
  const blockedMatch = implement.stdout.match(/<blocked-reason>([\s\S]*?)<\/blocked-reason>/);
  if (blockedMatch) {
    const reason = blockedMatch[1]!.trim();
    console.log(`\nImplementer reported BLOCKED:\n${reason}`);
    const workingOnMatch = implement.stdout.match(/<working-on-issue>(\d+)<\/working-on-issue>/);
    const blockedIssue = workingOnMatch?.[1] ?? (targetIssue ? String(targetIssue) : null);
    if (blockedIssue) {
      try {
        execSync(
          `gh issue comment ${blockedIssue} --body ${JSON.stringify(`**Sandcastle blocked:** ${reason}`)}`,
          { stdio: 'inherit' }
        );
      } catch {
        console.warn(`Could not post blocked comment to issue #${blockedIssue}`);
      }
    }
    continue;
  }

  if (!implement.commits.length) {
    console.log('Implementation agent made no commits. Skipping review.');
    continue;
  }

  // Fix: in autonomous mode, verify the issue the agent picked carries agent-ready label.
  if (!targetIssue) {
    const workingOnMatch = implement.stdout.match(/<working-on-issue>(\d+)<\/working-on-issue>/);
    const pickedIssue = workingOnMatch?.[1];
    if (pickedIssue) {
      const labels: string = execSync(
        `gh issue view ${pickedIssue} --json labels --jq '[.labels[].name] | join(",")'`,
        { encoding: 'utf8' }
      ).trim();
      if (!labels.split(',').includes('agent-ready')) {
        console.warn(
          `Issue #${pickedIssue} does not carry agent-ready label (labels: ${labels || 'none'}). Skipping.`
        );
        continue;
      }
    }
  }

  // Rename branch to match the agent's assessed scope — autonomous mode only.
  // Targeted runs keep the caller-supplied branch name.
  if (!targetIssue) {
    const branchNameMatch = implement.stdout.match(/<branch-name>([\s\S]*?)<\/branch-name>/);
    const suggestedBranch = branchNameMatch?.[1]?.trim();
    if (suggestedBranch && suggestedBranch !== branch) {
      try {
        execSync(`git branch -m ${branch} ${suggestedBranch}`);
        console.log(`Branch renamed: ${branch} → ${suggestedBranch}`);
        branch = suggestedBranch;
      } catch {
        console.warn(`Could not rename branch to ${suggestedBranch} — keeping ${branch}`);
      }
    }
  }

  console.log(`\nImplementation complete on branch: ${branch}`);
  console.log(`Commits: ${implement.commits.length}`);

  // -------------------------------------------------------------------------
  // Phase 2: Review (skipped when --no-review is passed)
  // -------------------------------------------------------------------------
  let reviewStdout = '';
  if (skipReview) {
    console.log('\nSkipping review phase (--no-review).');
  } else {
    const review = await sandcastle.run({
      hooks,
      copyToWorktree,
      sandbox: docker({ env: botGitEnv }),
      branchStrategy: { type: 'branch', branch },
      name: 'reviewer',
      maxIterations: 5,
      agent: reviewAgent,
      promptFile: './.sandcastle/review-prompt.md',
      promptArgs: { BRANCH: branch, SHARED },
      logging: {
        type: 'file',
        path: `.sandcastle/logs/${implementBranch.replace(/\//g, '-')}-review.log`,
        // onAgentStreamEvent: dashboard.collector('reviewer'),
      },
    });
    // dashboard.recordResult('reviewer', review);
    reviewStdout = review.stdout;
    console.log('\nReview complete.');
  }

  // -------------------------------------------------------------------------
  // Phase 3: Push & open draft PR for human review
  //
  // PR title: conventional commit format from <pr-title> block emitted by
  //           the reviewer (or implementer when --no-review), falling back
  //           to a generic branch-based title.
  // PR body: agent-generated summary extracted from <pr-summary> block,
  //          falling back to a generic message.
  // -------------------------------------------------------------------------
  const titleSource = skipReview ? implement.stdout : reviewStdout;
  const prTitleMatch = titleSource.match(/<pr-title>([\s\S]*?)<\/pr-title>/);
  const prTitle = prTitleMatch?.[1]?.trim() ?? `agent: ${branch.replace(/^agent-[^/]+\//, '')}`;

  const prSummaryMatch =
    implement.stdout.match(/<pr-summary>([\s\S]*?)<\/pr-summary>/) ??
    reviewStdout.match(/<pr-summary>([\s\S]*?)<\/pr-summary>/);
  const prBody =
    prSummaryMatch?.[1]?.trim() ??
    'Automated implementation by Sandcastle. Please review before merging.';

  const prBodyFile = join(tmpdir(), `sandcastle-pr-${Date.now()}.txt`);
  writeFileSync(prBodyFile, prBody, 'utf8');

  execSync(`git push origin ${branch}`, { stdio: 'inherit' });
  execSync(
    `gh pr create --head ${branch} --base ${baseBranch} --draft --title ${JSON.stringify(prTitle)} --body-file ${JSON.stringify(prBodyFile)}`,
    { stdio: 'inherit' }
  );

  console.log(`\nDraft PR opened for branch: ${branch}`);

  // Label the issue awaiting-review so autonomous loops skip it until merged/closed.
  // Parse from Closes #N in the pr-summary (final message) — early tags may be lost with some providers.
  const closesMatch = prBody.match(/Closes\s+#(\d+)/i);
  const issueNumber = closesMatch?.[1] ?? (targetIssue ? String(targetIssue) : null);
  if (issueNumber) {
    try {
      execSync(`gh issue edit ${issueNumber} --add-label awaiting-review`, { stdio: 'inherit' });
      console.log(`Labelled issue #${issueNumber} as awaiting-review.`);
    } catch {
      console.warn(
        `Could not label issue #${issueNumber} — label may not exist yet. Create it with: gh label create awaiting-review`
      );
    }
  }
}

// await dashboard.close();
console.log('\nAll done.');
