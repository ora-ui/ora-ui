#!/usr/bin/env bash
# Start an isolated Ora www dev server for verification.
# Usage: launch.sh [port]   (default 3117, or $VERIFY_PORT)
# Uses distDir .next-verify so it never collides with a `pnpm dev` you already run on :3000.
set -euo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
WWW="$ROOT/apps/www"
STATE="$WWW/.verify"
PORT="${1:-${VERIFY_PORT:-3117}}"
mkdir -p "$STATE/evidence"

if [[ -f "$STATE/server.pid" ]] && kill -0 "$(cat "$STATE/server.pid")" 2>/dev/null; then
  echo "launch: a verify server is already running (pid $(cat "$STATE/server.pid"), port $(cat "$STATE/port" 2>/dev/null))." >&2
  echo "launch: run doctor.sh to reuse it, or cleanup.sh to stop it." >&2
  exit 1
fi
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "launch: port $PORT is held by a process this skill did not start. Pick another: launch.sh <port>" >&2
  exit 1
fi

[[ -d "$WWW/node_modules/next" ]] || pnpm -C "$ROOT" install --frozen-lockfile

# next dev rewrites the gitignored next-env.d.ts to point at its distDir; cleanup.sh restores this copy.
[[ -f "$WWW/next-env.d.ts" ]] && cp "$WWW/next-env.d.ts" "$STATE/next-env.d.ts.bak"
echo "$PORT" > "$STATE/port"
: > "$STATE/server.log"

cd "$WWW"
set -m # own process group, so cleanup.sh can kill exactly this tree
NEXT_DIST_DIR=.next-verify nohup pnpm exec next dev -p "$PORT" > "$STATE/server.log" 2>&1 &
echo $! > "$STATE/server.pid"
set +m

BASE="http://localhost:$PORT"
for _ in $(seq 1 90); do
  if grep -q "⨯" "$STATE/server.log"; then
    echo "launch: next dev failed:" >&2; tail -20 "$STATE/server.log" >&2; exit 1
  fi
  grep -q "Ready in" "$STATE/server.log" && break
  sleep 1
done
grep -q "Ready in" "$STATE/server.log" || { echo "launch: no 'Ready in' after 90s" >&2; tail -20 "$STATE/server.log" >&2; exit 1; }

# "Ready" only means the server listens; routes compile on first hit. Warm the ones the journeys use.
for route in /playground/button /docs /docs/components/button "/api/search?query=button"; do
  code=000
  for _ in $(seq 1 60); do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 60 "$BASE$route" || true)
    [[ "$code" == 200 ]] && break
    sleep 1
  done
  [[ "$code" == 200 ]] || { echo "launch: $route returned $code" >&2; tail -20 "$STATE/server.log" >&2; exit 1; }
done

echo "launch: ready at $BASE (pid $(cat "$STATE/server.pid"), log $STATE/server.log)"
