#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
pg_bin="/opt/homebrew/opt/postgresql@17/bin"

if [[ ! -x "$pg_bin/postgres" ]]; then
  echo "PostgreSQL runtime not found at $pg_bin." >&2
  echo "Install it with: brew install postgresql@17" >&2
  exit 1
fi

tmp_root="$(mktemp -d /private/tmp/daily-commit-pg.XXXXXX)"
data_dir="$tmp_root/data"
socket_dir="$tmp_root/socket"
log_file="$tmp_root/postgres.log"
port="55432"

cleanup() {
  if [[ -f "$data_dir/postmaster.pid" ]]; then
    "$pg_bin/pg_ctl" -D "$data_dir" -m fast stop >/dev/null
  fi

  rm -rf "$tmp_root"
}

trap cleanup EXIT

mkdir -p "$data_dir" "$socket_dir"

"$pg_bin/initdb" -D "$data_dir" >/dev/null
"$pg_bin/pg_ctl" \
  -D "$data_dir" \
  -l "$log_file" \
  -o "-k $socket_dir -p $port -c listen_addresses='' -c shared_memory_type=mmap -c dynamic_shared_memory_type=posix" \
  -w start >/dev/null

psql_args=(
  -v
  ON_ERROR_STOP=1
  -h
  "$socket_dir"
  -p
  "$port"
  -U
  "$USER"
  -d
  postgres
)

echo "[1/4] Bootstrapping local Supabase-compatible roles and auth schema"
"$pg_bin/psql" "${psql_args[@]}" -f "$repo_root/supabase/validation/local-bootstrap.sql"

echo "[2/4] Applying persistence foundation migration"
"$pg_bin/psql" "${psql_args[@]}" -f "$repo_root/supabase/migrations/20260630160000_persistence_foundation.sql"
"$pg_bin/psql" "${psql_args[@]}" -f "$repo_root/supabase/validation/grant-local-roles.sql"

echo "[3/4] Running executable RLS validation checks"
"$pg_bin/psql" "${psql_args[@]}" -f "$repo_root/supabase/validation/rls-checks.sql"

echo "[4/4] Verifying service-role credentials stay out of client/browser code"
node "$repo_root/scripts/validate-service-role-boundary.mjs"

echo "Persistence validation succeeded."
