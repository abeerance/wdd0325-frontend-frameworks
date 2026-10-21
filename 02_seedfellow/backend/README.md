# Seedfellow backend

This finished backend accompanies `../web/`. The current frontend uses local sample data; API integration starts on night 15. See the [project README](../README.md) before running the setup below.

The Laravel side of Seedfellow, the neighbourhood seed library. It is two things at once. It is the finished state of the platform's Laravel course: every file here is what a student's own API looks like after the last lesson. And it is the fixed contract of the Next.js course, whose students clone it, run one command and build a frontend against it without changing it.

## Running it

Run these commands from `02_seedfellow/backend/`. Docker Desktop must be installed.

A classroom `.env` is included with a local database password. It is intentionally tracked for this exercise and applies only to the local Docker stack. `APP_KEY` starts empty; the first-setup command below creates a key for your copy. Do not reuse this configuration for a public deployment.

Docker Desktop must be running. From this `backend/` folder, install the PHP packages from the committed lockfile, then start the services and prepare the empty database:

```bash
docker compose run --rm --build php composer install --no-interaction --prefer-dist
docker compose up -d --build
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate --seed
```

Run these setup steps once for a new checkout. Composer runs inside the PHP container, so you do not need PHP or Composer installed on your laptop. After setup, start the existing database and application with `docker compose up -d`. Stop them with `docker compose down`; leave the database volume in place to keep your work.

The API answers on `http://localhost:8080`. `GET /up` reports the framework's own health.

## What it publishes

Public:

| Method | Path | What it does |
|---|---|---|
| GET | `/api/varieties` | The catalogue. `per_page` 1-50 (default 15), `kind`, `sowing_month`, `in_stock`, `q`. |
| GET | `/api/varieties/{id}` | One variety, its harvest notes and its germination rate. |
| GET | `/api/varieties/{id}/photo` | The variety photograph. Add `?v={photo_version}` to make it cacheable for a year. |
| GET | `/api/harvest-notes/{id}/photo` | A member's harvest photograph, the same way. |
| POST | `/api/register` | Makes a new member and signs them in. `201` with the member, unwrapped. `403` while signed in. |
| POST | `/api/login` | Signs in. Answers with the member, unwrapped. |
| POST | `/api/logout` | Ends the session. `204`. |

Signed in (`auth:sanctum`):

| Method | Path | What it does |
|---|---|---|
| GET | `/api/user` | The member holding this session. |
| GET | `/api/borrowings` | What this member has out, and what they gave back, each with its `harvest_note` or `null`. |
| POST | `/api/borrowings` | Borrows a packet of `variety_id`. `409` when the shelf is empty or the variety is retired. |
| PATCH | `/api/borrowings/{id}` | Returns the seed. Owner only. `409` if already returned. |
| POST | `/api/borrowings/{id}/harvest-note` | Writes the note. One per borrowing. |
| PATCH | `/api/harvest-notes/{id}` | Corrects the note. Author only. Any field may be left out. |
| DELETE | `/api/harvest-notes/{id}` | Deletes the note and its photograph. Author only. `204`. |
| POST | `/api/harvest-notes/{id}/photo` | Attaches a photograph to the note. Author only. `201` with the note. |

Librarians only, by policy, `403` otherwise:

| Method | Path | What it does |
|---|---|---|
| POST | `/api/varieties` | Adds a variety. |
| PATCH | `/api/varieties/{id}` | Edits one, retires it with `{"retired": true}`, or records its `photo_credit` (`null` clears it). |
| POST | `/api/varieties/{id}/photo` | Uploads the variety photograph. `201` with the variety. Clears the old `photo_credit`, which described the old picture. |
| POST | `/api/varieties/{id}/packets` | Accepts returned seed onto the shelf, `count` envelopes at a time. |

Answers follow the shapes the platform's Laravel course teaches: collections under `data` with `links` and `meta`, `422` with `message` plus `errors`, `409` on a packet that is gone or a variety that is retired, `419` on a stale CSRF token, `401`, `403`, and `429` when a rate limit runs out.

## What an answer carries

A variety: `id`, `name`, `species`, `kind`, `story`, `sowing_months`, `packets_available`, `retired`, `has_photo`, `photo_version`, `photo_credit`, and on `GET /api/varieties/{id}` also `germination_rate` and `harvest_notes`. A variety inside a borrowing carries `id`, `name`, `species`, `kind`, `has_photo`, `photo_version` and `photo_credit`.

A harvest note: `id`, `borrowing_id`, `body`, `seeds_sown`, `seeds_germinated`, `has_photo`, `photo_version`, `written_on`, and `grown_by` where the note is listed under its variety.

A borrowing: `id`, `packet_id`, `user_id`, `borrowed_on`, `due_on`, `returned_on`, `variety`, and `harvest_note`, which is the note or `null` while there is none.

No answer carries a storage path.

`photo_credit` is who took a variety's photograph and on what terms it may be shown. It is `null` when there is no credit on record:

```json
{
  "author": "Frank C. Müller",
  "licence": "CC BY-SA 4.0",
  "source_url": "https://commons.wikimedia.org/wiki/File:Tomate_Berner_Rose_01_(fcm).jpg",
  "modified": true
}
```

A librarian records it with `PATCH /api/varieties/{id}`. All four keys are required and no others are accepted. `source_url` must be `https`. A variety without a photograph refuses a credit with `422`, and so does `POST /api/varieties`, because a new variety has no photograph yet.

## Photographs and caching

`photo_version` is the first 16 hex characters of the SHA-256 of the photograph's bytes, or `null` without a photograph. Uploading a different picture changes it; uploading the same bytes again does not.

Ask for a photograph at its current version and the answer may be kept for a year:

```text
GET /api/varieties/1/photo?v=f2911967724b6584

Cache-Control: immutable, max-age=31536000, public
ETag: "f2911967724b6584"
```

Any other URL for it, with no `v` or an old one, must be checked every time. While the photograph is unchanged, that check is a `304` with no body:

```text
GET /api/varieties/1/photo

Cache-Control: no-cache, public
ETag: "f2911967724b6584"
```

A photograph answer never starts a session or sets a cookie, because a shared cache would hand that cookie to the next person.

## Rate limits

| Routes | Allowance | Counted by |
|---|---|---|
| Every `/api` route except the two photo `GET`s and `POST /api/register` | 60 a minute | the signed-in member, or the address when nobody is signed in |
| `GET` on either `/photo` route | 600 a minute | the address |
| `POST /api/register` | 10 a minute | the address |

Every `/api` answer carries `X-RateLimit-Limit` and `X-RateLimit-Remaining`, and a `429` also carries `Retry-After`. The counters live in the cache, so `php artisan cache:clear` resets them.

Registering has its own allowance because every registration that succeeds writes a member. Refused attempts count too, so a script cannot try address after address to learn which ones belong to members. Only a request without a valid CSRF token is not counted: it is turned away before the limiter sees it.

Counting members by account rather than address is what lets a frontend call the API from its own server: every member arrives from that one server's address, and each still gets their own 60. Visitors who are not signed in do share the server's address. The API does not read `X-Forwarded-For`, because it trusts no proxy: nginx is the only thing in front of php-fpm, and the address it passes on is the real caller.

## Registering and signing in

Sanctum's cookie session, the first-party path:

1. `GET /sanctum/csrf-cookie` sets `XSRF-TOKEN` and the session cookie.
2. `POST /api/register` with `name`, `email`, `password` and `password_confirmation`, or `POST /api/login` with `email` and `password`, sending `X-XSRF-TOKEN` and the cookies.
3. Both rotate the session, so read `XSRF-TOKEN` again afterwards.

Registering signs the new member in on the same session, exactly as a login would, and answers `201` with what `GET /api/user` answers from then on:

```json
{
  "id": 3,
  "name": "Ana Keller",
  "email": "ana@example.org",
  "is_librarian": false,
  "created_at": "2026-09-24T16:59:02.000000Z",
  "updated_at": "2026-09-24T16:59:02.000000Z"
}
```

- `name`: required, at most 255 characters, with the spaces around it trimmed.
- `email`: required, a valid address, at most 255 characters. It is stored in lower case, and login lowercases what it is sent too, so capitals never matter.
- `password`: required, at least 12 characters, and the same as `password_confirmation`. In production it must also not appear in a published breach, which is checked against `api.pwnedpasswords.com`.

A new account is always a plain member. `is_librarian` is ignored if a request sends it; only a librarian's seeder row has it.

| Answer | When | `message` |
|---|---|---|
| `201` | the member is made and signed in | none, the body is the member |
| `403` | the caller is already signed in | `You are already signed in. Log out before registering someone new.` |
| `419` | the CSRF token is missing or stale | `CSRF token mismatch.` |
| `422` | the email already belongs to a member, in any case | `That email already belongs to a member. Log in instead.` on `errors.email` |
| `422` | a field is missing, too long, or the password is short or unconfirmed | the first error, with every one under `errors` |
| `429` | the address has used its 10 for the minute | `Too Many Attempts.`, with `Retry-After` |
| `400` | the request came from an origin not allowed a session | `A registration needs a session, and this request was not given one. Send it from an allowed origin.` |

The taken-email answer does tell the caller that the address is a member's. A registration form cannot avoid that, because it has to say why it refused. The register allowance is what keeps anyone from asking about many addresses.

`SANCTUM_STATEFUL_DOMAINS` and `FRONTEND_URL` in `.env` decide which origin is allowed to hold a session. The defaults cover the API on `localhost:8080` and a frontend on `localhost:3000`.

## The seeded library

`migrate:fresh --seed` gives 28 varieties, 2 members, a shelf of packets, five borrowings and three harvest notes. Every row is written out, not generated, so ids and counts are the same in every copy and a script can quote them.

Each variety carries a photograph, copied out of `database/seeders/photos/` onto the API's disk under its own slug. Those files come from Wikimedia Commons; `database/seeders/photos/credits.md` names the author and licence of every one. The seeder copies each row into the variety's `photo_credit`, and a test checks all 28 against that file. Most of the licences require the attribution to be shown beside the picture, so the frontend has to show it.

| Member | Email | Password | Librarian |
|---|---|---|---|
| Marit Frei | `marit@example.org` | `seeds-in-the-post` | yes |
| Tomas Rieder | `tomas@example.org` | `correct horse battery staple` | no |

Four varieties hold no packets, so an empty state is reachable. Two hold exactly one, which is where two members borrowing at the same moment becomes a real conflict.

## Checking it

Tests run against PostgreSQL, not SQLite, because the app leans on `jsonb` sowing months, `ilike` search and a row lock on the last packet:

```bash
docker compose exec php php artisan test
```

The Bruno collection in `bruno/` walks the whole API and asserts on the seeded numbers, including registering Ana Keller as member 3, so it needs a freshly seeded database and an empty rate limiter, which lives in the cache:

```bash
docker compose exec php php artisan migrate:fresh --seed
docker compose exec php php artisan cache:clear
docker run --rm --network "container:$(docker compose ps --format '{{.Name}}' web)" \
  -v "$PWD/bruno":/app/bruno -w /app/bruno \
  node:24-alpine npx --yes @usebruno/cli@4.1.0 run . --env runner
```

The race a sequential test cannot see has its own script:

```bash
docker compose exec php php artisan migrate:fresh --seed
scripts/race-the-last-packet.sh
```

Eight parallel attempts on the one remaining packet: one `201`, seven `409`, one borrowing on record.

## Running it in production

The development stack mounts this folder into its containers. The production stack does the opposite: `Dockerfile.production` bakes the code into the image, with packages installed `--no-dev` and an optimised class map, OPcache on without timestamp checks, and every process running as a user that is not root. `compose.production.yaml` runs it as the project `seedfellow-production`, so its network is always `seedfellow-production_default`. nginx answers on port 8081, and the two stacks can run side by side.

Its settings come from `.env.production`, which Git and the image build both ignore. Production configuration is separate from the classroom `.env`. Supply an application key, matching `DB_PASSWORD` and `POSTGRES_PASSWORD` values, and the database and frontend addresses for that deployment before starting this stack.

`SANCTUM_STATEFUL_DOMAINS` and `FRONTEND_URL` in that file decide which frontend may sign in, as they do in `.env`.

Build it, start it, and fill the database. `--seed` belongs to the first release only, because the seeder expects empty tables; every later release runs `migrate --force` alone:

```bash
docker compose -f compose.production.yaml up -d --build
docker compose -f compose.production.yaml exec app php artisan migrate --seed --force
```

The app container builds its configuration, route and event caches from `.env.production` each time it starts, so a changed setting takes effect once the container is recreated with `up -d`. Uploaded and seeded photographs live in the `storage` volume and survive a rebuild. nginx reports healthy once `GET /up` answers through the whole chain:

```bash
docker compose -f compose.production.yaml ps
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8081/up
```

Stop it without deleting its database or photographs:

```bash
docker compose -f compose.production.yaml down
```
