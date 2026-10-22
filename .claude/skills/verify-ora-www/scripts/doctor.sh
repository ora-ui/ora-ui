#!/usr/bin/env bash
# Read-only health check: is the verify instance worth driving? Exit 0 = yes.
# Usage: doctor.sh
set -uo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
WWW="$ROOT/apps/www"
STATE="$WWW/.verify"
fail=0
ok() { echo "  ok   $*"; }
bad() { echo "  FAIL $*"; fail=1; }

echo "doctor: $WWW"
PID="$(cat "$STATE/server.pid" 2>/dev/null || true)"
PORT="$(cat "$STATE/port" 2>/dev/null || true)"

if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then ok "verify server process $PID alive"
else bad "no live verify server (run launch.sh)"; fi

if [[ -n "$PORT" ]]; then
  owner="$(lsof -nP -t -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -1)"
  owner_pgid="$(ps -o pgid= -p "$owner" 2>/dev/null | tr -d ' ')"
  if [[ -n "$owner" && "$owner_pgid" == "$PID" ]]; then ok "port $PORT owned by our process group (listener $owner)"
  else bad "port $PORT not owned by our process group (listener: ${owner:-none})"; fi

  BASE="http://localhost:$PORT"
  html="$(curl -s --max-time 60 "$BASE/playground/button")"
  if grep -q "<title>Ora UI</title>" <<<"$html"; then ok "GET /playground/button serves Ora UI"
  else bad "GET /playground/button did not return the Ora UI page"; fi
  hits="$(curl -s --max-time 60 "$BASE/api/search?query=button" | grep -o '"url"' | wc -l | tr -d ' ')"
  if [[ "$hits" -gt 0 ]]; then ok "GET /api/search?query=button -> $hits results"
  else bad "search API returned no results for 'button'"; fi
fi

ver="$(grep -ao 'Next.js [0-9][0-9.]*' "$STATE/server.log" 2>/dev/null | head -1)"
[[ -n "$ver" ]] && ok "$ver (from server.log)"
ok "code: $(git -C "$ROOT" rev-parse --short HEAD) on $(git -C "$ROOT" branch --show-current), $(git -C "$ROOT" status --porcelain | wc -l | tr -d ' ') uncommitted paths (served live by next dev)"

if (cd "$WWW" && pnpm -s exec tsx scripts/gen-registry.cli.ts --check >/dev/null 2>&1); then ok "docs preview registry in sync"
else echo "  warn docs preview registry drifted: new docs examples may render 'Preview not found'. Fix: pnpm -C apps/www gen:registry"; fi

others="$(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk '/next-ser|node/ {print $9}' | grep -v ":${PORT:-x}\$" | sort -u | tr '\n' ' ')"
[[ -n "$others" ]] && echo "  info other node listeners (not ours, never drive them): $others"

exit $fail
