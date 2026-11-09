#!/usr/bin/env bash
# Runs the Seedfellow API with no Docker and no database server: the data lives in the SQLite
# file database/database.sqlite (git-ignored), and the API answers on http://localhost:8080.
# Needs PHP 8.3 or newer with the SQLite extension, and Composer. Stop it with Ctrl+C. Run it again and it starts from the same
# data; delete database/database.sqlite to start over from the seed data.
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v php >/dev/null || ! command -v composer >/dev/null; then
  if [ -n "${SEEDFELLOW_IN_NIX:-}" ] || ! command -v nix >/dev/null; then
    echo "Seedfellow needs PHP 8.3 or newer and Composer, and found neither on this machine." >&2
    echo "Install them (php.net, getcomposer.org), then run this script again." >&2
    exit 1
  fi
  exec env SEEDFELLOW_IN_NIX=1 nix --extra-experimental-features "nix-command flakes" \
    shell nixpkgs#php85 nixpkgs#php85Packages.composer --command "$0" "$@"
fi

php -r 'exit(extension_loaded("pdo_sqlite") ? 0 : 1);' || {
  echo "This PHP has no SQLite extension (pdo_sqlite). Enable it in php.ini, then run this again." >&2
  exit 1
}

[ -f vendor/autoload.php ] || composer install --no-interaction --prefer-dist
[ -f .env ] || cp .env.example .env
# A class checkout may track .env in git, and a script should not rewrite a tracked file. With no key in
# it, this run takes a fresh one from the environment instead; signed-in sessions end when it restarts.
grep -q '^APP_KEY=.' .env || export APP_KEY="$(php artisan key:generate --show)"

# These win over .env, which is written for Docker (DB_HOST=db and a PostgreSQL user).
export DB_CONNECTION=sqlite DB_DATABASE="$PWD/database/database.sqlite"

if [ ! -f database/database.sqlite ]; then
  touch database/database.sqlite
  # An empty file left by a failed run would look like a finished database next time.
  php artisan migrate --seed --force || { rm -f database/database.sqlite; exit 1; }
fi

echo "Seedfellow API on http://localhost:8080 (Ctrl+C to stop)"
exec php -S 127.0.0.1:8080 -t public public/index.php
