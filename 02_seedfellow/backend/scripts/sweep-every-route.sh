#!/usr/bin/env bash
#
# Sends one request to every route `php artisan route:list` publishes, and to every
# refusal each one can answer with, printing the status and the body of each.
#
# Bruno covers the happy path with assertions; this exists so the whole surface is
# enumerated from the routing table rather than sampled.
#
# Run it against a freshly seeded dev stack:
#   docker compose exec php php artisan migrate:fresh --seed
#   scripts/sweep-every-route.sh
set -u

HERE=$(cd "$(dirname "$0")" && pwd)
FIXTURE=${FIXTURE:-$HERE/../bruno/seed-photo.png}
TEXTFIXTURE=${TEXTFIXTURE:-$HERE/not-a-photo.txt}

BASE=http://localhost:8080
ORIGIN=http://localhost:3000
JAR=$(mktemp)
PASS=0
FAIL=0

req() { # [WITHOUT_XSRF=1] req NAME EXPECTED METHOD PATH [curl args...]
  local name=$1 expected=$2 method=$3 path=$4; shift 4
  local out code
  # Every request carries the CSRF token unless the caller asks for one without it.
  if [ "${WITHOUT_XSRF:-}" != 1 ]; then set -- -H "X-XSRF-TOKEN: $(xsrf)" "$@"; fi
  : > /tmp/body.$$ # a 304 or 204 writes no body, so empty the file rather than show the last one
  out=$(curl -s -o /tmp/body.$$ -w '%{http_code}' -X "$method" "$BASE$path" \
    -H "Accept: application/json" -H "Origin: $ORIGIN" \
    -b "$JAR" -c "$JAR" \
    "$@")
  code=$out
  if [ "$code" = "$expected" ]; then PASS=$((PASS+1)); printf 'OK   %-3s %-46s' "$code" "$name";
  else FAIL=$((FAIL+1)); printf 'FAIL %-3s (want %s) %-32s' "$code" "$expected" "$name"; fi
  head -c 260 /tmp/body.$$; echo
  BODY=$(cat /tmp/body.$$)
}

# The cookie jar holds XSRF-TOKEN URL-encoded; the header wants it decoded. PHP in the
# container does the decoding and reads the JSON ids below, so the host needs nothing but curl.
container_php() {
  docker compose -f "$HERE/../compose.yaml" exec -T php php "$@"
}

xsrf() {
  container_php -r 'echo urldecode($argv[1]);' "$(awk '/XSRF-TOKEN/ {print $7}' "$JAR" | tail -1)"
}

# The id of the row the last request created.
created_id() {
  echo "$BODY" | container_php -r 'echo json_decode(stream_get_contents(STDIN))->data->id;'
}

# The photo_version of the variety or note the last request answered with.
photo_version() {
  echo "$BODY" | container_php -r 'echo json_decode(stream_get_contents(STDIN))->data->photo_version;'
}

CREDIT='{"author":"Ermell","licence":"CC BY-SA 4.0","source_url":"https://commons.wikimedia.org/wiki/File:Dill_Bluete_7080848-PSD-2.jpg","modified":false}'

echo "== public =="
req "health /up"                200 GET /up
req "csrf cookie"               204 GET /sanctum/csrf-cookie
req "varieties index"           200 GET "/api/varieties"
req "varieties per_page=2"      200 GET "/api/varieties?per_page=2"
req "varieties per_page=999"    422 GET "/api/varieties?per_page=999"
req "varieties per_page=0"      422 GET "/api/varieties?per_page=0"
req "varieties kind=herb"       200 GET "/api/varieties?kind=herb"
req "varieties kind=bogus"      422 GET "/api/varieties?kind=bogus"
req "varieties sowing_month=5"  200 GET "/api/varieties?sowing_month=5"
req "varieties in_stock=false"  200 GET "/api/varieties?in_stock=false"
req "varieties q=Solanum"       200 GET "/api/varieties?q=Solanum"
req "variety show 1"            200 GET "/api/varieties/1"
VERSION=$(photo_version)
req "variety show 999"          404 GET "/api/varieties/999"
req "variety show abc"          404 GET "/api/varieties/abc"
req "variety photo"             200 GET "/api/varieties/1/photo"
req "variety photo versioned"   200 GET "/api/varieties/1/photo?v=$VERSION"
req "variety photo unchanged"   304 GET "/api/varieties/1/photo" -H "If-None-Match: \"$VERSION\""
req "harvest note photo (none)" 404 GET "/api/harvest-notes/1/photo"
req "unknown route"             404 GET "/api/widgets"
req "user unauthenticated"      401 GET "/api/user"
req "borrowings unauthenticated" 401 GET "/api/borrowings"

ANA='"name":"Ana Keller","email":"ana@example.org"'
PASSWORDS='"password":"a row of runner beans","password_confirmation":"a row of runner beans"'

echo "== registration =="
WITHOUT_XSRF=1 req "register without csrf token" 419 POST /api/register -H 'Content-Type: application/json' -d "{$ANA,$PASSWORDS}"
req "register missing fields"   422 POST /api/register -H 'Content-Type: application/json' -d '{}'
req "register email taken"      422 POST /api/register -H 'Content-Type: application/json' -d "{\"name\":\"Ana Keller\",\"email\":\"Tomas@Example.org\",$PASSWORDS}"
req "register short password"   422 POST /api/register -H 'Content-Type: application/json' -d "{$ANA,\"password\":\"beans\",\"password_confirmation\":\"beans\"}"
req "register unconfirmed"      422 POST /api/register -H 'Content-Type: application/json' -d "{$ANA,\"password\":\"a row of runner beans\",\"password_confirmation\":\"a row of broad beans\"}"
req "register ana"              201 POST /api/register -H 'Content-Type: application/json' -d "{$ANA,$PASSWORDS,\"is_librarian\":true}"
req "user after registering"    200 GET /api/user
req "register while signed in"  403 POST /api/register -H 'Content-Type: application/json' -d "{\"name\":\"Someone Else\",\"email\":\"someone-else@example.org\",$PASSWORDS}"
req "logout after registering"  204 POST /api/logout

echo "== auth: member =="
req "login wrong password"      422 POST /api/login -H 'Content-Type: application/json' -d '{"email":"tomas@example.org","password":"nope"}'
req "login tomas"               200 POST /api/login -H 'Content-Type: application/json' -d '{"email":"tomas@example.org","password":"correct horse battery staple"}'
req "user"                      200 GET /api/user
req "borrowings index"          200 GET /api/borrowings
req "borrow Verte de Cambrai"   201 POST /api/borrowings -H 'Content-Type: application/json' -d '{"variety_id":9}'
NEW_BORROWING=$(created_id)
req "borrow last packet again"  409 POST /api/borrowings -H 'Content-Type: application/json' -d '{"variety_id":9}'
req "borrow missing variety"    422 POST /api/borrowings -H 'Content-Type: application/json' -d '{"variety_id":9999}'
req "return packet"             200 PATCH "/api/borrowings/$NEW_BORROWING"
req "return again"              409 PATCH "/api/borrowings/$NEW_BORROWING"
req "return someone else's"     403 PATCH "/api/borrowings/2"
req "harvest note"              201 POST "/api/borrowings/$NEW_BORROWING/harvest-note" -H 'Content-Type: application/json' -d '{"body":"Grew four plants on the balcony.","seeds_sown":10,"seeds_germinated":7}'
NEW_NOTE=$(created_id)
req "harvest note twice"        409 POST "/api/borrowings/$NEW_BORROWING/harvest-note" -H 'Content-Type: application/json' -d '{"body":"Again.","seeds_sown":10,"seeds_germinated":7}'
req "harvest note validation"   422 POST "/api/borrowings/1/harvest-note" -H 'Content-Type: application/json' -d '{"body":"x","seeds_sown":5,"seeds_germinated":9}'
req "note photo upload"         201 POST "/api/harvest-notes/$NEW_NOTE/photo" -F "photo=@$FIXTURE"
NOTE_VERSION=$(photo_version)
req "note photo fetch"          200 GET "/api/harvest-notes/$NEW_NOTE/photo"
req "note photo versioned"      200 GET "/api/harvest-notes/$NEW_NOTE/photo?v=$NOTE_VERSION"
req "note photo wrong type"     422 POST "/api/harvest-notes/$NEW_NOTE/photo" -F "photo=@$TEXTFIXTURE"
req "note photo on someone else's" 403 POST "/api/harvest-notes/2/photo" -F "photo=@$TEXTFIXTURE"
req "correct the note"          200 PATCH "/api/harvest-notes/$NEW_NOTE" -H 'Content-Type: application/json' -d '{"seeds_germinated":8}'
req "correct past what was sown" 422 PATCH "/api/harvest-notes/$NEW_NOTE" -H 'Content-Type: application/json' -d '{"seeds_germinated":11}'
req "correct someone else's"    403 PATCH "/api/harvest-notes/2" -H 'Content-Type: application/json' -d '{"body":"Mine now."}'
req "delete someone else's"     403 DELETE "/api/harvest-notes/2"
req "delete the note"           204 DELETE "/api/harvest-notes/$NEW_NOTE"
req "deleted note's photo"      404 GET "/api/harvest-notes/$NEW_NOTE/photo"
req "librarian route as member" 403 POST /api/varieties -H 'Content-Type: application/json' -d '{"name":"Test","species":"Test","kind":"herb","story":"x","sowing_months":[4]}'
req "variety photo as member"   403 POST "/api/varieties/1/photo" -F "photo=@$TEXTFIXTURE"
req "stale csrf token"          419 POST /api/borrowings -H 'Content-Type: application/json' -H 'X-XSRF-TOKEN: stale' -d '{"variety_id":1}'
req "logout"                    204 POST /api/logout

echo "== auth: librarian =="
req "csrf cookie"               204 GET /sanctum/csrf-cookie
req "login marit"               200 POST /api/login -H 'Content-Type: application/json' -d '{"email":"marit@example.org","password":"seeds-in-the-post"}'
req "create variety"            201 POST /api/varieties -H 'Content-Type: application/json' -d '{"name":"Zollinger Buschbohne","species":"Phaseolus vulgaris","kind":"vegetable","story":"A bush bean from the Valais.","sowing_months":[5,6]}'
NEW_VARIETY=$(created_id)
req "create variety with credit" 422 POST /api/varieties -H 'Content-Type: application/json' -d "{\"name\":\"Trockenbohne\",\"species\":\"Phaseolus vulgaris\",\"kind\":\"vegetable\",\"story\":\"x\",\"sowing_months\":[5],\"photo_credit\":$CREDIT}"
req "create variety duplicate"  422 POST /api/varieties -H 'Content-Type: application/json' -d '{"name":"Zollinger Buschbohne","species":"Phaseolus vulgaris","kind":"vegetable","story":"A bush bean.","sowing_months":[5]}'
req "accept seed into stock"    201 POST "/api/varieties/$NEW_VARIETY/packets" -H 'Content-Type: application/json' -d '{"count":4}'
req "packets count too high"    422 POST "/api/varieties/$NEW_VARIETY/packets" -H 'Content-Type: application/json' -d '{"count":500}'
req "update variety"            200 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d '{"story":"A bush bean kept in the Valais since the 1940s."}'
req "retire variety"            200 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d '{"retired":true}'
req "borrow retired variety"    409 POST /api/borrowings -H 'Content-Type: application/json' -d "{\"variety_id\":$NEW_VARIETY}"
req "unretire variety"          200 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d '{"retired":false}'
req "new variety has no photo"  404 GET "/api/varieties/$NEW_VARIETY/photo"
req "credit with no photo"      422 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d "{\"photo_credit\":$CREDIT}"
req "variety photo upload"      201 POST "/api/varieties/$NEW_VARIETY/photo" -F "photo=@$FIXTURE"
req "variety photo fetch"       200 GET "/api/varieties/$NEW_VARIETY/photo"
req "credit the photo"          200 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d "{\"photo_credit\":$CREDIT}"
req "credit with an http url"   422 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d '{"photo_credit":{"author":"a","licence":"CC0","source_url":"http://example.org/","modified":false}}'
req "clear the credit"          200 PATCH "/api/varieties/$NEW_VARIETY" -H 'Content-Type: application/json' -d '{"photo_credit":null}'
req "method not allowed"        405 DELETE "/api/varieties/$NEW_VARIETY"
req "logout"                    204 POST /api/logout

echo
echo "passed $PASS, failed $FAIL"
[ "$FAIL" -eq 0 ]
