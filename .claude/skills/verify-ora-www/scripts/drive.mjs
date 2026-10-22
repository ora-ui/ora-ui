#!/usr/bin/env node
// Run one journey against the verify server and write evidence.
// Usage: drive.mjs <journey-name | path/to/journey.mjs> [--out <dir>] [--headed] [--viewport 1440x900]
//
// A journey is an ES module: export default async ({ page, context, base, step, shot, aria, check, expect }) => {}
//   step(label, fn)  runs fn, records pass/fail in steps.json; a failure stops the journey
//   shot(name)       viewport screenshot -> NN-name.png
//   aria(name, loc)  ARIA snapshot of loc (default body) -> NN-name.aria.yml
//   check(cond, msg) records an assertion; throws inside step() when false
//   expect           @playwright/test expect (auto-waiting locator assertions)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = execSync('git rev-parse --show-toplevel', { cwd: skillDir }).toString().trim();
const www = path.join(root, 'apps/www');
const state = path.join(www, '.verify');
const { chromium, expect } = createRequire(path.join(www, 'package.json'))('@playwright/test');

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const headed = args.includes('--headed') && args.splice(args.indexOf('--headed'), 1);
const [vw, vh] = (opt('--viewport') ?? '1440x900').split('x').map(Number);
const outArg = opt('--out');
const journeyArg = args[0];
if (!journeyArg) {
  console.error('usage: drive.mjs <journey> [--out dir] [--headed] [--viewport WxH]');
  console.error('journeys:', fs.readdirSync(path.join(skillDir, 'journeys')).join(' '));
  process.exit(2);
}
const journeyPath = fs.existsSync(journeyArg)
  ? path.resolve(journeyArg)
  : path.join(skillDir, 'journeys', `${journeyArg.replace(/\.mjs$/, '')}.mjs`);
const journeyName = path.basename(journeyPath, '.mjs');

const portFile = path.join(state, 'port');
if (!fs.existsSync(portFile)) {
  console.error('drive: no verify server (.verify/port missing). Run scripts/launch.sh first.');
  process.exit(2);
}
const base = `http://localhost:${fs.readFileSync(portFile, 'utf8').trim()}`;
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const out = path.resolve(outArg ?? path.join(state, 'evidence', `${stamp}-${journeyName}`));
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: !headed });
const context = await browser.newContext({ baseURL: base, viewport: { width: vw, height: vh } });
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
const page = await context.newPage();

const steps = [];
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => pageErrors.push(String(e)));
page.on('response', (r) => {
  if (r.status() >= 400 && r.url().startsWith(base))
    failedRequests.push(`${r.status()} ${r.url()}`);
});

let n = 0;
const file = (name, ext) => path.join(out, `${String(++n).padStart(2, '0')}-${name}.${ext}`);
const shot = async (name) => {
  const f = file(name, 'png');
  await page.screenshot({ path: f });
  return f;
};
const aria = async (name, locator = page.locator('body')) => {
  const f = file(name, 'aria.yml');
  fs.writeFileSync(f, await locator.ariaSnapshot());
  return f;
};
let current;
const check = (cond, msg) => {
  current?.checks.push({ ok: !!cond, msg });
  if (!cond) throw new Error(`check failed: ${msg}`);
};
const step = async (label, fn) => {
  current = { label, checks: [], url: null, ok: false };
  steps.push(current);
  const t = Date.now();
  try {
    await fn();
    current.ok = true;
  } finally {
    current.url = page.url();
    current.ms = Date.now() - t;
    console.log(`${current.ok ? 'PASS' : 'FAIL'}  ${label}  (${current.url})`);
  }
};

let error;
try {
  const { default: journey } = await import(pathToFileURL(journeyPath).href);
  await journey({ page, context, base, step, shot, aria, check, expect });
} catch (e) {
  error = e;
  if (current) current.error = String(e?.message ?? e);
  await shot('failure').catch(() => {});
  console.error(String(e?.stack ?? e));
}
await browser.close();

const summary = {
  journey: journeyName,
  base,
  commit: execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(),
  viewport: `${vw}x${vh}`,
  ok: !error && pageErrors.length === 0,
  steps,
  pageErrors,
  consoleErrors,
  failedRequests,
};
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(`\n${summary.ok ? 'JOURNEY PASSED' : 'JOURNEY FAILED'}: ${journeyName}`);
if (pageErrors.length) console.log(`pageErrors: ${pageErrors.length} (see summary.json)`);
if (consoleErrors.length) console.log(`consoleErrors: ${consoleErrors.length} (see summary.json)`);
console.log(`evidence: ${out}`);
process.exit(summary.ok ? 0 : 1);
