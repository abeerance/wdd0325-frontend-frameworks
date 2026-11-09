#!/usr/bin/env bash
# Runs the Seedfellow API with no Docker: PHP and PostgreSQL come from Nix, the database
# lives in .pgdata (git-ignored), and the API answers on http://localhost:8080.
# Stop it with Ctrl+C. Run it again and it starts from the same data.
set -euo pipefail
cd "$(dirname "$0")"

# Re-run this script inside a shell that has PHP and PostgreSQL.
if [ -z "${SEEDFELLOW_IN_NIX:-}" ]; then
  exec env SEEDFELLOW_IN_NIX=1 nix --extra-experimental-features "nix-command flakes" \
    shell nixpkgs#php85 nixpkgs#php85Packages.composer nixpkgs#postgresql_18 \
    --command "$0" "$@"
fi

PGPORT=5433
PGDATA="$PWD/.pgdata"

[ -f .env ] || { cp .env.example .env; php artisan key:generate --force; }
[ -f vendor/autoload.php ] || composer install --no-interaction --prefer-dist

fresh=no
if [ ! -d "$PGDATA" ]; then
  initdb -D "$PGDATA" -U postgres --auth=trust >/dev/null
  fresh=yes
fi
pg_ctl -D "$PGDATA" -o "-p $PGPORT -c listen_addresses=127.0.0.1" -l "$PGDATA/server.log" -w start >/dev/null
trap 'pg_ctl -D "$PGDATA" -m fast stop >/dev/null' EXIT

# These win over .env, which is written for Docker (DB_HOST=db).
export DB_CONNECTION=pgsql DB_HOST=127.0.0.1 DB_PORT=$PGPORT DB_DATABASE=seedfellow \
  DB_USERNAME=seedfellow DB_PASSWORD=seedfellow

if [ "$fresh" = yes ]; then
  psql -h 127.0.0.1 -p $PGPORT -U postgres -q \
    -c "create user seedfellow password 'seedfellow'" \
    -c "create database seedfellow owner seedfellow"
  php artisan migrate --seed --force
fi

echo "Seedfellow API on http://localhost:8080 (Ctrl+C to stop)"
php -S 127.0.0.1:8080 -t public public/index.php
