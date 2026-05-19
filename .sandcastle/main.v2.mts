// Sandcastle v2 Orchestrator — implements the ADR-0003 decision table.
//
// Usage:
//   pnpm sandcastle:v2 [--dry-run | --execute]
//
// --dry-run (default; also active when env var SANDCASTLE_DRY_RUN=1):
//   Computes intended actions, logs them, exits with code 0.
//   No gh writes, no Docker spawns, no token spend.
//   Structured JSON goes to .sandcastle/logs/v2-dry-run.json.
//
// --execute (Phase 1+):
//   Acts on the decision table. For this slice only the fresh-implementer
//   dispatch is wired: one qualifying issue per invocation. Reviewer and
//   address-review dispatches print "not yet implemented" and skip.
//
// Decision logic (read-only):
//   1. List agent-ready + agent-v2 issues with no open PR → would spawn fresh implementer
//   2. List draft PRs with agent-review-pending (authored by bot) → would spawn reviewer if last_commit > last_review
//   3. List draft PRs with agent-impl-todo (authored by bot) → would spawn address-review implementer if last_review > last_commit
//   4. Exclude anything with needs-human
//   5. Count bot-authored reviews per PR; flag those at rounds-cap (default 2)
//
// ADR-0003 §4 (Loop prevention) encodes the timestamp gate:
//   - Spawn reviewer only if last_commit > last_review
//   - Spawn address-review only if last_review > last_commit AND review has unresolved comments
//   - Neither newer → skip

import * as sandcastle from '@ai-hero/sandcastle';
import type { AgentProvider } from '@ai-hero/sandcastle';
import { docker } from '@ai-hero/sandcastle/sandboxes/docker';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BOT_LOGIN = process.env.SANDCASTLE_BOT_LOGIN ?? 'ora-gh-bot';
const ROUNDS_CAP = parseInt(process.env.SANDCASTLE_ROUNDS_CAP ?? '2', 10);
const BASE_BRANCH = process.env.SANDCASTLE_BASE_BRANCH ?? 'develop';

// Canonical bot git env passed into every docker dispatch. All dispatchers
// (fresh, reviewer, address-review) MUST reuse this verbatim so commits,
// reviews, and label edits all attribute to the bot user. Do not inline a
// per-dispatcher copy — drift here breaks the rounds-counter filter in
// fetchDraftPRs which keys on user.login == BOT_LOGIN.
const BOT_EMAIL =
  process.env.SANDCASTLE_BOT_EMAIL ?? '285688469+ora-gh-bot@users.noreply.github.com';
const BOT_NAME = process.env.SANDCASTLE_BOT_NAME ?? 'ora-gh-bot';
const botGitEnv = {
  GIT_AUTHOR_NAME: BOT_NAME,
  GIT_AUTHOR_EMAIL: BOT_EMAIL,
  GIT_COMMITTER_NAME: BOT_NAME,
  GIT_COMMITTER_EMAIL: BOT_EMAIL,
  GH_TOKEN: process.env.SANDCASTLE_BOT_TOKEN ?? process.env.GH_TOKEN ?? '',
};

// Token presence check shared by all execute-mode dispatchers. Fail closed
// rather than spawning a Docker run that cannot push or open a PR.
function assertBotToken(): void {
  if (!process.env.SANDCASTLE_BOT_TOKEN && !process.env.GH_TOKEN) {
    console.error(
      'Refusing to dispatch: neither SANDCASTLE_BOT_TOKEN nor GH_TOKEN is set. ' +
        'The agent cannot push or open a PR without one of these.'
    );
    process.exit(1);
  }
}

const { values: cliArgs } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'dry-run': { type: 'boolean' },
    execute: { type: 'boolean' },
  },
  strict: false,
});

const EXECUTE = Boolean(cliArgs.execute);
const DRY_RUN = !EXECUTE && (process.env.SANDCASTLE_DRY_RUN === '1' || Boolean(cliArgs['dry-run']));

if (EXECUTE && cliArgs['dry-run']) {
  console.error('Cannot pass --execute and --dry-run together.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// GitHub helpers
// ---------------------------------------------------------------------------

interface Issue {
  number: number;
  title: string;
  labels: string[];
}

interface PR {
  number: number;
  title: string;
  headRefName: string;
  baseRefName: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  isDraft: boolean;
  authorLogin: string;
  labels: string[];
  lastCommit: string | null;
  lastReview: string | null;
  reviewCount: number;
  headSha: string;
}

function ghJson<T>(query: string): T {
  return JSON.parse(
    execSync(`gh api ${query}`, {
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.SANDCASTLE_BOT_TOKEN,
      },
    })
  ) as T;
}

function ghJsonSafe<T>(query: string, fallback: T): T {
  try {
    return ghJson<T>(query);
  } catch {
    return fallback;
  }
}

// Fetch open draft PRs authored by the bot.
function fetchDraftPRs(): PR[] {
  // gh api returns REST shape (draft, user.login, head.ref, ...). Project to the
  // camelCase shape we use locally via --jq so the TS types match runtime values.
  const raw = ghJson<
    Array<{
      number: number;
      title: string;
      state: string;
      isDraft: boolean;
      headRefName: string;
      baseRefName: string;
      author: { login: string };
      labels: Array<{ name: string }>;
      headSha: string;
    }>
  >(
    `repos/ora-ui/ora-ui/pulls --jq '[.[] | {number, title, state, isDraft: .draft, headRefName: .head.ref, baseRefName: .base.ref, author: {login: .user.login}, labels: [.labels[] | {name}], headSha: .head.sha}]'`
  ).filter((pr) => pr.isDraft && pr.author.login === BOT_LOGIN);

  return raw.map((pr) => {
    const reviews = ghJsonSafe<
      Array<{ user: { login: string }; submittedAt: string; state: string }>
    >(
      `repos/ora-ui/ora-ui/pulls/${pr.number}/reviews --jq '[.[] | {user: {login: .user.login}, submittedAt: .submitted_at, state}]'`,
      []
    );
    const botReviews = reviews.filter((r) => r.user.login === BOT_LOGIN);

    const commits = ghJsonSafe<Array<{ committedDate: string }>>(
      `repos/ora-ui/ora-ui/pulls/${pr.number}/commits --jq '[.[] | {committedDate: .commit.committer.date}]'`,
      []
    );
    const lastCommit = commits.length > 0 ? commits[commits.length - 1]!.committedDate : null;

    const lastReview =
      botReviews.length > 0 ? botReviews[botReviews.length - 1]!.submittedAt : null;

    return {
      number: pr.number,
      title: pr.title,
      headRefName: pr.headRefName,
      baseRefName: pr.baseRefName,
      state: pr.state as PR['state'],
      isDraft: pr.isDraft,
      authorLogin: pr.author.login,
      labels: pr.labels.map((l) => l.name),
      lastCommit,
      lastReview,
      reviewCount: botReviews.length,
      headSha: pr.headSha,
    };
  });
}

// Fetch agent-ready + agent-v2 open issues.
// All issues are returned by the API; we filter in JS for open issues and required labels.
function fetchOpenIssues(): Issue[] {
  const raw = ghJson<
    Array<{ number: number; title: string; state: string; labels: Array<{ name: string }> }>
  >(`repos/ora-ui/ora-ui/issues --jq '[.[] | select(.state == "open")]'`);

  return raw
    .filter((issue) => {
      const labelNames = issue.labels.map((l) => l.name);
      if (!labelNames.includes('agent-ready')) return false;
      if (!labelNames.includes('agent-v2')) return false;
      if (labelNames.includes('needs-human')) return false;
      return true;
    })
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      labels: issue.labels.map((l) => l.name),
    }));
}

// Issue numbers referenced by any open PR via a closing keyword in the body
// (`Closes #N`, `Fixes #N`, `Resolves #N`, case-insensitive). Used to keep
// fresh-mode dispatch idempotent across sweeps: once a PR exists for an issue,
// subsequent sweeps must skip it until the PR merges (auto-closing the issue)
// or is itself closed.
//
// LOAD-BEARING: this is issue-level idempotency for Rule 1. It is orthogonal
// to the PR-level timestamp gate in Rules 2/3 — do not collapse them. After
// #194 drops the `agent-v2` opt-in filter from fetchOpenIssues, Rule 1's
// input set widens significantly; this filter becomes the only thing
// preventing duplicate fresh-mode dispatches per sweep.
function fetchIssuesUnderOpenPR(): Set<number> {
  const prs = ghJsonSafe<Array<{ state: string; body: string | null }>>(
    `repos/ora-ui/ora-ui/pulls --jq '[.[] | select(.state == "open") | {state, body}]'`,
    []
  );
  const closing = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)\b/gi;
  const taken = new Set<number>();
  for (const pr of prs) {
    if (!pr.body) continue;
    for (const m of pr.body.matchAll(closing)) {
      taken.add(parseInt(m[1]!, 10));
    }
  }
  return taken;
}

// ---------------------------------------------------------------------------
// Decision engine
// ---------------------------------------------------------------------------

interface Action {
  kind: 'spawn-implementer-fresh' | 'spawn-reviewer' | 'spawn-address-review' | 'skip';
  target: string; // issue number or PR number
  reason: string;
  detail?: string;
}

function computeDecisionTable(): { actions: Action[]; skipped: Action[] } {
  const actions: Action[] = [];
  const skipped: Action[] = [];

  // --- Rule 1: agent-ready + agent-v2 issues with no open PR → spawn implementer fresh ---
  const issues = fetchOpenIssues();
  const issuesUnderOpenPR = fetchIssuesUnderOpenPR();
  for (const issue of issues) {
    if (issue.labels.includes('needs-human')) {
      skipped.push({ kind: 'skip', target: `#${issue.number}`, reason: 'has needs-human label' });
      continue;
    }
    if (issuesUnderOpenPR.has(issue.number)) {
      skipped.push({
        kind: 'skip',
        target: `#${issue.number}`,
        reason: 'already has an open PR referencing it',
        detail: issue.title,
      });
      continue;
    }
    actions.push({
      kind: 'spawn-implementer-fresh',
      target: `#${issue.number}`,
      reason: 'agent-ready + agent-v2 issue with no open PR',
      detail: issue.title,
    });
  }

  // --- Rules 2–5: draft PRs authored by bot ---
  const prs = fetchDraftPRs();
  for (const pr of prs) {
    const labelSet = new Set(pr.labels);

    if (labelSet.has('needs-human')) {
      skipped.push({ kind: 'skip', target: `#${pr.number}`, reason: 'PR has needs-human label' });
      continue;
    }

    // Rule 5: flag rounds-cap PRs
    if (pr.reviewCount >= ROUNDS_CAP) {
      skipped.push({
        kind: 'skip',
        target: `#${pr.number}`,
        reason: `at rounds cap (${pr.reviewCount}/${ROUNDS_CAP} bot reviews)`,
        detail: pr.title,
      });
      continue;
    }

    if (labelSet.has('agent-review-pending')) {
      // Rule 2: spawn reviewer if last_commit > last_review
      const shouldSpawn =
        pr.lastCommit !== null && (pr.lastReview === null || pr.lastCommit > pr.lastReview);
      if (shouldSpawn) {
        actions.push({
          kind: 'spawn-reviewer',
          target: `#${pr.number}`,
          reason: 'agent-review-pending label present, new commits since last review',
          detail: pr.title,
        });
      } else {
        skipped.push({
          kind: 'skip',
          target: `#${pr.number}`,
          reason: 'agent-review-pending but no new commits since last review',
          detail: pr.title,
        });
      }
    } else if (labelSet.has('agent-impl-todo')) {
      // Rule 3: spawn address-review implementer if last_review > last_commit
      const shouldSpawn =
        pr.lastReview !== null && (pr.lastCommit === null || pr.lastReview > pr.lastCommit);
      if (shouldSpawn) {
        actions.push({
          kind: 'spawn-address-review',
          target: `#${pr.number}`,
          reason: 'agent-impl-todo label present, new review since last commit',
          detail: pr.title,
        });
      } else {
        skipped.push({
          kind: 'skip',
          target: `#${pr.number}`,
          reason: 'agent-impl-todo but no new review since last commit',
          detail: pr.title,
        });
      }
    } else {
      // PR by bot but none of the tracked labels — skip
      skipped.push({
        kind: 'skip',
        target: `#${pr.number}`,
        reason: 'bot-authored draft PR but no agent-review-pending or agent-impl-todo label',
        detail: pr.title,
      });
    }
  }

  return { actions, skipped };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function humanReadable(actions: Action[], skipped: Action[]): string {
  const lines: string[] = [];
  lines.push(`\n=== Sandcastle v2 ${EXECUTE ? 'Execute' : 'Dry-Run'} ===\n`);

  if (actions.length === 0 && skipped.length === 0) {
    lines.push('No items to process. Exiting.\n');
    return lines.join('\n');
  }

  const spawnVerb = EXECUTE ? 'Spawning' : 'Would spawn';
  const skipVerb = EXECUTE ? 'Skipping' : 'Would skip';

  if (actions.length > 0) {
    lines.push(`${spawnVerb}:\n`);
    lines.push('  TARGET     TYPE                    REASON');
    lines.push('  --------   ---------------------  ----------------------------------------');
    for (const a of actions) {
      lines.push(`  ${a.target.padEnd(9)} ${a.kind.replace(/-/g, ' ').padEnd(19)} ${a.reason}`);
    }
    lines.push('');
  } else {
    lines.push(`${spawnVerb}: none\n`);
  }

  if (skipped.length > 0) {
    lines.push(`${skipVerb}:\n`);
    lines.push('  TARGET     REASON');
    lines.push('  --------   ----------------------------------------');
    for (const s of skipped) {
      lines.push(`  ${s.target.padEnd(9)} ${s.reason}`);
    }
    lines.push('');
  } else {
    lines.push(`${skipVerb}: none\n`);
  }

  lines.push('Bot user: ' + BOT_LOGIN);
  lines.push('Rounds cap: ' + ROUNDS_CAP);
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const { actions, skipped } = computeDecisionTable();

console.log(humanReadable(actions, skipped));

// Write structured JSON log for Phase 0 exit criteria assertions.
try {
  mkdirSync('.sandcastle/logs', { recursive: true });
} catch {
  // dir exists
}
const logPath = EXECUTE ? '.sandcastle/logs/v2-execute.json' : '.sandcastle/logs/v2-dry-run.json';
writeFileSync(
  logPath,
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      botLogin: BOT_LOGIN,
      roundsCap: ROUNDS_CAP,
      actions,
      skipped,
      totalActions: actions.length,
      totalSkipped: skipped.length,
    },
    null,
    2
  ),
  'utf8'
);
console.log(`Structured log written to: ${logPath}`);

if (!EXECUTE) {
  // --dry-run / default path: no side effects beyond the JSON log written above.
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Execute mode (ADR-0003 Phase 1)
//
// Dispatch ONE qualifying action per invocation:
// - spawn-implementer-fresh: fresh-mode implementer
// - spawn-reviewer: PR reviewer (timestamp gate stubbed to always allow)
// - spawn-address-review: implementer responding to review (not yet wired)
// ---------------------------------------------------------------------------

await runExecute(actions);

async function runExecute(actions: Action[]): Promise<void> {
  const freshTargets = actions.filter((a) => a.kind === 'spawn-implementer-fresh');
  const reviewerTargets = actions.filter((a) => a.kind === 'spawn-reviewer');
  const stubTargets = actions.filter((a) => a.kind === 'spawn-address-review');

  for (const a of stubTargets) {
    console.log(`[skip] ${a.kind} for ${a.target} — not yet implemented in v2 execute path.`);
  }

  // Dispatch one reviewer if available (timestamp gate stubbed: always allow)
  const reviewerTarget = reviewerTargets[0];
  if (reviewerTarget) {
    const prNumber = parseInt(reviewerTarget.target.replace(/^#/, ''), 10);
    if (!Number.isFinite(prNumber)) {
      console.error(`Could not parse PR number from target "${reviewerTarget.target}".`);
      process.exit(1);
    }
    await dispatchReviewer(prNumber);
    process.exit(0);
  }

  const target = freshTargets[0];
  if (!target) {
    console.log('\nNo fresh-implementer work to dispatch. Exiting.');
    process.exit(0);
  }

  if (freshTargets.length > 1) {
    console.log(
      `Found ${freshTargets.length} fresh-implementer candidates; dispatching ${target.target} this invocation. Remaining will be picked up on the next sweep.`
    );
  }

  const issueNumber = parseInt(target.target.replace(/^#/, ''), 10);
  if (!Number.isFinite(issueNumber)) {
    console.error(`Could not parse issue number from target "${target.target}".`);
    process.exit(1);
  }

  await dispatchFreshImplementer(issueNumber);
}

async function dispatchReviewer(prNumber: number): Promise<void> {
  console.log(`\n=== Dispatching reviewer for PR #${prNumber} ===\n`);

  assertBotToken();

  // Fetch PR metadata for the prompt (project REST shape → camelCase via jq).
  const prData = ghJson<{
    number: number;
    title: string;
    body: string | null;
    headRefName: string;
    baseRefName: string;
    headSha: string;
  }>(
    `repos/ora-ui/ora-ui/pulls/${prNumber} --jq '{number, title, body, headRefName: .head.ref, baseRefName: .base.ref, headSha: .head.sha}'`
  );

  // Fetch existing review comments for context
  const existingReviews = ghJsonSafe<
    Array<{ id: number; body: string | null; state: string; submittedAt: string }>
  >(
    `repos/ora-ui/ora-ui/pulls/${prNumber}/reviews --jq '[.[] | {id, body, state, submittedAt: .submitted_at}]'`,
    []
  );

  const reviewThread =
    existingReviews.length > 0
      ? existingReviews
          .map((r) => `[${r.state}] ${r.submittedAt}: ${r.body ?? '(no body)'}`)
          .join('\n\n')
      : 'No previous reviews.';

  const SHARED = readFileSync('./.sandcastle/shared.md', 'utf8');
  const reviewerAgent = resolveAgent('SANDCASTLE_REVIEWER_AGENT', 'pi:anthropic/claude-sonnet-4-6');

  const branch = prData.headRefName;
  const logPath = `.sandcastle/logs/${branch.replace(/\//g, '-')}-reviewer.log`;

  const result = await sandcastle.run({
    hooks: { sandbox: { onSandboxReady: [{ command: 'pnpm install' }] } },
    copyToWorktree: ['node_modules'],
    sandbox: docker({ env: botGitEnv }),
    branchStrategy: { type: 'branch', branch, baseBranch: prData.baseRefName },
    name: 'reviewer',
    maxIterations: 5,
    agent: reviewerAgent,
    promptFile: './.sandcastle/review-prompt.md',
    // SOURCE_BRANCH/TARGET_BRANCH are sandcastle built-ins injected from
    // branchStrategy — passing them here errors with PromptError.
    promptArgs: {
      PR_NUMBER: String(prNumber),
      BRANCH: branch,
      PR_BODY: prData.body ?? '(no description)',
      REVIEW_THREAD: reviewThread,
      SHARED,
    },
    logging: { type: 'file', path: logPath },
  });

  // Log result for traceability
  console.log(`\nReviewer completed for PR #${prNumber}.`);
  console.log(`Log: ${logPath}`);

  // Check for escalation (needs-human)
  const escalateMatch = result.stdout.match(/<promise>agent:review:escalate<\/promise>/);
  if (escalateMatch) {
    console.log('Reviewer escalated. Exiting.');
    process.exit(0);
  }

  // Reviewer completes after taking action (approve/request-changes/escalate)
  process.exit(0);
}

async function dispatchFreshImplementer(issueNumber: number): Promise<void> {
  console.log(`\n=== Dispatching fresh implementer for issue #${issueNumber} ===\n`);

  assertBotToken();

  const timestamp = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
  const branch = `agent-wip/issue-${issueNumber}-${timestamp}`;

  const SHARED = readFileSync('./.sandcastle/shared.md', 'utf8');
  const implAgent = resolveAgent('SANDCASTLE_IMPL_AGENT', 'pi:anthropic/claude-sonnet-4-6');

  const logPath = `.sandcastle/logs/${branch.replace(/\//g, '-')}-impl-fresh.log`;

  const result = await sandcastle.run({
    hooks: { sandbox: { onSandboxReady: [{ command: 'pnpm install' }] } },
    copyToWorktree: ['node_modules'],
    sandbox: docker({ env: botGitEnv }),
    branchStrategy: { type: 'branch', branch, baseBranch: BASE_BRANCH },
    name: 'implementer-fresh',
    maxIterations: 15,
    agent: implAgent,
    promptFile: './.sandcastle/implement-fresh.md',
    promptArgs: { ISSUE_NUMBER: String(issueNumber), SHARED },
    logging: { type: 'file', path: logPath },
  });

  // Handle BLOCKED — post the reason as an issue comment, no PR.
  const blockedMatch = result.stdout.match(/<blocked-reason>([\s\S]*?)<\/blocked-reason>/);
  if (blockedMatch) {
    const reason = blockedMatch[1]!.trim();
    console.log(`\nImplementer reported BLOCKED on #${issueNumber}:\n${reason}\n`);
    try {
      execSync(
        `gh issue comment ${issueNumber} --body ${JSON.stringify(`**Sandcastle blocked:** ${reason}`)}`,
        { stdio: 'inherit' }
      );
    } catch {
      console.warn(`Could not post blocked comment to issue #${issueNumber}.`);
    }
    process.exit(0);
  }

  // Parse PR number emitted by the agent.
  const prMatch = result.stdout.match(/<pr-number>\s*(\d+)\s*<\/pr-number>/);
  if (!prMatch) {
    console.error(
      `\nImplementer did not emit <pr-number> and was not BLOCKED. Manual recovery required.\nLog: ${logPath}`
    );
    process.exit(1);
  }

  const prNumber = parseInt(prMatch[1]!, 10);
  console.log(`\nFresh implementer landed PR #${prNumber} for issue #${issueNumber}.`);
  console.log(`Log: ${logPath}`);
  process.exit(0);
}

function resolveAgent(envVar: string, fallback: string): AgentProvider {
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
        env: { CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN! },
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
}
