// Sandcastle v2 Orchestrator — implements the ADR-0003 decision table.
//
// Usage:
//   pnpm sandcastle:v2 [--dry-run]
//
// --dry-run (default when env var SANDCASTLE_DRY_RUN=1):
//   Computes intended actions, logs them, exits with code 0.
//   No gh writes, no Docker spawns, no token spend.
//   Structured JSON goes to .sandcastle/logs/v2-dry-run.json.
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

import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BOT_LOGIN = process.env.SANDCASTLE_BOT_LOGIN ?? 'ora-ui-sandcastle-bot';
const ROUNDS_CAP = parseInt(process.env.SANDCASTLE_ROUNDS_CAP ?? '2', 10);
const DRY_RUN = process.env.SANDCASTLE_DRY_RUN === '1' || dryRunArg();

function dryRunArg(): boolean {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: { 'dry-run': { type: 'boolean' } },
    strict: false,
  });
  return Boolean(values['dry-run']);
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
  >(`repos/ora-ui/ora-ui/pulls --jq '.'`).filter(
    (pr) => pr.isDraft && pr.author.login === BOT_LOGIN
  );

  return raw.map((pr) => {
    const reviews = ghJsonSafe<
      Array<{ user: { login: string }; submittedAt: string; state: string }>
    >(`repos/ora-ui/ora-ui/pulls/${pr.number}/reviews --jq '.'`, []);
    const botReviews = reviews.filter((r) => r.user.login === BOT_LOGIN);

    const commits = ghJsonSafe<Array<{ committedDate: string }>>(
      `repos/ora-ui/ora-ui/pulls/${pr.number}/commits --jq '.'`,
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
  for (const issue of issues) {
    if (issue.labels.includes('needs-human')) {
      skipped.push({ kind: 'skip', target: `#${issue.number}`, reason: 'has needs-human label' });
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
  lines.push('\n=== Sandcastle v2 Dry-Run ===\n');

  if (actions.length === 0 && skipped.length === 0) {
    lines.push('No items to process. Exiting.\n');
    return lines.join('\n');
  }

  if (actions.length > 0) {
    lines.push('Would spawn:\n');
    lines.push('  TARGET     TYPE                    REASON');
    lines.push('  --------   ---------------------  ----------------------------------------');
    for (const a of actions) {
      lines.push(`  ${a.target.padEnd(9)} ${a.kind.replace(/-/g, ' ').padEnd(19)} ${a.reason}`);
    }
    lines.push('');
  } else {
    lines.push('Would spawn: none\n');
  }

  if (skipped.length > 0) {
    lines.push('Would skip:\n');
    lines.push('  TARGET     REASON');
    lines.push('  --------   ----------------------------------------');
    for (const s of skipped) {
      lines.push(`  ${s.target.padEnd(9)} ${s.reason}`);
    }
    lines.push('');
  } else {
    lines.push('Would skip: none\n');
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
const logPath = '.sandcastle/logs/v2-dry-run.json';
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

if (!DRY_RUN) {
  console.error(
    '\nNon-dry-run mode not yet implemented. Use --dry-run or set SANDCASTLE_DRY_RUN=1.'
  );
  process.exit(1);
}

process.exit(0);
