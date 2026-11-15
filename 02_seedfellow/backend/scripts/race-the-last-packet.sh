#!/usr/bin/env bash
#
# Eight requests from one member reach for the same last packet at the same instant.
#
# The answer has to be one 201 and seven 409s, with one borrowing row on record.
#
# serve.sh runs PHP's built-in server, which handles one request at a time unless it is told
# otherwise, so against a plain ./serve.sh the eight requests arrive one after another and this
# only proves the answers. To make them overlap, start the API with
# PHP_CLI_SERVER_WORKERS=8 ./serve.sh. The row lock in BorrowingController::store only means
# something on PostgreSQL, where the production stack runs: SQLite locks the whole file.
#
# Run it against a freshly seeded API: delete database/database.sqlite, start ./serve.sh in
# one terminal, and run this in another one that has PHP (it reads the token out of the JSON).
#   scripts/race-the-last-packet.sh
set -u
BASE=http://localhost:8080

TOKEN=$(curl -s -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"email":"tomas@example.org","password":"correct horse battery staple"}' "$BASE/api/login" \
  | php -r 'echo json_decode(stream_get_contents(STDIN))->token;')
# Verte de Cambrai (id 9) has exactly one packet on the shelf.
for i in $(seq 1 8); do
  curl -s -o /dev/null -w '%{http_code}\n' -H "Accept: application/json" -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d '{"variety_id":9}' "$BASE/api/borrowings" &
done
wait
