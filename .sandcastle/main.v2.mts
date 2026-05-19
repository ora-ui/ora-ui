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
    only: { type: 'string' },
  },
  strict: false,
});

type OnlyMode = 'impl' | 'review' | 'address-review' | 'all';

const ONLY_RAW: string = (cliArgs.only as string | undefined) ?? 'all';
const onlyMode: OnlyMode = (ONLY_RAW === 'impl' || ONLY_RAW === 'review' || ONLY_RAW === 'address-review'
  ? ONLY_RAW
  : 'all') as OnlyMode;

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
  body: string | null;
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

// Extracts the issue number from a PR body's closing keyword
// (`Closes #N`, `Fixes #N`, `Resolves #N`, case-insensitive). First match wins.
function extractClosingIssue(body: string | null): number | null {
  if (!body) return null;
  const m = body.match(/\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)\b/i);
  return m ? parseInt(m[1]!, 10) : null;
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

// Apply label/draft state mutations after a review outcome. The reviewer prompt
// only submits content (a comment-state review + inline comments); the orchestrator
// owns all state transitions so failures here surface as orchestrator errors
// rather than half-landed prompt-side gh sequences.
//
// Note: the bot cannot formally `--approve` its own PRs (GitHub blocks
// self-approval). The agent-approved label is the canonical hand-off signal —
// a human approves and merges from there. `reviewDecision` is not consulted.
//
// Idempotent: removing an already-absent label or adding an already-present one
// is a no-op in gh.
function applyReviewStateOps(
  prNumber: number,
  outcome: 'approved' | 'changes_requested' | 'escalate',
  issueNumber: number | null
): void {
  const ghEnv = {
    ...process.env,
    GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.SANDCASTLE_BOT_TOKEN ?? '',
  };
  const gh = (cmd: string): void => {
    execSync(cmd, { encoding: 'utf8', env: ghEnv, stdio: 'pipe' });
  };

  if (outcome === 'approved') {
    gh(`gh pr edit ${prNumber} --remove-label agent-review-pending --add-label agent-approved`);
    gh(`gh pr ready ${prNumber}`);
    return;
  }

  if (outcome === 'changes_requested') {
    gh(`gh pr edit ${prNumber} --remove-label agent-review-pending --add-label agent-impl-todo`);
    return;
  }

  // outcome === 'escalate'
  gh(`gh pr edit ${prNumber} --remove-label agent-review-pending --add-label needs-human`);
  if (issueNumber !== null) {
    gh(`gh issue edit ${issueNumber} --add-label needs-human`);
  }
}

// Rounds-cap escalation: identical to applyReviewStateOps('escalate') except
// the agent-* label currently on the PR might be either agent-review-pending
// or agent-impl-todo, depending on which phase the PR was in when it hit the
// cap. Strip whichever's there and add needs-human.
function escalateToHuman(
  prNumber: number,
  stripLabel: 'agent-review-pending' | 'agent-impl-todo' | undefined,
  issueNumber: number | null
): void {
  const ghEnv = {
    ...process.env,
    GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.SANDCASTLE_BOT_TOKEN ?? '',
  };
  const gh = (cmd: string): void => {
    execSync(cmd, { encoding: 'utf8', env: ghEnv, stdio: 'pipe' });
  };

  const removeFlag = stripLabel ? `--remove-label ${stripLabel}` : '';
  gh(`gh pr edit ${prNumber} ${removeFlag} --add-label needs-human`.replace(/\s+/g, ' '));
  if (issueNumber !== null) {
    gh(`gh issue edit ${issueNumber} --add-label needs-human`);
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
      body: string | null;
      state: string;
      isDraft: boolean;
      headRefName: string;
      baseRefName: string;
      author: { login: string };
      labels: Array<{ name: string }>;
      headSha: string;
    }>
  >(
    `repos/ora-ui/ora-ui/pulls --jq '[.[] | {number, title, body, state, isDraft: .draft, headRefName: .head.ref, baseRefName: .base.ref, author: {login: .user.login}, labels: [.labels[] | {name}], headSha: .head.sha}]'`
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
      body: pr.body,
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
  kind:
    | 'spawn-implementer-fresh'
    | 'spawn-reviewer'
    | 'spawn-address-review'
    | 'escalate-to-human'
    | 'skip';
  target: string; // issue number or PR number
  reason: string;
  detail?: string;
  // For escalate-to-human: linked issue number (from `Closes #N` in PR body),
  // and which agent-* label to strip when adding needs-human. Only populated
  // for that kind; ignored otherwise.
  issueNumber?: number | null;
  stripLabel?: 'agent-review-pending' | 'agent-impl-todo';
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

    // Rule 5: at rounds cap → escalate to human (add needs-human to PR + issue,
    // strip the agent-* label so subsequent sweeps fall through the needs-human
    // guard at the top of this loop). Idempotent: re-running adds labels that
    // are already present; gh treats that as a no-op.
    if (pr.reviewCount >= ROUNDS_CAP) {
      const stripLabel = labelSet.has('agent-review-pending')
        ? ('agent-review-pending' as const)
        : labelSet.has('agent-impl-todo')
          ? ('agent-impl-todo' as const)
          : null;
      actions.push({
        kind: 'escalate-to-human',
        target: `#${pr.number}`,
        reason: `rounds cap reached (${pr.reviewCount}/${ROUNDS_CAP} bot reviews) — adding needs-human`,
        detail: pr.title,
        issueNumber: extractClosingIssue(pr.body),
        stripLabel: stripLabel ?? undefined,
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
// - spawn-address-review: implementer responding to review feedback (highest priority)
// - spawn-reviewer: PR reviewer
// - spawn-implementer-fresh: fresh-mode implementer
// ---------------------------------------------------------------------------

await runExecute(actions);

async function runExecute(actions: Action[]): Promise<void> {
  // Escalations are cheap gh calls and idempotent — handle them all first
  // (does not consume the per-invocation docker dispatch budget).
  for (const a of actions.filter((x) => x.kind === 'escalate-to-human')) {
    const prNumber = parseInt(a.target.replace(/^#/, ''), 10);
    if (!Number.isFinite(prNumber)) {
      console.error(`Could not parse PR number from escalate target "${a.target}".`);
      continue;
    }
    try {
      escalateToHuman(prNumber, a.stripLabel, a.issueNumber ?? null);
      console.log(
        `Escalated PR #${prNumber} to human (rounds cap). needs-human added to PR${
          a.issueNumber ? ` and issue #${a.issueNumber}` : ''
        }.`
      );
    } catch (err) {
      console.error(`Escalation failed for PR #${prNumber}: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  const freshTargets = actions.filter((a) => a.kind === 'spawn-implementer-fresh');
  const reviewerTargets = actions.filter((a) => a.kind === 'spawn-reviewer');
  const addressReviewTargets = actions.filter((a) => a.kind === 'spawn-address-review');

  // Filter actions by --only mode when not "all"
  const allTargets = [...freshTargets, ...reviewerTargets, ...addressReviewTargets];
  const filteredTargets =
    onlyMode === 'all'
      ? allTargets
      : allTargets.filter((a) => {
          if (onlyMode === 'impl') return a.kind === 'spawn-implementer-fresh';
          if (onlyMode === 'review') return a.kind === 'spawn-reviewer';
          if (onlyMode === 'address-review') return a.kind === 'spawn-address-review';
          return false;
        });

  // Priority: address-review (responding to review feedback) > reviewer > fresh implementer
  const addressReviewTarget = filteredTargets.find((a) => a.kind === 'spawn-address-review');
  if (addressReviewTarget) {
    const prNumber = parseInt(addressReviewTarget.target.replace(/^#/, ''), 10);
    if (!Number.isFinite(prNumber)) {
      console.error(`Could not parse PR number from target "${addressReviewTarget.target}".`);
      process.exit(1);
    }
    await dispatchAddressReview(prNumber);
    process.exit(0);
  }

  const reviewerTarget = filteredTargets.find((a) => a.kind === 'spawn-reviewer');
  if (reviewerTarget) {
    const prNumber = parseInt(reviewerTarget.target.replace(/^#/, ''), 10);
    if (!Number.isFinite(prNumber)) {
      console.error(`Could not parse PR number from target "${reviewerTarget.target}".`);
      process.exit(1);
    }
    await dispatchReviewer(prNumber);
    process.exit(0);
  }

  const target = filteredTargets.find((a) => a.kind === 'spawn-implementer-fresh');
  if (!target) {
    console.log('\nNo agent dispatches needed this invocation. Exiting.');
    process.exit(0);
  }

  const filteredFresh = filteredTargets.filter((a) => a.kind === 'spawn-implementer-fresh');
  if (filteredFresh.length > 1) {
    console.log(
      `Found ${filteredFresh.length} fresh-implementer candidates; dispatching ${target.target} this invocation. Remaining will be picked up on the next sweep.`
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

  // Fetch existing inline comments (line-anchored) by the bot, grouped by file+line.
  // REVIEW_COMMENTS is only populated with bot-authored comments — human inline
  // comments are not part of the reviewer agent loop and would confuse it.
  const existingComments = ghJsonSafe<
    Array<{ path: string | null; line: number | null; body: string | null; user: { login: string }; createdAt: string }>
  >(
    `repos/ora-ui/ora-ui/pulls/${prNumber}/comments --jq '[.[] | select(.user.login == "${BOT_LOGIN}") | {path: .path, line: .line, body: .body, user: {login: .user.login}, createdAt: .created_at}]'`,
    []
  );

  // Group by path then line ascending; render as "path:line — body" lines.
  const sortedComments = existingComments
    .filter((c) => c.path !== null && c.line !== null)
    .sort((a, b) => (a.path! > b.path! ? 1 : a.path! < b.path! ? -1 : a.line! - b.line!));

  const reviewComments =
    sortedComments.length > 0
      ? sortedComments.map((c) => `**${c.path}:${c.line}** — ${c.body ?? ''}`).join('\n')
      : 'No inline comments yet.';

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
      REVIEW_COMMENTS: reviewComments,
      SHARED,
    },
    logging: { type: 'file', path: logPath },
  });

  const approveMatch = result.stdout.match(/<promise>agent:review:approve<\/promise>/);
  const requestChangesMatch = result.stdout.match(
    /<promise>agent:review:request-changes<\/promise>/
  );
  const escalateMatch = result.stdout.match(/<promise>agent:review:escalate<\/promise>/);

  const issueNumber = extractClosingIssue(prData.body);

  if (approveMatch || requestChangesMatch) {
    const expected = approveMatch ? 'approved' : 'changes_requested';
    try {
      applyReviewStateOps(prNumber, expected, issueNumber);
    } catch (err) {
      console.error(
        `\nState ops failed for PR #${prNumber} on ${expected} outcome: ${(err as Error).message}\n` +
          `Manual recovery required. Log: ${logPath}`
      );
      process.exit(1);
    }
  } else if (escalateMatch) {
    try {
      applyReviewStateOps(prNumber, 'escalate', issueNumber);
    } catch (err) {
      console.error(
        `\nState ops failed for PR #${prNumber} during escalate: ${(err as Error).message}\n` +
          `Manual recovery required. Log: ${logPath}`
      );
      process.exit(1);
    }
  } else {
    console.error(
      `\nReviewer for PR #${prNumber} produced no recognizable promise (approve, request-changes, or escalate).\n` +
        `Log: ${logPath}`
    );
    process.exit(1);
  }

  console.log(`\nReviewer completed for PR #${prNumber}.`);
  console.log(`Log: ${logPath}`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Address-review implementer
// ---------------------------------------------------------------------------

async function dispatchAddressReview(prNumber: number): Promise<void> {
  console.log(`\n=== Dispatching address-review implementer for PR #${prNumber} ===\n`);

  assertBotToken();

  const prData = ghJson<{
    number: number;
    title: string;
    body: string | null;
    headRefName: string;
    baseRefName: string;
    headSha: string;
  }>(
    `repos/ora-ui/ora-ui/pulls/${prNumber} --jq '{number, title, body, headRefName, baseRefName, headSha}'`
  );

  // Falls back to the PR number itself — not ideal but avoids leaving a blank.
  const closingIssue = extractClosingIssue(prData.body);
  const issueRef = closingIssue !== null ? String(closingIssue) : String(prNumber);

  const SHARED = readFileSync('./.sandcastle/shared.md', 'utf8');
  const implAgent = resolveAgent('SANDCASTLE_IMPL_AGENT', 'pi:anthropic/claude-sonnet-4-6');

  const branch = prData.headRefName;
  const logPath = `.sandcastle/logs/${branch.replace(/\//g, '-')}-impl-address-review.log`;

  const result = await sandcastle.run({
    hooks: { sandbox: { onSandboxReady: [{ command: 'pnpm install' }] } },
    copyToWorktree: ['node_modules'],
    sandbox: docker({ env: botGitEnv }),
    branchStrategy: { type: 'branch', branch, baseBranch: prData.baseRefName },
    name: 'implementer-address-review',
    maxIterations: 10,
    agent: implAgent,
    promptFile: './.sandcastle/implement-address-review.md',
    promptArgs: { PR_NUMBER: String(prNumber), ISSUE_REF: issueRef, SHARED },
    logging: { type: 'file', path: logPath },
  });

  // Handle BLOCKED — post the reason as a PR comment, no commits.
  const blockedMatch = result.stdout.match(/<blocked-reason>([\s\S]*?)<\/blocked-reason>/);
  if (blockedMatch) {
    const reason = blockedMatch[1]!.trim();
    console.log(`\nAddress-review reported BLOCKED on PR #${prNumber}:\n${reason}\n`);
    try {
      execSync(
        `gh api repos/ora-ui/ora-ui/issues/${prNumber}/comments ` +
          `--method POST --field body=${JSON.stringify(`**Sandcastle blocked:** ${reason}`)}`,
        { stdio: 'inherit' }
      );
    } catch {
      console.warn(`Could not post blocked comment to PR #${prNumber}.`);
    }
    process.exit(0);
  }

  console.log(`\nAddress-review completed for PR #${prNumber}.`);
  console.log(`Log: ${logPath}`);
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
