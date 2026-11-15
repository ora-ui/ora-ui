#!/usr/bin/env bash
# Stop the verify server this skill started and remove scratch state. Evidence is kept.
# Usage: cleanup.sh
set -uo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
WWW="$ROOT/apps/www"
STATE="$WWW/.verify"
PID="$(cat "$STATE/server.pid" 2>/dev/null || true)"
PORT="$(cat "$STATE/port" 2>/dev/null || true)"

if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
  # launch.sh started the server as its own process group (pgid == pid); kill only that group.
  kill -TERM -- "-$PID" 2>/dev/null
  for _ in $(seq 1 10); do kill -0 "$PID" 2>/dev/null || break; sleep 1; done
  kill -0 "$PID" 2>/dev/null && kill -KILL -- "-$PID" 2>/dev/null
  echo "cleanup: stopped process group $PID"
else
  echo "cleanup: no live verify server"
fi
if [[ -n "$PORT" ]] && lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "cleanup: WARNING port $PORT still has a listener; it is not ours, left alone" >&2
fi

[[ -f "$STATE/next-env.d.ts.bak" ]] && mv "$STATE/next-env.d.ts.bak" "$WWW/next-env.d.ts"
if [[ -s "$STATE/server.log" ]]; then
  mv "$STATE/server.log" "$STATE/evidence/server-$(date +%Y%m%d-%H%M%S).log"
fi
rm -f "$STATE/server.pid" "$STATE/port" "$STATE/server.log"
rm -rf "$WWW/.next-verify"

echo "cleanup: evidence kept in $STATE/evidence"
ls -1t "$STATE/evidence" 2>/dev/null | head -5 | sed 's/^/  /'
