#!/usr/bin/env bash
#
# Eight members reach for the same last packet at the same instant.
#
# The answer has to be one 201 and seven 409s, with one borrowing row on record.
# Anything else means the row lock in BorrowingController::store stopped working,
# which no sequential test can catch.
#
# Run it against a freshly seeded dev stack:
#   docker compose exec php php artisan migrate:fresh --seed
#   scripts/race-the-last-packet.sh
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:8080; ORIGIN=http://localhost:3000; JAR=$(mktemp)

# The cookie jar holds XSRF-TOKEN URL-encoded; the header wants it decoded.
# PHP in the container does the decoding, so the host needs nothing but curl.
xsrf() {
  docker compose -f "$HERE/../compose.yaml" exec -T php \
    php -r 'echo urldecode($argv[1]);' "$(awk '/XSRF-TOKEN/ {print $7}' "$JAR" | tail -1)"
}

curl -s -o /dev/null -c "$JAR" -H "Origin: $ORIGIN" "$BASE/sanctum/csrf-cookie"
TOKEN=$(xsrf)
curl -s -o /dev/null -b "$JAR" -c "$JAR" -H "Origin: $ORIGIN" -H "Accept: application/json" -H "Content-Type: application/json" -H "X-XSRF-TOKEN: $TOKEN" \
  -d '{"email":"tomas@example.org","password":"correct horse battery staple"}' "$BASE/api/login"
TOKEN=$(xsrf)
# Verte de Cambrai (id 9) has exactly one packet on the shelf.
for i in $(seq 1 8); do
  curl -s -o /dev/null -w '%{http_code}\n' -b "$JAR" -H "Origin: $ORIGIN" -H "Accept: application/json" \
    -H "Content-Type: application/json" -H "X-XSRF-TOKEN: $TOKEN" -d '{"variety_id":9}' "$BASE/api/borrowings" &
done
wait
